document.addEventListener("DOMContentLoaded", () => {

  // ── CURSOR
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (cur) { cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
  });

  (function animRing() {
    if (ring) {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    }
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a,button,.c-btn,.skill-card,.cert-card,.edu-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cur && ring) {
        cur.style.width = '14px'; cur.style.height = '14px';
        cur.style.background = 'var(--rose)';
        ring.style.width = '52px'; ring.style.height = '52px';
      }
    });
    el.addEventListener('mouseleave', () => {
      if (cur && ring) {
        cur.style.width = '8px'; cur.style.height = '8px';
        cur.style.background = 'var(--violet-bright)';
        ring.style.width = '32px'; ring.style.height = '32px';
      }
    });
  });

  // ── PROGRESS BAR + SCROLL EVENTS
  const pb = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const st = window.scrollY;
    const dh = document.documentElement.scrollHeight - window.innerHeight;
    if (pb) pb.style.width = (st / dh * 100) + '%';
    document.getElementById('back-top')?.classList.toggle('show', st > 500);
    document.getElementById('main-nav')?.classList.toggle('scrolled', st > 60);
  });

  // ── THEME TOGGLE
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeKnob = document.getElementById('themeKnob');
  let isDark = true;

  themeToggle?.addEventListener('click', () => {
    isDark = !isDark;
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeKnob.textContent = isDark ? '🌙' : '☀️';
  });

  // ── DATA SCIENCE NEURAL NETWORK BACKGROUND
  const canvas = document.createElement('canvas');
  canvas.id = 'neural-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.opacity = '0.4';

  const bgCanvasContainer = document.querySelector('.bg-canvas');
  if (bgCanvasContainer) {
    bgCanvasContainer.appendChild(canvas);
  } else {
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');
  let width, height;
  let particlesArray = [];

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class StarParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.life = Math.random() * 0.6 + 0.1; 
      
      this.isShooting = Math.random() > 0.985;
      if (this.isShooting) {
        this.size = Math.random() * 1.5 + 1;
        this.vx = (Math.random() * 5 + 4) * (Math.random() > 0.5 ? 1 : -1);
        this.vy = (Math.random() * 5 + 4) * (Math.random() > 0.5 ? 1 : -1);
        this.life = 1;
        this.trail = [];
      }
    }
    update() {
      if (this.isShooting) {
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 10) this.trail.shift();
      }
      
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.isShooting) {
        this.life -= 0.015;
        if (this.life <= 0 || this.x < -50 || this.x > width+50 || this.y < -50 || this.y > height+50) {
          this.reset();
        }
      } else {
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        
        let dx = mx - this.x;
        let dy = my - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
           this.x -= dx * 0.003;
           this.y -= dy * 0.003;
        }
      }
    }
    draw() {
      if (this.isShooting && this.trail.length > 0) {
        ctx.beginPath();
        ctx.moveTo(this.trail[0].x, this.trail[0].y);
        for (let i = 1; i < this.trail.length; i++) {
           ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        ctx.strokeStyle = `rgba(0, 229, 204, ${this.life})`;
        ctx.lineWidth = this.size;
        ctx.stroke();
      } else {
        ctx.shadowBlur = 8;
        ctx.shadowColor = isDark ? '#00e5cc' : '#6d28d9';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${this.life})` : `rgba(124, 58, 237, ${this.life})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  function initParticles() {
    particlesArray = [];
    let numParticles = Math.min((width * height) / 9000, 160);
    for (let i = 0; i < numParticles; i++) {
      particlesArray.push(new StarParticle());
    }
  }
  initParticles();

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ── MATH SYMBOLS PARTICLES (HERO SPECIFIC)
  const pContainer = document.getElementById('particles');
  if (pContainer) {
    const sym = ['0', '1', '∑', 'μ', 'σ', '∂', '∇', '∞', 'α', 'β', 'λ', 'ρ', 'Δ', '∫', 'π', 'θ', '⟨', '⟩', '∈', '∅', 'x̄', 'ŷ', 'R²'];
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = sym[Math.floor(Math.random() * sym.length)];
      p.style.cssText = `left:${Math.random() * 100}%;font-size:${10 + Math.random() * 12}px;animation-duration:${8 + Math.random() * 18}s;animation-delay:${-Math.random() * 22}s`;
      pContainer.appendChild(p);
    }
  }

  // ── TYPED ROLE
  const roles = ['Data Science Engineer', 'ML Enthusiast', 'Python Developer', 'Data Storyteller', 'Future Data Scientist', 'Anomaly Detector', 'AI Explorer'];
  let ri = 0, ci = 0, deleting = false;
  const typed = document.getElementById('typed-role');
  function type() {
    if (!typed) return;
    const r = roles[ri];
    const cursor = '<span class="typed-cursor"></span>';
    if (!deleting) {
      ci++; typed.innerHTML = r.slice(0, ci) + cursor;
      if (ci === r.length) { deleting = true; setTimeout(type, 2200); return; }
    } else {
      ci--; typed.innerHTML = r.slice(0, ci) + cursor;
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(type, 400); return; }
    }
    setTimeout(type, deleting ? 55 : 105);
  }
  setTimeout(type, 1400);

  // ── COUNTERS
  function animCounter(el, target) {
    let cur = 0;
    const isGPA = (target === 889);
    const step = Math.ceil(target / 50);
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = isGPA ? (cur / 100).toFixed(2) : cur + (target > 5 ? '+' : '');
      if (cur >= target) clearInterval(t);
    }, 35);
  }

  const stats = document.querySelector('.hero-stats');
  if (stats) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          document.querySelectorAll('[data-count]').forEach(el => animCounter(el, parseInt(el.dataset.count)));
          obs.disconnect();
        }
      });
    });
    obs.observe(stats);
  }

  // ── SCROLL REVEAL — multiple types
  const revealTypes = [
    { selector: '.reveal', threshold: 0.12 },
    { selector: '.reveal-left', threshold: 0.12 },
    { selector: '.reveal-right', threshold: 0.12 },
    { selector: '.reveal-pop', threshold: 0.12 },
  ];
  revealTypes.forEach(({ selector, threshold }) => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          const delay = e.target.style.transitionDelay ? 0 : i * 80;
          setTimeout(() => e.target.classList.add('visible'), delay);
        }
      });
    }, { threshold });
    document.querySelectorAll(selector).forEach(el => obs.observe(el));
  });

  // ── SKILL BARS
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(b => {
          b.style.width = b.dataset.width + '%';
        });
      }
    });
  }, { threshold: .3 });
  document.querySelectorAll('.skill-card').forEach(c => barObs.observe(c));

  // ── CAROUSEL (4 slides)
  let pc = 0; const ptotal = 4;
  const pt = document.getElementById('projTrack');
  const pdots = document.querySelectorAll('#projDots .c-dot');
  const pinfo = document.getElementById('projInfo');

  function projGoTo(n) {
    if (!pt) return;
    pc = (n + ptotal) % ptotal;
    pt.style.transform = `translateX(-${pc * 100}%)`;
    pdots.forEach((d, i) => d.classList.toggle('on', i === pc));
    if (pinfo) pinfo.textContent = `0${pc + 1} / 0${ptotal}`;
  }

  document.getElementById('projNext')?.addEventListener('click', () => projGoTo(pc + 1));
  document.getElementById('projPrev')?.addEventListener('click', () => projGoTo(pc - 1));
  pdots.forEach(d => d.addEventListener('click', () => projGoTo(parseInt(d.dataset.i))));
  setInterval(() => projGoTo(pc + 1), 5500);

  // Swipe
  let ts = null;
  pt?.addEventListener('touchstart', e => ts = e.touches[0].clientX);
  pt?.addEventListener('touchend', e => {
    if (ts === null) return;
    const dx = ts - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) projGoTo(dx > 0 ? pc + 1 : pc - 1);
    ts = null;
  });

  // ── HAMBURGER
  document.getElementById('hamburger')?.addEventListener('click', function () {
    this.classList.toggle('open');
    document.getElementById('navLinks')?.classList.toggle('open');
  });

  // ── FORM
  window.handleForm = function (e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.textContent = 'Sending...'; btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Message Sent ✓';
      btn.style.background = 'linear-gradient(135deg,var(--green),var(--cyan))';
      setTimeout(() => {
        btn.textContent = 'Send Message →';
        btn.disabled = false; btn.style.background = '';
        e.target.reset();
      }, 3000);
    }, 1200);
  };

  // ── DOWNLOAD RESUME
  window.downloadResume = function (e) {
    e.preventDefault();
    // Creates a placeholder resume PDF download
    // Replace 'resume/Madiha_Resume.pdf' with actual file path
    const link = document.createElement('a');
    link.href = 'resume/Madiha_Resume.pdf';
    link.download = 'Madiha_Resume.pdf';
    link.click();
    // Show feedback toast
    const toast = document.createElement('div');
    toast.textContent = '⬇ Resume download started!';
    toast.style.cssText = `
      position:fixed;bottom:5rem;left:50%;transform:translateX(-50%);
      background:var(--glass-bg);backdrop-filter:blur(12px);
      border:.5px solid var(--violet-border);color:var(--violet-bright);
      font-family:var(--font-mono);font-size:12px;letter-spacing:.08em;
      padding:10px 22px;border-radius:8px;z-index:9999;
      animation:fadeUp .4s ease;
      box-shadow:0 8px 28px rgba(124,58,237,0.2);
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  // ── ACTIVE NAV LINK
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navAs.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--violet-bright)' : '';
    });
  });

});

// resume
function downloadResume(e) {
  e.preventDefault();
  alert("Resume download functionality not implemented yet.");
}

function handleForm(e) {
  e.preventDefault();
  alert("Form submitted (demo only).");
}

