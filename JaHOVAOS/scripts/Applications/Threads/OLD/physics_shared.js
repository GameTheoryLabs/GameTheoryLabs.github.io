Function.prototype.bind = function(scope)
{
    var _function = this;
    
    return function() {
      return _function.apply(scope, arguments);
    }
}

var vec3 = {};
vec3.create = function(vec) {
	var dest = [];
	
	if(vec) {
		dest[0] = vec[0];
		dest[1] = vec[1];
		dest[2] = vec[2];
	}
	
	return dest;
};
vec3.length = function(vec){
	var x = vec[0], y = vec[1], z = vec[2];
	return Math.sqrt(x*x + y*y + z*z);
};
vec3.dot = function(vec, vec2){
	return vec[0]*vec2[0] + vec[1]*vec2[1] + vec[2]*vec2[2];
};
vec3.normalize = function(vec, dest) {
	if(!dest) { dest = vec; }
	
	var x = vec[0], y = vec[1], z = vec[2];
	var len = Math.sqrt(x*x + y*y + z*z);
	
	if (!len) {
		dest[0] = 0;
		dest[1] = 0;
		dest[2] = 0;
		return dest;
	} else if (len == 1) {
		dest[0] = x;
		dest[1] = y;
		dest[2] = z;
		return dest;
	}
	
	len = 1 / len;
	dest[0] = x*len;
	dest[1] = y*len;
	dest[2] = z*len;
	return dest;
};

vec3.add = function(vec, vec2, dest) {
	if(!dest || vec == dest) {
		vec[0] += vec2[0];
		vec[1] += vec2[1];
		vec[2] += vec2[2];
		return vec;
	}
	
	dest[0] = vec[0] + vec2[0];
	dest[1] = vec[1] + vec2[1];
	dest[2] = vec[2] + vec2[2];
	return dest;
};

vec3.subtract = function(vec, vec2, dest) {
	if(!dest || vec == dest) {
		vec[0] += vec2[0];
		vec[1] += vec2[1];
		vec[2] += vec2[2];
		return vec;
	}
	
	dest[0] = vec[0] - vec2[0];
	dest[1] = vec[1] - vec2[1];
	dest[2] = vec[2] - vec2[2];
	return dest;
};

vec3.scale = function(vec, val, dest) {
	if(!dest || vec == dest) {
		vec[0] *= val;
		vec[1] *= val;
		vec[2] *= val;
		return vec;
	}
	
	dest[0] = vec[0]*val;
	dest[1] = vec[1]*val;
	dest[2] = vec[2]*val;
	return dest;
};

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
var CTask = function(){
    this.msgID = "";
    this.taskID = "";
    this.threadID =  "";
    this.taskType = "";
    this.data = "";
    this.timeSent = "";
    
};

CTask.prototype.Serialize = function(){
    return JSON.stringify(this);
};

CTask.prototype.Parse = function(input){
    var temp = JSON.parse(input);
    
    this.msgID      = temp.msgID;
    this.taskID     = temp.taskID;
    this.threadID   = temp.threadID;
    this.taskType   = temp.taskType;
    this.data       = temp.data;
    this.timeSent   = temp.timeSent;
};

