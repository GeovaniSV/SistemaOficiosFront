# CONTINUACAO.hugo.md — Sessão CRUD Usuários/Cargos/Templates

Contexto de handoff para continuar a sessão de **2026-06-18** (branch `ajustesHugo`).

---

## Pedido original do usuário

1. Testar o CRUD de Usuários para verificar se está funcionando.
2. Implementar o CRUD de Cargos.
3. Implementar o CRUD de Templates de Ofício.

**Limitações impostas:**
- Não tocar no CRUD de Papéis (permissions não implementadas na API).
- Não tocar, **em hipótese alguma**, em Contatos ou Ofícios e suas telas, mesmo havendo erro.

---

## Decisões já tomadas com o usuário (não re-perguntar)

- **Cargos:** inicialmente confirmado que a API não tinha nenhum endpoint de Positions (`CONFLITO-004` no `CONFLITO.md` da raiz). Usuário pulou Cargos na primeira rodada. **Em 2026-06-18 (mais tarde) o usuário implementou o backend de Positions** (`Route::apiResource('positions', PositionController::class)`, CRUD completo incluindo DELETE) e pediu para atualizar o CRUD de Cargos no front — **isso já foi feito** (ver seção abaixo). `CONFLITO-004` está desatualizado agora, mas não foi removido do `CONFLITO.md` (não tive instrução pra isso).
- **Teste de Usuários:** não há credenciais válidas para a API de produção (`https://arcologia.mirtilo.dev.br` — seeders padrão `admin@admin.com`/`admin12345` e `dev@dev.com`/`dev12345` retornam "Credenciais inválidas" nesse ambiente). Usuário pediu para **avaliar estaticamente** o front em relação às rotas do back (sem precisar de login real) e corrigir o que estiver mal implementado.

---

## O que já foi feito

### 1. Usuários (`src/components/Usuarios.tsx` + `src/hooks/queries/useUsers.ts`)
Conectado à API real (`/api/users`), substituindo o `useAppStore` (mock local). Bugs encontrados e corrigidos:

- **Faltava campo de senha** no formulário de criação — `StoreUserRequest` exige `password` (min 8). Adicionado campo só quando `!isExistingUser`.
- **Papéis (`role`) hardcoded errados** — o front tinha `Administrador/Gestor/Usuário`, mas os papéis seedados no backend (`RolesAndPermissionsSeeder`) são `Administrador`, `Usuário Padrão`, `Visualizador`. Corrigido o `<select>`.
- **`is_active` nunca é aplicado via `PUT /api/users/{id}`** — o `UserService::update()` do backend sempre faz `unset($data['is_active'])`. O status só pode mudar via `DELETE /api/users/{id}` (soft delete → inativo) e `PATCH /api/users/{id}/restore` (→ ativo). Implementado: ao salvar, se o toggle de status mudou em relação ao valor original (`initialStatus`), chama o endpoint dedicado certo.
- **`position_id` (Cargo)** — na primeira rodada não havia endpoint de positions, então não era enviado. **Atualizado em 2026-06-18** (ver seção 2.5): agora usa `useCargos()` de verdade e envia `position_id` no payload.
- Adicionado loading/error state na listagem (`isLoading`/`isError` do React Query).
- Tratamento de erro 422 da API mostrando a primeira mensagem de validação no toast.
- **Bug pré-existente corrigido**: `Usuarios.tsx` passava props `currentView`/`onNavigate`/`onLogout` para `Sidebar`/`Header` que esses componentes não aceitam (erro de TypeScript `TS2322`). Removidas as props inválidas (mesmo padrão já usado em `Templates.tsx`/`Cargos.tsx`).

> **Limitação conhecida (não resolvida, é conflito de API):** a API não faz eager-load de `position`/`roles` no `GET /api/users` (nem no `show`), então as colunas "Cargo" e "Papel" na listagem ficam em branco (`-`) até o backend passar a retornar essas relações. Isso não é um bug do front — é o `UserService::list()` do backend que só faz `User::where('is_dev', false)->paginate(20)` sem `->with(['position', 'roles'])`.

### 2. Templates de Ofício (`src/components/Templates.tsx` + `src/hooks/queries/useTemplates.ts` — novo arquivo)
Conectado à API real (`/api/oficio-templates`), substituindo o `useAppStore`.

- Adapter mapeia `name` (API) ↔ `title` (campo usado no componente).
- Sem endpoint de `DELETE` na API (`Route::apiResource(...)->except('destroy')`) — não foi adicionado botão de excluir (já não existia).
- O campo "status" (ativo/inativo) do formulário **não existe no backend** (`OficioTemplate` só tem `name`/`content`) — o toggle continua na UI (não é estrutural) mas não é enviado no payload; não tem efeito real, é só visual.
- Loading/error state e tratamento de erro 422 adicionados, igual Usuários.

