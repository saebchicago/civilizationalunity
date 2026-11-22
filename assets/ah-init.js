/* First-party analytics loader. This is the site's only analytics.

   It adds the cookieless analytics script from this site's own address
   (/_ah/t.js, passed through by Netlify; see _redirects). Measurements go back
   to this site's address (/_ah/c), so the browser contacts no other website.
   No cookies, no IP addresses, no form contents are stored.

   Nothing is added and nothing is sent when the browser sends Global Privacy
   Control or Do Not Track, or when localStorage holds cu_analytics_off = "1"
   or ah_optout = "1". */
(function () {
  "use strict";
  var nav = navigator;
  if (nav.globalPrivacyControl === true || nav.doNotTrack === "1" || window.doNotTrack === "1") return;
  try {
    if (localStorage.getItem("cu_analytics_off") === "1" || localStorage.getItem("ah_optout") === "1") return;
  } catch (e) {
    /* storage blocked: no stored opt-out can exist, continue */
  }
  var tag = document.createElement("script");
  tag.defer = true;
  tag.src = "/_ah/t.js";
  tag.setAttribute("data-endpoint", "/_ah/c");
  tag.setAttribute("data-optout-key", "cu_analytics_off");
  (document.head || document.documentElement).appendChild(tag);
})();
