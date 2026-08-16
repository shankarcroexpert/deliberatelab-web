/* Deliberate Lab — page-transition fallback for browsers without the
   native Cross-Document View Transitions API (declared in css/styles.css
   via @view-transition). Chrome/Edge get the native transition and this
   script steps aside entirely for them — no double animation. Firefox,
   Safari and anything older get an equivalent fade+slide built from plain
   CSS transitions on <body>. Skipped completely under
   prefers-reduced-motion, and a total no-op if this script fails to load
   or run — links just behave like normal <a> tags. */
(function(){
  if('startViewTransition' in document) return; // native cross-document transition handles this browser
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var DURATION = 220; // ms — roughly matches the native transition's pacing

  function fadeIn(){
    document.body.style.transition = 'none';
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(8px)';
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        document.body.style.transition = 'opacity ' + DURATION + 'ms ease, transform ' + DURATION + 'ms ease';
        document.body.style.opacity = '';
        document.body.style.transform = '';
      });
    });
  }

  function isPlainLeftClick(e){
    return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
  }

  function isInternalNavLink(a){
    if(!a) return false;
    if(a.target === '_blank' || a.hasAttribute('download')) return false;
    if(a.origin !== window.location.origin) return false; // skips mailto:, tel:, external sites (their origin reads as "null" or a different host)
    var href = a.getAttribute('href') || '';
    if(href === '#' || href === '') return false;
    if(a.pathname === window.location.pathname && a.hash) return false; // in-page anchor (e.g. "#book", "#assessment")
    return true;
  }

  document.addEventListener('click', function(e){
    if(e.defaultPrevented || !isPlainLeftClick(e)) return; // respects the booking-modal links, which already preventDefault()
    var a = e.target.closest('a[href]');
    if(!isInternalNavLink(a)) return;

    e.preventDefault();
    var dest = a.href;
    document.body.style.transition = 'opacity ' + DURATION + 'ms ease, transform ' + DURATION + 'ms ease';
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(-8px)';
    window.setTimeout(function(){ window.location.href = dest; }, DURATION);
  });

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', fadeIn);
  }else{
    fadeIn();
  }

  // if this page is restored from the back-forward cache, make sure it isn't
  // still sitting at the faded-out state we left it in right before navigating away
  window.addEventListener('pageshow', function(e){
    if(e.persisted){
      document.body.style.transition = 'none';
      document.body.style.opacity = '';
      document.body.style.transform = '';
    }
  });
})();
