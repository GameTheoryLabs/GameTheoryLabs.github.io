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
        App.HTML.container = document.getElementById('app');
    
        App.HTML.Main.container = document.getElementById('main');
        App.HTML.Main.window = document.getElementById('main-window');
        App.HTML.Main.footer = document.getElementById('main-footer');
        
        App.HTML.Thumnails.container = document.getElementById('thumbnail');
        App.HTML.Thumnails.window = document.getElementById('thumbnail-window');
        App.HTML.Thumnails.footer = document.getElementById('thumbnail-footer');
        
        App.HTML.Properties.container = document.getElementById('properties');
        App.HTML.Properties.header = document.getElementById('properties-header');
        App.HTML.Properties.window = document.getElementById('properties-window');
        App.HTML.Properties.dropDown = document.getElementById("dropdown");
        App.HTML.Properties.dropDown.onchange = function(e){
            var win = os.windows.WindowsManager.Windows.get("jahova.window.id." + e.currentTarget.value);
            win.MakeActive();
            if(App.Events.onDropdown){App.Events.onDropdown(win);};
        }
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
//
//  Application Specific Code
//
//  Overload the following methods
//      App.Events.onDropdown: called when dropdown in properties window changes
//      App.Events.onFullScreen: called when app goes fullscreen
//      App.Events.onWindowed:   called when app goes windowed
//      App.Events.onFileLoaded: used when files have been loaded (via fileselector or dropzone)
//
//      App.Init: called upon application loading, place initialization and start up code here
//
//
var headings = [];
var data = [];
var results = [];
ParseCSV = function(raw){
    os.debugbar.AnchorConsolePage();
    os.console.Comment("Parsing Data");
    
    raw = raw.split("\n");
    headings = raw[0].split(',');
    
    for(var i = 0; i < headings.length; i++){
        data[i] = [];
    }
    
    for(var j = 1; j < raw.length; j++){
        var values = raw[j].split(",");
        for(var k = 0; k < values.length; k++){
            data[k].push(Number(values[k]));
        }
    }
    os.console.Comment("Data Parsing Complete");
}

//Performs Convolution on data set
Convolution = function(w){
    var width = w || 20;
    results.length = 0;
    
    var low = 0;
    var high = low + width;
    
    var on  = [];
    var off = [];
    os.console.Comment("Splitting Data Sets");
    for(var i = 0; i <data[5].length; i++){
        var value = [data[0][i], data[1][i], data[2][i], data[3][i], data[4][i], data[5][i] ];
        
        if(value[5] == 0){
            off.push(value);
        }
        else{
            on.push(value)
        }
    }
    
    os.console.Comment("Convolving Data");
    for(; high <= 360; high+=width, low+=width ){
        var offWindow = [];
        var onWindow  = [];
        
        for(var i = 0; i < on.length; i++){
            if( (on[i][4] >= low) && (on[i][4] < high) ){
                onWindow.push(on[i][2]);
            }
            if( (off[i][4] >= low) && (off[i][4] < high) ){
                offWindow.push(off[i][2]);
            }
        }
        
        var out = Analyze(onWindow, offWindow);
        out.low = low;
        out.high = high;
        
        if(out.sig == true){
            os.console.Comment("Significant: " + out.low + " - " + out.high);
            os.console.Comment("On: " + (out.on[0]).toFixed(2) + " < " + out.on[1].toFixed(2) + " < " + out.on[2].toFixed(2));
            os.console.Comment("On: " + out.off[0].toFixed(2) + " < " + out.off[1].toFixed(2) + " < " + out.off[2].toFixed(2));
            os.console.Comment("On Samples: " + out.nOn + ", Off Samples: " + out.nOff);
        }
            
        results.push(out);
        
        
    }
    
    os.console.Comment("Analysis Complete");
}

