//JaHOVA OS : Cores : Thread
//      Dependent on JaHOVA OS : Cores

/**h* InternalCores/Network
*  LINKS
* |html <p><a href="http://jahovaos.com/JaHOVA/Documentation/Full/toc_index.html">   Table of Contents </a></p> 
*
*  NAME
*    JaHOVA OS Multithreading Core
*    
*  AUTHOR
*   Corey Clark
*   cclark@coreyclarkphd.com
*
*  HISTORY
*   Created: 8/6/2011
*   
*
*  DESCRIPTION
*     This Singleton holds the Internal JaHOVA OS Multithreading Core
*
*  EXAMPLE
*     network = com.jahova.os.Instance().Cores.Instance().Multithreading.Instance();
*
**/

/*
    Features
    Create Thread
        Delayed Execution - Need Execute Method
        Immediate Execution
    Static Type - loads a .js file
    Dynamic Type, creates a blob
    Conditional Execution
        Only executed after dependencies from other threads have been met
        Paused variable, increment for depencies, decrement when finsihed
        List of pending threads, calls paused variable of dependent thread
    Name assigned by user
    Send new inputs to thread
    Update Callback function of thread
    Create Thread Pool
        Set number of workers for given thread
    Delete Thread
    Set Max Threads
*/
com.jahova.os.Instance().Cores.Instance().Threads = (function()
                        {
                            var pInstance;
                    
                            function constructor()
                            {
                                //
                                //PRIVATE ATTRIBUTES
                                //
                                var NAME = "JaHOVA OS Internal API : Multithreading Core";
                                var VERSION = "0v3";
                                var PATH = "scripts/jahova/OS/Cores/jahova.os.cores.thread.js";
                                var ID = null;
                                
                                var os = com.jahova.os.Instance();
                                var utilities = com.jahova.utilities.Instance();
                                
                                //
                                //  API Specific Private Variables
                                //
                                
                                
                                
                                //
                                //PRIVATE METHODS
                                //
                                
                                //
                                //Private Classes
                                //
                                var CThread = function(Name, Type, Priority, Pool, MaxThreadCount){
                                    this.ID = os.threads.ThreadManager.NextID++;
                                    this.name = Name;
                                    this.type = Type;
                                    this.pool = Pool;
                                    this.frame = null;
                                    this.maxThreadCount = MaxThreadCount;
                                    this.priority = Priority;
                                    this.callbacks = os.resschmgr.Create.Map();
                                }
                                CThread.prototype.Suspend = function(input){
                                    var cmd =  new CCommand();
                                    
                                    cmd.msgType = "SUSPENDTHREAD";
                                    //cmd.data = input;
                                    cmd.priority = 0;
                                    cmd.sendTime = (new Date()).getTime();
                                    cmd.osThreadID = this.ID;
                                    
                                    os.threads.ThreadManager.SendToController(cmd.Serialize());
                                };
                                
                                CThread.prototype.Resume = function(input){
                                    var cmd =  new CCommand();
                                    
                                    cmd.msgType = "RESUMETHREAD";
                                    //cmd.data = input;
                                    cmd.priority = 0;
                                    cmd.sendTime = (new Date()).getTime();
                                    cmd.osThreadID = this.ID;
                                    
                                    os.threads.ThreadManager.SendToController(cmd.Serialize());
                                };
                                
                                CThread.prototype.GetSuspendCount = function(input){
                                    var cmd =  new CCommand();
                                    
                                    cmd.msgType = "GETSUSPENDCOUNT";
                                    //cmd.data = input;
                                    cmd.priority = 0;
                                    cmd.sendTime = (new Date()).getTime();
                                    cmd.osThreadID = this.ID;
                                    
                                    os.threads.ThreadManager.SendToController(cmd.Serialize());
                                };
                                CThread.prototype.Execute = function(input){
                                    var cmd = new CCommand();
                                    
                                    cmd.msgType = "EXECUTETHREAD";
                                    cmd.data = input;
                                    cmd.priority = 0;
                                    cmd.sendTime = (new Date()).getTime();
                                    cmd.osThreadID = this.ID;
                                    
                                    os.threads.ThreadManager.SendToController(cmd.Serialize());
                                };
                                
                                CThread.prototype.SetPriority = function(input){
                                    var cmd = new CCommand();
                                    
                                    cmd.msgType = "SETPRIORITY";
                                    cmd.data = input;
                                    cmd.priority = 0;
                                    cmd.sendTime = (new Date()).getTime();
                                    cmd.osThreadID = this.ID;
                                    
                                    os.threads.ThreadManager.SendToController(cmd.Serialize());
                                };
                                
                                CThread.prototype.GetPriority = function(){
                                    var cmd = new CCommand();
                                    
                                    cmd.msgType = "GETPRIORITY";
                                    //cmd.data = input;
                                    cmd.priority = 0;
                                    cmd.sendTime = (new Date()).getTime();
                                    cmd.osThreadID = this.ID;
                                    
                                    os.threads.ThreadManager.SendToController(cmd.Serialize());
                                };
                                
                                CThread.prototype.AddTask = function(input){
                                    var cmd = new CCommand();
                                    
                                    cmd.msgType = "ADDTASK";
                                    cmd.data = input;
                                    cmd.priority = 0;
                                    cmd.sendTime = (new Date()).getTime();
                                    cmd.osThreadID = this.ID;
                                    
                                    os.threads.ThreadManager.SendToController(cmd.Serialize());
                                };
                                
                                CThread.prototype.GetPendingTask = function(){
                                    var cmd = new CCommand();
                                    
                                    cmd.msgType = "GETPENDINGTASK";
                                    //cmd.data = input;
                                    cmd.priority = 0;
                                    cmd.sendTime = (new Date()).getTime();
                                    cmd.osThreadID = this.ID;
                                    
                                    os.threads.ThreadManager.SendToController(cmd.Serialize());
                                };
                                
                                CThread.prototype.Exit = function(){
                                    var cmd = new CCommand();
                                    
                                    cmd.msgType = "EXITTHREAD";
                                    //cmd.data = input;
                                    cmd.priority = 0;
                                    cmd.sendTime = (new Date()).getTime();
                                    cmd.osThreadID = this.ID;
                                    
                                    os.threads.ThreadManager.SendToController(cmd.Serialize());
                                };
                                
                                CThread.prototype.SetMaxThreadCount = function(input){
                                    var cmd = new CCommand();
                                    
                                    cmd.msgType = "SETMAXTHREADCOUNT";
                                    cmd.data = input;
                                    cmd.priority = 0;
                                    cmd.sendTime = (new Date()).getTime();
                                    cmd.osThreadID = this.ID;
                                    
                                    os.threads.ThreadManager.SendToController(cmd.Serialize());
                                };
                                CThread.prototype.GetFunction = function(){
                                    var cmd = new CCommand();
                                    
                                    cmd.msgType = "GETFUNCTION";
                                    //cmd.data = input;
                                    cmd.priority = 0;
                                    cmd.sendTime = (new Date()).getTime();
                                    cmd.osThreadID = this.ID;
                                    
                                    os.threads.ThreadManager.SendToController(cmd.Serialize());
                                };
                                CThread.prototype.GetCurrentTask = function(){
                                    var cmd = new CCommand();
                                    
                                    cmd.msgType = "GETCURRENTTASK";
                                    //cmd.data = input;
                                    cmd.priority = 0;
                                    cmd.sendTime = (new Date()).getTime();
                                    cmd.osThreadID = this.ID;
                                    
                                    os.threads.ThreadManager.SendToController(cmd.Serialize());
                                };
                                CThread.prototype.GetFilename = function(){
                                    var cmd = new CCommand();
                                    
                                    cmd.msgType = "GETFILENAME";
                                    //cmd.data = input;
                                    cmd.priority = 0;
                                    cmd.sendTime = (new Date()).getTime();
                                    cmd.osThreadID = this.ID;
                                    
                                    os.threads.ThreadManager.SendToController(cmd.Serialize());
                                };
                                CThread.prototype.AddCallback = function(){
                                    
                                };
                                
                                CThread.prototype.RemoveCallback = function(){
                                    
                                };
                                
                                CThread.prototype.GetStatus = function(){
                                    var cmd = new CCommand();
                                    
                                    cmd.msgType = "GETTHREADSTATUS";
                                    //cmd.data = input;
                                    cmd.priority = 0;
                                    cmd.sendTime = (new Date()).getTime();
                                    cmd.osThreadID = this.ID;
                                    
                                    os.threads.ThreadManager.SendToController(cmd.Serialize());
                                };
                                
                                var CCommand = function(){
                                    this.msgID = os.threads.ThreadManager.NextMessageID++;
                                    this.msgType;
                                    this.data;
                                    this.priority;
                                    this.sendTime;
                                    this.deliveryTime;
                                    this.osThreadID;
                                    this.cntrlThreadID;
                                    this.callbackCoreID;
                                    this.callbackFunctionID;
                                };
                                
                                CCommand.prototype.Serialize = function(){
                                    return JSON.stringify(this);
                                };
                                
                                CCommand.prototype.Parse = function(input){
                                    var temp = JSON.parse(input);
                                    
                                    this.msgID              = temp.msgID;
                                    this.msgType            = temp.msgType;
                                    this.data               = temp.data;
                                    this.priority           = temp.priority;
                                    this.sendTime           = temp.sendTime;
                                    this.deliveryTime       = temp.deliveryTime;
                                    this.osThreadID         = temp.osThreadID;
                                    this.cntrlThreadID      = temp.cntrlThreadID;
                                    this.callbackCoreID     = temp.callbackCoreID;
                                    this.callbackFunctionID = temp.callbackFunctionID;
                                };
                            

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
                                        
                                        //Initialize Thread Manager
                                        this.ThreadManager.Initialize();
                                    },
                                    
                                    //PUBLIC PRIVILEDGE OBJECTS
                                    ThreadManager: {
                                        NextID: 0,
                                        SharedWorkers: false,
                                        NextMessageID: 0,
                                        ThreadController: null,
                                        ThreadControllerPath: null,
                                        SWThreadControllerPath: null,
                                        ThreadPath:null,
                                        ThreadNameMap: null,
                                        ThreadIDMap: null,
                                        ThreadCallbacksMap: null,
                                        PendingCommandsMap: null,
                                        CommandFunctionsMap: null,
                                        Initialize: function(){
                                            
                                            os.console.AppendComment("Initializing Thread Core")
                                            
                                            //Create Maps
                                            os.console.AppendComment("        Creating Thread Maps");
                                            this.ThreadNameMap = os.resschmgr.Create.Map();
                                            this.ThreadIDMap = os.resschmgr.Create.Map();
                                            this.ThreadCallbacksMap = os.resschmgr.Create.Map();
                                            this.PendingCommandsMap = os.resschmgr.Create.Map();
                                            this.CommandFunctionsMap = os.resschmgr.Create.Map();
                                            
                                            //Set Controller Path
                                            this.ThreadControllerPath = "scripts/jahova/OS/Cores/Threads/jahova.os.cores.thread.controller.js";
                                            this.SWThreadControllerPath = "scripts/jahova/OS/Cores/Threads/jahova.os.cores.thread.swcontroller.js";
                                            os.console.AppendComment("        Path Set: " + this.ThreadControllerPath);
                                            
                                            //Set Dynamic Thread Path
                                            this.ThreadPath = 'scripts/jahova/OS/Cores/Threads/jahova.os.cores.thread.dynamic.js'
                                            os.console.AppendComment("        Set Dynamic Thread Path");
                                            
                                            //Testing for Web Worker Support
                                            if(window.Worker)
                                            {
                                                os.console.AppendComment("        Web Workers Supported: true");
                                                //Testing for Shared Worker capability
                                                if(window.SharedWorker)
                                                {
                                                    this.SharedWorkers = true;
                                                }
                                                
                                                os.console.AppendComment("        Shared Workers Supported: " + this.SharedWorkers);
                                                
                                                
                                            }
                                            else
                                            {
                                                os.console.AppendComment("        Web Workers Supported: false");
                                            }
                                            
                                            
                                            
                                            
                                        },
                                        CreateThread: function(name, type, priority, suspend, callback, filename, input, pool, maxThreadCount){
                                            
                                            var thread = null
                                            
                                            //Verify name does not already exist
                                            if(!this.ThreadNameMap.get(name))
                                            {
                                                //Create Thread Object
                                                thread = new CThread(name, type, priority, pool, maxThreadCount);
                                                
                                                if(callback){thread.callbacks.put(callback, callback);};
                                                
                                                if(this.SharedWorkers)
                                                {
                                                    thread.frame = document.createElement("iframe");
                                                    thread.frame.style.display = "none";
                                                    thread.frame.name = thread.name;
                                                    thread.frame.id = thread.ID;
                                                    document.body.appendChild(thread.frame);
                                                    
                                                    
                                                    var script = document.createElement("script");
                                                    script.type = "text/javascript";
                                                    script.src = "scripts/jahova/OS/Cores/Threads/jahova.os.cores.thread.swdynamic.js";
                                                    thread.frame.contentDocument.head.appendChild(script);
                                                }
                                                
                                                
                                                //Register with the Thread Manager Maps
                                                this.ThreadIDMap.put(thread.ID, thread);
                                                this.ThreadNameMap.put(thread.name, thread);
                                                
                                                // {id, name, type, priority, pooled, maxPooledThreads, suspend, filename, data{func: , input: }}
                                                var data ={
                                                    id: thread.ID,
                                                    name: thread.name,
                                                    type: thread.type,
                                                    priority: thread.priority,
                                                    pooled: thread.pool,
                                                    maxPooledThreads: thread.maxThreadCount,
                                                    suspend: suspend,
                                                    filename: filename,
                                                    data:{
                                                        func: filename,
                                                        input: input
                                                    }
                                                }
                                                //Send CCommand to Thread Controller to create Thread
                                                var cmd = new CCommand();
                                                
                                                cmd.msgType = "CreateThread";
                                                cmd.data = JSON.stringify(data);
                                                cmd.priority = priority;
                                                cmd.sendTime = (new Date()).getTime();
                                                cmd.deliveryTime;
                                                cmd.osThreadID = thread.ID;
                                                cmd.cntrlThreadID = null;
                                                cmd.callbackCoreID = callback;
                                                cmd.callbackFunctionID;
                                                    
                                                this.SendToController(cmd.Serialize());
                                                
                                            }
                                            
                                            return thread;
                                        },
                                        ExitThread: function(){
                                            
                                        },
                                        GetFunctionBody: function(func){
                                            var start = func.indexOf("{") + 1;
                                            var end = func.lastIndexOf("}");
                                            
                                            var body = func.slice(start,end);
                                            
                                            return body;
                                        },
                                        GetThreadByName: function(name){
                                            return this.ThreadNameMap.get(name);
                                        },
                                        GetThreadByID: function(){
                                            
                                        },
                                        CreateThreadController: function(){
                                            
                                            if(this.ThreadController == null)
                                            {
                                                //os.console.AppendComment("Controller Doesnt Exist");
                                                if(window.Worker)
                                                {
                                                    //os.console.AppendComment("Workers Exist");
                                                    if(this.SharedWorkers)
                                                    {
                                                        //os.console.AppendComment("Creating Shared Worker");
                                                        this.ThreadController = new SharedWorker(this.SWThreadControllerPath);
                                                        this.ThreadController.port.start();
                                                        this.ThreadController.port.onmessage = this.ProcessControllerRequest;
                                                        
                                                        var cmd = new CCommand();
                                                        cmd.msgType = "Start";
                                                        cmd.data = "Core Requesting Controller Initialize";
                                                        
                                                    }
                                                    else
                                                    {
                                                        
                                                        //os.console.AppendComment("Creating Nested Worker");
                                                        this.ThreadController = new Worker(this.ThreadControllerPath);
                                                        this.ThreadController.addEventListener('message',this.ProcessControllerRequest ,false);
                                                        var cmd = new CCommand();
                                                        cmd.msgType = "Start";
                                                        cmd.data = "Core Requesting Controller Initialize";
                                                        
                                                    }
                                                    
                                                    this.SendToController(cmd.Serialize());
                                                }
                                                else{
                                                    os.console.Comment("");
                                                    os.console.Warning("\nCan not create Thread Controller \nYour Browser Does Not Support Web Workers");
                                                }
                                            }
                                            else
                                            {
                                                os.console.Comment("");
                                                os.console.Warning("Thread Controller already exist");
                                            }
                                        },
                                        SendToController: function(JSONcmd){
                                            if(this.SharedWorkers){os.threads.ThreadManager.ThreadController.port.postMessage(JSONcmd);}
                                            else{os.threads.ThreadManager.ThreadController.postMessage(JSONcmd);}
                                             
                                        },
                                        ProcessControllerRequest: function(e){
                                            //Parse incomming Command
                                            var cmd = new CCommand();
                                            cmd.Parse(e.data);
                                            
                                            var thread = os.threads.ThreadManager.ThreadIDMap.get(cmd.osThreadID);
                                            
                                            //Test to see if thread exist
                                            if(thread)
                                            {
                                                numOfCallbacks = thread.callbacks.size;
                                                if(numOfCallbacks > 0)
                                                {
                                                    for(var i = 0; i++ < numOfCallbacks; thread.callbacks.next())
                                                    {
                                                        (thread.callbacks.value())(cmd);
                                                    }
                                                }
                                                else
                                                {
                                                    os.console.AppendComment("\nNo Callback Assigned For Thread");
                                                    os.console.AppendComment("Message Type: " + cmd.msgType +"\nMessage Data: " + cmd.data);
                                                }
                                            }
                                            else
                                            {
                                                os.console.AppendComment("\nNo Thread Found to Handle Command Callback");
                                                os.console.AppendComment("Message Type: " + cmd.msgType +"\nMessage Data: " + cmd.data);
                                            }
                                            
                                            
                                            os.console.Comment("");
                                        },
                                        CreateSocket: function(){
                                            var cmd = new CCommand();
                                    
                                            cmd.msgType = "CREATESOCKET";
                                            //cmd.data = input;
                                            cmd.priority = 0;
                                            cmd.sendTime = (new Date()).getTime();
                                            cmd.osThreadID = this.ID;
                                            
                                            os.threads.ThreadManager.SendToController(cmd.Serialize());
                                        },
                                        CloseSocket: function(){
                                            var cmd = new CCommand();
                                    
                                            cmd.msgType = "CLOSESOCKET";
                                            //cmd.data = input;
                                            cmd.priority = 0;
                                            cmd.sendTime = (new Date()).getTime();
                                            cmd.osThreadID = this.ID;
                                            
                                            os.threads.ThreadManager.SendToController(cmd.Serialize());
                                        }
                                        
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