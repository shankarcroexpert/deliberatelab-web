/* Deliberate Lab — shared site scripts (loaded by every page) */

/* Paste the Google Apps Script Web App URL here once deployed (see setup notes). */
var GOOGLE_SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbxyqdBEAaQKp03K0gSF7gjgpU8VvFph-E3BL7giRJUISO63Jdk4JGJCKJa2ZhMUvPg/exec";

/* Newsletter signup endpoint (insights.html). Leave blank until you have a real
   ESP/endpoint to POST to — until then the form falls back to a mailto so
   submissions still reach hello@deliberatelab.com. Same pattern as above. */
var NEWSLETTER_ENDPOINT = "";

(function(){
  // sticky-nav hairline on scroll
  var hdr=document.getElementById('hdr');
  if(hdr){
    var onScroll=function(){hdr.classList.toggle('scrolled',window.scrollY>8);};
    onScroll();
    window.addEventListener('scroll',onScroll,{passive:true});
  }

  // mobile menu — animated open/close, focus-trapped, Esc + outside-click + link-tap to close, scroll locked while open
  var mb=document.getElementById('menuBtn'), nl=document.getElementById('navlinks');
  if(mb&&nl){
    var navAnchors=Array.prototype.slice.call(nl.querySelectorAll('a'));
    var focusables=[mb].concat(navAnchors);
    var lastFocused=null;

    function openNav(){
      lastFocused=document.activeElement;
      nl.classList.add('open');
      mb.classList.add('open');
      mb.setAttribute('aria-expanded','true');
      document.body.classList.add('nav-open');
    }
    function closeNav(returnFocus){
      nl.classList.remove('open');
      mb.classList.remove('open');
      mb.setAttribute('aria-expanded','false');
      document.body.classList.remove('nav-open');
      if(returnFocus && mb.focus) mb.focus();
      else if(lastFocused && lastFocused.focus) lastFocused.focus();
    }

    mb.addEventListener('click',function(){
      if(nl.classList.contains('open')) closeNav(false); else openNav();
    });
    navAnchors.forEach(function(a){
      a.addEventListener('click',function(){closeNav(false);});
    });
    document.addEventListener('click',function(e){
      if(!nl.classList.contains('open')) return;
      if(!nl.contains(e.target) && e.target!==mb && !mb.contains(e.target)) closeNav(false);
    });
    document.addEventListener('keydown',function(e){
      if(!nl.classList.contains('open')) return;
      if(e.key==='Escape'){ closeNav(true); return; }
      if(e.key==='Tab'){
        var idx=focusables.indexOf(document.activeElement);
        if(e.shiftKey){
          if(idx<=0){ e.preventDefault(); focusables[focusables.length-1].focus(); }
        }else{
          if(idx===-1||idx===focusables.length-1){ e.preventDefault(); focusables[0].focus(); }
        }
      }
    });
  }

  // reveal-on-scroll
  var reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
      });
    },{threshold:.12});
    reveals.forEach(function(el){io.observe(el);});
  }else{
    reveals.forEach(function(el){el.classList.add('in');});
  }
})();

