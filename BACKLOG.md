# Backlog

Ideias e problemas encontrados fora da fatia do dia.

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
