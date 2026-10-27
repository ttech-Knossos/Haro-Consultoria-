# Haro Consultoria — primeira versão

Adaptado visualmente do protótipo HTML fornecido: títulos grandes, cartões arredondados, bloco problema/solução e faixa de convite, com a paleta ajustada para vermelho e branco.

Site público de apresentação, catálogo, portfólio e orçamento pelo WhatsApp. Visual vermelho e branco quente, linguagem simples, sem logo gráfica. O nome em texto funciona como identificação provisória.

## O que está pronto

- Início, Serviços, Projetos e Orçamento em páginas próprias.
- Menu com submenu “Explorar”, acessível por clique e teclado.
- Sete serviços, sem preços; cada serviço leva ao formulário pré-selecionado.
- Guia de Retificação e Central de Links da Respeita! no portfólio.
- Ilustrações abstratas identificadas como ilustrações, não capturas reais dos projetos.
- Formulário com nome, negócio, serviço e descrição; monta mensagem e abre WhatsApp.
- Nenhum cadastro de clientes, banco de dados, login, painel ou rastreador instalado.
- Conteúdo editável em src/content.json.
- 17 testes automatizados e workflow do GitHub Actions.

## Pendência obrigatória: número da Haro

Abra `src/content.json`. Na linha `"whatsapp": ""`, preencha o número comercial completo, com código do Brasil, DDD e número, apenas dígitos. Formato: `55` + `DDD` + `número`. Não use espaços, parênteses ou sinal de +. Não use um número de exemplo em produção.

Sem número, o site pode ser visualizado, mas o botão do WhatsApp permanece desativado. A verificação de lançamento bloqueia a publicação se o campo estiver ausente ou inválido. A validação de formato não comprova que o número existe ou pertence à Haro: confirme manualmente no lançamento.

## Como funciona cada ferramenta

- GitHub: guarda e versiona o código e executa testes.
- Cloudflare Pages: hospeda as páginas e fornece um endereço `*.pages.dev`, conforme disponibilidade do nome.
- Claude: opcional. O projeto já está implementado. O arquivo PROMPT-CLAUDE.md é uma alternativa independente para reconstruir ou adaptar.
- Supabase: desnecessário nesta versão, pois nenhum pedido é salvo. Pode entrar numa segunda etapa, com painel administrativo, autenticação e permissões.

A navegação dos visitantes é gratuita. Os serviços da Haro são contratados por orçamento; não são oferecidos gratuitamente. Os planos gratuitos de infraestrutura têm limites e condições que podem mudar. Não há dependência paga incluída no código.

## Publicar pelo GitHub + Cloudflare Pages

1. Extraia este ZIP no computador.
2. Crie um repositório chamado `haro-consultoria` no GitHub. Pode ser privado; autorize o Cloudflare a acessar apenas o repositório necessário.
3. Envie o CONTEÚDO da pasta `haro-consultoria` para a raiz do repositório. `package.json` e `src/` precisam estar na raiz, não dentro de outra pasta. Não envie só o ZIP.
4. Inclua a pasta `.github/workflows` para os testes automáticos. Algumas telas de upload escondem pastas que começam com ponto. Nesse caso, use “Add file > Create new file” e crie `.github/workflows/checks.yml` com o conteúdo fornecido.
5. Preencha o WhatsApp em `src/content.json` e salve a alteração.
6. No painel Cloudflare, abra Workers & Pages e escolha criar um projeto Pages conectado ao GitHub (os nomes dos menus podem variar). Selecione o repositório e a branch principal.
7. Use estas configurações:
   - Framework preset: None / nenhum.
   - Build command: `npm run check && npm run check:release`
   - Build output directory: `dist`
   - Root directory: deixe em branco se os arquivos estão na raiz.
   - Variável de build `NODE_VERSION`: `22`.
8. Publique e use o endereço `*.pages.dev` que o Cloudflare retornar. O nome `haro-consultoria` é uma sugestão, não uma reserva de domínio.
9. Abra o site no celular, teste o menu e faça uma solicitação de teste para o WhatsApp da Haro. Confira o destinatário e a mensagem antes de enviar.
10. Nas próximas alterações, edite o conteúdo e faça commit. O Cloudflare conectado à branch volta a gerar o site. Como os testes estão no comando de build, uma falha impede que aquela versão seja publicada.

Não é necessário configurar GitHub Pages: para este catálogo comercial, use GitHub como repositório e Cloudflare como hospedagem. O GitHub Pages tem restrições para sites voltados a negócios/transações comerciais.

