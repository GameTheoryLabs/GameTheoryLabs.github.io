//JaHOVA OS Physics Multithreaded Application Demo - Physics Thread


var Thread = {
    name: "PhysicsThread",
    id: -1,
    path: "scripts/thread.js",
    Resources: null,                        //Map of avaliable Resources/Cores {Name, Path, ID}
    Interface: null,                        //Map of Interface Methods
    CInstruction: function(){
        this.SenderID = null;              //Resource ID requesting execution
        this.ReceiverID = null;            //Resource ID or resource to be executed
        this.Data = null;                  //Message, input parameters, arguments to be used by interface
        this.Priority = null;              //Priority level of request, only used if allowed
        this.InterfaceID = null;           //ID of interface method being requested
        this.InterfaceName = null;    	   //Name of interface method being requested
        this.SendTime = null;              //Time of request
        this.DeliveryTime = null;          //Time of Interpreter calling interface
        this.CallBackFunction = null;      //CallBack Function, only allowed for internal OS cores
        this.CallBackInterfaceID = null;   //Call Back Interface ID, allows external cores to associate a call back function        
    },
    SendRequest: function(instructions){
       // if(Thread.id > 0)
        //{
            self.postMessage(instructions);
        //}
        //else{
            
        //}
    },
    Initialize: function(){
        self.addEventListener('message', Thread.OnRequest, false);
        Thread.ExtendMap();
        
        Thread.Interface = new Thread.CMap();
        Thread.Resources = new Thread.CMap();
        
        Thread.Interface.put("SetResources", Thread.SetResources);
        Thread.Interface.put("UpdatePosition", Thread.UpdatePosition);
    },
    OnRequest: function(e){
        var requests = e.data;
        var numOfRequest = requests.length;
        for(var i = 0; i < numOfRequest; i++){
            (Thread.Interface.get(requests[i].InterfaceName))(requests[i]);
        }
    },
    DisplayMessage: function(message){
        //Get current time
        var time = (new Date()).getTime();
        
        var request = new Thread.CInstruction();
        
        //Set Instruction Values
        request.SenderID               = Thread.id;            			                    //Resource ID requesting execution
        request.ReceiverID             = 2//;Thread.Resources.get("com.jahova.os.kernel.command");      //Resource ID or resource to be executed
        request.Data                   = message;                                                   //Data, input parameters, arguments to be used by interface
        request.InterfaceName          = "Display";                                                 //Name of interface method being requested
        request.SendTime               = time;                                                      //Time of request
        request.DeliveryTime           = time;                                                      //Time of Interpreter calling interface
        
        var output = [];
        output.push(request);
        
        Thread.SendRequest(output);        
    },
    SetResources: function(request){
        var res = request.Data;
        var numOfResources = res.length;
        
        if(Thread.id == -1){
            Thread.id = request.ReceiverID;
            for(var i = 0; i < numOfResources; i++){
                Thread.Resources.put(res[i].name, res[i].id);   
            }
        }
        else{
            
            for(var i = 0; i < numOfResources; i++){
                Thread.Resources.put(res[i].name, res[i].id);
            }
        }
        
        var time = (new Date()).getTime();
        var instruction = new Thread.CMap();

        //Set Instruction Values
        instruction.SenderID               = Thread.id;                     //Resource ID requesting execution
        instruction.ReceiverID             = request.SenderID;              //Resource ID or resource to be executed
        instruction.Data                   = res;                           //Data, input parameters, arguments to be used by interface
        instruction.Priority               = request.Priority;              //Priority level of request, only used if allowed
        instruction.InterfaceID            = request.CallBackInterfaceID;   //ID of interface method being requested
        instruction.InterfaceName          = request.CallBackFunction;      //Name of interface method being requested
        instruction.SendTime               = time;                         //Time of request
        instruction.DeliveryTime           = time;                         //Time of Interpreter calling interface
    
        var output = [];
        output.push(instruction);
        Thread.SendRequest(output);
    },
    UpdatePosition: function(request){
        var input = request.Data;
        
        //****************************
        //  Update Physics Properties
        //***************************
        
        //x = xo + Vx*dt
        input.posX = input.posX + input.velX * input.dt;
        
        //Vy = Vyo + a*dt
        if((input.velY != null)){
            input.velY = input.velY + ((9.81)*input.dt);
            
            //y = yo + Vy*dt
            input.posY = input.posY + input.velY * input.dt
            
            //Collide with bottom wall
            if(input.posY > input.yBoundMax)
            {
                input.velY = input.velY * 0.9;//input.coefOfRes;
                input.posY = input.yBoundMax - 1;
                input.velY = -input.velY;
                
            }
            
            //Collide with top wall
            if(input.posY < input.yBoundMin)
            {
                input.velY = input.velY * 0.9;//input.coefOfRes;
                input.posY = input.yBoundMin + 1;
                input.velY = -input.velY;
                
            }            
        }
        
        //
        //	Check for collisions with walls
        //
        
        //Collide with right wall
        if(input.posX > input.xBoundMax)
        {
            input.velX = input.velX * input.coefOfRes;
            input.posX = input.xBoundMax - 1;
            input.velX = -input.velX;
        }
        
        //Collide with left wall
        if(input.posX < input.xBoundMin)
        {
            input.velX = input.velX * input.coefOfRes;
            input.posX = input.xBoundMin + 1;
            input.velX = -input.velX;
            
        }
        
        //Get current time
        var currentTime = (new Date()).getTime();
        var messageTime = request.DeliveryTime;
        
        var dt = (currentTime - messageTime)/1000;
        
        //Get new Instruction
        var instruction = new Thread.CInstruction();
        
        //Set Instruction Values
        instruction.SenderID               = Thread.id;            //Resource ID requesting execution
        instruction.ReceiverID             = request.SenderID;     //Resource ID or resource to be executed
        instruction.Data                   = input;                //Data, input parameters, arguments to be used by interface
        instruction.InterfaceName          = "Update";             //Name of interface method being requested
        instruction.SendTime               = currentTime;          //Time of request
        instruction.DeliveryTime           = currentTime;          //Time of Interpreter calling interface
        instruction.CallBackFunction       = "UpdatePosition";     //CallBack Function, only allowed for internal OS cores
        
        var output = []
        output.push(instruction);
        Thread.SendRequest(output);        
        
        
    },
    CMap: function(linkEntries){
        this.current = undefined;
        this.size = 0;
        this.isLinked = true;                                
    },
    ExtendMap: function(){
        Thread.CMap.prototype.disableLinking = function(){
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
        
        Thread.CMap.prototype.hash = function(value){
            return value instanceof Object ? (value.__hash ||
                    (value.__hash = 'object ' + ++arguments.callee.current)) :
                    (typeof value) + ' ' + String(value);
        };
        
        Thread.CMap.prototype.hash.current = 0;
        Thread.CMap.prototype.link = function(entry){
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
        
        Thread.CMap.prototype.unlink = function(entry) {
                if(this.size === 0)
                        this.current = undefined;
                else {
                        entry.prev.next = entry.next;
                        entry.next.prev = entry.prev;
                        if(entry === this.current)
                                this.current = entry.next;
                }
        };
        
        Thread.CMap.prototype.get = function(key) {
                var entry = this[this.hash(key)];
                return typeof entry === 'undefined' ? undefined : entry.value;
        };
        
        Thread.CMap.prototype.put = function(key, value) {
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
        
        Thread.CMap.prototype.remove = function(key) {
                var hash = this.hash(key);
        
                if(this.hasOwnProperty(hash)) {
                        --this.size;
                        this.unlink(this[hash]);
        
                        delete this[hash];
                }
        
                return this;
        };
        
        Thread.CMap.prototype.removeAll = function() {
                while(this.size)
                        this.remove(this.key());
        
                return this;
        };
        
        Thread.CMap.prototype.next = function() {
                this.current = this.current.next;
        };
        
        Thread.CMap.prototype.key = function() {
                return this.current.key;
        };
        
        Thread.CMap.prototype.value = function() {
                return this.current.value;
        };
        
        Thread.CMap.prototype.drop = function(func, thisArg) {
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
        
        Thread.CMap.prototype.toString = function() {
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
    }

                             
                                
}
Thread.Initialize();
