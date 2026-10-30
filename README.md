# Skills de design e desenvolvimento

Skills para o Claude Code ajudar você a criar interfaces bonitas e testar seus projetos no navegador. Uma skill é uma pasta com um `SKILL.md`: são instruções que o Claude lê quando a tarefa combina com ela.

## O que tem aqui

| Pasta | Para que serve |
|---|---|
| `LANDINGPAGES` | Cria uma landing page completa a partir de um briefing. Gera de 1 a 3 modelos diferentes para você comparar e confere tudo no navegador. Usa as outras pastas deste repositório. |
| `taste-skill` | Regras para a interface não ficar com "cara de IA": tipografia, layout, cores, modo escuro. |
| `web-design-guidelines` | Revisa a sua tela: acessibilidade, UX e boas práticas. Peça "revisa a minha interface". |
| `playwright-cli` | Abre o navegador, clica, preenche formulário e tira print. Serve para testar o seu site. |
| `image-to-code` | Gera primeiro a imagem do design e depois o código parecido com ela. Precisa de uma ferramenta de gerar imagem. |
| `awesome-design-md` | Não é uma skill: é uma biblioteca com o design system de 84 marcas reais (Apple, Stripe, Linear, Airbnb...). Serve de referência para as outras. |

## Como instalar

1. Clone o repositório na sua pasta de usuário. No terminal (Git Bash):

   ```bash
   cd ~
   git clone https://github.com/marcossc-beep/skills_marcos.git
   ```

   Deixe nesse caminho (`~/skills_marcos`), porque a `LANDINGPAGES` procura as outras pastas ali.

2. Copie as skills para a pasta de skills do Claude Code:

   ```bash
   mkdir -p ~/.claude/skills
   cp -r ~/skills_marcos/LANDINGPAGES          ~/.claude/skills/landingpages
   cp -r ~/skills_marcos/taste-skill           ~/.claude/skills/design-taste-frontend
   cp -r ~/skills_marcos/web-design-guidelines ~/.claude/skills/web-design-guidelines
   cp -r ~/skills_marcos/playwright-cli        ~/.claude/skills/playwright-cli
   cp -r ~/skills_marcos/image-to-code         ~/.claude/skills/image-to-code
   ```

   Quer que a skill valha só para um projeto? Copie para `.claude/skills/` dentro da pasta do projeto em vez de `~/.claude/skills/`.

3. Para usar a `playwright-cli` (e a `LANDINGPAGES`), instale o navegador uma vez:

   ```bash
   npm install -g @playwright/cli@latest
   playwright-cli install-browser
   ```

4. Abra o Claude Code de novo e peça normalmente, por exemplo:
   - "cria uma landing page para a minha hamburgueria"
   - "revisa a interface da minha tela de login"
   - "abre o meu site no navegador e testa o formulário"

Para pegar as atualizações depois: `cd ~/skills_marcos && git pull` e copie de novo.

## Outras skills que valem a pena

Elas não estão neste repositório porque têm os próprios donos. Instale direto da fonte:

```bash
npx skills add emilkowalski/skill      # animações e acabamento de interface (Emil Kowalski)
npx skills add Leonxlnx/taste-skill    # versão completa da taste-skill e variações
npx skills add pbakaus/impeccable      # revisão e polimento de design
```

## Cuidado com segredos

Nunca coloque senha, token, chave de API ou arquivo `.env` numa skill nem neste repositório. Se a sua skill precisa de uma chave, leia de uma variável de ambiente.

## Créditos

- `awesome-design-md`: [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md), licença MIT (arquivo `awesome-design-md/LICENSE`).
- `taste-skill`: [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill).
- `image-to-code`: skill da comunidade.
- `web-design-guidelines`: [Vercel](https://github.com/vercel-labs/web-interface-guidelines).
- `playwright-cli`: Microsoft Playwright.
- `LANDINGPAGES`: professor Marcos, juntando as anteriores.