/* Book a call — modal + Google Sheet submit */
(function(){
  var overlay=document.getElementById('bookModalOverlay');
  var form=document.getElementById('bookForm');
  if(!overlay||!form) return;

  var closeBtn=document.getElementById('bookModalClose');
  var nameInput=document.getElementById('bookName');
  var phoneInput=document.getElementById('bookPhone');
  var companyInput=document.getElementById('bookCompany');
  var nameErr=document.getElementById('bookNameErr');
  var phoneErr=document.getElementById('bookPhoneErr');
  var statusEl=document.getElementById('bookStatus');
  var submitBtn=document.getElementById('bookSubmitBtn');
  var triggers=document.querySelectorAll('.js-book-cta');
  var lastFocused=null;

  function openModal(e){
    if(e) e.preventDefault();
    lastFocused=document.activeElement;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    setTimeout(function(){nameInput.focus();},60);
  }
  function closeModal(){
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
    if(lastFocused&&lastFocused.focus) lastFocused.focus();
  }

  triggers.forEach(function(t){t.addEventListener('click',openModal);});
  closeBtn.addEventListener('click',closeModal);
  overlay.addEventListener('click',function(e){if(e.target===overlay) closeModal();});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape' && overlay.classList.contains('open')) closeModal();
  });

  function setError(input,errEl,show){
    input.classList.toggle('invalid',show);
    if(errEl) errEl.style.display=show?'block':'none';
  }

  function validate(){
    var ok=true;
    var nameVal=nameInput.value.trim();
    var phoneClean=phoneInput.value.trim().replace(/[\s\-()]/g,'');
    var phoneOk=/^\+?[0-9]{7,15}$/.test(phoneClean);

    var nameOk=nameVal.length>=2;
    setError(nameInput,nameErr,!nameOk);
    setError(phoneInput,phoneErr,!phoneOk);
    if(!nameOk||!phoneOk) ok=false;
    return ok;
  }

  [nameInput,phoneInput].forEach(function(input){
    input.addEventListener('input',function(){
      if(input.classList.contains('invalid')) validate();
    });
  });

  function setStatus(msg,type){
    statusEl.textContent=msg;
    statusEl.className='modal-status'+(type?' '+type:'');
  }

  form.addEventListener('submit',function(e){
    e.preventDefault();

    if(companyInput&&companyInput.value){return;} // honeypot tripped — silently drop

    if(!validate()){
      setStatus('Please check the fields above.','error');
      return;
    }

    var endpointReady=GOOGLE_SHEET_ENDPOINT && GOOGLE_SHEET_ENDPOINT.indexOf('PASTE_YOUR')!==0;
    if(!endpointReady){
      setStatus('Form isn’t connected yet — please email hello@deliberatelab.com.','error');
      return;
    }

    var name=nameInput.value.trim();
    var phone=phoneInput.value.trim();

    submitBtn.disabled=true;
    setStatus('Sending…','');

    var body='name='+encodeURIComponent(name)+'&phone='+encodeURIComponent(phone);

    fetch(GOOGLE_SHEET_ENDPOINT,{
      method:'POST',
      mode:'no-cors',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:body
    }).then(function(){
      setStatus('Thanks — we’ll call you back within one business day.','success');
      form.reset();
      markAutoShown();
      setTimeout(closeModal,2200);
    }).catch(function(){
      setStatus('Something went wrong. Please email hello@deliberatelab.com.','error');
    }).finally(function(){
      submitBtn.disabled=false;
    });
  });

  /* ---- auto-trigger: exit-intent on desktop, inactivity on mobile ---- */
  var AUTO_KEY='bookModalAutoShown';
  var autoShown=false;
  try{ autoShown = sessionStorage.getItem(AUTO_KEY)==='1'; }catch(err){}

  function markAutoShown(){
    autoShown=true;
    try{ sessionStorage.setItem(AUTO_KEY,'1'); }catch(err){}
  }

  function autoOpen(){
    if(autoShown||overlay.classList.contains('open')) return;
    markAutoShown();
    openModal();
  }

  if(!autoShown){
    var isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

    if(isTouch){
      // mobile / touch: pop after 5s of no scroll/touch activity
      var idleTimer=null;
      function resetIdleTimer(){
        if(autoShown) return;
        if(idleTimer) clearTimeout(idleTimer);
        idleTimer=setTimeout(autoOpen,5000);
      }
      ['touchstart','touchmove','scroll','click'].forEach(function(evt){
        window.addEventListener(evt,resetIdleTimer,{passive:true});
      });
      resetIdleTimer();
    }else{
      // desktop: pop when the cursor exits via the top of the window
      var armed=false;
      setTimeout(function(){armed=true;},2000); // ignore the first 2s so a stray load-time move doesn't fire it
      document.addEventListener('mouseout',function(e){
        if(!armed||autoShown) return;
        if(e.clientY<=0 && !e.relatedTarget && !e.toElement){
          autoOpen();
        }
      });
    }
  }
})();

/* FAQ accordion — real <button> + aria-expanded (native keyboard support).
   Panels have no default max-height in CSS, so without this script every
   answer is simply visible; JS only collapses what it can also expand. */
(function(){
  var items=document.querySelectorAll('.faq-item');
  if(!items.length) return;

  function setOpen(btn,panel,open){
    btn.setAttribute('aria-expanded',open?'true':'false');
    panel.style.maxHeight=open?panel.scrollHeight+'px':'0px';
  }

  items.forEach(function(item){
    var btn=item.querySelector('.faq-q');
    var panel=item.querySelector('.faq-a');
    if(!btn||!panel) return;
    setOpen(btn,panel,btn.getAttribute('aria-expanded')==='true');
    btn.addEventListener('click',function(){
      setOpen(btn,panel,btn.getAttribute('aria-expanded')!=='true');
    });
  });

  window.addEventListener('resize',function(){
    items.forEach(function(item){
      var btn=item.querySelector('.faq-q');
      var panel=item.querySelector('.faq-a');
      if(btn&&panel&&btn.getAttribute('aria-expanded')==='true'){
        panel.style.maxHeight=panel.scrollHeight+'px';
      }
    });
  });
})();

