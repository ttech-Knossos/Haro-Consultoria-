import {
  readFile,
  writeFile,
  mkdir,
  copyFile,
  rm
} from 'node:fs/promises';

import {
  escapeHtml as e,
  safeUrl,
  validPhone
} from '../src/core.js';

const c = JSON.parse(
  await readFile(
    new URL('../src/content.json', import.meta.url),
    'utf8'
  )
);

for (const list of [c.services, c.projects]) {
  const ids = list.map(x => x.id);

  if (
    new Set(ids).size !== ids.length ||
    ids.some(id => !/^[a-z][a-z0-9-]*$/.test(id))
  ) {
    throw Error('IDs duplicados ou inválidos.');
  }
}

if (c.whatsapp && !validPhone(c.whatsapp)) {
  throw Error(
    'WhatsApp inválido: use 55 + DDD + número, somente dígitos.'
  );
}

for (const p of c.projects) {
  if (!safeUrl(p.url)) {
    throw Error(`URL inválida: ${p.title}`);
  }
}

const nav = [
  ['index.html', 'Início'],
  ['servicos.html', 'Serviços'],
  ['projetos.html', 'Projetos'],
  ['orcamento.html', 'Orçamento']
];

const button = (label, url, secondary = false) => `
  <a
    class="button${secondary ? ' secondary' : ''}"
    href="${e(url)}"
  >
    ${e(label)}
    <span aria-hidden="true">↗</span>
  </a>
`;

const heading = (eyebrow, title, desc) => `
  <div class="page-heading">
    <p class="eyebrow">${eyebrow}</p>
    <h1>${title}</h1>
    <p class="lead">${desc}</p>
  </div>
`;

const services = c.services.map((s, i) => `
  <article class="service" id="${e(s.id)}">
    <div class="service-num">
      ${String(i + 1).padStart(2, '0')}
    </div>

    <div>
      <h2>${e(s.title)}</h2>
      <p>${e(s.short)}</p>

      <details>
        <summary>O que podemos construir</summary>
        <p>${e(s.example)}</p>

        <ul>
          ${s.items.map(x => `<li>${e(x)}</li>`).join('')}
        </ul>
      </details>
    </div>

    <a
      class="text-link"
      href="orcamento.html?servico=${e(s.id)}"
    >
      Pedir orçamento
      <span aria-hidden="true">↗</span>
    </a>
  </article>
`).join('');

const projectCards = c.projects.map(p => `
  <article class="project">
    <div class="project-art ${e(p.id)}" aria-hidden="true">
      <span class="art-label">${e(p.type)}</span>

      <strong>
        ${
          p.id === 'guia'
            ? 'Encontre<br>novos caminhos.'
            : 'Tudo em<br>um só lugar.'
        }
      </strong>

      <div class="art-lines">
        <i></i>
        <i></i>
        <i></i>
      </div>

      <span class="art-caption">Ilustração do projeto</span>
    </div>

    <div class="project-body">
      <p class="eyebrow">${e(p.client)}</p>
      <h2>${e(p.title)}</h2>
      <p>${e(p.description)}</p>
      <p>${e(p.solution)}</p>

      <div class="tags">
        ${p.tags.map(t => `<span>${e(t)}</span>`).join('')}
      </div>

      <a
        class="text-link"
        href="${e(safeUrl(p.url))}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Visitar projeto
        <span class="sr-only">(abre em outra aba)</span>
        <span aria-hidden="true">↗</span>
      </a>
    </div>
  </article>
`).join('');

const cta = `
  <section class="cta">
    <div>
      <p class="eyebrow">Vamos conversar?</p>
      <h2>
        Conte o que você precisa.<br>
        A gente ajuda a encontrar o caminho.
      </h2>
    </div>

    ${button('Pedir um orçamento', 'orcamento.html')}
  </section>
`;

