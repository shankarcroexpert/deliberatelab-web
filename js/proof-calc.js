/* Deliberate Lab — PROOF Score interactive calculator (method.html only),
   presented as the "Experiment Decision Engine". Guarded on .calc so this
   file is harmless to include on any page; it does nothing if that
   container isn't present.

   Each slider contributes value x data-weight to the total, except a
   slider marked data-invert="true" (Effort), whose contribution is
   (6 - value) x weight — a low-effort idea scores higher, a high-effort
   one scores lower, while the slider itself still just reads "how much
   effort does this take" left to right. Tiers are simple percentages of
   the maximum possible score, not an external statistical claim. */
(function(){
  var calc = document.querySelector('.calc');
  if(!calc) return;

  var sliders = Array.prototype.slice.call(calc.querySelectorAll('input[type="range"]'));
  if(!sliders.length) return;

  var totalEl = document.getElementById('calcTotal');
  var fillEl = document.getElementById('calcFill');
  var verdictEl = document.getElementById('calcVerdict');
  var maxEl = document.getElementById('calcMax');

  var MAX = sliders.reduce(function(sum, s){
    return sum + (parseFloat(s.getAttribute('data-weight')) || 1) * 5;
  }, 0);
  if(maxEl) maxEl.textContent = '/ ' + MAX;

  function tierFor(pct){
    if(pct >= 0.7) return {cls:'tier-high', label:'High priority — build this next'};
    if(pct >= 0.4) return {cls:'tier-mid', label:'Worth testing'};
    return {cls:'tier-low', label:'Park it — revisit if the picture changes'};
  }

  function update(){
    var total = 0;

    sliders.forEach(function(s){
      var weight = parseFloat(s.getAttribute('data-weight')) || 1;
      var raw = parseFloat(s.value) || 0;
      var scored = s.hasAttribute('data-invert') ? (6 - raw) : raw;
      total += scored * weight;

      var out = document.getElementById(s.id + 'Val');
      if(out) out.textContent = s.value; // always show the raw slider value, never the inverted score
    });

    if(totalEl) totalEl.textContent = total;
    if(fillEl) fillEl.style.width = (MAX > 0 ? (total / MAX * 100) : 0) + '%';

    if(verdictEl){
      var tier = tierFor(MAX > 0 ? total / MAX : 0);
      verdictEl.textContent = tier.label;
      verdictEl.classList.remove('tier-high','tier-mid','tier-low');
      verdictEl.classList.add(tier.cls);
    }
  }

  sliders.forEach(function(s){
    s.addEventListener('input', update);
  });

  update();
})();
