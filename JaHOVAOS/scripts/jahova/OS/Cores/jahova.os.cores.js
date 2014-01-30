//JaHOVA OS : Cores
//      Dependent on JaHOVA OS

/**h* OS/InternalCores
*  LINKS
* |html <p><a href="http://jahovaos.com/JaHOVA/Documentation/Full/toc_index.html">   Table of Contents </a></p>
*
*  NAME
*    JaHOVA OS Cores
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
*     This Singleton holds pointers to Internal JaHOVA OS Cores
*
*  EXAMPLE
*       cores = com.jahova.os.Instance().Cores.Instance()
*
**/
com.jahova.os.Instance().Cores = (function()
                        {
                            var pInstance;
                            
                            /**m* InternalCores/Constructor
                             *
                             *  SOURCE
                             **/
                            function constructor()
                            {
                                //PRIVATE ATTRIBUTES
                                var NAME = "JaHOVA OS Internal APIs";
                                var VERSION = "0v3";
                                var PATH = "scripts/jahova/OS/Cores/jahova.os.cores.js";
                                var ID = null;
                                
                                //MODULE POINTERS
                                var os = com.jahova.os.Instance();
                                var kernel = os.kernel;
                                
                                var utilities = os.utilities;
                                var console = os.console;
                             /*
                            **/
                                //PRIVATE METHODS
                                
                                return{
                                    //PUBLIC ATTRIBUTES

                                    
                                    //PUBLIC PRIVILEDGE METHODS
                                   
                                    GetName: function(){
                                        return NAME;
                                    },
                                                                       
                                    GetVersion: function(){
                                        return VERSION;
                                    },
                                                                       
                                    GetPath: function(){
                                        return PATH;
                                    },
                                                                     
                                    GetID: function(){
                                        return ID;
                                    },
                                    
                                    Initialize: function(){
                                        
                                    },
                                    
                                    //PUBLIC OBJECTS
                                    Network: null,      //WebSocket, WebDAV, XHR
                                    HTML: null,         //Wrapped DOM Calls
                                    Threads: null,      //Generic WebWorker Object, allows for spinning off generic functions into threads
                                    Database: null,     //MySQL connector
                                    Audio: null,        //HTML5 Audio Wrapper
                                    Windows: null,      //Desktop style windows
                                    Graphics: null,     //2D and 3D (WebGL) Graphics core
                                    Physics: null      //3D Rigid Body Physics
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