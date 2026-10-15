/* Cloud4Tech — 404 parallax */
(function () {
    'use strict';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var layers = document.querySelectorAll('[data-depth]');
    var ticking = false;
    var mx = 0, my = 0;

    function apply() {
        layers.forEach(function (el) {
            var depth = parseFloat(el.getAttribute('data-depth')) || 0;
            el.style.transform = 'translate3d(' + (mx * depth) + 'px, ' + (my * depth) + 'px, 0)';
        });
        ticking = false;
    }

    window.addEventListener('mousemove', function (e) {
        // -1..1 a partir do centro da tela
        mx = (e.clientX / window.innerWidth - 0.5) * 2 * 24;
        my = (e.clientY / window.innerHeight - 0.5) * 2 * 16;
        if (!ticking) {
            requestAnimationFrame(apply);
            ticking = true;
        }
    }, { passive: true });

    // Mobile: deriva suave automática via device orientation, se disponível
    window.addEventListener('deviceorientation', function (e) {
        if (e.gamma === null) return;
        mx = Math.max(-24, Math.min(24, e.gamma));
        my = Math.max(-16, Math.min(16, (e.beta - 45) / 2));
        if (!ticking) {
            requestAnimationFrame(apply);
            ticking = true;
        }
    }, { passive: true });
})();
