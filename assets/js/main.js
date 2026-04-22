/* ============================
   Cloud4Tech — Main JS
   ============================ */

(function () {
    'use strict';

    // --- Theme toggle (dark/light) ---
    // Theme is already set by inline script in <head> to avoid FOUC
    var themeToggle = document.getElementById('themeToggle');

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var current = document.documentElement.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('c4t-theme', next);
        });
    }

    // --- Smooth scroll without hash in URL ---
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href').slice(1);
            var target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                var offset = navbar ? navbar.offsetHeight + 8 : 70;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // --- DOM cache ---
    var navbar = document.getElementById('navbar');
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    var navAnchors = navLinks ? navLinks.querySelectorAll('a') : [];
    var aosElements = document.querySelectorAll('[data-aos]');
    var sections = document.querySelectorAll('section[id]');

    // --- Navbar scroll effect ---
    function handleNavScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }

    // --- Mobile menu toggle ---
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('open');
            navToggle.classList.toggle('active');
        });

        navAnchors.forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
            });
        });
    }

    // --- Scroll reveal (data-aos) ---
    function revealOnScroll() {
        var windowHeight = window.innerHeight;
        var pending = [];
        aosElements.forEach(function (el) {
            if (el.classList.contains('visible')) return;
            if (el.getBoundingClientRect().top < windowHeight - 80) {
                el.classList.add('visible');
            } else {
                pending.push(el);
            }
        });
        // Shrink list to only unrevealed elements
        aosElements = pending;
    }

    // --- Active link highlight (CSS class-based) ---
    function highlightNav() {
        var scrollPos = window.scrollY + 120;
        var activeId = '';

        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                activeId = section.id;
                break;
            }
        }

        navAnchors.forEach(function (a) {
            if (a.classList.contains('btn')) return;
            a.classList.toggle('active', a.getAttribute('href') === '#' + activeId);
        });
    }

    // --- Unified scroll handler with rAF throttle ---
    var scrollTicking = false;

    function onScroll() {
        if (!scrollTicking) {
            requestAnimationFrame(function () {
                handleNavScroll();
                if (aosElements.length) revealOnScroll();
                highlightNav();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // =============================================
    // LOGO ANIMATION: CLOUD4TECH → C4T
    // =============================================
    var logoLetters = document.getElementById('logoLetters');
    var logoFalcon = document.getElementById('logoFalcon');
    var letters = logoLetters ? logoLetters.querySelectorAll('.logo-anim__letter') : [];

    function runLogoAnimation() {
        if (!logoLetters) return;

        // Phase 1: Reveal letters one by one (staggered)
        letters.forEach(function (letter, i) {
            setTimeout(function () {
                letter.style.opacity = '1';
                letter.style.transform = 'translateY(0)';
            }, 150 + i * 100);
        });

        // After all letters revealed, show falcon
        var revealDone = 150 + letters.length * 100 + 400;

        setTimeout(function () {
            logoLetters.classList.add('phase-reveal');
            if (logoFalcon) logoFalcon.classList.add('visible');
        }, revealDone);

        // Phase 2: Collapse to C4T (after pause)
        setTimeout(function () {
            logoLetters.classList.add('phase-collapse');
            setTimeout(function () {
                logoLetters.classList.add('hover-ready');
            }, 900);
        }, revealDone + 2000);
    }

    // Start animation on load
    window.addEventListener('load', function () {
        revealOnScroll();
        setTimeout(runLogoAnimation, 300);
    });

    // --- Country selector dropdown ---
    var countrySelect = document.getElementById('countrySelect');
    var countryBtn = document.getElementById('countryBtn');
    var countryList = document.getElementById('countryList');
    var countryCodeInput = document.getElementById('countryCodeInput');
    var countryFlag = document.getElementById('countryFlag');
    var countryCodeSpan = document.getElementById('countryCode');

    if (countryBtn && countryList) {
        countryBtn.addEventListener('click', function () {
            countrySelect.classList.toggle('open');
        });

        countryList.querySelectorAll('li').forEach(function (li) {
            li.addEventListener('click', function () {
                var code = li.getAttribute('data-code');
                var flag = li.getAttribute('data-flag');
                countryCodeInput.value = code;
                countryFlag.src = 'https://flagcdn.com/w40/' + flag + '.png';
                countryCodeSpan.textContent = code;
                countrySelect.classList.remove('open');
            });
        });

        document.addEventListener('click', function (e) {
            if (!countrySelect.contains(e.target)) {
                countrySelect.classList.remove('open');
            }
        });
    }

    // --- Contact form (Formsubmit) ---
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        var phoneInput = contactForm.querySelector('.phone-number');
        if (phoneInput) {
            phoneInput.addEventListener('input', function () {
                var v = this.value.replace(/\D/g, '').slice(0, 11);
                if (v.length > 6) {
                    this.value = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
                } else if (v.length > 2) {
                    this.value = '(' + v.slice(0, 2) + ') ' + v.slice(2);
                } else if (v.length > 0) {
                    this.value = '(' + v;
                }
            });
        }

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var formData = new FormData(contactForm);
            var name = (formData.get('name') || '').toString().trim();
            var email = (formData.get('email') || '').toString().trim();
            var message = (formData.get('message') || '').toString().trim();

            if (!name || !email || !message) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Por favor, informe um e-mail válido.');
                return;
            }

            var cc = countryCodeInput ? countryCodeInput.value : '+55';
            var phone = (formData.get('phone') || '').toString().trim();
            var fullPhone = phone ? cc + ' ' + phone : '';

            var submitBtn = contactForm.querySelector('button[type="submit"]');
            var originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    access_key: '563eed27-3ff1-42a1-bff7-263b4ce677a1',
                    subject: 'Nova mensagem do site Cloud4Tech',
                    from_name: 'Cloud4Tech Site',
                    name: name,
                    email: email,
                    Telefone: fullPhone,
                    message: message
                })
            }).then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
            }).then(function (data) {
                if (data.success) {
                    submitBtn.textContent = 'Mensagem Enviada \u2713';
                    submitBtn.style.background = 'linear-gradient(135deg, #22D68F, #1AAF74)';
                    contactForm.reset();
                } else {
                    throw new Error('API error');
                }
            }).catch(function () {
                submitBtn.textContent = 'Erro ao enviar';
                submitBtn.style.background = 'linear-gradient(135deg, #e53e3e, #c53030)';
            }).finally(function () {
                setTimeout(function () {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }
})();
