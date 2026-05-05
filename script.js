
//new

document.addEventListener("DOMContentLoaded", () => {

  // ── CURSOR
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx=0, my=0, rx=0, ry=0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (cur) { cur.style.left = mx+'px'; cur.style.top = my+'px'; }
  });

  (function animRing() {
    if (ring) {
      rx += (mx-rx)*0.12; ry += (my-ry)*0.12;
      ring.style.left = rx+'px'; ring.style.top = ry+'px';
    }
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a,button,.c-btn,.skill-card,.cert-card,.edu-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cur && ring) {
        cur.style.width='14px'; cur.style.height='14px';
        cur.style.background='var(--rose)';
        ring.style.width='52px'; ring.style.height='52px';
      }
    });
    el.addEventListener('mouseleave', () => {
      if (cur && ring) {
        cur.style.width='8px'; cur.style.height='8px';
        cur.style.background='var(--violet-bright)';
        ring.style.width='32px'; ring.style.height='32px';
      }
    });
  });

  // ── PROGRESS BAR + SCROLL EVENTS
  const pb = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const st = window.scrollY;
    const dh = document.documentElement.scrollHeight - window.innerHeight;
    if (pb) pb.style.width = (st/dh*100)+'%';
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

  class NodeParticle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
      
      // Slight mouse attraction
      let dx = mx - this.x;
      let dy = my - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        this.x += dx * 0.005;
        this.y += dy * 0.005;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(157, 92, 255, 0.8)' : 'rgba(124, 58, 237, 0.6)';
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    let numParticles = Math.min((width * height) / 15000, 100); 
    for (let i = 0; i < numParticles; i++) {
      particlesArray.push(new NodeParticle());
    }
  }
  initParticles();

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
      for (let j = i; j < particlesArray.length; j++) {
        let dx = particlesArray[i].x - particlesArray[j].x;
        let dy = particlesArray[i].y - particlesArray[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
          ctx.beginPath();
          ctx.strokeStyle = isDark ? `rgba(0, 229, 204, ${1 - distance/120})` : `rgba(8, 145, 178, ${1 - distance/120})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
          ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ── MATH SYMBOLS PARTICLES (HERO SPECIFIC)
  const pContainer = document.getElementById('particles');
  if (pContainer) {
    const sym = ['0','1','∑','μ','σ','∂','∇','∞','α','β','λ','ρ','Δ','∫','π','θ','⟨','⟩','∈','∅', 'x̄', 'ŷ', 'R²'];
    for (let i=0; i<25; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = sym[Math.floor(Math.random()*sym.length)];
      p.style.cssText = `left:${Math.random()*100}%;font-size:${10+Math.random()*12}px;animation-duration:${8+Math.random()*18}s;animation-delay:${-Math.random()*22}s`;
      pContainer.appendChild(p);
    }
  }

  // ── TYPED ROLE
  const roles = ['Data Science Engineer','ML Enthusiast','Python Developer','Data Storyteller','Future Data Scientist','Anomaly Detector','AI Explorer'];
  let ri=0, ci=0, deleting=false;
  const typed = document.getElementById('typed-role');
  function type() {
    if (!typed) return;
    const r = roles[ri];
    const cursor = '<span class="typed-cursor"></span>';
    if (!deleting) {
      ci++; typed.innerHTML = r.slice(0,ci)+cursor;
      if (ci === r.length) { deleting=true; setTimeout(type,2200); return; }
    } else {
      ci--; typed.innerHTML = r.slice(0,ci)+cursor;
      if (ci === 0) { deleting=false; ri=(ri+1)%roles.length; setTimeout(type,400); return; }
    }
    setTimeout(type, deleting ? 55 : 105);
  }
  setTimeout(type, 1400);

  // ── COUNTERS
  function animCounter(el, target) {
    let cur=0;
    const isGPA = (target===889);
    const step = Math.ceil(target/50);
    const t = setInterval(() => {
      cur = Math.min(cur+step, target);
      el.textContent = isGPA ? (cur/100).toFixed(2) : cur+(target>5?'+':'');
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
  let pc=0; const ptotal=4;
  const pt = document.getElementById('projTrack');
  const pdots = document.querySelectorAll('#projDots .c-dot');
  const pinfo = document.getElementById('projInfo');

  function projGoTo(n) {
    if (!pt) return;
    pc = (n+ptotal)%ptotal;
    pt.style.transform = `translateX(-${pc*100}%)`;
    pdots.forEach((d,i) => d.classList.toggle('on', i===pc));
    if (pinfo) pinfo.textContent = `0${pc+1} / 0${ptotal}`;
  }

  document.getElementById('projNext')?.addEventListener('click', () => projGoTo(pc+1));
  document.getElementById('projPrev')?.addEventListener('click', () => projGoTo(pc-1));
  pdots.forEach(d => d.addEventListener('click', () => projGoTo(parseInt(d.dataset.i))));
  setInterval(() => projGoTo(pc+1), 5500);

  // Swipe
  let ts=null;
  pt?.addEventListener('touchstart', e => ts=e.touches[0].clientX);
  pt?.addEventListener('touchend', e => {
    if (ts===null) return;
    const dx = ts - e.changedTouches[0].clientX;
    if (Math.abs(dx)>40) projGoTo(dx>0?pc+1:pc-1);
    ts=null;
  });

  // ── HAMBURGER
  document.getElementById('hamburger')?.addEventListener('click', function() {
    this.classList.toggle('open');
    document.getElementById('navLinks')?.classList.toggle('open');
  });

  // ── FORM
  window.handleForm = function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.textContent='Sending...'; btn.disabled=true;
    setTimeout(() => {
      btn.textContent='Message Sent ✓';
      btn.style.background='linear-gradient(135deg,var(--green),var(--cyan))';
      setTimeout(() => {
        btn.textContent='Send Message →';
        btn.disabled=false; btn.style.background='';
        e.target.reset();
      }, 3000);
    }, 1200);
  };

  // ── DOWNLOAD RESUME
  window.downloadResume = function(e) {
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
      a.style.color = a.getAttribute('href')==='#'+current ? 'var(--violet-bright)' : '';
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

