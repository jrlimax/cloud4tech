<p align="center">
  <a href="https://cloud4tech.com.br"><img src="assets/images/og-card-tech.png" alt="Cloud4Tech — Infraestrutura em nuvem, do projeto à gestão." width="900"></a>
</p>

<h1 align="center">Cloud4Tech</h1>

<p align="center">
  <strong>Infraestrutura em nuvem, do projeto à gestão.</strong><br>
  <a href="https://cloud4tech.com.br">cloud4tech.com.br</a>
</p>

Site institucional estático da Cloud4Tech, voltado a empresas que precisam criar ou migrar sua infraestrutura, administrar serviços em nuvem, organizar acessos e proteger dados.

## Escopo dos serviços

- **Azure:** planejamento e implantação de infraestrutura, migração de servidores locais após análise de compatibilidade e dependências, transferência de assinaturas e suporte a ambientes existentes de Azure Virtual Desktop (AVD).
- **Transferência de assinaturas Azure:** cenários CSP → CSP, MOSP → CSP e EA → CSP, sujeitos às condições aplicáveis. Não equivale à migração de servidores.
- **Oracle Cloud Infrastructure (OCI):** planejamento e implantação de infraestrutura.
- **Gestão de cloud:** administração recorrente, revisão de recursos, acessos e consumo, com responsabilidades e condições de atendimento definidas no escopo.
- **Microsoft 365:** administração de usuários, licenças, colaboração e identidades, incluindo Entra ID.
- **Intune:** gestão de dispositivos, aplicativos e políticas de conformidade.
- **Acronis:** backup e recuperação de dados, incluindo planejamento de recuperação de desastres.

Segurança faz parte da gestão de acessos, configurações e proteção de dados. O site não oferece SOC, EDR/XDR independente, firewalls ou uma solução autônoma de segurança com IA. Não anuncia especialização em bancos de dados, planos gratuitos de nuvem, certificações não confirmadas, economia garantida ou monitoramento humano ininterrupto.

O processo comercial segue: conversa e entendimento → elaboração e apresentação do escopo → proposta comercial → execução documentada. Atendimento, periodicidade, licenças, prazos e limitações dependem do que for contratado.

## Páginas e navegação

| Rota | Finalidade |
|---|---|
| `/` | Apresentação institucional, quatro soluções por necessidade, resumo da empresa, tecnologias e contato |
| `/sobre` | Abordagem, compromissos e etapas de trabalho |
| `/ir-para-nuvem` | Planejamento de infraestrutura nova ou migração, responsabilidades e dúvidas iniciais |
| `/migracao-azure` | Infraestrutura Azure, migração de servidores, transferências de assinaturas e suporte a AVD |
| `/oracle-cloud` | Planejamento e implantação de infraestrutura OCI |
| `/cloud-gerenciada` | Gestão recorrente de serviços em nuvem |
| `/microsoft-365` | Colaboração, usuários, licenças e identidades |
| `/intune` | Gestão de dispositivos, aplicativos e conformidade |
| `/acronis` | Backup, testes e recuperação de dados |
| `/contato` | Formulário e canais comerciais |
| `/privacidade` | Tratamento de dados, fornecedores e canal de privacidade |
| URL inexistente | Página personalizada com resposta HTTP 404 e `noindex` |

A navegação principal segue **Soluções → Tecnologias → Sobre → Contato**. As soluções usam linguagem de necessidade; os produtos ficam no menu de tecnologias e nos detalhes técnicos. O nome apresentado no menu é **Microsoft 365**; Entra ID continua explicado no conteúdo.

As quatro soluções da home usam `details` e `summary` nativos: começam recolhidas, funcionam com teclado e sem JavaScript e permitem abrir várias opções simultaneamente. O CTA principal da abertura leva às soluções; o contato é secundário.

Todas as páginas públicas, inclusive Privacidade e 404, têm o mesmo rodapé: marca, Institucional, Soluções, Contato e aviso legal. A seção “Nossos compromissos” mantém a âncora `/sobre#mission` por compatibilidade.

