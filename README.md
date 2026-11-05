# Instituição Ana Prado — site

Site da **Instituição Ana Prado (IAP)**, obra social de Pau Amarelo (PE), em homenagem à vovó Ana Prado (1951–2023).
Idiomas: português (padrão), espanhol e inglês.

Stack: React + Vite + TypeScript + Tailwind CSS · react-i18next · Supabase (só para os depoimentos).
O resultado é um **site estático** (pasta `dist/`), que pode ser hospedado de graça (Cloudflare Pages, Netlify…).

---

## 1. Rodar localmente

### Com Docker (recomendado)

```bash
docker compose up
```

Abra **http://localhost:5173**. Sem nenhuma configuração, o site sobe em **modo mock** (depoimentos de exemplo, salvos só no navegador).

| Ação | Comando |
|---|---|
| Subir (em segundo plano) | `docker compose up -d` |
| Parar | `docker compose down` |
| Ver logs | `docker compose logs -f web` |
| Rebuild (após mudar `package.json`) | `docker compose up --build` (se der erro de dependência: `docker compose down -v` e suba de novo) |
| Testar a versão final (build + nginx) | `docker compose --profile prod up --build prod` → **http://localhost:8080** |
| …se a porta 8080 estiver ocupada | `PROD_PORT=8081 docker compose --profile prod up --build prod` |

O código fica montado no container, então qualquer arquivo salvo atualiza a página na hora (hot reload).
O `node_modules` do container fica num volume separado, para não conflitar com o do seu sistema.

### Sem Docker

Requer Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera a pasta dist/
npm run preview    # serve o dist/ localmente
```

---

## 2. Onde editar cada coisa

| O quê | Arquivo |
|---|---|
| E-mail de contato, Pix, Zelle, números de impacto, números financeiros, redes sociais, imagem da capa | `src/config/site.ts` |
| Texto da página Inicial e da Nossa História (por idioma) | `src/content/pt.json`, `es.json`, `en.json` |
| Obras (cartões da página Obras) | `src/content/works.json` |
| Textos da interface (menus, botões, formulários) | `src/i18n/locales/pt.json`, `es.json`, `en.json` |
| Fotos e imagens | pasta `public/images/` |
| Ilustração provisória da capa | `src/components/CoverIllustration.tsx` (melhor: só preencher `coverImage` em `site.ts`) |

Procure por **`[PREENCHER]`** para achar tudo que ainda é placeholder.

### Nossa História
Cada item de `"sections"` é um bloco com título, parágrafos e (opcional) uma foto:

```json
{
  "title": "Como tudo começou",
  "paragraphs": ["Primeiro parágrafo…", "Segundo parágrafo…"],
  "image": { "src": "/images/historia/foto1.jpg", "alt": "Descrição da foto para quem não enxerga", "caption": "Legenda" }
}
```

### Adicionar uma nova obra
Em `src/content/works.json`, copie um bloco e ajuste. Já existe um bloco-modelo (`"hidden": true`) que não aparece no site.

```json
{
  "id": "biblioteca",
  "icon": "book",                      // basket | cookie | book | hands | heart
  "image": "/images/obras/biblioteca.jpg",  // ou "" para mostrar só o ícone
  "hidden": false,
  "pt": { "title": "Biblioteca", "summary": "…", "details": ["…"], "facts": ["Quando: …", "Onde: …"] },
  "es": { "title": "Biblioteca", "summary": "…", "details": ["…"], "facts": ["…"] },
  "en": { "title": "Library", "summary": "…", "details": ["…"], "facts": ["…"] }
}
```
Se faltar a tradução de algum idioma (título vazio), o site mostra o texto em português.

### Números
Em `site.ts`, cada número tem `value` (número puro, sem pontos), `format` opcional (`'currencyBRL'`, `'currencyUSD'`), `prefix`/`suffix` (ex.: `'+'`, `' kg'`) e o rótulo nos 3 idiomas. A formatação (1.500 / 1,500) se ajusta ao idioma.

### Imagens
- Use JPG para fotos, com até ~1600 px de largura e ~300 KB (ex.: https://squoosh.app para comprimir).
- `public/images/ana.jpg` — foto de vovó Ana na capa (hoje é um recorte do logo).
- `public/images/qrcode-pix.png` — **hoje é um QR falso de exemplo**; troque pelo QR gerado no app do banco.
- `public/logo.png` é usado no compartilhamento (Open Graph). Os favicons (`favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`) e `logo-192.jpg` foram gerados a partir do logo.

---

## 3. Depoimentos: modo mock × Supabase

O modo é escolhido no arquivo **`.env`** (copie de `.env.example`):

```bash
cp .env.example .env
```

| Modo | `.env` |
|---|---|
| **Mock** (padrão, sem backend) | `VITE_USE_MOCK=true` |
| **Supabase** | `VITE_USE_MOCK=false` + `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` |

Depois de mudar o `.env`, o Vite reinicia sozinho (se não, `docker compose restart web`).

> No modo mock, o `/admin` abre **sem login** e mostra um aviso de que é só para desenvolvimento. Os dados ficam no `localStorage` do navegador.

### Como funcionam as regras (Row Level Security)
- O público **só consegue inserir** depoimentos com status `pending` e consentimento marcado, e **só consegue ler** os `approved`.
- Só usuários cadastrados na tabela **`admins`** podem ver pendentes, aprovar, rejeitar e excluir.
- O banco também limita tamanhos (nome ≤ 80, relação ≤ 120, texto entre 20 e 2000 caracteres).
- No site: campo invisível “honeypot”, tempo mínimo de preenchimento e intervalo de 3 minutos entre envios no mesmo navegador.
- Os depoimentos aparecem sempre no idioma em que foram escritos (o autor escolhe o idioma no formulário).

### Opção A — Supabase na nuvem (plano gratuito)
1. Crie um projeto em https://supabase.com.
2. Em **SQL Editor**, cole e rode todo o conteúdo de `supabase/migrations/20261102000000_testimonials.sql` (cria tabelas, função `is_admin` e políticas).
3. Em **Project Settings → API**, copie a *Project URL* e a *anon / publishable key* para o `.env`. **Nunca** use a `service_role` key no site.
4. Em **Authentication → Sign In / Providers**, desative “Allow new users to sign up” (só administradores entram).

### Opção B — Supabase local (Supabase CLI, usa o Docker por conta própria)
```bash
npx supabase init      # cria supabase/config.toml (mantém a pasta migrations)
npx supabase start     # sobe o Supabase local e aplica as migrations + seed.sql
```
No `.env`, use `VITE_SUPABASE_URL=http://127.0.0.1:54321` e a *anon key* exibida no terminal (`npx supabase status` mostra de novo).
O painel local fica em http://127.0.0.1:54323. Para recriar o banco do zero: `npx supabase db reset`. Para parar: `npx supabase stop`.
(O navegador acessa o Supabase pelo `localhost`, então funciona também com o site rodando no Docker.)

