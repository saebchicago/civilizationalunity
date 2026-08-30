/* Abdullah al-Ahsan / site behavior
   Principle: interactivity that does work, never interactivity that hides
   evidence. Nothing here conceals content by default. */
(function () {
  "use strict";

  /* ---------- THEME ----------
     Light is the default reading surface. A real toggle is offered because
     contrast preference is an accessibility need, not a style choice. */
  var root = document.documentElement;
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  function setTheme(t) {
    root.setAttribute("data-theme", t);
    var b = document.getElementById("theme");
    if (b) b.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
  var saved = read("theme");
  if (saved === "dark" || saved === "light") {
    setTheme(saved);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setTheme("dark");
  } else {
    setTheme("light");
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("#theme");
    if (!t) return;
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next);
    store("theme", next);
  });

  /* ---------- VIDEO FACADES ----------
     No YouTube code loads until a deliberate click. Lighthouse-recommended
     pattern, and it means the page sets no third-party cookies on arrival. */
  Array.prototype.forEach.call(document.querySelectorAll(".vid"), function (box) {
    box.addEventListener("click", function () {
      var id = box.getAttribute("data-yt");
      var extra = box.getAttribute("data-yt-params") || "";
      var wrap = document.createElement("div");
      wrap.className = "vid vid--playing";
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0" + (extra ? "&" + extra : "");
      f.title = box.getAttribute("data-title") || "Video";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen";
      f.setAttribute("allowfullscreen", "");
      wrap.appendChild(f);
      box.replaceWith(wrap);
      f.focus();
    });
  });

  /* ---------- WRITING ARCHIVE ----------
     One implementation: publication-type chips and keyword search compose,
     the URL keeps the state, and nothing is hidden until the reader asks. */
  (function writingArchive() {
    var filters = document.querySelector(".filters");
    var pieces = Array.prototype.slice.call(document.querySelectorAll(".piece[data-kind]"));
    var search = document.getElementById("archiveSearch");
    if (!filters || !pieces.length) return;

    var chips = Array.prototype.slice.call(filters.querySelectorAll(".chip[data-filter]"));
    var counter = document.getElementById("count");
    var empty = document.getElementById("archiveEmpty");
    var clear = document.getElementById("archiveClear");
    var activeKind = "all";
    var seen = {};

    function slug(s) {
      return String(s).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 72) || "work";
    }
    function normal(s) {
      s = String(s == null ? "" : s).toLowerCase();
      try { s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); } catch (e) {}
      return s.replace(/[\u2018\u2019]/g, "'").replace(/\s+/g, " ").trim();
    }

    /* Stable anchors so a reader can link to a single item. */
    pieces.forEach(function (p) {
      var titleEl = p.querySelector(".piece__t");
      var yearEl = p.querySelector(".piece__yr");
      var title = titleEl ? titleEl.textContent.trim() : "Work";
      var year = yearEl ? yearEl.textContent.trim() : "";
      var base = "work-" + slug(title) + (year ? "-" + year : "");
      var id = base, n = 2;
      while (seen[id]) id = base + "-" + n++;
      seen[id] = true;
      if (!p.id) p.id = id;
      p.setAttribute("data-search", normal(p.textContent));
    });

    var params = window.URLSearchParams ? new URLSearchParams(location.search) : null;
    if (params && search && params.get("q")) search.value = params.get("q");
    if (params && params.get("type")) {
      var wanted = params.get("type");
      if (chips.some(function (c) { return c.getAttribute("data-filter") === wanted; })) activeKind = wanted;
    }

    function syncUrl(q) {
      if (!history.replaceState || !window.URL) return;
      var u = new URL(location.href);
      if (q) u.searchParams.set("q", q); else u.searchParams.delete("q");
      if (activeKind !== "all") u.searchParams.set("type", activeKind); else u.searchParams.delete("type");
      history.replaceState(null, "", u.pathname + u.search + u.hash);
    }

    function apply() {
      var raw = search ? search.value.trim() : "";
      var terms = normal(raw).split(" ").filter(Boolean);
      var shown = 0;
      pieces.forEach(function (p) {
        var kindMatch = activeKind === "all" || p.getAttribute("data-kind") === activeKind;
        var hay = p.getAttribute("data-search") || "";
        var textMatch = terms.every(function (t) { return hay.indexOf(t) !== -1; });
        var match = kindMatch && textMatch;
        p.hidden = !match;
        if (match) shown++;
      });
      chips.forEach(function (c) {
        c.setAttribute("aria-pressed", c.getAttribute("data-filter") === activeKind ? "true" : "false");
      });
      if (counter) {
        var msg = "Showing " + shown + " of " + pieces.length + " items";
        if (raw) msg += " matching \u201C" + raw + "\u201D";
        if (activeKind !== "all") {
          var chip = filters.querySelector('.chip[data-filter="' + activeKind + '"]');
          if (chip) msg += " in " + chip.textContent.trim().toLowerCase();
        }
        counter.textContent = msg + ".";
      }
      if (empty) empty.hidden = shown !== 0;
      syncUrl(raw);
    }

    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        activeKind = c.getAttribute("data-filter") || "all";
        apply();
      });
    });
    if (search) search.addEventListener("input", apply);
    if (clear) clear.addEventListener("click", function () {
      if (search) { search.value = ""; search.focus(); }
      apply();
    });
    apply();

    /* Machine-readable list built only from the bibliography already on the page. */
    try {
      var items = pieces.map(function (p, i) {
        var t = p.querySelector(".piece__t");
        var y = p.querySelector(".piece__yr");
        var src = p.querySelector(".piece__src");
        var a = t && t.querySelector("a");
        var work = {
          "@type": "CreativeWork",
          name: t ? t.textContent.trim() : "",
          author: { "@type": "Person", name: "Abdullah al-Ahsan" },
          url: a ? a.href : location.origin + location.pathname + "#" + p.id
        };
        if (y) work.datePublished = y.textContent.trim();
        if (src) work.description = src.textContent.replace(/\s+/g, " ").trim();
        return { "@type": "ListItem", position: i + 1, item: work };
      });
      var sd = document.createElement("script");
      sd.type = "application/ld+json";
      sd.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Selected works by Abdullah al-Ahsan",
        itemListElement: items
      });
      document.head.appendChild(sd);
    } catch (e) {}
  })();

  /* ---------- SPEAKING TOPIC PREFILL ---------- */
  var topicSelect = document.getElementById("f-topic");
  if (topicSelect && window.URLSearchParams) {
    var requestedTalk = new URLSearchParams(window.location.search).get("talk");
    if (requestedTalk) {
      Array.prototype.forEach.call(topicSelect.options, function (o) {
        if (o.text === requestedTalk) topicSelect.value = o.value;
      });
    }
  }

  /* ---------- COPY ---------- */
  Array.prototype.forEach.call(document.querySelectorAll(".copy"), function (btn) {
    btn.addEventListener("click", function () {
      var el = document.getElementById(btn.getAttribute("data-src"));
      if (!el) return;
      var txt = el.textContent.replace(/\s+/g, " ").trim();
      var label = btn.textContent;
      function ok() {
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = label; }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(ok, function () {});
      } else {
        var ta = document.createElement("textarea");
        ta.value = txt;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); ok(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });
})();
