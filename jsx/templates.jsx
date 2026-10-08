/* Native editable social UI compositions. ES3, no external assets required. */
var CosminTemplates = (function () {
    var white=[1,1,1], black=[0.06,0.06,0.06], gray=[0.45,0.45,0.45];
    function transform(layer, name) { return layer.property('ADBE Transform Group').property(name); }
    function easeFor(value,influence) {
        var ease=[], len=value instanceof Array?value.length:1;
        for(var i=0;i<len;i++)ease.push(new KeyframeEase(0,influence));
        return ease;
    }
    function box(comp,name,x,y,w,h,color,radius,ellipse) {
        var l=comp.layers.addShape(); l.name=name;
        var contents=l.property('ADBE Root Vectors Group');
        var shape=contents.addProperty(ellipse?'ADBE Vector Shape - Ellipse':'ADBE Vector Shape - Rect');
        shape.property(ellipse?'ADBE Vector Ellipse Size':'ADBE Vector Rect Size').setValue([w,h]);
        if(!ellipse)shape.property('ADBE Vector Rect Roundness').setValue(radius||0);
        contents.addProperty('ADBE Vector Graphic - Fill').property('ADBE Vector Fill Color').setValue(color);
        transform(l,'ADBE Position').setValue([x,y]);return l;
    }
    function label(comp,name,text,x,y,size,color,maxWidth,center) {
        var l=comp.layers.addText(text); l.name=name;
        var p=l.property('ADBE Text Properties').property('ADBE Text Document'), d=p.value;
        d.font='ArialMT';d.fontSize=size;d.applyFill=true;d.fillColor=color;d.applyStroke=false;
        d.justification=ParagraphJustification.LEFT_JUSTIFY;p.setValue(d);
        var rect=l.sourceRectAtTime(0,false);
        if(rect.width>maxWidth){d.fontSize=size*maxWidth/rect.width;p.setValue(d);rect=l.sourceRectAtTime(0,false);}
        transform(l,'ADBE Anchor Point').setValue([rect.left+(center?rect.width/2:0),rect.top+rect.height/2]);
        transform(l,'ADBE Position').setValue([x,y]);return l;
    }
    function path(comp,name,points,x,y,color) {
        var l=comp.layers.addShape();l.name=name;
        var root=l.property('ADBE Root Vectors Group');
        var shape=new Shape();shape.vertices=points;shape.closed=true;
        var zeros=[];for(var i=0;i<points.length;i++)zeros.push([0,0]);
        shape.inTangents=zeros;shape.outTangents=zeros;
        root.addProperty('ADBE Vector Shape - Group').property('ADBE Vector Shape').setValue(shape);
        root.addProperty('ADBE Vector Graphic - Fill').property('ADBE Vector Fill Color').setValue(color);
        transform(l,'ADBE Position').setValue([x,y]);return l;
    }
    function avatar(comp,footage,x,y,size) {
        box(comp,'Avatar background',x,y,size,size,[0.9,0.91,0.92],0,true);
        if(!footage){
            box(comp,'Avatar head',x,y-size*.13,size*.29,size*.29,[0.62,0.65,0.69],0,true);
            box(comp,'Avatar shoulders',x,y+size*.2,size*.56,size*.33,[0.62,0.65,0.69],0,true);return;
        }
        var l=comp.layers.add(footage);l.name='REPLACE · Profile photo';
        var scale=Math.max(size/footage.width,size/footage.height)*100;
        transform(l,'ADBE Scale').setValue([scale,scale]);transform(l,'ADBE Position').setValue([x,y]);
        var radius=size/2*100/scale, cx=footage.width/2,cy=footage.height/2,k=radius*.5522848;
        var s=new Shape();s.closed=true;s.vertices=[[cx,cy-radius],[cx+radius,cy],[cx,cy+radius],[cx-radius,cy]];
        s.inTangents=[[-k,0],[0,-k],[k,0],[0,k]];s.outTangents=[[k,0],[0,k],[-k,0],[0,-k]];
        l.property('ADBE Mask Parade').addProperty('ADBE Mask Atom').property('ADBE Mask Shape').setValue(s);
    }
    function button(comp,text,x,y,w,color,textColor) {
        box(comp,text+' button',x,y,w,66,color,12);
        label(comp,text+' label',text,x,y,25,textColor,w-24,true);
    }
    function fadePop(layer,seconds) {
        var s=transform(layer,'ADBE Scale'),o=transform(layer,'ADBE Opacity');
        s.setValueAtTime(0,[82,82]);s.setValueAtTime(.18,[108,108]);s.setValueAtTime(.32,[100,100]);
        o.setValueAtTime(0,0);o.setValueAtTime(.18,100);o.setValueAtTime(seconds-.18,100);o.setValueAtTime(seconds,0);
        for(var i=1;i<=s.numKeys;i++)s.setTemporalEaseAtKey(i,easeFor(s.keyValue(i),66),easeFor(s.keyValue(i),66));
    }
    function lineReveal(layer,seconds,width) {
        var sx=transform(layer,'ADBE Scale'),o=transform(layer,'ADBE Opacity');
        transform(layer,'ADBE Anchor Point').setValue([-width/2,0]);
        sx.setValueAtTime(0,[0,100]);sx.setValueAtTime(.34,[100,100]);sx.setValueAtTime(seconds-.18,[100,100]);sx.setValueAtTime(seconds,[0,100]);
        o.setValueAtTime(0,0);o.setValueAtTime(.08,100);o.setValueAtTime(seconds-.18,100);o.setValueAtTime(seconds,0);
        for(var i=1;i<=sx.numKeys;i++)sx.setTemporalEaseAtKey(i,easeFor(sx.keyValue(i),70),easeFor(sx.keyValue(i),70));
    }
    function metric(comp,value,title,x,y) {
        label(comp,title+' value',value,x,y,30,black,145,true);
        label(comp,title+' label',title,x,y+38,21,gray,145,true);
    }
    function build(comp,id,o,photo) {
        if(id==='youtube') {
            box(comp,'YouTube surface',500,120,980,200,black,32);
            avatar(comp,photo,94,120,104);
            label(comp,'EDIT · Channel',o.name,168,101,29,white,300,false);
            label(comp,'EDIT · Subscribers',o.followers+' subscribers',168,146,20,[.67,.67,.67],300,false);
            box(comp,'Like pill',547,120,110,62,[.17,.17,.17],31);
            path(comp,'Thumb up',[[0,16],[12,16],[21,0],[27,0],[27,17],[43,17],[39,40],[12,40],[12,21],[0,21]],525,99,white);
            box(comp,'Subscribe pill',739,120,212,66,white,33);
            var sub=label(comp,'Subscribe label','Subscribe',739,120,25,black,180,true);sub.outPoint=comp.duration*.48;
            var done=label(comp,'Subscribed label','Subscribed',739,120,24,black,180,true);done.inPoint=comp.duration*.48;
            box(comp,'Bell pill',908,120,66,66,[.17,.17,.17],33);
            path(comp,'Bell',[[6,30],[10,24],[10,12],[14,5],[20,2],[26,5],[30,12],[30,24],[34,30]],888,101,white);
            box(comp,'Bell clapper',908,137,9,7,white,0,true);
        } else if(id==='instagram') {
            box(comp,'Instagram profile surface',420,280,830,550,white,24);
            label(comp,'EDIT · Username',o.handle,55,48,30,black,660,false);
            label(comp,'Menu','···',775,48,32,black,45,true);
            // Multicolor story ring made from editable vector segments.
            var colors=[[.99,.72,.25],[.99,.32,.25],[.87,.12,.48],[.65,.16,.72],[.44,.24,.78]];
            for(var j=0;j<60;j++){
                var angle=j*Math.PI*2/60;
                box(comp,'Story ring '+j,135+77*Math.cos(angle),167+77*Math.sin(angle),11,11,colors[Math.floor(j/12)],0,true);
            }
            avatar(comp,photo,135,167,136);
            metric(comp,o.posts,'posts',320,145);metric(comp,o.followers,'followers',505,145);metric(comp,o.following,'following',697,145);
            label(comp,'EDIT · Display name',o.name,55,282,27,black,730,false);
            label(comp,'EDIT · Bio',o.bio,55,327,24,black,730,false);
            button(comp,'Follow',229,402,348,[.0,.58,.96],white);
            button(comp,'Message',605,402,348,[.92,.92,.92],black);
            box(comp,'Divider',420,465,830,2,[.9,.9,.9],0);
            for(var row=0;row<3;row++)for(var col=0;col<3;col++)box(comp,'Grid icon',214+col*10,501+row*10,7,7,black,0);
            path(comp,'Reels play',[[0,0],[0,26],[22,13]],598,499,black);
        } else {
            box(comp,'TikTok profile surface',360,345,710,680,white,24);
            label(comp,'EDIT · Display name',o.name,360,49,29,black,510,true);
            label(comp,'Back','‹',42,49,43,black,35,true);label(comp,'Menu','···',672,49,32,black,45,true);
            avatar(comp,photo,360,161,132);
            label(comp,'EDIT · Handle','@'+o.handle.replace(/^@/,''),360,263,30,black,620,true);
            metric(comp,o.following,'Following',174,328);metric(comp,o.followers,'Followers',360,328);metric(comp,o.likes,'Likes',546,328);
            button(comp,'Follow',308,436,390,[1,.17,.33],white);
            button(comp,'⌄',555,436,80,[.94,.94,.94],black);
            label(comp,'EDIT · Bio',o.bio,360,513,24,black,620,true);
            box(comp,'Divider',360,568,710,2,[.91,.91,.91],0);
            for(var r=0;r<3;r++)for(var c=0;c<3;c++)box(comp,'Grid icon',230+c*10,610+r*10,7,7,black,0);
            path(comp,'Heart',[[0,8],[5,0],[13,0],[20,7],[27,0],[35,0],[40,8],[39,17],[20,35],[1,17]],455,605,[.6,.6,.6]);
        }
    }
    function insert(id,name,handle,bio,followers,following,posts,likes,seconds,photoPath) {
        var begun=false, created=false;
        try {
            if(id!=='youtube'&&id!=='instagram'&&id!=='tiktok')throw Error('Template necunoscut.');
            var target=app.project.activeItem;
            if(!(target instanceof CompItem))throw Error('Deschide compoziția în care vrei template-ul.');
            if(!isFinite(seconds)||seconds<2||seconds>30)throw Error('Durata trebuie să fie între 2 și 30 secunde.');
            var start=target.time;
            if(start<0||start+seconds>target.duration+.000001)throw Error('Nu este suficient timp după playhead. Redu durata template-ului.');
            var fields=[name,handle,bio,followers,following,posts,likes];
            for(var i=0;i<fields.length;i++)if(typeof fields[i]!=='string'||fields[i].length>120||/[\r\n]/.test(fields[i]))throw Error('Câmpurile trebuie să fie pe un rând, maximum 120 caractere.');
            if(!name.length||!handle.length)throw Error('Completează numele și username-ul.');
            var file=null;
            if(photoPath){file=new File(photoPath);if(!file.exists||!(/\.(png|jpe?g)$/i).test(photoPath))throw Error('Alege o fotografie PNG sau JPG existentă.');}
            app.beginUndoGroup('COSMIN MOTION · '+id+' template');begun=true;
            var folder=app.project.items.addFolder('CM · '+id+' · '+name);created=true;
            var photo=null;
            if(file){photo=app.project.importFile(new ImportOptions(file));photo.parentFolder=folder;}
            var w=id==='youtube'?1000:id==='instagram'?840:720,h=id==='youtube'?240:id==='instagram'?560:690;
            var comp=app.project.items.addComp('CM · '+id+' · '+name,w,h,1,seconds,target.frameRate);comp.parentFolder=folder;
            build(comp,id,{name:name,handle:handle,bio:bio,followers:followers,following:following,posts:posts,likes:likes},photo);
            var layer=target.layers.add(comp);layer.startTime=start;layer.inPoint=start;layer.outPoint=start+seconds;
            var scale=Math.min(target.width*.86/w,target.height*.65/h,1)*100;
            transform(layer,'ADBE Scale').setValue([scale,scale]);
            var pos=[target.width/2,target.height*.65],p=transform(layer,'ADBE Position'),o=transform(layer,'ADBE Opacity');
            var ramp=Math.min(.3,seconds/5),times=[start,start+ramp,start+seconds-ramp,start+seconds-target.frameDuration];
            for(i=0;i<4;i++){
                p.setValueAtTime(times[i],[pos[0],pos[1]+((i===0||i===3)?50:0)]);
                o.setValueAtTime(times[i],(i===0||i===3)?0:100);
                p.setTemporalEaseAtKey(i+1,easeFor(p.keyValue(i+1),66),easeFor(p.keyValue(i+1),66));
            }
            layer.motionBlur=true;target.motionBlur=true;
            return 'OK|Template inserat. Dublu click pe precomp pentru texte, forme și fotografie editabile.';
        } catch(e){return 'ERR|'+e.message+(created?' Aplicare parțială: folosește Undo.':'');}
        finally{if(begun)app.endUndoGroup();}
    }
    function buildElement(comp,id,text,seconds) {
        var main;
        if(id==='tiktok-like') {
            main=box(comp,'TikTok like circle',90,90,128,128,[.08,.08,.09],0,true);
            path(comp,'Heart icon',[[0,13],[10,0],[27,0],[39,13],[51,0],[68,0],[78,13],[76,31],[39,68],[2,31]],51,55,[1,.17,.33]);
            label(comp,'EDIT · Like count',text,90,172,25,white,150,true);
            fadePop(main,seconds);
        } else if(id==='tiktok-follow') {
            main=box(comp,'TikTok follow pill',220,70,380,88,[1,.17,.33],44);
            label(comp,'EDIT · Follow text',text,220,70,34,white,320,true);
            box(comp,'Plus circle',58,70,52,52,white,0,true);
            label(comp,'Plus','+',58,68,35,[1,.17,.33],45,true);
            fadePop(main,seconds);
        } else if(id==='comment-box') {
            main=box(comp,'Comment bubble',310,82,600,116,white,28);
            box(comp,'Avatar',72,82,64,64,[.08,.08,.09],0,true);
            label(comp,'EDIT · Comment',text,130,82,30,black,430,false);
            fadePop(main,seconds);
        } else if(id==='highlight') {
            main=box(comp,'Highlight bar',300,82,560,72,[1,.93,.18],12);
            label(comp,'EDIT · Highlight text',text,300,82,34,black,500,true);
            fadePop(main,seconds);
        } else if(id==='underline') {
            label(comp,'EDIT · Underline text',text,300,64,36,white,540,true);
            lineReveal(box(comp,'Animated underline',300,105,520,10,[1,.93,.18],5),seconds,520);
        } else throw Error('Element necunoscut.');
    }
    function insertElement(id,text,seconds) {
        var begun=false, created=false;
        try {
            if(id!=='tiktok-like'&&id!=='tiktok-follow'&&id!=='comment-box'&&id!=='highlight'&&id!=='underline')throw Error('Element necunoscut.');
            if(!isFinite(seconds)||seconds<2||seconds>30)throw Error('Durata trebuie să fie între 2 și 30 secunde.');
            if(typeof text!=='string'||!text.length||text.length>80||/[\r\n]/.test(text))throw Error('Textul trebuie să fie pe un rând, maximum 80 caractere.');
            var target=app.project.activeItem;
            if(!(target instanceof CompItem))throw Error('Deschide compoziția în care vrei elementul.');
            var start=target.time;
            if(start<0||start+seconds>target.duration+.000001)throw Error('Nu este suficient timp după playhead. Redu durata elementului.');
            app.beginUndoGroup('COSMIN MOTION · '+id+' element');begun=true;
            var folder=app.project.items.addFolder('CM · element · '+id);created=true;
            var comp=app.project.items.addComp('CM · '+id,640,220,1,seconds,target.frameRate);comp.parentFolder=folder;
            buildElement(comp,id,text,seconds);
            var layer=target.layers.add(comp);layer.startTime=start;layer.inPoint=start;layer.outPoint=start+seconds;
            var scale=Math.min(target.width*.7/640,target.height*.22/220,1)*100;
            transform(layer,'ADBE Scale').setValue([scale,scale]);
            transform(layer,'ADBE Position').setValue([target.width/2,target.height*.72]);
            layer.motionBlur=true;target.motionBlur=true;
            return 'OK|Element inserat: '+id+' · precomp editabil · Undo disponibil.';
        } catch(e){return 'ERR|'+e.message+(created?' Aplicare parțială: folosește Undo.':'');}
        finally{if(begun)app.endUndoGroup();}
    }
    function choosePhoto(){var file=File.openDialog('Alege fotografia de profil','Imagini:*.png;*.jpg;*.jpeg',false);return file?file.fsName:'';}
    return {insert:insert,insertElement:insertElement,choosePhoto:choosePhoto};
}());
