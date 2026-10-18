/**
 * AEGIS - Segurança digital para a vida real
 * Script de Comportamento Interativo
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Rolagem suave para links de âncora com compensação do Header fixo
  const header = document.querySelector('.site-header');
  const headerHeight = header ? header.offsetHeight : 64;

  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 16;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 2. Animação de entrada das barras de progresso ao rolar até a seção de estatísticas
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  if (progressBars.length > 0 && 'IntersectionObserver' in window) {
    const progressObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-target-width') || bar.style.width;
            bar.style.width = '0%';
            requestAnimationFrame(() => {
              setTimeout(() => {
                bar.style.width = targetWidth;
              }, 100);
            });
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    const scenarioSection = document.getElementById('cenario');
    if (scenarioSection) {
      progressObserver.observe(scenarioSection);
    }
  }

  // 3. Efeito sutil de elevação nos cartões interativos
  const interactiveCards = document.querySelectorAll('.stats-card, .metric-card, .partner-card, .phone-mockup-card');
  interactiveCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.2s ease, border-color 0.2s ease';
    });
  });

  // 4. Controle inteligente do player do Pitch (prevenção contra Erro 153 e reprodução fluida)
  const playBtn = document.getElementById('pitch-play-btn');
  const facade = document.getElementById('pitch-facade');
  const iframe = document.getElementById('pitch-iframe');

  if (facade && iframe) {
    const handlePlayVideo = () => {
      if (window.location.protocol === 'file:') {
        // No protocolo local file://, o YouTube rejeita requisições sem cabeçalho Referer de rede (Erro 153).
        // Abre imediatamente a apresentação no YouTube com segurança:
        window.open('https://www.youtube.com/watch?v=nBtQD_mQxIc&t=16s', '_blank', 'noopener,noreferrer');
      } else {
        // Em ambiente HTTP/HTTPS (localhost, servidor de desenvolvimento ou deploy),
        // inicializa e executa o iframe diretamente na página:
        iframe.src = iframe.getAttribute('data-src');
        iframe.style.display = 'block';
        facade.style.display = 'none';
      }
    };

    if (playBtn) {
      playBtn.addEventListener('click', handlePlayVideo);
    }
    facade.addEventListener('click', handlePlayVideo);
  }
});

