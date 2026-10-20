window.c4tHCaptcha = { widgetId: null };

window.renderC4tHCaptcha = function (theme) {
    var c = document.getElementById('hcaptchaContainer');
    if (!c || !window.hcaptcha) return;
    if (window.c4tHCaptcha.widgetId !== null) {
        try {
            window.hcaptcha.remove(window.c4tHCaptcha.widgetId);
        } catch (error) {
            console.error('Cloud4Tech: falha ao atualizar a verificação de segurança.', error);
            var status = document.getElementById('formStatus');
            if (status) {
                status.textContent = 'Não foi possível atualizar a verificação de segurança. Guarde sua mensagem e recarregue a página antes de enviar.';
                status.className = 'form-status form-status--error';
            }
            return;
        }
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
