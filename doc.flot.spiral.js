/*
 * The MIT License

Copyright (c) 2010, 2011, 2012 by Juergen Marsch

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

var spiral_docu = {
"docu":"Documentation","spiral":{
"docu":"Plugin to create rectangle charts","data":{
"docu":"Data Array specific for spiral chart","0":{
"docu":"first data entry","label":{
"docu":"standard label"}
,"data":{
"docu":"standard in flot"}
,"color":{
"docu":"color for pie, can be a simple color or a gradient","colors":{
"docu":"This array holds color data for gradients. supported are brightness, opacity and colors","0":{
"docu":"inner color"}
,"1":{
"docu":"color(s) between, number is between 0 and ....."}
,"2":{
"docu":"outer color"}
}
}
}
}
,"options":{
"docu":"options for spiral","series":{
"docu":"series options for spiral","spiral":{
"docu":"Specific options for spiral","active":{
"docu":"activate the plugin","defVal":"false"}
,"show":{
"docu":"show specific serie. this needs to be overwritten in data","defVal":"false"}
,"spiralSize":{
"docu":"size of spiral screen relative to size of placeholder","defVal":"0.8"}
,"rotations":{
"docu":"number of rotations in animation","defVal":"3"}
,"steps":{
"docu":"number of steps in each rotation","defVal":"36"}
,"delay":{
"docu":"delay in ms between steps","defVal":"50"}
,"highlight":{
"docu":"Used to highlight in case of HOVER","opacity":{
"docu":" only Opacity is supported for Highlighting (yet)","defVal":"0.5"}
}
,"debug":{
"docu":"for debugging reasons. Right now, create a template for documentation is supported. This is filled by already existing docu, and converted to a formular to edit. After editing the edited data can be stringified to be copied to the docu-object.","active":{
"docu":"Activate the button for creating a template","defVal":"false"}
,"createDocuTemplate":{
"docu":"If debug.active is true, this holds the function which is used to create the template for documentation","defVal":" createDocuTemplate()"}
}
}
}
}
}
}