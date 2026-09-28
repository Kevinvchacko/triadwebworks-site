(function(){
  var doc=document, root=doc.documentElement;
  var mm=function(q){return window.matchMedia?window.matchMedia(q).matches:false;};
  var reduce=mm('(prefers-reduced-motion: reduce)');
  root.classList.add('js-anim');

  /* ---------- WhatsApp routing: random founder, 25% each ---------- */
  var numbers=['918667828159','919087065160','919003670979','919363581924'];
  var idx=Math.floor(Math.random()*numbers.length);
  var st={audience:'local',picked:{},timeline:'asap'};
  var svcLabels={website:'Website',store:'Online store',app:'Web app',design:'UI/UX design',manage:'Ongoing updates',seo:'SEO and speed',security:'Security hardening',integrations:'Integrations'};
  var tlLabels={asap:'As soon as possible',month:'Within a month',explore:'Just exploring'};
  var msgs={
    call:"Hi Triad Webworks, I'd like to book a free call.",
    quote:"Hi Triad Webworks, I'd like a quote for a website.",
    launch:"Hi Triad Webworks, I'd like a quote for the Launch package.",
    growth:"Hi Triad Webworks, I'd like a quote for the Growth package.",
    care:"Hi Triad Webworks, I'd like a quote for Managed Care."
  };
  function val(id){var el=doc.getElementById(id);return el?el.value.trim():'';}
  function briefText(){
    var lines=["Hi Triad Webworks, I'd like a quote."];
    if(val('brief-name'))lines.push('Name: '+val('brief-name'));
    if(val('brief-email'))lines.push('Email: '+val('brief-email'));
    var p=Object.keys(svcLabels).filter(function(k){return st.picked[k];}).map(function(k){return svcLabels[k];});
    lines.push('Needs: '+(p.length?p.join(', '):'Not sure yet'));
    lines.push('Start: '+tlLabels[st.timeline]);
    if(val('brief-msg'))lines.push('About the project: '+val('brief-msg'));
    return lines.join('\n');
  }
  function waHref(kind){
    var t=kind==='brief'?briefText():(msgs[kind]||msgs.call);
    return 'https://wa.me/'+numbers[idx]+'?text='+encodeURIComponent(t);
  }
  function refresh(){doc.querySelectorAll('[data-wa]').forEach(function(a){a.href=waHref(a.getAttribute('data-wa'));});}
  refresh();
  function reroll(e){
    var a=e.target&&e.target.closest?e.target.closest('[data-wa]'):null;
    if(!a)return;
    idx=Math.floor(Math.random()*numbers.length);
    a.href=waHref(a.getAttribute('data-wa'));
  }
  ['pointerdown','focusin','touchstart'].forEach(function(t){doc.addEventListener(t,reroll,{passive:true});});
  doc.addEventListener('click',function(e){
    var a=e.target&&e.target.closest?e.target.closest('[data-wa]'):null;
    if(!a)return;
    a.href=waHref(a.getAttribute('data-wa'));
    if(a.getAttribute('data-wa')==='brief'){
      setTimeout(function(){doc.getElementById('brief-form').hidden=true;doc.getElementById('brief-sent').hidden=false;},400);
    }
  });

  /* ---------- mobile menu ---------- */
  var mbtn=doc.getElementById('menu-btn'), menu=doc.getElementById('mobile-menu');
  function setMenu(open){
    menu.hidden=!open; mbtn.setAttribute('aria-expanded',open?'true':'false');
    mbtn.querySelector('.ico-open').toggleAttribute('hidden',open);
    mbtn.querySelector('.ico-close').toggleAttribute('hidden',!open);
  }
  mbtn.addEventListener('click',function(){setMenu(menu.hidden);});
  menu.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(){setTimeout(function(){setMenu(false);},150);});});
  doc.querySelector('header').addEventListener('keydown',function(e){if(e.key==='Escape'){setMenu(false);mbtn.focus();}});

  /* ---------- audience toggle ---------- */
  var LI="<li style=\"display:flex;gap:12px;align-items:flex-start;font-size:17px;\">\n              <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#FF9A62\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" style=\"flex:none;margin-top:4px;\"><path d=\"M5 12.5l4.5 4.5L19 7.5\"></path></svg>\n              <span>{{ item.text }}</span>\n            </li>";
  var sets={local:["A mobile-first site that shows up when locals search","Enquiry forms, online booking, or WhatsApp chat","Simple updates you can do yourself, or leave to us"],
            startup:["A launch page that explains what you do in seconds","A store or web app that takes payments online","Analytics and integrations wired in from day one"]};
  var segOn='#F6F3FF', segOnC='#0B0919';
  doc.querySelectorAll('[data-aud]').forEach(function(b){
    b.addEventListener('click',function(){
      st.audience=b.getAttribute('data-aud');
      doc.querySelectorAll('[data-aud]').forEach(function(x){
        var on=x===b; x.setAttribute('aria-pressed',on?'true':'false');
        x.style.background=on?segOn:'transparent'; x.style.color=on?segOnC:'#F6F3FF';
      });
      doc.getElementById('aud-list').innerHTML=sets[st.audience].map(function(t){
        var s=doc.createElement('span');s.textContent=t;return LI.replace('{{ item.text }}',s.innerHTML);
      }).join('');
    });
  });

  /* ---------- FAQ ---------- */
  var faqItems=[].slice.call(doc.querySelectorAll('.faq-item'));
  faqItems.forEach(function(it){
    it.querySelector('.faq-q').addEventListener('click',function(){
      var willOpen=!it.classList.contains('open');
      faqItems.forEach(function(o){
        var on=o===it&&willOpen;
        o.classList.toggle('open',on);
        o.querySelector('.faq-q').setAttribute('aria-expanded',on?'true':'false');
        o.querySelector('.faq-a').setAttribute('aria-hidden',on?'false':'true');
        o.querySelector('.faq-plus').style.transform=on?'rotate(135deg)':'rotate(0deg)';
      });
    });
  });

  /* ---------- quote form ---------- */
  var chipOn={background:'linear-gradient(100deg,#6B43FF,#B734D6)',borderColor:'transparent',color:'#ffffff'};
  var chipOff={background:'transparent',borderColor:'rgba(255,255,255,0.24)',color:'#F6F3FF'};
  function paint(b,on){var s=on?chipOn:chipOff;b.style.background=s.background;b.style.borderColor=s.borderColor;b.style.color=s.color;b.setAttribute('aria-pressed',on?'true':'false');}
  doc.querySelectorAll('[data-svc]').forEach(function(b){
    b.addEventListener('click',function(){var k=b.getAttribute('data-svc');st.picked[k]=!st.picked[k];paint(b,st.picked[k]);refresh();});
  });
  doc.querySelectorAll('[data-time]').forEach(function(b){
    b.addEventListener('click',function(){st.timeline=b.getAttribute('data-time');doc.querySelectorAll('[data-time]').forEach(function(x){paint(x,x===b);});refresh();});
  });
  ['brief-name','brief-email','brief-msg'].forEach(function(id){var el=doc.getElementById(id);if(el)el.addEventListener('input',refresh);});
  doc.getElementById('brief-reset').addEventListener('click',function(){
    st.picked={};st.timeline='asap';
    ['brief-name','brief-email','brief-msg'].forEach(function(id){doc.getElementById(id).value='';});
    doc.querySelectorAll('[data-svc]').forEach(function(x){paint(x,false);});
    doc.querySelectorAll('[data-time]').forEach(function(x){paint(x,x.getAttribute('data-time')==='asap');});
    refresh();
    doc.getElementById('brief-sent').hidden=true;doc.getElementById('brief-form').hidden=false;
  });

  /* ---------- scroll reveals ---------- */
  var hasIO=typeof window.IntersectionObserver==='function';
  var secs=[].slice.call(doc.querySelectorAll('.rv-sec'));
  if(!hasIO){secs.forEach(function(el){el.classList.add('in');});}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:0.08,rootMargin:'0px 0px -6% 0px'});
    secs.forEach(function(el){io.observe(el);});
    setTimeout(function(){secs.forEach(function(el){if(el.getBoundingClientRect().top<window.innerHeight)el.classList.add('in');});},2500);
    var links=[].slice.call(doc.querySelectorAll('.nav-links a[href^="#"]'));
    var navIo=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){var id='#'+en.target.id;links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')===id);});}});},{rootMargin:'-45% 0px -50% 0px'});
    ['services','process','packages','work','team','faq'].forEach(function(id){var el=doc.getElementById(id);if(el)navIo.observe(el);});
  }

  /* ---------- scroll progress / nav / fab ---------- */
  var ticking=false;
  function onScroll(){
    if(ticking)return;ticking=true;
    requestAnimationFrame(function(){
      ticking=false;
      var y=window.scrollY||root.scrollTop||0, max=Math.max(1,root.scrollHeight-window.innerHeight);
      root.style.setProperty('--sp',Math.min(1,Math.max(0,y/max)).toFixed(4));
      root.setAttribute('data-scrolled',y>40?'1':'0');
      root.setAttribute('data-past-hero',y>window.innerHeight*0.55?'1':'0');
      root.setAttribute('data-end',max-y<180?'1':'0');
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* ---------- pointer effects (desktop) ---------- */
  if(!reduce&&mm('(hover: hover) and (pointer: fine)')){
    root.classList.add('fine');
    var raf=0,ev=null,lastCard=null,lastMag=null;
    window.addEventListener('pointermove',function(e){
      ev=e;if(raf)return;
      raf=requestAnimationFrame(function(){
        raf=0;var x=ev.clientX,y=ev.clientY;
        root.style.setProperty('--cx',x+'px');root.style.setProperty('--cy',y+'px');
        root.style.setProperty('--mx',(x/window.innerWidth-0.5).toFixed(3));root.style.setProperty('--my',(y/window.innerHeight-0.5).toFixed(3));
        var t=ev.target&&ev.target.closest?ev.target:null;
        var card=t?t.closest('.spot'):null;
        if(card){var r=card.getBoundingClientRect(),px=(x-r.left)/r.width,py=(y-r.top)/r.height;
          card.style.setProperty('--x',(px*100).toFixed(1)+'%');card.style.setProperty('--y',(py*100).toFixed(1)+'%');
          card.style.setProperty('--rx',((0.5-py)*7).toFixed(2)+'deg');card.style.setProperty('--ry',((px-0.5)*9).toFixed(2)+'deg');}
        if(lastCard&&lastCard!==card){lastCard.style.setProperty('--rx','0deg');lastCard.style.setProperty('--ry','0deg');}
        lastCard=card;
        var mag=t?t.closest('.mag'):null;
        if(mag){var r2=mag.getBoundingClientRect();mag.style.setProperty('--tx',((x-(r2.left+r2.width/2))*0.22).toFixed(1)+'px');mag.style.setProperty('--ty',((y-(r2.top+r2.height/2))*0.32).toFixed(1)+'px');}
        if(lastMag&&lastMag!==mag){lastMag.style.setProperty('--tx','0px');lastMag.style.setProperty('--ty','0px');}
        lastMag=mag;
      });
    },{passive:true});
  }
})();
