# Prompts das animações do mascote

Prompts prontos pro AnimeGen. Cada um é **autossuficiente** — cole um por vez, junto com
a imagem de referência do mascote (`client/public/mascot/actions/idle-end.webp` ou
`mascot-smile.webp`).

Todos repetem o mesmo bloco de trava de cor. Não remova: sem ele o gerador puxa o
vermelho pra laranja. Mesmo assim, o pack precisa passar pelo
[`scripts/mascot-frames.py`](../scripts/mascot-frames.py) antes de ir pro app — ver
[Processamento](#processamento) no fim.

Status: já existem em `client/public/mascot/actions/` — `idle`, `thinking`, `happy`,
`celebrate`, `upset`, `eating`, `phone`, `writing`, `note-taking`, `inviting` e `goodbye`.

`phone` (mascote olhando pro celular) e `note-taking` (anotando com prancheta) saíram de
packs sem prompt aqui; `writing` é a versão só com caneta.

O formato dos packs mudou duas vezes, e cada mudança mexeu num eixo só — por isso o script
decide fundo e paleta separados, e detecta os dois sozinho:

| estilo | fundo | corpo |
|---|---|---|
| `alpha` | alpha já é a silhueta | puxado pro laranja |
| `flat` (04/11) | RGB opaco sobre fundo quase branco | já quase certo |
| `alpha-flat` (06/11) | alpha keyado pela luminância | já quase certo |

O `alpha-flat` é o traiçoeiro, e vale saber por quê antes de confiar num pack desses. O
alpha afunda nas áreas claras — pupila, esclera, props brancos —, e onde ele chega a zero
o RGB embaixo é **lixo de compressão**: o codificador não gasta bit num pixel invisível.
Então a cor crua não serve (a pupila vira um anel listrado em volta do olho) e o alpha
também não (o celular some no dark mode).

Compor o frame sobre branco resolve o lixo — ele some junto com o alpha que o escondia.
Só que compor injeta branco proporcional a `1 - a`, e isso lava tudo que tem alpha médio:
a folha chega em ~197 e sai clara, com um degradê que o k-means depois posteriza em
manchas, e a pupila sai cinza em vez de preta.

Então a composição vale só onde ela é necessária. Acima de `TRUST_HI` (192) o RGB do pack
é confiável e fica como está; abaixo de `TRUST_LO` (64) ele é lixo e vale o composto; no
meio, mistura. As `BLEND_ANCHORS` são medidas **depois** dessa mistura — remedir é
obrigatório se qualquer um dos dois limiares mudar.

Se a detecção errar, force com `--style`.

---

## ANIMAÇÃO DE DORMINDO (`sleeping`)

Onde usa: diário vazio, dia sem refeição registrada, inatividade longa.
Playback: `loop`.

PROMPT

```
Animate attached image. COLOR LOCK: copy exact RGB from reference. Body is
CRIMSON STRAWBERRY RED #F3102A (rgb 243,16,42) — NOT orange, NOT amber, NOT
tangerine, NOT warm red. Shade #CF0320, seeds #FC897A, leaves #1C9C44,
eyes #FBF7F5 + #350416. Zero hue shift, zero saturation shift, zero recolor.
Flat vector, no outlines, no redesign, same proportions.

Action: peacefully asleep. The mascot STANDS STILL — feet planted, body never
leaves the ground. Eyes closed into two gentle curved lines, mouth a small
relaxed curve. Head tilts slowly to one side and rests there. The whole body
breathes: a slow rise and fall, about 4 px, much slower than normal idle.
Leaves droop softly and sway with the breathing, delayed. Arms hang relaxed.
Keep it cozy and calm, not sick or sad.

Style: clean premium UI motion, very slow, ease-in-out, sleepy and soft,
seamless loop.

Output: transparent background (alpha), no shadow, centered with padding,
1024x1024, 24fps, 3s loop.

Negative: Z letters, zzz text, speech bubble, nightcap, pillow, bed, moon,
stars, sick, dead, sad, tears, jumping, bouncing, feet leaving ground, fast
motion, orange, amber, hue shift, recolor, background, shadow, outline, 3D,
text, off-model, cropped limbs.
```

---

## ANIMAÇÃO DE COMENDO (`eating`)

Onde usa: enquanto grava a refeição, loading do diário — substitui o spinner.
Playback: `loop`.

PROMPT

```
Animate attached image. COLOR LOCK: copy exact RGB from reference. Body is
CRIMSON STRAWBERRY RED #F3102A (rgb 243,16,42) — NOT orange, NOT amber, NOT
tangerine, NOT warm red. Shade #CF0320, seeds #FC897A, leaves #1C9C44,
eyes #FBF7F5 + #350416. Zero hue shift, zero saturation shift, zero recolor.
Flat vector, no outlines, no redesign, same proportions.

Action: happily chewing. The mascot STANDS STILL — feet planted, body never
leaves the ground. Both mitten hands rest near the mouth as if holding a small
bite. The mouth chews in a steady rhythm, cheeks puffing slightly with each
chew. Eyes squint happily on every other chew. Head bobs a tiny bit with the
chewing. Leaves bounce softly with delay. Very subtle body sway, 2-3 px.

Style: clean premium UI motion, steady looping rhythm, cheerful and content,
ease-in-out, seamless loop.

Output: transparent background (alpha), no shadow, centered with padding,
1024x1024, 24fps, 3s loop.

Negative: food item, fork, spoon, plate, sandwich, crumbs, open gaping mouth,
teeth, tongue, greedy, messy, jumping, bouncing, feet leaving ground, fast
motion, orange, amber, hue shift, recolor, background, shadow, outline, 3D,
text, off-model, cropped limbs.
```

---

## ANIMAÇÃO DE PALMAS (`cheering`)

Onde usa: meta batida, streak mantido, tela de Pontuação.
Playback: `loop` enquanto a conquista estiver na tela.

PROMPT

```
Animate attached image. COLOR LOCK: copy exact RGB from reference. Body is
CRIMSON STRAWBERRY RED #F3102A (rgb 243,16,42) — NOT orange, NOT amber, NOT
tangerine, NOT warm red. Shade #CF0320, seeds #FC897A, leaves #1C9C44,
eyes #FBF7F5 + #350416. Zero hue shift, zero saturation shift, zero recolor.
Flat vector, no outlines, no redesign, same proportions.

Action: clapping in celebration. The mascot STANDS STILL — feet planted, body
never leaves the ground. Both mitten hands come together in front of the chest
and clap in a steady rhythm, four claps across the loop, with a small squash on
each contact. Big proud open smile, eyes squeezed into happy curved arcs on the
claps. Head bobs slightly with each clap. Leaves bounce with soft follow-through.
Shoulders lift a little on every clap, but the feet never move.

Style: clean premium UI motion, rhythmic and celebratory, snappy ease-out with
settle, polished not goofy, seamless loop.

Output: transparent background (alpha), no shadow, centered with padding so the
hands never crop, 1024x1024, 24fps, 3s loop.

Negative: confetti, sparkles, stars, motion lines, trophy, medal, jumping,
hopping, feet leaving ground, spinning, rubbery distortion, exaggerated wobble,
orange, amber, hue shift, recolor, background, shadow, outline, 3D, text,
off-model, cropped limbs.
```

---

## ANIMAÇÃO DE CONFUSO (`confused`)

Onde usa: `status: 'not_understood'` do assistente — hoje usa `upset`, que é outra emoção.
Playback: `once` (congela no último frame).

PROMPT

```
Animate attached image. COLOR LOCK: copy exact RGB from reference. Body is
CRIMSON STRAWBERRY RED #F3102A (rgb 243,16,42) — NOT orange, NOT amber, NOT
tangerine, NOT warm red. Shade #CF0320, seeds #FC897A, leaves #1C9C44,
eyes #FBF7F5 + #350416. Zero hue shift, zero saturation shift, zero recolor.
Flat vector, no outlines, no redesign, same proportions.

Action: politely confused. The mascot STANDS STILL — feet planted, body never
leaves the ground. It tilts its head ~15 degrees to one side and holds it
there. One mitten hand lifts and scratches the side of the head twice, slowly.
Mouth becomes a small wavy uncertain line, one eyebrow area raised higher than
the other, eyes looking up and to the side as if searching for the answer.
A single small shrug of the shoulders. Leaves flop to the side with the head
tilt, delayed. Keep it gentle and curious, never annoyed or sad.

Style: clean premium UI motion, slow and soft, ease-in-out, seamless loop —
ends holding the tilted questioning pose.

Output: transparent background (alpha), no shadow, centered with padding,
1024x1024, 24fps, 3s loop.

Negative: question mark, interrogation symbol, speech bubble, thought bubble,
angry, frustrated, sad, crying, jumping, bouncing, feet leaving ground, fast
motion, exaggerated wobble, orange, amber, hue shift, recolor, background,
shadow, outline, 3D, text, off-model, cropped limbs.
```

---

## ANIMAÇÃO DE APONTANDO PRA BAIXO (`scroll-down`)

Onde usa: hero da landing page, convidando a rolar.
Playback: `loop`.

PROMPT

```
Animate attached image. COLOR LOCK: copy exact RGB from reference. Body is
CRIMSON STRAWBERRY RED #F3102A (rgb 243,16,42) — NOT orange, NOT amber, NOT
tangerine, NOT warm red. Shade #CF0320, seeds #FC897A, leaves #1C9C44,
eyes #FBF7F5 + #350416. Zero hue shift, zero saturation shift, zero recolor.
Flat vector, no outlines, no redesign, same proportions.

Action: inviting the viewer to scroll down. The mascot STANDS STILL — feet
planted, body never leaves the ground. One mitten hand points downward in front
of the body and gives three small downward nudges, each one a short dip and
return. Head dips slightly with each nudge, eyes looking down then back to the
viewer. Encouraging smile. Other arm relaxed at the side. Leaves bob with soft
delay. Very subtle body sway, 2-3 px.

Style: clean premium UI motion, light and rhythmic, ease-in-out, inviting,
seamless loop.

Output: transparent background (alpha), no shadow, centered with padding,
1024x1024, 24fps, 3s loop.

Negative: arrow, chevron, scroll icon, mouse, speech bubble, jumping, bouncing,
feet leaving ground, fast motion, exaggerated wobble, orange, amber, hue shift,
recolor, background, shadow, outline, 3D, text, off-model, cropped limbs.
```

---

## ANIMAÇÃO DE CONVITE (`inviting`)

Onde usa: CTA final da landing — chamando pra criar conta.
Playback: `loop`.

PROMPT

```
Animate attached image. COLOR LOCK: copy exact RGB from reference. Body is
CRIMSON STRAWBERRY RED #F3102A (rgb 243,16,42) — NOT orange, NOT amber, NOT
tangerine, NOT warm red. Shade #CF0320, seeds #FC897A, leaves #1C9C44,
eyes #FBF7F5 + #350416. Zero hue shift, zero saturation shift, zero recolor.
Flat vector, no outlines, no redesign, same proportions.

Action: beckoning the viewer to come along. The mascot STANDS STILL — feet
planted, body never leaves the ground. One arm extends toward the viewer with
the mitten hand open, palm up, then curls inward twice in a "come on" gesture.
Warm welcoming smile, eyes looking straight at the viewer, cheeks lifted. Slight
lean forward from the waist, as if offering. Other arm relaxed at the side.
Leaves sway with soft delay.

Style: clean premium UI motion, warm and unhurried, ease-out with gentle settle,
confident not pushy, seamless loop.

Output: transparent background (alpha), no shadow, centered with padding so the
extended arm never crops, 1024x1024, 24fps, 3s loop.

Negative: pointing at viewer aggressively, finger jab, speech bubble, arrow,
jumping, bouncing, feet leaving ground, fast motion, rubbery distortion,
orange, amber, hue shift, recolor, background, shadow, outline, 3D, text,
off-model, cropped limbs.
```

---

## ANIMAÇÃO DE APONTANDO PRA ESQUERDA (`point-left`)

Onde usa: onboarding, destacando algo à esquerda da tela.
Playback: `once` (segura a pose apontando).

PROMPT

```
Animate attached image. COLOR LOCK: copy exact RGB from reference. Body is
CRIMSON STRAWBERRY RED #F3102A (rgb 243,16,42) — NOT orange, NOT amber, NOT
tangerine, NOT warm red. Shade #CF0320, seeds #FC897A, leaves #1C9C44,
eyes #FBF7F5 + #350416. Zero hue shift, zero saturation shift, zero recolor.
Flat vector, no outlines, no redesign, same proportions.

Action: pointing left. The mascot STANDS STILL — feet planted, body never
leaves the ground. Its left arm (viewer's left) extends straight out to the
side at shoulder height, mitten hand aimed clearly off-screen left, and holds
the pose. The arm gives two small insistent nudges outward, as if saying "look
over there". Head turns ~10° to follow the arm, eyes look left in the same
direction. Friendly confident smile. Right arm relaxed at the side. Leaves
sway with soft delay. Very subtle body sway, 2-3 px.

Style: clean premium UI motion, ease-in-out, calm and clear, seamless loop —
arm holds extended at the end, same pose it started the nudge from.

Output: transparent background (alpha), no shadow, centered with generous
padding on the LEFT so the extended arm never crops, 1024x1024, 24fps, 3s loop.

Negative: pointing right, pointing up, pointing at viewer, jumping, bouncing,
feet leaving ground, fast motion, exaggerated wobble, rubbery distortion,
orange, amber, hue shift, recolor, background, shadow, outline, 3D, text,
arrows, off-model, cropped limbs.
```

---

## ANIMAÇÃO DE APRESENTANDO À DIREITA (`present-right`)

Onde usa: onboarding, destacando algo à direita. Gesto diferente do `point-left` de
propósito — ali é indicação, aqui é apresentação.
Playback: `once` (segura a pose aberta).

PROMPT

```
Animate attached image. COLOR LOCK: copy exact RGB from reference. Body is
CRIMSON STRAWBERRY RED #F3102A (rgb 243,16,42) — NOT orange, NOT amber, NOT
tangerine, NOT warm red. Shade #CF0320, seeds #FC897A, leaves #1C9C44,
eyes #FBF7F5 + #350416. Zero hue shift, zero saturation shift, zero recolor.
Flat vector, no outlines, no redesign, same proportions.

Action: presenting something to the right. The mascot STANDS STILL — feet
planted, body never leaves the ground. Its right arm (viewer's right) sweeps
open in a slow welcoming gesture, mitten hand turning palm-up as it opens
toward the right side, like a host showing off what is there. The arm settles
open and holds. Head tilts ~8° toward the right, eyes follow the gesture.
Warm proud smile, cheeks lifted. Left arm stays relaxed at the side. Leaves
sway with soft delay. Very subtle body sway, 2-3 px.

Style: clean premium UI motion, slow and graceful, ease-out with a gentle
settle, welcoming rather than urgent, seamless loop — gesture opens and holds.

Output: transparent background (alpha), no shadow, centered with generous
padding on the RIGHT so the open arm never crops, 1024x1024, 24fps, 3s loop.

Negative: pointing left, pointing up, pointing at viewer, jabbing, poking,
jumping, bouncing, feet leaving ground, fast motion, exaggerated wobble,
rubbery distortion, orange, amber, hue shift, recolor, background, shadow,
outline, 3D, text, arrows, off-model, cropped limbs.
```

---

## ANIMAÇÃO DE FORÇA (`flexing`)

Onde usa: meta de proteína batida, conquista de consistência.
Playback: `settle` (toca uma vez e volta pro idle).

PROMPT

```
Animate attached image. COLOR LOCK: copy exact RGB from reference. Body is
CRIMSON STRAWBERRY RED #F3102A (rgb 243,16,42) — NOT orange, NOT amber, NOT
tangerine, NOT warm red. Shade #CF0320, seeds #FC897A, leaves #1C9C44,
eyes #FBF7F5 + #350416. Zero hue shift, zero saturation shift, zero recolor.
Flat vector, no outlines, no redesign, same proportions.

Action: showing off strength. The mascot STANDS STILL — feet planted, body
never leaves the ground. Both arms bend up into a double biceps flex and hold
the pose, with two small pulses of effort. Confident closed-mouth smirk turning
into a proud smile, eyes bright and looking at the viewer, one eyebrow area
raised. Chest puffs out slightly on the flex. Leaves perk upward with the
effort, delayed. Cute and proud, never aggressive.

Style: clean premium UI motion, snappy ease-out with a firm hold, proud and
playful, seamless loop.

Output: transparent background (alpha), no shadow, centered with padding so the
raised arms never crop, 1024x1024, 24fps, 3s loop.

Negative: muscles, veins, bulging arms, sweat, grunting, angry face, gritted
teeth, dumbbell, weights, jumping, bouncing, feet leaving ground, rubbery
distortion, orange, amber, hue shift, recolor, background, shadow, outline,
3D, text, off-model, cropped limbs.
```

---

## ANIMAÇÃO DE DESÂNIMO (`sad`)

Onde usa: acima da meta calórica, meta perdida — tom de acolhimento, não de punição.
Playback: `once` (congela no último frame).

PROMPT

```
Animate attached image. COLOR LOCK: copy exact RGB from reference. Body is
CRIMSON STRAWBERRY RED #F3102A (rgb 243,16,42) — NOT orange, NOT amber, NOT
tangerine, NOT warm red. Shade #CF0320, seeds #FC897A, leaves #1C9C44,
eyes #FBF7F5 + #350416. Zero hue shift, zero saturation shift, zero recolor.
Flat vector, no outlines, no redesign, same proportions.

Action: gently disheartened. The mascot STANDS STILL — feet planted, body never
leaves the ground. Shoulders sink, the whole body deflates slightly with one
slow sigh. Mouth curves into a small downward line, eyes look down and to the
side, half-lidded. Head lowers a little and tilts. Both arms hang limp at the
sides. Leaves droop forward and settle, delayed. Understated and sympathetic,
like someone saying "tudo bem, amanhã a gente tenta de novo" — never dramatic
or crying.

Style: clean premium UI motion, slow and restrained, ease-in-out, soft,
seamless loop — ends holding the lowered pose.

Output: transparent background (alpha), no shadow, centered with padding,
1024x1024, 24fps, 3s loop.

Negative: crying, tears, sobbing, dramatic despair, angry, scowl, rain cloud,
sweat drops, jumping, bouncing, feet leaving ground, fast motion, exaggerated
expression, orange, amber, hue shift, recolor, background, shadow, outline,
3D, text, off-model, cropped limbs.
```

---

## ANIMAÇÃO DE TCHAU (`goodbye`)

Onde usa: logout, fim do tour de onboarding.
Playback: `once` (termina com o braço baixando).

PROMPT

```
Animate attached image. COLOR LOCK: copy exact RGB from reference. Body is
CRIMSON STRAWBERRY RED #F3102A (rgb 243,16,42) — NOT orange, NOT amber, NOT
tangerine, NOT warm red. Shade #CF0320, seeds #FC897A, leaves #1C9C44,
eyes #FBF7F5 + #350416. Zero hue shift, zero saturation shift, zero recolor.
Flat vector, no outlines, no redesign, same proportions.

Action: saying goodbye. The mascot STANDS STILL — feet planted, body never
leaves the ground. One arm raises to shoulder height and waves goodbye twice,
slower and wider than a greeting wave, then lowers back down to the side and
rests. Soft closed-lip smile with a hint of warmth, eyes looking at the viewer,
one slow blink as the arm lowers. Head tilts slightly during the wave and
returns. Leaves sway with delay. Very subtle body sway, 2-3 px.

Style: clean premium UI motion, unhurried and warm, ease-in-out, a little
wistful, seamless loop — ends with the arm already back at rest.

Output: transparent background (alpha), no shadow, centered with padding so the
raised arm never crops, 1024x1024, 24fps, 3s loop.

Negative: sad, crying, walking away, turning around, back view, jumping,
bouncing, feet leaving ground, fast motion, exaggerated wobble, orange, amber,
hue shift, recolor, background, shadow, outline, 3D, text, off-model,
cropped limbs.
```

---

## ANIMAÇÃO DE ANOTANDO (`writing`)

Onde usa: tela de Plano, área do nutricionista, processamento longo.
Playback: `loop`.

PROMPT

```
Animate attached image. COLOR LOCK: copy exact RGB from reference. Body is
CRIMSON STRAWBERRY RED #F3102A (rgb 243,16,42) — NOT orange, NOT amber, NOT
tangerine, NOT warm red. Shade #CF0320, seeds #FC897A, leaves #1C9C44,
eyes #FBF7F5 + #350416. Zero hue shift, zero saturation shift, zero recolor.
Flat vector, no outlines, no redesign, same proportions.

Action: taking notes. The mascot STANDS STILL — feet planted, body never leaves
the ground. One mitten hand holds an invisible pen and makes small quick writing
strokes in the air in front of the body, while the other arm is tucked against
the chest as if holding a clipboard. Eyes look down at the writing, focused,
with one glance up at the viewer mid-loop and a small nod. Mouth in a
concentrated small line. Head bobs slightly with the writing rhythm. Leaves
bounce with soft delay.

Style: clean premium UI motion, busy but calm, steady looping rhythm,
ease-in-out, seamless loop.

Output: transparent background (alpha), no shadow, centered with padding,
1024x1024, 24fps, 3s loop.

Negative: pen, pencil, clipboard, paper, notebook, props, objects, text,
scribbles, speech bubble, jumping, bouncing, feet leaving ground, fast motion,
orange, amber, hue shift, recolor, background, shadow, outline, 3D, off-model,
cropped limbs.
```

---

## Processamento

Todo pack que sair do AnimeGen passa pelo script antes de entrar no app — ele resolve o
fundo, corrige o desvio de cor, achata o mottling e exporta o WebP com alpha:

```bash
python scripts/mascot-frames.py "~/Downloads/<pack>.zip" \
  -o client/public/mascot/actions/<acao>.webp \
  --skip-start 2 --seconds 3 --fps 15 --size 320 --quality 90

# o ritmo das ações atuais: 45 frames a 84ms
python scripts/mascot-retime.py client/public/mascot/actions/<acao>.webp --total 3780

# still em que o playback `once` congela (o `-end.webp`)
python scripts/mascot-still.py client/public/mascot/actions/<acao>.webp
```

O `--skip-start`/`--skip-end` é o que mais muda de pack pra pack, porque o gerador começa
na imagem de referência e leva uns frames pra montar a pose — em pack com prop, o objeto
materializa no ar. O que foi usado nos últimos seis:

| ação | pack | janela |
|---|---|---|
| `eating` | eating-frames | — (já fecha em 0..90) |
| `phone` | smartphone-frames | `--skip-start 10 --skip-end 16` |
| `writing` | other wirting frames | `--skip-start 20` |
| `note-taking` | writing-frames | `--skip-start 16 --skip-end 30` (prancheta instável depois do 60) |
| `inviting` | come-onframes | `--skip-start 10` |
| `goodbye` | goodbye-frames | `--skip-start 8 --skip-end 26` (cauda de 30 frames parados) |

Checagens que valem antes de aceitar o pack:

- **Prop estável** — frame a frame, a distância até a mediana do regime cai e estabiliza
  quando o objeto terminou de aparecer. Começar antes disso deixa o prop piscando a cada
  volta do loop.
- **Cor dos primeiros frames** — nos packs `flat` o frame 0 costuma ser a imagem de
  referência colada crua, com o vermelho de outro tom. Medir a cor mediana do corpo frame a
  frame contra o regime: no `goodbye` o frame 0 desviava 462 e piscava a cada volta. É o
  mesmo `--skip-start` que resolve, só que por outro motivo.
- **Loop costurado** — se a diferença entre o primeiro e o último frame for alta, o loop
  dá um salto visível. Acima de ~10 o olho pega. Saída: `--boomerang`, que toca e volta de
  ré, fechando o ciclo por construção (foi o que resolveu o `thinking`, que estava em 27).
  Em ação `once` a costura não importa — ela nunca dá a volta.
- **Prop coerente no tempo** — contar os pixels do objeto frame a frame. O gerador não
  garante coerência temporal: a prancheta do `note-taking` perdia 40% da área por 4 frames
  no meio da animação e voltava, o que lê como piscada. Não tem conserto no processamento
  — é escolher uma janela que não passe por cima do trecho ruim.
- **Dark mode** — compor um frame sobre preto. Aro claro em volta do mascote, ou prop
  branco que escurece, significa que o fundo do gerador ficou na borda ou que o alpha veio
  keyado. Os dois casos são do script, não do pack.
- **Cor** — conferir se os clusters do pack batem com as âncoras do estilo detectado. Se o
  gerador desviar pra outro tom, as âncoras precisam ser remedidas.
- **Corte de membro** — braço levantado é o que mais estoura o quadro.

Registrar a ação nova em:

- [`types/mascotAction.ts`](../client/src/shared/types/mascotAction.ts) — adicionar ao union
- [`config/mascotActions.ts`](../client/src/shared/config/mascotActions.ts) — path do loop,
  path do still, duração e playback padrão
