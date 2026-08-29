/* Civilizational Unity — lightweight learning and reflection affordances */
(function(){
  "use strict";

  var reflectionPrompts=[
    {
      id:"dignity",
      label:"Dignity",
      question:"Whose humanity becomes hardest for me to see when I am afraid, angry or certain?"
    },
    {
      id:"encounter",
      label:"Encounter & cooperation",
      question:"Where am I treating difference as evidence that conflict is inevitable?"
    },
    {
      id:"governance",
      label:"Governance",
      question:"What institution do I help shape — and whose dignity does its design make easiest to overlook?"
    },
    {
      id:"history",
      label:"Historical vantage point",
      question:"Whose agency disappears when I tell this story from only one vantage point?"
    }
  ];

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

  function copyText(text,done){
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){done(true)},function(){done(false)});
      return;
    }
    try{
      var area=document.createElement("textarea");
      area.value=text;
      area.setAttribute("readonly","");
      area.style.position="fixed";
      area.style.opacity="0";
      document.body.appendChild(area);
      area.select();
      var ok=document.execCommand("copy");
      document.body.removeChild(area);
      done(!!ok);
    }catch(e){done(false)}
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

  function initHomepageReflection(){
    if(!onPath("/","/index.html"))return;
    var closing=document.querySelector(".closing-gateway");
    if(!closing||document.querySelector(".human-stakes-home"))return;

    var section=document.createElement("section");
    section.className="band human-stakes-home";
    section.setAttribute("aria-labelledby","carry-question-title");
    section.innerHTML='\
      <div class="shell human-stakes-home__grid">\
        <div>\
          <p class="eyebrow">Before you leave</p>\
          <h2 id="carry-question-title">Carry one question beyond the site.</h2>\
          <p class="lede">A body of scholarship becomes more useful when it sharpens the questions we carry back into public life, institutions and our encounters with other people.</p>\
        </div>\
        <div class="carry-question">\
          <p class="carry-question__label" id="carryQuestionLabel"></p>\
          <p class="carry-question__text" id="carryQuestionText" aria-live="polite"></p>\
          <div class="carry-question__actions">\
            <button class="btn btn--quiet" id="carryQuestionNext" type="button">Another question</button>\
            <a class="btn btn--go" href="/explore#reflection">Reflect privately</a>\
          </div>\
          <p class="editorial-note">These are Civilizational Unity editorial reflection prompts inspired by recurring questions in the published work, not quotations or prescriptions attributed to Professor al-Ahsan.</p>\
        </div>\
      </div>';
    closing.parentNode.insertBefore(section,closing);

    var index=0;
    var label=document.getElementById("carryQuestionLabel");
    var text=document.getElementById("carryQuestionText");
    var next=document.getElementById("carryQuestionNext");
    function render(){
      var prompt=reflectionPrompts[index];
      label.textContent=prompt.label;
      text.textContent=prompt.question;
    }
    next.addEventListener("click",function(){index=(index+1)%reflectionPrompts.length;render()});
    render();
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

  function initExploreReflection(){
    if(!onPath("/explore","/explore.html","/learn"))return;
    var chronology=document.getElementById("chronology");
    if(!chronology||document.getElementById("reflection"))return;

    var options=reflectionPrompts.map(function(prompt){
      return '<option value="'+prompt.id+'">'+prompt.label+'</option>';
    }).join("");
    var cards=reflectionPrompts.map(function(prompt,i){
      return '<article class="reflection-prompt"><p class="reflection-prompt__n">0'+(i+1)+'</p><p class="reflection-prompt__label">'+prompt.label+'</p><h3>'+prompt.question+'</h3></article>';
    }).join("");

    var section=document.createElement("section");
    section.className="band band--rule shell human-reflection";
    section.id="reflection";
    section.setAttribute("aria-labelledby","reflection-title");
    section.innerHTML='\
      <div class="reflection-intro">\
        <p class="eyebrow">From reading to reflection</p>\
        <h2 id="reflection-title">What changes when dignity becomes a way of seeing?</h2>\
        <p class="lede">The point here is not to turn scholarship into slogans. It is to let serious ideas improve the quality of attention we bring to people, institutions, conflict and history.</p>\
        <p class="editorial-note">The questions below are Civilizational Unity editorial prompts inspired by recurring themes in Professor al-Ahsan’s published work. They are not quotations, doctrine or claims about his personal prescriptions.</p>\
      </div>\
      <div class="reflection-grid">'+cards+'</div>\
      <div class="reflection-notebook" aria-labelledby="reflection-notebook-title">\
        <div class="reflection-notebook__head">\
          <p class="eyebrow">Private notebook</p>\
          <h3 id="reflection-notebook-title">Write one thought worth carrying forward.</h3>\
          <p>No account or submission is required. This is simply a quiet place to make the reading your own.</p>\
        </div>\
        <div class="reflection-notebook__fields">\
          <label for="reflectionPrompt">Choose a question<select id="reflectionPrompt">'+options+'</select></label>\
          <label for="reflectionNote">Your reflection<textarea id="reflectionNote" rows="7" maxlength="1500" placeholder="What do you notice now that you did not notice before?"></textarea></label>\
        </div>\
        <p class="reflection-privacy"><strong>Private by design:</strong> this notebook does not transmit your text. Saving uses this browser’s local storage only.</p>\
        <div class="btnrow reflection-notebook__actions">\
          <button class="btn btn--go" id="reflectionSave" type="button">Save on this device</button>\
          <button class="btn btn--quiet" id="reflectionCopy" type="button">Copy reflection</button>\
          <button class="btn btn--quiet" id="reflectionClear" type="button">Clear</button>\
        </div>\
        <p class="reflection-status" id="reflectionStatus" aria-live="polite"></p>\
      </div>';
    chronology.parentNode.insertBefore(section,chronology);

    var select=document.getElementById("reflectionPrompt");
    var note=document.getElementById("reflectionNote");
    var save=document.getElementById("reflectionSave");
    var copy=document.getElementById("reflectionCopy");
    var clear=document.getElementById("reflectionClear");
    var status=document.getElementById("reflectionStatus");
    var prefix="civilizationalUnityReflection:";

    function promptFor(id){
      for(var i=0;i<reflectionPrompts.length;i++)if(reflectionPrompts[i].id===id)return reflectionPrompts[i];
      return reflectionPrompts[0];
    }
    function key(){return prefix+select.value}
    function load(){
      status.textContent="";
      try{note.value=window.localStorage.getItem(key())||""}
      catch(e){note.value="";status.textContent="Saving is unavailable in this browser; you can still write and copy your reflection."}
    }
    function saveLocal(){
      try{
        window.localStorage.setItem(key(),note.value);
        status.textContent="Saved on this device.";
      }catch(e){status.textContent="This browser did not allow local saving. You can still copy your reflection."}
    }
    function clearLocal(){
      try{window.localStorage.removeItem(key())}catch(e){}
      note.value="";
      status.textContent="Cleared from this device.";
      note.focus();
    }
    function copyReflection(){
      var prompt=promptFor(select.value);
      var value=note.value.trim();
      if(!value){status.textContent="Write a reflection first, then copy it.";note.focus();return}
      copyText(prompt.label+"\n"+prompt.question+"\n\n"+value,function(ok){
        status.textContent=ok?"Reflection copied.":"Copying was blocked by this browser. Select the text and copy it manually.";
      });
    }

    select.addEventListener("change",load);
    save.addEventListener("click",saveLocal);
    copy.addEventListener("click",copyReflection);
    clear.addEventListener("click",clearLocal);
    load();
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
  initHomepageReflection();
  initExploreGuidance();
  initExploreReflection();
  initWritingOrientation();
  initWritingSearch();
})();
