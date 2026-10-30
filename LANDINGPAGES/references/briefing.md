# Briefing — perguntas e opções

Use AskUserQuestion (máx. 4 perguntas por chamada). Pule o que o pedido já respondeu. Texto livre do usuário ("Other") sempre é aceito.

## Rodada 1 — essencial

1. **Quantos modelos quer comparar?** — 1 (mais rápido) / 2 / 3 (máximo; mais tempo e tokens).
2. **Você tem mídia para usar?** (multiSelect) — Imagens/fotos / Logo / Vídeos / Nada, gere ou use código. Se marcar algo, peça o caminho da pasta ou os arquivos.
3. **Tem um site de referência?** — Sim, tenho URL(s) / Não, decida você. Se sim, peça a URL e o que gostou: cores, tipografia, layout, animações, tom.
4. **Objetivo da página (CTA)?** — Vender / Captar lead (formulário) / Chamar no WhatsApp / Agendar / Baixar / Outro.

## Rodada 2 — contexto (só o que faltar; pode ser pergunta aberta no chat)

- O que é o negócio, o que oferece, para quem, diferencial, preço ou faixa (se pode aparecer).
- Idioma e tom de voz (formal, próximo, técnico, divertido).
- Marca: cores, fonte, logo, estilo que NÃO quer.
- Conteúdo real disponível: depoimentos, números, clientes, FAQ, endereço, redes, link/telefone do CTA.
- Seções desejadas (padrão sugerido: hero, prova/logos, problema→solução, benefícios, como funciona, depoimentos, preço/oferta, FAQ, CTA final, rodapé).
- Prazo/stack: HTML estático (padrão), ou React/Next/Astro se exigido.

## Regras sobre mídia

- Imagens do usuário: copie para `PROJ/assets/`, olhe cada uma (Read) para saber o que mostra, proporção e qualidade antes de planejar o layout em torno delas.
- Vídeo do usuário: use como hero/seção; gere poster com `ffmpeg` se disponível (ou frame via playwright). Avise se o arquivo for pesado (> ~8 MB) e sugira compressão.
- Sem mídia: prefira composição tipográfica, gradientes/malhas, SVG, mockups de UI feitos em HTML. Fotos geradas por IA só se o usuário concordar e a ferramenta existir. Nunca fabrique rostos como "clientes" nem logos de empresas reais como "quem usa".

## briefing.md — modelo

```md
# Briefing: <nome>
- Negócio / oferta:
- Público:
- Objetivo e CTA (destino):
- Idioma / tom:
- Modelos pedidos: N
- Mídia disponível: (caminhos)
- Referências: (URLs + o que gostou)
- Marca: (cores/fonte/logo/proibido)
- Conteúdo real fornecido:
- Seções:
- Direções por modelo: A=…, B=…, C=…
- Pendências / placeholders:
```
