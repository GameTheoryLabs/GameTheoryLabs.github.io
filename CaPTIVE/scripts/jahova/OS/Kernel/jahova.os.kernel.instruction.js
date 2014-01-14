//JaHOVA OS : Kernel : Instruction
//      Dependent on JaHOVA OS : Kernel

/**h* Kernel/Instruction
*  LINKS
* |html <p><a href="http://jahovaos.com/JaHOVA/Documentation/Full/toc_index.html">   Table of Contents </a></p>
*
*  NAME
*    JaHOVA OS Kernel Instruction Module
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
*     This module holds the Kernel Instruction Module.
*     
*
*  EXAMPLE
*   instruction = com.jahova.os.Instance().Kernel.Instance().Instruction.Instance();
*   
**/
com.jahova.os.Instance().Kernel.Instance().Instruction = (function()
                        {
                            var pInstance;
                            /**m* Instruction/Constructor
                             *
                             *  SOURCE
                             */
                            function constructor(){
                                
                                //PRIVATE ATTRIBUTES
                                var NAME = "JaHOVA OS Kernel : Instruction Module";
                                var VERSION = "0v3";
                                var PATH = "scripts/jahova/OS/Kernel/jahova.os.kernel.instruction.js";
                                var ID = null;

                                var os = com.jahova.os.Instance();
                                var utilities = com.jahova.utilities.Instance();
                            /*
                            **/
                                //PRIVATE METHODS
                                
                                return{
                                    //PUBLIC ATTRIBUTES
                                    
                                    //PUBLIC PRIVILEDGE METHODS
                                    /**m* Instruction/GetName
                                    *
                                    *  SOURCE
                                    */
                                    GetName: function(){
                                        return NAME;
                                    },
                                    /*
                                     **/
                                    /**m* Instruction/GetVersion
                                    *
                                    *  SOURCE
                                    */
                                    GetVersion: function(){
                                        return VERSION;
                                    },
                                    /*
                                     **/
                                    /**m* Instruction/GetPath
                                    *
                                    *  SOURCE
                                    */
                                    GetPath: function(){
                                        return PATH;
                                    },
                                    /*
                                     **/
                                    /**m* Instruction/GetID
                                    *
                                    *  SOURCE
                                    */
                                    GetID: function(){
                                        return ID;
                                    },
                                    /*
                                     **/
                                    /**o* Instruction/Core
                                    *   DESCRIPTION
                                    *       Holds a pointer to the Core Object created by
                                    *       Resource and Schedule Core Manager upon
                                    *       Module Activation
                                    *  SOURCE
                                    */
                                    Core: null,
                                    /*
                                     **/
                                    /**m* Instruction/Initialize
                                    *
                                    *  SOURCE
                                    */
                                    Initialize: function(){
                                        os.console.AppendComment("Initializing Instruction Module");
                                        
                                        os.console.AppendComment("     Initializing Router");
                                        this.Router.Initialize();
                                        
                                        os.console.AppendComment("");
                                        
                                        //Register Resource and Schedule Manager
                                        //  Create a Core Instance and sets ID
                                        //os.console.AppendComment("Registering Instruction Module")
                                        ID = os.resschmgr.CoreManager.RegisterResource("com.jahova.os.kernel.instruction", PATH, false);
                                        
                                        //os.console.AppendComment("        Adding Instruction Core to Cores Map");
                                        //Save a pointer to instance of Core loacted in Core Manager
                                        this.Core = os.resschmgr.CoreManager.Cores.get(ID);
                                        //os.console.AppendComment("            Name: " + this.Core.name);
                                        //os.console.AppendComment("            ID:   " + this.Core.GetID());                                        
                                        
                                        //os.console.AppendComment("");
                                        
                                        //Activation with OS a success
                                        var activationSuccess = false;
   
                                        //os.console.AppendComment("        Setting State");
                                        //Update State to Executed: 1
                                        this.Core.SetState(1);
                                        //os.console.AppendComment("            State: " + this.Core.GetState());
                                        
                                        
                                        //os.console.AppendComment("        Setting Callback function");
                                        //Set Callback for Messages from OS
                                        this.Core.OnRequest = this.AddRequest;
                                        
                                        //os.console.AppendComment("            Callback function: " + this.Core.onRequest);
                                        
                                       //os.console.AppendComment("");
                                        //os.console.AppendComment("Activating Instruction Module");
                                        //ACTIVATE WITH RESOURCE AND SCHEDULE MANAGER MODULE
                                        //  INPUT: Core ID and Callback Function for Instructions
                                        os.resschmgr.CoreManager.ActivateResource(this.Core.GetID());
                                        
                                        //Test to see if state was updated to Registered: 2
                                        if(this.Core.GetState() == 2)
                                        {
                                            activationSuccess = true;   
                                        }
                                        
                                        //os.console.AppendComment("        Activation Success: " + activationSuccess);
                                        
                                        //ACTIVATE WITH RESOURCE AND SCHEDULE MANAGER MODULE
                                        //  INPUT: Core ID and Callback Function for Instructions
                                        //os.console.AppendComment("");
                                        //os.console.AppendComment("Activating Resource and Schedule Manager Module");
                                        //os.resschmgr.CoreManager.ActivateResSchMgrModule();
                                        
                                        //Test to see if state was updated to Registered: 2
                                        var ResSchSuccess = false;
                                        if(os.resschmgr.Core.GetState() == 2)
                                        {
                                             ResSchSuccess = true;   
                                        }
                                        
                                        //os.console.AppendComment("        Activation Success: " + ResSchSuccess);
                                        //os.console.AppendComment("");
                                        return activationSuccess;
                                    },
                                    /*
                                     **/
                                    /**m* Instruction/AddRequest
                                    *
                                    *  SOURCE
                                    */
                                    AddRequest: function( Requests){
                                        //Standard JaHOVA OS Event
                                        if(Requests instanceof MouseEvent)
                                        {
                                            //os.console.AppendComment("Instruction Module: Click Request Received, " + Requests.jahovaos.length + " request in package");
                                            //os.console.AppendComment("Instruction Module: Click Request From - ID: " + Requests.jahovaos[0].SenderID );
                                            //os.console.AppendComment("Instruction Module: Click Request To - ID: " + Requests.jahovaos[0].ReceiverID );
                                            //os.console.Comment("Instruction Module: Click Request Calling Method - ID: " + Requests.jahovaos[0].InterfaceName ); 
                                            os.instruction.Router.Process(Requests.jahovaos); 
                                        }
                                        // Message from WebWorker
                                        else if(Requests.target instanceof Worker)
                                        {
                                            //os.console.AppendComment("Instruction Module: WebWorker Request Received, " + Requests.data.length + " request in package");
                                            //os.console.AppendComment("Instruction Module: WebWorker Request From - ID: " + Requests.data[0].SenderID );
                                            //os.console.AppendComment("Instruction Module: WebWorker Request To - ID: " + Requests.data[0].ReceiverID );
                                            //os.console.Comment("Instruction Module: Click Request Calling Method - ID: " + Requests.data[0].InterfaceName ); 
                                            os.instruction.Router.Process(Requests.data);                                             
                                        }
                                        //CInstruction being passed
                                        else
                                        {
                                            //os.console.Comment("Instruction Module: Request Received, " + Requests.length + " request in package"); 
                                            os.instruction.Router.Process(Requests); 
                                        }
                                        
                                    },
                                    /*
                                     **/
                                    /**m* Instruction/AddResource
                                    *
                                    *  SOURCE
                                    */
                                    AddResource: function(core){
                                        //Adds a blank Q to Router::Cores for incomming request
                                        //  Uses Core ID as key to store values
                                        if(core.GetID() != ID)
                                        {
                                            this.Router.Cores.put(core.GetID(),{"info" : core, "requests" : os.resschmgr.Create.Queue()});
                                        }
                                    },
                                    /*
                                     **/
                                    /**m* Instruction/GetName
                                    *
                                    *  SOURCE
                                    */
                                    RemoveResource: function(core){
                                        this.Router.Cores.remove(core.GetID());
                                    },
                                    /*
                                     **/
                                    //PUBLIC OBJECTS
                                    /**o* Instruction/Router
                                    *
                                    *  DESCRIPTION
                                    *  This object processes all incomming instructions to OS
                                    *  and sends/routes to the appropriate cores/resources
                                    *
                                    *  SOURCE
                                    */
                                    Router: {
                                    /*
                                     **/
                                        /**o* Router/Request
                                        *   DESCRIPTION
                                        *   A Queue that holds all incomming instructions/request
                                        *  SOURCE
                                        */
                                        Requests: null,
                                        /*
                                         **/
                                        /**o* Router/Cores
                                        *   DESCRIPTION
                                        *   A Map that holds all regiestered cores that have been
                                        *   activated by Resource and Schedule Core Manager
                                        *  SOURCE
                                        */
                                        Cores: null,
                                        /*
                                         **/
                                        /**m* Router/Initialize
                                        *   
                                        *  SOURCE
                                        */
                                        Initialize: function(){
                                            this.Requests = os.resschmgr.Create.Queue();
                                            this.Cores = os.resschmgr.Create.Map();
                                        },
                                        /*
                                         **/
                                        /**m* Router/Process
                                        *   DESCRIPTION
                                        *   Used to break up incomming request into single instructions
                                        *   and add to the appropriate Core Queue
                                        *  SOURCE
                                        */
                                        Process: function(Requests){
                                            //Get request and store in core specific q
                                            var numOfRequest = Requests.length;
                                            for(var i = 0; i < numOfRequest; i++)
                                            {
                                                //Get Request
                                                var req = Requests.pop();
                                                
                                                //Get Core info from Cores Map for the given Reciever ID
                                                //  identified in current request
                                                var core = this.Cores.get(req.ReceiverID);
                                                //os.console.Comment("\nAdded: " + req.InterfaceName + "\nRequest Onto " + core.info.GetID() + ": " + core.info.name + " Queue");
                                                
                                                //Push request onto CoreQ
                                                core.requests.push(req);
                                       
                                            }
                                                
                                            this.Route();
                                                
                                        },
                                        /*
                                         **/
                                        /**m* Router/Route
                                        *   DESCRIPTION
                                        *   Checks cores queues and call their dispatch method for any pending
                                        *   instructions for the associated core
                                        *  SOURCE
                                        */
                                        Route: function(){
                                            //Call Interpreter for each core
                                            //  to deliver messages
                                            var numOfQs = this.Cores.size;
                                            
                                            for(var i = 0; i++ < numOfQs; this.Cores.next())
                                            {
                                                var core = this.Cores.value();
                                                
                                                if(core.requests.q.length > 0)
                                                {
                                                    var request = []
                                                    var numOfReq = core.requests.q.length;
                                                    
                                                    for(var j = 0; j < numOfReq; j++)
                                                    {
                                                        request.push(core.requests.q[j]);
                                                        core.requests.remove(j);
                                                    }
                                                    
                                                    //os.console.Comment("Calling " + core.info.name + " Dispatcher");
                                                    var EventObject = os.resschmgr.EventManager.GetEventObjectByName(core.info.name);
                                                    var onRequestEvent = EventObject.GetEventsByName("onRequest")[0];
                                                    core.info.Dispatcher.apply(onRequestEvent, [request]);
                                                }
                                                
                                            }
                                            
                                            
                                            //Check to see if there are any new request
                                            //  if so, call Process.  Otherwise exit
                                            if(this.Requests.q.length > 0)
                                            {
                                                this.Process();
                                            }
                                        }
                                        /*
                                         **/
                                    }
                                    

                                }
                                
                            }
                            
                            return {
                                //OBJECT ACCESSOR
                                Instance: function(){
                                    if(!pInstance){
                                        //Instantiate if pInstance does not exist
                                        pInstance = constructor();
                                    }
                                    
                                    return pInstance;
                                }
                            }
                        })();
