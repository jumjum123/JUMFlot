/* * The MIT License

Copyright (c) 2013 by Juergen Marsch

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
(function ($){
    "use strict";
    var pluginName = "animate", pluginVersion = "0.2";
    var options ={
        animate:{
            active:false,
            mode:"tile",  //tile,pixastic, more to follow
            tile:{ x:3, y:3, mode:"lt"},   //
            pixastic:{ maxValue: 1, mode:"blurfast"},
            stepDelay:500,
            steps:20,
            debug:{active:false,createDocuTemplate: null}
        }
    };
    function init(plot,classes){
        var opt,offset,animateFunc,lctx;;
        plot.hooks.processOptions.push(processOptions);
        function processOptions(plot,options){
            if(options.animate.active === true){
                plot.hooks.draw.push(draw);
                plot.hooks.bindEvents.push(bindEvents);
                opt = options;
                if(options.animate.debug.active === true) {opt.animate.debug.createDocuTemplate = createDocuTemplate; }
            }
        }
        function createDocuTemplate(){
            var z,frm;
            z = $.plot.JUMExample.docuObjectToTemplate(
                [ {name:"options.animate",tree:options.animate,takeDefault:true},
                  {name:"options.animate",tree:opt.animate}
                ],pluginName); 
            $.plot.JUMExample.extendDocuObject(z,pluginName);
            frm = $.plot.JUMExample.docuObjectToEdit(z,"");
            return { data:z, form:frm};
        }
        function draw(plot,ctx){
            lctx = ctx;
            opt = plot.getOptions();
            offset = plot.getPlotOffset();
        }
        function bindEvents(plot,eventHolder){
            var acanvas,actx;
            acanvas = document.createElement('canvas');
            actx = acanvas.getContext("2d");
            actx.canvas.width = lctx.canvas.width;
            actx.canvas.height = lctx.canvas.height;
            actx.putImageData(lctx.getImageData(0,0,lctx.canvas.width,lctx.canvas.height),0,0);
            lctx.clearRect(0,0,lctx.canvas.width,lctx.canvas.height);
            switch(opt.animate.mode){
                case "tile":
                    animateTile(opt.animate.tile); break;
                case "pixastic":
                    animatePixastic(opt.animate.pixastic); break;
                default:
                    lctx.putImageData(actx.getImageData(0,0,actx.canvas.width,actx.canvas.height),0,0);
            }
            function animatePixastic(){
                var duration, stepValue, stepRange, params = {}, paramName, startdate = new Date();
                switch(opt.animate.pixastic.mode){
                    case "blurfast":
                        stepValue = Math.abs(opt.animate.pixastic.maxValue) * 2.5;
                        paramName = "amount"; params = { amount: 2.5}; break;
                    case "lighten":
                        stepValue = Math.min(1,Math.max(-1,opt.animate.pixastic.maxValue));
                        paramName = "amount"; params = { amount: 1}; break;
                    case "emboss":
                        stepValue = Math.abs(opt.animate.pixastic.maxValue) * 10; 
                        paramName = "strength"; params = { greyLevel:127, direction: "topleft", blend: true}; break;
                    case "mosaic":
                        stepValue = parseInt(Math.abs(opt.animate.pixastic.maxValue) * 100);
                        paramName = "blockSize"; params = { blockSize:100}; break;
                    case "noise":
                        stepValue = Math.abs(opt.animate.pixastic.maxValue);
                        paramName = "strength"; params = {mono:true,amount:1.0,strength:0.5}; break;
                    default:
                        stepValue = Math.min(1,Math.max(-1,opt.animate.pixastic.maxValue));
                }
                stepRange = stepValue / opt.animate.steps;
                animating();
                duration = opt.animate.stepDelay - (new Date() - startdate);
                animateFunc = window.setInterval(animating, duration);
                function animating(){
                    var r;
                    params[paramName] = stepValue; 
                    if(stepValue === 0){
                        lctx.putImageData(actx.getImageData(0,0,actx.canvas.width,actx.canvas.height),0,0);
                        window.clearInterval(animateFunc);
                    }
                    else{
                        r = Pixastic.process(actx.canvas,opt.animate.pixastic.mode, params).getContext("2d");
                        lctx.putImageData(r.getImageData(0,0,r.canvas.width,r.canvas.height),0,0);
                        stepValue -= stepRange;
                        if((stepRange > 0 && stepValue <= 0) || (stepRange < 0 && stepValue >= 0)) { stepValue = 0;}
                    }                   
                }               
            }
            function animateTile(lopt){
                var x,y,flds = [],w = lctx.canvas.width / lopt.x,h = lctx.canvas.height / lopt.y,
                    startdate = new Date(),duration = opt.animate.stepDelay;
                switch(lopt.mode){
                    case "lt": x = 0; y = 0; break;
                    case "tl": x = 0; y = 0; break;
                    case "rb": x = lopt.x - 1; y = lopt.y - 1; break;
                    case "br": x = lopt.x - 1; y = lopt.y - 1; break;
                    case "random":
                        for(var i = 0; i < lopt.x; i++){ for(var j = 0; j < lopt.y; j++){flds.push([i,j]);} }
                        var r = parseInt(Math.random() * flds.length);
                        x = flds[r][0]; y = flds[r][1]; flds.splice(r,1);
                        break;
                }
                animating();
                duration = duration - (new Date() - startdate);
                animateFunc = window.setInterval(animating, duration);                
                function animating(){
                    lctx.putImageData(actx.getImageData(x * w,y * h,w,h),x * w, y * h);
                    nextStep();
                }
                function nextStep(){
                    switch(lopt.mode){
                        case "lt":
                            if(x++ >= lopt.x) { x = 0; if(y++ >= lopt.y){window.clearInterval(animateFunc);} }
                            break;
                        case "tl":
                            if(y++ >= lopt.y) { y = 0; if (x++ >= lopt.x){window.clearInterval(animateFunc);} }
                            break;
                        case "rb":
                            if(x-- < 0) { x = lopt.x - 1; if(y-- < 0) {window.clearInterval(animateFunc);} }
                            break;
                        case "br":
                            if(y-- < 0) { y = lopt.y - 1; if(x-- < 0) {window.clearInterval(animateFunc);} }
                            break;
                        case "random":
                            if(flds.length === 0){window.clearInterval(animateFunc);}
                            else{
                                var r = parseInt(Math.random() * flds.length);
                                x = flds[r][0]; y = flds[r][1]; flds.splice(r,1);
                            }
                            break;
                    }
                }
            }
        }
    }
    var getColor = $.plot.JUMlib.data.getColor;
    $.plot.plugins.push({
        init: init,
        options: options,
        name: pluginName,
        version: pluginVersion
    });
})(jQuery); 