window.c4tHCaptcha = { widgetId: null };

window.renderC4tHCaptcha = function (theme) {
    var c = document.getElementById('hcaptchaContainer');
    if (!c || !window.hcaptcha) return;
    if (window.c4tHCaptcha.widgetId !== null) {
        try { window.hcaptcha.remove(window.c4tHCaptcha.widgetId); } catch (e) {}
        window.c4tHCaptcha.widgetId = null;
    }
    window.c4tHCaptcha.widgetId = window.hcaptcha.render('hcaptchaContainer', {
        sitekey: c.getAttribute('data-sitekey'),
        theme: theme === 'light' ? 'light' : 'dark',
        size: 'normal'
    });
};

window.onHCaptchaLoad = function () {
    var t = document.documentElement.getAttribute('data-theme') || 'dark';
    window.renderC4tHCaptcha(t);
};
