const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const source = readFileSync(join(__dirname, '..', 'assets', 'js', 'main.js'), 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));

function element() {
    const classes = new Set();
    return {
        textContent: '', value: '', checked: false, disabled: false,
        handlers: {}, attrs: {},
        addEventListener(name, handler) { this.handlers[name] = handler; },
        setAttribute(name, value) { this.attrs[name] = value; },
        getAttribute(name) { return this.attrs[name]; },
        classList: {
            add(...values) { values.forEach(value => classes.add(value)); },
            remove(...values) { values.forEach(value => classes.delete(value)); },
            contains(value) { return classes.has(value); },
            toggle(value, enabled = !classes.has(value)) {
                if (enabled) classes.add(value); else classes.delete(value);
                return enabled;
            }
        }
    };
}

function setup(fetchImpl, options = {}) {
    const form = element();
    const status = element();
    const consent = element();
    consent.checked = true;
    const button = element();
    const label = element();
    label.textContent = 'Enviar';
    button.querySelector = () => label;
    const fields = new Map([
        ['name', 'Teste'], ['email', 'teste@example.com'],
        ['message', 'Mensagem preservada'], ['h-captcha-response', 'test-token']
    ]);
    const selectors = {
        '[name="botcheck"]': element(),
        '#field-consent': consent,
        'button[type="submit"]': button
    };
    form.querySelector = selector => selectors[selector] || null;
    form.querySelectorAll = () => [];
    form.resetCount = 0;
    form.reset = () => { form.resetCount++; };
    const anchor = element();
    anchor.attrs.href = '/#hero';
    const navLinks = element();
    navLinks.querySelectorAll = () => [anchor];
    let geometryReads = 0;
    const section = element();
    section.id = 'hero';
    Object.defineProperty(section, 'offsetTop', { get() { geometryReads++; return 0; } });
    Object.defineProperty(section, 'offsetHeight', { get() { geometryReads++; return 500; } });
    const reveal = element();
    reveal.getBoundingClientRect = () => ({ top: 0 });
    const observers = [];
    class Observer {
        constructor(callback, config) { this.callback = callback; this.config = config; this.targets = new Set(); observers.push(this); }
        observe(target) { this.targets.add(target); }
        unobserve(target) { this.targets.delete(target); }
        disconnect() { this.targets.clear(); }
    }
    const timers = new Map();
    let timerId = 0;
    const logs = [];
    const window = {
        innerHeight: 900, scrollY: 0, handlers: {},
        matchMedia: () => ({ matches: !!options.reducedMotion }),
        addEventListener(name, handler) { this.handlers[name] = handler; },
        location: { pathname: '/', hash: '' },
        hcaptcha: { reset() { if (options.captchaFailure) throw new Error('captcha failure'); } }
    };
    if (!options.noObservers) window.IntersectionObserver = Observer;
    const document = {
        getElementById: id => ({ contactForm: form, formStatus: status, navLinks })[id] || null,
        querySelectorAll: selector => ({ '[data-aos]': [reveal], 'section[id]': [section] })[selector] || [],
        documentElement: element()
    };
    const context = {
        window, document, IntersectionObserver: Observer, Set, AbortController,
        FormData: class extends Map { constructor() { super(fields); } },
        fetch: fetchImpl, console: { error: (...args) => logs.push(args) },
        setTimeout(callback, delay) { timers.set(++timerId, { callback, delay }); return timerId; },
        clearTimeout(id) { timers.delete(id); },
        requestAnimationFrame: callback => callback()
    };
    vm.runInNewContext(source, context);
    return {
        form, status, button, consent, fields, timers, logs, window,
        observers, reveal, section, anchor, geometryReads: () => geometryReads,
        submit: () => form.handlers.submit({ preventDefault() {} }),
        runTimer(delay) {
            const entry = [...timers].find(([, timer]) => timer.delay === delay);
            assert.ok(entry, `Missing ${delay}ms timer`);
            timers.delete(entry[0]);
            entry[1].callback();
        }
    };
}

test('success resets the form and clears the request timeout', async () => {
    const app = setup(async () => ({ ok: true, json: async () => ({ success: true }) }));
    app.submit();
    assert.equal(app.button.disabled, true);
    await flush();
    assert.equal(app.form.resetCount, 1);
    assert.match(app.status.textContent, /sucesso/);
    assert.equal([...app.timers.values()].some(timer => timer.delay === 20000), false);
    app.runTimer(3000);
    assert.equal(app.button.disabled, false);
});

test('timeout aborts the request, preserves input and warns about uncertain delivery', async () => {
    const app = setup((url, { signal }) => new Promise((resolve, reject) => {
        signal.addEventListener('abort', () => {
            const error = new Error('aborted');
            error.name = 'AbortError';
            reject(error);
        });
    }));
    app.submit();
    app.runTimer(20000);
    await flush();
    assert.match(app.status.textContent, /não foi possível confirmar/);
    assert.equal(app.form.resetCount, 0);
    assert.equal(app.fields.get('message'), 'Mensagem preservada');
    app.runTimer(3000);
    assert.equal(app.button.disabled, false);
});

