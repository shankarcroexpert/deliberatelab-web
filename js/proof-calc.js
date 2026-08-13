/* Deliberate Lab — PROOF Score interactive calculator (method.html only).
   Guarded on .calc so this file is harmless to include on any page; it
   simply does nothing if that container isn't present. Weights here match
   the PROOF readout on the home page exactly: P x3, R x1, O x2, O x3, F x1. */
(function(){
  var calc = document.querySelector('.calc');
  if(!calc) return;

  var sliders = Array.prototype.slice.call(calc.querySelectorAll('input[type="range"]'));
  if(!sliders.length) return;

  var totalEl = document.getElementById('calcTotal');
  var fillEl = document.getElementById('calcFill');
  var verdictEl = document.getElementById('calcVerdict');

  var MAX = sliders.reduce(function(sum, s){
    return sum + (parseFloat(s.getAttribute('data-weight')) || 1) * 5;
  }, 0);

  function tierFor(total){
    if(total >= 35) return {cls:'tier-high', label:'High priority — build this next'};
    if(total >= 20) return {cls:'tier-mid', label:'Worth testing'};
    return {cls:'tier-low', label:'Park it — revisit if the picture changes'};
  }

  function update(){
    var total = 0;

    sliders.forEach(function(s){
      var weight = parseFloat(s.getAttribute('data-weight')) || 1;
      var val = parseFloat(s.value) || 0;
      total += val * weight;

      var out = document.getElementById(s.id + 'Val');
      if(out) out.textContent = s.value;
    });

    if(totalEl) totalEl.textContent = total;
    if(fillEl) fillEl.style.width = (total / MAX * 100) + '%';

    if(verdictEl){
      var tier = tierFor(total);
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
