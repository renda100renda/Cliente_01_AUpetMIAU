
    document.addEventListener('DOMContentLoaded', function() {
      // ----------------------------------------------------
      // 1. WhatsApp Interactive Message Generator
      // ----------------------------------------------------
      const state = {
        unit: 'Portal do Morumbi (R. Mal. Hastimphilo de Moura, 277)',
        services: ['Banho & Tosa Higiênica'],
        customService: '',
        size: 'Porte Pequeno (até 10kg)',
        day: 'Hoje / O quanto antes',
        petName: ''
      };

      const messagePreviewEl = document.getElementById('messagePreview');
      const petNameInput = document.getElementById('petNameInput');
      const btnSendWhatsapp = document.getElementById('btnSendWhatsapp');
      const customServiceWrap = document.getElementById('customServiceWrap');
      const customServiceInput = document.getElementById('customServiceInput');

      function getActiveUnitPhone() {
        return state.unit.includes('Vila Sônia') ? '5511997654154' : '5511967087583';
      }

      function getFormattedServices() {
        const selected = [];
        state.services.forEach(item => {
          if (item === '__outro__') {
            const customText = state.customService.trim();
            selected.push(customText ? `Outro (${customText})` : 'Outro / Personalizado');
          } else {
            selected.push(item);
          }
        });

        // Caso o usuário tenha preenchido o campo de texto livre mesmo sem clicar na pill
        if (!state.services.includes('__outro__') && state.customService.trim()) {
          selected.push(`Outro (${state.customService.trim()})`);
        }

        if (selected.length === 0) {
          return 'A combinar com a equipe';
        }

        return selected.join(' + ');
      }

      function updatePreview() {
        const petInfo = state.petName.trim() ? `• Nome do Pet: ${state.petName.trim()}\n` : '';
        const servicesText = getFormattedServices();
        const text = `Olá, AUpetMIAU! Gostaria de agendar um atendimento:\n\n` +
          `• Unidade: ${state.unit}\n` +
          `• Serviços: ${servicesText}\n` +
          `• Porte: ${state.size}\n` +
          petInfo +
          `• Preferência de data: ${state.day}\n\n` +
          `Poderiam me informar os horários disponíveis? Obrigado!`;

        messagePreviewEl.textContent = text;

        if (btnSendWhatsapp) {
          const btnSpan = btnSendWhatsapp.querySelector('span');
          if (btnSpan) {
            btnSpan.textContent = state.unit.includes('Vila Sônia')
              ? 'Enviar para Unidade Vila Sônia no WhatsApp (11) 99765-4154'
              : 'Enviar para Loja 1 Morumbi no WhatsApp (11) 96708-7583';
          }
        }

        return text;
      }

      // Single-choice pill groups (Unidade, Porte, Data)
      function setupPillGroup(groupId, stateKey) {
        const container = document.getElementById(groupId);
        if (!container) return;
        const pills = container.querySelectorAll('.choice-pill');

        pills.forEach(pill => {
          pill.addEventListener('click', () => {
            pills.forEach(p => {
              p.classList.remove('selected');
              p.setAttribute('aria-checked', 'false');
            });
            pill.classList.add('selected');
            pill.setAttribute('aria-checked', 'true');
            state[stateKey] = pill.getAttribute('data-value');
            updatePreview();
          });
        });
      }

      setupPillGroup('unitPills', 'unit');
      setupPillGroup('sizePills', 'size');
      setupPillGroup('dayPills', 'day');

      // Multi-selection for Services & Custom Service field
      const servicePills = document.querySelectorAll('#servicePills .choice-pill');
      servicePills.forEach(pill => {
        pill.addEventListener('click', () => {
          const val = pill.getAttribute('data-value');
          const isSelected = pill.classList.contains('selected');

          if (isSelected) {
            // Desmarcar serviço
            pill.classList.remove('selected');
            pill.setAttribute('aria-pressed', 'false');
            state.services = state.services.filter(s => s !== val);

            if (val === '__outro__' && customServiceWrap) {
              customServiceWrap.classList.remove('active');
            }
          } else {
            // Marcar serviço (múltipla seleção)
            pill.classList.add('selected');
            pill.setAttribute('aria-pressed', 'true');
            if (!state.services.includes(val)) {
              state.services.push(val);
            }

            if (val === '__outro__' && customServiceWrap) {
              customServiceWrap.classList.add('active');
              if (customServiceInput) {
                setTimeout(() => customServiceInput.focus(), 60);
              }
            }
          }
          updatePreview();
        });
      });

      if (customServiceInput) {
        customServiceInput.addEventListener('input', function() {
          state.customService = this.value;
          const outroPill = document.querySelector('#servicePills .choice-pill[data-value="__outro__"]');
          if (outroPill && !outroPill.classList.contains('selected')) {
            outroPill.classList.add('selected');
            outroPill.setAttribute('aria-pressed', 'true');
            if (!state.services.includes('__outro__')) {
              state.services.push('__outro__');
            }
          }
          updatePreview();
        });
      }

      if (petNameInput) {
        petNameInput.addEventListener('input', function() {
          state.petName = this.value;
          updatePreview();
        });
      }

      if (btnSendWhatsapp) {
        btnSendWhatsapp.addEventListener('click', function() {
          const finalMessage = updatePreview();
          const phone = getActiveUnitPhone();
          const targetUrl = `https://wa.me/${phone}?text=${encodeURIComponent(finalMessage)}`;
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        });
      }

      updatePreview();

      // ----------------------------------------------------
      // 2. Reviews Carousel Logic (14 Reviews, responsive)
      // ----------------------------------------------------
      const track = document.getElementById('carouselTrack');
      const slides = track ? track.querySelectorAll('.review-slide') : [];
      const prevBtn = document.getElementById('prevReviewBtn');
      const nextBtn = document.getElementById('nextReviewBtn');
      const dotsContainer = document.getElementById('carouselDots');
      const carouselContainer = document.getElementById('reviewsCarousel');

      if (track && slides.length > 0) {
        let currentIndex = 0;
        let autoPlayTimer = null;

        function getVisibleCards() {
          if (window.innerWidth >= 1024) return 3;
          if (window.innerWidth >= 640) return 2;
          return 1;
        }

        function getMaxIndex() {
          return Math.max(0, slides.length - getVisibleCards());
        }

        function buildDots() {
          dotsContainer.innerHTML = '';
          const max = getMaxIndex();
          const totalDots = Math.min(max + 1, 8); // compact dots
          for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => {
              currentIndex = Math.min(i, getMaxIndex());
              updateCarousel();
              resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
          }
        }

        function updateCarousel() {
          const max = getMaxIndex();
          if (currentIndex > max) currentIndex = max;
          if (currentIndex < 0) currentIndex = 0;

          const cardWidthPct = 100 / getVisibleCards();
          track.style.transform = `translateX(-${currentIndex * cardWidthPct}%)`;

          // Update dots
          const dots = dotsContainer.querySelectorAll('.carousel-dot');
          dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === Math.min(currentIndex, dots.length - 1));
          });
        }

        function nextSlide() {
          const max = getMaxIndex();
          currentIndex = currentIndex >= max ? 0 : currentIndex + 1;
          updateCarousel();
        }

        function prevSlide() {
          const max = getMaxIndex();
          currentIndex = currentIndex <= 0 ? max : currentIndex - 1;
          updateCarousel();
        }

        function startAutoPlay() {
          stopAutoPlay();
          autoPlayTimer = setInterval(nextSlide, 5500); // 5.5s autoplay
        }

        function stopAutoPlay() {
          if (autoPlayTimer) clearInterval(autoPlayTimer);
        }

        function resetAutoPlay() {
          stopAutoPlay();
          startAutoPlay();
        }

        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
          });
        }

        if (prevBtn) {
          prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
          });
        }

        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);

        window.addEventListener('resize', () => {
          buildDots();
          updateCarousel();
        });

        buildDots();
        updateCarousel();
        startAutoPlay();
      }

      // ----------------------------------------------------
      // 3. FAQ Accordion
      // ----------------------------------------------------
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        trigger.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');
          faqItems.forEach(i => {
            i.classList.remove('open');
            i.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
          });
          if (!isOpen) {
            item.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
          }
        });
      });

      // ----------------------------------------------------
      // 4. Back to Top Button Interaction (~400px scroll)
      // ----------------------------------------------------
      const backToTopBtn = document.getElementById('backToTopBtn');
      if (backToTopBtn) {
        window.addEventListener('scroll', () => {
          if (window.scrollY >= 400) {
            backToTopBtn.classList.add('visible');
          } else {
            backToTopBtn.classList.remove('visible');
          }
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
      }
    });
  
    // ===== Efeitos de rolagem =====
    // 1) Reveal suave nas secoes
    (function() {
      const targets = document.querySelectorAll('section, .service-card, .diff-card, .unit-card, .review-card, .about-card');
      targets.forEach((el, i) => {
        el.classList.add('reveal');
        if (i % 3 === 1) el.classList.add('reveal-delay-1');
        if (i % 3 === 2) el.classList.add('reveal-delay-2');
      });

      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

      targets.forEach(el => io.observe(el));
    })();

    // 2) Header com sombra ao rolar
    (function() {
      const header = document.querySelector('header.site-header') || document.querySelector('.header-nav');
      if (!header) return;
      window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
      }, { passive: true });
    })();
