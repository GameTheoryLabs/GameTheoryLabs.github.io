
/**
* Provides requestAnimationFrame in a cross browser way.
*/
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();

 //Adds inheritance method to Function object
 /*
     MyChild = function(){ ... }
     MyChild.inheritsFrom(MyParent);
 */
 Function.prototype.inherits = function( parentClassOrObject ){ 
     if ( parentClassOrObject.constructor == Function ) 
     { 
             //Normal Inheritance 
             this.prototype = new parentClassOrObject;
             this.prototype.constructor = this;
             this.prototype.parent = parentClassOrObject.prototype;
     } 
     else 
     { 
             //Pure Virtual Inheritance 
             this.prototype = parentClassOrObject;
             this.prototype.constructor = this;
             this.prototype.parent = parentClassOrObject;
     } 
     return this;
 }
 //Adds a bind method to Function object, that will ensure
 //  scope of the "this" parameter is set appropriately
 /*
     myClass = function()
     {
         this.myFunc = function()
         {
               ... do stuff ...
         }.bind(this);
       
     }
     
     myClass.prototype.secondFun = function()
     {
       
     }
     var testObj = new myClass();
     someObj.func = testObj.secondFun.bind(testObj);
 */
 Function.prototype.bind = function(scope){
     var _function = this;
     
     return function() {
       return _function.apply(scope, arguments);
     }
 }