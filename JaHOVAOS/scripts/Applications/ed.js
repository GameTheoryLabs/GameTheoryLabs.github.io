//JaHOVA OS Instance
var os = null; 


//
//  Entry Method Called from OS
//
Application = function(){
    //Get pionter to JaHOVA OS
    os = com.jahova.os.Instance();
    
    //Connect HTML Objects to JavaScript
    App.Load();
    
    //App Initializtion
    App.Init();
    
}

//
//  Application Object Definition
//
var App = {
    Load: function(){

    },
    Display: {
        State: 'windowed',
        Toggle: function(){
            App.Display.State == "windowed" ? App.Display.Fullscreen() : App.Display.Windowed();
        },
        Fullscreen: function(){
            App.Display.State = "fullscreen";
            
            //Scroll Screen to top left, to hide any overflow
            scrollTo(0,0);
            
            App.HTML.Thumnails.container.style.display = "none";
            
            App.HTML.Properties.container.style.display = "none";
            
            //var win = document.getElementById("main-window");
            App.HTML.Main.window.setAttribute("class", "fullscreen");
            App.HTML.Main.window.style.height = window.innerHeight + "px";
            
            document.body.style.overflow = "hidden";
            
            //Hide Debug Bar, to make sure its not causing any problems
            os.debugbar.Disable();
            
            if(App.Events.onFullscreen){App.Events.onFullscreen()}
        },
        Windowed: function(){
            App.Display.State = "windowed";
            
            App.HTML.Thumnails.container.style.display = "";
            
            App.HTML.Properties.container.style.display = "";
            
            App.HTML.Main.window.setAttribute("class", "main-window border-radius-top-10px");
            App.HTML.Main.window.style.height = "";
            
            document.body.style.overflow = "";
            
            //Hide Debug Bar, to make sure its not causing any problems
            os.debugbar.Enable();
            
            if(App.Events.onWindowed){App.Events.onWindowed()}
        },
        EnableButton: function(){
            App.HTML.Main.window.innerHTML =  '<div id="expand-button" class="expand-button-min" onclick="App.Display.Toggle()"></div>'
        }
    },
    HTML: {
        container: null,
        Main: {
            container: null,
            window: null,
            footer: null
        },
        Properties: {
            container: null,
            header: null,
            window: null,
            dropDown: null
        },
        Thumnails: {
            container: null,
            window: null,
            footer: null
        }
    },
    FileIO: {
        Add: {
            FileSelector:{
                Main: function(label){
                    var bHaveFileAPI = (window.File && window.FileReader);
    
                    if(!bHaveFileAPI){
                        os.windows.Create.ErrorWindow("File IO Not Supported", "The current browser does not support HTML5 File IO");
                        return;
                    }
                    
                    App.HTML.Main.footer.innerHTML = '\t\t\t\t<form action="" class="border-radius-btm-10px">'+
                        '\n\t\t\t\t\t<div class="choose-file">'+
                            '\n\t\t\t\t\t\t<label>'+ label +'</label>'+
                            '\n\t\t\t\t\t\t<input type="file" name="mainFile" id="mainFile" multiple="multiple"/>'+
                        '\n\t\t\t\t\t</div>'+
                    '\n\t\t\t\t</form>';
                    document.getElementById("mainFile").addEventListener("change", App.FileIO._Events.onFileLoaded);
                },
                Thumbnails: function(label){
                    var bHaveFileAPI = (window.File && window.FileReader);
    
                    if(!bHaveFileAPI){
                        os.windows.Create.ErrorWindow("File IO Not Supported", "The current browser does not support HTML5 File IO");
                        return;
                    }
                    
                    App.HTML.Thumnails.footer.innerHTML = '\t\t\t\t<form action="" class="border-radius-btm-10px">'+
                        '\n\t\t\t\t\t<div class="choose-file">'+
                            '\n\t\t\t\t\t<label>'+ label +'</label>'+
                            '\n\t\t\t\t\t<input type="file" name="ThumbnailFile" id="thumbnailsFile" multiple="multiple"/>'+
                        '\n\t\t\t\t\t</div>'+
                    '\n\t\t\t\t\t</form>';
                    document.getElementById("thumbnailsFile").addEventListener("change", App.FileIO._Events.onFileLoaded);
                },
                Div: function(div, label, name){
                    var bHaveFileAPI = (window.File && window.FileReader);
    
                    if(!bHaveFileAPI){
                        os.windows.Create.ErrorWindow("File IO Not Supported", "The current browser does not support HTML5 File IO");
                        return;
                    }
                    
                    div.innerHTML = '\t\t\t\t<form action="" class="border-radius-btm-10px">'+
                        '\n\t\t\t\t\t<div class="choose-file">'+
                            '\n\t\t\t\t\t<label>'+ label +'</label>'+
                            '\n\t\t\t\t\t<input type="file" name="'+ name +'" id="'+ name +'" multiple="multiple"/>'+
                        '\n\t\t\t\t\t</div>'+
                    '\n\t\t\t\t\t</form>';
                    
                    document.getElementById(name).addEventListener("change", App.FileIO._Events.onFileLoaded);
                }
            },
            Dropzone: {
                App: function(){
                    var bHaveFileAPI = (window.File && window.FileReader);
    
                    if(!bHaveFileAPI){
                        os.windows.Create.ErrorWindow("File IO Not Supported", "The current browser does not support HTML5 File IO");
                        return;
                    }
                
                    document.body.addEventListener("drop", App.FileIO._Events.onFileLoaded);
                    document.body.addEventListener("dragover", App.FileIO._Events.onFileDragOver);
                },
                Div: function(div){
                    var bHaveFileAPI = (window.File && window.FileReader);
    
                    if(!bHaveFileAPI){
                        os.windows.Create.ErrorWindow("File IO Not Supported", "The current browser does not support HTML5 File IO");
                        return;
                    }
                    
                    div.addEventListener("drop", App.FileIO._Events.onFileLoaded);
                    div.addEventListener("dragover", App.FileIO._Events.onFileDragOver);
                }
            }
        },
        Get: {
            Extension: function(file){
                return file.name.substr(file.name.lastIndexOf(".") + 1).toUpperCase();
            }
        },
        Read: {
            Text: function(file, callback, scope){
                var reader = new FileReader();
    
                reader.onload = function(e){
                    scope ? callback.apply(scope, [e.target.results]) : callback(e.target.result) ;
                }
                
                reader.readAsText(file);
            },
            Image: function(file, callback, scope){
                var reader = new FileReader();
                
                reader.onload = function(e){
                    img = new Image();
                    img.src = e.target.result;
                    scope ? callback.apply(scope, [img]) : callback(img) ;
                }
                
                reader.readAsDataURL(file);
            },
            DataURL: function(file, callback, scope){
                var reader = new FileReader();
                
                reader.onload = function(e){
                    scope ? callback.apply(scope, [e.target.result]) : callback(e.target.result) ;
                }
                
                reader.readAsDataURL(file);
            },
            ObjectURL: function(file){
                if ( window.webkitURL ) {
                    return window.webkitURL.createObjectURL( file );
                }
                else if ( window.URL && window.URL.createObjectURL ) {
                    return window.URL.createObjectURL( file );
                }
                else {
                    return null;
                }
            }
            
        },
        _Events: {
            onFileLoaded: function(e){
                e.stopPropagation();
                e.preventDefault();
                
                var files = e.target.files ? e.target.files : e.dataTransfer.files;
                var totalBytes = 0;
                
                for(var i = 0; i < files.length; i++){
                    var fileInfo = "File Name: " + files[i].name + "; Size: " + files[i].size + "; Type: " + files[i].type ;
                    totalBytes += files[i].size;
                    os.console.AppendComment(fileInfo);
                }
                
                os.console.Comment( "\nTotal of " + files.length + " files, " + totalBytes + " bytes.");
                
                App.Events.onFileLoaded(files);
            },
            onFileDragOver: function(e){
                e.stopPropagation();
                e.preventDefault();
            }
        }
    },
    Window: {
        Create: function(sTitle, sType, bDocked){
            var win = os.windows.WindowsManager.Create.Window(sTitle, sType);
            
            win.Hide.toolbar();
            win.Hide.menubar();
            win.elements.content.html().style.overflow = "hidden";
            win.Set.statusbarText("");
            win.Display.window();
            win.elements.titlebar.buttons.close.html().onclick = function(e){
                App.Window.Dock(os.windows.WindowsManager.Windows.get(e.target.id));    
            }
            win.onDock = function(){};
            win.onUndock = function(){};
            
            if(bDocked){App.Window.Dock(win);}
            
            return win;
        },
        Dock: function(win){

            win.Set.position(0,0);
            win.Set.width(358);
            win.Set.height(228);
            win.Hide.menubar();
            win.Hide.titlebar();
            win.Hide.statusbar();
            if(win.theme.name == "PC"){
                win.elements.window.Class.Remove("pcWindow ");
                win.elements.window.Class.Add("pcWindow-NoShadow");
            }
            else{
                win.elements.window.Class.Remove("macWindow ");
                win.elements.window.Class.Add("macWindow-NoShadow");
            }
            
            document.body.removeChild(win.elements.window.html());
            App.HTML.Properties.window.appendChild(win.elements.window.html());
            
            var idString = win.Get.id();
            idString = idString.split(".");
            
            var opt = document.createElement("option");
            opt.value = idString[idString.length - 1];
            opt.innerHTML = win.Get.title();
            
            App.HTML.Properties.dropDown.add(opt);
            
            App.HTML.Properties.dropDown.selectedIndex = opt.index;
            if(win.onDock){win.onDock();}
            
        },
        UnDock: function(e){
            if(App.HTML.Properties.dropDown.length > 0){
                var win = win = os.windows.WindowsManager.Windows.get("jahova.window.id." + App.HTML.Properties.dropDown[App.HTML.Properties.dropDown.selectedIndex].value);
        
                win.Set.position(100,100);
                win.Set.width(358);
                win.Set.height(228);
                win.Display.titlebar();
                win.Display.statusbar();
                win.elements.window.html().style.position = "absolute";
                if(win.theme.name == "PC"){
                    win.elements.window.Class.Remove("pcWindow-NoShadow ");
                    win.elements.window.Class.Add("pcWindow");
                }
                else{
                    win.elements.window.Class.Remove("macWindow-NoShadow ");
                    win.elements.window.Class.Add("macWindow");
                }
                win.MakeActive();
                if(win.onUndock){win.onUndock();}
                
                App.HTML.Properties.window.removeChild(win.elements.window.html());
                document.body.appendChild(win.elements.window.html());
            
                App.HTML.Properties.dropDown.remove(App.HTML.Properties.dropDown[App.HTML.Properties.dropDown.selectedIndex]);
                
                if(App.HTML.Properties.dropDown.length > 0){
                    win = os.windows.WindowsManager.Windows.get("jahova.window.id." + App.HTML.Properties.dropDown[App.HTML.Properties.dropDown.selectedIndex].value);
                    win.MakeActive();
                }
                
                
            }
        }
    },
    Events: {
        onDropdown: function(win){
            
        },
        onFullscreen: function(){
            
        },
        onWindowed: function(){
            
        },
        onFileLoaded: function(files){
            
        }
    },
    Init: function(){
    
    }
}


