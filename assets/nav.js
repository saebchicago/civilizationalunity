/* Civilizational Unity — lightweight navigation refinement */
(function(){
  "use strict";

  var primary=[
    ["/explore","Learn"],
    ["/framework","Ideas"],
    ["/writing","Writing"],
    ["/speaking","Talks"],
    ["/about","About"],
    ["/press","Press"]
  ];

  function currentKey(){
    var p=window.location.pathname;
    if(p==="/"||p==="/index.html")return "/";
    if(p==="/learn"||p==="/explore"||p==="/explore.html")return "/explore";
    if(p==="/framework"||p==="/framework.html")return "/framework";
    if(p==="/writing"||p==="/writing.html"||p==="/writing-v2.html")return "/writing";
    if(p==="/speaking"||p==="/speaking.html"||p==="/speaking-v2.html")return "/speaking";
    if(p==="/press"||p==="/press.html"||p==="/press-v2.html"||p==="/press-sheet"||p==="/press-sheet.html")return "/press";
    if(p==="/about"||p==="/about.html"||p==="/cv"||p==="/cv.html")return "/about";
    return "";
  }

  function normalizedHref(a){
    try{
      var u=new URL(a.getAttribute("href"),window.location.origin);
      return u.pathname+u.hash;
    }catch(e){return a.getAttribute("href")||""}
  }

  function normalizeNav(nav){
    if(!nav)return;
    var isHome=!!nav.closest(".home-hdr");
    var isMobile=!!nav.closest(".mobile-nav");
    var existing={};
    Array.prototype.forEach.call(nav.querySelectorAll("a"),function(a){existing[normalizedHref(a)]=a});

    var defs=(isHome?[]:[["/","Home"]]).concat(primary);
    if(isMobile)defs.push(["/speaking#invite","Invite / media"]);

    var active=currentKey();
    nav.textContent="";
    defs.forEach(function(def){
      var href=def[0],label=def[1];
      var activeLookup=href.split("#")[0];
      var a=existing[href]||document.createElement("a");
      a.href=href;
      a.textContent=label;
      if(active===activeLookup&&href.indexOf("#")===-1)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");
      nav.appendChild(a);
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll(".hdr__nav,.mobile-nav nav"),normalizeNav);

  var hero=document.querySelector(".gateway-actions a[href='#ideas'],.gateway-actions a[href='/explore']");
  if(hero){hero.href="/explore";hero.textContent="Start learning"}

  var more=document.querySelector(".argument-stage__more a");
  if(more){more.href="/explore#chronology";more.textContent="Trace the questions across the record →"}

  if(currentKey()==="/framework"){
    var row=document.querySelector(".hero .btnrow");
    if(row&&!row.querySelector('a[href="/explore"]')){
      var a=document.createElement("a");
      a.className="btn btn--quiet";
      a.href="/explore";
      a.textContent="Learn across the wider record";
      row.appendChild(a);
    }
  }

  var homeFooter=document.querySelector(".home-foot .foot__grid ul");
  if(homeFooter&&!homeFooter.querySelector('a[href="/explore"]')){
    var li=document.createElement("li");
    li.innerHTML='<a href="/explore">Learn</a>';
    homeFooter.insertBefore(li,homeFooter.firstChild);
  }
})();
