/* Civilizational Unity — lightweight navigation refinement */
(function(){
  "use strict";
  function addExplore(nav){
    if(!nav||nav.querySelector('a[href="/explore"]'))return;
    var a=document.createElement("a");
    a.href="/explore";
    a.textContent="Explore";
    var home=nav.querySelector('a[href="/"]');
    if(home&&home.nextSibling)nav.insertBefore(a,home.nextSibling);else nav.insertBefore(a,nav.firstChild);
  }
  Array.prototype.forEach.call(document.querySelectorAll(".hdr__nav,.mobile-nav nav"),addExplore);
  var hero=document.querySelector(".gateway-actions a[href='#ideas']");
  if(hero){hero.href="/explore";hero.textContent="Explore the questions"}
  var more=document.querySelector(".argument-stage__more a");
  if(more){more.href="/explore#chronology";more.textContent="Trace the questions across the record →"}
  if(location.pathname==="/framework"||location.pathname==="/framework.html"){
    var row=document.querySelector(".hero .btnrow");
    if(row&&!row.querySelector('a[href="/explore"]')){
      var a=document.createElement("a");a.className="btn btn--quiet";a.href="/explore";a.textContent="Explore the wider record";row.appendChild(a)
    }
  }
})();