### Criar o usuário administrador
1. No painel do Supabase: **Authentication → Users → Add user → Create new user** (e-mail + senha, marque *Auto Confirm User*).
2. No **SQL Editor**, rode (trocando o e-mail):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'admin@exemplo.org';
   ```
3. Acesse **/admin** no site e entre com esse e-mail e senha.

Para remover um admin: `delete from public.admins where user_id = (select id from auth.users where email = '…');`

---

## 4. Deploy (grátis)

Configuração de build em qualquer serviço:
- **Comando de build:** `npm run build`
- **Pasta de saída:** `dist`
- **Variáveis de ambiente:** `VITE_USE_MOCK=false`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL` (ex.: `https://anaprado.org`)

**Cloudflare Pages:** Workers & Pages → Create → Pages → conecte o repositório Git (GitHub/GitLab) → preset “Vite” (ou os valores acima) → adicione as variáveis → Deploy.
**Netlify:** Add new site → Import from Git → mesmos valores.

O arquivo `public/_redirects` faz as rotas (`/doar`, `/obras`…) funcionarem ao recarregar a página. Depois, configure o domínio próprio no painel do serviço.

> Se você publicar com `VITE_USE_MOCK=true`, os depoimentos não serão salvos de verdade (aparece o aviso “modo de demonstração”).

---

## 5. Estrutura

```
public/                 imagens, favicons, _redirects, robots.txt
src/config/site.ts      configuração central
src/content/            textos de conteúdo e obras
src/i18n/               traduções da interface
src/components/         Header, Footer, ornamentos, ilustração da capa…
src/pages/              Capa, Inicial, História, Obras, Depoimentos, Doar, Admin
src/lib/testimonials/   mock + Supabase (mesma interface)
supabase/migrations/    SQL da tabela e das políticas
supabase/seed.sql       dados de exemplo para o Supabase local
Dockerfile              imagem de desenvolvimento (Vite)
Dockerfile.prod         build estático + nginx
docker-compose.yml      serviços "web" (dev) e "prod" (profile prod)
```