### Rotas aposentadas

O arquivo [_redirects](./_redirects) mantém quatro redirecionamentos HTTP 301, diretamente para `/microsoft-365`:

- `/ia-seguranca`
- `/ia-seguranca.html`
- `/ciberseguranca-edr-xdr`
- `/ciberseguranca-edr-xdr.html`

As páginas antigas foram removidas do catálogo e do sitemap.

## Identidade visual

O guia completo de conceito, símbolo, cores, tipografia, aplicações e usos incorretos está em [Identidade visual da Cloud4Tech](./identidade-visual/README.md). Este README mantém as informações técnicas do site.

O símbolo atual é o falcão roxo com detalhes amarelos e conexões tecnológicas integradas ao corpo. O nome **CLOUD4TECH** mantém o **4 verde**.

| Arquivo | Aplicação |
|---|---|
| [falcon-tech.png](./assets/images/falcon-tech.png) | Símbolo com fundo externo transparente, 768 × 768 px |
| `falcon-tech-{96,192,320,640}.webp` | Imagens responsivas do cabeçalho, rodapé, home e 404 |
| [favicon-tech.ico](./assets/images/favicon-tech.ico) | Ícone do navegador em múltiplas resoluções |
| [og-card-tech.png](./assets/images/og-card-tech.png) | Imagem de compartilhamento, 1200 × 630 px |
| [site.webmanifest](./site.webmanifest) | Nome, cores e ícone da aplicação |

O novo símbolo é rasterizado; não é um arquivo vetorial. Os arquivos anteriores [falcon.png](./assets/images/falcon.png), [logo.png](./assets/images/logo.png), [og-card.png](./assets/images/og-card.png) e [favicon.ico](./favicon.ico) foram preservados, sem substituição.

Cabeçalho e rodapé usam WebP de 96 px (5.652 bytes), com alternativa de 192 px (13.260 bytes) para telas de maior densidade. Home e 404 usam 320 px (24.910 bytes) ou 640 px (57.378 bytes). As imagens mantêm transparência e usam `srcset`; o preload da home acompanha as mesmas alternativas. Em relação aos 405.540 bytes do PNG, as reduções são de aproximadamente 94% na imagem de 320 px e 99% na de 96 px, sem alterar o arquivo original. O PNG continua no manifesto e nos metadados de organização.

### Apresentação no GitHub

O README usa a nova imagem de marca como capa. A descrição do repositório acompanha o slogan e o catálogo atual; o campo Website aponta para `https://cloud4tech.com.br`, e os tópicos identificam as tecnologias e a finalidade do projeto.

A imagem de compartilhamento do próprio GitHub é uma configuração separada dos metadados do site. Para aplicar a mesma identidade, carregar [og-card-tech.png](./assets/images/og-card-tech.png) em **Settings → General → Social preview** no repositório. O upload exige uma sessão com permissão de administração; o arquivo no Git não configura essa opção automaticamente. O avatar do proprietário é uma configuração da conta, não deste projeto.

### Tamanho e alinhamento

- Cabeçalho: símbolo de 44 px; 32 px em telas de até 480 px.
- Rodapé: símbolo de 52 px, alinhado ao nome, sem quebra da assinatura.
- Home: símbolo com máximo de 240 px; coluna de 128 px até 768 px; símbolo de 112 px até 480 px.
- Página 404: símbolo entre 112 e 180 px.

### Temas

O tema **claro é o padrão** quando não existe preferência salva. O botão permite alternar para escuro e a escolha fica em `localStorage`, na chave `c4t-theme`. O script de inicialização aplica a preferência antes da renderização do conteúdo.

| Uso | Claro | Escuro |
|---|---|---|
| Fundo principal | `#FFFFFF` | `#0B0D14` |
| Fundo alternativo | `#F2F4F8` | `#0E1019` |
| Texto | `#3F4454` | `#BFC3D4` |
| Títulos | `#151926` | `#FFFFFF` |
| Roxo de destaque | `#6D28D9` | `#9D8DF0` |
| Verde de destaque | `#087A56` | `#10B981` |

