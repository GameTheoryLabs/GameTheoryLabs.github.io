//JaHOVA OS : Kernel : Command
//      Dependent on JaHOVA OS : Kernel

/**h* Kernel/Command
*  LINKS
* |html <p><a href="http://jahovaos.com/JaHOVA/Documentation/Full/toc_index.html">   Table of Contents </a></p>
*
*  NAME
*    JaHOVA OS Kernel Command Module
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
*     This singleton holds the Kernels Command Module
*     
*
*  EXAMPLE
*
*   command = com.jahova.os.Instance().Kernel.Instance().Command.Instance();
*   command = os.command;
**/
com.jahova.os.Instance().Kernel.Instance().Command = (function()
                        {
                            var pInstance;
                            /**m* Command/Constructor
                             *
                             *  SOURCE
                             */
                            function constructor()
                            {
                                //PRIVATE ATTRIBUTES
                                var NAME = "JaHOVA OS Kernel : Command Module";
                                var VERSION = "0v3";
                                var PATH = "scripts/jahova/OS/Kernel/jahova.os.kernel.command.js";
                                
                                var os = com.jahova.os.Instance();
                                var console = com.jahova.utilities.Instance().Console.Instance();
                             /*
                              **/
                                //PRIVATE METHODS
                                
                                
                                //INITIALIZATION

                                
                                return{
                                    //PUBLIC ATTRIBUTES
                                    /**o* Command/Core
                                    *   DESCRIPTION
                                    *       This holds a pointer to the Core object
                                    *       created by the Resource and Schedule Core Manager
                                    *       This allows for callbacks and OS Messages to reach the command Module
                                    *  SOURCE
                                    */
                                    Core: null,
                                    /*
                                     **/
                                    //PUBLIC PRIVILEDGE METHODS
                                    /**m* Command/GetName
                                    *
                                    *  SOURCE
                                    */
                                    GetName: function(){
                                        return NAME;
                                    },
                                    /*
                                     **/
                                    /**m* Command/GetVersion
                                    *
                                    *  SOURCE
                                    */
                                    GetVersion: function(){
                                        return VERSION;
                                    },
                                    /*
                                     **/
                                    /**m* Command/GetPath
                                    *
                                    *  SOURCE
                                    */
                                    GetPath: function(){
                                        return PATH;
                                    },
                                    /*
                                     **/
                                    /**m* Command/Interface
                                    *   DESCRIPTION
                                    *   This object will hold a pointer to all interface methods
                                    *   that are accessible to users for the OS
                                    *  SOURCE
                                    */
                                    Interface: null,
                                    /*
                                     **/
                                    /**m* Command/Initialize
                                    *
                                    *  SOURCE
                                    */
                                    Initialize: function(){
                                        os.console.AppendComment("Initializing Command Module\n");
                                    
                                        os.command.Interface = os.resschmgr.Create.Map();
                                        
                                        //Register with Resource and Schedule Manager
                                        var id = os.resschmgr.CoreManager.RegisterResource("com.jahova.os.kernel.command", os.command.GetPath(), false);
                                        
                                        //Get pointer to Core Object
                                        os.command.Core = os.resschmgr.CoreManager.GetCoreByID(id);
                                        
                                        os.command.Core.OnRequest = os.command.OnRequest;
                                        
                                        //Activate Module with Resource and Schedule Module
                                        os.resschmgr.CoreManager.ActivateResource(id);
                                        
                                        //Load Interface Methods
                                        os.command.Interface.put("GetResources", os.command.GetResources);
                                        os.command.Interface.put("Display", os.command.Display);
                                        
                                    },
                                    /*
                                     **/
                                    /**m* Command/OnRequest
                                    *
                                    *  SOURCE
                                    */
                                    OnRequest:function(input){
                                        var request = input.jahovaos;
                                        var numOfRequest = request.length;
                                        
                                        //Loop through sending all request received
                                        for(var i = 0; i < numOfRequest; i++)
                                        {
                                            
                                            if(request[i].InterfaceName != null){//Try Call by interface name 
                                                (os.command.Interface.get(request[i].InterfaceName))(request[i]);
                                            }
                                            else{//Try call by Interface ID
                                                (os.command.Interface.get(request[i].InterfaceID))(request[i]);
                                            }
                                            
                                        }
                                    },
                                    /*
                                     **/
                                    //
                                    //  Interface Methods
                                    //
                                    /**m* Command/Display
                                    *   DESCRIPTION
                                    *       Interface Method that will Display a JaHOVA Instruction
                                    *       to Console
                                    *  SOURCE
                                    */
                                    Display: function(request){
                                        var time = (new Date()).getTime();
    
                                        console.AppendComment("Kernel::Command Module:: Request Received");
                                        console.AppendComment("Current Time: " + time);
                                        console.AppendComment("Transit Time: " + (time - request.SendTime) + "ms");
                                        console.AppendComment("     Sender ID:       " + request.SenderID);
                                        console.AppendComment("     Receiver ID:     " + request.ReceiverID);
                                        console.AppendComment("     Data:         "    + request.Data);
                                        console.AppendComment("     Priority:        " + request.Priority);
                                        console.AppendComment("     Interface ID:    " + request.InterfaceID);
                                        console.AppendComment("     Interface Name:  " + request.InterfaceName);
                                        console.AppendComment("     Send Time:       " + request.SendTime);
                                        console.AppendComment("     Delivery Time:   " + request.DeliveryTime);
                                        console.AppendComment("     Call Back Func:  " + request.CallBackFunction);
                                        console.AppendComment("     Call Back ID:    " + request.CallBackInterfaceID);
                                    
                                        console.Comment("");
                                    },
                                    /*
                                     **/
                                    /**m* Command/GetResources
                                    *   DESCRIPTION
                                    *       Interface Method that will responds with a
                                    *       JaHOVA Instrution holding all currently registered
                                    *       Resources in a single obect in the following form:
                                    *       { id, name, path }
                                    *  SOURCE
                                    */
                                    GetResources: function(request){
                                        //console.Comment("Command::GetResources");
                                        var res = os.resschmgr.CoreManager.GetAllResources();
                                        var data = [];
                                        var numOfResources = res.length;
                                        
                                        for(var i = 0; i < numOfResources; i++){
                                            data.push({"id": res[i].GetID(), "name": res[i].name, "path" : res[i].path})
                                        }
                                            
                                        //Get current time
                                        var time = (new Date()).getTime();
                                        
                                        //Create A New Instruction
                                        var response = os.resschmgr.Create.Instruction();
                                        
                                        //Set Instruction Values
                                        response.SenderID               = os.command.Core.GetID();      //Resource ID requesting execution
                                        response.ReceiverID             = request.SenderID;             //Resource ID or resource to be executed
                                        response.Data                   = data;                         //Data, input parameters, arguments to be used by interface
                                        response.Priority               = request.Priority;             //Priority level of request, only used if allowed
                                        response.InterfaceID            = request.CallBackInterfaceID;  //ID of interface method being requested
                                        response.InterfaceName          = request.CallBackFunction;     //Name of interface method being requested
                                        response.SendTime               = time;                         //Time of request
                                        response.DeliveryTime           = time;                         //Time of Interpreter calling interface
                                        response.CallBackInterfaceID    = request.CallBackInterfaceID;  //Call Back Interface ID, allows external cores to associate a call back function
                                        
                                        var output = [];
                                        output.push(response);
                                        
                                        //Send Response
                                        var core = os.resschmgr.CoreManager.GetCoreByID(response.ReceiverID)
                                        var EventObject = os.resschmgr.EventManager.GetEventObjectByName(core.name);
                                        var onRequestEvent = EventObject.GetEventsByName("onRequest")[0];
                                        os.command.Core.SendRequest.apply(onRequestEvent, [output]);
                                    }
                                    /*
                                     **/
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
