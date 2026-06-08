<p align="center">
  <img src="assets/images/falcon.png" alt="Cloud4Tech Falcon" width="180">
</p>

<h1 align="center">Cloud4Tech</h1>

<p align="center">
  <strong>Segurança · Inteligência · Infraestrutura Cloud</strong>
</p>

<p align="center">
  <a href="https://cloud4tech.com.br">cloud4tech.com.br</a>
</p>

<p align="center">
  <a href="#-sobre">Sobre</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-estrutura">Estrutura</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#%EF%B8%8F-deploy">Deploy</a>
</p>

---

## 📋 Sobre

**Cloud4Tech** é uma empresa especializada em soluções corporativas de **cloud computing**, **inteligência artificial** e **cibersegurança**. Este repositório contém o site institucional da empresa — uma single-page application moderna, responsiva e com suporte a tema claro/escuro.

### Missão
Entregar soluções tecnológicas seguras, escaláveis e inteligentes que protejam e impulsionem a infraestrutura digital dos nossos clientes.

### Visão
Ser referência nacional em segurança digital e inovação em nuvem, reconhecida pela excelência técnica e pela confiança dos nossos parceiros.

---

## 🚀 Tecnologias

| Tecnologia | Uso |
|---|---|
| **HTML5** | Estrutura semântica |
| **CSS3** | Estilização com CSS Custom Properties (variáveis) |
| **JavaScript** (Vanilla) | Interatividade e animações |
| **Google Fonts** | Inter (corpo) + Space Grotesk (títulos) |
| **Web3Forms** | Backend de formulário de contato (AJAX/JSON) |
| **flagcdn.com** | Bandeiras dos países no seletor de telefone |
| **Cloudflare Workers** | Hospedagem (Static Assets via `wrangler`) |
| **Cloudflare DNS + CDN** | DNS, proxy, SSL/TLS, cache global |

---

## 📁 Estrutura

```
Cloud4Tech/
├── index.html                 # Página principal (single-page)
├── favicon.ico                # Favicon (falcão)
├── robots.txt                 # Regras de crawler
├── sitemap.xml                # Mapa do site
├── humans.txt                 # Créditos / metadados do time
├── site.webmanifest           # PWA manifest
├── _headers                   # Cabeçalhos HTTP (cache, HSTS, CSP)
├── wrangler.jsonc             # Configuração do Cloudflare Workers
├── .editorconfig              # Padrão de indentação do projeto
├── .well-known/
│   └── security.txt           # Política de segurança (RFC 9116)
├── assets/
│   ├── css/
│   │   └── styles.css         # Estilos completos (dark + light mode)
│   ├── js/
│   │   └── main.js            # Interatividade e lógica
│   └── images/
│       ├── falcon.png         # Mascote (falcão)
│       └── logo.png           # Logo da empresa
└── README.md
```

---

## ✨ Funcionalidades

### 🎨 Tema Claro / Escuro
- Toggle na navbar com ícones de sol/lua
- Preferência salva no `localStorage`
- Carregamento sem flash (script inline no `<head>`)
- `theme-color` adapta a cor da barra do navegador (mobile)

### 🦅 Animação do Logo
- Letras "CLOUD4TECH" aparecem uma a uma (stagger)
- Falcão surge com fade-in
- Letras colapsam para "C4T"
- Hover expande de volta para "CLOUD4TECH"
- Respeita `prefers-reduced-motion`

### 📱 Design Responsivo
- Layout adaptável para desktop, tablet e mobile
- Menu hamburger em telas menores
- Grid flexível nos cards de serviços
- Falcão com `clamp()` para escala responsiva

### 📬 Formulário de Contato
- Integração com Web3Forms via AJAX (JSON)
- Seletor de país com bandeiras reais (flagcdn.com, lazy-loaded)
- Máscara automática de telefone: `(XX) XXXXX-XXXX`
- Validação client-side de campos obrigatórios e e-mail
- Mensagens de status inline com `aria-live` (acessível)
- Honeypot anti-spam fora da tela

### 🧭 Navegação
- Navbar fixa com efeito blur ao rolar
- Scroll suave com ancoragem precisa
- Destaque do link ativo conforme a seção visível
- Animação de underline verde nos links ao hover

### 🎬 Scroll Reveal
- Elementos surgem suavemente ao entrar no viewport
- Atributo `data-aos` para controle por elemento

### 🔍 SEO & Acessibilidade
- **JSON-LD** completo com `@graph` (Organization, WebSite e 5x Service)
- Open Graph + Twitter Card para preview social
- Canonical, robots e sitemap configurados
- `prefers-reduced-motion` respeitado globalmente
- `role="status"` e `aria-live` no formulário

### 🔒 Segurança (via `_headers` na Cloudflare)
- **HSTS** com preload
- **Content-Security-Policy** estrita
- `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`
- Cache imutável de 1 ano em `/assets/*`
- HTML com revalidação forçada (deploys aparecem na hora)

---

## 📦 Seções do Site

| Seção | Descrição |
|---|---|
| **Hero** | Apresentação principal com falcão, animação C4T e CTAs |
| **Sobre** | Quem somos, diferenciais e pilares de atuação |
| **Serviços** | 5 cards: EDR, XDR, Infraestrutura em Cloud, Inteligência Artificial e Cibersegurança Corporativa |
| **Missão & Valores** | Missão, visão e valores da empresa |
| **Contato** | Formulário completo com envio real de e-mail |
| **Footer** | Links de navegação, serviços e informações de contato |

---

## 🎨 Paleta de Cores

### Modo Escuro (padrão)
| Variável | Hex |
|---|---|
| Background | `#0D0B1E` |
| Purple | `#7C3AED` |
| Green | `#22D68F` |
| Text | `#C4BDE6` |
| Light | `#F3EEFF` |

### Modo Claro
| Variável | Hex |
|---|---|
| Background | `#F5F3FF` |
| Cards | `#FFFFFF` |
| Text | `#4A4568` |
| Headings | `#1A1036` |

---

## ⚙️ Deploy

O site é hospedado no **Cloudflare Workers (Static Assets)** com deploy automático via integração nativa do Cloudflare com o GitHub. Cada push na branch `main` dispara o build (`npx wrangler deploy`) usando o `wrangler.jsonc` da raiz.

**DNS, SSL/TLS, CDN e WAF** são gerenciados pela Cloudflare. O modo SSL recomendado é **Full**.

### Configuração local (opcional)
```bash
# Preview local com Wrangler
npx wrangler dev

# Deploy manual
npx wrangler deploy
```

---

## 📧 Contato

- **E-mail:** contato@cloud4tech.com.br
- **Site:** [cloud4tech.com.br](https://cloud4tech.com.br)

---

<p align="center">
  <sub>Feito com 💜 por <strong>Cloud4Tech</strong></sub>
</p>
