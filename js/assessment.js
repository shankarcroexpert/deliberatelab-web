/* Deliberate Lab — Revenue Leak assessment (tools.html only).
   All state lives in memory for the life of the page load — nothing is
   written to localStorage/sessionStorage, so this works even in sandboxes
   that block storage APIs. A full page reload always starts fresh. */
(function(){
  var widget = document.getElementById('aqWidget');
  if(!widget) return; // safe no-op on every other page

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var QUESTION_TRANSITION_MS = 200; // must match the .aq-question transition duration in css/styles.css

  var QUESTIONS = [
    {
      q: 'Do you track online actions — enquiries, test-drives, site visits — through to the sale, online or off?',
      options: [
        { label: 'No — once someone enquires or visits, we lose visibility.', points: 0 },
        { label: 'We estimate it manually, now and then.', points: 1 },
        { label: 'Some actions are tracked, but not consistently.', points: 2 },
        { label: 'Yes — every key action is wired back to what was actually sold.', points: 3 }
      ]
    },
    {
      q: 'Do you run structured, statistically sound A/B tests on your key journeys?',
      options: [
        { label: 'We don’t test — changes ship on opinion.', points: 0 },
        { label: 'We test occasionally, without much statistical rigor.', points: 1 },
        { label: 'We test regularly, with reasonable rigor.', points: 2 },
        { label: 'Yes — proper sample-size and duration planning, every time.', points: 3 }
      ]
    },
    {
      q: 'Do you know your cost per conversion — e.g. cost per test drive, per disbursed loan, per enrolment?',
      options: [
        { label: 'No idea.', points: 0 },
        { label: 'A rough estimate at best.', points: 1 },
        { label: 'Calculated per campaign, but not continuously.', points: 2 },
        { label: 'Yes — tracked continuously and segmented.', points: 3 }
      ]
    },
    {
      q: 'Is your enquiry-to-sale (or configurator-to-delivery) journey mapped end to end?',
      options: [
        { label: 'No — it’s a black box after the form.', points: 0 },
        { label: 'Partially mapped, with big gaps.', points: 1 },
        { label: 'Mapped, but not consistently measured.', points: 2 },
        { label: 'Fully mapped and measured, start to finish.', points: 3 }
      ]
    },
    {
      q: 'When a test “wins” online — more clicks, more leads — do you verify it actually drove more sales?',
      options: [
        { label: 'We assume more clicks means more revenue.', points: 0 },
        { label: 'Rarely — we usually take the online number at face value.', points: 1 },
        { label: 'Sometimes, for the bigger launches.', points: 2 },
        { label: 'Always — every result is checked against the actual outcome.', points: 3 }
      ]
    },
    {
      q: 'Do you report the tests and campaigns that didn’t work, or mostly just the wins?',
      options: [
        { label: 'Only the wins make it into the deck.', points: 0 },
        { label: 'Losses get quietly dropped.', points: 1 },
        { label: 'Losses are reported, but rarely analysed deeply.', points: 2 },
        { label: 'Every result — win, loss or flat — is documented and shared.', points: 3 }
      ]
    },
    {
      q: 'How do you decide what to test or build next?',
      options: [
        { label: 'Whoever’s loudest in the room, or the latest trend.', points: 0 },
        { label: 'Gut feel, roughly ranked.', points: 1 },
        { label: 'An informal scoring system.', points: 2 },
        { label: 'A formal, weighted framework tied to revenue impact.', points: 3 }
      ]
    },
    {
      q: 'Is there a single source of truth connecting your web analytics to your CRM or DMS?',
      options: [
        { label: 'No integration — everything is matched by hand, if at all.', points: 0 },
        { label: 'Partial exports and manual matching.', points: 1 },
        { label: 'Semi-automated integration.', points: 2 },
        { label: 'Fully automated, close to real time.', points: 3 }
      ]
    }
  ];

  var BANDS = [
    {
      max: 39, tier: 'tier-low', name: 'Analytics-only',
      headline: 'You’re collecting data — but the loop to the sale isn’t closed yet.',
      body: 'Right now, most of what happens after the click is invisible: enquiries, test-drives and site visits aren’t reliably tied back to what actually gets sold. Every online “win” is really just a guess about revenue — which is exactly the blind spot Deliberate Lab exists to close.'
    },
    {
      max: 74, tier: 'tier-mid', name: 'Testing, loop open',
      headline: 'You’re testing — but you can’t yet prove it moves real sales.',
      body: 'You’ve got real structure in place — research, maybe even A/B tests. But the connection between an online result and the sale is patchy, so a “winning” test could quietly be losing you revenue. Closing that loop is usually the single highest-leverage fix available to you right now.'
    },
    {
      max: 100, tier: 'tier-high', name: 'Loop-closing',
      headline: 'You’re closing the loop — the opportunity now is scale and rigor.',
      body: 'You’re already doing more than most considered-purchase brands: measuring online actions against real outcomes, with genuine testing discipline. The next gains come from PROOF-scored prioritisation, tighter attribution and running more of the roadmap at once.'
    }
  ];

  var current = 0;
  var answers = new Array(QUESTIONS.length).fill(null); // stores the chosen option INDEX per question, not points

  var startPanel = document.getElementById('aqStart');
  var quizPanel = document.getElementById('aqQuiz');
  var resultPanel = document.getElementById('aqResult');
  var startBtn = document.getElementById('aqStartBtn');
  var qContainer = document.getElementById('aqQuestion');
  var srStatus = document.getElementById('aqSrStatus');
  var progressLabel = document.getElementById('aqProgressLabel');
  var progressPct = document.getElementById('aqProgressPct');
  var progressFill = document.getElementById('aqProgressFill');
  var progressTrack = document.getElementById('aqProgressTrack');
  var backBtn = document.getElementById('aqBackBtn');
  var nextBtn = document.getElementById('aqNextBtn');
  var retakeBtn = document.getElementById('aqRetake');

  function showPanel(panel){
    [startPanel, quizPanel, resultPanel].forEach(function(p){
      if(p) p.hidden = (p !== panel);
    });
  }

  function updateProgress(){
    var n = QUESTIONS.length;
    var pct = Math.round(((current + 1) / n) * 100);
    progressLabel.textContent = 'Question ' + (current + 1) + ' of ' + n;
    progressPct.textContent = pct + '%';
    progressFill.style.width = pct + '%';
    if(progressTrack) progressTrack.setAttribute('aria-valuenow', String(pct));
  }

  function updateNavButtons(){
    backBtn.disabled = current === 0;
    nextBtn.disabled = answers[current] === null;
    nextBtn.innerHTML = (current === QUESTIONS.length - 1)
      ? 'See my score <span class="arw">→</span>'
      : 'Next <span class="arw">→</span>';
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, function(ch){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch];
    });
  }

  function buildQuestionMarkup(index){
    var question = QUESTIONS[index];
    var html = '<fieldset class="aq-fieldset">' +
      '<legend>' + escapeHtml(question.q) + '</legend>' +
      '<ul class="aq-options">';
    question.options.forEach(function(opt, i){
      var id = 'aq-' + index + '-' + i;
      var checked = answers[index] === i ? ' checked' : '';
      html += '<li class="aq-option">' +
        '<input class="aq-input sr-only" type="radio" name="aq-q-' + index + '" id="' + id + '" value="' + i + '"' + checked + '>' +
        '<label class="aq-option-label" for="' + id + '">' +
          '<span class="aq-radio-dot" aria-hidden="true"></span>' +
          '<span class="aq-option-text">' + escapeHtml(opt.label) + '</span>' +
        '</label>' +
      '</li>';
    });
    html += '</ul></fieldset>';
    return html;
  }

  function wireQuestionEvents(){
    var inputs = qContainer.querySelectorAll('.aq-input');
    inputs.forEach(function(input){
      input.addEventListener('change', function(){
        answers[current] = Number(input.value);
        updateNavButtons();
      });
    });
  }

  function paintQuestion(){
    qContainer.innerHTML = buildQuestionMarkup(current);
    wireQuestionEvents();
    updateProgress();
    updateNavButtons();
    if(srStatus){
      srStatus.textContent = 'Question ' + (current + 1) + ' of ' + QUESTIONS.length + '. ' + QUESTIONS[current].q;
    }
    var legend = qContainer.querySelector('legend');
    if(legend){
      legend.setAttribute('tabindex', '-1');
      legend.focus({ preventScroll: true });
    }
    if(!reduceMotion){
      requestAnimationFrame(function(){ qContainer.classList.remove('aq-anim'); });
    }
  }

  function renderQuestion(){
    if(reduceMotion){
      paintQuestion();
      return;
    }
    qContainer.classList.add('aq-anim');
    window.setTimeout(paintQuestion, QUESTION_TRANSITION_MS);
  }

  function computeScore(){
    var total = answers.reduce(function(sum, optIndex, i){
      if(optIndex === null) return sum;
      return sum + QUESTIONS[i].options[optIndex].points;
    }, 0);
    var max = QUESTIONS.length * 3;
    return Math.round((total / max) * 100);
  }

  function getBand(score){
    for(var i = 0; i < BANDS.length; i++){
      if(score <= BANDS[i].max) return BANDS[i];
    }
    return BANDS[BANDS.length - 1];
  }

  function animateCount(el, target, duration){
    if(reduceMotion){ el.textContent = target; return; }
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if(p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  function drawGauge(score){
    var fill = document.getElementById('aqGaugeFill');
    if(!fill || typeof fill.getTotalLength !== 'function') return;
    var len = fill.getTotalLength();
    fill.style.strokeDasharray = len;
    fill.style.strokeDashoffset = len; // start empty
    var target = len * (1 - score / 100);
    if(reduceMotion){
      fill.style.strokeDashoffset = target;
      return;
    }
    // two rAFs: let the "start empty" state paint before transitioning to target
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        fill.style.strokeDashoffset = target;
      });
    });
  }

  function showResult(){
    var score = computeScore();
    var band = getBand(score);

    var scoreNum = document.getElementById('aqScoreNum');
    var verdict = document.getElementById('aqVerdict');
    var headline = document.getElementById('aqHeadline');
    var body = document.getElementById('aqBody');

    scoreNum.textContent = '0';
    verdict.textContent = band.name;
    verdict.className = 'calc-verdict ' + band.tier;
    headline.textContent = band.headline;
    body.textContent = band.body;

    showPanel(resultPanel);
    drawGauge(score);
    animateCount(scoreNum, score, 700);

    headline.setAttribute('tabindex', '-1');
    headline.focus({ preventScroll: true });
  }

  function resetAssessment(){
    current = 0;
    answers = new Array(QUESTIONS.length).fill(null);
  }

  if(startBtn){
    startBtn.addEventListener('click', function(){
      showPanel(quizPanel);
      paintQuestion();
    });
  }

  if(backBtn){
    backBtn.addEventListener('click', function(){
      if(current === 0) return;
      current--;
      renderQuestion();
    });
  }

  if(nextBtn){
    nextBtn.addEventListener('click', function(){
      if(answers[current] === null) return;
      if(current === QUESTIONS.length - 1){
        showResult();
        return;
      }
      current++;
      renderQuestion();
    });
  }

  if(retakeBtn){
    retakeBtn.addEventListener('click', function(){
      resetAssessment();
      showPanel(quizPanel);
      paintQuestion();
    });
  }

  // number-key shortcuts (1-4) to pick an option while the quiz is visible —
  // ignored while focus is in a real text field (e.g. the booking modal)
  // so this never hijacks digits typed into a phone number.
  document.addEventListener('keydown', function(e){
    if(!quizPanel || quizPanel.hidden) return;
    var active = document.activeElement;
    if(active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
    var n = parseInt(e.key, 10);
    if(!n || n < 1 || n > 4) return;
    var options = qContainer.querySelectorAll('.aq-input');
    var target = options[n - 1];
    if(target){
      target.checked = true;
      target.dispatchEvent(new Event('change', { bubbles: true }));
      target.focus();
    }
  });
})();
