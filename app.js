(function(){
  var doc=document, root=doc.documentElement;
  var mm=function(q){return window.matchMedia?window.matchMedia(q).matches:false;};
  var reduce=mm('(prefers-reduced-motion: reduce)');
  if(reduce)document.querySelectorAll('video[autoplay]').forEach(function(v){v.removeAttribute('autoplay');v.pause();});
  var fine=!reduce&&mm('(hover: hover) and (pointer: fine)');
  var $=function(s,c){return (c||doc).querySelector(s);};
  var $$=function(s,c){return [].slice.call((c||doc).querySelectorAll(s));};
  root.classList.add('js');
  if(fine)root.classList.add('fine');
  if('scrollRestoration' in history&&!location.hash){history.scrollRestoration='manual';window.scrollTo(0,0);}

  var T=window.TRIAD||(window.TRIAD={target:{shape:0,x:0,y:0,s:1,o:1,rx:0,ry:0,spin:0},vel:0,go:false});
  T.heroOn=true;

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
  function refresh(){$$('[data-wa]').forEach(function(a){a.href=waHref(a.getAttribute('data-wa'));});}
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

  /* ---------- smooth scroll ---------- */
  var lenis=null;
  if(!reduce&&window.Lenis){
    lenis=new window.Lenis({lerp:0.09,smoothWheel:true,wheelMultiplier:1});
  }
  function scrollToEl(target){
    if(lenis){lenis.scrollTo(target,{offset:0,duration:1.6});}
    else if(target===0){window.scrollTo(0,0);}
    else{target.scrollIntoView({behavior:reduce?'auto':'smooth'});}
  }
  doc.addEventListener('click',function(e){
    var a=e.target&&e.target.closest?e.target.closest('a[href^="#"]'):null;
    if(!a)return;
    var id=a.getAttribute('href');
    var target=id==='#top'?0:doc.querySelector(id);
    if(target===null)return;
    e.preventDefault();
    setMenu(false);
    scrollToEl(target);
  });

  /* ---------- mobile menu ---------- */
  var mbtn=doc.getElementById('menu-btn'), menu=doc.getElementById('mobile-menu');
  function setMenu(open){
    if(!menu)return;
    menu.hidden=!open; mbtn.setAttribute('aria-expanded',open?'true':'false');
    root.setAttribute('data-hide','0');
    if(lenis){open?lenis.stop():lenis.start();}
  }
  mbtn.addEventListener('click',function(){setMenu(menu.hidden);});
  doc.addEventListener('keydown',function(e){if(e.key==='Escape'&&!menu.hidden){setMenu(false);mbtn.focus();}});

  /* ---------- nav roll text ---------- */
  $$('[data-roll]').forEach(function(s){s.setAttribute('data-text',s.textContent);});

  /* ---------- audience toggle ---------- */
  var sets={local:["A mobile-first site that shows up when locals search","Enquiry forms, online booking, or WhatsApp chat","Simple updates you can do yourself, or leave to us"],
            startup:["A launch page that explains what you do in seconds","A store or web app that takes payments online","Analytics and integrations wired in from day one"]};
  var seg=$('.seg'), thumb=$('.seg-thumb');
  function placeThumb(){
    var on=$('[data-aud][aria-pressed="true"]');
    if(!on||!thumb)return;
    thumb.style.setProperty('--sw',on.offsetWidth+'px');
    thumb.style.setProperty('--sx',(on.offsetLeft-4)+'px');
  }
  $$('[data-aud]').forEach(function(b){
    b.addEventListener('click',function(){
      st.audience=b.getAttribute('data-aud');
      $$('[data-aud]').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});
      placeThumb();
      var list=doc.getElementById('aud-list');
      list.textContent='';
      sets[st.audience].forEach(function(t){var li=doc.createElement('li');li.textContent=t;list.appendChild(li);});
    });
  });
  placeThumb();
  window.addEventListener('resize',placeThumb);
  if(doc.fonts&&doc.fonts.ready)doc.fonts.ready.then(placeThumb);

  /* ---------- FAQ ---------- */
  var faqItems=$$('.faq-item');
  faqItems.forEach(function(it){
    it.querySelector('.faq-q').addEventListener('click',function(){
      var willOpen=!it.classList.contains('open');
      faqItems.forEach(function(o){
        var on=o===it&&willOpen;
        o.classList.toggle('open',on);
        o.querySelector('.faq-q').setAttribute('aria-expanded',on?'true':'false');
      });
      setTimeout(function(){if(window.ScrollTrigger)window.ScrollTrigger.refresh();},700);
    });
  });

  /* ---------- quote form ---------- */
  function paint(b,on){b.setAttribute('aria-pressed',on?'true':'false');}
  $$('[data-svc]').forEach(function(b){
    b.addEventListener('click',function(){var k=b.getAttribute('data-svc');st.picked[k]=!st.picked[k];paint(b,st.picked[k]);refresh();});
  });
  $$('[data-time]').forEach(function(b){
    b.addEventListener('click',function(){st.timeline=b.getAttribute('data-time');$$('[data-time]').forEach(function(x){paint(x,x===b);});refresh();});
  });
  ['brief-name','brief-email','brief-msg'].forEach(function(id){var el=doc.getElementById(id);if(el)el.addEventListener('input',refresh);});
  doc.getElementById('brief-reset').addEventListener('click',function(){
    st.picked={};st.timeline='asap';
    ['brief-name','brief-email','brief-msg'].forEach(function(id){doc.getElementById(id).value='';});
    $$('[data-svc]').forEach(function(x){paint(x,false);});
    $$('[data-time]').forEach(function(x){paint(x,x.getAttribute('data-time')==='asap');});
    refresh();
    doc.getElementById('brief-sent').hidden=true;doc.getElementById('brief-form').hidden=false;
  });

  /* ---------- Chennai clock ---------- */
  var clockEl=doc.getElementById('clock');
  var fmt=null;
  try{fmt=new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',hour:'numeric',minute:'2-digit',second:'2-digit',hour12:true});}catch(e){}
  function tick(){if(clockEl&&fmt){var s=fmt.format(new Date());clockEl.textContent=s;clockEl.setAttribute('datetime',new Date().toISOString());}}
  tick();setInterval(tick,1000);

  /* ---------- nav state, progress, active link ---------- */
  var lastY=0;
  function onScroll(){
    var y=window.scrollY||root.scrollTop||0, max=Math.max(1,root.scrollHeight-window.innerHeight);
    root.style.setProperty('--sp',Math.min(1,Math.max(0,y/max)).toFixed(4));
    root.setAttribute('data-scrolled',y>40?'1':'0');
    root.setAttribute('data-past-hero',y>window.innerHeight*0.7?'1':'0');
    root.setAttribute('data-end',max-y<260?'1':'0');
    if(menu.hidden){root.setAttribute('data-hide',(y>lastY&&y>window.innerHeight*0.9)?'1':(y<lastY-4?'0':root.getAttribute('data-hide')||'0'));}
    lastY=y;
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  if('IntersectionObserver' in window){
    var links=$$('.nav-links a[href^="#"]');
    var navIo=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){var id='#'+en.target.id;links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')===id);});}});},{rootMargin:'-45% 0px -50% 0px'});
    ['services','process','work','packages','team','faq'].forEach(function(id){var el=doc.getElementById(id);if(el)navIo.observe(el);});
  }

  /* ---------- scene targets ---------- */
  function desk(){return window.innerWidth>=981;}
  var SC={
    hero:function(){return desk()?{shape:0,x:2.35,y:0.05,s:0.9,o:1,spin:0}:(window.innerWidth<=640?{shape:0,x:0,y:2.3,s:0.6,o:1,spin:0}:{shape:0,x:0,y:1.9,s:0.7,o:0.7,spin:0});},
    manifesto:function(){return desk()?{shape:0,x:2.9,y:-0.2,s:1.25,o:0.5,spin:0.18}:{shape:0,x:0,y:0,s:1.2,o:0.28,spin:0.18};},
    build:function(){return desk()?{shape:1,x:2.65,y:0,s:1.08,o:1,ry:0}:{shape:1,x:0,y:0.4,s:0.82,o:0.4};},
    secure:function(){return desk()?{shape:2,x:2.75,y:0,s:1.08,o:1}:{shape:2,x:0,y:0.4,s:0.85,o:0.4};},
    maintain:function(){return desk()?{shape:3,x:2.75,y:0,s:1.08,o:1,spin:0.35}:{shape:3,x:0,y:0.4,s:0.85,o:0.4,spin:0.35};},
    process:function(){return {shape:4,x:0,y:-1.7,s:1,o:desk()?0.95:0.5,rx:0.55};},
    work:function(){return {shape:4,x:0,y:-2.2,s:1,o:0.4,rx:0.7};},
    packages:function(){return {shape:0,x:0,y:0.1,s:desk()?1.8:1.1,o:0.3,spin:0.12};},
    team:function(){return desk()?{shape:5,x:3.4,y:1.2,s:0.95,o:0.42,ry:-1.4,rx:-0.2}:{shape:5,x:0,y:0.6,s:0.9,o:0.3,ry:-1.4,rx:-0.2};},
    faq:function(){return desk()?{shape:5,x:-3.3,y:-0.2,s:1.05,o:0.75,ry:-1.4,rx:-0.2}:{shape:5,x:0,y:0,s:0.95,o:0.3,ry:-1.4,rx:-0.2};},
    contact:function(){return desk()?{shape:0,x:-3.1,y:-0.9,s:0.9,o:0.8,spin:0}:{shape:0,x:0,y:-0.5,s:0.9,o:0.35,spin:0};}
  };
  var sceneNow='hero';
  function setScene(name){
    if(!SC[name])return;
    sceneNow=name;
    var c=SC[name]();
    T.target={shape:c.shape,x:c.x||0,y:c.y||0,s:c.s||1,o:c.o==null?1:c.o,rx:c.rx||0,ry:c.ry||0,spin:c.spin||0};
  }
  setScene('hero');
  window.addEventListener('resize',function(){setScene(sceneNow);});

  /* ---------- no animation library: show everything, still drive the scene ---------- */
  var G=window.gsap, ST=window.ScrollTrigger;
  var loader=$('.loader');
  if(!G||!ST){
    root.classList.add('ready-fallback');
    if(loader)loader.style.display='none';
    T.go=true;
    if('IntersectionObserver' in window){
      var sio=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting)setScene(en.target.getAttribute('data-scene'));});},{rootMargin:'-45% 0px -50% 0px'});
      $$('[data-scene]').forEach(function(el){sio.observe(el);});
    }
    return;
  }

  G.registerPlugin(ST);
  if(lenis){
    lenis.on('scroll',ST.update);
    G.ticker.add(function(t){lenis.raf(t*1000);});
    G.ticker.lagSmoothing(0);
  }

  /* ---------- text splitting ---------- */
  function splitWords(el){
    var words=el.textContent.trim().split(/\s+/);
    el.textContent='';
    return words.map(function(w,i){
      var s=doc.createElement('span');s.className='w';s.textContent=w;
      el.appendChild(s);
      if(i<words.length-1)el.appendChild(doc.createTextNode(' '));
      return s;
    });
  }
  function splitChars(el){
    var label=el.textContent.trim();
    var words=splitWords(el), chars=[];
    words.forEach(function(w){
      var t=w.textContent;w.textContent='';
      for(var i=0;i<t.length;i++){var c=doc.createElement('span');c.className='c';c.textContent=t[i];w.appendChild(c);chars.push(c);}
    });
    el.setAttribute('aria-label',label);
    words.forEach(function(w){w.setAttribute('aria-hidden','true');});
    return chars;
  }
  /* letters that keep one continuous gradient across the whole line */
  function paintGradChars(el,chars){
    var g=getComputedStyle(el).backgroundImage, W=el.scrollWidth, L=el.getBoundingClientRect().left;
    chars.forEach(function(c){
      c.style.backgroundImage=g;c.style.backgroundSize=W+'px 100%';
      c.style.backgroundPosition=(-(c.getBoundingClientRect().left-L))+'px 0';
      c.style.webkitBackgroundClip='text';c.style.backgroundClip='text';c.style.color='transparent';
    });
  }

  /* ---------- loader and the hero entrance ---------- */
  var heroLines=$$('.hero-title [data-chars]').map(function(el){return splitChars(el);});
  var intro=G.timeline({paused:true});
  intro.from(heroLines[0],{yPercent:115,rotate:8,duration:1.1,stagger:0.028,ease:'expo.out'},0)
       .from('.hero-title .grad-flow',{yPercent:115,rotateX:-60,duration:1.2,ease:'expo.out'},0.18)
       .from(heroLines[1],{yPercent:115,rotate:8,duration:1.1,stagger:0.024,ease:'expo.out'},0.32)
       .to('.hin',{opacity:1,y:0,duration:1,stagger:0.09,ease:'expo.out'},0.6);

  function startSite(){
    T.go=true;
    intro.play();
  }
  if(reduce||!loader){
    if(loader)loader.style.display='none';
    G.set('.hin',{opacity:1,y:0});
    T.go=true;
  }else{
    var num=$('#ld-num'), cnt={v:0};
    var lt=G.timeline({delay:0.05});
    lt.to('.ld-tri',{strokeDashoffset:0,duration:0.6,ease:'power2.inOut'},0)
      .to('.ld-n',{scale:1,duration:0.45,stagger:0.08,ease:'back.out(3)'},0.2)
      .to('.loader-word',{opacity:1,duration:0.4},0.35)
      .to(cnt,{v:100,duration:0.95,ease:'power3.inOut',onUpdate:function(){num.textContent=Math.round(cnt.v);}},0)
      .to('.loader-bar span',{scaleX:1,duration:0.95,ease:'power3.inOut'},0)
      .to('.loader-mark',{scale:0.6,rotate:120,opacity:0,duration:0.5,ease:'expo.in'},0.9)
      .to('.loader-word,.loader-count,.loader-bar',{opacity:0,y:-20,duration:0.35,ease:'power2.in'},0.95)
      .add(startSite,1.1)
      .to(loader,{yPercent:-100,duration:0.9,ease:'expo.inOut'},1.0)
      .set(loader,{display:'none'});
  }

  /* ---------- section headings: letters rise through a mask ---------- */
  $$('[data-split]').forEach(function(el){
    var chars=splitChars(el);
    el.classList.add('split-mask');
    if(el.classList.contains('ct-title')){
      var paint=function(){paintGradChars(el,chars);};
      paint();
      if(doc.fonts&&doc.fonts.ready)doc.fonts.ready.then(paint);
      window.addEventListener('resize',paint);
    }
    if(reduce)return;
    G.from(chars,{yPercent:118,rotate:7,duration:1.1,stagger:0.018,ease:'expo.out',
      scrollTrigger:{trigger:el,start:'top 86%',once:true}});
  });

  /* ---------- generic entrances ---------- */
  if(!reduce){
    ST.batch('[data-reveal]',{start:'top 90%',once:true,
      onEnter:function(b){G.to(b,{opacity:1,y:0,duration:1.1,stagger:0.08,ease:'expo.out',overwrite:true});}});
  }

  /* ---------- manifesto: words light up as you read ---------- */
  $$('[data-words]').forEach(function(el){
    var words=splitWords(el);
    if(reduce)return;
    G.to(words,{opacity:1,stagger:0.12,ease:'none',
      scrollTrigger:{trigger:el,start:'top 78%',end:'bottom 42%',scrub:0.6}});
  });

  /* ---------- marquee that answers scroll speed ---------- */
  var mqTweens=[];
  $$('.mq-row').forEach(function(row){
    var track=$('.mq-track',row), dir=+row.getAttribute('data-dir');
    for(var k=0;k<2;k++){var cl=track.cloneNode(true);cl.setAttribute('aria-hidden','true');row.appendChild(cl);}
    var tracks=$$('.mq-track',row);
    var tw=dir<0?G.to(tracks,{xPercent:-100,duration:32,ease:'none',repeat:-1})
                :G.fromTo(tracks,{xPercent:-100},{xPercent:0,duration:32,ease:'none',repeat:-1});
    mqTweens.push(tw);
    if(reduce)tw.pause();
  });
  var skew={v:0}, setSkew=function(v){$$('.mq-row').forEach(function(r){r.style.setProperty('--skew',v.toFixed(2)+'deg');});};
  ST.create({start:0,end:'max',onUpdate:function(self){
    var v=self.getVelocity();
    T.vel=v;
    if(reduce)return;
    var ts=Math.max(1,Math.min(7,Math.abs(v)/260))*(self.direction||1);
    mqTweens.forEach(function(tw){G.to(tw,{timeScale:ts,duration:0.25,overwrite:true,onComplete:function(){G.to(tw,{timeScale:ts>0?1:-1,duration:1.2});}});});
    skew.v=Math.max(-9,Math.min(9,v/-280));
  }});
  G.ticker.add(function(){
    T.vel*=0.92;
    skew.v*=0.88;
    if(!reduce)setSkew(skew.v);
  });

  /* ---------- pinned chapters on desktop, stacked on phones ---------- */
  var mmG=G.matchMedia();
  var services=$('.services'), chs=$$('.ch'), rail=$$('.ch-rail li'), railEl=$('.ch-rail');
  var chNames=['build','secure','maintain'];
  mmG.add('(min-width: 981px) and (min-height: 640px)',function(){
    services.classList.add('pinned');
    var cur=-1;
    function setCh(i,force){
      if(i===cur&&!force)return;
      cur=i;
      chs.forEach(function(c,k){c.classList.toggle('on',k===i);c.classList.toggle('out',k<i);});
      rail.forEach(function(r,k){r.classList.toggle('on',k===i);});
      setScene(chNames[i]);
    }
    chs.forEach(function(c){c.classList.remove('on');});
    var trig=ST.create({trigger:'.ch-pin',start:'top top',end:function(){return '+='+Math.round(window.innerHeight*2.4);},pin:true,anticipatePin:1,
      snap:reduce?false:{snapTo:[0,0.5,1],duration:{min:0.3,max:0.8},delay:0.08,ease:'power2.inOut'},
      onUpdate:function(self){railEl.style.setProperty('--chp',self.progress.toFixed(3));setCh(Math.min(2,Math.floor(self.progress*3*0.9999)));},
      onEnter:function(){setCh(Math.max(cur,0),true);},
      onEnterBack:function(){setCh(2,true);},
      onLeaveBack:function(){setScene('manifesto');}
    });
    ST.create({trigger:'.ch-pin',start:'top 70%',onEnter:function(){if(cur<0)setCh(0);}});
    return function(){services.classList.remove('pinned');chs.forEach(function(c,k){c.classList.toggle('on',k===0);c.classList.remove('out');});trig.kill();};
  });
  mmG.add('(max-width: 980px), (max-height: 639px)',function(){
    var ts=chs.map(function(c,k){
      return ST.create({trigger:c,start:'top 60%',end:'bottom 40%',onToggle:function(s){if(s.isActive){setScene(chNames[k]);c.classList.add('on');}}});
    });
    return function(){ts.forEach(function(t){t.kill();});};
  });

  /* ---------- the process road: a horizontal run on desktop ---------- */
  mmG.add('(min-width: 981px)',function(){
    var track=$('.pr-track'), line=$('.pr-line');
    var dist=function(){return Math.max(0,track.scrollWidth-window.innerWidth);};
    var tw=G.to(track,{x:function(){return -dist();},ease:'none',
      scrollTrigger:{trigger:'.pr-pin',start:'top top',end:function(){return '+='+dist();},pin:true,scrub:1,invalidateOnRefresh:true,anticipatePin:1,
        onUpdate:function(s){line.style.setProperty('--pp',s.progress.toFixed(3));}}});
    $$('.pr-card').forEach(function(card){
      G.fromTo(card,{rotateY:-32,z:-160,opacity:0.35},{rotateY:0,z:0,opacity:1,ease:'none',
        scrollTrigger:{trigger:card,containerAnimation:tw,start:'left 105%',end:'left 50%',scrub:true}});
      G.fromTo(card,{'--draw':1},{'--draw':0,ease:'none',
        scrollTrigger:{trigger:card,containerAnimation:tw,start:'left 85%',end:'left 35%',scrub:true}});
    });
    return function(){G.set(track,{clearProps:'transform'});};
  });
  mmG.add('(max-width: 980px)',function(){
    if(reduce)return;
    $$('.pr-card').forEach(function(card){
      G.from(card,{y:60,rotateX:-18,opacity:0,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:card,start:'top 88%',once:true}});
    });
  });

  /* ---------- work: cards stack, pictures drift ---------- */
  var projs=$$('.proj');
  projs.forEach(function(p,i){
    var img=$('.browser img',p), ph=$('.phone',p);
    if(!reduce){
      G.fromTo(img,{'--py':'-7%'},{'--py':'7%',ease:'none',scrollTrigger:{trigger:p,start:'top bottom',end:'bottom top',scrub:true}});
      G.fromTo(ph,{'--ph':'60px'},{'--ph':'-50px',ease:'none',scrollTrigger:{trigger:p,start:'top bottom',end:'bottom top',scrub:true}});
      G.from($('.proj-text',p).children,{y:40,opacity:0,duration:1,stagger:0.08,ease:'expo.out',scrollTrigger:{trigger:p,start:'top 75%',once:true}});
      G.from($('.browser',p),{yPercent:18,rotateY:-30,opacity:0,duration:1.4,ease:'expo.out',clearProps:'transform,opacity',scrollTrigger:{trigger:p,start:'top 75%',once:true}});
    }
  });
  mmG.add('(min-width: 981px)',function(){
    projs.forEach(function(p,i){
      var next=projs[i+1];
      if(next&&!reduce){
        G.fromTo(p,{scale:1,'--dim':0},{scale:0.9,'--dim':0.7,ease:'none',scrollTrigger:{trigger:next,start:'top bottom',end:'top 15%',scrub:true}});
      }
    });
  });

  /* ---------- packages: dealt like cards ---------- */
  if(!reduce){
    G.from('.pk',{y:140,rotateX:-40,rotateY:function(i){return [-24,0,24][i]||0;},z:-200,opacity:0,duration:1.4,stagger:0.12,ease:'expo.out',clearProps:'transform',
      scrollTrigger:{trigger:'.pk-grid',start:'top 82%',once:true}});
  }

  /* ---------- team: portraits open from below, columns drift ---------- */
  if(!reduce){
    $$('.tm').forEach(function(tm,i){
      G.from($('.tm-img',tm),{clipPath:'inset(100% 0% 0% 0%)',duration:1.4,ease:'expo.inOut',delay:i*0.1,scrollTrigger:{trigger:'.tm-grid',start:'top 80%',once:true}});
      G.from($('.tm-body',tm).children,{y:30,opacity:0,duration:1,stagger:0.06,ease:'expo.out',delay:0.4+i*0.1,scrollTrigger:{trigger:'.tm-grid',start:'top 80%',once:true}});
    });
    mmG.add('(min-width: 1101px)',function(){
      $$('.tm').forEach(function(tm,i){
        G.fromTo(tm,{y:i%2?40:-10},{y:i%2?-60:20,ease:'none',scrollTrigger:{trigger:'.tm-grid',start:'top bottom',end:'bottom top',scrub:true}});
      });
    });
  }

  /* ---------- footer wordmark rises letter by letter ---------- */
  $$('[data-letters]').forEach(function(el){
    var chars=splitChars(el);
    var paint=function(){paintGradChars(el,chars);};
    paint();
    if(doc.fonts&&doc.fonts.ready)doc.fonts.ready.then(paint);
    window.addEventListener('resize',paint);
    if(reduce)return;
    G.from(chars,{yPercent:100,duration:1.2,stagger:0.035,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 95%',once:true}});
  });

  /* ---------- scene triggers (after pins so positions are right) ---------- */
  ST.create({trigger:'.hero',start:'top top',end:'bottom 35%',onToggle:function(s){T.heroOn=s.isActive;},onEnterBack:function(){setScene('hero');}});
  $$('[data-scene]').forEach(function(el){
    if(el.classList.contains('ch')||el.classList.contains('hero'))return;
    var name=el.getAttribute('data-scene');
    ST.create({trigger:el,start:'top 55%',end:'bottom 45%',
      onEnter:function(){setScene(name);},onEnterBack:function(){setScene(name);}});
  });

  /* ---------- pointer: cursor, magnets, tilt ---------- */
  if(fine){
    var cur=$('.cursor'), dot=$('.cursor-dot'), ring=$('.cursor-ring');
    var dx=G.quickTo(dot,'x',{duration:0.08}), dy=G.quickTo(dot,'y',{duration:0.08});
    var rx=G.quickTo(ring,'x',{duration:0.45,ease:'power3'}), ry=G.quickTo(ring,'y',{duration:0.45,ease:'power3'});
    window.addEventListener('pointermove',function(e){
      dx(e.clientX);dy(e.clientY);rx(e.clientX);ry(e.clientY);
      var t=e.target;
      var view=t.closest&&t.closest('[data-cursor="view"]');
      var link=t.closest&&t.closest('a,button,.chip,input,textarea');
      cur.classList.toggle('is-view',!!view);
      cur.classList.toggle('is-link',!view&&!!link);
    },{passive:true});
    doc.addEventListener('pointerleave',function(){G.to(cur,{opacity:0,duration:0.3});});
    doc.addEventListener('pointerenter',function(){G.to(cur,{opacity:1,duration:0.3});});

    $$('.mag').forEach(function(m){
      var k=m.classList.contains('orb-btn')?0.35:0.25;
      m.addEventListener('pointermove',function(e){
        var r=m.getBoundingClientRect();
        m.style.setProperty('--tx',((e.clientX-(r.left+r.width/2))*k).toFixed(1)+'px');
        m.style.setProperty('--ty',((e.clientY-(r.top+r.height/2))*k*1.2).toFixed(1)+'px');
      });
      m.addEventListener('pointerleave',function(){m.style.setProperty('--tx','0px');m.style.setProperty('--ty','0px');});
    });

    $$('.tilt').forEach(function(c){
      c.addEventListener('pointermove',function(e){
        var r=c.getBoundingClientRect(), px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
        c.style.setProperty('--rx',((0.5-py)*9).toFixed(2)+'deg');
        c.style.setProperty('--ry',((px-0.5)*11).toFixed(2)+'deg');
        c.style.setProperty('--gx',(px*100).toFixed(1)+'%');
        c.style.setProperty('--gy',(py*100).toFixed(1)+'%');
      });
      c.addEventListener('pointerleave',function(){c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg');});
    });
  }

  /* settle every measurement once fonts and pictures are in */
  window.addEventListener('load',function(){ST.refresh();});
  if(doc.fonts&&doc.fonts.ready)doc.fonts.ready.then(function(){ST.refresh();});
})();
