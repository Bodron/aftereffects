/* ExtendScript / ES3. Public entry point used by the CEP panel. */
var CosminMotion = (function () {
    function fail(message) { throw new Error(message); }
    function copy(v) { return v instanceof Array ? v.slice(0) : v; }
    function scaled(v, factor) { var out = [], i; for (i = 0; i < v.length; i++) out[i] = v[i] * factor; return out; }
    function shifted(v, axis, distance) { var out = copy(v); out[axis] += distance; return out; }
    // Original text recipes, implemented with native AE Text Animators.
    var textRecipes = {
        'apple-focus': {name:'Soft Focus', modern:true, apple:true, whole:true, position:[0,22,0], scale:[104,104,100], blur:18, curve:[100,0]},
        'apple-rise': {name:'Word Rise', modern:true, apple:true, based:3, position:[0,48,0], blur:8, curve:[100,0]},
        'apple-hero': {name:'Hero Scale', modern:true, apple:true, whole:true, scale:[88,88,100], blur:5, curve:[100,0]},
        'apple-tracking': {name:'Tracking Resolve', modern:true, apple:true, whole:true, tracking:28, blur:8, curve:[100,0]},
        'apple-cascade': {name:'Character Cascade', modern:true, apple:true, position:[0,26,0], blur:10, curve:[100,0]},
        'apple-exit': {name:'Focus Exit', modern:true, apple:true, whole:true, out:true, position:[0,-22,0], scale:[104,104,100], blur:18, curve:[0,100]},
        'modern-punch': {name:'Word Punch', modern:true, based:3, scale:[0,0,100], curve:[100,-24,9,-3,0]},
        'modern-elastic': {name:'Elastic Letters', modern:true, scale:[0,0,100], curve:[100,-35,20,-10,4,0]},
        'modern-bounce': {name:'Bounce Up', modern:true, position:[0,140,0], curve:[100,-28,13,-5,0]},
        'modern-whip': {name:'Whip Stagger', modern:true, position:[220,0,0], rotation:18, curve:[100,-12,4,0]},
        'modern-stretch': {name:'Stretch Snap', modern:true, scale:[35,190,100], curve:[100,-30,12,-4,0]},
        'modern-spin': {name:'Spin Settle', modern:true, rotation:-150, position:[0,55,0], curve:[100,-20,8,-3,0]},
        'modern-blur': {name:'Blur Slam', modern:true, based:3, scale:[175,175,100], blur:35, curve:[100,-16,5,0]},
        'modern-flicker': {name:'Flicker Decode', modern:true, flicker:true, curve:[100,0,100,0,65,0]},
        'modern-roll': {name:'Slot Roll', modern:true, position:[0,-130,0], blur:22, rotation:16, curve:[100,-18,8,-3,0]},
        'modern-glitch': {name:'Glitch Pop', modern:true, position:[36,0,0], blur:14, flicker:true, curve:[100,0,80,0,35,0]},
        'modern-push': {name:'Word Push', modern:true, based:3, scale:[70,70,100], blur:6, curve:[100,-18,7,-2,0]},
        'modern-slam': {name:'Type Slam', modern:true, scale:[210,210,100], blur:38, curve:[100,-26,10,-4,0]},
        'modern-wipe': {name:'Clean Wipe', modern:true, whole:true, tracking:18, position:[18,0,0], blur:6, curve:[100,0]},
        'text-typewriter': {name:'Typewriter', based:1, hard:true},
        'text-words': {name:'Word Reveal', based:3, hard:true},
        'text-lines': {name:'Line Reveal', based:4, hard:true},
        'text-letters-up': {name:'Letters Up', position:[0,80,0]},
        'text-letters-down': {name:'Letters Down', position:[0,-80,0]},
        'text-letters-left': {name:'Letters Left', position:[100,0,0]},
        'text-letters-right': {name:'Letters Right', position:[-100,0,0]},
        'text-word-up': {name:'Word Slide Up', based:3, position:[0,80,0]},
        'text-letter-scale': {name:'Letter Scale', scale:[0,0,100]},
        'text-letter-spin': {name:'Letter Spin', rotation:-90},
        'text-blur': {name:'Blur Reveal', blur:30},
        'text-tracking': {name:'Tracking In', tracking:40, whole:true},
        'text-fade-in': {name:'Fade In', whole:true},
        'text-fade-out': {name:'Fade Out', whole:true, out:true},
        'text-slide-out': {name:'Slide Out', whole:true, out:true, position:[0,-100,0]},
        'text-scale-out': {name:'Scale Out', whole:true, out:true, scale:[0,0,100]}
    };
    function writeModern(layer,recipe,start,end,amount,ease) {
        var text=layer.property('ADBE Text Properties').property('ADBE Text Document').value.text;
        var count=recipe.whole?1:recipe.based===3?(text.match(/\S+/g)||[]).length:text.length;
        var group=layer.property('ADBE Text Properties').property('ADBE Text Animators');
        // 45% of the total duration is stagger, 55% is each unit's motion.
        var duration=end-start, stagger=recipe.apple ? 0.22 : 0.45;
        var motion=duration*(recipe.apple&&count===1?1:1-stagger), delay=count>1?duration*stagger/(count-1):0;
        for(var unit=0;unit<count;unit++) {
            for(var pass=0;pass<2;pass++) {
                var animator=group.addProperty('ADBE Text Animator');
                animator.name='CM · '+recipe.name+' · '+(unit+1)+(pass?' · Visibility':'');
                var index=animator.propertyIndex;
                function add(name,value){group.property(index).property('ADBE Text Animator Properties').addProperty(name).setValue(value);}
                if(pass || recipe.flicker)add('ADBE Text Opacity',0);
                if(!pass){
                    if(recipe.position)add('ADBE Text Position 3D',scaled(recipe.position,amount));
                    if(recipe.rotation)add('ADBE Text Rotation',recipe.rotation*amount);
                    if(recipe.scale)add('ADBE Text Scale 3D',recipe.scale);
                    if(recipe.blur)add('ADBE Text Blur',[recipe.blur*amount,recipe.blur*amount]);
                    if(recipe.tracking)add('ADBE Text Tracking Amount',recipe.tracking*amount);
                }
                var selector=group.property(index).property('ADBE Text Selectors').addProperty('ADBE Text Selector');
                var advanced=selector.property('ADBE Text Range Advanced');
                advanced.property('ADBE Text Range Units').setValue(2);
                advanced.property('ADBE Text Range Type2').setValue(recipe.based||1);
                advanced.property('ADBE Text Selector Smoothness').setValue(0);
                selector.property('ADBE Text Index Start').setValue(unit);
                selector.property('ADBE Text Index End').setValue(recipe.whole?text.length:unit+1);
                var prop=advanced.property('ADBE Text Selector Max Amount');
                var values=pass?(recipe.out?[0,100]:[100,0]):recipe.curve;
                var span=pass?motion*(recipe.apple?1:.22):motion;
                for(var k=0;k<values.length;k++){
                    var v=values[k];
                    // Intensity adjusts rebound, while keeping the initial/final scale intact.
                    if(!pass && v<0)v=Math.max(-95,v*amount);
                    prop.setValueAtTime(start+unit*delay+span*k/(values.length-1),v);
                    if(recipe.flicker&&!pass)prop.setInterpolationTypeAtKey(k+1,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);
                    else if(ease){
                        prop.setTemporalEaseAtKey(k+1,[new KeyframeEase(0,recipe.apple?80:55)],[new KeyframeEase(0,recipe.apple?28:55)]);
                        prop.setInterpolationTypeAtKey(k+1,KeyframeInterpolationType.BEZIER,KeyframeInterpolationType.BEZIER);
                    }else prop.setInterpolationTypeAtKey(k+1,KeyframeInterpolationType.LINEAR,KeyframeInterpolationType.LINEAR);
                }
            }
        }
        return count*(recipe.curve.length+2);
    }
    function writeTextAnimator(layer, recipe, start, end, amount, ease) {
        var animators = layer.property('ADBE Text Properties').property('ADBE Text Animators');
        var animator = animators.addProperty('ADBE Text Animator');
        animator.name = 'CM · ' + recipe.name;
        var index = animator.propertyIndex;
        // Reacquire indexed property groups after additions: AE invalidates old references.
        function add(matchName, value) {
            animators.property(index).property('ADBE Text Animator Properties').addProperty(matchName).setValue(value);
        }
        add('ADBE Text Opacity', 0);
        if (recipe.position) add('ADBE Text Position 3D', scaled(recipe.position, amount));
        if (recipe.scale) add('ADBE Text Scale 3D', recipe.scale);
        if (recipe.rotation) add('ADBE Text Rotation', recipe.rotation * amount);
        if (recipe.blur) add('ADBE Text Blur', [recipe.blur * amount, recipe.blur * amount]);
        if (recipe.tracking) add('ADBE Text Tracking Amount', recipe.tracking * amount);
        var selector = animators.property(index).property('ADBE Text Selectors').addProperty('ADBE Text Selector');
        var advanced = selector.property('ADBE Text Range Advanced');
        advanced.property('ADBE Text Range Type2').setValue(recipe.based || 1);
        advanced.property('ADBE Text Selector Smoothness').setValue(recipe.hard ? 0 : 100);
        var prop, first, last;
        if (recipe.whole) {
            prop = advanced.property('ADBE Text Selector Max Amount');
            first = recipe.out ? 0 : 100; last = recipe.out ? 100 : 0;
        } else {
            prop = selector.property('ADBE Text Percent Start'); first = 0; last = 100;
        }
        prop.setValueAtTime(start, first); prop.setValueAtTime(end, last);
        for (var k = 1; k <= 2; k++) {
            if (ease && !recipe.hard) {
                prop.setTemporalEaseAtKey(k, [new KeyframeEase(0,66.666)], [new KeyframeEase(0,66.666)]);
                prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
            } else prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.LINEAR);
        }
    }
    function planProperty(plans, prop, times, values, label) {
        if (!prop || !prop.canVaryOverTime) fail(label + ': proprietate indisponibilă.');
        if (prop.expressionEnabled) fail(label + ': dezactivează expresia înainte de aplicare.');
        for (var k = 1; k <= prop.numKeys; k++) {
            var t = prop.keyTime(k);
            if (t >= times[0] - 0.000001 && t <= times[times.length - 1] + 0.000001)
                fail(label + ': există deja keyframe-uri în interval. Mută playhead-ul sau elimină-le manual.');
        }
        plans.push({ prop: prop, times: times, values: values });
    }
    function positionPlan(plans, prop, times, values, label) {
        if (prop.dimensionsSeparated) {
            for (var d = 0; d < values[0].length; d++) {
                var channel = [], j;
                for (j = 0; j < values.length; j++) channel.push(values[j][d]);
                planProperty(plans, prop.getSeparationFollower(d), times, channel, label);
            }
        } else planProperty(plans, prop, times, values, label);
    }
    function getPosition(prop, t, dimensions) {
        if (!prop.dimensionsSeparated) return copy(prop.valueAtTime(t, false));
        var v = [], i;
        for (i = 0; i < dimensions; i++) v.push(prop.getSeparationFollower(i).valueAtTime(t, false));
        return v;
    }
    function setPosition(prop, t, value) {
        if (prop.dimensionsSeparated) {
            for (var d = 0; d < value.length; d++) prop.getSeparationFollower(d).setValueAtTime(t, value[d]);
        } else prop.setValueAtTime(t, value);
    }
    function collectTextLayout(comp) {
        var selected = comp.selectedLayers;
        if (!selected.length || selected.length < 2) fail('Selectează minimum două layere text.');
        var layers = [], i, layer, tr, p, pos, rect, anchor, scale, sx, sy, left, top, width, height;
        for (i = 0; i < selected.length; i++) {
            layer = selected[i];
            if (!(layer instanceof TextLayer)) fail(layer.name + ': selectează doar layere text.');
            if (layer.locked) fail(layer.name + ': layer blocat.');
            if (comp.time < layer.inPoint || comp.time >= layer.outPoint) fail(layer.name + ': layerul nu este vizibil la playhead.');
            tr = layer.property('ADBE Transform Group');
            p = tr.property('ADBE Position');
            if (!p || !p.canVaryOverTime) fail(layer.name + ': Position indisponibil.');
            if (p.expressionEnabled) fail(layer.name + ': dezactivează expresia de pe Position înainte de aliniere.');
            pos = getPosition(p, comp.time, layer.threeDLayer ? 3 : 2);
            rect = layer.sourceRectAtTime(comp.time, false);
            anchor = tr.property('ADBE Anchor Point').valueAtTime(comp.time, false);
            scale = tr.property('ADBE Scale').valueAtTime(comp.time, false);
            sx = scale[0] / 100; sy = scale[1] / 100;
            left = pos[0] + (rect.left - anchor[0]) * sx;
            top = pos[1] + (rect.top - anchor[1]) * sy;
            width = rect.width * sx; height = rect.height * sy;
            layers.push({layer:layer, prop:p, pos:pos, left:left, top:top, width:width, height:height, centerY:top+height/2, centerX:left+width/2, orderNumber:layer.name.match(/\d+/)});
        }
        return layers;
    }
    function arrangeSentence(spacing, centerX, keepOrder, maxWidthPercent) {
        var begun = false;
        try {
            if (!isFinite(spacing) || spacing < 0 || spacing > 500) fail('Spacing invalid.');
            if (!isFinite(maxWidthPercent) || maxWidthPercent < 20 || maxWidthPercent > 100) maxWidthPercent = 82;
            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) fail('Deschide o compoziție.');
            var layers = collectTextLayout(comp), i, j, minLeft = layers[0].left, blockCenterY = 0;
            if (keepOrder) layers.sort(function(a,b){
                if (a.orderNumber && b.orderNumber) return parseInt(a.orderNumber[0],10)-parseInt(b.orderNumber[0],10);
                return a.left-b.left;
            });
            for (i = 0; i < layers.length; i++) {
                blockCenterY += layers[i].centerY;
                if (layers[i].left < minLeft) minLeft = layers[i].left;
            }
            blockCenterY /= layers.length;
            var maxWidth = comp.width * maxWidthPercent / 100, rows = [], row = {items:[], width:0, height:0};
            for (i = 0; i < layers.length; i++) {
                var projected = row.items.length ? row.width + spacing + layers[i].width : layers[i].width;
                if (row.items.length && projected > maxWidth) { rows.push(row); row = {items:[], width:0, height:0}; projected = layers[i].width; }
                row.items.push(layers[i]); row.width = projected;
                if (layers[i].height > row.height) row.height = layers[i].height;
            }
            rows.push(row);
            var blockHeight = spacing * (rows.length - 1);
            for (i = 0; i < rows.length; i++) blockHeight += rows[i].height;
            var y = blockCenterY - blockHeight / 2;
            app.beginUndoGroup('COSMIN MOTION · Arrange Sentence'); begun = true;
            for (i = 0; i < rows.length; i++) {
                row = rows[i];
                var current = centerX ? comp.width / 2 - row.width / 2 : minLeft;
                var baseline = y + row.height / 2;
                for (j = 0; j < row.items.length; j++) {
                    var item = row.items[j], targetCenterX = current + item.width / 2;
                    var next = copy(item.pos);
                    next[0] += targetCenterX - item.centerX;
                    next[1] += baseline - item.centerY;
                    setPosition(item.prop, comp.time, next);
                    current += item.width + spacing;
                }
                y += row.height + spacing;
            }
            return 'OK|Propoziție aranjată: ' + layers.length + ' layere · ' + rows.length + ' rând(uri) · Undo disponibil.';
        } catch (error) {
            return 'ERR|' + error.message;
        } finally { if (begun) app.endUndoGroup(); }
    }
    function alignTextStack(spacing, centerX, keepOrder) {
        var begun = false;
        try {
            if (!isFinite(spacing) || spacing < 0 || spacing > 500) fail('Spacing invalid.');
            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) fail('Deschide o compoziție.');
            var layers = collectTextLayout(comp), i, centerYSum = 0, centerXSum = 0;
            for (i = 0; i < layers.length; i++) { centerYSum += layers[i].centerY; centerXSum += layers[i].centerX; }
            if (keepOrder) layers.sort(function(a,b){return a.centerY-b.centerY;});
            var total = spacing * (layers.length - 1);
            for (i = 0; i < layers.length; i++) total += layers[i].height;
            var current = centerYSum / layers.length - total / 2;
            var targetX = centerX ? comp.width / 2 : centerXSum / layers.length;
            app.beginUndoGroup('COSMIN MOTION · Align Text Stack'); begun = true;
            for (i = 0; i < layers.length; i++) {
                var item = layers[i], targetCenterY = current + item.height / 2;
                var next = copy(item.pos);
                next[0] += targetX - item.centerX;
                next[1] += targetCenterY - item.centerY;
                setPosition(item.prop, comp.time, next);
                current += item.height + spacing;
            }
            return 'OK|Textele au fost aliniate: ' + layers.length + ' layere · spacing ' + spacing + ' px · Undo disponibil.';
        } catch (error) {
            return 'ERR|' + error.message;
        } finally { if (begun) app.endUndoGroup(); }
    }
    function apply(id, frames, intensity, ease, blur) {
        var begun = false, written = 0, textStarted = false;
        try {
            var valid = {'swipe-left':1,'slide-up':1,'pop-in':1,'zoom-in':1,'zoom-out':1,'spin-in':1,'punch-in':1,'punch-out':1,'shake':1,'text-pop':1,'text-up':1};
            var recipe = textRecipes[id];
            if (!valid[id] && !recipe) fail('Preset necunoscut.');
            if (!isFinite(frames) || frames % 1 || frames < 1 || frames > 300 || !isFinite(intensity) || intensity < 10 || intensity > 200) fail('Parametri invalizi.');
            if(recipe && recipe.modern && frames<12)fail('Preseturile Modern necesită minimum 12 frames; recomandat 30–45.');
            if ((id === 'pop-in' || id === 'text-pop') && frames < 2) fail('Pop In necesită minimum 2 frames.');
            if (id === 'shake' && frames < 5) fail('Shake necesită minimum 5 frames.');
            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) fail('Deschide o compoziție.');
            var layers = comp.selectedLayers;
            if (!layers.length) fail('Selectează cel puțin un layer.');
            var start = comp.time, end = start + frames * comp.frameDuration;
            if (start < 0 || end > comp.duration - comp.frameDuration + 0.000001) fail('Animația depășește ultimul frame al compoziției.');
            var plans = [], amount = intensity / 100, i, p, values, tr, layer, base, times = [start, end];
            for (i = 0; i < layers.length; i++) {
                layer = layers[i];
                // AE instanceof matches concrete host classes, not their documented parents.
                if (!(layer instanceof AVLayer || layer instanceof TextLayer || layer instanceof ShapeLayer) || layer.nullLayer) fail(layer.name + ': selectează un layer vizual sau text.');
                if (layer.locked) fail(layer.name + ': layer blocat.');
                if (start < layer.inPoint || end >= layer.outPoint) fail(layer.name + ': intervalul animației trebuie să fie vizibil în layer.');
                if ((recipe || id === 'text-pop' || id === 'text-up') && !(layer instanceof TextLayer)) fail(layer.name + ': presetul necesită un layer text.');
                if (recipe) {
                    var textGroup = layer.property('ADBE Text Properties');
                    var source = textGroup.property('ADBE Text Document');
                    if (source.expressionEnabled || source.numKeys) fail(layer.name + ': Source Text animat; folosește un text static pentru aceste preseturi.');
                    if (!source.value.text.length) fail(layer.name + ': textul este gol.');
                    if(recipe.modern){
                        var units=recipe.based===3?(source.value.text.match(/\S+/g)||[]):source.value.text;
                        if(!units.length || units.length>60)fail(layer.name+': Modern acceptă 1–60 '+(recipe.based===3?'cuvinte':'caractere')+' pe layer.');
                    }
                    var existing = textGroup.property('ADBE Text Animators');
                    for (var a = 1; a <= existing.numProperties; a++) {
                        if (existing.property(a).name.indexOf('CM · ') === 0) fail(layer.name + ': există deja un Text Animator COSMIN MOTION. Folosește Undo sau șterge animatorul CM înainte de alt preset.');
                    }
                    continue;
                }
                tr = layer.property('ADBE Transform Group');
                if (id === 'swipe-left' || id === 'slide-up' || id === 'text-up' || id === 'shake') {
                    p = tr.property('ADBE Position'); base = getPosition(p, start, layer.threeDLayer ? 3 : 2);
                    if (id === 'shake') {
                        var shakeTimes = [], shakeValues = [], offsets = [0,-30,22,-14,7,0], j;
                        for (j = 0; j < offsets.length; j++) {
                            shakeTimes.push(start + Math.round(frames * j / 5) * comp.frameDuration);
                            shakeValues.push(shifted(base, 0, offsets[j] * amount));
                        }
                        positionPlan(plans, p, shakeTimes, shakeValues, layer.name);
                    } else positionPlan(plans, p, times, [shifted(base, id === 'swipe-left' ? 0 : 1, (id === 'swipe-left' ? 500 : 300) * amount), base], layer.name);
                } else if (id === 'spin-in') {
                    p = tr.property('ADBE Rotate Z'); base = p.valueAtTime(start, false);
                    planProperty(plans, p, times, [base - 90 * amount, base], layer.name);
                } else {
                    p = tr.property('ADBE Scale'); base = copy(p.valueAtTime(start, false));
                    if (id === 'pop-in' || id === 'text-pop') {
                        planProperty(plans, p, [start, start + Math.max(1, Math.min(frames - 1, Math.round(frames * 0.7))) * comp.frameDuration, end], [scaled(base, 0), scaled(base, 1 + 0.12 * amount), base], layer.name);
                    } else {
                        if (id === 'zoom-in') values = [scaled(base, 1 - 0.3 * amount), base];
                        if (id === 'zoom-out') values = [scaled(base, 1 + 0.3 * amount), base];
                        if (id === 'punch-in') values = [base, scaled(base, 1 + 0.2 * amount)];
                        if (id === 'punch-out') values = [base, scaled(base, 1 - 0.2 * amount)];
                        planProperty(plans, p, times, values, layer.name);
                    }
                }
                if (id !== 'shake' && id !== 'punch-in' && id !== 'punch-out') {
                    p = tr.property('ADBE Opacity');
                    planProperty(plans, p, times, [0, p.valueAtTime(start, false)], layer.name);
                }
            }
            app.beginUndoGroup('COSMIN MOTION · ' + id); begun = true;
            if (recipe) {
                for (i = 0; i < layers.length; i++) {
                    textStarted = true;
                    if(recipe.modern)written+=writeModern(layers[i],recipe,start,end,amount,ease);
                    else {writeTextAnimator(layers[i], recipe, start, end, amount, ease);written += 2;}
                }
            }
            for (i = 0; i < plans.length; i++) {
                var plan = plans[i]; p = plan.prop;
                for (var n = 0; n < plan.times.length; n++) {
                    p.setValueAtTime(plan.times[n], plan.values[n]); written++;
                    var index = p.nearestKeyIndex(plan.times[n]);
                    if (ease) {
                        var dimensions = p.isSpatial || !(plan.values[n] instanceof Array) ? 1 : plan.values[n].length;
                        var easing = [], e;
                        for (e = 0; e < dimensions; e++) easing.push(new KeyframeEase(0, 66.666));
                        p.setTemporalEaseAtKey(index, easing, easing);
                        p.setInterpolationTypeAtKey(index, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
                    } else p.setInterpolationTypeAtKey(index, KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.LINEAR);
                    if (p.isSpatial) {
                        var zero = plan.values[n].length === 3 ? [0,0,0] : [0,0];
                        p.setSpatialAutoBezierAtKey(index, false);
                        p.setSpatialContinuousAtKey(index, false);
                        p.setSpatialTangentsAtKey(index, zero, zero);
                    }
                }
            }
            if (blur) { comp.motionBlur = true; for (i = 0; i < layers.length; i++) layers[i].motionBlur = true; }
            return 'OK|Animație aplicată pe ' + layers.length + ' layer(e). ' + written + ' keyframe-uri · Undo disponibil.';
        } catch (error) {
            return 'ERR|' + error.message + (written || textStarted ? ' Aplicare parțială: folosește Undo pentru a reveni.' : '');
        } finally { if (begun) app.endUndoGroup(); }
    }
    return { apply: apply, alignTextStack: alignTextStack, arrangeSentence: arrangeSentence };
}());
