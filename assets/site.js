/* Civilizational Unity — stable behavior loader.
   Keep the original site behavior isolated from optional scholarly exploration tools. */
(function () {
  "use strict";
  function load(src, done) {
    var s = document.createElement("script");
    s.src = src;
    s.onload = done || function () {};
    s.onerror = done || function () {};
    document.head.appendChild(s);
  }
  function loadStyle(href) {
    if (document.querySelector('link[href="' + href + '"]')) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }
  loadStyle("/assets/visual-polish.css");
  load("/assets/site-core.js", function () {
    load("/assets/gateway.js", function () {
      load("/assets/nav.js", function () {
        if (!window.location.hash) return;
        var id;
        try { id = decodeURIComponent(window.location.hash.slice(1)); }
        catch (e) { id = window.location.hash.slice(1); }
        var target = document.getElementById(id);
        if (target) target.scrollIntoView({ block: "start" });
      });
    });
  });
})();
