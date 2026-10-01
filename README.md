# Forró Pé de Serra — Landing Page

Landing page de conversão para aulas de forró (turmas regulares em grupo + aulas particulares).
Estático, sem dependências de build: **HTML + CSS + JavaScript** puros.

## Estrutura

```
index.html    # marcação e conteúdo
styles.css    # estilos (paleta quente âmbar/carvão, mobile-first)
script.js     # menu, FAQ, animações e formulário -> WhatsApp
```

## Como rodar

Basta abrir `index.html` no navegador, ou servir localmente:

```bash
python3 -m http.server 8080
# acesse http://localhost:8080
```

## Personalização rápida

| O que mudar | Onde |
|---|---|
| Número do WhatsApp | `index.html` (`<meta name="studio-whatsapp">`) e `script.js` (`CONFIG.whatsapp`) |
| Instagram / endereço | `index.html` (meta tags + footer) |
| Preços | `index.html`, seção `#precos` |
| Horários das turmas | `index.html`, seção `#horarios` |
| Cores e fontes | `styles.css`, bloco `:root` |
| Nome do estúdio | `index.html` (`.brand-text`) |

## Seções

Hero (com oferta de aula grátis) → benefícios → planos (grupo x particular) → níveis →
agenda semanal → professor(a) → depoimentos → FAQ → CTA com formulário → footer.
Botão flutuante de WhatsApp e formulário que monta a mensagem e abre o `wa.me`.

## Preços

Os valores são **placeholders baseados no mercado brasileiro** (mensalidade R$180/280,
avulsa R$50; particular R$120, pacotes R$400/10 aulas R$900) e devem ser ajustados.

## Licença

Uso pessoal — Arto Studio / Junior-Arto.
