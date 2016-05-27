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

SetEngagementLevel = function(stats){
    //"LOW", "HIGH", "VERYHIGH"
    var duration = stats.duration;
    var events   = stats.NumberOf.Events;

    //Calculate distance to centroids
    var low = Math.sqrt(Math.pow( Data.Centroids.Engagment.Low[0] - duration, 2) + 
                        Math.pow( Data.Centroids.Engagment.Low[1] - events, 2));
    
    var high = Math.sqrt(Math.pow( Data.Centroids.Engagment.High[0] - duration, 2) + 
                         Math.pow( Data.Centroids.Engagment.High[1] - events, 2));
    
    var veryHigh = Math.sqrt(Math.pow( Data.Centroids.Engagment.VeryHigh[0] - duration, 2) + 
                             Math.pow( Data.Centroids.Engagment.VeryHigh[1] - events, 2));

    //Find closest centroid and set engagement level
    var test = low;
    stats.engagement = "LOW";

    if(high <= test){
        test = high;
        stats.engagement = "HIGH";
    }
    if(test > veryHigh){
        stats.engagement = "VERYHIGH";
    }

    //Debugging
    Cluster[stats.engagement]++;

}
SetArchetype = function(stats){
    var arch = Data.Archetype.Undefined;

    //Calculate distance to centroids
    if(stats.engagement == "LOW"){
 
        //Duration, Biomes, Distance, Mining, Building, Harvesting, Farming, Exploring, Deaths, Hunt
        var LShortPlay = Math.sqrt(Math.pow( Data.Centroids.Low.ShortPlay[0] - stats.duration, 2) + 
                                   Math.pow( Data.Centroids.Low.ShortPlay[1] - stats.NumberOf.Biomes, 2) + 
                                   Math.pow( Data.Centroids.Low.ShortPlay[2] - stats.distance, 2) + 
                                   Math.pow( Data.Centroids.Low.ShortPlay[3] - stats.NumberOf.Mine, 2) + 
                                   Math.pow( Data.Centroids.Low.ShortPlay[4] - stats.NumberOf.Build, 2) + 
                                   Math.pow( Data.Centroids.Low.ShortPlay[5] - stats.NumberOf.Harvest, 2) + 
                                   Math.pow( Data.Centroids.Low.ShortPlay[6] - stats.NumberOf.Farm, 2) + 
                                   Math.pow( Data.Centroids.Low.ShortPlay[7] - stats.NumberOf.Explore, 2) + 
                                   Math.pow( Data.Centroids.Low.ShortPlay[8] - stats.NumberOf.Die, 2) + 
                                   Math.pow( Data.Centroids.Low.ShortPlay[9] - stats.NumberOf.Hunt, 2));
        
        var LVisit     = Math.sqrt(Math.pow( Data.Centroids.Low.Visit[0] - stats.duration, 2) + 
                                   Math.pow( Data.Centroids.Low.Visit[1] - stats.NumberOf.Biomes, 2) + 
                                   Math.pow( Data.Centroids.Low.Visit[2] - stats.distance, 2) + 
                                   Math.pow( Data.Centroids.Low.Visit[3] - stats.NumberOf.Mine, 2) + 
                                   Math.pow( Data.Centroids.Low.Visit[4] - stats.NumberOf.Build, 2) + 
                                   Math.pow( Data.Centroids.Low.Visit[5] - stats.NumberOf.Harvest, 2) + 
                                   Math.pow( Data.Centroids.Low.Visit[6] - stats.NumberOf.Farm, 2) + 
                                   Math.pow( Data.Centroids.Low.Visit[7] - stats.NumberOf.Explore, 2) + 
                                   Math.pow( Data.Centroids.Low.Visit[8] - stats.NumberOf.Die, 2) + 
                                   Math.pow( Data.Centroids.Low.Visit[9] - stats.NumberOf.Hunt, 2));
       
        var LBuild     = Math.sqrt(Math.pow( Data.Centroids.Low.Build[0] - stats.duration, 2) + 
                                   Math.pow( Data.Centroids.Low.Build[1] - stats.NumberOf.Biomes, 2) + 
                                   Math.pow( Data.Centroids.Low.Build[2] - stats.distance, 2) + 
                                   Math.pow( Data.Centroids.Low.Build[3] - stats.NumberOf.Mine, 2) + 
                                   Math.pow( Data.Centroids.Low.Build[4] - stats.NumberOf.Build, 2) + 
                                   Math.pow( Data.Centroids.Low.Build[5] - stats.NumberOf.Harvest, 2) + 
                                   Math.pow( Data.Centroids.Low.Build[6] - stats.NumberOf.Farm, 2) + 
                                   Math.pow( Data.Centroids.Low.Build[7] - stats.NumberOf.Explore, 2) + 
                                   Math.pow( Data.Centroids.Low.Build[8] - stats.NumberOf.Die, 2) + 
                                   Math.pow( Data.Centroids.Low.Build[9] - stats.NumberOf.Hunt, 2));
        
        var LExplore   = Math.sqrt(Math.pow( Data.Centroids.Low.Explore[0] - stats.duration, 2) + 
                                   Math.pow( Data.Centroids.Low.Explore[1] - stats.NumberOf.Biomes, 2) + 
                                   Math.pow( Data.Centroids.Low.Explore[2] - stats.distance, 2) + 
                                   Math.pow( Data.Centroids.Low.Explore[3] - stats.NumberOf.Mine, 2) + 
                                   Math.pow( Data.Centroids.Low.Explore[4] - stats.NumberOf.Build, 2) + 
                                   Math.pow( Data.Centroids.Low.Explore[5] - stats.NumberOf.Harvest, 2) + 
                                   Math.pow( Data.Centroids.Low.Explore[6] - stats.NumberOf.Farm, 2) + 
                                   Math.pow( Data.Centroids.Low.Explore[7] - stats.NumberOf.Explore, 2) + 
                                   Math.pow( Data.Centroids.Low.Explore[8] - stats.NumberOf.Die, 2) + 
                                   Math.pow( Data.Centroids.Low.Explore[9] - stats.NumberOf.Hunt, 2));
        
        arch = LShortPlay;
        stats.Archetype = Data.Archetype.LowShortPlay;

        if(LVisit < arch){
            arch = LVisit;
            stats.Archetype = Data.Archetype.LowVisit;
        }

        if(LBuild < arch){
            arch = LBuild;
            stats.Archetype = Data.Archetype.LowBuild;
        }

        if(LExplore < arch){
            arch = LExplore;
            stats.Archetype = Data.Archetype.LowExplore;
        }

        Archetype[stats.Archetype]++;
    }
    else if(stats.engagement == "HIGH"){
        // HighPioneering: 4,
        // HighExplore: 5, 
        // HighBuild: 6

        //Duration, Biomes, Distance, Mining, Building, Harvesting, Farming, Exploring, Deaths, Hunt
        var HBuild   = Math.sqrt(Math.pow( Data.Centroids.High.Build[0] - stats.duration, 2) + 
                                 Math.pow( Data.Centroids.High.Build[1] - stats.NumberOf.Biomes, 2) + 
                                 Math.pow( Data.Centroids.High.Build[2] - stats.distance, 2) + 
                                 Math.pow( Data.Centroids.High.Build[3] - stats.NumberOf.Mine, 2) + 
                                 Math.pow( Data.Centroids.High.Build[4] - stats.NumberOf.Build, 2) + 
                                 Math.pow( Data.Centroids.High.Build[5] - stats.NumberOf.Harvest, 2) + 
                                 Math.pow( Data.Centroids.High.Build[6] - stats.NumberOf.Farm, 2) + 
                                 Math.pow( Data.Centroids.High.Build[7] - stats.NumberOf.Explore, 2) + 
                                 Math.pow( Data.Centroids.High.Build[8] - stats.NumberOf.Die, 2) + 
                                 Math.pow( Data.Centroids.High.Build[9] - stats.NumberOf.Hunt, 2));
    
        var HExplore = Math.sqrt(Math.pow( Data.Centroids.High.Explore[0] - stats.duration, 2) + 
                                 Math.pow( Data.Centroids.High.Explore[1] - stats.NumberOf.Biomes, 2) + 
                                 Math.pow( Data.Centroids.High.Explore[2] - stats.distance, 2) + 
                                 Math.pow( Data.Centroids.High.Explore[3] - stats.NumberOf.Mine, 2) + 
                                 Math.pow( Data.Centroids.High.Explore[4] - stats.NumberOf.Build, 2) + 
                                 Math.pow( Data.Centroids.High.Explore[5] - stats.NumberOf.Harvest, 2) + 
                                 Math.pow( Data.Centroids.High.Explore[6] - stats.NumberOf.Farm, 2) + 
                                 Math.pow( Data.Centroids.High.Explore[7] - stats.NumberOf.Explore, 2) + 
                                 Math.pow( Data.Centroids.High.Explore[8] - stats.NumberOf.Die, 2) + 
                                 Math.pow( Data.Centroids.High.Explore[9] - stats.NumberOf.Hunt, 2));
        
        var HPioneer = Math.sqrt(Math.pow( Data.Centroids.High.Pioneering[0] - stats.duration, 2) + 
                                 Math.pow( Data.Centroids.High.Pioneering[1] - stats.NumberOf.Biomes, 2) + 
                                 Math.pow( Data.Centroids.High.Pioneering[2] - stats.distance, 2) + 
                                 Math.pow( Data.Centroids.High.Pioneering[3] - stats.NumberOf.Mine, 2) + 
                                 Math.pow( Data.Centroids.High.Pioneering[4] - stats.NumberOf.Build, 2) + 
                                 Math.pow( Data.Centroids.High.Pioneering[5] - stats.NumberOf.Harvest, 2) + 
                                 Math.pow( Data.Centroids.High.Pioneering[6] - stats.NumberOf.Farm, 2) + 
                                 Math.pow( Data.Centroids.High.Pioneering[7] - stats.NumberOf.Explore, 2) + 
                                 Math.pow( Data.Centroids.High.Pioneering[8] - stats.NumberOf.Die, 2) + 
                                 Math.pow( Data.Centroids.High.Pioneering[9] - stats.NumberOf.Hunt, 2));

        arch = HBuild;
        stats.Archetype = Data.Archetype.HighBuild;

        if(HExplore < arch){
            arch = HExplore;
            stats.Archetype = Data.Archetype.HighExplore;
        }

        if(HPioneer < arch){
            arch = HPioneer;
            stats.Archetype = Data.Archetype.HighPioneering;
        }

        Archetype[stats.Archetype]++;
    }
    else if(stats.engagement == "VERYHIGH"){
        stats.Archetype = Data.Archetype.VeryHigh;
        Archetype[stats.Archetype]++;
    }
    else if(stats.engagement == "UNDEFINED"){
        stats.Archetype = Data.Archetype.Undefined;
        Archetype[stats.Archetype]++;
    }
}
GenerateSessionStats = function(stats, session){
    stats.NumberOf.Events = session.length;

    stats.endTime = session[session.length - 1].Date;
    //stats.duration = (stats.endTime - stats.startTime) / (1000 * 60);  //Duration in minutes
    stats.duration = (stats.endTime - stats.startTime) / (10000);  //Incorrectly calculate time to match cluster data

    //Calculates time incorreclty, but matches paper
    // stats.endTime = session.length >2 ? session[session.length - 2].Date : session[session.length - 1].Date;
    // stats.duration = (stats.endTime - stats.startTime) / (10000);  //Duration in minutes

    //Create Biome map to identify number of unique biomes visited
    var biomes = os.resschmgr.Create.Map(); 

    var distance = 0.0;

    if(stats.NumberOf.Events > 2 && stats.duration > 1 ){
        //Reset number events to remove LogIn/Out events
        stats.NumberOf.Events = 0;
        
        
        //Loop through events in session
        for(var i = 0; i < session.length; i++){

            //Identify Biome and add to map if new
                //Check for biome (if not LogIn/LogOut Event)
            if((session[i].Type != Data.EventID.LogIn) && (session[i].Type != Data.EventID.LogOut)){
                //If biome not in map, ad it
                if(biomes.get(session[i].Value.biome) == undefined){
                    biomes.put(session[i].Value.biome,session[i].Value.biome);
                }

                //Accumlate Distance Traveled
                if((i > 0) && (session[i-1].Type != Data.EventID.LogIn) && (session[i-1].Type != Data.EventID.LogOut)){
                    var pos0 = session[i-1].Value.position;
                    var pos1 = session[i].Value.position;

                    distance += Math.sqrt(Math.pow( pos1[0] - pos0[0], 2) + 
                                              Math.pow( pos1[1] - pos0[1], 2) + 
                                              Math.pow( pos1[2] - pos0[2], 2));
                }
            }



            //Increment Event Type Counter
            if(session[i].Type == Data.EventID.Mine){          stats.NumberOf.Mine++; stats.NumberOf.Events++;}
            else if(session[i].Type == Data.EventID.Build){    stats.NumberOf.Build++; stats.NumberOf.Events++;}
            else if(session[i].Type == Data.EventID.Harvest){  stats.NumberOf.Harvest++; stats.NumberOf.Events++;}
            else if(session[i].Type == Data.EventID.Craft){    stats.NumberOf.Craft++; stats.NumberOf.Events++;}
            else if(session[i].Type == Data.EventID.Farm){     stats.NumberOf.Farm++; stats.NumberOf.Events++;}
            else if(session[i].Type == Data.EventID.Explore){  stats.NumberOf.Explore++; stats.NumberOf.Events++;}
            else if(session[i].Type == Data.EventID.Die){      stats.NumberOf.Die++; stats.NumberOf.Events++;}
            else if(session[i].Type == Data.EventID.Combat){   
                    if(session[i].Value.subAction == "Hunt"){  stats.NumberOf.Hunt++;}
                                                               stats.NumberOf.Combat++; 
                                                               stats.NumberOf.Events++;}
            else if(session[i].Type == Data.EventID.Consume){  stats.NumberOf.Consume++; stats.NumberOf.Events++;}
            
            //Update Event Stream
                //If stream is empty, create first event
            if(stats.streams.length == 0){
                stats.streams[0] = {type: session[i].Type,
                                    value: 1};
            }
            else{
                //Get last event object in stream
                var evt = stats.streams[stats.streams.length - 1];

                //If type is same, increment count
                if(evt.type == session[i].Type){
                    evt.value++;
                }
                //If new type, create and push new event object
                else{
                    stats.streams.push({type: session[i].Type,
                                        value: 1});
                }
            }

        }

        //Save distance traveled
        stats.distance = distance/10;

        //Set number of biomes visited
        stats.NumberOf.Biomes = biomes.size;

        //Store events in stats 
        stats.events = session;

        //Determine Engagment Level
        SetEngagementLevel(stats);

        //Determin Archetype
        SetArchetype(stats);
    }
}
GeneratePlayerTransitions = function(player, sessions){
    var trans = new CPlayerTransition();
    var stat0 = sessions.content[0].object;
    var stat1;

    //Store first sessions archetype and engagment level
    trans.archTransitions.push(stat0.Archetype);
    trans.engagementTransitions.push(stat0.engagement);

    //Increment counters for first state
    trans.archCount[stat0.Archetype]++;
    trans.engagementCount[stat0.engagement]++;

    //Loop through all sessions storing transitions
    for(var i = 1; i < sessions.size(); i++){
        stat0 = sessions.content[i - 1].object;
        stat1 = sessions.content[i].object;

        //Push to transistions arrays
        trans.archTransitions.push(stat1.Archetype);
        trans.engagementTransitions.push(stat1.engagement);

        //Increment counters
        trans.archCount[stat1.Archetype]++;
        trans.engagementCount[stat1.engagement]++;

        //Increment Global engagment counter
        Data.Transitions.Engagment[stat0.engagement][stat1.engagement]++;

        //Increment Global archetype counter
        Data.Transitions.Archetype[stat0.Archetype][stat1.Archetype]++;

    }

    //Calculate Percentages
    var totalSessions = sessions.size();
    trans.archPercentage.LowShortPlay       = Number((trans.archCount[0]/totalSessions * 100).toFixed(1));
    trans.archPercentage.LowVisit           = Number((trans.archCount[1]/totalSessions * 100).toFixed(1));
    trans.archPercentage.LowBuild           = Number((trans.archCount[2]/totalSessions * 100).toFixed(1));
    trans.archPercentage.LowExplore         = Number((trans.archCount[3]/totalSessions * 100).toFixed(1));
    trans.archPercentage.HighPioneering     = Number((trans.archCount[4]/totalSessions * 100).toFixed(1));
    trans.archPercentage.HighExplore        = Number((trans.archCount[5]/totalSessions * 100).toFixed(1));
    trans.archPercentage.HighBuild          = Number((trans.archCount[6]/totalSessions * 100).toFixed(1));
    trans.archPercentage.VeryHigh           = Number((trans.archCount[7]/totalSessions * 100).toFixed(1));
    trans.archPercentage.Undefined          = Number((trans.archCount[8]/totalSessions * 100).toFixed(1));

    trans.engagementPercentage.Low          = Number((trans.engagementCount.LOW/totalSessions * 100).toFixed(1));
    trans.engagementPercentage.High         = Number((trans.engagementCount.HIGH/totalSessions * 100).toFixed(1));
    trans.engagementPercentage.VeryHigh     = Number((trans.engagementCount.VERYHIGH/totalSessions * 100).toFixed(1));
    trans.engagementPercentage.Undefined    = Number((trans.engagementCount.UNDEFINED/totalSessions * 100).toFixed(1));


    Data.PlayerTransitions.put(player, trans);
}
ParsePlayerToSession = function(player){
    //Initialize Session variables
    var evt;
    var session;
    var stats;

    //Looop through all events to create sessions
    for(var i = 0; i  < player.length; i++){
        evt = player[i]; //Grab Event
        
        //LogIn Event, create new session
        if((evt.Type == Data.EventID.LogIn)){

            //If session exist, then record previous session length in SessionData Object
            if(session && session.length > 0){
                GenerateSessionStats(stats, session);
            }


            //Create New Session
            session = [];
            session.push(evt);

            //Add SessionID and Time to Priority Queue
            Data.SessionIDStartTimes.push(Data.Sessions.size, evt.Date);

            //Add Session ID and Start Time to PlayerSession Map
                //Sessions description object
            stats = new CSessionStat();
            stats.id = Data.Sessions.size; //ID
            stats.startTime = evt.Date;    //Start Time
            Data.SessionStats.put(stats.id, stats);

                //If player exist in map, add to array
            if(Data.PlayerSessions.get(evt.Value.name)){
                var list = Data.PlayerSessions.get(evt.Value.name);
                list.push(stats, stats.startTime);
            }
            else{//Otherwise create new array in map
                var queue = os.resschmgr.Create.PriorityQueue({low: true});
                queue.push(stats, stats.startTime);
                Data.PlayerSessions.put(evt.Value.name, queue);
            }

            //Add Session to Map
            Data.Sessions.put(Data.Sessions.size, session);
        }
        //Greater than 30min since last event, create new session
        else if( (i > 0) && ( Math.abs((evt.Date - session[session.length - 1].Date)) > 1800000)  ){
        //else if( (i > 0) && ( ((evt.Date - session[session.length - 1].Date)) > 1800000)  ){   
            //If session exist, then record previous session length in SessionData Object
            if(session && session.length > 0){
                GenerateSessionStats(stats, session);
            }

            //Create New Session
            session = [];
            session.push(evt);

            //Add SessionID and Time to Priority Queue
            Data.SessionIDStartTimes.push(Data.Sessions.size, evt.Date);
            
            //Add Session ID and Start Time to PlayerSession Map
                //Sessions description object
            stats = new CSessionStat();
            stats.id = Data.Sessions.size; //ID
            stats.startTime = evt.Date;    //Start Time
            Data.SessionStats.put(stats.id, stats);

                //If player exist in map, add to array
            if(Data.PlayerSessions.get(evt.Value.name)){
                var list = Data.PlayerSessions.get(evt.Value.name);
                list.push(stats, stats.startTime);
            }
            else{//Otherwise create new array in map
                var queue = os.resschmgr.Create.PriorityQueue({low: true});
                queue.push(stats, stats.startTime)
                Data.PlayerSessions.put(evt.Value.name, queue);
            }

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
            
             //Add Session ID and Start Time to PlayerSession Map
                //Sessions description object
            stats = new CSessionStat();
            stats.id = Data.Sessions.size; //ID
            stats.startTime = evt.Date;    //Start Time
            Data.SessionStats.put(stats.id, stats);

                //If player exist in map, add to array
            if(Data.PlayerSessions.get(evt.Value.name)){
                var list = Data.PlayerSessions.get(evt.Value.name);
                list.push(stats, stats.startTime);
            }
            else{//Otherwise create new array in map
                var queue = os.resschmgr.Create.PriorityQueue({low: true});
                queue.push(stats, stats.startTime)
                Data.PlayerSessions.put(evt.Value.name, queue);
            }

            //Add Session to Map
            Data.Sessions.put(Data.Sessions.size, session);
        }
        //Push event to session log
        else{
            session.push(evt);
        }
    }

    //Record last session stats into SessionStats Object
    GenerateSessionStats(stats, session);
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

var CSessionStat = function(id, events){
    this.id = id;
    this.startTime = 0;
    this.endTime = 0;
    this.duration = 0;
    this.Archetype = Data.Archetype.Undefined;
    this.NumberOf = {
        Events: 0,
        Biomes: 0,
        Mine: 0, 
        Build: 0, 
        Harvest: 0, 
        Craft: 0, 
        Farm: 0,
        Explore: 0, 
        Die: 0,
        Combat: 0,
        Hunt: 0,
        Consume: 0,
    };
    this.distance = 0.0; //Total distance traveled in game units
    this.engagement = "UNDEFINED"; //"LOW", "HIGH", "VERYHIGH", "UNDEFINED"
    this.streams = [];   // [{type: event ID, value: number of times}, {type, value}, ....]
    this.events = null;
}
var CPlayerTransition = function(){
    this.archTransitions = [];
    this.archPercentage = {
        LowShortPlay: 0, 
        LowVisit: 0,  
        LowBuild: 0,  
        LowExplore: 0, 
        HighPioneering: 0,
        HighExplore: 0, 
        HighBuild: 0
    };
    this.archCount = [0,0,0,0,0,0,0,0,0];

    this.engagementTransitions = [];
    this.engagementPercentage = {
        Low: 0,
        High:  0,
        VeryHigh: 0,
        Undefined: 0
    }
    this.engagementCount = {
        LOW: 0,
        HIGH:  0,
        VERYHIGH: 0,
        UNDEFINED: 0
    }
}
var json; //stores json version of input file
var Cluster = { //Debugging Values
    LOW: 0, 
    HIGH: 0,
    VERYHIGH: 0,
}
var Archetype = [0,0,0,0,0,0,0,0,0]; //Debugging Values
var Data = {
    numOfEvents: 0,
    Players: null,              //Map of Arrays of all events associated with player name as key
    Sessions: null,             //Map of Arrays of all events associated with session ID as key
    PlayerSessions: null,       //PriorityQ of objects storing session ID and start time with player name as key
    PlayerTransitions: null,    //Map of arrays holding 
    SessionStats: null,         //Map of CSessionStat Objects with session ID as key
    SessionIDStartTimes: null,
    SessionsCSV: "",
    TransitionsCSV: "",
    TransitionCountsCSV: "",
    Transitions: {
        Engagment: {
            LOW: {
                LOW: 0,
                HIGH: 0,
                VERYHIGH: 0,
                UNDEFINED: 0
            },
            HIGH: {
                LOW: 0,
                HIGH: 0,
                VERYHIGH: 0,
                UNDEFINED: 0
            },
            VERYHIGH: {
                LOW: 0,
                HIGH: 0,
                VERYHIGH: 0,
                UNDEFINED: 0
            },
            UNDEFINED: {
                LOW: 0,
                HIGH: 0,
                VERYHIGH: 0,
                UNDEFINED: 0
            }
        },
        Archetype: [
        [0,0,0,0,0,0,0,0,0],//LowShortPlay
        [0,0,0,0,0,0,0,0,0],//LowVisit
        [0,0,0,0,0,0,0,0,0],//LowBuild
        [0,0,0,0,0,0,0,0,0],//LowExplore
        [0,0,0,0,0,0,0,0,0],//HighPioneering
        [0,0,0,0,0,0,0,0,0],//HighExplore
        [0,0,0,0,0,0,0,0,0],//HighBuild
        [0,0,0,0,0,0,0,0,0],//VeryHigh
        [0,0,0,0,0,0,0,0,0] //Undefined
        ]
    },
    Centroids: {
        Engagment: {    //session length (min), number of events
            Low: [190.417988, 187.097561], 
            High: [884.299107, 1242.687500],
            VeryHigh: [2073.682609, 4953.565217]
        },
        Low: { //Duration, Biomes, Distance, Mining, Building, Harvesting, Farming, Exploring, Deaths, Hunt
            Build: [279.5292683, 2.243902439, 215.3323794, 406.804878, 253.7804878, 9.365853659, 0.658536585, 3.951219512, 0.048780488, 2.536585366],
            ShortPlay: [71.61428571, 1.826086957, 73.16937376, 26.0931677, 12.72049689, 2.50310559, 0.310559006, 2.565217391, 0.316770186, 0.925465839],
            Visit: [284.7145833, 3.75, 355.9695181, 94.71875, 40.14583333, 15.88541667, 3.479166667, 9.583333333, 0.71875, 3.239583333],
            Explore: [404.4633333, 6.8, 1079.522008, 46.8, 29.26666667, 22.43333333, 1.866666667, 42.6, 0.766666667, 13.6]
        },
        High: {//Duration, Biomes, Distance, Mining, Building, Harvesting, Farming, Exploring, Deaths, Hunt
            Build: [1039.221739, 3.304347826, 892.8514372, 607.5652174, 1028.304348, 52.73913043, 23.86956522, 5.130434783, 0, 5.869565217],
            Pioneering: [770.3193548, 3.096774194, 449.0868046, 724.7258065, 311.9677419, 17.19354839, 3.387096774, 8.564516129, 0.548387097, 8.693548387],
            Explore: [1014.059259, 6.888888889, 1765.577247, 424.6666667, 307.1851852, 70.2962963, 4.888888889, 59.48148148, 0.888888889, 14.14814815]
        }
    },
    Archetype: {
        LowShortPlay: 0, 
        LowVisit: 1,  
        LowBuild: 2,  
        LowExplore: 3, 
        HighPioneering: 4,
        HighExplore: 5, 
        HighBuild: 6,
        VeryHigh: 7,
        Undefined: 8
    },
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
                    //if(!os.debugbar.ConsolePagepinned)
                    //    os.debugbar.AnchorConsole();
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
        Data.PlayerSessions = os.resschmgr.Create.Map();
        Data.PlayerTransitions = os.resschmgr.Create.Map();
        Data.SessionStats = os.resschmgr.Create.Map();
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

    help = "Generate Data Sets from Gameplay Data >>Generate sessions|transitions|events"
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

            //Output Cluster Info:
            var total = Cluster.LOW + Cluster.HIGH + Cluster.VERYHIGH;
            os.console.AppendComment("Total Number of Usable Sessions: " + total);
            os.console.AppendComment("Low: "  + (Cluster.LOW/total*100).toFixed(1) + "%" + ", "+ Cluster.LOW );
            os.console.AppendComment("High: "  + (Cluster.HIGH/total*100).toFixed(1) + "%" + ", "+ Cluster.HIGH );
            os.console.AppendComment("VeryHigh: "  + (Cluster.VERYHIGH/total*100).toFixed(1) + "%" + ", "+ Cluster.VERYHIGH );


            os.console.AppendComment("Archetype Distribution: ");
            os.console.AppendComment("Low: ");
            os.console.AppendComment("  LowShortPlay: " + (Archetype[0]/Cluster.LOW*100).toFixed(1) + "%" +  ", " + Archetype[0]);
            os.console.AppendComment("  LowVisit: " +     (Archetype[1]/Cluster.LOW*100).toFixed(1) + "%" +  ", " + Archetype[1]);
            os.console.AppendComment("  LowBuild: " +     (Archetype[2]/Cluster.LOW*100).toFixed(1) + "%" +  ", " + Archetype[2]);
            os.console.AppendComment("  LowExplore: " +   (Archetype[3]/Cluster.LOW*100).toFixed(1) + "%" +  ", " + Archetype[3]);

            os.console.AppendComment("High: ");
            os.console.AppendComment("  HighPioneering: " +  (Archetype[4]/Cluster.HIGH*100).toFixed(1) + "%" +  ", " + Archetype[4]);
            os.console.AppendComment("  HighExplore: " +     (Archetype[5]/Cluster.HIGH*100).toFixed(1) + "%" +  ", " + Archetype[5]);
            os.console.AppendComment("  HighBuild: " +       (Archetype[6]/Cluster.HIGH*100).toFixed(1) + "%" +  ", " + Archetype[6]);

             //if(!os.debugbar.ConsolePagepinned)
             //   os.debugbar.AnchorConsole();
        }
        else if(cmd == 'TRANSITIONS'){
            os.console.Comment('\nGenerating Transition Data');

            for(var i = 0; i < Data.PlayerSessions.size; i++){

                GeneratePlayerTransitions(Data.PlayerSessions.key(), Data.PlayerSessions.value());
                Data.PlayerSessions.next();
                
            }

            //Parse Player transitions to CSV
            Data.TransitionsCSV = '';

            for(var i = 0; i < Data.PlayerTransitions.size; i++){
                var stat = Data.PlayerTransitions.value();
                if(stat.archTransitions.length > 0){
                    Data.TransitionsCSV  += Data.PlayerTransitions.key() + "," + stat.archTransitions.join() + '\n';
                }
                Data.PlayerTransitions.next();
            }

            os.console.AppendComment("Generating output file: transitions.csv");
            var file = new Blob([Data.TransitionsCSV], {type: 'text/plain'});
            saveAs(file, 'transitions.csv' );

            //Parse Player archetype counts to CSV
            Data.TransitionsCountCSV = 'Player,LowShortPlay,LowVisit,LowBuild,LowExplore,HighPioneering,HighExplore,HighBuild,VeryHigh,Undefined\n';

            for(var i = 0; i < Data.PlayerTransitions.size; i++){
                var stat = Data.PlayerTransitions.value();
                if(stat.archTransitions.length > 0){
                    Data.TransitionsCountCSV  += Data.PlayerTransitions.key() + "," + stat.archCount.join() + '\n';
                }
                Data.PlayerTransitions.next();
            }

            os.console.AppendComment("Generating output file: transitionCounts.csv");
            var file = new Blob([Data.TransitionsCountCSV], {type: 'text/plain'});
            saveAs(file, 'transitionCounts.csv' );

            os.console.AppendComment("Transition Overview: ");
            //os.console.AppendComment("0: LowShortPlay\n1: LowVisit\n2: LowBuild\n3: LowExplore\n4: HighPioneering\n5: HighExplore\n6: HighBuild\n7: VeryHigh\n8: Undefined");

            os.console.AppendComment("\nArchetype Transitions");
            var archTran = Data.Transitions.Archetype;
            os.console.AppendComment("\tLSP\tLV\tLB\tLE\tHP\tHE\tHB\tVH");
            os.console.AppendComment("LSP\t"+ archTran[0][0]  +"\t"+ archTran[0][1] +"\t"+ archTran[0][2]  +"\t" + archTran[0][3] +"\t"+  archTran[0][4] +"\t"+  archTran[0][5] +"\t"+  archTran[0][6] +"\t"+  archTran[0][7] );
            os.console.AppendComment( "LV\t"+ archTran[1][0]  +"\t"+ archTran[1][1] +"\t"+ archTran[1][2]  +"\t" + archTran[1][3] +"\t"+  archTran[1][4] +"\t"+  archTran[1][5] +"\t"+  archTran[1][6] +"\t"+  archTran[1][7] );
            os.console.AppendComment( "LB\t"+ archTran[2][0]  +"\t"+ archTran[2][1] +"\t"+ archTran[2][2]  +"\t" + archTran[2][3] +"\t"+  archTran[2][4] +"\t"+  archTran[2][5] +"\t"+  archTran[2][6] +"\t"+  archTran[2][7] );
            os.console.AppendComment( "LE\t"+ archTran[3][0]  +"\t"+ archTran[3][1] +"\t"+ archTran[3][2]  +"\t" + archTran[3][3] +"\t"+  archTran[3][4] +"\t"+  archTran[3][5] +"\t"+  archTran[3][6] +"\t"+  archTran[3][7] );
            os.console.AppendComment( "HP\t"+ archTran[4][0]  +"\t"+ archTran[4][1] +"\t"+ archTran[4][2]  +"\t" + archTran[4][3] +"\t"+  archTran[4][4] +"\t"+  archTran[4][5] +"\t"+  archTran[4][6] +"\t"+  archTran[4][7] );
            os.console.AppendComment( "HE\t"+ archTran[5][0]  +"\t"+ archTran[5][1] +"\t"+ archTran[5][2]  +"\t" + archTran[5][3] +"\t"+  archTran[5][4] +"\t"+  archTran[5][5] +"\t"+  archTran[5][6] +"\t"+  archTran[5][7] );
            os.console.AppendComment( "HB\t"+ archTran[6][0]  +"\t"+ archTran[6][1] +"\t"+ archTran[6][2]  +"\t" + archTran[6][3] +"\t"+  archTran[6][4] +"\t"+  archTran[6][5] +"\t"+  archTran[6][6] +"\t"+  archTran[6][7] );
            os.console.AppendComment( "VH\t"+ archTran[7][0]  +"\t"+ archTran[7][1] +"\t"+ archTran[7][2]  +"\t" + archTran[7][3] +"\t"+  archTran[7][4] +"\t"+  archTran[7][5] +"\t"+  archTran[7][6] +"\t"+  archTran[7][7] );

            os.console.AppendComment("\nEngagement Transitions");
            var engTran = Data.Transitions.Engagment;
            os.console.AppendComment("\tL\tH\tVH");
            os.console.AppendComment( "L\t"+ engTran.LOW.LOW + "\t" + engTran.LOW.HIGH + "\t" + engTran.LOW.VERYHIGH);
            os.console.AppendComment( "H\t"+ engTran.HIGH.LOW + "\t" + engTran.HIGH.HIGH + "\t" + engTran.HIGH.VERYHIGH);
            os.console.AppendComment( "VH\t"+ engTran.VERYHIGH.LOW + "\t" + engTran.VERYHIGH.HIGH + "\t" + engTran.VERYHIGH.VERYHIGH);

            //Output Transition Data Files

            os.console.Comment("");

            //if(!os.debugbar.ConsolePagepinned)
            //    os.debugbar.AnchorConsole();
        }
        else {
            os.console.Error("Unknown Report Type: " + cmd);
        }
    }
    os.console.AddCommand("Generate", generateReport, generateReport, help);
    
    if(!os.debugbar.ConsolePagepinned)
        os.debugbar.AnchorConsole();
    
}
