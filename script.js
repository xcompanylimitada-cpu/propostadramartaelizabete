/* =============================================
   TRUE GROWTH — Dra. Marta Elizabete
   script.js
   ============================================= */

/* ── NAV scroll ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── Parallax orbs (desktop only) ── */
if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', (e) => {
    const mx = e.clientX / window.innerWidth  - 0.5;
    const my = e.clientY / window.innerHeight - 0.5;
    document.querySelectorAll('.orb').forEach((o, i) => {
      const s = (i + 1) * 13;
      o.style.transform = `translate(${mx * s}px, ${my * s}px)`;
    });
  });
}

/* ── Scroll reveal with stagger ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseFloat(entry.target.dataset.delay || 0);
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

// Stagger sibling groups
function stagger(selector, gap) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.dataset.delay = i * gap;
    revealObs.observe(el);
  });
}

stagger('.card',    90);
stagger('.crm-card', 80);
stagger('.step',    80);
stagger('.metric',  70);
stagger('.tag',     30);

document.querySelectorAll('.chart-box, .price-num-wrap, .price-note-top, .price-note, .cta').forEach(el => {
  revealObs.observe(el);
});

/* ── Counter animation ── */
const numObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      count(entry.target);
      numObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.m-val').forEach(el => numObs.observe(el));

function count(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const dur = 1600;
  const t0  = performance.now();
  (function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    const e = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(e * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

/* ── Chart.js ── */
Chart.defaults.color          = 'rgba(111,168,130,0.8)';
Chart.defaults.font.family    = "'Inter', sans-serif";
Chart.defaults.font.weight    = '300';

const ctx = document.getElementById('chart');
if (ctx) {
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Intenção de compra', 'Conversão', 'Qualidade do lead', 'Taxa de clique', 'Custo/resultado'],
      datasets: [
        {
          label: 'Google Ads',
          data: [9.2, 8.2, 9.0, 7.8, 8.6],
          backgroundColor: '#2dffaa',
          borderRadius: 5, borderSkipped: false,
        },
        {
          label: 'Facebook Ads',
          data: [3.4, 2.7, 3.1, 4.2, 3.5],
          backgroundColor: 'rgba(255,255,255,0.10)',
          borderRadius: 5, borderSkipped: false,
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#091508',
          borderColor: 'rgba(45,255,170,0.22)',
          borderWidth: 1, padding: 12,
          callbacks: { label: c => ` ${c.dataset.label}: ${c.raw}/10` }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(45,255,170,0.04)' },
          border: { display: false },
          ticks: { font: { size: 11 } }
        },
        y: {
          min: 0, max: 10,
          grid: { color: 'rgba(45,255,170,0.04)' },
          border: { display: false },
          ticks: { font: { size: 11 }, callback: v => v + '/10' }
        }
      },
      animation: {
        duration: 1300, easing: 'easeOutQuart',
        delay: c => c.dataIndex * 65
      }
    }
  });
}

/* ── iframe fallback ── */
document.querySelectorAll('.pc-in iframe').forEach(iframe => {
  iframe.addEventListener('error', function () {
    const fb = document.createElement('div');
    Object.assign(fb.style, {
      position: 'absolute', inset: '32px 0 0 0',
      background: '#060f0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(45,255,170,0.2)',
      fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase'
    });
    fb.textContent = this.title || 'Preview';
    this.replaceWith(fb);
  });
});
