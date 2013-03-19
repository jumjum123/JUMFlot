/*
 * The MIT License

Copyright (c) 2012 by Juergen Marsch

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
	function init(pluginname,docuobject,dt,op){
		var r = "";
		var i;
		for(i = 0; i < dt.length; i++){
			r += "<h3>" + dt[i].header + "</h3>";
			r += $.plot.JUMlib.docu.objectStringifyHTML(dt[i].data);
		}
		$("#placeholderData").html(r);
		r = "";
		for(i = 0; i < op.length; i++){
			r += "<h3>" + op[i].header + "</h3>";
			r += $.plot.JUMlib.docu.objectToDocumentation(op[i].data,pluginname + "_docu." + pluginname + ".options");
		}
		$("#placeholderOption").html(r);
		if(debugOn === false) { $(".flot_debug").hide(); } 
		$("#tabs").tabs();
		try{$.plot.JUMExample.showSource("../../Experimental/jquery.Flot." + pluginname + ".js");}
		catch(e){console.log(e);}
		$("#placeholderManual").html($.plot.JUMlib.docu.docuObjectToHTML(docuobject));
		$(".jumflothelp").on("mouseover",$.plot.JUMExample.showDocuHelp);
		$(".jumflothelp").on("mouseleave",function(){$("#FLOTtooltip").remove();});
	}
    function showDocuHelp(pos){
		var attr = $(this)[0].attributes;
		var txt = $.plot.JUMlib.docu.getAPIHelp(attr["docuobj"].nodeValue,attr["prevname"].nodeValue,attr["actname"].nodeValue);
		$.plot.JUMlib.library.showTooltip(pos.pageX,pos.pageY,txt);
	}
	var actDocu = {data:null,form:null,target:null};
	function getDocu(p,pluginname,t){ 
		var r = p.getOptions().series[pluginname].debug.createDocuTemplate();
		actDocu.data = r.data; actDocu.form = r.form; actDocu.target = t;
		$(actDocu.target).html(actDocu.form);
	}
	function setDocu(f,v){ 
		var c = "actDocu.data",flds;
		flds = f.split('.');
		c = "actDocu.data";
		v = v.replace(/\r\n|\r|\n/g,"<br>");
		for(var i = 0; i < flds.length; i++){ if(flds[i].length > 0){ c += "[\"" + flds[i] + "\"]" ; } }
		c += "='" + v + "'";
		eval(c); 
	}
	function createJSON(){
		var r = JSON.stringify(actDocu.data);
		r = r.replace(/{/g,"{\n"); r = r.replace(/}/g,"}\n");
		$(actDocu.target).html('<textarea rows="12" cols="80">' + r + "</textarea>"); 
	}
	function showSource(url){
		function gotSource(src){ $("#placeholderSource").html(src);}
        $.ajax({ url: url, method: 'GET',dataType: 'text',success: gotSource,error:function(e,x,y){console.log(e,x,y);} }); 
	}
  
    $.plot.JUMExample = {};
    $.plot.JUMExample.init = init;
    $.plot.JUMExample.showDocuHelp = showDocuHelp;
    $.plot.JUMExample.getDocu = getDocu;
    $.plot.JUMExample.setDocu = setDocu;
    $.plot.JUMExample.createJSON = createJSON;
    $.plot.JUMExample.showSource = showSource;
})(jQuery);

