---
name: landingpages
description: Cria landing pages completas e polidas a partir de um contexto, gerando de 1 a 3 modelos diferentes para comparação, usando referência visual opcional, e só entrega depois de abrir o site num navegador real, tirar screenshots e corrigir os problemas. Use quando o usuário pedir uma landing page, site de uma página, página de vendas/captura, ou "me faz um site para X".
argument-hint: <contexto do site: negócio, público, objetivo, referências>
allowed-tools: Bash(playwright-cli:*) Bash(npx playwright:*) Bash(node:*) Bash(npm:*) Bash(mkdir:*) Bash(cp:*)
---

# LANDINGPAGES — pipeline completo de landing page

Você é o diretor de arte + engenheiro front-end. O usuário dá um contexto; você entrega 1–3 modelos prontos, **verificados visualmente**, para ele comparar e escolher. Qualidade vale mais que velocidade; o custo em tokens é aceito.

**Regra de ouro:** nunca diga "pronto" sem ter aberto a página no navegador, olhado os screenshots (você lê PNG com a ferramenta Read) e rodado a auditoria. Siga também `verification-before-completion`: evidência antes de afirmação.

## Skills e ferramentas que este pipeline usa

`DESIGN_DIR` = a pasta onde o repositório `skills_marcos` foi clonado (a pasta-mãe desta skill, onde ficam `awesome-design-md/`, `taste-skill/` etc.). O padrão é `~/skills_marcos`. Descubra o caminho absoluto dela antes de começar (a skill pode estar num link em `~/.claude/skills`, então caminhos relativos não funcionam); se não achar, pergunte ao usuário. Os caminhos abaixo partem dela.

| Papel | Fonte |
|---|---|
| Direção anti-genérico, regras de layout/tipografia | `DESIGN_DIR/taste-skill/SKILL.md` (ou skill global `design-taste-frontend`) |
| Referências de design system de marcas reais | `DESIGN_DIR/awesome-design-md/design-md/<marca>/DESIGN.md` |
| Design image-first (opcional, precisa gerar imagem) | `DESIGN_DIR/image-to-code/SKILL.md` |
| Auditoria de interface (acessibilidade, UX, performance) | `DESIGN_DIR/web-design-guidelines/SKILL.md` |
| Navegador, screenshots, extração de estilo | `DESIGN_DIR/playwright-cli/SKILL.md` + `scripts/` desta pasta |
| Acabamento premium (fontes, espaçamento, sombras, cards) | skill global `high-end-visual-design` |
| Refino, crítica, polimento, responsivo, UX copy | skill global `impeccable` |
| Movimento (entradas, hover, scroll) | skill global `animate` |
| Pior caso de dados/conteúdo | skill global `break-ui` |

Leia o SKILL.md de cada uma **no momento em que a fase precisar**, não tudo de uma vez.

## Fase 0 — Pré-requisitos (rápido)

1. `playwright-cli --version` funciona? Se não: `npm install -g @playwright/cli@latest` e `playwright-cli install-browser`.
2. Defina `PROJ` = pasta do projeto. Se o usuário não indicou, pergunte ou use `./landing-<slug>/`. Estrutura:

```
PROJ/
  briefing.md            # respostas + decisões
  assets/                # imagens e vídeos do usuário
  reference/             # screenshots + style.json + DESIGN.md da referência
  v1/ v2/ v3/            # um modelo por pasta (index.html + css/js/assets)
  compare.html           # comparador final lado a lado
```

## Fase 1 — Briefing (pergunte antes de construir)

Use AskUserQuestion, em no máximo 2 rodadas. Se o usuário já deu algo no pedido, não repergunte. Detalhes e opções em `references/briefing.md`. Obrigatório descobrir:

1. **Negócio/oferta**, público, objetivo único da página (CTA principal) e idioma.
2. **Quantos modelos?** 1, 2 ou 3 (máximo 3). Avise que mais modelos = mais tempo e tokens.
3. **Mídia:** "Você tem imagens, logo, vídeos ou fotos para usar? Caminho da pasta?" Se não houver: gerar com ferramenta de imagem (ex.: Figma `generate_image`, se disponível), usar SVG/gradientes/mockups em código, ou placeholders marcados. **Nunca** invente fotos de pessoas/depoimentos/logos de clientes como se fossem reais.
4. **Site de referência** (URL) e o que gostou nele (cores? tipografia? ritmo? animação?). Pode haver 0, 1 ou mais.
5. **Marca:** cores/fonte/logo existentes? Tom de voz? Conteúdo pronto (textos, preços, depoimentos reais)? O que NÃO fazer?
6. **Seções desejadas** e, se houver, o formulário/WhatsApp/link do CTA.

Salve tudo em `PROJ/briefing.md`. Textos sem fonte do usuário ficam como copy proposta — sinalize isso no final.

