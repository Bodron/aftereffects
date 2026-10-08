(function () {
  'use strict';
  var presets = [
    ['apple-focus','Soft Focus','Text Animation','applefocus','FOCUS','Tot titlul: blur 18 → 0, deplasare fină și scară 104% → 100%. Recomandat 36 frames.'],
    ['apple-rise','Word Rise','Text Animation','applerise','WORDS','Cuvinte care urcă cu blur subtil, decalaj scurt și oprire lină.'],
    ['apple-hero','Hero Scale','Text Animation','applehero','HERO','Titlu care crește discret de la 88%, cu fade și focus.'],
    ['apple-tracking','Tracking Resolve','Text Animation','appletracking','TYPE','Spațiere largă care se strânge odată cu focalizarea întregului titlu.'],
    ['apple-cascade','Character Cascade','Text Animation','applerise','TYPE','Cascadă compactă pe litere: ridicare 26 px și blur 10 → 0.'],
    ['apple-exit','Focus Exit','Text Animation','appleexit','EXIT','Tot titlul se ridică, se defocalizează și dispare de la playhead.'],
    ['modern-punch','Word Punch','Text Animation','pop','WORD','Cuvinte cu punch de scară, overshoot și două reveniri. Recomandat 30–45 frames.'],
    ['modern-elastic','Elastic Letters','Text Animation','pop','ABC','Litere elastice cu trei oscilații amortizate și decalaj individual.'],
    ['modern-bounce','Bounce Up','Text Animation','up','ABC','Litere care urcă, depășesc poziția finală și ricoșează amortizat.'],
    ['modern-whip','Whip Stagger','Text Animation','slide','ABC','Intrare laterală rapidă, rotație și revenire, decalată pe litere.'],
    ['modern-stretch','Stretch Snap','Text Animation','pop','ABC','Litere comprimate pe X și alungite pe Y, cu revenire elastică.'],
    ['modern-spin','Spin Settle','Text Animation','spin','ABC','Rotație de 150°, ridicare și reveniri amortizate pe litere.'],
    ['modern-blur','Blur Slam','Text Animation','unblur','WORD','Cuvinte supradimensionate și blurate care se așază cu overshoot.'],
    ['modern-flicker','Flicker Decode','Text Animation','fade','ABC','Litere cu aprinderi și stingeri discrete, decalate. Nu înlocuiește caracterele.'],
    ['modern-roll','Slot Roll','Text Animation','slotroll','ABC','Litere care rulează vertical ca un slot-machine, cu blur și oprire elastică.'],
    ['modern-glitch','Glitch Pop','Text Animation','glitchpop','GLITCH','Aprinderi sacadate cu micro-deplasare laterală și blur scurt.'],
    ['modern-push','Word Push','Text Animation','wordpush','PUSH','Cuvinte împinse spre cameră: scale 70% → 100% cu overshoot curat.'],
    ['modern-slam','Type Slam','Text Animation','typeslam','SLAM','Litere mari, blurate, care lovesc poziția finală rapid și se stabilizează.'],
    ['modern-wipe','Clean Wipe','Text Animation','cleanwipe','WIPE','Reveal curat de la stânga la dreapta cu tracking subtil și fade.'],
    ['swipe-left','Swipe Left','Animate','slide','↤','Intrare din dreapta: Position +500 px → poziția curentă, cu fade in.'],
    ['slide-up','Slide Up','Animate','up','↑','Intrare de jos: Position +300 px → poziția curentă, cu fade in.'],
    ['pop-in','Pop In','Animate','pop','✦','Scale de la zero, overshoot și revenire la dimensiunea curentă.'],
    ['zoom-in','Zoom In','Animate','zoom','↗','Scale 70% → dimensiunea curentă, cu fade in.'],
    ['zoom-out','Zoom Out','Animate','out','↙','Scale 130% → dimensiunea curentă, cu fade in.'],
    ['spin-in','Spin In','Animate','spin','⟳','Rotation −90° → rotația curentă, cu fade in.'],
    ['punch-in','Punch In','Camera','zoom','↗','Mărește layerul până la 120% din scala curentă.'],
    ['punch-out','Punch Out','Camera','out','↙','Micșorează layerul până la 80% din scala curentă.'],
    ['shake','Shake','Camera','shake','≈','Shake orizontal amortizat; revine la poziția inițială.'],
    ['text-pop','Text Pop','Text Animation','pop','T','Pop In aplicat întregului layer text selectat.'],
    ['text-up','Text Slide Up','Text Animation','up','T↑','Slide Up aplicat întregului layer text selectat.'],
    ['text-typewriter','Typewriter','Text Animation','typing','TYPE','Apariție literă cu literă. Ritm constant; intensitatea nu se aplică.'],
    ['text-words','Word Reveal','Text Animation','typing','WORD','Apariție cuvânt cu cuvânt, în interiorul aceluiași layer. Intensitatea nu se aplică.'],
    ['text-lines','Line Reveal','Text Animation','typing','LINE','Apariție rând cu rând. Folosește text cu mai multe rânduri. Intensitatea nu se aplică.'],
    ['text-letters-up','Letters Up','Text Animation','up','ABC','Literele urcă pe rând cu fade in. Intensitatea controlează distanța.'],
    ['text-letters-down','Letters Down','Text Animation','down','ABC','Literele coboară pe rând cu fade in. Intensitatea controlează distanța.'],
    ['text-letters-left','Letters Left','Text Animation','slide','ABC','Literele intră din dreapta cu fade in. Intensitatea controlează distanța.'],
    ['text-letters-right','Letters Right','Text Animation','right','ABC','Literele intră din stânga cu fade in. Intensitatea controlează distanța.'],
    ['text-word-up','Word Slide Up','Text Animation','up','WORD','Cuvintele urcă pe rând în același layer. Intensitatea controlează distanța.'],
    ['text-letter-scale','Letter Scale','Text Animation','zoom','ABC','Literele cresc pe rând de la zero. Intensitatea nu se aplică.'],
    ['text-letter-spin','Letter Spin','Text Animation','spin','ABC','Literele se rotesc pe rând cu fade in. Intensitatea controlează unghiul.'],
    ['text-blur','Blur Reveal','Text Animation','unblur','ABC','Literele devin clare pe rând, cu fade in. Intensitatea controlează blur-ul.'],
    ['text-tracking','Tracking In','Text Animation','tracking','ABC','Spațierea largă revine la normal cu fade in pe tot textul.'],
    ['text-fade-in','Fade In','Text Animation','fade','TEXT','Tot textul apare lin. Intensitatea nu se aplică.'],
    ['text-fade-out','Fade Out','Text Animation','fadeout','TEXT','Tot textul dispare de la playhead. Intensitatea nu se aplică.'],
    ['text-slide-out','Slide Out','Text Animation','exitup','TEXT','Tot textul urcă și dispare de la playhead.'],
    ['text-scale-out','Scale Out','Text Animation','shrink','TEXT','Literele se micșorează simultan și dispar. Intensitatea nu se aplică.']
  ];
  var selected = presets[0], category = 'Text Animation', busy = false;
  var $ = function (id) { return document.getElementById(id); };
  var bridge = window.__adobe_cep__ ? new CSInterface() : null;
  function status(message, error) { $('status').textContent = message; $('status').className = error ? 'error' : ''; }
  function render() {
    $('categories').innerHTML = ''; $('presets').innerHTML = '';
    ['Text Animation','All','Animate','Camera','Layout','Templates'].forEach(function (name) {
      var button = document.createElement('button'); button.textContent = name;
      button.className = category === name ? 'active' : ''; button.setAttribute('aria-pressed', category === name);
      button.onclick = function () { category = name; render(); }; $('categories').appendChild(button);
    });
    var templates = category === 'Templates', layout = category === 'Layout';
    $('templates').hidden = !templates;
    $('layout-tools').hidden = !layout;
    ['presets','search','animation-settings','apply'].forEach(function(id){$(id).hidden=templates||layout;});
    if(templates){$('count').textContent='8 TEMPLATES';return;}
    if(layout){$('count').textContent='1 TOOL';return;}
    var query = $('search').value.toLowerCase().trim();
    var visible = presets.filter(function (p) { return (category === 'All' || p[2] === category) && (p[1] + ' ' + p[5]).toLowerCase().indexOf(query) !== -1; });
    $('count').textContent = visible.length + ' PRESETS';
    visible.forEach(function (p) {
      var button = document.createElement('button'); button.className = 'preset' + (selected[0] === p[0] ? ' selected' : '');
      button.setAttribute('aria-pressed', selected[0] === p[0]); button.style.setProperty('--animation', p[3]);
      button.innerHTML = '<span class="preview" aria-hidden="true"><span class="shape"></span></span><span class="preset-name"></span>';
      button.querySelector('.shape').textContent = p[4]; button.querySelector('.preset-name').textContent = p[1];
      if(p[0].indexOf('modern-') === 0){
        button.className+=' modern-preset '+p[0];
        var shape=button.querySelector('.shape');shape.textContent='';
        ['M','O','V','E'].forEach(function(letter,i){var span=document.createElement('span');span.textContent=letter;span.style.animationDelay=(i*.08)+'s';shape.appendChild(span);});
      }
      if(p[0].indexOf('apple-') === 0)button.className+=' apple-preset';
      if (p[0].indexOf('text-') === 0) button.className += ' text-preset';
      button.onclick = function () { selected = p; render(); }; $('presets').appendChild(button);
    });
    $('preset-title').textContent = selected[1]; $('description').textContent = selected[5];
  }
  $('intensity').oninput = function () { $('intensity-value').textContent = this.value + '%'; };
  $('search').oninput = render;
  $('apply').onclick = function () {
    if (!bridge || busy) return;
    var frames = Number($('duration').value), intensity = Number($('intensity').value);
    if (!Number.isFinite(frames) || frames % 1 || frames < 1 || frames > 300) return status('Durata trebuie să fie un număr întreg între 1 și 300 frames.', true);
    busy = true; $('apply').disabled = true; status('Aplic animația…');
    var code = 'CosminMotion.apply(' + JSON.stringify(selected[0]) + ',' + frames + ',' + intensity + ',' + $('easy-ease').checked + ',' + $('motion-blur').checked + ')';
    bridge.evalScript(code, function (result) {
      busy = false; $('apply').disabled = false;
      if (!result || result.indexOf('OK|') !== 0) status((result || 'After Effects nu a răspuns.').replace(/^ERR\|/, ''), true);
      else status(result.slice(3));
    });
  };
  $('align-text-stack').onclick = function () {
    if (!bridge || busy) return;
    var spacing = Number($('layout-spacing').value);
    if (!Number.isFinite(spacing) || spacing < 0 || spacing > 500) return status('Spacing trebuie să fie între 0 și 500 px.', true);
    busy = true; $('align-text-stack').disabled = true; status('Aliniez textele…');
    var code = 'CosminMotion.alignTextStack(' + spacing + ',' + $('layout-center-x').checked + ',' + $('layout-keep-order').checked + ')';
    bridge.evalScript(code, function (result) {
      busy = false; $('align-text-stack').disabled = false;
      if (!result || result.indexOf('OK|') !== 0) status((result || 'After Effects nu a răspuns.').replace(/^ERR\|/, ''), true);
      else status(result.slice(3));
    });
  };
  $('arrange-sentence').onclick = function () {
    if (!bridge || busy) return;
    var spacing = Number($('layout-spacing').value);
    var maxWidth = Number($('layout-max-width').value);
    if (!Number.isFinite(spacing) || spacing < 0 || spacing > 500) return status('Spacing trebuie să fie între 0 și 500 px.', true);
    if (!Number.isFinite(maxWidth) || maxWidth < 20 || maxWidth > 100) return status('Max Width trebuie să fie între 20% și 100%.', true);
    busy = true; $('arrange-sentence').disabled = true; status('Aranjez propoziția…');
    var code = 'CosminMotion.arrangeSentence(' + spacing + ',' + $('layout-center-x').checked + ',' + $('layout-keep-order').checked + ',' + maxWidth + ')';
    bridge.evalScript(code, function (result) {
      busy = false; $('arrange-sentence').disabled = false;
      if (!result || result.indexOf('OK|') !== 0) status((result || 'After Effects nu a răspuns.').replace(/^ERR\|/, ''), true);
      else status(result.slice(3));
    });
  };
  render();
  $('connection').textContent = bridge ? 'After Effects · CEP' : 'Browser preview · fără conexiune AE';
  $('apply').disabled = !bridge;
  if (!bridge) status('Preview UI. Deschide extensia în After Effects pentru a aplica keyframe-uri.');
  var photoPath='';
  function templateCall(expression, callback) {
    var extensionPath=bridge.getSystemPath(SystemPath.EXTENSION).replace(/\\/g,'/');
    var code='$.evalFile(new File('+JSON.stringify(extensionPath+'/jsx/templates.jsx')+'));'+expression;
    bridge.evalScript(code,callback);
  }
  $('choose-photo').disabled=!bridge; $('insert-template').disabled=!bridge; $('align-text-stack').disabled=!bridge; $('arrange-sentence').disabled=!bridge;
  $('choose-photo').onclick=function(){if(busy)return;templateCall('CosminTemplates.choosePhoto()',function(result){
    if(result&&result!=='EvalScript error.'){photoPath=result;$('photo-name').textContent=result.split(/[\\/]/).pop();}
  });};
  $('clear-photo').onclick=function(){photoPath='';$('photo-name').textContent='Avatar implicit';};
  $('insert-template').onclick=function(){
    if(!bridge||busy)return;
    var seconds=Number($('social-seconds').value);
    if(!isFinite(seconds)||seconds<2||seconds>30)return status('Alege o durată între 2 și 30 secunde.',true);
    var args=[$('template-kind').value];
    ['name','handle','bio','followers','following','posts','likes'].forEach(function(key){args.push($('social-'+key).value.trim());});
    args.push(seconds,photoPath);busy=true;$('insert-template').disabled=true;status('Construiesc template-ul…');
    templateCall('CosminTemplates.insert('+args.map(function(value){return JSON.stringify(value);}).join(',')+')',function(result){
      busy=false;$('insert-template').disabled=false;status((result||'After Effects nu a răspuns.').replace(/^(OK|ERR)\|/,''),!result||result.indexOf('OK|')!==0);
    });
  };
  $('insert-element').onclick=function(){
    if(!bridge||busy)return;
    var seconds=Number($('social-seconds').value), text=$('element-text').value.trim();
    if(!isFinite(seconds)||seconds<2||seconds>30)return status('Alege o durată între 2 și 30 secunde.',true);
    if(!text.length||text.length>80)return status('Textul elementului trebuie să aibă 1-80 caractere.',true);
    busy=true;$('insert-element').disabled=true;status('Construiesc elementul…');
    templateCall('CosminTemplates.insertElement('+[$('element-kind').value,text,seconds].map(function(value){return JSON.stringify(value);}).join(',')+')',function(result){
      busy=false;$('insert-element').disabled=false;status((result||'After Effects nu a răspuns.').replace(/^(OK|ERR)\|/,''),!result||result.indexOf('OK|')!==0);
    });
  };
  function socialPreview(){
    var kind=$('template-kind').value, preview=$('social-preview');
    preview.className=kind;
    preview.innerHTML='<div class="social-top"></div><div class="social-avatar">●</div><strong class="social-display"></strong><span class="social-username"></span><div class="social-stats"></div><div class="social-bio"></div><div class="social-cta"></div>';
    preview.querySelector('.social-top').textContent=kind==='instagram'?$('social-handle').value:kind==='tiktok'?'TikTok':'YouTube';
    preview.querySelector('.social-display').textContent=$('social-name').value;
    preview.querySelector('.social-username').textContent='@'+$('social-handle').value.replace(/^@/,'');
    preview.querySelector('.social-stats').textContent=kind==='youtube'?$('social-followers').value+' subscribers':$('social-followers').value+' followers · '+$('social-following').value+' following';
    preview.querySelector('.social-bio').textContent=$('social-bio').value;
    preview.querySelector('.social-cta').textContent=kind==='youtube'?'Subscribe':kind==='instagram'?'Follow     |     Message':'Follow';
  }
  var elements=[['tiktok-like','TikTok Like','quick-like','♥','Buton like vertical cu inimă și count editabil.'],['tiktok-follow','TikTok Follow','quick-follow','+','Pill roșu de follow cu plus și text editabil.'],['comment-box','Comment Box','quick-comment','Aa','Textbox alb pentru comentarii/callout.'],['highlight','Highlight','quick-highlight','Aa','Highlight galben în spatele textului.'],['underline','Underline','quick-underline','Aa','Text cu underline animat pe X.']];
  function renderElements(){
    var selected=$('element-kind').value;$('element-presets').innerHTML='';
    elements.forEach(function(e){
      var button=document.createElement('button');button.className='preset quick-preset '+e[2]+(selected===e[0]?' selected':'');
      button.setAttribute('aria-pressed',selected===e[0]);button.innerHTML='<span class="preview" aria-hidden="true"><span class="quick-shape"></span></span><span class="preset-name"></span>';
      button.querySelector('.quick-shape').textContent=e[3];button.querySelector('.preset-name').textContent=e[1];button.title=e[4];
      button.onclick=function(){$('element-kind').value=e[0];renderElements();};
      $('element-presets').appendChild(button);
    });
  }
  $('template-kind').onchange=socialPreview;
  $('element-kind').onchange=renderElements;
  Array.prototype.forEach.call(document.querySelectorAll('.template-fields input'),function(input){input.addEventListener('input',socialPreview);});
  socialPreview();renderElements();
}());
