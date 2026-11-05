# Backlog

Ideias e problemas encontrados fora da fatia do dia.

## Pendente da fatia 2

A fatia 2 foi entregue em 04/11, no commit `82bcba1`: os 5 endpoints foram testados por curl na URL pública. Falta só um item:

- **Confirmar o portão de tipos no Render.** O Build Command precisa ser `npm install && npm run typecheck`. No log do deploy, procure a linha `> tsc --noEmit`. Se ela não estiver lá, o código com erro de tipo continua indo para produção.

## Infra e configuração

- **Porta vinda do ambiente — EM ANDAMENTO, o app não sobe.** Em 04/11 às 11:50, o `src/app.ts` ficou sem commit e quebrado: `src/app.ts:20` lê `process.env.API_URL` com padrão `'http://localhost:4000'`, e `src/app.ts:123` passa essa URL para o `app.listen`, que falha com `listen EACCES`. Faltam duas correções: ler a variável que o Render cria (`PORT`) e passar uma **porta** para o `listen`, com `3000` como padrão. Teste: `PORT=4000 npm run dev` deve subir na 4000, e `npm run dev` na 3000. **Não faça commit antes disso.** Produção está segura no commit `82bcba1`.
- **Fixar a versão do Node.** O campo `engines` foi removido do `package.json`. Rodar `.ts` direto exige Node `>=22.18.0` (sem a flag `--experimental-strip-types`). Sem esse campo, o deploy depende do Node padrão do Render.

## Respostas 500 expõem o stack trace — fatia 5 (tratamento central de erros)

**Visto em 03/11/2026.** Um `POST /tasks` sem corpo quebrou na desestruturação do `req.body`. O Express respondeu `500` com uma página HTML contendo o stack trace completo:

```
TypeError: Cannot destructure property 'title' of 'req.body' as it is undefined.
    at file:///home/fernandoadms/workspace/dev/todo-api/src/app.ts:25:11
    at Layer.handleRequest (/home/fernandoadms/workspace/dev/todo-api/node_modules/router/lib/layer.js:152:17)
    ...
```

**Por que é um problema:** a resposta revela caminhos do servidor, a estrutura de pastas e as bibliotecas usadas. Quem ataca a API usa isso para mapear o sistema. Além disso, o cliente esperava JSON e recebeu HTML.

**O que fazer na fatia 5:**

- Middleware de erro central, com 4 parâmetros: `(err, req, res, next)`.
- Responder sempre JSON, por exemplo `{ "error": "Internal server error" }`, sem o stack trace.
- Registrar o erro completo no log do servidor (`console.error`), que só você vê no Render.
- Pesquisar o que o `NODE_ENV=production` muda no handler de erro padrão do Express.

O bug que causou o 500 já foi corrigido com `req.body ?? {}`. O item aqui é a proteção para os próximos erros que ninguém previu.
