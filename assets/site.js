/* Civilizational Unity — behavior loader.
   One stylesheet layer and one behavior file. Everything the reader needs is
   already in the HTML; this only adds theme, filtering and video facades. */
(function () {
  "use strict";
  function loadStyle(href) {
    if (document.querySelector('link[href="' + href + '"]')) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }
  loadStyle("/assets/visual-polish.css");
  var s = document.createElement("script");
  s.src = "/assets/site-core.js";
  document.head.appendChild(s);
})();