const pages = {
  'index.html': {
    title: 'Tecnologia que simplifica seu negócio',

    body: `
      <section class="hero">
        <div>
          <p class="eyebrow">
            Consultoria · Tecnologia · Inteligência artificial
          </p>

          <h1>
            Tecnologia que <em>faz sentido</em> para seu negócio.
          </h1>

          <p class="lead">
            Criamos sites e ferramentas com IA para simplificar
            sua rotina, organizar o atendimento e ajudar seu
            negócio a dar o próximo passo.
          </p>

          <div class="actions">
            ${button('Conhecer soluções', 'servicos.html')}
            ${button('Pedir um orçamento', 'orcamento.html', true)}
          </div>

          <p class="hero-note">
            Para lojas, restaurantes, salões e quem trabalha
            por conta própria.
          </p>
        </div>

        <aside class="hero-panel">
          <span class="panel-kicker">
            Simples, útil e sob medida
          </span>

          <h2>
            Seu desafio.<br>
            Nossa solução.
          </h2>

          <div class="flow-window">
            <div class="window-dots" aria-hidden="true">
              ● ● ●
            </div>

            <div class="flow">
              <div>
                Problema
                <small>do negócio</small>
              </div>

              <span aria-hidden="true">→</span>

              <div>
                Solução
                <small>digital</small>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section class="intro-banner">
        <div>
          <h2>
            Não precisa entender de tecnologia para começar.
          </h2>

          <p>
            A Haro transforma suas ideias em soluções práticas.
          </p>
        </div>

        ${button('Vamos conversar', 'orcamento.html')}
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <p class="eyebrow">Como podemos ajudar</p>

            <h2>
              Ferramentas úteis.<br>
              Sem complicar a conversa.
            </h2>
          </div>

          <a class="text-link" href="servicos.html">
            Ver todos os serviços ↗
          </a>
        </div>

        <div class="intro-grid">
          <article>
            <span class="small-num">01 / PRESENÇA</span>
            <h3>Seu negócio na internet</h3>

            <p>
              Sites e catálogos para apresentar o que você
              oferece e facilitar o contato.
            </p>
          </article>

          <article>
            <span class="small-num">02 / ORGANIZAÇÃO</span>
            <h3>Uma rotina mais organizada</h3>

            <p>
              Vendas, estoque, agenda e atendimento com
              ferramentas pensadas para você.
            </p>
          </article>

          <article>
            <span class="small-num">03 / TEMPO</span>
            <h3>Mais tempo para o que importa</h3>

            <p>
              Consultoria em IA e automações para reduzir
              tarefas repetitivas.
            </p>
          </article>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <p class="eyebrow">Da ideia à prática</p>
            <h2>Conheça projetos desenvolvidos.</h2>
          </div>

          <a class="text-link" href="projetos.html">
            Explorar portfólio ↗
          </a>
        </div>

        <div class="projects">
          ${projectCards}
        </div>
      </section>

      <section class="section process">
        <div>
          <p class="eyebrow">Um passo de cada vez</p>

          <h2>
            Você conhece o negócio.<br>
            A gente conversa sobre a tecnologia.
          </h2>
        </div>

        <ol>
          <li>
            <strong>Você conta sua ideia</strong>

            <p>
              Explique o que precisa melhorar.
              Não precisa conhecer termos técnicos.
            </p>
          </li>

          <li>
            <strong>Definimos o que faz sentido</strong>

            <p>
              Combinamos o que será feito, o prazo e
              o orçamento antes de começar.
            </p>
          </li>

          <li>
            <strong>Construímos com você</strong>

            <p>
              Você acompanha e valida o resultado.
              A entrega inclui orientação de uso.
            </p>
          </li>
        </ol>
      </section>

      ${cta}
    `
  },

  'servicos.html': {
    title: 'Nossos serviços',

    body: `
      ${heading(
        'Catálogo de serviços',
        'O que seu negócio<br>precisa hoje?',
        'Do primeiro site à organização da rotina, encontre um ponto de partida. O projeto é definido com você, de acordo com a sua necessidade.'
      )}

      <section class="services" aria-label="Catálogo">
        ${services || '<p>Novos serviços em breve.</p>'}
      </section>

      <p class="scope-note">
        Cada orçamento detalha as entregas, os prazos e
        eventuais custos de ferramentas externas.
        Não precisa saber qual serviço escolher:
        podemos conversar sobre isso.
      </p>

      ${cta}
    `
  },

  'projetos.html': {
    title: 'Projetos desenvolvidos',

    body: `
      ${heading(
        'Nosso portfólio',
        'Ideias que já<br>viraram ferramentas.',
        'Conheça dois projetos desenvolvidos para a Respeita! e veja formas de transformar informação em acesso.'
      )}

      <section
        class="projects"
        aria-label="Projetos desenvolvidos"
      >
        ${projectCards || '<p>Novos projetos em breve.</p>'}
      </section>

      ${cta}
    `
  },

  'orcamento.html': {
    title: 'Peça um orçamento',

    body: `
      ${heading(
        'Vamos conversar',
        'O primeiro passo<br>é uma boa conversa.',
        'Conte um pouco sobre seu negócio. Vamos levar sua mensagem para o WhatsApp, onde você poderá conversar com a Haro.'
      )}

      <div class="contact-grid">
        <aside class="contact-note">
          <h2>
            Não precisa ter<br>
            tudo resolvido.
          </h2>

          <p>
            Uma ideia, uma dificuldade ou uma tarefa que
            toma muito tempo já são um começo.
          </p>

          <ol>
            <li>Preencha os campos ao lado.</li>
            <li>Abra a mensagem no WhatsApp.</li>
            <li>Confira e toque em enviar.</li>
          </ol>

          <p class="small">
            O orçamento é combinado conforme o projeto.
            Solicitar uma proposta não é contratar o serviço.
          </p>
        </aside>

        <form id="quote-form" novalidate>
          <div class="field">
            <label for="name">
              Como podemos chamar você?
            </label>

            <input
              id="name"
              name="name"
              autocomplete="name"
              maxlength="80"
              minlength="2"
              required
              placeholder="Seu nome"
              aria-describedby="name-error"
            >

            <span class="error" id="name-error"></span>
          </div>

          <div class="field">
            <label for="business">
              Qual é o seu negócio?
            </label>

            <input
              id="business"
              name="business"
              autocomplete="organization"
              maxlength="100"
              minlength="2"
              required
              placeholder="Ex.: salão, restaurante, loja de roupas"
              aria-describedby="business-error"
            >

            <span class="error" id="business-error"></span>
          </div>

          <div class="field">
            <label for="service">
              Como podemos ajudar?
            </label>

            <select
              id="service"
              name="service"
              required
              aria-describedby="service-error"
            >
              <option value="">Selecione uma opção</option>

              ${c.services.map(s => `
                <option value="${e(s.id)}">
                  ${e(s.title)}
                </option>
              `).join('')}

              <option value="nao-sei">
                Ainda não sei — preciso de orientação
              </option>
            </select>

            <span class="error" id="service-error"></span>
          </div>

          <div class="field">
            <label for="message">
              O que você gostaria de melhorar?
            </label>

            <textarea
              id="message"
              name="message"
              rows="5"
              minlength="10"
              maxlength="1000"
              required
              placeholder="Conte sua ideia ou o que está difícil na rotina…"
              aria-describedby="message-error"
            ></textarea>

            <span class="error" id="message-error"></span>
          </div>

          <p class="privacy">
            Estas informações não são salvas em um cadastro
            da Haro. Ao continuar, elas serão incluídas no
            link aberto no WhatsApp. Envie apenas informações
            necessárias ao orçamento.
          </p>

          <p
            id="form-status"
            role="status"
            aria-live="polite"
          ></p>

          <button class="button" type="submit" disabled>
            Continuar no WhatsApp
            <span aria-hidden="true">↗</span>
          </button>

          <noscript>
            <p>
              Ative o JavaScript no navegador para
              preparar sua mensagem.
            </p>
          </noscript>

          <p class="small">
            A mensagem só será enviada quando você
            confirmar no WhatsApp.
          </p>
        </form>
      </div>
    `
  }
};

