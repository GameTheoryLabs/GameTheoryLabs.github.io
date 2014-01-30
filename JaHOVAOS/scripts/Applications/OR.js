var ORInit = function(){
    //Load Threads
    //ORLoad.Threads();
    
    
    //Load Graphics Core
    os.console.Comment("Loading Graphics...");
    ORLoad.Graphics();
    
    //Loade Mesh Models Single Threaded
    os.console.Comment("Requesting Models...");
    ORLoad.Models();
    
    //Load Textures
    os.console.Comment("Requesting Textures...");
    ORLoad.Textures();
    
    //Load Meshes
    os.console.Comment("Loading Primitives...");
    ORLoad.Meshes();
    
    //Load Audio
    os.console.Comment("Requesting Audio...");
    ORLoad.Audio();
    
    //Load Skybox
    os.console.Comment("Requesting Skybox...");
    ORLoad.Skybox();

    
}
var ORLoad = {
    Models: function(){
        
        ORMeshMgr.Requested = 4;
        
        
        var ss = os.graphics.Managers.Mesh.Create.Mesh("spacestation", "scripts/jahova/OS/Cores/Graphics/meshes/spacestation.json");
        ss.onLoad = function(){
            os.console.Comment("Loaded Space Station");
            ORMeshMgr.Loaded++;
            ORAssetComplete();
        }
        
        var f1 = os.graphics.Managers.Mesh.Create.Mesh("fighter1", "scripts/jahova/OS/Cores/Graphics/meshes/fighter1.json");
        f1.onLoad = function(){
            os.console.Comment("Loaded Fighter 1");
            ORMeshMgr.Loaded++;
            ORAssetComplete();
        }
        
        var f2 = os.graphics.Managers.Mesh.Create.Mesh("fighter2", "scripts/jahova/OS/Cores/Graphics/meshes/fighter2.json");
        f2.onLoad = function(){
            os.console.Comment("Loaded Fighter 2");
            ORMeshMgr.Loaded++;
            ORAssetComplete();
        }
        
        var gs = os.graphics.Managers.Mesh.Create.Mesh("gunship", "scripts/jahova/OS/Cores/Graphics/meshes/gunship.json");
        gs.onLoad = function(){
            os.console.Comment("Loaded Gunship");
            ORMeshMgr.Loaded++;
            ORAssetComplete();
        }
        
        ORAIPhysicsMgr.Online = true;
    },
    Threads: function(){
        os.console.Comment("Creating Thread Controller");
        os.threads.ThreadManager.CreateThreadController(ORThreads.Callbacks.Controller);
        
        if(os.threads.ThreadManager.SharedWorkers){
            os.console.Comment("Setting Shared Worker File Paths");
            
            ORThreads.Paths.MeshLoader = "scripts/Applications/Threads/mesh_shared.js";
            ORMeshMgr.Requested = 4;
            
            ORThreads.Paths.PhysicsAI = "scripts/Applications/Threads/PhysicsAI_shared.js";
            
        }
        else{
            os.console.Comment("Setting Nested Worker File Paths");
            ORThreads.Paths.MeshLoader = location.href.substr(0,location.href.lastIndexOf("/") + 1) + "scripts/Applications/Threads/mesh_nested.js";
            ORThreads.Paths.PhysicsAI = location.href.substr(0,location.href.lastIndexOf("/") + 1) + "scripts/Applications/Threads/PhysicsAI_nested.js";
            
        }
    },
    Graphics: function(){
        //Load WebGL (Debug: false, fullscreen: true)
        os.graphics.Load(false, true);
        os.graphics.Set.Callback.Draw(ORDraw);
        os.graphics.Set.Callback.Update(ORUpdate);
    },
    Textures: function(){
        ORTextureMgr.Requested = 6;
        var tex = null;
        tex = os.graphics.Managers.Texture.Create.Texture("fighter1", "scripts/jahova/OS/Cores/Graphics/textures/fighter1.jpg");
        tex.onLoad = function(){
            os.console.Comment("Loaded Texture: Fighter 1");
            ORTextureMgr.Loaded++;
            ORAssetComplete();
        }
        tex = os.graphics.Managers.Texture.Create.Texture("fighter2", "scripts/jahova/OS/Cores/Graphics/textures/fighter2.jpg");
        tex.onLoad = function(){
            os.console.Comment("Loaded Texture: Fighter 2");
            ORTextureMgr.Loaded++;
            ORAssetComplete();
        }
        tex = os.graphics.Managers.Texture.Create.Texture("gunship", "scripts/jahova/OS/Cores/Graphics/textures/gunship.jpg");
        tex.onLoad = function(){
            os.console.Comment("Loaded Texture: Gunship");
            ORTextureMgr.Loaded++;
            ORAssetComplete();
        }
        tex = os.graphics.Managers.Texture.Create.Texture("bullet", "scripts/jahova/OS/Cores/Graphics/textures/bullet.bmp");
        tex.onLoad = function(){
            os.console.Comment("Loaded Texture: Bullet");
            ORTextureMgr.Loaded++;
            ORAssetComplete();
        }
        tex = os.graphics.Managers.Texture.Create.Texture("forcefield", "scripts/jahova/OS/Cores/Graphics/textures/forcefield.png");
        tex.onLoad = function(){
            os.console.Comment("Loaded Texture: Forcefield");
            ORTextureMgr.Loaded++;
            ORAssetComplete();
        }
        tex = os.graphics.Managers.Texture.Create.Texture("spacestation", "scripts/jahova/OS/Cores/Graphics/textures/spacestation.jpg");
        tex.onLoad = function(){
            os.console.Comment("Loaded Texture: Space Station");
            ORTextureMgr.Loaded++;
            ORAssetComplete();
        }
    },
    Meshes: function(){
        
        var cube = os.graphics.Managers.Mesh.Create.Primitive.Cube("cube");
        cube.Initialize();
        
        var sphMesh = os.graphics.Managers.Mesh.Create.Primitive.Sphere("sphere");
        sphMesh.Initialize();
    },
    Entities: function(){
        ORObject.Entities = os.resschmgr.Create.Map();
        
        os.console.Comment("    Creating Fighter 1");
        var fighter1 = os.graphics.Managers.Entity.Create();
        fighter1.Graphics.Add.Mesh("fighter1");
        fighter1.Graphics.Add.Texture("fighter1");
        fighter1.Set.Scale(0.1,0.1,0.1);
        fighter1.Set.Position(300,-185,-800);
        fighter1.pitch = 0;
        fighter1.Graphics.Set.texture(true);
        mat4.rotateX(fighter1.Default.Offset, degToRad(-90), fighter1.Default.Offset);
        mat4.rotateZ(fighter1.Default.Offset, degToRad(180), fighter1.Default.Offset);
        fighter1.Physics = os.physics.Create.Entity(0.1);
        fighter1.Physics.linearDampening = 0.9;
        fighter1.Physics.angularDampening = 0.8;
        fighter1.Physics.position[0] = 300;
        fighter1.Physics.position[1] = -185;
        fighter1.Physics.position[2] = -800;
        fighter1.Physics.Add.InertialTensor(os.physics.Create.InertialTensor.Cube(fighter1.Physics,20,20,20));
        fighter1.Physics.CalculateDerivedData();
        fighter1.AI = os.ai.Create.Entity();
        fighter1.AI.name = "Fighter 1";
        fighter1.hits = 0;
        fighter1.type = "ENTITY";
        //os.graphics.AddToWorld(fighter1);
        ORObject.fighter1 = fighter1;
        ORObject.Entities.put(fighter1.Get.id(), fighter1);
        //os.threads.ThreadManager.SharedMemory.Set.Entry(fighter1.Get.id(), CreateSharedEntity(fighter1));
        //ORAIPhysicsMgr.AddEntity(fighter1);

        os.console.Comment("    Creating Fighter 2");
        var fighter2 = os.graphics.Managers.Entity.Create();
        fighter2.Graphics.Add.Mesh("fighter2");
        fighter2.Graphics.Add.Texture("fighter2");
        fighter2.Set.Scale(0.1,0.1,0.1);
        fighter2.Set.Position(-800,-200,250);
        fighter2.pitch = 0;
        fighter2.Graphics.Set.texture(true);
        //os.graphics.AddToWorld(fighter2);
        mat4.rotateX(fighter2.Default.Offset, degToRad(-90), fighter2.Default.Offset);
        mat4.rotateZ(fighter2.Default.Offset, degToRad(180), fighter2.Default.Offset);
        fighter2.Physics = os.physics.Create.Entity(0.1);
        fighter2.Physics.linearDampening = 0.9;
        fighter2.Physics.angularDampening = 0.8;
        fighter2.Physics.position[0] = -800;
        fighter2.Physics.position[1] = -200;
        fighter2.Physics.position[2] = 250;
        fighter2.Physics.Add.InertialTensor(os.physics.Create.InertialTensor.Cube(fighter2.Physics,20,20,20));
        fighter2.Physics.CalculateDerivedData();
        fighter2.AI = os.ai.Create.Entity();
        fighter2.AI.name = "Fighter 2";
        fighter2.hits = 0;
        fighter2.type = "ENTITY";
        ORObject.fighter2 = fighter2;
        ORObject.Entities.put(fighter2.Get.id(), fighter2);
        //os.threads.ThreadManager.SharedMemory.Set.Entry(fighter2.Get.id(), CreateSharedEntity(fighter2));
        //ORAIPhysicsMgr.AddEntity(fighter2);
        
        os.console.Comment("    Creating Gunship");
        var gunship = os.graphics.Managers.Entity.Create();
        gunship.Graphics.Add.Mesh("gunship");
        gunship.Graphics.Add.Texture("gunship");
        gunship.Set.Scale(5,5,5);
        gunship.pitch = 0;
        gunship.Set.Position(-800,-240,150);
        gunship.Graphics.Set.texture(true);
        gunship.orientation = quat4.create([0,0,0,1]);
        //os.graphics.AddToWorld(gunship);
        mat4.rotateX(gunship.Default.Offset, degToRad(-101), gunship.Default.Offset);
        ORObject.Entities.put(gunship.Get.id(), gunship);
        gunship.type = "ENTITY";
        //os.threads.ThreadManager.SharedMemory.Set.Entry(gunship.Get.id(), CreateSharedEntity(gunship));
        ORObject.gunship = gunship;
        //ORAIPhysicsMgr.AddEntity(gunship);
        
        os.console.Comment("    Creating Space Station");
        var station = os.graphics.Managers.Entity.Create();
        station.Graphics.Add.Mesh("spacestation");
        station.Graphics.Add.Texture("spacestation");
        station.Set.Scale(2,2,2);
        station.Set.Position(0,0,0);//(-800,0,800);
        station.pitch = 0;
        station.Graphics.Set.texture(true);
        mat4.rotateX(station.Default.Offset, degToRad(-90), station.Default.Offset);
        //os.graphics.AddToWorld(station);
        ORObject.station = station;
        
        os.console.Comment("    Creating Target");
        ORObject.Target.obj = os.resschmgr.Create.HTMLElement("div");
        ORObject.Target.html = ORObject.Target.obj.html();
        ORObject.Target.html.style.width = "25px";
        ORObject.Target.html.style.height = "25px";
        ORObject.Target.html.style.borderRadius = "25px";
        ORObject.Target.html.style.borderWidth = "2px";
        ORObject.Target.html.style.borderStyle = "solid";
        ORObject.Target.html.style.borderColor = "red";
        ORObject.Target.html.style.position = "absolute";
        ORObject.Target.html.style.top = 0;
        ORObject.Target.html.style.left = 0;
        
        ORObject.Target.obj.AppendTo(document.body);
        ORObject.Target.vp = mat4.create();
        ORObject.Target.position = [0,0,0,0];
        
        
        //ORAIPhysicsMgr.AI.EnableAI(fighter1.Get.id(), "Fighter 1");
        //ORAIPhysicsMgr.AI.EnableAI(fighter2.Get.id(), "Fighter 2");
        //
        //                         //id, vPosition, linearDamp, angDamp, invMass
        //ORAIPhysicsMgr.Physics.EnablePhysics(fighter1.Get.id(), fighter1.Physics.position, fighter1.Physics.linearDampening, fighter1.Physics.angularDampening, 0.1);
        //ORAIPhysicsMgr.Physics.EnablePhysics(fighter2.Get.id(), fighter2.Physics.position, fighter2.Physics.linearDampening, fighter2.Physics.angularDampening, 0.1);
        //
        //ORAIPhysicsMgr.SetSharedData();
            
  
    },
    Audio: function(){
        os.audio.Initialize();
        os.audio.Add("battle","scripts/Applications/Audio/BattleTheme",true, false);
        
        os.audio.Add("menu","scripts/Applications/Audio/MenuTheme",true, true);
        os.audio.Set.Volume("menu", 0.5);
        
        os.audio.Add("explosion","scripts/Applications/Audio/Explosion",false, false);
        os.audio.Set.Volume("explosion", 0.5);
        
        os.audio.Add("laser","scripts/Applications/Audio/Laser1",false, false);
        os.audio.Set.Volume("laser", 0.5);
        
        os.audio.Add("chirp","scripts/Applications/Audio/Chirp",false, false);
        os.audio.Set.Volume("chirp", 1.0);
        
        os.audio.Add("strike","scripts/Applications/Audio/missile_explosion",false, false);
        os.audio.Set.Volume("strike", 0.5);

        ORObject.Time.Cannon.last = (new Date()).getTime();
        ORObject.Time.Laser.last = (new Date()).getTime();
    
        os.audio.Play("menu");
        ORObject.CurrentSong = "menu";
    },
    Skybox: function(){
        //Load Skybox Textures
        var space = os.graphics.Managers.Texture.Create.CubeMap("skybox");
        space.callback = ORAssetComplete;
        space.Load.positiveX("scripts/jahova/OS/Cores/Graphics/textures/cubemaps/space/space_positive_x.png");
        space.Load.negativeX("scripts/jahova/OS/Cores/Graphics/textures/cubemaps/space/space_negative_x.png");
        space.Load.positiveY("scripts/jahova/OS/Cores/Graphics/textures/cubemaps/space/space_positive_y.png");
        space.Load.negativeY("scripts/jahova/OS/Cores/Graphics/textures/cubemaps/space/space_negative_y.png");
        space.Load.positiveZ("scripts/jahova/OS/Cores/Graphics/textures/cubemaps/space/space_positive_z.png");
        space.Load.negativeZ("scripts/jahova/OS/Cores/Graphics/textures/cubemaps/space/space_negative_z.png");
        
        //Load Skybox VS and FS
        os.graphics.Managers.Shader.Create.VertexShader("skybox", "scripts/jahova/OS/Cores/Graphics/shaders/skybox.vs");
        os.graphics.Managers.Shader.Create.FragmentShader("skybox", "scripts/jahova/OS/Cores/Graphics/shaders/skybox.fs");
    
        //Build Skybox Program and Link
        var prgSkybox = os.graphics.Managers.Shader.Create.Program("skybox", "skybox", "skybox");
        
        //Add Attributes to Skybox Program
        prgSkybox.CreateAttribute("aVertexPosition");
        prgSkybox.CreateAttribute("aVertexNormal");
                        
        //Add Uniforms to Skybox Program
        prgSkybox.CreateUniform("uPMatrix");
        prgSkybox.CreateUniform("uVMatrix");
        prgSkybox.CreateUniform("uWMatrix");
        prgSkybox.CreateUniform("uNMatrix");
        prgSkybox.CreateUniform("uSampler");
        
        //Create Entity with Skybox Program
        var skybox = os.graphics.Managers.Entity.Create("skybox");
        ORObject.skybox = skybox;
        
        //Create Shader
        var skyboxShader = skybox.Graphics.Add.Shader("skybox", "skybox");
        
        //Add Attributes
        skyboxShader.AddAttribute("aVertexPosition", "FLOAT", null, "VERTEX", null);
        skyboxShader.AddAttribute("aVertexNormal", "FLOAT", null, "NORMAL", null);
        
        //Add Uniforms to Entity
        skyboxShader.AddUniform("uPMatrix", "4X4", os.graphics.Matrix.Projection);
        skyboxShader.AddUniform("uVMatrix", "4X4", os.graphics.Matrix.View);
        skyboxShader.AddUniform("uWMatrix", "4X4", skybox.Graphics.Matrix.World);
        skyboxShader.AddUniform("uNMatrix", "3X3", skybox.Graphics.Matrix.Normal);
    
        //Build a Cube Primitive for Skybox
        var skyCube = os.graphics.Managers.Mesh.Create.Primitive.Cube("skybox");
        
        //Remove Texture Coordinate
        skyCube.model.vertexTextureCoords = null;
        
        //Initialize Mesh (i.e. Build Buffers, etc.)
        skyCube.Initialize();
        
        //Add Skybox Mesh and Texture to Skybox Entity
        skybox.Graphics.Add.Mesh("skybox");
        skybox.Graphics.Add.Texture("skybox");
        
        //Scale Skybox
        skybox.Set.Scale(5000,5000,5000);
    
        
        //Extend Attach Function
        skybox.Attach = function(ent){
            skybox.attachedEntity = ent;
            
            if(ent){
                skybox.attached = true;
            }
            else
                skybox.atached = false;
        }
        skybox.attached = false;
        skybox.attachedEntity = null;
        
        //Set Skybox to follow Camera
        skybox.Attach(os.graphics.Managers.Camera);
        
        //Add to world for Auto Update and Draw
        os.graphics.AddToUpdate(skybox);
        
        //Setup Update Function
        skybox.Graphics.Update = function(dt){
            if(skybox.attached){
                vec3.set(skybox.attachedEntity.Position, skybox.Position);
            }
        }.bind(skybox);
        
        
    },
    Input: function(){
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
            this.Update = function(rawORad){

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
        
        var CCallback = function(iID, fFunction, oScope){
            this.func = fFunction;
            this.scope =  oScope == undefined ? false : oScope;
            this.id = iID;
        }
        
        //Holds state of mouse for all registered states
        var _Mouse = {
            lastX: 0,
            lastY: 0,
            pressed: false
        }
        //      key: mouseEventType, value: Array[CCallbacks]
        var _MouseEvents = os.resschmgr.Create.Map();
        
        //Holds states/events of all keys
        //      key: keyCode, value: true/false
        var _KeyboardStates = os.resschmgr.Create.Map();
        //      key: keyCode, value: Array[CCallbacks];
        var _KeyDownEvents = os.resschmgr.Create.Map();
        var _KeyUpEvents = os.resschmgr.Create.Map();
        var _KeyDownControlKeyEvents = os.resschmgr.Create.Map();
        var _KeyUpControlKeyEvents = os.resschmgr.Create.Map();
        
        //Holds states/events of Gamepads
        //      key: gamepad Event Type, value: Gamepad Event Object
        var _GamepadEvents = os.resschmgr.Create.Map();
    
        var _Events = {
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
        os.input = {
            currentTime: 0,
            previousTime: 0,
            Update: function(dt){
                
                //Update current and check for new Gamepads
                os.input.Gamepads.Update(dt);
                
            },
            Get: {
                State: {
                    Mouse: function(){
                        return _Mouse;
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
                                _Events.Gamepad.Connect(os.input.Gamepads.Raw.current[i])
                            }
                            else{
                                _Events.Gamepad.Disconnect(os.input.Gamepads.Raw.previous[i])
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
            
            Initialize: function(){
                _MouseEvents.put("DOWN", []);
                _MouseEvents.put("UP", []);
                _MouseEvents.put("MOVE", []);
                
                _GamepadEvents.put("CONNECT", []);
                _GamepadEvents.put("DISCONNECT",[]);
                
                os.input.Gamepads.current = os.resschmgr.Create.Map();
                os.input.Gamepads.previous = os.resschmgr.Create.Map();
                
                window.addEventListener("keydown", _Events.Keyboard.Keydown, false);
                window.addEventListener("keyup", _Events.Keyboard.Keyup, false);
                os.graphics.Get.Canvas().addEventListener("mousedown", _Events.Mouse.Down, false);
                document.addEventListener("mouseup", _Events.Mouse.Up, false);
                document.addEventListener("mousemove", _Events.Mouse.Move, false);
            }
        }
        
        os.input.Initialize();
        
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
                    },
                    Avoidance: function(){
                        self.MovementAlgorithms.Avoidance = false;
                    }
                },
                maxForce: 100
            }
        }
        
        var CSeekPosition = function(oEntity, vTarget){
            
            var self = this;
            this.entity = oEntity;
            this.Update = function(){
                var desired = [];
                var applied = [];
                
                //Desired Velocity
                vec3.subtract(self.target,self.entity.Physics.position, desired);
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
            
            this.target = vTarget;
            
            
        }
        var CSeekEntity = function(oEntity, oTarget){
            var self = this;
            this.entity = oEntity;
            this.Update = function(){
                var t = [];
                t = self.target.Physics ? self.target.Physics.position : self.target.Position;
                var desired = [];
                var applied = [];
                
                //Desired Velocity
                vec3.subtract(t,self.entity.Physics.position, desired);
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
                t = self.target.Physics ? self.target.Physics.position : self.target.Position;
                var desired = [];
                var applied = [];
                
                //Desired Velocity
                vec3.subtract(self.entity.Physics.position,t, desired);
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
             var self = this;
            this.entity = oEntity;
            this.Update = function(){
                var desired = [];
                var applied = [];
                var distance = [];
                //Calculate Distance
                vec3.subtract(self.target, self.entity.Physics.position, distance);
                distance = Math.sqrt(vec3.dot(distance, distance));
                
                //Desired Velocity
                vec3.subtract(self.target,self.entity.Physics.position, desired);
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
                if(distance < (2 * self.offsetDistance)){
                    
                    if(vec3.length(applied) > (self.entity.AI.Movement.maxForce / 10)){
                        vec3.normalize(applied, applied);
                        vec3.scale(applied, self.entity.AI.Movement.maxForce / 10);
                    }
                    
                }else{
                    if(vec3.length(applied) > self.entity.AI.Movement.maxForce){
                        vec3.normalize(applied, applied);
                        vec3.scale(applied, self.entity.AI.Movement.maxForce);
                    }
                }
                
                
                if(distance > self.offsetDistance){
                    //Apply Force
                    os.physics.Create.Force.Impulse(self.entity.Physics,[0,0,-1],applied);
                }
                else{
                    //self.entity.AI.MovementAlgorithms.ArrivePosition = false;
                }
                
                
            }
            
            this.target = vTarget;
            this.offsetDistance = 100;
        }
        
        var CArriveEntity = function(){
            
        }
        var CHideEntity = function(oEntity, oTarget, vHidingPositions, vOffsets){
            var self = this;
            this.entity = oEntity;
            this.Update = function(){
                
                var flee = [];
                flee = self.target.Physics ? self.target.Physics.position : self.target.Position;
                
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
                    vec3.subtract(position, self.entity.Physics.position, direction);
                    
                    if(distance == 0){distance = vec3.length(direction)}
                    
                    //Find cloesest point to target 
                    if(vec3.length(direction) < distance){
                        
                        vec3.set(position, target);
                    }
                
                }
                
                var desired = [];
                var applied = [];
                
                
                //Desired Velocity
                vec3.subtract(target,self.entity.Physics.position, desired);
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
                vec3.add(self.entity.Physics.position, VoDt, position);
                
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
                vec3.subtract(position,self.entity.Physics.position, desired);
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
            this.bv = os.physics.Create.BV.OBB(null,self.halfSize,self.entity.Physics.position);
            this.bv.name = oEntity.ID();
            
            this.Update = function(){
                for(var i = self.obstacles.length - 1; i >= 0; i--){
                    collision = self.bv.CollisionTest(self.obstacles[i]);
                    
                    if(collision){
                        //Position = OBB Cloesest Point + (radius * normal)
                        var distance = [];
                        vec3.subtract(collision.point.obj1, self.entity.Physics.position, distance);
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
        var _MovementAlgorithms = os.resschmgr.Create.Map();
        
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
        
        os.ai = {
            Initialize: function(){
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
                            
                            algo[j].entity.AI.MovementAlgorithms[type] ? algo[j].Update(dt) : algo.splice(j,1);
                            
                        }
                    }
                }
            }
        }
        
        os.ai.Initialize();
    },
    ParticleEffects: function(){
        //Initialize Particle Systems
        ParticleManager.Initalize();
    
        ORObject.Thursters.Gunship.left = ParticleManager.Create("thruster1");
        ORObject.Thursters.Gunship.left.Attach(ORObject.gunship);
        ORObject.Thursters.Gunship.left.Set.Scale(2,2,2);
        ORObject.Thursters.Gunship.left.Set.Offset(-3,-3.5,-10)
        ParticleManager.Start(ORObject.Thursters.Gunship.left.id);
        
        
        ORObject.Thursters.Gunship.right = ParticleManager.Create("thruster1");
        ORObject.Thursters.Gunship.right.Attach(ORObject.gunship);
        ORObject.Thursters.Gunship.right.Set.Scale(2,2,2);
        ORObject.Thursters.Gunship.right.Set.Offset(3,-3.5,-10)
        ParticleManager.Start(ORObject.Thursters.Gunship.right.id);
        
        ORObject.Thursters.Fighter2.right = ParticleManager.Create("thruster1");
        ORObject.Thursters.Fighter2.right.Attach(ORObject.fighter2);
        ORObject.Thursters.Fighter2.right.Set.Scale(2,2,2);
        ORObject.Thursters.Fighter2.right.Set.Offset(3,0,-17 )
        ParticleManager.Start(ORObject.Thursters.Fighter2.right.id);
        
        ORObject.Thursters.Fighter2.left = ParticleManager.Create("thruster1");
        ORObject.Thursters.Fighter2.left.Attach(ORObject.fighter2);
        ORObject.Thursters.Fighter2.left.Set.Scale(2,2,2);
        ORObject.Thursters.Fighter2.left.Set.Offset(-3,0,-17 )
        ParticleManager.Start(ORObject.Thursters.Fighter2.left.id);
        
        ORObject.Thursters.Fighter1.botRight = ParticleManager.Create("thruster1");
        ORObject.Thursters.Fighter1.botRight.Attach(ORObject.fighter1);
        ORObject.Thursters.Fighter1.botRight.Set.Scale(1,1,1);
        ORObject.Thursters.Fighter1.botRight.Set.Offset(3.5,-1,-10)
        ParticleManager.Start(ORObject.Thursters.Fighter1.botRight.id);
        
        ORObject.Thursters.Fighter1.topRight = ParticleManager.Create("thruster1");
        ORObject.Thursters.Fighter1.topRight.Attach(ORObject.fighter1);
        ORObject.Thursters.Fighter1.topRight.Set.Scale(1,1,1);
        ORObject.Thursters.Fighter1.topRight.Set.Offset(3.5,1,-9)
        ParticleManager.Start(ORObject.Thursters.Fighter1.topRight.id);
        
        ORObject.Thursters.Fighter1.botLeft = ParticleManager.Create("thruster1");
        ORObject.Thursters.Fighter1.botLeft.Attach(ORObject.fighter1);
        ORObject.Thursters.Fighter1.botLeft.Set.Scale(1,1,1);
        ORObject.Thursters.Fighter1.botLeft.Set.Offset(-4.5,-1,-9)
        ParticleManager.Start(ORObject.Thursters.Fighter1.botLeft.id);
        
        ORObject.Thursters.Fighter1.topLeft = ParticleManager.Create("thruster1");
        ORObject.Thursters.Fighter1.topLeft.Attach(ORObject.fighter1);
        ORObject.Thursters.Fighter1.topLeft.Set.Scale(1,1,1);
        ORObject.Thursters.Fighter1.topLeft.Set.Offset(-4,1,-9)
        ParticleManager.Start(ORObject.Thursters.Fighter1.topLeft.id);
        
        ORObject.Explosions.Gunship = ParticleManager.Create("explosion");
        ORObject.Explosions.Gunship.Attach(ORObject.gunship);
        ORObject.Explosions.Gunship.Set.Scale(4,4,4);
        ORObject.Explosions.Gunship.Set.Offset(0,0,8);
        ParticleManager.Start(ORObject.Explosions.Gunship.id);
        
        ORObject.Explosions.Fighter1 = ParticleManager.Create("explosion");
        ORObject.Explosions.Fighter1.Attach(ORObject.fighter1);
        ORObject.Explosions.Fighter1.Set.Scale(4,4,4);
        ORObject.Explosions.Fighter1.Set.Offset(0,0,8);
        ParticleManager.Start(ORObject.Explosions.Fighter1.id);
        
        ORObject.Explosions.Fighter2 = ParticleManager.Create("explosion");
        ORObject.Explosions.Fighter2.Attach(ORObject.fighter2);
        ORObject.Explosions.Fighter2.Set.Scale(4,4,4);
        ORObject.Explosions.Fighter2.Set.Offset(0,0,8);
        ParticleManager.Start(ORObject.Explosions.Fighter2.id);
            
        
        
    },
    
    Controls: function(){
        var ORConnected = function(gamepad){
            //os.windows.Create.MessageWindow("OR Connected", "OR[" + gamepad.id + "]<br/> Type: " + gamepad.type );
        }
        
        var ORDisconnected = function(gamepad){
            os.windows.Create.MessageWindow("Gamepad Disconnected", "Gamepad[" + gamepad.id + "]<br/> Type: " + gamepad.type  );
        }
        
        var CameraRotate = function(e){
            var cam = os.graphics.Managers.Camera;
                        
            var newX = e.clientX;
            var newY = e.clientY;
            
            var deltaX = newX - os.input.Get.State.Mouse().lastX
            cam.Rotation.yaw += deltaX / 10;
            
            if(cam.Rotation.yaw > 360){ cam.Rotation.yaw  -= 360;}
            else if(cam.Rotation.yaw < 0) { cam.Rotation.yaw += 360; }
            
            var deltaY = newY - os.input.Get.State.Mouse().lastY;
            cam.Rotation.pitch += deltaY / 10;
            if(cam.Rotation.pitch > 360){ cam.Rotation.pitch  -= 360;}
            else if(cam.Rotation.pitch < 0) { cam.Rotation.pitch += 360; }
            
            
            if(os.graphics.Managers.Camera.attached){
                ORObject.gunship.yaw = cam.Rotation.yaw;
                ORObject.gunship.pitch = cam.Rotation.pitch;
                //ORAIPhysicsMgr.UpdateEntity(ORObject.gunship);
            }
        }
    
        var MoveShip = function(e){
            
            if(String.fromCharCode(e.keyCode) == "W" || e.keyCode == 38){          //Straif Forward
                //os.physics.Create.Force.LocalImpulse(ORObject.fighter2.Physics,[0,0,0],[0,0,800]);
                ORKeys.w = true;
            }
            else if(String.fromCharCode(e.keyCode) == "A" || e.keyCode == 37){     //Straif Left
                ORKeys.a = true;
            }
            else if(String.fromCharCode(e.keyCode) == "S" || e.keyCode == 40){     //Straif Backward
                ORKeys.s = true;
            }
            else if(String.fromCharCode(e.keyCode) == "D" || e.keyCode == 39){     //Straif Right
                ORKeys.d = true;
            }
        }
        var KeyUp = function(e){
            if(String.fromCharCode(e.keyCode) == "W" || e.keyCode == 38){          //Straif Forward
                //os.physics.Create.Force.LocalImpulse(ORObject.fighter2.Physics,[0,0,0],[0,0,800]);
                ORKeys.w = false;
            }
            else if(String.fromCharCode(e.keyCode) == "A" || e.keyCode == 37){     //Straif Left
                ORKeys.a = false;
            }
            else if(String.fromCharCode(e.keyCode) == "S" || e.keyCode == 40){     //Straif Backward
                ORKeys.s = false;
            }
            else if(String.fromCharCode(e.keyCode) == "D" || e.keyCode == 39){     //Straif Right
                ORKeys.d = false;
            }
        }
        var Actions = function(e){
            if(e.keyCode == 32){          //Fire
                if(ORObject.Time.Laser.last + os.audio.Get.Duration("laser") * 1000 < os.graphics.Time.current){
                    os.audio.Play("laser");
                    ORObject.Time.Laser.last = os.graphics.Time.current;
                    bullet = new CORBullet(ORObject.gunship)
                    bullet.AddGraphic([-7.8,1.8,16.15]);
                    bullet.AddGraphic([-7.8,0.8,16.15]);
                    bullet.AddGraphic([7.8,1.8,16.15]);
                    bullet.AddGraphic([7.8,0.8,16.15]);
                    
                }
            }
            else if(String.fromCharCode(e.keyCode) == "Q"){ // Ships Attack
                if(!ORObject.fighter2.AI.MovementAlgorithms.SeekEntity){
                    os.audio.Play("chirp");
                    os.audio.Play("battle");
                    ORObject.CurrentSong = "battle";
                    os.audio.Pause("menu");
                    ORObject.Thursters.Fighter2.left.Start();
                    ORObject.Thursters.Fighter2.right.Start();
                    ORObject.Thursters.Fighter1.botLeft.Start();
                    ORObject.Thursters.Fighter1.botRight.Start();
                    ORObject.Thursters.Fighter1.topLeft.Start();
                    ORObject.Thursters.Fighter1.topRight.Start();
                    
                    ORObject.fighter2.AI.Movement.Disable.Hide.Entity();
                    ORObject.fighter2.AI.Movement.Disable.Patrol.Circle();
                    ORObject.fighter1.AI.Movement.Disable.Hide.Entity();
                    ORObject.fighter1.AI.Movement.Disable.Patrol.Circle();
                    
                    os.ai.Movement.Add.Seek.Entity(ORObject.fighter2, ORObject.gunship);
                    os.ai.Movement.Add.Seek.Entity(ORObject.fighter1, ORObject.gunship);
                }
            }
            else if(String.fromCharCode(e.keyCode) == "E"){  //Ships Hide
                if(!ORObject.fighter2.AI.MovementAlgorithms.HideEntity ){
                    os.audio.Play("chirp");
                    os.audio.Play("menu");
                    ORObject.CurrentSong = "menu";
                    os.audio.Pause("battle");
                    
                    var hidingSpots = [];
                    hidingSpots.push([-660,15,910]);
                    hidingSpots.push([-1075,5,-350]);
                    hidingSpots.push([-5,10,-1130]);
                    hidingSpots.push([1075,10,-350]);
                    hidingSpots.push([670,5,915]);
                    offsets = [420,420,420,420,420];
                    
                    
                    
                    if(!ORObject.fighter2.AI.MovementAlgorithms.HideEntity ){
                        ORObject.fighter2.AI.Movement.Disable.Seek.Entity();
                        
                        ORObject.Thursters.Fighter2.left.Start();
                        ORObject.Thursters.Fighter2.right.Start();
                        
                        os.ai.Movement.Add.Hide.Entity(ORObject.fighter2, ORObject.gunship,hidingSpots,offsets);
                    }
                    if(!ORObject.fighter1.AI.MovementAlgorithms.HideEntity){
                        ORObject.fighter1.AI.Movement.Disable.Seek.Entity();
                        
                        ORObject.Thursters.Fighter1.botLeft.Start();
                        ORObject.Thursters.Fighter1.botRight.Start();
                        ORObject.Thursters.Fighter1.topLeft.Start();
                        ORObject.Thursters.Fighter1.topRight.Start();
                        
                        os.ai.Movement.Add.Hide.Entity(ORObject.fighter1, ORObject.gunship,hidingSpots,offsets);
                    }
                }
            }
            else if(String.fromCharCode(e.keyCode) == "C"){ //Toggle Camera
                
                os.audio.Play("chirp");
                if(os.graphics.Managers.Camera.attached){
                    var cam = os.graphics.Managers.Camera;
                    cam.Attach();
                    cam.Rotation.yaw = 0;
                    cam.Rotation.pitch = 0;
                    cam.Rotation.roll = 0;
                    cam.Position[0] = ORObject.gunship.Position[0];
                    cam.Position[1] = ORObject.gunship.Position[1];
                    cam.Position[2] = ORObject.gunship.Position[2];
                }
                else{
                    os.graphics.Managers.Camera.Attach(ORObject.gunship);
                    os.graphics.Managers.Camera.Offset = vec3.create([0,5,80]);
                }
            
                
            }
            else if(String.fromCharCode(e.keyCode) == "X"){ //Toogle Test/Debug
                if(ORObject.Debug.set){
                    ORObject.Debug.set = false;
                    ORObject.Debug.Win.Hide.window();
                }
                else{
                    ORObject.Debug.set = true;
                    ORObject.Debug.Win.Display.window();
                }
                
                
            }
            else if(String.fromCharCode(e.keyCode) == "O"){  //Music ON
                os.audio.Play("chirp");
                os.audio.Play(ORObject.CurrentSong);
            }
            else if(String.fromCharCode(e.keyCode) == "P"){  //Music OFF
                os.audio.Play("chirp");
                os.audio.Pause(ORObject.CurrentSong);
            }
            
        }
        
        
        
        os.input.Register.Mouse.Event.Move(CameraRotate);
        os.input.Register.Keyboard.Event.Keydown("W",MoveShip);
        os.input.Register.Keyboard.Event.Keydown(38,MoveShip);
        
        os.input.Register.Keyboard.Event.Keydown("A",MoveShip);
        os.input.Register.Keyboard.Event.Keydown(37,MoveShip);
        
        os.input.Register.Keyboard.Event.Keydown("S",MoveShip);
        os.input.Register.Keyboard.Event.Keydown(40,MoveShip);
        
        os.input.Register.Keyboard.Event.Keydown("D",MoveShip);
        os.input.Register.Keyboard.Event.Keydown(39,MoveShip);
        
        os.input.Register.Keyboard.Event.Keyup("W",KeyUp);
        os.input.Register.Keyboard.Event.Keyup(38,KeyUp);
        
        os.input.Register.Keyboard.Event.Keyup("A",KeyUp);
        os.input.Register.Keyboard.Event.Keyup(37,KeyUp);
        
        os.input.Register.Keyboard.Event.Keyup("S",KeyUp);
        os.input.Register.Keyboard.Event.Keyup(40,KeyUp);
        
        os.input.Register.Keyboard.Event.Keyup("D",KeyUp);
        os.input.Register.Keyboard.Event.Keyup(39,KeyUp);
        
        os.input.Register.Keyboard.Event.Keydown(32,Actions);
        os.input.Register.Keyboard.Event.Keydown("Q",Actions);
        os.input.Register.Keyboard.Event.Keydown("E",Actions);
        os.input.Register.Keyboard.Event.Keydown("C",Actions);
        os.input.Register.Keyboard.Event.Keydown("X",Actions);
        os.input.Register.Keyboard.Event.Keydown("O",Actions);
        os.input.Register.Keyboard.Event.Keydown("P",Actions);
        os.input.Register.Keyboard.Event.Keydown("Z",Actions);
        
        os.input.Register.Gamepad.Event.Connected(ORConnected);
        os.input.Register.Gamepad.Event.Disconnected(ORDisconnected);
        
        //AI collision Avoidance 20,6,30
        os.ai.Movement.Add.Avoidance(ORObject.fighter2,[20,6,100],os.physics.bvs.slice(0,18));
        os.ai.Movement.Add.Avoidance(ORObject.fighter1,[20,6,100],os.physics.bvs.slice(0,18));
        
        //os.ai.Movement.Add.Patrol.Circle(ORObject.fighter1, 1500, [0,0,0]);
        //ORAIPhysicsMgr.AI.Enable.Patrol.Circle(ORObject.fighter1.Get.id(), 1500, [0,0,0]);
        //os.ai.Movement.Add.Patrol.Circle(ORObject.fighter2, 1500, [0,0,0]);
        //ORAIPhysicsMgr.AI.Enable.Patrol.Circle(ORObject.fighter2.Get.id(), 1500, [0,0,0]);
      
    },
    Bullets: function(){
        ORObject.Bullets.list = [];
        ORObject.Bullets.graphics = os.graphics.Managers.Entity.Create();
        ORObject.Bullets.graphics.Graphics.Add.Mesh("cube");
        ORObject.Bullets.graphics.Graphics.Add.Texture("bullet");
        ORObject.Bullets.graphics.Graphics.Set.light(true);
        ORObject.Bullets.graphics.Graphics.Set.ambientColor([1.0,1.0,1.0]);
        ORObject.Bullets.graphics.Graphics.Set.specular(false);
        ORObject.Bullets.graphics.Set.Scale(0.2,0.2,1);
        ORObject.Bullets.graphics.Physics ={
            position: [],
            orientation: []
        }
        ORObject.Bullets.Update = function(dt){
            var cur = (new Date()).getTime();
            for( var i = ORObject.Bullets.list.length - 1; i >= 0; i--){
                var bullet = ORObject.Bullets.list[i];
                
                if((cur - bullet.fireTime) > bullet.duration){
                    ORObject.Bullets.list.splice(i,1);
                }
                else{
                    //No Collision
                    var distance = (1 * (bullet.speed  + 0.005) * 1.2 * dt);
                    bullet.Position[0] += bullet.Forward[0] * distance;
                    bullet.Position[1] += bullet.Forward[1] * distance;
                    bullet.Position[2] += bullet.Forward[2] * distance;
                    
                    for(var j = bullet.instances.length - 1; j >= 0; j--){
                        bullet.instances[j].Position[0] += bullet.Forward[0] * distance;
                        bullet.instances[j].Position[1] += bullet.Forward[1] * distance;
                        bullet.instances[j].Position[2] += bullet.Forward[2] * distance;
                    }
                }
            }
        }
        ORObject.Bullets.graphics.Update = ORObject.Bullets.Update;
        ORObject.Bullets.Draw = function(){
            for( var i = ORObject.Bullets.list.length - 1; i >= 0; i--){
                
                var bullet = ORObject.Bullets.list[i];
                quat4.set(bullet.orientation,ORObject.Bullets.graphics.Physics.orientation);
                
                for(var j = bullet.instances.length - 1; j >= 0; j--){
                    
                    ORObject.Bullets.graphics.Physics.position = bullet.instances[j].Position;
                    ORObject.Bullets.graphics.Graphics.Draw();
                }
                
            }
        }
        
        ORObject.Bullets.bv.graphics = os.graphics.Managers.Entity.Create();
        ORObject.Bullets.bv.graphics.Graphics.Add.Mesh("cube");
        ORObject.Bullets.bv.graphics.Set.Position(0, 5, -410);
        ORObject.Bullets.bv.graphics.Set.Scale(7.8, 1, 1);
        ORObject.Bullets.bv.graphics.Physics = {
            position: [],
            orientation: []
        }
        ORObject.Bullets.bv.graphics.Graphics.Set.useBlendColor(true);
        ORObject.Bullets.bv.graphics.Graphics.Set.texture(false);
        ORObject.Bullets.bv.graphics.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        //ORObject.Debug.bv.push(bv);

    },
    BoundingVolumes: function(){
        var bv;
        BuildOrientation = function(yaw, pitch, roll){
            
            var cosX = Math.cos(degToRad(pitch/2));
            var sinX = Math.sin(degToRad(pitch/2));
            
            var cosY = Math.cos(degToRad(yaw/2));
            var sinY = Math.sin(degToRad(yaw/2));
            
            var cosZ = Math.cos(degToRad(roll/2));
            var sinZ = Math.sin(degToRad(roll/2));
            
            var orient = quat4.create();
            orient[0] = sinX*cosY*cosZ + cosX*sinY*sinZ;
            orient[1] = cosX*sinY*cosZ + sinX*cosY*sinZ;
            orient[2] = cosX*cosY*sinZ + sinX*sinY*cosZ;
            orient[3] = -cosX*cosY*cosZ - sinX*sinY*sinZ;
            
            quat4.normalize(orient, orient);
            return orient;
        }
        
        //Spheres
        bv = os.physics.Create.BV.Sphere(null,400,[-660,15,910]);
        bv.name = 0;
        //ORAIPhysicsMgr.Physics.CreateBV.Sphere(400,[-660,15,910]);
        
        bv = os.physics.Create.BV.Sphere(null,400,[-1075,5,-350]);
        bv.name = 1;
        //ORAIPhysicsMgr.Physics.CreateBV.Sphere(400,[-1075,5,-350]);
        
        bv = os.physics.Create.BV.Sphere(null,400,[-5,10,-1130]);
        bv.name = 2;
        //ORAIPhysicsMgr.Physics.CreateBV.Sphere(400,[-5,10,-1130]);
        
        bv = os.physics.Create.BV.Sphere(null,400,[1075,10,-350]);
        bv.name = 3;
        //ORAIPhysicsMgr.Physics.CreateBV.Sphere(400,[1075,10,-350]);
        
        bv = os.physics.Create.BV.Sphere(null,400,[670,5,915]);
        bv.name = 4;
        //ORAIPhysicsMgr.Physics.CreateBV.Sphere(400,[670,5,915]);
        
        //Boxes
        bv = os.physics.Create.BV.OBB(null,[47,52.5,297],[-240,15,330]);
        bv.name = 5;
        bv.orientation = BuildOrientation(36,0,0);
        //ORAIPhysicsMgr.Physics.CreateBV.OBB([47,52.5,297],[-240,15,330],BuildOrientation(36,0,0));
        
        bv = os.physics.Create.BV.OBB(null,[47,52.5,297],[-405,10,-125]);
        bv.name = 6;
        bv.orientation = BuildOrientation(108,0,0);
        //ORAIPhysicsMgr.Physics.CreateBV.OBB([47,52.5,297],[-405,10,-125],BuildOrientation(108,0,0));
        
        bv = os.physics.Create.BV.OBB(null,[47,52.5,297],[0, 5, -410]);
        bv.name = 7;
        bv.orientation = BuildOrientation(0,0,0);
        //ORAIPhysicsMgr.Physics.CreateBV.OBB([47,52.5,297],[0, 5, -410],BuildOrientation(0,0,0));
        
        bv = os.physics.Create.BV.OBB(null,[47,52.5,297],[405, 10, -135]);
        bv.name = 8;
        bv.orientation = BuildOrientation(-108,0,0);
        //ORAIPhysicsMgr.Physics.CreateBV.OBB([47,52.5,297],[405, 10, -135],BuildOrientation(-108,0,0));
        
        bv = os.physics.Create.BV.OBB(null,[47,52.5,297],[240,15,330]);
        bv.name = 9;
        bv.orientation = BuildOrientation(-36,0,0);
        //ORAIPhysicsMgr.Physics.CreateBV.OBB([47,52.5,297],[240,15,330],BuildOrientation(-36,0,0));
        
        //Tower
        bv = os.physics.Create.BV.OBB(null,[94.75, 980, 97.75],[0,75,0]);
        bv.name = 10;
        bv.orientation = BuildOrientation(0,0,0);
        //ORAIPhysicsMgr.Physics.CreateBV.OBB([94.75, 980, 97.75],[0,75,0],BuildOrientation(0,0,0));
        
        bv = os.physics.Create.BV.Sphere(null,205,[0,-455,0]);
        bv.name = 11;
        //ORAIPhysicsMgr.Physics.CreateBV.Sphere(205,[0,-455,0]);
        
        bv = os.physics.Create.BV.Sphere(null,180,[0,435,0]);
        bv.name = 12;
        //ORAIPhysicsMgr.Physics.CreateBV.Sphere(180,[0,435,0]);
        
        ////Ring
        bv = os.physics.Create.BV.OBB(null,[174.5, 13.5, 23.5],[-295, 10, 105]);
        bv.name = 13;
        bv.orientation = BuildOrientation(71,0,0);
        //ORAIPhysicsMgr.Physics.CreateBV.OBB([174.5, 13.5, 23.5],[-295, 10, 105],BuildOrientation(71,0,0));
        
        bv = os.physics.Create.BV.OBB(null,[174.5, 13.5, 23.5],[-185, 10, -255]);
        bv.name = 14;
        bv.orientation = BuildOrientation(-38,0,0);
        //ORAIPhysicsMgr.Physics.CreateBV.OBB([174.5, 13.5, 23.5],[-185, 10, -255],BuildOrientation(-38,0,0));
        
        bv = os.physics.Create.BV.OBB(null,[174.5, 13.5, 23.5],[185, 10, -255]);
        bv.name = 15;
        bv.orientation = BuildOrientation(38,0,0);
        //ORAIPhysicsMgr.Physics.CreateBV.OBB([174.5, 13.5, 23.5],[185, 10, -255],BuildOrientation(38,0,0));
        
        bv = os.physics.Create.BV.OBB(null,[174.5, 13.5, 23.5],[295, 10, 105]);
        bv.name = 16;
        bv.orientation = BuildOrientation(-71,0,0);
        //ORAIPhysicsMgr.Physics.CreateBV.OBB([174.5, 13.5, 23.5],[295, 10, 105],BuildOrientation(-71,0,0));
        
        bv = os.physics.Create.BV.OBB(null,[174.5, 13.5, 23.5],[0, 5, 315]);
        bv.name = 17;
        bv.orientation = BuildOrientation(0,0,0);
        //ORAIPhysicsMgr.Physics.CreateBV.OBB([174.5, 13.5, 23.5],[0, 5, 315],BuildOrientation(0,0,0));
        
        //Gunship
        bv = os.physics.Create.BV.Sphere(null,12,ORObject.gunship.Position);
        bv.name = 18;
        //ORAIPhysicsMgr.Physics.CreateBV.Sphere(12,ORObject.gunship.Position);
        
        //Fighter
        bv = os.physics.Create.BV.Sphere(null,12,ORObject.fighter2.Physics.position);
        bv.name = 19;
        //ORAIPhysicsMgr.Physics.CreateBV.Sphere(12,ORObject.fighter2.Physics.position);
        
        bv = os.physics.Create.BV.Sphere(null,12,ORObject.fighter1.Physics.position);
        bv.name = 20;
        //ORAIPhysicsMgr.Physics.CreateBV.Sphere(12,ORObject.fighter1.Physics.position);
        
        ORObject.Bullets.bv.obj = os.physics.Create.BV.OBB(null,[7.8, 1, 1],[0, 0, 0]);
        ORObject.Bullets.bv.obj.name = 21;
        ORObject.Bullets.bv.obj.orientation = BuildOrientation(0,0,0);
        //ORAIPhysicsMgr.Physics.CreateBV.OBB([7.8, 1, 1],[0, 0, 0],BuildOrientation(0,0,0));
        
        //bv = os.physics.Create.BV.OBB(null,[17.1,5.35,17.35],ORObject.gunship.Position);
        //bv.name = 17;
        //bv.orientation = ORObject.gunship.orientation; //BuildOrientation(0,0,0);
        
    },
    Debug: function(){
        
        
        ORObject.Debug.Win = os.windows.WindowsManager.Create.Window("Omega Resistance", "PC");
        ORObject.Debug.Win.Set.position(0,0);
        ORObject.Debug.Win.elements.content.html().style.overflow = "hidden";
        ORObject.Debug.Win.Set.statusbarText("");
        //ORObject.Debug.Win.Display.window();
        ORObject.Debug.Win.Set.width(200);
        ORObject.Debug.Win.Set.height(60);
        ORObject.Debug.Win.Hide.menubar();
        ORObject.Debug.Win.Set.onMax(os.graphics.OnReset);
        ORObject.Debug.Win.Set.onMin(os.graphics.Pause);
            
        //
        //  Bounding Volume Placement Development
        //
        var bv = null;
        var MoveBV = function(e){
            if(String.fromCharCode(e.keyCode) == "W"){
                if(bv){
                    bv.Position[2] += 5;
                }
            }
            else if(String.fromCharCode(e.keyCode) == "A"){
                if(bv){
                    bv.Position[0] -= 5;
                }
            }
            else if(String.fromCharCode(e.keyCode) == "S"){
                if(bv){
                    bv.Position[2] -= 5;
                }
            }
            else if(String.fromCharCode(e.keyCode) == "D"){
                if(bv){
                    bv.Position[0] += 5;
                }
            }
            else if(String.fromCharCode(e.keyCode) == "Q"){
                if(bv){
                    bv.Position[1] += 5;
                }
            }
            else if(String.fromCharCode(e.keyCode) == "E"){
                if(bv){
                    bv.Position[1] -= 5;
                }
            }
        }
        var RotateBV = function(e){
            if(e.keyCode == 38){  //Up Arrow
                if(bv){
                    bv.pitch += 1;
                }
            }
            else if(e.keyCode == 37){ //Left Arrow
                if(bv){
                    bv.yaw -= 1;
                }
            }
            else if(e.keyCode == 40){ //Down Arrow
                if(bv){
                    bv.pitch -= 1;
                }
            }
            else if(e.keyCode == 39){ //Right Arrow
                if(bv){
                    bv.yaw += 1;
                }
            }
        }
        var ScaleBV = function(e){
            if(String.fromCharCode(e.keyCode) == "Y"){      //Increase  X
                if(bv){
                    bv.Graphics.Vectors.Scale[0] += 0.25;
                }
            }
            else if(String.fromCharCode(e.keyCode) == "H"){ //Descrease X
                if(bv){
                    bv.Graphics.Vectors.Scale[0] -= 0.25;
                }
            }
            else if(String.fromCharCode(e.keyCode) == "U"){ //Increase  Y
                if(bv){
                    bv.Graphics.Vectors.Scale[1] += 0.25;
                }
            }
            else if(String.fromCharCode(e.keyCode) == "J"){ //Decrease  Y
                if(bv){
                    bv.Graphics.Vectors.Scale[1] -= 0.25;
                }
            }
            else if(String.fromCharCode(e.keyCode) == "I"){ //Increase  Z
                if(bv){
                    bv.Graphics.Vectors.Scale[2] += 0.25;
                }
            }
            else if(String.fromCharCode(e.keyCode) == "K"){ //Decrease Z
                if(bv){
                    bv.Graphics.Vectors.Scale[2] -= 0.25;
                }
            }
            else if(String.fromCharCode(e.keyCode) == "O"){ //Uniform Increase Scale
                if(bv){
                    bv.Graphics.Vectors.Scale[0]  += 0.25;
                    bv.Graphics.Vectors.Scale[1]  += 0.25;
                    bv.Graphics.Vectors.Scale[2] += 0.25;
                }
            }
            else if(String.fromCharCode(e.keyCode) == "L"){ //Uniform Decrease Scale
                if(bv){
                    bv.Graphics.Vectors.Scale[0]  -= 0.25;
                    bv.Graphics.Vectors.Scale[1]  -= 0.25;
                    bv.Graphics.Vectors.Scale[2] -= 0.25;
                }
            }
        }
        var ControlBV = function(e){                           
            if(String.fromCharCode(e.keyCode) == "R"){      //Reset Current Object
                
                bv.Set.Scale(1,1,1);
                bv.pitch = 0;
                bv.yaw = 0;
                
            }
            else if(String.fromCharCode(e.keyCode) == "T"){
                
            }
            else if(String.fromCharCode(e.keyCode) == "Z"){ //Create Box
                
                bv = os.graphics.Managers.Entity.Create();
                bv.Graphics.Add.Mesh("cube");
                bv.Set.Position(0,0,0);
                bv.Set.Scale(1.0,1.0,1.0);
                bv.Graphics.Set.useBlendColor(true);
                bv.Graphics.Set.texture(false);
                bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
                os.graphics.AddToWorld(bv);
                
                
            }
            else if(String.fromCharCode(e.keyCode) == "X"){ //Create Sphere
                bv = os.graphics.Managers.Entity.Create();
                bv.Graphics.Add.Mesh("sphere");
                bv.Set.Position(0,0,0);
                bv.Set.Scale(1,1,1);
                bv.Graphics.Set.useBlendColor(true);
                bv.Graphics.Set.texture(false);
                bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
                os.graphics.AddToWorld(bv);
            }
            else if(String.fromCharCode(e.keyCode) == "L"){  //Play Explosion
                ParticleManager.Start(ORObject.Explosions.Gunship.id);
            }
        }
        
        //          Movemnt Keys
        //os.input.Register.Keyboard.Event.Keydown("W",MoveBV);
        //os.input.Register.Keyboard.Event.Keydown("A",MoveBV);
        //os.input.Register.Keyboard.Event.Keydown("S",MoveBV);
        //os.input.Register.Keyboard.Event.Keydown("D",MoveBV);
        //os.input.Register.Keyboard.Event.Keydown("Q",MoveBV);
        //os.input.Register.Keyboard.Event.Keydown("E",MoveBV);
        //
        ////          Rotation Keys
        //os.input.Register.Keyboard.Event.Keydown(37,RotateBV);
        //os.input.Register.Keyboard.Event.Keydown(38,RotateBV);
        //os.input.Register.Keyboard.Event.Keydown(39,RotateBV);
        //os.input.Register.Keyboard.Event.Keydown(40,RotateBV);
        //
        ////          Scale Keys
        //os.input.Register.Keyboard.Event.Keydown("Y",ScaleBV);
        //os.input.Register.Keyboard.Event.Keydown("H",ScaleBV);
        //os.input.Register.Keyboard.Event.Keydown("U",ScaleBV);
        //os.input.Register.Keyboard.Event.Keydown("J",ScaleBV);
        //os.input.Register.Keyboard.Event.Keydown("I",ScaleBV);
        //os.input.Register.Keyboard.Event.Keydown("K",ScaleBV);
        //os.input.Register.Keyboard.Event.Keydown("O",ScaleBV);
        //os.input.Register.Keyboard.Event.Keydown("L",ScaleBV);
        //
        ////          Control
        //os.input.Register.Keyboard.Event.Keydown("R",ControlBV);
        //os.input.Register.Keyboard.Event.Keydown("T",ControlBV);
        //os.input.Register.Keyboard.Event.Keydown("Z",ControlBV);
        //os.input.Register.Keyboard.Event.Keydown("X",ControlBV);
        os.input.Register.Keyboard.Event.Keydown("L",ControlBV);

        //Spheres
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("sphere");
        bv.Set.Position(-660,15,910);
        bv.Set.Scale(20,20,20);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        ORObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("sphere");
        bv.Set.Position(-1075,5,-350);
        bv.Set.Scale(20,20,20);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        ORObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("sphere");
        bv.Set.Position(-5,10,-1130)
        bv.Set.Scale(20,20,20);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        ORObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("sphere");
        bv.Set.Position(1075,10,-350);
        bv.Set.Scale(20,20,20);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        ORObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("sphere");
        bv.Set.Position(670,5,915);
        bv.Set.Scale(20,20,20);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        ORObject.Debug.bv.push(bv);
        
        //Boxes
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(-240,15,330);
        bv.Set.Scale(47,52.5,297);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        bv.yaw = -36;
        ORObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(-405,10,-125);
        bv.Set.Scale(47,52.5,297);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        bv.yaw = -108;
        ORObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(0, 5, -410);
        bv.Set.Scale(47,52.5,297);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        ORObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(405, 10, -135);
        bv.Set.Scale(47,52.5,297);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        bv.yaw = 108;
        ORObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(240,15,330);
        bv.Set.Scale(47,52.5,297);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        bv.yaw = 36;
        ORObject.Debug.bv.push(bv);
        
        //Tower
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(0,75,0);
        bv.Set.Scale(94.75, 980, 97.75);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        ORObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("sphere");
        bv.Set.Position(0,-455,0);
        bv.Set.Scale(10.25,10.25,10.25);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        ORObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("sphere");
        bv.Set.Position(0,435,0);
        bv.Set.Scale(9,9,9);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        ORObject.Debug.bv.push(bv);
        
        //Ring
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(-295, 10, 105);
        bv.Set.Scale(174.5, 13.5, 23.5);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        bv.yaw = -71;
        ORObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(-185, 10, -255);
        bv.Set.Scale(174.5, 13.5, 23.5);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        bv.yaw = 38;
        ORObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(185, 10, -255);
        bv.Set.Scale(174.5, 13.5, 23.5);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        bv.yaw = -38;
        ORObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(295, 10, 105);
        bv.Set.Scale(174.5, 13.5, 23.5);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        bv.yaw = 71;
        ORObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(0, 5, 315);
        bv.Set.Scale(174.5, 13.5, 23.5);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        ORObject.Debug.bv.push(bv);
        
        //Gunship
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("sphere");
        bv.Position = ORObject.gunship.Position;
        bv.Set.Scale(0.6,0.6,0.6);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        ORObject.Debug.bv.push(bv);
        
        //bv = os.graphics.Managers.Entity.Create();
        //bv.Graphics.Add.Mesh("cube");
        //bv.Position = ORObject.gunship.Position;
        //bv.Set.Scale(17.1,5.35,17.35);
        //bv.Graphics.Set.useBlendColor(true);
        //bv.Graphics.Set.texture(false);
        //bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        ////os.graphics.AddToWorld(bv);
        //ORObject.Debug.bv.push(bv);
        
        //Fighter2
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("sphere");
        bv.Position = ORObject.fighter2.Physics.position;
        bv.Set.Scale(0.6,0.6,0.6);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        ORObject.Debug.bv.push(bv);
        
        //FIghter 1
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("sphere");
        bv.Position = ORObject.fighter1.Physics.position;
        bv.Set.Scale(0.6,0.6,0.6);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        ORObject.Debug.bv.push(bv);
    
    }
    
}
var ORThreads ={
    Callbacks: {
        Controller: function(msg){
            if(msg.msgType){
                //Shared Memory Objects Returned
                if((msg.msgType == "GetSharedMemory") ){
                    for(var i = 0; i < msg.data.length; i++){
                        MergeSharedEntity(msg.data[i]);
                    }
                }
                else if(msg.msgType == "GetSharedMemoryEntry"){
                    MergeSharedEntity(msg.data);
                }
                else if(msg.msgType == "GETACTIVETHREADS"){
                    var input = {};
                    input.type = "UPDATEACTIVETHREADS";
                    input.threads = msg.data;
                    ORThreads.Threads.MeshLoader.Execute(input);
                    ORThreads.Threads.PhysicsAI.Execute(input);
                }
            }
            else if(msg.data == "ONLINE"){
                os.console.Comment("Thread Controller: " + msg.data);
                ORThreads.Threads.MeshLoader = os.threads.ThreadManager.CreateThread("MeshLoader", "STATIC", 0, "true", ORThreads.Callbacks.MeshLoader ,ORThreads.Paths.MeshLoader, "0", "false", 0);
            }
            else{
                os.console.Comment("Thread Controller: " + msg.data);
            }
        },
        MeshLoader: function(msg){
            if(msg.data == "REGISTERED"){
                
                ORThreads.Threads.PhysicsAI = os.threads.ThreadManager.CreateThread("PhysicsAI", "STATIC", 0, "true", ORThreads.Callbacks.PhysicsAI ,ORThreads.Paths.PhysicsAI, "0", "false", 0);
                os.console.Comment("Mesh Loader: " + msg.data);
                
                ORMeshMgr.RequestMesh("spacestation", "scripts/jahova/OS/Cores/Graphics/meshes/spacestation.json");
                ORMeshMgr.RequestMesh("fighter1", "scripts/jahova/OS/Cores/Graphics/meshes/fighter1.json");
                ORMeshMgr.RequestMesh("fighter2", "scripts/jahova/OS/Cores/Graphics/meshes/fighter2.json");
                ORMeshMgr.RequestMesh("gunship", "scripts/jahova/OS/Cores/Graphics/meshes/gunship.json");
                
            }
            else if(msg.data.type == "MESHLOADED"){
                os.console.Comment("Mesh Loader: Mesh " + msg.data.name + " Loaded" );
                ORMeshMgr.BuildMesh(msg.data);
            }
            else if(msg.data.type == "ERROR"){
                os.console.Error(msg.data.message);
            }
            else
                os.console.Comment("Mesh Loader: Unknown Message Type\n" + msg.data.toString());
        },
        PhysicsAI:function(msg){
            if(msg.data == "REGISTERED"){
                os.console.Comment("Physics & AI: " + msg.data);
                os.threads.ThreadManager.GetActiveThreads();
                ORAIPhysicsMgr.Online = true;
                ORAssetComplete();
                
            }
            else if(msg.data.type == "EntityList"){
                for(var i = 0; i < msg.data.list.length; i++){
                    MergeSharedEntity(msg.data.list[i]);
                }
            }
            else if(msg.data.type == "ERROR"){
                os.console.Error("Physics & AI: " + msg.data.message);
            }
            else
                os.console.Comment("Physics & AI: Unknown Message Type\n" + msg.data.toString());
        }
    },
    Threads: {
        MeshLoader: null,
        PhysicsAI: false
    },
    Paths: {
        MeshLoader: null,
        PhysicsAI: null
    }
}

var ORTextureMgr = {
    Requested: 0,
    Loaded: 0
}
var ORMeshMgr = {
    Requested: 0,
    Loaded: 0,
    RequestMesh: function(sKey, sPath){
        //ORMeshMgr.Requested++;
        var input = {};
        input.type = "LOADMESH";
        input.filename = sPath;
        input.name = sKey;
        ORThreads.Threads.MeshLoader.Execute(input);
    },
    BuildMesh: function(input){
        ORMeshMgr.Loaded++;
        var msh = os.graphics.Managers.Mesh.Create.Mesh(input.name);
        msh.model = input;
        msh.Initialize();
        
        ORAssetComplete();
        if(ORMeshMgr.Requested == ORMeshMgr.Loaded){
            
            
            
            //os.graphics.Start();
        }
    }
}

var ORAIPhysicsMgr = {
    AI: {
        Update: function(){             //Update AI
            var input = {};
            input.type = "UPDATEAI";
            input.dt = os.graphics.Time.dt;
            ORThreads.Threads.PhysicsAI.Execute(input);
        },
        EnableAI: function(id, name){   //Enable AI for Entity
            var input = {};
            input.type = "ENABLEAI";
            input.id = id;
            input.name = name;
            ORThreads.Threads.PhysicsAI.Execute(input);
        },
        Enable: {
            Seek: {
                Entity: function(id, targetID){
                    var input = {};
                    input.type = "ENABLESEEKENTITY";
                    input.id = id;
                    input.target = targetID;
                    ORThreads.Threads.PhysicsAI.Execute(input);
                },
                Position: function(id, vPosition){
                    var input = {};
                    input.type = "ENABLESEEKPOSITION";
                    input.id = id;
                    input.position = vPosition;
                    ORThreads.Threads.PhysicsAI.Execute(input);
                }
            },
            Hide: {
                Entity: function(id, targetID, vHidingPositions, vOffsets){
                    var input = {};
                    input.type = "ENABLEHIDEENTITY";
                    input.id = id;
                    input.target = targetID;
                    input.hidingPositions = vHidingPositions;
                    input.offsets = vOffsets;
                    ORThreads.Threads.PhysicsAI.Execute(input);
                }
            },
            Patrol: {
                Circle: function(id, fRadius, vCenter){
                    var input = {};
                    input.type = "ENABLEPATROLCIRCLE";
                    input.id = id;
                    input.radius = fRadius;
                    input.center = vCenter;
                    ORThreads.Threads.PhysicsAI.Execute(input);
                }
            },
            Avoidance: function(id, vHalfSizes){
                var input = {};
                input.type = "ENABLEAVOIDANCE";
                input.id = id;
                input.halfSize = vHalfSizes;
                ORThreads.Threads.PhysicsAI.Execute(input);
            }
        
        },
        Disable: {
            Seek: {
                Entity: function(ent){
                    ent.AI.MovementAlgorithms.SeekEntity = false; //.Disable.Seek.Entity();
                    var input = {};
                    input.type = "DISABLESEEKENTITY";
                    input.id = ent.Get.id();
                    ORThreads.Threads.PhysicsAI.Execute(input);
                },
                Position: function(ent){
                    ent.AI.MovementAlgorithms.SeekPosition = false
                    var input = {};
                    input.type = "DISABLESEEKPOSITION";
                    input.id = ent.Get.id();
                    ORThreads.Threads.PhysicsAI.Execute(input);
                }
            },
            Hide: {
                Entity: function(ent){
                    ent.AI.MovementAlgorithms.HideEntity = false;
                    var input = {};
                    input.type = "DISABLEHIDEENTITY";
                    input.id = ent.Get.id();
                    ORThreads.Threads.PhysicsAI.Execute(input);
                }
            },
            Patrol: {
                Circle: function(ent){
                    ent.AI.MovementAlgorithms.PatrolCircle = false
                    var input = {};
                    input.type = "DISABLEPATROLCIRCLE";
                    input.id = ent.Get.id();
                    ORThreads.Threads.PhysicsAI.Execute(input);
                }
            },
            Avoidance: function(ent){
                ent.AI.MovementAlgorithms.Avoidance = false
                var input = {};
                input.type = "DISABLEAVOIDANCE";
                input.id = ent.Get.id();
                ORThreads.Threads.PhysicsAI.Execute(input);
            }
        }
        
    },
    Physics:{
        EnablePhysics: function(id, vPosition, linearDamp, angDamp, invMass){
            var input = {};
            input.type = "ENABLEPHYSICS";
            input.id = id;
            input.position = vPosition;
            input.linearDampening = linearDamp;
            input.angularDampening = angDamp;
            input.invMass = invMass;
            ORThreads.Threads.PhysicsAI.Execute(input);
        },
        CreateBV:{
            Sphere: function(halfSize, center){
                var input = {};
                input.type = "CREATEBV";
                input.bvType = "SPHERE";
                input.halfSize = halfSize;
                input.center = center;
                ORThreads.Threads.PhysicsAI.Execute(input);
            },
            OBB: function(halfSize, center, orientation){
                var input = {};
                input.type = "CREATEBV";
                input.bvType = "OBB";
                input.halfSize = halfSize;
                input.center = center;
                input.orientation = orientation;
                ORThreads.Threads.PhysicsAI.Execute(input);
            }
        },
        Update: function(){
            var input = {};
            input.type = "UPDATEPHYSICS";
            input.dt = os.graphics.Time.dt;
            ORThreads.Threads.PhysicsAI.Execute(input);
        }
    },
    
    MergeSharedData: function(){     //Merge Shared Memory
        var input = {};
        input.type = "UPDATEENTITIES";
        ORThreads.Threads.PhysicsAI.Execute(input);
    },
    SetSharedData: function(){
        var input = {};
        input.type = "SETSHAREDMEMORY";
        ORThreads.Threads.PhysicsAI.Execute(input);
    },
    Update: function(){
        var input = {};
            input.type = "UPDATE";
            input.dt = os.graphics.Time.dt;
            ORThreads.Threads.PhysicsAI.Execute(input);
    },
    GetEntityList: function(){
        var input = {};
        input.type = "GETENTITIES";
        ORThreads.Threads.PhysicsAI.Execute(input);
    },
    AddEntity: function(ent){
        var input = {};
        input.type = "ADDENTITY";
        input.data = CreateSharedEntity(ent);
        ORThreads.Threads.PhysicsAI.Execute(input);
    },
    UpdateEntity: function(ent){
        var input = {};
        input.type = "UPDATEENTITY";
        input.data = CreateSharedEntity(ent);
        ORThreads.Threads.PhysicsAI.Execute(input);
    },
    Online: false
}
var ORControls = function(){
    var gp = os.input.Gamepads.current.get(0);
    var updated = false;
    
    if(gp){
        var cam = os.graphics.Managers.Camera;
        if(Math.abs(gp.RightStick.X()) > 0.2){
            cam.Rotation.yaw += gp.RightStick.X() * 4.5;
            
            if(cam.Rotation.yaw > 360){ cam.Rotation.yaw  -= 360;}
            else if(cam.Rotation.yaw < 0) { cam.Rotation.yaw += 360; }
            
            if(os.graphics.Managers.Camera.attached){
                ORObject.gunship.yaw = cam.Rotation.yaw;
                //quat4.set(BuildOrientation(-ORObject.gunship.yaw,-ORObject.gunship.pitch,-ORObject.gunship.roll),ORObject.gunship.orientation);
                //ORObject.Debug.bv[18].pitch = ORObject.gunship.pitch;
                //ORObject.Debug.bv[18].yaw   = ORObject.gunship.yaw;
                //ORAIPhysicsMgr.UpdateEntity(ORObject.gunship);
                updated = true;
            }
        }
        if(Math.abs(gp.RightStick.Y()) > 0.2){
            cam.Rotation.pitch += gp.RightStick.Y() * 3.5;
            
            if(cam.Rotation.pitch > 360){ cam.Rotation.pitch  -= 360}
            else if(cam.Rotation.pitch < 0) { cam.Rotation.pitch += 360; }
            
            if(os.graphics.Managers.Camera.attached){
                ORObject.gunship.pitch = cam.Rotation.pitch;
                //quat4.set(BuildOrientation(-ORObject.gunship.yaw,-ORObject.gunship.pitch,-ORObject.gunship.roll),ORObject.gunship.orientation);
                //ORObject.Debug.bv[18].pitch = ORObject.gunship.pitch;
                //ORObject.Debug.bv[18].yaw   = ORObject.gunship.yaw;
                //ORAIPhysicsMgr.UpdateEntity(ORObject.gunship);
                updated = true;
            }
            
        }
        if(Math.abs(gp.LeftStick.X()) > 0.2){
            if(os.graphics.Managers.Camera.attached){
                ORObject.gunship.Move.Right(gp.LeftStick.X() * 2);
                //ORAIPhysicsMgr.UpdateEntity(ORObject.gunship);
                updated = true;
            }
            else{
                os.graphics.Managers.Camera.MoveRight(gp.LeftStick.X() * 5);
            }
            
        }
        if(Math.abs(gp.LeftStick.Y()) > 0.2){
            if(os.graphics.Managers.Camera.attached){
                ORObject.gunship.Move.Backward(gp.LeftStick.Y() * 4);
                //ORAIPhysicsMgr.UpdateEntity(ORObject.gunship);
                updated = true;
            }
            else{
                os.graphics.Managers.Camera.MoveBackward(gp.LeftStick.Y() * 8);
                
            }
            
        }
        if(gp.RightShoulder.Top() > 0.5){//Detach Camera and Reset
            os.audio.Play("chirp");
            
            var cam = os.graphics.Managers.Camera;
            cam.Attach();
            cam.Rotation.yaw = 0;
            cam.Rotation.pitch = 0;
            cam.Rotation.roll = 0;
            cam.Position[0] = ORObject.gunship.Position[0];
            cam.Position[1] = ORObject.gunship.Position[1];
            cam.Position[2] = ORObject.gunship.Position[2];
        }
        if(gp.LeftShoulder.Top()  > 0.5){
            os.audio.Play("chirp");
            os.graphics.Managers.Camera.Attach(ORObject.gunship);
            os.graphics.Managers.Camera.Offset = vec3.create([0,5,80]);
        }
        if(gp.Buttons.Top() > 0.5){
            if(!ORObject.fighter2.AI.MovementAlgorithms.SeekEntity){
                os.audio.Play("chirp");
                os.audio.Play("battle");
                ORObject.CurrentSong = "battle";
                os.audio.Pause("menu");
                ORObject.Thursters.Fighter2.left.Start();
                ORObject.Thursters.Fighter2.right.Start();
                ORObject.Thursters.Fighter1.botLeft.Start();
                ORObject.Thursters.Fighter1.botRight.Start();
                ORObject.Thursters.Fighter1.topLeft.Start();
                ORObject.Thursters.Fighter1.topRight.Start();
                
                ORAIPhysicsMgr.AI.Disable.Hide.Entity(ORObject.fighter2);
                ORAIPhysicsMgr.AI.Disable.Patrol.Circle(ORObject.fighter2);
                ORAIPhysicsMgr.AI.Disable.Hide.Entity(ORObject.fighter1);
                ORAIPhysicsMgr.AI.Disable.Patrol.Circle(ORObject.fighter1);
                //ORObject.fighter2.AI.Movement.Disable.Hide.Entity();
                //ORObject.fighter2.AI.Movement.Disable.Patrol.Circle();
                //ORObject.fighter1.AI.Movement.Disable.Hide.Entity();
                //ORObject.fighter1.AI.Movement.Disable.Patrol.Circle();
                
                ORAIPhysicsMgr.AI.Enable.Seek.Entity(ORObject.fighter2.Get.id(), ORObject.gunship.Get.id());
                ORAIPhysicsMgr.AI.Enable.Seek.Entity(ORObject.fighter1.Get.id(), ORObject.gunship.Get.id());
                //os.ai.Movement.Add.Seek.Entity(ORObject.fighter2, ORObject.gunship);
                //os.ai.Movement.Add.Seek.Entity(ORObject.fighter1, ORObject.gunship);
                ORObject.Debug.CollectData = true;
            }
            
        }
        else if(gp.Buttons.Bottom() > 0.5){
            if(!ORObject.fighter2.AI.MovementAlgorithms.HideEntity ){
                os.audio.Play("chirp");
                os.audio.Play("menu");
                ORObject.CurrentSong = "menu";
                os.audio.Pause("battle");
                
                var hidingSpots = [];
                hidingSpots.push([-660,15,910]);
                hidingSpots.push([-1075,5,-350]);
                hidingSpots.push([-5,10,-1130]);
                hidingSpots.push([1075,10,-350]);
                hidingSpots.push([670,5,915]);
                offsets = [420,420,420,420,420];
                
                
                
                if(!ORObject.fighter2.AI.MovementAlgorithms.HideEntity ){
                    ORObject.fighter2.AI.Movement.Disable.Seek.Entity();
                    
                    ORObject.Thursters.Fighter2.left.Start();
                    ORObject.Thursters.Fighter2.right.Start();
                    
                    os.ai.Movement.Add.Hide.Entity(ORObject.fighter2, ORObject.gunship,hidingSpots,offsets);
                }
                if(!ORObject.fighter1.AI.MovementAlgorithms.HideEntity){
                    ORObject.fighter1.AI.Movement.Disable.Seek.Entity();
                    
                    ORObject.Thursters.Fighter1.botLeft.Start();
                    ORObject.Thursters.Fighter1.botRight.Start();
                    ORObject.Thursters.Fighter1.topLeft.Start();
                    ORObject.Thursters.Fighter1.topRight.Start();
                    
                    os.ai.Movement.Add.Hide.Entity(ORObject.fighter1, ORObject.gunship,hidingSpots,offsets);
                }
            }
        }
        else if(gp.Buttons.Left() > 0.5){
            ORObject.Debug.set = true;
            ORObject.Debug.Win.Display.window();
            
        }
        else if(gp.Buttons.Right() > 0.5){
            ORObject.Debug.set = false;
            ORObject.Debug.Win.Hide.window();
        }
        else if(gp.Select() > 0.5){
            os.audio.Play("chirp");
            os.audio.Pause(ORObject.CurrentSong);
        }
        else if(gp.Start() > 0.5){
            os.audio.Play("chirp");
            os.audio.Play(ORObject.CurrentSong);
        }
        else if((gp.RightShoulder.Bottom() > 0.4) ){//&& os.graphics.Managers.Camera.attached){
            if(ORObject.Time.Laser.last + os.audio.Get.Duration("laser") * 2000 < os.graphics.Time.current){
                os.audio.Play("laser");
                ORObject.Time.Laser.last = os.graphics.Time.current;
                bullet = new CORBullet(ORObject.gunship)
                bullet.AddGraphic([-7.8,1.8,16.15]);
                bullet.AddGraphic([-7.8,0.8,16.15]);
                bullet.AddGraphic([7.8,1.8,16.15]);
                bullet.AddGraphic([7.8,0.8,16.15]);
                
            }
            
        }
        else if(gp.LeftShoulder.Bottom() > 0.1){
            
            
        
        }
        
        if(updated){
            //ORAIPhysicsMgr.UpdateEntity(ORObject.gunship);
        }
    }
    else{
        var cam = os.graphics.Managers.Camera;
        var pressed = os.input.Get.State.Mouse().pressed;
        
        if(pressed){
            
            if(os.graphics.Managers.Camera.attached){
                ORObject.gunship.yaw = cam.Rotation.yaw;
                ORObject.gunship.pitch = cam.Rotation.pitch;
                updated = true;
            }
            
        }
        if(ORKeys.d){
            if(os.graphics.Managers.Camera.attached){
                ORObject.gunship.Move.Right(4);
                updated = true;
            }
            else{
                os.graphics.Managers.Camera.MoveRight(5);
            }
            
        }
        if(ORKeys.a){
            if(os.graphics.Managers.Camera.attached){
                ORObject.gunship.Move.Right(-4);
                updated = true;
            }
            else{
                os.graphics.Managers.Camera.MoveRight(-5);
            }
            
        }
        if(ORKeys.s){
            if(os.graphics.Managers.Camera.attached){
                ORObject.gunship.Move.Backward(5);
                updated = true;
            }
            else{
                os.graphics.Managers.Camera.MoveBackward(8);
                
            }
            
        }
        if(ORKeys.w){
            if(os.graphics.Managers.Camera.attached){
                ORObject.gunship.Move.Backward(-5);
                updated = true;
            }
            else{
                os.graphics.Managers.Camera.MoveBackward(-8);
                
            }
            
        }
        
        if(updated){
            //ORAIPhysicsMgr.UpdateEntity(ORObject.gunship);
        }
    }
}
var ORKeys = {
        w: false,
        a: false,
        s: false,
        d: false,
        space: false,
        i: false,
        j: false,
        k: false,
        l: false,
        h: false
}
var ORGunshipCollisionUpdate = function(obj){
    var red = [0.57,0.26,0.40];
    var blue = [0.17,0.26,0.80];
    var gunshipIndex = 18;
    var collision = false;
    var hit = false;
    
    for(var j = gunshipIndex - 1; j >= 0; j--){
        collision = os.physics.bvs[gunshipIndex].CollisionTest(os.physics.bvs[j])
        if(collision){
            hit = true;
            ORObject.Debug.bv[gunshipIndex].Graphics.Set.blendColor(red);
            //Position = OBB Cloesest Point + (radius * normal)
            vec3.scale(collision.normal, collision.obj1.halfSize, collision.normal);
            vec3.add(collision.point.obj2, collision.normal, collision.normal);
            vec3.set(collision.normal, ORObject.gunship.Position);
            
            ORObject.Debug.bv[j].Graphics.Set.blendColor(red);
        }
        else{
            if(!hit){ORObject.Debug.bv[gunshipIndex].Graphics.Set.blendColor(blue);}
            ORObject.Debug.bv[j].Graphics.Set.blendColor(blue);
        }
    }
}

var ORFighter2CollisionUpdate = function(){
    var red = [0.57,0.26,0.40];
    var blue = [0.17,0.26,0.80];
    var gunshipIndex = 18;
    var fighterIndex = 19;
    var fighter1Index = 20;
    var collision = false;
    var hit = false;
    
    for(var j = gunshipIndex - 1; j >= 0; j--){
        collision = os.physics.bvs[fighterIndex].CollisionTest(os.physics.bvs[j])
        if(collision){
            hit = true;
            ORObject.Debug.bv[fighterIndex].Graphics.Set.blendColor(red);
            //Position = OBB Cloesest Point + (radius * normal)
            vec3.scale(collision.normal, collision.obj1.halfSize, collision.normal);
            vec3.add(collision.point.obj2, collision.normal, collision.normal);
            vec3.set(collision.normal, ORObject.fighter2.Physics.position);
            
            ORObject.Debug.bv[j].Graphics.Set.blendColor(red);
        }
        else{
            if(!hit){ORObject.Debug.bv[fighterIndex].Graphics.Set.blendColor(blue);}
            ORObject.Debug.bv[j].Graphics.Set.blendColor(blue);
        }
    }
    
    for(var j = gunshipIndex - 1; j >= 0; j--){
        collision = os.physics.bvs[fighter1Index].CollisionTest(os.physics.bvs[j])
        if(collision){
            hit = true;
            ORObject.Debug.bv[fighter1Index].Graphics.Set.blendColor(red);
            //Position = OBB Cloesest Point + (radius * normal)
            vec3.scale(collision.normal, collision.obj1.halfSize, collision.normal);
            vec3.add(collision.point.obj2, collision.normal, collision.normal);
            vec3.set(collision.normal, ORObject.fighter1.Physics.position);
            
            ORObject.Debug.bv[j].Graphics.Set.blendColor(red);
        }
        else{
            if(!hit){ORObject.Debug.bv[fighter1Index].Graphics.Set.blendColor(blue);}
            ORObject.Debug.bv[j].Graphics.Set.blendColor(blue);
        }
    }
    
    collision = os.physics.bvs[fighter1Index].CollisionTest(os.physics.bvs[fighterIndex])
    if(collision){
        hit = true;
        ORObject.Debug.bv[fighter1Index].Graphics.Set.blendColor(red);
        //Position = OBB Cloesest Point + (radius * normal)
        vec3.scale(collision.normal, collision.obj1.halfSize + 15, collision.normal);
        vec3.add(collision.point.obj2, collision.normal, collision.normal);
        vec3.set(collision.normal, ORObject.fighter1.Physics.position);
        
        ORObject.Debug.bv[fighterIndex].Graphics.Set.blendColor(red);
    }
    else{
        if(!hit){ORObject.Debug.bv[fighter1Index].Graphics.Set.blendColor(blue);}
        ORObject.Debug.bv[fighterIndex].Graphics.Set.blendColor(blue);
    }
}
var ORBulletCollision = function(){
    var red = [0.57,0.26,0.40];
    var blue = [0.17,0.26,0.80];
    var gunshipIndex = 18;
    var fighter2Index = 19;
    var fighter1Index = 20;
    var collision = false;
    var hit = false;
    
    for(var i = ORObject.Bullets.list.length - 1; i >= 0; i--){
         quat4.set(ORObject.Bullets.list[i].orientation,ORObject.Bullets.bv.obj.orientation);
         vec3.set(ORObject.Bullets.list[i].Position, ORObject.Bullets.bv.obj.center);
        
        if(ORObject.Bullets.list[i].owner != ORObject.gunship.ID()){
            //Collied with Gunship
            if(ORObject.Bullets.bv.obj.CollisionTest(os.physics.bvs[gunshipIndex])){
                ORObject.Debug.bv[gunshipIndex].Graphics.Set.blendColor(red);
                os.audio.Play("strike");
                ParticleManager.Start(ORObject.Explosions.Gunship.id);
                
            }
        }
        //Collide with AI ship
        else if(ORObject.Bullets.bv.obj.CollisionTest(os.physics.bvs[fighter2Index])){
            ORObject.Debug.bv[fighter2Index].Graphics.Set.blendColor(red);
            ORObject.Bullets.list.splice(i,1);
            os.audio.Play("strike");
            ParticleManager.Start(ORObject.Explosions.Fighter2.id);
            os.physics.Create.Force.LocalImpulse(ORObject.fighter2.Physics,[100,0,0],[50,0,50]);
            if(ORObject.fighter2.AI.MovementAlgorithms.SeekEntity || ORObject.fighter2.AI.MovementAlgorithms.HideEntity)
                ORObject.fighter2.hits++;
        }
        
        else if(ORObject.Bullets.bv.obj.CollisionTest(os.physics.bvs[fighter1Index])){
            ORObject.Debug.bv[fighter1Index].Graphics.Set.blendColor(red);
            ORObject.Bullets.list.splice(i,1);
            os.audio.Play("strike");
            ParticleManager.Start(ORObject.Explosions.Fighter1.id);
            os.physics.Create.Force.LocalImpulse(ORObject.fighter1.Physics,[100,0,0],[50,0,50]);
            if(ORObject.fighter1.AI.MovementAlgorithms.SeekEntity || ORObject.fighter1.AI.MovementAlgorithms.HideEntity)
                ORObject.fighter1.hits++;
        }
    
    }
    
}

var ORObject = {
    Debug: {
        set: false,
        Win: null,
        time: 0,
        numOfFrames: 0,
        bv: [],
        CollectData: false,
        FPS: [],
        PrintFPS: function(){
            os.console.Clear();
            os.console.Comment(ORObject.Debug.FPS.join(","));
        }
    },
    entitiesLoaded: 0,
    fighter1: null,
    fighter2: null,
    gunship:  null,
    station:  null,
    stationLarge: null,
    Bullets: {
        graphics: null,
        list: null,
        bv: {
            obj: [],
            graphics: null
        }
    },
    Thursters: {
        Gunship: {
            left: null,
            right: null
        },
        Fighter1: {
            topLeft: null,
            topRight: null,
            botLeft: null,
            botRight: null
        },
        Fighter2: {
            left: null,
            right: null
        }
    },
    Explosions:{
        Fighter1: null,
        Fighter2: null,
        Gunship: null
    },
    Time: {
        Cannon: {
            duration: null,
            last: 0
        },
        Laser: {
            duration: null,
            last: 0
        },
        Fighter1: {
            Laser: {
                last: 0
            }
        },
        Fighter2: {
            Laser: {
                last: 0
            }
        },
        Update: {
            last: 0
        }
    },
    Target: {
        obj: null,
        html: null,
        time: null,
        vp: null,
        position: null
    },
    CurrentSong: null,
    Entities: null
}
var ORGameUpdate = function(){
    if(ORObject.fighter2.hits > 3){
        ORObject.fighter2.hits = 0;
        ORAIPhysicsMgr.AI.Disable.Seek.Entity(ORObject.fighter2);
        ORAIPhysicsMgr.AI.Disable.Hide.Entity(ORObject.fighter2);
        //ORObject.fighter2.AI.Movement.Disable.Seek.Entity();
        //ORObject.fighter2.AI.Movement.Disable.Hide.Entity();
        ORObject.Thursters.Fighter2.left.Stop();
        ORObject.Thursters.Fighter2.right.Stop();
        
    }
    else if(ORObject.fighter2.hits > 1){
        if(!ORObject.fighter2.AI.MovementAlgorithms.HideEntity){
            ORAIPhysicsMgr.AI.Disable.Seek.Entity(ORObject.fighter2);
            //ORObject.fighter2.AI.Movement.Disable.Seek.Entity();
            var hidingSpots = [];
            hidingSpots.push([-660,15,910]);
            hidingSpots.push([-1075,5,-350]);
            hidingSpots.push([-5,10,-1130]);
            hidingSpots.push([1075,10,-350]);
            hidingSpots.push([670,5,915]);
            offsets = [420,420,420,420,420];
            ORAIPhysicsMgr.AI.Enable.Hide.Entity(ORObject.fighter2.Get.id(), ORObject.gunship.Get.id(),hidingSpots,offsets);
            //os.ai.Movement.Add.Hide.Entity(ORObject.fighter2, ORObject.gunship,hidingSpots,offsets);
        }
        
    }
    
    if(ORObject.fighter1.hits > 3){
        ORObject.fighter1.hits = 0;
        ORAIPhysicsMgr.AI.Disable.Seek.Entity(ORObject.fighter1);
        ORAIPhysicsMgr.AI.Disable.Hide.Entity(ORObject.fighter1);
        //ORObject.fighter1.AI.Movement.Disable.Seek.Entity();
        //ORObject.fighter1.AI.Movement.Disable.Hide.Entity();
        ORObject.Thursters.Fighter1.botLeft.Stop();
        ORObject.Thursters.Fighter1.botRight.Stop();
        ORObject.Thursters.Fighter1.topLeft.Stop();
        ORObject.Thursters.Fighter1.topRight.Stop();
                
    }
    else if(ORObject.fighter1.hits > 1){
        if(!ORObject.fighter1.AI.MovementAlgorithms.HideEntity){
            ORAIPhysicsMgr.AI.Disable.Seek.Entity(ORObject.fighter1);
            ORAIPhysicsMgr.AI.Disable.Hide.Entity(ORObject.fighter1);
            //ORObject.fighter1.AI.Movement.Disable.Seek.Entity();
            var hidingSpots = [];
            hidingSpots.push([-660,15,910]);
            hidingSpots.push([-1075,5,-350]);
            hidingSpots.push([-5,10,-1130]);
            hidingSpots.push([1075,10,-350]);
            hidingSpots.push([670,5,915]);
            offsets = [420,420,420,420,420];
            ORAIPhysicsMgr.AI.Enable.Hide.Entity(ORObject.fighter1.Get.id(), ORObject.gunship.Get.id(),hidingSpots,offsets);
            //os.ai.Movement.Add.Hide.Entity(ORObject.fighter1, ORObject.gunship,hidingSpots,offsets);
        }
        
    }
    
    if(!ORObject.fighter1.AI.MovementAlgorithms.HideEntity && !ORObject.fighter2.AI.MovementAlgorithms.HideEntity &&
       !ORObject.fighter1.AI.MovementAlgorithms.SeekEntity && !ORObject.fighter2.AI.MovementAlgorithms.SeekEntity &&
       (ORObject.CurrentSong != "menu")){
                
        os.audio.Play("menu");
        ORObject.CurrentSong = "menu";
        os.audio.Pause("battle");
    }
    if(ORObject.fighter1.AI.MovementAlgorithms.SeekEntity){
        var dist = [];
        vec3.subtract(ORObject.gunship.Position, ORObject.fighter1.Physics.position, dist);
        dist = vec3.length(dist);
        if(dist < 800){
            if(ORObject.Time.Fighter1.Laser.last + 1000 < os.graphics.Time.current){
                os.audio.Play("laser");
                ORObject.Time.Fighter1.Laser.last = os.graphics.Time.current;
                bullet = new CORBullet(ORObject.fighter1);
                bullet.AddGraphic([10,0,0]);
                bullet.AddGraphic([-10,0,0]);
            }
        }
        
    }
    if(ORObject.fighter2.AI.MovementAlgorithms.SeekEntity){
        var dist = [];
        vec3.subtract(ORObject.gunship.Position, ORObject.fighter2.Physics.position, dist);
        dist = vec3.length(dist);
        if(dist < 800){
            if(ORObject.Time.Fighter2.Laser.last + 1000 < os.graphics.Time.current){
                os.audio.Play("laser");
                ORObject.Time.Fighter2.Laser.last = os.graphics.Time.current;
                bullet = new CORBullet(ORObject.fighter2);
                bullet.AddGraphic([10,0,0]);
                bullet.AddGraphic([-10,0,0]);
            }
        }
        
    }
    
    //Update Target Tracker
    mat4.multiply(os.graphics.Matrix.Projection, os.graphics.Matrix.View, ORObject.Target.vp);
    var pos = ORObject.fighter2.Physics.position;
    mat4.multiplyVec4(ORObject.Target.vp, [pos[0], pos[1], pos[2], 1], ORObject.Target.position);
    ORObject.Target.position[0] /= ORObject.Target.position[3];
    ORObject.Target.position[1] /= ORObject.Target.position[3];
    ORObject.Target.position[2] /= ORObject.Target.position[3];
    if(ORObject.Target.position[3] < 0){ORObject.Target.html.style.display = "none"}
    else{ORObject.Target.html.style.display = "block"}
    var x = -12 + ((1 + ORObject.Target.position[0])*os.graphics.Get.Width())/2;
    var y = -12 + ((1 - ORObject.Target.position[1])*os.graphics.Get.Height())/2;
    ORObject.Target.html.style.left = (x.toFixed(0)) + "px";
    ORObject.Target.html.style.top =  (y.toFixed(0)) + "px";

}



var ORUpdate = function(dt){
    ORObject.Time.Update.last += dt;
    if(ORObject.Time.Update.last > 30){
        //ORAIPhysicsMgr.UpdateEntity(ORObject.gunship);
        //ORAIPhysicsMgr.GetEntityList();
        ORGameUpdate();
        //ORAIPhysicsMgr.Update(); 
    }
    
    os.input.Update(dt);
    //os.physics.Update.All(0.033);
    //os.ai.Update(dt);
    ORControls(dt);
    //ORObject.station.yaw += 0.1;
    ORGunshipCollisionUpdate();
    ORFighter2CollisionUpdate();
    ORBulletCollision();
    ParticleManager.Update(dt);
    ORObject.Bullets.Update(dt);
    if(ORObject.Debug.set){
        ORDebugUpdate(dt);
    }
    
}

var ORDraw = function(){

    ORObject.fighter1.Graphics.Draw();
    ORObject.fighter2.Graphics.Draw();
    ORObject.gunship.Graphics.Draw();
    ORObject.station.Graphics.Draw();
    ORObject.Bullets.Draw();
    //ORObject.stationLarge.Graphics.Draw();
    ORObject.skybox.Graphics.Draw();
    if(ORObject.Debug.set){
        ORDebugDraw();
    }
    
    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    ParticleManager.Draw();
    
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    
    
    
    
    
}
var ORDebugUpdate = function(dt){
    ORObject.Debug.time += os.graphics.Time.dt
    ORObject.Debug.numOfFrames++;
    
    if(ORObject.Debug.time > 1000){
        ORObject.Debug.time = ORObject.Debug.time / 1000;
        if(ORObject.Debug.CollectData){ORObject.Debug.FPS.push((ORObject.Debug.numOfFrames/ORObject.Debug.time).toFixed(3));}
        ORObject.Debug.Win.Set.statusbarText("FPS: " + (ORObject.Debug.numOfFrames/ORObject.Debug.time).toFixed(3));
        ORObject.Debug.time = 0;
        ORObject.Debug.numOfFrames = 0;
    }
    
    

    
}
var ORDebugDraw = function(){
    
    for(var i = ORObject.Debug.bv.length - 1; i >= 0; i--){
        if(i != 18){ORObject.Debug.bv[i].Graphics.Draw();}
    }
    for(var i = ORObject.Bullets.list.length - 1; i >= 0; i--){
         vec3.set(ORObject.Bullets.list[i].Position, ORObject.Bullets.bv.graphics.Physics.position);
         quat4.set(ORObject.Bullets.list[i].orientation, ORObject.Bullets.bv.graphics.Physics.orientation);
        ORObject.Bullets.bv.graphics.Graphics.Draw();
    }
    
}

var ORAssetComplete = function(){
    if(ORMeshMgr.Requested == ORMeshMgr.Loaded &&
       ORTextureMgr.Requested == ORTextureMgr.Loaded &&
       ORAIPhysicsMgr.Online &&
       os.graphics.Managers.Texture.textures.get("skybox").GetCount() == 6){
        
        var TexturesCompleted = 0;
        var TexturesPending   = 0;
        os.console.Comment("All Assets Loaded");
        
        os.console.Comment("Initializing Input");
        //Load Input
        ORLoad.Input();
        
        os.console.Comment("Initializing AI");
        //Load Artifical Intelligence Core
        ORLoad.AI();
        
        os.console.Comment("Initializing Entities");
        //Load Entities
        ORLoad.Entities();
        
        os.console.Comment("Initializing Bullets");
        //Load Bullet Object
        ORLoad.Bullets();
        
        os.console.Comment("Initializing Particle Effects");
        //Load Particle System
        ORLoad.ParticleEffects();
        
        os.console.Comment("Initializing Bounding Volumes");
        //Load Bounding Volumes and Physics
        ORLoad.BoundingVolumes();
        
        os.console.Comment("Initializing Game Controls");
        //Load Game Controls
        ORLoad.Controls();
        
        os.console.Comment("Initializing Debug State");
        //Load Deubg Elements
        ORLoad.Debug();
            
        os.graphics.Managers.Camera.Attach(ORObject.gunship);
        os.graphics.Managers.Camera.Offset = vec3.create([0,5,80]);
       
        ORObject.skybox.Attach(ORObject.gunship);
       
       os.console.Comment("Verifying Textures Are Ready For Render");
        var TexturesReady = function(){
            TexturesCompleted = 0;
            TexturesPending   = 0;
            for(var i = os.graphics.Managers.Texture.textures.size - 1; i--; os.graphics.Managers.Texture.textures.next()){
                //cubemap
                if(os.graphics.Managers.Texture.textures.value().Images){
                    os.graphics.Managers.Texture.textures.value().Images.positiveX.complete == true ? TexturesCompleted++ : TexturesPending++;
                    os.graphics.Managers.Texture.textures.value().Images.positiveY.complete == true ? TexturesCompleted++ : TexturesPending++;
                    os.graphics.Managers.Texture.textures.value().Images.positiveZ.complete == true ? TexturesCompleted++ : TexturesPending++;
                    os.graphics.Managers.Texture.textures.value().Images.negativeX.complete == true ? TexturesCompleted++ : TexturesPending++;
                    os.graphics.Managers.Texture.textures.value().Images.negativeY.complete == true ? TexturesCompleted++ : TexturesPending++;
                    os.graphics.Managers.Texture.textures.value().Images.negativeZ.complete == true ? TexturesCompleted++ : TexturesPending++;
                }
                else{
                    os.graphics.Managers.Texture.textures.value().image.complete == true ? TexturesCompleted++ : TexturesPending++;
                }
                
            }
            os.console.Comment("    "+TexturesCompleted + " of " + (TexturesPending + TexturesCompleted) + " Textures ready for rendering");
            if(TexturesPending == 0){
                os.console.Comment("All Assets Loaded and Initialize, Starting WebGL");
                 os.graphics.Start();
            }
            else{
               setTimeout(TexturesReady, 1000);
            }
            
        };
        
        setTimeout(TexturesReady, 1000);
        
    }
}
var OR = function(){
    
    //Initialzie Gamepad App
    ORInit();
    gl = os.graphics.gl;
    
    //Hide OS Debug Bar
    //os.debugbar.Disable();
    os.debugbar.AnchorConsole();
 
}
var CExplosion = function(ent, look, color){
    this.obj = os.graphics.Managers.Entity.Create();
    this.obj.Graphics.Add.Mesh("quad");
    this.obj.Graphics.Add.Texture("forcefield");
    this.obj.Graphics.Set.light(false);
    this.obj.Graphics.Set.useBlendColor(true);
    this.obj.Graphics.Set.blendColor(color);
    this.obj.Set.Scale(1,1,1);
    this.obj.Set.Position(ent.Position[0] + ent.Default.Offset[0], ent.Position[1]+ ent.Default.Offset[1], ent.Position[2]+ ent.Default.Offset[2]);
    //this.obj.Set.Position(ent.Position[0], ent.Position[1], ent.Position[2]);
    this.fireTime = (new Date()).getTime();
    this.duration = 1500;
    
    vec3.normalize(look);
    this.obj.yaw = Math.acos(vec3.dot([look[0],0,look[2]], [0,0,1]));
    this.obj.pitch = Math.acos(vec3.dot([0,look[1],look[2]], [0,1,0]));
    this.obj.Graphics.Update = function(dt){
        var cur = (new Date()).getTime();
        if((cur - this.fireTime) > this.duration){
            os.graphics.RemoveFromWorld(this.obj);
            this.obj.Graphics.Update = null;
        }
        else{
            this.obj.Graphics.Vectors.Scale[0] *= 1.05
            this.obj.Graphics.Vectors.Scale[1] *= 1.05
            this.obj.Graphics.Vectors.Scale[2] *= 1.05
            //vec3.scale(this.obj.Graphics.Vectors.Scale, 1.05, this.obj.Graphics.Vectors.Scale);
        }
        
    }.bind(this);
    
    os.graphics.AddToWorld(this.obj);
}
var CORBullet = function(ent){
    this.owner = ent.ID();
    //
    this.orientation = [];
    this.Forward = [];
    this.Right = [];
    this.Up = [];
    
    if(ent.Physics){
        this.orientation = ent.Physics.orientation;
        this.Position = [ent.Physics.position[0], ent.Physics.position[1], ent.Physics.position[2]];
        var rot = [];
        quat4.toMat3(this.orientation, rot);
        vec3.set([rot[6], rot[7],rot[8]],this.Forward);
        vec3.set([rot[0], rot[1],rot[2]],this.Right);
        vec3.set([rot[3], rot[4],rot[5]],this.Up);
        
    }
    else{
        this.yaw = ent.yaw;
        this.pitch = ent.pitch;
        this.roll = ent.roll;
        
        var cosX = Math.cos(degToRad(this.pitch/2));
        var sinX = Math.sin(degToRad(this.pitch/2));
        
        var cosY = Math.cos(degToRad(this.yaw/2));
        var sinY = Math.sin(degToRad(this.yaw/2));
        
        var cosZ = Math.cos(degToRad(this.roll/2));
        var sinZ = Math.sin(degToRad(this.roll/2));
        
        
        
        var qx = [sinX,0,0,cosX];
        var qy = [0,sinY,0,cosY];
        var qz = [0,0,sinZ,cosZ];
        
        quat4.multiply(qz,qy, this.orientation);
        quat4.multiply(this.orientation, qx, this.orientation);
        
        quat4.normalize(this.orientation, this.orientation);
        this.orientation[3]*=-1;
        this.Position = [ent.Position[0], ent.Position[1], ent.Position[2]];
        vec3.set(ent.Axis.Look,this.Forward);
        vec3.set(ent.Axis.Right,this.Right);
        vec3.set(ent.Axis.Up,this.Up);
    }
    
    
    //var rot = [];
    //quat4.toMat4(this.orientation, rot);
    
    //mat4.transpose(rot, rot);
    
    //this.orientation[3] = 0.5 * (Math.sqrt(rot[0] + rot[5] + rot[10] + 1));
    //this.orientation[0] = (rot[6] - rot[9]) / (4 *this.orientation[3]);
    //this.orientation[1] = (rot[8] - rot[2]) / (4 *this.orientation[3]);
    //this.orientation[2] = (rot[1] - rot[4]) / (4 *this.orientation[3]);
    //quat4.normalize(this.orientation, this.orientation);
    
    //var tempTran = [];
    //mat4.transpose(temp, tempTran);
    
    
    
    this.speed = 0.5;//ent.Physics.speed;
    this.instances = [];
  
    this.fireTime = (new Date()).getTime();
    this.duration = 1700;
    
    this.AddGraphic = function(offset){
        var obj = {};
        obj.offset = offset;
        obj.Position = [];
        vec3.set(this.Position, obj.Position);
        obj.Position[0] += this.Forward[0] * offset[2];
        obj.Position[1] += this.Forward[1] * offset[2];
        obj.Position[2] += this.Forward[2] * offset[2];
        
        obj.Position[0] += this.Right[0] * offset[0];
        obj.Position[1] += this.Right[1] * offset[0];
        obj.Position[2] += this.Right[2] * offset[0];
    
        obj.Position[0] += this.Up[0] * offset[1];
        obj.Position[1] += this.Up[1] * offset[1];
        obj.Position[2] += this.Up[2] * offset[1];
        
        this.instances.push(obj);
        
    }
    
    ORObject.Bullets.list.push(this);

}
var CreateSharedEntity = function(ent){
    var out = {};
    out.id = ent.Get.id();
    out.Position = ent.Position;
    out.yaw = ent.yaw;
    out.pitch = ent.pitch;
    out.roll = ent.roll;
    out.type = ent.type;
    out.Axis = ent.Axis;
    out.Matrix = ent.Matrix;
    if(ent.Physics){
       out.orientation = ent.Physics.orientation;
       out.Position = ent.Physics.position;
      
    }
    
    return out;
}

var MergeSharedEntity = function(sharedEnt){
    var ent = ORObject.Entities.get(sharedEnt.id);
    
    if(sharedEnt.type == "ENTITY"){
        vec3.set(sharedEnt.Position, ent.Position);
        ent.yaw = sharedEnt.yaw;
        ent.pitch = sharedEnt.pitch;
        ent.roll = sharedEnt.roll;
        if(ent.Physics){
            quat4.set(sharedEnt.Physics.orientation, ent.Physics.orientation)
            vec3.set(sharedEnt.Physics.position, ent.Physics.position)
        }
        if(sharedEnt.AI){
            ent.AI = sharedEnt.AI
        }
    }
    
}

