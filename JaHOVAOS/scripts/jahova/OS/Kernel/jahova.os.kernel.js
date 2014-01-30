//JaHOVA OS : Kernel
//      Dependent on JaHOVA OS

/**h* OS/Kernel
*  LINKS
* |html <p><a href="http://jahovaos.com/JaHOVA/Documentation/Full/toc_index.html">   Table of Contents </a></p>
*
*  NAME
*    JaHOVA OS Kernel
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
*     This Singleton is a wrapper for all of the Kernel Objects/Modules:
*     Command
*     Resource and Scheduler
*     Instruction
*     
*
*  EXAMPLE
*   kernel = com.jahova.os.Instance().Kernel.Instance()
*   
**/

com.jahova.os.Instance().Kernel = (function()
                        {
                            var pInstance;
                            
                            /**m* Kernel/Constructor
                             *
                             *  SOURCE
                             */
                            function constructor()
                            {
                                //******************
                                //PRIVATE ATTRIBUTES
                                //******************
                                
                                
                                //DEFINES
                                var NAME = "JaHOVA OS Kernel";
                                var VERSION = "0v3";
                                var PATH = "scripts/jahova/OS/Kernel/jahova.os.kernel.js";
                                
                                //MODULE POINTERS
                                var os = com.jahova.os.Instance();
                                var kernel = null;
                                
                                var utilities = null;
                                var console = null;
                            /*
                             **/
                                //******************
                                //PRIVATE METHODS
                                //******************
                                
                                
                                //******************
                                //PRIVATE OBJECTS
                                //******************
                                
                                
                                //******************
                                //INITALIZATION
                                //******************
                                
                               
                                
                                return{
                                    //PUBLIC ATTRIBUTES
                                    
                                    //PUBLIC PRIVILEDGE METHODS
                                    
                                    GetName: function()
                                    {
                                        return NAME;
                                    },
                                    
                                    GetVersion: function()
                                    {
                                        return VERSION;
                                    },
                                    
                                    GetPath: function()
                                    {
                                        return PATH;
                                    },
                                    
                                    Initialize: function()
                                    {
                                        //Initialize Module Pointers
                                        kernel = os.Kernel.Instance();
                                        utilities = com.jahova.utilities.Instance();
                                        console = utilities.Console.Instance();
                                        debug = utilities.DebugBar.Instance();
                                        
                                         //Set up HTML Elements                             
                                        if(document.getElementById("com.jahova"))
                                        {
                                            os.Elements.JaHOVA = document.getElementById("com.jahova");
                                            os.Elements.JaHOVA.className = "mainContent appBaseColor";
                                        }
                                        else
                                        {
                                            //os.Elements.JaHOVA = document.createElement("div");
                                            //os.Elements.JaHOVA.id = "com.jahova";
                                            //os.Elements.JaHOVA.className = "mainContent appBaseColor";
                                            //os.Elements.Com.appendChild(os.Elements.JaHOVA);
                                        }
                                        
                                    },
                                    /*
                                    **/
                                    //PUBLIC OBJECTS
                                    Command: null,
                                    ResSchMgr: null,
                                    Instruction: null
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
