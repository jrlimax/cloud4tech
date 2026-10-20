/* ============================
   Cloud4Tech — Main JS
   ============================ */

(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- DOM cache ---
    var navbar = document.getElementById('navbar');
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    var navAnchors = navLinks ? navLinks.querySelectorAll('a') : [];
    var aosElements = document.querySelectorAll('[data-aos]');
    var sections = document.querySelectorAll('section[id]');

    // --- Theme toggle (dark/light) ---
    // Theme is set in the head before rendering.
    var themeToggle = document.getElementById('themeToggle');

    if (themeToggle) {
        function updateThemeLabel() {
            var label = document.documentElement.getAttribute('data-theme') === 'dark'
                ? 'Ativar tema claro' : 'Ativar tema escuro';
            themeToggle.setAttribute('aria-label', label);
            themeToggle.setAttribute('title', label);
        }
        updateThemeLabel();
        themeToggle.addEventListener('click', function () {
            var current = document.documentElement.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            updateThemeLabel();
            localStorage.setItem('c4t-theme', next);
            if (typeof window.renderC4tHCaptcha === 'function') {
                window.renderC4tHCaptcha(next);
            }
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
                window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            }
        });
    });

    // --- Navbar scroll effect ---
    function handleNavScroll() {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
    }

    // --- Mobile menu toggle ---
    if (navToggle && navLinks) {
        navToggle.setAttribute('aria-controls', navLinks.id);
        navToggle.setAttribute('aria-expanded', 'false');

        function closeMenu() {
            navLinks.classList.remove('open');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }

        navToggle.addEventListener('click', function () {
            var open = navLinks.classList.toggle('open');
            navToggle.classList.toggle('active', open);
            navToggle.setAttribute('aria-expanded', String(open));
        });

        navAnchors.forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && navLinks.classList.contains('open')) {
                closeMenu();
                navToggle.focus();
            }
        });

        document.addEventListener('click', function (event) {
            if (!navbar.contains(event.target)) closeMenu();
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
            var href = a.getAttribute('href');
            a.classList.toggle('active', !!activeId && (href === '#' + activeId ||
                (window.location.pathname === '/' && href === '/#' + activeId)));
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

    window.addEventListener('load', function () {
        var legacyTargets = { '#mission': '/sobre#mission' };
        if (window.location.pathname === '/' && legacyTargets[window.location.hash]) {
            window.location.replace(legacyTargets[window.location.hash]);
            return;
        }
        handleNavScroll();
        revealOnScroll();
    });

    // --- Dropdown aria-expanded (navbar) ---
    document.querySelectorAll('.nav-dropdown').forEach(function (dd) {
        var trigger = dd.querySelector(':scope > a');
        if (!trigger) return;
        function setExpanded(value) { trigger.setAttribute('aria-expanded', value); }
        setExpanded('false');
        dd.addEventListener('mouseenter', function () { setExpanded('true'); });
        dd.addEventListener('mouseleave', function () { setExpanded('false'); });
        dd.addEventListener('focusin', function () { setExpanded('true'); });
        dd.addEventListener('focusout', function (event) {
            if (!dd.contains(event.relatedTarget)) setExpanded('false');
        });
    });

    // --- Contact form (Web3Forms) ---
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        var phoneInput = contactForm.querySelector('.phone-number');
        var formStatus = document.getElementById('formStatus');
        var topicSelect = document.getElementById('field-topic');
        var whatsappLink = document.getElementById('contactWhatsapp');
        var contactTitle = document.getElementById('contactTitle');
        var contactDescription = document.getElementById('contactDescription');
        var defaultContactTitle = contactTitle ? contactTitle.textContent : '';
        var defaultContactDescription = contactDescription ? contactDescription.textContent : '';
        var contactTopics = {
            'nuvem': {
                title: 'Vamos conversar sobre seu projeto em nuvem.',
                description: 'Conte quais sistemas você precisa implantar ou migrar, o que utiliza hoje e se há uma data prevista para a mudança.'
            },
            'gestao': {
                title: 'Vamos organizar a gestão da sua nuvem.',
                description: 'Conte quais serviços sua empresa utiliza e quais atividades precisam de acompanhamento, como acessos, consumo e backups.'
            },
            'microsoft-365': {
                title: 'Vamos conversar sobre seu Microsoft 365.',
                description: 'Conte o que precisa melhorar na administração de contas, e-mails, arquivos, acessos ou dispositivos da empresa.'
            },
            'backup': {
                title: 'Vamos planejar a proteção dos seus dados.',
                description: 'Conte quais dados e sistemas precisa proteger, como os backups são feitos hoje e se já houve testes de recuperação.'
            }
        };

        function updateContactTopic() {
            var topic = topicSelect ? topicSelect.value : '';
            var selectedOption = topicSelect ? topicSelect.options[topicSelect.selectedIndex] : null;
            var topicKey = selectedOption ? selectedOption.dataset.topic : '';
            var context = Object.prototype.hasOwnProperty.call(contactTopics, topicKey) ? contactTopics[topicKey] : null;
            if (contactTitle) contactTitle.textContent = context ? context.title : defaultContactTitle;
            if (contactDescription) contactDescription.textContent = context ? context.description : defaultContactDescription;
            var subject = contactForm.querySelector('[name="subject"]');
            if (subject) subject.value = 'Nova mensagem do site Cloud4Tech' + (topic ? ' - ' + topic : '');
            if (whatsappLink) {
                var text = 'Olá! Vim pelo site Cloud4Tech e gostaria de conversar sobre ' + (topic || 'meu ambiente') + '.';
                whatsappLink.href = 'https://wa.me/5511987839637?text=' + encodeURIComponent(text);
            }
        }

        if (topicSelect) {
            var requestedTopic = new URLSearchParams(window.location.search).get('assunto');
            Array.prototype.forEach.call(topicSelect.options, function (option) {
                if (option.dataset.topic && option.dataset.topic === requestedTopic) {
                    topicSelect.value = option.value;
                }
            });
            topicSelect.addEventListener('change', updateContactTopic);
            contactForm.addEventListener('reset', function () {
                setTimeout(updateContactTopic, 0);
            });
            updateContactTopic();
        }

        function setStatus(message, kind) {
            if (!formStatus) return;
            formStatus.textContent = message || '';
            formStatus.className = 'form-status' + (kind ? ' form-status--' + kind : '');
        }

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
            setStatus('', '');

            // Honeypot: bots tendem a marcar todos os inputs (inclusive escondidos)
            var honeypot = contactForm.querySelector('[name="botcheck"]');
            if (honeypot && honeypot.checked) {
                // Finge sucesso para não dar dica ao bot
                setStatus('Mensagem enviada com sucesso!', 'success');
                contactForm.reset();
                return;
            }

            // Remove qualquer campo g-recaptcha-response injetado pelo hCaptcha (compat reCAPTCHA)
            // O Web3Forms confunde com tentativa de usar reCAPTCHA Pro e rejeita o envio.
            contactForm.querySelectorAll('[name="g-recaptcha-response"]').forEach(function (el) {
                el.parentNode.removeChild(el);
            });

            var formData = new FormData(contactForm);
            var name = (formData.get('name') || '').toString().trim();
            var email = (formData.get('email') || '').toString().trim();
            var message = (formData.get('message') || '').toString().trim();
            var consent = contactForm.querySelector('#field-consent');

            if (!name || !email || !message) {
                setStatus('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setStatus('Por favor, informe um e-mail válido.', 'error');
                return;
            }

            if (consent && !consent.checked) {
                setStatus('Confirme a leitura da Política de Privacidade antes de enviar.', 'error');
                return;
            }

            var captchaToken = (formData.get('h-captcha-response') || '').toString();
            if (!captchaToken) {
                setStatus('Por favor, complete a verificação de segurança antes de enviar.', 'error');
                return;
            }

            var cc = '+55';
            var phone = (formData.get('phone') || '').toString().trim();
            var fullPhone = phone ? cc + ' ' + phone : '';

            var submitBtn = contactForm.querySelector('button[type="submit"]');
            var btnLabel = submitBtn.querySelector('.btn__label');
            var originalText = btnLabel ? btnLabel.textContent : submitBtn.textContent;
            if (btnLabel) btnLabel.textContent = 'Enviando';
            else submitBtn.textContent = 'Enviando...';
            submitBtn.classList.add('btn--loading');
            submitBtn.disabled = true;
            setStatus('Enviando sua mensagem...', 'info');

            // Atualiza o campo Telefone com country code antes de enviar
            formData.set('Telefone', fullPhone);
            formData.set('from_name', 'Cloud4Tech Site');
            // Remove g-recaptcha-response (hCaptcha pode injetar por compat e Web3Forms confunde com Pro feature)
            formData.delete('g-recaptcha-response');

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            }).then(function (res) {
                return res.json().then(function (data) {
                    return { ok: res.ok, data: data };
                });
            }).then(function (result) {
                if (result.ok && result.data && result.data.success) {
                    if (btnLabel) btnLabel.textContent = 'Mensagem Enviada \u2713';
                    else submitBtn.textContent = 'Mensagem Enviada \u2713';
                    submitBtn.classList.remove('btn--loading');
                    submitBtn.classList.add('btn--success');
                    setStatus('Mensagem enviada com sucesso! A Cloud4Tech recebeu seu contato.', 'success');
                    contactForm.reset();
                    if (window.hcaptcha) { try { window.hcaptcha.reset(); } catch (e) {} }
                } else {
                    var apiMsg = (result.data && result.data.message) ? result.data.message : 'Não foi possível enviar a mensagem.';
                    throw new Error(apiMsg);
                }
            }).catch(function (err) {
                if (btnLabel) btnLabel.textContent = 'Erro ao enviar';
                else submitBtn.textContent = 'Erro ao enviar';
                submitBtn.classList.remove('btn--loading');
                submitBtn.classList.add('btn--error');
                setStatus((err && err.message ? err.message : 'Erro ao enviar.') + ' Tente novamente em instantes ou escreva para comercial@cloud4tech.com.br.', 'error');
                if (window.hcaptcha) { try { window.hcaptcha.reset(); } catch (e) {} }
            }).finally(function () {
                setTimeout(function () {
                    if (btnLabel) btnLabel.textContent = originalText;
                    else submitBtn.textContent = originalText;
                    submitBtn.classList.remove('btn--loading', 'btn--success', 'btn--error');
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }
})();