A pasta `dist/` incluída é uma cópia já gerada para inspeção. O build do Cloudflare recria essa pasta a partir de `src/`. Não edite o conteúdo apenas em `dist/`: ele será sobrescrito. A `.gitignore` exclui `dist/` de commits feitos por Git.

## Ver localmente

Com Node.js 22 ou superior instalado, abra o terminal na pasta do projeto:

```sh
npm run check
npm start
```

Acesse http://localhost:3000. Não abra o HTML por duplo clique: o formulário usa módulos JavaScript e leitura de JSON por HTTP. Não há dependências externas para instalar. Para testar a configuração antes do lançamento:

```sh
npm run check:release
```

Esse comando falha intencionalmente enquanto o WhatsApp estiver vazio. Ele não faz parte do teste da interface e não deve ser contornado na publicação definitiva.

## Editar serviços, projetos e aparência

- Textos, links, lista de serviços e número: `src/content.json`.
- Layout e textos institucionais das páginas: `scripts/build.mjs`.
- Cores, tamanhos, espaçamentos e adaptação de tela: `src/styles.css`.
- Interação e formulário: `src/app.js`.
- Validações e montagem do link: `src/core.js`.

Para adicionar um serviço, copie um objeto do array `services`, escolha um `id` único em letras minúsculas sem espaços e preencha título, resumo, exemplo e itens. Ele aparece automaticamente no catálogo e no formulário. Os testes de quantidade inicial precisam ser atualizados quando você expandir o catálogo.

Para adicionar um projeto, copie um objeto do array `projects`, use ID único e link HTTPS. As artes atuais são estilizações dos dois casos iniciais; ajuste o componente visual em `build.mjs` para novos projetos ou para incluir capturas autorizadas. Não há upload de imagem nesta versão.

Links de portfólio configurados a partir das informações fornecidas:
- https://guiaderetificacaorespeita.pages.dev/
- https://respeita.pages.dev/

A ferramenta de consulta não conseguiu acessar esses dois sites durante a entrega. A disponibilidade externa não está confirmada: abra os links e valide antes de divulgar.

## Testes e alcance da verificação

Executados nesta entrega: `npm run check`, com 17 testes aprovados e geração de páginas concluída. Os testes verificam campos vazios, limites, caracteres especiais, serviço inválido, número ausente, protocolos inseguros, escape de HTML, arquivos, links locais, estrutura acessível do formulário e caminhos de orçamento.

Verificado em navegador desktop: página inicial, aparência do topo, abertura do submenu, navegação para Serviços, navegação para Orçamento com “Catálogo digital” pré-selecionado, aviso e botão bloqueado sem WhatsApp.

Não executado: envio real pelo WhatsApp, validação em aparelho móvel, testes ponta a ponta automatizados em navegador, auditoria completa de acessibilidade ou publicação em contas GitHub/Cloudflare. O CSS inclui adaptação móvel, mas ainda precisa de conferência num aparelho real. Os testes não garantem ausência de bugs.

Checklist manual antes de divulgar:
- Navegar a 360 px, 768 px e desktop sem cortes horizontais.
- Abrir e fechar menu por teclado; pressionar Escape fecha o submenu.
- Visitar os dois projetos e conferir a identidade de cada site.
- Configurar o telefone e tentar enviar campos vazios: deve apontar erros.
- Escolher “Ainda não sei”, preencher acentos e conferir a mensagem no WhatsApp.
- Voltar do WhatsApp e conferir o comportamento do navegador.
- Confirmar número, serviços, entregas prometidas e autorização de exibição do portfólio.

## Dados e custos futuros

O formulário não grava dados em banco nem localStorage. A mensagem é codificada na URL do WhatsApp, podendo ficar no histórico e ser processada pelo serviço ao abrir o link. A Haro recebe a mensagem quando o visitante a envia. A hospedagem pode manter seus registros operacionais próprios. Não inclua informações sensíveis no pedido.

Ferramentas criadas para futuros clientes podem exigir serviços pagos, especialmente APIs de IA, mensagens oficiais do WhatsApp e bancos com maior volume. Esses custos precisam ser definidos no orçamento; a hospedagem gratuita deste catálogo não significa que todas as soluções terão operação gratuita.

## Referências de publicação consultadas

- https://developers.cloudflare.com/pages/configuration/build-configuration/
- https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
- https://developers.cloudflare.com/pages/platform/limits/
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