As variáveis completas e os estados dos componentes estão em [styles.css](./assets/css/styles.css). A tipografia usa **Inter** no corpo e **Space Grotesk** nos títulos, carregadas pelo Google Fonts.

## Stack e estrutura

HTML semântico, CSS e JavaScript sem framework, sem banco próprio de contatos e sem etapa de compilação do front-end. Hospedagem por **Cloudflare Workers Static Assets**, configurada em [wrangler.jsonc](./wrangler.jsonc).

```text
.
├── index.html, sobre.html, contato.html
├── ir-para-nuvem.html, migracao-azure.html, oracle-cloud.html
├── cloud-gerenciada.html, microsoft-365.html, intune.html, acronis.html
├── privacidade.html, 404.html
├── assets/
│   ├── css/styles.css
│   ├── js/
│   │   ├── main.js
│   │   ├── theme-init.js
│   │   ├── hcaptcha-bootstrap.js
│   │   └── 404.js
│   └── images/
├── tests/
│   ├── main.test.cjs
│   ├── validate_site.py
│   └── layout.cjs
├── .well-known/security.txt
├── _headers, _redirects
├── robots.txt, sitemap.xml, humans.txt
├── site.webmanifest, favicon.ico
├── google1e996c26b941f425.html
├── wrangler.jsonc
└── README.md
```

Não há `package.json` nem dependências de testes a instalar. Os testes usam o runner nativo do Node.js e a biblioteca padrão do Python. O diretório local `.wrangler` é ignorado pelo Git. O manifesto não implica suporte offline: não há service worker implementado.

## Formulário e canais

O formulário de [contato.html](./contato.html) envia `FormData` por HTTPS para a API do **Web3Forms**, que processa a submissão e encaminha a mensagem ao e-mail comercial.

- Nome, e-mail e mensagem obrigatórios; telefone e necessidade opcionais.
- Validação no navegador, máscara de telefone, honeypot e hCaptcha.
- hCaptcha carregado na página de contato, com renderização que acompanha o tema.
- Botão com estado de envio e mensagens de resultado em região acessível.
- Timeout de 20 segundos, tratamento explícito de respostas inválidas e preservação dos campos quando não há confirmação de sucesso. Um timeout não comprova ausência de entrega: o aviso orienta conferir o recebimento antes de reenviar.
- Falhas de envio ou reinicialização do captcha são registradas no console e informadas ao visitante.
- Confirmação obrigatória de leitura da política, sem autorização genérica para publicidade.
- Nas chamadas finais dos serviços, o formulário é a ação principal e o WhatsApp é a alternativa.
- O botão flutuante de WhatsApp foi mantido onde já existia; sua animação de pulso permanece desativada.

O parâmetro `?assunto=` aceita `nuvem`, `gestao`, `microsoft-365` e `backup`. Ele seleciona uma necessidade editável e ajusta título, introdução, assunto enviado e mensagem de WhatsApp. Valores desconhecidos não são inseridos no conteúdo. A opção vazia e o reset restauram a apresentação geral; a URL canônica continua sendo `/contato`.

**Comercial:** [comercial@cloud4tech.com.br](mailto:comercial@cloud4tech.com.br). O recebimento das mensagens foi confirmado pelo responsável em 20/10/2026. O destinatário do Web3Forms é associado à chave pública do formulário: alterar o e-mail visível não altera o destino configurado no serviço.

As chaves públicas de integração presentes no front-end não substituem controles do provedor. Restrições de domínio, validação antispam e proteção da conta devem ser verificadas no painel do Web3Forms.

## Privacidade e segurança

A [Política de Privacidade](./privacidade.html), revisada em 20/10/2026, descreve o fluxo **navegador → Web3Forms → e-mail**. A ausência de banco próprio não significa ausência de armazenamento: mensagens podem ser conservadas pelo provedor do formulário e pelo serviço de e-mail.

