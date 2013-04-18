/*
 * The MIT License

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
    var pluginName = "video", pluginVersion = "0.1";
    var options ={
        series: {
            video:{
                active: false,
                show: false,
                stepAction: videoStep,
                walkPad: null, walkTime:2000,
                debug:{active:false,createDocuTemplate: null}
            }
        }
    };
    var replaceOptions = { grid:{ show: false} };
    var defaultOptions = { };
    function videoStep(stepData){
        var dfd,t;
        if(stepData.serie.video.walkPad) {
           dfd = $.Deferred();
           $(stepData.serie.video.walkPad).append("<br>" + stepData.data[2]);
           t = window.setTimeout(function(){ dfd.resolve();},stepData.serie.video.walkTime );
           return dfd.promise(); 
        }
        else { 
            alert(stepData.data[2]);
        }
    }
    	
    function init(plot, classes){ 
        var data = null, opt = null, plt = null;
        var done = false, actualStep = 0, maxSteps = 0, defs = [];
        plot.hooks.processOptions.push(processOptions);
        function processOptions(plot,options){
            if(options.series.video.active){
                opt = options;
                $.extend(true,options,replaceOptions);
                $.plot.JUMlib.data.extendEmpty(options,defaultOptions);
                opt = options;
                plot.hooks.draw.push(draw);
                plot.hooks.bindEvents.push(bindEvents);
                if(opt.series.video.debug.active === true) {opt.series.video.debug.createDocuTemplate = createDocuTemplate; }
            }
        }
        function createDocuTemplate(){
            var z,frm;
            z = $.plot.JUMExample.docuObjectToTemplate(
                [ {name:"data",tree:series.data},
                {name:"options.series.bandwidth",tree:options.series.video,takeDefault:true},
                {name:"options.series.bandwidth",tree:opt.series.video}
                ],pluginName); 
            $.plot.JUMExample.extendDocuObject(z,pluginName);
            frm = $.plot.JUMExample.docuObjectToEdit(z,"");
            return { data:z, form:frm};
        }
        function draw(plot,ctx){
            var i,j;
            if(opt.series.video.active === true){
                if(done === false){
                    data = plot.getData();
                    for(i = 0; i < data.length; i++){
                        if(data[i].video.show === true){
                            maxSteps = Math.max(maxSteps,data[i].data.length)
                            data[i].dataOrg = clone(data[i].data);
                            for(j = 0; j < data[i].data.length; j++){ data[i].data[j] = null; }
                        }
                    } 
                    plot.setData(data);
                    done = true;              
                }
            }
        }
        function bindEvents(plot,eventHolder){
            if (opt.series.video.active === true){
                plt = plot; 
                window.setTimeout(videoLoop,0);
            }
        }
        function videoLoop(){
            var i,defs = [],r;
            for(var i = 0; i < data.length; i++){ 
                if(data[i].video.show === true){
                    data[i].data[actualStep] = data[i].dataOrg[actualStep];
                    plt.setData(data);
                    plt.draw();
                    r = {
                        seriesIndex:i,
                        dataIndex:actualStep,
                        data:data[i].data[actualStep],
                        serie: data[i]
                    };
                    defs.push(data[i].video.stepAction(r));
                }
            }
            actualStep++;
            if(actualStep < maxSteps){ $.when.apply(null,defs).then(function(){videoLoop();}); }
        }
        function clone(obj){
            if(obj === null || typeof(obj) !== 'object'){ return obj;}
            var temp = new obj.constructor();
            for(var key in obj){temp[key] = clone(obj[key]); }
            return temp;
        }
    }
    var between = $.plot.JUMlib.library.between;
    $.plot.plugins.push({
        init: init,
        options: options,
        name: pluginName,
        version: pluginVersion
    });
})(jQuery);