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
            mode:"tile",tiles:{x:3,y:3},
            pixastic:{ maxValue: 1, mode:"blurfast"},
            stepDelay:500,
            steps:20
        }
    };
    function init(plot,classes){
        var opt,offset,animateFunc,lctx;;
        plot.hooks.processOptions.push(processOptions);
        function processOptions(plot,options){
            if(options.animate.active === true){
                plot.hooks.draw.push(draw);
                plot.hooks.bindEvents.push(bindEvents);
            }
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
                    animateTile(); break;
                case "pixastic":
                    animatePixastic(); break;
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
            function animateTile(){
                var x = 0, y = 0,
                    w = lctx.canvas.width / opt.animate.tiles.x,
                    h = lctx.canvas.height / opt.animate.tiles.y,
                    startdate = new Date(),
                    duration = opt.animate.stepDelay;
                animating();
                duration = duration - (new Date() - startdate);
                x = 1;
                animateFunc = window.setInterval(animating, duration);                
                function animating(){
                    lctx.putImageData(actx.getImageData(x * w,y * h,w,h),x * w, y * h);
                    x++;
                    if(x >= opt.animate.tiles.x) { 
                        y++; x = 0;
                        if(y >= opt.animate.tiles.y){window.clearInterval(animateFunc);}
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