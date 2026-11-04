# Backlog

Ideias e problemas encontrados fora da fatia do dia.

## Pendências da fatia 2 — terminar em 04/11

Estado em 03/11 às 23:40: o CRUD funciona no servidor local, mas as últimas mudanças em `src/app.ts` **ainda não foram commitadas**. A URL pública roda o commit `caff274`, que ainda não tem a validação de tipos do `PATCH` nem o `204` do `DELETE`.

1. **Validação do id por lista branca.** A checagem atual (`src/app.ts:52`, `74` e `111`) bloqueia formatos um a um e ainda deixa passar `1e0`, `" 1"`, `+1`, `0b1` e `01`, que devolvem a tarefa 1. Troque por uma regra que descreva o id válido ("só dígitos, do início ao fim", inteiro > 0).
2. **Extrair a validação do id para uma função.** Hoje ela está copiada em 3 rotas.
3. **Remover código morto:**
   - `src/app.ts:56-58`: o `if` de inteiro nunca executa, porque a linha 52 já cobre esse caso.
   - O `{ message: 'Task deleted' }` do `DELETE`: o Express descarta o corpo de uma resposta 204.
   - O comentário de `src/app.ts:51`: ele diz que `999` não deve passar, mas `999` é um id válido e deve dar 404.
4. **Simplificar a fase de aplicação do `PATCH`.** Os `if` de `src/app.ts:97` e `101` podem testar só `!== undefined`, porque a fase de validação já garantiu os tipos.
5. **Commit, push e teste por curl na URL pública** dos 5 endpoints: `201`/`200`/`204`/`400`/`404`. Essa é a entrega da fatia.
6. **Confirmar o portão de tipos no Render.** O Build Command precisa ser `npm install && npm run typecheck`. No log do deploy, procure a linha `> tsc --noEmit`.

## Infra e configuração

- **Porta vinda do ambiente.** `app.listen(3000)` está fixo. Hoje funciona porque o Render detecta a porta, mas quem deve escolher a porta é o ambiente (`process.env.PORT`), com `3000` só como padrão local.
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
