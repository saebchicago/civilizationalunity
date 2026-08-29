/* Civilizational Unity — lightweight learning affordances */
(function(){
  "use strict";

  function normal(s){
    s=String(s==null?"":s).toLowerCase();
    try{s=s.normalize("NFD").replace(/[\u0300-\u036f]/g,"")}catch(e){}
    return s.replace(/[’‘]/g,"'").replace(/\s+/g," ").trim();
  }

  function onPath(){
    var path=window.location.pathname;
    for(var i=0;i<arguments.length;i++)if(path===arguments[i])return true;
    return false;
  }

  function initHomepageLearning(){
    if(!onPath("/","/index.html"))return;

    var proof=document.querySelector(".proof-strip");
    var ideas=document.getElementById("ideas");
    if(proof&&ideas&&!document.querySelector(".learning-entry-home")){
      var section=document.createElement("section");
      section.className="band shell learning-entry-home";
      section.setAttribute("aria-labelledby","learning-entry-title");
      section.innerHTML='\
        <div class="section-intro section-intro--split">\
          <div>\
            <p class="eyebrow">Learn the work</p>\
            <h2 id="learning-entry-title">Use the site as a reading room, not just a profile.</h2>\
          </div>\
          <p class="lede">Start with orientation, follow one question through the record, compare works across decades, or use the material in a seminar. Every route points back to authored scholarship and verified sources.</p>\
        </div>\
        <div class="closing-links">\
          <a href="/explore#start"><span>01</span><strong>New to the work</strong><small>A short orientation to the central questions</small></a>\
          <a href="/explore#paths"><span>02</span><strong>Follow a theme</strong><small>Guided paths through dignity, dialogue, institutions and history</small></a>\
          <a href="/explore#chronology"><span>03</span><strong>Compare across decades</strong><small>Trace how questions persist, change and return</small></a>\
          <a href="/explore#seminar"><span>04</span><strong>Teach or discuss</strong><small>Seminar prompts, comparison tools and citation support</small></a>\
        </div>\
        <p class="section-tail"><a href="/explore">Open the full learning hub →</a></p>';
      ideas.parentNode.insertBefore(section,ideas);
    }

    var inquiryLinks=Array.prototype.slice.call(document.querySelectorAll(".inquiry>a"));
    var inquiryTargets=[
      ["/explore#path-dignity","Study this question →"],
      ["/explore#path-dialogue","Study this question →"],
      ["/explore#path-history","Study this question →"]
    ];
    inquiryLinks.forEach(function(a,i){
      if(!inquiryTargets[i])return;
      a.href=inquiryTargets[i][0];
      a.textContent=inquiryTargets[i][1];
    });

    var books=Array.prototype.slice.call(document.querySelectorAll(".canon__book"));
    var topics=["Ummah","OIC","governance"];
    books.forEach(function(book,i){
      if(!topics[i])return;
      var links=book.querySelector(".canon__links");
      if(!links)return;
      var related=links.querySelector('a[href="/writing"]');
      if(!related&&i===2){
        related=document.createElement("a");
        related.textContent="Related writing";
        links.appendChild(related);
      }
      if(related)related.href="/writing?q="+encodeURIComponent(topics[i]);
    });
  }

  function initExploreGuidance(){
    if(!onPath("/explore","/explore.html","/learn"))return;

    var paths=Array.prototype.slice.call(document.querySelectorAll(".learning-path"));
    var ids=["path-dignity","path-dialogue","path-institutions","path-history"];
    paths.forEach(function(path,i){if(ids[i])path.id=ids[i]});

    var routeLabels=[
      "Orientation · about 10–15 min",
      "Focused study · about 30–60 min",
      "Seminar / teaching · about 60–90 min"
    ];
    Array.prototype.forEach.call(document.querySelectorAll(".learning-route .route-kicker"),function(kicker,i){
      if(routeLabels[i])kicker.textContent=routeLabels[i];
    });
  }

  function initWritingOrientation(){
    if(!onPath("/writing","/writing-v2.html","/writing.html"))return;
    var provenance=document.querySelector(".provenance--wide");
    if(!provenance||document.querySelector(".writing-learning-note"))return;
    var note=document.createElement("p");
    note.className="quiet-note writing-learning-note";
    note.innerHTML='New to this body of work? <a href="/explore#paths">Use a guided learning path</a> before browsing the full writing record.';
    provenance.insertAdjacentElement("afterend",note);
  }

  function initWritingSearch(){
    if(!onPath("/writing","/writing-v2.html","/writing.html"))return;
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

  initHomepageLearning();
  initExploreGuidance();
  initWritingOrientation();
  initWritingSearch();
})();