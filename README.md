<p align="center">
  <img src="assets/images/falcon.png" alt="Cloud4Tech Falcon" width="180">
</p>

<h1 align="center">Cloud4Tech</h1>

<p align="center">
  <strong>Segurança · Inteligência · Domínio Tecnológico</strong>
</p>

<p align="center">
  <a href="#-sobre">Sobre</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-estrutura">Estrutura</a> •
  <a href="#-funcionalidades">Funcionalidades</a>
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
| **Azure Static Web Apps** | Hospedagem e deploy contínuo via GitHub Actions |
| **Cloudflare** | DNS e roteamento de e-mail |

---

## 📁 Estrutura

```
Cloud4Tech/
├── index.html                  # Página principal (single-page)
├── favicon.ico                 # Favicon (falcão)
├── assets/
│   ├── css/
│   │   └── styles.css          # Estilos completos (dark + light mode)
│   ├── js/
│   │   └── main.js             # Interatividade e lógica
│   └── images/
│       ├── falcon.png          # Mascote (falcão)
│       └── logo.png            # Logo da empresa
├── .github/
│   └── workflows/
│       └── azure-static-web-apps-*.yml  # CI/CD para Azure
└── README.md
```

---

## ✨ Funcionalidades

### 🎨 Tema Claro / Escuro
- Toggle na navbar com ícones de sol/lua
- Preferência salva no `localStorage`
- Carregamento sem flash (script inline no `<head>`)

### 🦅 Animação do Logo
- Letras "CLOUD4TECH" aparecem uma a uma (stagger)
- Falcão surge com fade-in
- Letras colapsam para "C4T"
- Hover expande de volta para "CLOUD4TECH"

### 📱 Design Responsivo
- Layout adaptável para desktop, tablet e mobile
- Menu hamburger em telas menores
- Grid flexível nos cards de serviços

### 📬 Formulário de Contato
- Integração com Web3Forms via AJAX (JSON)
- Seletor de país com bandeiras reais (flagcdn.com)
- Máscara automática de telefone: `(XX) XXXXX-XXXX`
- Validação client-side de campos obrigatórios e e-mail
- Feedback visual no botão (enviando/sucesso/erro)

### 🧭 Navegação
- Navbar fixa com efeito blur ao rolar
- Scroll suave com ancoragem precisa
- Destaque do link ativo conforme a seção visível
- Animação de underline verde nos links ao hover

### 🎬 Scroll Reveal
- Elementos surgem suavemente ao entrar no viewport
- Atributo `data-aos` para controle por elemento

---

## 📦 Seções do Site

| Seção | Descrição |
|---|---|
| **Hero** | Apresentação principal com falcão, animação C4T e CTAs |
| **Sobre** | Quem somos, diferenciais e pilares de atuação |
| **Serviços** | 5 cards: Cloud, IA, Cyber, DevOps, Consultoria |
| **Missão & Valores** | Missão, visão e valores da empresa |
| **Contato** | Formulário completo com envio real de e-mail |
| **Footer** | Links de navegação, serviços e informações legais |

---

## 🎨 Paleta de Cores

### Modo Escuro (padrão)
| Variável | Cor | Hex |
|---|---|---|
| Background | ![#0D0B1E](https://via.placeholder.com/12/0D0B1E/0D0B1E) | `#0D0B1E` |
| Purple | ![#7C3AED](https://via.placeholder.com/12/7C3AED/7C3AED) | `#7C3AED` |
| Green | ![#22D68F](https://via.placeholder.com/12/22D68F/22D68F) | `#22D68F` |
| Text | ![#C4BDE6](https://via.placeholder.com/12/C4BDE6/C4BDE6) | `#C4BDE6` |
| Light | ![#F3EEFF](https://via.placeholder.com/12/F3EEFF/F3EEFF) | `#F3EEFF` |

### Modo Claro
| Variável | Cor | Hex |
|---|---|---|
| Background | ![#F5F3FF](https://via.placeholder.com/12/F5F3FF/F5F3FF) | `#F5F3FF` |
| Cards | ![#FFFFFF](https://via.placeholder.com/12/FFFFFF/FFFFFF) | `#FFFFFF` |
| Text | ![#4A4568](https://via.placeholder.com/12/4A4568/4A4568) | `#4A4568` |
| Headings | ![#1A1036](https://via.placeholder.com/12/1A1036/1A1036) | `#1A1036` |

---

## ⚙️ Deploy

O site é hospedado no **Azure Static Web Apps** com deploy automático via GitHub Actions. Cada push na branch `main` dispara o workflow de build e deploy.

---

## 📧 Contato

- **E-mail:** contato@cloud4tech.com.br
- **Site:** [cloud4tech.com.br](https://cloud4tech.com.br)

---

<p align="center">
  <sub>Feito com 💜 por <strong>Cloud4Tech</strong></sub>
</p>
