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

  /* ---------- ARGUMENT CHAIN ----------
     All four links are visible at all times. The control inverts the whole
     argument in place. That inversion is the thesis being falsified, not decor. */
  var FORWARD = [
    {
      step: "First",
      term: "Dignity",
      gloss: "A society begins by deciding whose worth it will recognize. That decision comes before law and before institutions, and it sets the ceiling on everything built above it.",
      works: [
        ["Law, Religion and Human Dignity in the Muslim World Today", "Journal of Law and Religion 24:2"],
        ["Qur'anic Guidance for Good Governance", "Palgrave Macmillan, 2017"],
        ["Human Intelligence and Artificial Intelligence", "IslamiCity"]
      ]
    },
    {
      step: "Second",
      term: "Cooperation",
      gloss: "Where worth is recognized across a boundary, cooperation across that boundary becomes possible. Where it is not, the boundary hardens and every exchange becomes a transaction between suspicious parties.",
      works: [
        ["Dialogue of Civilizations: Islamic and Western Perceptions", "Al-Shajarah 16:2"],
        ["Conflict among Muslim Nations: Role of the OIC", "Intellectual Discourse 12:2"],
        ["Muslim and European Perceptions of Oceanic Trade", "Intellectual Discourse 7:2"]
      ]
    },
    {
      step: "Third",
      term: "Governance",
      gloss: "Cooperation that lasts has to be institutionalized. Governance is the machinery that converts a moral recognition into a durable arrangement, and it is where most civilizations either consolidate or begin to slip.",
      works: [
        ["Guidance for Good Governance", "IIUM Press and Caux Round Table"],
        ["Political Discourse of the Organization of the Islamic Conference", "Blackwell Companion, 2006"],
        ["The Organization of the Islamic Conference", "in Malaysia and the Islamic World, ASEAN Academic Press, 2004"]
      ]
    },
    {
      step: "Fourth",
      term: "Flourishing",
      gloss: "What we call a civilization is the visible output of the three links before it: sustained cooperation under workable institutions, over enough time to produce learning, trade, art and law.",
      works: [
        ["On History, Progress and Civilization", "AJISS 19:2"],
        ["What is History?", "International Journal of Islamic Thoughts 5:1"],
        ["Civilizational Conflict, Renewal, or Transformation", "Islam and Civilisational Renewal 4:4"]
      ]
    }
  ];

  var REVERSE = [
    {
      step: "First, inverted",
      term: "Contempt",
      gloss: "The chain runs backward on the same logic. It starts when a group is defined as worth less, whether by conquest, by doctrine, or by a scholarly framework that codes some peoples as historical actors and others as scenery.",
      works: [
        ["Problems of Eurocentric Views of History", "Al-Shajarah 18:1"],
        ["Images of Islam: Islamic Terrorism or Terrorizing the Truth?", "Pakistan Journal of History and Culture 18:2"],
        ["Bernard Lewis: A Legacy of Knowledge but not Wisdom", "Middle East Monitor, 2018"]
      ]
    },
    {
      step: "Second, inverted",
      term: "Coercion",
      gloss: "Where recognition fails, cooperation has to be manufactured by force. Coercion is efficient in the short run and expensive forever after, because it has to be renewed continuously.",
      works: [
        ["Elite Formation in Muslim Countries", "Islamic Studies 37:1"],
        ["The Clash of Civilizations Thesis and Muslims", "Islamic Studies 48:2"],
        ["From Colonization to the Clash of Civilization", "CIGA seminar, 2019"]
      ]
    },
    {
      step: "Third, inverted",
      term: "Misrule",
      gloss: "Institutions built to administer coercion stop serving the governed and start defending themselves. The formal machinery of the state survives. Its legitimacy does not.",
      works: [
        ["Is Pakistan a Failed State?", "Insight Turkey 20:1"],
        ["The Never-Ending Kashmir Dispute", "Al-Shajarah 22:1"],
        ["The OIC at Fifty: Between Hope and Despair", "Al Sharq Forum, 2019"]
      ]
    },
    {
      step: "Fourth, inverted",
      term: "Collapse",
      gloss: "The end state is rarely a dramatic fall. It is a long erosion in which a civilization keeps its wealth and its weapons while losing the capacity to justify itself, including to its own members.",
      works: [
        ["Israel's Gaza War: A Symbol of Collapsing Civilization", "Clarity Press, 2025"],
        ["Is the One-Sided US Response to Gaza a Sign of Civilizational Decline?", "Informed Comment"],
        ["The Question of Palestine and the Muslim World", "New Middle Eastern Studies 8:2"]
      ]
    }
  ];

  var chain = document.getElementById("chain");
  if (chain) {
    var grid = document.getElementById("chainGrid");
    var swap = document.getElementById("chainSwap");
    var swapLbl = document.getElementById("chainSwapLabel");
    var flipped = false;

    function esc(s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    }

    function paint(animate) {
      var set = flipped ? REVERSE : FORWARD;
      grid.innerHTML = set.map(function (n) {
        var works = n.works.map(function (w) {
          return "<li><cite>" + esc(w[0]) + "</cite><br>" + esc(w[1]) + "</li>";
        }).join("");
        return '<article class="node">' +
          '<p class="node__step">' + esc(n.step) + "</p>" +
          '<h3 class="node__term">' + esc(n.term) + "</h3>" +
          '<p class="node__gloss">' + esc(n.gloss) + "</p>" +
          '<p class="node__cite">Where he argues it</p>' +
          '<ul class="node__works">' + works + "</ul>" +
          "</article>";
      }).join("");
      if (animate) {
        grid.classList.remove("pulse");
        void grid.offsetWidth;
        grid.classList.add("pulse");
      }
    }

    swap.addEventListener("click", function () {
      flipped = !flipped;
      chain.classList.toggle("flip", flipped);
      swap.setAttribute("aria-pressed", flipped ? "true" : "false");
      swapLbl.textContent = flipped ? "Run it forward" : "Run it in reverse";
      paint(true);
    });

    paint(false);
  }

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

  /* ---------- WRITING FILTER ----------
     Default state shows everything. Filtering narrows on request; it never
     hides work behind a closed control the reader has to discover. */
  var chips = document.querySelectorAll(".chip[data-filter]");
  if (chips.length) {
    var pieces = document.querySelectorAll(".piece[data-kind]");
    var counter = document.getElementById("count");
    function applyFilter(kind) {
      var shown = 0;
      Array.prototype.forEach.call(pieces, function (p) {
        var match = kind === "all" || p.getAttribute("data-kind") === kind;
        p.hidden = !match;
        if (match) shown++;
      });
      if (counter) {
        counter.textContent = "Showing " + shown + " of " + pieces.length + " items.";
      }
      Array.prototype.forEach.call(chips, function (c) {
        c.setAttribute("aria-pressed", c.getAttribute("data-filter") === kind ? "true" : "false");
      });
    }
    Array.prototype.forEach.call(chips, function (c) {
      c.addEventListener("click", function () { applyFilter(c.getAttribute("data-filter")); });
    });
    applyFilter("all");
  }

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