### 2.5 Cargos / Positions (`src/components/Cargos.tsx` + `src/hooks/queries/useCargos.ts` — novo + `src/components/CargoDeleteModal.tsx` — novo)
Adicionado em 2026-06-18 depois que o usuário implementou o backend (`PositionController`, `PositionService`, `StorePositionRequest`/`UpdatePositionRequest`, rota `Route::apiResource('positions', ...)` — CRUD completo, incluindo `DELETE` real, sem soft-delete).

- `useCargos.ts`: `useCargos` (GET, adapta `is_active` → `status: "ativo"/"inativo"`), `useAddCargo` (POST), `useUpdateCargo` (PUT), `useDeleteCargo` (DELETE).
- `Cargos.tsx`: ligado à API real (antes era 100% mock via `useAppStore`). Loading/error state, tratamento de erro 422 igual aos outros módulos.
- **Diferente de Usuários:** `is_active` aqui é só uma coluna normal (`PositionService::update` não dá `unset`), então o toggle de status pode ir direto no `PUT` — não precisa do truque de endpoint dedicado.
- **Excluir Cargo (novo):** como a API agora tem `DELETE /api/positions/{id}` (hard delete, sem soft-delete), adicionei a ação "Excluir Cargo" no menu de contexto (desktop + mobile) com confirmação via `CargoDeleteModal.tsx` — segue exatamente o mesmo padrão de `UsuarioDeleteModal.tsx`/`ContatoDeleteModal.tsx` (que já existiam no projeto mas não eram usados em nenhum lugar). Isso é a única adição "estrutural" de JSX que fiz nessa parte; achei justificado porque sem isso o CRUD ficaria sem o "D".
- **Bônus:** como Positions agora existe e tem IDs reais, atualizei também o campo "Cargo" do formulário de Usuários (`Usuarios.tsx` + `useUsers.ts`) pra parar de usar a lista hardcoded de texto e passar a usar `useCargos()` de verdade, enviando `position_id` (int) no `POST`/`PUT /api/users`. Campo deixou de ser obrigatório (era uma exigência só do front, mas a API trata `position_id` como `nullable`).
  - **Limitação que continua:** a coluna "Cargo" (e "Papel") na listagem de usuários continua em branco, porque `UserService::list()` no backend ainda não faz eager-load de `position`/`roles` (`User::where('is_dev', false)->paginate(20)`, sem `->with(...)`). Isso é puramente do lado da API — não posso alterar `SistemaOficios/api` sem pedido explícito. A escrita (criar/editar usuário com cargo) já funciona; é só a leitura/exibição na tabela que ainda não retorna o nome do cargo.

### 3. Rotas (`src/main.tsx`)
Adicionadas as rotas que **faltavam completamente** (por isso o CRUD de Usuários "não funcionava" — a rota nem existia, navegar para `/usuarios` caía no wildcard `*` → redirect pro `/login`):
```tsx
{ path: "/usuarios", element: <Usuarios /> },
{ path: "/templates", element: <Templates /> },
{ path: "/cargos", element: <Cargos /> },
```
Ficaram **fora** do `AppLayout` (top-level, como `/login`), porque `Usuarios.tsx`/`Templates.tsx`/`Cargos.tsx` já renderizam seu próprio `Sidebar`/`Header` internamente — colocar dentro do `AppLayout` duplicaria esses componentes.

### 4. Validação
- `npm run lint` (`tsc --noEmit`) rodado de novo após as mudanças de Cargos: **nenhum erro novo introduzido**. Os erros restantes continuam todos pré-existentes e fora de escopo (arquivos de Ofícios: `ArquivarOficio.tsx`, `Oficios.tsx`, `OficiosList.tsx`, `useAppStore.ts`, e `Dashboard.tsx` que não foi pedido).
- **Ainda não validei visualmente no navegador** as telas de Cargos (mesmo bloqueio do bug crítico abaixo).

---

## ⚠️ Onde parei — achado crítico, não resolvido

Ao tentar validar visualmente no navegador (rodando `npm run dev` + testando via `curl` os módulos transformados pelo Vite), descobri que **o app inteiro está quebrado em runtime real de navegador**, independente do meu trabalho:

