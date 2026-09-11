/* Deliberate Lab — Testing Tool Advisor (tool-advisor.html only).
   Multi-step quiz -> weighted match against a small, hand-maintained tool
   dataset. All state lives in memory for the life of the page load, same as
   js/assessment.js — nothing touches localStorage/sessionStorage, so this
   still works in sandboxes that block storage APIs, and a reload always
   starts fresh. */
(function(){
  var widget = document.getElementById('taWidget');
  if(!widget) return; // safe no-op on every other page

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var QUESTION_TRANSITION_MS = 200; // must match .aq-question transition duration in css/styles.css

  /* ============================================================
     TOOL DATASET
     Kept deliberately small and flat so it's easy to keep accurate:
     one object per tool, plain booleans/strings for its traits, and a
     single one-line "bestFor" sentence that's shown verbatim as the
     recommendation's rationale. Every claim here is a conservative,
     well-documented capability as of the tool's current public
     positioning — no pricing numbers, no claims about sub-features we
     aren't confident about. Re-check vendor docs periodically; testing
     tools repackage their tiers often.
     ============================================================ */
  var TOOLS = [
    {
      id: 'vwo', name: 'VWO',
      clientSideEditor: true, serverSide: true, warehouseNative: false,
      appSupport: true, featureFlagging: false, personalization: true,
      sessionReplay: true, freeTier: true, shopify: true,
      technicalBar: 'low', pricingTier: 'mid',
      bestFor: 'An all-in-one visual testing suite for marketing teams, with heatmaps/recordings and a Shopify app built in, plus a server-side option (VWO FullStack) once you outgrow the page editor.'
    },
    {
      id: 'optimizely', name: 'Optimizely (Web + Feature Experimentation)',
      clientSideEditor: true, serverSide: true, warehouseNative: false,
      appSupport: true, featureFlagging: true, personalization: true,
      sessionReplay: false, freeTier: false, shopify: false,
      technicalBar: 'medium', pricingTier: 'enterprise',
      bestFor: 'An enterprise pair of products — a visual editor for marketers (Web Experimentation) and a separate server-side, flag-based engine for engineers (Feature Experimentation) — under one vendor.'
    },
    {
      id: 'ab-tasty', name: 'AB Tasty',
      clientSideEditor: true, serverSide: true, warehouseNative: false,
      appSupport: true, featureFlagging: false, personalization: true,
      sessionReplay: false, freeTier: false, shopify: true,
      technicalBar: 'low', pricingTier: 'mid',
      bestFor: 'A marketer-friendly visual editor with strong built-in personalization/targeting and a Shopify app, plus a server-side flagging layer (Flagship) if you need it.'
    },
    {
      id: 'convert', name: 'Convert.com',
      clientSideEditor: true, serverSide: false, warehouseNative: false,
      appSupport: false, featureFlagging: false, personalization: false,
      sessionReplay: false, freeTier: false, shopify: true,
      technicalBar: 'low', pricingTier: 'mid',
      bestFor: 'A privacy-first, flicker-free client-side testing tool popular with agencies and GDPR-sensitive teams — no meaningful server-side or warehouse story, so it’s a poor fit once the sale moves offline.'
    },
    {
      id: 'kameleoon', name: 'Kameleoon',
      clientSideEditor: true, serverSide: true, warehouseNative: false,
      appSupport: true, featureFlagging: false, personalization: true,
      sessionReplay: false, freeTier: false, shopify: true,
      technicalBar: 'medium', pricingTier: 'enterprise',
      bestFor: 'Best when AI-assisted predictive audience targeting matters as much as the test itself, with both client-side and server-side testing on offer.'
    },
    {
      id: 'growthbook', name: 'GrowthBook',
      clientSideEditor: true, serverSide: true, warehouseNative: true,
      appSupport: true, featureFlagging: true, personalization: false,
      sessionReplay: false, freeTier: true, shopify: false,
      technicalBar: 'medium', pricingTier: 'low',
      bestFor: 'Open-source and warehouse-native — if your outcome data already lives in BigQuery, Snowflake or similar, GrowthBook can score an experiment straight against it, on a genuinely free self-hosted tier.'
    },
    {
      id: 'statsig', name: 'Statsig',
      clientSideEditor: false, serverSide: true, warehouseNative: true,
      appSupport: true, featureFlagging: true, personalization: false,
      sessionReplay: false, freeTier: true, shopify: false,
      technicalBar: 'high', pricingTier: 'low',
      bestFor: 'A developer-first experimentation and feature-flag platform with a rigorous stats engine and a genuinely usable free tier — there’s no visual page editor for marketers.'
    },
    {
      id: 'eppo', name: 'Eppo',
      clientSideEditor: false, serverSide: true, warehouseNative: true,
      appSupport: true, featureFlagging: false, personalization: false,
      sessionReplay: false, freeTier: false, shopify: false,
      technicalBar: 'high', pricingTier: 'enterprise',
      bestFor: 'Purpose-built to sit on top of your data warehouse and score an experiment against the outcome that’s already sitting there — a disbursement, a delivery, a closed sale — not a proxy metric.'
    },
    {
      id: 'adobe-target', name: 'Adobe Target',
      clientSideEditor: true, serverSide: true, warehouseNative: false,
      appSupport: true, featureFlagging: false, personalization: true,
      sessionReplay: false, freeTier: false, shopify: false,
      technicalBar: 'high', pricingTier: 'enterprise',
      bestFor: 'Deep testing and AI-personalization for large enterprises already standardised on Adobe Experience Cloud — heavy implementation overhead if you aren’t.'
    },
    {
      id: 'launchdarkly', name: 'LaunchDarkly',
      clientSideEditor: false, serverSide: true, warehouseNative: false,
      appSupport: true, featureFlagging: true, personalization: false,
      sessionReplay: false, freeTier: true, shopify: false,
      technicalBar: 'high', pricingTier: 'mid',
      bestFor: 'A feature-flag-first platform for engineering-led teams — experiments run as a layer on top of flags you’re likely managing already.'
    },
    {
      id: 'split', name: 'Split (by Harness)',
      clientSideEditor: false, serverSide: true, warehouseNative: false,
      appSupport: true, featureFlagging: true, personalization: false,
      sessionReplay: false, freeTier: true, shopify: false,
      technicalBar: 'high', pricingTier: 'mid',
      bestFor: 'Similar territory to LaunchDarkly: engineering-led feature flagging with experimentation layered on top, for teams already running flag-based rollouts.'
    },
    {
      id: 'posthog', name: 'PostHog',
      clientSideEditor: false, serverSide: true, warehouseNative: false,
      appSupport: true, featureFlagging: true, personalization: false,
      sessionReplay: true, freeTier: true, shopify: false,
      technicalBar: 'medium', pricingTier: 'low',
      bestFor: 'An open-source product-analytics suite with feature flags, experiments and session replay bundled together on a genuinely generous free tier — a strong one-stop pick for product-led teams.'
    },
    {
      id: 'amplitude-experiment', name: 'Amplitude Experiment',
      clientSideEditor: false, serverSide: true, warehouseNative: false,
      appSupport: true, featureFlagging: true, personalization: false,
      sessionReplay: false, freeTier: false, shopify: false,
      technicalBar: 'high', pricingTier: 'mid',
      bestFor: 'Server-side experimentation and feature flags built into the Amplitude product-analytics suite — a natural fit if your team already lives in Amplitude for behavioural data.'
    },
    {
      id: 'unbounce', name: 'Unbounce',
      clientSideEditor: true, serverSide: false, warehouseNative: false,
      appSupport: false, featureFlagging: false, personalization: true,
      sessionReplay: false, freeTier: false, shopify: false,
      technicalBar: 'low', pricingTier: 'low',
      bestFor: 'A landing-page builder with client-side A/B testing baked in — the right tool when the page you’re testing is a standalone landing page, not your whole site.'
    },
    {
      id: 'intelligems', name: 'Intelligems',
      clientSideEditor: false, serverSide: true, warehouseNative: false,
      appSupport: false, featureFlagging: false, personalization: false,
      sessionReplay: false, freeTier: false, shopify: true,
      technicalBar: 'low', pricingTier: 'mid',
      bestFor: 'A Shopify-native testing tool built specifically for DTC pricing and page tests, implemented server-side within Shopify itself so there’s no flicker — but it only works if you’re on Shopify.'
    }
  ];

  /* Human labels for the "matched on" tags shown under each recommendation —
     keys must match the trait keys used in QUESTIONS[].options[].weights below. */
  var TRAIT_LABELS = {
    clientSideEditor: 'visual editor',
    serverSide: 'server-side testing',
    warehouseNative: 'warehouse-native',
    appSupport: 'mobile app support',
    featureFlagging: 'feature flagging',
    personalization: 'personalization',
    sessionReplay: 'session replay',
    freeTier: 'free tier',
    shopify: 'Shopify support',
    technicalLow: 'easy, no-code setup',
    technicalMedium: 'balanced setup effort',
    technicalHigh: 'engineering-led setup',
    pricingLow: 'budget-friendly',
    pricingMid: 'mid-range pricing',
    pricingEnterprise: 'enterprise-ready'
  };

  function traitVector(tool){
    return {
      clientSideEditor: tool.clientSideEditor ? 1 : 0,
      serverSide: tool.serverSide ? 1 : 0,
      warehouseNative: tool.warehouseNative ? 1 : 0,
      appSupport: tool.appSupport ? 1 : 0,
      featureFlagging: tool.featureFlagging ? 1 : 0,
      personalization: tool.personalization ? 1 : 0,
      sessionReplay: tool.sessionReplay ? 1 : 0,
      freeTier: tool.freeTier ? 1 : 0,
      shopify: tool.shopify ? 1 : 0,
      technicalLow: tool.technicalBar === 'low' ? 1 : 0,
      technicalMedium: tool.technicalBar === 'medium' ? 1 : 0,
      technicalHigh: tool.technicalBar === 'high' ? 1 : 0,
      pricingLow: tool.pricingTier === 'low' ? 1 : 0,
      pricingMid: tool.pricingTier === 'mid' ? 1 : 0,
      pricingEnterprise: tool.pricingTier === 'enterprise' ? 1 : 0
    };
  }

  /* ============================================================
     QUESTIONS
     Each option carries a `weights` object: the trait-score deltas it
     contributes if chosen. Q2 ("where does the sale close?") is the one
     the brief calls out — its offline option adds a much bigger
     warehouseNative/serverSide weight than any other question, and
     subtracts from clientSideEditor, so an offline-heavy answer
     genuinely reshapes the final ranking rather than being cosmetic.
     ============================================================ */
  var QUESTIONS = [
    {
      id: 'traffic', type: 'single',
      q: 'How much monthly traffic runs through the pages you’d test?',
      options: [
        { label: 'Under 50,000 visits a month', weights: { freeTier: 2, pricingLow: 2, technicalLow: 1, pricingEnterprise: -2 } },
        { label: '50,000–500,000 visits a month', weights: { pricingMid: 1, technicalMedium: 1, serverSide: 1 } },
        { label: '500,000+ visits a month', weights: { pricingEnterprise: 2, serverSide: 1, warehouseNative: 1, technicalHigh: 1 } }
      ]
    },
    {
      id: 'saleClose', type: 'single',
      q: 'Where does the sale close?',
      options: [
        { label: 'Fully online — the site or app completes the purchase', weights: { clientSideEditor: 1 } },
        { label: 'Online enquiry, but it closes offline — a call, a rep, a branch', weights: { warehouseNative: 2, serverSide: 1 } },
        { label: 'Mostly offline — a showroom, branch, counter or person closes it in person', weights: { warehouseNative: 4, serverSide: 2, clientSideEditor: -1 } }
      ]
    },
    {
      id: 'howTestsRun', type: 'single',
      q: 'How should tests actually run?',
      options: [
        { label: 'Client-side, with a visual point-and-click editor', weights: { clientSideEditor: 3 } },
        { label: 'Server-side, via code or feature flags', weights: { serverSide: 3, featureFlagging: 1 } },
        { label: 'Inside a native mobile app', weights: { appSupport: 3, serverSide: 2 } },
        { label: 'Not sure yet', weights: { clientSideEditor: 1, technicalLow: 1 } }
      ]
    },
    {
      id: 'mustHaves', type: 'multi',
      q: 'Any must-haves? Pick as many as apply.',
      options: [
        { label: 'Feature flagging', weights: { featureFlagging: 4 } },
        { label: 'Server-side testing', weights: { serverSide: 4 } },
        { label: 'Personalization / audience targeting', weights: { personalization: 4 } },
        { label: 'Session replay / heatmaps', weights: { sessionReplay: 4 } },
        { label: 'A genuinely free tier', weights: { freeTier: 4 } },
        { label: 'Shopify support', weights: { shopify: 4 } }
      ]
    },
    {
      id: 'budget', type: 'single',
      q: 'What’s your budget range for a testing tool?',
      options: [
        { label: 'Free or low-cost', weights: { freeTier: 3, pricingLow: 2, pricingEnterprise: -2 } },
        { label: 'Mid-range', weights: { pricingMid: 2 } },
        { label: 'Enterprise', weights: { pricingEnterprise: 3 } }
      ]
    }
  ];

  var current = 0;
  // single -> stored option index (Number) or null; multi -> stored array of indices (possibly empty)
  var answers = QUESTIONS.map(function(q){ return q.type === 'multi' ? [] : null; });

  var startPanel = document.getElementById('taStart');
  var quizPanel = document.getElementById('taQuiz');
  var resultPanel = document.getElementById('taResult');
  var startBtn = document.getElementById('taStartBtn');
  var qContainer = document.getElementById('taQuestion');
  var srStatus = document.getElementById('taSrStatus');
  var progressLabel = document.getElementById('taProgressLabel');
  var progressPct = document.getElementById('taProgressPct');
  var progressFill = document.getElementById('taProgressFill');
  var progressTrack = document.getElementById('taProgressTrack');
  var backBtn = document.getElementById('taBackBtn');
  var nextBtn = document.getElementById('taNextBtn');
  var retakeBtn = document.getElementById('taRetake');
  var resultList = document.getElementById('taResultList');
  var emailToggleBtn = document.getElementById('taEmailToggle');
  var emailForm = document.getElementById('taEmailForm');
  var emailInput = document.getElementById('taEmailInput');
  var emailCompany = document.getElementById('taEmailCompany'); // honeypot
  var emailStatus = document.getElementById('taEmailStatus');
  var emailSubmitBtn = document.getElementById('taEmailSubmitBtn');

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

  function isAnswered(index){
    var q = QUESTIONS[index];
    if(q.type === 'multi') return true; // "pick any that apply" — zero is a valid answer
    return answers[index] !== null;
  }

  function updateNavButtons(){
    backBtn.disabled = current === 0;
    nextBtn.disabled = !isAnswered(current);
    nextBtn.innerHTML = (current === QUESTIONS.length - 1)
      ? 'See my results <span class="arw">→</span>'
      : 'Next <span class="arw">→</span>';
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, function(ch){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch];
    });
  }

  function buildQuestionMarkup(index){
    var question = QUESTIONS[index];
    var isMulti = question.type === 'multi';
    var inputType = isMulti ? 'checkbox' : 'radio';
    var html = '<fieldset class="aq-fieldset">' +
      '<legend>' + escapeHtml(question.q) + '</legend>' +
      '<ul class="aq-options">';
    question.options.forEach(function(opt, i){
      var id = 'ta-' + index + '-' + i;
      var checked = isMulti
        ? (answers[index].indexOf(i) !== -1 ? ' checked' : '')
        : (answers[index] === i ? ' checked' : '');
      var name = isMulti ? ('ta-q-' + index + '-' + i) : ('ta-q-' + index);
      var dotClass = isMulti ? 'aq-radio-dot aq-check-dot' : 'aq-radio-dot';
      html += '<li class="aq-option">' +
        '<input class="aq-input sr-only" type="' + inputType + '" name="' + name + '" id="' + id + '" value="' + i + '"' + checked + '>' +
        '<label class="aq-option-label" for="' + id + '">' +
          '<span class="' + dotClass + '" aria-hidden="true"></span>' +
          '<span class="aq-option-text">' + escapeHtml(opt.label) + '</span>' +
        '</label>' +
      '</li>';
    });
    html += '</ul></fieldset>';
    return html;
  }

  function wireQuestionEvents(){
    var question = QUESTIONS[current];
    var inputs = qContainer.querySelectorAll('.aq-input');
    inputs.forEach(function(input){
      input.addEventListener('change', function(){
        var i = Number(input.value);
        if(question.type === 'multi'){
          var idx = answers[current].indexOf(i);
          if(input.checked && idx === -1) answers[current].push(i);
          if(!input.checked && idx !== -1) answers[current].splice(idx, 1);
        }else{
          answers[current] = i;
        }
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

  /* ---- scoring ---- */
  function computeWeights(){
    var totals = {};
    QUESTIONS.forEach(function(q, qi){
      var chosen = q.type === 'multi' ? answers[qi] : (answers[qi] === null ? [] : [answers[qi]]);
      chosen.forEach(function(optIndex){
        var w = q.options[optIndex].weights;
        Object.keys(w).forEach(function(k){
          totals[k] = (totals[k] || 0) + w[k];
        });
      });
    });
    return totals;
  }

  function scoreTool(tool, weights){
    var vec = traitVector(tool);
    var score = 0;
    Object.keys(weights).forEach(function(k){
      if(vec[k]) score += weights[k];
    });
    return score;
  }

  function topMatchedTraits(tool, weights, max){
    var vec = traitVector(tool);
    var contributions = Object.keys(weights)
      .filter(function(k){ return vec[k] && weights[k] > 0 && TRAIT_LABELS[k]; })
      .map(function(k){ return { key: k, value: weights[k] * vec[k] }; })
      .sort(function(a, b){ return b.value - a.value; });
    return contributions.slice(0, max).map(function(c){ return TRAIT_LABELS[c.key]; });
  }

  function getTopTools(){
    var weights = computeWeights();
    var scored = TOOLS.map(function(tool){
      return { tool: tool, score: scoreTool(tool, weights), tags: topMatchedTraits(tool, weights, 2) };
    });
    // stable-ish sort: Array#sort is stable in evergreen browsers, so ties keep dataset order
    scored.sort(function(a, b){ return b.score - a.score; });
    return scored.slice(0, 3);
  }

  function buildResultMarkup(){
    var top = getTopTools();
    var html = '';
    top.forEach(function(entry, i){
      var tagsHtml = entry.tags.length
        ? '<div class="ta-tool-tags">Matched on: ' + entry.tags.map(function(t){ return '<span class="ta-tool-tag">' + escapeHtml(t) + '</span>'; }).join('') + '</div>'
        : '';
      html += '<div class="ta-tool-card">' +
        '<span class="ta-tool-rank">' + (i + 1) + '</span>' +
        '<div class="ta-tool-body">' +
          '<h3 class="ta-tool-name">' + escapeHtml(entry.tool.name) + '</h3>' +
          '<p class="ta-tool-why">' + escapeHtml(entry.tool.bestFor) + '</p>' +
          tagsHtml +
        '</div>' +
      '</div>';
    });
    return { html: html, top: top };
  }

  function showResult(){
    var built = buildResultMarkup();
    resultList.innerHTML = built.html;

    // reset the optional email step on every fresh result
    if(emailForm){ emailForm.hidden = true; emailForm.reset(); }
    if(emailToggleBtn){ emailToggleBtn.hidden = false; emailToggleBtn.setAttribute('aria-expanded', 'false'); }
    if(emailStatus){ emailStatus.textContent = ''; emailStatus.className = 'ta-email-status'; }
    lastResultTop = built.top;

    showPanel(resultPanel);

    var heading = document.getElementById('taResultHeading');
    if(heading){
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }

  var lastResultTop = [];

  function resetAdvisor(){
    current = 0;
    answers = QUESTIONS.map(function(q){ return q.type === 'multi' ? [] : null; });
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
      if(!isAnswered(current)) return;
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
      resetAdvisor();
      showPanel(quizPanel);
      paintQuestion();
    });
  }

  /* ---- optional "email me this" step: no wall, purely additive ---- */
  if(emailToggleBtn && emailForm){
    emailToggleBtn.addEventListener('click', function(){
      var opening = emailForm.hidden;
      emailForm.hidden = !opening;
      emailToggleBtn.setAttribute('aria-expanded', opening ? 'true' : 'false');
      emailToggleBtn.hidden = opening; // hide the toggle once the form is open; retake brings it back
      if(opening && emailInput) emailInput.focus({ preventScroll: true });
    });
  }

  if(emailForm){
    emailForm.addEventListener('submit', function(e){
      e.preventDefault();
      if(emailCompany && emailCompany.value) return; // honeypot tripped — silently drop

      var email = emailInput.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      emailInput.classList.toggle('invalid', !emailOk);
      if(!emailOk){
        emailStatus.textContent = 'Please enter a valid email address.';
        emailStatus.className = 'ta-email-status error';
        return;
      }

      var summary = lastResultTop.map(function(entry, i){ return (i + 1) + '. ' + entry.tool.name + ' — ' + entry.tool.bestFor; }).join('\n');
      var endpointReady = typeof TOOL_ADVISOR_ENDPOINT !== 'undefined' && TOOL_ADVISOR_ENDPOINT && TOOL_ADVISOR_ENDPOINT.length > 0;

      if(!endpointReady){
        emailStatus.textContent = 'Opening your email client to send this along…';
        emailStatus.className = 'ta-email-status success';
        window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Your Testing Tool Advisor results') + '&body=' + encodeURIComponent('Your 3 best-fit tools from the Deliberate Lab Testing Tool Advisor:\n\n' + summary + '\n\n— deliberatelab.com/tool-advisor.html');
        emailForm.reset();
        return;
      }

      emailSubmitBtn.disabled = true;
      emailStatus.textContent = 'Sending…';
      emailStatus.className = 'ta-email-status';

      fetch(TOOL_ADVISOR_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'email=' + encodeURIComponent(email) + '&results=' + encodeURIComponent(summary)
      }).then(function(){
        emailStatus.textContent = 'Sent — check your inbox shortly.';
        emailStatus.className = 'ta-email-status success';
        emailForm.reset();
      }).catch(function(){
        emailStatus.textContent = 'Something went wrong. Please email hello@deliberatelab.com.';
        emailStatus.className = 'ta-email-status error';
      }).finally(function(){
        emailSubmitBtn.disabled = false;
      });
    });

    if(emailInput){
      emailInput.addEventListener('input', function(){
        if(emailInput.classList.contains('invalid')) emailInput.classList.remove('invalid');
      });
    }
  }

  // number-key shortcuts (1-6) to toggle/select an option while the quiz is
  // visible — ignored while focus is in a real text field.
  document.addEventListener('keydown', function(e){
    if(!quizPanel || quizPanel.hidden) return;
    var active = document.activeElement;
    if(active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
    var n = parseInt(e.key, 10);
    if(!n || n < 1 || n > 6) return;
    var options = qContainer.querySelectorAll('.aq-input');
    var target = options[n - 1];
    if(target){
      target.checked = QUESTIONS[current].type === 'multi' ? !target.checked : true;
      target.dispatchEvent(new Event('change', { bubbles: true }));
      target.focus();
    }
  });
})();
