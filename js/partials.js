/* Deliberate Lab — shared header/footer partials.
   Loaded BEFORE js/main.js and js/motion.js on every page (both of those
   scripts look up header/footer elements by id as soon as they run, so the
   injection here has to happen synchronously, first).

   Edit the nav links / footer columns / booking modal markup in ONE place —
   HEADER_HTML / FOOTER_HTML below — and every page picks it up. */
(function(){

  var HEADER_HTML =
    '<header id="hdr">' +
      '<div class="scroll-progress" id="scrollProgress"></div>' +
      '<div class="wrap nav">' +
        '<a class="brand" href="index.html">' +
          '<svg class="mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
            '<path d="M9 2v7.2L3.4 19.1A2 2 0 0 0 5.1 22h13.8a2 2 0 0 0 1.7-2.9L15 9.2V2" stroke="#17191e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<path d="M8 2h8" stroke="#17191e" stroke-width="1.6" stroke-linecap="round"/>' +
            '<circle cx="12" cy="16.5" r="1.7" fill="#c9a24b"/>' +
          '</svg>' +
          'Deliberate&nbsp;Lab' +
        '</a>' +
        '<nav class="nav-links" id="navlinks">' +
          '<a href="method.html" data-page="method.html">Method</a>' +
          '<a href="services.html" data-page="services.html">Services</a>' +
          '<a href="tools.html" data-page="tools.html">Assessment</a>' +
          '<a href="case-studies.html" data-page="case-studies.html">Case Studies</a>' +
          '<a href="about.html" data-page="about.html">About</a>' +
          '<a href="insights.html" data-page="insights.html">Insights</a>' +
        '</nav>' +
        '<div class="nav-cta">' +
          '<a href="#book" class="btn js-book-cta">Book a call <span class="arw">→</span></a>' +
          '<button class="menu-btn" id="menuBtn" aria-label="Menu" aria-expanded="false" aria-controls="navlinks"><span></span><span></span><span></span></button>' +
        '</div>' +
      '</div>' +
    '</header>';

  var FOOTER_HTML =
    '<footer>' +
      '<div class="wrap">' +
        '<div class="f-top">' +
          '<div class="f-brand">' +
            '<a class="brand" href="index.html">' +
              '<svg class="mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
                '<path d="M9 2v7.2L3.4 19.1A2 2 0 0 0 5.1 22h13.8a2 2 0 0 0 1.7-2.9L15 9.2V2" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
                '<path d="M8 2h8" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/>' +
                '<circle cx="12" cy="16.5" r="1.7" fill="#c9a24b"/>' +
              '</svg>' +
              'Deliberate&nbsp;Lab' +
            '</a>' +
            '<p>Experimentation for considered purchases.<br>Online → the sale, measured.</p>' +
            '<div class="f-locale">' +
              '<svg class="flag-in" viewBox="0 0 30 20" width="22" height="15" role="img" aria-label="Flag of India">' +
                '<rect x="0" y="0" width="30" height="20" fill="#ffffff"/>' +
                '<rect x="0" y="0" width="30" height="6.67" fill="#FF9933"/>' +
                '<rect x="0" y="13.33" width="30" height="6.67" fill="#138808"/>' +
                '<g stroke="#000080" stroke-width="0.4" fill="none">' +
                  '<circle cx="15" cy="10" r="2.6"/>' +
                  '<line x1="15" y1="7.4" x2="15" y2="12.6"/>' +
                  '<line x1="12.4" y1="10" x2="17.6" y2="10"/>' +
                  '<line x1="13.16" y1="8.16" x2="16.84" y2="11.84"/>' +
                  '<line x1="13.16" y1="11.84" x2="16.84" y2="8.16"/>' +
                  '<circle cx="15" cy="10" r="0.5" fill="#000080" stroke="none"/>' +
                '</g>' +
              '</svg>' +
              '<span>India</span>' +
            '</div>' +
          '</div>' +
          '<div class="f-col">' +
            '<h4>Company</h4>' +
            '<a href="tools.html">Free Assessment</a>' +
            '<a href="about.html">About</a>' +
            '<a href="method.html">Method</a>' +
            '<a href="case-studies.html">Case Studies</a>' +
            '<a href="insights.html">Insights</a>' +
          '</div>' +
          '<div class="f-col">' +
            '<h4>Services</h4>' +
            '<a href="services.html#audit">The Deliberate Audit</a>' +
            '<a href="services.html#program">The Deliberate Program</a>' +
            '<a href="services.html#on-demand">On-demand</a>' +
          '</div>' +
          '<div class="f-col">' +
            '<h4>Contact</h4>' +
            '<a href="mailto:info@deliberatelab.com">info@deliberatelab.com</a>' +
            '<a href="#book" class="js-book-cta">Book a call</a>' +
            '<a href="#">LinkedIn</a>' +
          '</div>' +
        '</div>' +
        '<div class="f-bot">' +
          '<span>© 2026 Deliberate Lab · deliberatelab.com</span>' +
          '<span>Evidence, not guesswork.</span>' +
        '</div>' +
      '</div>' +
    '</footer>' +
    '<div class="modal-overlay" id="bookModalOverlay" aria-hidden="true">' +
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="bookModalTitle">' +
        '<button type="button" class="modal-close" id="bookModalClose" aria-label="Close">&times;</button>' +
        '<div class="modal-brand">' +
          '<svg class="mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
            '<path d="M9 2v7.2L3.4 19.1A2 2 0 0 0 5.1 22h13.8a2 2 0 0 0 1.7-2.9L15 9.2V2" stroke="#17191e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<path d="M8 2h8" stroke="#17191e" stroke-width="1.6" stroke-linecap="round"/>' +
            '<circle cx="12" cy="16.5" r="1.7" fill="#c9a24b"/>' +
          '</svg>' +
          '<span>Deliberate&nbsp;Lab</span>' +
        '</div>' +
        '<span class="eyebrow">Start the conversation</span>' +
        '<h3 id="bookModalTitle">Book a discovery call</h3>' +
        '<p class="modal-sub">Share your details and we’ll call you back within one business day.</p>' +
        '<form id="bookForm" novalidate>' +
          '<div class="field">' +
            '<label for="bookName">Name</label>' +
            '<input type="text" id="bookName" name="name" autocomplete="name" required placeholder="Your full name">' +
            '<span class="err" id="bookNameErr">Please enter your name.</span>' +
          '</div>' +
          '<div class="field">' +
            '<label for="bookPhone">Phone number</label>' +
            '<input type="tel" id="bookPhone" name="phone" autocomplete="tel" required placeholder="e.g. 98765 43210" inputmode="tel">' +
            '<span class="err" id="bookPhoneErr">Please enter a valid phone number.</span>' +
          '</div>' +
          '<div class="hp-field" aria-hidden="true">' +
            '<label for="bookCompany">Company</label>' +
            '<input type="text" id="bookCompany" name="company" tabindex="-1" autocomplete="off">' +
          '</div>' +
          '<button type="submit" class="btn modal-submit" id="bookSubmitBtn">' +
            '<span class="btn-txt">Book my call</span> <span class="arw">→</span>' +
          '</button>' +
          '<p class="modal-status" id="bookStatus" role="status" aria-live="polite"></p>' +
        '</form>' +
      '</div>' +
    '</div>';

  function inject(mountId, html){
    var mount = document.getElementById(mountId);
    if(mount) mount.innerHTML = html;
  }

  inject('site-header', HEADER_HTML);
  inject('site-footer', FOOTER_HTML);

  // active-page state on the nav (matched by filename, so it works the same
  // whether the page is opened directly or served via http.server)
  var path = window.location.pathname.split('/').pop();
  var current = path === '' ? 'index.html' : path;
  var links = document.querySelectorAll('#site-header .nav-links a[data-page]');
  for(var i = 0; i < links.length; i++){
    if(links[i].getAttribute('data-page') === current){
      links[i].classList.add('active');
      links[i].setAttribute('aria-current', 'page');
    }
  }
})();
