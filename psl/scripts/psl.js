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
                contents = [];
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
        //AJAX Object
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
        //  Artificial Intelligence
        //
        var AIManager = {
            FSM: {
                Create: function(oEntity){
                    return new CFiniteStateMachine(oEntity);
                }
            },
            State: {
                Create: function(sName){
                    var state = new CState(sName);
                    _States.put(sName, state);
                    return state;
                }
                
            }
        }
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
        //
        //Holds all states created
        // key: name, value: CState
        var _States = new CMap();
        
        // States for FSM
        var CState = function(sName){
            var _name = sName || "default";
            var self = this;

            this.GetName = function(){
                return _name;
            }

        }
        CState.prototype.Enter = function(cEntity, oMessage){
            //Override this Method
        }
        
        CState.prototype.Exit = function(cEntity, oMessage){
            //Override this Method
        }
        
        CState.prototype.Execute = function(cEntity, oMessage){
            //Override this Method
        }
        
        
        
        //
        //  INPUT
        //
        var InputManager = {
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
            },
            Remove: {
                Mouse: {
                    Event: {
                        Down: function(id){
                            var ev = _MouseEvents.get("DOWN");
                            for(var i = ev.length - 1; i >= 0; i--){
                                if(ev[i].id == iID){
                                    ev.splice(i,1);
                                }
                            }
                        },
                        Up: function(id){
                            var ev = _MouseEvents.get("UP");
                            for(var i = ev.length - 1; i >= 0; i--){
                                if(ev[i].id == iID){
                                    ev.splice(i,1);
                                }
                            }
                        },
                        Move: function(id){
                            var ev = _MouseEvents.get("MOVE");
                            for(var i = ev.length - 1; i >= 0; i--){
                                if(ev[i].id == iID){
                                    ev.splice(i,1);
                                }
                            }
                        }
                    }
                },
                Touch: {
                    Event: {
                        Start: function(){
                            var ev = _TouchEvents.get("START");
                            for(var i = ev.length - 1; i >= 0; i--){
                                if(ev[i].id == iID){
                                    ev.splice(i,1);
                                }
                            }
                        },
                        End: function(iID){
                            var ev = _TouchEvents.get("END");
                            for(var i = ev.length - 1; i >= 0; i--){
                                if(ev[i].id == iID){
                                    ev.splice(i,1);
                                }
                            }
                        },
                        Move: function(){
                            var ev = _TouchEvents.get("MOVE");
                            for(var i = ev.length - 1; i >= 0; i--){
                                if(ev[i].id == iID){
                                    ev.splice(i,1);
                                }
                            }
                        }
                    }
                },
                Keyboard: {
                    Event: {
                        Keydown: function(Key, iID){
                            var ev;
                            
                            if(isNaN(Key)){
                                ev =  _KeyDownEvents.get(Key);
                            }
                            else{
                                ev = _KeyboardControlKeyEvents.get(Key);
                            }
                            
                            for(var i = ev.length - 1; i >= 0; i--){
                                if(ev[i].id == iID){
                                    ev.splice(i,1);
                                }
                            }
                        },
                        Keyup: function(Key, iID){
                            var ev;
                            
                            if(isNaN(Key)){
                                ev =  _KeyUpEvents.get(Key);
                            }
                            else{
                                ev = _KeyboardControlKeyEvents.get(Key);
                            }
                            for(var i = ev.length - 1; i >= 0; i--){
                                if(ev[i].id == iID){
                                    ev.splice(i,1);
                                }
                            }
                        }
                        
                    }
                }
            }
        }
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
        //
        //  EVENT Manager
        //
        var EventManager = {
            q: new CPriorityQueue({low: true}),
            Clear: function(){
                EventManager.q.clear();
            },
            Add: function(tag, delay, input, fn, scope){
                var ev = new CEvent(_nextEventID++, tag, delay, input, fn, scope);
                EventManager.q.push(ev, ev.deliveryTime)
                
            },
            Update: function(dt){
                //While q is not empty and top deliveryTime is >= currentTime
                var currentTime = psl.Get.Time();
                while(EventManager.q.size() &&
                      EventManager.q.top().deliveryTime <= currentTime){
                    (EventManager.q.pop()).Execute();
                }
            }
        }
        var _nextEventID = 0;
        var CEvent = function(id, tag, delay, input, fn, scope){
            this.id = id;
            this.tag = tag;
            this.delay = delay;
            this.input = input;
            this.exe = fn;
            this.scope = scope;
            
            this.deliveryTime = Date.now() + delay;
            
            this.Execute = function(){
                this.scope ? this.exe.apply(this.exe, [this]) : this.exe(this);
            };//.bind(this);
        }
        
        //
        //  AUDIO API
        //
        
        var AudioManager = {
            map: new CMap(),
            //parameters = 
            //    urls: ['sound.mp3', 'sound.ogg', 'sound.wav'],
            //    autoplay: true,
            //    loop: true,
            //    volume: 0.5,
            //    onend: function() {
            //      alert('Finished!');
            //    }
            //
            Load: function(id, parameters){
				var sound = new Audio;
				sound.src = parameters.urls[0];
				sound.loop = parameters.loop;
				sound.volume = parameters.volume;
				sound.addEventListener("error", function(){
					console.log("Error loading sound");
				});
				sound.addEventListener("ended", parameters.onend);
				sound.load();
                AudioManager.map.put(id, sound);
            },
            Play: function(id){
                AudioManager.map.get(id).play();
            },
            Pause: function(id){
                AudioManager.map.get(id).pause();
            },
            Stop: function(id){
				AudioManager.map.get(id).pause();
				AudioManager.map.get(id).currentTime = 0;
            },
            Volume: function(volume){
                for(var i = 0; i < AudioManager.map.size; i++, AudioManager.map.next()){
					AudioManager.map.value().volume = volume;
                }
            }
        }

        //
        //  Memory Manager
        //
        var getLocalStorage = function(){
            try {
                if(window.localStorage) return window.localStorage;
                else return undefined;
            }
            catch(e){
                return undefined;
            }
        }
        var getSessionStorage = function(){
            try {
                if(window.sessionStorage) return window.sessionStorage;
                else return undefined;
            }
            catch(e){
                return undefined;
            }
        }
        var MemoryManager = {
            
            localDB: getLocalStorage(),
            sessionDB: getSessionStorage(),
            Local: {
                Add: function(key, value){
                    var data = {
                        key: key,
                        value: value
                    }
                    MemoryManager.localDB.setItem(key, JSON.stringify(data));
                },
                Update: function(key, value){
                    var data = {
                        key: key,
                        value: value
                    }
                    return MemoryManager.localDB.setItem(key, JSON.stringify(data));
                },
                Get: function(key){
                    try{
                        return (JSON.parse(MemoryManager.localDB.getItem(key))).value;
                    }
                    catch(e){
                        return null;
                    }
                   
                },
                Delete: function(key){
                    return MemoryManager.localDB.removeItem(key);
                },
                Clear: function(){
                    return MemoryManager.localDB.clear();
                }
            },
            Session: {
                Add: function(key, value){
                    var data = {
                        key: key,
                        value: value
                    }
                    MemoryManager.sessionDB.setItem(key, JSON.stringify(data));
                },
                Update: function(key, value){
                    var data = {
                        key: key,
                        value: value
                    }
                    return MemoryManager.sessionDB.setItem(key, JSON.stringify(data));
                },
                Get: function(key){
                    try{
                        return (JSON.parse(MemoryManager.sessionDB.getItem(key))).value;
                    }
                    catch(e){
                        return null;
                    }
                   
                },
                Delete: function(key){
                    return MemoryManager.sessionDB.removeItem(key);
                },
                Clear: function(){
                    return MemoryManager.sessionDB.clear();
                }
            }
        }
        
        
        //
        //  Base Entity
        //
        var _nextEntityID = 0;
        var EntityManager = {
            useCanvas: false,
            canvas: null,
            ctx: null,
            container: null,
            background: null,
            map: new CMap(),
            //options: width: 0px, height: 0px, position: [0,0,0], rotation: [0,0,0]
            Create: function(options){
                
                // Determine options
                var width = options ? options.width || 0 : 0;
                var height = options ? options.height || 0 : 0;
                var position = options ? options.position || [0,0] : [0,0];
                
                    //options: id: int, canvas: html element, width: 0px, height: 0px, position: [0,0]
                var ent = new CEntity({id: _nextEntityID++, canvas: EntityManager.canvas, width: width, height: height, position: position });
                
                //Place in Map
                EntityManager.map.put(ent.id, ent);
                
                //Return Entity
                return ent;
                
            },
            Initialize: function(options){//options: {useCanvas: true, canvas: html element, background: img}
                EntityManager.useCanvas = options.useCanvas;
                EntityManager.canvas = options.canvas;
                EntityManager.canvas.className = "background";
                EntityManager.ctx = this.canvas.getContext('2d');
                EntityManager.background = options.background || null;
                
                CEntity.prototype.canvas = EntityManager.canvas;
                CEntity.prototype.ctx = EntityManager.canvas.getContext("2d");
                
                if(!options.useCanvas){
                    EntityManager.container = new CHTMLElement("div");
                    EntityManager.container.AppendClass("EntityManager");
                    EntityManager.container.AppendToHTML(document.body);
                }
            }
            
        }
        
        
        //options:  id: int, canvas: html element, width: 0px, height: 0px, position: [0,0,0], rotation: [0,0,0]
        var CEntity = function(options){
            this.id = options.id;
            this.width = options.width || 100;
            this.height = options.height || 100;
            this.position = options.position || [0,0,0];
            this.rotation = options.rotation || [0,0,0];
            
            
            //Not using canvas, create a Div
            if(!EntityManager.useCanvas){
                this.container = new CHTMLElement("div");
                this.container.html.id = options.id;
                this.container.AppendClass("Entity");
                this.container.AppendToHTML(EntityManager.container.html);

            }

            EntityManager.map.put(this.id, this);
        }
        CEntity.prototype.canvas = null;
        CEntity.prototype.ctx = null;
        CEntity.prototype.AddGraphics = function(){
            GraphicsManager.Extend(this);
        }
        CEntity.prototype.AddPhysics = function(){
            PhysicsManager.Extend(this);
        }
        CEntity.prototype.AddText = function(options){
            FontManager.Extend(this, options);
        }
        CEntity.prototype.Update = function(dt){
            if(this.graphics){this.graphics.Update(dt)}
        }
        
        
        
        //
        //  Physcis
        //
        var generatePhysicsWorld = function(){
                var worldAABB = new b2AABB();
                worldAABB.minVertex.Set(-63, -832);
                worldAABB.maxVertex.Set(1088, 832);
                var gravity = new b2Vec2(0, 350);
                var doSleep = true;
                var world = new b2World(worldAABB, gravity, doSleep);
                return world;
            }
        var PhysicsManager = {
            world: generatePhysicsWorld(),
            map: new CMap(),
            Extend: function(oEntity){
                oEntity.physics = new CPhysics(oEntity);
                PhysicsManager.map.put(oEntity.id, oEntity.physics);
            },
            Update: function(dt){
                var timeStep = 1.0/60;
                var iterations = 5;
                
                PhysicsManager.world.Step(dt/1000, iterations);
                
                for(var i = 0; i < PhysicsManager.map.size; i++, PhysicsManager.map.next()){
                    if(PhysicsManager.map.value().body){
                        PhysicsManager.map.value().Update(dt);
                    }
                    
                }
            },
            Draw: function(){
                function drawWorld(world, context) {
                    for (var j = world.m_jointList; j; j = j.m_next) {
                        drawJoint(j, context);
                    }
                    for (var b = world.m_bodyList; b; b = b.m_next) {
                        for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
                            drawShape(s, context);
                        }
                    }
                }
                function drawJoint(joint, context) {
                    var b1 = joint.m_body1;
                    var b2 = joint.m_body2;
                    var x1 = b1.m_position;
                    var x2 = b2.m_position;
                    var p1 = joint.GetAnchor1();
                    var p2 = joint.GetAnchor2();
                    context.strokeStyle = '#00eeee';
                    context.beginPath();
                    switch (joint.m_type) {
                    case b2Joint.e_distanceJoint:
                        context.moveTo(p1.x, p1.y);
                        context.lineTo(p2.x, p2.y);
                        break;
                 
                    case b2Joint.e_pulleyJoint:
                        // TODO
                        break;
                 
                    default:
                        if (b1 == world.m_groundBody) {
                            context.moveTo(p1.x, p1.y);
                            context.lineTo(x2.x, x2.y);
                        }
                        else if (b2 == world.m_groundBody) {
                            context.moveTo(p1.x, p1.y);
                            context.lineTo(x1.x, x1.y);
                        }
                        else {
                            context.moveTo(x1.x, x1.y);
                            context.lineTo(p1.x, p1.y);
                            context.lineTo(x2.x, x2.y);
                            context.lineTo(p2.x, p2.y);
                        }
                        break;
                    }
                    context.stroke();
                }
                function drawShape(shape, context) {
                    context.strokeStyle = '#000000';
                    context.fillStyle = '#333333';
                    
                    switch (shape.m_type) {
                    case b2Shape.e_circleShape:
                        {
                            var circle = shape;
                            var pos = circle.m_position;
                            var r = circle.m_radius;
                            var segments = 16.0;
                            var theta = 0.0;
                            var dtheta = 2.0 * Math.PI / segments;
                            // draw circle
                            context.moveTo(pos.x + r, pos.y);
                            for (var i = 0; i < segments; i++) {
                                var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
                                var v = b2Math.AddVV(pos, d);
                                context.lineTo(v.x, v.y);
                                theta += dtheta;
                            }
                            context.lineTo(pos.x + r, pos.y);
                            
                            // draw radius
                            context.moveTo(pos.x, pos.y);
                            var ax = circle.m_R.col1;
                            var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
                            context.lineTo(pos2.x, pos2.y);
                            context.stroke();
                            context.fill();
                        }
                        break;
                    case b2Shape.e_polyShape:
                        {
                            context.beginPath();
                            var poly = shape;
                            var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
                            context.moveTo(tV.x, tV.y);
                            for (var i = 0; i < poly.m_vertexCount; i++) {
                                var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
                                context.lineTo(v.x, v.y);
                            }
                            context.lineTo(tV.x, tV.y);
                            context.stroke();
                            context.fill();
                        }
                        break;
                    }
                    
                }
                
                drawWorld(this.world, EntityManager.ctx);
            }
        }
        var generatePhysicsWorld = function(){
                var worldAABB = new b2AABB();
                worldAABB.minVertex.Set(-2000, -2000);
                worldAABB.maxVertex.Set(2000, 2000);
                var gravity = new b2Vec2(0, 350);
                var doSleep = true;
                var world = new b2World(worldAABB, gravity, doSleep);
                return world;
            }
        var PhysicsManager = {
            world: generatePhysicsWorld(),
            map: new CMap(),
            Extend: function(oEntity){
                oEntity.physics = new CPhysics(oEntity);
                PhysicsManager.map.put(oEntity.id, oEntity.physics);
            },
            Update: function(dt){
                var timeStep = 1.0/60;
                var iterations = 5;
                
                PhysicsManager.world.Step(timeStep, iterations);
                
                for(var i = 0; i < PhysicsManager.map.size; i++, PhysicsManager.map.next()){
                    if(PhysicsManager.map.value().body){
                        PhysicsManager.map.value().Update(dt);
                    }
                    
                }
            },
            Draw: function(){
                function drawWorld(world, context) {
                    for (var j = world.m_jointList; j; j = j.m_next) {
                        drawJoint(j, context);
                    }
                    for (var b = world.m_bodyList; b; b = b.m_next) {
                        for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
                            drawShape(s, context);
                        }
                    }
                }
                function drawJoint(joint, context) {
                    var b1 = joint.m_body1;
                    var b2 = joint.m_body2;
                    var x1 = b1.m_position;
                    var x2 = b2.m_position;
                    var p1 = joint.GetAnchor1();
                    var p2 = joint.GetAnchor2();
                    context.strokeStyle = '#00eeee';
                    context.beginPath();
                    switch (joint.m_type) {
                    case b2Joint.e_distanceJoint:
                        context.moveTo(p1.x, p1.y);
                        context.lineTo(p2.x, p2.y);
                        break;
                 
                    case b2Joint.e_pulleyJoint:
                        // TODO
                        break;
                 
                    default:
                        if (b1 == world.m_groundBody) {
                            context.moveTo(p1.x, p1.y);
                            context.lineTo(x2.x, x2.y);
                        }
                        else if (b2 == world.m_groundBody) {
                            context.moveTo(p1.x, p1.y);
                            context.lineTo(x1.x, x1.y);
                        }
                        else {
                            context.moveTo(x1.x, x1.y);
                            context.lineTo(p1.x, p1.y);
                            context.lineTo(x2.x, x2.y);
                            context.lineTo(p2.x, p2.y);
                        }
                        break;
                    }
                    context.stroke();
                }
                function drawShape(shape, context) {
                    context.strokeStyle = '#000000';
                    context.fillStyle = '#333333';
                    
                    switch (shape.m_type) {
                    case b2Shape.e_circleShape:
                        {
                            var circle = shape;
                            var pos = circle.m_position;
                            var r = circle.m_radius;
                            var segments = 16.0;
                            var theta = 0.0;
                            var dtheta = 2.0 * Math.PI / segments;
                            // draw circle
                            context.moveTo(pos.x + r, pos.y);
                            for (var i = 0; i < segments; i++) {
                                var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
                                var v = b2Math.AddVV(pos, d);
                                context.lineTo(v.x, v.y);
                                theta += dtheta;
                            }
                            context.lineTo(pos.x + r, pos.y);
                            
                            // draw radius
                            context.moveTo(pos.x, pos.y);
                            var ax = circle.m_R.col1;
                            var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
                            context.lineTo(pos2.x, pos2.y);
                            context.stroke();
                            context.fill();
                        }
                        break;
                    case b2Shape.e_polyShape:
                        {
                            context.beginPath();
                            var poly = shape;
                            var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
                            context.moveTo(tV.x, tV.y);
                            for (var i = 0; i < poly.m_vertexCount; i++) {
                                var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
                                context.lineTo(v.x, v.y);
                            }
                            context.lineTo(tV.x, tV.y);
                            context.stroke();
                            context.fill();
                        }
                        break;
                    }
                    
                }
                
                drawWorld(this.world, EntityManager.ctx);
            }
        }
        
        
        var CPhysics = function(oEntity){
            var self = this;
            this.shape = null;
            this.body = null;
            this.type = "";
            this.parent = oEntity;
            this.canvas = null;
            this.container = null;
            this.world = PhysicsManager.world;
            this.onCollision = null;
            this.fixed = false;
            this.paused = false;
            this._linearVelocity = null;
            this._angularVelocity = null;
            
            return this;
        }
        CPhysics.prototype.circleDef = new b2CircleDef();
        CPhysics.prototype.boxDef = new b2BoxDef();
        CPhysics.prototype.bodyDef = new b2BodyDef();
        CPhysics.prototype.MakeCircle = function(radius){
            this.circleDef.density = 1.0;
            this.circleDef.radius = radius;
            this.radius = radius;
            this.circleDef.restitution = 0.7;
            this.circleDef.friction = 0.5;
            this.circleDef.userData = this;
            
            this.bodyDef.shapes = [];
            this.bodyDef.AddShape(this.circleDef);
            this.bodyDef.position.Set(this.parent.position[0],this.parent.position[1]);
            this.bodyDef.userData = this;
            
            this.body = this.world.CreateBody(this.bodyDef);
            this.shape = this.body.GetShapeList();
            this.type = "circle";
        }
        CPhysics.prototype.MakeBox = function(halfWidth, halfHeight, fixed){
            
            if (typeof(fixed) == 'undefined')
                fixed = false;
            if (!fixed){
                this.boxDef.density = 1.0;
            }
            else{
                this.boxDef.density = null;
            }
            this.fixed = fixed ? true : false;
            
            this.boxDef.extents.Set(halfWidth, halfHeight);
            this.halfExtents = [halfWidth, halfHeight];
            this.boxDef.userData = this;
            
            this.bodyDef.shapes = [];
            this.bodyDef.AddShape(this.boxDef);
            this.bodyDef.position.Set(this.parent.position[0],this.parent.position[1]);
            this.bodyDef.userData = this;
            
            this.body = this.world.CreateBody(this.bodyDef);
            this.shape = this.body.GetShapeList();
            this.type = "box";
        }
        CPhysics.prototype.Update = function(dt){
            // Set the position and rotation of the graphics object to be
            //  equal to the phyiscs object
            if (this.body != null) {
                var tempPos = this.body.GetCenterPosition();
                this.parent.position[0] = tempPos.x;
                this.parent.position[1] = tempPos.y;
                
                var tempRot = this.body.GetRotation();
                this.parent.rotation[0] = tempRot;
                
                if(this.onCollision && this.Contacted()){
                    this.onCollision(this.GetContactList());
                }
            }
        }
        
        CPhysics.prototype.GetPosition = function(){
            var tempPos = this.body.GetCenterPosition();
            return [tempPos.x, tempPos.y];
        }
        CPhysics.prototype.GetOriginPosition = function(){
            var tempPos = this.body.GetOriginPosition();
            return [tempPos.x, tempPos.y];
        }
        CPhysics.prototype.GetRotation = function(){
            return this.body.GetRotation();
        }
        CPhysics.prototype.GetLinearVelocity = function(){
            var tempVel = this.body.GetLinearVelocity();
            return [tempVel.x, tempVel.y];
        }
        CPhysics.prototype.GetAngularVelocity = function(){
            return this.body.GetAngularVelocity();
        }
        
        CPhysics.prototype.SetPosition = function(position){
            this.parent.position[0] = position[0];
            this.parent.position[1] = position[1];
            if (this.body != null) {
                var tempPos = new b2Vec2(position[0], position[1]);
                this.body.WakeUp();
                this.body.SetCenterPosition(tempPos, this.body.GetRotation());
            }
        }
        CPhysics.prototype.SetOriginPosition = function(position){
            if (this.body != null) {
                var tempPos = new b2Vec2(position[0], postion[1]);
                this.body.WakeUp();
                this.body.SetOriginPosition(tempPos, this.body.GetRotation());
            }
        }
        CPhysics.prototype.SetRotation = function(rotation){
            this.parent.rotation[0] = rotation;
            if (this.body != null) {
                this.body.WakeUp();
                this.body.m_rotation = rotation;//SetCenterPosition(this.body.GetCenterPosition, rotation);
            }
        }
        CPhysics.prototype.SetLinearVelocity = function(velocity){
            this._linearVelocity = velocity;
            if (this.body != null) {
                var tempVel = new b2Vec2(velocity[0], velocity[1]);
                this.body.WakeUp();
                this.body.SetLinearVelocity(tempVel);
            }
        }
        CPhysics.prototype.SetAngularVelocity = function(velocity){
            this._angularVelocity = velocity;
            if (this.body != null) {
                this.body.WakeUp();
                this.body.SetAngularVelocity(velocity);
            }
        }
        
        CPhysics.prototype.AddForce = function(force, worldPoint){
            // force multiplier so that there is an actual change when trying to add a force of [0,10] to go up 
            var multiplier = 1000000;
            if (typeof(force) != 'object' || force.length < 2) {
                force = [0,0];
            }
            if (typeof(worldPoint) != 'object' || worldPoint.length < 2) {
                worldPoint = [this.body.GetCenterPosition().x, this.body.GetCenterPosition().y];
            }
            var _force = new b2Vec2(force[0] * multiplier, force[1] * multiplier);
            var _point = new b2Vec2(worldPoint[0], worldPoint[1]);
            
            this.body.WakeUp();
            this.body.ApplyForce(_force, _point);
        }
        CPhysics.prototype.AddTorque = function(torque){
            // torque multiplier so there is an actual change when trying to add a torque of 10
            var multiplier = 10000000;
            this.body.WakeUp();
            this.body.ApplyTorque(torque * multiplier);
        }
        
        CPhysics.prototype.GetRadius = function(){
            return this.radius;
        }
        CPhysics.prototype.GetHalfExtents = function(){
            return this.halfExtents;
        }
        CPhysics.prototype.GetMass = function(){
            return this.body.GetMass();
        }
        
        CPhysics.prototype.GetContactList = function(){
            var contacts = [];
            var contactNode = this.body.GetContactList();
            
            for(var i = 0; i < this.GetNumContacts(); i++){
                contacts[i] = contactNode.other.GetUserData().parent;
                contactNode = contactNode.next;
            }
            return contacts;
        }
        CPhysics.prototype.GetNumContacts = function(){
            var num = 0;
            var nodeStart = this.body.GetContactList();
            if (nodeStart != null) {
                num++;
            }
            else{
                return num;
            }
            for(var node = nodeStart; node.next != null; node = node.next){
                num++;
            }
            return num;
        }
        CPhysics.prototype.Contacted = function(){
            if (this.body.GetContactList() != null) {
                return true;
            }
            else{
                return false;
            }
        }
        
        CPhysics.prototype.Freeze = function(){
            // This will remove the object from collision detection forever
            // Seemingly no way to get it back other than to recreate the object
            //this.body.Freeze();
        }
        CPhysics.prototype.Pause = function(){
            if(!this.paused){
                this.paused = true;
                
                this._linearVelocity = this.GetLinearVelocity();
                this._angularVelocity = this.GetAngularVelocity();
                
                this.world.DestroyBody(this.body);
                this.body = null;
                this.shape = null;
            }
            
        }
        CPhysics.prototype.UnPause = function(){
            if(this.paused){
                this.paused = false;
                
                if (this.type == "circle") {
                    this.MakeCircle(this.radius);
                }
                else if (this.type == "box") {
                    this.MakeBox(this.halfExtents[0], this.halfExtents[1], this.fixed);
                }
                
                this.SetRotation(this.parent.rotation[0]);
                this.SetLinearVelocity(this._linearVelocity);
                this.SetAngularVelocity(this._angularVelocity);
            }
            
        }
        CPhysics.prototype.IsPaused = function(){
            return this.paused;
        }
        CPhysics.prototype.IsFrozen = function(){
            return this.body.IsFrozen();
        }
        CPhysics.prototype.IsSleeping = function(){
            return this.body.IsSleeping();
        }
        CPhysics.prototype.AllowSleeping = function(allowSleep){
            this.body.AllowSleeping(allowSleep);
        }
        CPhysics.prototype.WakeUp = function(){
            this.body.WakeUp();
        }

        
        //
        //  Graphics 
        //
        var GraphicsManager = {
            map: new CMap(),
            spritesheets: new CMap(),
            aniamtions: new CMap(),
            images: new CMap(),
            LoadImage: function(sURL,callback){
                var img = new CHTMLElement("img");
                
                img.html.src = sURL;
                img.html.onload = callback;
                GraphicsManager.images.put(sURL, img);
                
                return img;
                
            },
            Create: {
                SpriteSheet: function(sName){
                    var sheet = new CSpriteSheet(sName);
                    AnimationManager.spritesheets.put(sName, sheet);
                    return sheet; 
                },
                Animation: function(sName, options){
                    var ani = new CAnimation(sName, options);//iNumOfFrames,iStartRow, iStartColumn,oSpriteSheet, speed);
                    AnimationManager.animations.put(sName, ani);
                    
                    return ani;
                }
            },
            Extend: function(oEntity){
                oEntity.graphics = new CGraphics(oEntity);
                GraphicsManager.map.put(oEntity.id, oEntity.graphics);
            },
            Update: function(dt){
                for(var i = 0; i < GraphicsManager.map.size; i++, GraphicsManager.map.next()){
                    if(GraphicsManager.map.value().Animation.currentAnimation)
                        GraphicsManager.map.value().Update(dt);
                }
            },
            Draw: function(){
                EntityManager.ctx.drawImage(EntityManager.background.html, 0, 0);
                
                if(EntityManager.useCanvas){
                    for(var i = 0; i < GraphicsManager.map.size; i++, GraphicsManager.map.next()){
                        var ent = GraphicsManager.map.value();
                        if(ent.Animation.currentAnimation && ent.enabled)
                            ent.Draw();
                    }
                    
                }
            },
            DrawBackground: function(){
                EntityManager.ctx.drawImage(EntityManager.background.html, 0, 0);
            }
        }

        var CGraphics = function(oEntity){
            var self = this;
            this.enabled = true;
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
                    var ani = AnimationManager.animations.get(sName);
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
                                self.Animation.currentFrame = 0;
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
            if(EntityManager.useCanvas){
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
            
            
            
            GraphicsManager.map.put(this.parent.id, this);
            return this;
        }
        CGraphics.prototype.Disable = function(){
            this.enabled = false;
        }
        CGraphics.prototype.Enable = function(){
            this.enabled = true;
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
            
            //this.matrix[4] = -1 * Sx * cos * this.parent.positionhalfWidth + Sy * sin * halfHeight + (this.parent.position[0] + halfWidth);
            //this.matrix[5] = -1 * Sx * sin * halfWidth - Sy * cos * halfHeight + (this.parent.position[1] + halfHeight);
            
            //this.matrix[4] = Sx * cos * (this.parent.position[0] + halfWidth) - Sx * sin * (this.parent.position[1] + halfHeight) - halfWidth;
            //this.matrix[5] = Sy * sin * (this.parent.position[0] + halfWidth) + Sy * cos * (this.parent.position[1] + halfHeight) - halfHeight;
            
            this.matrix[4] = -1 * Sx * cos * halfWidth + Sy * sin * halfHeight + (this.parent.position[0] );
            this.matrix[5] = -1 * Sx * sin * halfWidth - Sy * cos * halfHeight + (this.parent.position[1] );
            
            //this.matrix[4] = -1 * Sx * cos * halfWidth + Sy * sin * halfHeight + (this.parent.position[0] + halfWidth * Sx);
            //this.matrix[5] = -1 * Sx * sin * halfWidth - Sy * cos * halfHeight + (this.parent.position[1] + halfHeight * Sy);

        }
        CGraphics.prototype.DrawHTML = function(){
            this.container.html.style.backgroundPosition = -this.Animation.currentAnimation.frames[this.Animation.currentFrame].x + "px " + -this.Animation.currentAnimation.frames[this.Animation.currentFrame].y + "px";
            this.container.html.style.webkitTransform = "matrix3d(" + this.matrix.join(",") + ")";
        }
        CGraphics.prototype.DrawCanvas = function(){
            if(this.enabled){
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
            
            //if(this.Animation.currentAnimation){
                var width = this.Animation.currentAnimation.sheet.cellWidth;
                var height = this.Animation.currentAnimation.sheet.cellHeight;
                
                this.offset[0] = ((width *  scale[0]) / 2)|0;
                this.offset[1] = ((height * scale[1]) / 2)|0;
            //}
            

        }
        CGraphics.prototype.ScaleHTML = function(scale){
            this.scale[0] = scale[0];
            this.scale[1] = scale[1];
            this.scale[2] = scale[2];
            
            var width = this.Animation.currentAnimation.sheet.cellWidth;
            var height = this.Animation.currentAnimation.sheet.cellHeight;
            
            this.offset[0] = (-(width - (width * scale[0]))/2)|0;
            this.offset[1] = (-(height - (height * scale[1]))/2)|0;

            //this.offset[0] = 0;
            //this.offset[1] = 0;
            
        
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
        
        
        //
        //  Animation Classes
        //
        
        //Manager
        var AnimationManager = {
            spritesheets: new CMap(),
            animations: new CMap(),
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
            },
            AddFrames: function(target, source){
                for(var i = 0; i < source.frames.length; i++){
                    target.frames.push(source.frames[i]);
                }
            },
            AddFramesReverse: function(target, source){
                for(var i = source.frames.length - 1; i >= 0; i--){
                    target.frames.push(source.frames[i]);
                }
            },
            ReverseFrames: function(source){
                //Create temp array to hold frames
                var temp = [];
                
                //Store source frames in temp array, in reverse order
                for(var i = source.frames.length - 1; i >= 0; i--){
                    temp.push(source.frames[i]);
                }
                
                //Clear out source frames array
                source.frames = [];
                
                //Push frames back to source via temp (in reverse order)
                for(var i = 0; i < temp.length; i++){
                    source.frames.push(temp[i]);
                }
            }
        }
        
        
        //  Animation Objects
        //
        var CreateCSSClass = function(sClass, sStyle) {
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
                
                CreateCSSClass("."+className, style);
                AnimationManager.spritesheets.put(this.name, this);
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
             
            AnimationManager.animations.put(this.name, this);
        }
        
        
        //
        //  Font Manager
        //
        var FontManager = {
            map: new CMap(),
            Extend: function(oEntity, options){
                oEntity.font = new CFont(oEntity, options);
                FontManager.map.put(oEntity.id, oEntity.font);
            },
            Draw: function(){
                for(var i = 0; i < FontManager.map.size; i++, FontManager.map.next()){
                    FontManager.map.value().Draw();
                }
            },
            Write: function(sText, x, y, font){
                //options: width: 0px, height: 0px, position: [0,0,0], rotation: [0,0,0]
                var ent = EntityManager.Create({position:[x,y,0]});
                ent.AddText(font);
                ent.font.text = sText || font.text || "No Text";
                return ent.font;
            },
            Remove: function(id){
                FontManager.map.remove(id);
            }
        }
        
        
        var CFont = function(oEntity, options){
            var self = this;
            this.canvas         = EntityManager.canvas;
            this.context        = EntityManager.ctx;
            this.parent         = oEntity;
            this.enabled        = true;
            
            this.text           = options.text || "Hello World!";
            this.fontStyle      = options.fontStyle || "normal";
            this.fontVariant    = options.fontVariant || "normal";
            this.fontWeight     = options.fontWeight || "normal";
            this.fontFamily     = options.fontFamily || "Courier";
            this.size           = options.size || "24px";
            this.alignment      = options.alignment || "start";
            this.baseline       = options.baseline || "alphabetic";
            this.fontColor      = options.fontColor || "#000000";
            this.strokeColor    = options.strokeColor || "#000000";
            this.drawFill       = options.drawFill || true;
            this.drawStroke     = options.drawStroke || false;
            this.offset         = options.offset || [0,0,0];
            
            return this;
        }
        CFont.prototype.SetText = function(text){
            this.text = text;
        }
        CFont.prototype.SetFontStyle = function(fontStyle){
            this.fontStyle = fontStyle;
        }
        CFont.prototype.SetFontVariant = function(fontVariant){
            this.fontVariant = fontVariant;
        }
        CFont.prototype.SetFontWeight = function(fontWeight){
            this.fontWeight = fontWeight;
        }
        CFont.prototype.SetFontFamily = function(fontFamily){
            this.fontFamily = fontFamily;
        }
        CFont.prototype.SetSize = function(size){
            this.size = size;
        }
        CFont.prototype.SetAlignment = function(alignment){
            this.alignment = alignment;
        }
        CFont.prototype.SetBaseline = function(baseline){
            this.baseline = baseline;
        }
        CFont.prototype.SetColor = function(color){
            this.fontColor = color;
        }
        CFont.prototype.SetStrokeColor = function(color){
            this.strokeColor = color;
        }
        CFont.prototype.SetFillVisible = function(visible){
            this.drawFill = visible;
        }
        CFont.prototype.SetStrokeVisible = function(visible){
            this.drawStroke = visible;
        }
        CFont.prototype.SetOffset = function(offset){
            this.offset = offset;
        }
        CFont.prototype.Draw = function(){
            if(this.enabled){
                //this.context.font = this.fontStyle + " " + this.fontVariant + " " + this.fontWeight + " " + this.size + " " + this.fontFamily;
                this.context.font = this.size + " " + this.fontFamily;
                this.context.textAlign = this.alignment;
                this.context.textBaseline = this.baseline;
                if (this.drawFill) {
                    this.context.fillStyle = this.fontColor;
                    this.context.fillText(this.text, this.parent.position[0] + this.offset[0], this.parent.position[1] + this.offset[1]);
                }
                if (this.drawStroke) {
                    this.context.strokeStyle = this.strokeColor;
                    this.context.strokeText(this.text, this.parent.position[0] + this.offset[0], this.parent.position[1] + this.offset[1]);
                }
            }
        }
        CFont.prototype.Delete = function(){
            FontManager.Remove(this.parent.id);
            this.parent.font = null;
        }
        //
        //  TWEEN
        //
        var _nextTweenID = 0;
        var TweenManager = {
            map: new CMap(),
            Remove: function(id){
                TweenManager.map.remove(id)
            },
            Update: function(dt){
                for(var i = TweenManager.map.size; i>0; i--){
                        //Update return active, if false, remove item from map
                    if(!TweenManager.map.value().Update(dt)){
                        //Removed object, decrement i since size is smaller
                        TweenManager.Remove(TweenManager.map.value().id);
                        i--;
                        //Only increment map if size is still > 0
                        if(i > 0 ){TweenManager.map.next()}
                    }
                    else{
                        TweenManager.map.next();
                    }
                    
                }
            },
            Create: function(start, stop, time, fn, onEnd){
                tw = new CTween(_nextTweenID++, start, stop, time, fn, onEnd);
                TweenManager.map.put(tw.id, tw);
                return tw;
            }
        }

        var CTween = function(id, start, stop, time, fn, onEnd){
            this.id = id;
            this.active = true;
            this.fn = fn;
            this.start = start;
            this.stop = stop;
            this.totalTime = time;
            this.velocity = (stop - start) / time;
            //this.totalSteps = ((start - stop) / step)|0;
            this.count = 0;
            this.timeElapsed = 0;
            this.value = start;
            this.callback = onEnd || function(){}
            
        }
        CTween.prototype.Update = function(dt){
            
            this.timeElapsed += dt;
            this.value = this.start + this.velocity * this.timeElapsed;
            
            if(this.timeElapsed >= this.totalTime){
                this.value = this.stop;
                this.active = false;
                this.fn(this.value);
                this.callback(this);
            }
            else{
                this.fn(this.value);
                
            }
            
            return this.active;
            
        }
        CTween.prototype.Draw = function(){
            
    }
        //PUBLIC OBJECTS/METHODS
        return{
            Entity: EntityManager,
            Graphics: GraphicsManager,
            Animation: AnimationManager,
            Physics: PhysicsManager,
            AI: AIManager,
            Audio: AudioManager,
            Font: FontManager,
            Memory: MemoryManager,
            Tween: TweenManager,
            Event: EventManager,
            Input: InputManager,
            Get: {
                SpriteSheet: function(sName){
                    return pInstance.Graphics.spritesheets.get(sName)
                },
                Animation: function(sName){
                    return pInstance.Graphics.animations.get(sName);
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
                SpriteSheet: function(sName){
                    return pInstance.Graphics.spritesheets.remove(sName)
                },
                Animation: function(sName){
                    return pInstance.Graphics.animations.remove(sName);
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
                SpriteSheet: function(sName){
                    var sheet = new CSpriteSheet(sName);
                    AnimationManager.spritesheets.put(sName, sheet);
                    
                    return sheet;   
                },
                Animation: function(sName,options){//iNumOfFrames,iStartRow, iStartColumn,oSpriteSheet, speed){
                    var ani = new CAnimation(sName, options);//iNumOfFrames,iStartRow, iStartColumn,oSpriteSheet, speed);
                    AnimationManager.animations.put(sName, ani);
                    
                    return ani;
                },
                CSSClass: CreateCSSClass
            },
            Classes: {
                HTMLElement:  CHTMLElement,
                PriorityQueue: CPriorityQueue,
                Map: CMap
            }
                
        }
    }
    
    return {
        //Instantiates Objects and Returns
        //  Insures a single object
        Instance: function(){
            
            if(!pInstance)
            {
                //Instantiate if pInstance does not exist
                pInstance = constructor();
                
                //AnimationManager.LoadJSON("images/spritesheets/animations.json");
            }
            
            return pInstance;
        }
    }
})();