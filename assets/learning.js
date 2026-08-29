/* Civilizational Unity — lightweight learning affordances */
(function(){
  "use strict";

  function normal(s){
    s=String(s==null?"":s).toLowerCase();
    try{s=s.normalize("NFD").replace(/[\u0300-\u036f]/g,"")}catch(e){}
    return s.replace(/[’‘]/g,"'").replace(/\s+/g," ").trim();
  }

  function initWritingSearch(){
    var path=window.location.pathname;
    if(path!=="/writing"&&path!=="/writing-v2.html"&&path!=="/writing.html")return;
    var filters=document.querySelector(".filters");
    var pieces=Array.prototype.slice.call(document.querySelectorAll(".piece[data-kind]"));
    var count=document.getElementById("count");
    if(!filters||!pieces.length)return;

    var params=new URLSearchParams(window.location.search);
    var query=params.get("q")||"";
    var activeKind="all";
    var pressed=filters.querySelector('.chip[aria-pressed="true"]');
    if(pressed)activeKind=pressed.getAttribute("data-filter")||"all";

    var wrap=document.createElement("form");
    wrap.className="topic-search";
    wrap.setAttribute("role","search");
    wrap.innerHTML='<label for="writingTopicSearch"><span>Search by topic or title</span><input id="writingTopicSearch" type="search" autocomplete="off" placeholder="Try dignity, dialogue, OIC, history…"></label><button class="btn btn--quiet topic-search__clear" type="button">Clear</button>';
    filters.parentNode.insertBefore(wrap,filters);
    var input=wrap.querySelector("input");
    var clear=wrap.querySelector("button");
    input.value=query;

    var empty=document.createElement("p");
    empty.className="quiet-note topic-search__empty";
    empty.hidden=true;
    empty.textContent="No selected items match this search. Try a broader term or clear the publication-type filter.";
    if(count&&count.parentNode)count.parentNode.insertBefore(empty,count.nextSibling);

    function setUrl(){
      if(!window.history||!window.history.replaceState)return;
      var u=new URL(window.location.href);
      if(query.trim())u.searchParams.set("q",query.trim());else u.searchParams.delete("q");
      window.history.replaceState({},"",u.pathname+u.search+u.hash);
    }

    function render(){
      var q=normal(query);
      var terms=q?q.split(" ").filter(Boolean):[];
      var shown=0;
      pieces.forEach(function(piece){
        var kindMatch=activeKind==="all"||piece.getAttribute("data-kind")===activeKind;
        var hay=normal(piece.textContent);
        var topicMatch=!terms.length||terms.every(function(t){return hay.indexOf(t)!==-1});
        var match=kindMatch&&topicMatch;
        piece.hidden=!match;
        if(match)shown++;
      });
      Array.prototype.forEach.call(filters.querySelectorAll(".chip[data-filter]"),function(chip){
        chip.setAttribute("aria-pressed",chip.getAttribute("data-filter")===activeKind?"true":"false");
      });
      if(count){
        var msg="Showing "+shown+" of "+pieces.length+" items";
        if(query.trim())msg+=' matching “'+query.trim()+'”';
        if(activeKind!=="all"){
          var chip=filters.querySelector('.chip[data-filter="'+activeKind+'"]');
          if(chip)msg+=" in "+normal(chip.textContent);
        }
        count.textContent=msg+".";
      }
      empty.hidden=shown!==0;
    }

    /* Capture filter clicks before the original type-only filter so topic and
       publication form remain composable rather than overwriting each other. */
    document.addEventListener("click",function(e){
      var chip=e.target.closest&&e.target.closest(".filters .chip[data-filter]");
      if(!chip)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      activeKind=chip.getAttribute("data-filter")||"all";
      render();
    },true);

    input.addEventListener("input",function(){query=input.value;setUrl();render()});
    wrap.addEventListener("submit",function(e){e.preventDefault();query=input.value;setUrl();render()});
    clear.addEventListener("click",function(){query="";input.value="";setUrl();render();input.focus()});
    render();
  }

  initWritingSearch();
})();
