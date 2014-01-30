//JaHOVA OS : Kernel : Resource and Schedule Manager
//      Dependent on JaHOVA OS : Kernel

/**h* Kernel/ResSchMgr
*  LINKS
* |html <p><a href="http://jahovaos.com/JaHOVA/Documentation/Full/toc_index.html">   Table of Contents </a></p>
*
*  NAME
*    JaHOVA OS Kernel Resource and Schedule Manager Module
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
*     This singleton holds the Kernel Resource and Schedule Manager Module.
*     
*
*  EXAMPLE
*   resschmgr = com.jahova.os.Instance().Kernel.Instance().ResSchMgr.Instance();
*   
**/



com.jahova.os.Instance().Kernel.Instance().ResSchMgr = (function()
                        {
                            
                            var pInstance;
                           
                           
                            function constructor()
                            {
                                //******************
                                //PRIVATE ATTRIBUTES
                                //******************
                                
                                var NAME = "JaHOVA OS Kernel : Resource and Schedule Manager Module";
                                var VERSION = "0v5";
                                var PATH = "scripts/jahova/OS/Kernel/jahova.os.kernel.resschmgr.js";
                                var ID = null;
                                
                                var os = com.jahova.os.Instance();
                                var utilities = com.jahova.utilities.Instance();
                            
                                
                                //******************
                                //PRIVATE METHODS
                                //******************
                                
                                
                                //******************
                                // PRIVATE CLASSES
                                //******************
                                
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
                                
                                var CCore = function(id){
                                    //Private Members
                                    var _id = id;
                                    var _state
                                    
                                    //Public Members
                                    
                                    //OS Pointers
                                    this.os = com.jahova.os.Instance();
                                    this.utilities = com.jahova.utilities.Instance();
                                    
                                    
                                    this.name = null;       //User Defined Name
                                    this.osName = null;     //OS Defined Name
                                    this.path = null;       //url path to core code
                                    this.threadSafe = null; //bool : can core be run as a thread
                                    
                                    //Method Pointers
                                    this.SendRequest = null;    // Pointer to Instruction Module
                                    this.Dispatcher = null;     // Pointer to Event->Dispatch
                                    this.OnRequest = null;      // Instruction Request Handler
                                    
                                    //Map Containg Pointers to Core Interface Methods
                                    this.Interface = this.os.resschmgr.Create.Map();
                                    
                                    //Accesors and Mutators
                                    this.SetID = function(id)
                                    {
                                        _id = id;
                                    }
                                    
                                    this.GetID = function()
                                    {
                                        return _id;
                                    }
                                    
                                    this.SetState = function(state)
                                    {
                                        _state = state;
                                    }
                                    
                                    this.GetState = function()
                                    {
                                        return _state;
                                    }
                                };
                                
                                
                                var CEvent = function(id, target, name, eventType, custom, can_bubble, cancelable){
                                    //OS Pointers
                                    this.os = com.jahova.os.Instance();
                                    this.utilities = com.jahova.utilities.Instance();
                                    this.scope = this;
                                    
                                    this.id = id;
                                    this.target = target;               // Event Object, this event belongs too
                                    this.name = name;                   //click, mouseover, com_jahova, etc
                                    this.eventType = eventType;         //HTMLEvent, MouseEvent, KeyboardEvent, etc
                                    this.custom = custom;               //true or false
                                    this.can_bubble = false;
                                    this.cancelable = false;
                                    this.event;                         //event DOM object
                                    this.nextID = 0;                    //ID supplied to Subscribers
                                    
                                    this.Subscribers =  this.os.resschmgr.Create.Map();      //Map containing Subscribers   
                                    this.Name2ID = this.os.resschmgr.Create.Map();           //Map containing Subscribers Name as Key and ID as value
                                    //Test for custom or default event
                                    if(this.custom)
                                    {
                                        //Custom Event Type - Use click event
                                        if(document.createEvent) //gecko, safari
                                        {   
                                            //Creating a message event for worker
                                            if(window.Worker && (this.target instanceof Worker))
                                            {
                                                this.event = document.createEvent("MessageEvent");
                                            }
                                            else //if(/Konqueror|Safari|KHTML/.test(navigator.userAgent))
                                            {
                                                this.event = document.createEvent("MouseEvents");
                                                this.event.initMouseEvent("click", false, true, window, 0,0,0,0,0,false, false, false, false, 0, null);
                                            }
                                        }
                                        else //msie
                                        {
                                            if(this.target.constructor != Worker)
                                            {
                                                this.event = document.createEventObject();    
                                            }
                                            else{
                                                //Error worker not supported in IE
                                            }    
                                        }
                                    }
                                    else  //Not a custom event, standard event 
                                    {
                                        if(document.createEvent) //gecko, safari
                                        {
                                            
                                            if(/Konqueror|Safari|KHTML/.test(navigator.userAgent))
                                            {
                                                this.event = document.createEvent(this.eventType);   
                                                this.event.initEvent(this.name, this.can_bubble, this.cancelable);
                                            }
                                            else //gecko MouseEvents
                                            {
                                                this.event = document.createEvent(this.eventType);
                                //
                                //Need to have a look up technique
                                //  to find the proper init Method
                                //  based on the event type.
                                //
                                                this.event.initMouseEvent(this.name, this.can_bubble, this.cancelable, window, 0,0,0,0,0,false, false, false, false, 0, null);
                                            }
                                        }
                                        else //msie
                                        {
                                            this.event = document.createEventObject();    
                                        }
                                    }

                                    
                                };
                                CEvent.prototype.Subscribe = function(name, eventName, callback, capture){
                                    //Create a subscriber and push to Q
                                    this.nextID++;  //Get next ID
                                    var id = this.nextID; 
                                    var sub = new this.os.resschmgr.Create.Subscriber(name, id, eventName, callback, capture);
                                    this.Subscribers.put(id,sub);
                                    this.Name2ID.put(name,id);
                                    
                                    //Attach event to target
                                    if(this.custom)
                                    {
                                        if(window.Worker && ( this.target instanceof Worker))
                                        {
                                            if(this.target.attachEvent != undefined)
                                            {
                                                this.target.attachEvent("onmessage", callback);
                                            }
                                            else
                                            {
                                                this.target.addEventListener("message", callback, capture);    
                                            }                
                                        }
                                        else
                                        {
                                            if(this.target.attachEvent != undefined)
                                            {
                                                this.target.attachEvent("onclick", callback);
                                            }
                                            else
                                            {
                                                this.target.addEventListener("click", callback, capture);    
                                            } 
                                        } 
                                    }
                                    else
                                    {
                                        if(this.target.attachEvent != undefined)
                                        {
                                            //IE
                                            this.target.attachEvent("on" + this.name, callback);
                                        }
                                        else
                                        {
                                            //Everyone else
                                            this.target.addEventListener(this.name, callback, capture);    
                                        }   
                                    }
                                     
                                     return sub;    
                                }
                                
                                CEvent.prototype.Unsubscribe = function(subID){
                                    //Get subscriber
                                    var sub  = this.Subscribers.get(subID);
                                    
                                    if(this.custom)
                                    {
                                        //Remove Listener from target
                                        if(this.target.detachEvent != undefined)
                                        {
                                            //IE
                                            this.target.detachEvent("onclick", sub.callback);
                                        }
                                        else
                                        {
                                            //Everyone else
                                            this.target.removeEventListener("click", sub.callback, false);    
                                        }  
                                        
                                    }
                                    else
                                    {
                                        if(this.target.detachEvent != undefined)
                                        {
                                            //IE
                                            this.target.detachEvent("on" + this.name, sub.callback);
                                        }
                                        else
                                        {
                                            //Everyone else
                                            this.target.removeEventListener(this.name, sub.callback, sub.capture);    
                                        }   
                                        
                                    }
                                    
                                    //Remove Subscriber from Maps
                                    Name2ID.remove(sub.name);
                                    Subscribers.remove(subID);
                                     
                                }
                                
                                CEvent.prototype.RemoveAllSubscribers = function(){
                                    
                                    for(var i = 0; i++ < this.Subscribers.size; this.Subscribers.next())
                                    {
                                        this.Unsubscribe(Subscribers.value().id);
                                    }

                                }
                                
                                CEvent.prototype.Dispatch = function(data){
                                        if(this.custom)
                                        {
                                            //For custom event add data to event object
                                            this.event.jahovaos = data;
                                            
                                            if(document.createEvent)
                                            {
                                                if(window.Worker && (this.target instanceof Worker))
                                                {
                                                    return this.target.postMessage(data);
                                                }
                                                else
                                                {
                                                    return this.target.dispatchEvent(this.event);
                                                }
                                            }
                                            else
                                            {
                                                return this.target.fireEvent('onclick', this.event);    
                                            }   
                                        }
                                        else
                                        {
                                            if(document.createEvent)
                                            {
                                                return this.target.dispatchEvent(this.event);
                                            }
                                            else
                                            {
                                                return this.target.fireEvent('on'+this.name, this.event);    
                                            }   
                                            
                                        }
                                };
                                
                                CEvent.prototype.GetSubscriberByID = function(id){
                                    return this.Subscribers.get(id);
                                }
                                
                                CEvent.prototype.GetSubscribersByName = function(name){
                                    var output = false;
    
                                    for(var i = 0; i++ < this.Subscribers.size; this.Subscribers.next())
                                    {
                                        if(this.Subscribers.value().name == name)
                                        {
                                            if(!output)
                                            {
                                                output = [];
                                            }
                                            
                                            output.push(this.Subscribers.value());
                                        }
                                    }
                                    return output;
                                }
                                
                                CEvent.prototype.GetSubscriberID = function(name){
                                    return this.Subscribers.get(this.Name2ID.get(name));
                                }
                                
                                var CEventObject = function(id, name, custom, targetID){
                                    //OS Pointers
                                    this.os = com.jahova.os.Instance();
                                    this.utilities = com.jahova.utilities.Instance();
                                    
                                    this.id = id;
                                    this.name = name;
                                    this.target;
                                    this.targetID = targetID;
                                    this.custom = custom;
                                    this.nextID = 0;
                                     
                                    this.PublishedEvents = this.os.resschmgr.Create.Map();
                                    this.Name2ID = this.os.resschmgr.Create.Map();
                                    
                                    if(this.custom)
                                    {
                                        //Test to see if target ID is non numeric
                                        //  If so then creating a thread and ID is path
                                        if(isNaN(this.targetID))
                                        {
                                            this.target = new Worker(this.targetID);

                                        }
                                        else
                                        {
                                            this.target  = document.createElement("a");
                                            this.target.name = this.name;
                                            this.target.id = this.targetID;
                                            document.body.appendChild(this.target);
                                        }
                                        
                                    }
                                    else
                                    {
                                        this.target = document.getElementById(this.targetID);
                                    }
                                    
                                };
                                
                                CEventObject.prototype.PublishEvent = function(name, eventType, can_bubble, cancelable){
                                    //Create an Event 
                                    this.nextID++;
                                    var id = this.nextID;
                                    var event = this.os.resschmgr.Create.Event(id, this.target, name, eventType, this.custom, can_bubble, cancelable);
                                    
                                    //Add Event to PublishedEvents and Name2ID Maps
                                    this.PublishedEvents.put(id,event);
                                    this.Name2ID.put(name,id);
                                    return event;
                                };
                                
                                CEventObject.prototype.UnpublishEvent = function(id){
                                    //Get Event
                                    var event = this.PublishedEvents.get(id);
                                    
                                    //Remove all subscribers of event
                                    event.RemoveAllSubscribers();
                                    
                                    //Remove event from the PublishedEvent Name2ID Maps
                                    this.Name2ID.remove(event.name);
                                    this.PublishedEvents.remove(id);
                                    
                                }
                                
                                CEventObject.prototype.UnpublishAllEvents = function(){
                                    
                                    for(var i = 0; i++ < this.PublishedEvents.size; this.PublishedEvents.next())
                                    {
                                        var event = this.PublishedEvents.value();
                                        
                                        event.RemoveAllSubscribers();
                                    }
                                    
                                }
                                
                                CEventObject.prototype.GetEventByID = function(id){
                                    return this.PublishedEvents.get(id);
                                }
                               
                                CEventObject.prototype.GetEventsByName = function(name){
                                    var output = false;
    
                                    for(var i = 0; i++ < this.PublishedEvents.size; this.PublishedEvents.next())
                                    {
                                        if(this.PublishedEvents.value().name == name)
                                        {
                                            if(!output)
                                            {
                                                output = [];
                                            }
                                            
                                            output.push(this.PublishedEvents.value());
                                        }
                                    }
                                    return output;
                                }
                                
                                CEventObject.prototype.GetEventID = function(name){
                                    return this.PublishedEvents.get(this.Name2ID.get(name));
                                }
                                
                                var CSubscriber = function(name, id, eventName, callback, capture){
                                    this.name = name;
                                    this.id = id;
                                    this.eventName = eventName;
                                    this.callback = callback;
                                    this.capture = capture;
                                };
                                
                                var CInstruction = function(){
                                    this.SenderID = null;              //Resource ID requesting execution
                                    this.ReceiverID = null;            //Resource ID or resource to be executed
                                    this.Data = null;                  //Data, input parameters, arguments to be used by interface
                                    this.Priority = null;              //Priority level of request, only used if allowed
                                    this.InterfaceID = null;           //ID of interface method being requested
                                    this.InterfaceName = null;         //Name of interface method being requested
                                    this.SendTime = null;              //Time of request
                                    this.DeliveryTime = null;          //Time of Interpreter calling interface
                                    this.CallBackFunction = null;      //CallBack Function, only allowed for internal OS cores
                                    this.CallBackInterfaceID = null;   //Call Back Interface ID, allows external cores to associate a call back function
                                };
                                
                                var CCommand = function(name, callback, scope, help){
                                    this.name = name;
                                    this.callback = callback;
                                    this.scope = scope;
                                    this.help = help;
                                }
                                
                                CCommand.prototype.Execute = function(){
                                    this.callback.apply(this.scope, arguments)
                                }
                                
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
                                
                                var CQueue = function(){
                                     this.q = [];
                                };
                                
                                CQueue.prototype.push = function(obj){          //Adds obj to end of queue
                                    this.q.push(obj);   
                                }
                                
                                CQueue.prototype.pop = function(){              //Returns the object from beginning of queue
                                     return this.q.splice(0,1);
                                    
                                }
                                
                                CQueue.prototype.push_front = function(obj){    //Inserts item at beginning of queue (acts as stack)
                                    this.q.unshift(obj);
                                    
                                }
                                
                                CQueue.prototype.push_back = function(obj){     //Inserts item at end of queue
                                    
                                    this.q.push(obj);
                                }
                                
                                CQueue.prototype.pop_front = function(){        //Returns the item at beginning of queue
                                    return this.q.splice(0,1);
                                    
                                }
                                
                                CQueue.prototype.pop_back = function(){         //Returns the item at end of queue (acts as stack)
                                    return this.q.pop();
                                }
                                
                                CQueue.prototype.length = function(){           //Returns queue length
                                    return this.q.length;
                                }
                                
                                CQueue.prototype.toString = function(){         //Returns q as a string
                                    
                                    return this.q.toString();
                                }
                                
                                CQueue.prototype.at = function(index){          //Returns the value at respected index
                                    return this.q[index];
                                }
                               
                                CQueue.prototype.set = function(index, obj){    //Set object at given index
                                    this.q[index] = obj;
                                }
                                
                                CQueue.prototype.find = function(searchStr){    //Returns array of indexs of searchStr (or regex) found in array, or false if not found
                                    var returnArray = false;
                                    for (var i=0; i< this.q.length; i++)
                                    {
                                        if (typeof(searchStr) == 'function')
                                        {
                                            if (searchStr.test(this.q[i]))
                                            {
                                                if (!returnArray)
                                                {
                                                    returnArray = []
                                                }
                                            
                                                returnArray.push(i);
                                            }
                                        }
                                        else
                                        {
                                            if (this.q[i]===searchStr)
                                            {
                                                if (!returnArray)
                                                {
                                                    returnArray = []
                                                }
                                                returnArray.push(i);
                                            }
                                        }
                                    }
                                    
                                    return returnArray;
                                    
                                }
                                
                                CQueue.prototype.remove = function(index){      //Removes value at index
                                    this.q.splice(index,1);
                                }                                    
                                
                                
                                var CWindow = function(uID,uName, uWidth, uHeight, uTop, uLeft){
                                    var ID = uID
                                    var NAME = uName;
                                    
                                    var _onclose = function(e){
                                        
                                        if(this.onclose != null){
                                            this.onclose.apply(this.onclosescope, [e]);
                                        }
                                        
                                        os.resschmgr.WindowManager.Windows.remove(ID);
                                        document.body.removeChild(this.Elements.Window);
                                    }.bind(this);
                                    
                                    var _onmin = function(e){
                                        
                                        if(this.onmin != null){
                                            this.onmin.apply(this.onminscope, [e]);
                                        }
                                        
                                        if(!this.isMinimized){
                                            this.Elements.Body.style.display = "none";
                                            this.Elements.Status.style.display = "none";
                                            this.Elements.Menu.style.display = "none";
                                            this.Elements.HeaderButtons.style.display = "none";
                                            //this.Elements.HeaderText.style.textAlign = "left";
                                            this.Elements.Header.style.overflow = "hidden";
                                            this.Elements.Header.style.resize = "none";
                                            this.Elements.Header.style.width = "100%";
                                            this.Elements.Header.style.height = "100%";
                                            this.Elements.Header.style.borderTopLeftRadius = "0px";
                                            this.Elements.Header.style.borderTopRightRadius = "0px";
                                            
                                            this.left = this.Elements.Window.style.left;
                                            this.top = this.Elements.Window.style.top;
                                            
                                            this.Elements.Window.className = "";
                                            this.Elements.Window.style.height = "25px";
                                            this.Elements.Window.style.width = "150px";
                                            this.Elements.Window.style.top = "";
                                            this.Elements.Window.style.left  ="";
                                            this.Elements.Window.style.borderRight = "1px solid black";
                                            this.Elements.Window.style.position = "relative";
                                            this.Elements.Window.style.float = "left";
                                            this.Elements.Window.style.cssFloat = "left";
                                            this.Elements.Window.style.display = "inline-block";
                                            //this.Elements.Window.style.borderRadius = "0px";
                                            
                                            //if(os.Elements.Dock){
                                            if(os.windows.Desktop.Get.state.desktop() == "VISIBLE"){
                                                os.windows.Desktop.Elements.dock.AppendChild(this.Elements.Window);
                                                //os.Elements.Dock.appendChild(this.Elements.Window);
                                                this.Elements.Header.onclick = _onmin;
                                            }
                                            this.isMinimized = true;
                                            e.stopPropagation();
                                        }
                                        else{
                                            
                                            this.Elements.Body.setAttribute("style","");
                                            this.Elements.Status.setAttribute("style","");
                                            this.Elements.Menu.setAttribute("style","");
                                            this.Elements.HeaderButtons.setAttribute("style","");
                                            this.Elements.Header.setAttribute("style","");
                                            
                                            this.Elements.Window.style.position = "absolute";
                                            this.Elements.Window.style.width = this.width + "px";
                                            this.Elements.Window.style.height = this.height + "px";
                                            this.Elements.Window.style.top = this.top;
                                            this.Elements.Window.style.left = this.left;
                                            this.Elements.Window.className = "outputWindow";
                                            
                                            document.body.appendChild(this.Elements.Window);
                                            this.Elements.Header.onclick = "";
                                            
                                            this.isMinimized = false;
                                            e.stopPropagation();
                                        }
                                        
                                        
                                    }.bind(this);
                                    
                                    var _onmax = function(e){
                                        
                                        if(this.onmax != null){
                                            this.onmax.apply(this.onmaxscope, [e]);
                                        }
                                        
                                        if(!this.isMaximized){
                                            this.isMaximized = true;
                                            this.left = this.Elements.Window.style.left;
                                            this.top = this.Elements.Window.style.top;
                                            this.Elements.Window.style.width =   "100%";
                                            this.Elements.Window.style.height =   (window.innerHeight - 46) + "px";
                                            this.Elements.Window.style.top = "20px";
                                            this.Elements.Window.style.left  = "0px";
                                            this.Elements.Window.style.border = "none";
                                            this.makeActive();
                                            e.stopPropagation();
                                        }
                                        else{
                                            this.isMaximized = false;
                                            this.Elements.Window.style.width = this.width + "px";
                                            this.Elements.Window.style.height = this.height + "px";
                                            this.Elements.Window.style.top = this.top;
                                            this.Elements.Window.style.left = this.left;
                                            this.Elements.Window.style.borderRight = "";
                                            this.Elements.Status.setAttribute("style","");
                                            e.stopPropagation();
                                        }
                                    }.bind(this);
                     
                                    this.makeActive = function(e){
                                        if(os.resschmgr.WindowManager.ActiveWindow){
                                            os.resschmgr.WindowManager.ActiveWindow.Elements.Header.onmousedown = os.resschmgr.WindowManager.ActiveWindow.BeginDrag;
                                            os.resschmgr.WindowManager.ActiveWindow.Elements.Window.onclick = os.resschmgr.WindowManager.ActiveWindow.makeActive;
                                            os.resschmgr.WindowManager.ActiveWindow.Elements.Window.style.zIndex = 20;
                                            os.resschmgr.WindowManager.ActiveWindow.Elements.StatusText.innerHTML = "Status: Inactive";
                                            os.resschmgr.WindowManager.ActiveWindow.Elements.Menu.style.display = "none";
                                        }
                                        
                                        this.Elements.Header.onmousedown = this.BeginDrag;
                                        this.Elements.Window.onclick = "";
                                        this.Elements.Window.style.zIndex = 25;
                                        this.Elements.StatusText.innerHTML = "Status: Active";
                                        this.Elements.Menu.setAttribute("style","");
                                        os.resschmgr.WindowManager.ActiveWindow = this;
                                    }.bind(this);
                                    
                                    this.width = uWidth;
                                    this.height = uHeight;
                                    this.top = uTop;
                                    this.left = uLeft;
                                    
                                    this.startX = null;
                                    this.startY = null;
                                    this.startLeft = null;
                                    this.startTop = null;
                                    
                                    this.onclose = null;
                                    this.onmin = null;
                                    this.onmax = null;
                                    this.onfocus = null;
                                    
                                    this.onclosescope = null;
                                    this.onminscope = null;
                                    this.onmaxscope = null;
                                    this.onfocusscope = null;
                                    
                                    this.isMinimized = false;
                                    this.isMaximized = false;
                                    this.Elements = {
                                        Window: document.createElement("div"),
                                        Header: document.createElement("div"),
                                        HeaderText: document.createElement("div"),
                                        HeaderButtons: document.createElement("div"),
                                        Close: document.createElement("div"),
                                        Min: document.createElement("div"),
                                        Max: document.createElement("div"),
                                        Body: document.createElement("div"),
                                        Status: document.createElement("div"),
                                        StatusText: document.createElement("div"),
                                        Menu: document.createElement("div"),
                                        File: document.createElement("div"),
                                        Edit: document.createElement("div"),
                                        View: document.createElement("div")
                                    };
                                    
                                    this.Elements.Window.style.position = "absolute";
                                    this.Elements.Window.style.width = this.width + "px";
                                    this.Elements.Window.style.height = this.height + "px";
                                    this.Elements.Window.style.top = this.top + "px";
                                    this.Elements.Window.style.left = this.left + "px";
                                    this.Elements.Window.className = "outputWindow";
                                    this.Elements.Window.id = ID;
                                    this.Elements.Window.name = ID;
                                    this.Elements.Window.onclick = this.makeActive;
                                    this.Elements.Window.onfocus = function(){alert("On Focus")};
                                    this.Elements.Window.onblur = function(){alert("On Blur")};
                                    this.Elements.Window.onactivate = function(){alert("On Activate")};
                                    
                                    
                                    this.Elements.Header.className = "windowTitleBar";
                                    this.Elements.Header.id = ID;
                                    
                                    this.Elements.HeaderButtons.className = "macButtonsContainer";
                                    this.Elements.Close.className = "mac_os_x_close";                                    
                                    this.Elements.HeaderButtons.appendChild(this.Elements.Close);
                                    
                                    this.Elements.Min.className = "mac_os_x_minimize";                                    
                                    this.Elements.HeaderButtons.appendChild(this.Elements.Min);
                                    
                                    this.Elements.Max.className = "mac_os_x_maximize";                                    
                                    this.Elements.HeaderButtons.appendChild(this.Elements.Max);
                                    
                                    this.Elements.Header.appendChild(this.Elements.HeaderButtons);
                                    this.Elements.Header.name = ID;
                                    
                                    this.Elements.HeaderText.innerHTML = uName;
                                    this.Elements.HeaderText.className = "windowTitle";
                                    this.Elements.HeaderText.name = ID;
                                    this.Elements.Header.appendChild(this.Elements.HeaderText);
                                    
                                    this.Elements.Window.appendChild(this.Elements.Header);
                                    //this.Elements.Header.innerHTML = uName;
                                    
                                    this.Elements.Close.onclick = _onclose;
                                    this.Elements.Min.onclick = _onmin;
                                    this.Elements.Max.onclick = _onmax;
                                    
                                    this.Elements.File.className = "windowMenu";
                                    this.Elements.File.innerHTML = "File";
                                    
                                    this.Elements.Edit.className = "windowMenu";
                                    this.Elements.Edit.innerHTML = "Edit";
                                    
                                    this.Elements.View.className = "windowMenu";
                                    this.Elements.View.innerHTML = "View";
                                    this.Elements.Menu.className = "windowMenuBarMac";
                                    this.Elements.Menu.name = ID;
                                    
                                    this.Elements.Menu.appendChild(this.Elements.File);
                                    this.Elements.Menu.appendChild(this.Elements.Edit);
                                    this.Elements.Menu.appendChild(this.Elements.View);
                                    
                                    this.Elements.Window.appendChild(this.Elements.Menu);
                                    
                                    this.Elements.Window.appendChild(this.Elements.Body);
                                    
                                    this.Elements.Status.className = "windowStatusBar";
                                    this.Elements.Status.name = ID;
                                    this.Elements.StatusText.innerHTML = "Status: Active";
                                    this.Elements.StatusText.className = "windowStatus";
                                    this.Elements.StatusText.name = ID;
                                    this.Elements.Status.appendChild(this.Elements.StatusText);
                                    this.Elements.Window.appendChild(this.Elements.Status);
                                    
                                    
                                    
                                    document.body.appendChild(this.Elements.Window);
                                    os.resschmgr.WindowManager.Windows.put(uID, this);
                                    //os.resschmgr.WindowManager.ActiveWindow = this;
                                    this.makeActive();
                                    return this;
                                };
                                
                                CWindow.prototype.BeginDrag = function(event){
                                    var obj = os.resschmgr.WindowManager.Windows.get(event.target.name);
                                    //var obj = os.resschmgr.WindowManager.Windows.value();
                                    
                                    //document.addEventListener("mouseup", this.DragStop.apply(this,arguments), false);
                                    //document.addEventListener("mousemove", this.DragStart.apply(this,arguments), false);
                                    //this.Elements.Header.onmouseup = this.DragStop.bind(this);
                                    //this.Elements.Header.mousemove = this.DragStart.bind(this);
                                   if(obj){
                                        obj.Elements.Window.style.zIndex = 21;
                                        if(os.resschmgr.WindowManager.ActiveWindow){
                                            os.resschmgr.WindowManager.ActiveWindow.Elements.Window.style.zIndex = 20;
                                        }
                                        
                                        //os.resschmgr.WindowManager.ActiveWindow = obj;
                                        obj.makeActive();
                                        document.addEventListener("mouseup", obj.DragStop, false);
                                        document.addEventListener("mousemove", obj.DragStart, false);
                                        obj.startX = event.clientX + window.scrollX;
                                        obj.startY = event.clientY + window.scrollY;
                                        obj.startLeft = parseInt(obj.Elements.Window.style.left, 10);
                                        obj.startTop = parseInt(obj.Elements.Window.style.top, 10);
                                        
                                        if (isNaN(obj.startLeft)) obj.startLeft = 0;
                                        if (isNaN(obj.startTop))  obj.startTop  = 0;
                                        
                                        //obj.Elements.Window.style.zIndex = 20;
                                   }
                                    event.preventDefault();
                                };
                                
                                CWindow.prototype.DragStart = function(event, obj){
                                    var object = os.resschmgr.WindowManager.ActiveWindow;//os.resschmgr.WindowManager.Windows.get(event.target.name);//os.resschmgr.WindowManager.Windows.value();
                                    var x,y;
                                    
                                    x = event.clientX + window.scrollX;
                                    y = event.clientY + window.scrollY;
                                    
                                    if(object){
                                        object.Elements.Window.style.left = (object.startLeft + x - object.startX) + "px";
                                        object.Elements.Window.style.top  = (object.startTop  + y - object.startY) + "px";
                                    }
                                    //object.Elements.Body.innerHTML = "<br/>Top: " + (object.startLeft + x - object.startX) ;
                                    //object.Elements.Body.innerHTML += "<br/>Left: " + (object.startTop  + y - object.startY);
                                    //object.Elements.Body.innerHTML += "<br/>Cursor X: " + event.clientY;
                                    //object.Elements.Body.innerHTML += "<br/>Cursor Y: " + event.clientX;
                                    event.preventDefault();

                                };
                                
                                CWindow.prototype.DragStop = function(event,obj){
                                    var object = os.resschmgr.WindowManager.ActiveWindow;//os.resschmgr.WindowManager.Windows.get(event.target.name);//os.resschmgr.WindowManager.Windows.value();
                                    if(object){
                                        document.removeEventListener("mousemove", object.DragStart,false);
                                        document.removeEventListener("mouseup", object.DragStop, false);
                                    }

                                };
                               
                                CWindow.prototype.Close = function(){
                                    os.resschmgr.WindowManager.Windows.remove(ID);
                                    document.body.removeChild(this.Elements.Window);
                                };
                                
                                CWindow.prototype.Move = function(top, left){
                                    this.Elements.Window.style.top = top + "px";
                                    this.Elements.Window.style.left = left + "px";
                                    this.top = top;
                                    this.left = left;
                                };
                                
                                CWindow.prototype.Resize = function(width, height){
                                    this.Elements.Window.style.width = width + "px";
                                    this.Elements.Window.style.height = height + "px";
                                    this.width = width;
                                    this.height = height;
                                };
                                //var CHTMLElement = function(tag){
                                //    var _html = null;
                                //        var _classes = "";
                                //        
                                //        //Adjust classes of HTML Element
                                //        this.Class = {                                    
                                //            //Adds a class to the current class list
                                //            Add: function(sClass){
                                //                _classes += sClass + " ";
                                //                _html.className = _classes;
                                //                return _classes;
                                //            },
                                //            
                                //            //removes an individual class from the class list
                                //            Remove: function(sClass){
                                //                
                                //                _classes = _classes.replace(sClass, "");
                                //                
                                //                return _classes;
                                //            },
                                //            
                                //            //removes all classes from class list
                                //            ClearAll: function(){
                                //                _classes = "";
                                //                _html.className = "";
                                //            },
                                //            
                                //            Get: function(){return _classes;}   
                                //        };
                                //        
                                //        this.AppendToID = function(parentID){
                                //            
                                //            document.getElementById(parentID).appendChild(_html);
                                //        };
                                //        this.AppendTo = function(parent){
                                //            parent.appendChild(_html);
                                //        };
                                //        this.AppendChild = function(child){
                                //            _html.appendChild(child);
                                //        }
                                //        this.GetHeight = function(){
                                //            return _html.clientHeight;
                                //        }
                                //        //Creates HTML element
                                //        _html = document.createElement(tag);
                                //        
                                //        this.html = function(){return _html};
                                //        return this;
                                //};
                                
                                
                                return{
                                    //PUBLIC CLASSES
                                    CHTMLElement: function(tag){
                                        var _html = null;
                                        var _classes = "";
                                        
                                        //Adjust classes of HTML Element
                                        this.Class = {                                    
                                            //Adds a class to the current class list
                                            Add: function(sClass){
                                                _classes += sClass + " ";
                                                _html.className = _classes;
                                                return _classes;
                                            },
                                            
                                            //removes an individual class from the class list
                                            Remove: function(sClass){
                                                
                                                _classes = _classes.replace(sClass, "");
                                                
                                                return _classes;
                                            },
                                            
                                            //removes all classes from class list
                                            ClearAll: function(){
                                                _classes = "";
                                                _html.className = "";
                                            },
                                            
                                            Get: function(){return _classes;}   
                                        };
                                        
                                        this.AppendToID = function(parentID){
                                            
                                            document.getElementById(parentID).appendChild(_html);
                                        };
                                        this.AppendTo = function(parent){
                                            parent.appendChild(_html);
                                        };
                                        this.AppendChild = function(child){
                                            _html.appendChild(child);
                                        }
                                        this.GetHeight = function(){
                                            return _html.clientHeight;
                                        }
                                        this.SetHTML = function(tag){
                                            _html = document.createElement(tag);
                                        }
                                        this.RemoveAllChildren = function(){
                                            
                                            if ( _html.hasChildNodes() )
                                            {
                                                while ( _html.childNodes.length >= 1 )
                                                {
                                                    _html.removeChild( _html.firstChild );       
                                                } 
                                            }
                                        }
                                        //Creates HTML element
                                        _html = document.createElement(tag);
                                        
                                        this.html = function(){return _html};
                                        return this;
                                    },
                                    CEntity: function(id){
                                        var _id = id;
                                        
                                        this.ID = function(){ return _id;};
                                        
                                        this.Get = {
                                            id: function(){
                                                return _id;
                                            }.bind(this)
                                        }
                                        
                                        this.Set = {
                                            
                                        }
                                                                               
                                        this.Graphics = null;
                                        this.AI = null;
                                        this.Physics = null;
                                        
                                    },
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
                                        //Initialize Managers
                                        os.console.AppendComment("Initializing Resource and Schedule Manager");
                                        
                                        os.console.AppendComment("        Initializing Core Manager");
                                        this.CoreManager.Initialize();
                                        
                                        os.console.AppendComment("        Initializing Event Manager");
                                        this.EventManager.Initialize();
                                        
                                        os.console.AppendComment("        Initializing Schedule Manager");
                                        this.ScheduleManager.Initialize();
                                        
                                        os.console.AppendComment("");
                                        
                                        //Register Resource and Schedule Manager
                                        //  Create a Core Instance and sets ID
                                        //os.console.AppendComment("Registering Resource and Schedule Manager")
                                        ID = this.CoreManager.RegisterResource("com.jahova.os.kernel.resschmgr", PATH, false);
                                        
                                        //os.console.AppendComment("        Adding Resource and Schedule Manager to Cores Map");
                                        //Save a pointer to instance of Core loacted in Core Manager
                                        this.Core = this.CoreManager.Cores.get(ID);
                                        this.Core.OnRequest = this.OnRequest;
                                        
                                        //os.console.AppendComment("            Name: " + this.Core.name);
                                        //os.console.AppendComment("            ID:   " + this.Core.GetID());
                                        //os.console.AppendComment("");
                                    },
                                   
                                    Core: null,
                                   
                                    OnRequest: function(e){
                                            var requests = e.jahovaos;
                                    },
                                
                                    Create: {                     //Resource Factory                                      
                                        XHRObject: function(){
                                            return new CXHRObject();
                                        },
                                        Core: function(id){
                                            return new CCore(id);
                                        },
                                        Command: function(name, callback, scope, help){
                                            return new CCommand(name, callback, scope, help);
                                        },
                                        Event: function(id, target, name, eventType, custom, can_bubble, cancelable){
                                            return new CEvent(id, target, name, eventType, custom, can_bubble, cancelable);
                                        },
                                        EventObject:function(id, name, custom, targetID){
                                            return new CEventObject(id, name, custom, targetID);
                                        },
                                        Subscriber: function(name, id, eventName, callback, capture){
                                            return new CSubscriber(name, id, eventName, callback, capture);
                                        },
                                        Instruction: function(){
                                            return new CInstruction();
                                        },
                                        Map: function(linkEntries){
                                            return new CMap(linkEntries);
                                        },
                                        Queue: function(){
                                            return new CQueue();
                                        },
                                        Window: function(uID,uName, uWidth, uHeight, uTop, uLeft){
                                            return new CWindow(uID,uName, uWidth, uHeight, uTop, uLeft);
                                        },
                                        HTMLElement: function(tag){
                                            return new os.resschmgr.CHTMLElement(tag);
                                        },
                                        Entity: function(id){
                                            return new os.resschmgr.CEntity(id);   
                                        }
                                    },
                                    
                                    //PUBLIC OBJECTS                                   
                                    
                                    
                                    WindowManager:{
                                        NextID: 0,
                                        ActiveWindow: null,
                                        Windows: new CMap()
                                    },
                                    
                                    CoreManager: {
                                    
                                        NextID: 0,
                                        
                                        Cores: null,
                                        
                                        Name2ID: null,
                                        
                                        GetCoreByID: function(id){
                                            return this.Cores.get(id);
                                        },
                                        
                                        GetCoreByName: function(name){
                                            return this.Cores.get(this.Name2ID.get(name));
                                        },
                                        
                                        GetAllResources: function(){
                                            var output = [];
                                            
                                            for(var i = 0; i++ < os.resschmgr.CoreManager.Cores.size; os.resschmgr.CoreManager.Cores.next()){
                                                output.push(os.resschmgr.CoreManager.Cores.value());
                                            }
                                            
                                            return output;
                                        },
                                        
                                        Initialize: function(){
                                            this.Cores = os.resschmgr.Create.Map();
                                            this.Name2ID = os.resschmgr.Create.Map();
                                        },
                                        
                                        RegisterResource: function(resName, resPath, threadSafe){
                                            //Inputs:
                                            //  name: Module name (without com_jahovaos)
                                            //  path: Absolute path to resource
                                            //  threadSafe:  bool, is the module capable of being threaded with webworkers
                                            
                                            //Gets ID, returns -1 resource already exist
                                            var id = this.Name2ID.get(resName);
                                            
                                            //verifies core name/path combo does not exist already
                                            if(!id)
                                            {
                                                id = this.NextID++;
                                                //Creates a resource with same id as module
                                                var core = os.resschmgr.Create.Core(id);
                                                
                                                //Initialize resource parameters
                                                core.name = resName;
                                                core.SetID(id);
                                                core.osName = "com_jahovaos_res_" + resName;
                                                core.path = resPath;
                                                core.threadSafe = threadSafe;
                                                
                                                //Add Core to Maps
                                                this.Cores.put(id,core);
                                                this.Name2ID.put(resName, id);
                                            }
                                            else{
                                                id = -1;
                                            }
                                            
                                            //Returns ID of newly created resource, or -1 if resource already exist
                                            return id;
   
                                        },
                                        
                                        ActivateResource: function(ID){
                                            var core = this.Cores.get(ID);
                                            var EventObj;
                                            var e;
                                            
                                            //--------------------------------
                                            //
                                            //  EVENT MANAGER REGISTRATION
                                            //
                                            //--------------------------------
                                            
                                            //Does Browser Support Web Worker
                                            //  and is core capable of running as webworker
                                            if(window.Worker && core.threadSafe)
                                            {
                                                //Create an Event Object (will create a Worker and Message Event)
                                                //os.console.AppendComment("      Creating Event Object");
                                                EventObj = os.resschmgr.EventManager.PublishThread(core.name, os.GetDomain() + core.path);
                                                
                                                //Create a  Message Event for Worker
                                                //os.console.AppendComment("      Creating Event");
                                                e = EventObj.PublishEvent("onRequest", "message", false, true);
                                                
                                                //Subscribe InstructionModule::AddRequest as EventListener for
                                                //  Messages sent from Worker
                                                //os.console.AppendComment("      Subscribing To Event");
                                                e.Subscribe(core.name, "onRequest", os.instruction.AddRequest, false);
                                                
                                                core.OnRequest = os.instruction.Core.Dispatcher;
                                            }
                                            else
                                            {
                                                //os.console.AppendComment("      Creating Event Object");
                                                //Create an Event Object
                                                EventObj = os.resschmgr.EventManager.PublishEventObject(core.name, true, core.GetID());
                                                
                                                //os.console.AppendComment("      Creating Event");
                                                //Create an Event
                                                e = EventObj.PublishEvent("onRequest", "click", false, true);
                                                
                                                //os.console.AppendComment("      Subscribing To Event");
                                                
                                                //Set onRequest as a Subscriber to Event
                                                e.Subscribe(core.name, "onRequest", core.OnRequest, false);
                                            }
                                                
                                            //Register Interpreter to Event Dispatch
                                                core.Dispatcher = e.Dispatch;
                                                
                                            //Register SendRequest to Instruction Module AddRequest
                                                core.SendRequest = os.instruction.Core.Dispatcher;
                                            
                                            //---------------------------------------
                                            //
                                            //  INSTRUCTION MODULE REGISTRATION
                                            //
                                            //---------------------------------------
                                            
                                            os.instruction.AddResource(core);
                                            
                                            //Set Core State to Registered: 2
                                            core.SetState(2);
                                        },
                                        
                                        ActivateResSchMgrModule: function(){
                                            var activationSuccess = false;
                                            
                                            os.resschmgr.Core.OnRequest = os.resschmgr.OnRequest;
                                            //ACTIVATE WITH RESOURCE AND SCHEDULE MANAGER MODULE
                                            //  INPUT: Core ID and Callback Function for Instructions
                                            this.ActivateResource(ID);
                                            
                                            //Test to see if state was updated to Registered: 2
                                            if(os.resschmgr.Core.GetState() == 2)
                                            {
                                                activationSuccess = true;   
                                            }
                                            
                                            return activationSuccess;
                                        },
                                        
                                        ExecuteResource: function(){
                                            //
                                            //  Old Utilities Modules AddRequest Execute
                                            //
                                        }
                                        /*
                                         **/
                                    },
                                    
                                    EventManager: {
                                    
                                        NextID: 0,
                                        
                                        PublishedEventObjects: null,
                                        
                                        Name2ID: null,
                                        
                                        Initialize: function(){
                                            this.PublishedEventObjects = os.resschmgr.Create.Map();
                                            this.Name2ID = os.resschmgr.Create.Map();
                                        },
                                        
                                        PublishEventObject: function(name, custom, targetID){
                                            //Get next ID
                                            this.NextID++;
                                            var id = this.NextID;
                                            
                                            //Create Event Object
                                            var eventObject = os.resschmgr.Create.EventObject(id, name, custom, targetID);
                                            
                                            //Add Object to PublishedObjects Q
                                            this.PublishedEventObjects.put(eventObject.id, eventObject);
                                            this.Name2ID.put(name,id);
                                            return eventObject;
                                            
                                        },
                                        
                                        PublishThread: function(name, path){
                                            //uses path instead of targetID for threads
                                            return this.PublishEventObject(name, true, path);
                                           
                                        },
                                        
                                        UnpublishEventObject: function(id){
                                            //Get Event Object
                                            var eventObj = this.PublishedEventObjects.get(id);
                                            
                                            //Remove all Events and Subscribers
                                            eventObj.UnpublishAllEvents();
                                            
                                            //Remove from Maps
                                            this.Name2ID.remove(eventObj.name);
                                            this.PublishedEventObjects.remove(id);
                                            
                                        },
                                        
                                        GetEventObjectByID: function(id){
                                            return this.PublishedEventObjects.get(id);
                                        },
                                        
                                        GetEventObjectByName: function(name){
                                            var id = this.Name2ID.get(name);
                                            var event = this.GetEventObjectByID(id);
                                            return this.PublishedEventObjects.get(this.Name2ID.get(name));
                                        },
                                        
                                        GetEventObjectID: function(name){
                                            return this.GetEventObjectByName(name).id;
                                        }
                                        
                                    },
                                   
                                    ScheduleManager:{
                                    
                                        NextID:0,
                                        
                                        Initialize: function(){
                                            
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