//Takes array of values to analyze
//  Analyizing single window of convolution
//  Calculates Average and Confidence Interval
//  Returns: {
//              nOn: number of On Samples
//              nOff: number of Off Samples
//              on: low bound, average, high bound
//              off: low bound, average, high bound
//              sig: true/false
//          }
Analyze = function(hon, hoff){
    
    var avgOn  = Average(hon);
    var avgOff = Average(hoff);
    
    var stdOn  = StdDev(avgOn, hon);
    var stdOff = StdDev(avgOff, hoff);
    
    var sqrtNOn  = Math.sqrt(hon.length);
    var sqrtNOff = Math.sqrt(hoff.length);
    
    var stdErrOn  = 1.96 * stdOn / sqrtNOn;
    var stdErrOff = 1.96 * stdOff / sqrtNOff;
    
    var sig = ((stdErrOff + stdErrOn) < Math.abs(avgOn - avgOff)) ? true : false;
    
    return {
      nOn: hon.length,
      nOff: hoff.length,
      on: [avgOn - stdErrOn, avgOn, avgOn + stdErrOn],
      off: [avgOff - stdErrOff, avgOff, avgOff + stdErrOff],
      sig: sig
    }; 
}

Average = function(input){
    sum = 0;
    for(var i = 0; i < input.length; i++){
        sum += input[i];
    }
    return (sum/input.length);
}
StdDev = function(avg, input){
    deviation = 0;
    
    for(var i = 0; i < input.length; i++){
        deviation += (input[i] - avg) * (input[i] - avg);
    }
    
    return (Math.sqrt(deviation/input.length));
}

//Converts YYYYMMDDTHHMMSSZ to Date Object
ParseTime = function(obj){
    var time = obj.Date;
    var year = time.substring(0,4);
    var month = time.substring(4,6);
    var day = time.substring(6,8);
    var hour = time.substring(9,11);
    var min = time.substring(11,13);
    var sec = time.substring(13,15);
    
    //os.console.Comment(month+"/"+day+"/"+year+"  "+hour+":"+min+":"+sec);
    //time = new Date(Date.UTC(year, month, day, hour, min, sec));
    obj.Date = new Date(year+"-"+month+"-"+day+"T"+hour+":"+min+":"+sec);
    //os.console.Comment(time.toISOString());
}

