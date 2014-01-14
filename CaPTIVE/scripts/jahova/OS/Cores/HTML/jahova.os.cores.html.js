//JaHOVA OS : Cores : DOM
//      Dependent on JaHOVA OS : Cores

/**h* InternalCores/Network
*  LINKS
* |html <p><a href="http://jahovaos.com/JaHOVA/Documentation/Full/toc_index.html">   Table of Contents </a></p> 
*
*  NAME
*    JaHOVA OS DOM Core
*    
*  AUTHOR
*   Corey Clark
*   cclark@coreyclarkphd.com
*
*  HISTORY
*   Created: 8/62011
*   
*
*  DESCRIPTION
*     This Singleton holds the Internal JaHOVA OS DOM Core
*
*  EXAMPLE
*     network = com.jahova.os.Instance().Cores.Instance().Multithreading.Instance();
*
**/
com.jahova.os.Instance().Cores.Instance().HTML = (function()
                        {
                            var pInstance;
                    
                            function constructor()
                            {
                                //PRIVATE ATTRIBUTES
                                var NAME = "JaHOVA OS Internal API : HTML Core";
                                var VERSION = "0v5";
                                var PATH = "scripts/jahova/OS/Cores/HTML/jahova.os.cores.html.js";
                                var ID = null;
                                
                                var os = com.jahova.os.Instance();
                                var utilities = com.jahova.utilities.Instance();
                                /*
                                 **/
                                //PRIVATE METHODS
                                
                                
                                //Private Classes
                                

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
                                        
                                    }
                                    
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