//JaHOVA OS


var com = {};



/***h* JaHOVA
 *  LINKS
 *
 *  NAME
 *      JaHOVA
 *      
 *  AUTHOR
 *      Corey Clark PhD
 *      cclark@coreyclarkphd.com
 *      
 *  HISTORY
 *      Created 4.14.2011
 *      
 *  DESCRIPTION
 *      This is the wrapper/namespace for the entire
 *      OS, Core and Utilities Modules
 *
 *  USAGE
 */
com.jahova = {}
/*
*  NOTES
*     N/A
*
*  IDEAS
*     N/A
*
*  TODO
*
*  
**/

/**h* JaHOVA/OS
*  LINKS
* |html <p><a href="http://jahovaos.com/JaHOVA/Documentation/Full/toc_index.html">   Table of Contents </a></p>
*
*  NAME
*       JaHOVA OS Module
*    
*  AUTHOR
*       Corey Clark
*       cclark@coreyclarkphd.com
*
*  HISTORY
*       Created: 4/14/2011
*   
*
*  DESCRIPTION
*       This module is a Singletong that holds all of the OS Objects:
*       Kernel
*       Internal JaHOVA Cores
*     
*  EXAMPLE
*       os = com.jahova.os.Instance()
*       
*  NOTES
*     N/A
*
*  IDEAS
*     N/A
*
*  TODO
*  
**/
com.jahova.os = (function()
            {
                
                var pInstance;
                
                /**m* OS/Constructor
                 *
                 *  NAME
                 *      OS Constructor
                 *      
                 *  DESCRIPTION
                 *      Private Method called by Public Static Instance Method
                 *
                 *  USAGE
                 */
                function constructor()
                {
                    
                    //******************
                    //PRIVATE ATTRIBUTES
                    //******************
                    
                    //CONSTANTS
                    var NAME = "JaHOVA OS";
                    var VERSION = "0v5";
                    var PATH = "scripts/jahova/OS/jahova.os.js";
                    var DOMAIN = "http://demo.jahovaos.com/JaHOVA/0v5_0/";
                
                    
                    //******************
                    //PRIVATE METHODS AND OBJECTS
                    //******************
                    
                    return{
                        
                    
                        //******************
                        //PUBLIC ATTRIBUTES
                        //******************
                            //OS MODULE
                            os: null,
                            kernel: null,
                            command: null,
                            resschmgr: null,
                            instruction: null,
                            
                            //Internal Cores/APIs
                            cores: null,
                            network: null,
                            threads: null,
                            html: null,
                            windows: null,
                            datbase: null,
                            audio: null,
                            graphics: null,
                            
                            //UTILITIES MODULE
                            utilities: null,
                            console: null,
                            debugbar: null,
                            timer: null,
                            
                            //OS ATTRIBUTES
                            queryString: null,
                            
                            //Splash Screen
                            splash: null,
                            video: null,
                        
                        
                        //******************
                        //PUBLIC PRIVILEDGE METHODS
                        //******************
                            //Accessor and Interface Methods
                            
                            GetName: function(){
                                return NAME;
                            },
                            
                            GetVersion: function(){
                                return VERSION;
                            },
                            
                            GetPath: function(){
                                return PATH;
                            },
                            
                            GetDomain: function(){
                                return DOMAIN;
                            },
                            
                            Load: function(app){
                                this.video = document.createElement("video");//new Image();
                                if(this.video.canPlayType('video/m4v;')){
                                    this.video.src = "images/splash.m4v";
                                }
                                else{
                                    this.video.src = "images/splash.webm";
                                }
                                
                                this.video.setAttribute('preload', 'auto');
                                this.video.setAttribute('autoplay', 'autoplay');
                                this.video.style.width = "100%";
                                this.video.style.height = "100%";
                                
                                this.os = com.jahova.os.Instance();
                                
                                this.utilities = com.jahova.utilities.Instance();
                                
                                this.kernel = this.os.Kernel.Instance();
                                this.kernel.Initialize();
                                
                                this.console = this.utilities.Console.Instance();
                                this.console.Initialize();
                                
                                this.debugbar = this.utilities.DebugBar.Instance();
                                this.debugbar.Initialize();
                                                                
                                this.resschmgr = this.kernel.ResSchMgr.Instance();
                                this.resschmgr.Initialize();
                                
                                this.timer = this.utilities.Timer.Instance();
                                this.timer.Initialize();
                                
                                this.instruction = this.kernel.Instruction.Instance();
                                this.instruction.Initialize();
                                
                                this.command = this.kernel.Command.Instance();
                                this.command.Initialize();
                                
                                this.cores = this.os.Cores.Instance();
                                this.cores.Initialize();
                                
                                this.network = this.cores.Network.Instance();
                                this.network.Initialize();
                                
                                this.threads = this.cores.Threads.Instance();
                                this.threads.Initialize();
                                
                                this.html = this.cores.HTML.Instance();
                                this.html.Initialize();
                                
                                this.windows = this.cores.Windows.Instance();
                                this.windows.Initialize();
                                
                                this.database = this.cores.Database.Instance();
                                this.database.Initialize();
                                
                                this.audio = this.cores.Audio.Instance();
                                this.audio.Initialize();
                                
                                this.graphics = this.cores.Graphics.Instance();
                                this.graphics.Initialize();
                                
                                this.physics = this.cores.Physics.Instance();
                                this.physics.Initialize();
                                
                                this.console.AppendComment("\n**************************\n\nOS LOADING COMPLETE\n\n**************************\n\n");
                                this.console.AppendComment("Loaded Modules")
                                this.console.AppendComment("    " + this.os.GetName());
                                this.console.AppendComment("        " + this.kernel.GetName());
                                this.console.AppendComment("            " + this.command.GetName());
                                this.console.AppendComment("            " + this.resschmgr.GetName());
                                this.console.AppendComment("            " + this.instruction.GetName());
                                this.console.AppendComment("        " + this.cores.GetName());
                                this.console.AppendComment("            " + this.network.GetName());
                                this.console.AppendComment("            " + this.threads.GetName());
                                this.console.AppendComment("            " + this.html.GetName());
                                this.console.AppendComment("            " + this.windows.GetName());
                                this.console.AppendComment("            " + this.database.GetName());
                                this.console.AppendComment("            " + this.audio.GetName());
                                this.console.AppendComment("            " + this.graphics.GetName());
                                this.console.AppendComment("            " + this.physics.GetName());
                                this.console.AppendComment("    " + this.utilities.GetName());
                                this.console.AppendComment("        " + this.console.GetName());
                                this.console.AppendComment("        " + this.timer.GetName());
                                this.console.AppendComment("        " + this.debugbar.GetName());
                                this.console.AppendComment("");
                                
                                this.console.AppendComment("\n\nLoading Terminal Commands, type help to see a list of available commands\n");
                                this.console.LoadCommands();
                                
                                this.console.AppendComment("\n\Initializing Query Variables\n");
                                pInstance.os.queryString = pInstance.os.resschmgr.Create.Map();
                                pInstance.os.GetQueryString();
                                
                                this.console.Comment("");
                                
                                
                                
                                
                                    //Execute any Console or Applications in Query String
                                    pInstance.os.ExecuteQuery();
                                   
                                
                                
                            },
                            GetQueryString: function(){
                                
                                var re = /[?&]([^=]+)(?:=([^&]*))?/g;
                                var matchInfo;
                                
                                matchInfo = re.exec(location.search)
                                while(matchInfo)
                                {
                                    pInstance.os.queryString.put(matchInfo[1].toUpperCase(), unescape(matchInfo[2]));
                                    matchInfo = re.exec(location.search)
                                }
                                
                                for( var i = 0; i < pInstance.os.queryString.size; i++)
                                {
                                    pInstance.os.console.AppendComment("Key: " + pInstance.os.queryString.key() + ", Value: " + pInstance.os.queryString.value());
                                    pInstance.os.queryString.next();
                                }
                                pInstance.os.console.Comment("");
                            },
                            ExecuteQuery: function(){
                                var cmdConsole = pInstance.os.queryString.get("CONSOLE");
                                var cmdApp = pInstance.os.queryString.get("APP");
                                
                                if(cmdConsole){
                                    pInstance.console.cmdWindow.value += cmdConsole;
                                    pInstance.console.ProcessInputString();
                                }
                                //else if(cmdApp){
                                    (PlaySplash = function(){
                                        pInstance.splash = pInstance.os.windows.WindowsManager.Create.Window("", "PC");
                                        pInstance.splash.Hide.menubar();
                                        pInstance.splash.Hide.statusbar();
                                        pInstance.splash.Hide.titlebar();
                                        pInstance.splash.Hide.toolbar();
                                        pInstance.splash.Set.width(480);
                                        pInstance.splash.Set.height(270);
                                        
                                        pInstance.splash.elements.content.AppendChild(pInstance.os.video);
                                        pInstance.splash.elements.content.html().style.overflow = 'hidden';
                                        
                                        pInstance.splash.Set.position((window.innerHeight / 2) - 135,(window.innerWidth / 2) - 240);
                                        pInstance.splash.Display.window();
                                        
                                        setTimeout(pInstance.splash.Hide.window, 4000);
                                    })();
                                    //Gamepad();
                                    //window[cmdApp]();
                                //}
                            },
                        
                        //PUBLIC OBJECTS/CLASSES
                            Kernel: null,
                            Cores: null,
                            
                            //HTML Elements
                            Elements: {
                                JaHOVA: null,
                                Console: null,
                                OS: null,
                                Documentation: null,
                                Demos: null,
                                Application: null,
                                IDE: null
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
                            os = com.jahova.os.Instance();
                        }
                        
                        return pInstance;
                    }
                }
            })();