ED ={
    Settings: {
        Patient: {
            Arrival:{
                Model: "Eponential",
                Params: [2]
            },
            Treatment: {
                Model: "Uniform",
                Params: [5,10]
                
            },
            Balk: {
                Model: "Uniform",
                Params: [90,150]
            },
            Registration: {
                Model: "Uniform",
                Params: [10,20]
            }
            
        },
        MLP:{
            Lab: 0.9,
            LabTime: {
                Model: "Uniform",
                Params: [5,10]
            },
            Discharge: {
                Model: "Uniform",
                Params: [10,20]
            }
        }
    },
    Entities: {
        MLP: [],
        Patients: [],
        Moving: [],
        Update: {
            Paths: function(){
                //Loop through Moving Entities
                for(var i = ED.Entities.Moving.length - 1; i >= 0; i--){
                    //Does Entity have nodes left in its path?
                    if(ED.Entities.Moving[i].path.length > 0){
                        //If Entity does not have a target, then assign one
                        if(!ED.Entities.Moving[i].AI.MovementAlgorithms.ArrivePosition){
                            os.ai.Movement.Add.Arrive.Position(ED.Entities.Moving[i], (ED.Entities.Moving[i].path.pop()).Position);
                        }
                    }
                    //Remove from Array and Update FSM
                    else if(!ED.Entities.Moving[i].AI.MovementAlgorithms.ArrivePosition){
                        ED.Entities.Moving[i].FSM.Update()
                        ED.Entities.Moving.splice(i,1);
                    }
                }
                
            }
        },
        Create: {
            Patient: function(){
                var patient = os.graphics.Managers.Entity.Create();
                patient.Graphics.Add.Mesh("patient");
                patient.Graphics.Add.Texture("people");
                patient.Set.Scale(5,5,5);
                patient.AI = os.ai.Create.Entity();
                patient.FSM = os.ai.Create.FSM(patient);
                patient.FSM.SetState("InitState");
                patient.path = [];
                
                //Place in Patient Array
                ED.Entities.Patients.push(patient);
                
                //Register with Entity Map
                os.graphics.Managers.Entity.Entities.put(patient.Get.id(), patient);
                
                vec3.set(ED.Map.Nodes.get("Start").Position,patient.Position);
                
                patient.FSM.Transition("PSArrive");
                
                //Creaate Order for Next Patient Arrival
                var time = ED.DES.Models.Patient.Arrival.Generate();
                ED.DES.EventQ.push(ED.DES.Create.Order("Patient Arrives",time , ED.Entities.Create.Patient), time + ED.DES.clock);
                
                return patient;
            }
        },
        Balk: function(order){
            //Check and see if Patient has been admitted
            var state = order.send.FSM.GetState();
            
            if(state == "PSWaiting"  ){
                //order.send.FSM.Transition("PSDischarge");
                
            }
            
        },
        ProcessOrder: function(order){
            
            if(order.msg == "RegistrationEnd"){
                order.recv.FSM.Update(order);
            }
            
        }
    },
    DES: {
        conversion: 1000,  //(ms)(# of ms in a simulated minute) 1000ms = 1s = 1 simulated min, 1 min = 1 sim hrs
        animationStep: 25, //(ms) animation step Max 150
        simulationStep: 5, //(ms) simulation clock step
        clock: 0,
        Convert: {
            miliSecondsToSimulatedMinutes: function(iMiliSec){
                return iMiliSec / ED.DES.conversion;
            },
            simulatedMinutesToMiliSec: function(fMinutes){
                return fMinutes * ED.DES.conversion;
            }
        },
        Update: function(dt){
            //Update Simulation Clock
            ED.DES.clock += dt;
            
            
            //Check EventQ and deliver any pending orders
            var top = ED.DES.EventQ.top();
            var order = null;
            
            //Event Q is not empty and top message delivery time has passed
            while((top != undefined) && (top.deliverTime <=  ED.DES.clock)){
                
                //Remove Order and Call Deliver Handler
                order = (ED.DES.EventQ.pop());
                order.Deliver(order);
                
                //Get Next Order
                top = ED.DES.EventQ.top();
            }

            
        },
        Start: function(){
            
        },
        Pause: function(){
            
        },
        Resume: function(){
            
        },
        Create: {
            Model: function(sType,aParams){
                return{
                    type: sType,
                    params: aParams,
                    Generate: function(){
                        return ED.DES.Variates[this.type].apply(ED.DES.Variates[this.type],this.params);
                    }
                }
                
            },
            Order: function(sMsg, iDelayTime, fHandler, oSend, oRecv){
                return{
                    send: oSend,
                    recv: oRecv,
                    msg: sMsg,
                    createTime: ED.DES.clock,
                    deliverTime: ED.DES.clock + iDelayTime,
                    Deliver: fHandler
                }
            }
        },
        EventQ: null,
        Q: {
            Registration: [],
            Waiting: [],
            MLP: []
        },
        Rooms: [null, null, null, null, null, null],
        Stats: {
            totalPatients: 0,
            currentPatients: 0
        },
        Models: {
            Patient: {
                Arrival: null,
                Treatment: null,
                Balk: null,
                Registration: null
            },
            MLP: {
                LabTime: null,
                NewLab: null,
                Discharge: null
            }
        },
        Variates: {
            MT: null,
            Uniform: function(min, max){
                return min + (max - min) * ED.DES.Variates.MT.random();
            },
            Rand: function(){
                return ED.DES.Variates.MT.random();
            },
            Exponential: function(beta){
                //var invBeta = 1/beta;
                return -1 * beta * Math.log( ED.DES.Variates.MT.random());    
            },
            Weibull: function(a,b,c){
                return a + b * Math.pow(-1 * Math.log(ED.DES.Variates.MT.random()), 1/c);
            },
            Triangular: function(xMin, xMax, c){
                var p = ED.DES.Variates.MT.random();
                var q = 1 - p;
                var temp = 1;
                if( p <= ((c -xMin) / (xMax - xMin))){
                    temp = xMin + Math.sqrt((xMax - xMin) * (c - xMin) * p);
                }
                else{
                    temp = xMax - Math.sqrt((xMax - xMin) * (xMax - c) * q);
                }
                
                return temp;
            },
            LogLogistic: function(alpha, beta){
                var x = ED.DES.Variates.MT.random();
                var invAlpha = 1/alpha;
                return Math.exp(1/beta * Math.log((x * Math.pow(alpha, beta))/ ( 1 - x)));
                //return ( (beta * invAlpha) * Math.pow(x*invAlpha, beta - 1)) / ((1 + Math.pow(x*invAlpha, beta)) * (1 + Math.pow(x*invAlpha, beta)))
                    
            },
            Logistic: function(mu, s){
                var x = ED.DES.Variates.MT.random();
                return mu + s *(Math.log(x / (1 - x)));
            },
            Normal: function(mean, std){
                var x1 = ED.DES.Variates.Uniform(-1,1);//-1 + 2*ED.DES.Variates.MT.random();
                var x2 = ED.DES.Variates.Uniform(-1,1);//-1 + 2*ED.DES.Variates.MT.random();
                var x  = x1 * x1 + x2 * x2;
                
                while(x >= 1.0){
                    x1 = ED.DES.Variates.Uniform(-1,1);//-1 + 2*ED.DES.Variates.MT.random();
                    x2 = ED.DES.Variates.Uniform(-1,1);//-1 + 2*ED.DES.Variates.MT.random();
                    x  = x1 * x1 + x2 * x2;
                }
                
                return mean + std * x1 * Math.sqrt(-2 * Math.log(x) / x);
            },
            LogNormal: function(a, mu, sigma){
                return a + Math.exp(ED.DES.Variates.Normal(mu,sigma));
            }
            
        }
    },
    EAC: {
        beds: null,
        curtainRods: null,
        curtains: null,
        floor: null,
        extWalls: null,
        intWalls: null,
        doors: null,
        glassDoors: null,
        desk: null,
        computer: null,
        computerScreen: null,
        nodes: null
    },
    Assets:{
        Meshes: {
            requested: 0,
            loaded: 0
        },
        Textures: {
            requested: 0,
            loaded: 0
        }
    },
    Start: function(type, msg){
        
        if(type.toUpperCase() == "MESH"){
            ED.Assets.Meshes.loaded++;
            os.console.Comment("(" + ED.Assets.Meshes.loaded + " of " + ED.Assets.Meshes.requested + ") " +msg);
        }
        else{
            ED.Assets.Textures.loaded++;
            os.console.Comment("(" + ED.Assets.Textures.loaded + " of " + ED.Assets.Textures.requested + ") " +msg);
        }
        
        if((ED.Assets.Meshes.requested == ED.Assets.Meshes.loaded) && (ED.Assets.Textures.requested == ED.Assets.Textures.loaded)){
            vec3.set([97,745,194],os.graphics.Managers.Camera.Position);
            os.graphics.Managers.Camera.Rotation.yaw = 270;
            os.graphics.Managers.Camera.Rotation.pitch = 90;
            os.graphics.Start();
            os.console.Comment("\n....Loading Complete, Launching Simulation....")
            //os.debugbar.Disable();
            os.debugbar.AnchorConsole();
            os.debugbar.AnchorSettings();
        }
        
    },
    Load: {
        Settings: function(){
          var content  = document.getElementById("com.jahova.debugBar.Settings.Content");
          var html = '<a class="button" onclick="ED.Entities.Create.Patient()";">Start Simulation</a>'+
         ' <div class="gtlMenuContent" style="margin: auto;">' +
                '<table cellspacing="5px">' +
                   ' <tr>' +
                        '<td>' +
                            'Speed' +
                       ' </td>' +
                        '<td>' +
                            '<input id="speed" type="range" min="25" max="125" step="1" value="1.0">' +
                        '</td>' +
                    '</tr>' +
                '</table>';
          content.innerHTML = html;
          
          win = App.Window.Create("Live Charting", "PC", false);
          win.elements.content.html().innerHTML = '<canvas id="chart" height="450" width="600"></canvas>';
          win.Set.width(590);
          win.Set.height(500);
          win.Set.position(0,0);
          win.Minimize();
          
          //document.getElementById('com.jahova.debugBar.Log.Content').innerHTML = '<div style="border-radius: 10px; background-color: #D7DDE6;"></div>'
            var lineChartData = {
                    labels : ["January","February","March","April","May","June","July"],
                    datasets : [
                        {
                            fillColor : "rgba(220,220,220,0.5)",
                            strokeColor : "rgba(220,220,220,1)",
                            pointColor : "rgba(220,220,220,1)",
                            pointStrokeColor : "#fff",
                            data : [65,59,90,81,56,55,40]
                        },
                        {
                            fillColor : "rgba(151,187,205,0.5)",
                            strokeColor : "rgba(151,187,205,1)",
                            pointColor : "rgba(151,187,205,1)",
                            pointStrokeColor : "#fff",
                            data : [28,48,40,19,96,27,100]
                        }
                    ]
        
                }
        
            var myLine = new Chart(document.getElementById("chart").getContext("2d")).Line(lineChartData);
    
        },
        DES: function(seed){
            //Priority Queue
            // https://github.com/STRd6/PriorityQueue.js
            // var queue = PriorityQueue({low: true});
            (function() {
              /**
               * @private
               */
              var prioritySortLow = function(a, b) {
                return b.priority - a.priority;
              };
            
              /**
               * @private
               */
              var prioritySortHigh = function(a, b) {
                return a.priority - b.priority;
              };
            
              /*global PriorityQueue */
              /**
               * @constructor
               * @class PriorityQueue manages a queue of elements with priorities. Default
               * is highest priority first.
               *
               * @param [options] If low is set to true returns lowest first.
               */
              PriorityQueue = function(options) {
                var contents = [];
            
                var sorted = false;
                var sortStyle;
            
                if(options && options.low) {
                  sortStyle = prioritySortLow;
                } else {
                  sortStyle = prioritySortHigh;
                }
            
                /**
                 * @private
                 */
                var sort = function() {
                  contents.sort(sortStyle);
                  sorted = true;
                };
            
                var self = {
                  /**
                   * Removes and returns the next element in the queue.
                   * @member PriorityQueue
                   * @return The next element in the queue. If the queue is empty returns
                   * undefined.
                   *
                   * @see PrioirtyQueue#top
                   */
                  pop: function() {
                    if(!sorted) {
                      sort();
                    }
            
                    var element = contents.pop();
            
                    if(element) {
                      return element.object;
                    } else {
                      return undefined;
                    }
                  },
            
                  /**
                   * Returns but does not remove the next element in the queue.
                   * @member PriorityQueue
                   * @return The next element in the queue. If the queue is empty returns
                   * undefined.
                   *
                   * @see PriorityQueue#pop
                   */
                  top: function() {
                    if(!sorted) {
                      sort();
                    }
            
                    var element = contents[contents.length - 1];
            
                    if(element) {
                      return element.object;
                    } else {
                      return undefined;
                    }
                  },
            
                  /**
                   * @member PriorityQueue
                   * @param object The object to check the queue for.
                   * @returns true if the object is in the queue, false otherwise.
                   */
                  includes: function(object) {
                    for(var i = contents.length - 1; i >= 0; i--) {
                      if(contents[i].object === object) {
                        return true;
                      }
                    }
            
                    return false;
                  },
            
                  /**
                   * @member PriorityQueue
                   * @returns the current number of elements in the queue.
                   */
                  size: function() {
                    return contents.length;
                  },
            
                  /**
                   * @member PriorityQueue
                   * @returns true if the queue is empty, false otherwise.
                   */
                  empty: function() {
                    return contents.length === 0;
                  },
            
                  /**
                   * @member PriorityQueue
                   * @param object The object to be pushed onto the queue.
                   * @param priority The priority of the object.
                   */
                  push: function(object, priority) {
                    contents.push({object: object, priority: priority});
                    sorted = false;
                  }
                };
            
                return self;
              };
            })();

            os.console.Comment("Simulation Seed: " + seed);
            ED.DES.Variates.MT = new MersenneTwister(seed);
            
            //Create Event Queue
            ED.DES.EventQ = new PriorityQueue({low: true});
            
            //Create Resoruce Queus
            
        },
        Models: function(){
            var start = 0;
            var stop = 0;
            //
            //  Patient
            //
                //Arrive
            start = ED.DES.Convert.simulatedMinutesToMiliSec(2.0);
            ED.DES.Models.Patient.Arrival = ED.DES.Create.Model("Exponential", [start]);
            
                //Registration
            start = ED.DES.Convert.simulatedMinutesToMiliSec(2);
            stop  = ED.DES.Convert.simulatedMinutesToMiliSec(3);
            ED.DES.Models.Patient.Registration = ED.DES.Create.Model("Uniform", [start, stop]);
            
                //Treatment
            start = ED.DES.Convert.simulatedMinutesToMiliSec(5);
            stop  = ED.DES.Convert.simulatedMinutesToMiliSec(10);
            ED.DES.Models.Patient.Treatment = ED.DES.Create.Model("Uniform", [start, stop]);
            
                //Balk
            start = ED.DES.Convert.simulatedMinutesToMiliSec(20);//90
            stop  = ED.DES.Convert.simulatedMinutesToMiliSec(25); //150
            ED.DES.Models.Patient.Balk = ED.DES.Create.Model("Uniform", [start, stop]);
            
            
            //
            //  MLP
            //
                //Discharge
            start = ED.DES.Convert.simulatedMinutesToMiliSec(10);
            stop  = ED.DES.Convert.simulatedMinutesToMiliSec(20);
            ED.DES.Models.MLP.Discharge = ED.DES.Create.Model("Uniform", [start, stop]);
            
                //Lab Time
            start = ED.DES.Convert.simulatedMinutesToMiliSec(5);
            stop  = ED.DES.Convert.simulatedMinutesToMiliSec(10);
            ED.DES.Models.MLP.LabTime = ED.DES.Create.Model("Uniform", [start, stop]);
            
                //New Lab
            ED.DES.Models.MLP.NewLab = ED.DES.Create.Model("Rand",[]);
            
        },
        States: function(){


            var InitState = os.ai.Create.State("InitState");
        
            //
            //  Patient States
            //
            //Arrive
            var PSArrive = os.ai.Create.State("PSArrive");
            PSArrive.Enter = function(self){
                
                //Move to Check In Desk
                self.path = ED.Map.GetPath("Start", "Entrance");
                self.location = "Entrance";
                os.ai.Movement.Add.Arrive.Position(self, (self.path.pop()).Position);
                ED.Entities.Moving.push(self);
                
                //Create Balk order
                var order = ED.DES.Create.Order("Balk",ED.DES.Models.Patient.Balk.Generate(),ED.Entities.Balk,self, self);
                ED.DES.EventQ.push(order,order.deliverTime );
                
                //Increment Stats
                ED.DES.Stats.currentPatients++;
                ED.DES.Stats.totalPatients++;
            }
            
            PSArrive.Execute = function(self, dt){
                //Once Patient Has Arrived at Triage
                //  Set Balk Value
                //  Move to Registration
                if(self.path.length == 0 && !self.AI.MovementAlgorithms.ArrivePosition){
                    ED.DES.Q.Registration.push(self);
                    //Check to see if people are waiting in line..
                    if(ED.DES.Q.Registration.length == 1){
                        self.FSM.Transition("PSRegistration");
                        
                    }
                    else{
                        var offset = 12 * ED.DES.Q.Registration.length;
                        self.Position[0] -= offset;
                        
                    }
                    
                }
                
            }
            
            PSArrive.Exit = function(self){
                //Set orders placed time to default (0)
                //self.ordersPlaced = 0;
            }
            
            //Registration
            var PSRegistration = os.ai.Create.State("PSRegistration");
            PSRegistration.Enter = function(self){
                
                //Move to Registration
                self.path = ED.Map.GetPath("Entrance", "Registration");
                self.location = "Registration";
                os.ai.Movement.Add.Arrive.Position(self, (self.path.pop()).Position);
                ED.Entities.Moving.push(self);
                
                //Create a delayed order and place in Event Queue
                //      Generate time for Registration form completeion
                var order = ED.DES.Create.Order("RegistrationEnd",ED.DES.Models.Patient.Registration.Generate() , ED.Entities.ProcessOrder,self, self);
                ED.DES.EventQ.push(order,order.deliverTime );
                
                
                
            }
            PSRegistration.Execute = function(self, order){
                //Once Patient Has Arrived at Registration Room
                //  Move to Queue, Adjust Height in Queue
                if(self.path.length == 0 && !self.AI.MovementAlgorithms.ArrivePosition){
                                    
                    if(order){//If order exist, process
                        
                        //Are patients waiting?
                        if(ED.DES.Q.Waiting.length > 0){
                            self.FSM.Transition("PSWaiting");
                        }
                        
                        else{
                            //Is there a room open?
                            var room = -1;
                            var i = 0;
                            //Check for open room
                            while( (i < ED.DES.Rooms.length) && (room < 0)){
                                room = ED.DES.Rooms[i] ==  null ? i : -1;
                                i++;
                            }
                            
                            if(room >= 0){ //Room Avaliable
                                self.FSM.Transition("PSExam", room);
                            }
                            else{
                                self.FSM.Transition("PSWaiting");
                            }
                        
                        }
                        
                    }
                }
            }
            PSRegistration.Exit = function(self){
                //Update All Patients Position in Registration Q
                    //Remove self from Q
                ED.DES.Q.Registration.shift();
                
                for(var i = 0; i < ED.DES.Q.Registration.length; i++){
                    var offset = 12 * i;
                    
                    ED.DES.Q.Registration[i].Position[0] = 8 - offset;
                }
                
                //Check if patients are waiting in Registration Q
                if(ED.DES.Q.Registration.length > 0){
                    //Transition first patient to registration
                    ED.DES.Q.Registration[0].FSM.Transition("PSRegistration");
                }
                
            }
            PSRegistration.Position = ED.Map.Nodes.get("Registration").Position

            
            //Waiting
            var PSWaiting = os.ai.Create.State("PSWaiting");
            PSWaiting.Enter = function(self, triage){
                
                //Move to Waiting Position
                var pos = "W" + (ED.DES.Q.Waiting.length + 1);
                self.path = ED.Map.GetPath("Registration", pos);
                self.location = pos;
                os.ai.Movement.Add.Arrive.Position(self, (self.path.pop()).Position);
                ED.Entities.Moving.push(self);
                
                ED.DES.Q.Waiting.push(self);
                
            }
            PSWaiting.Execute = function(self, dt){
                
            }
            PSWaiting.Exit = function(self){
                //Remove Self From Q
                ED.DES.Q.Waiting.shift();
                
                
                //Update All Patients in Waiting Q
                for(var i = 0; i < ED.DES.Q.Waiting.length; i++){
                    var pt = ED.DES.Q.Waiting[i];
                    pt.location = "W" + (ED.DES.Q.Waiting.length + 1);
                    var pos = ED.Map.Nodes.get(pt.location);
                    vec3.set(pos, pt.Position);
                    
                }
            }
            
            //Exam
            var PSExam = os.ai.Create.State("PSExam");
            PSExam.Enter = function(self, room){
                ED.DES.Rooms[room] = self;
                //Move to Room
                self.path = ED.Map.GetPath(self.location, "RM" + (room+1) + "Bed");
                self.location = "RM"+ (room + 1) + "Bed";
                os.ai.Movement.Add.Arrive.Position(self, (self.path.pop()).Position);
                ED.Entities.Moving.push(self);
                
            }
            
            PSExam.Execute = function(self, dt){
                
               
                    
                
            }
            PSExam.Exit = function(self){
                
            }
            //Discharge
            var PSDischarge = os.ai.Create.State("PSDischarge");
            PSDischarge.Enter = function(self, loc){
                //Move to Exit
                self.path = ED.Map.GetPath(self.location, "Start");
                self.location = "Start";
                os.ai.Movement.Add.Arrive.Position(self, (self.path.pop()).Position);
                ED.Entities.Moving.push(self);
                
                var id = self.Get.id();
                //Update All Patients in Waiting Q
                for(var i = 0; i < ED.DES.Q.Waiting.length; i++){
                    if(ED.DES.Q.Waiting[i].Get.id() == id){
                        ED.DES.Q.Waiting.splice(i, 1);
                    }
                    
                }
                
                //Update All Patients in Waiting Q
                for(var i = 0; i < ED.DES.Q.Waiting.length; i++){
                    var pt = ED.DES.Q.Waiting[i];
                    pt.location = "W" + (ED.DES.Q.Waiting.length + 1);
                    var pos = ED.Map.Nodes.get(pt.location);
                    vec3.set(pos, pt.Position);
                    
                }
                
              
            }
            PSDischarge.Execute = function(self,dt){
                if((self.location == 'Start') && self.path.length == 0 && !self.AI.MovementAlgorithms.ArrivePosition){
                    var id = self.Get.id();
                    for(var i = 0; i < ED.Entities.Patients.length; i++){
                        if(ED.Entities.Patients[i].Get.id() == id){
                            ED.Entities.Patients.splice(i, 1);
                            break;
                        }
                    }
                }
            }    
        //
        //  Nurse Sates
        //

        },
        Controls: function(){
            var UpdateSpeed = function(e){
                ED.DES.animationStep =  +e.target.value;
                ED.DES.simulationStep =  +e.target.value/5;
            }
            
            document.getElementById('speed').onchange = UpdateSpeed;
            
            //
            //  Set up input user controls
            //
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
                else if(String.fromCharCode(e.keyCode) == "I"){     //Straif Down
                    instacing = instacing ? false : true;
                    
                    if(instacing){Win.Set.title("Instacing: 1 Draw Call");}
                    else{Win.Set.title("Instacing: " + numToDraw + " Draw Calls");}
                }
                else if(e.keyCode == 49){     //Overview
                    vec3.set([97,745,194],os.graphics.Managers.Camera.Position);
                    os.graphics.Managers.Camera.Rotation.yaw = 270;
                    os.graphics.Managers.Camera.Rotation.pitch = 90;
                    
                }
                else if(e.keyCode == 50){     //Registration desk
                    vec3.set([27.7, 48.2, 24.6], os.graphics.Managers.Camera.Position);
                    os.graphics.Managers.Camera.Rotation.yaw = 193;
                    os.graphics.Managers.Camera.Rotation.pitch = 13.3;
                    
                    
                }
                else if(e.keyCode == 51){     //Waiting room
                    vec3.set([105.18, 162, -16.03], os.graphics.Managers.Camera.Position);
                    os.graphics.Managers.Camera.Rotation.yaw = 246.3;
                    os.graphics.Managers.Camera.Rotation.pitch = 39.1;
                    
                }
                else if(e.keyCode == 52){    //Treatment
                    vec3.set([183.3, 211.74, 420.3], os.graphics.Managers.Camera.Position);
                    os.graphics.Managers.Camera.Rotation.yaw = 240.7;
                    os.graphics.Managers.Camera.Rotation.pitch = 38.9;
                    
                    
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
        },
        Map: function(){
            ED.Map.Nodes = os.resschmgr.Create.Map();
            ED.Map.Astar.activePaths = os.resschmgr.Create.Map();
            ED.Map.Astar.visitedNodes = os.resschmgr.Create.Map();
            
            //Build Nodes
            ED.Map.Load("scripts/Applications/data/nodes.csv");
            
        },
        Entities: function(){
            //
            //  MLPs
            //
            
            //MLP 0
            ED.Entities.MLP[0] = os.graphics.Managers.Entity.Create();
            ED.Entities.MLP[0].Graphics.Add.Mesh("nurse");
            ED.Entities.MLP[0].Graphics.Add.Texture("people");
            ED.Entities.MLP[0].Set.Scale(5,5,5);
            ED.Entities.MLP[0].AI = os.ai.Create.Entity();
            ED.Entities.MLP[0].FSM = os.ai.Create.FSM(ED.Entities.MLP[0]);
            
            ED.Entities.MLP[0].path = [];
            ED.Entities.MLP[0].home = ED.Map.Nodes.get("Station1").Position;// [35,0,25.3];
            ED.Entities.MLP[0].Set.Position(ED.Entities.MLP[0].home[0],ED.Entities.MLP[0].home[1],ED.Entities.MLP[0].home[2]);
            ED.Entities.MLP[0].triage = "FT";
            ED.Entities.MLP[0].location = "Station1";
            //ED.Entities.MLP[0].FSM.Transition("NSIdle");
            
            //MLP 1
            ED.Entities.MLP[1] = os.graphics.Managers.Entity.Create();
            ED.Entities.MLP[1].Graphics.Add.Mesh("nurse");
            ED.Entities.MLP[1].Graphics.Add.Texture("people");
            ED.Entities.MLP[1].Set.Scale(5,5,5);
            ED.Entities.MLP[1].AI = os.ai.Create.Entity();
            ED.Entities.MLP[1].FSM = os.ai.Create.FSM(ED.Entities.MLP[1]);
            
            ED.Entities.MLP[1].path = [];
            ED.Entities.MLP[1].home = ED.Map.Nodes.get("Station2").Position;
            ED.Entities.MLP[1].Set.Position(ED.Entities.MLP[1].home[0],ED.Entities.MLP[1].home[1],ED.Entities.MLP[1].home[2]);
            ED.Entities.MLP[1].triage = "FT";
            ED.Entities.MLP[1].location = "Station2";
            //ED.Entities.MLP[1].FSM.Transition("NSIdle");
            
            //MLP 2
            ED.Entities.MLP[2] = os.graphics.Managers.Entity.Create();
            ED.Entities.MLP[2].Graphics.Add.Mesh("nurse");
            ED.Entities.MLP[2].Graphics.Add.Texture("people");
            ED.Entities.MLP[2].Set.Scale(5,5,5);
            ED.Entities.MLP[2].AI = os.ai.Create.Entity();
            ED.Entities.MLP[2].FSM = os.ai.Create.FSM(ED.Entities.MLP[2]);
            
            ED.Entities.MLP[2].path = [];
            ED.Entities.MLP[2].home = ED.Map.Nodes.get("Station3").Position;
            ED.Entities.MLP[2].Set.Position(ED.Entities.MLP[2].home[0],ED.Entities.MLP[2].home[1],ED.Entities.MLP[2].home[2]);
            ED.Entities.MLP[2].triage = "FT";
            ED.Entities.MLP[2].location = "Station3";
            //ED.Entities.MLP[2].FSM.Transition("NSIdle");

        },
        EAC: function(){
            ED.EAC.art1 = os.graphics.Managers.Entity.Create();
            ED.EAC.art1.Graphics.Add.Mesh("art1");
            ED.EAC.art1.Graphics.Add.Texture("art1");
            ED.EAC.art1.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.art1);
            
            ED.EAC.art2 = os.graphics.Managers.Entity.Create();
            ED.EAC.art2.Graphics.Add.Mesh("art2");
            ED.EAC.art2.Graphics.Add.Texture("art2");
            ED.EAC.art2.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.art2);
            
            ED.EAC.art3 = os.graphics.Managers.Entity.Create();
            ED.EAC.art3.Graphics.Add.Mesh("art3");
            ED.EAC.art3.Graphics.Add.Texture("art3");
            ED.EAC.art3.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.art3);
            
            ED.EAC.art4 = os.graphics.Managers.Entity.Create();
            ED.EAC.art4.Graphics.Add.Mesh("art4");
            ED.EAC.art4.Graphics.Add.Texture("art4");
            ED.EAC.art4.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.art4);
            
            ED.EAC.art5 = os.graphics.Managers.Entity.Create();
            ED.EAC.art5.Graphics.Add.Mesh("art5");
            ED.EAC.art5.Graphics.Add.Texture("art5");
            ED.EAC.art5.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.art5);
            
            ED.EAC.art6 = os.graphics.Managers.Entity.Create();
            ED.EAC.art6.Graphics.Add.Mesh("art6");
            ED.EAC.art6.Graphics.Add.Texture("art6");
            ED.EAC.art6.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.art6);
            
            ED.EAC.art7 = os.graphics.Managers.Entity.Create();
            ED.EAC.art7.Graphics.Add.Mesh("art7");
            ED.EAC.art7.Graphics.Add.Texture("art7");
            ED.EAC.art7.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.art7);
            
            ED.EAC.beds = os.graphics.Managers.Entity.Create();
            ED.EAC.beds.Graphics.Add.Mesh("bed0");
            ED.EAC.beds.Graphics.Add.Mesh("bed1");
            ED.EAC.beds.Graphics.Add.Mesh("bed2");
            ED.EAC.beds.Graphics.Add.Mesh("bed3");
            ED.EAC.beds.Graphics.Add.Mesh("bed4");
            ED.EAC.beds.Graphics.Add.Mesh("bed5");
            ED.EAC.beds.Graphics.Add.Texture("bed");
            ED.EAC.beds.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.beds);
            
            ED.EAC.chairs = os.graphics.Managers.Entity.Create();
            ED.EAC.chairs.Graphics.Add.Mesh("chairs");
            ED.EAC.chairs.Graphics.Add.Texture("chairs");
            ED.EAC.chairs.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.chairs);
            
            ED.EAC.clock = os.graphics.Managers.Entity.Create();
            ED.EAC.clock.Graphics.Add.Mesh("clock");
            ED.EAC.clock.Graphics.Add.Texture("clock");
            ED.EAC.clock.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.clock);
            
            ED.EAC.computers = os.graphics.Managers.Entity.Create();
            ED.EAC.computers.Graphics.Add.Mesh("computers");
            ED.EAC.computers.Graphics.Add.Texture("computers");
            ED.EAC.computers.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.computers);
 
            ED.EAC.curtainRods = os.graphics.Managers.Entity.Create();
            ED.EAC.curtainRods.Graphics.Add.Mesh("curtainrods");
            ED.EAC.curtainRods.Graphics.Set.texture(false);
            ED.EAC.curtainRods.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.curtainRods);
            
            ED.EAC.curtains = os.graphics.Managers.Entity.Create();
            ED.EAC.curtains.Graphics.Add.Mesh("curtains");
            ED.EAC.curtains.Graphics.Add.Texture("curtains");
            ED.EAC.curtains.Set.Scale(1,1,-1);
            ED.EAC.curtains.Graphics.Set.ambientColor([0.7, 0.7,0.7]); //If not set, defaults to [0.2,0.2,0.2]
            os.graphics.AddToWorld(ED.EAC.curtains);
            
            ED.EAC.desks = os.graphics.Managers.Entity.Create();
            ED.EAC.desks.Graphics.Add.Mesh("desks");
            ED.EAC.desks.Graphics.Set.texture(false);
            ED.EAC.desks.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.desks);
            
            ED.EAC.doors = os.graphics.Managers.Entity.Create();
            ED.EAC.doors.Graphics.Add.Mesh("doors");
            ED.EAC.doors.Graphics.Add.Texture("doors");
            ED.EAC.doors.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.doors);
            
            ED.EAC.floor = os.graphics.Managers.Entity.Create();
            ED.EAC.floor.Graphics.Add.Mesh("eacFloor");
            ED.EAC.floor.Graphics.Add.Texture("EACfloor");
            ED.EAC.floor.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.floor);
            
            ED.EAC.edcart = os.graphics.Managers.Entity.Create();
            ED.EAC.edcart.Graphics.Add.Mesh("EDCart");
            ED.EAC.edcart.Graphics.Add.Texture("EDCart");
            ED.EAC.edcart.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.edcart);
            
            ED.EAC.extWalls = os.graphics.Managers.Entity.Create();
            ED.EAC.extWalls.Graphics.Add.Mesh("exteriorEACWalls");
            ED.EAC.extWalls.Graphics.Add.Texture("exteriorEACWalls");
            ED.EAC.extWalls.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.extWalls);
            
            ED.EAC.intWalls = os.graphics.Managers.Entity.Create();
            ED.EAC.intWalls.Graphics.Add.Mesh("interiorEACWalls");
            ED.EAC.intWalls.Graphics.Add.Texture("interiorEACWalls");
            ED.EAC.intWalls.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.intWalls);
            
            ED.EAC.nodes = os.graphics.Managers.Entity.Create();
            ED.EAC.nodes.Graphics.Add.Mesh("nodes");
            ED.EAC.nodes.Graphics.Set.texture(false);
            ED.EAC.nodes.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.nodes);
            
            ED.EAC.plant = os.graphics.Managers.Entity.Create();
            ED.EAC.plant.Graphics.Add.Mesh("plant");
            ED.EAC.plant.Graphics.Add.Texture("plant");
            ED.EAC.plant.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.plant);
            
            ED.EAC.bumper = os.graphics.Managers.Entity.Create();
            ED.EAC.bumper.Graphics.Add.Mesh("bumper");
            ED.EAC.bumper.Graphics.Add.Texture("bumper");
            ED.EAC.bumper.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.bumper);
            
            ED.EAC.checkInWindow = os.graphics.Managers.Entity.Create();
            ED.EAC.checkInWindow.Graphics.Add.Mesh("checkInWindow");
            ED.EAC.checkInWindow.Graphics.Add.Texture("checkInWindow");
            ED.EAC.checkInWindow.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.checkInWindow);
            
            ED.EAC.wallTray = os.graphics.Managers.Entity.Create();
            ED.EAC.wallTray.Graphics.Add.Mesh("wallTray");
            ED.EAC.wallTray.Graphics.Add.Texture("wallTray");
            ED.EAC.wallTray.Set.Scale(1,1,-1);
            os.graphics.AddToWorld(ED.EAC.wallTray);
            
            
        },
        AI: function(){          
            var CAIEntity = function(){
                var self = this;
                this.MovementAlgorithms = {
                    SeekEntity: false,
                    SeekPosition: false,
                    FleeEntity: false,
                    FleePosition: false,
                    ArriveEntity: false,
                    ArrivePosition: false,
                    PatrolCircle: false,
                    HideEntity: false,
                    Flock: false,
                    Cohesion: false,
                    Alignment: false,
                    Seperation: false,
                    Avoidance: false
                }
                
                this.Movement ={
                    Disable: {
                        Seek: {
                            Entity: function(){
                                self.MovementAlgorithms.SeekEntity = false;
                            },
                            Position: function(){
                                self.MovementAlgorithms.SeekPosition = false;
                            }
                        },
                        Hide: {
                            Entity: function(){
                                self.MovementAlgorithms.HideEntity = false;
                            }
                        },
                        Arrive: {
                            Entity: function(){
                                self.MovementAlgorithms.ArriveEntity = false;
                            },
                            Position: function(){
                                self.MovementAlgorithms.ArrivePosition = false;
                            }
                        },
                        Flee: {
                            Entity: function(){
                                self.MovementAlgorithms.ArriveEntity = false;
                            },
                            Position: function(){
                                self.MovementAlgorithms.ArrivePosition = false;
                            }
                        },
                        Patrol: {
                            Circle: function(){
                                self.MovementAlgorithms.PatrolCircle = false;
                            }
                        },
                        Flock: function(){
                            self.MovementAlgorithms.Flock = false;
                        },
                        Cohesion: function(){
                            self.MovementAlgorithms.Cohesion = false
                        },
                        Alignment: function(){
                            self.MovementAlgorithms.Alignment = false;
                        },
                        Seperation: function(){
                            self.MovementAlgorithms.Seperation = false;
                        }
                    },
                    maxSpeed: 0.05,
                    maxForce: 1.9
                }
            }
            
            var CSeekPosition = function(oEntity, vTarget){
                
                var self = this;
                this.entity = oEntity;
                this.Update = function(dt){
                    var desired = [];
                    var applied = [];
                    var sign = [];
                    
                    //Desired Velocity
                    vec3.subtract(self.target,self.entity.Position, desired);
                    vec3.normalize(desired,desired);
                    
                    
                    //**********************
                    //   Force Calculation
                    //
                    //**********************
                    
                    vec3.scale(desired,self.entity.AI.Movement.maxSpeed,desired);
                    
                    //Applied Velocity
                    vec3.subtract(desired,self.entity.Axis.Look, applied);
                    
                    //Scale Final Applied Force
                    if(vec3.length(applied) > self.entity.AI.Movement.maxForce){
                        vec3.normalize(applied, applied);
                        vec3.scale(applied, self.entity.AI.Movement.maxForce);
                    }
                    
                    //Calculate new Look Vector
                    vec3.add(self.entity.Axis.Look, applied, desired);
                    vec3.normalize(desired, desired);
                    
                    //**********************
                    //   Adjust rotation
                    //
                    //**********************
                    
                    //Calculate sign for rotation (Y parameter)
                    vec3.cross(self.entity.Axis.Look, desired, sign);
                    
                    //Calculate angle of rotation
                    var angle = Math.acos((vec3.dot(self.entity.Axis.Look,desired)/vec3.length(desired)).toFixed(5)) * 180 / Math.PI;
                    
                    //Adjust to negative angle if sign is positive
                    self.entity.yaw = sign[1] < 0 ? self.entity.yaw + (angle * -1) : self.entity.yaw + angle;
                    
                    //**********************
                    //   Adjust Position
                    //
                    //**********************
                    vec3.scale(desired, self.entity.AI.Movement.maxSpeed * dt);
                    vec3.add(self.entity.Position, desired, self.entity.Position);
                    
                }
                
                this.target = vTarget;
                
                
            }
            var CSeekEntity = function(oEntity, oTarget){
                var self = this;
                this.entity = oEntity;
                this.Update = function(){
                    var t = [];
                    t = self.target.Physics ? self.target.Position : self.target.Position;
                    var desired = [];
                    var applied = [];
                    
                    //Desired Velocity
                    vec3.subtract(t,self.entity.Position, desired);
                    vec3.normalize(desired,desired);
                    
                    //Adjust rotation
                    //Find axis of rotation 
                    var rot = [];
                    
                    vec3.cross([0,0,-1], desired, rot);
                
                    var angle = Math.acos(vec3.dot(desired, [0,0,1]));//Math.asin(vec3.length(rot));
                    
                    vec3.normalize(rot,rot);
                    
                    //If greater than 5 degrees
                    //if(angle > 0.087266)
                        var cos = Math.cos(angle/2);
                        var sin = Math.sin(angle/2);
    
                        var percent = 1;
                        var quat = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
                        
                        self.entity.Physics.orientation = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
                        
                        //quat4.slerp(self.entity.Physics.orientation, quat, 1, self.entity.Physics.orientation);
                        //var orientInv = [];
                        //quat4.inverse(self.entity.Physics.orientation, orientInv);
                        //
                        //quat4.multiply(orientInv, quat, quat);
                        //
                        //quat[0] = Math.pow(quat[0], percent);
                        //quat[1] = Math.pow(quat[1], percent);
                        //quat[2] = Math.pow(quat[2], percent);
                        //quat[3] = Math.pow(quat[3], percent);
                        //
                        //quat4.normalize(quat,quat);
                        //
                        //quat4.multiply(self.entity.Physics.orientation,quat ,self.entity.Physics.orientation);
    
                    //
                    //else
                    //                                            //greater than 90                   less than 90
                    //    vec3.dot([0,0,-1], desired) <  0 ? self.entity.Physics.orientation : quat4.inverse(self.entity.Physics.orientation);
                    //    
                    //
                    
                    vec3.scale(desired,self.entity.AI.Movement.maxForce,desired);
                    
                    //Applied Velocity
                    vec3.subtract(desired,self.entity.Axis.Look, applied);
                    
                    //Scale Final Applied Force
                    if(vec3.length(applied) > self.entity.AI.Movement.maxForce){
                        vec3.normalize(applied, applied);
                        vec3.scale(applied, self.entity.AI.Movement.maxForce);
                    }
                    
                    //Apply Force
                    os.physics.Create.Force.Impulse(self.entity.Physics,[0,0,0],applied);
                    
                    
                    
                }
                
                this.target = oTarget;
            }
            
            var CFleePosition = function(){
                
            }
            var CFleeEntity = function(oEntity, oTarget){
                var self = this;
                this.entity = oEntity;
                this.Update = function(){
                    var t = [];
                    t = self.target.Physics ? self.target.Position : self.target.Position;
                    var desired = [];
                    var applied = [];
                    
                    //Desired Velocity
                    vec3.subtract(self.entity.Position,t, desired);
                    vec3.normalize(desired,desired);
                    
                    //Adjust rotation
                    //Find axis of rotation 
                    var rot = [];
                    
                    vec3.cross([0,0,-1], desired, rot);
                
                    var angle = Math.acos(vec3.dot(desired, [0,0,1]));//Math.asin(vec3.length(rot));
                    
                    vec3.normalize(rot,rot);
                    
                    var cos = Math.cos(angle/2);
                    var sin = Math.sin(angle/2);
    
                    var percent = 1;
                    var quat = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
                    
                    self.entity.Physics.orientation = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
                        
                    
                    vec3.scale(desired,self.entity.AI.Movement.maxForce,desired);
                    
                    //Applied Velocity
                    vec3.subtract(desired,self.entity.Axis.Look, applied);
                    
                    //Scale Final Applied Force
                    if(vec3.length(applied) > self.entity.AI.Movement.maxForce){
                        vec3.normalize(applied, applied);
                        vec3.scale(applied, self.entity.AI.Movement.maxForce);
                    }
                    
                    //Apply Force
                    os.physics.Create.Force.Impulse(self.entity.Physics,[0,0,0],applied);
                    
                    
                    
                }
                
                this.target = oTarget;
            }
            var CFleeEntityBound = function(){
                
            }
            
            var CArrivePosition = function(oEntity, vTarget){
                 //time = 0;
                 var self = this;
                this.entity = oEntity;
                this.Update = function(delta){
                    //time += ED.DES.simulationStep;
                    var expired = false;
                    var dt = delta;//16;
                    var desired = [];
                    var distance = [];
                    var applied = [];
                    var sign = [];
                    
                    //Desired Velocity
                    vec3.subtract(self.target,self.entity.Position, distance);
                    vec3.normalize(distance,desired);
                    distance = vec3.length(distance);
                    
                    
                    //**********************
                    //   Force Calculation
                    //
                    //**********************
                    
                    vec3.scale(desired,self.entity.AI.Movement.maxSpeed,desired);
                    
                    //Applied Velocity
                    vec3.subtract(desired,self.entity.Axis.Look, applied);
                    
                    //Scale Final Applied Force
                    if(vec3.length(applied) > self.entity.AI.Movement.maxForce){
                        vec3.normalize(applied, applied);
                        vec3.scale(applied, self.entity.AI.Movement.maxForce);
                    }

                    //Scale Final Applied Force
                    if(distance < (self.offsetDistance)){
                        
                        //Scale Final Applied Force
                        if(vec3.length(applied) > self.entity.AI.Movement.maxForce/2){
                            vec3.normalize(applied, applied);
                            vec3.scale(applied, self.entity.AI.Movement.maxForce/2, applied);
                        }
                        
                    }else{
                        //Scale Final Applied Force
                        if(vec3.length(applied) > self.entity.AI.Movement.maxForce){
                            vec3.normalize(applied, applied);
                            vec3.scale(applied, self.entity.AI.Movement.maxForce, applied);
                        }
                    }
                    
                    //Calculate new Look Vector
                    vec3.add(self.entity.Axis.Look, applied, desired);
                    vec3.normalize(desired, desired);
                    
                    //**********************
                    //   Adjust rotation
                    //
                    //**********************
                    
                    //Calculate sign for rotation (Y parameter)
                    vec3.cross(self.entity.Axis.Look, desired, sign);
                    
                    //Calculate angle of rotation
                    var angle = Math.acos((vec3.dot(self.entity.Axis.Look,desired)/vec3.length(desired)).toFixed(5)) * 180 / Math.PI;
                    
                    //Adjust to negative angle if sign is positive
                    self.entity.yaw = sign[1] < 0 ? self.entity.yaw + (angle * -1) : self.entity.yaw + angle;
                    
                    //**********************
                    //   Adjust Position
                    //
                    //**********************
                    
                    
                    if(distance > self.offsetDistance/2){
                        
                        vec3.scale(desired, self.entity.AI.Movement.maxSpeed * dt);
                        vec3.add(self.entity.Position, desired, self.entity.Position);
                        self.lastDistance = distance;
                    }
                    else{// if(distance > self.offsetDistance/2){
                        self.slowing = true;
                        vec3.scale(desired, self.entity.AI.Movement.maxSpeed * dt);
                        vec3.add(self.entity.Position, desired, self.entity.Position);
                    }
                    
                    if(self.slowing && (self.lastDistance < distance)){
                        self.entity.AI.MovementAlgorithms.ArrivePosition = false;
                        expired = true;
                    }
                        
                    self.lastDistance = distance;
                    return expired;
                    
                }
                
                this.target = vTarget;
                this.offsetDistance = 25;
                this.slowing = false;
                this.lastDistance = 0;
            }
            
            var CArriveEntity = function(){
                
            }
            var CHideEntity = function(oEntity, oTarget, vHidingPositions, vOffsets){
                var self = this;
                this.entity = oEntity;
                this.Update = function(){
                    
                    var flee = [];
                    flee = self.target.Physics ? self.target.Position : self.target.Position;
                    
                    var position = [];
                    var distance = 0;
                    var target = [];
                    for(var i = vHidingPositions.length - 1; i >= 0; i--){
                        
                        // HidingPosition - Flee
                        var direction = [];
                        vec3.subtract(vHidingPositions[i], flee, direction);
                        
                        // Distance = Mag(HidingPosition - Flee)
                        var dist = vec3.length(direction);
                        
                        // Normalize (HidingPosition - Flee)
                        vec3.normalize(direction, direction);
                        
                        // Scale(Normalize(HidingPosition - Flee), distance + offset);
                        vec3.scale(direction, vOffsets[i] + dist, position);
                        
                        // Flee + Distance
                        vec3.add(position, flee, position);
                        
                        //Get Distance to offset
                        vec3.subtract(position, self.entity.Position, direction);
                        
                        if(distance == 0){distance = vec3.length(direction)}
                        
                        //Find cloesest point to target 
                        if(vec3.length(direction) < distance){
                            
                            vec3.set(position, target);
                        }
                    
                    }
                    
                    var desired = [];
                    var applied = [];
                    
                    
                    //Desired Velocity
                    vec3.subtract(target,self.entity.Position, desired);
                    vec3.normalize(desired,desired);
                    
                    //Adjust rotation
                    //Find axis of rotation 
                    var rot = [];
                    
                    vec3.cross([0,0,-1], desired, rot);
                
                    var angle = Math.acos(vec3.dot(desired, [0,0,1]));//Math.asin(vec3.length(rot));
                    
                    vec3.normalize(rot,rot);
    
                    var cos = Math.cos(angle/2);
                    var sin = Math.sin(angle/2);
    
                    var percent = 1;
                    var quat = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
                    
                    self.entity.Physics.orientation = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
                        
    
                    
                    vec3.scale(desired,self.entity.AI.Movement.maxForce,desired);
                    
                    //Applied Velocity
                    vec3.subtract(desired,self.entity.Axis.Look, applied);
                    
                    //Scale Final Applied Force
                    if(vec3.length(applied) > self.entity.AI.Movement.maxForce){
                        vec3.normalize(applied, applied);
                        vec3.scale(applied, self.entity.AI.Movement.maxForce);
                    }
                    
                    //Apply Force
                    os.physics.Create.Force.Impulse(self.entity.Physics,[0,0,0],applied);
                    
                    
                    
                }
                
                this.target = oTarget;
            }
            var CPatrolCircle = function(oEntity, fRadius, vCenter){
                var self = this;
                this.entity = oEntity;
                this.radius = fRadius;
                this.center = vCenter;
                this.Update = function(){
                    var position  = [];
                    
                    //Get predictd next position
                    var VoDt = [];
                    vec3.scale(self.entity.Physics.velocity, 1.05, VoDt);
                    vec3.add(self.entity.Position, VoDt, position);
                    
                    //Map predicted position to sphere
                    //  Get direction
                    vec3.subtract(position, self.center, position);
                    vec3.normalize(position, position);
                    //Scale by radius
                    vec3.scale(position, self.radius, position);
                    //Add to center to get current position on path
                    vec3.add(self.center, position, position);
                    
                    var desired = [];
                    var applied = [];
                    
                    //Desired Velocity
                    vec3.subtract(position,self.entity.Position, desired);
                    vec3.normalize(desired,desired);
                    //**********************
                    //   Adjust rotation
                    //
                    //**********************
                    //Find axis of rotation 
                    var rot = [];
                    vec3.cross([0,0,-1], desired, rot);
                    var angle = Math.acos(vec3.dot(desired, [0,0,1]));//Math.asin(vec3.length(rot));
                    
                    vec3.normalize(rot,rot);
                    var cos = Math.cos(angle/2);
                    var sin = Math.sin(angle/2);
    
                    var percent = 1;
                    var quat = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
                    
                    self.entity.Physics.orientation = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
                    
                    //**********************
                    //   LinearForce Calculation
                    //
                    //**********************
                    
                    vec3.scale(desired,self.entity.AI.Movement.maxForce,desired);
                    
                    //Applied Velocity
                    vec3.subtract(desired,self.entity.Axis.Look, applied);
                    
                    //Scale Final Applied Force
                    if(vec3.length(applied) > self.entity.AI.Movement.maxForce){
                        vec3.normalize(applied, applied);
                        vec3.scale(applied, self.entity.AI.Movement.maxForce);
                    }
                    
                    //Apply Force
                    os.physics.Create.Force.Impulse(self.entity.Physics,[0,0,-1],applied);
                    
                }
            }
            
            var CFlock = function(){
                
            }
            
            var CCohesion = function(){
                
            }
            var CAvoidance = function(oEntity, vHalfSizes, vBVs){
                var self = this;
                this.entity = oEntity;
                this.halfSize = vHalfSizes;
                this.obstacles = vBVs;
                this.bv = os.physics.Create.BV.OBB(null,self.halfSize,self.entity.Position);
                this.bv.name = oEntity.ID();
                
                this.Update = function(){
                    for(var i = self.obstacles.length - 1; i >= 0; i--){
                        collision = self.bv.CollisionTest(self.obstacles[i]);
                        
                        if(collision){
                            //Position = OBB Cloesest Point + (radius * normal)
                            var distance = [];
                            vec3.subtract(collision.point.obj1, self.entity.Position, distance);
                            distance = vec3.length(distance);
                            
                            //Collision on left side
                            if(collision.point.obj1[0] < 0){
                                self.entity.Physics.Add.ForceAtLocalPoint([10000,0,0], [0,0,40]);
                            }
                            //Collision on Right Side
                            else{
                                self.entity.Physics.Add.ForceAtLocalPoint([-10000,0,0], [0,0,40]);
                            }
                            
                        }
                        
                    }
                }
            }
            
            //Holds Arrays of Alogorithms to be updated every loop
            //      key: AlogName, value: AlgoName[CMovingAlgorithm...]
            var _MovementAlgorithms = null;//os.resschmgr.Create.Map();
            
            //Arrays of Algorithms to be updated every loop
            //  AlgoName[CAlgoType] --> stored in MovementAlgo map
            var _SeekEntity = [];
            var _SeekPosition = [];
            var _ArrivePosition = [];
            var _ArriveEntity = [];
            var _FleeEntity = [];
            var _PatrolCircle = [];
            var _HideEntity = [];
            var _Avoidance = [];
            
            //  Finite State Machine and States
            //
            var FiniteStateMachine = function(cEntity){
                var owner = cEntity;
                var _CurrentState = new CState();
                var self = this;
                var _Enter = function(oMessage){
                    _CurrentState.Enter(owner, oMessage);
                }
                
                var _Exit = function(oMessage){
                    _CurrentState.Exit(owner, oMessage);
                }
                
                var _Execute = function(oMessage){
                    _CurrentState.Execute(owner, oMessage);
                }
                
                //Control Methods
                this.Transition = function(sName, oMessage){
                    //Call Exit for Current State
                    _Exit(oMessage);
                    
                    //Get New State to Transition Too
                    _CurrentState = _States.get(sName);
                    
                    //Call New States Setup and Exectue Methods
                    _Enter(oMessage);
                    _Execute(oMessage);
                }
                this.SetState = function(sName){
                    _CurrentState = _States.get(sName);
                }
                this.Update = function(oMessage){
                    _Execute(oMessage);
                }
                this.GetState = function(){
                    return _CurrentState.GetName();
                }
            }
            
            var CState = function(sName){
                var _name = sName;
                var self = this;
                
                this.Enter = function(cEntity, oMessage){
                    //Override this Method
                }
                
                this.Exit = function(cEntity, oMessage){
                    //Override this Method
                }
                
                this.Execute = function(cEntity, oMessage){
                    //Override this Method
                }
                
                this.GetName = function(){
                    return _name;
                }
    
            }
            //Holds all states created
            // key: name, value: CState
            var _States = null;//os.resschmgr.Create.Map()
            
            os.ai = {
                Initialize: function(){
                    //Create All Map Objects
                    _States = os.resschmgr.Create.Map();
                    _MovementAlgorithms = os.resschmgr.Create.Map();
                    
                    //Load all algo arrays into movment map
                    _MovementAlgorithms.put("SeekEntity", _SeekEntity);
                    _MovementAlgorithms.put("SeekPosition", _SeekPosition);
                    _MovementAlgorithms.put("ArriveEntity", _ArriveEntity);
                    _MovementAlgorithms.put("ArrivePosition", _ArrivePosition);
                    _MovementAlgorithms.put("FleeEntity", _FleeEntity);
                    _MovementAlgorithms.put("FleeEntity", _FleeEntity);
                    _MovementAlgorithms.put("PatrolCircle", _PatrolCircle);
                    _MovementAlgorithms.put("HideEntity", _HideEntity);
                    _MovementAlgorithms.put("Avoidance", _Avoidance);
                    
                },
                Create: {
                    Entity: function(){
                        var ent = new CAIEntity();
                        return ent;
                    },
                    FSM: function(cEntity){
                        return new FiniteStateMachine(cEntity);
                        
                    },
                    State: function(sName){
                        var state = new CState(sName);
                        _States.put(sName, state);
                        return state;
                    }
                },
                Get: {
                    State: function(sName){
                        return _States.get(sName);
                    }
                },
                Update: function(dt){
                    
                    //Update Movement Algorithms
                    os.ai.Movement.Update(dt);
                    
                },
                Movement: {
                    Add: {
                        Seek: {
                            Position: function(oEntity, vTarget){
                                var algo = new CSeekPosition(oEntity, vTarget);
                                _SeekPosition.push(algo);
                                oEntity.AI.MovementAlgorithms.SeekPosition = true;
                                return algo;
                            },
                            Entity: function(oEntity, oTarget){
                                var algo = new CSeekEntity(oEntity, oTarget);
                                _SeekEntity.push(algo);
                                oEntity.AI.MovementAlgorithms.SeekEntity = true;
                                return algo;
                            }
                        },
                        Flee: {
                            Position: function(){
                                
                            },
                            Entity: function(oEntity, oTarget){
                                var algo = new CFleeEntity(oEntity, oTarget);
                                _FleeEntity.push(algo);
                                oEntity.AI.MovementAlgorithms.FleeEntity = true;
                                return algo;
                            }
                        },
                        Arrive: {
                            Position: function(oEntity, vTarget){
                                var algo = new CArrivePosition(oEntity, vTarget);
                                _ArrivePosition.push(algo);
                                oEntity.AI.MovementAlgorithms.ArrivePosition = true;
                                return algo;
                            },
                            Entity: function(){
                                
                            }
                        },
                        Hide: {
                            Entity: function(oEntity, oTarget, vHidingPositions, vOffsets){
                                var algo = new CHideEntity(oEntity, oTarget, vHidingPositions, vOffsets);
                                _HideEntity.push(algo);
                                oEntity.AI.MovementAlgorithms.HideEntity = true;
                                return algo;
                            }
                        },
                        Patrol: {
                            Circle: function(oEntity, fRadius, vCenter){
                                var algo = new CPatrolCircle(oEntity, fRadius, vCenter);
                                _PatrolCircle.push(algo);
                                oEntity.AI.MovementAlgorithms.PatrolCircle = true;
                                return algo;
                            }
                        },
                        Avoidance: function(oEntity, vHalfSizes, vBVs){
                            var algo = new CAvoidance(oEntity, vHalfSizes, vBVs);
                            _Avoidance.push(algo);
                            oEntity.AI.MovementAlgorithms.Avoidance = true;
                            return algo;
                        }
                        
                    },
                    Update: function(dt){
                        
                        for(var i = _MovementAlgorithms.size; i--; _MovementAlgorithms.next()){
                            //Get Algorithm Array, and Key (Algorithm Type)
                            var algo = _MovementAlgorithms.value();
                            var type = _MovementAlgorithms.key();
                            
                            for(var j = algo.length - 1; j >= 0; j--){
                                
                                //algo[j].entity.AI.MovementAlgorithms[type] ? algo[j].Update(dt) : algo.splice(j,1);
                                algo[j].Update(dt) ? algo.splice(j,1) : false;
                                
                            }
                        }
                    }
                }
            }
            
            os.ai.Initialize();
            
        },
        Graphics: function(){
            //Load WebGL (Debug: false, fullscreen: true)
            os.graphics.Load(false, true);
            os.graphics.Set.Callback.Draw(ED.Draw);
            os.graphics.Set.Callback.Update(ED.Update);
            os.graphics.Set.Callback.Reset(ED.ResetGfx);
        },
        Assets: function(){
            //
            //  Load textures
            //
            var art1Tex = os.graphics.Managers.Texture.Create.Texture("art1", "scripts/Applications/data/models/art1.jpg");
            art1Tex.onLoad = function(){ED.Start("texture", "Art1 Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var art2Tex = os.graphics.Managers.Texture.Create.Texture("art2", "scripts/Applications/data/models/art2.jpg");
            art2Tex.onLoad = function(){ED.Start("texture", "Art2 Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var art3Tex = os.graphics.Managers.Texture.Create.Texture("art3", "scripts/Applications/data/models/art3.jpg");
            art3Tex.onLoad = function(){ED.Start("texture", "Art3 Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var art4Tex = os.graphics.Managers.Texture.Create.Texture("art4", "scripts/Applications/data/models/art4.jpg");
            art4Tex.onLoad = function(){ED.Start("texture", "Art4 Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var art5Tex = os.graphics.Managers.Texture.Create.Texture("art5", "scripts/Applications/data/models/art5.jpg");
            art5Tex.onLoad = function(){ED.Start("texture", "Art5 Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var art6Tex = os.graphics.Managers.Texture.Create.Texture("art6", "scripts/Applications/data/models/art6.jpg");
            art6Tex.onLoad = function(){ED.Start("texture", "Art6 Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var art7Tex = os.graphics.Managers.Texture.Create.Texture("art7", "scripts/Applications/data/models/art7.jpg");
            art7Tex.onLoad = function(){ED.Start("texture", "Art7 Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var bedTex = os.graphics.Managers.Texture.Create.Texture("bed", "scripts/Applications/data/models/Bed.jpg");
            bedTex.onLoad = function(){ED.Start("texture", "Bed Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var chairTex = os.graphics.Managers.Texture.Create.Texture("chairs", "scripts/Applications/data/models/chairs.jpg");
            chairTex.onLoad = function(){ED.Start("texture", "Chair Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var clockTex = os.graphics.Managers.Texture.Create.Texture("clock", "scripts/Applications/data/models/clock.jpg");
            clockTex.onLoad = function(){ED.Start("texture", "Clock Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var computersTex = os.graphics.Managers.Texture.Create.Texture("computers", "scripts/Applications/data/models/computers.jpg");
            computersTex.onLoad = function(){ED.Start("texture", "Computers Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var curtainTex = os.graphics.Managers.Texture.Create.Texture("curtains", "scripts/Applications/data/models/curtains.jpg");
            curtainTex.onLoad = function(){ED.Start("texture", "Curtain Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var doorsTex = os.graphics.Managers.Texture.Create.Texture("doors", "scripts/Applications/data/models/doors.jpg");
            doorsTex.onLoad = function(){ED.Start("texture", "Doors Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var EACfloorTex = os.graphics.Managers.Texture.Create.Texture("EACfloor", "scripts/Applications/data/models/EACfloor.jpg");
            EACfloorTex.onLoad = function(){ED.Start("texture", "Floor Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var EDcartTex = os.graphics.Managers.Texture.Create.Texture("EDCart", "scripts/Applications/data/models/ED_carts.jpg");
            EDcartTex.onLoad = function(){ED.Start("texture", "ED Cart Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var exteriorEACWallsTex = os.graphics.Managers.Texture.Create.Texture("exteriorEACWalls", "scripts/Applications/data/models/exteriorEACWalls.jpg");
            exteriorEACWallsTex.onLoad = function(){ED.Start("texture", "Exterior Wall Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var interiorEACWallsTex = os.graphics.Managers.Texture.Create.Texture("interiorEACWalls", "scripts/Applications/data/models/interiorEACWalls.jpg");
            interiorEACWallsTex.onLoad = function(){ED.Start("texture", "Interior Wall Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var plantTex = os.graphics.Managers.Texture.Create.Texture("plant", "scripts/Applications/data/models/plant.jpg");
            plantTex.onLoad = function(){ED.Start("texture", "Plant Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var people = os.graphics.Managers.Texture.Create.Texture("people", "scripts/Applications/data/models/littlebuddies.png");
            people.onLoad = function(){ED.Start("texture", "People Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var bumperTex = os.graphics.Managers.Texture.Create.Texture("bumper", "scripts/Applications/data/models/BumperRail.jpg");
            bumperTex.onLoad = function(){ED.Start("texture", "Bumper Rail Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var checkInWindowTex = os.graphics.Managers.Texture.Create.Texture("checkInWindow", "scripts/Applications/data/models/CheckinWindow.jpg");
            checkInWindowTex.onLoad = function(){ED.Start("texture", "Check In Window Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            var wallTrayTex = os.graphics.Managers.Texture.Create.Texture("wallTray", "scripts/Applications/data/models/WallTray.jpg");
            wallTrayTex.onLoad = function(){ED.Start("texture", "Wall Tray Texture Loaded")};
            ED.Assets.Textures.requested++;
            
            
            
            //
            //  Load Meshes
            //
            var art1 = os.graphics.Managers.Mesh.Create.Mesh("art1", "scripts/Applications/data/models/art1.json");
            art1.onLoad = function(){ED.Start("mesh", "Art1 Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var art2 = os.graphics.Managers.Mesh.Create.Mesh("art2", "scripts/Applications/data/models/art2.json");
            art2.onLoad = function(){ED.Start("mesh", "Art2 Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var art3 = os.graphics.Managers.Mesh.Create.Mesh("art3", "scripts/Applications/data/models/art3.json");
            art3.onLoad = function(){ED.Start("mesh", "Art3 Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var art4 = os.graphics.Managers.Mesh.Create.Mesh("art4", "scripts/Applications/data/models/art4.json");
            art4.onLoad = function(){ED.Start("mesh", "Art4 Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var art5 = os.graphics.Managers.Mesh.Create.Mesh("art5", "scripts/Applications/data/models/art5.json");
            art5.onLoad = function(){ED.Start("mesh", "Art5 Mesh Loaded")};
            ED.Assets.Meshes.requested++;
        
            var art6 = os.graphics.Managers.Mesh.Create.Mesh("art6", "scripts/Applications/data/models/art6.json");
            art6.onLoad = function(){ED.Start("mesh", "Art6 Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var art7 = os.graphics.Managers.Mesh.Create.Mesh("art7", "scripts/Applications/data/models/art7.json");
            art7.onLoad = function(){ED.Start("mesh", "Art7 Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var beds0 = os.graphics.Managers.Mesh.Create.Mesh("bed0", "scripts/Applications/data/models/beds0.json");
            beds0.onLoad = function(){ED.Start("mesh","Bed0 Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var beds1 = os.graphics.Managers.Mesh.Create.Mesh("bed1", "scripts/Applications/data/models/beds1.json");
            beds1.onLoad = function(){ED.Start("mesh","Bed1 Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var beds2 = os.graphics.Managers.Mesh.Create.Mesh("bed2", "scripts/Applications/data/models/beds2.json");
            beds2.onLoad = function(){ED.Start("mesh","Bed2 Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var beds3 = os.graphics.Managers.Mesh.Create.Mesh("bed3", "scripts/Applications/data/models/beds3.json");
            beds3.onLoad = function(){ED.Start("mesh","Bed3 Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var beds4 = os.graphics.Managers.Mesh.Create.Mesh("bed4", "scripts/Applications/data/models/beds4.json");
            beds4.onLoad = function(){ED.Start("mesh","Bed4 Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var beds5 = os.graphics.Managers.Mesh.Create.Mesh("bed5", "scripts/Applications/data/models/beds5.json");
            beds5.onLoad = function(){ED.Start("mesh","Bed5 Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var chairs = os.graphics.Managers.Mesh.Create.Mesh("chairs", "scripts/Applications/data/models/chairs.json");
            chairs.onLoad = function(){ED.Start("mesh", "Chairs Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var clock = os.graphics.Managers.Mesh.Create.Mesh("clock", "scripts/Applications/data/models/clock.json");
            clock.onLoad = function(){ED.Start("mesh", "Clock Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var computers = os.graphics.Managers.Mesh.Create.Mesh("computers", "scripts/Applications/data/models/computers.json");
            computers.onLoad = function(){ED.Start("mesh","Computers Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var curtainrods = os.graphics.Managers.Mesh.Create.Mesh("curtainrods", "scripts/Applications/data/models/curtainRods.json");
            curtainrods.onLoad = function(){ED.Start("mesh","Curtain Rod Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var curtains = os.graphics.Managers.Mesh.Create.Mesh("curtains", "scripts/Applications/data/models/curtains.json");
            curtains.onLoad = function(){ED.Start("mesh","Curtains Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var desks = os.graphics.Managers.Mesh.Create.Mesh("desks", "scripts/Applications/data/models/desks.json");
            desks.onLoad = function(){ED.Start("mesh","Desks Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var doctor = os.graphics.Managers.Mesh.Create.Mesh("doctor", "scripts/Applications/data/models/doctor.json");
            doctor.onLoad = function(){ED.Start("mesh", "Doctor Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var doors = os.graphics.Managers.Mesh.Create.Mesh("doors", "scripts/Applications/data/models/doors.json");
            doors.onLoad = function(){ED.Start("mesh","Door Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var eacFloor = os.graphics.Managers.Mesh.Create.Mesh("eacFloor", "scripts/Applications/data/models/EACfloor.json");
            eacFloor.onLoad = function(){ED.Start("mesh","EAC Floor Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var edCarts = os.graphics.Managers.Mesh.Create.Mesh("EDCart", "scripts/Applications/data/models/ED_Carts.json");
            edCarts.onLoad = function(){ED.Start("mesh","ED Carts Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var exteriorEACWalls = os.graphics.Managers.Mesh.Create.Mesh("exteriorEACWalls", "scripts/Applications/data/models/exteriorEACWalls.json");
            exteriorEACWalls.onLoad = function(){ED.Start("mesh","EAC Exterior Wall Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var interiorEACWalls = os.graphics.Managers.Mesh.Create.Mesh("interiorEACWalls", "scripts/Applications/data/models/interiorEACWalls.json");
            interiorEACWalls.onLoad = function(){ED.Start("mesh","EAC Interior Wall Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var patient = os.graphics.Managers.Mesh.Create.Mesh("patient", "scripts/Applications/data/models/joe.json");
            patient.onLoad = function(){ED.Start("mesh","Patient Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var nodes = os.graphics.Managers.Mesh.Create.Mesh("nodes", "scripts/Applications/data/models/nodes.json");
            nodes.onLoad = function(){ED.Start("mesh","Nav Nodes Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var nurse = os.graphics.Managers.Mesh.Create.Mesh("nurse", "scripts/Applications/data/models/nurse.json");
            nurse.onLoad = function(){ED.Start("mesh","Nurse Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var plant = os.graphics.Managers.Mesh.Create.Mesh("plant", "scripts/Applications/data/models/plant.json");
            plant.onLoad = function(){ED.Start("mesh","Plant Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var bumper = os.graphics.Managers.Mesh.Create.Mesh("bumper", "scripts/Applications/data/models/bumpers.json");
            bumper.onLoad = function(){ED.Start("mesh","Bumper Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var checkInWindow = os.graphics.Managers.Mesh.Create.Mesh("checkInWindow", "scripts/Applications/data/models/CheckinWindow.json");
            checkInWindow.onLoad = function(){ED.Start("mesh","Checkin Window Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
            var wallTray = os.graphics.Managers.Mesh.Create.Mesh("wallTray", "scripts/Applications/data/models/WallTray.json");
            wallTray.onLoad = function(){ED.Start("mesh","Wall Tray Mesh Loaded")};
            ED.Assets.Meshes.requested++;
            
        }
    },
    Draw: function(){
        
        //Draw MLPs
        for(var i = ED.Entities.MLP.length - 1; i >= 0; i-- ){
            ED.Entities.MLP[i].Graphics.Draw();
        }
        
        //Draw Patients
        for(var i = ED.Entities.Patients.length - 1; i >= 0; i-- ){
            ED.Entities.Patients[i].Graphics.Draw();
        }
    },
    Update: function(dt){
        
        
        //os.input.Update(dt);
        //os.ai.Update(dt);
        //ED.Input.Update(dt);
        
        //Update AI Movement Algorithms
        os.ai.Update(ED.DES.animationStep);
        
        //Check Moving Entities for Next Node in Path
        ED.Entities.Update.Paths();
        
        //Update DES
        ED.DES.Update(ED.DES.simulationStep);
        
        
        
    },
    ResetGfx: function(){
        
    },
    Map: {
        CNode: function(sName, iID, vPosition, vConnections){
            var self = this;
            this.name = sName;
            this.id = iID;
            this.Position = vPosition;
            this.Connections = vConnections;
            
            ED.Map.Nodes.put(iID, this);
            if(sName){ED.Map.Nodes.put(sName, this);}
        },
        CTreeNode: function(parentID, node){
            var self = this;
            this.id = node.id;
            this.Children = node.Connections;
            this.parent = parentID;
            this.node = node;
            this.weight = 0;
            this.heuristic = 0;
        },
        Nodes: null,
        rawMap: null,
        Load: function(sFilename){
            var self = this;
            var xhr = os.resschmgr.Create.XHRObject();
            var filepath = sFilename;
                
            xhr.open('GET',filepath,false);
            xhr.onreadystatechange = function()
            {
                if(xhr.readyState==4)
                { //4==DONE
                    if(xhr.status == 200)
                    {
                        ED.Map.rawMap = xhr.responseText;
                        ED.Map.BuildMap();
                    }
                    else
                    {
                        os.windows.Create.ErrorWindow('Load Failure', "Failed to load Node Map: URL: " + filepath + "<br/><br/>Check url and filename");
                    }
                    
                }
                                
            };
                        
            xhr.send();
            
        },
        BuildMap: function(){
            var file = ED.Map.rawMap.split('\n');
            //Remove Headers
            file.shift();
            
            os.console.Comment("Parsing and Building Nav Map");
            
            //Populate Node map
            for(var i = file.length - 1; i >= 0; i--){
                var record = file[i].split(',');
                var id = Number(record[0]);
                var name = record[1];
                var position = record.slice(2,5);
                position = position.map(Number);
                position[2] *= -1;
                position[1]  = 23.0;
                var empty = record.indexOf("",5);
                
                var connections = empty == -1 ? record.slice(5) : record.slice(5, empty);
                connections = connections.map(Number);
                
                var node = new ED.Map.CNode(name, id, position,connections)
            }
            
            ED.Map.rawMap = "";
            os.console.Comment("Nav Map Initialization Complete");
        },
        GetPath: function(startID, endID){
            //Clear out Active Paths and Visited Nodes map
            ED.Map.Astar.activePaths.removeAll();
            ED.Map.Astar.visitedNodes.removeAll();
            ED.Map.Astar.Path = null;
            
            //Get refrences to start and end nodes
            ED.Map.Astar.Start = new ED.Map.CTreeNode(-1,ED.Map.Nodes.get(startID));
            ED.Map.Astar.End   = new ED.Map.CTreeNode(-1,ED.Map.Nodes.get(endID));
            
            //Initialize A*
            //  Set Start Node, Add Connections
            ED.Map.Astar.Start.weight = 0;
            ED.Map.Astar.Start.heuristic = ED.Map.Astar.GetDistance(ED.Map.Astar.Start, ED.Map.Astar.End);
            ED.Map.Astar.AddConnections(ED.Map.Astar.Start);
            ED.Map.Astar.visitedNodes.put(ED.Map.Astar.Start.id, ED.Map.Astar.Start);
            var path = [];
            
            if(ED.Map.Astar.Start.id != ED.Map.Astar.End.id){
                //Begin A*
                while(ED.Map.Astar.activePaths.size){
                    ED.Map.Astar.SetBPSF();
                    ED.Map.Astar.AddConnections(ED.Map.Astar.BPSF);
                    ED.Map.Astar.UpdateActivePaths();
                }
                
                //Build an array of Nodes from TreeNodes in Reverse Order
                if(ED.Map.Astar.Path == null){
                    os.console.Comment("ERROR: No path from: " + startID + " to: " + endID);
                }
                while(ED.Map.Astar.Path.id != ED.Map.Astar.Start.id){
                    path.push(ED.Map.Astar.Path.node);
                    ED.Map.Astar.Path = ED.Map.Astar.visitedNodes.get(ED.Map.Astar.Path.parent);
                }
                path.push(ED.Map.Astar.Path.node);
            }
            //Return Array of Nodes in Reverse Order
            return path;
            
        },
        Astar: {
            activePaths: null,
            visitedNodes: null,
            Path: null,
            Start: null,
            End: null,
            BPSF: null,
            GetDistance: function(start, end){
                var vector = [];
                vec3.subtract(start.node.Position, end.node.Position, vector);
                return Math.sqrt(vec3.dot(vector, vector));
                
            },
            UpdateActivePaths: function(){
                
                //Loop through Active Paths
                for(var i = ED.Map.Astar.activePaths.size -  1; i >=0; i--){
                    
                    //Path converged on final desination
                    if(ED.Map.Astar.activePaths.value().id == ED.Map.Astar.End.id){
                        
                        if(ED.Map.Astar.Path){  //If Path exist, test to see if it shorter
                            if(ED.Map.Astar.activePaths.value().weight < ED.Map.Astar.Path.weight){
                                ED.Map.Astar.Path = ED.Map.Astar.activePaths.value();
                            }
                        }
                        else{                   //No Path exist, set Path to current value
                            ED.Map.Astar.Path = ED.Map.Astar.activePaths.value();
                        }
                        ED.Map.Astar.activePaths.remove(ED.Map.Astar.activePaths.key());
                        if(ED.Map.Astar.activePaths.size > 0){
                            ED.Map.Astar.activePaths.next();
                        }
                    }
                    else{
                        ED.Map.Astar.activePaths.next();
                    }
                    
                }
                
                //If a Path has been found, prune tree of all Active Paths longer that Path
                if(ED.Map.Astar.Path){
                    for(var i = ED.Map.Astar.activePaths.size -  1; i >=0; i--){
                        if((ED.Map.Astar.BPSF.weight + ED.Map.Astar.BPSF.heuristic) < ( (ED.Map.Astar.activePaths.value()).weight + (ED.Map.Astar.activePaths.value()).heuristic )){
                            ED.Map.Astar.activePaths.remove(ED.Map.Astar.activePaths.key());
                        }
                    }
                }
            },
            SetBPSF: function(){
                //Initialize BPSF to a value from map
                ED.Map.Astar.BPSF = ED.Map.Astar.activePaths.value();
                
                //Loop through all Active Paths, and set BPSF to shortest
                for(var i = ED.Map.Astar.activePaths.size - 1; i >=0; i--){
                    if((ED.Map.Astar.BPSF.weight + ED.Map.Astar.BPSF.heuristic) > ( (ED.Map.Astar.activePaths.value()).weight + (ED.Map.Astar.activePaths.value()).heuristic ) ){
                        ED.Map.Astar.BPSF = ED.Map.Astar.activePaths.value();
                    }
                    ED.Map.Astar.activePaths.next();
                }
            },
            AddConnections: function(treeNode){
                //var addedANode = false;
                
                //Only Add connections if treeNode is not destination
                if(treeNode.id != ED.Map.Astar.End.id){
                    
                    //Loop through treeNode Connections
                    for(var i = treeNode.node.Connections.length - 1; i >= 0; i--){
                        
                        //Create Tree Node
                        var tr = new ED.Map.CTreeNode(treeNode.node.id, ED.Map.Nodes.get(treeNode.node.Connections[i]));
                        
                        //Calculate Edge Weight and Heuristic Weight
                        tr.weight = treeNode.weight + ED.Map.Astar.GetDistance(treeNode, tr)
                        tr.heuristic = ED.Map.Astar.GetDistance(ED.Map.Astar.End, tr);
                        
                        //Test to see if node has already been visited
                        var visited = ED.Map.Astar.visitedNodes.get(tr.id);
                        
                        if(visited){ //Node has already been visited
                            
                            //If new path is shorter, replace in tree
                            if(visited.weight > tr.weight){
                                ED.Map.Astar.activePaths.put(tr.id, tr);
                                ED.Map.Astar.visitedNodes.put(tr.id, tr);
                            }
                        }
                        else{       //First time node has been visited
                            ED.Map.Astar.activePaths.put(tr.id, tr);
                            ED.Map.Astar.visitedNodes.put(tr.id, tr);
                            //addedANode = true;
                        }
                    }
                    
                    //Remove the treeNode from Active Paths
                    //  if no connection added, dead end
                    //  if a connection was added, then only need to search children
                    ED.Map.Astar.activePaths.remove(treeNode.id);
                    
                }
            }
        }
    }
}
App.Init = function(){
    
    os.debugbar.AnchorConsole();
    os.console.Comment("   Initializing Emergency Department Simulation");
    ED.Load.Settings();
    
    os.console.Comment("     Load Graphics Core");
    ED.Load.Graphics();
    
    os.console.Comment("     Requesting Simulation Assets");
    ED.Load.Assets();
    
    os.console.Comment("     Initialzing Simulation Artificial Intelligence");
    ED.Load.AI();
    
    os.console.Comment("     Requesting Navigation Map");
    ED.Load.Map();
    
    os.console.Comment("     Loading EAC Simulation Enviroment");
    ED.Load.EAC();
    
    os.console.Comment("     Loading Simulation Entities");
    ED.Load.Entities();
    
    os.console.Comment("     Loading Simulation States");
    ED.Load.States();
    
    os.console.Comment("     Loading Simulation Models");
    ED.Load.Models();
    
    os.console.Comment("     Initializing Discrete Event Simulation Engine");
    ED.Load.DES(Date.now());
    
    os.console.Comment("     Registering Input Controls");
    ED.Load.Controls();

}