- `src/main.tsx` faz `import Oficios from "./components/Oficios.tsx";` (import estático, não usado — a rota dele já está comentada: `// { path: "/oficios", element: <Oficios /> }`).
- `Oficios.tsx` importa `import { useOficios } from "../hooks/useOficios";` — esse arquivo **não existe** nesse caminho (o real é `src/hooks/queries/useOficios.ts`).
- Confirmado ao vivo: `curl http://localhost:3000/src/components/Oficios.tsx` retorna **HTTP 500** do Vite ("Failed to resolve import... Does the file exist?").
- Como ES modules resolvem todos os imports estáticos antes de executar qualquer código do módulo, isso provavelmente impede que **main.tsx execute o `ReactDOM.render`** — ou seja, a aplicação pode estar de tela branca em qualquer rota (`/login` incluído) num navegador real agora mesmo. Isso é **anterior** às minhas mudanças, não foi causado por mim.
- `npm run build` (produção) também falha, mas em outro import quebrado primeiro: `OficiosFilter.tsx` importa `date-fns`, que está no `package.json` mas **não está instalado** em `node_modules` (proteja: rodar `npm install` resolveria isso, mas não fiz porque não foi pedido e é mudança de ambiente).

**Esses dois bugs vivem em arquivos de Ofícios** (`Oficios.tsx`, `OficiosFilter.tsx`) — meu instrutivo é "não mexer em ofícios em hipótese alguma, mesmo vendo erro". Por isso **não toquei em nada disso**, nem no import morto em `main.tsx` (que tecnicamente é só uma linha de roteamento, não a tela de ofícios em si, mas preferi não decidir isso sem o usuário, dado quão explícita foi a instrução).

**Decisão pendente do usuário:** quer que eu remova a linha `import Oficios from "./components/Oficios.tsx";` de `main.tsx` (só essa linha — não toca em `Oficios.tsx` nem em nenhuma tela de ofícios) pra desbloquear o app inteiro no navegador? Sem isso, não dá pra validar visualmente nada (nem meu trabalho, nem o resto do sistema) num browser real.

O dev server foi **parado** (`pkill -f vite`) antes de eu fazer essa pergunta ao usuário.

---

## O que falta para concluir a tarefa original

1. **Decidir e agir sobre o bug crítico acima** (import morto de `Oficios.tsx` em `main.tsx`) — bloqueia qualquer teste visual real.
2. **Validar visualmente no navegador** (item explicitamente pedido pelas instruções de UI): subir o dev server, abrir `/usuarios`, `/templates` e `/cargos`, testar criar/editar/excluir de fato (idealmente com login real — perguntar se o usuário tem credenciais válidas de algum ambiente, ou subir o backend localmente via `docker-compose` em `SistemaOficios/` com migrations+seeders).
3. Considerar atualizar/remover `CONFLITO-004` em `CONFLITO.md` (raiz do projeto) — está desatualizado, descrevia a falta de endpoint de Positions que já foi resolvida.
4. Não esquecer dos itens vistos mas **fora do escopo combinado** (não agir, só ciente):
   - `Papeis.tsx` continua 100% mock/local (instrução do usuário: não tocar — permissions não implementadas na API).
   - Coluna "Papel" (e "Cargo") na listagem de Usuários ficará vazia até o backend fazer eager-load de `roles` (e `position`) em `UserService::list()`/`getById()` — fora do meu controle, é mudança de API.
5. Nenhum commit foi feito ainda — todas as mudanças estão no working tree (checar `git status` para a lista atual, que já inclui os arquivos novos de Cargos).

---

## Arquivos tocados nesta sessão

- `src/hooks/queries/useUsers.ts` — adicionados `useUsuarios`, `useAddUsuario`, `useUpdateUsuario`, `useDeleteUsuario`, `useRestoreUsuario` + adapter `adaptUsuario` (agora inclui `position_id`).
- `src/hooks/queries/useTemplates.ts` (novo) — `useTemplates`, `useAddTemplate`, `useUpdateTemplate` + adapter `adaptTemplate`.
- `src/hooks/queries/useCargos.ts` (novo) — `useCargos`, `useAddCargo`, `useUpdateCargo`, `useDeleteCargo` + adapter `adaptCargo`.
- `src/components/Usuarios.tsx` — ligado à API real, campo senha, papéis corrigidos, status via delete/restore, loading/error, removidas props inválidas de Sidebar/Header, select de Cargo agora usa `useCargos()` real e envia `position_id`.
- `src/components/Templates.tsx` — ligado à API real, loading/error, tratamento de erro.
- `src/components/Cargos.tsx` — ligado à API real, loading/error, tratamento de erro, ação de excluir (com modal de confirmação).
- `src/components/CargoDeleteModal.tsx` (novo) — modal de confirmação de exclusão, mesmo padrão de `UsuarioDeleteModal.tsx`/`ContatoDeleteModal.tsx`.
- `src/main.tsx` — rotas `/usuarios`, `/templates` e `/cargos` adicionadas (fora do `AppLayout`).

Nenhum arquivo de `SistemaOficios/api` (PHP) foi alterado. Nenhum arquivo de `src/types/` foi alterado. Nenhum arquivo de Contatos ou Ofícios foi alterado.