## Fase 2 — Análise da referência (se houver URL)

Para cada URL de referência (pasta `PROJ/reference/`; rode os comandos de dentro dela):

```bash
playwright-cli open <URL>
playwright-cli resize 1440 900
playwright-cli --raw run-code --filename="DESIGN_DIR/LANDINGPAGES/scripts/capture.js"      # full + fatias em ./_qa
playwright-cli --raw run-code --filename="DESIGN_DIR/LANDINGPAGES/scripts/extract-style.js" > style.json
playwright-cli resize 390 844
playwright-cli --raw run-code --filename="DESIGN_DIR/LANDINGPAGES/scripts/capture.js"      # versão mobile
playwright-cli close
```

Depois **olhe** as imagens (Read nos PNGs) e cruze com `style.json`. Escreva `reference/DESIGN.md` no formato de `DESIGN_DIR/awesome-design-md/design-md/*/DESIGN.md` (olhe um exemplo de marca parecida): paleta com papéis (fundo, superfície, texto, acento), tipografia (família, escala, pesos, tracking), espaçamento e ritmo de seções, raios/sombras/bordas, estilo de botões, tipo de imagem/ilustração, linguagem de movimento. Anote **por que funciona** (contraste, hierarquia, respiro) e **o que não copiar** (marca, textos, imagens, layout pixel a pixel — inspirar, não clonar).

O `style.json` extrai o que o CSS renderiza; fontes que caem em `system-ui` indicam que a fonte real é carregada de outro jeito — confirme olhando o screenshot.

## Fase 3 — Direções criativas (uma por modelo)

Antes de codar, defina para cada modelo uma direção **claramente diferente** (não só trocar cores). Registre em `briefing.md`:

- **Modelo A — "Referência"** (só se houver referência): aplica `reference/DESIGN.md` adaptado à marca do usuário.
- **Modelo B — "Taste/editorial"**: direção inferida do briefing seguindo `taste-skill` (tipografia forte, layout assimétrico, sem clichês de IA).
- **Modelo C — "Ousado/premium"**: `high-end-visual-design` + movimento mais marcante.

Sem referência, use 2–3 direções distintas (ex.: editorial claro, escuro premium, vibrante/tátil). Para cada uma escolha um DESIGN.md de marca do `awesome-design-md` como âncora de sistema (ex.: Linear, Stripe, Apple, Airbnb — o que combinar com o tom) e anote o que vai adaptar. Varie: paleta, par tipográfico, estrutura do hero, densidade, forma dos cards, linguagem de movimento. Dois modelos que, ao encolher o screenshot, parecem o mesmo = refaça.

**Gerar imagens com o Figma (testado):** `mcp__claude_ai_Figma__generate_image` com `planKey` (peça ao usuário qual plano usar se houver mais de um; chame `whoami` para listar), `prompt`, `width`/`height` (máx. 2048; a saída vem em proporção próxima, ex.: 1536×864 → 1376×768). Modelo padrão `gemini-3.1-flash-lite-image` é o mais barato; `gpt-image-2.5-sunburst` e `gemini-3.1-flash-image` ficam para casos que precisem de mais qualidade. **Consome créditos do plano** — avise e confirme a quantidade antes de gerar várias. A URL expira em 7 dias: baixe na hora com `curl -L -o PROJ/assets/<nome>.jpg "<url>"` e use o arquivo local, nunca a URL. Peça "sem texto, sem logos" no prompt e deixe área vazia onde o título vai entrar. Use para fundos/hero/ilustrações; não para rostos de "clientes" ou depoimentos.

Se houver ferramenta de imagem e o usuário topar, rode o fluxo de `DESIGN_DIR/image-to-code/SKILL.md` para gerar a imagem-alvo do hero de cada modelo antes de implementar.

## Fase 4 — Construção (em paralelo)

Um subagente por modelo (Agent, `run_in_background: true`), todos na mesma mensagem. Cada prompt deve ser autocontido e incluir: caminho do `briefing.md`, a direção do modelo, o DESIGN.md âncora, a pasta de saída `PROJ/vN/`, os assets disponíveis, e as regras abaixo. Peça que o subagente leia `taste-skill` e as skills globais relevantes, **construa**, e devolva só o caminho + decisões de design. A verificação visual da Fase 5 é sua, não dele.

