/* Deliberate Lab — shared site scripts (loaded by every page) */
(function(){
  // sticky-nav hairline on scroll
  var hdr=document.getElementById('hdr');
  if(hdr){
    var onScroll=function(){hdr.classList.toggle('scrolled',window.scrollY>8);};
    onScroll();
    window.addEventListener('scroll',onScroll,{passive:true});
  }

  // mobile menu toggle
  var mb=document.getElementById('menuBtn'), nl=document.getElementById('navlinks');
  if(mb&&nl){
    mb.addEventListener('click',function(){nl.classList.toggle('open');});
    nl.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){nl.classList.remove('open');});
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
