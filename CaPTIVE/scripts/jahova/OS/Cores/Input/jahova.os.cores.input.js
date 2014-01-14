com.jahova.os.Instance().Cores.Instance().Input = (function()
{
    var pInstance;

    function constructor()
    {
        //PRIVATE ATTRIBUTES
        var NAME = "JaHOVA OS Internal API : Input Core";
        var VERSION = "0v5";
        var PATH = "scripts/jahova/OS/Cores/Audio/jahova.os.cores.audio.js";
        var ID = null;
        
        var os = com.jahova.os.Instance();
        var utilities = com.jahova.utilities.Instance();
        
       
        /*
         **/
        //PRIVATE METHODS
        
        
        //Private Classes
        var _eventID = 0;
        var CGamepad = function(rawGamepad){
            //ADD ARRAY THAT HOLDS INDICIES OF RAW GAMEPAD ARRAY
            //  USE THIS ARRAY TO PULL PROPER INDEX, THEREBY ALLOWING THE
            //  ARRAY TO BE MODIFIED AND CUSTOMIZE BUTTON SCHEMES
            var raw = rawGamepad; /*{
                buttons: [],
                axes: [],
                timestamep: rawGamepad.timestamp
            };
            raw.buttons = rawGamepad.buttons.slice(0,rawGamepad.buttons.length);
            raw.axes = rawGamepad.axes.slice(0,rawGamepad.axes.length);
            */
            this.debugRaw = raw;
            this.id = rawGamepad.index;
            var self = this;
            this.indicies ={
                Dpad: {
                    up: 12,
                    down: 13,
                    left: 14,
                    right: 15
                },
                LeftShoulder: {
                    top: 4,
                    bottom: 6
                },
                RightShoulder: {
                    top: 5,
                    bottom: 7
                },
                Buttons: {
                    top: 3,
                    bottom: 0,
                    left: 2,
                    right: 1
                },
                LeftStick: {
                    x: 0,
                    y: 1,
                    button: 10
                },
                RightStick: {
                    x: 2,
                    y: 3,
                    button: 11
                },
                select: 8,
                start: 9
            }
            this.type = ((rawGamepad.id).toUpperCase()).indexOf("PLAYSTATION") < 0 ? "XBOX" : "PLAYSTATION";
            this.Dpad ={
                Up: function(){
                    return raw.buttons[self.indicies.Dpad.up]
                },
                Down: function(){
                    return raw.buttons[self.indicies.Dpad.down]
                },
                Left: function(){
                    return raw.buttons[self.indicies.Dpad.left]
                },
                Right: function(){
                    return raw.buttons[self.indicies.Dpad.right]
                }
            }
            this.LeftShoulder ={
                Top: function(){
                    return raw.buttons[self.indicies.LeftShoulder.top]
                },
                Bottom: function(){
                    return raw.buttons[self.indicies.LeftShoulder.bottom]
                }
            }           
            this.RightShoulder ={
                Top: function(){
                    return raw.buttons[self.indicies.RightShoulder.top]
                },
                Bottom: function(){
                    return raw.buttons[self.indicies.RightShoulder.bottom]
                }
            }
            
            this.Buttons = {
                Top: function(){
                    return raw.buttons[self.indicies.Buttons.top]
                },
                Bottom: function(){
                    return raw.buttons[self.indicies.Buttons.bottom]
                },
                Left: function(){
                    return raw.buttons[self.indicies.Buttons.left]
                },
                Right: function(){
                    return raw.buttons[self.indicies.Buttons.right]
                }
            }
            this.LeftStick = {
                X: function(){
                    return raw.axes[self.indicies.LeftStick.x]
                },
                Y: function(){
                    return raw.axes[self.indicies.LeftStick.y]
                },
                Button: function(){
                    return raw.buttons[self.indicies.LeftStick.button]
                }
            }
            this.RightStick ={
                X: function(){
                    return raw.axes[self.indicies.RightStick.x]
                },
                Y: function(){
                    return raw.axes[self.indicies.RightStick.y]
                },
                Button: function(){
                    return raw.buttons[self.indicies.RightStick.button]
                }
            }
            
            this.Select = function(){ return raw.buttons[self.indicies.select];}
            this.Start =  function(){ return raw.buttons[self.indicies.start];}

            this.Delete = function(){
                os.input.Gamepads.current.remove(this.id);
                //os.input.Gamepads.previous.remove(this.id);
            }
            this.Update = function(rawGPad){

                    if(this.type != "PLAYSTATION"){
                        //Default setup is Playstation, so save raw value
                        //raw.buttons = os.input.Gamepads.Raw.current[this.id].buttons.slice(0,os.input.Gamepads.Raw.current[this.id].buttons.length);
                        //raw.axes = os.input.Gamepads.Raw.current[this.id].axes.slice(0,os.input.Gamepads.Raw.current[this.id].axes.length);
                        //raw.timestamp = os.input.Gamepads.Raw.current[this.id].timestamp;
                        
                        //Convert to XBOX mapping and save
                        raw = os.input.Gamepads.Raw.current[this.id];
                    }

                
            }
        }
        
        // Extend object by using GamepadEvent['gamepadID'] = Array [CCallback]
        var CGamepadEvent = function(){
            
        }
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
                    
                    var callbackArray = e.keyCode > 47 && e.keyCode < 91 ? _KeyDownEvents.get(String.fromCharCode(e.keyCode)) : _KeyDownControlKeyEvents.get(e.keyCode);
                                      
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
                    var callbackArray = e.keyCode > 47 && e.keyCode < 91 ? _KeyUpEvents.get(String.fromCharCode(e.keyCode)) : _KeyUpControlKeyEvents.get(e.keyCode);
                                      
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
            },
            Gamepad: {
                Connect: function(e){
                    var gp = new CGamepad(e);
                    os.input.Gamepads.current.put(gp.id, gp);
                    //var pgp = new CGamepad(e);
                    //os.input.Gamepads.previous.put(pgp.id, pgp);
                    
                    var callbackArray = _GamepadEvents.get("CONNECT");
                    if(callbackArray){
                        for(var i = callbackArray.length - 1; i >= 0 ; i--){
                            if(callbackArray[i].scope){
                                callbackArray[i].func.apply(callbackArray.scope, [gp]);
                            }else{
                                callbackArray[i].func(gp);
                            }
                        }
                    }
                },
                Disconnect: function(e){
                    var gp = os.input.Gamepads.current.get(e.index);
                    
                    var callbackArray = _GamepadEvents.get("DISCONNECT");
                    if(callbackArray){
                        for(var i = callbackArray.length - 1; i >= 0 ; i--){
                            if(callbackArray[i].scope){
                                callbackArray[i].func.apply(callbackArray.scope, [gp]);
                            }else{
                                callbackArray[i].func(gp);
                            }
                        }
                    }
                    
                    gp.Delete();
                    
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
        
        
        
        
        //Holds state of mouse for all registered states
        var _Mouse = {
            lastX: 0,
            lastY: 0,
            pressed: false
        }
        //      key: mouseEventType, value: Array[CCallbacks]
        var _TouchEvents = null;

        //      key: mouseEventType, value: Array[CCallbacks]
        var _MouseEvents = null;
        
        
        //Holds states/events of all keys
        //      key: keyCode, value: true/false
        var _KeyboardStates = null;
        
        //      key: keyCode, value: Array[CCallbacks];
        var _KeyDownEvents = null;
        var _KeyUpEvents = null;
        var _KeyDownControlKeyEvents = null;
        var _KeyUpControlKeyEvents = null;
        
        var _GamepadEvents = null;
        return{
            //PUBLIC ATTRIBUTES
            currentTime: 0,
            previousTime: 0,
            //PUBLIC PRIVILEDGE METHODS
            Update: function(dt){
                
                //Update current and check for new Gamepads
                os.input.Gamepads.Update(dt);
                
            },
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
                    },
                    Gamepad: function(gamepadID){
                        return _Gamepads.get(gamepadID);
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
                                eventArray = _KeyDownControlKeyEvents.get(Key);
                            }
                            else{
                                eventArray = _KeyDownControlKeyEvents.get(Key);
                            }
                            
                            
                            if(!eventArray){
                                eventArray = [];
                                if(isNaN(Key)){ _KeyDownEvents.put(Key, eventArray);}
                                else{_KeyDownControlKeyEvents.put(Key, eventArray);}
                                
                            }
                            eventArray.push(e);
                            return e;
                        },
                        Keyup: function(Key, fFunction, oScope){
                            var e = new CCallback(_eventID++, fFunction, oScope);
                            var eventArray;
                            
                            if(isNaN(Key)){
                                eventArray = _KeyUpControlKeyEvents.get(Key);
                            }
                            else{
                                eventArray = _KeyUpControlKeyEvents.get(Key);
                            }
                            
                            
                            if(!eventArray){
                                eventArray = [];
                                if(isNaN(Key)){ _KeyUpEvents.put(Key, eventArray);}
                                else{_KeyUpControlKeyEvents.put(Key, eventArray);}
                                
                            }
                            eventArray.push(e);
                            return e;
                            
                        }
                    },
                    State: {
                        
                    }
                },
                Gamepad: {
                    Event: {
                        Connected: function(fFunction, oScope){
                            var e = new CCallback(_eventID++, fFunction, oScope);
                            _GamepadEvents.get("CONNECT").push(e);
                            return e;
                        },
                        Disconnected: function(fFunction, oScope){
                            var e = new CCallback(_eventID++, fFunction, oScope);
                            _GamepadEvents.get("DISCONNECT").push(e);
                            return e;
                        }
                    },
                    State: {
                        
                    }
                }
            },
            Gamepads: {
                Raw: {
                    current:  [undefined, undefined,undefined, undefined],
                    previous: [undefined, undefined,undefined, undefined]
                },
                current: null,
                previous: null,
                Poll: function(dt){
                    
                    for(var i = 3; i >= 0; i--){
                        os.input.Gamepads.Raw.previous[i] = os.input.Gamepads.Raw.current[i];
                    }
                    // Get the array of gamepads Ð the first method (function call)
                    // is the most modern one, the second is there for compatibility with
                    // slightly older versions of Chrome, but it shouldnÕt be necessary
                    // for long.
                    os.input.Gamepads.Raw.current =
                        (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) ||
                        navigator.webkitGamepads;
                
                    if (os.input.Gamepads.Raw.current) {
                      // We donÕt want to use rawGamepads coming straight from the browser,
                      // since it can have ÒholesÓ (e.g. if you plug two gamepads, and then
                      // unplug the first one, the remaining one will be at index [1]).
                      
                
                      // We only refresh the display when we detect some gamepads are new
                      // or removed; we do it by comparing raw gamepad table entries to
                      // Òundefined.Ó
                      var gamepadsChanged = false;
                
                      for (var i = 3; i >= 0; i--) {
                        
                        if (typeof os.input.Gamepads.Raw.current[i] != typeof os.input.Gamepads.Raw.previous[i]) {
                          
                            if(typeof os.input.Gamepads.Raw.previous[i] == "undefined"){
                                _InputEvents.Gamepad.Connect(os.input.Gamepads.Raw.current[i])
                            }
                            else{
                                _InputEvents.Gamepad.Disconnect(os.input.Gamepads.Raw.previous[i])
                            }
                          
                            //os.input.Gamepads.Raw.previous[i] = os.input.Gamepads.Raw.current[i];
                        }
                        
                        
                      }
                    }
                },
                Update: function(dt){
                    os.input.Gamepads.Poll(dt);
                    for(var i = os.input.Gamepads.current.size - 1; i >=0; i--){
                        os.input.Gamepads.current.value().Update();
                        os.input.Gamepads.current.next();
                    }
                }
            },
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
                document.addEventListener("touchstart", _InputEvents.Touch.Start, false);
                document.addEventListener("touchend", _InputEvents.Touch.End, false);
                document.addEventListener("touchmove", _InputEvents.Touch.Move, false);
                
                document.addEventListener("mousedown", _InputEvents.Mouse.Down, false);
                document.addEventListener("mouseup", _InputEvents.Mouse.Up, false);
                document.addEventListener("mousemove", _InputEvents.Mouse.Move, false);
                
                window.addEventListener("keydown", _InputEvents.Keyboard.Keydown, false);
                window.addEventListener("keyup", _InputEvents.Keyboard.Keyup, false);
                
                //      key: mouseEventType, value: Array[CCallbacks]
                _TouchEvents = os.resschmgr.Create.Map();
                _TouchEvents.put("START", []);
                _TouchEvents.put("END", []);
                _TouchEvents.put("MOVE", []);
        
                //      key: mouseEventType, value: Array[CCallbacks]
                _MouseEvents = os.resschmgr.Create.Map();
                _MouseEvents.put("DOWN", []);
                _MouseEvents.put("UP", []);
                _MouseEvents.put("MOVE", []);
                
                
                
                //Holds states/events of all keys
                //      key: keyCode, value: true/false
                _KeyboardStates = os.resschmgr.Create.Map();
                
                //      key: keyCode, value: Array[CCallbacks];
                _KeyDownEvents = os.resschmgr.Create.Map();
                _KeyUpEvents = os.resschmgr.Create.Map();
                _KeyDownControlKeyEvents = os.resschmgr.Create.Map();
                _KeyUpControlKeyEvents = os.resschmgr.Create.Map();
                
                _GamepadEvents = os.resschmgr.Create.Map();
                pInstance.Gamepads.current = os.resschmgr.Create.Map();
                pInstance.Gamepads.previous = os.resschmgr.Create.Map();
                _GamepadEvents.put("CONNECT", []);
                _GamepadEvents.put("DISCONNECT",[]);
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