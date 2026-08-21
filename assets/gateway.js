/* Civilizational Unity — optional scholarly exploration tools.
   The core site remains fully readable without this layer. */
(function () {
  "use strict";

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function slug(s) {
    return String(s).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 72) || "work";
  }
  function copyText(text, btn, successLabel) {
    var old = btn && btn.textContent;
    function ok() {
      if (!btn) return;
      btn.textContent = successLabel || "Copied";
      setTimeout(function () { btn.textContent = old; }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, function () {});
      return;
    }
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); ok(); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* Styling belongs to the progressive layer so the static edition is untouched. */
  var st = document.createElement("style");
  st.textContent = [
    ".archive-search{margin:1.75rem 0 1rem;padding:1.15rem 0;border-block:1px solid var(--rule)}",
    ".archive-search label{display:block;font-family:var(--mono);font-size:.72rem;letter-spacing:.11em;text-transform:uppercase;color:var(--slate);margin-bottom:.55rem}",
    ".archive-search__row{display:flex;gap:.55rem;max-width:44rem}",
    ".archive-search input{flex:1;min-width:0;background:var(--paper);color:var(--ink);border:1px solid var(--rule-hard);padding:.8rem .9rem;font:inherit;border-radius:0}",
    ".archive-search input:focus{outline:2px solid var(--rubric);outline-offset:2px}",
    ".archive-search__clear,.piece-tool{background:transparent;color:var(--slate);border:1px solid var(--rule);font-family:var(--mono);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;padding:.55rem .7rem;cursor:pointer}",
    ".archive-search__clear:hover,.piece-tool:hover{color:var(--ink);border-color:var(--ink)}",
    ".archive-search__hint{margin:.5rem 0 0;color:var(--slate);font-size:.82rem}",
    ".piece{scroll-margin-top:6.5rem}",
    ".piece__tools{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.65rem}",
    ".question-explorer__grid{display:grid;gap:2rem;align-items:start}",
    ".question-explorer__tabs{display:grid;border-top:1px solid var(--rule)}",
    ".question-explorer__tabs button{text-align:left;background:transparent;color:var(--ink);border:0;border-bottom:1px solid var(--rule);padding:1rem 0;font-family:var(--display);font-size:clamp(1.05rem,2vw,1.35rem);cursor:pointer}",
    ".question-explorer__tabs button[aria-pressed=true]{color:var(--rubric);padding-left:1rem;border-left:2px solid var(--rubric)}",
    ".question-explorer__panel{border-top:2px solid var(--ink);padding-top:1.25rem;min-height:19rem}",
    ".question-explorer__panel h3{font-size:clamp(1.8rem,4vw,2.8rem);line-height:1.05;margin-bottom:1rem}",
    ".question-explorer__panel>p{max-width:38rem;color:var(--slate)}",
    ".question-explorer__panel ol{padding-left:1.2rem;margin:1rem 0 1.5rem}",
    ".question-explorer__panel li{padding:.35rem 0}",
    ".question-explorer__label{font-family:var(--mono);font-size:.7rem!important;letter-spacing:.1em;text-transform:uppercase;color:var(--rubric)!important;margin-top:1.4rem}",
    "@media(min-width:58rem){.question-explorer__grid{grid-template-columns:minmax(18rem,.75fr) minmax(0,1.25fr);gap:4rem}.question-explorer__panel{position:sticky;top:6rem}}",
    "@media(max-width:38rem){.archive-search__row{display:grid}.archive-search__clear{justify-self:start}}"
  ].join("");
  document.head.appendChild(st);

  /* Writing archive: combine existing form filters with keyword search. */
  (function enhanceWriting() {
    var pieces = Array.prototype.slice.call(document.querySelectorAll(".piece[data-kind]"));
    if (!pieces.length) return;
    var chips = Array.prototype.slice.call(document.querySelectorAll(".chip[data-filter]"));
    var counter = document.getElementById("count");
    var filters = document.querySelector(".filters");
    var seen = {};

    pieces.forEach(function (p) {
      var titleEl = p.querySelector(".piece__t");
      var yearEl = p.querySelector(".piece__yr");
      var srcEl = p.querySelector(".piece__src");
      var title = titleEl ? titleEl.textContent.trim() : "Work";
      var year = yearEl ? yearEl.textContent.trim() : "";
      var base = "work-" + slug(title) + (year ? "-" + year : "");
      var id = base, n = 2;
      while (seen[id]) id = base + "-" + n++;
      seen[id] = true;
      if (!p.id) p.id = id;
      p.setAttribute("data-search", (title + " " + year + " " + (srcEl ? srcEl.textContent : "")).toLowerCase());

      var body = titleEl && titleEl.parentElement;
      if (body && !body.querySelector(".piece__tools")) {
        var tools = document.createElement("div");
        tools.className = "piece__tools";

        var linkBtn = document.createElement("button");
        linkBtn.type = "button";
        linkBtn.className = "piece-tool";
        linkBtn.textContent = "Copy link";
        linkBtn.addEventListener("click", function () {
          copyText(location.origin + location.pathname + "#" + p.id, linkBtn, "Link copied");
        });

        var refBtn = document.createElement("button");
        refBtn.type = "button";
        refBtn.className = "piece-tool";
        refBtn.textContent = "Copy record";
        refBtn.addEventListener("click", function () {
          var record = "Abdullah al-Ahsan — " + title + (year ? " (" + year + ")" : "") + (srcEl ? ". " + srcEl.textContent.replace(/\s+/g, " ").trim() : "");
          copyText(record, refBtn, "Record copied");
        });

        tools.appendChild(linkBtn);
        tools.appendChild(refBtn);
        body.appendChild(tools);
      }
    });

    var searchWrap = document.createElement("div");
    searchWrap.className = "archive-search";
    searchWrap.innerHTML = '<label for="archiveSearch">Search the record</label><div class="archive-search__row"><input id="archiveSearch" type="search" inputmode="search" autocomplete="off" placeholder="Title, venue, year, or keyword"><button type="button" class="archive-search__clear">Clear</button></div><p class="archive-search__hint">Search works already listed on this page. Use the form filters alongside it.</p>';
    if (filters && filters.parentNode) filters.parentNode.insertBefore(searchWrap, filters);

    var input = searchWrap.querySelector("input");
    var clear = searchWrap.querySelector("button");
    var params = window.URLSearchParams ? new URLSearchParams(location.search) : null;
    if (params && params.get("q")) input.value = params.get("q");
    var activeKind = "all";
    if (params && params.get("type") && chips.some(function (c) { return c.getAttribute("data-filter") === params.get("type"); })) {
      activeKind = params.get("type");
    }

    function apply() {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      pieces.forEach(function (p) {
        var typeMatch = activeKind === "all" || p.getAttribute("data-kind") === activeKind;
        var textMatch = !q || (p.getAttribute("data-search") || "").indexOf(q) !== -1;
        var match = typeMatch && textMatch;
        p.hidden = !match;
        if (match) shown++;
      });
      if (counter) counter.textContent = "Showing " + shown + " of " + pieces.length + " items.";
      chips.forEach(function (c) {
        c.setAttribute("aria-pressed", c.getAttribute("data-filter") === activeKind ? "true" : "false");
      });
      if (history.replaceState) {
        var u = new URL(location.href);
        if (q) u.searchParams.set("q", input.value.trim()); else u.searchParams.delete("q");
        if (activeKind !== "all") u.searchParams.set("type", activeKind); else u.searchParams.delete("type");
        history.replaceState(null, "", u.pathname + u.search + u.hash);
      }
    }

    /* Core filter listeners run first; this listener then applies the combined state. */
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        activeKind = c.getAttribute("data-filter");
        window.setTimeout(apply, 0);
      });
    });
    input.addEventListener("input", apply);
    clear.addEventListener("click", function () {
      input.value = "";
      input.focus();
      apply();
    });
    apply();

    /* Machine-readable ItemList derived only from visible bibliographic text. */
    try {
      var items = pieces.map(function (p, i) {
        var t = p.querySelector(".piece__t");
        var y = p.querySelector(".piece__yr");
        var s = p.querySelector(".piece__src");
        var a = t && t.querySelector("a");
        var work = {
          "@type": "CreativeWork",
          name: t ? t.textContent.trim() : "",
          author: { "@type": "Person", name: "Abdullah al-Ahsan" },
          url: a ? a.href : location.origin + location.pathname + "#" + p.id
        };
        if (y) work.datePublished = y.textContent.trim();
        if (s) work.description = s.textContent.replace(/\s+/g, " ").trim();
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

  /* Ideas page: choose a live intellectual question, then enter the bibliography with context. */
  (function questionExplorer() {
    var cases = document.getElementById("cases");
    if (!cases || !document.querySelector(".argument-sequence")) return;
    var routes = [
      {
        q: "What makes civilizational cooperation possible?",
        note: "Begin with the relationship among dignity, cooperation and governance, then test that sequence against historical cases rather than treating it as a law.",
        works: ["Law, Religion and Human Dignity in the Muslim World Today", "Qur'anic Guidance for Good Governance", "On History, Progress and Civilization"],
        search: "governance"
      },
      {
        q: "Is civilizational clash inevitable?",
        note: "Follow the work that places dialogue, conflict and Muslim–Western encounter beside one another across different periods.",
        works: ["Dialogue of Civilizations: Islamic and Western Perceptions", "The Clash of Civilizations Thesis and Muslims", "Muslim and European Perceptions of Oceanic Trade"],
        search: "dialogue"
      },
      {
        q: "What can institutions carry — and where do they fail?",
        note: "Trace the movement from political ideals into organizations, law and governance, especially through the long-running work on the OIC.",
        works: ["OIC: Introduction to an Islamic Political Institution", "Political Discourse of the Organization of the Islamic Conference", "Qur'anic Guidance for Good Governance"],
        search: "OIC"
      },
      {
        q: "Who gets to define the historical record?",
        note: "Read the work that turns attention toward historiography itself: vantage point, Eurocentrism, agency and the categories through which civilizations are described.",
        works: ["Problems of Eurocentric Views of History", "What is History?", "On History, Progress and Civilization"],
        search: "history"
      }
    ];

    var sec = document.createElement("section");
    sec.className = "band band--tint question-explorer no-print";
    sec.setAttribute("aria-labelledby", "question-explorer-title");
    sec.innerHTML = '<div class="shell"><div class="section-lead"><p class="eyebrow">Choose a question</p><h2 id="question-explorer-title">Enter the scholarship from the problem that interests you.</h2><p>These routes are curatorial, not rankings. Each one points back to works already listed in the published record.</p></div><div class="question-explorer__grid"><div class="question-explorer__tabs" role="group" aria-label="Questions"></div><article class="question-explorer__panel" aria-live="polite"></article></div></div>';
    cases.parentNode.insertBefore(sec, cases);

    var tabs = sec.querySelector(".question-explorer__tabs");
    var panel = sec.querySelector(".question-explorer__panel");
    function show(i) {
      var r = routes[i];
      Array.prototype.forEach.call(tabs.querySelectorAll("button"), function (b, j) {
        b.setAttribute("aria-pressed", j === i ? "true" : "false");
      });
      panel.innerHTML = '<p class="eyebrow">A route through the record</p><h3>' + esc(r.q) + '</h3><p>' + esc(r.note) + '</p><p class="question-explorer__label">Begin with</p><ol>' + r.works.map(function (w) { return '<li><cite>' + esc(w) + '</cite></li>'; }).join("") + '</ol><a class="btn btn--quiet" href="/writing?q=' + encodeURIComponent(r.search) + '">Open these works in the writing archive →</a>';
    }
    routes.forEach(function (r, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = r.q;
      b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      b.addEventListener("click", function () { show(i); });
      tabs.appendChild(b);
    });
    show(0);
  })();
})();
