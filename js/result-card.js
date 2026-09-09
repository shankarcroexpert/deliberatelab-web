/* Deliberate Lab — results card (case-studies.html only).

   HOW TO DROP IN A REAL RESULT:
   Fill in the fields below and flip state to 'live'. That's the whole job —
   the HTML already has both the honest "pending" markup (what's on the page
   right now) and the "live" markup (currently hidden); this script just
   swaps which one shows, using exactly what you put in this one object. */
var RESULT = {
  state: 'pending', // 'pending' | 'live' — leave as 'pending' until you have a real quote + metric
  quote: '',
  metricValue: '',
  metricLabel: '',
  name: '',
  role: '',
  logoSrc: '' // optional — leave blank to omit the logo
};

(function(){
  if(RESULT.state !== 'live') return; // the static "pending" markup already in the page is correct as-is

  var pending = document.getElementById('resultPending');
  var live = document.getElementById('resultLive');
  if(!pending || !live) return;

  var quoteEl = live.querySelector('.result-quote');
  var valueEl = live.querySelector('.result-metric-value');
  var labelEl = live.querySelector('.result-metric-label');
  var nameEl = live.querySelector('.result-name');
  var roleEl = live.querySelector('.result-role');
  var logoEl = live.querySelector('.result-logo');

  if(quoteEl) quoteEl.textContent = RESULT.quote;
  if(valueEl) valueEl.textContent = RESULT.metricValue;
  if(labelEl) labelEl.textContent = RESULT.metricLabel;
  if(nameEl) nameEl.textContent = RESULT.name;
  if(roleEl) roleEl.textContent = RESULT.role;
  if(logoEl && RESULT.logoSrc){
    logoEl.src = RESULT.logoSrc;
    logoEl.hidden = false;
  }

  pending.hidden = true;
  live.hidden = false;
})();