/* Case studies — sector filter bar (case-studies.html only) */
(function(){
  var bar=document.getElementById('csFilters');
  var grid=document.getElementById('csGrid');
  if(!bar||!grid) return;

  var buttons=Array.prototype.slice.call(bar.querySelectorAll('.cs-filter-btn'));
  var cards=Array.prototype.slice.call(grid.querySelectorAll('.cs-card'));
  var empty=document.getElementById('csEmpty');

  function applyFilter(filter){
    var visible=0;
    cards.forEach(function(card){
      var match=filter==='all'||card.getAttribute('data-sector')===filter;
      card.hidden=!match;
      if(match) visible++;
    });
    if(empty) empty.hidden=visible>0;
  }

  buttons.forEach(function(btn){
    btn.addEventListener('click',function(){
      buttons.forEach(function(b){
        b.classList.remove('active');
        b.setAttribute('aria-pressed','false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed','true');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });
})();

/* Insights — category filter bar (insights.html only) */
(function(){
  var bar=document.getElementById('insFilters');
  var grid=document.getElementById('insGrid');
  if(!bar||!grid) return;

  var buttons=Array.prototype.slice.call(bar.querySelectorAll('.cs-filter-btn'));
  var cards=Array.prototype.slice.call(grid.querySelectorAll('.ins-card'));
  var empty=document.getElementById('insEmpty');

  function applyFilter(filter){
    var visible=0;
    cards.forEach(function(card){
      var match=filter==='all'||card.getAttribute('data-category')===filter;
      card.hidden=!match;
      if(match) visible++;
    });
    if(empty) empty.hidden=visible>0;
  }

  buttons.forEach(function(btn){
    btn.addEventListener('click',function(){
      buttons.forEach(function(b){
        b.classList.remove('active');
        b.setAttribute('aria-pressed','false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed','true');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });
})();

/* Newsletter signup — insights.html only. POSTs to NEWSLETTER_ENDPOINT once
   you've set one; until then it falls back to a mailto so a submission still
   reaches you instead of silently going nowhere. */
(function(){
  var form=document.getElementById('newsletterForm');
  if(!form) return;

  var emailInput=document.getElementById('newsEmail');
  var companyInput=document.getElementById('newsCompany'); // honeypot
  var statusEl=document.getElementById('newsStatus');
  var submitBtn=document.getElementById('newsSubmitBtn');

  function setStatus(msg,type){
    statusEl.textContent=msg;
    statusEl.className='news-status'+(type?' '+type:'');
  }

  form.addEventListener('submit',function(e){
    e.preventDefault();

    if(companyInput&&companyInput.value){return;} // honeypot tripped — silently drop

    var email=emailInput.value.trim();
    var emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    emailInput.classList.toggle('invalid',!emailOk);
    if(!emailOk){
      setStatus('Please enter a valid email address.','error');
      return;
    }

    var endpointReady=NEWSLETTER_ENDPOINT && NEWSLETTER_ENDPOINT.length>0;

    if(!endpointReady){
      setStatus('Opening your email client to confirm — thanks!','success');
      window.location.href='mailto:hello@deliberatelab.com?subject='+encodeURIComponent('Newsletter signup')+'&body='+encodeURIComponent('Please add this address to the newsletter list: '+email);
      form.reset();
      return;
    }

    submitBtn.disabled=true;
    setStatus('Sending…','');

    fetch(NEWSLETTER_ENDPOINT,{
      method:'POST',
      mode:'no-cors',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:'email='+encodeURIComponent(email)
    }).then(function(){
      setStatus('Thanks — you’re on the list.','success');
      form.reset();
    }).catch(function(){
      setStatus('Something went wrong. Please email hello@deliberatelab.com.','error');
    }).finally(function(){
      submitBtn.disabled=false;
    });
  });

  [emailInput].forEach(function(input){
    input.addEventListener('input',function(){
      if(input.classList.contains('invalid')) input.classList.remove('invalid');
    });
  });
})();
