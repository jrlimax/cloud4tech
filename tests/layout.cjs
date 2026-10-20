const assert = require('node:assert/strict');

const args = process.argv.slice(2);
function option(name) {
    const index = args.indexOf(name);
    assert.ok(index >= 0 && args[index + 1], `Required: ${name}`);
    return args[index + 1].replace(/\/$/, '');
}
const base = option('--base-url');
const cdp = option('--cdp');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const pending = new Map();
let socket;
let target;
let sequence = 0;

function send(method, params = {}) {
    const id = ++sequence;
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            pending.delete(id);
            reject(new Error(`CDP timeout: ${method}`));
        }, 15000);
        pending.set(id, { resolve, reject, timeout });
        socket.send(JSON.stringify({ id, method, params }));
    });
}
async function evaluate(expression) {
    const result = await send('Runtime.evaluate', {
        expression, awaitPromise: true, returnByValue: true
    });
    assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
    return result.result.value;
}

async function main() {
    target = await (await fetch(`${cdp}/json/new?about:blank`, { method: 'PUT' })).json();
    socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
        socket.addEventListener('open', resolve, { once: true });
        socket.addEventListener('error', reject, { once: true });
    });
    const errors = [];
    socket.addEventListener('message', event => {
        const message = JSON.parse(event.data);
        if (message.id && pending.has(message.id)) {
            const request = pending.get(message.id);
            clearTimeout(request.timeout);
            pending.delete(message.id);
            if (message.error) request.reject(new Error(JSON.stringify(message.error)));
            else request.resolve(message.result);
        } else if (message.method === 'Runtime.exceptionThrown') {
            errors.push(message.params.exceptionDetails);
        }
    });
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Network.enable');
    await send('Network.setCacheDisabled', { cacheDisabled: true });
    await send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });
    const routes = [
        '/', '/sobre', '/contato', '/ir-para-nuvem', '/migracao-azure', '/oracle-cloud',
        '/microsoft-365', '/intune', '/acronis', '/cloud-gerenciada', '/privacidade', '/test-missing-page'
    ];
    let layouts = 0;
    for (const route of routes) {
        const url = base + route + '?layout-test=1';
        await send('Page.navigate', { url });
        let ready = false;
        for (let attempt = 0; attempt < 100; attempt++) {
            await pause(50);
            ready = await evaluate(`location.href === ${JSON.stringify(url)} && document.readyState === 'complete'`);
            if (ready) break;
        }
        assert.ok(ready, `Navigation timed out: ${route}`);
        await evaluate(`Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2000))]).then(()=>true)`);
        for (const width of [320, 390, 640, 768, 1024, 1280, 1440, 1920]) {
            await send('Emulation.setDeviceMetricsOverride', {
                width, height: 900, deviceScaleFactor: 1, mobile: false
            });
            for (const theme of ['light', 'dark']) {
                await evaluate(`document.documentElement.setAttribute('data-theme',${JSON.stringify(theme)})`);
                const issues = await evaluate(`(async()=>{
                    await Promise.all([...document.querySelectorAll('.brand-symbol,.hero__falcon,.nf__falcon')].map(i=>i.decode()));
                    const bad=[];
                    if(document.documentElement.scrollWidth>innerWidth)bad.push('horizontal overflow');
                    for(const e of document.querySelectorAll('h1,h2,h3,p,.btn,.footer a,label,input,textarea,select,summary')){
                        if(e.closest('[aria-hidden="true"],.navbar__links:not(.open)')||e.closest('details:not([open])')&&!e.closest('summary'))continue;
                        const s=getComputedStyle(e),r=e.getBoundingClientRect();
                        if(s.display==='none'||s.visibility==='hidden'||!r.width||!r.height||s.position==='fixed')continue;
                        if(r.left < -2||r.right>innerWidth+2)bad.push('offscreen '+e.tagName);
                        if(e.clientWidth&&e.scrollWidth>e.clientWidth+2)bad.push('clipped '+e.tagName);
                    }
                    for(const e of document.querySelectorAll('.navbar__logo')){
                        const a=e.querySelector('.brand-symbol').getBoundingClientRect();
                        const b=e.querySelector('.brand-wordmark').getBoundingClientRect();
                        if(Math.abs(a.top+a.height/2-b.top-b.height/2)>2)bad.push('brand alignment');
                    }
                    return bad;
                })()`);
                assert.deepEqual(issues, [], `${route}, ${width}px, ${theme}`);
                layouts++;
            }
        }
    }
    assert.deepEqual(errors, []);
    console.log(`PASS: ${layouts} layouts, loaded brand images, aligned logos, no runtime exceptions.`);
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
}).finally(async () => {
    for (const request of pending.values()) clearTimeout(request.timeout);
    if (target) {
        try {
            await fetch(`${cdp}/json/close/${target.id}`);
        } catch (error) {
            console.error('Failed to close test browser tab:', error);
            process.exitCode = 1;
        }
    }
    if (socket) socket.close();
});
