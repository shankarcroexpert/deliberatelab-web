/* Deliberate Lab — the CRO Diagnostic (tools.html only).
   All state lives in memory for the life of the page load — nothing is
   written to localStorage/sessionStorage, so this works even in sandboxes
   that block storage APIs. A full page reload always starts fresh. */
(function(){
  var widget = document.getElementById('aqWidget');
  if(!widget) return; // safe no-op on every other page

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var QUESTION_TRANSITION_MS = 200; // must match the .aq-question transition duration in css/styles.css

  /* Ten questions, two per maturity dimension. Category totals feed the
     three named breakdown bars on the result screen (Research /
     Experimentation / Measurement) and the priority recommendation, which
     is picked from whichever of the five dimensions actually scored
     lowest — including Analytics and Prioritization, even though those
     two don't get their own bar on screen. */
  var QUESTIONS = [
    {
      category: 'research',
      q: 'Do you run structured research (interviews, session recordings, surveys) before deciding what to test?',
      options: [
        { label: 'We don’t — changes ship on opinion.', points: 0 },
        { label: 'Occasionally, when something feels broken.', points: 1 },
        { label: 'Regularly, but informally.', points: 2 },
        { label: 'Yes — every major hypothesis traces back to a specific finding.', points: 3 }
      ]
    },
    {
      category: 'research',
      q: 'Do you know why shoppers abandon at each stage of your funnel, not just where?',
      options: [
        { label: 'No idea — we only see the drop-off numbers.', points: 0 },
        { label: 'We have theories, not evidence.', points: 1 },
        { label: 'Some qualitative insight, but patchy.', points: 2 },
        { label: 'Yes — backed by recordings, surveys or interviews.', points: 3 }
      ]
    },
    {
      category: 'analytics',
      q: 'Is your analytics tracking (GA4, Shopify analytics, etc.) set up cleanly, with events you actually trust?',
      options: [
        { label: 'Honestly, we don’t fully trust our own numbers.', points: 0 },
        { label: 'Mostly set up, with known gaps.', points: 1 },
        { label: 'Solid, reviewed occasionally.', points: 2 },
        { label: 'Clean, audited, and trusted for every key decision.', points: 3 }
      ]
    },
    {
      category: 'analytics',
      q: 'Can you see performance broken down by device, segment or traffic source, not just store-wide?',
      options: [
        { label: 'Store-wide numbers only.', points: 0 },
        { label: 'Sometimes, with manual digging.', points: 1 },
        { label: 'Yes, for the metrics that matter most.', points: 2 },
        { label: 'Yes — segmented reporting is part of how we work.', points: 3 }
      ]
    },
    {
      category: 'experimentation',
      q: 'Do you run structured, statistically sound A/B tests on your key pages?',
      options: [
        { label: 'We don’t test — we just ship changes.', points: 0 },
        { label: 'Occasionally, without much rigor.', points: 1 },
        { label: 'Regularly, with reasonable rigor.', points: 2 },
        { label: 'Yes — proper sample-size and duration planning, every time.', points: 3 }
      ]
    },
    {
      category: 'experimentation',
      q: 'When a test “wins”, do you know it’s a real result and not noise?',
      options: [
        { label: 'We eyeball it and move on.', points: 0 },
        { label: 'Rarely checked properly.', points: 1 },
        { label: 'Usually, for the bigger tests.', points: 2 },
        { label: 'Always — every result is read for statistical validity.', points: 3 }
      ]
    },
    {
      category: 'prioritization',
      q: 'How do you decide what to test or build next?',
      options: [
        { label: 'Whoever’s loudest in the room, or the latest trend.', points: 0 },
        { label: 'Gut feel, roughly ranked.', points: 1 },
        { label: 'An informal scoring system.', points: 2 },
        { label: 'A formal, weighted framework tied to revenue impact.', points: 3 }
      ]
    },
    {
      category: 'prioritization',
      q: 'Is your roadmap agreed and visible before work starts, or does it shift week to week?',
      options: [
        { label: 'It shifts constantly.', points: 0 },
        { label: 'Loosely agreed, often reshuffled.', points: 1 },
        { label: 'Mostly stable, some flexibility.', points: 2 },
        { label: 'Locked and prioritized before a single test is built.', points: 3 }
      ]
    },
    {
      category: 'measurement',
      q: 'Do you report the tests that didn’t work, or mostly just the wins?',
      options: [
        { label: 'Only the wins make it into the deck.', points: 0 },
        { label: 'Losses get quietly dropped.', points: 1 },
        { label: 'Losses are reported, but rarely analysed deeply.', points: 2 },
        { label: 'Every result — win, loss or flat — is documented and shared.', points: 3 }
      ]
    },
    {
      category: 'measurement',
      q: 'Is there a learning library — somewhere every past result is captured, so you don’t re-test the same idea by accident?',
      options: [
        { label: 'No — results live in people’s memory, if anywhere.', points: 0 },
        { label: 'Scattered across docs and slides.', points: 1 },
        { label: 'Loosely organized somewhere.', points: 2 },
        { label: 'Yes — a single source of truth for every result.', points: 3 }
      ]
    }
  ];

  var BANDS = [
    {
      max: 39, tier: 'tier-low', name: 'Ad-hoc',
      headline: 'Testing happens, if at all — but there’s no system behind it yet.',
      body: 'Right now, most decisions are shipped on opinion and judged on whatever metric moved that week. There’s no shortage of ideas, just no system connecting them to evidence, which is exactly the gap Deliberate Lab exists to close.'
    },
    {
      max: 74, tier: 'tier-mid', name: 'Emerging',
      headline: 'You’ve got real pieces in place — they’re just not running as one system yet.',
      body: 'Research, testing or tracking exist in some form, but they’re not yet wired together into a single loop. That gap is usually the single highest-leverage fix available to you right now.'
    },
    {
      max: 100, tier: 'tier-high', name: 'Systematic',
      headline: 'You’re running CRO as an operating system, not a collection of tweaks.',
      body: 'You’re already doing more than most Shopify brands: research feeding hypotheses, disciplined testing, honest measurement. The next gains come from tighter prioritization and running more of the roadmap at once.'
    }
  ];

  var CATEGORY_LABELS = {
    research: 'Research',
    analytics: 'Analytics',
    experimentation: 'Experimentation',
    prioritization: 'Prioritization',
    measurement: 'Measurement'
  };

  var PRIORITY_COPY = {
    research: 'Your biggest opportunity right now: Research. Testing without research is just guessing with extra steps — start every hypothesis from a real user insight.',
    analytics: 'Your biggest opportunity right now: Analytics. If you can’t trust the numbers, you can’t trust the test results built on top of them.',
    experimentation: 'Your biggest opportunity right now: Experimentation. Structured, properly-powered A/B tests are how evidence becomes proof.',
    prioritization: 'Your biggest opportunity right now: Prioritization. Score every idea the same way, and the highest-impact bets rise to the top on their own.',
    measurement: 'Your biggest opportunity right now: Measurement. A win you can’t explain is a win you can’t repeat.'
  };

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

  /* Returns { overall: 0-100, byCategory: { research: 0-100, ... } } */
  function computeScores(){
    var totals = {}, maxes = {};
    Object.keys(CATEGORY_LABELS).forEach(function(cat){ totals[cat] = 0; maxes[cat] = 0; });

    var grandTotal = 0, grandMax = QUESTIONS.length * 3;

    QUESTIONS.forEach(function(question, i){
      maxes[question.category] += 3;
      if(answers[i] === null) return;
      var pts = question.options[answers[i]].points;
      totals[question.category] += pts;
      grandTotal += pts;
    });

    var byCategory = {};
    Object.keys(CATEGORY_LABELS).forEach(function(cat){
      byCategory[cat] = maxes[cat] > 0 ? Math.round((totals[cat] / maxes[cat]) * 100) : 0;
    });

    return {
      overall: Math.round((grandTotal / grandMax) * 100),
      byCategory: byCategory
    };
  }

  function lowestCategory(byCategory){
    var lowestCat = null, lowestVal = Infinity;
    Object.keys(byCategory).forEach(function(cat){
      if(byCategory[cat] < lowestVal){ lowestVal = byCategory[cat]; lowestCat = cat; }
    });
    return lowestCat;
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

  function fillBar(barId, pctId, pct){
    var bar = document.getElementById(barId);
    var pctEl = document.getElementById(pctId);
    if(pctEl) pctEl.textContent = pct + '%';
    if(!bar) return;
    if(reduceMotion){
      bar.style.width = pct + '%';
      return;
    }
    bar.style.width = '0%';
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        bar.style.width = pct + '%';
      });
    });
  }

  function showResult(){
    var scores = computeScores();
    var band = getBand(scores.overall);
    var priorityCat = lowestCategory(scores.byCategory);

    var scoreNum = document.getElementById('aqScoreNum');
    var verdict = document.getElementById('aqVerdict');
    var headline = document.getElementById('aqHeadline');
    var body = document.getElementById('aqBody');
    var priorityText = document.getElementById('aqPriorityText');

    scoreNum.textContent = '0';
    verdict.textContent = band.name;
    verdict.className = 'calc-verdict ' + band.tier;
    headline.textContent = band.headline;
    body.textContent = band.body;
    if(priorityText) priorityText.textContent = PRIORITY_COPY[priorityCat] || '';

    fillBar('aqBarResearch', 'aqPctResearch', scores.byCategory.research);
    fillBar('aqBarExperimentation', 'aqPctExperimentation', scores.byCategory.experimentation);
    fillBar('aqBarMeasurement', 'aqPctMeasurement', scores.byCategory.measurement);

    showPanel(resultPanel);
    drawGauge(scores.overall);
    animateCount(scoreNum, scores.overall, 700);

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
