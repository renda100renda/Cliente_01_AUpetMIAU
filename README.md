# Cliente 01 — AUpetMIAU Boutique & SPA

Landing page: https://cliente-01-aupetmiau.vercel.app

## Estrutura
- `index.part1..4.html` — HTML em 4 partes (concatenadas no build para `index.html`)
- `assets/styles.part1..2.css` — CSS em 2 partes (concatenado no build)
- `assets/app.js` — JS do agendador WhatsApp, carrossel, FAQ e botão voltar ao topo
- `og-p01..03.b64`, `favicon-p01.b64` — imagens em chunks base64 (decodificadas no build)
- `scripts/build.js` — roda na Vercel: concatena e decodifica tudo

## Deploy
Push na `main` → Vercel build (`node scripts/build.js`) → produção.

## Contato
- WhatsApp Morumbi (principal): (11) 96708-7583
- WhatsApp Vila Sônia: (11) 99765-4154
- Instagram: @aupetmiau_boutique_spa
