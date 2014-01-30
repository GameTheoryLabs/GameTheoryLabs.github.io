//JaHOVA OS Physics Multithreaded Application demoII

var os = com.jahova.os.Instance();
var util = com.jahova.utilities.Instance();
var console = util.Console.Instance();
var demoII = {
    Core: null,
    Elements: {},
    Interface: null,
    Resources: null,
    Threads: null,
    Balls: null,
    Shadows: null,
    viewPortWidth: null,
    viewPortHeight: null,
    top: null,
    left: null,
    width: null,
    height: null,
    // for 3d effect of ball and shadow
    scaler: null,
    invScaler: null,
    diaBall: null,
    diaBallScaled: null,
    hShadow: null,
    hShadowScaled: null,
    wShadow: null,
    wShadowScaled: null,
    shadowOffset: null,
    bottomBase: null,
    BallArray: [],
    ballDiv: null,
    imageWidth: 637,
    imageHeight: 412,
    
    
    OnRequest: function(input){
        //os.console.AppendComment("demoII::OnRequest - Request Received");
        var request = input.jahovaos;
        var numOfRequest = request.length;
        
        //Loop through sending all request received
        for(var i = 0; i < numOfRequest; i++)
        {
            
            if(request[i].InterfaceName != null){//Try Call by interface name 
                //os.console.AppendComment("demoII::OnRequest - Calling " + request[i].InterfaceName);
                (demoII.Interface.get(request[i].InterfaceName))(request[i]);
            }
            else{//Try call by Interface ID
                //os.console.AppendComment("demoII::OnRequest - Calling " + request[i].InterfaceID);
                (demoII.Interface.get(request[i].InterfaceID))(request[i]);
            }
            
        }
        //console.Comment("");
        
    },
    ThreadInitialize: function(req){
        //os.console.Comment("demoII::ThreadInitialize - Initializing Thread");
        
        demoII.SetResources(req);
        
        var iThread = demoII.Threads.get(req.InterfaceID);
        var request = os.resschmgr.Create.Instruction();
        
        var time = (new Date()).getTime();
        
        request.SenderID                = demoII.Core.GetID();    //Resource ID requesting execution
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
        //demoII.Core.SendRequest.apply(onRequestEvent, [output]);
        os.instruction.AddRequest(output);

    },
    
    SetResources: function(request){
        //os.console.Comment("demoII::SetResources - Setting Resources");
        var res = request.Data;
        var numOfResources = res.length;;
        demoII.Resources.removeAll();
        
        for(var i = 0; i < numOfResources; i++)
        {
            demoII.Resources.put(res[i].name, res[i].id);
        }
    },
    Initialize: function(){
        //os.console.AppendComment("-----  JaHOVA OS Multithreaded Physics demoII Application -----");
        demoII.Interface = os.resschmgr.Create.Map();
        demoII.Resources = os.resschmgr.Create.Map();
        demoII.Threads = os.resschmgr.Create.Map();
        demoII.Balls = os.resschmgr.Create.Map();
        demoII.Shadows = os.resschmgr.Create.Map();
        
        var activation = false;
        var name = "DemoII";
        var path = "scripts/jahova_2dDemo.js";
        
        //--------------------------------
        //  OS Registration and Activation
        //--------------------------------
        
        //Register with OS and get ID
        var id = os.resschmgr.CoreManager.RegisterResource(name, path, false);
        
        //Get a pointer to Core Object
        demoII.Core = os.resschmgr.CoreManager.GetCoreByID(id);
        
        //Update State to Executed: 1
        demoII.Core.SetState(1);
        
        //Set Callback for OS Request
        demoII.Core.OnRequest = demoII.OnRequest;
        
        //Activate demoII with OS
        os.resschmgr.CoreManager.ActivateResource(demoII.Core.GetID());
        
        //Verify Activation Successful
        if(demoII.Core.GetState() == 2)
        {
            activation = true;
        }
        
        //os.console.AppendComment("demoII Activation Success");
        
        //--------------------------------
        //  Add Interface Methods
        //--------------------------------
        
        //os.console.AppendComment("Adding Interface Methods to Map");
        demoII.Interface.put("com_jahova_resources", demoII.SetResources);
        demoII.Interface.put("ThreadInitialize", demoII.ThreadInitialize);
        demoII.Interface.put("Update", demoII.Update);
        demoII.Interface.put("CreateThread", demoII.CreateThread);
        demoII.Interface.put("CreateBall", demoII.CreateBall);
        
        //os.console.AppendComment("Creating Output Window");
        //Get dimensions of window
        demoII.viewPortWidth = window.innerWidth;
        demoII.viewPortHeight = window.innerHeight;

        demoII.width = demoII.imageWidth;//(demoII.viewPortWidth * 0.667).toFixed(0);
        demoII.height = demoII.imageHeight;//(demoII.viewPortHeight * 0.667).toFixed(0);
        demoII.top = ((demoII.viewPortHeight * 0.333) / 2).toFixed(0);
        demoII.left = ((demoII.viewPortWidth * 0.333) / 2).toFixed(0);
        
        demoII.ratio = 1;//((demoII.width - demoII.imageWidth) / (demoII.height - demoII.imageHeight)) + 1;
        
        
        
        this.myWindow = os.resschmgr.Create.Window("threadDemo", "Multithreaded Physics DemoII", demoII.width, demoII.height, demoII.top, demoII.left)
        
        this.myWindow.Elements.Body.innerHTML = "Output Window of JaHOVA Application<br />10 Threads: One for each ball";
        
        
        os.console.Disable();
        
        demoII.CreateThread();
        demoII.CreateThread();
        demoII.CreateThread();
        demoII.CreateThread();
        demoII.CreateThread();
        demoII.CreateThread();
        demoII.CreateThread();
        demoII.CreateThread();
        demoII.CreateThread();
        demoII.CreateThread();
    },
    CreateThread: function(){
        //os.console.AppendComment("demoII::CreateThread");
        var activation = false;
        var Thread = {};
        Thread.name = "Thread" + demoII.Threads.size;
        Thread.path = "scripts/thread.js";
        
        //Register Thread with OS and obtain ID
        Thread.id = os.resschmgr.CoreManager.RegisterResource(Thread.name, Thread.path, true);
        
        //Get pointer to Core Object in OS
        Thread = os.resschmgr.CoreManager.GetCoreByID(Thread.id);
        
        //Add thread to Map
        demoII.Threads.put(Thread.GetID(), Thread);
        
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
        request.SenderID               = demoII.Core.GetID();            //Resource ID requesting execution
        request.ReceiverID             = os.command.Core.GetID();           //Resource ID or resource to be executed
        request.Data                   = null;                         //Data, input parameters, arguments to be used by interface
        request.Priority               = demoII.Threads.size - 1;        //Priority level of request, only used if allowed
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
        demoII.Core.SendRequest.apply(onRequestEvent, [output]);
        
        //os.console.Comment(""); 
        
        
        
    },
    CreateBall: function(request){
        //os.console.Comment("demoII::CreateBall");
        
        //***************************
        //  Creating Physics Entity
        //***************************
        scaler = .5 + Math.random();
        invScaler = Math.abs(1/scaler);
        diaBall = 24;
        diaBallScaled = Math.round(diaBall * scaler);
        bottomBase = 72;
        bottomBaseScaled = Math.round(bottomBase * invScaler);
        var xBoundSub = Math.round(bottomBaseScaled/2);
        
        var entity = {};
        entity.posX = Number(demoII.left) + 20 * (Number(request.SenderID) - 8);
        entity.posY = Number(demoII.top) - 10;
        entity.velX = 30 * scaler;
        entity.velY = 30 * scaler;
        entity.xBoundMin = (xBoundSub + 15) * demoII.ratio;
        entity.xBoundMax = ((Number(demoII.width) - diaBallScaled) - xBoundSub - 3) * demoII.ratio; //Number(demoII.left) + Number(demoII.width);
        entity.yBoundMin = Number(demoII.top);
        entity.yBoundMax = Number(demoII.height) - (diaBallScaled + Math.round(bottomBase * invScaler)); //Number(demoII.top) + Number(demoII.height);
        entity.dt = 1;
        entity.coefOfRes = 0.5;
        
        //***************************
        //  Creating Ball Graphics Entity
        //***************************
       
        ballDiv = document.createElement("div");
        ballDiv.style.position = "absolute";
        //ballDiv.style.zIndex = 10;
        ballDiv.style.width = diaBallScaled + "px";
        ballDiv.style.height = diaBallScaled + "px";
        ballDiv.style.top = (Number(demoII.top)) + "px";
        ballDiv.style.left = (Number(demoII.left)) + "px";
        ballDiv.style.backgroundImage = "url('images/sphere1.gif')";
        ballDiv.style.backgroundRepeat = "no-repeat";
        ballDiv.style.backgroundSize = "100% 100%";
        
        demoII.myWindow.Elements.Window.appendChild(ballDiv);
        //Saving Graphics Entity to Map
        demoII.Balls.put(request.SenderID, ballDiv);
        demoII.BallArray.push(ballDiv);
        
        demoII.BallArray = demoII.BallArray.sort(demoII.SortByWidth);
        for (i=0; i<demoII.BallArray.length; i++)
        {
            demoII.BallArray[i].style.zIndex = i + 40;
        }
        
        //***************************
        //  Creating Shadow Graphics Entity
        //***************************
        wShadow = 24;
        wShadowScaled = diaBallScaled;
        hShadow = 8;
        hShadowScaled = hShadow * scaler;
        
        var shadowDiv = document.createElement("div");
        shadowDiv.style.position = "absolute";
        shadowDiv.style.zIndex = 0;
        shadowDiv.style.width = wShadowScaled + "px";
        shadowDiv.style.height = hShadowScaled + "px";
        shadowDiv.style.top = (entity.yBoundMax + diaBallScaled - (hShadowScaled/2)) + "px";
        shadowDiv.style.left = ballDiv.style.left;
        shadowDiv.style.backgroundImage = "url('images/shadow.png')";
        shadowDiv.style.backgroundRepeat = "no-repeat";
        shadowDiv.style.backgroundSize = "100% 100%";
        demoII.myWindow.Elements.Window.appendChild(shadowDiv);
        //Saving Graphics Entity to Map
        demoII.Shadows.put(request.SenderID, shadowDiv);
        
        //***************************
        //  Send Data
        //***************************
        
        var out = os.resschmgr.Create.Instruction();
        
        out.Data = entity;
        out.DeliveryTime = (new Date()).getTime() - 1;
        out.SenderID = request.SenderID;
        out.ReceiverID = demoII.Core.GetID();
        demoII.Update(out);
    },
    Update: function(request){
        
        var input = request.Data;
        var time = new Date();
        var iThread = demoII.Threads.get(request.SenderID);
        var iBall = demoII.Balls.get(request.SenderID);
        var iShadow = demoII.Shadows.get(request.SenderID);
        var posYCoef = Math.abs((demoII.height  - bottomBaseScaled - input.posY) / (demoII.height - bottomBaseScaled));
        
        input.dt = (time.getTime() - request.DeliveryTime) / 100;
        
        iBall.style.left = Math.round(input.posX) + "px";
        iBall.style.top = Math.round(input.posY) + "px";
        
        iShadow.style.left = iBall.style.left;
        iShadow.style.opacity = 1 - (Math.abs(input.posY - input.yBoundMax)/input.yBoundMax);
        iShadow.style.width = Math.round((1 + posYCoef) * Number(iBall.style.width)) + "px";
        //iShadow.style.width = (Math.round((1 + (Math.abs(input.posY - input.yBoundMax)/input.yBoundMax)) * diaBallScaled)) + "px";
        //iShadow.style.width = Math.round((1 + Math.abs((input.posY - height - bottomBaseScaled)/(height - bottomBaseScaled))) * diaBallScaled) + "px";
        //iShadow.style.height = "256px";
        //demoII.myWindow.Elements.Body.innerHTML = "Output Window of JaHOVA Application<br />10 Threads: One for each ball";
        //demoII.myWindow.Elements.Body.innerHTML += "<br />Velocity Y: " + input.velY;
        //demoII.myWindow.Elements.Body.innerHTML += "<br />Velocity X: " + input.velX;
        //demoII.myWindow.Elements.Body.innerHTML += "<br /> Position Y: " + input.posY;
        //demoII.myWindow.Elements.Body.innerHTML += "<br /> Y Bound Max: " + input.yBoundMax;
        //var temp = Number(input.posY) - Number(input.yBoundMax);
        //demoII.myWindow.Elements.Body.innerHTML += "<br /> Difference: " + temp;
        
        if((input.velY != null) && (Math.abs(input.velX) < 3.5) && (Math.abs(Number(input.posY) - Number(input.yBoundMax)) < 3.0)){
            input.velY = null;
            input.posY = input.yBoundMax;
        }
        
        if((Math.abs(input.velX) < 2.0)){
            input.velX = 0.0;
            demoII.myWindow.Elements.Window.removeChild(iBall);
            demoII.Balls.remove(request.SenderID);
            demoII.myWindow.Elements.Window.removeChild(iShadow);
            demoII.Shadows.remove(request.SenderID);
            
        }
        
        else if(((Math.abs(input.velX) > 0.01) || (Math.abs(input.velY) > 0.01))){
             var out = os.resschmgr.Create.Instruction();
    
            //Set Instruction Values
            out.SenderID               = demoII.Core.GetID();            //Resource ID requesting execution
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
            demoII.Core.SendRequest.apply(onRequestEvent, [output]);    
        }
        
        if(demoII.Balls.size == 0)
        {
            demoII.myWindow.Close();
            os.console.Enable();
        }
        
        //console.Clear();
    },
    
    SortByWidth: function(a,b){
        var aWidth = a.style.width.substring(0,2);
        var bWidth = b.style.width.substring(0,2);
        return Number(aWidth) - Number(bWidth);
    }   
    
}