EventSort = function(evt){
    if(evt.Type == Data.EventID.Mine){
        Data.Mine.push(evt);
    }
    else if(evt.Type == Data.EventID.Build){
        Data.Build.push(evt);
    }
    else if(evt.Type == Data.EventID.Harvest){
        Data.Harvest.push(evt);
    }
    else if(evt.Type == Data.EventID.Craft){
        Data.Craft.push(evt);
    }
    else if(evt.Type == Data.EventID.Farm){
        Data.Farm.push(evt);
    }
    else if(evt.Type == Data.EventID.Explore){
        Data.Explore.push(evt);
    }
    else if(evt.Type == Data.EventID.Die){
        Data.Die.push(evt);
    }
    else if(evt.Type == Data.EventID.Combat){
        Data.Combat.push(evt);
    }
    else if(evt.Type == Data.EventID.Consume){
        Data.Consume.push(evt);
    }
    else if(evt.Type == Data.EventID.LogIn){
        Data.LogIn.push(evt);
    }
    else if(evt.Type == Data.EventID.LogOut){
        Data.LogOut.push(evt);
    }
}
PlayerSort = function(evt){
    var name = evt.Value.name || undefined;
    var list = Data.Players.get(name);

    //If list doesnt exist, create and store in Player map
    if(!list){
        list = [];
        Data.Players.put(name, list);        
    }

    //Push event to player array
    list.push(evt);
}
ParsePlayerToSession = function(player){
    //Initialize Session variables
    var evt;
    var session;

    //Looop through all events to create sessions
    for(var i = 0; i  < player.length; i++){
        evt = player[i]; //Grab Event
        
        //LogIn Event, create new session
        if((evt.Type == Data.EventID.LogIn)){

            //Create New Session
            session = [];
            session.push(evt);

            //Add SessionID and Time to Priority Queue
            Data.SessionIDStartTimes.push(Data.Sessions.size, evt.Date);

            //Add Session to Map
            Data.Sessions.put(Data.Sessions.size, session);
        }
        //Greater than 30min since last event, create new session
        else if( (i > 0) && ( (evt.Date - session[session.length - 1].Date) > 1800000)  ){
            //Create New Session
            session = [];
            session.push(evt);

            //Add SessionID and Time to Priority Queue
            Data.SessionIDStartTimes.push(Data.Sessions.size, evt.Date);
            
            //Add Session to Map
            Data.Sessions.put(Data.Sessions.size, session);
        }
        //First event for player is not LogIn, create new session
        else if(!session){
            //Create New Session
            session = [];
            session.push(evt);

            //Add SessionID and Time to Priority Queue
            Data.SessionIDStartTimes.push(Data.Sessions.size, evt.Date);
            
            //Add Session to Map
            Data.Sessions.put(Data.Sessions.size, session);
        }
        //Push event to session log
        else{
            session.push(evt);
        }
    }
}
ParseSessionsToCSV = function(id, session, out){
    //console.log("Converting Session ID: " + id);
    for(var i = 0; i < session.length; i++){
        var evt = session[i];
        var dt = i == 0 ? 0 : session[i].Date - session[i-1].Date;
        if((evt.Type == Data.EventID.LogIn) || (evt.Type == Data.EventID.LogOut)){
            Data.SessionsCSV += id + "," + 
                                evt.Value.name + "," + 
                                evt.Type + "," + 
                                evt.Date.toISOString() + 
                                "," + "," + "," + "," + "," + "," + "," + "," +"\n";
        }
        else{
            Data.SessionsCSV += id + "," + 
                                evt.Value.name  + "," + 
                                evt.Type + "," + 
                                evt.Date.toISOString() + "," + 
                                dt + "," + 
                                evt.Value.subAction + "," +
                                evt.Value.uniqueValue + "," +
                                evt.Value.biome + "," +
                                evt.Value.position[0] + "," +
                                evt.Value.position[1] + "," +
                                evt.Value.position[2] + "\n";
        }
    }
}
var json; //stores json version of input file
var Data = {
    numOfEvents: 0,
    Players: null,
    Sessions: null,
    SessionIDStartTimes: null,
    SessionsCSV: "",
    EventID: {
        Mine: 1, 
        Build: 2, 
        Harvest: 3, 
        Craft: 4, 
        Farm: 5,
        Explore: 6, 
        Die: 7,
        Combat: 8,
        Consume: 9,
        LogIn: 10, 
        LogOut: 11
    },
    Mine:       [],
    Build:      [],
    Harvest:    [],
    Craft:      [],
    Farm:       [],
    Explore:    [],
    Die:        [],
    Combat:     [],
    Consume:    [],
    LogIn:      [],
    LogOut:     []
}; 

