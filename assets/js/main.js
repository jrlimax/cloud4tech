/* ============================
   Cloud4Tech — Main JS
   ============================ */

(function () {
    'use strict';

    // --- Theme toggle (dark/light) ---
    var themeToggle = document.getElementById('themeToggle');
    var savedTheme = localStorage.getItem('c4t-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var current = document.documentElement.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('c4t-theme', next);
        });
    }

    // --- Navbar scroll effect ---
    var navbar = document.getElementById('navbar');

    function handleNavScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // --- Mobile menu toggle ---
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', function () {
        navLinks.classList.toggle('open');
        navToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('open');
            navToggle.classList.remove('active');
        });
    });

    // --- Scroll reveal (data-aos) ---
    function revealOnScroll() {
        var elements = document.querySelectorAll('[data-aos]');
        var windowHeight = window.innerHeight;
        elements.forEach(function (el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < windowHeight - 80) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    window.addEventListener('load', revealOnScroll);

    // =============================================
    // LOGO ANIMATION: CLOUD4TECH → C4T
    // =============================================
    var logoLetters = document.getElementById('logoLetters');
    var logoFalcon = document.getElementById('logoFalcon');
    var heroScroll = document.getElementById('heroScroll');
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
        var collapseTiming = revealDone + 2000;

        setTimeout(function () {
            logoLetters.classList.add('phase-collapse');
            // Enable hover expand after collapse animation finishes
            setTimeout(function () {
                logoLetters.classList.add('hover-ready');
            }, 900);
        }, collapseTiming);
    }

    // Start animation on load
    window.addEventListener('load', function () {
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

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (!countrySelect.contains(e.target)) {
                countrySelect.classList.remove('open');
            }
        });
    }

    // --- Contact form (Formsubmit) ---
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Auto-format phone: (XX) XXXXX-XXXX
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

            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('Por favor, informe um e-mail válido.');
                return;
            }

            // Merge phone fields into a single hidden value
            var cc = (countryCodeInput ? countryCodeInput.value : '+55');
            var phone = (formData.get('phone') || '').toString().trim();
            var fullPhone = phone ? cc + ' ' + phone : '';

            // Build final FormData for Formsubmit
            var sendData = new FormData();
            sendData.append('name', name);
            sendData.append('email', email);
            sendData.append('Telefone', fullPhone);
            sendData.append('message', message);
            sendData.append('_subject', formData.get('_subject'));
            sendData.append('_captcha', 'false');
            sendData.append('_template', 'table');

            var submitBtn = contactForm.querySelector('button[type="submit"]');
            var originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            fetch('https://formsubmit.co/ajax/contato@cloud4tech.com.br', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    Telefone: fullPhone,
                    message: message,
                    _subject: 'Nova mensagem do site Cloud4Tech',
                    _captcha: 'false',
                    _template: 'table'
                })
            }).then(function (res) {
                return res.json().then(function (data) {
                    if (res.ok && data.success) {
                        submitBtn.textContent = 'Mensagem Enviada ✓';
                        submitBtn.style.background = 'linear-gradient(135deg, #22D68F, #1AAF74)';
                        contactForm.reset();
                    } else {
                        submitBtn.textContent = 'Erro ao enviar';
                        submitBtn.style.background = 'linear-gradient(135deg, #e53e3e, #c53030)';
                    }
                    setTimeout(function () {
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 3000);
                });
            }).catch(function () {
                submitBtn.textContent = 'Erro de conexão';
                submitBtn.style.background = 'linear-gradient(135deg, #e53e3e, #c53030)';
                setTimeout(function () {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }

    // --- Smooth active link highlight ---
    var sections = document.querySelectorAll('section[id]');

    function highlightNav() {
        var scrollPos = window.scrollY + 120;

        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.querySelectorAll('a').forEach(function (a) {
                    a.style.color = '';
                });
                var activeLink = navLinks.querySelector('a[href="#' + id + '"]');
                if (activeLink && !activeLink.classList.contains('btn')) {
                    activeLink.style.color = '#F3EEFF';
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });
})();
