/*
 * The MIT License

Copyright (c) 2010,2011,2012, 2013 by Juergen Marsch

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

(function ($) {
    "use strict";
    var pluginName = "grow", pluginVersion = "0.4";
    var options = {
        series: {
            grow: {
                active: false,
                stepDelay: 20,
                steps: 100,
                growings: [
                    {
                        valueIndex: 1,
                        stepMode: "linear",
                        stepDirection: "up"
                    }
                ],
                debug: { active: false, createDocuTemplate: null }
            }
        }
    };
    function init(plot) {
        var done = false;
        var growfunc;
        var plt = plot;
        var data = null;
        var opt = null;
        var serie = null;
        var valueIndex;
        plot.hooks.bindEvents.push(processbindEvents);
        plot.hooks.drawSeries.push(processSeries);
        plot.hooks.shutdown.push(shutdown);
        function createDocuTemplate() {
            var z, frm;
            z = $.plot.JUMExample.docuObjectToTemplate(
                [{ name: "data", tree: serie.data },
                { name: "options.series.grow", tree: options.series.grow, takeDefault: true },
                { name: "options.series.grow", tree: opt.series.grow },
                { name: "options.series.editMode", tree: options.series.editMode, takeDefault: true },
                { name: "options.series.editMode", tree: opt.series.editMode },
                { name: "options.series.nearBy", tree: options.series.nearBy, takeDefault: true },
                { name: "options.series.nearBy", tree: opt.series.nearBy }
                ], pluginName);
            $.plot.JUMExample.extendDocuObject(z, pluginName);
            frm = $.plot.JUMExample.docuObjectToEdit(z, "");
            return { data: z, form: frm };
        }
        function processSeries(plot, canvascontext, series) {
            opt = plot.getOptions();
            valueIndex = opt.series.grow.valueIndex;
            if (opt.series.grow.active === true) {
                if (opt.series.grow.debug.active === true) {
                    serie = series;
                    opt.series.grow.debug.createDocuTemplate = createDocuTemplate;
                }
                if (done === false) {
                    data = plot.getData();
                    data.actualStep = 0;
                    data.growingIndex = 0;
                    for (var j = 0; j < data.length; j++) {
                        data[j].dataOrg = clone(data[j].data);
                        for (var i = 0; i < data[j].data.length; i++) { data[j].data[i][valueIndex] = 0; }
                    }
                    plot.setData(data);
                    done = true;
                }
            }
        }
        function processbindEvents(plot, eventHolder) {
            opt = plot.getOptions();
            if (opt.series.grow.active === true) {
                var d = plot.getData();
                for (var j = 0; j < data.length; j++) {
                    opt.series.grow.steps = Math.max(opt.series.grow.steps, d[j].grow.steps);
                }
                if (opt.series.grow.stepDelay === 0) { opt.series.grow.stepDelay++; }
                growfunc = window.setTimeout(growingLoop, opt.series.grow.stepDelay);

                if (isPluginRegistered("resize")) {
                    plot.getPlaceholder().bind("resize", onResize);
                }
            }
        }

        function growingLoop() {
            var startTime = new Date();
            var growing;
            if (data.actualStep < opt.series.grow.steps) {
                data.actualStep++;
                for (var j = 0; j < data.length; j++) {
                    for (var g = 0; g < data[j].grow.growings.length; g++) {
                        growing = data[j].grow.growings[g];
                        if (typeof growing.stepMode === "function") {
                            growing.stepMode(data[j], data.actualStep, growing);
                        }
                        else {
                            if (growing.stepMode === "linear") { growLinear(); }
                            else if (growing.stepMode === "maximum") { growMaximum(); }
                            else if (growing.stepMode === "delay") { growDelay(); }
                            else { growNone(); }
                        }
                    }
                }
                plt.setData(data);
                plt.draw();

                var timeDiff = new Date() - startTime;
                var nextStepDelay = Math.max(0, opt.series.grow.stepDelay - timeDiff);
                growfunc = window.setTimeout(growingLoop, nextStepDelay);
            } else {
                growfunc = null;
            }
            function growNone() {
                if (data.actualStep === 1) {
                    for (var i = 0; i < data[j].data.length; i++) {
                        data[j].data[i][valueIndex] = data[j].dataOrg[i][growing.valueIndex];
                    }
                }
            }
            function growLinear() {
                if (data.actualStep <= data[j].grow.steps) {
                    for (var i = 0; i < data[j].data.length; i++) {
                        if (growing.stepDirection === "up") {
                            data[j].data[i][growing.valueIndex] = data[j].dataOrg[i][growing.valueIndex] / data[j].grow.steps * data.actualStep;
                        }
                        else if (growing.stepDirection === "down") {
                            data[j].data[i][growing.valueIndex] = data[j].dataOrg[i][growing.valueIndex] + (data[j].yaxis.max - data[j].dataOrg[i][growing.valueIndex]) / data[j].grow.steps * (data[j].grow.steps - data.actualStep);
                        }
                    }
                }
            }
            function growMaximum() {
                if (data.actualStep <= data[j].grow.steps) {
                    for (var i = 0; i < data[j].data.length; i++) {
                        if (growing.stepDirection === "up") {
                            data[j].data[i][growing.valueIndex] = Math.min(data[j].dataOrg[i][growing.valueIndex], data[j].yaxis.max / data[j].grow.steps * data.actualStep);
                        }
                        else if (growing.stepDirection === "down") {
                            data[j].data[i][growing.valueIndex] = Math.max(data[j].dataOrg[i][growing.valueIndex], data[j].yaxis.max / data[j].grow.steps * (data[j].grow.steps - data.actualStep));
                        }
                    }
                }
            }
            function growDelay() {
                if (data.actualStep == data[j].grow.steps) {
                    for (var i = 0; i < data[j].data.length; i++) {
                        data[j].data[i][growing.valueIndex] = data[j].dataOrg[i][growing.valueIndex];
                    }
                }
            }
        }

        function clone(obj) {
            if(obj === null || typeof(obj) !== 'object'){ return obj;}
            var temp = new obj.constructor();
            for(var key in obj){temp[key] = clone(obj[key]); }
            return temp;
        }

        function onResize() {
            if (growfunc) {
                clearTimeout(growfunc);
                growfunc = null;
                plot.setupGrid();
                plot.draw();
            }
        }

        function shutdown(plot, eventHolder) {
            plot.getPlaceholder().unbind("resize", onResize);
        }

        function isPluginRegistered(pluginName) {
            var plugins = $.plot.plugins;

            for (var i = 0, len = plugins.length; i < len; i++) {
                var plug = plugins[i];

                if (plug.name === pluginName) {
                    return true;
                }
            }
            return false;
        }
    }
    $.plot.plugins.push({
        init: init,
        options: options,
        name: pluginName,
        version: pluginVersion
    });
})(jQuery);
