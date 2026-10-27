# Roteiro de testes de aceitação

Execute `npm run check` primeiro. Configure um WhatsApp comercial real que pertença à Haro e execute `npm run check:release`.

| Cenário | Ação | Resultado esperado |
| --- | --- | --- |
| Menu | Abrir Explorar, navegar com Tab, fechar com Escape | Links acessíveis; foco retorna ao botão do menu |
| Catálogo | Abrir os detalhes de cada serviço | Texto visível e conteúdo sem corte |
| Escolha | Pedir orçamento de Catálogo digital | Formulário já seleciona Catálogo digital |
| URL desconhecida | Usar `?servico=inexistente` | Nenhum serviço inválido selecionado |
| Vazio | Clicar em continuar sem preencher | Erros visíveis; foco no primeiro campo inválido |
| Espaços | Preencher nome só com espaços | Campo recusado |
| Tamanho | Inserir descrição menor que 10 caracteres | Campo recusado |
| Sem escolha | Selecionar Ainda não sei | Formulário pode prosseguir |
| Acentos | Preencher nome e texto com ç, ã, &, + | Mensagem no WhatsApp preserva o texto |
| Destinatário | Abrir mensagem válida | Número pertence à Haro, nunca a um número de exemplo |
| Confirmação | Abrir WhatsApp | Mensagem preparada, não enviada automaticamente |
| Sem número | Limpar configuração e gerar novamente | Botão desativado; explicação disponível |
| Falha de carregamento | Indisponibilizar content.json em ambiente de teste | Aviso de falha, envio desativado |
| Celular | Visitar a 360 px e no aparelho real | Sem rolagem horizontal; campos e botões utilizáveis |
| Portfólio | Abrir os dois links | Projetos corretos em nova aba |
| Página ausente | Abrir caminho inexistente no Cloudflare | Página 404 com caminho de volta |

Este roteiro não representa testes executados. Veja LEIA-ME.md para o registro do que foi efetivamente verificado na entrega.
