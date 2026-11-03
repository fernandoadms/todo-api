# todo-api

Primeira API backend do Fernando, que é frontend sênior (15+ anos de React, Next.js e TypeScript) e nunca colocou um backend em produção. O objetivo é ter uma API REST de tarefas no ar, testada e com README até 07/11/2026, construída por ele.

## Como trabalhar aqui

- **O Fernando digita todo o código.** Não crie nem edite arquivos de código deste projeto, nem mostre a solução pronta. Use o modo da skill `/mentor`: pergunte, explique o conceito, revise com `arquivo:linha` e deixe a correção para ele.
- Ele tem TDAH. Cada dia precisa terminar com algo novo no ar. Ideias fora da fatia do dia vão para o `BACKLOG.md`, não para o código.

## Decisões (03/11/2026)

| Tema | Decisão | Por quê |
|---|---|---|
| Stack | Node + Express 5 + TypeScript | Mercado de vagas Node; ele já domina TS |
| Validação | À mão no dia 2; refatorar para Zod no dia 5 | Sentir o problema antes de usar a ferramenta |
| Banco | Postgres no **Neon**, com Prisma | Neon é só o banco (o Supabase traria API e login prontos, que são o que ele precisa aprender); o Postgres grátis do Render expira em 30 dias. Ler o `migration.sql` que o Prisma gerar |
| Deploy | Render (grátis), desde o dia 1 | Deploy pelo GitHub sem cartão; dorme após 15 min sem uso |
| Testes | Vitest + Supertest, CI no GitHub Actions | API do Jest sem configuração; teste HTTP real sem subir servidor |

## Fatias diárias

1. **Ter 03/11:** repositório, Express + TS, `GET /health` → `{ status: "ok" }`, deploy no Render. Entrega: URL pública respondendo.
2. **Qua 04/11:** CRUD em memória (`POST /tasks`, `GET /tasks`, `GET /tasks/:id`, `PATCH /tasks/:id`, `DELETE /tasks/:id`), validação manual, status 201/200/204/400/404. Entrega: CRUD por curl na URL pública.
3. **Qui 05/11:** Neon + Prisma (modelo `Task`: id, title, done, createdAt, updatedAt), migration, troca da memória pelo banco e uma consulta SQL escrita à mão no console do Neon. Entrega: os dados sobrevivem a um redeploy.
4. **Sex 06/11:** testes de integração dos 5 endpoints e CI. Entrega: CI verde.
5. **Sáb 07/11:** validação com Zod (os testes do dia 4 garantem que nada quebrou), `GET /tasks?done=true`, tratamento central de erros e README com exemplos de curl. Entrega: repositório pronto para mostrar.

Se uma fatia não couber no dia, ela vai para o dia seguinte. Nada novo entra no meio da semana.

## Depois de 07/11

Escolher entre autenticação (usuário + JWT) ou retomar o atendente de WhatsApp da Martins Serviços (pausado em 03/11). Não decidir antes de terminar a fatia 5.