test('invalid JSON produces an explicit error without resetting input', async () => {
    const app = setup(async () => ({ ok: false, json: async () => { throw new SyntaxError(); } }));
    app.submit();
    await flush();
    assert.match(app.status.textContent, /resposta inválida/);
    assert.equal(app.form.resetCount, 0);
    assert.equal(app.logs.length, 1);
});

test('timeout while reading the response is not mistaken for invalid JSON', async () => {
    const app = setup(async (url, { signal }) => ({
        ok: true,
        json: () => new Promise((resolve, reject) => {
            signal.addEventListener('abort', () => {
                const error = new Error('aborted body');
                error.name = 'AbortError';
                reject(error);
            });
        })
    }));
    app.submit();
    await flush();
    app.runTimer(20000);
    await flush();
    assert.match(app.status.textContent, /não foi possível confirmar/);
    assert.equal(app.form.resetCount, 0);
});

test('API rejection and network failure preserve input', async () => {
    for (const fetchImpl of [
        async () => ({ ok: false, json: async () => ({ message: 'Serviço indisponível' }) }),
        async () => { throw new Error('Falha de conexão'); }
    ]) {
        const app = setup(fetchImpl);
        app.submit();
        await flush();
        assert.match(app.status.textContent, /comercial@cloud4tech.com.br/);
        assert.equal(app.form.resetCount, 0);
        assert.equal(app.logs.length, 1);
    }
});

test('captcha reset failures are logged and shown to the visitor', async () => {
    const app = setup(async () => ({ ok: true, json: async () => ({ success: true }) }), { captchaFailure: true });
    app.submit();
    await flush();
    assert.match(app.status.textContent, /Não foi possível reiniciar/);
    assert.equal(app.logs.length, 1);
});

test('validation prevents sending incomplete, invalid, unacknowledged or unverified forms', () => {
    const app = setup(() => { throw new Error('Must not send'); });
    app.fields.set('name', '');
    app.submit();
    assert.match(app.status.textContent, /campos obrigatórios/);
    app.fields.set('name', 'Teste');
    app.fields.set('email', 'invalid');
    app.submit();
    assert.match(app.status.textContent, /e-mail válido/);
    app.fields.set('email', 'teste@example.com');
    app.consent.checked = false;
    app.submit();
    assert.match(app.status.textContent, /leitura/);
    app.consent.checked = true;
    app.fields.set('h-captcha-response', '');
    app.submit();
    assert.match(app.status.textContent, /verificação de segurança/);
});

test('observers reveal once and update navigation without scroll layout reads', () => {
    const app = setup();
    app.observers[0].callback([{ target: app.reveal, isIntersecting: true }]);
    assert.equal(app.reveal.classList.contains('visible'), true);
    assert.equal(app.observers[0].targets.has(app.reveal), false);
    app.observers[1].callback([{ target: app.section, isIntersecting: true }]);
    assert.equal(app.anchor.classList.contains('active'), true);
    app.window.handlers.scroll();
    assert.equal(app.geometryReads(), 0);
    app.observers[1].callback([{ target: app.section, isIntersecting: false }]);
    assert.equal(app.anchor.classList.contains('active'), false);
    app.window.handlers.resize();
    assert.equal(app.observers[1].targets.size, 0);
    assert.equal(app.observers[2].targets.has(app.section), true);
});

test('reduced motion reveals immediately; older browsers retain scroll fallback', () => {
    assert.equal(setup(undefined, { reducedMotion: true }).reveal.classList.contains('visible'), true);
    const app = setup(undefined, { noObservers: true });
    app.window.handlers.load();
    assert.equal(app.reveal.classList.contains('visible'), true);
    assert.equal(app.anchor.classList.contains('active'), true);
    assert.ok(app.geometryReads() > 0);
});

test('captcha theme update failures keep the widget reference and report the error', () => {
    const status = element();
    const logs = [];
    const window = {
        hcaptcha: {
            remove() { throw new Error('remove failed'); },
            render() { throw new Error('Must not render a duplicate widget'); }
        }
    };
    vm.runInNewContext(
        readFileSync(join(__dirname, '..', 'assets', 'js', 'hcaptcha-bootstrap.js'), 'utf8'),
        {
            window,
            document: { getElementById: id => id === 'formStatus' ? status : element() },
            console: { error: (...args) => logs.push(args) }
        }
    );
    window.c4tHCaptcha.widgetId = 7;
    window.renderC4tHCaptcha('light');
    assert.equal(window.c4tHCaptcha.widgetId, 7);
    assert.match(status.textContent, /Não foi possível atualizar/);
    assert.equal(logs.length, 1);
});