**Regras de construção (valem para todos):**
- HTML/CSS/JS estáticos, sem build, abre com duplo clique (CSS moderno, JS mínimo, Google Fonts ou fonte local; Tailwind via CDN só se ajudar). Se o usuário pedir um framework, siga o pedido.
- Mobile-first, funciona de 360 a 1920px, sem rolagem horizontal. Hero legível num notebook pequeno (~1366×768) com o CTA visível sem rolar.
- Uma ação principal clara; CTA repetido de forma útil (hero, meio, fim). Prova social **somente** com dados reais fornecidos, senão omita ou marque como a preencher.
- Acessibilidade: contraste AA, `alt`, hierarquia h1→h2, foco visível, alvos de toque ≥44px, `prefers-reduced-motion` respeitado, `lang` correto.
- Movimento com propósito (skill `animate`): entradas por scroll sutis, hover/focus nos interativos, nada que atrase o conteúdo. Vídeo: `muted playsinline`, poster, `preload="metadata"`, sem autoplay com som.
- Imagens: dimensões explícitas, `loading="lazy"` abaixo da dobra, formatos leves; vídeos do usuário referenciados de `assets/` (copie, não mova).
- SEO básico: `<title>`, meta description, Open Graph, favicon.
- Copy no idioma do briefing, específica ao negócio (nada de "Lorem ipsum", "Soluções inovadoras", "Eleve seu negócio").

## Fase 5 — Verificação visual (obrigatória, por modelo)

Para cada `PROJ/vN/` — rode de dentro da pasta (as imagens vão para `vN/_qa/`):

```bash
playwright-cli open file:///<caminho absoluto>/vN/index.html     # ou servidor: npx serve
playwright-cli resize 1440 900   && playwright-cli --raw run-code --filename="DESIGN_DIR/LANDINGPAGES/scripts/capture.js" && playwright-cli --raw run-code --filename="DESIGN_DIR/LANDINGPAGES/scripts/audit.js"
playwright-cli resize 768 1024   && (mesmos dois comandos)
playwright-cli resize 390 844    && (mesmos dois comandos)
playwright-cli resize 1366 768   && playwright-cli screenshot --filename=_qa/hero-1366.png     # hero em notebook pequeno
playwright-cli close
```

Depois:
1. **Leia com Read** `full-<W>.png` (visão geral: ritmo, equilíbrio, seções repetitivas) e as `slice-*` (detalhe: texto cortado, alinhamento, imagem estourada, contraste real, hover não aplicável). A imagem de página inteira é reduzida ao ser mostrada; por isso as fatias existem — **olhe as duas**.
2. Leia o JSON do `audit.js`: overflow horizontal, imagens quebradas, `href="#"`, alvos pequenos, h1 ≠ 1, contraste (fundos com imagem/gradiente não são checados — avalie no olho), erros de console.
3. Teste interações reais: menu mobile, FAQ/accordion, formulário, CTA (`playwright-cli snapshot`, `click`, `fill`), um estado de hover no CTA (`hover` + screenshot) e o `prefers-reduced-motion`.
4. Rode `DESIGN_DIR/web-design-guidelines/SKILL.md` sobre os arquivos do modelo e corrija o que for relevante.
5. Aplique `break-ui` mentalmente/na prática: nome longo no CTA, texto 30% maior, zoom 200%, sem imagem carregada, JS desligado (o conteúdo ainda aparece?).
6. Passe um olhar de crítica com `impeccable` (hierarquia, ritmo, polimento) e de movimento com `animate`/`review-animations` se houver animações.

**Loop de correção:** liste os problemas por gravidade → corrija → recapture → releia as imagens. Até 3 rodadas por modelo. Pare antes se a última rodada não achou nada grave. Ao fim, o que restar vai nos "problemas conhecidos", sem esconder.

Critério de aprovação do modelo: sem overflow horizontal, sem erro de console, sem imagem quebrada, contraste AA nos textos, hero com CTA visível em 1366×768 e 390×844, nenhum texto cortado ou sobreposto nas fatias, e os modelos entre si visivelmente diferentes.

## Fase 6 — Comparador e entrega

1. Gere `PROJ/compare.html` a partir de `references/compare-template.html` (miniaturas dos `full-1440.png` e `full-390.png`, links para cada `vN/index.html`, nota curta de cada direção). Abra e confira.
2. Responda ao usuário, curto, sem encher de elogio:
   - quantos modelos e a direção de cada um (1–2 linhas);
   - caminho de cada `index.html` e do `compare.html`;
   - o que foi verificado (viewports, auditorias, interações) e o resultado real;
   - **problemas conhecidos / não verificados** e o que é copy ou imagem placeholder a substituir;
   - pergunta de próximo passo: qual escolher, e o que misturar/ajustar.
3. Depois da escolha: refine só o modelo escolhido (mesmo loop da Fase 5), remova os outros apenas se o usuário pedir, e ofereça publicar (ex.: deploy estático).

## Princípios

- Honestidade nos números: relate o resultado real do `audit.js`, inclusive falhas.
- Inspire-se na referência, não copie marca, texto ou imagens dela.
- Não invente dados do negócio (preços, depoimentos, métricas, clientes). Pergunte ou marque.
- Se uma ferramenta falhar (navegador, imagem), diga e siga com a alternativa; não pule a verificação em silêncio.
- Arquivos de QA (`_qa/`) ficam no projeto; ofereça apagar ao final.