A [política pública do Web3Forms](https://web3forms.com/privacy) consultada nessa data informa retenção das submissões por até três anos, salvo prazo menor do plano ou exclusão antecipada. Esse prazo não define a retenção da caixa de e-mail da Cloud4Tech. Consulte também o [acordo de tratamento do Web3Forms](https://web3forms.com/dpa).

O aviso identifica Cloudflare, Web3Forms, hCaptcha, Google Fonts e os canais de atendimento; explica a possibilidade de processamento internacional e distingue:

- HTTPS/TLS em trânsito de criptografia de dados armazenados;
- `localStorage` de cookies;
- confirmação de leitura de consentimento para uma finalidade específica.

O identificador `field-consent` e o nome técnico `consent` foram mantidos por compatibilidade; a marcação representa ciência do aviso. O canal [contato@cloud4tech.com.br](mailto:contato@cloud4tech.com.br) não é apresentado como encarregado formalmente designado.

**A publicação da política não comprova conformidade com a LGPD.** Ainda precisam de confirmação operacional e jurídica: identificação legal completa da controladora; provedor e configurações do e-mail; termos, plano e suboperadores; retenção e exclusão; bases legais dos tratamentos concretos; mecanismo de transferência internacional; necessidade de encarregado e procedimentos para atender titulares.

### Controles do site

[_headers](./_headers) configura HSTS, CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` e `Permissions-Policy`. A CSP restringe origens, mas ainda permite `'unsafe-inline'`; não deve ser descrita como isenta de scripts inline ou como garantia contra ataques.

As verificações locais não substituem a conferência dos cabeçalhos em produção, das contas dos fornecedores e dos controles administrativos. hCaptcha e honeypot reduzem abuso, mas não garantem bloqueio de todos os bots. O canal de reporte está em [.well-known/security.txt](./.well-known/security.txt).

## SEO, acessibilidade e conteúdo

- Títulos, descrições e H1s próprios por página; URLs canônicas no domínio público, sem extensão.
- Open Graph e Twitter Cards nas páginas com metadados sociais.
- JSON-LD de organização, site, soluções, serviços, breadcrumbs e FAQs conforme a página.
- Respostas visíveis e FAQ estruturada devem permanecer equivalentes.
- Sitemap com 11 rotas; páginas aposentadas e 404 fora do mapa.
- Link para pular ao conteúdo, foco visível, controles semânticos e suporte a movimento reduzido.
- Botões de tema e menu com área de 44 × 44 px; ícones e nomes acessíveis consistentes.
- Navegação móvel com listas estáticas e links acessíveis; fechamento por Escape e interação externa.

As revelações e o destaque das seções usam `IntersectionObserver`, evitando consultar a geometria das seções a cada rolagem. A revelação deixa de observar elementos já exibidos; com movimento reduzido eles aparecem imediatamente. Navegadores sem a API mantêm o comportamento anterior por rolagem. O efeito da barra continua limitado por `requestAnimationFrame`. O CSS da abertura foi consolidado e as regras de arte e legendas que não existem mais no HTML foram removidas, preservando as dimensões responsivas.

A redação parte de situações concretas e entregas verificáveis, explicando termos técnicos sem ampliar o catálogo. Não inserir clientes, depoimentos, selos, certificações, métricas ou promessas não confirmadas. A marcação estruturada não garante posição ou apresentação especial nos buscadores.

Após publicar, verificar sitemap, canônicas e indexação no Google Search Console. O arquivo de verificação existente foi preservado, mas não comprova acesso à propriedade. Medir desempenho na versão publicada; não há pontuação Lighthouse documentada para esta revisão.

## Execução local e publicação

Pré-requisitos: Node.js/npm para executar o Wrangler; acesso à conta Cloudflare para deploy manual.

```powershell
# Preview local
npx wrangler dev

# Deploy manual, somente quando autorizado
npx wrangler deploy
```

O preview usado na revisão esteve disponível em `http://127.0.0.1:8787`. Confirme a URL informada pelo Wrangler ao iniciar outra sessão.

O fluxo de publicação informado para o projeto usa integração nativa Cloudflare/GitHub: pushes na branch `main` disparam `npx wrangler deploy`. Não há workflow de deploy versionado neste repositório. Um push bem-sucedido confirma o envio ao GitHub, não a conclusão do deploy; acompanhe a execução no Cloudflare e confira o domínio público.

### Cache

Os arquivos de `/assets/*` têm cache imutável de um ano. Ao mudar CSS ou JavaScript, atualize as referências versionadas em todas as páginas que os carregam. Para novas imagens, prefira nomes novos para evitar reutilizar conteúdo em cache.

Versões desta revisão: `styles.css?v=26`, `main.js?v=19`, `hcaptcha-bootstrap.js?v=2` e `theme-init.js?v=2`. As regras de revalidação e cache de HTML, sitemap, robots e favicon estão em [_headers](./_headers); confirme o comportamento nas rotas públicas.

## Validação e manutenção

Na revisão de 20/10/2026 foram usados validadores externos ao repositório e navegador Edge isolado:

- 192 combinações: 12 páginas × 8 larguras (320 a 1920 px) × 2 temas, sem cortes ou transbordamentos detectados.
- Menu móvel, teclado, abertura independente das soluções e quatro estados de validação do formulário, sem envio real.
- Nenhum erro de JavaScript observado nessa execução.
- 13 documentos HTML, 10 blocos JSON-LD, 7 pares FAQ/schema e 404 links/recursos locais verificados.
- 11 rotas do sitemap, quatro redirecionamentos permanentes, metadados e resposta 404 conferidos no preview.

Essa revisão de navegador ocorreu antes das otimizações descritas acima. Os testes atuais estão em [tests](./tests), sem caminhos específicos de uma máquina e sem envio real ao Web3Forms.

Verificações locais reproduzíveis na raiz (Node.js 22 ou superior e Python 3):

```powershell
node --test tests\main.test.cjs
python tests\validate_site.py
git diff --check
node --check assets\js\main.js
node --check assets\js\theme-init.js
node --check assets\js\hcaptcha-bootstrap.js
node --check assets\js\404.js
```

Os testes unitários cobrem sucesso, timeout durante requisição e leitura de resposta, JSON inválido, rejeição da API, falha de rede, validação, falhas do captcha, observadores e fallback de rolagem. O validador Python verifica conteúdo, links, `srcset`, rodapés, metadados, FAQs, sitemap, definições de redirect, consistência das versões e limites de peso dos WebP, sem acesso à rede por padrão.

Com um preview já disponível, é possível conferir respostas HTTP:

```powershell
python tests\validate_site.py --base-url http://127.0.0.1:8787
```

O teste de layout precisa de um navegador Chromium/Edge já iniciado pelo responsável com uma porta de depuração local dedicada. Ele não inicia navegadores nem instala ferramentas:

```powershell
node tests\layout.cjs --base-url http://127.0.0.1:8787 --cdp http://127.0.0.1:9222
```

O script cria e fecha sua própria aba, desativa cache nela e confere 192 combinações de página/largura/tema, imagens carregadas, alinhamento e exceções de execução. Use apenas uma sessão dedicada, sem abas pessoais; não exponha a porta de depuração à rede. Não foram repetidos testes de navegador nesta rodada porque houve relato de bloqueio pelo Defender na execução do preview. Não desative proteções para executar os testes.

Antes de publicar alterações, conferir também páginas em tema claro/escuro e celular/desktop, imagens carregadas, rodapés iguais, links, formulário sem disparos de teste desnecessários, FAQ visível versus JSON-LD, canônicas, sitemap e redirects. Validar recebimento real somente com autorização. Não adicionar credenciais privadas ao código.