var Thread = {
    threadFunction: null,
    commands: null,
    customCommands: null,
    inputs: null,
    threadID: null,
    osID: null,
    active: true,
    updateRate: 200,
    entities: [],
    lastUpdate: 0,
    ThreadController: null,
    ThreadControllerPath: "scripts/jahova/OS/Cores/Threads/jahova.os.cores.thread.swcontroller.js",
    currentTask: null,
    Initialize: function(){
        Thread.ThreadController = new SharedWorker(Thread.ThreadControllerPath);
        Thread.ThreadController.port.start();
        Thread.ThreadController.port.onmessage = Thread.ProcessRequest;
        
        //Register New Thread with Shared Thread Controller
        var task = new CTask();
        task.taskType = "Register";
        task.data = "Physics iframe Loaded";
        task.threadID = -1;
        Thread.SendResponse(task.Serialize());
        
        //Create Custom Command Map
        Thread.customCommands = new CMap();
        
        //Load Custom Commands
        Thread.customCommands.put("START", Start);
        Thread.customCommands.put("STOP", Stop);
        Thread.customCommands.put("UPDATE", RequestSharedMemory);
        Thread.customCommands.put("SETUPDATERATE", SetUpdateRate);
        Thread.customCommands.put("GETSHAREDMEMORY", Update);
        Thread.customCommands.put("REGISTERED", Thread.Registered);
        
        //Create Command Map
        Thread.commands = new CMap();
        
        //Load Command Map
        Thread.commands.put("SETFUNCTION", Thread.SetFunction);
        Thread.commands.put("EXECUTE", Thread.Execute);
        Thread.commands.put("ECHO", Thread.Echo);
        Thread.commands.put("REGISTERED", Thread.Registered);
        Thread.commands.put("GETCURRENTFUNCTION", Thread.GetCurrentFunction);
        
        //Initalize currentTask object
        Thread.currentTask = new CTask();
        
    },
    ProcessRequest: function(e){
        
        //Initialize Task Object
        Thread.currentTask.Parse(e.data);
        
        var msgHandler = false;
        
        //Get pointer to specific handler for given taskType
        if(Thread.currentTask.taskType)
        {
            msgHandler = Thread.commands.get(Thread.currentTask.taskType.toUpperCase());   
        }
        
        //Test if request is for a know taskType
        if(msgHandler)
        {
            //Call Proper Task Handler
            msgHandler(Thread.currentTask);
        }
        else
        {
            //Unknown taskType
            Thread.currentTask.data = "Error: Unknon Task Type: " + e.data;
            
            //Send Response to Controller, alerting task is complete and Thread is IDLE
            Thread.SendResponse(Thread.currentTask.Serialize());
        }
        
        
    },
    SendResponse: function(jsonData){
        Thread.ThreadController.port.postMessage(jsonData);
    },
    SendError: function(task){
        task.taskType = "ERROR";
        Thread.SendResponse(taslk.Serialize());
    },
    SetFunction: function(task){
        
        // new Function ([param1, param2, param3,..., paramN], funcBody)
        Thread.threadFunction = new Function(["input"], Thread.currentTask.data.func);
        Thread.currentTask.data = "Function Was Set";
        
    },
    Execute: function(task){
        var msgHandler = false;
        var msg = task.data;
        
        //Get pointer to specific handler for given taskType
        if(task.data.type)
        {
            msgHandler = Thread.customCommands.get(task.data.type.toUpperCase());   
        }
        
        //Test if request is for a know taskType
        if(msgHandler)
        {
            //Call Proper Task Handler
            msgHandler(task.data);
        }
        else
        {
            //Unknown taskType
            Thread.currentTask.data = "Error: Unknon Custom Command Type: " + task.data;
        }

    },
    Registered: function(task){
        
    },
    Echo: function(task){
        //Send Response to Controller, alerting task is complete and Thread is IDLE
        Thread.SendResponse(Thread.currentTask.Serialize());
    },
    GetCurrentFunction: function(task){
        
        //Get Current Thread Function
        Thread.currentTask.data = Thread.threadFunction.toString();
    }
};


Update = function(input){
    //Save Entity List
    Thread.entities = input.data;
    
    var currentTime = (new Date()).getTime();
    var dt = currentTime - Thread.lastUpdate;
    
    if(Thread.active){
        
        
    
        
        
        //Thread.currentTask.taskType = "Collision Detection";
        //Thread.currentTask.data = {};
        //Thread.currentTask.data.list = input.data;
        //Thread.currentTask.data.dt = dt;
        //Thread.SendResponse(Thread.currentTask.Serialize());
        
        if(Thread.entities.length > 0){
            for(var i = 0; i < Thread.entities.length; i++){
                Physics.Update(Thread.entities[i], dt);
            }
            
            
            
        }
        

    
        Thread.lastUpdate = currentTime;
        //RequestSharedMemory();
        setTimeout(RequestSharedMemory, Thread.updateRate);
    }
}
SetUpdateRate = function(input){
    Thread.updateRate = input;
}
RequestSharedMemory = function(){
    
    Thread.currentTask.taskType = "GetSharedMemory";
    Thread.SendResponse(Thread.currentTask.Serialize());
}
Start = function(){
    Thread.active = true;
}
Stop = function(){
    Thread.active = false;
}
Physics = {

    Update: function(ent, dt){

        if(ent.Physics.speed > 0){
        var look = vec3.create();
        vec3.subtract(ent.Position, [-2000,0,4000], look);
        var dist = vec3.length(look);
        var goliathDist = vec3.dot(look, look);
        var goliathRad = (1250 * 1250) + (150 *150);
        
        //Collision Test with Goliath
        if(goliathRad > goliathDist){ //Collision Detected
            //hud.AppendComment("You collided with the Alliance Space Station", "red");
            //new CExplosion(ironstar, look, [0.17,0.26,0.40]);
            vec3.normalize(look);
            ent.Position[0] += look[0] * ( (1400) - dist);
            ent.Position[1] += look[1] * ( (1400) - dist);
            ent.Position[2] += look[2] * ( (1400) - dist);
            
            Thread.currentTask.taskType = "goliathCollision";
            Thread.currentTask.data ={};
            Thread.currentTask.data.type = "goliathCollision";
            Thread.currentTask.data.data = ent.id;
            Thread.currentTask.threadID = Thread.osID;
            Thread.SendResponse(Thread.currentTask.Serialize());
        
        }
    }
    
        //this.UpdateAcceleration(dt);
        //this.UpdateVelocity(dt);
        //Physics.UpdatePosition(ent, dt);
        //Physics.UpdateRotation(ent, dt);
    },
    UpdatePosition: function(ent, dt){
        //Takes current heading and scales by speed
        //  to obtain current velocity vector
        //Takes Velocity Vector and scales by dt
        //  adds to position to obtain new Position value
        vec3.add(ent.Position, vec3.scale(vec3.scale(ent.heading, -1*ent.speed), dt), ent.Position);
    },
    UpdateRotation: function(ent, dt){
        ent.yaw += ent.yawSpeed * dt;
        ent.pitch += ent.pitchSpeed * dt;
    }
}

Thread.Initialize();