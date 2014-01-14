//JaHOVA OS : Cores : Network
//      Dependent on JaHOVA OS : Cores

/**h* InternalCores/Network
*  LINKS
* |html <p><a href="http://jahovaos.com/JaHOVA/Documentation/Full/toc_index.html">   Table of Contents </a></p> 
*
*  NAME
*    JaHOVA OS Network Core
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
*     This Singleton holds the Internal JaHOVA OS Network Core
*
*  EXAMPLE
*     network = com.jahova.os.Instance().Cores.Instance().Network.Instance();
*
**/
com.jahova.os.Instance().Cores.Instance().Network = (function()
                        {
                            var pInstance;
                    
                            function constructor()
                            {
                                //PRIVATE ATTRIBUTES
                                var NAME = "JaHOVA OS Internal API : Network Core";
                                var VERSION = "0v3";
                                var PATH = "scripts/jahova/OS/Cores/Network/jahova.os.cores.network.js";
                                var ID = null;
                                
                                var os = com.jahova.os.Instance();
                                var utilities = com.jahova.utilities.Instance();
                                
                                
                                
                                
                                //Private Classes
                                var CNetworkMessage = function(){
                                    this.SenderID;          // CUser ID
                                    this.ReceiverID;        // CSession Name
                                    this.Data  = {       
                                        Type: null,         // Message Type
                                        Args: null,         // Arguments for Interface Call
                                        ModuleID: null      // CModule Name
                                    }
                                    
                                    this.InterfaceID        // CFunction Name
                                }
                                var CJOSServerMessage = function(){
                                    this.UserID = "";
                                    this.SessionID = "";
                                    this.ModuleID = "";
                                    this.Data = {
                                        Type: "",
                                        Args: ""
                                    };
                                    this.FunctionID = "";
                                    
                                    this.Parse = function(msgJSON){
                                        var msg = "";
                                        try{
                                            msg = JSON.parse(msgJSON);
                                            this.UserID = msg.UserID;
                                            this.SessionID = msg.SessionID;
                                            this.Data = msg.Data;
                                            this.ModuleID = msg.ModuleID;
                                            this.FunctionID = msg.FunctionID;
                                        }
                                        catch(e){
                                            os.windows.Create.ErrorWindow("ERROR: JOS Server", "Unable to parse message: <br/>" + msgJSON);
                                        }
                                        
                                    };
                                    this.Serialize = function(){
                                        
                                        return JSON.stringify(this);
                                    };
                                }
                                
                                var CJOSServer = function(){
                                    
                                    //**********************
                                    //   PRIVATE METHODS
                                    //**********************
                                    var _onOpen = function(){
                                        os.console.Comment("JaHOVA OS Server: Connection Opened");
                                        if(this.Events.onOpen){
                                            this.Events.onOpen();
                                        }
                                        
                                    }.bind(this);
                                    
                                    var _onClose = function(){
                                        os.console.Comment("JaHOVA OS Server: Connection Closed");
                                        if(this.Events.onClose){
                                            this.Events.onClose();
                                        }
                                    }.bind(this);
                                    
                                    var _onMessage = function(msgJSON){
                                        var msg = new CJOSServerMessage();
                                        msg.Parse(msgJSON);
                                        
                                        if(this.Events.onMessage){
                                            this.Events.onMessage(msg);
                                        }
                                        
                                        if(msg.Data.Type == "userID"){
                                            this.userID = msg.Data.Args[0];
                                            this.mainSessionID = msg.SessionID;
                                            os.console.Comment("JaHOVA OS Server ID Set: " + this.userID);
                                        }
                                        
                                    }.bind(this);
                                    
                                    var _onError = function(e){
                                        
                                        if(this.Events.onError){
                                            this.Events.onError(e);
                                        }
                                        
                                    }.bind(this);
                                
                                    this.socket = null;
                                    this.message = null;
                                    this.userID = null;
                                    this.mainSessionID = null;
                                    
                                    this.Events = {
                                        onOpen: null,
                                        onMessage: null,
                                        onClose: null,
                                        onError: null
                                    };
                                    this.Connect = function(){
                                        this.socket.Events.onOpen = _onOpen;
                                        this.socket.Events.onMessage = _onMessage;
                                        this.socket.Events.onClose = _onClose;
                                        this.socket.Events.onError = _onError;
                                        
                                        this.socket.Open();
                                    }
                                    this.Send = function(msg){
                                        this.socket.Send(msg.Serialize());
                                    };
                                    this.Disconnect = function(){
                                        
                                        //Send Disconnect Message to Server
                                        var msg = new CJOSServerMessage();
                                        msg.UserID = this.userID;
                                        msg.Data.Type = "disconnect";
                                        
                                        this.Send(msg);
                                    };
                                    this.Create ={
                                        Session: function(sessionType, password, params){
                                            var msg = new CJOSServerMessage();
                                            msg.SessionID = this.mainSessionID;
                                            msg.UserID = this.userID; 
                                            msg.Data.Type = "createSession";
                                            msg.Data.Args = [sessionType, password, params];
                                            msg.ModuleID = "";
                                        
                                            this.Send(msg);
                                            
                                        }.bind(this),
                                        RegisteredSession: function(sessionType, password){
                                            var msg = new CJOSServerMessage();
                                            msg.SessionID = this.mainSessionID;
                                            msg.UserID = this.userID; 
                                            msg.Data.Type = "createRegisteredSession";
                                            msg.Data.Args = [sessionType, password];
                                            msg.ModuleID = "";
                                        
                                            this.Send(msg);
                                        }.bind(this),
                                        Module: function(moudule, password){
                                            var msg = new CJOSServerMessage();
                                            msg.SessionID = "";
                                            msg.UserID = this.userID; 
                                            msg.Data.Type = "createModule";
                                            msg.Data.Args = [password];
                                            msg.ModuleID = module;
                                            this.Send(msg);
                                        }.bind(this),
                                        Function: function(module, funcName, funcBody, funcInput){
                                            var msg = new CJOSServerMessage();
                                            msg.SessionID = "";
                                            msg.UserID = this.userID; 
                                            msg.Data.Type = "createFunction";
                                            msg.Data.Args = [module, funcName, funcBody, funcInput];
                                            msg.ModuleID = module;
                                            this.Send(msg);
                                        }.bind(this),
                                        Message: function(){
                                            var msg =  new CJOSServerMessage();
                                            msg.UserID = this.userID;
                                            return msg;
                                        }.bind(this)
                                    }
                                    this.Get = {
                                        SessionList: function(sessionType){
                                            var msg = new CJOSServerMessage();
                                            msg.SessionID = this.mainSessionID;
                                            msg.UserID = this.userID; 
                                            msg.Data.Type = "getList";
                                            msg.Data.Args = [sessionType];
                                            msg.ModuleID = "";
                                        
                                            this.Send(msg);
                                        }.bind(this),
                                        SessionPropertyTypes: function(sessionID){
                                            var msg = new CJOSServerMessage();
                                            msg.SessionID = sessionID;
                                            msg.UserID = this.userID; 
                                            msg.Data.Type = "getSessionProperties";
                                            msg.Data.Args = [];
                                            msg.ModuleID = "";
                                        
                                            this.Send(msg);
                                        }.bind(this),
                                        SessionPropertyValues: function(sessionID){
                                            var msg = new CJOSServerMessage();
                                            msg.SessionID = sessionID;
                                            msg.UserID = this.userID; 
                                            msg.Data.Type = "getSessionValues";
                                            msg.Data.Args = [];
                                            msg.ModuleID = "";
                                        
                                            this.Send(msg);
                                        }.bind(this)
                                    }
                                    this.Set = {
                                        SessionProperty: function(session, key, value){
                                            var msg = new CJOSServerMessage();
                                            msg.SessionID = session;
                                            msg.UserID = this.userID; 
                                            msg.Data.Type = "setSessionProperty";
                                            msg.Data.Args = [key,value];
                                            msg.ModuleID = "";
                                        
                                            this.Send(msg);
                                        }.bind(this)
                                    }
                                    this.JoinSession = function(session, password){
                                        var msg = new CJOSServerMessage();
                                        msg.SessionID = session;
                                        msg.UserID = this.userID; 
                                        msg.Data.Type = "joinSession";
                                        msg.Data.Args = [password];
                                        msg.ModuleID = "";
                                        
                                        this.Send(msg);
                                    };
                                    this.Broadcast = function(session, data){
                                        var msg = new CJOSServerMessage();
                                        msg.SessionID = session;
                                        msg.UserID = this.userID; 
                                        msg.Data.Type = "sessionBroadcast";
                                        msg.Data.Args = [data];
                                        msg.ModuleID = "";
                                        
                                        this.Send(msg);
                                    }
                                    this.LeaveSession = function(session){
                                        var msg = new CJOSServerMessage();
                                        msg.SessionID = session;
                                        msg.UserID = this.userID; 
                                        msg.Data.Type = "leaveSession";
                                        msg.ModuleID = "";
                                        
                                        this.Send(msg);
                                    }
                                    this.AccessModule = function(session, module, password){
                                        var msg = new CJOSServerMessage();
                                        msg.SessionID = session;
                                        msg.UserID = this.userID; //"MainSession";
                                        msg.Data.Type = "accessModule";
                                        msg.Data.Args = [password]; //["godfather"];
                                        msg.ModuleID = module; //"AdminModule";
                                        
                                        this.Send(msg);
                                    };
                                    
                                    
                                    this.ExecuteFunction = function(params, module, func){
                                        var msg = new CJOSServerMessage();
                                        msg.SessionID = ""
                                        msg.UserID = this.userID; 
                                        msg.Data.Type = "executeFunction";
                                        msg.Data.Args = [param];
                                        msg.ModuleID = module;
                                        
                                        this.Send(msg);
                                    };
                                    
                                    
                                }
                                
                                var CSocketIO = function(domain, port, path, id){
                                    //**********************
                                    //  PRIVATE ATTRIBUTES
                                    //**********************
                                    var PATH =  path;
                                    var DOMAIN = domain;
                                    var PORT = port;
                                    var ID = id;
                                    var socket = null;
                                    
                                    //**********************
                                    //   PRIVATE METHODS
                                    //**********************
                                    var _onOpen = function(){
                                        
                                        if(this.Events.onOpen){
                                            this.Events.onOpen();
                                        }
                                        
                                    }.bind(this);
                                    
                                    var _onClose = function(){
                                        
                                        if(this.Events.onClose){
                                            this.Events.onClose();
                                        }
                                    }.bind(this);
                                    
                                    var _onMessage = function(msg){
                                        if(this.Events.onMessage){
                                            this.Events.onMessage(msg);
                                        }
                                    }.bind(this);
                                    
                                    var _onError = function(e){
                                        
                                        if(this.Events.onError){
                                            this.Events.onError(e);
                                        }
                                        
                                        
                                    }.bind(this);
                                    
                                    //**********************
                                    //   PUBLIC ATTRIBUTES
                                    //**********************
                                    
                                    this.Events = {
                                        onOpen: null,
                                        onMessage: null,
                                        onClose: null,
                                        onError: null
                                    };
                                    
                                    //**********************
                                    //   PUBLIC METHODS
                                    //**********************
                                    
                                    this.GetID = function(){
                                        return ID;
                                    }
                                    
                                    this.Open = function(){
                                        
                                        if(socket == null){
                                            socket = io.connect( DOMAIN + ":" + PORT +"/" + PATH);                                            
                                            socket.on("connect", _onOpen);
                                            socket.on("disconnect" , _onClose);
                                            socket.on("message" , _onMessage);
                                            socket.on("error" , _onError);    
                                        }
                                         
                                    };
                                    
                                    this.Close = function(){
                                         
                                         
                                    };
                                    
                                    this.Send = function(msg){
                                         socket.send(msg);
                                    }
                                    
                                }
                                var CWebSocket = function(domain, port, path, id){
                                    
                                    //**********************
                                    //  PRIVATE ATTRIBUTES
                                    //**********************
                                    var PATH =  path;
                                    var DOMAIN = domain;
                                    var PORT = port;
                                    var ID = id;
                                    var socket = null;
                                    
                                    //**********************
                                    //   PRIVATE METHODS
                                    //**********************
                                    
                                    
                                    var _OnOpenFunc = function(msg){
                                         this.state = socket.readyState;
                                         if(this.Event.onConnect != null){
                                             this.Event.onConnect();
                                         }
                                    }.bind(this);
                                    
                                    var _OnCloseFunc = function(msg){
                                         this.state = socket.readyState;
                                         if(this.Events.onClose != null){
                                             this.Events.onClose();
                                         }
                                    }.bind(this);
                                    
                                    var _OnMessageFunc = function(msg){
                                         this.state = socket.readyState;
                                         if(this.Events.onMessage != null){
                                             this.Events.onMessage();
                                         }
                                    }.bind(this);
                                    
                                    var _OnErrorFunc = function(){
                                         this.state = socket.readyState;
                                         if(this.Events.onError != null){
                                             this.Events.onError();
                                         }
                                    }.bind(this);
                                    
                                    //**********************
                                    //   PUBLIC ATTRIBUTES
                                    //**********************
                                    this.Events = {
                                        onOpen: null,
                                        onMessage: null,
                                        onClose: null,
                                        onError: null
                                    };
                                    
                                    //**********************
                                    //   PUBLIC METHODS
                                    //**********************
                                    
                                    this.GetID = function(){
                                        return ID;
                                    }
                                    
                                    this.Open = function(){
                                         if(socket == null){
                                            socket = new WebSocket("ws://" + DOMAIN + ":" + PORT +"/" + PATH);
                                            this.state = socket.readyState;
                                            
                                            socket.onopen = _OnOpenFunc.bind(this);
                                            socket.onclose = _OnCloseFunc.bind(this);//function(){alert("Socket Closed");};
                                            socket.onmessage = _OnMessageFunc.bind(this);
                                            socket.onerror = _OnErrorFunc.bind(this);
                                            return this.state;
                                         }
                                         else{
                                             return "Already Initialized";
                                         }
                                    };
                                    
                                    this.Close = function(){
                                         socket.close();
                                    };
                                    
                                    this.Send = function(msg){
                                         socket.send(msg);
                                    }
                                    
                                 };

                                return{
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
                                        
                                    },
                                    
                                    SocketManager:{
                                    
                                        Sockets: os.resschmgr.Create.Map(),
                                        
                                        CreateSocket: function(domain,port,path){
                                        
                                            //Get new ID for socket
                                            var id = (new Date()).getTime();
                                            
                                            //Create new socket
                                            var socket = new CWebSocket(domain, port, path, id);
                                        
                                            //register socket with Socket Manager
                                            this.Sockets.put(id, socket);
                                        
                                            return socket;
                                        }
                                        
                                        
                                    },
                                    Create: {
                                        Socket: function(domain,port,path){
                                            //Get new ID for socket
                                            var id = (new Date()).getTime();
                                            
                                            //Create new socket
                                            var socket = new CWebSocket(domain, port, path, id);
                                        
                                            //register socket with Socket Manager
                                            os.network.SocketManager.Sockets.put(id, socket);
                                        
                                            return socket;
                                        },
                                        SocketIO: function(domain, port, path){
                                            //Get new ID for socket
                                            var id = (new Date()).getTime();
                                            
                                            //Create new socket
                                            var socket = new CSocketIO(domain, port, path, id);
                                        
                                            //register socket with Socket Manager
                                            os.network.SocketManager.Sockets.put(id, socket);
                                        
                                            return socket;
                                        },
                                        JOSServer: function(domain,port,path){
                                            var joss = new CJOSServer();
                                            
                                            //Test to see if socket.io is installed
                                            if(io){
                                                joss.socket = os.network.Create.SocketIO(domain, port, path);
                                            }
                                            else{
                                                joss.socket = os.network.Create.Socket(domain, port, path);
                                            }
                                            
                                            return joss;
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