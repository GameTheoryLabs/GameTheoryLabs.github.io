//JaHOVA OS Utilities
//      Dependent upone JaHOVA OS

/**h* JaHOVA/Utilities
*  LINKS
* |html <p><a href="http://jahovaos.com/JaHOVA/Documentation/Full/toc_index.html">   Table of Contents </a></p> 
*
*  NAME
*    JaHOVA Utilities 
*    
*  AUTHOR
*   Corey Clark
*   cclark@coreyclarkphd.com
*
*  HISTORY
*   Created: 4/14/2011
*   
*
*  DESCRIPTION
*     This is the Utilities module for JaHOVA
*       Adds functionality not directly needed for
*       OS operation, but can be used to interface with
*       OS (i.e. command window,etc)
*     
*  Example
*  util = com.jahova.utilities.Instance();
**/



com.jahova.utilities = (function()
                    {
                        var pInstance;
                        /**m* Utilities/Constructor
                        *
                        *  SOURCE
                        */
                        function constructor()
                        {
                            //PRIVATE ATTRIBUTES
                            var NAME = "JaHOVA Utilities";
                            var VERSION = "0v3";
                            var PATH = "scripts/jahova/Utilities/jahova.utilities.js";
                            var os = null
                            var utilities = null;
                            var console = null;
                        
                            //PRIVATE METHODS
                            
                            //Adds inheritance method to Function object
                            /*
                                MyChild = function(){ ... }
                                MyChild.inheritsFrom(MyParent);
                            */
                            Function.prototype.inherits = function( parentClassOrObject )
                            { 
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
                            Function.prototype.bind = function(scope)
                            {
                                var _function = this;
                                
                                return function() {
                                  return _function.apply(scope, arguments);
                                }
                            }
                            /*
                            **/
                            return{
                                //PUBLIC ATTRIBUTES
                                
                                //PUBLIC PRIVILEDGE METHODS
                                /**m* Utilities/GetName
                                *
                                *  SOURCE
                                */
                                GetName: function()
                                {
                                    return NAME;
                                },
                                /*
                                 **/
                                /**m* Utilities/GetVersion
                                *
                                *  SOURCE
                                */
                                GetVersion: function()
                                {
                                    return VERSION;
                                },
                                /*
                                 **/
                                /**m* Utilities/GetPath
                                *
                                *  SOURCE
                                */
                                GetPath: function()
                                {
                                    return PATH;
                                },
                                /*
                                 **/
                                //PUBLIC OBJECT/CLASSES
                                Console: null
                            }
                        }
                        
                        return {
                            //OBJECT ACCESSOR
                            Instance: function()
                            {
                                if(!pInstance)
                                {
                                    //Instantiate if pInstance does not exist
                                    pInstance = constructor();
                                }
                                
                                return pInstance;
                            }
                        }
                    })();
