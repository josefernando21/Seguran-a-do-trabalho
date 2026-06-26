Passos para corrigir o carregamento de CSS/JS no Render (assets 404)

1) Objetivo
- Garantir que o Render realmente contenha e sirva a pasta /assets.
- Hoje: GET /assets/styles.css no Render retorna 404.

2) Causa típica
- O Render está fazendo deploy de um diretório/branch sem a pasta assets.
- Ou o server do Render não está servindo o diretório correto.

3) Correção no código
- Atualizar server.js para servir assets de forma inequívoca, usando path.resolve e fallback sem “serve tudo”.

4) Correção na configuração
- Garantir que assets esteja no repositório que está sendo deployado.
- Commit e re-deploy.

5) Testes após deploy
- Verificar:
  - /assets/styles.css -> 200 text/css
  - /assets/script.js -> 200 application/javascript
  - / -> HTML com CSS aplicado

