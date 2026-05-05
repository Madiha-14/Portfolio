// ── WAIT FOR DOM LOAD
document.addEventListener("DOMContentLoaded", () => {

  // ── CURSOR
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx=0,my=0,rx=0,ry=0;

  document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    if(cur){
      cur.style.left=mx+'px';
      cur.style.top=my+'px';
    }
  });

  (function animRing(){
    if(ring){
      rx+=(mx-rx)*0.12;
      ry+=(my-ry)*0.12;
      ring.style.left=rx+'px';
      ring.style.top=ry+'px';
    }
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a,button,.c-btn,.skill-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{
      if(cur && ring){
        cur.style.width='18px';
        cur.style.height='18px';
        ring.style.width='56px';
        ring.style.height='56px';
      }
    });
    el.addEventListener('mouseleave',()=>{
      if(cur && ring){
        cur.style.width='10px';
        cur.style.height='10px';
        ring.style.width='36px';
        ring.style.height='36px';
      }
    });
  });

  // ── PARTICLES
  const pContainer=document.getElementById('particles');
  if(pContainer){
    const pSymbols=['0','1','∑','μ','σ','∂','∇','∞','α','β','λ','ρ','Δ','∫','π','θ'];
    for(let i=0;i<30;i++){
      const p=document.createElement('div');
      p.className='particle';
      p.textContent=pSymbols[Math.floor(Math.random()*pSymbols.length)];
      p.style.left=Math.random()*100+'%';
      p.style.animationDuration=(8+Math.random()*16)+'s';
      p.style.animationDelay=(-Math.random()*20)+'s';
      p.style.fontSize=(9+Math.random()*8)+'px';
      pContainer.appendChild(p);
    }
  }

  // ── TYPED ROLE
  const roles=['Data Science Engineer','ML Enthusiast','Python Developer','Data Storyteller','Future Data Scientist'];
  let ri=0,ci=0,deleting=false;
  const el=document.getElementById('typed-role');

  function type(){
    if(!el) return;
    const r=roles[ri];
    const cursor='<span class="typed-cursor"></span>';

    if(!deleting){
      ci++;
      el.innerHTML=r.slice(0,ci)+cursor;
      if(ci===r.length){deleting=true;setTimeout(type,2000);return}
    }else{
      ci--;
      el.innerHTML=r.slice(0,ci)+cursor;
      if(ci===0){deleting=false;ri=(ri+1)%roles.length;setTimeout(type,400);return}
    }
    setTimeout(type,deleting?60:110);
  }
  setTimeout(type,1200);

  // ── COUNTER
  function animCounter(el,target){
    let cur=0;
    const step=Math.ceil(target/40);
    const t=setInterval(()=>{
      cur=Math.min(cur+step,target);
      el.textContent=cur+(target>10?'+':'');
      if(cur>=target)clearInterval(t);
    },40);
  }

  const stats=document.querySelector('.hero-stats');
  if(stats){
    const counterObs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          document.querySelectorAll('[data-count]').forEach(el=>{
            animCounter(el,parseInt(el.dataset.count));
          });
          counterObs.disconnect();
        }
      });
    });
    counterObs.observe(stats);
  }

  // ── REVEAL
  const revObs=new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        setTimeout(()=>e.target.classList.add('visible'),i*80);
      }
    });
  });
  document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));

  // ── SKILL BARS
  const barObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.querySelectorAll('.skill-bar-fill').forEach(b=>{
          b.style.width=b.dataset.width+'%';
        });
      }
    });
  });
  document.querySelectorAll('.skill-card').forEach(c=>barObs.observe(c));

  // ── CAROUSEL
  let pc=0;
  const ptotal=3;
  const pt=document.getElementById('projTrack');
  const pdots=document.querySelectorAll('#projDots .c-dot');
  const pinfo=document.getElementById('projInfo');

  function projGoTo(n){
    if(!pt) return;
    pc=(n+ptotal)%ptotal;
    pt.style.transform='translateX(-'+(pc*100)+'%)';
    pdots.forEach((d,i)=>d.classList.toggle('on',i===pc));
    if(pinfo){
      pinfo.textContent=`0${pc+1} / 0${ptotal}`;
    }
  }

  document.getElementById('projNext')?.addEventListener('click',()=>projGoTo(pc+1));
  document.getElementById('projPrev')?.addEventListener('click',()=>projGoTo(pc-1));

  pdots.forEach(d=>{
    d.addEventListener('click',()=>projGoTo(parseInt(d.dataset.i)));
  });

  setInterval(()=>projGoTo(pc+1),5000);

  // ── FORM
  window.handleForm=function(e){
    e.preventDefault();
    const btn=document.getElementById('submitBtn');
    btn.textContent='Sending...';
    btn.disabled=true;

    setTimeout(()=>{
      btn.textContent='Message Sent ✓';
      btn.style.background='var(--green)';
      setTimeout(()=>{
        btn.textContent='Send Message →';
        btn.disabled=false;
        btn.style.background='';
        e.target.reset();
      },3000);
    },1200);
  }

  // ── HAMBURGER
  document.getElementById('hamburger')?.addEventListener('click',()=>{
    const nl=document.querySelector('.nav-links');
    nl.style.display=nl.style.display==='flex'?'none':'flex';
    nl.style.flexDirection='column';
  });

});