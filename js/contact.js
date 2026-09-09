/* Deliberate Lab — contact form (contact.html only). The lower-commitment
   path alongside the booking modal in main.js — this script only ever
   touches its own #contactForm, so the booking flow is untouched either way.
   POSTs to CONTACT_FORM_ENDPOINT (set in main.js) once you've set one; until
   then it falls back to a mailto so a submission still reaches you instead
   of silently going nowhere. Same pattern as the newsletter form. */
(function(){
  var form = document.getElementById('contactForm');
  if(!form) return;

  var interestInput = document.getElementById('contactInterest');
  var nameInput = document.getElementById('contactName');
  var emailInput = document.getElementById('contactEmail');
  var companyInput = document.getElementById('contactCompany');
  var messageInput = document.getElementById('contactMessage');
  var honeypot = document.getElementById('contactWebsite');
  var interestErr = document.getElementById('contactInterestErr');
  var nameErr = document.getElementById('contactNameErr');
  var emailErr = document.getElementById('contactEmailErr');
  var statusEl = document.getElementById('contactStatus');
  var submitBtn = document.getElementById('contactSubmitBtn');

  function setError(input, errEl, show){
    input.classList.toggle('invalid', show);
    if(errEl) errEl.style.display = show ? 'block' : 'none';
  }

  function setStatus(msg, type){
    statusEl.textContent = msg;
    statusEl.className = 'form-status' + (type ? ' ' + type : '');
  }

  function validate(){
    var ok = true;
    var interestOk = !!interestInput.value;
    var nameOk = nameInput.value.trim().length >= 2;
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());

    setError(interestInput, interestErr, !interestOk);
    setError(nameInput, nameErr, !nameOk);
    setError(emailInput, emailErr, !emailOk);
    if(!interestOk || !nameOk || !emailOk) ok = false;
    return ok;
  }

  [interestInput, nameInput, emailInput].forEach(function(input){
    input.addEventListener('input', function(){
      if(input.classList.contains('invalid')) validate();
    });
    input.addEventListener('change', function(){
      if(input.classList.contains('invalid')) validate();
    });
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();

    if(honeypot && honeypot.value){ return; } // honeypot tripped, silently drop

    if(!validate()){
      setStatus('Please check the fields above.', 'error');
      return;
    }

    var payload = {
      interest: interestInput.value,
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      company: companyInput.value.trim(),
      message: messageInput.value.trim()
    };

    var endpointReady = CONTACT_FORM_ENDPOINT && CONTACT_FORM_ENDPOINT.length > 0;

    if(!endpointReady){
      var body = 'Interest: ' + payload.interest + '\n' +
        'Name: ' + payload.name + '\n' +
        'Email: ' + payload.email + '\n' +
        'Company: ' + (payload.company || '-') + '\n\n' +
        payload.message;
      setStatus('Opening your email client to send this, thanks!', 'success');
      window.location.href = 'mailto:hello@deliberatelab.com?subject=' +
        encodeURIComponent('Contact form: ' + payload.interest) +
        '&body=' + encodeURIComponent(body);
      form.reset();
      return;
    }

    submitBtn.disabled = true;
    setStatus('Sending…', '');

    var formBody = Object.keys(payload).map(function(key){
      return encodeURIComponent(key) + '=' + encodeURIComponent(payload[key]);
    }).join('&');

    fetch(CONTACT_FORM_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody
    }).then(function(){
      setStatus('Thanks, we’ll reply within one business day.', 'success');
      form.reset();
    }).catch(function(){
      setStatus('Something went wrong. Please email hello@deliberatelab.com.', 'error');
    }).finally(function(){
      submitBtn.disabled = false;
    });
  });
})();
