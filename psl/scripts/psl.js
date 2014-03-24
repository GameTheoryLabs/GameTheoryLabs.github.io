var com  = com ? com : {};

//Utility Functions, Classes and Objects
com.playstylelabs = (function(){
    //PRIVATE MODULE PROPERTIES
    var pInstance = null;
    
    //CONSTANTS
    var NAME = "PlayStyleLabs";
    var VERSION = "0.1";
    var PATH = "scripts/psl.js";
    var BROWSER = null;
         
    //INTERFACE TO BIOLUCID MODULE
    var constructor = function(){

        //PRIVATE OBJECTS, PROPERTIES AND CLASS DEFINITIONS
        //
        
        //
        //  Base Classes
        //
        var CXHRObject = function(){
            var xhrObj = false;

            try {
                xhrObj = new XMLHttpRequest();
            }
            catch (e) {
                var progid = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
                for (var i = 0; i < progid.length; ++i) {
                    try {
                        xhrObj = new ActiveXObject(progid[i]);
                    }
                    catch (e) {
                        continue;
                    }
                    break;
                }
            }

            finally {
                return xhrObj;
            }
        };
        //HTML element base class
        var CHTMLElement = function(tag){
            //Creates HTML element if tag exist        
            this.html =  tag ? document.createElement(tag) : null;

        }
        CHTMLElement.prototype.AppendClass = function(sClass){
            this.html.className += " " + sClass + " ";
            return this.html.className;
        }
        CHTMLElement.prototype.AppendChild = function(childHTML){
            this.html.appendChild(childHTML);
        }
        CHTMLElement.prototype.AppendToID = function(parentID){
            document.getElementById(parentID).appendChild(this.html);
        }
        CHTMLElement.prototype.AppendToHTML = function(parentHTML){
            parentHTML.appendChild(this.html);
        }
        CHTMLElement.prototype.RemoveClass = function(sClass){
            //Remove class
            //var classes = this.html.className.replace(sClass, "");
            
            //Remove wthite space and split into array
            //classes = self.html.className.split(/\s+/);
            
            //Save array as string seperated by space
            var classes = ((this.html.className.replace(/^\s+|\s+$/g, "")).replace(sClass, "").split(/\s+/));
            classes.push(" ");
            
            this.html.className = classes.join(" ");
            
            return this.html.className;
        }
        CHTMLElement.prototype.RemoveChild = function(id){
            this.html.removeChild(document.getElementById(id));
        }
        CHTMLElement.prototype.RemoveAllClasses = function(){

            this.html.className = "";
        }
        CHTMLElement.prototype.RemoveAllChildren = function(){
        
            if ( this.html.hasChildNodes() )
            {
                while ( this.html.childNodes.length >= 1 )
                {
                    this.html.removeChild( this.html.firstChild );       
                } 
            }
        }
        CHTMLElement.prototype.SetHTML = function(oHTML){
            this.html = oHTML;//document.getElementById(id);
        }
        CHTMLElement.prototype.CreateHTML = function(tag){
            this.html = document.createElement(tag);
        }
            
            
        //Map Object
        var CMap = function(linkEntries){
            this.current = undefined;
            this.size = 0;
            this.isLinked = true;
        
            if(linkEntries === false)
            {
                    this.disableLinking();
            }
                    
            this.from = function(obj, foreignKeys, linkEntries)
            {
                var map = new Map(linkEntries);
        
                for(var prop in obj) {
                        if(foreignKeys || obj.hasOwnProperty(prop))
                                map.put(prop, obj[prop]);
                }
        
                return map;
            }
            
            this.noop = function()
            {
                    return this;
            }
            
            this.illegal = function()
            {
                    throw new Error('can\'t do this with unlinked maps');
            }
            
            this.reverseIndexTableFrom = function(array, linkEntries)
            {
                var map = new Map(linkEntries);
        
                for(var i = 0, len = array.length; i < len; ++i) {
                        var	entry = array[i],
                                list = map.get(entry);
        
                        if(list) list.push(i);
                        else map.put(entry, [i]);
                }
        
                return map;
            }
        
            this.cross = function(map1, map2, func, thisArg)
            {
                var linkedMap, otherMap;
            
                if(map1.isLinked) {
                        linkedMap = map1;
                        otherMap = map2;
                }
                else if(map2.isLinked) {
                        linkedMap = map2;
                        otherMap = map1;
                }
                else Map.illegal();
            
                for(var i = linkedMap.size; i--; linkedMap.next()) {
                        var key = linkedMap.key();
                        if(otherMap.contains(key))
                                func.call(thisArg, key, map1.get(key), map2.get(key));
                }
            
                return thisArg;
            }
        
            this.uniqueArray = function(array)
            {
                    var map = new Map;
            
                    for(var i = 0, len = array.length; i < len; ++i)
                            map.put(array[i]);
            
                    return map.listKeys();
            }                                    
        };
        
        CMap.prototype.disableLinking = function(){
            this.isLinked = false;
            this.link = Map.noop;
            this.unlink = Map.noop;
            this.disableLinking = Map.noop;
            this.next = Map.illegal;
            this.key = Map.illegal;
            this.value = Map.illegal;
            this.removeAll = Map.illegal;
            this.each = Map.illegal;
            this.flip = Map.illegal;
            this.drop = Map.illegal;
            this.listKeys = Map.illegal;
            this.listValues = Map.illegal;
        
            return this;
        };
        
        CMap.prototype.hash = function(value){
            return value instanceof Object ? (value.__hash ||
                    (value.__hash = 'object ' + ++arguments.callee.current)) :
                    (typeof value) + ' ' + String(value);
        };
        
        CMap.prototype.hash.current = 0;            
        CMap.prototype.link = function(entry){
                if(this.size === 0) {
                        entry.prev = entry;
                        entry.next = entry;
                        this.current = entry;
                }
                else {
                        entry.prev = this.current.prev;
                        entry.prev.next = entry;
                        entry.next = this.current;
                        this.current.prev = entry;
                }
        };
        
        CMap.prototype.unlink = function(entry) {
                if(this.size === 0)
                        this.current = undefined;
                else {
                        entry.prev.next = entry.next;
                        entry.next.prev = entry.prev;
                        if(entry === this.current)
                                this.current = entry.next;
                }
        };
        
        CMap.prototype.get = function(key) {
                var entry = this[this.hash(key)];
                return typeof entry === 'undefined' ? undefined : entry.value;
        };
        
        CMap.prototype.put = function(key, value) {
                var hash = this.hash(key);
        
                if(this.hasOwnProperty(hash))
                        this[hash].value = value;
                else {
                        var entry = { key : key, value : value };
                        this[hash] = entry;
        
                        this.link(entry);
                        ++this.size;
                }
        
                return this;
        };
        
        CMap.prototype.remove = function(key) {
                var hash = this.hash(key);
        
                if(this.hasOwnProperty(hash)) {
                        --this.size;
                        this.unlink(this[hash]);
        
                        delete this[hash];
                }
        
                return this;
        };
        
        CMap.prototype.removeAll = function() {
                while(this.size)
                        this.remove(this.key());
        
                return this;
        };
        
        CMap.prototype.contains = function(key) {
                return this.hasOwnProperty(this.hash(key));
        };
       
        CMap.prototype.isUndefined = function(key) {
                var hash = this.hash(key);
                return this.hasOwnProperty(hash) ?
                        typeof this[hash] === 'undefined' : false;
        };
        
        CMap.prototype.next = function() {
                this.current = this.current.next;
        };
        
        CMap.prototype.key = function() {
                return this.current.key;
        };
        
        CMap.prototype.value = function() {
                return this.current.value;
        };
       
        CMap.prototype.each = function(func, thisArg) {
                if(typeof thisArg === 'undefined')
                        thisArg = this;
        
                for(var i = this.size; i--; this.next()) {
                        var n = func.call(thisArg, this.key(), this.value(), i > 0);
                        if(typeof n === 'number')
                                i += n; // allows to add/remove entries in func
                }
        
                return this;
        };
        
        CMap.prototype.flip = function(linkEntries) {
                var map = new Map(linkEntries);
        
                for(var i = this.size; i--; this.next()) {
                        var	value = this.value(),
                                list = map.get(value);
        
                        if(list) list.push(this.key());
                        else map.put(value, [this.key()]);
                }
        
                return map;
        };
        
        CMap.prototype.drop = function(func, thisArg) {
                if(typeof thisArg === 'undefined')
                        thisArg = this;
        
                for(var i = this.size; i--; ) {
                        if(func.call(thisArg, this.key(), this.value())) {
                                this.remove(this.key());
                                --i;
                        }
                        else this.next();
                }
        
                return this;
        };
        
        CMap.prototype.listValues = function() {
                var list = [];
        
                for(var i = this.size; i--; this.next())
                        list.push(this.value());
        
                return list;
        }
        
        CMap.prototype.listKeys = function() {
                var list = [];
        
                for(var i = this.size; i--; this.next())
                        list.push(this.key());
        
                return list;
        }
        
        CMap.prototype.toString = function() {
                var string = '[object Map';
        
                function addEntry(key, value, hasNext) {
                        string += '    { ' + this.hash(key) + ' : ' + value + ' }' +
                                (hasNext ? ',' : '') + '\n';
                }
        
                if(this.isLinked && this.size) {
                        string += '\n';
                        this.each(addEntry);
                }
        
                string += ']';
                return string;
        };
        
        //
        //  OLD SYSTEM
        //
        var CSprite = function(sName){
            var self = this;
            this.name = sName;
            this.graphic = pInstance.Create.HTML("div");
            this.graphic.html.id = sName;
            this.graphic.html.style.position = "absolute";
            this.Position ={
                x: 0,
                y: 0,
                z: 0
            }
            this.Rotation ={
                x: 0,
                y: 0,
                z: 0
            }
            this.Move = {
                Up: function(iDist){
                    self.Position.y -= iDist;
                    self.graphic.html.style.top = (self.Position.y).toFixed(0) + "px";
                },
                Down: function(iDist){
                    self.Position.y += iDist;
                    self.graphic.html.style.top = (self.Position.y).toFixed(0) + "px";
                },
                Left: function(iDist){
                    self.Position.x -= iDist;
                    self.graphic.html.style.left = (self.Position.x).toFixed(0) + "px";
                },
                Right: function(iDist){
                    self.Position.x += iDist;
                    self.graphic.html.style.left = (self.Position.x).toFixed(0) + "px";
                },
                ToPosition: function(iX, iY){
                    self.Position.x = iX;
                    self.Position.y = iY;
                    
                    if(self.graphic.html.style.webkitTransform != undefined)
                        self.graphic.html.style.webkitTransform = "translate("+ (self.Position.x).toFixed(0) +"px,"+ (self.Position.y).toFixed(0) +"px)";
                    else
                        self.graphic.html.style.MozTransform = "translate("+ (self.Position.x).toFixed(0) +"px,"+ (self.Position.y).toFixed(0) +"px)";
                    //self.graphic.html.style.left = (self.Position.x).toFixed(0) + "px";
                    //self.graphic.html.style.top  = (self.Position.y).toFixed(0) + "px";
                }
            }
            
            this.Rotate = function(deg){
                self.graphic.html.style.webkitTransform = "rotate("+ deg +"deg)";
            }
            
            this.Spin = {
                X: function(deg){
                    
                },
                Y: function(deg){
                    
                }
            }
            
            
            this.Animation = {
                list: pInstance.Create.Map(),
                Current: {
                    animation: null,
                    frames: 0,
                    index: 0
                },
                loop: false,
                lastUpdate: 0,
                NextFrame: function(){//Transtion to next animation frame
                    self.Animation.lastUpdate = pInstance.Get.Time();
                    
                    self.Animation.Current.index = self.Animation.Current.index == self.Animation.Current.animation.numOfFrames - 1 ? 0  : self.Animation.Current.index + 1;
                    self.Animation.Current.frame = self.Animation.Current.animation.frames[self.Animation.Current.index];

                    self.graphic.html.style.backgroundPosition = -self.Animation.Current.frame.x + "px " + -self.Animation.Current.frame.y + "px";
                },
                Update: function(){   //Transition to Next Frame, if ready
                    
                },
                Start: function(){    //Auto Animate
                    
                },
                Pause: function(){    //Pause Animation 
                    
                },
                Reset: function(){    //Reset Animation to First Frame
                    self.Animation.lastUpdate = new Date().getDate();
                
                    self.Animation.Current.index = 0;
                    self.Animation.Current.frame = self.Animation.Current.animation.frames[0];
                },
                Load: function(oAnimation){     //Load New Animation into Sprite Object
                    self.Animation.list.put(oAnimation.name, oAnimation);
                },
                SetActive: function(sName){//Set Animation
                    //Remove Current Animation Class
                    if(self.Animation.Current.animation)
                        self.graphic.RemoveClass(self.Animation.Current.animation.sheet.GetClass());
                    
                    //Set new animation object
                    self.Animation.Current.animation = self.Animation.list.get(sName);
                    
                    //Add animation class to html
                    self.graphic.RemoveAllClasses();
                    self.graphic.AppendClass(self.Animation.Current.animation.sheet.GetClass());
                    
                    //Update frame on graphic
                    self.Animation.SetFrame(0);
                },
                SetFrame: function(iFrameNumber){ //Set To Specific Frame in Current Animation
                    self.Animation.lastUpdate = new Date().getDate();
                
                    self.Animation.Current.index = iFrameNumber;
                    self.Animation.Current.frame = self.Animation.Current.animation.frames[iFrameNumber];

                    self.graphic.html.style.backgroundPosition = -self.Animation.Current.frame.x + "px " + -self.Animation.Current.frame.y + "px";
                }
                
            }
        }
      
        //
        //  Artificial Intelligence
        //
        
        //  Finite State Machine
        var CFiniteStateMachine = function(cEntity){
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
        
        // States for FSM
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
        var _States = new CMap();
        
        
        //
        //  INPUT
        //
        var _eventID = 0;
        
        var _InputEvents = {
            Mouse: {
                Down: function(e){
                    _Mouse.lastX = e.clientX;
                    _Mouse.lastY = e.clientY;
                    _Mouse.pressed = true;
                    
                    var callbackArray = _MouseEvents.get("DOWN");
                    if(callbackArray){
                        for(var i = callbackArray.length - 1; i >= 0 ; i--){
                            if(callbackArray[i].scope){
                                callbackArray[i].func.apply(callbackArray.scope, [e]);
                            }else{
                                callbackArray[i].func(e);
                            }
                        }
                    }
                    
                },
                Up: function(e){
                    _Mouse.pressed = false;
                    
                    var callbackArray = _MouseEvents.get("UP");
                    if(callbackArray){
                        for(var i = callbackArray.length - 1; i >= 0 ; i--){
                            if(callbackArray[i].scope){
                                callbackArray[i].func.apply(callbackArray.scope, [e]);
                            }else{
                                callbackArray[i].func(e);
                            }
                        }
                    }
                },
                Move: function(e){
                    if (!_Mouse.pressed) {
                        return;
                    }
                    
                    var callbackArray = _MouseEvents.get("MOVE");
                    if(callbackArray){
                        for(var i = callbackArray.length - 1; i >= 0 ; i--){
                            if(callbackArray[i].scope){
                                callbackArray[i].func.apply(callbackArray.scope, [e]);
                            }else{
                                callbackArray[i].func(e);
                            }
                        }
                    }
                
                    _Mouse.lastX = e.clientX;
                    _Mouse.lastY = e.clientY; 
                }
            },
            Touch: {
                Start: function(e){
                    e.preventDefault();
                    _Touch.lastX = e.touches[0].pageX;
                    _Touch.lastY = e.touches[0].pageY;
                    _Touch.startX = e.touches[0].pageX;
                    _Touch.startY = e.touches[0].pageY;
                    _Touch.pressed = true;
                    
                    var callbackArray = _TouchEvents.get("START");
                    if(callbackArray){
                        for(var i = callbackArray.length - 1; i >= 0 ; i--){
                            if(callbackArray[i].scope){
                                callbackArray[i].func.apply(callbackArray.scope, [e]);
                            }else{
                                callbackArray[i].func(e);
                            }
                        }
                    }
                    
                },
                End: function(e){
                    e.preventDefault();
                    _Touch.pressed = false;
                    _Touch.startX = 0;
                    _Touch.startY = 0;
                    
                    var callbackArray = _TouchEvents.get("END");
                    if(callbackArray){
                        for(var i = callbackArray.length - 1; i >= 0 ; i--){
                            if(callbackArray[i].scope){
                                callbackArray[i].func.apply(callbackArray.scope, [e]);
                            }else{
                                callbackArray[i].func(e);
                            }
                        }
                    }
                },
                Move: function(e){
                    e.preventDefault();
                    if (!_Touch.pressed) {
                        return;
                    }
                    
                    var callbackArray = _TouchEvents.get("MOVE");
                    if(callbackArray){
                        for(var i = callbackArray.length - 1; i >= 0 ; i--){
                            if(callbackArray[i].scope){
                                callbackArray[i].func.apply(callbackArray.scope, [e]);
                            }else{
                                callbackArray[i].func(e);
                            }
                        }
                    }
                
                    _Touch.lastX = e.touches[0].pageX;
                    _Touch.lastY = e.touches[0].pageY; 
                }
            },
            Keyboard:{
                Keydown: function(e){
                    
                    var callbackArray = e.keyCode > 47 && e.keyCode < 91 ? _KeyDownEvents.get(String.fromCharCode(e.keyCode)) : _KeyboardControlKeyEvents.get(e.keyCode);
                                      
                    if(callbackArray){
                        for(var i = callbackArray.length - 1; i >= 0 ; i--){
                            if(callbackArray[i].scope){
                                callbackArray[i].func.apply(callbackArray.scope, [e]);
                            }else{
                                callbackArray[i].func(e);
                            }
                        }
                    }
                },
                Keyup: function(e){
                    var callbackArray = e.keyCode > 47 && e.keyCode < 91 ? _KeyUpEvents.get(String.fromCharCode(e.keyCode)) : _KeyboardControlKeyEvents.get(e.keyCode);
                                      
                    if(callbackArray){
                        for(var i = callbackArray.length - 1; i >= 0 ; i--){
                            if(callbackArray[i].scope){
                                callbackArray[i].func.apply(callbackArray.scope, [e]);
                            }else{
                                callbackArray[i].func(e);
                            }
                        }
                    }
                }
            }
        }
        
        var CCallback = function(iID, fFunction, oScope){
            this.func = fFunction;
            this.scope =  oScope == undefined ? false : oScope;
            this.id = iID;
        }
        
        
        //Holds state for Touch Events
        var _Touch = {
            startX: 0,
            startY: 0,
            lastX: 0,
            lastY: 0,
            pressed: false
        }
        
        //      key: mouseEventType, value: Array[CCallbacks]
        var _TouchEvents = new CMap();
        _TouchEvents.put("START", []);
        _TouchEvents.put("END", []);
        _TouchEvents.put("MOVE", []);
        document.addEventListener("touchstart", _InputEvents.Touch.Start, false);
        document.addEventListener("touchend", _InputEvents.Touch.End, false);
        document.addEventListener("touchmove", _InputEvents.Touch.Move, false);
        
        //Holds state of mouse for all registered states
        var _Mouse = {
            lastX: 0,
            lastY: 0,
            pressed: false
        }
        
        //      key: mouseEventType, value: Array[CCallbacks]
        var _MouseEvents = new CMap();
        _MouseEvents.put("DOWN", []);
        _MouseEvents.put("UP", []);
        _MouseEvents.put("MOVE", []);
        document.addEventListener("mousedown", _InputEvents.Mouse.Down, false);
        document.addEventListener("mouseup", _InputEvents.Mouse.Up, false);
        document.addEventListener("mousemove", _InputEvents.Mouse.Move, false);
        
        //Holds states/events of all keys
        //      key: keyCode, value: true/false
        var _KeyboardStates = new CMap();
        
        //      key: keyCode, value: Array[CCallbacks];
        var _KeyDownEvents = new CMap();
        var _KeyUpEvents = new CMap();
        var _KeyboardControlKeyEvents = new CMap();
        window.addEventListener("keydown", _InputEvents.Keyboard.Keydown, false);
        window.addEventListener("keyup", _InputEvents.Keyboard.Keyup, false);
        
        var Animations = new CMap();
        var SpriteSheets = new CMap();
        var Sprites = new CMap();
        
        //
        //  Sound API
        //
        var sounds = new CMap();
        
        var CSound =  function(sKey){
            var self = this;
            this.key = sKey;
            this.path = "";
            this.loop = false;
            this.autoplay = false;
            this.type = "";
            this.duration = "";
            this.volume = "";
            this.audio =  new CHTMLElement("audio");
        }
        CSound.prototype.Play = function(){
            this.audio.html.play();
        }
        CSound.prototype.Pause = function(){
            this.audio.html.pause();
        }
        
        
        //
        //  Base Entity
        //
            
        var EntityManager = function(){
            var nextID = 0;
            this.useCanvas = false;
            this.canvas = null;
            this.ctx = null;
            this.container = null;
            this.background = null;
            this.NextID = function(){return nextID++;}
            
            
                    //options: {useCanvas: true, canvas: html element, background: img}
            this.Initialize = function(options){
                this.useCanvas = options.useCanvas;
                this.canvas = options.canvas;
                this.canvas.className = "background";
                this.ctx = this.canvas.getContext('2d');
                this.background = options.background || null;
                
                CEntity.prototype.canvas = this.canvas;
                CEntity.prototype.ctx = this.canvas.getContext("2d");
                
                if(!options.useCanvas){
                    this.container = new CHTMLElement("div");
                    this.container.AppendClass("EntityManager");
                    this.container.AppendToHTML(document.body);
                }
            }
            
        }
        EntityManager.prototype.map = new CMap();
        //options: width: 0px, height: 0px, position: [0,0,0], rotation: [0,0,0]
        EntityManager.prototype.Create = function(options){
            
            // Determine options
            var width = options ? options.width || 0 : 0;
            var height = options ? options.height || 0 : 0;
            var position = options ? options.position || [0,0] : [0,0];
            
                //options: id: int, canvas: html element, width: 0px, height: 0px, position: [0,0]
            var ent = new CEntity({id: this.NextID(), canvas: this.canvas, width: width, height: height, position: position });
            
            //Place in Map
            this.map.put(ent.id, ent);
            
            //Return Entity
            return ent;
            
        }
        
        //options:  id: int, canvas: html element, width: 0px, height: 0px, position: [0,0,0], rotation: [0,0,0]
        var CEntity = function(options){
            this.id = options.id;
            this.width = options.width || 100;
            this.height = options.height || 100;
            this.position = options.position || [0,0,0];
            this.rotation = options.rotation || [0,0,0];
            
            
            //Not using canvas, create a Div
            if(!pInstance.Entity.useCanvas){
                this.container = new CHTMLElement("div");
                this.container.html.id = options.id;
                this.container.AppendClass("Entity");
                this.container.AppendToHTML(pInstance.Entity.container.html);
                
                
            }
            
            
            
            pInstance.Entity.map.put(this.id, this);
        }
        CEntity.prototype.canvas = null;
        CEntity.prototype.ctx = null;
        CEntity.prototype.AddGraphics = function(){
            pInstance.Graphics.Extend(this);
        }
        CEntity.prototype.Update = function(dt){
            if(this.graphics){this.graphics.Update(dt)}
        }
        
        
        //
        //  Graphics 
        //
        var GraphicsManager = function(){
                        
        }
        GraphicsManager.prototype.map = new CMap();
        GraphicsManager.prototype.spritesheets = new CMap();
        GraphicsManager.prototype.aniamtions = new CMap();
        GraphicsManager.prototype.images = new CMap();
        GraphicsManager.prototype.LoadImage = function(sURL,callback){
            var img = new CHTMLElement("img");
            
            img.html.src = sURL;
            img.html.onload = callback;
            pInstance.Graphics.images.put(sURL, img);
            
            return img;
            
        }
        GraphicsManager.prototype.CreateSpriteSheet = function(){
            
        }
        GraphicsManager.prototype.CreateAnimation = function(){
            
        }
        GraphicsManager.prototype.CreateSequence = function(){
            
        }
        GraphicsManager.prototype.Extend = function(oEntity){
            oEntity.graphics = new CGraphics(oEntity);
        }
        GraphicsManager.prototype.Update = function(dt){
            for(var i = 0; i < pInstance.Entity.map.size; i++, pInstance.Entity.map.next()){
                pInstance.Entity.map.value().graphics.Update(dt);
            }
        }
        GraphicsManager.prototype.Draw = function(){
            pInstance.Entity.ctx.drawImage(pInstance.Entity.background.html, 0, 0);
            
            if(pInstance.Entity.useCanvas){
                for(var i = 0; i < pInstance.Entity.map.size; i++, pInstance.Entity.map.next()){
                    pInstance.Entity.map.value().graphics.Draw();
                }
                
            }
        }
        
        
        //HTML Element
        var CGraphics = function(oEntity){
            var self = this;
            this.scale      = [1,1,1];
            this.offset     = [0,0,0];
            this.matrix     = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
            this.parent     = oEntity;
            this.canvas     = null;
            this.container  = null;
            
            //Function pointers, based upon redering system
            //  Div's = Update/Scale/Draw + HTML
            // canvas = Update/Scale/Draw + Canvas
            this.UpdateMatrix = "";
            this.Update = "";
            this.Scale  = "";
            this.Draw   = "";

            //Animation
            this.Animation = {
                list:               new CMap(),
                currentAnimation:   null,
                currentFrame:       0,
                lastUpdate:         0,
                active:             false,
                onStop:             null,
                onStopScope:        null,
                onStart:            null,
                onStartScope:       null,
                Add:     function(sName){
                    var ani = pInstance.Animation.animations.get(sName);
                    self.Animation.list.put(ani.name, ani);
                },
                Remove: function(sName){
                    self.Animation.list.remove(sName);
                },
                Set:    function(sName){
                    
                    var ani = self.Animation.list.get(sName);
                    
                    //Using div, need to update class
                    if(self.container){
                        //Remove Current Animation Class, if animation is loaded
                        if(self.Animation.currentAnimation)
                            self.container.RemoveClass(self.Animation.currentAnimation.sheet.GetClass());
                        
                        //Add animation class to html
                        self.container.RemoveAllClasses();
                        self.container.AppendClass(ani.sheet.GetClass());
                        
                    }
                    
                    //Set current to point to new animation
                    self.Animation.currentAnimation = ani;
                    
                    //Set animation to first frame
                    self.Animation.currentFrame = 0;
                    
                    self.Draw();
                    
                    self.Animation.active = true;
                    self.Animation.lastUpdate = 0;
                },
                Update: function(dt){
                    //Update timer
                    self.Animation.lastUpdate += dt;
                    
                    if(self.Animation.lastUpdate > self.Animation.currentAnimation.speed){
                        //Reset timer
                        self.Animation.lastUpdate = 0;
                        
                        //Increment frame
                        self.Animation.currentFrame++
                        
                        //Have we gone past last frame
                        if((self.Animation.currentFrame >= self.Animation.currentAnimation.frames.length)){
                            
                            //Looping, reset to first frame and Draw
                            if(self.Animation.currentAnimation.loop){
                                self.Animation.currentFrame = 0;
                                self.Draw();
                            }
                            else{
                                //Cancel Animation
                                self.Animation.active = false;
                                self.Animation.currentFrame = -1;
                                //Trigger Stop Event if present
                                if(self.Animation.onStop){
                                    self.Animation.onStopScope ? self.Animation.onStop.apply(self.Animation.onStopScope, [self]) : self.Animation.onStop(self);
                                }
                            }
                        }
                        else{
                            self.Draw();
                        }
                    }
                },
                Start:  function(){
                    self.Animation.active = true;
                    self.Animation.lastUpdate = 0;
                },
                Stop:   function(){
                    self.Animation.active = false;
                }
            };

            
            //using canvas
            if(pInstance.Entity.useCanvas){
                this.canvas = this.parent.canvas;
                //Set proper Update, Scale, and Draw Functions
                this.Update = this.UpdateCanvas;
                this.Scale  = this.ScaleCanvas;
                this.Draw   = this.DrawCanvas;
                this.UpdateMatrix = this.UpdateMatrixCanvas;
            }
            //usign div
            else{
                this.container = new CHTMLElement("div");
                this.container.AppendToHTML(this.parent.container.html);
                //this.container.html.style.width = this.parent.width + "px";
                //this.container.html.style.height = this.parent.height + "px";
                
                //Set proper Update and Scale Functions
                this.Update = this.UpdateHTML;
                this.Scale  = this.ScaleHTML;
                this.Draw   = this.DrawHTML;
                this.UpdateMatrix = this.UpdateMatrixHTML;
            }
            
            
            
            pInstance.Graphics.map.put(this.parent.id, this);
            return this;
        }
        CGraphics.prototype.UpdateMatrixHTML = function(){
            this.matrix[0] = this.scale[0] * Math.cos(this.parent.rotation[0]);
            this.matrix[1] = this.scale[1] * Math.sin(this.parent.rotation[0]);
            this.matrix[2] = 0;
            this.matrix[3] = 0;
            this.matrix[4] = this.scale[0] * -1 * Math.sin(this.parent.rotation[0]);
            this.matrix[5] = this.scale[1] * Math.cos(this.parent.rotation[0]);
            this.matrix[6] = 0;
            this.matrix[7] = 0;
            this.matrix[8] = 0;
            this.matrix[9] = 0;
            this.matrix[10] = this.scale[2];
            this.matrix[11] = 0;
            this.matrix[12] = this.parent.position[0] + this.offset[0];
            this.matrix[13] = this.parent.position[1] + this.offset[1];
            this.matrix[14] = this.parent.position[2] + this.offset[2];
            this.matrix[15] = 1;
        }
        CGraphics.prototype.UpdateMatrixCanvas = function(){
                       
            var cos = Math.cos(this.parent.rotation[0]);
            var sin = Math.sin(this.parent.rotation[0]);
            var Sx = this.scale[0];
            var Sy = this.scale[1];
            
            var halfWidth = this.Animation.currentAnimation.sheet.cellWidth / 2;
            var halfHeight = this.Animation.currentAnimation.sheet.cellHeight / 2;
            
            this.matrix[0] =  cos * Sx;
            this.matrix[1] =  sin * Sx;
            this.matrix[2] = -sin * Sy;
            this.matrix[3] =  cos * Sy;
            
            this.matrix[4] = -1 * Sx * cos * halfWidth + Sy * sin * halfHeight + (this.parent.position[0] + halfWidth * Sx);
            this.matrix[5] = -1 * Sx * sin * halfWidth - Sy * cos * halfHeight + (this.parent.position[1] + halfHeight * Sy);

        }
        CGraphics.prototype.DrawHTML = function(){
            this.container.html.style.backgroundPosition = -this.Animation.currentAnimation.frames[this.Animation.currentFrame].x + "px " + -this.Animation.currentAnimation.frames[this.Animation.currentFrame].y + "px";
            this.container.html.style.webkitTransform = "matrix3d(" + this.matrix.join(",") + ")";
        }
        CGraphics.prototype.DrawCanvas = function(){

            this.parent.ctx.save();
            //this.parent.ctx.translate(-1 * (this.parent.position[0] + (((1 - this.scale[0]) * this.Animation.currentAnimation.sheet.cellWidth)/2)|0), -1 * (this.parent.position[1] + (((1 - this.scale[1]) * this.Animation.currentAnimation.sheet.cellHeight)/2)|0));
            //this.parent.ctx.translate(-1 *(this.parent.position[0] + this.offset[0]), -1 *(this.parent.position[1] + this.offset[1]))
            this.parent.ctx.setTransform(this.matrix[0], this.matrix[1], this.matrix[2], this.matrix[3], this.matrix[4], this.matrix[5]);
            
            //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
            this.parent.ctx.drawImage(this.Animation.currentAnimation.sheet.img,
                        this.Animation.currentAnimation.frames[this.Animation.currentFrame].x,
                        this.Animation.currentAnimation.frames[this.Animation.currentFrame].y,
                        this.Animation.currentAnimation.frames[this.Animation.currentFrame].width,
                        this.Animation.currentAnimation.frames[this.Animation.currentFrame].height,
                        0,
                        0,
                        (this.Animation.currentAnimation.frames[this.Animation.currentFrame].width)|0,
                        (this.Animation.currentAnimation.frames[this.Animation.currentFrame].height)|0);
            //this.parent.ctx.fillRect(0,0,
            //                (this.Animation.currentAnimation.frames[this.Animation.currentFrame].width)|0,
            //                (this.Animation.currentAnimation.frames[this.Animation.currentFrame].height)|0);   // Draw a rectangle with default settings
            this.parent.ctx.restore();
        }
        CGraphics.prototype.UpdateHTML = function(dt){
            //If Animating, update frame
            if(this.Animation.active){
                this.Animation.Update(dt);
            }
            this.UpdateMatrix();
        }
        CGraphics.prototype.UpdateCanvas = function(dt){
            //If Animating, update frame
            if(this.Animation.active){
                this.Animation.Update(dt);
            }
            this.UpdateMatrix();
            
        }
        CGraphics.prototype.ScaleCanvas = function(scale){
            this.scale[0] = scale[0];
            this.scale[1] = scale[1];
            this.scale[2] = scale[2];
            
            var width = this.Animation.currentAnimation.sheet.cellWidth;
            var height = this.Animation.currentAnimation.sheet.cellHeight;
            
            this.offset[0] = ((width *  scale[0]) / 2)|0;
            this.offset[1] = ((height * scale[1]) / 2)|0;

        }
        CGraphics.prototype.ScaleHTML = function(scale){
            this.scale[0] = scale[0];
            this.scale[1] = scale[1];
            this.scale[2] = scale[2];
            
            var width = this.Animation.currentAnimation.sheet.cellWidth;
            var height = this.Animation.currentAnimation.sheet.cellHeight;
            
            this.offset[0] = (-(width - (width * scale[0]))/2)|0;
            this.offset[1] = (-(height - (height * scale[1]))/2)|0;

            
            
        
            /*
                Scale: x, y
                //Sprite Div
                -webkit-transform: scale(x, y)
                top  = (Cell Height - (Cell Height * y)) / 2
                left = (Cell Width  - (Cell Width  * x)) / 2
                
                Parent Div:
                Width:  Cell Width  * x
                Height: Cell Height * y
             
            */
        }
        
        //Animation Classes
        var CSpriteSheet = function(sName){
            var self = this;
            this.img = null;
            this.width = 0;
            this.height = 0;
            this.cellWidth = 0;
            this.cellHeight = 0;
            this.rows = 0;
            this.columns = 0;
            this.path = "";
            this.id = 0;
            this.name = sName;
            var className = ""
            this.BuildClass = function(sClassName){
                className = sClassName ? sClassName.replace(/\s/g, "_") : self.name;
                this.img = new Image();
                this.img.src = this.path;
                
                var style = "position: absolute; ";
                style += "overflow: hidden;";
                style += "background: url('"+ window.location.href + this.path + "'); ";
                style += "width: " + this.cellWidth +"px;";
                style += "height: " + this.cellHeight + "px;";
                
                pInstance.Create.CSSClass("."+className, style);
                pInstance.Animation.spritesheets.put(this.name, this);
            }
            this.GetClass = function(){
                return className;
            }
        }
        var CAnimationFrame = function(iX, iY, iWidth, iHeight,iRow, iColumn, oSheet){
            this.x = iX;
            this.y = iY;
            this.width = iWidth;
            this.height = iHeight;
            this.frame = 0;         //Sprite Sheet Frame Number
            this.row = iRow;
            this.column = iColumn;
            this.sheet = oSheet;
        }
        var CAnimation = function(sName, options){
            var self = this;
            this.frames         = [];
            this.name           = sName.replace(/\s/g, "_");
            this.sheet          = "",
            this.numOfFrames    = "";
            this.speed          = 0;
            this.loop           = false;
            
                                        
            if(options){
                this.sheet          = options.spriteSheet;
                this.numOfFrames    = options.numOfFrames;
                this.speed          = options.speed ? options.speed : 0;
                this.loop           = options.loop ? options.loop : false; 
                
                
                //Populate frames array
                var _frame = 0;
                
                //need to have initial starting point, will be reset to 0 afterwards
                var _iStartColumn = options.startColumn;
                
                // runs through rows (y) and columns (x) and adds them to the frames array
                for(var y = options.startRow; y <= this.sheet.rows && _frame < this.numOfFrames; y++){
                    for (var x = _iStartColumn; x <= this.sheet.columns && _frame < this.numOfFrames; x++,_frame++){
                        var fr = new CAnimationFrame((x - 1)*this.sheet.cellWidth,(y - 1)*this.sheet.cellHeight,this.sheet.cellWidth,this.sheet.cellHeight, y, x, this.sheet);
                        fr.frame = _frame;
                        self.frames.push(fr);
                    }
                    // resetting starting column (x) to 0, so it goes through all following columns
                    _iStartColumn = 1;

                }

            }
             
            pInstance.Animation.animations.put(this.name, this);
        }

        //PUBLIC OBJECTS/METHODS
        return{
            Entity: new EntityManager(),
            Graphics: new GraphicsManager(),
            Animation: {
                spritesheets: null,
                animations: null,
                LoadJSON: function(sURL, callback, scope){
                    var xhr = new CXHRObject();
                    
                    xhr.open('GET',sURL,false);
                    
                    xhr.onreadystatechange = function(){
                      if(xhr.readyState==4){ //4==DONE
                            if(xhr.status == 200)
                            {
                                try{
                                    animations = JSON.parse(xhr.responseText);
                                    
                                    for(var i = 0; i < animations.length; i++){
                                        var data = animations[i];
                                        
                                        var ss = new CSpriteSheet(data.name);

                                        ss.width = data.ssWidth;
                                        ss.height = data.ssHeight;
                                        ss.cellWidth = data.cellWidth;
                                        ss.cellHeight = data.cellHeight;
                                        ss.rows = data.rows;
                                        ss.columns = data.columns;
                                        ss.path = data.src;
                                        ss.BuildClass(data.name);
                                        
                                        var options = {
                                            name: "",
                                            numOfFrames: 0,
                                            startRow: 0,
                                            startColumn: 0,
                                            spriteSheet: ss,
                                            speed: 0
                                        }
                                        
                                        for(var j = 0; j < data.animations.length; j++){
                                            var ani = data.animations[j];
                                            
                                            options.name = ani.name;
                                            options.numOfFrames = ani.numberOfFrames;
                                            options.startRow = ani.startRow;
                                            options.startColumn = ani.startColumn;
                                            options.speed = ani.speed;
                                            
                                            
                                            //CreateAnimation(Animation Name, number of frames, startRow, startColumn, SS, speed)
                                            new CAnimation(options.name, options);
                                            //new CAnimation(ani.name, ani.numberOfFrames, ani.startRow, ani.startColumn, ss, ani.speed);
                                        }
                                    }
                                    
                                    if(callback){
                                        scope ? callback.apply(scope, [animations]) : callback(animations);
                                    }

                                    //pInstance.Demo();
                                }
                                catch(e){
                                    console.error("Error parsing Animation Description: " + e);   
                                }
                            }
                            else{
                                console.error("Error loading Animation Description at: " + sURL);
                            }
                      }
                        
                    }.bind(this);
                    
                    xhr.send();
                }
            },
            Get: {
                Sprite: function(sName){
                    return Sprites.get(sName);
                },
                SpriteSheet: function(sName){
                    return SpriteSheets.get(sName)
                },
                Animation: function(sName){
                    return Animations.get(sName);
                },
                Time: function(){
                    return Date.now();
                },
                State: function(sName){
                    return _States.get(sName);  
                },
                Name: function(){
                    return NAME;
                },
                Version: function(){
                    return VERSION;
                },
                Path: function(){
                    return PATH;
                }
            },
            Remove: {
                Sprite: function(sName){
                    return Sprites.drop(sName);
                },
                SpriteSheet: function(sName){
                    return SpriteSheets.drop(sName)
                },
                Animation: function(sName){
                    return Animations.drop(sName);
                }
            },
            
            Create: {
                HTML: function(tag){
                    return new CHTMLElement(tag);
                },
                Map: function(){
                    return new CMap();
                },
                FSM: function(cEntity){
                    return new CFiniteStateMachine(cEntity);
                    
                },
                State: function(sName){
                    var state = new CState(sName);
                    _States.put(sName, state);
                    return state;
                },
                Entity: function(options){
                    //options: width: 0px, height: 0px, position: [0,0]
                    var ent = pInstance.Entity.Create(options);
                    return ent;
                },
                Sprite: function(sName){
                    var sprite = new CSprite(sName);
                    Sprites.put(sName, sprite);
                    
                    return  sprite;
                },
                SpriteSheet: function(sName){
                    var sheet = new CSpriteSheet(sName);
                    SpriteSheets.put(sName, sheet);
                    
                    return sheet;   
                },
                Animation: function(sName,iNumOfFrames,iStartRow, iStartColumn,oSpriteSheet, speed){
                    var ani = new CAnimation(sName,iNumOfFrames,iStartRow, iStartColumn,oSpriteSheet, speed);
                    Animations.put(sName, ani);
                    
                    return ani;
                },
                AnimationFrame: function(iX, iY, iWidth, iHeight){
                    return new CAnimationFrame(iX, iY, iWidth, iHeight);
                },
                CSSClass: function(sClass, sStyle) {
                    if (!document.styleSheets) {
                        return;
                    }
                
                    if (document.getElementsByTagName("head").length == 0) {
                        return;
                    }
                
                    var stylesheet;
                    var mediaType;
                    if (document.styleSheets.length > 0) {
                        for (i = 0; i < document.styleSheets.length; i++) {
                            if (document.styleSheets[i].disabled) {
                                continue;
                            }
                            var media = document.styleSheets[i].media;
                            mediaType = typeof media;
                
                            if (mediaType == "string") {
                                if (media == "" || (media.indexOf("screen") != -1)) {
                                    styleSheet = document.styleSheets[i];
                                }
                            } else if (mediaType == "object") {
                                if (media.mediaText == "" || (media.mediaText.indexOf("screen") != -1)) {
                                    styleSheet = document.styleSheets[i];
                                }
                            }
                
                            if (typeof styleSheet != "undefined") {
                                break;
                            }
                        }
                    }
                
                    if (typeof styleSheet == "undefined") {
                        var styleSheetElement = document.createElement("style");
                        styleSheetElement.type = "text/css";
                
                        document.getElementsByTagName("head")[0].appendChild(styleSheetElement);
                
                        for (i = 0; i < document.styleSheets.length; i++) {
                            if (document.styleSheets[i].disabled) {
                                continue;
                            }
                            styleSheet = document.styleSheets[i];
                        }
                
                        var media = styleSheet.media;
                        mediaType = typeof media;
                    }
                
                    if (mediaType == "string") {
                        for (i = 0; i < styleSheet.rules.length; i++) {
                            if (styleSheet.rules[i].selectorText.toLowerCase() == sClass.toLowerCase()) {
                                styleSheet.rules[i].style.cssText = sStyle;
                                return;
                            }
                        }
                
                        styleSheet.addRule(sClass, sStyle);
                    }
                    else if (mediaType == "object") {
                        for (i = 0; i < styleSheet.cssRules.length; i++) {
                            if (styleSheet.cssRules[i].selectorText.toLowerCase() == sClass.toLowerCase()) {
                                styleSheet.cssRules[i].style.cssText = sStyle;
                                return;
                            }
                        }
                
                        styleSheet.insertRule(sClass + "{" + sStyle + "}", 0);
                    }
                }
                
            },
            Input: {
                currentTime: 0,
                previousTime: 0,
                Get: {
                    State: {
                        Mouse: function(){
                            return _Mouse;
                        },
                        Touch: function(){
                            return _Touch;
                        },
                        Keyboard: function(keyCode){
                            return _KeyboardStates.get(keyCode);
                        }
                    }
                },
                Register: {
                    Mouse: {
                        Event: {
                            Down: function(fFunction, oScope){
                                var e = new CCallback(_eventID++, fFunction, oScope);
                                _MouseEvents.get("DOWN").push(e);
                                return e;
                            },
                            Up: function(fFunction, oScope){
                                var e = new CCallback(_eventID++, fFunction, oScope);
                                _MouseEvents.get("UP").push(e);
                                return e;
                            },
                            Move: function(fFunction, oScope){
                                var e = new CCallback(_eventID++, fFunction, oScope);
                                _MouseEvents.get("MOVE").push(e);
                                return e;
                            }
                        },
                        State: {
                            
                        }
                    },
                    Touch: {
                        Event: {
                            Start: function(fFunction, oScope){
                                var e = new CCallback(_eventID++, fFunction, oScope);
                                _TouchEvents.get("START").push(e);
                                return e;
                            },
                            End: function(fFunction, oScope){
                                var e = new CCallback(_eventID++, fFunction, oScope);
                                _TouchEvents.get("END").push(e);
                                return e;
                            },
                            Move: function(fFunction, oScope){
                                var e = new CCallback(_eventID++, fFunction, oScope);
                                _TouchEvents.get("MOVE").push(e);
                                return e;
                            }
                        },
                        State: {
                            
                        }
                    },
                    Keyboard: {
                        Event: {
                            Keydown: function(Key, fFunction, oScope){
                                var e = new CCallback(_eventID++, fFunction, oScope);
                                var eventArray;
                                
                                if(isNaN(Key)){
                                    eventArray = _KeyboardControlKeyEvents.get(Key);
                                }
                                else{
                                    eventArray = _KeyboardControlKeyEvents.get(Key);
                                }
                                
                                
                                if(!eventArray){
                                    eventArray = [];
                                    if(isNaN(Key)){ _KeyDownEvents.put(Key, eventArray);}
                                    else{_KeyboardControlKeyEvents.put(Key, eventArray);}
                                    
                                }
                                eventArray.push(e);
                                return e;
                            },
                            Keyup: function(Key, fFunction, oScope){
                                var e = new CCallback(_eventID++, fFunction, oScope);
                                var eventArray;
                                
                                if(isNaN(Key)){
                                    eventArray = _KeyboardControlKeyEvents.get(Key);
                                }
                                else{
                                    eventArray = _KeyboardControlKeyEvents.get(Key);
                                }
                                
                                
                                if(!eventArray){
                                    eventArray = [];
                                    if(isNaN(Key)){ _KeyUpEvents.put(Key, eventArray);}
                                    else{_KeyboardControlKeyEvents.put(Key, eventArray);}
                                    
                                }
                                eventArray.push(e);
                                return e;
                                
                            }
                        },
                        State: {
                            
                        }
                    }
                }
            },
            Audio: {
                Add: function(sKey, sPath, bLoop, bAutoplay, sType){       
                    var snd = new CSound(sKey);
                    snd.loop = bLoop;
                    snd.autoplay = bAutoplay;
                    
                    if(sType){
                        snd.type = sType;
                        snd.path = sPath;
                        var source = document.createElement('source');
                        if(sType.toUpperCase() == "MP3"){
                            
                            if (snd.audio.html.canPlayType('audio/mpeg;')) {
                                source.type= 'audio/mpeg';
                                source.src= sPath;
                                snd.audio.html.setAttribute('preload', 'auto');
                                
                                if(bLoop){snd.audio.html.setAttribute('loop', bLoop);}
                                if(bAutoplay){snd.audio.html.setAttribute('autoplay', bAutoplay);}
                                
                                snd.audio.html.appendChild(source);
                                
                                sounds.put(sKey, snd);
                            }
                            else{
                                //os.windows.Create.ErrorWindow(" Audio", "Audio File: " +  sKey + " not loaded <br/>Audio File Type: " + sType + " is not supported by browser")
                            }
                            
                        }
                        else if(sType.toUpperCase == "OGG"){
                            
                            if(snd.audio.html.canPlayType('audio/ogg;')) {
                                source.type= 'audio/ogg';
                                source.src= sPath;
                                snd.audio.html.setAttribute('preload', 'auto');
                                
                                if(loop){snd.audio.html.setAttribute('loop', bLoop);}
                                if(autoplay){snd.audio.html.setAttribute('autoplay', bAutoplay);}
                                
                                snd.audio.html.appendChild(source);
                                
                                sounds.put(sKey, snd);
                            }
                            else{
                                //os.windows.Create.ErrorWindow(" Audio", "Audio File: " +  sKey + " not loaded <br/>Audio File Type: " + sType + " is not supported by browser")
                            }
                        }
                    }
                    else{
                        snd.type = sType;
                        snd.path = sPath;
                        var source = document.createElement('source');
                        
                        if (snd.audio.html.canPlayType('audio/mpeg;')) {
                            source.type= 'audio/mpeg';
                            source.src= sPath + ".mp3";
                            snd.audio.html.setAttribute('preload', 'auto');
                            
                            if(bLoop){snd.audio.html.setAttribute('loop', bLoop);}
                            if(bAutoplay){snd.audio.html.setAttribute('autoplay', bAutoplay);}
                            
                            snd.audio.html.appendChild(source);
                            
                            sounds.put(sKey, snd);
                        }
                        else if(snd.audio.html.canPlayType('audio/ogg;')) {
                            source.type= 'audio/ogg';
                            source.src= sPath + ".ogg";
                            snd.audio.html.setAttribute('preload', 'auto');
                            
                            if(bLoop){snd.audio.html.setAttribute('loop', bLoop);}
                            if(bAutoplay){snd.audio.html.setAttribute('autoplay', bAutoplay);}
                            
                            snd.audio.html.appendChild(source);
                            
                            sounds.put(sKey, snd);
                        }
                        
                    }
                    
                    snd.duration = snd.audio.html.duration;
                    snd.volume = snd.audio.html.volume;
                    
                    return snd;
                    
                },
                Get: {
                    Volume: function(sKey){
                        return sounds.get(sKey).volume;
                    },
                    Sound: function(sKey){
                        return sounds.get(sKey);
                    },
                    Duration: function(sKey){
                        return sounds.get(sKey).audio.html().duration;
                    }
                    
                },
                Set: {
                    Volume: function(sKey, vol){
                        var snd = sounds.get(sKey);
                        snd.audio.html.volume = vol;
                        snd.volume = vol;
                    },
                    CurrentTime: function(sKey, time){
                        var snd = sounds.get(sKey);
                        snd.audio.html.currentTime = time;
                    }
                },
                Play: function(sKey){
                    sounds.get(sKey).audio.html().play();
                },
                Pause: function(sKey){
                    sounds.get(sKey).audio.html().pause();
                }
            },
            Modules:{
                
            },
            Demo: function(){
                //  New Demo
                
                bkgrnd = pInstance.Graphics.LoadImage("images/backgrounds/Level_1.png", function(){
                        pInstance.Entity.canvas.width = 1024; //"1024px";
                        pInstance.Entity.canvas.height = 768; //"768px";
                        pInstance.Entity.ctx.drawImage(bkgrnd.html, 0, 0);
                    });    
                    
                //Initialize Entity Manager, identify if it is a canvas or div enviroment
                    //options: {canvas: html element}
                pInstance.Entity.Initialize({useCanvas: false, canvas: document.getElementById("background"),background: bkgrnd});
                
                //Create an Entity and extend with Graphics object
                dog = pInstance.Entity.Create({width: 100, height: 100, position: [0,0,0], rotation:[0,0,0]});
                dog.AddGraphics();
                
                //Create custom animation from sequence from base animations
                var right_run_turn = psl.Create.Animation("right_run_turn");
                var left_run_turn = psl.Create.Animation("left_run_turn");
                
                var right_run = psl.Animation.animations.get("right_run");
                var left_run  = psl.Animation.animations.get("left_run");
                var right_flip = psl.Animation.animations.get("right_flip");
                var left_flip = psl.Animation.animations.get("left_flip");
                
                var turn_left = psl.Animation.animations.get("turn_left");
                var turn_right = psl.Animation.animations.get("turn_right");
                
                var AddFrames = function(target, source){
                    for(var i = 0; i < source.frames.length; i++){
                        target.frames.push(source.frames[i]);
                    }
                }
                var AddFramesReverse = function(target, source){
                    for(var i = source.frames.length - 1; i >= 0; i--){
                        target.frames.push(source.frames[i]);
                    }
                }
                
                var SetRightRun = function(){
                    dog.graphics.Animation.Set("right_run_turn");
                    //dog.graphics.Animation.onStop = SetRightFlip;
                    dog.graphics.Animation.onStop = SetLeftRun;
                }
                var SetLeftRun = function(){
                    dog.graphics.Animation.Set("left_run_turn");
                    //dog.graphics.Animation.onStop = SetLeftFlip;
                    dog.graphics.Animation.onStop = SetRightRun;
                }
                var SetLeftFlip = function(){
                    dog.graphics.Animation.Set("left_flip");
                    dog.graphics.Animation.onStop = SetRightRun;
                }
                var SetRightFlip = function(){
                    dog.graphics.Animation.Set("right_flip");
                    dog.graphics.Animation.onStop = SetLeftRun;
                }
                
                AddFramesReverse(right_run_turn, turn_right);
                AddFrames(right_run_turn, right_run);
                AddFrames(right_run_turn, right_run);
                AddFrames(right_run_turn, right_run);
                AddFrames(right_run_turn, right_run);
                AddFrames(right_run_turn, right_run);
                AddFrames(right_run_turn, right_run);
                AddFrames(right_run_turn, right_run);
                AddFrames(right_run_turn, right_run);
                right_run_turn.numOfFrames = right_run_turn.frames.length;
                right_run_turn.sheet = right_run.sheet;
                right_run_turn.speed = right_run.speed;
                
                //AddFrames(ani, right_flip);
                AddFrames(left_run_turn, turn_left);
                AddFrames(left_run_turn, left_run);
                AddFrames(left_run_turn, left_run);
                AddFrames(left_run_turn, left_run);
                AddFrames(left_run_turn, left_run);
                AddFrames(left_run_turn, left_run);
                AddFrames(left_run_turn, left_run);
                AddFrames(left_run_turn, left_run);
                AddFrames(left_run_turn, left_run);
                left_run_turn.numOfFrames = left_run_turn.frames.length;
                left_run_turn.sheet = left_run.sheet;
                left_run_turn.speed = left_run.speed;
                

                
                //Add Animation to dog
                dog.graphics.Animation.Add("right_run_turn");
                dog.graphics.Animation.Add("right_flip");
                dog.graphics.Animation.Add("left_run_turn");
                dog.graphics.Animation.Add("left_flip");
                
                SetRightRun();
                //dog.graphics.Scale([0.25,0.25,1]);
                dog.rotation[0] = 45 * Math.PI / 180;
                dog.graphics.Scale([0.5,0.5,0.5]);
                //dog.graphics.Scale([1,1,1]);
                pInstance.Input.Register.Keyboard.Event.Keydown("S", function(){
                    dog.graphics.Animation.list.next();
                    dog.graphics.Animation.Set(dog.graphics.Animation.list.key())
                });
               
                var lastUpdate = pInstance.Get.Time();
                var time,dt;
                
                //Start Game Loop
                (Loop = function(){

                    time = pInstance.Get.Time()
                    dt = time - lastUpdate;

                    lastUpdate = time;
                    pInstance.Graphics.Update(dt);
                    pInstance.Graphics.Draw();    


                    window.requestAnimFrame(Loop);

                })();

            },
            Classes: {
                HTMLElement:  CHTMLElement
            }
                
        }
    }
    return {
        //Instantiates Objects and Returns
        //  Insures a single object
        Instance: function()
        {
            if(!pInstance)
            {
                //Instantiate if pInstance does not exist
                pInstance = constructor();
                pInstance.Animation.spritesheets = pInstance.Create.Map();
                pInstance.Animation.animations = pInstance.Create.Map();
                
                //pInstance.Animation.LoadJSON("images/spritesheets/animations.json");
            }
            
            return pInstance;
        }
    }
})();