await rm('dist', {
  recursive: true,
  force: true
});

await mkdir('dist', {
  recursive: true
});

for (const [file, page] of Object.entries(pages)) {
  const html = `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8">

        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        >

        <meta name="theme-color" content="#aa252a">

        <meta
          name="description"
          content="Haro Consultoria: sites, catálogos digitais, organização do negócio e ferramentas com inteligência artificial. Peça um orçamento."
        >

        <title>${e(page.title)} | ${e(c.brand)}</title>

        <link rel="stylesheet" href="styles.css">
        <script type="module" src="app.js"></script>
      </head>

      <body>
        <a class="skip" href="#conteudo">
          Ir para o conteúdo
        </a>

        <header>
          <div class="header-inner">
            <a
              class="brand"
              href="index.html"
              aria-label="Haro Consultoria — início"
            >
              haro
              <span>consultoria</span>
            </a>

            <nav aria-label="Menu principal">
              <a
                class="desktop-link"
                href="servicos.html"
                ${file === 'servicos.html' ? 'aria-current="page"' : ''}
              >
                Serviços
              </a>

              <a
                class="desktop-link"
                href="projetos.html"
                ${file === 'projetos.html' ? 'aria-current="page"' : ''}
              >
                Projetos
              </a>

              <details id="main-menu">
                <summary aria-label="Menu de navegação">
                  <span class="hamburger" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </summary>

                <div class="submenu">
                  ${nav.map(([url, label]) => `
                    <a
                      href="${url}"
                      ${url === file ? 'aria-current="page"' : ''}
                    >
                      ${label}
                    </a>
                  `).join('')}
                </div>
              </details>

              <a class="header-cta" href="orcamento.html">
                Pedir orçamento ↗
              </a>
            </nav>
          </div>
        </header>

        <main id="conteudo">
          ${page.body}
        </main>

        <footer>
          <a class="brand" href="index.html">
            haro
            <span>consultoria</span>
          </a>

          <p>
            Tecnologia com propósito.<br>
            Conversa sem complicação.
          </p>

          <div>
            <a href="servicos.html">Serviços</a>
            <a href="projetos.html">Projetos</a>
            <a href="orcamento.html">Contato e orçamento</a>
          </div>

          <small>
            © ${new Date().getFullYear()} Haro Consultoria
          </small>
        </footer>
      </body>
    </html>
  `;

  await writeFile(`dist/${file}`, html);
}

for (const name of [
  'styles.css',
  'app.js',
  'core.js',
  'content.json'
]) {
  await copyFile(`src/${name}`, `dist/${name}`);
}

await writeFile(
  'dist/404.html',
  `<!doctype html>
  <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1"
      >
      <link rel="stylesheet" href="styles.css">
      <title>Página não encontrada | Haro</title>
    </head>

    <body>
      <main class="page-heading">
        <p class="eyebrow">Haro Consultoria · 404</p>
        <h1>Essa página não está aqui.</h1>

        <p>
          <a class="button" href="/">Voltar ao início</a>
        </p>
      </main>
    </body>
  </html>`
);

await writeFile(
  'dist/_headers',
  `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'
`
);

console.log('Site gerado em dist/.');

if (!c.whatsapp) {
  console.warn(
    'PENDÊNCIA: configure whatsapp em src/content.json antes do lançamento.'
  );
}
