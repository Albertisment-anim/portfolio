(function(){
  function include(el){
    var src = el.getAttribute('data-include');
    if(!src) return Promise.resolve();
    return fetch(src, { cache: 'no-store' })
      .then(function(r){ return r.text(); })
      .then(function(html){ el.outerHTML = html; })
      .catch(function(){ /* ignore include errors */ });
  }

  function run(){
    var nodes = document.querySelectorAll('[data-include]');
    var tasks = [];
    for (var i=0; i<nodes.length; i++) tasks.push(include(nodes[i]));
    Promise.all(tasks).then(function(){
      // After includes loaded, ensure nav active state if not already set by inline script
      try {
        var current = window.location.pathname.split('/').pop() || 'index.html';
        var links = document.querySelectorAll('nav ul li a');
        for (var j=0; j<links.length; j++){
          var link = links[j];
          var href = link.getAttribute('href');
          if (href === current || (current === '' && href === 'index.html')) {
            link.parentElement.classList.add('active');
          }
        }
        // Set header logo link to page-specific About section
        var headerAnchor = document.querySelector('section.HEADER a');
        if (headerAnchor) {
          headerAnchor.setAttribute('href', current + '#ABOUTME');
        }
      } catch(e){}
    });
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();


