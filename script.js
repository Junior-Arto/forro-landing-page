/* ==========================================================================
   Forró Pé de Serra — Landing Page (JS)
   - Menu mobile
   - Header ao rolar
   - Reveal on scroll
   - Acordeão do FAQ (1 aberto por vez)
   - Validação do form -> abre WhatsApp com mensagem pronta
   - Botões flutuantes de WhatsApp
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ Config
     Troque o número do WhatsApp aqui (formato: 55 + DDD + número, só dígitos).
     O meta[name="studio-whatsapp"] no HTML também é usado como fallback. */
  const CONFIG = {
    whatsapp: '5511999999999',
    message:
      'Olá! Vim pelo site e quero saber mais sobre as aulas de forró. 💃🕺'
  };

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Permite sobrescrever via <meta> no HTML
  const metaWa = document.querySelector('meta[name="studio-whatsapp"]');
  if (metaWa && metaWa.content) CONFIG.whatsapp = metaWa.content;

  const waLink = (text) =>
    'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text || CONFIG.message);

  /* ------------------------------------------------------- Header + menu */
  const header = $('#siteHeader');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const nav = $('#mainNav');
  const toggle = $('#navToggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    // Fecha o menu ao clicar em um link
    $$('#mainNav a').forEach((a) =>
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* -------------------------------------------------- Reveal on scroll */
  const revealTargets = $$('.reveal-group, .reveal');
  if ('IntersectionObserver' in window && revealTargets.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('in'));
  }

  /* ------------------------------------------------------ FAQ (acordeão) */
  const faqItems = $$('#faq details');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) faqItems.forEach((other) => { if (other !== item) other.open = false; });
    });
  });

  /* ------------------------------------------- WhatsApp links (globais) */
  const withPlan = (plan) =>
    plan
      ? 'Olá! Vim pelo site e quero agendar uma aula de forró. Interesse: ' + plan + '. Podem me passar os horários?'
      : CONFIG.message;

  const ctaWhats = $('#ctaWhats');
  if (ctaWhats) ctaWhats.href = waLink(CONFIG.message);

  const waFloat = $('#waFloat');
  if (waFloat) waFloat.href = waLink(CONFIG.message);

  const footWhats = $('#footWhats');
  if (footWhats) footWhats.href = waLink(CONFIG.message);

  // Botões de plano -> pré-seleciona o interesse no formulário + rola até ele
  $$('[data-plan]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const plan = btn.getAttribute('data-plan');
      const sel = $('#fPlan');
      if (sel) {
        const match = Array.from(sel.options).find((o) => o.value === plan);
        if (match) sel.value = plan;
      }
    });
  });

  /* ------------------------------------------------ Form -> WhatsApp */
  const form = $('#bookingForm');
  if (form) {
    const setError = (id, msg) => {
      const field = document.getElementById(id)?.closest('.field');
      const err = document.querySelector('.err[data-for="' + id + '"]');
      if (field) field.classList.toggle('invalid', Boolean(msg));
      if (err) err.textContent = msg || '';
    };

    // Máscara simples de telefone brasileiro
    const phone = $('#fPhone');
    if (phone) {
      phone.addEventListener('input', () => {
        let v = phone.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 10)      v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        else if (v.length > 6)  v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        else if (v.length > 2)  v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        else if (v.length > 0)  v = v.replace(/(\d{0,2})/, '($1');
        phone.value = v;
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome  = $('#fNome').value.trim();
      const tel   = $('#fPhone').value.replace(/\D/g, '');
      const plano = $('#fPlan').value;

      let ok = true;
      if (nome.length < 2)            { setError('fNome', 'Diga como podemos te chamar 🙂'); ok = false; } else setError('fNome', '');
      if (tel.length < 10 || tel.length > 11) { setError('fPhone', 'Informe um WhatsApp válido com DDD'); ok = false; } else setError('fPhone', '');
      if (!plano)                     { setError('fPlan', 'Escolha o tipo de aula que te interessa'); ok = false; } else setError('fPlan', '');

      if (!ok) {
        const firstInvalid = form.querySelector('.field.invalid input, .field.invalid select');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const quando = ($('#fWhen')?.value || '').trim();
      const msg =
        'Olá! Quero agendar minha *aula grátis* de forró. 💃\n\n' +
        '*Nome:* ' + nome + '\n' +
        '*WhatsApp:* ' + $('#fPhone').value + '\n' +
        '*Interesse:* ' + plano + '\n' +
        (quando ? '*Melhor horário:* ' + quando + '\n' : '') +
        '\nPodem confirmar a disponibilidade?';

      window.open(waLink(msg), '_blank', 'noopener');
    });
  }

  /* ----------------------------------------------------------- Footer year */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