App.Init = function(){
            //Priority Queue - https://github.com/STRd6/PriorityQueue.js
            // var queue = PriorityQueue({low: true});
        var CPriorityQueue = function(options) {
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
                content: contents,
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
              },
              clear: function(){
                return contents.length = 0;
              }
            };
        
            return self;
        }
        var prioritySortLow = function(a, b) {
          return b.priority - a.priority;
        };
        var prioritySortHigh = function(a, b) {
          return a.priority - b.priority;
        };

        os.resschmgr.Create.PriorityQueue = function(){
            return new CPriorityQueue();
        }
    //Display Demos
    //App.Display.EnableButton();
    //App.Events.onFullscreen = function(){os.console.Comment("Going Fullscreen")};
    //App.Events.onWindowed = function(){os.console.Comment("Going Windowed")};
    //
    //Window Demos
    //var myWindow = App.Window.Create("TestWindow", "PC", true);
    //myWindow.elements.content.html().innerHTML = "HELLO World!";
    
    //File IO Demos
    App.FileIO.Add.Dropzone.App();
    App.FileIO.Add.FileSelector.Thumbnails("Select Data");
    
    App.Events.onFileLoaded = function(files){
        var extension;
        
        for(var i = 0; i < files.length; i++){
            extension = App.FileIO.Get.Extension(files[i]);
            
            if(extension == "CSV"){
                App.FileIO.Read.Text(files[i], function(data){
                    //os.console.Comment(data);
                    ParseCSV(data);
                    //Convolution();
                })
            }
            else if(extension == "JSON"){
                App.FileIO.Read.Text(files[i], function(data){
                    //os.console.Comment(data);
                    os.debugbar.AnchorConsolePage();
                    try{
                        os.console.Comment("Parsing File");
                        json = JSON.parse(data);
                        Data.numOfEvents += json.length;
                        os.console.Comment("Parsing " + json.length + " Events");
                        for(var i = 0; i < json.length; i++){
                            
                            //Make Login/Logout Events JSON compatiable
                            if(json[i].Type == 10 || json[i].Type == 11){
                                json[i].Value = {name: json[i].Value};
                            }
                            else{
                                json[i].Value = JSON.parse(json[i].Value);
                            }

                            //Convert Time to Date object
                            ParseTime(json[i]);
                            

                            //Push Event to proper array
                            EventSort(json[i]);

                            
                            //Push events to players specific arrays
                            PlayerSort(json[i]);

                        }
                        os.console.Comment("Parsing Complete: Stat ...");
                        os.console.AppendComment(Data.Players.size + " Players Logged");
                        for(var i = 0; i < Data.Players.size; i++){
                            os.console.AppendComment(Data.Players.value().length + " events for " + Data.Players.key());
                            Data.Players.next();
                        }
                        os.console.AppendComment(Data.Mine.length + " Mining Events");
                        os.console.AppendComment(Data.Build.length + " Building Evetns");
                        os.console.AppendComment(Data.Harvest.length + " Harvesting Events");
                        os.console.AppendComment(Data.Craft.length + " Crafting Events");
                        os.console.AppendComment(Data.Farm.length + " Farming Events");
                        os.console.AppendComment(Data.Explore.length + " Exploring Events");
                        os.console.AppendComment(Data.Die.length + " Dieing Events");
                        os.console.AppendComment(Data.Combat.length + " Combat Events");
                        os.console.AppendComment(Data.Consume.length + " Consuming Events");
                        os.console.AppendComment(Data.LogIn.length + " Log In Events");
                        os.console.AppendComment(Data.LogOut.length + " Log Out Events");
                        os.console.Comment("");
                    }
                    catch(e){
                        console.log("Error parsing JSON, " + e);
                        os.console.Comment("Error Parsing JSON " + e);
                    }

                });
            }
            else{
                os.console.Comment("UNKNOWN TYPE: " + extension);
            }
        }
    }

    //
    //  Game data intializaiotn
    //
        //Holds Array list of all players actions
        Data.Players = os.resschmgr.Create.Map(); 
        Data.Sessions = os.resschmgr.Create.Map();
        Data.SessionIDStartTimes = os.resschmgr.Create.PriorityQueue({low: true});


    //
    //  Adding JaHOVA OS terminal command
    //
    var help = "Convolve Data Set >>Convolve  ";
    var convolve = function(input){
                os.console.Comment("");
                    Convolution(Number(input));
                }
    os.console.AddCommand("Convolve", convolve, convolve, help);

    help = "Generate Data Sets from Gameplay Data >>Generate sessions|players|events"
    var generateReport = function(input){
        var cmd = input.toUpperCase();
        
        if(cmd == 'SESSIONS'){
            os.console.Comment("\nGenerating Sessions Data From " + Data.Players.size + " Players");
            console.log(Data.Players.size + " Players");
            for(var i = 0; i < Data.Players.size; i++){
                //os.console.AppendComment("Parsing Player: " + Data.Players.key());
                //console.log(("Parsing Player: " + Data.Players.key()));
                ParsePlayerToSession(Data.Players.value());
                Data.Players.next();
            }

            os.console.AppendComment("Generated " + Data.Sessions.size + " Sessions from " + Data.Players.size + " Players and " + Data.numOfEvents + " Events\n");

            os.console.AppendComment("Converting Sessions Objects into CSV Strings");
            Data.SessionsCSV = "";
            var numOfSessions = Data.SessionIDStartTimes.size()
            for(var i = 0; i < numOfSessions; i++){
                ParseSessionsToCSV(i, Data.Sessions.get(Data.SessionIDStartTimes.pop()));
            }
            
            os.console.AppendComment("Generating output file: sessions.csv");
            var file = new Blob([Data.SessionsCSV], {type: 'text/plain'});
            saveAs(file, 'sessions.csv' );



        }
        else {
            os.console.Error("Unknown Report Type: " + cmd);
        }
    }
    os.console.AddCommand("Generate", generateReport, generateReport, help);
    
    os.debugbar.AnchorConsole();
    
}
