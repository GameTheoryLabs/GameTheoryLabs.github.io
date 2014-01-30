//JaHOVA Utilities : Timer 
//      Dependent on JaHOVA Utilities

/**h* Utilities/Console
*  LINKS
* |html <p><a href="http://jahovaos.com/JaHOVA/Documentation/Full/toc_index.html">   Table of Contents </a></p>
*
*  NAME
*    JaHOVA Utilities Timer
*    
*  AUTHOR
*   Corey Clark
*   cclark@coreyclarkphd.com
*
*  HISTORY
*   Created: 7/28/2011
*   
*
*  DESCRIPTION
*     This module adds timer capability
*     
*
*  EXAMPLE
*   console = com.jahova.utilities.Instance().Timer.Instance();
**/


com.jahova.utilities.Instance().Timer = (function()
                        {
                            var pInstance;
                            /**m* Console/Constructor
                            *
                            *  SOURCE
                            */
                            function constructor()
                            {
                                //******************
                                //PRIVATE ATTRIBUTES
                                //******************
                                
                                var NAME = "JaHOVA Utilities : Timer Module";
                                var VERSION = "0v3";
                                var PATH = "scripts/jahova/Utilities/Console/jahova.utilities.timer.js";
                                
                                var os = com.jahova.os.Instance();
                                var timer = this;
                                
                                var startTime = null;
                                var elapsedTime = null;
                                var lapElapsedTime = null;
                                var running = false;
                                var date = new Date();
                                var _log = os.resschmgr.Create.Map();
                                var CLap = function(lapName, lapTime)
                                {
                                    this.name = lapName;
                                    this.time = lapTime;
                                }
                                
                                //******************
                                //PRIVATE METHODS
                                //******************
                                
                                
                                //******************
                                //INITALIZATION
                                //******************

                                
                                return{
                                    //PUBLIC ATTRIBUTES
                                    log: null,
                                    Initialize: function(){
                                        timer = this;
                                        this.log = [];
                                        lapElapsedTime = 0;
                                        
                                    },
                                    
                                    Start: function(){
                                        running = true;
                                        return startTime = (new Date).getTime();
                                        
                                    },
                                    
                                    Stop: function(){
                                        var currentTime = (new Date).getTime();
                                        running = false;
                                        return elapsedTime += currentTime - startTime;
                                    },
                                    
                                    Lap: function(lapName){
                                        var currentTime = (new Date).getTime();                                        
                                        if(running)
                                        {
                                            elapsedTime += currentTime - startTime;
                                            
                                            var lapTime = elapsedTime - lapElapsedTime;
                                            
                                            lapElapsedTime += lapTime
                                            var logEntry = new CLap(lapName, lapTime);
                                            this.log.push(logEntry);
                                            
                                            _log.put(lapName, logEntry);
                                            
                                            //elapsedTime += lapTime;
                                            
                                            startTime = (new Date).getTime();
                                            return lapTime;
                                        }
                                        return null;
                                        
                                    },
                                    
                                    Reset: function(){
                                        startTime = 0;
                                        elapsedTime = 0;
                                        lapElapsedTime = 0;
                                        this.log = [];
                                        _log.removeAll();
                                    },
                                    GetElapsedTime: function(){
                                        var currentTime = (new Date).getTime();
                                        if(running)
                                        {
                                            elapsedTime += currentTime - startTime;
                                            startTime = currentTime;
                                        }
                                        return elapsedTime;
                                    },
                                    GetName: function(){
                                        return NAME;
                                    },
                                    
                                    GetLap: function(lapName){
                                        return _log.get(lapName);  
                                    },
                                    
                                    RemoveLap: function(lapName){
                                        _log.remove(lapName);
                                    },
        
                                    GetVersion: function(){
                                        return VERSION;
                                    },

                                    GetPath: function(){
                                        return PATH;
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
