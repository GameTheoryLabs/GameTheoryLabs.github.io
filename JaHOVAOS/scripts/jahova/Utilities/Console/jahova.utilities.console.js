//JaHOVA Utilities : Console 
//      Dependent on JaHOVA Utilities

/**h* Utilities/Console
*  LINKS
* |html <p><a href="http://jahovaos.com/JaHOVA/Documentation/Full/toc_index.html">   Table of Contents </a></p>
*
*  NAME
*    JaHOVA Utilities Console
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
*     This module adds console window and functionality
*     
*
*  EXAMPLE
*   console = com.jahova.utilities.Instance().Console.Instance();
**/


com.jahova.utilities.Instance().Console = (function()
                        {
                            var pInstance;
                           
                            function constructor()
                            {
                                //******************
                                //PRIVATE ATTRIBUTES
                                //******************
                                
                                var NAME = "JaHOVA Utilities : Console Module";
                                var VERSION = "0v4";
                                var PATH = "scripts/jahova/Utilities/Console/jahova.utilities.console.js";
                                var ENABLED = true;
                                
                                var os = com.jahova.os.Instance();
                                var prompt = "~JaHOVA OS >>";
                                var console = this;

                                //******************
                                //PRIVATE METHODS
                                //******************
                                
                                
                                //******************
                                //INITALIZATION
                                //******************

                                
                                return{
                                    //PUBLIC ATTRIBUTES
                                    
                                    cmdWindow: null,
                                    length: 0,
                                    Pinned: false,
                                    ConsoleHover: false,
                                    APIPinned: false,
                                    APIHover: false,
                                    Commands: null,
                                    
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
                                    
                                    GetStatus: function(){
                                        return ENABLED;
                                    },
                                    GetPrompt: function(){
                                        return prompt;
                                    },
                                    Enable: function(){
                                        ENABLED = true;
                                        console.cmdWindow.onkeydown = console.EvaluateInput;
                                    },
                                    
                                    Disable: function(){
                                        ENABLED = false;
                                        console.cmdWindow.onkeydown = null;
                                    },
                                    
                                    Initialize: function(){
                                        console = this;
                                        
                                        if(os.Elements.ConsoleTabText)
                                        {
                                            os.Elements.ConsoleTabText.onclick = console.PinHover;
                                            os.Elements.ConsoleTabPageHeaderPin.onclick = console.Pin;
                                        }
                                        else
                                        {
                                            //os.Elements.FolderViewHeaderPin.onclick = console.SEHide;
                                            //os.Elements.IdeFolderViewHeaderPin.onclick = console.SEShow;
                                            //os.Elements.ConsoleH3.onclick = console.MakeActive;
                                            //os.Elements.ErrorH3.onclick = console.MakeActive;
                                            //
                                            //os.Elements.DocH31.onclick = console.MakeFileActive;
                                            //os.Elements.DocH32.onclick = console.MakeFileActive;
                                        }
                                        
                                        //Setup Console Window
                                        console.cmdWindow = document.createElement("textarea");
                                        console.cmdWindow.id = "com.jahova.console.textarea";
                                        console.cmdWindow.className = "console";
                                        console.cmdWindow.onkeydown = console.EvaluateInput;
                                    
                                        console.cmdWindow.value = prompt;
                                        //os.Elements.OutputConsoleDiv.appendChild(console.cmdWindow);
                                        
                                        

                                    },
                                    
                                    LoadCommands: function(){
                                        this.Commands = os.resschmgr.Create.Map();
                                        
                                        //Load Default Commands
                                        var help = "Clears command window\nExample >> clear";
                                        this.AddCommand("clear", function(){this.cmdWindow.value = "";}, this, help);
                                        
                                        help = "Displays a list of all loaded commands\nExample >> help";
                                        this.AddCommand("help", this.DisplayCommands, this, help);
                                        
                                        help = "Pins the console and prevents from sliding back\nExample >> pin"
                                        this.AddCommand("pin", this.Pin, this, help);
                                        
                                        help = "Load Multi-threaded Physics Demo\nExample >>threads";
                                        this.AddCommand("threads", this.ThreadDemo, this, help);
                                        
                                        help = "Load Isometric Mutlithreaded Physics Demo\nExample >>threads2";
                                        this.AddCommand("threads2", this.ThreadDemo2, this, help);
                                        
                                        help = "Create a socket and connect to test server, ";
                                        help += "Allows the use of SocketSend and SocketClose Commands";
                                        help += "\nExample >>SocketOpen";
                                        this.AddCommand("SocketOpen", this.SocketCreate,this, help);
                                        
                                        help = "Sends message to server via connected socket, ";
                                        help += "Message will be broadcast to all connected users and display in console";
                                        help += "\nExample >> SocketSend your message here";
                                        this.AddCommand("SocketSend", this.SocketSend, this, help);
                                        
                                        help = "Closes connected socket\nExample >> SocketClose";
                                        this.AddCommand("SocketClose", this.SocketClose, this, help);
                                        
                                        help = "Create a Window\nExample >>CreateWindow [ID Name Width Height Top Left]";
                                        this.AddCommand("CreateWindow", this.CreateWindow, this, help);
                                        
                                        help = "Start Timer\nExample >>StartTimer";
                                        this.AddCommand("StartTimer", this.StartTimer, this, help);
                                        
                                        help = "Stop Timer\nExample >>StopTimer";
                                        this.AddCommand("StopTimer", this.StopTimer, this, help);
                                        
                                        help = "Lap Timer\nExample >>LapTimer lapName";
                                        this.AddCommand("LapTimer", this.LapTimer, this, help);
                                        
                                        help = "Get Time for specific Lap\nExample >>GetLap lapName";
                                        this.AddCommand("GetLap", this.GetLap, this, help);
                                        
                                        help = "Remove Lap From Timer Log\nExample >>RemoveLap lapName";
                                        this.AddCommand("RemoveLap", this.RemoveLap, this, help);
                                        
                                        help = "List All Laps in Log\nExample >>ListLaps";
                                        this.AddCommand("ListLaps", this.ListLaps, this, help);
                                        
                                        help = "Get Total Elapsed Time\nExample >>ElapsedTime";
                                        this.AddCommand("GetElapsedTime", this.GetElapsedTime, this, help);
                                        
                                        help = "Clear Timer Log and Reset\nExample >>ResetTimer";
                                        this.AddCommand("ResetTimer", this.ResetTimer, this, help);
                                        
                                        help = "Create Thread API Thread Controller\nExample >>CreateController";
                                        this.AddCommand("CreateController", this.CreateThreadController, this, help);
                                        
                                        help = "Create Thread\nExample >>CreateController name type priority suspend callback input pool maxThreadCount";
                                        this.AddCommand("CreateThread", this.CreateThread, this, help);
                                        
                                        help = "Execute Thread\nExample >>ExecuteThread";
                                        this.AddCommand("ExecuteThread", this.ExecuteThread, this, help);
                                        
                                        help = "Suspend Thread\nExample >>SuspendThread";
                                        this.AddCommand("SuspendThread", this.SuspendThread, this, help);
                                        
                                        help = "Resume Thread\nExample >>ResumeThread";
                                        this.AddCommand("ResumeThread", this.ResumeThread, this, help);
                                        
                                        help = "Get Thread Suspend Count\nExample >>GetSuspendCount";
                                        this.AddCommand("GetSuspendCount", this.GetSuspendCount, this, help);
                                        
                                        help = "Get Thread Function\nExample >>GetThreadFunction";
                                        this.AddCommand("GetThreadFunction", this.GetThreadFunction, this, help);
                                        
                                        help = "Add Thread Task, will be queue if busy\nExample >>AddThreadTask";
                                        this.AddCommand("AddThreadTask", this.AddThreadTask, this, help);
                                        
                                        help = "Get Current Task of Thread\nExample >>GetThreadCurrentTask";
                                        this.AddCommand("GetThreadCurrentTask", this.GetThreadCurrentTask, this, help);
                                        
                                        help = "Get All Pending Task For Thread\nExample >>GetThreadPendingTask";
                                        this.AddCommand("GetThreadPendingTask", this.GetThreadPendingTask, this, help);
                                        
                                        help = "Get Thread Status\nExample >>GetThreadStatus";
                                        this.AddCommand("GetThreadStatus", this.GetThreadStatus, this, help);
                                        
                                        help = "Get Thread Priority\nExample >>GetThreadPriority";
                                        this.AddCommand("GetThreadPriority", this.GetThreadPriority, this, help);
                                        
                                        help = "Set Thread Priority\nExample >>SetThreadPriority";
                                        this.AddCommand("SetThreadPriority", this.SetThreadPriority, this, help);
                                        
                                        help = "Get Thread Filename\nExample >>GetThreadFilename";
                                        this.AddCommand("GetThreadFilename", this.GetThreadFilename, this, help);
                                        
                                        help = "Create WebSocket in Thread Controller\nExample >>CreateThreadSocket";
                                        this.AddCommand("CreateThreadSocket", this.CreateThreadSocket, this, help);
                                        
                                        help = "Close WebSocket in Thread Controller\nExample >>CloseThreadSocket";
                                        this.AddCommand("CloseThreadSocket", this.CloseThreadSocket, this, help);
                                        
                                        help = "Load Unearthed Web Client\nExample >>UE";
                                        this.AddCommand("UE", this.UE, this, help);
                                        
                                        help = "Get A File From WebDAV Server and Display\nExample >>GetFile filename";
                                        this.AddCommand("GetFile", this.GetFile, this, help);
                                        
                                        help = "Get A Folder From WebDAV Server and Display\nExample >>GetFolder foldername/";
                                        this.AddCommand("GetFolder", this.GetFolder, this, help);
                                        
                                        help = "Save contents of file to WebDAV Server\nExample >>SaveFile filename ";
                                        this.AddCommand("SaveFile", this.SaveFile, this, help);
                                        
                                        help = "Delete file from WebDAV Server\nExample >>DeleteFile filename ";
                                        this.AddCommand("DeleteFile", this.DeleteFile, this, help);
                                        
                                        help = "Grabs Query String and Display Key/Value Pairs\nExample >>GetQueryString ";
                                        this.AddCommand("GetQueryString", this.GetQueryString, this, help);
                                        
                                        help = "Plot Distribution from File\nExample >>Graph filename ";
                                        this.AddCommand("Graph", this.Graph, this, help);
                                        
                                        help = "PHP Echo Test via AJAX\nExample >>PHPEcho value [values...] ";
                                        this.AddCommand("PHPEcho", this.PHPEcho, this, help);
                                        
                                        help = "Open MySQL DB via AJAX/PHP\nExample >>DBOpen url username password databaseName ";
                                        this.AddCommand("DBOpen", this.DBOpen, this, help);
                                        
                                        help = "Creates a Pop Up Window to Install the Sercuirty Certificate\nCalls Server To Enable Cross Orgin Communication\nAllows HTTP to Communicated with HTTPS\nExample >>DBEnableSecureAccess ";
                                        this.AddCommand("DBEnableSecureAccess", this.DBEnableSecureAccess, this, help);
                                        
                                        help = "Open MySQL DB via AJAX/PHP Secure HTTPS Connection\nExample >>DBOpenSecure url username password databaseName ";
                                        this.AddCommand("DBOpenSecure", this.DBOpenSecure, this, help);
                                        
                                        help = "Selects All from test MySQL Database\nExample >>DBSelectAll  ";
                                        this.AddCommand("DBSelectAll", this.DBSelectAll, this, help);
                                        
                                        help = "Inserts a record into MySQL Database\nExample >>DBInsert  ";
                                        this.AddCommand("DBInsert", this.DBInsert, this, help);
                                        
                                        help = "Installs the Desktop Enviroment\nExample >>Desktop  ";
                                        this.AddCommand("Desktop", this.Desktop, this, help);
                                        
                                        help = "Displays Sample Error Window\nExample >>CreateErrorWindow  ";
                                        this.AddCommand("CreateErrorWindow", this.CreateErrorWindow, this, help);
                                        
                                        help = "Runs WebGL Demo\nExample >>WebGL  ";
                                        this.AddCommand("WebGL", this.WebGL, this, help);
                                        
                                        help = "Runs JaHOVA OS Server Demo\nExample >>JOSS  ";
                                        this.AddCommand("JOSS", this.JOSS, this, help);
                                        
                                        help = "Runs WebGL CubeMap Demo\nExample >>CubeMap  ";
                                        this.AddCommand("CubeMap", this.CubeMap, this, help);
                                        
                                        help = "Runs WebGL Dynamic Shadow Demo\nExample >>DynamicShadow  ";
                                        this.AddCommand("DynamicShadow", this.DynamicShadow, this, help);
                                        
                                        help = "Runs WebGL Fog Demo\nExample >>Fog  ";
                                        this.AddCommand("Fog", this.Fog, this, help);
                                        
                                        help = "Add Audio\nExample >>AudioAdd  ";
                                        this.AddCommand("AudioAdd", this.AudioAdd, this, help);
                                        
                                        help = "Play Audio\nExample >>AudioPlay  ";
                                        this.AddCommand("AudioPlay", this.AudioPlay, this, help);
                                        
                                        help = "Pause Audio\nExample >>AudioPause  ";
                                        this.AddCommand("AudioPause", this.AudioPause, this, help);
                                        
                                        help = "Runs Physics Demo\nExample >>Physics  ";
                                        this.AddCommand("Physics", this.Physics, this, help);
                                        
                                        help = "Runs Collision Detection\nExample >>Collision  ";
                                        this.AddCommand("Collision", this.Collision, this, help);
                                        
                                        help = "Opens Chrome Developer Tools\nExample >>Tools  ";
                                        this.AddCommand("Tools", this.Tools, this, help);
                                        //Display Loaded Commands
                                        //os.console.AppendComment("Commands Loaded: \n");
                                        //this.DisplayCommands();
                                        
                                    },
                                    //******************************************
                                    //
                                    //  THREAD API DEMO METHODS
                                    //
                                    //******************************************
                                    CreateThreadController: function(){
                                        os.threads.ThreadManager.CreateThreadController();
                                        os.console.AppendComment("Creating Thread Controller");
                                    },
                                    CreateThread: function(input){
                                        var params = input.split(" ");
                                        
                                        //Create Thread Function
                                        var myFunc = function(input){
                                            var sum = input.a + input.b;
                                            return "Sum: " + sum;
                                        };
                                        
                                        //Get Body of Function
                                        var body = os.threads.ThreadManager.GetFunctionBody(myFunc.toString());
                                        
                                        var callback = function(cmd){
                                            os.console.AppendComment("Message Type: " + cmd.msgType + "\nMessage Data: " + cmd.data);
                                        };
                                        //name, type, priority, suspend, callback, filename, input, pool, maxThreadCount
                                        //var thread = os.thread.ThreadManager.CreateThread(params[0], params[1], params[2], params[3], params[4], params[5], params[6], params[7]);
                                        var thread = os.threads.ThreadManager.CreateThread("Test Thread", "DYNAMIC", 0, "true", callback ,body, "0", "false", 0);
                                        if(thread){
                                            os.console.AppendComment("Thread Created: ");
                                            os.console.AppendComment("     Thread Name:     " + thread.name);
                                            os.console.AppendComment("     Thread ID:       " + thread.ID);
                                            os.console.AppendComment("     Thread Type:     " + thread.type);
                                            os.console.AppendComment("     Thread Priority: " + thread.priority);
                                            os.console.AppendComment("     Thread Function: \n          var sum = input.a + input.b; \n          return sum\n\n")
                                        }
                                        else{
                                            os.console.AppendComment("Returned null, Thread name already exist in map");
                                        }
                                        
                                    },
                                    ExecuteThread: function(input){
                                        //Get Thread Object
                                        var thread = os.threads.ThreadManager.GetThreadByName("Test Thread");
                                        
                                        os.console.AppendComment("Executing Thread: Summing 2 and 3");
                                        //Initialize Input for Thread Execution
                                        var data = {};
                                        data.a = 2;
                                        data.b = 3;
                                        
                                        //Execute Thread
                                        thread.Execute(data);
                                    },
                                    SuspendThread: function(input){
                                        //Get Thread Object
                                        var thread = os.threads.ThreadManager.GetThreadByName("Test Thread");
                                        
                                        os.console.AppendComment("Suspending Thread");
                                        
                                        thread.Suspend();
                                    },
                                    ResumeThread: function(input){
                                        //Get Thread Object
                                        var thread = os.threads.ThreadManager.GetThreadByName("Test Thread");
                                        
                                        os.console.AppendComment("Resuming Thread");
                                        
                                        thread.Resume();
                                    },
                                    GetSuspendCount: function(input){
                                        //Get Thread Object
                                        var thread = os.threads.ThreadManager.GetThreadByName("Test Thread");
                                        
                                        os.console.AppendComment("Getting Resume Count For Thread");
                                        
                                        thread.GetSuspendCount();
                                    },
                                    AddThreadTask: function(input){
                                        //Get Thread Object
                                        var thread = os.threads.ThreadManager.GetThreadByName("Test Thread");
                                        
                                        os.console.AppendComment("Executing Thread: Summing 5 and 6");
                                        //Initialize Input for Thread Execution
                                        var data = {};
                                        data.a = 5;
                                        data.b = 6;
                                        
                                        //Execute Thread
                                        thread.AddTask(data);
                                    },
                                    GetThreadCurrentTask: function(input){
                                        //Get Thread Object
                                        var thread = os.threads.ThreadManager.GetThreadByName("Test Thread");
                                        
                                        os.console.AppendComment("Requesting Current Task");
                                        
                                        thread.GetCurrentTask();
                                    },
                                    GetThreadPendingTask: function(input){
                                        //Get Thread Object
                                        var thread = os.threads.ThreadManager.GetThreadByName("Test Thread");
                                        
                                        os.console.AppendComment("Requesting List Of All Pending Task");
                                        
                                        thread.GetPendingTask();
                                    },
                                    GetThreadStatus: function(input){
                                        //Get Thread Object
                                        var thread = os.threads.ThreadManager.GetThreadByName("Test Thread");
                                        
                                        os.console.AppendComment("Getting Thread Status");
                                        
                                        thread.GetStatus();
                                    },
                                    GetThreadFunction: function(input){
                                        //Get Thread Object
                                        var thread = os.threads.ThreadManager.GetThreadByName("Test Thread");
                                        
                                        os.console.AppendComment("Getting Thread Function");
                                        
                                        thread.GetFunction();    
                                    },
                                    SetThreadPriority: function(input){
                                        //Get Thread Object
                                        var thread = os.threads.ThreadManager.GetThreadByName("Test Thread");
                                        var data = 1;
                                        os.console.AppendComment("Setting Thread Priority");
                                        
                                        thread.SetPriority(data);
                                    },
                                    GetThreadPriority: function(input){
                                        //Get Thread Object
                                        var thread = os.thread.ThreadManager.GetThreadByName("Test Thread");
                                        
                                        os.console.AppendComment("Getting Thread Priority");
                                        
                                        thread.GetPriority();
                                    },
                                    GetThreadFilename: function(input){
                                        //Get Thread Object
                                        var thread = os.threads.ThreadManager.GetThreadByName("Test Thread");
                                        
                                        os.console.AppendComment("Getting Thread Filename");
                                        
                                        thread.GetFilename();
                                    },
                                    CreateThreadSocket: function(input){
                                        os.console.AppendComment("Requesting Socket Creation in Thread Controller");
                                        os.thread.ThreadManager.CreateSocket();    
                                    },
                                    CloseThreadSocket: function(input){
                                        os.console.AppendComment("Requesting Close Socket in Thread Controller");
                                        os.thread.ThreadManager.CloseSocket();
                                    },
                                    //******************************************
                                    //
                                    //  TIMER DEMO METHODS
                                    //
                                    //******************************************
                                    StartTimer: function(){
                                        os.console.AppendComment("Start Time: " + os.timer.Start());
                                    },
                                    StopTimer: function(){
                                        os.console.AppendComment("Stop Time: " + os.timer.Stop());
                                    },
                                    LapTimer: function(lapName){
                                        os.console.AppendComment("Lap Time: " + os.timer.Lap(lapName));
                                    },
                                    
                                    GetLap: function(lapName){
                                        os.console.AppendComment(lapName + " Time: " + (os.timer.GetLap(lapName)).time);
                                    },
                                    
                                    RemoveLap: function(lapName){
                                        os.console.AppendComment("Removing Lap: " + lapName)
                                    },
                                    
                                    ListLaps: function(){
                                      var log = os.timer.log;
                                      var laps = os.timer.log.length;
                                      //os.console.AppendComment("");
                                      if(laps > 0)
                                      {
                                        for(var i = 0; i < laps; i++)
                                        {
                                          os.console.AppendComment(log[i].name + ": " + log[i].time);
                                        }
                                      }
                                      //os.console.Comment("");
                                    },
                                    
                                    GetElapsedTime: function(){
                                        os.console.AppendComment("Elapsed Time: " + os.timer.GetElapsedTime());
                                    },
                                    
                                    ResetTimer: function(){
                                        os.timer.Reset();
                                        os.console.AppendComment("Timer Reset");
                                    },
                                    
                                    //******************************************
                                    //
                                    //  MULTITHREADING PHYSICS DEMOS
                                    //
                                    //******************************************
                                    ThreadDemo: function(){
                                        os.console.Comment("\nCalling Demo Initialization");
                                        demo.Initialize();
                                    },
                                    
                                    ThreadDemo2: function(){
                                        os.console.Comment("\nCalling Demo Initialization");
                                        demoII.Initialize();
                                    },
                                    
                                    //******************************************
                                    //
                                    //  WINDOW DEMO
                                    //
                                    //******************************************
                                    CreateWindow: function(msg){
                                        //var dims = msg.split(" ");
                                        //os.resschmgr.Create.Window(dims[0], dims[1], dims[2], dims[3], dims[4], dims[5]);
                                        //os.resschmgr.Create.Window("win100", "Test Window: Hello World", 500, 500, 100, 100);
                                        
                                        //Load Desktop
                                        os.windows.Desktop.Load();
                                        
                                        //Bare Minimum to get a window working...
                                        macWin = os.windows.Create.Window();
                                        macWin.Display.window();
                                        macWin.Set.title("Mac Window");
                                        macWin.Set.onFocus(function(){macWin.Set.statusbarText("Got Focus");},window);
                                        macWin.Set.onBlur(function(){macWin.Set.statusbarText("Got Blur");});
                                        
                                        //                                               [Title   ,  Theme]
                                        pcWin = os.windows.WindowsManager.Create.Window("PC Window", "PC");
                                        pcWin.Set.position(300,300);
                                        pcWin.Set.statusbarText("Status Message");
                                        pcWin.Display.window();
                                        
                                        //Application 1
                                        var app1 = os.windows.Desktop.Create.Application();
                                        app1.Set.DisplayText("Create PC");
                                        app1.onClickScope = window;
                                        app1.onClick = function(){
                                                (os.windows.WindowsManager.Create.Window("PC Window", "PC")).Display.window();
                                            };
                                        os.windows.Desktop.AddApplication(app1);
                                        
                                        //Application 2
                                        var app2 = os.windows.Desktop.Create.Application();
                                        app2.Set.DisplayText("Create Mac");
                                        app2.onClickScope = window;
                                        app2.onClick = function(){
                                                (os.windows.WindowsManager.Create.Window("Mac Window", "Mac")).Display.window();
                                            };
                                         os.windows.Desktop.AddApplication(app2);   

                                        
                                    },
                                    CreateErrorWindow: function(msg){
                                        os.windows.Create.ErrorWindow("Tetst Error", "Test Message");
                                    },
                                    //******************************************
                                    //
                                    //  SOCKET DEMO
                                    //
                                    //******************************************
                                    socketID: null,
                                    SocketCreate: function(){
                                        
                                        var socket = os.network.SocketManager.CreateSocket("demo.jahovaos.com", "8080", " ");
                                        socketID = socket.GetID();
                                        os.console.AppendComment("Socket Created, ID: " + socketID);
                                        
                                        var myWin = os.resschmgr.Create.Window("socketDemo", "JaHOVA OS Web Socket Demo", 500, 400, 200, 200);
                                        os.resschmgr.WindowManager.Windows.value().Elements.Window.style.overflow = "auto";
                                        myWin.onclose = os.console.SocketClose;
                                        myWin.onclosescope = os.console;
                                        
                                        socket.onmessage =  os.console.SocketOnMessage;//function(msg){ os.resschmgr.WindowManager.Windows.value().Elements.Body.innerHTML += "<br/>Server: " + msg;};
                                        socket.onmessagescope = os.console;
                                        
                                        socket.onclose = function(){os.console.AppendComment("Socket Closed");};
                                        socket.onclosescope = os.console;
                                        
                                        socket.onopen = function(){os.resschmgr.WindowManager.Windows.value().Elements.Body.innerHTML += "<br/>Local: Socket Open";};
                                        socket.onopenscope = os.console;
                                        
                                        os.console.AppendComment("Callbacks Set");
                                        //os.console.Comment("");
                                        
                                        
                                        socket.Open();
                                    },
                                    SocketOnMessage: function(msg){
                                        console.AppendComment(msg);
                                    },
                                    SocketSend: function(msg){
                                        os.console.AppendComment("\nSending... ");
                                        (os.network.SocketManager.Sockets.get(socketID)).Send(msg); //value().Send(msg);
                                        var div = document.createElement("div");
                                        div.innerHTML = "<br/>Local: " + msg;
                                        os.resschmgr.WindowManager.Windows.value().Elements.Body.innerHTML += "<br/>Local: " + msg;//appendChild(div);
                                    },
                                   
                                    SocketClose: function(){
                                        if(os.network.SocketManager.Sockets.size > 0){
                                            os.console.AppendComment("\nClosing Socket");
                                            os.network.SocketManager.Sockets.value().Close();
                                            //var id = os.network.SocketManager.Sockets.value().GetID();
                                            os.network.SocketManager.Sockets.remove(socketID);
                                            os.resschmgr.WindowManager.Windows.value().Elements.Body.innerHTML += "<br/>Local: Socket Closed";
                                        }
                                        
                                        //os.resschmgr.WindowManager.Windows.value().Close();
                                        
                                        
                                    },
                                    
                                    //******************************************
                                    //
                                    //  SIDEBAR PIN FUNCTIONS
                                    //
                                    //******************************************
                                    Pin: function(){
                                        if(os.console.Pinned){
                                            os.Elements.ConsoleTabPage.className = "debugPage";
                                            os.Elements.ConsoleTabPage.style.width = "";
                                            os.Elements.ConsoleTabPageHeaderPin.className = "pin";
                                            console.cmdWindow.className = "console";
                                            os.console.Pinned = false;
                                        }
                                        else{
                                            os.Elements.ConsoleTabPage.className = "debugPagePin";
                                            os.Elements.ConsoleTabPage.style.width = "700px";
                                            os.Elements.ConsoleTabPageHeaderPin.className = "pinPin";
                                            console.cmdWindow.className = "consolePin";
                                            os.console.Pinned = true;
                                        }
                                    },
                                    
                                    PinHover: function(){
                                        //console.ConsoleHover = !console.ConsoleHover;
                                        //os.Elements.ConsoleTab.className = (console.ConsoleHover ? id : '')
                                    },
                                    
                                    PinAPIDoc: function(){
                                        if(os.console.APIPinned){
                                            os.Elements.DocumentationTabPage.className = "debugPage";
                                            os.Elements.DocumentationTabPage.style.width = "";
                                            os.Elements.DocumentationTabPageHeaderPin.className = "pin";
                                            os.Elements.DocumentationIFrame.className = "jahovaIFrame"
                                            os.console.APIPinned = false;
                                        }
                                        else{
                                            os.Elements.DocumentationTabPage.className = "debugPagePin";
                                            os.Elements.DocumentationTabPage.style.width = "700px";
                                            os.Elements.DocumentationTabPageHeaderPin.className = "pinPin";
                                            os.Elements.DocumentationIFrame.className = "jahovaIFramePin"
                                            os.console.APIPinned = true;
                                        }
                                        
                                    },
                                    
                                    PinAPIDocHover: function(){
                                        if( document.createEvent ) {
                                            var evObj = document.createEvent('MouseEvents');
                                            evObj.initEvent( 'mouseover', true, false );
                                            elem.dispatchEvent(evObj);
                                        } else if( document.createEventObject ) {
                                            elem.fireEvent('onmouseover');
                                        }

                                        
                                    },
                                    //******************************************
                                    //
                                    //  IDE CLICK FUNCTIONS
                                    //
                                    //******************************************
                                    Tools: function(){
                                        // Load native UI library
                                        var gui = require('nw.gui');
                                        
                                        // Get the current window
                                        var win = gui.Window.get();
                                        
                                        win.showDevTools();//'frame0', true);
                                        //win.on("devtools-opened", function(url) {
                                        //    console.log("devtools-opened: " + url);
                                        //    document.getElementById('devtools').src = url;
                                        //});
                                    },
                                    MakeActive: function(e){
                                        console.MakeAllInactive();
                                      
                                        var consoleTab = e.currentTarget.id.indexOf("console");
                                        if(consoleTab >= 0)
                                        {
                                            os.Elements.OutputConsoleDiv.className = "outputDivCurrent outputContentBkgColor";
                                            //os.Elements.OutputTabConsole.className = "outputSection";
                                            os.Elements.ConsoleH3.className = "outputH3 jahova_borRadB2 outputTabColorSelected textColorBlack";
                                            
                                            console.cmdWindow.scrollTop = console.cmdWindow.scrollHeight; 
                                        }
                                        else
                                        {
                                            //Output Tab
                                            os.Elements.OutputErrorDiv.className = "outputDivCurrent outputContentBkgColor";
                                            //os.Elements.OutputTabOutput.className = "outputSection";
                                            os.Elements.ErrorH3.className = "outputH3 jahova_borRadB2 outputTabColorSelected textColorBlack";
                                        }
                                        
                                        //console.Comment("Clicked: " + e.currentTarget.id);
                                      
                                    },
                                    MakeConsoleActive: function(){
                                        console.MakeAllInactive();
                                        os.Elements.OutputConsoleDiv.className = "outputDivCurrent outputContentBkgColor";
                                        //os.Elements.OutputTabConsole.className = "outputSection";
                                        os.Elements.ConsoleH3.className = "outputH3 jahova_borRadB2 outputTabColorSelected textColorBlack";
                                    },
                                    MakeAllInactive: function(){
                                        
                                        //Console Tab
                                        os.Elements.OutputConsoleDiv.className = "outputDiv ";
                                        os.Elements.OutputConsole.className = "outputSection";
                                        os.Elements.ConsoleH3.className = "outputH3 jahova_borRadB2  textColorWhite";
                                        
                                        //Output Tab
                                        os.Elements.OutputErrorDiv.className = "outputDiv";
                                        os.Elements.OutputError.className = "outputSection";
                                        os.Elements.ErrorH3.className = "outputH3 jahova_borRadB2 textColorWhite";
                                    },
                                    MakeFileActive: function(e){
                                        
                                        console.MakeAllFilesInactive();
                                        
                                        var file1 = e.currentTarget.id.indexOf("file1");
                                        
                                        if(file1 > -1)
                                        {
                                            os.Elements.DocSection1.className = "docSection jahova_borRadT2 tabColorSelected";
                                            os.Elements.DocH31.className = "docH3 jahova_borRadT2";
                                            os.Elements.DocDiv.className = "docDivCurrent jahova_borRadB2 viewContentBkgColor";
                                            os.console.file1.value = "CreateThread = " + os.thread.ThreadManager.CreateThread.toString() ;
                                        }
                                        else
                                        {
                                            os.Elements.DocSection2.className = "docSection jahova_borRadT2 tabColorSelected";
                                            os.Elements.DocH32.className = "docH3 jahova_borRadT2";
                                            os.Elements.DocDivCurrent.className = "docDivCurrent jahova_borRadB2 viewContentBkgColor";
                                        }
                                        
                                        //console.Comment("Clicked: " + e.currentTarget.id);
                                    },
                                    MakeAllFilesInactive: function(){
                                        
                                        os.Elements.DocSection1.className = "docSection jahova_borRadT2";
                                        os.Elements.DocH31.className = "docH3 jahova_borRadT2 textColorWhite";
                                        os.Elements.DocDiv.className = "docDiv viewContentBkgColor";
                                        
                                        os.Elements.DocSection2.className = "docSection jahova_borRadT2";
                                        os.Elements.DocH32.className = "docH3 jahova_borRadT2 textColorWhite";
                                        os.Elements.DocDivCurrent.className = "docDiv viewContentBkgColor";
                                    },
                                    SEHide: function(){
                                        //os.console.Comment("Clicked Pin");
                                        //os.Elements.FolderView.className = "folderViewDisplayed jahova_borRadT2"
                                        os.Elements.FolderView.className = "folderView jahova_borRadT2"
                                        
                                        //os.Elements.DocView.className = "docView jahova_borRadB2 appBaseColor";
                                        os.Elements.DocView.className = "docViewNFV jahova_borRadB2 appBaseColor";
                                        
                                        //os.Elements.OutputView.className = "outputView jahova_borRadB2 appBaseColor";
                                        os.Elements.OutputView.className = "outputViewNFV jahova_borRadB2 appBaseColor";
                                    },
                                    SEShow: function(){
                                        os.Elements.FolderView.className = "folderViewDisplayed jahova_borRadT2"
                                        //os.Elements.FolderView.className = "folderView jahova_borRadT2"
                                        
                                        os.Elements.DocView.className = "docView jahova_borRadB2 appBaseColor";
                                        //os.Elements.DocView.className = "docViewNFV jahova_borRadB2 appBaseColor";
                                        
                                        os.Elements.OutputView.className = "outputView jahova_borRadB2 appBaseColor";
                                        //os.Elements.OutputView.className = "outputViewNFV jahova_borRadB2 appBaseColor";
                                    },
                                    //******************************************
                                    //
                                    //  UNEARTHED FUNCTIONS
                                    //
                                    //******************************************
                                    UE: function(){
                                         //var frame = document.createElement("iframe");
                                        //frame.style.display = "none";
                                        window.open("http://demo.jahovaos.com/Unearthed/webClient.html");
                                        
                                                    
                                                    
                                    },
                                    //******************************************
                                    //
                                    //  WEBDAV DEMOS
                                    //
                                    //******************************************
                                    GetFile: function(input){
                                        var params = input.split(" ");
                                        var xhr = os.resschmgr.Create.XHRObject();
                                        var filepath = 'http://demo.jahovaos.com/' + input;
                                        os.console.AppendComment("Requesting:\n" + filepath);
                                        
                                        xhr.open('GET',filepath,true);
                                        xhr.onreadystatechange = function(){
                                          if(xhr.readyState==4) //4==DONE
                                            os.console.file1.value = xhr.responseText;
                                        }
                                        xhr.send();
                                        
                                        //xhr.open('GET',filepath, false);
                                        //xhr.send();
                                        
                                        
                                    },
                                    GetFolder: function(input){
                                        var params = input.split(" ");
                                        var xhr = os.resschmgr.Create.XHRObject();
                                        var filepath = "";
                                        var pathLength = 0;
                                        
                                        if(input.toUpperCase() == "GETFOLDER")
                                        {
                                            filepath = 'http://demo.jahovaos.com/';
                                            
                                        }
                                        else{
                                            filepath = 'http://demo.jahovaos.com/' + input;
                                            pathLength = input.length;
                                        }
                                        
                                        os.console.AppendComment("Requesting:\n" + filepath);
                                        
                                        xhr.open('PROPFIND',filepath,true);
                                        xhr.setRequestHeader('Depth', '1');
                                        xhr.onreadystatechange = function(){
                                          if(xhr.readyState==4) //4==DONE
                                          {
                                            var xml = xhr.responseXML;
                                            var output  = "";
                                            var temp = "";
                                            //WebKit XML notation
                                            var hrefs = xml.getElementsByTagName("href")
                                            if(hrefs.length == 0)
                                            {
                                                //Firefox XML notation
                                                hrefs = xml.getElementsByTagName("D:href");
                                            }
                                            
                                             for(var i = 0; i < hrefs.length; i++)
                                             {
                                                temp = hrefs[i].textContent;
                                                temp = temp.substring(pathLength + 1);
                                                if(temp[temp.length - 1] == "/")
                                                {
                                                    output += "\n" + "Folder: " + temp.substring(0, temp.length-1);
                                                }
                                                else
                                                {
                                                    output += "\n" + "File:   " + temp
                                                }
                                                
                                             }
                                            os.console.file1.value = output;
                                          }
                                        }
                                        xhr.send();
                                    },
                                    SaveFile: function(input){
                                        var params = input.split(" ");
                                        var xhr = os.resschmgr.Create.XHRObject();
                                        
                                        var fileContents = os.console.file1.value;
                                        var fileName = params[0];
                                        //var filePath = params[1];
                                        os.console.AppendComment("Requesting to Save File:\n" + "http://demo.jahovaos.com/" + fileName)
                                        xhr.open('PUT',"http://demo.jahovaos.com/" + fileName,true);
                                        //xhr.setRequestHeader('Depth', '1');
                                        xhr.onreadystatechange = function(){
                                          if(xhr.readyState==4) //4==DONE
                                            os.console.file1.value = xhr.responseText;
                                        }
                                        xhr.send(fileContents);
                                        
                                        
                                    },
                                    DeleteFile: function(input){
                                        var params = input.split(" ");
                                        var xhr = os.resschmgr.Create.XHRObject();
                                        var fileName = params[0];
                                        //var filePath = params[1];
                                        os.console.AppendComment("Requesting to Delete File:\n" + "http://demo.jahovaos.com/" + fileName)
                                        xhr.open('DELETE',"http://demo.jahovaos.com/" + fileName,true);
                                        //xhr.setRequestHeader('Depth', '1');
                                        xhr.onreadystatechange = function(){
                                          if(xhr.readyState==4) //4==DONE
                                            os.console.file1.value = xhr.responseText;
                                        }
                                        xhr.send();
                                        
                                        
                                    },
                                    //******************************************
                                    //
                                    //  MYSQL DEMOS
                                    //
                                    //******************************************
                                    PHPEcho: function(input){
                                        var xhr = os.resschmgr.Create.XHRObject();
                                        
                                        var url = "http://demo.jahovaos.com/MySQL/echo.php";
                                        
                                        var output = "";
                                        var values = input.split(" ");
                                        
                                        var jsonString = JSON.stringify(values);
                                        output = "JSON=" + encodeURIComponent(jsonString);
                                        
                                        xhr.open("POST", url, true);
                                        
                                        //Send the proper header information along with the request
                                        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                                        
                                        xhr.onreadystatechange = function() {//Call a function when the state changes.
                                                if(xhr.readyState == 4) {
                                                    if(xhr.status == 200)
                                                    {
                                                        os.console.Comment("PHP Response: " + xhr.responseText);
                                                    }
                                                    else{
                                                        os.console.Comment("PHP ERROR: " + xhr.responseText);
                                                    }
                                                }
                                        }
                                        xhr.send(output);
                                    },
                                    DBOpen: function(input){
                                        var xhr = os.resschmgr.Create.XHRObject();
                                        
                                        var url = "http://demo.jahovaos.com/MySQL/DBOpen.php";
                                        
                                        var output = "";
                                        var dbObj = input.split(" ");
                                        
                                        values = {};
                                        values.url = dbObj[0];
                                        values.un = dbObj[1];
                                        values.pw = dbObj[2];
                                        values.db = dbObj[3];
                                        
                                        var jsonString = JSON.stringify(values);
                                        output = "JSON=" + encodeURIComponent(jsonString);
                                        
                                        xhr.open("POST", url, true);
                                        
                                        //Send the proper header information along with the request
                                        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                                        
                                        xhr.onreadystatechange = function() {//Call a function when the state changes.
                                                if(xhr.readyState == 4) {
                                                    if(xhr.status == 200)
                                                    {
                                                        os.console.Comment("PHP Response: " + xhr.responseText);
                                                    }
                                                    else{
                                                        os.console.Comment("PHP ERROR: " + xhr.responseText);
                                                    }
                                                }
                                        }
                                        xhr.send(output);
                                    },
                                    DBOpenSecure: function(input){
                                        var xhr = os.resschmgr.Create.XHRObject();
                                        
                                        var url = "https://demo.jahovaos.com/MySQL/DBOpen.php";
                                        
                                        var output = "";
                                        var dbObj = input.split(" ");
                                        
                                        values = {};
                                        values.url = dbObj[0];
                                        values.un = dbObj[1];
                                        values.pw = dbObj[2];
                                        values.db = dbObj[3];
                                        
                                        var jsonString = JSON.stringify(values);
                                        output = "JSON=" + encodeURIComponent(jsonString);
                                        
                                        xhr.open("POST", url, true);
                                        
                                        //Send the proper header information along with the request
                                        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                                        
                                        xhr.onreadystatechange = function() {//Call a function when the state changes.
                                                if(xhr.readyState == 4) {
                                                    if(xhr.status == 200)
                                                    {
                                                        os.console.Comment("PHP Response: " + xhr.responseText);
                                                    }
                                                    else{
                                                        os.console.Error("Could not create secure connection");
                                                        os.console.AppendComment("Your browser does not have the JaHOVA OS Certficate Installed\n")
                                                        os.console.AppendComment("The pop up window will allow you to install the certificate");
                                                        os.console.AppendComment("Or you may go to https://demo.jahovaos.com/MySQL/InstallSSL.html, to install it manually");
                                                        os.console.AppendComment("\nOnce installed, try your request again");
                                                        os.console.Comment();
                                                        os.console.DBEnableSecureAccess();
                                                    }
                                                }
                                        }
                                        xhr.send(output);
                                    },
                                    DBEnableSecureAccess: function(input){
                                    
                                        window.open ("https://demo.jahovaos.com/MySQL/InstallSSL.html","Enable Secure Access","scrollbars=1,menubar=1,resizable=1,width=320,height=480");

                                    },
                                    DBSelectAll: function(input){
                                        var xhr = os.resschmgr.Create.XHRObject();
                                        
                                        var url = "https://demo.jahovaos.com/MySQL/MySQL.php";
                                        
                                        var output = "";
                                        var db = {};
                                        
                                        db.url = "demo.jahovaos.com";
                                        db.un = "student";
                                        db.pw = "devry";
                                        db.db = "servers";
                                        db.queryType = "SELECT";
                                        db.query = "SELECT * FROM available";
                                        
                                        var jsonString = JSON.stringify(db);
                                        output = "JSON=" + encodeURIComponent(jsonString);
                                        
                                        xhr.open("POST", url, true);
                                        
                                        //Send the proper header information along with the request
                                        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                                        
                                        xhr.onreadystatechange = function() {//Call a function when the state changes.
                                                if(xhr.readyState == 4) {
                                                    if(xhr.status == 200)
                                                    {
                                                        os.console.Comment("PHP Response: " + xhr.responseText);
                                                    }
                                                    else{
                                                        os.console.Error("Could not create secure connection");
                                                        os.console.AppendComment("Your browser does not have the JaHOVA OS Certficate Installed\n")
                                                        os.console.AppendComment("The pop up window will allow you to install the certificate");
                                                        os.console.AppendComment("Or you may go to https://demo.jahovaos.com/MySQL/InstallSSL.html, to install it manually");
                                                        os.console.AppendComment("\nOnce installed, try your request again");
                                                        os.console.Comment();
                                                        os.console.DBEnableSecureAccess();
                                                    }
                                                }
                                        }
                                        xhr.send(output);
                                    },
                                    DBInsert: function(input){
                                        var xhr = os.resschmgr.Create.XHRObject();
                                        
                                        var url = "https://demo.jahovaos.com/MySQL/MySQL.php";
                                        
                                        var output = "";
                                        var db = {};
                                        
                                        db.url = "demo.jahovaos.com";
                                        db.un = "student";
                                        db.pw = "devry";
                                        db.db = "servers";
                                        db.queryType = "INSERT";
                                        db.query = "INSERT INTO available(IP, lifetime, utimestamp) VALUES('70.234.209.144', '0', '1285823299')" ;
                                        
                                        var jsonString = JSON.stringify(db);
                                        output = "JSON=" + encodeURIComponent(jsonString);
                                        
                                        xhr.open("POST", url, true);
                                        
                                        //Send the proper header information along with the request
                                        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                                        
                                        xhr.onreadystatechange = function() {//Call a function when the state changes.
                                                if(xhr.readyState == 4) {
                                                    if(xhr.status == 200)
                                                    {
                                                        os.console.Comment("PHP Response: " + xhr.responseText);
                                                    }
                                                    else{
                                                        os.console.Error("Could not create secure connection");
                                                        os.console.AppendComment("Your browser does not have the JaHOVA OS Certficate Installed\n")
                                                        os.console.AppendComment("The pop up window will allow you to install the certificate");
                                                        os.console.AppendComment("Or you may go to https://demo.jahovaos.com/MySQL/InstallSSL.html, to install it manually");
                                                        os.console.AppendComment("\nOnce installed, try your request again");
                                                        os.console.Comment();
                                                        os.console.DBEnableSecureAccess();
                                                    }
                                                }
                                        }
                                        xhr.send(output);
                                    },
                                    //******************************************
                                    //
                                    //  DESKTOP DEMOS
                                    //
                                    //******************************************
                                    Desktop: function(input){
                                        
                                        os.windows.Desktop.Load();
                                        
                                        //Create Application
                                        var app1 = os.windows.Desktop.Create.Application();
                                        app1.Set.DisplayText("Daily Receipts");
                                        app1.onClickScope = window;
                                        app1.onClick = function(){
                                                (os.windows.WindowsManager.Create.Window("Daily Receipts", "PC")).Display.window();
                                            };
                                        
                                        os.windows.Desktop.AddApplication(app1);
                                        
                                        var app2 = os.windows.Desktop.Create.Application();
                                        app2.Set.DisplayText("Pending Receipts");
                                        app2.onClickScope = window;
                                        app2.onClick = function(){
                                                (os.windows.WindowsManager.Create.Window("Pending Receipts", "Mac")).Display.window();
                                            };
                                        
                                        os.windows.Desktop.AddApplication(app2);
                                        
                                        var app3 = os.windows.Desktop.Create.Application();
                                        app3.Set.DisplayText("Report Generator");
                                        app3.onClickScope = window;
                                        app3.onClick = function(){
                                                (os.windows.WindowsManager.Create.Window("Report Generator", "Mac")).Display.window();
                                            };
                                        
                                        os.windows.Desktop.AddApplication(app3);
                                        
                                    },
                                    //******************************************
                                    //
                                    //  DYNAMIC TEST FUNCTIONS
                                    //
                                    //******************************************
                                    GetQueryString: function(){
                                        //os.queryString = os.resschmgr.Create.Map();
                                        var re = /[?&]([^=]+)(?:=([^&]*))?/g;
                                        var matchInfo;
                                        
                                        matchInfo = re.exec(location.search)
                                        while(matchInfo)
                                        {
                                            os.queryString.put(matchInfo[1], matchInfo[2]);
                                            matchInfo = re.exec(location.search)
                                        }
                                        
                                        for( var i = 0; i < os.queryString.size; i++)
                                        {
                                            os.console.AppendComment("Key: " + os.queryString.key() + ", Value: " + os.queryString.value());
                                            os.queryString.next();
                                        }
                                        
                                    },
                                    Graph: function(input){
                                        var params = input.split(" ");
                                        
                                        //Get File
                                        var xhr = os.resschmgr.Create.XHRObject();
                                        var filepath = 'http://demo.jahovaos.com/' + input;
                                        os.console.AppendComment("Requesting:\n" + filepath);
                                                                                
                                        xhr.open('GET',filepath, false);
                                        xhr.send(); 
                                        //Save Raw Text
                                        var rawFile = xhr.responseText;
                                        
                                        /*
                                        //Parse File
                                        var tmpSeries = rawFile.split("*");
                                        var fileElements = tmpSeries[0].split("||");
                                        var s = [];
                                        for(var i=0;i<tmpSeries.length;i++) {
                                            s[i] = tmpSeries[i].split("||");
                                        }
                                        */
                                        //Chart Class
                                        var CChart = function(canvasID){
                                            
                                            this.Canvas = {
                                                object: "",
                                                context: "",
                                                width: "",
                                                height: ""
                                            };
                                            
                                            this.Properties ={
                                                XAxis: {
                                                    x: 0,
                                                    y: 0,
                                                    min: 0,
                                                    max: 0,
                                                    divisions: 0,
                                                    label: "",
                                                    labelOffset: 0
                                                },
                                                
                                                YAxis: {
                                                    x: 0,
                                                    y: 0,
                                                    min: 0,
                                                    max: 0,
                                                    divixions: 0,
                                                    label: "",
                                                    labelOffset: 0
                                                },
                                                Type: "",
                                                Title: "",
                                                LegendVisible: true,
                                                TitleVisible: true,
                                                XAxisLabelVisible: true,
                                                YAxisLabelVisible: true,
                                                DataPointWidth: 0,
                                                NumOfSeries: 0
                                            };
                                            this.PlotArea ={
                                              x: 0,
                                              y: 0,
                                              x1: 0,
                                              y1: 0,
                                              width: 0,
                                              height: 0,
                                              pad: 0
                                            };
                                            
                                            this.Legend = {
                                                x: 0,
                                                y: 0,
                                                width: 0,
                                                height: 0,
                                                tabs: [],
                                                CTab: function() {
                                                    this.x = 0;
                                                    this.y = 0;
                                                    this.width = 0;
                                                    this.height = 0;
                                                    this.id = 0;
                                                    this.color = [];
                                                    this.label = "";
                                                    this.Init = (function() {
                                                                
                                                    }.bind(this))();
                                                }
                                            };
                                            
                                            this.Data = {
                                                file: "",
                                                min: 0,
                                                max: 0,
                                                ymin: 0,
                                                ymax: 0,
                                                xLabel: "",
                                                yLabel: "",
                                                series: [],
                                                order: [],
                                                numOfSeries: 0,
                                                numOfBins: 0,
                                                dOrder: [],
                                                title: "",
                                                CSeries: function() {
                                                    this.rawData = [];
                                                    this.browser = "";
                                                    this.color = [0,0,0]; //rgb: i.e. [255, 0, 0] for red
                                                    this.data = [];
                                                    this.bins = [];
                                                    this.stats = [];
                                                    this.min = 0;
                                                    this.max = 0;
                                                    this.minY = 0;
                                                    this.maxY = 0;
                                                    this.stdev = 0;
                                                    this.num = 0;
                                                    this.avg = 0;
                                                    var Init = (function(){
                                                        
                                                    }.bind(this))();
                                                }
                                            };
                                            /*
                                            this.Series = [];
                                            this.CData = {
                                                series: "",
                                                x: "",
                                                y: ""
                                            };
                                            */
                                            this.Box = {
                                                pi: "",
                                                rad: "",
                                                depth: "",
                                                theta: "",
                                                wBar: "",
                                                nSeries: "",
                                                xOffset: "",
                                                yOffset: "",
                                                BackPanel: {
                                                    x: "",
                                                    y: "",
                                                    w: "",
                                                    h: ""
                                                }
                                            };
                                           
                                            //***********************************
                                            //
                                            //      BUILD FUNCTIONS
                                            //
                                            //***********************************
                                            this.MouseClick = function(e) {
                                                //os.console.Comment("x value: " + (e.clientX-chart.Window.left));
                                                //os.console.Comment("y value: " + (e.clientY-chart.Window.top-20));
                                                var testX = e.clientX-chart.Window.left;
                                                var testY = e.clientY-chart.Window.top-20;
                                                for(var i=0; i<this.Legend.tabs.length; i++){
                                                    var x = this.Legend.tabs[i].x;
                                                    var y = this.Legend.tabs[i].y;
                                                    var x1 = this.Legend.tabs[i].x + this.Legend.tabs[i].width;
                                                    var y1 = this.Legend.tabs[i].y + this.Legend.tabs[i].height;
                                                    if(testX > x && testX < x1 && testY > y && testY < y1) {
                                                        //os.console.Comment("tab: " + i + " was clicked");
                                                        this.Data.dOrder[this.Data.series.length-1] = i;
                                                        for(var j=0,k=0; j<this.Legend.tabs.length; j++){
                                                            if(j != i){
                                                                this.Data.dOrder[k] = j;
                                                                k++;
                                                            }
                                                        }
                                                        this.DrawData();
                                                        this.DrawLegend();
                                                        
                                                    }
                                                }
                                                
                                            }.bind(this);
                                            
                                            var Init = (function(){
                                                this.Canvas.object = document.getElementById(canvasID);
                                                this.Canvas.context = this.Canvas.object.getContext('2d');
                                                
                                                this.Properties.NumOfSeries = 3;
                                                this.PlotArea.pad = 10;
                                                this.PlotArea.x = 100;
                                                this.PlotArea.y = 75;
                                                //var mytab = new this.Legend.CTab();
                                                //mytab.color = "c";
                                                this.Canvas.object.onmousedown = this.MouseClick;
                                                
                                            }.bind(this))();
                                            
                                            this.LoadData = function(input){
                                                //Parse File
                                                var tmpSeries = input.split("*");
                                                var fileElements = tmpSeries[0].split("||");
                                                var s = [];
                                                for(var i=0;i<tmpSeries.length;i++) {
                                                    s[i] = tmpSeries[i].split("||");
                                                }
                                                this.Data.title = fileElements[1];
                                                this.Data.xLabel = fileElements[2];
                                                this.Data.yLabel = fileElements[3];
                                                this.Data.numOfSeries = tmpSeries.length;
                                                for(var i=0;i<tmpSeries.length;i++){
                                                    this.Data.dOrder[i] = i; //initialize draw order
                                                    var mySeries = new this.Data.CSeries();
                                                    this.Data.series[i] = mySeries;
                                                    this.Data.series[i].rawData = s[i];
                                                    this.Data.series[i].browser = barChart.Data.series[i].rawData[0];
                                                    var d = this.Data.series[i].rawData.slice(4);
                                                    this.Data.series[i].data = d[0].split("|");
                                                    this.Data.series[i].data.pop();
                                                    this.Data.series[i].color[i] = 128;
                                                    this.Data.series[i].max = Number(this.Data.series[i].data[0]);
                                                    this.Data.series[i].min = Number(this.Data.series[i].data[0]);
                                                }
                                                    this.Data.min = Number(this.Data.series[0].data[0]);
                                                    this.Data.max = Number(this.Data.series[0].data[0]);
                                                    this.Data.ymin = Number(this.Data.series[0].data[0]);
                                                    this.Data.ymax = Number(this.Data.series[0].data[0]);
                                                    //this.Data.series[i].avg = 0;
                                                    //this.Data.series[i].num = 0;
                                                for(var i=0;i<this.Data.series.length;i++){
                                                    //Get Number of Bins
                                                    if(this.Data.numOfBins < Number((Math.sqrt(this.Data.series[i].data.length)).toFixed())){
                                                        this.Data.numOfBins = Number((Math.sqrt(this.Data.series[i].data.length)).toFixed());
                                                    }
                                                    for(var k = 0; k < this.Data.series[i].data.length; k++)
                                                    {
                                                        this.Data.series[i].avg += Number(this.Data.series[i].data[k]);
                                                        if(Number(this.Data.series[i].data[k]) > Number(this.Data.series[i].max)){this.Data.series[i].max = Number(this.Data.series[i].data[k]);}
                                                        if(Number(this.Data.series[i].data[k]) < Number(this.Data.series[i].min)){this.Data.series[i].min = Number(this.Data.series[i].data[k]);}
                                                    }
                                                    if(Number(this.Data.series[i].min) < Number(this.Data.min)){this.Data.min = Number(this.Data.series[i].min);}
                                                    this.Data.series[i].stats.push('Min: ' && this.Data.series[i].min);
                                                    if(Number(this.Data.series[i].max) > Number(this.Data.max)){this.Data.max = Number(this.Data.series[i].max);}
                                                    this.Data.series[i].stats.push('Max: ' && this.Data.series[i].max);
                                                }
                                                for(var i=0;i<this.Data.series.length;i++){  
                                                    //
                                                    //Calculate Average, Max and Min
                                                    //
                                                    this.Data.series[i].num = this.Data.series[i].data.length;
                                                    this.Data.series[i].stats.push('N: ' && this.Data.series[i].num);
                                                    this.Data.series[i].avg = Number(this.Data.series[i].avg)/this.Data.series[i].data.length;
                                                    this.Data.series[i].stats.push('Mean: ' && this.Data.series[i].avg);
                                                    
                                                    this.Data.series[i].stdev = 0;
                                                    
                                                    for(var k = 0; k < this.Data.series[i].data.length; k++)
                                                    {
                                                        this.Data.series[i].stdev += Math.pow(Number(this.Data.series[i].avg) - Number(this.Data.series[i].data[k]),2);
                                                    }
                                                    this.Data.series[i].stdev = this.Data.series[i].stdev/this.Data.series[i].data.length;
                                                    this.Data.series[i].stdev = Math.sqrt(this.Data.series[i].stdev);
                                                    this.Data.series[i].stats.push('Stdev: ' && this.Data.series[i].stdev);
                                                    
                                                    //Determine Bin Ranges
                                                    this.Data.series[i].bins[0] = {bin: this.Data.min, count: 0};
                                                    for(k = 1; k <= this.Data.numOfBins; k++)
                                                    {
                                                        this.Data.series[i].bins[k] = {bin: Number(this.Data.series[i].bins[k-1].bin) + (this.Data.max - this.Data.min)/this.Data.numOfBins, count: 0};
                                                    }
                                                    
                                                    //Determine Frequency of Each Bin
                                                    // and max/min Y
                                                    this.Data.series[i].maxY = this.Data.series[i].bins[0].count;
                                                    this.Data.series[i].minY = this.Data.series[i].bins[0].count;
                                                    
                                                    for(var k = 0; k < this.Data.series[i].data.length; k++)
                                                    {
                                                        var j = 0;
                                                        while( (this.Data.series[i].data[k] > this.Data.series[i].bins[j].bin) && (j < this.Data.series[i].bins.length-1) )
                                                        {
                                                            j++;
                                                        }
                                                        this.Data.series[i].bins[j].count++;
                                                        if(Number(this.Data.series[i].bins[j].count) > this.Data.series[i].maxY){this.Data.series[i].maxY = Number(this.Data.series[i].bins[j].count);}
                                                        if(Number(this.Data.series[i].bins[j].count) < this.Data.series[i].minY){this.Data.series[i].minY = Number(this.Data.series[i].bins[j].count);}
                                                        os.console.file1.value += "\nBin: " + this.Data.series[i].bins[j].bin + ", Count: " + this.Data.series[i].bins[j].count;   
                                                    }
                                                    // x axis min/max
                                                    //if(this.Data.series[i].max > this.Data.max){this.Data.max = Number(this.Data.series[i].max);}
                                                    //if(this.Data.series[i].min < this.Data.min){this.Data.min = Number(this.Data.series[i].min);}
                                                    // y axis min/max
                                                    if(this.Data.series[i].maxY > this.Data.ymax){this.Data.ymax = Number(this.Data.series[i].maxY);}
                                                    if(this.Data.series[i].minY < this.Data.ymin){this.Data.ymin = Number(this.Data.series[i].minY);} 
                                                }
                                                
                                                this.Properties.NumOfSeries = tmpSeries.length;
                                                this.Properties.XAxis.label = this.Data.xLabel;
                                                this.Properties.YAxis.label = this.Data.yLabel;
                                                this.Type = 'Histogram';
                                                this.Title = 'Time to Send Large Messages';
                                                this.Properties.XAxis.min = this.Data.min;
                                                this.Properties.XAxis.max = this.Data.max;
                                                this.Properties.YAxis.min = 0;
                                                this.Properties.YAxis.max = this.Data.ymax;
                                                this.DataPointWidth  = 10;
                                            }.bind(this);
                                            var BuildBox = function(){
                                                this.Box.pi = 3.14159265;
                                                this.Box.theta = 45;
                                                this.Box.rad = this.Box.theta*this.Box.pi/180;
                                                this.Box.nSeries = this.Properties.NumOfSeries;
                                                this.Box.wBar = this.DataPointWidth;
                                                this.Box.depth = this.Box.wBar*this.Box.nSeries*1.5;
                                                this.Box.xOffset = this.Box.depth*(Math.cos(this.Box.rad));
                                                this.Box.yOffset = this.Box.depth*(Math.sin(this.Box.rad));
                                                this.Box.BackPanel.x = this.PlotArea.x+this.Box.xOffset;
                                                this.Box.BackPanel.y = this.PlotArea.y;
                                                this.Box.BackPanel.w = this.PlotArea.width - this.Box.xOffset;
                                                this.Box.BackPanel.h = this.PlotArea.height - this.Box.yOffset;
                                            }.bind(this);
                                            var DrawBox = function(){
                                                BuildBox();
                                                // draw back panel
                                                this.Canvas.context.fillStyle = "white"; //color;
                                                this.Canvas.context.fillRect(this.Box.BackPanel.x, this.Box.BackPanel.y, this.Box.BackPanel.w + this.DataPointWidth, this.Box.BackPanel.h);
                                                // draw left side panel
                                                this.Canvas.context.fillStyle = "white"; //color;
                                                this.Canvas.context.beginPath();
						this.Canvas.context.moveTo(this.Box.BackPanel.x, this.Box.BackPanel.y);
						this.Canvas.context.lineTo(this.Box.BackPanel.x - this.Box.xOffset, this.Box.BackPanel.y+this.Box.yOffset);
						this.Canvas.context.lineTo(this.Box.BackPanel.x - this.Box.xOffset, this.Box.BackPanel.y+this.Box.yOffset+this.Box.BackPanel.h);
						this.Canvas.context.lineTo(this.Box.BackPanel.x, this.Box.BackPanel.y+this.Box.BackPanel.h);
						this.Canvas.context.fill();
                                                // draw bottom panel
                                                this.Canvas.context.fillStyle = "white"; //color;
                                                this.Canvas.context.beginPath();
						this.Canvas.context.moveTo(this.Box.BackPanel.x, this.Box.BackPanel.y+this.Box.BackPanel.h);
						this.Canvas.context.lineTo(this.Box.BackPanel.x - this.Box.xOffset, this.Box.BackPanel.y+this.Box.yOffset+this.Box.BackPanel.h);
						this.Canvas.context.lineTo(this.Box.BackPanel.x - this.Box.xOffset + this.Box.BackPanel.w + this.DataPointWidth, this.Box.BackPanel.y+this.Box.yOffset+this.Box.BackPanel.h);
						this.Canvas.context.lineTo(this.Box.BackPanel.x + this.Box.BackPanel.w + this.DataPointWidth, this.Box.BackPanel.y+this.Box.BackPanel.h);
						this.Canvas.context.fill();      
                                            }.bind(this);
                                            var BuildLegend = function(){
                                                var hTitle = 16;
                                                var hTab = 16;
                                                var hStats = this.Data.series[0].stats.length*hTab;
                                                this.Legend.width = 80;
                                                var wTab = this.Legend.width/this.Data.series.length;
                                                this.Legend.height = hTitle + hTab + hStats;
                                                this.Legend.x = this.PlotArea.x1 + (this.Canvas.width - this.PlotArea.x1-this.Legend.width)/2;
                                                this.Legend.y = this.PlotArea.y;
                                                for(var i=0; i<this.Data.series.length; i++){
                                                    this.Legend.tabs[i] = new this.Legend.CTab();
                                                    this.Legend.tabs[i].label = this.Data.series[i].browser;
                                                    this.Legend.tabs[i].width = wTab;
                                                    this.Legend.tabs[i].height = hTab;
                                                    this.Legend.tabs[i].x = this.Legend.x + (wTab*i);
                                                    this.Legend.tabs[i].y = this.Legend.y + hTitle;
                                                    this.Legend.tabs[i].color = this.Data.series[i].color;
                                                }
                                            }.bind(this);
                                            //***********************************
                                            //
                                            //      DRAW FUNCTIONS
                                            //
                                            //***********************************
                                            this.DrawData = function(){
                                                Draw();
                                                for(var h = 0; h < this.Properties.NumOfSeries; h++)
                                                {
                                                    for(var i = 0; i < this.Data.series[h].bins.length; i++)
                                                    {
                                                        DrawBar(this.Data.series[this.Data.dOrder[h]].bins[i].bin, this.Data.series[this.Data.dOrder[h]].bins[i].count, h+1, this.Data.series[this.Data.dOrder[h]].color);
                                                    }
                                                }
                                            }.bind(this);
                                            var Draw = function(){
                                                var linGrd = this.Canvas.context.createLinearGradient(0, 0 , this.Canvas.width , this.Canvas.height );
                                                linGrd.addColorStop(0.0, "lightsteelblue");
                                                linGrd.addColorStop(1.0, "whitesmoke");
                                                this.Canvas.context.fillStyle = linGrd; //color;
                                                
                                                //this.Canvas.context.fillStyle = "black";
                                                this.Canvas.context.fillRect(0, 0 , this.Canvas.width , this.Canvas.height);
                                                this.PlotArea.width = this.Canvas.width - 300;
                                                this.PlotArea.height = this.Canvas.height - 150;
                                                this.PlotArea.x1 = this.PlotArea.x + this.PlotArea.width;
                                                this.PlotArea.y1 = this.PlotArea.y + this.PlotArea.height;
                                                DrawTitle();
                                                //DrawPlotBackground();
                                                DrawBox();
                                                //DrawYAxis();
                                                //DrawYGrid();
                                                DrawYDataLabels();
                                                DrawYAxisLabel();
                                                //DrawXAxis();
                                                //DrawXGrid();
                                                DrawXDataLabels();
                                                DrawXAxisLabel();
                                                
                                                
                                            }.bind(this);
                                            
                                            var DrawTitle = function(){
                                                var offsetY = -30;
                                                this.Canvas.context.font = "14px sans-serif";
                                                this.Canvas.context.fillStyle = "black";
                                                this.Canvas.context.textAlign = "center";
                                                this.Canvas.context.textBaseline = "bottom";
                                                this.Canvas.context.fillText(this.Data.title, this.Canvas.width / 2, this.PlotArea.y + offsetY);
                                            }.bind(this);
                                            var DrawPlotBackground = function(){
                                                var w = this.DataPointWidth/2;
                                                var offset = this.Series.length * this.DataPointWidth;
                                                // draw just a filled rectangle in the xy plane: xy plane
                                                this.Canvas.context.fillStyle = "white"; //color;
                                                this.Canvas.context.fillRect(this.PlotArea.x + this.DataPointWidth + offset, this.PlotArea.y - offset, this.PlotArea.width, this.PlotArea.height + offset);
                                                // draw a parallelagram for the z plane at 0 x-axis
                                                
						this.Canvas.context.fillStyle = "lightgray";
						this.Canvas.context.beginPath();
						this.Canvas.context.moveTo(this.PlotArea.x, this.PlotArea.y1);
						this.Canvas.context.lineTo(this.PlotArea.x + w,this.PlotArea.y1 - w);
						this.Canvas.context.lineTo(this.PlotArea.x1 + w, this.PlotArea.y1 - w);
						this.Canvas.context.lineTo(this.PlotArea.x1, this.PlotArea.y1);
						this.Canvas.context.fill();
                                                
                                            }.bind(this);
                                            
                                            
                                            var DrawYAxis = function(){
                                                
                                            }.bind(this);
                                            
                                            var DrawYGrid = function(){
                                                
                                            }.bind(this);
                                            
                                            var DrawYDataLabels = function(){
                                                var interval = Number((this.Data.ymax/10).toFixed());
                                                var tmpInterval = 0;
                                                var step = Number((this.Box.BackPanel.h/10).toFixed());
                                                
                                                this.Canvas.context.textAlign = "right";
                                                this.Canvas.context.textBaseline = "middle";
                                                this.Canvas.context.fillStyle = "black";
                                                this.Canvas.context.font = "12px sans-serif";
                                                
                                                for(var i = 0; i < 10; i++) {
                                                    this.Canvas.context.fillText(this.Properties.YAxis.min + tmpInterval, this.PlotArea.x - 5, this.PlotArea.y1-(i*step));
                                                    tmpInterval += interval;
                                                    
                                                    this.Canvas.context.strokeStyle = "lightgray";
                                                    // draw a closed path
                                                    this.Canvas.context.beginPath();
                                                    this.Canvas.context.moveTo(this.PlotArea.x, this.PlotArea.y1-(i*step));
                                                    this.Canvas.context.lineTo(this.Box.BackPanel.x, this.PlotArea.y1-(i*step)-this.Box.yOffset);
                                                    this.Canvas.context.lineTo(this.Box.BackPanel.x+this.Box.BackPanel.w+this.DataPointWidth, this.PlotArea.y1-(i*step)-this.Box.yOffset);
                                                    this.Canvas.context.stroke();
                                                }
                                                this.Canvas.context.fillText(tmpInterval, this.PlotArea.x - 5, this.PlotArea.y1-(10*step));
                                                this.Canvas.context.strokeStyle = "lightgray";
                                                // draw a closed path
                                                this.Canvas.context.beginPath();
                                                this.Canvas.context.moveTo(this.Box.BackPanel.x, this.Box.BackPanel.y+this.Box.BackPanel.h);
                                                this.Canvas.context.lineTo(this.Box.BackPanel.x, this.Box.BackPanel.y);
                                                this.Canvas.context.stroke();
                                            }.bind(this);
                                            
                                            var DrawYAxisLabel = function(){
                                                this.Canvas.context.save();
                                                this.Canvas.context.translate(this.PlotArea.x - 50, this.PlotArea.y1 - this.PlotArea.height/2);
                                                this.Canvas.context.rotate(-Math.PI/2);
                                                this.Canvas.context.textAlign = "center";
                                                this.Canvas.context.fillStyle = "black";
                                                this.Canvas.context.font = "12px sans-serif";
                                                this.Canvas.context.fillText(this.Properties.YAxis.label, 0, 0);
                                                this.Canvas.context.restore();
                                            }.bind(this);
                                            
                                            var DrawXAxis = function(){
                                                
                                            }.bind(this);
                                            
                                            var DrawXGrid = function(){
                                                
                                            }.bind(this);
                                            
                                            var DrawXDataLabels = function(){
                                                var interval = Number(((this.Data.max-this.Data.min)/5).toFixed(1));
                                                var tmpInterval = 0;
                                                var step = Number((this.Box.BackPanel.w/5).toFixed(1));
                                                
                                                this.Canvas.context.textAlign = "left";
                                                this.Canvas.context.fillStyle = "black";
                                                this.Canvas.context.font = "12px sans-serif";
                                                
                                                for(var i = 0; i < 5; i++) {
                                                    var p = Number((Number(this.Data.min.toFixed(1)) + Number(tmpInterval.toFixed(1))).toFixed(1));
                                                    this.Canvas.context.fillText(Number((Number(this.Data.min.toFixed(1)) + Number(tmpInterval.toFixed(1))).toFixed(1)), this.PlotArea.x + (i*step) - 5, this.PlotArea.y1 + 15);
                                                    tmpInterval += interval;
                                                }
                                                this.Canvas.context.fillText(Number((Number(this.Data.min.toFixed(1)) + Number(tmpInterval.toFixed(1))).toFixed(1)), this.PlotArea.x + (5*step), this.PlotArea.y1 + 15);
                                            }.bind(this);
                                            
                                            var DrawXAxisLabel = function(){
                                                var offsetY = 40;
                                                this.Canvas.context.fillStyle = "black";
                                                this.Canvas.context.font = "12px sans-serif";
                                                this.Canvas.context.textAlign = "center";
                                                this.Canvas.context.textBaseline = "bottom";
                                                //this.Canvas.context.fillText(this.Properties.XAxis.label, this.Canvas.width / 2, this.Canvas.height - offsetY);
                                                this.Canvas.context.fillText(this.Properties.XAxis.label, this.PlotArea.x + (this.PlotArea.width/2), this.PlotArea.y1 + offsetY);
                                                //this.Canvas.context.fillText(this.Properties.XAxis.min, this.PlotArea.x,this.Canvas.height - offsetY);
                                                //this.Canvas.context.fillText(this.Properties.XAxis.max, this.PlotArea.x + this.PlotArea.width,this.Canvas.height - offsetY)
                                            }.bind(this); 

                                            this.DrawLegend = function(){
                                                
                                                BuildLegend();
                                                
                                                this.Canvas.context.strokeStyle = "black";
                                                this.Canvas.context.strokeRect(this.Legend.x, this.Legend.y, this.Legend.width, this.Legend.height);
                                                
                                                this.Canvas.context.font = "12px sans-serif";
                                                //var hF = this.Canvas.context.font;
                                                //hf = hf.slice(2);
                                                this.Canvas.context.fillStyle = "black";
                                                this.Canvas.context.textAlign = "center";
                                                this.Canvas.context.textBaseline = "bottom";
                                                this.Canvas.context.fillText("Statistics", this.Legend.x + (this.Legend.width/2), this.Legend.y + 14);
                                                
                                                for(var i=0; i<this.Legend.tabs.length; i++){
                                                    this.Canvas.context.fillStyle = "rgb(" + this.Data.series[i].color[0] + ", " + this.Data.series[i].color[1]+ ", " + this.Data.series[i].color[2] + ")"
                                                    this.Canvas.context.fillRect(this.Legend.tabs[i].x, this.Legend.tabs[i].y, this.Legend.tabs[i].width, this.Legend.tabs[i].height);
                                                }
                                                
                                                //this.Canvas.context.fillStyle = "white";
                                                //this.Canvas.context.fillRect(this.Legend.x, this.Legend.tabs[0].y + this.Legend.tabs[0].height, this.Legend.x + this.Legend.width, this.Legend.y + this.Legend.height);
                                                this.Canvas.context.font = "10px monaco";
                                                this.Canvas.context.textAlign = "left";
                                                this.Canvas.context.fillStyle = "black";
                                                var f = this.Data.dOrder[this.Data.series.length-1];
                                                var h = this.Legend.tabs[0].y + this.Legend.tabs[0].height;
                                                this.Canvas.context.fillText("Min:   " + this.Data.series[f].stats[0].toFixed(2), this.Legend.x  + 3 , h+(this.Legend.tabs[0].height-3)*1);
                                                this.Canvas.context.fillText("Max:   " + this.Data.series[f].stats[1].toFixed(2), this.Legend.x  + 3 , h+(this.Legend.tabs[0].height-3)*2);
                                                this.Canvas.context.fillText("N:     " + this.Data.series[f].stats[2].toFixed(), this.Legend.x  + 3 , h+(this.Legend.tabs[0].height-3)*3);
                                                this.Canvas.context.fillText("Mean:  " + this.Data.series[f].stats[3].toFixed(2), this.Legend.x  + 3 , h+(this.Legend.tabs[0].height-3)*4);
                                                this.Canvas.context.fillText("Stdev: " + this.Data.series[f].stats[4].toFixed(2), this.Legend.x  + 3 , h+(this.Legend.tabs[0].height-3)*5);
                                                
                                                this.Canvas.context.strokeStyle = "black";
                                                this.Canvas.context.strokeRect(this.Legend.x, this.Legend.y + this.Legend.height + 10, this.Legend.width, 75);
                                                
                                                this.Canvas.context.font = "12px sans-serif";
                                                this.Canvas.context.fillStyle = "black";
                                                this.Canvas.context.textAlign = "center";
                                                this.Canvas.context.textBaseline = "bottom";
                                                this.Canvas.context.fillText("Legend", this.Legend.x + (this.Legend.width/2), this.Legend.y + this.Legend.height + 25);
                                                for(var i=0, k=16; i<this.Data.series.length; i++){
                                                    this.Canvas.context.fillStyle = "rgb(" + this.Data.series[i].color[0] + ", " + this.Data.series[i].color[1]+ ", " + this.Data.series[i].color[2] + ")"
                                                    this.Canvas.context.fillRect(this.Legend.x, this.Legend.y + this.Legend.height + 15 + (k*(1+i)), 14, 14);
                                                    
                                                    this.Canvas.context.font = "12px sans-serif";
                                                    this.Canvas.context.textAlign = "left";
                                                    if(this.Data.dOrder[this.Data.series.length-1] == i){
                                                        this.Canvas.context.fillStyle = "rgb(" + this.Data.series[i].color[0] + ", " + this.Data.series[i].color[1]+ ", " + this.Data.series[i].color[2] + ")"
                                                    }
                                                    else {this.Canvas.context.fillStyle = "black";}
                                                    this.Canvas.context.fillText(this.Data.series[i].browser, this.Legend.x + 20, this.Legend.y + this.Legend.height + 30 + (k*(1+i)));
                                                    
                                                }
                                                
                                            
                                                
                                            
                                                
                                                
                                                
                                            }.bind(this);

                                            var DrawBar = function(x,y,z,color){
                                                
                                                var pX = this.PlotArea.x + (x - this.Properties.XAxis.min) * ( this.Box.BackPanel.w / (this.Properties.XAxis.max - this.Properties.XAxis.min) );
                                                var height = (y - this.Properties.YAxis.min) * ( this.Box.BackPanel.h / (this.Properties.YAxis.max - this.Properties.YAxis.min) );
                                                var pY = this.PlotArea.y + this.PlotArea.height - height;//.BackPanel.h - height;
                                                var width = this.DataPointWidth;
                                                
                                                var depth = this.Box.depth/(2*this.Box.nSeries-1);
                                                var sxOffset = depth*Math.cos(this.Box.rad)*2;
                                                var syOffset = depth*Math.sin(this.Box.rad)*2;
                                                var bxOffset = depth*Math.cos(this.Box.rad);
                                                var byOffset = depth*Math.sin(this.Box.rad);
                                                
                                                var width = this.DataPointWidth;
                                                // adjust pX and pY for series number
                                                pX = pX + sxOffset*(this.Box.nSeries-z);
                                                pY = pY - syOffset*(this.Box.nSeries-z);
                                                
                                                //JaHOVA/Tests/WebWorker/External/Results/CreateFirstWorkerSafari.txt
                                                
                                                // draw a filled rectangle in the xy plane: front of column
                                                //os.console.AppendComment("Color[1]: " + color[1] + ", Converted: " + color[1].toString(16));
                                                
						this.Canvas.context.fillStyle = "rgb(" + color[0] + ", " + color[1]+ ", " + color[2] + ")";
                                                //os.console.AppendComment("Color: " + this.Canvas.context.fillStyle);
                                                
						this.Canvas.context.fillRect(pX, pY, width, height);
						var dColor = 60
						// draw a filled rectangle in the xy plane: right side of column
						this.Canvas.context.fillStyle = "rgb(" + (color[0] - dColor) + ", " + (color[1] - dColor)+ ", " + (color[2] - dColor) + ")";
						// draw a closed path
						this.Canvas.context.beginPath();
						this.Canvas.context.moveTo(pX+width,pY);
						this.Canvas.context.lineTo(pX+width,pY+height);
						this.Canvas.context.lineTo(pX+width+bxOffset,pY+height-byOffset);
						this.Canvas.context.lineTo(pX+width+bxOffset,pY-byOffset);
						this.Canvas.context.fill();
						
						// draw a filled rectangle in the xy plane: top of column
						this.Canvas.context.fillStyle = "rgb(" + (color[0] + dColor) + ", " + (color[1] + dColor)+ ", " + (color[2] + dColor) + ")";
						// draw a closed path
						this.Canvas.context.beginPath();
						this.Canvas.context.moveTo(pX,pY);
						this.Canvas.context.lineTo(pX+width,pY);
						this.Canvas.context.lineTo(pX+width+bxOffset,pY-byOffset);
						this.Canvas.context.lineTo(pX+bxOffset,pY-byOffset);
						this.Canvas.context.fill();
                            
                                                
                                            }.bind(this);

                                        }
                                        
                                        //Create and Initialize Chart Object
                                        var chart = {};   
                                        chart.Title = 'My Test Chart';
                                        //chart.XAxisLabel = fileElements[2];
                                        //chart.YAxisLabel = fileElements[3];
                                        //chart.Data = fileElements.slice(4);
                                        /*
                                        os.console.file1.value ="";
                                        os.console.file1.value += "Title: " + chart.Title + "\n";
                                        os.console.file1.value += "X Axis Label: " + chart.XAxisLabel + "\n";
                                        os.console.file1.value += "Y Axis Label: " + chart.YAxisLabel + "\n";
                                        os.console.file1.value += "Data:\n ";
                                        chart.Data.forEach(function(x){os.console.file1.value += "\n" + x;});
                                        */
                                        //Create an output Window
                                        chart.Window = os.resschmgr.Create.Window("chart", "Distribution Plot", 900, 600, 100, 100);
                                        chart.Window.Elements.Window.style.backgroundImage = "url()";
                                        
                                        //Create Canvas Element
                                        chart.Canvas = document.createElement('canvas');
                                        chart.Canvas.id = chart.Title;
                                        chart.Canvas.width = '900';
                                        chart.Canvas.height = '580';
                                        chart.Plot = chart.Canvas.getContext('2d');
                                        
                                        chart.Window.Elements.Body.appendChild(chart.Canvas);
                                        
                                        //Create Bar Chart Object
                                        var barChart = new CChart(chart.Title);
                                        /*
                                        for(var i=0;i<tmpSeries.length;i++){
                                            var mySeries = new CSeries();
                                            barChart.Series[i] = mySeries;
                                            barChart.Series[i].rawData = s[i];
                                            barChart.Series[i].browser = barChart.Series[i].rawData[0];
                                            var d = barChart.Series[i].rawData.slice(4);
                                            barChart.Series[i].data = d[0].split("|");
                                            barChart.Series[i].data.pop();
                                        }
                                        */
                                        
                                        barChart.Canvas.width = '900';
                                        barChart.Canvas.height = '580';
                                        /*
                                        barChart.Properties.NumOfSeries = tmpSeries.length;
                                        barChart.Properties.XAxis.label = fileElements[2];
                                        barChart.Properties.YAxis.label = fileElements[3];
                                        barChart.Type = 'Histogram';
                                        barChart.Title = fileElements[1];
                                        barChart.Properties.XAxis.min = min;
                                        barChart.Properties.XAxis.max = max;
                                        barChart.Properties.YAxis.min = minY;
                                        barChart.Properties.YAxis.max = maxY;
                                        barChart.DataPointWidth  = 10;
                                        */
                                        barChart.LoadData(rawFile);
                                        barChart.DrawData();
                                        barChart.DrawLegend();
                                    },
                                    //******************************************
                                    //
                                    //  WEBGL DEMO
                                    //
                                    //******************************************
                                    WebGL: function(){
                                        canvas =  os.resschmgr.Create.HTMLElement("canvas"); //document.getElementById("glCanvas");
                                        canvas.html().style.width = "100%";
                                        canvas.html().style.height = "100%";
                                        
                                        Win = os.windows.WindowsManager.Create.Window("WebGL Demo", "PC");
                                        Win.Set.position(300,300);
                                        Win.elements.content.AppendChild(canvas.html());
                                        Win.elements.content.html().style.overflow = "hidden";
                                        Win.Set.statusbarText("FPS: ");
                                        Win.Display.window();
                                        Win.Set.width(400);
                                        Win.Set.height(300);
                                        Win.Set.onMax(os.graphics.OnReset);
                                        Win.Set.onMin(os.graphics.Pause);
                                        
                                        //Load WebGL (Debug: false, fullscreen: false, canvas HTML object)
                                        os.graphics.Load(true, false, canvas.html());
                                        
                                        //Load default mesh and texture
                                        os.graphics.Managers.Texture.Create.Texture("scorpion", "scripts/jahova/OS/Cores/Graphics/textures/scorpion.jpg");
                                        os.graphics.Managers.Mesh.Create.Mesh("scorpion", "scripts/jahova/OS/Cores/Graphics/meshes/scorpion.json");
                                        
                                        os.graphics.Managers.Texture.Create.Texture("goliath", "scripts/jahova/OS/Cores/Graphics/textures/goliath.jpg");
                                        os.graphics.Managers.Mesh.Create.Mesh("goliath", "scripts/jahova/OS/Cores/Graphics/meshes/goliath.json");
                                        
                                        //Creates a standard entity object and extends the graphics object
                                        ent = os.graphics.Managers.Entity.Create();
                                        
                                        //Adds mesh and texture to object
                                        ent.Graphics.Add.Mesh("scorpion");
                                        ent.Graphics.Add.Texture("scorpion");
                                        ent.Graphics.Vectors.Scale.set([0.5,0.5,0.5]);
                                        ent.Graphics.Update = function(dt){
                                            ent.roll += 0.05 * dt;
                                            //ent.yaw += 0.1 * dt;
                                            ent.pitch += 0.05 * dt;
                                            
                                            Win.Set.statusbarText("FPS: " + (1/dt * 1000).toFixed(3));
                                        }
                                        
                                        //Adds object to be auto updated and drawn
                                        os.graphics.AddToWorld(ent);
                                        
                                        //Start graphics context to draw and update
                                        os.graphics.Start();
                                        
                                        
                                        
                                        
                                        
                                        
                                    },
                                    Fog: function(){
                                        var canvas = os.resschmgr.Create.HTMLElement("canvas");
                                        canvas.html().style.width = "100%";
                                        canvas.html().style.height = "100%";
                                        
                                        document.body.appendChild(canvas.html());
                                        document.body.style.overflow = "hidden";
                                        
                                        //Load WebGL (Debug: false, fullscreen: false, canvas HTML object)
                                        os.graphics.Load(false, false, canvas.html());
                                        
                                        //Load default mesh and texture
                                        os.graphics.Managers.Texture.Create.Texture("starhawk", "scripts/jahova/OS/Cores/Graphics/textures/starhawk.jpg");
                                        os.graphics.Managers.Mesh.Create.Mesh("starhawk", "scripts/jahova/OS/Cores/Graphics/meshes/starhawk.json");
                                        quad = os.graphics.Managers.Mesh.Create.Primitive.Quad("quad");
                                        quad.Initialize();
                                        
                                        //Load Dynamic Shadow VS and FS
                                        os.graphics.Managers.Shader.Create.VertexShader("shadow", "scripts/jahova/OS/Cores/Graphics/shaders/shadow.vs");
                                        os.graphics.Managers.Shader.Create.FragmentShader("shadow", "scripts/jahova/OS/Cores/Graphics/shaders/shadow.fs");
                                        
                                        //Set Up Control Window
                                        Win = os.windows.WindowsManager.Create.Window("Fog", "PC");
                                        Win.Set.position(0,0);
                                        Win.elements.content.html().style.overflow = "hidden";
                                        Win.Set.statusbarText("");
                                        Win.Display.window();
                                        Win.Set.width(200);
                                        Win.Set.height(60);
                                        Win.Set.onMax(os.graphics.OnReset);
                                        Win.Set.onMin(os.graphics.Pause);
                                        
                                        //Create Terrain Quad
                                        terrain = os.graphics.Managers.Entity.Create();
                                        terrain.Graphics.Add.Mesh("quad");
                                        terrain.Graphics.Set.light(false);
                                        terrain.Graphics.Set.useBlendColor(true);
                                        terrain.Graphics.Set.texture(false);
                                        terrain.Graphics.Set.blendColor([0.17,0.26,0.40]);
                                        terrain.Set.Scale(2000,2000,2000);
                                        terrain.pitch = 90;
                                        terrain.Set.Position(0,1999,0);
                                        terrain.Graphics.Set.fog(true);
                                        terrain.Graphics.Set.fogEndPosition(1000.0);
                                        terrain.Graphics.Set.fogBeginPosition(200.0);
                                        os.graphics.AddToWorld(terrain);

                                        //Create Ship Entity
                                        starhawk = os.graphics.Managers.Entity.Create();
                                        
                                        //Adds mesh and texture to object
                                        starhawk.Graphics.Add.Mesh("starhawk");
                                        starhawk.Graphics.Add.Texture("starhawk");
                                        starhawk.Graphics.Vectors.Scale.set([0.5,0.5,0.5]);
                                        starhawk.Set.Position(0,50,100);
                                        starhawk.Graphics.Update = function(dt){
                                            //starhawk.roll += 0.05 * dt;
                                            starhawk.yaw += 0.05 * dt;
                                            //starhawk.pitch += 0.05 * dt;
                                            
                                        }
                                        
                                        
                                        starhawk.Graphics.Set.fog(true);
                                        starhawk.Graphics.Set.fogEndPosition(1500.0);
                                        starhawk.Graphics.Set.fogBeginPosition(200.0);
                                        //Build Shadow Program and Link
                                        var prgShadow = os.graphics.Managers.Shader.Create.Program("shadow", "shadow", "shadow");
                                        
                                         //Add Attributes to Shadow Program
                                        prgShadow.CreateAttribute("aVertexPosition");
                                                        
                                        //Add Uniforms to Skybox Program
                                        prgShadow.CreateUniform("uPMatrix");
                                        prgShadow.CreateUniform("uVMatrix");
                                        prgShadow.CreateUniform("uWMatrix");
                                        prgShadow.CreateUniform("uLight");
                                        
                                        //Create Shadow Shader for Ship
                                        var shadowShader = starhawk.Graphics.Add.Shader("shadow", "shadow");
                                        
                                        //Add Attribute and Uniform Pointers
                                        shadowShader.AddAttribute("aVertexPosition", "FLOAT", null, "VERTEX", null);
                                        
                                        //Add Uniforms to Entity
                                        shadowShader.AddUniform("uPMatrix", "4X4", os.graphics.Matrix.Projection);
                                        shadowShader.AddUniform("uVMatrix", "4X4", os.graphics.Matrix.View);
                                        shadowShader.AddUniform("uWMatrix", "4X4", starhawk.Graphics.Matrix.World);
                                        shadowShader.AddUniform("uLight", "VEC3", [0.0, 1000.0, 500.0]);

                                        //Adds object to be auto updated and drawn
                                        os.graphics.AddToUpdate(starhawk);
                                        
                                        //User Defined Draw Call
                                        FogDraw = function(){
                                            starhawk.Graphics.Draw("default");
                                            starhawk.Graphics.Draw("shadow");
                                        }
                                        
                                        FogUpdate = function(dt){
                                            Win.Set.statusbarText("FPS: " + (1/dt * 1000).toFixed(3));
                                        }
                                        
                                        
                                        //Register User Defined Callbacks 
                                        os.graphics.Set.Callback.Draw(FogDraw);
                                        os.graphics.Set.Callback.Update(FogUpdate);
                                        
                                        //Give Camera Default Position and Rotation                                        
                                        os.graphics.Managers.Camera.MoveUp(150);
                                        os.graphics.Managers.Camera.Rotation.pitch = 5;
                                        
                                        //Setup Input Controls
                                        Input = {
                                            Mouse: {
                                                lastX: 0,
                                                lastY: 0,
                                                pressed: false
                                            }
                                        }
                                        onKeyDown = function(e){
                                            if(String.fromCharCode(e.keyCode) == "W"){     //Forward
                                                os.graphics.Managers.Camera.MoveForward(10);   
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "S"){     //Backware
                                                os.graphics.Managers.Camera.MoveBackward(10);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "A"){     //Straif Left
                                                os.graphics.Managers.Camera.MoveLeft(10);  
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "D"){     //Straif Right
                                                os.graphics.Managers.Camera.MoveRight(10);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "Q"){     //Straif Up
                                                os.graphics.Managers.Camera.MoveUp(5);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "E"){     //Straif Down
                                                os.graphics.Managers.Camera.MoveDown(10);
                                            }
                                            
                                            
                                        }
                                        onMouseDown = function(e){
                                            Input.Mouse.lastX = e.clientX;
                                            Input.Mouse.lastY = e.clientY;
                                            Input.Mouse.pressed = true;
                                        }
                                        
                                        onMouseUp = function(e){
                                            Input.Mouse.pressed = false;
                                        }
                                        
                                        onMouseMove = function(e){
                                            if (!Input.Mouse.pressed) {
                                                return;
                                            }
                                            var cam = os.graphics.Managers.Camera;
                                            
                                            var newX = e.clientX;
                                            var newY = e.clientY;
                                        
                                            var deltaX = newX - Input.Mouse.lastX
                                            cam.Rotation.yaw += deltaX / 10;
                                            
                                            if(cam.Rotation.yaw > 360){ cam.Rotation.yaw  -= 360;}
                                            else if(cam.Rotation.yaw < 0) { cam.Rotation.yaw += 360; }
                                        
                                            var deltaY = newY - Input.Mouse.lastY;
                                            cam.Rotation.pitch += deltaY / 10;
                                            if(cam.Rotation.pitch > 360){ cam.Rotation.pitch  -= 360;}
                                            else if(cam.Rotation.pitch < 0) { cam.Rotation.pitch += 360; }
                                        
                                            Input.Mouse.lastX = newX
                                            Input.Mouse.lastY = newY;   
                                        }
                                        
                                        
                                        // Setup Event Handlers for User Input
                                        window.addEventListener("keydown", onKeyDown, false);
                                        os.graphics.Get.Canvas().addEventListener("mousedown", onMouseDown, false);
                                        document.addEventListener("mouseup", onMouseUp, false);
                                        document.addEventListener("mousemove", onMouseMove, false);
                                        
                                        
                                        //Start graphics context to draw and update
                                        os.graphics.Start();
                                    },
                                    DynamicShadow: function(){
                                        var canvas = os.resschmgr.Create.HTMLElement("canvas");
                                        canvas.html().style.width = "100%";
                                        canvas.html().style.height = "100%";
                                        
                                        document.body.appendChild(canvas.html());
                                        document.body.style.overflow = "hidden";
                                        
                                        //Load WebGL (Debug: false, fullscreen: false, canvas HTML object)
                                        os.graphics.Load(false, false, canvas.html());
                                        
                                        //Load default mesh and texture
                                        os.graphics.Managers.Texture.Create.Texture("starhawk", "scripts/jahova/OS/Cores/Graphics/textures/starhawk.jpg");
                                        os.graphics.Managers.Mesh.Create.Mesh("starhawk", "scripts/jahova/OS/Cores/Graphics/meshes/starhawk.json");
                                        quad = os.graphics.Managers.Mesh.Create.Primitive.Quad("quad");
                                        quad.Initialize();
                                        
                                        //Load Dynamic Shadow VS and FS
                                        os.graphics.Managers.Shader.Create.VertexShader("shadow", "scripts/jahova/OS/Cores/Graphics/shaders/shadow.vs");
                                        os.graphics.Managers.Shader.Create.FragmentShader("shadow", "scripts/jahova/OS/Cores/Graphics/shaders/shadow.fs");
                                        
                                        //Set Up Control Window
                                        Win = os.windows.WindowsManager.Create.Window("Dynamic Shadows", "PC");
                                        Win.Set.position(0,0);
                                        Win.elements.content.html().style.overflow = "hidden";
                                        Win.Set.statusbarText("");
                                        Win.Display.window();
                                        Win.Set.width(200);
                                        Win.Set.height(60);
                                        Win.Set.onMax(os.graphics.OnReset);
                                        Win.Set.onMin(os.graphics.Pause);
                                        
                                        //Create Terrain Quad
                                        terrain = os.graphics.Managers.Entity.Create();
                                        terrain.Graphics.Add.Mesh("quad");
                                        terrain.Graphics.Set.light(false);
                                        terrain.Graphics.Set.useBlendColor(true);
                                        terrain.Graphics.Set.texture(false);
                                        terrain.Graphics.Set.blendColor([0.17,0.26,0.40]);
                                        terrain.Set.Scale(2000,2000,2000);
                                        terrain.pitch = 90;
                                        terrain.Set.Position(0,1999,0);
                                        os.graphics.AddToWorld(terrain);

                                        //Create Ship Entity
                                        starhawk = os.graphics.Managers.Entity.Create();
                                        
                                        //Adds mesh and texture to object
                                        starhawk.Graphics.Add.Mesh("starhawk");
                                        starhawk.Graphics.Add.Texture("starhawk");
                                        starhawk.Graphics.Vectors.Scale.set([0.5,0.5,0.5]);
                                        starhawk.Set.Position(0,250,500);
                                        starhawk.Graphics.Update = function(dt){
                                            starhawk.roll += 0.05 * dt;
                                            //starhawk.yaw += 0.05 * dt;
                                            starhawk.pitch += 0.05 * dt;
                                            
                                            Win.Set.statusbarText("FPS: " + (1/dt * 1000).toFixed(3));
                                        }
                                        
                                        //Build Shadow Program and Link
                                        var prgShadow = os.graphics.Managers.Shader.Create.Program("shadow", "shadow", "shadow");
                                        
                                         //Add Attributes to Shadow Program
                                        prgShadow.CreateAttribute("aVertexPosition");
                                                        
                                        //Add Uniforms to Skybox Program
                                        prgShadow.CreateUniform("uPMatrix");
                                        prgShadow.CreateUniform("uVMatrix");
                                        prgShadow.CreateUniform("uWMatrix");
                                        prgShadow.CreateUniform("uLight");
                                        
                                        //Create Shadow Shader for Ship
                                        var shadowShader = starhawk.Graphics.Add.Shader("shadow", "shadow");
                                        
                                        //Add Attribute and Uniform Pointers
                                        shadowShader.AddAttribute("aVertexPosition", "FLOAT", null, "VERTEX", null);
                                        
                                        //Add Uniforms to Entity
                                        shadowShader.AddUniform("uPMatrix", "4X4", os.graphics.Matrix.Projection);
                                        shadowShader.AddUniform("uVMatrix", "4X4", os.graphics.Matrix.View);
                                        shadowShader.AddUniform("uWMatrix", "4X4", starhawk.Graphics.Matrix.World);
                                        shadowShader.AddUniform("uLight", "VEC3", [0.0, 1000.0, 500.0]);

                                        //Adds object to be auto updated and drawn
                                        os.graphics.AddToUpdate(starhawk);
                                        
                                        //User Defined Draw Call
                                        ShadowDraw = function(){
                                            starhawk.Graphics.Draw("default");
                                            starhawk.Graphics.Draw("shadow");
                                        }
                                        
                                        //Register User Defined Draw 
                                        os.graphics.Set.Callback.Draw(ShadowDraw);
                                        
                                        //Give Camera Default Position and Rotation                                        
                                        os.graphics.Managers.Camera.MoveUp(150);
                                        os.graphics.Managers.Camera.Rotation.pitch = 5;
                                        
                                        //Setup Input Controls
                                        Input = {
                                            Mouse: {
                                                lastX: 0,
                                                lastY: 0,
                                                pressed: false
                                            }
                                        }
                                        onKeyDown = function(e){
                                            if(String.fromCharCode(e.keyCode) == "W"){     //Forward
                                                os.graphics.Managers.Camera.MoveForward(10);   
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "S"){     //Backware
                                                os.graphics.Managers.Camera.MoveBackward(10);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "A"){     //Straif Left
                                                os.graphics.Managers.Camera.MoveLeft(10);  
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "D"){     //Straif Right
                                                os.graphics.Managers.Camera.MoveRight(10);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "Q"){     //Straif Up
                                                os.graphics.Managers.Camera.MoveUp(5);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "E"){     //Straif Down
                                                os.graphics.Managers.Camera.MoveDown(10);
                                            }
                                            
                                            
                                        }
                                        onMouseDown = function(e){
                                            Input.Mouse.lastX = e.clientX;
                                            Input.Mouse.lastY = e.clientY;
                                            Input.Mouse.pressed = true;
                                        }
                                        
                                        onMouseUp = function(e){
                                            Input.Mouse.pressed = false;
                                        }
                                        
                                        onMouseMove = function(e){
                                            if (!Input.Mouse.pressed) {
                                                return;
                                            }
                                            var cam = os.graphics.Managers.Camera;
                                            
                                            var newX = e.clientX;
                                            var newY = e.clientY;
                                        
                                            var deltaX = newX - Input.Mouse.lastX
                                            cam.Rotation.yaw += deltaX / 10;
                                            
                                            if(cam.Rotation.yaw > 360){ cam.Rotation.yaw  -= 360;}
                                            else if(cam.Rotation.yaw < 0) { cam.Rotation.yaw += 360; }
                                        
                                            var deltaY = newY - Input.Mouse.lastY;
                                            cam.Rotation.pitch += deltaY / 10;
                                            if(cam.Rotation.pitch > 360){ cam.Rotation.pitch  -= 360;}
                                            else if(cam.Rotation.pitch < 0) { cam.Rotation.pitch += 360; }
                                        
                                            Input.Mouse.lastX = newX
                                            Input.Mouse.lastY = newY;   
                                        }
                                        
                                        
                                        // Setup Event Handlers for User Input
                                        window.addEventListener("keydown", onKeyDown, false);
                                        os.graphics.Get.Canvas().addEventListener("mousedown", onMouseDown, false);
                                        document.addEventListener("mouseup", onMouseUp, false);
                                        document.addEventListener("mousemove", onMouseMove, false);
                                        
                                        
                                        //Start graphics context to draw and update
                                        os.graphics.Start();
                                    },
                                    CubeMap: function(){
                                        var canvas = os.resschmgr.Create.HTMLElement("canvas");
                                        canvas.html().style.width = "100%";
                                        canvas.html().style.height = "100%";
                                        
                                        document.body.appendChild(canvas.html());
                                        document.body.style.overflow = "hidden";
                                        
                                        //Load WebGL (Debug: false, fullscreen: false, canvas HTML object)
                                        os.graphics.Load(false, false, canvas.html());
                                        
                                        Win = os.windows.WindowsManager.Create.Window("Cube Map", "PC");
                                        Win.Set.position(0,0);
                                        Win.elements.content.html().style.overflow = "hidden";
                                        Win.Set.statusbarText("");
                                        Win.Display.window();
                                        Win.Set.width(100);
                                        Win.Set.height(60);
                                        Win.Set.onMax(os.graphics.OnReset);
                                        Win.Set.onMin(os.graphics.Pause);
                                        
    
                                        //Load Cube Maps
                                        
                                        var arch = os.graphics.Managers.Texture.Create.CubeMap("arch");
                                        arch.Load.positiveX("images/textures/cubemaps/arch/arch_positive_x.jpg");
                                        arch.Load.negativeX("images/textures/cubemaps/arch/arch_negative_x.jpg");
                                        arch.Load.positiveY("images/textures/cubemaps/arch/arch_positive_y.jpg");
                                        arch.Load.negativeY("images/textures/cubemaps/arch/arch_negative_y.jpg");
                                        arch.Load.positiveZ("images/textures/cubemaps/arch/arch_positive_z.jpg");
                                        arch.Load.negativeZ("images/textures/cubemaps/arch/arch_negative_z.jpg");
                                        
                                        var brightday = os.graphics.Managers.Texture.Create.CubeMap("brightday");
                                        brightday.Load.positiveX("images/textures/cubemaps/brightday/brightday2_positive_x.png");
                                        brightday.Load.negativeX("images/textures/cubemaps/brightday/brightday2_negative_x.png");
                                        brightday.Load.positiveY("images/textures/cubemaps/brightday/brightday2_positive_y.png");
                                        brightday.Load.negativeY("images/textures/cubemaps/brightday/brightday2_negative_y.png");
                                        brightday.Load.positiveZ("images/textures/cubemaps/brightday/brightday2_positive_z.png");
                                        brightday.Load.negativeZ("images/textures/cubemaps/brightday/brightday2_negative_z.png");
                                        
                                        var grandcanyon = os.graphics.Managers.Texture.Create.CubeMap("grandcanyon");
                                        grandcanyon.Load.positiveX("images/textures/cubemaps/grandcanyon/grandcanyon_positive_x.jpg");
                                        grandcanyon.Load.negativeX("images/textures/cubemaps/grandcanyon/grandcanyon_negative_x.jpg");
                                        grandcanyon.Load.positiveY("images/textures/cubemaps/grandcanyon/grandcanyon_positive_y.jpg");
                                        grandcanyon.Load.negativeY("images/textures/cubemaps/grandcanyon/grandcanyon_negative_y.jpg");
                                        grandcanyon.Load.positiveZ("images/textures/cubemaps/grandcanyon/grandcanyon_positive_z.jpg");
                                        grandcanyon.Load.negativeZ("images/textures/cubemaps/grandcanyon/grandcanyon_negative_z.jpg");
                                        
                                        var hills = os.graphics.Managers.Texture.Create.CubeMap("hills");
                                        hills.Load.positiveX("images/textures/cubemaps/hills/hills_positive_x.png");
                                        hills.Load.negativeX("images/textures/cubemaps/hills/hills_negative_x.png");
                                        hills.Load.positiveY("images/textures/cubemaps/hills/hills_positive_y.png");
                                        hills.Load.negativeY("images/textures/cubemaps/hills/hills_negative_y.png");
                                        hills.Load.positiveZ("images/textures/cubemaps/hills/hills_positive_z.png");
                                        hills.Load.negativeZ("images/textures/cubemaps/hills/hills_negative_z.png");
                                        
                                        var mars = os.graphics.Managers.Texture.Create.CubeMap("mars");
                                        mars.Load.positiveX("images/textures/cubemaps/mars/mars_positive_x.jpg");
                                        mars.Load.negativeX("images/textures/cubemaps/mars/mars_negative_x.jpg");
                                        mars.Load.positiveY("images/textures/cubemaps/mars/mars_positive_y.jpg");
                                        mars.Load.negativeY("images/textures/cubemaps/mars/mars_negative_y.jpg");
                                        mars.Load.positiveZ("images/textures/cubemaps/mars/mars_positive_z.jpg");
                                        mars.Load.negativeZ("images/textures/cubemaps/mars/mars_negative_z.jpg");
                                        
                                        var museum = os.graphics.Managers.Texture.Create.CubeMap("museum");
                                        museum.Load.positiveX("images/textures/cubemaps/museum/museum_positive_x.png");
                                        museum.Load.negativeX("images/textures/cubemaps/museum/museum_negative_x.png");
                                        museum.Load.positiveY("images/textures/cubemaps/museum/museum_positive_y.png");
                                        museum.Load.negativeY("images/textures/cubemaps/museum/museum_negative_y.png");
                                        museum.Load.positiveZ("images/textures/cubemaps/museum/museum_positive_z.png");
                                        museum.Load.negativeZ("images/textures/cubemaps/museum/museum_negative_z.png");
                                        
                                        var snow = os.graphics.Managers.Texture.Create.CubeMap("snow");
                                        snow.Load.positiveX("images/textures/cubemaps/snow/snow_positive_x.jpg");
                                        snow.Load.negativeX("images/textures/cubemaps/snow/snow_negative_x.jpg");
                                        snow.Load.positiveY("images/textures/cubemaps/snow/snow_positive_y.jpg");
                                        snow.Load.negativeY("images/textures/cubemaps/snow/snow_negative_y.jpg");
                                        snow.Load.positiveZ("images/textures/cubemaps/snow/snow_positive_z.jpg");
                                        snow.Load.negativeZ("images/textures/cubemaps/snow/snow_negative_z.jpg");
                                        
                                        
                                        var space = os.graphics.Managers.Texture.Create.CubeMap("space");
                                        space.Load.positiveX("images/textures/cubemaps/space/space_positive_x.png");
                                        space.Load.negativeX("images/textures/cubemaps/space/space_negative_x.png");
                                        space.Load.positiveY("images/textures/cubemaps/space/space_positive_y.png");
                                        space.Load.negativeY("images/textures/cubemaps/space/space_negative_y.png");
                                        space.Load.positiveZ("images/textures/cubemaps/space/space_positive_z.png");
                                        space.Load.negativeZ("images/textures/cubemaps/space/space_negative_z.png");
                                        
                                        var terrain = os.graphics.Managers.Texture.Create.CubeMap("terrain");
                                        terrain.Load.positiveX("images/textures/cubemaps/terrain/terrain_positive_x.png");
                                        terrain.Load.negativeX("images/textures/cubemaps/terrain/terrain_negative_x.png");
                                        terrain.Load.positiveY("images/textures/cubemaps/terrain/terrain_positive_y.png");
                                        terrain.Load.negativeY("images/textures/cubemaps/terrain/terrain_negative_y.png");
                                        terrain.Load.positiveZ("images/textures/cubemaps/terrain/terrain_positive_z.png");
                                        terrain.Load.negativeZ("images/textures/cubemaps/terrain/terrain_negative_z.png");
                                        
                                        
                                        os.graphics.Managers.Texture.Create.Texture("scorpion", "scripts/jahova/OS/Cores/Graphics/textures/scorpion.jpg");
                                        os.graphics.Managers.Mesh.Create.Mesh("scorpion", "scripts/jahova/OS/Cores/Graphics/meshes/scorpion.json");
                                        
                                        ent = os.graphics.Managers.Entity.Create();
                                        
                                        //Adds mesh and texture to object
                                        ent.Graphics.Add.Mesh("scorpion");
                                        ent.Graphics.Add.Texture("scorpion");
                                        ent.Graphics.Vectors.Scale.set([0.1,0.1,0.1]);
                                        ent.Graphics.Update = function(dt){
                                            //ent.roll += 0.05 * dt;
                                            //ent.yaw += 0.1 * dt;
                                            //ent.pitch += 0.05 * dt;
                                            
                                            Win.Set.statusbarText("FPS: " + (1/dt * 1000).toFixed(3));
                                        }
                                        
                                        //Adds object to be auto updated and drawn
                                        os.graphics.AddToWorld(ent);
                                        
                                        //Load Skybox VS and FS
                                        os.graphics.Managers.Shader.Create.VertexShader("skybox", "scripts/jahova/OS/Cores/Graphics/shaders/skybox.vs");
                                        os.graphics.Managers.Shader.Create.FragmentShader("skybox", "scripts/jahova/OS/Cores/Graphics/shaders/skybox.fs");
                                    
                                        //Build Skybox Program and Link
                                        var prgSkybox = os.graphics.Managers.Shader.Create.Program("skybox", "skybox", "skybox");
                                        
                                        //Add Attributes to Skybox Program
                                        prgSkybox.CreateAttribute("aVertexPosition");
                                        prgSkybox.CreateAttribute("aVertexNormal");
                                                        
                                        //Add Uniforms to Skybox Program
                                        prgSkybox.CreateUniform("uPMatrix");
                                        prgSkybox.CreateUniform("uVMatrix");
                                        prgSkybox.CreateUniform("uWMatrix");
                                        prgSkybox.CreateUniform("uNMatrix");
                                        prgSkybox.CreateUniform("uSampler");
                                        
                                        //Create Entity with Skybox Program
                                        skybox = os.graphics.Managers.Entity.Create("skybox");
                                        
                                        //Create Shader
                                        var skyboxShader = skybox.Graphics.Add.Shader("skybox", "skybox");
                                        
                                        //Add Attributes
                                        skyboxShader.AddAttribute("aVertexPosition", "FLOAT", null, "VERTEX", null);
                                        skyboxShader.AddAttribute("aVertexNormal", "FLOAT", null, "NORMAL", null);
                                        
                                        //Add Uniforms to Entity
                                        skyboxShader.AddUniform("uPMatrix", "4X4", os.graphics.Matrix.Projection);
                                        skyboxShader.AddUniform("uVMatrix", "4X4", os.graphics.Matrix.View);
                                        skyboxShader.AddUniform("uWMatrix", "4X4", skybox.Graphics.Matrix.World);
                                        skyboxShader.AddUniform("uNMatrix", "3X3", skybox.Graphics.Matrix.Normal);
                                    
                                        //Build a Cube Primitive for Skybox
                                        var skyCube = os.graphics.Managers.Mesh.Create.Primitive.Cube("skybox");
                                        
                                        //Remove Texture Coordinate
                                        skyCube.model.vertexTextureCoords = null;
                                        
                                        //Initialize Mesh (i.e. Build Buffers, etc.)
                                        skyCube.Initialize();
                                        
                                        //Add Skybox Mesh and Texture to Skybox Entity
                                        skybox.Graphics.Add.Mesh("skybox");
                                        skybox.Graphics.Add.Texture("space");
                                        
                                        //Scale Skybox
                                        skybox.Set.Scale(5000,5000,5000);
                                        
                                        //Extend Attach Function
                                        skybox.Attach = function(ent){
                                            skybox.attachedEntity = ent;
                                            
                                            if(ent){
                                                skybox.attached = true;
                                            }
                                            else
                                                skybox.atached = false;
                                        }
                                        skybox.attached = false;
                                        skybox.attachedEntity = null;
                                        
                                        //Set Skybox to follow Camera
                                        skybox.Attach(os.graphics.Managers.Camera);
    
                                        //Setup Update Function
                                        skybox.Graphics.Update = function(dt){
                                            if(skybox.attached){
                                                vec3.set(skybox.attachedEntity.Position, skybox.Position);
                                            }
                                        }.bind(skybox);
                                        //Add to world for Auto Update and Draw
                                        os.graphics.AddToWorld(skybox);
                                        Input = {
                                            Mouse: {
                                                lastX: 0,
                                                lastY: 0,
                                                pressed: false
                                            }
                                        }
                                        onKeyDown = function(e){
                                            if(String.fromCharCode(e.keyCode) == "W"){     //Forward
                                                os.graphics.Managers.Camera.MoveForward(10);   
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "S"){     //Backware
                                                os.graphics.Managers.Camera.MoveBackward(10);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "A"){     //Straif Left
                                                os.graphics.Managers.Camera.MoveLeft(10);  
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "D"){     //Straif Right
                                                os.graphics.Managers.Camera.MoveRight(10);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "Q"){     //Straif Up
                                                os.graphics.Managers.Camera.MoveUp(5);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "E"){     //Straif Down
                                                os.graphics.Managers.Camera.MoveDown(10);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "1"){     //Arch
                                               skybox.Graphics.Texture.removeAll();
                                               skybox.Graphics.Add.Texture("arch");
                                               skybox.Set.Scale(5000,5000,5000);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "2"){     //Blue Sofa
                                                skybox.Graphics.Texture.removeAll();
                                                skybox.Graphics.Add.Texture("brightday");
                                                skybox.Set.Scale(5000,5000,5000);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "3"){     //Mars
                                                skybox.Graphics.Texture.removeAll();
                                                skybox.Graphics.Add.Texture("grandcanyon");
                                                skybox.Set.Scale(5000,5000,5000);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "4"){     //Mars
                                                skybox.Graphics.Texture.removeAll();
                                                skybox.Graphics.Add.Texture("hills");
                                                skybox.Set.Scale(5000,5000,5000);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "5"){     //Mars
                                                skybox.Graphics.Texture.removeAll();
                                                skybox.Graphics.Add.Texture("mars");
                                                skybox.Set.Scale(5000,5000,5000);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "6"){     //museum
                                                skybox.Graphics.Texture.removeAll();
                                                skybox.Graphics.Add.Texture("museum");
                                                skybox.Set.Scale(5000,5000,5000);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "7"){     //opensea
                                                skybox.Graphics.Texture.removeAll();
                                                skybox.Graphics.Add.Texture("snow");
                                                skybox.Set.Scale(5000,5000,5000);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "8"){     //space
                                                skybox.Graphics.Texture.removeAll();
                                                skybox.Graphics.Add.Texture("space");
                                                skybox.Set.Scale(5000,5000,5000);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "9"){     //Mars
                                                skybox.Graphics.Texture.removeAll();
                                                skybox.Graphics.Add.Texture("terrain");
                                                skybox.Set.Scale(5000,5000,5000);
                                            }
                                            
                                        }
                                        onMouseDown = function(e){
                                            Input.Mouse.lastX = e.clientX;
                                            Input.Mouse.lastY = e.clientY;
                                            Input.Mouse.pressed = true;
                                        }
                                        
                                        onMouseUp = function(e){
                                            Input.Mouse.pressed = false;
                                        }
                                        
                                        onMouseMove = function(e){
                                            if (!Input.Mouse.pressed) {
                                                return;
                                            }
                                            var cam = os.graphics.Managers.Camera;
                                            
                                            var newX = e.clientX;
                                            var newY = e.clientY;
                                        
                                            var deltaX = newX - Input.Mouse.lastX
                                            cam.Rotation.yaw += deltaX / 10;
                                            
                                            if(cam.Rotation.yaw > 360){ cam.Rotation.yaw  -= 360;}
                                            else if(cam.Rotation.yaw < 0) { cam.Rotation.yaw += 360; }
                                        
                                            var deltaY = newY - Input.Mouse.lastY;
                                            cam.Rotation.pitch += deltaY / 10;
                                            if(cam.Rotation.pitch > 360){ cam.Rotation.pitch  -= 360;}
                                            else if(cam.Rotation.pitch < 0) { cam.Rotation.pitch += 360; }
                                        
                                            Input.Mouse.lastX = newX
                                            Input.Mouse.lastY = newY;   
                                        }
                                        
                                        
                                        // Setup Event Handlers for User Input
                                        window.addEventListener("keydown", onKeyDown, false);
                                        os.graphics.Get.Canvas().addEventListener("mousedown", onMouseDown, false);
                                        document.addEventListener("mouseup", onMouseUp, false);
                                        document.addEventListener("mousemove", onMouseMove, false);
    
    
                                        //Start graphics context to draw and update
                                        os.graphics.Start();
                                    },
                                    
                                    JOSS: function(){
                                        //Network Testing
                                        //Create JaHOVA OS Network Object
                                        server = os.network.Create.JOSServer("demo.jahovaos.com", "8081", "");
                                        
                                        server.Events.onMessage = function(msg){
                                            os.windows.Create.ErrorWindow("JOS Server Message", "Messabe Received: <br/>" +
                                                                          "UserID: " + msg.UserID + " <br/>" +
                                                                          "SessionID: " + msg.SessionID + " <br/>" +
                                                                          "ModuleID: " + msg.ModuleID + " <br/>" +
                                                                          "Data Type: " + msg.Data.Type + " <br/>" +
                                                                          "Data Args: " + msg.Data.Args + " <br/>" +
                                                                          "Func ID: " + msg.FunctionID + " <br/>");
                                        }
                                        
                                        //Connect to Server
                                        server.Connect();
                                        
                                        //Send Request
                                        //server.AccessModule("MainSession", "AdminModule", "godfather");
                                    },
                                    //******************************************
                                    //
                                    //  Audio DEMO
                                    //
                                    //******************************************
                                    AudioAdd: function(){
                                        os.audio.Add("battle","scripts/Applications/Audio/BattleTheme",true, false);
                                    },
                                    AudioPlay: function(){
                                        os.audio.Play("battle");
                                        os.audio.Set.Volume("battle", 1.0);
                                    },
                                    AudioPause: function(){
                                        os.audio.Pause("battle");
                                    },
                                    //******************************************
                                    //
                                    //  Physics DEMO
                                    //
                                    //******************************************
                                    Collision: function(){
                                        //var canvas = os.resschmgr.Create.HTMLElement("canvas");
                                        //canvas.html().style.width = "100%";
                                        //canvas.html().style.height = "100%";
                                        
                                        //document.body.appendChild(canvas.html());
                                        //document.body.style.overflow = "hidden";
                                        //Load WebGL (Debug: false, fullscreen: false, canvas HTML object)
                                        os.graphics.Load(false, true);//, canvas.html());
                                        
                                        var quad = os.graphics.Managers.Mesh.Create.Primitive.Quad("quad");
                                        quad.Initialize();
                                        
                                        var cube = os.graphics.Managers.Mesh.Create.Primitive.Cube("cube");
                                        cube.Initialize();
                                        
                                        var sphMesh = os.graphics.Managers.Mesh.Create.Primitive.Sphere("sphere");
                                        sphMesh.Initialize();
                                        
                                        //Set Up Control Window
                                        Win = os.windows.WindowsManager.Create.Window("Collision Detection", "PC");
                                        Win.Set.position(0,0);
                                        Win.elements.content.html().style.overflow = "hidden";
                                        Win.Set.statusbarText("");
                                        Win.Display.window();
                                        Win.Set.width(200);
                                        Win.Set.height(60);
                                        Win.Hide.menubar();
                                        Win.Set.onMax(os.graphics.OnReset);
                                        Win.Set.onMin(os.graphics.Pause);
                                        
                                        //Create Terrain Quad
                                        var terrain = os.graphics.Managers.Entity.Create();
                                        terrain.Graphics.Add.Mesh("quad");
                                        terrain.Graphics.Set.light(false);
                                        terrain.Graphics.Set.useBlendColor(true);
                                        terrain.Graphics.Set.texture(false);
                                        terrain.Graphics.Set.blendColor([0.17,0.26,0.40]);
                                        terrain.Set.Scale(2000,2000,1);
                                        terrain.pitch = 90;
                                        terrain.Set.Position(0,0,0);
                                        terrain.Graphics.Set.fog(true);
                                        terrain.Graphics.Set.fogEndPosition(1000.0);
                                        terrain.Graphics.Set.fogBeginPosition(200.0);
                                        os.graphics.AddToWorld(terrain);
                                        
                                        var red = [0.57,0.26,0.40];
                                        var blue = [0.17,0.26,0.80];
                                        
                                        box = os.graphics.Managers.Entity.Create();
                                        box.Graphics.Add.Mesh("cube");
                                        box.Set.Position(-1,0,0);
                                        box.Set.Scale(1.01,1.01,1.01);
                                        box.Graphics.Set.useBlendColor(true);
                                        box.Graphics.Set.texture(false);
                                        box.Graphics.Set.blendColor(blue);
                                        //os.graphics.AddToWorld(box);
                                        
                                        sphere = os.graphics.Managers.Entity.Create();
                                        sphere.Graphics.Add.Mesh("sphere");
                                        sphere.Set.Position(1,0,0);
                                        sphere.Set.Scale(0.05,0.05,0.05);
                                        sphere.Graphics.Set.useBlendColor(true);
                                        sphere.Graphics.Set.texture(false);
                                        sphere.Graphics.Set.blendColor(blue);
                                        //os.graphics.AddToWorld(sphere);
                                        
                                        var numOfFrames = 0;
                                        var time = 0;
                                        var PhysicsUpdate = function(dt){
                                            time += os.graphics.Time.dt
                                            numOfFrames++;
                                            
                                            if(time > 1000){
                                                time = time / 1000;
                                                Win.Set.statusbarText("FPS: " + (numOfFrames/time).toFixed(3));
                                                time = 0;
                                                numOfFrames = 0;
                                            }
                                            
                                            if(obj1.physics.bv.CollisionTest(obj2.physics.bv)){
                                                obj1.graphics.Graphics.Set.blendColor(red);
                                                obj2.graphics.Graphics.Set.blendColor(red);
                                            }
                                            else{
                                                obj1.graphics.Graphics.Set.blendColor(blue);
                                                obj2.graphics.Graphics.Set.blendColor(blue);
                                            }
                                            //os.physics.Update.All(0.033);
                                            //p1.Get.PointInWorld(anchor, origin.Position)
                                            //os.physics.Update.All(dt/1000);
                                        }
                                        
                                        var PhysicsDraw = function(){
                                            obj1.graphics.Physics = obj1.physics;
                                            obj1.graphics.Graphics.Draw();
                                            
                                            obj2.graphics.Physics = obj2.physics;
                                            obj2.graphics.Graphics.Draw();
                                        }
                                        
                                        //Register User Defined Callbacks 
                                        os.graphics.Set.Callback.Draw(PhysicsDraw);
                                        os.graphics.Set.Callback.Update(PhysicsUpdate);
                                        
                                        //Give Camera Default Position and Rotation                                        
                                        //os.graphics.Managers.Camera.MoveUp(150);
                                        os.graphics.Managers.Camera.Position[0] = 0;
                                        os.graphics.Managers.Camera.Position[1] = 5;
                                        os.graphics.Managers.Camera.Position[2] = -25;
                                        os.graphics.Managers.Camera.Rotation.pitch = 5;
                                        
                                        var box1 = os.physics.Create.Entity(0.1);
                                        box1.Add.InertialTensor(os.physics.Create.InertialTensor.Cube(box1,1,1,1));
                                        box1.position[0] = -1;
                                        box1.position[1] = 0;
                                        box1.position[2] = 0;
                                        box1.CalculateDerivedData();
                                        box1.bv = os.physics.Create.BV.OBB(box1, [1,1,1]);
                                        
                                        var box2 = os.physics.Create.Entity(0.1);
                                        box2.Add.InertialTensor(os.physics.Create.InertialTensor.Cube(box2,1,1,1));
                                        box2.position[0] = -1;
                                        box2.position[1] = 0;
                                        box2.position[2] = 0;
                                        box2.CalculateDerivedData();
                                        box2.bv = os.physics.Create.BV.OBB(box2, [1,1,1]);
                                        
                                        var sphere1 = os.physics.Create.Entity(0.1);
                                        sphere1.Add.InertialTensor(os.physics.Create.InertialTensor.SphereSolid(sphere1,1,1,1));
                                        sphere1.position[0] = 1;
                                        sphere1.position[1] = 0;
                                        sphere1.position[2] = 0;
                                        sphere1.CalculateDerivedData();
                                        sphere1.bv = os.physics.Create.BV.Sphere(sphere1, 1);
                                        
                                        var sphere2 = os.physics.Create.Entity(0.1);
                                        sphere2.Add.InertialTensor(os.physics.Create.InertialTensor.SphereSolid(sphere2,1,1,1));
                                        sphere2.position[0] = 1;
                                        sphere2.position[1] = 0;
                                        sphere2.position[2] = 0;
                                        sphere2.CalculateDerivedData();
                                        sphere2.bv = os.physics.Create.BV.Sphere(sphere2, 1);
                                        
                                        obj1 = {
                                            graphics: sphere,
                                            physics: sphere1
                                        }
                                        obj2 = {
                                            graphics: sphere,
                                            physics: sphere2
                                        }
                                        
                                        Win.elements.content.html().innerHTML = "Press 1-4";
                                        //Setup Input Controls
                                        Input = {
                                            Mouse: {
                                                lastX: 0,
                                                lastY: 0,
                                                pressed: false
                                            }
                                        }
                                        onKeyDown = function(e){
                                            if(String.fromCharCode(e.keyCode) == "W"){     //Forward
                                                //os.graphics.Managers.Camera.MoveForward(1);
                                                obj1.physics.position[2]+= 0.1;
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "S"){     //Backware
                                                //os.graphics.Managers.Camera.MoveBackward(1);
                                                obj1.physics.position[2]-=0.1;
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "A"){     //Straif Left
                                                //os.graphics.Managers.Camera.MoveLeft(1);
                                                obj1.physics.position[0]-=0.1;
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "D"){     //Straif Right
                                                //os.graphics.Managers.Camera.MoveRight(1);
                                                obj1.physics.position[0]+= 0.1;
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "Q"){     //Straif Up
                                                //os.graphics.Managers.Camera.MoveUp(1);
                                                obj1.physics.position[1]+= 0.1;
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "E"){     //Straif Down
                                                //os.graphics.Managers.Camera.MoveDown(1);
                                                obj1.physics.position[1]-= 0.1;
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "R"){     //Reset
                                                //os.graphics.Managers.Camera.MoveDown(1);
                                                obj1.physics.position[0] = -1;
                                                obj1.physics.position[1] = 0;
                                                obj1.physics.position[2] = 0;
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "1"){     //Sphere-Sphere
                                                Win.elements.content.html().innerHTML = "Sphere-Sphere";
                                                obj1.graphics = sphere;
                                                obj1.physics = sphere1;
                                                
                                                obj2.graphics = sphere;
                                                obj2.physics = sphere2;
                                                
                                                obj1.physics.position[0] = -1;
                                                obj1.physics.position[1] = 0;
                                                obj1.physics.position[2] = 0;
                                                
                                                obj2.physics.position[0] = 1;
                                                obj2.physics.position[1] = 0;
                                                obj2.physics.position[2] = 0;
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "2"){     //Sphere-OBB
                                                Win.elements.content.html().innerHTML = "Sphere-OBB";
                                                obj1.graphics = sphere;
                                                obj1.physics = sphere1;
                                                
                                                obj2.graphics = box;
                                                obj2.physics = box2;
                                                obj2.graphics.yaw = 0;
                                                obj2.graphics.pitch = 0;
                                                BuildOrientation(obj2);
                                                
                                                obj1.physics.position[0] = -1;
                                                obj1.physics.position[1] = 0;
                                                obj1.physics.position[2] = 0;
                                                
                                                obj2.physics.position[0] = 1;
                                                obj2.physics.position[1] = 0;
                                                obj2.physics.position[2] = 0;
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "3"){     //OBB-Sphere
                                                Win.elements.content.html().innerHTML = "OBB-Sphere";
                                                obj1.graphics = box;
                                                obj1.physics = box1;
                                                
                                                obj2.graphics = sphere;
                                                obj2.physics = sphere2;
                                                
                                                obj1.physics.position[0] = -1;
                                                obj1.physics.position[1] = 0;
                                                obj1.physics.position[2] = 0;
                                                obj1.graphics.yaw   = 0;
                                                obj1.graphics.pitch = 0;
                                                BuildOrientation(obj1);
                                                
                                                obj2.physics.position[0] = 1;
                                                obj2.physics.position[1] = 0;
                                                obj2.physics.position[2] = 0;
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "4"){     //OBB-OBB
                                                Win.elements.content.html().innerHTML = "OBB-OBB";
                                                obj1.graphics = box;
                                                obj1.physics = box1;
                                                
                                                obj2.graphics = box;
                                                obj2.physics = box2;
                                                
                                                obj1.physics.position[0] = -1;
                                                obj1.physics.position[1] = 0;
                                                obj1.physics.position[2] = 0;
                                                obj1.graphics.yaw   = 0;
                                                obj1.graphics.pitch = 0;
                                                BuildOrientation(obj1);
                                                
                                                obj2.physics.position[0] = 1;
                                                obj2.physics.position[1] = 0;
                                                obj2.physics.position[2] = 0;
                                                obj2.graphics.yaw   = 0;
                                                obj2.graphics.pitch = 0;
                                                BuildOrientation(obj2);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "5"){     //OBB-OBB
                                                Win.elements.content.html().innerHTML = "OBB-OBB";
                                                obj1.graphics = box;
                                                obj1.physics = box1;
                                                
                                                obj2.graphics = box;
                                                obj2.physics = box2;
                                                
                                                obj1.physics.position[0] = -1;
                                                obj1.physics.position[1] = 0;
                                                obj1.physics.position[2] = 0;
                                                obj1.graphics.yaw   = -45;
                                                obj1.graphics.pitch = 45;
                                                BuildOrientation(obj1);
                                                
                                                obj2.physics.position[0] = 1;
                                                obj2.physics.position[1] = 0;
                                                obj2.physics.position[2] = 0;
                                                obj2.graphics.yaw   = 0;
                                                obj2.graphics.pitch = 0;
                                                BuildOrientation(obj2);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "6"){     //Sphere-OBB
                                                Win.elements.content.html().innerHTML = "Sphere-OBB";
                                                obj1.graphics = sphere;
                                                obj1.physics = sphere1;
                                                
                                                obj2.graphics = box;
                                                obj2.physics = box2;
                                                obj2.graphics.yaw = -45;
                                                obj2.graphics.pitch = 0;
                                                BuildOrientation(obj2);
                                                
                                                obj1.physics.position[0] = -1;
                                                obj1.physics.position[1] = 0;
                                                obj1.physics.position[2] = 0;
                                                
                                                obj2.physics.position[0] = 1;
                                                obj2.physics.position[1] = 0;
                                                obj2.physics.position[2] = 0;
                                            }
                                        }
                                        onMouseDown = function(e){
                                            Input.Mouse.lastX = e.clientX;
                                            Input.Mouse.lastY = e.clientY;
                                            Input.Mouse.pressed = true;
                                        }
                                        
                                        onMouseUp = function(e){
                                            Input.Mouse.pressed = false;
                                        }
                                        
                                        onMouseMove = function(e){
                                            if (!Input.Mouse.pressed) {
                                                return;
                                            }
                                            
                                            //var x = quat4.create([1,0,0,degToRad(os.graphics.Managers.Camera.Rotation.pitch)]);
                                            //var y = quat4.create([0,1,0,degToRad(os.graphics.Managers.Camera.Rotation.yaw)]);
                                            //var z = quat4.create([0,0,-1,degToRad(os.graphics.Managers.Camera.Rotation.roll)]);
                                            


                                            var cam = os.graphics.Managers.Camera;
                                            
                                            var newX = e.clientX;
                                            var newY = e.clientY;
                                        
                                            var deltaX = newX - Input.Mouse.lastX
                                            obj1.graphics.yaw += deltaX / 10;
                                            
                                            if(obj1.graphics.yaw > 360){ obj1.graphics.yaw  -= 360;}
                                            else if(obj1.graphics.yaw < 0) { obj1.graphics.yaw += 360; }
                                        
                                            var deltaY = newY - Input.Mouse.lastY;
                                            obj1.graphics.pitch += deltaY / 10;
                                            if(obj1.graphics.pitch > 360){ obj1.graphics.pitch  -= 360;}
                                            else if(obj1.graphics.pitch < 0) { obj1.graphics.pitch += 360; }
                                            
                                            BuildOrientation(obj1)
                                            
                                            Input.Mouse.lastX = newX
                                            Input.Mouse.lastY = newY;   
                                        }
                                        
                                        var BuildOrientation = function(obj){
                                            
                                            var cosX = Math.cos(degToRad(obj.graphics.pitch/2));
                                            var sinX = Math.sin(degToRad(obj.graphics.pitch/2));
                                            
                                            var cosY = Math.cos(degToRad(obj.graphics.yaw/2));
                                            var sinY = Math.sin(degToRad(obj.graphics.yaw/2));
                                            
                                            var cosZ = Math.cos(degToRad(obj.graphics.roll/2));
                                            var sinZ = Math.sin(degToRad(obj.graphics.roll/2));
                                            
                                            var orient = [];
                                            var qx = [sinX,0,0,cosX];
                                            var qy = [0,sinY,0,cosY];
                                            var qz = [0,0,sinZ,cosZ];
                                            
                                            quat4.multiply(qz,qy, orient);
                                            quat4.multiply(orient, qx, orient);
                                            
                                            quat4.normalize(orient, orient);
                                            orient[3]*=-1;
                                            //orient[0] = sinX*cosY*cosZ + cosX*sinY*sinZ;
                                            //orient[1] = cosX*sinY*cosZ + sinX*cosY*sinZ;
                                            //orient[2] = cosX*cosY*sinZ + sinX*sinY*cosZ;
                                            //orient[3] = -cosX*cosY*cosZ - sinX*sinY*sinZ;
                                            //
                                            //quat4.normalize(orient, orient);
                                            quat4.set(orient, obj.physics.orientation);
                                            
                                        }
                                        // Setup Event Handlers for User Input
                                        window.addEventListener("keydown", onKeyDown, false);
                                        os.graphics.Get.Canvas().addEventListener("mousedown", onMouseDown, false);
                                        document.addEventListener("mouseup", onMouseUp, false);
                                        document.addEventListener("mousemove", onMouseMove, false);
                                        
                                        
                                        //Start graphics context to draw and update
                                        os.graphics.Start();
                                        
                                    },
                                    Physics: function(){
                                        var canvas = os.resschmgr.Create.HTMLElement("canvas");
                                        canvas.html().style.width = "100%";
                                        canvas.html().style.height = "100%";
                                        
                                        document.body.appendChild(canvas.html());
                                        document.body.style.overflow = "hidden";
                                        
                                        //Load WebGL (Debug: false, fullscreen: false, canvas HTML object)
                                        os.graphics.Load(false, false, canvas.html());
                                        os.graphics.Managers.Texture.Create.Texture("scorpion", "scripts/jahova/OS/Cores/Graphics/textures/starhawk.jpg");
                                        os.graphics.Managers.Mesh.Create.Mesh("scorpion", "scripts/jahova/OS/Cores/Graphics/meshes/starhawk.json");
                                        os.graphics.Managers.Texture.Create.Texture("crate", "scripts/jahova/OS/Cores/Graphics/textures/crate.jpg");
                                        
                                        
                                        var quad = os.graphics.Managers.Mesh.Create.Primitive.Quad("quad");
                                        quad.Initialize();
                                        
                                        var cube = os.graphics.Managers.Mesh.Create.Primitive.Cube("cube");
                                        cube.Initialize();
                                        
                                        //Set Up Control Window
                                        Win = os.windows.WindowsManager.Create.Window("Physics Demo", "PC");
                                        Win.Set.position(0,0);
                                        Win.elements.content.html().style.overflow = "hidden";
                                        Win.Set.statusbarText("");
                                        Win.Display.window();
                                        Win.Set.width(200);
                                        Win.Set.height(60);
                                        Win.Set.onMax(os.graphics.OnReset);
                                        Win.Set.onMin(os.graphics.Pause);
                                        
                                        //Create Terrain Quad
                                        var terrain = os.graphics.Managers.Entity.Create();
                                        terrain.Graphics.Add.Mesh("quad");
                                        terrain.Graphics.Set.light(false);
                                        terrain.Graphics.Set.useBlendColor(true);
                                        terrain.Graphics.Set.texture(false);
                                        terrain.Graphics.Set.blendColor([0.17,0.26,0.40]);
                                        terrain.Set.Scale(2000,2000,1);
                                        terrain.pitch = 90;
                                        terrain.Set.Position(0,0,0);
                                        terrain.Graphics.Set.fog(true);
                                        terrain.Graphics.Set.fogEndPosition(1000.0);
                                        terrain.Graphics.Set.fogBeginPosition(200.0);
                                        os.graphics.AddToWorld(terrain);
                                        
                                        var box1 = os.graphics.Managers.Entity.Create();
                                        box1.Graphics.Add.Mesh("scorpion");
                                        box1.Graphics.Add.Texture("scorpion");
                                        box1.Set.Scale(0.02,0.02,0.02);
                                        box1.Set.Position(0,0,0);
                                        //box1.Graphics.Set.useBlendColor(true);
                                        box1.Graphics.Set.texture(true);
                                        //box1.Graphics.Set.blendColor([0.17,0.26,0.80]);
                                        os.graphics.AddToWorld(box1);
                                        
                                        var box2 = os.graphics.Managers.Entity.Create();
                                        box2.Graphics.Add.Mesh("cube");
                                        box2.Graphics.Add.Texture("crate");
                                        box2.Set.Position(0,0,0);
                                        box2.Graphics.Set.useBlendColor(true);
                                        box2.Graphics.Set.texture(false);
                                        box2.Graphics.Set.blendColor([0.57,0.26,0.40]);
                                        os.graphics.AddToWorld(box2);
                                        
                                        var box3 = os.graphics.Managers.Entity.Create();
                                        box3.Graphics.Add.Mesh("cube");
                                        box3.Graphics.Add.Texture("crate");
                                        box3.Set.Position(0,0,0);
                                        box3.Graphics.Set.useBlendColor(true);
                                        box3.Graphics.Set.texture(false);
                                        box3.Graphics.Set.blendColor([0.17,0.66,0.40]);
                                        os.graphics.AddToWorld(box3);
                                        
                                        var box4 = os.graphics.Managers.Entity.Create();
                                        box4.Graphics.Add.Mesh("cube");
                                        box4.Graphics.Add.Texture("crate");
                                        box4.Set.Position(0,0,0);
                                        box4.Graphics.Set.useBlendColor(true);
                                        box4.Graphics.Set.texture(false);
                                        box4.Graphics.Set.blendColor([0.57,0.26,0.80]);
                                        os.graphics.AddToWorld(box4);
                                        
                                        var origin = os.graphics.Managers.Entity.Create();
                                        origin.Graphics.Add.Mesh("cube");
                                        origin.Graphics.Add.Texture("crate");
                                        origin.Set.Position(0,0,0);
                                        origin.Set.Scale(0.1,0.1,0.1);
                                        os.graphics.AddToWorld(origin);
                                        time = 0;
                                        
                                        var anchor = [0,0,-70];
                                        PhysicsUpdate = function(dt){
                                            Win.Set.statusbarText("FPS: " + (1/dt * 1000).toFixed(3));
                                            time += 0.016;
                                            os.physics.Update.All(0.033);
                                            //p1.Get.PointInWorld(anchor, origin.Position)
                                            //os.physics.Update.All(dt/1000);
                                        }
                                        
                                        PhysicsDraw = function(){
                                            //box1.Set.Scale(1,1,1);
                                            //box1.Set.Position(p1.position[0], p1.position[1], p1.position[2]);
                                            //box1.Graphics.Draw();
                                            
                                            //box2.Set.Scale(1,1,1);
                                            //box2.Set.Position(p2.position[0], p2.position[1], p2.position[2]);
                                            //box2.Graphics.Draw();
                                            
                                            //box.Set.Scale(0.1,0.1,0.1)
                                            //box.Set.Position(0,-1,0);
                                            //box.Graphics.Draw();
                                                
                                            //box.Set.Position(0,4,0);
                                            //box.Graphics.Draw();
                                            //for(var i = 0; i < 3; i++){
                                            //    box.Set.Position(0,i*2,0);
                                            //    box.Graphics.Draw();
                                            //}
                                            
                                        }
                                        //Register User Defined Callbacks 
                                        //os.graphics.Set.Callback.Draw(PhysicsDraw);
                                        os.graphics.Set.Callback.Update(PhysicsUpdate);
                                        
                                        //Give Camera Default Position and Rotation                                        
                                        //os.graphics.Managers.Camera.MoveUp(150);
                                        os.graphics.Managers.Camera.Position[0] = 0;
                                        os.graphics.Managers.Camera.Position[1] = 15;
                                        os.graphics.Managers.Camera.Position[2] = -85;
                                        os.graphics.Managers.Camera.Rotation.pitch = 5;
                                        
                                        
                                        //
                                        //  PHYSICS DEMO 
                                        //
                                        
                                        //Create Physics Entity
                                        var p1 = os.physics.Create.Entity(0.1);
                                        var p2 = os.physics.Create.Entity(0.1);
                                        var p3 = os.physics.Create.Entity(0.1);
                                        var p4 = os.physics.Create.Entity(0.1);
                                        
                                        //blue
                                        box1.Physics = p1;
                                        p1.linearDampening = 0.95;
                                        p1.angularDampening = 0.9;
                                        p1.position[0] = 10;
                                        p1.position[1] = 0;
                                        p1.position[2] = -30;
                                        p1.Add.InertialTensor(os.physics.Create.InertialTensor.Cube(p1,20,20,20));
                                        p1.CalculateDerivedData();
                                        
                                        
                                        //red
                                        box2.Physics = p2;
                                        p2.linearDampening = 0.99;
                                        p2.angularDampening = 0.99;
                                        p2.position[0] = -10;
                                        p2.position[1] = 0;
                                        p2.position[2] = -30;
                                        p2.Add.InertialTensor(os.physics.Create.InertialTensor.Cube(p2,2,2,2));
                                        p2.CalculateDerivedData();
                                        
                                        //green
                                        box3.Physics = p3;
                                        p3.linearDampening = 0.99;
                                        p3.angularDampening = 0.99;
                                        p3.position[0] = 5;
                                        p3.position[1] = 0;
                                        p3.position[2] = -30;
                                        p3.Add.InertialTensor(os.physics.Create.InertialTensor.Cube(p3,2,2,2));
                                        p3.CalculateDerivedData();
                                        
                                        //purple
                                        box4.Physics = p4;
                                        p4.linearDampening = 0.99;
                                        p4.angularDampening = 0.95;
                                        p4.position[0] = 0;
                                        p4.position[1] = 0;
                                        p4.position[2] = -30;
                                        p4.Add.InertialTensor(os.physics.Create.InertialTensor.Cube(p4,2,2,2));
                                        p4.CalculateDerivedData();
                                        
                                        var force1 = os.physics.Create.Force.Spring(p1, 0.25, 20, anchor,[0,0,0]);//, p2);
                                        var force2 = os.physics.Create.Force.Spring(p2, 2, 20, [0,0,0],[0,0,0]);//;, p1);
                                        var force3 = os.physics.Create.Force.Spring(p3, 2, 20, [0,0,0],[0,0,0]);//;, p1);
                                        var force4 = os.physics.Create.Force.Spring(p4, 2, 20, [0,0,0],[0,0,0]);//;, p1);
                                        
                                        //Setup Input Controls
                                        Input = {
                                            Mouse: {
                                                lastX: 0,
                                                lastY: 0,
                                                pressed: false
                                            }
                                        }
                                        onKeyDown = function(e){
                                            if(String.fromCharCode(e.keyCode) == "W"){     //Forward
                                                os.graphics.Managers.Camera.MoveForward(1);   
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "S"){     //Backware
                                                os.graphics.Managers.Camera.MoveBackward(1);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "A"){     //Straif Left
                                                os.graphics.Managers.Camera.MoveLeft(1);  
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "D"){     //Straif Right
                                                os.graphics.Managers.Camera.MoveRight(1);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "Q"){     //Straif Up
                                                os.graphics.Managers.Camera.MoveUp(1);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "E"){     //Straif Down
                                                os.graphics.Managers.Camera.MoveDown(1);
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "R"){     //Straif Down
                                                p1.inverseMass = 3;
                                                p1.position[0] = 50;
                                                p1.position[0] = 0;
                                                p1.position[0] = 0;
                                                
                                                p2.inverseMass = 3;
                                                p2.position[0] = -50;
                                                p2.position[0] = 0;
                                                p2.position[0] = 0;
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "T"){     //Straif Down
                                                p1.inverseMass = 5;
                                                p1.position[0] = 50;
                                                p1.position[0] = 0;
                                                p1.position[0] = 0;
                                                
                                                p2.inverseMass = 5;
                                                p2.position[0] = -50;
                                                p2.position[0] = 0;
                                                p2.position[0] = 0;
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "Y"){     //Straif Down
                                                force1.springConstant++;
                                                force2.springConstant++;
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "H"){     //Straif Down
                                                force1.springConstant--;
                                                force2.springConstant--;
                                            }
                                            else if(String.fromCharCode(e.keyCode) == "U"){     //Straif Down
                                                p2.PrintRot();
                                            }
                                            if(String.fromCharCode(e.keyCode) == "I"){     //Forward
                                                os.physics.Create.Force.Impulse(p2,[0,0,0],[0,0,100]);
                                            }
                                            if(String.fromCharCode(e.keyCode) == "K"){     //Forward
                                                os.physics.Create.Force.Impulse(p2,[0,0,0],[0,0,-100]);
                                            }
                                            if(String.fromCharCode(e.keyCode) == "J"){     //Forward
                                                os.physics.Create.Force.Impulse(p2,[-10,0,0],[0,0,100]);
                                            }
                                            if(String.fromCharCode(e.keyCode) == "L"){     //Forward
                                                 os.physics.Create.Force.Impulse(p2,[10,0,0],[0,0,100]);
                                            }
                                        }
                                        onMouseDown = function(e){
                                            Input.Mouse.lastX = e.clientX;
                                            Input.Mouse.lastY = e.clientY;
                                            Input.Mouse.pressed = true;
                                        }
                                        
                                        onMouseUp = function(e){
                                            Input.Mouse.pressed = false;
                                        }
                                        
                                        onMouseMove = function(e){
                                            if (!Input.Mouse.pressed) {
                                                return;
                                            }
                                            var cam = os.graphics.Managers.Camera;
                                            
                                            var newX = e.clientX;
                                            var newY = e.clientY;
                                        
                                            var deltaX = newX - Input.Mouse.lastX
                                            cam.Rotation.yaw += deltaX / 10;
                                            
                                            if(cam.Rotation.yaw > 360){ cam.Rotation.yaw  -= 360;}
                                            else if(cam.Rotation.yaw < 0) { cam.Rotation.yaw += 360; }
                                        
                                            var deltaY = newY - Input.Mouse.lastY;
                                            cam.Rotation.pitch += deltaY / 10;
                                            if(cam.Rotation.pitch > 360){ cam.Rotation.pitch  -= 360;}
                                            else if(cam.Rotation.pitch < 0) { cam.Rotation.pitch += 360; }
                                        
                                            Input.Mouse.lastX = newX
                                            Input.Mouse.lastY = newY;   
                                        }
                                        
                                        
                                        // Setup Event Handlers for User Input
                                        window.addEventListener("keydown", onKeyDown, false);
                                        os.graphics.Get.Canvas().addEventListener("mousedown", onMouseDown, false);
                                        document.addEventListener("mouseup", onMouseUp, false);
                                        document.addEventListener("mousemove", onMouseMove, false);
                                        
                                        
                                        //Start graphics context to draw and update
                                        os.graphics.Start();
                                        
                                        
                                    },
                                    //******************************************
                                    //
                                    //  CONSOLE COMMAND FUNCTIONS
                                    //
                                    //******************************************
                                    AddCommand: function(name, callback, scope, help){
                                        this.Commands.put(name.toUpperCase(),os.resschmgr.Create.Command(name, callback, scope, help));
                                    },
                                    
                                    RemoveCommand: function(name){
                                        this.Commands.remove(name.toUpperCase());  
                                    },
                                    
                                    GetCommand: function(name){
                                        return this.Commands.get(name.toUpperCase());
                                    },
                                    
                                    DisplayCommands: function(){
                                        
                                        for(var i = 0; i++ < this.Commands.size; this.Commands.next())
                                        {
                                            os.console.AppendComment("Command: " + this.Commands.value().name);
                                            os.console.AppendComment("Description:");
                                            os.console.AppendComment(this.Commands.value().help);
                                            os.console.AppendComment("");
                                        }

                                    },
                                    
                                    //******************************************
                                    //
                                    //  CONSOLE OUTPUT FUNCTIONS
                                    //
                                    //******************************************
                                    log: function(comment){
                                        //console.cmdWindow.value += "\n" + comment;
                                        //console.cmdWindow.scrollTop = console.cmdWindow.scrollHeight;
                                    },
                                    AppendComment: function(comment){
                                        
                                        console.cmdWindow.value += "\n" + comment;
                                        console.cmdWindow.scrollTop = console.cmdWindow.scrollHeight;

                                    },
                                   
                                    Comment: function(comment){
                                        
                                        console.cmdWindow.value += comment + "\n" + prompt;
                                        console.cmdWindow.scrollTop = console.cmdWindow.scrollHeight;                                        
                                    },
                                    
                                    Warning: function(comment){
                                        console.cmdWindow.value += "\n~WARNING~ " + comment + "\n" + prompt;
                                        console.cmdWindow.scrollTop = console.cmdWindow.scrollHeight;                                        
                                    },
                                    
                                    Error: function(comment){
                                        console.cmdWindow.value += "\n~ERROR~ " + comment + "\n" + prompt;
                                        console.cmdWindow.scrollTop = console.cmdWindow.scrollHeight;                                        
                                    },
                                    
                                    Clear: function(){
                                        console.cmdWindow.value = prompt;
                                        console.cmdWindow.scrollTop = console.cmdWindow.scrollHeight;                                        
                                    },
                                    
                                    //******************************************
                                    //
                                    //  CONSOLE COMMAND EVALUATION FUNCTION
                                    //
                                    //******************************************
                                    EvaluateInput: function(e){
                                        var keyCode = e.keyCode ? e.keyCode : e.charCode;
                                        
                                        //Return Key
                                        if (keyCode == 13)
                                        {
                                            e.preventDefault();
                                            //this.cmdWindow = document.getElementById('com.jahova.console.window');
                                            //var txtVal = this.cmdWindow.value;
                                            lastIndex = os.console.cmdWindow.value.lastIndexOf(prompt);
                                            lastInput = os.console.cmdWindow.value.substring(lastIndex + prompt.length);
                                            cmdIndex = lastInput.indexOf(" ");
                                            cmdString = cmdIndex > 0 ? lastInput.substring(0, cmdIndex).toUpperCase() : lastInput.toUpperCase();
                                            
                                            cmd = os.console.Commands.get(cmdString);
                                            if(cmd){
                                                //Executes command and passes command string (without cmd naame) as input
                                                cmd.Execute(lastInput.substring(cmdIndex + 1));
                                            }
                                            else{
                                                console.AppendComment("Command: " + cmdString + "\nNot Found, type help to get a list of loaded commands");
                                            }
                                            
                                            console.Comment("");
                                            
                                            
                                            os.console.length = 0;
                                        }
                                        //Up Arrow - Repeat last command
                                        else if (keyCode == 38){
                                            if(cmd){
                                                
                                                //Executes command and passes command string (without cmd naame) as input
                                                //cmd.Execute(lastInput.substring(cmdIndex + 1));
                                                //os.console.Comment("");
                                                //console.cmdWindow.blur();
                                                console.cmdWindow.value += lastInput;//comment + "\n" + prompt;
                                                console.cmdWindow.scrollTop = console.cmdWindow.scrollHeight;
                                                //console.cmdWindow.focus();
                                                //os.console.AppendComment(lastInput);
                                                
                                                //if (os.console.cmdWindow.createTextRange) {
                                                    //var range = os.console.cmdWindow.createTextRange();
                                                    //range.collapse(true);
                                                    //range.moveEnd('character', os.console.cmdWindow.value.length);
                                                    //range.moveStart('character', os.console.cmdWindow.value.length);
                                                    //range.select();
                                                //}
                                            }
                                        }
                                        else if (keyCode == 8) {
                                            if (os.console.length > 0)
                                                os.console.length--;
                                            else {
                                                e.preventDefault();
                                                //this.cmdWindow.value += ">";
                                            }
                                        }
                                        else if (keyCode > 31) {
                                            os.console.length++;
                                        }
                                        
                                    },
                                    ProcessInputString: function(){
                                        lastIndex = os.console.cmdWindow.value.lastIndexOf(prompt);
                                        lastInput = os.console.cmdWindow.value.substring(lastIndex + prompt.length);
                                        cmdIndex = lastInput.indexOf(" ");
                                        cmdString = cmdIndex > 0 ? lastInput.substring(0, cmdIndex).toUpperCase() : lastInput.toUpperCase();
                                        
                                        cmd = os.console.Commands.get(cmdString);
                                        if(cmd){
                                            //Executes command and passes command string (without cmd naame) as input
                                            cmd.Execute(lastInput.substring(cmdIndex + 1));
                                        }
                                        else{
                                            console.AppendComment("Command: " + cmdString + "\nNot Found, type help to get a list of loaded commands");
                                        }
                                        
                                        console.Comment("");
                                        
                                        
                                        os.console.length = 0;
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
