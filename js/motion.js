/* Deliberate Lab — motion system (loaded after js/main.js on every page)
   Everything here is additive: if this file fails to load, or JS is
   disabled, the page already looks correct and fully visible (see the
   base rules in css/styles.css — nothing is hidden until a "motion-*"
   / "fig-armed" / "bars-armed" class is added below). Under
   prefers-reduced-motion the same guard also skips every animation. */
(function(){
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- 1. hero entrance sequence ---------- */
  function initHeroEntrance(){
    var heroCopy = document.querySelector('.hero-copy');
    if(!heroCopy || reduceMotion) return;

    var h1 = heroCopy.querySelector('h1');
    if(h1){
      var walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT, null);
      var textNodes = [];
      var n;
      while((n = walker.nextNode())) textNodes.push(n);

      textNodes.forEach(function(node){
        var parts = node.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function(part){
          if(part === '') return;
          if(/^\s+$/.test(part)){
            frag.appendChild(document.createTextNode(part));
          }else{
            var span = document.createElement('span');
            span.className = 'w';
            span.textContent = part;
            frag.appendChild(span);
          }
        });
        node.parentNode.replaceChild(frag, node);
      });

      h1.querySelectorAll('.w').forEach(function(w, i){
        w.style.setProperty('--i', i);
      });
    }

    heroCopy.classList.add('motion-hero');
  }

  /* ---------- 2. self-drawing diagrams (FIG. A and any reuse of it) ----------
     Scans every .diagram on the page, not just the homepage hero's, so the
     same closed-loop figure can be reused (e.g. on method.html) and still
     self-draw on scroll into view. */
  function initDiagrams(){
    if(reduceMotion) return;

    document.querySelectorAll('.diagram').forEach(function(svg){
      svg.querySelectorAll('.fig-arc').forEach(function(path){
        var len = path.getTotalLength();
        if(!path.getAttribute('stroke-dasharray')){
          path.style.strokeDasharray = len; // solid arcs need a dash pattern to draw with
        }
        path.style.strokeDashoffset = len; // dashed arcs already have one — offset alone reveals it
      });

      svg.classList.add('fig-armed');

      if(!hasIO){ svg.classList.add('fig-draw'); return; }
      var io = new IntersectionObserver(function(entries, obs){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            svg.classList.add('fig-draw');
            obs.unobserve(entry.target);
          }
        });
      }, {threshold:.3});
      io.observe(svg);
    });
  }

  /* ---------- 3. staggered scroll reveals ---------- */
  function initStaggerReveals(){
    document.querySelectorAll('.reveal[data-stagger]').forEach(function(container){
      Array.prototype.forEach.call(container.children, function(child, i){
        child.style.setProperty('--i', i);
      });
    });
  }

  /* ---------- 4a. count-up numbers (.countup[data-target]) ---------- */
  function animateCount(el){
    var raw = el.getAttribute('data-target') || el.textContent;
    var target = parseFloat(raw);
    if(isNaN(target)) return;
    var decimals = (raw.split('.')[1] || '').length;
    el.textContent = decimals ? (0).toFixed(decimals) : '0';

    var dur = 650, start = null;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = decimals ? val.toFixed(decimals) : String(Math.round(val));
      if(p < 1){
        requestAnimationFrame(step);
      }else{
        el.textContent = decimals ? target.toFixed(decimals) : String(target);
      }
    }
    requestAnimationFrame(step);
  }

  function initCountups(){
    var els = document.querySelectorAll('.countup');
    if(!els.length || reduceMotion) return; // static target value already in the markup
    if(!hasIO){ els.forEach(animateCount); return; }
    var io = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          obs.unobserve(entry.target);
          animateCount(entry.target);
        }
      });
    }, {threshold:.6});
    els.forEach(function(el){ io.observe(el); });
  }

  /* ---------- 4b. PROOF weight bars fill ---------- */
  function initProofBars(){
    var readout = document.querySelector('.readout');
    if(!readout || reduceMotion) return;
    var rows = readout.querySelectorAll('.rrow');
    rows.forEach(function(row, i){ row.style.setProperty('--i', i); });
    readout.classList.add('bars-armed');

    if(!hasIO){ readout.classList.add('bars-fill'); return; }
    var io = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          readout.classList.add('bars-fill');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold:.4});
    io.observe(readout);
  }

  /* ---------- 5. magnetic hover on .btn ---------- */
  function initMagneticButtons(){
    if(reduceMotion) return;
    if(!(window.matchMedia && window.matchMedia('(pointer: fine)').matches)) return; // skip touch
    document.querySelectorAll('.btn').forEach(function(btn){
      var strength = 9;
      btn.addEventListener('mousemove', function(e){
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / strength;
        var y = (e.clientY - r.top - r.height / 2) / strength;
        btn.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function(){
        btn.style.transform = '';
      });
    });
  }

  /* ---------- 6. active-section nav highlighting ---------- */
  function initActiveNav(){
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if(!navLinks.length || !hasIO) return;
    var map = {};
    navLinks.forEach(function(a){
      var id = a.getAttribute('href').slice(1);
      var sec = document.getElementById(id);
      if(sec) map[id] = a;
    });
    var ids = Object.keys(map);
    if(!ids.length) return;

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        navLinks.forEach(function(a){ a.classList.remove('active'); });
        map[entry.target.id].classList.add('active');
      });
    }, {rootMargin:'-40% 0px -50% 0px', threshold:0});

    ids.forEach(function(id){ io.observe(document.getElementById(id)); });
  }

  /* ---------- 7. scroll-progress bar ---------- */
  function initScrollProgress(){
    var bar = document.getElementById('scrollProgress');
    if(!bar) return;
    function update(){
      var doc = document.documentElement;
      var scrollTop = window.scrollY || doc.scrollTop;
      var height = doc.scrollHeight - doc.clientHeight;
      var pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = pct + '%';
    }
    update();
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
  }

  initHeroEntrance();
  initDiagrams();
  initStaggerReveals();
  initCountups();
  initProofBars();
  initMagneticButtons();
  initActiveNav();
  initScrollProgress();
})();
