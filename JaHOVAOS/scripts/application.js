//JaHOVA OS Physics Multithreaded Application Demo

var os = com.jahova.os.Instance();
var util = com.jahova.utilities.Instance();
var console = util.Console.Instance();
var demo = {
    Core: null,
    Elements: {},
    Interface: null,
    Resources: null,
    Threads: null,
    Balls: null,
    viewPortWidth: null,
    viewPortHeight: null,
    top: null,
    left: null,
    width: null,
    height: null,
    
    OnRequest: function(input){
        //os.console.AppendComment("Demo::OnRequest - Request Received");
        var request = input.jahovaos;
        var numOfRequest = request.length;
        
        //Loop through sending all request received
        for(var i = 0; i < numOfRequest; i++)
        {
            
            if(request[i].InterfaceName != null){//Try Call by interface name 
                //os.console.AppendComment("Demo::OnRequest - Calling " + request[i].InterfaceName);
                (demo.Interface.get(request[i].InterfaceName))(request[i]);
            }
            else{//Try call by Interface ID
                //os.console.AppendComment("Demo::OnRequest - Calling " + request[i].InterfaceID);
                (demo.Interface.get(request[i].InterfaceID))(request[i]);
            }
            
        }
        //console.Comment("");
        
    },
    ThreadInitialize: function(req){
        //os.console.Comment("Demo::ThreadInitialize - Initializing Thread");
        
        demo.SetResources(req);
        
        var iThread = demo.Threads.get(req.InterfaceID);
        var request = os.resschmgr.Create.Instruction();
        
        var time = (new Date()).getTime();
        
        request.SenderID                = demo.Core.GetID();    //Resource ID requesting execution
        request.ReceiverID              = iThread.GetID();      //Reource ID or resource to be executed
        request.Data                    = req.Data;             //Data, input parameters, arguments to be used by interface
        request.Priority                = req.Priorty;          //Priority level of request, only used if allowed
        request.InterfaceID             = req.InterfaceID;      //ID of interface method being requested
        request.InterfaceName           = "SetResources";       //Name of Interface Method being requested
        request.SendTime                = time;                 //Time of request
        request.DeliveryTime            = time;                 //Time of Dispatcher calling Interface
        request.CallBackFunction        = "CreateBall";         //Callback function, function objects only allowed for internal cores, otherwise name
        request.CallBackInterfaceID     = req.InterfaceID;      //Callback Interface ID, allows external cores to associate a callaback function
        
        var output = [];
        output.push(request);
        var EventObject = os.resschmgr.EventManager.GetEventObjectByName(os.instruction.Core.name);
        var onRequestEvent = EventObject.GetEventsByName("onRequest")[0];
        //demo.Core.SendRequest.apply(onRequestEvent, [output]);
        os.instruction.AddRequest(output);

    },
    
    SetResources: function(request){
        //os.console.Comment("Demo::SetResources - Setting Resources");
        var res = request.Data;
        var numOfResources = res.length;;
        demo.Resources.removeAll();
        
        for(var i = 0; i < numOfResources; i++)
        {
            demo.Resources.put(res[i].name, res[i].id);
        }
    },
    Initialize: function(){
        //os.console.AppendComment("-----  JaHOVA OS Multithreaded Physics Demo Application -----");
        demo.Interface = os.resschmgr.Create.Map();
        demo.Resources = os.resschmgr.Create.Map();
        demo.Threads = os.resschmgr.Create.Map();
        demo.Balls = os.resschmgr.Create.Map();
        
        var activation = false;
        var name = "Demo";
        var path = "scripts/application.js";
        
        //--------------------------------
        //  OS Registration and Activation
        //--------------------------------
        
        //Register with OS and get ID
        var id = os.resschmgr.CoreManager.RegisterResource(name, path, false);
        
        //Get a pointer to Core Object
        demo.Core = os.resschmgr.CoreManager.GetCoreByID(id);
        
        //Update State to Executed: 1
        demo.Core.SetState(1);
        
        //Set Callback for OS Request
        demo.Core.OnRequest = demo.OnRequest;
        
        //Activate Demo with OS
        os.resschmgr.CoreManager.ActivateResource(demo.Core.GetID());
        
        //Verify Activation Successful
        if(demo.Core.GetState() == 2)
        {
            activation = true;
        }
        
        //os.console.AppendComment("Demo Activation Success");
        
        //--------------------------------
        //  Add Interface Methods
        //--------------------------------
        
        //os.console.AppendComment("Adding Interface Methods to Map");
        demo.Interface.put("com_jahova_resources", demo.SetResources);
        demo.Interface.put("ThreadInitialize", demo.ThreadInitialize);
        demo.Interface.put("Update", demo.Update);
        demo.Interface.put("CreateThread", demo.CreateThread);
        demo.Interface.put("CreateBall", demo.CreateBall);
        
        //os.console.AppendComment("Creating Output Window");
        //Get dimensions of window
        demo.viewPortWidth = window.innerWidth;
        demo.viewPortHeight = window.innerHeight;

        demo.width = (demo.viewPortWidth * 0.667).toFixed(0);
        demo.height = (demo.viewPortHeight * 0.667).toFixed(0);
        demo.top = ((demo.viewPortHeight * 0.333) / 2).toFixed(0);
        demo.left = ((demo.viewPortWidth * 0.333) / 2).toFixed(0);
        
        
        
        this.myWindow = os.resschmgr.Create.Window("threadDemo", "Multithreaded Physics Demo", demo.width, demo.height, demo.top, demo.left)
        
        this.myWindow.Elements.Body.innerHTML = "Output Window of JaHOVA Application<br />10 Threads: One for each ball";
        
        
        os.console.Disable();
        
        demo.CreateThread();
        demo.CreateThread();
        demo.CreateThread();
        demo.CreateThread();
        demo.CreateThread();
        demo.CreateThread();
        demo.CreateThread();
        demo.CreateThread();
        demo.CreateThread();
        demo.CreateThread();
    },
    CreateThread: function(){
        //os.console.AppendComment("Demo::CreateThread");
        var activation = false;
        var Thread = {};
        Thread.name = "Thread" + demo.Threads.size;
        Thread.path = "scripts/thread.js";
        
        //Register Thread with OS and obtain ID
        Thread.id = os.resschmgr.CoreManager.RegisterResource(Thread.name, Thread.path, true);
        
        //Get pointer to Core Object in OS
        Thread = os.resschmgr.CoreManager.GetCoreByID(Thread.id);
        
        //Add thread to Map
        demo.Threads.put(Thread.GetID(), Thread);
        
        //Activate Thread
        os.resschmgr.CoreManager.ActivateResource(Thread.GetID());
        
        //Test for successful activation, State: 2
        if(Thread.GetState() == 2){
            activation = true;
            //os.console.AppendComment("Thread Successfully Activated");
        }
        
        //os.console.AppendComment("Creating Instruction");
        var request = os.resschmgr.Create.Instruction();
        var time = (new Date()).getTime();
        
        //Set Instruction Values
        request.SenderID               = demo.Core.GetID();            //Resource ID requesting execution
        request.ReceiverID             = os.command.Core.GetID();           //Resource ID or resource to be executed
        request.Data                   = null;                         //Data, input parameters, arguments to be used by interface
        request.Priority               = demo.Threads.size - 1;        //Priority level of request, only used if allowed
        request.InterfaceID            = null;                         //ID of interface method being requested
        request.InterfaceName          = "GetResources";               //Name of interface method being requested
        request.SendTime               = time;                         //Time of request
        request.DeliveryTime           = time;                         //Time of Interpreter calling interface
        request.CallBackFunction       = "ThreadInitialize";           //CallBack Function, only allowed for internal OS cores
        request.CallBackInterfaceID    = Thread.GetID();               //Call Back Interface ID, allows external cores to associate a call back function 
        
        var output = [];
        output.push(request);
        //os.console.AppendComment("Sending Request to Instruction Module");
        var EventObject = os.resschmgr.EventManager.GetEventObjectByName(os.instruction.Core.name);
        var onRequestEvent = EventObject.GetEventsByName("onRequest")[0];
        demo.Core.SendRequest.apply(onRequestEvent, [output]);
        
        //os.console.Comment(""); 
        
        
        
    },
    CreateBall: function(request){
        //os.console.Comment("Demo::CreateBall");
        
        //***************************
        //  Creating Physics Entity
        //***************************
        
        var entity = {};
        entity.posX = Number(demo.left) + 20 * (Number(request.SenderID) - 8);
        entity.posY = Number(demo.top) - 10;
        entity.velX = 30;
        entity.velY = 30;
        entity.xBoundMin = 7;//Number(demo.left);
        entity.xBoundMax = Number(demo.width) - 7; //Number(demo.left) + Number(demo.width);
        entity.yBoundMin = Number(demo.top) + 7;
        entity.yBoundMax = Number(demo.height) - 7;//Number(demo.top) + Number(demo.height);
        entity.dt = 1;
        entity.coefOfRes = 0.5;
        
        //***************************
        //  Creating Graphics Entity
        //***************************
        
        var objDiv = document.createElement("div");
        objDiv.style.position = "absolute";
        //objDiv.zIndex = 100;
        objDiv.style.width = "24px";
        objDiv.style.height = "24px";
        objDiv.style.top = (Number(demo.top) - 14) + "px";
        objDiv.style.left = (Number(demo.left) + 14) + "px";
        objDiv.style.backgroundColor = "rgba(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) +", 0.2)";
        
        var obj = document.createElement("img");
        obj.src = os.GetDomain() + "images/close.gif";
        obj.style.align = "middle";
        
        objDiv.appendChild(obj);
        //document.body.appendChild(objDiv);
        
        demo.myWindow.Elements.Window.appendChild(objDiv);
        //Saving Graphics Entity to Map
        demo.Balls.put(request.SenderID, objDiv);
        
        var out = os.resschmgr.Create.Instruction();
        
        out.Data = entity;
        out.DeliveryTime = (new Date()).getTime() - 1;
        out.SenderID = request.SenderID;
        out.ReceiverID = demo.Core.GetID();
        demo.Update(out);
        
    },
    Update: function(request){
        
        var input = request.Data;
        var time = new Date();
        var iThread = demo.Threads.get(request.SenderID);
        var iBall = demo.Balls.get(request.SenderID);
        
        input.dt = (time.getTime() - request.DeliveryTime) / 100;
        
        iBall.style.left = Math.round(input.posX) + "px";
        iBall.style.top = Math.round(input.posY) + "px";
        
        if((Math.abs(input.velY) < 1.7) && (Math.abs(input.posY - input.yBoundMax) < 2.5)){
            input.velY = null;
            input.posY = input.yBoundMax;
        }
        
        if((Math.abs(input.velX) < 2.0)){
            input.velX = 0.0;
            demo.myWindow.Elements.Window.removeChild(iBall);
            demo.Balls.remove(request.SenderID);
            
        }
        
        else if(((Math.abs(input.velX) > 0.01) || (Math.abs(input.velY) > 0.01))){
             var out = os.resschmgr.Create.Instruction();
    
            //Set Instruction Values
            out.SenderID               = demo.Core.GetID();            //Resource ID requesting execution
            out.ReceiverID             = request.SenderID;                        //Resource ID or resource to be executed
            out.Data                   = input;                         //Data, input parameters, arguments to be used by interface
            out.InterfaceName          = "UpdatePosition";               //Name of interface method being requested
            out.SendTime               = time.getTime();                         //Time of request
            out.DeliveryTime           = time.getTime();                         //Time of Interpreter calling interface
            out.CallBackFunction       = "Update";            //CallBack Function, only allowed for internal OS cores

            
            var output = [];
            output.push(out);
            var EventObject = os.resschmgr.EventManager.GetEventObjectByName(os.instruction.Core.name);
            var onRequestEvent = EventObject.GetEventsByName("onRequest")[0];
            demo.Core.SendRequest.apply(onRequestEvent, [output]);    
        }
        
        if(demo.Balls.size == 0)
        {
            demo.myWindow.Close();
            os.console.Enable();
        }
        
        //console.Clear();
    }
    
    
}
