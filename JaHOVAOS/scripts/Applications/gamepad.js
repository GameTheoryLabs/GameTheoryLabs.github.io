var GPInit = function(){
    os = com.jahova.os.Instance();
    
    //Load Menu
    os.console.Comment("Building Menu");
    GPLoad.MainMenu();
    
    //Load Threads
    //GPLoad.Threads();
    
    //Load Graphics Core
    os.console.Comment("Loading Graphics Core");
    GPLoad.Graphics();
    
    //Load Models
    os.console.Comment("Requesting Models");
    GPLoad.Models();
    
    //Load Textures
    os.console.Comment("Requesting Textures");
    GPLoad.Textures();
    
    //Load Meshes
    os.console.Comment("Requesting Primitive");
    GPLoad.Meshes();
    
    //Load Audio
    os.console.Comment("Requesting Audio");
    GPLoad.Audio();
    
    //Load Skybox
    os.console.Comment("Requesting Skybox");
    GPLoad.Skybox();
    
}
var GPLoad = {
    Models: function(){
        
        GPMeshMgr.Requested = 5;

        var ss = os.graphics.Managers.Mesh.Create.Mesh("spacestation", "scripts/jahova/OS/Cores/Graphics/meshes/spacestation.json");
        ss.onLoad = function(){
            os.console.Comment("Loaded Space Station");
            GPMeshMgr.Loaded++;
            GPAssetComplete();
        }
        
        var f1 = os.graphics.Managers.Mesh.Create.Mesh("fighter1", "scripts/jahova/OS/Cores/Graphics/meshes/fighter1.json");
        f1.onLoad = function(){
            os.console.Comment("Loaded Fighter 1");
            GPMeshMgr.Loaded++;
            GPAssetComplete();
        }
        
        var f2 = os.graphics.Managers.Mesh.Create.Mesh("fighter2", "scripts/jahova/OS/Cores/Graphics/meshes/fighter2.json");
        f2.onLoad = function(){
            os.console.Comment("Loaded Fighter 2");
            GPMeshMgr.Loaded++;
            GPAssetComplete();
        }
        
        var gs = os.graphics.Managers.Mesh.Create.Mesh("gunship", "scripts/jahova/OS/Cores/Graphics/meshes/gunship.json");
        gs.onLoad = function(){
            os.console.Comment("Loaded Gunship");
            GPMeshMgr.Loaded++;
            GPAssetComplete();
        }
        
        var missile = os.graphics.Managers.Mesh.Create.Mesh("missile", "scripts/jahova/OS/Cores/Graphics/meshes/missile.json");
        missile.onLoad = function(){
            os.console.Comment("Loaded Missile");
            GPMeshMgr.Loaded++;
            GPAssetComplete();
        }
    },
    Threads: function(){
        os.console.Comment("Creating Thread Controller");
        os.threads.ThreadManager.CreateThreadController(GPThreads.Callbacks.Controller);
        
        if(os.threads.ThreadManager.SharedWorkers){
            os.console.Comment("Setting Shared Worker File Paths");
            
            GPThreads.Paths.MeshLoader = "scripts/Applications/Threads/mesh_shared.js";
            GPMeshMgr.Requested = 5;
            
        }
        else{
            os.console.Comment("Setting Nested Worker File Paths");
            GPThreads.Paths.MeshLoader = location.href.substr(0,location.href.lastIndexOf("/") + 1) + "scripts/Applications/Threads/mesh_nested.js";
            
        }
    },
    Graphics: function(){
        //Load WebGL (Debug: false, fullscreen: true)
        os.graphics.Load(false, true);
        os.graphics.Set.Callback.Draw(GPDraw);
        os.graphics.Set.Callback.Update(GPUpdate);
        os.graphics.Set.Callback.Reset(GPGraphicsReset);
        //os.graphics.Get.Canvas().style.display = "none";
    },
    Textures: function(){
        GPTextureMgr.Requested = 7;
        var tex = null;
        tex = os.graphics.Managers.Texture.Create.Texture("fighter1", "scripts/jahova/OS/Cores/Graphics/textures/fighter1.jpg");
        tex.onLoad = function(){GPTextureMgr.Loaded++; os.console.Comment("Loaded fighter 1 texture"); GPAssetComplete(); }
        tex = os.graphics.Managers.Texture.Create.Texture("fighter2", "scripts/jahova/OS/Cores/Graphics/textures/fighter2.jpg");
        tex.onLoad = function(){GPTextureMgr.Loaded++; os.console.Comment("Loaded fighter 2 texture"); GPAssetComplete(); }
        tex = os.graphics.Managers.Texture.Create.Texture("gunship", "scripts/jahova/OS/Cores/Graphics/textures/gunship.jpg");
        tex.onLoad = function(){GPTextureMgr.Loaded++; os.console.Comment("Loaded gunship texture"); GPAssetComplete(); }
        tex = os.graphics.Managers.Texture.Create.Texture("bullet", "scripts/jahova/OS/Cores/Graphics/textures/bullet.bmp");
        tex.onLoad = function(){GPTextureMgr.Loaded++; os.console.Comment("Loaded bullet texture"); GPAssetComplete(); }
        tex = os.graphics.Managers.Texture.Create.Texture("forcefield", "scripts/jahova/OS/Cores/Graphics/textures/forcefield.png");
        tex.onLoad = function(){GPTextureMgr.Loaded++; os.console.Comment("Loaded forcefield texture"); GPAssetComplete(); }
        tex = os.graphics.Managers.Texture.Create.Texture("spacestation", "scripts/jahova/OS/Cores/Graphics/textures/spacestation.jpg");
        tex.onLoad = function(){GPTextureMgr.Loaded++; os.console.Comment("Loaded spacestation texture"); GPAssetComplete(); }
        tex = os.graphics.Managers.Texture.Create.Texture("missile", "scripts/jahova/OS/Cores/Graphics/textures/missile.jpg");
        tex.onLoad = function(){GPTextureMgr.Loaded++; os.console.Comment("Loaded missle texture"); GPAssetComplete(); }

    },
    Meshes: function(){
        var cube = os.graphics.Managers.Mesh.Create.Primitive.Cube("cube");
        cube.Initialize();
        
        var sphMesh = os.graphics.Managers.Mesh.Create.Primitive.Sphere("sphere");
        sphMesh.Initialize();
    },
    Entities: function(){
       os.console.Comment("    Creating Fighter 1");
        var fighter1 = os.graphics.Managers.Entity.Create();
        fighter1.Graphics.Add.Mesh("fighter1");
        fighter1.Graphics.Add.Texture("fighter1");
        fighter1.Set.Scale(0.1,0.1,0.1);
        fighter1.Set.Position(300,-185,-800);
        fighter1.Graphics.Set.ambientColor([0.7,0.7,0.7]);
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
        //os.graphics.AddToWorld(fighter1);
        GPObject.fighter1 = fighter1;

        os.console.Comment("    Creating Fighter 2");
        var fighter2 = os.graphics.Managers.Entity.Create();
        fighter2.Graphics.Add.Mesh("fighter2");
        fighter2.Graphics.Add.Texture("fighter2");
        fighter2.Set.Scale(0.1,0.1,0.1);
        fighter2.Set.Position(-800,-200,250);
        fighter2.pitch = 0;
        fighter2.Graphics.Set.texture(true);
        fighter2.Graphics.Set.ambientColor([0.7,0.7,0.7]);
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
        GPObject.fighter2 = fighter2;

        os.console.Comment("    Creating Gunship");
        var gunship = os.graphics.Managers.Entity.Create();
        gunship.Graphics.Add.Mesh("gunship");
        gunship.Graphics.Add.Texture("gunship");
        gunship.Set.Scale(5,5,5);
        gunship.pitch = 0;
        gunship.Set.Position(-800,-240,150);
        gunship.Graphics.Set.ambientColor([0.7,0.7,0.7]);
        gunship.Graphics.Set.texture(true);
        gunship.orientation = quat4.create([0,0,0,1]);
        //os.graphics.AddToWorld(gunship);
        mat4.rotateX(gunship.Default.Offset, degToRad(-101), gunship.Default.Offset);
        gunship.hits = 0;
        GPObject.gunship = gunship;
        
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
        GPObject.station = station;
        
        os.console.Comment("    Creating Left Missile");
        var missileLeft = os.graphics.Managers.Entity.Create();
        missileLeft.Graphics.Add.Mesh("missile");
        missileLeft.Graphics.Add.Texture("missile");
        missileLeft.Set.Position(-1.55,-0.41,-0.495);
        missileLeft.Set.Scale(0.1,0.1,0.1);
        mat4.rotateX(missileLeft.Default.Offset, degToRad(180), missileLeft.Default.Offset);
        missileLeft.pitch = 11;
        missileLeft.yaw  = 0
        missileLeft.Graphics.Matrix.Parent = gunship.Graphics.Matrix.World;
        missileLeft.AI = os.ai.Create.Entity();
        missileLeft.AI.name = "Left Missile";
        GPObject.Missile.left.graphics = missileLeft;
        
        os.console.Comment("    Creating Right Missile");
        var missileRight = os.graphics.Managers.Entity.Create();
        missileRight.Graphics.Add.Mesh("missile");
        missileRight.Graphics.Add.Texture("missile");
        missileRight.Set.Position(1.55,-0.41,-0.495);
        missileRight.Set.Scale(0.1,0.1,0.1);
        mat4.rotateX(missileRight.Default.Offset, degToRad(180), missileRight.Default.Offset);
        missileRight.pitch = 11;
        missileRight.yaw  = 0;
        missileRight.Graphics.Matrix.Parent = gunship.Graphics.Matrix.World;
        missileRight.AI = os.ai.Create.Entity();
        missileRight.AI.name = "Right Missile";
        missileRight.AI.Movement.maxForce =500;
        GPObject.Missile.right.graphics = missileRight;
        
        //var stationLarge = os.graphics.Managers.Entity.Create();
        //stationLarge.Graphics.Add.Mesh("spacestation0");
        //stationLarge.Graphics.Add.Mesh("spacestation1");
        //stationLarge.Graphics.Add.Mesh("spacestation2");
        //stationLarge.Graphics.Add.Texture("spacestation");
        //stationLarge.Set.Scale(1.5,1.5,1.5);
        //stationLarge.Set.Position(-800,0,800);
        //stationLarge.Graphics.Set.texture(true);
        ////os.graphics.AddToWorld(station);
        //GPObject.stationLarge = stationLarge;
        
        os.console.Comment("    Creating Target");
        GPObject.Target.obj = os.resschmgr.Create.HTMLElement("div");
        GPObject.Target.html = GPObject.Target.obj.html();
        GPObject.Target.html.style.width = "25px";
        GPObject.Target.html.style.height = "25px";
        GPObject.Target.html.style.borderRadius = "25px";
        GPObject.Target.html.style.borderWidth = "2px";
        GPObject.Target.html.style.borderStyle = "solid";
        GPObject.Target.html.style.borderColor = "red";
        GPObject.Target.html.style.position = "absolute";
        GPObject.Target.html.style.display = "none";
        GPObject.Target.html.style.top = 0;
        GPObject.Target.html.style.left = 0;
        
        GPObject.Target.obj.AppendTo(document.body);
        GPObject.Target.vp = mat4.create();
        GPObject.Target.position = [0,0,0,0];
        
        os.console.Comment("    Creating Target 2");
        GPObject.Target2.obj = os.resschmgr.Create.HTMLElement("div");
        GPObject.Target2.html = GPObject.Target2.obj.html();
        GPObject.Target2.html.style.width = "25px";
        GPObject.Target2.html.style.height = "25px";
        GPObject.Target2.html.style.borderRadius = "25px";
        GPObject.Target2.html.style.borderWidth = "2px";
        GPObject.Target2.html.style.borderStyle = "solid";
        GPObject.Target2.html.style.borderColor = "red";
        GPObject.Target2.html.style.position = "absolute";
        GPObject.Target2.html.style.display = "none";
        GPObject.Target2.html.style.top = 0;
        GPObject.Target2.html.style.left = 0;
        
        GPObject.Target2.obj.AppendTo(document.body);
        GPObject.Target2.vp = mat4.create();
        GPObject.Target2.position = [0,0,0,0];
        
        os.console.Comment("    Creating Reticle");
        GPObject.Missile.Reticle.obj = os.resschmgr.Create.HTMLElement("div");
        GPObject.Missile.Reticle.html = GPObject.Missile.Reticle.obj.html();
        GPObject.Missile.Reticle.html.style.width = "50px";
        GPObject.Missile.Reticle.html.style.height = "50px";
        GPObject.Missile.Reticle.html.style.borderRadius = "50px";
        GPObject.Missile.Reticle.html.style.borderWidth = "2px";
        GPObject.Missile.Reticle.html.style.borderStyle = "solid";
        GPObject.Missile.Reticle.html.style.borderColor = "green";
        GPObject.Missile.Reticle.html.style.position = "absolute";
        GPObject.Missile.Reticle.html.style.display = "none";
        
        GPObject.Missile.Reticle.width = os.graphics.Get.Width() - 50;
        GPObject.Missile.Reticle.height = os.graphics.Get.Height() - 50;
        GPObject.Missile.Reticle.obj.AppendTo(document.body);
        GPObject.Missile.Reticle.position = vec3.create([(GPObject.Missile.Reticle.width / 2 - 25),(GPObject.Missile.Reticle.height / 2 - 25),0] );
        
        
        GPObject.Missile.Reticle.html.style.top =  GPObject.Missile.Reticle.position[1].toFixed(0) + "px";
        GPObject.Missile.Reticle.html.style.left = GPObject.Missile.Reticle.position[0].toFixed(0) + "px";
        
        
            
  
    },
    Audio: function(){
        os.audio.Initialize();
        os.audio.Add("battle","scripts/Applications/Audio/BattleTheme",true, false, "ogg");
        
        os.audio.Add("menu","scripts/Applications/Audio/MenuTheme",true, true, "ogg");
        os.audio.Set.Volume("menu", 0.5);
        
        os.audio.Add("explosion","scripts/Applications/Audio/Explosion",false, false, "ogg");
        os.audio.Set.Volume("explosion", 0.5);
        
        os.audio.Add("laser","scripts/Applications/Audio/Laser1",false, false, "ogg");
        os.audio.Set.Volume("laser", 0.5);
        
        os.audio.Add("chirp","scripts/Applications/Audio/Chirp",false, false, "ogg");
        os.audio.Set.Volume("chirp", 1.0);
        
        os.audio.Add("strike","scripts/Applications/Audio/missile_explosion",false, false, "ogg");
        os.audio.Set.Volume("strike", 0.5);
        
        os.audio.Add("rocket","scripts/Applications/Audio/rocket",false, false, "ogg");
        os.audio.Set.Volume("strike", 0.25);

        GPObject.Time.Cannon.last = (new Date()).getTime();
        GPObject.Time.Laser.last = (new Date()).getTime();
    
        os.audio.Play("menu");
        GPObject.CurrentSong = "menu";
    },
    HUD: function(){
        //HUD Health Bar Container
        GPObject.HUD.obj = os.resschmgr.Create.HTMLElement("div");
        GPObject.HUD.html = GPObject.HUD.obj.html();
        GPObject.HUD.html.id = "Health";
        GPObject.HUD.obj.AppendTo(document.body);
        
        //Fighter 1 Health Bar
        var bar = document.createElement("div");
        bar.className = "healthLabel";
        bar.innerHTML = "Fighter 1:";
        GPObject.HUD.obj.AppendChild(bar);
        
        bar = document.createElement("div");
        bar.className = "bar";
        GPObject.HUD.obj.AppendChild(bar);
        
        GPObject.HUD.Health.Fighter1.obj = os.resschmgr.Create.HTMLElement("div");
        GPObject.HUD.Health.Fighter1.html = GPObject.HUD.Health.Fighter1.obj.html();
        GPObject.HUD.Health.Fighter1.obj.Class.Add("health");
        GPObject.HUD.Health.Fighter1.obj.AppendTo(bar);
        
        var br = document.createElement("br");
        GPObject.HUD.obj.AppendChild(br);
        
        
        //Fighter 2 Health Bar
        bar = document.createElement("div");
        bar.className = "healthLabel";
        bar.innerHTML = "Fighter 2:";
        GPObject.HUD.obj.AppendChild(bar);
        
        bar = document.createElement("div");
        bar.className = "bar";
        GPObject.HUD.obj.AppendChild(bar);
        
        GPObject.HUD.Health.Fighter2.obj = os.resschmgr.Create.HTMLElement("div");
        GPObject.HUD.Health.Fighter2.html = GPObject.HUD.Health.Fighter2.obj.html();
        GPObject.HUD.Health.Fighter2.obj.Class.Add("health");
        GPObject.HUD.Health.Fighter2.obj.AppendTo(bar);
        
        br = document.createElement("br");
        GPObject.HUD.obj.AppendChild(br);
        
        //Gunship Health Bar
        bar = document.createElement("div");
        bar.className = "healthLabel";
        bar.innerHTML = "Gunship  :";
        GPObject.HUD.obj.AppendChild(bar);
        
        bar = document.createElement("div");
        bar.className = "bar";
        GPObject.HUD.obj.AppendChild(bar);
        
        GPObject.HUD.Health.Gunship.obj = os.resschmgr.Create.HTMLElement("div");
        GPObject.HUD.Health.Gunship.html = GPObject.HUD.Health.Gunship.obj.html();
        GPObject.HUD.Health.Gunship.obj.Class.Add("health");
        GPObject.HUD.Health.Gunship.obj.AppendTo(bar);

        
        //Hide HUD
        GPObject.HUD.html.style.display = "none";
        
        //Set Max Health
        GPObject.HUD.Health.Fighter1.max = 4;
        GPObject.HUD.Health.Fighter2.max = 4;
        GPObject.HUD.Health.Gunship.max  = 4;
        
        
        
    },
    MainMenu: function(){
        //
        document.body.style.backgroundColor = "black";
        
        
    
        //Load Containers
        GPObject.Menu.menu = os.resschmgr.Create.HTMLElement("div");
        GPObject.Menu.menu.html().id = "menu";
        GPObject.Menu.menu.html().style.zIndex = 5;
        GPObject.Menu.menu.AppendTo(document.body);
        
        
        GPObject.Menu.Buttons.container = os.resschmgr.Create.HTMLElement("div");
        GPObject.Menu.Buttons.container.html().id = "buttonContainer";
        GPObject.Menu.Buttons.container.AppendTo(GPObject.Menu.menu.html());
        
        GPObject.Menu.Descriptions.container = os.resschmgr.Create.HTMLElement("div");
        GPObject.Menu.Descriptions.container.html().id = "description";
        GPObject.Menu.Descriptions.container.html().style.zIndex = 5;
        GPObject.Menu.Descriptions.container.AppendTo(document.body);
        
        //Populate Menu
        GPObject.Menu.Buttons.play = os.resschmgr.Create.HTMLElement("div");
        GPObject.Menu.Buttons.play.html().id = "PlayBtn";
        GPObject.Menu.Buttons.play.Class.Add("options");
        GPObject.Menu.Buttons.play.html().innerHTML = "LOADING...";
        GPObject.Menu.Buttons.play.AppendTo(GPObject.Menu.Buttons.container.html());
        
        GPObject.Menu.Buttons.network = os.resschmgr.Create.HTMLElement("div");
        GPObject.Menu.Buttons.network.html().id = "NetworkBtn";
        GPObject.Menu.Buttons.network.Class.Add("options");
        GPObject.Menu.Buttons.network.html().innerHTML = "Hack Network";
        GPObject.Menu.Buttons.network.AppendTo(GPObject.Menu.Buttons.container.html());
        
        GPObject.Menu.Buttons.controls = os.resschmgr.Create.HTMLElement("div");
        GPObject.Menu.Buttons.controls.html().id = "ControlsBtn";
        GPObject.Menu.Buttons.controls.Class.Add("options");
        GPObject.Menu.Buttons.controls.html().innerHTML = "Instructions";
        GPObject.Menu.Buttons.controls.AppendTo(GPObject.Menu.Buttons.container.html());
        
        GPObject.Menu.Buttons.history = os.resschmgr.Create.HTMLElement("div");
        GPObject.Menu.Buttons.history.html().id = "HistoryBtn";
        GPObject.Menu.Buttons.history.Class.Add("options");
        GPObject.Menu.Buttons.history.html().innerHTML = "Rise of the Resistance";
        GPObject.Menu.Buttons.history.AppendTo(GPObject.Menu.Buttons.container.html());
        
        GPObject.Menu.Buttons.configure = os.resschmgr.Create.HTMLElement("div");
        GPObject.Menu.Buttons.configure.html().id = "ConfigureBtn";
        GPObject.Menu.Buttons.configure.Class.Add("options");
        GPObject.Menu.Buttons.configure.html().innerHTML = "Feedback";
        GPObject.Menu.Buttons.configure.AppendTo(GPObject.Menu.Buttons.container.html());
        
        GPObject.Menu.Buttons.credits = os.resschmgr.Create.HTMLElement("div");
        GPObject.Menu.Buttons.credits.html().id = "CreditsBtn";
        GPObject.Menu.Buttons.credits.Class.Add("options");
        GPObject.Menu.Buttons.credits.html().innerHTML = "Credits";
        GPObject.Menu.Buttons.credits.AppendTo(GPObject.Menu.Buttons.container.html());
        
        //Populate Descriptions
        GPObject.Menu.Descriptions.description = os.resschmgr.Create.HTMLElement("div");
        GPObject.Menu.Descriptions.description.html().id = "description";
        GPObject.Menu.Descriptions.description.Class.Add("descriptions");
        
        GPObject.Menu.Descriptions.play = os.resschmgr.Create.HTMLElement("div");
        GPObject.Menu.Descriptions.play.html().id = "PlayDesc";
        GPObject.Menu.Descriptions.play.Class.Add("descriptions");
        GPObject.Menu.Descriptions.play.html().innerHTML = 'Omega Resistance (OR) is a Browser Based Couch Co-Op 3D Space Arcade Shooter.' +
        "<br/><br/>In OR you are one of the elite hackers that has raised up against the Alliance and are looking to wreck havoc on their operations. Currently the Alliance is using autonomous controlled units to expand its reach in the universe, but the Omega Resistance has found a flaw in their security and has been able to take control over these autonomous units protecting the vital Alliance space infrastructure. You and a fellow hacker team together to try and knock out the autonomous units in hopes of stopping the spread of power from the Alliance." +
        "<br/><br/>Normally all operations of missile tracking, lasers and ship navigation are controlled by the Artificial Intelligent agents developed by the Alliance, but upon hacking the system, the AI is disabled and both of you must now take over the controls and see if you can knock out the other units before they destroy your ship or cut your connection from the network. The AI units are faster and have been trained to push their ship to the limit so you will have to act fast to strike them down first.";
        GPObject.Menu.Descriptions.container.AppendChild(GPObject.Menu.Descriptions.play.html());
        
        GPObject.Menu.Descriptions.network = os.resschmgr.Create.HTMLElement("div");
        GPObject.Menu.Descriptions.network.html().id = "NetworkDesc";
        GPObject.Menu.Descriptions.network.Class.Add("descriptions");
        GPObject.Menu.Descriptions.network.html().innerHTML = "<br/><br/>Networked Co-Op gameplay will be comming soon, Follow us on Twitter @GameTheoryLabs if you want to be part of the beta"
        GPObject.Menu.Descriptions.container.AppendChild(GPObject.Menu.Descriptions.network.html());
        
        GPObject.Menu.Descriptions.controls = os.resschmgr.Create.HTMLElement("div");
        GPObject.Menu.Descriptions.controls.html().id = "ControlsDesc";
        GPObject.Menu.Descriptions.controls.Class.Add("descriptions");
        GPObject.Menu.Descriptions.controls.html().innerHTML = "Runs only on Google Chrome" +
        "<br/><br/>Works with 2 Gamepads (XBOX 360 or PS3 controllers) or Keyboard/Mouse" +
        "<br/><br/>Your Goal is to destroy both enemy ships.  The ships will evade you once there health falls below a set threshold and they will regain health over time (as will you) <br/>"+
        "You can use lasers or missiles to attack the ships.  To fire a missile you must obtain a lock, but keep the green reticle on top of an enemy ships red reticle for 4 seconds, at that time either the 1st or 2nd player can launch a missile.  The missiles are heak seeking and will track the enemy ship, but can overshoot if the enemy evades.  The missiles will only have enough fuel for a small flight, so be sure you are close enough before you launch" +
        "<br/>Your ship must stay within a specific radius of the station, as this is how you are able to maintain your server connection to over ride the default AI.  If you move to far away, your life will be gine to drain, and if your life falls to 0, your connection will be severed." +
        "<br/><br/>The gameplay is quick, and after either a successful or unsuccessful mission you can restart the mission by pressing Y on Player 1's controller or Q on Keyboard"+
        "<br><br>Gamepad Controls" +
        "<br/><br/> Player 1: " +
        "<br/>X/B will toggle the debug mode, where you will see framerate and bounding volumes" +
        "<br/>Y/A will toggle the enemy ship chasing after you" +
        "<br/>Right Trigger Fires Lasers" +
        "<br/>Left Trigger Fires Missile (Once Target Locked)" +
        "<br/>Top shoulders will attach/detach camera" +
        "<br/>back/select, starts and stops music" +
        "<br/><br/>Player 2:"+
        "<br/>Left stick moves reticle, 4 second on target create a lock, and reticle turns red"+
        "<br/>Right Trigger: fires missile" +
        "<br/><br/>Keyboard Controls"+
        "<br/>WASD: Move Ship" +
        "<br/>Spacebar: Fire Lasers" +
        "<br/>F: Fires Missile (Once Target Locked)" +
        "<br/>Left Mouse + Move Rotates Ship" +
        "<br/>X: Debug Mode" +
        "<br/>C: Toggle Free Roam Camera" +
        "<br/>O: Musics On" +
        "<br/>P: Music Off" +
        "<br/>Q: Reset game and have AI ships attack" +
        "<br/>E: Cause AI ships to Flee from player" +
        "<br/><br/>ESC: Pauses game and brings up Main Menu";
        GPObject.Menu.Descriptions.container.AppendChild(GPObject.Menu.Descriptions.controls.html());
        
        GPObject.Menu.Descriptions.history = os.resschmgr.Create.HTMLElement("div");
        GPObject.Menu.Descriptions.history.html().id = "HistoryDesc";
        GPObject.Menu.Descriptions.history.Class.Add("descriptions");
        GPObject.Menu.Descriptions.history.html().innerHTML = '<p>Technology continued to increase, while government based economies continued to suffer.</p>' +
'<p><br />Technology corporations began to thrive and became the only financially viable entities. Countries began to fail and were forced to sell land and resources to the corporations to stay solvent. In 2077 countries as we know it were dissolved which made these corporations the new world powers.<br />This new style of government was a mixture of communism and capitalism. A free world economy but controlled and directed by a few.<br />These large corporations were the tops in every major industry. They formed &ldquo;The Alliance&rdquo;. A corporate conglomeration that brought peace to the world, through the tight control over the worlds resources.</p>'+
'<p><br />The Alliance controlled every job available in the civilized world. Those who chose to live outside of their control were forced to live in a world with out technology, medicine, agriculture and manufacturing. They lived an archaic life, in a futuristic world.<br />With the tight grip on the world&rsquo;s resources, The Alliance was able to make huge strides in technology. Advanced Artificial Intelligence, Quantum Computing and Communications, Nanoscale manufacturing and sub atomic particle manipulation all became possible in just a few short years after the Alliance was formed. These technologies lead to the exploration of the known universe as well as the expansion of The Alliance beyond Earth.<br />The Alliance began to push ubiquitous computing and ambient intelligence connecting everything and everyone to their technology, forming massive computer networks that allowed for collecting, sharing and dissemination of information. This was meant solidify The Alliance&rsquo;s control of the world by increasing its dependence on technology, but this was the singular event that would lead to rise of the only group to battle the Alliance and its grip on humanity.<br />This group was the last hope, the last opportunity to break the tight grip The Alliance had on the world. They became know as the Omega Resistance (OR).<br />No one knows who makes up the OR, not even its own members. It is a network of computer savy hackers that have infiltrated The Alliance core networks and used its push for pervasive computingagainst them. OR did not have the access to large server farms or the hardware backend that The Alliance maintained, and had no way of creating or purchasing such technology due to The Alliances control on the market. But with the connection of all electronic devices to Internet and The Alliances main network, they realized they didn&rsquo;t need standalone systems, instead OR embedded small pieces of code over hundreds of thousands of computing devices. At any given moment there were plenty of devices online that held small pieces of OR code, that allowed for them to develop a virtual cloud based distributed network. ORs network lived inside of The Alliances very own network, it was a virus that effected well over 50% of all connected machines.</p>' +
'<p><br />The premise of ORs network was built around SWARM technology developed years earlier. The idea is that instead of a single complex machine/algorithm/application, you combined 100&rsquo;s or 1,000&rsquo;s of small simple machines/algorithms/applications that could be combined to perform the task of a single complex system. This allowed for built in redundancy, as if one node in the SWARM was to fail, there were plenty of others that could easily pick up the required task. OR took every need of a complex network and broke it down to simple individual nodes. These nodes were then distributed across The Alliances network undetected, as each node individually was harmless to the network. Once distributed OR could then dynamically connect to infected machines and form a powerful computing network on the fly, and subsequently shut down the network if The Alliance got to close.</p>';
        GPObject.Menu.Descriptions.container.AppendChild(GPObject.Menu.Descriptions.history.html());
        
        GPObject.Menu.Descriptions.configure = os.resschmgr.Create.HTMLElement("div");
        GPObject.Menu.Descriptions.configure.html().id = "ConfigureDesc";
        GPObject.Menu.Descriptions.configure.Class.Add("descriptions");
        GPObject.Menu.Descriptions.configure.html().innerHTML = '<iframe src="https://docs.google.com/spreadsheet/embeddedform?formkey=dEoxNFdlQ08tVG1fNVFaU3lYZFU2a1E6MQ" width="760" height="1032" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>';//"Control Confgurations and Senesitivity Adjustments Comming Soon";
        GPObject.Menu.Descriptions.container.AppendChild(GPObject.Menu.Descriptions.configure.html());
        
        GPObject.Menu.Descriptions.credits = os.resschmgr.Create.HTMLElement("div");
        GPObject.Menu.Descriptions.credits.html().id = "CreditsDesc";
        GPObject.Menu.Descriptions.credits.Class.Add("descriptions");
        GPObject.Menu.Descriptions.credits.html().innerHTML = "Developed using JaHOVA OS <br/><br/>Engine Development: Corey Clark" +
        "<br/><br/>Physics Engine:   Corey Clark" +
        "<br/><br/>AI Engine:        Corey Clark" +
        "<br/><br/>Particle Effects: Jacob Clark" +
        "<br/><br/>Graphics Engine:  Corey Clark";
        GPObject.Menu.Descriptions.container.AppendChild(GPObject.Menu.Descriptions.credits.html());
        
        //
        //  CALLBACKS
        //
        
        GPObject.Menu.Descriptions.container.html().addEventListener('webkitAnimationEnd', function(){
            GPObject.Menu.Descriptions.container.html().style.webkitAnimationName = '';
            GPObject.Menu.Descriptions.currentDescription.html().style.display = "block";
            }, false);
        
        GPObject.Menu.Buttons.play.html().onclick = function(){
            GPObject.Menu.Descriptions.container.html().style.webkitAnimation = "";
            GPObject.Menu.Descriptions.currentDescription.html().style.display = "none";
            GPObject.Menu.Descriptions.container.html().style.webkitAnimation =  "flip 1000ms ease-in";
            GPObject.Menu.Descriptions.currentDescription = GPObject.Menu.Descriptions.play;
            if(GPObject.Menu.Buttons.play.html().innerHTML == "Play Now"){
                //Add Targeting Reticles
                GPObject.Missile.Reticle.html.style.display = "block";
                GPObject.Target.html.style.display = "block";
                GPObject.Target2.html.style.display = "block";
                
                //Hide Menu Elements
                GPObject.Menu.menu.html().style.display = "none";
                GPObject.Menu.video.html().pause();
                GPObject.Menu.video.html().style.display = "none";
                GPObject.Menu.Descriptions.container.html().style.display = "none";
                
                //Show HUD
                GPObject.HUD.html.style.display = "block";
                
                //Start Graphics
                if(!GPObject.gameStarted){
                    os.graphics.Start();
                    GPStartGame();
                    GPObject.gameStarted  = true;
                }
                else{
                    
                    os.graphics.Resume();
                }
                
                
                
                
            }
        }
        
        GPObject.Menu.Buttons.network.html().onclick = function(){
            GPObject.Menu.Descriptions.container.html().style.webkitAnimation = "";
            GPObject.Menu.Descriptions.currentDescription.html().style.display = "none";
            GPObject.Menu.Descriptions.container.html().style.webkitAnimation =  "flip 1000ms ease-in";
            GPObject.Menu.Descriptions.currentDescription = GPObject.Menu.Descriptions.network;
        }
        
        GPObject.Menu.Buttons.controls.html().onclick = function(){
            GPObject.Menu.Descriptions.container.html().style.webkitAnimation = "";
            GPObject.Menu.Descriptions.currentDescription.html().style.display = "none";
            GPObject.Menu.Descriptions.container.html().style.webkitAnimation =  "flip 1000ms ease-in";
            GPObject.Menu.Descriptions.currentDescription = GPObject.Menu.Descriptions.controls;
        }
        
        GPObject.Menu.Buttons.history.html().onclick = function(){
            GPObject.Menu.Descriptions.container.html().style.webkitAnimation = "";
            GPObject.Menu.Descriptions.currentDescription.html().style.display = "none";
            GPObject.Menu.Descriptions.container.html().style.webkitAnimation =  "flip 1000ms ease-in";
            GPObject.Menu.Descriptions.currentDescription = GPObject.Menu.Descriptions.history;
        }
        
        GPObject.Menu.Buttons.configure.html().onclick = function(){
            GPObject.Menu.Descriptions.container.html().style.webkitAnimation = "";
            GPObject.Menu.Descriptions.currentDescription.html().style.display = "none";
            GPObject.Menu.Descriptions.container.html().style.webkitAnimation =  "flip 1000ms ease-in";
            GPObject.Menu.Descriptions.currentDescription = GPObject.Menu.Descriptions.configure;
        }
        
        GPObject.Menu.Buttons.credits.html().onclick = function(){
            GPObject.Menu.Descriptions.container.html().style.webkitAnimation = "";
            GPObject.Menu.Descriptions.currentDescription.html().style.display = "none";
            GPObject.Menu.Descriptions.container.html().style.webkitAnimation =  "flip 1000ms ease-in";
            GPObject.Menu.Descriptions.currentDescription = GPObject.Menu.Descriptions.credits;
        }
        GPObject.Menu.Descriptions.currentDescription = GPObject.Menu.Descriptions.play;
        GPObject.Menu.Descriptions.currentDescription.html().style.display = "block";
    
        //Load Background Video
        GPObject.Menu.video = os.resschmgr.Create.HTMLElement("video");
        GPObject.Menu.video.html().id = "video";
        GPObject.Menu.video.html().src = "images/background.webm";
        GPObject.Menu.video.html().setAttribute('preload', 'auto');
        GPObject.Menu.video.html().setAttribute('autoplay', 'autoplay');
        GPObject.Menu.video.html().setAttribute('loop', 'loop');
        GPObject.Menu.video.html().style.width = "100%";
        GPObject.Menu.video.html().style.height = "100%";
        GPObject.Menu.video.html().style.display = "block";
        GPObject.Menu.video.html().style.position = "absolute";
        GPObject.Menu.video.html().style.left = "0px";
        GPObject.Menu.video.html().style.top =  "0px";
        GPObject.Menu.video.html().style.zIndex = 0;
        GPObject.Menu.video.AppendTo(document.body);
        
    },
    Skybox: function(){
        //Load Skybox Textures
        var space = os.graphics.Managers.Texture.Create.CubeMap("skybox");
        space.callback = function(){GPAssetComplete()};
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
        GPObject.skybox = skybox;
        
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
                    return raw.buttons[self.indicies.Dpad.up].value;
                },
                Down: function(){
                    return raw.buttons[self.indicies.Dpad.down].value;
                },
                Left: function(){
                    return raw.buttons[self.indicies.Dpad.left].value;
                },
                Right: function(){
                    return raw.buttons[self.indicies.Dpad.right].value;
                }
            }
            this.LeftShoulder ={
                Top: function(){
                    return raw.buttons[self.indicies.LeftShoulder.top].value;
                },
                Bottom: function(){
                    return raw.buttons[self.indicies.LeftShoulder.bottom].value;
                }
            }           
            this.RightShoulder ={
                Top: function(){
                    return raw.buttons[self.indicies.RightShoulder.top].value;
                },
                Bottom: function(){
                    return raw.buttons[self.indicies.RightShoulder.bottom].value;
                }
            }
            
            this.Buttons = {
                Top: function(){
                    return raw.buttons[self.indicies.Buttons.top].value;
                },
                Bottom: function(){
                    return raw.buttons[self.indicies.Buttons.bottom].value;
                },
                Left: function(){
                    return raw.buttons[self.indicies.Buttons.left].value;
                },
                Right: function(){
                    return raw.buttons[self.indicies.Buttons.right].value;
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
                    return raw.buttons[self.indicies.LeftStick.button].value;
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
                    return raw.buttons[self.indicies.RightStick.button].value;
                }
            }
            
            this.Select = function(){ return raw.buttons[self.indicies.select].value;}
            this.Start =  function(){ return raw.buttons[self.indicies.start].value;}

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
                    os.input.Gamepads.Raw.current = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
                        // (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) ||
                        // navigator.webkitGamepads;
                
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
    
        GPObject.Missile.left.thruster = ParticleManager.Create("thruster1");
        GPObject.Missile.left.thruster.Attach(GPObject.Missile.left.graphics);
        GPObject.Missile.left.thruster.Set.Scale(1,1,1);
        GPObject.Missile.left.thruster.Set.Offset(0.0,0.0,-5.5);
        //ParticleManager.Start(GPObject.Missile.left.thruster.id);
        
        GPObject.Missile.right.thruster = ParticleManager.Create("thruster1");
        GPObject.Missile.right.thruster.Attach(GPObject.Missile.right.graphics);
        GPObject.Missile.right.thruster.Set.Scale(1,1,1);
        GPObject.Missile.right.thruster.Set.Offset(0.0,0,-5.5);
        //ParticleManager.Start(GPObject.Missile.left.thruster.id);
        
        GPObject.Thursters.Gunship.left = ParticleManager.Create("thruster1");
        GPObject.Thursters.Gunship.left.Attach(GPObject.gunship);
        GPObject.Thursters.Gunship.left.Set.Scale(2,2,2);
        GPObject.Thursters.Gunship.left.Set.Offset(-3,-3.5,-10)
        ParticleManager.Start(GPObject.Thursters.Gunship.left.id);
        
        
        GPObject.Thursters.Gunship.right = ParticleManager.Create("thruster1");
        GPObject.Thursters.Gunship.right.Attach(GPObject.gunship);
        GPObject.Thursters.Gunship.right.Set.Scale(2,2,2);
        GPObject.Thursters.Gunship.right.Set.Offset(3,-3.5,-10)
        ParticleManager.Start(GPObject.Thursters.Gunship.right.id);
        
        GPObject.Thursters.Fighter2.right = ParticleManager.Create("thruster1");
        GPObject.Thursters.Fighter2.right.Attach(GPObject.fighter2);
        GPObject.Thursters.Fighter2.right.Set.Scale(2,2,2);
        GPObject.Thursters.Fighter2.right.Set.Offset(3,0,-17 )
        ParticleManager.Start(GPObject.Thursters.Fighter2.right.id);
        
        GPObject.Thursters.Fighter2.left = ParticleManager.Create("thruster1");
        GPObject.Thursters.Fighter2.left.Attach(GPObject.fighter2);
        GPObject.Thursters.Fighter2.left.Set.Scale(2,2,2);
        GPObject.Thursters.Fighter2.left.Set.Offset(-3,0,-17 )
        ParticleManager.Start(GPObject.Thursters.Fighter2.left.id);
        
        GPObject.Thursters.Fighter1.botRight = ParticleManager.Create("thruster1");
        GPObject.Thursters.Fighter1.botRight.Attach(GPObject.fighter1);
        GPObject.Thursters.Fighter1.botRight.Set.Scale(1,1,1);
        GPObject.Thursters.Fighter1.botRight.Set.Offset(3.5,-1,-10)
        ParticleManager.Start(GPObject.Thursters.Fighter1.botRight.id);
        
        GPObject.Thursters.Fighter1.topRight = ParticleManager.Create("thruster1");
        GPObject.Thursters.Fighter1.topRight.Attach(GPObject.fighter1);
        GPObject.Thursters.Fighter1.topRight.Set.Scale(1,1,1);
        GPObject.Thursters.Fighter1.topRight.Set.Offset(3.5,1,-9)
        ParticleManager.Start(GPObject.Thursters.Fighter1.topRight.id);
        
        GPObject.Thursters.Fighter1.botLeft = ParticleManager.Create("thruster1");
        GPObject.Thursters.Fighter1.botLeft.Attach(GPObject.fighter1);
        GPObject.Thursters.Fighter1.botLeft.Set.Scale(1,1,1);
        GPObject.Thursters.Fighter1.botLeft.Set.Offset(-4.5,-1,-9)
        ParticleManager.Start(GPObject.Thursters.Fighter1.botLeft.id);
        
        GPObject.Thursters.Fighter1.topLeft = ParticleManager.Create("thruster1");
        GPObject.Thursters.Fighter1.topLeft.Attach(GPObject.fighter1);
        GPObject.Thursters.Fighter1.topLeft.Set.Scale(1,1,1);
        GPObject.Thursters.Fighter1.topLeft.Set.Offset(-4,1,-9)
        ParticleManager.Start(GPObject.Thursters.Fighter1.topLeft.id);
        
        GPObject.Explosions.Gunship = ParticleManager.Create("explosion");
        GPObject.Explosions.Gunship.Attach(GPObject.gunship);
        GPObject.Explosions.Gunship.Set.Scale(4,4,4);
        GPObject.Explosions.Gunship.Set.Offset(0,0,8);
        ParticleManager.Start(GPObject.Explosions.Gunship.id);
        
        GPObject.Explosions.Fighter1 = ParticleManager.Create("explosion");
        GPObject.Explosions.Fighter1.Attach(GPObject.fighter1);
        GPObject.Explosions.Fighter1.Set.Scale(4,4,4);
        GPObject.Explosions.Fighter1.Set.Offset(0,0,8);
        ParticleManager.Start(GPObject.Explosions.Fighter1.id);
        
        GPObject.Explosions.Fighter2 = ParticleManager.Create("explosion");
        GPObject.Explosions.Fighter2.Attach(GPObject.fighter2);
        GPObject.Explosions.Fighter2.Set.Scale(4,4,4);
        GPObject.Explosions.Fighter2.Set.Offset(0,0,8);
        ParticleManager.Start(GPObject.Explosions.Fighter2.id);
        
        
            
        
        
    },
    
    Controls: function(){
        var GPConnected = function(gamepad){
            //os.windows.Create.MessageWindow("GP Connected", "GP[" + gamepad.id + "]<br/> Type: " + gamepad.type );
        }
        
        var GPDisconnected = function(gamepad){
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
                GPObject.gunship.yaw = cam.Rotation.yaw;
                GPObject.gunship.pitch = cam.Rotation.pitch;
            }
        }
        
        
        var MoveShip = function(e){
            
            if(String.fromCharCode(e.keyCode) == "W" || e.keyCode == 38){          //Straif Forward
                //os.physics.Create.Force.LocalImpulse(ORObject.fighter2.Physics,[0,0,0],[0,0,800]);
                GPKeys.w = true;
            }
            else if(String.fromCharCode(e.keyCode) == "A" || e.keyCode == 37){     //Straif Left
                GPKeys.a = true;
            }
            else if(String.fromCharCode(e.keyCode) == "S" || e.keyCode == 40){     //Straif Backward
                GPKeys.s = true;
            }
            else if(String.fromCharCode(e.keyCode) == "D" || e.keyCode == 39){     //Straif Right
                GPKeys.d = true;
            }
        }
        var KeyUp = function(e){
            if(String.fromCharCode(e.keyCode) == "W" || e.keyCode == 38){          //Straif Forward
                //os.physics.Create.Force.LocalImpulse(ORObject.fighter2.Physics,[0,0,0],[0,0,800]);
                GPKeys.w = false;
            }
            else if(String.fromCharCode(e.keyCode) == "A" || e.keyCode == 37){     //Straif Left
                GPKeys.a = false;
            }
            else if(String.fromCharCode(e.keyCode) == "S" || e.keyCode == 40){     //Straif Backward
                GPKeys.s = false;
            }
            else if(String.fromCharCode(e.keyCode) == "D" || e.keyCode == 39){     //Straif Right
                GPKeys.d = false;
            }
        }
        var Actions = function(e){
            if(e.keyCode == 32){          //Fire
                if(GPObject.Time.Laser.last + os.audio.Get.Duration("laser") * 1000 < os.graphics.Time.current){
                    os.audio.Play("laser");
                    GPObject.Time.Laser.last = os.graphics.Time.current;
                    bullet = new CBullet(GPObject.gunship)
                    bullet.AddGraphic([-7.8,1.8,16.15]);
                    bullet.AddGraphic([-7.8,0.8,16.15]);
                    bullet.AddGraphic([7.8,1.8,16.15]);
                    bullet.AddGraphic([7.8,0.8,16.15]);
                    
                }
            }
            else if(String.fromCharCode(e.keyCode) == "Q"){ // Ships Attack
                if(!GPObject.fighter2.AI.MovementAlgorithms.SeekEntity){
                    os.audio.Play("chirp");
                    os.audio.Play("battle");
                    GPObject.CurrentSong = "battle";
                    os.audio.Pause("menu");
                    
                    GPObject.gunship.hits = 0;
                    GPObject.fighter1.hits = 0;
                    GPObject.fighter2.hits = 0;
                    
                    GPObject.Thursters.Gunship.right.Start();
                    GPObject.Thursters.Gunship.left.Start();
                    GPObject.Thursters.Fighter2.left.Start();
                    GPObject.Thursters.Fighter2.right.Start();
                    GPObject.Thursters.Fighter1.botLeft.Start();
                    GPObject.Thursters.Fighter1.botRight.Start();
                    GPObject.Thursters.Fighter1.topLeft.Start();
                    GPObject.Thursters.Fighter1.topRight.Start();
                    
                    GPObject.fighter2.AI.Movement.Disable.Hide.Entity();
                    GPObject.fighter2.AI.Movement.Disable.Patrol.Circle();
                    GPObject.fighter1.AI.Movement.Disable.Hide.Entity();
                    GPObject.fighter1.AI.Movement.Disable.Patrol.Circle();
                    
                    os.ai.Movement.Add.Seek.Entity(GPObject.fighter2, GPObject.gunship);
                    os.ai.Movement.Add.Seek.Entity(GPObject.fighter1, GPObject.gunship);
                    
                    //GPObject.gunship.yaw = 0;
                    //GPObject.gunship.pitch = 0;
                    os.graphics.Managers.Camera.Attach(GPObject.gunship);
                    os.graphics.Managers.Camera.Offset = vec3.create([0,5,80]);
                    
                    GPObject.Missile.left.launched = false;
                    GPObject.Missile.left.graphics.Physics = null;
                    mat4.identity(GPObject.Missile.left.graphics.Default.Offset);
                    mat4.rotateX(GPObject.Missile.left.graphics.Default.Offset, degToRad(180), GPObject.Missile.left.graphics.Default.Offset);
                    GPObject.Missile.left.graphics.Graphics.Matrix.Parent = GPObject.gunship.Graphics.Matrix.World;
                    GPObject.Missile.left.graphics.Set.Position(-1.55,-0.41,-0.495);
                    GPObject.Missile.left.graphics.Set.Scale(0.1,0.1,0.1);
                    GPObject.Missile.left.graphics.pitch = 11;//GPObject.gunship.pitch;
                    GPObject.Missile.left.graphics.yaw  = 0;//GPObject.gunship.yaw;
                    
                    GPObject.Missile.right.launched = false;
                    GPObject.Missile.right.graphics.Physics = null;
                    mat4.identity(GPObject.Missile.right.graphics.Default.Offset);
                    mat4.rotateX(GPObject.Missile.right.graphics.Default.Offset, degToRad(180), GPObject.Missile.right.graphics.Default.Offset);
                    GPObject.Missile.right.graphics.Graphics.Matrix.Parent = GPObject.gunship.Graphics.Matrix.World;
                    GPObject.Missile.right.graphics.Set.Position(1.55,-0.41,-0.495);
                    GPObject.Missile.right.graphics.Set.Scale(0.1,0.1,0.1);
                    GPObject.Missile.right.graphics.pitch = 11; //GPObject.gunship.pitch;
                    GPObject.Missile.right.graphics.yaw  = 0;//GPObject.gunship.yaw ;
                }
            }
            else if(String.fromCharCode(e.keyCode) == "E"){  //Ships Hide
                if(!GPObject.fighter2.AI.MovementAlgorithms.HideEntity ){
                    os.audio.Play("chirp");
                    os.audio.Play("menu");
                    GPObject.CurrentSong = "menu";
                    os.audio.Pause("battle");
                    
                    var hidingSpots = [];
                    hidingSpots.push([-660,15,910]);
                    hidingSpots.push([-1075,5,-350]);
                    hidingSpots.push([-5,10,-1130]);
                    hidingSpots.push([1075,10,-350]);
                    hidingSpots.push([670,5,915]);
                    offsets = [420,420,420,420,420];
                    
                    
                    
                    if(!GPObject.fighter2.AI.MovementAlgorithms.HideEntity ){
                        GPObject.fighter2.AI.Movement.Disable.Seek.Entity();
                        
                        GPObject.Thursters.Fighter2.left.Start();
                        GPObject.Thursters.Fighter2.right.Start();
                        
                        os.ai.Movement.Add.Hide.Entity(GPObject.fighter2, GPObject.gunship,hidingSpots,offsets);
                    }
                    if(!GPObject.fighter1.AI.MovementAlgorithms.HideEntity){
                        GPObject.fighter1.AI.Movement.Disable.Seek.Entity();
                        
                        GPObject.Thursters.Fighter1.botLeft.Start();
                        GPObject.Thursters.Fighter1.botRight.Start();
                        GPObject.Thursters.Fighter1.topLeft.Start();
                        GPObject.Thursters.Fighter1.topRight.Start();
                        
                        os.ai.Movement.Add.Hide.Entity(GPObject.fighter1, GPObject.gunship,hidingSpots,offsets);
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
                    cam.Position[0] = GPObject.gunship.Position[0];
                    cam.Position[1] = GPObject.gunship.Position[1];
                    cam.Position[2] = GPObject.gunship.Position[2];
                }
                else{
                    os.graphics.Managers.Camera.Attach(GPObject.gunship);
                    os.graphics.Managers.Camera.Offset = vec3.create([0,5,80]);
                }
            
                
            }
            else if(String.fromCharCode(e.keyCode) == "X"){ //Toogle Test/Debug
                if(GPObject.Debug.set){
                    GPObject.Debug.set = false;
                    GPObject.Debug.Win.Hide.window();
                }
                else{
                    GPObject.Debug.set = true;
                    GPObject.Debug.Win.Display.window();
                }
                
                
            }
            else if(String.fromCharCode(e.keyCode) == "O"){  //Music ON
                os.audio.Play("chirp");
                os.audio.Play(GPObject.CurrentSong);
            }
            else if(String.fromCharCode(e.keyCode) == "P"){  //Music OFF
                os.audio.Play("chirp");
                os.audio.Pause(GPObject.CurrentSong);
            }
            else if(String.fromCharCode(e.keyCode) == "L"){  //Disable Lighting
                os.audio.Play("chirp");
                
            }
            else if(e.keyCode == 27){                       //Pause Game and show Menu
                os.graphics.Pause();
                //Add Targeting Reticles
                GPObject.Missile.Reticle.html.style.display = "none";
                GPObject.Target.html.style.display = "none";
                GPObject.Target2.html.style.display = "none";
                
                //Hide Menu Elements
                GPObject.Menu.menu.html().style.display = "block";
                GPObject.Menu.Descriptions.container.html().style.display = "block";
                
                //Hide HUD
                GPObject.HUD.html.style.display = "none";
                
            }
            else if(String.fromCharCode(e.keyCode) == "F"){ //Fire Missile
                if(GPObject.Missile.Reticle.Time.fighter1 > 1000 ){
                    //Shoot Missle
                    if(!GPObject.Missile.left.launched){         //Launch Left Missile
                            GPObject.Missile.Reticle.Time.fighter1 = 0;
                            GPObject.Missile.left.fire(GPObject.fighter1);
                            
                        }
                    else if(!GPObject.Missile.right.launched){   //Launch Right Missile
                        GPObject.Missile.Reticle.Time.fighter1 = 0;
                        GPObject.Missile.right.fire(GPObject.fighter1);
                        
                    }
                    
                }
                else if(GPObject.Missile.Reticle.Time.fighter2 > 1000){ //Figther 2 Target
                    
                    if(!GPObject.Missile.left.launched){         //Launch Left Missile
                            GPObject.Missile.Reticle.Time.fighter2 = 0;
                            GPObject.Missile.left.fire(GPObject.fighter2);
                            
                            
                        }
                    else if(!GPObject.Missile.right.launched){   //Launch Right Missile
                        GPObject.Missile.Reticle.Time.fighter2 = 0;
                        GPObject.Missile.right.fire(GPObject.fighter2);
                        
                    }
                    
                }
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
        os.input.Register.Keyboard.Event.Keydown("F",Actions);
        os.input.Register.Keyboard.Event.Keydown("E",Actions);
        os.input.Register.Keyboard.Event.Keydown("C",Actions);
        os.input.Register.Keyboard.Event.Keydown("X",Actions);
        os.input.Register.Keyboard.Event.Keydown("O",Actions);
        os.input.Register.Keyboard.Event.Keydown("P",Actions);
        os.input.Register.Keyboard.Event.Keydown("Z",Actions);
        os.input.Register.Keyboard.Event.Keydown("L",Actions);
        os.input.Register.Keyboard.Event.Keydown(27,Actions);
        
        os.input.Register.Gamepad.Event.Connected(GPConnected);
        os.input.Register.Gamepad.Event.Disconnected(GPDisconnected);
        
        //AI collision Avoidance 20,6,30
        os.ai.Movement.Add.Avoidance(GPObject.fighter2,[20,6,100],os.physics.bvs.slice(0,18));
        os.ai.Movement.Add.Avoidance(GPObject.fighter1,[20,6,100],os.physics.bvs.slice(0,18));
        
        os.ai.Movement.Add.Patrol.Circle(GPObject.fighter1, 1500, [0,0,0]);
        os.ai.Movement.Add.Patrol.Circle(GPObject.fighter2, 1500, [0,0,0]);
      
    },
    Bullets: function(){
        GPObject.Bullets.list = [];
        GPObject.Bullets.graphics = os.graphics.Managers.Entity.Create();
        GPObject.Bullets.graphics.Graphics.Add.Mesh("cube");
        GPObject.Bullets.graphics.Graphics.Add.Texture("bullet");
        GPObject.Bullets.graphics.Graphics.Set.light(true);
        GPObject.Bullets.graphics.Graphics.Set.ambientColor([1.0,1.0,1.0]);
        GPObject.Bullets.graphics.Graphics.Set.specular(false);
        GPObject.Bullets.graphics.Set.Scale(0.2,0.2,1);
        GPObject.Bullets.graphics.Physics ={
            position: [],
            orientation: []
        }
        GPObject.Bullets.Update = function(dt){
            var cur = (new Date()).getTime();
            for( var i = GPObject.Bullets.list.length - 1; i >= 0; i--){
                var bullet = GPObject.Bullets.list[i];
                
                if((cur - bullet.fireTime) > bullet.duration){
                    GPObject.Bullets.list.splice(i,1);
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
        GPObject.Bullets.graphics.Update = GPObject.Bullets.Update;
        GPObject.Bullets.Draw = function(){
            for( var i = GPObject.Bullets.list.length - 1; i >= 0; i--){
                
                var bullet = GPObject.Bullets.list[i];
                quat4.set(bullet.orientation,GPObject.Bullets.graphics.Physics.orientation);
                
                for(var j = bullet.instances.length - 1; j >= 0; j--){
                    
                    GPObject.Bullets.graphics.Physics.position = bullet.instances[j].Position;
                    GPObject.Bullets.graphics.Graphics.Draw();
                }
                
            }
        }
        
        GPObject.Bullets.bv.graphics = os.graphics.Managers.Entity.Create();
        GPObject.Bullets.bv.graphics.Graphics.Add.Mesh("cube");
        GPObject.Bullets.bv.graphics.Set.Position(0, 5, -410);
        GPObject.Bullets.bv.graphics.Set.Scale(7.8, 1, 1);
        GPObject.Bullets.bv.graphics.Physics = {
            position: [],
            orientation: []
        }
        GPObject.Bullets.bv.graphics.Graphics.Set.useBlendColor(true);
        GPObject.Bullets.bv.graphics.Graphics.Set.texture(false);
        GPObject.Bullets.bv.graphics.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        //GPObject.Debug.bv.push(bv);

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
        
        bv = os.physics.Create.BV.Sphere(null,400,[-1075,5,-350]);
        bv.name = 1;
        
        bv = os.physics.Create.BV.Sphere(null,400,[-5,10,-1130]);
        bv.name = 2;
        
        bv = os.physics.Create.BV.Sphere(null,400,[1075,10,-350]);
        bv.name = 3;
        
        bv = os.physics.Create.BV.Sphere(null,400,[670,5,915]);
        bv.name = 4;
        
        //Boxes
        bv = os.physics.Create.BV.OBB(null,[47,52.5,297],[-240,15,330]);
        bv.name = 5;
        bv.orientation = BuildOrientation(36,0,0);
        
        bv = os.physics.Create.BV.OBB(null,[47,52.5,297],[-405,10,-125]);
        bv.name = 6;
        bv.orientation = BuildOrientation(108,0,0);
        
        bv = os.physics.Create.BV.OBB(null,[47,52.5,297],[0, 5, -410]);
        bv.name = 7;
        bv.orientation = BuildOrientation(0,0,0);
        
        bv = os.physics.Create.BV.OBB(null,[47,52.5,297],[405, 10, -135]);
        bv.name = 8;
        bv.orientation = BuildOrientation(-108,0,0);
        
        bv = os.physics.Create.BV.OBB(null,[47,52.5,297],[240,15,330]);
        bv.name = 9;
        bv.orientation = BuildOrientation(-36,0,0);
        
        //Tower
        bv = os.physics.Create.BV.OBB(null,[94.75, 980, 97.75],[0,75,0]);
        bv.name = 10;
        bv.orientation = BuildOrientation(0,0,0);
        
        bv = os.physics.Create.BV.Sphere(null,205,[0,-455,0]);
        bv.name = 11;
        
        bv = os.physics.Create.BV.Sphere(null,180,[0,435,0]);
        bv.name = 12;
        
        ////Ring
        bv = os.physics.Create.BV.OBB(null,[174.5, 13.5, 23.5],[-295, 10, 105]);
        bv.name = 13;
        bv.orientation = BuildOrientation(71,0,0);
        
        bv = os.physics.Create.BV.OBB(null,[174.5, 13.5, 23.5],[-185, 10, -255]);
        bv.name = 14;
        bv.orientation = BuildOrientation(-38,0,0);
        
        bv = os.physics.Create.BV.OBB(null,[174.5, 13.5, 23.5],[185, 10, -255]);
        bv.name = 15;
        bv.orientation = BuildOrientation(38,0,0);
        
        bv = os.physics.Create.BV.OBB(null,[174.5, 13.5, 23.5],[295, 10, 105]);
        bv.name = 16;
        bv.orientation = BuildOrientation(-71,0,0);
        
        bv = os.physics.Create.BV.OBB(null,[174.5, 13.5, 23.5],[0, 5, 315]);
        bv.name = 17;
        bv.orientation = BuildOrientation(0,0,0);
        
        //Gunship
        bv = os.physics.Create.BV.Sphere(null,12,GPObject.gunship.Position);
        bv.name = 18;
        
        //Fighter
        bv = os.physics.Create.BV.Sphere(null,12,GPObject.fighter2.Physics.position);
        bv.name = 19;
        
        bv = os.physics.Create.BV.Sphere(null,12,GPObject.fighter1.Physics.position);
        bv.name = 20;
        
        GPObject.Bullets.bv.obj = os.physics.Create.BV.OBB(null,[7.8, 1, 1],[0, 0, 0]);
        GPObject.Bullets.bv.obj.name = 21;
        GPObject.Bullets.bv.obj.orientation = BuildOrientation(0,0,0);
        
        //bv = os.physics.Create.BV.OBB(null,[17.1,5.35,17.35],GPObject.gunship.Position);
        //bv.name = 17;
        //bv.orientation = GPObject.gunship.orientation; //BuildOrientation(0,0,0);
        
    },
    Debug: function(){
        GPObject.Debug.Win = os.windows.WindowsManager.Create.Window("Omega Resistance", "PC");
        GPObject.Debug.Win.Set.position(0,0);
        GPObject.Debug.Win.elements.content.html().style.overflow = "hidden";
        GPObject.Debug.Win.Set.statusbarText("");
        //GPObject.Debug.Win.Display.window();
        GPObject.Debug.Win.Set.width(200);
        GPObject.Debug.Win.Set.height(60);
        GPObject.Debug.Win.Hide.menubar();
        GPObject.Debug.Win.Set.onMax(os.graphics.OnReset);
        GPObject.Debug.Win.Set.onMin(os.graphics.Pause);
            
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
                ParticleManager.Start(GPObject.Explosions.Gunship.id);
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
        GPObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("sphere");
        bv.Set.Position(-1075,5,-350);
        bv.Set.Scale(20,20,20);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        GPObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("sphere");
        bv.Set.Position(-5,10,-1130)
        bv.Set.Scale(20,20,20);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        GPObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("sphere");
        bv.Set.Position(1075,10,-350);
        bv.Set.Scale(20,20,20);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        GPObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("sphere");
        bv.Set.Position(670,5,915);
        bv.Set.Scale(20,20,20);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        GPObject.Debug.bv.push(bv);
        
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
        GPObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(-405,10,-125);
        bv.Set.Scale(47,52.5,297);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        bv.yaw = -108;
        GPObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(0, 5, -410);
        bv.Set.Scale(47,52.5,297);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        GPObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(405, 10, -135);
        bv.Set.Scale(47,52.5,297);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        bv.yaw = 108;
        GPObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(240,15,330);
        bv.Set.Scale(47,52.5,297);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        bv.yaw = 36;
        GPObject.Debug.bv.push(bv);
        
        //Tower
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(0,75,0);
        bv.Set.Scale(94.75, 980, 97.75);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        GPObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("sphere");
        bv.Set.Position(0,-455,0);
        bv.Set.Scale(10.25,10.25,10.25);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        GPObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("sphere");
        bv.Set.Position(0,435,0);
        bv.Set.Scale(9,9,9);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        GPObject.Debug.bv.push(bv);
        
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
        GPObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(-185, 10, -255);
        bv.Set.Scale(174.5, 13.5, 23.5);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        bv.yaw = 38;
        GPObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(185, 10, -255);
        bv.Set.Scale(174.5, 13.5, 23.5);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        bv.yaw = -38;
        GPObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(295, 10, 105);
        bv.Set.Scale(174.5, 13.5, 23.5);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        bv.yaw = 71;
        GPObject.Debug.bv.push(bv);
        
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("cube");
        bv.Set.Position(0, 5, 315);
        bv.Set.Scale(174.5, 13.5, 23.5);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        GPObject.Debug.bv.push(bv);
        
        //Gunship
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("sphere");
        bv.Position = GPObject.gunship.Position;
        bv.Set.Scale(0.6,0.6,0.6);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        GPObject.Debug.bv.push(bv);
        
        //bv = os.graphics.Managers.Entity.Create();
        //bv.Graphics.Add.Mesh("cube");
        //bv.Position = GPObject.gunship.Position;
        //bv.Set.Scale(17.1,5.35,17.35);
        //bv.Graphics.Set.useBlendColor(true);
        //bv.Graphics.Set.texture(false);
        //bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        ////os.graphics.AddToWorld(bv);
        //GPObject.Debug.bv.push(bv);
        
        //Fighter2
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("sphere");
        bv.Position = GPObject.fighter2.Physics.position;
        bv.Set.Scale(0.6,0.6,0.6);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        GPObject.Debug.bv.push(bv);
        
        //FIghter 1
        bv = os.graphics.Managers.Entity.Create();
        bv.Graphics.Add.Mesh("sphere");
        bv.Position = GPObject.fighter1.Physics.position;
        bv.Set.Scale(0.6,0.6,0.6);
        bv.Graphics.Set.useBlendColor(true);
        bv.Graphics.Set.texture(false);
        bv.Graphics.Set.blendColor([0.17,0.26,0.80]);
        //os.graphics.AddToWorld(bv);
        GPObject.Debug.bv.push(bv);
    
    }
    
}
var GPStartGame = function(){
    if(!GPObject.fighter2.AI.MovementAlgorithms.SeekEntity && GPObject.Missile.right.launched != true &&GPObject.Missile.left.launched != true ){
        os.audio.Play("chirp");
        os.audio.Play("battle");
        GPObject.CurrentSong = "battle";
        os.audio.Pause("menu");
        
        GPObject.gunship.hits = 0;
        GPObject.fighter1.hits = 0;
        GPObject.fighter2.hits = 0;
        
        GPObject.Thursters.Gunship.right.Start();
        GPObject.Thursters.Gunship.left.Start();
        GPObject.Thursters.Fighter2.left.Start();
        GPObject.Thursters.Fighter2.right.Start();
        GPObject.Thursters.Fighter1.botLeft.Start();
        GPObject.Thursters.Fighter1.botRight.Start();
        GPObject.Thursters.Fighter1.topLeft.Start();
        GPObject.Thursters.Fighter1.topRight.Start();
        
        GPObject.fighter2.AI.Movement.Disable.Hide.Entity();
        GPObject.fighter2.AI.Movement.Disable.Patrol.Circle();
        GPObject.fighter1.AI.Movement.Disable.Hide.Entity();
        GPObject.fighter1.AI.Movement.Disable.Patrol.Circle();
        
        os.ai.Movement.Add.Seek.Entity(GPObject.fighter2, GPObject.gunship);
        os.ai.Movement.Add.Seek.Entity(GPObject.fighter1, GPObject.gunship);
        
        //GPObject.gunship.yaw = 0;
        //GPObject.gunship.pitch = 0;
        os.graphics.Managers.Camera.Attach(GPObject.gunship);
        os.graphics.Managers.Camera.Offset = vec3.create([0,5,80]);
        
        GPObject.Missile.left.launched = false;
        GPObject.Missile.left.graphics.Physics = null;
        mat4.identity(GPObject.Missile.left.graphics.Default.Offset);
        mat4.rotateX(GPObject.Missile.left.graphics.Default.Offset, degToRad(180), GPObject.Missile.left.graphics.Default.Offset);
        GPObject.Missile.left.graphics.Graphics.Matrix.Parent = GPObject.gunship.Graphics.Matrix.World;
        GPObject.Missile.left.graphics.Set.Position(-1.55,-0.41,-0.495);
        GPObject.Missile.left.graphics.Set.Scale(0.1,0.1,0.1);
        GPObject.Missile.left.graphics.pitch = 11;//GPObject.gunship.pitch;
        GPObject.Missile.left.graphics.yaw  = 0;//GPObject.gunship.yaw;
        
        GPObject.Missile.right.launched = false;
        GPObject.Missile.right.graphics.Physics = null;
        mat4.identity(GPObject.Missile.right.graphics.Default.Offset);
        mat4.rotateX(GPObject.Missile.right.graphics.Default.Offset, degToRad(180), GPObject.Missile.right.graphics.Default.Offset);
        GPObject.Missile.right.graphics.Graphics.Matrix.Parent = GPObject.gunship.Graphics.Matrix.World;
        GPObject.Missile.right.graphics.Set.Position(1.55,-0.41,-0.495);
        GPObject.Missile.right.graphics.Set.Scale(0.1,0.1,0.1);
        GPObject.Missile.right.graphics.pitch = 11; //GPObject.gunship.pitch;
        GPObject.Missile.right.graphics.yaw  = 0;//GPObject.gunship.yaw ;

        

        GPObject.Debug.CollectData = true;
    }
}
var GPGraphicsReset =function(dt){
    GPObject.Missile.Reticle.width = os.graphics.Get.Width() - 50;
    GPObject.Missile.Reticle.height = os.graphics.Get.Height() - 50;
}
var GPThreads ={
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
                    GPThreads.Threads.MeshLoader.Execute(input);
                    GPThreads.Threads.PhysicsAI.Execute(input);
                }
            }
            else if(msg.data == "ONLINE"){
                os.console.Comment("Thread Controller: " + msg.data);
                GPThreads.Threads.MeshLoader = os.threads.ThreadManager.CreateThread("MeshLoader", "STATIC", 0, "true", GPThreads.Callbacks.MeshLoader ,GPThreads.Paths.MeshLoader, "0", "false", 0);
            }
            else{
                os.console.Comment("Thread Controller: " + msg.data);
            }
        },
        MeshLoader: function(msg){
            if(msg.data == "REGISTERED"){
                
                os.console.Comment("Mesh Loader: " + msg.data);
                
                GPMeshMgr.RequestMesh("spacestation", "scripts/jahova/OS/Cores/Graphics/meshes/spacestation.json");
                GPMeshMgr.RequestMesh("fighter1", "scripts/jahova/OS/Cores/Graphics/meshes/fighter1.json");
                GPMeshMgr.RequestMesh("fighter2", "scripts/jahova/OS/Cores/Graphics/meshes/fighter2.json");
                GPMeshMgr.RequestMesh("gunship", "scripts/jahova/OS/Cores/Graphics/meshes/gunship.json");
                GPMeshMgr.RequestMesh("missile", "scripts/jahova/OS/Cores/Graphics/meshes/missile.json");
                
            }
            else if(msg.data.type == "MESHLOADED"){
                os.console.Comment("Mesh Loader: Mesh " + msg.data.name + " Loaded" );
                GPMeshMgr.BuildMesh(msg.data);
                
            }
            else if(msg.data.type == "ERROR"){
                os.console.Error(msg.data.message);
            }
            else
                os.console.Comment("Mesh Loader: Unknown Message Type\n" + msg.data.toString());
        }
    },
    Threads: {
        MeshLoader: null
    },
    Paths: {
        MeshLoader: null
    }
}
var GPMeshMgr = {
    Requested: 0,
    Loaded: 0,
    RequestMesh: function(sKey, sPath){
        //GPMeshMgr.Requested++;
        var input = {};
        input.type = "LOADMESH";
        input.filename = sPath;
        input.name = sKey;
        GPThreads.Threads.MeshLoader.Execute(input);
    },
    BuildMesh: function(input){
        GPMeshMgr.Loaded++;
        var msh = os.graphics.Managers.Mesh.Create.Mesh(input.name);
        msh.model = input;
        msh.Initialize();
        
        GPAssetComplete();
    }
}
var GPTextureMgr = {
    Requested: 0,
    Loaded: 0
}
var GPControls = function(){
    var gp = os.input.Gamepads.current.get(0);
    var gp2 = os.input.Gamepads.current.get(1);

    if(gp && GPObject.gameStarted){
        var cam = os.graphics.Managers.Camera;
        if(Math.abs(gp.RightStick.X()) > 0.2){
            cam.Rotation.yaw += gp.RightStick.X() * 2.5;
            
            if(cam.Rotation.yaw > 360){ cam.Rotation.yaw  -= 360;}
            else if(cam.Rotation.yaw < 0) { cam.Rotation.yaw += 360; }
            
            if(os.graphics.Managers.Camera.attached){
                GPObject.gunship.yaw = cam.Rotation.yaw;
                //quat4.set(BuildOrientation(-GPObject.gunship.yaw,-GPObject.gunship.pitch,-GPObject.gunship.roll),GPObject.gunship.orientation);
                //GPObject.Debug.bv[18].pitch = GPObject.gunship.pitch;
                //GPObject.Debug.bv[18].yaw   = GPObject.gunship.yaw;
            }
        }
        if(Math.abs(gp.RightStick.Y()) > 0.2){
            cam.Rotation.pitch += gp.RightStick.Y() * 1.5;
            
            if(cam.Rotation.pitch > 360){ cam.Rotation.pitch  -= 360}
            else if(cam.Rotation.pitch < 0) { cam.Rotation.pitch += 360; }
            
            if(os.graphics.Managers.Camera.attached){
                GPObject.gunship.pitch = cam.Rotation.pitch;
                //quat4.set(BuildOrientation(-GPObject.gunship.yaw,-GPObject.gunship.pitch,-GPObject.gunship.roll),GPObject.gunship.orientation);
                //GPObject.Debug.bv[18].pitch = GPObject.gunship.pitch;
                //GPObject.Debug.bv[18].yaw   = GPObject.gunship.yaw;
            }
            
        }
        if(Math.abs(gp.LeftStick.X()) > 0.2){
            if(os.graphics.Managers.Camera.attached){
                GPObject.gunship.Move.Right(gp.LeftStick.X() * 2);
            }
            else{
                os.graphics.Managers.Camera.MoveRight(gp.LeftStick.X() * 5); 
            }
            
        }
        if(Math.abs(gp.LeftStick.Y()) > 0.2){
            if(os.graphics.Managers.Camera.attached){
                GPObject.gunship.Move.Backward(gp.LeftStick.Y() * 4);
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
            cam.Position[0] = GPObject.gunship.Position[0];
            cam.Position[1] = GPObject.gunship.Position[1];
            cam.Position[2] = GPObject.gunship.Position[2];
        }
        if(gp.LeftShoulder.Top()  > 0.5){
            os.audio.Play("chirp");
            os.graphics.Managers.Camera.Attach(GPObject.gunship);
            os.graphics.Managers.Camera.Offset = vec3.create([0,5,80]);
        }
        if(gp.Buttons.Top() > 0.5){
            if(!GPObject.fighter2.AI.MovementAlgorithms.SeekEntity && GPObject.Missile.right.launched != true &&GPObject.Missile.left.launched != true ){
                os.audio.Play("chirp");
                os.audio.Play("battle");
                GPObject.CurrentSong = "battle";
                os.audio.Pause("menu");
                
                GPObject.gunship.hits = 0;
                GPObject.fighter1.hits = 0;
                GPObject.fighter2.hits = 0;
                
                GPObject.Thursters.Gunship.right.Start();
                GPObject.Thursters.Gunship.left.Start();
                GPObject.Thursters.Fighter2.left.Start();
                GPObject.Thursters.Fighter2.right.Start();
                GPObject.Thursters.Fighter1.botLeft.Start();
                GPObject.Thursters.Fighter1.botRight.Start();
                GPObject.Thursters.Fighter1.topLeft.Start();
                GPObject.Thursters.Fighter1.topRight.Start();
                
                GPObject.fighter2.AI.Movement.Disable.Hide.Entity();
                GPObject.fighter2.AI.Movement.Disable.Patrol.Circle();
                GPObject.fighter1.AI.Movement.Disable.Hide.Entity();
                GPObject.fighter1.AI.Movement.Disable.Patrol.Circle();
                
                os.ai.Movement.Add.Seek.Entity(GPObject.fighter2, GPObject.gunship);
                os.ai.Movement.Add.Seek.Entity(GPObject.fighter1, GPObject.gunship);
                
                //GPObject.gunship.yaw = 0;
                //GPObject.gunship.pitch = 0;
                os.graphics.Managers.Camera.Attach(GPObject.gunship);
                os.graphics.Managers.Camera.Offset = vec3.create([0,5,80]);
                
                GPObject.Missile.left.launched = false;
                GPObject.Missile.left.graphics.Physics = null;
                mat4.identity(GPObject.Missile.left.graphics.Default.Offset);
                mat4.rotateX(GPObject.Missile.left.graphics.Default.Offset, degToRad(180), GPObject.Missile.left.graphics.Default.Offset);
                GPObject.Missile.left.graphics.Graphics.Matrix.Parent = GPObject.gunship.Graphics.Matrix.World;
                GPObject.Missile.left.graphics.Set.Position(-1.55,-0.41,-0.495);
                GPObject.Missile.left.graphics.Set.Scale(0.1,0.1,0.1);
                GPObject.Missile.left.graphics.pitch = 11;//GPObject.gunship.pitch;
                GPObject.Missile.left.graphics.yaw  = 0;//GPObject.gunship.yaw;
                
                GPObject.Missile.right.launched = false;
                GPObject.Missile.right.graphics.Physics = null;
                mat4.identity(GPObject.Missile.right.graphics.Default.Offset);
                mat4.rotateX(GPObject.Missile.right.graphics.Default.Offset, degToRad(180), GPObject.Missile.right.graphics.Default.Offset);
                GPObject.Missile.right.graphics.Graphics.Matrix.Parent = GPObject.gunship.Graphics.Matrix.World;
                GPObject.Missile.right.graphics.Set.Position(1.55,-0.41,-0.495);
                GPObject.Missile.right.graphics.Set.Scale(0.1,0.1,0.1);
                GPObject.Missile.right.graphics.pitch = 11; //GPObject.gunship.pitch;
                GPObject.Missile.right.graphics.yaw  = 0;//GPObject.gunship.yaw ;
        
                
        
                GPObject.Debug.CollectData = true;
            }
            
        }
        else if(gp.Buttons.Bottom() > 0.5){
            if(!GPObject.fighter2.AI.MovementAlgorithms.HideEntity ){
                os.audio.Play("chirp");
                os.audio.Play("menu");
                GPObject.CurrentSong = "menu";
                os.audio.Pause("battle");
                
                var hidingSpots = [];
                hidingSpots.push([-660,15,910]);
                hidingSpots.push([-1075,5,-350]);
                hidingSpots.push([-5,10,-1130]);
                hidingSpots.push([1075,10,-350]);
                hidingSpots.push([670,5,915]);
                offsets = [420,420,420,420,420];
                
                
                
                if(!GPObject.fighter2.AI.MovementAlgorithms.HideEntity ){
                    GPObject.fighter2.AI.Movement.Disable.Seek.Entity();
                    
                    GPObject.Thursters.Fighter2.left.Start();
                    GPObject.Thursters.Fighter2.right.Start();
                    
                    os.ai.Movement.Add.Hide.Entity(GPObject.fighter2, GPObject.gunship,hidingSpots,offsets);
                }
                if(!GPObject.fighter1.AI.MovementAlgorithms.HideEntity){
                    GPObject.fighter1.AI.Movement.Disable.Seek.Entity();
                    
                    GPObject.Thursters.Fighter1.botLeft.Start();
                    GPObject.Thursters.Fighter1.botRight.Start();
                    GPObject.Thursters.Fighter1.topLeft.Start();
                    GPObject.Thursters.Fighter1.topRight.Start();
                    
                    os.ai.Movement.Add.Hide.Entity(GPObject.fighter1, GPObject.gunship,hidingSpots,offsets);
                }
            }
        }
        else if(gp.Buttons.Left() > 0.5){
            GPObject.Debug.set = true;
            GPObject.Debug.Win.Display.window();
            
        }
        else if(gp.Buttons.Right() > 0.5){
            GPObject.Debug.set = false;
            GPObject.Debug.Win.Hide.window();
        }
        else if(gp.Select() > 0.5){
            os.audio.Play("chirp");
            os.audio.Pause(GPObject.CurrentSong);
        }
        else if(gp.Start() > 0.5){
            os.audio.Play("chirp");
            os.audio.Play(GPObject.CurrentSong);
        }
        else if((gp.RightShoulder.Bottom() > 0.3) ){//&& os.graphics.Managers.Camera.attached){
            if(GPObject.Time.Laser.last + os.audio.Get.Duration("laser") * 2000 < os.graphics.Time.current){
                os.audio.Play("laser");
                GPObject.Time.Laser.last = os.graphics.Time.current;
                bullet = new CBullet(GPObject.gunship)
                bullet.AddGraphic([-7.8,1.8,16.15]);
                bullet.AddGraphic([-7.8,0.8,16.15]);
                bullet.AddGraphic([7.8,1.8,16.15]);
                bullet.AddGraphic([7.8,0.8,16.15]);
                
            }
            
        }
        else if(gp.LeftShoulder.Bottom() > 0.3){
            
            if(GPObject.Missile.Reticle.Time.fighter1 > 1000 ){
                //Shoot Missle
                if(!GPObject.Missile.left.launched){         //Launch Left Missile
                        GPObject.Missile.Reticle.Time.fighter1 = 0;
                        GPObject.Missile.left.fire(GPObject.fighter1);
                        
                    }
                else if(!GPObject.Missile.right.launched){   //Launch Right Missile
                    GPObject.Missile.Reticle.Time.fighter1 = 0;
                    GPObject.Missile.right.fire(GPObject.fighter1);
                    
                }
                
            }
            else if(GPObject.Missile.Reticle.Time.fighter2 > 1000){ //Figther 2 Target
                
                if(!GPObject.Missile.left.launched){         //Launch Left Missile
                        GPObject.Missile.Reticle.Time.fighter2 = 0;
                        GPObject.Missile.left.fire(GPObject.fighter2);
                        
                        
                    }
                else if(!GPObject.Missile.right.launched){   //Launch Right Missile
                    GPObject.Missile.Reticle.Time.fighter2 = 0;
                    GPObject.Missile.right.fire(GPObject.fighter2);
                    
                }
                
            }
        
        
        }
    }
    
    if(gp2  && GPObject.gameStarted){
        if(Math.abs(gp2.LeftStick.X()) > 0.2){
            GPObject.Missile.Reticle.position[0] += gp2.LeftStick.X() * 5;
            if(GPObject.Missile.Reticle.position[0] < 0){GPObject.Missile.Reticle.position[0] = 0}
            if(GPObject.Missile.Reticle.position[0] > GPObject.Missile.Reticle.width){GPObject.Missile.Reticle.position[0] = GPObject.Missile.Reticle.width}
            GPObject.Missile.Reticle.html.style.left = GPObject.Missile.Reticle.position[0].toFixed(0) + "px";
            
            
            
        }
        if(Math.abs(gp2.LeftStick.Y()) > 0.2){
            GPObject.Missile.Reticle.position[1] += gp2.LeftStick.Y() * 5;
            if(GPObject.Missile.Reticle.position[1] < 0){GPObject.Missile.Reticle.position[1] = 0}
            if(GPObject.Missile.Reticle.position[1] > GPObject.Missile.Reticle.height){GPObject.Missile.Reticle.position[1] = GPObject.Missile.Reticle.height}
            GPObject.Missile.Reticle.html.style.top = GPObject.Missile.Reticle.position[1].toFixed(0) + "px";
        }
        if((gp2.RightShoulder.Bottom() > 0.3)){
            if(GPObject.Missile.Reticle.Time.fighter1 > 1000 ){
                //Shoot Missle
                if(!GPObject.Missile.left.launched){         //Launch Left Missile
                        GPObject.Missile.Reticle.Time.fighter1 = 0;
                        GPObject.Missile.left.fire(GPObject.fighter1);
                        
                    }
                else if(!GPObject.Missile.right.launched){   //Launch Right Missile
                    GPObject.Missile.Reticle.Time.fighter1 = 0;
                    GPObject.Missile.right.fire(GPObject.fighter1);
                    
                }
                
            }
            else if(GPObject.Missile.Reticle.Time.fighter2 > 1000){ //Figther 2 Target
                
                if(!GPObject.Missile.left.launched){         //Launch Left Missile
                        GPObject.Missile.Reticle.Time.fighter2 = 0;
                        GPObject.Missile.left.fire(GPObject.fighter2);
                        
                        
                    }
                else if(!GPObject.Missile.right.launched){   //Launch Right Missile
                    GPObject.Missile.Reticle.Time.fighter2 = 0;
                    GPObject.Missile.right.fire(GPObject.fighter2);
                    
                }
                
            }   
        }
    }
    
    if(!gp && !gp2 && GPObject.gameStarted){
        var cam = os.graphics.Managers.Camera;
        var pressed = os.input.Get.State.Mouse().pressed;
        
        if(pressed){
            
            if(os.graphics.Managers.Camera.attached){
                GPObject.gunship.yaw = cam.Rotation.yaw;
                GPObject.gunship.pitch = cam.Rotation.pitch;
                updated = true;
            }
            
        }
        if(GPKeys.d){
            if(os.graphics.Managers.Camera.attached){
                GPObject.gunship.Move.Right(4);
                updated = true;
            }
            else{
                os.graphics.Managers.Camera.MoveRight(5);
            }
            
        }
        if(GPKeys.a){
            if(os.graphics.Managers.Camera.attached){
                GPObject.gunship.Move.Right(-4);
                updated = true;
            }
            else{
                os.graphics.Managers.Camera.MoveRight(-5);
            }
            
        }
        if(GPKeys.s){
            if(os.graphics.Managers.Camera.attached){
                GPObject.gunship.Move.Backward(5);
                updated = true;
            }
            else{
                os.graphics.Managers.Camera.MoveBackward(8);
                
            }
            
        }
        if(GPKeys.w){
            if(os.graphics.Managers.Camera.attached){
                GPObject.gunship.Move.Backward(-5);
                updated = true;
            }
            else{
                os.graphics.Managers.Camera.MoveBackward(-8);
                
            }
            
        }
        
        
    }
    
}
var GPKeys = {
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
var GPGunshipCollisionUpdate = function(obj){
    var red = [0.57,0.26,0.40];
    var blue = [0.17,0.26,0.80];
    var gunshipIndex = 18;
    var collision = false;
    var hit = false;
    
    for(var j = gunshipIndex - 1; j >= 0; j--){
        collision = os.physics.bvs[gunshipIndex].CollisionTest(os.physics.bvs[j])
        if(collision){
            hit = true;
            GPObject.Debug.bv[gunshipIndex].Graphics.Set.blendColor(red);
            //Position = OBB Cloesest Point + (radius * normal)
            vec3.scale(collision.normal, collision.obj1.halfSize, collision.normal);
            vec3.add(collision.point.obj2, collision.normal, collision.normal);
            vec3.set(collision.normal, GPObject.gunship.Position);
            
            GPObject.Debug.bv[j].Graphics.Set.blendColor(red);
        }
        else{
            if(!hit){GPObject.Debug.bv[gunshipIndex].Graphics.Set.blendColor(blue);}
            GPObject.Debug.bv[j].Graphics.Set.blendColor(blue);
        }
    }
}

var GPFighter2CollisionUpdate = function(){
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
            GPObject.Debug.bv[fighterIndex].Graphics.Set.blendColor(red);
            //Position = OBB Cloesest Point + (radius * normal)
            vec3.scale(collision.normal, collision.obj1.halfSize, collision.normal);
            vec3.add(collision.point.obj2, collision.normal, collision.normal);
            vec3.set(collision.normal, GPObject.fighter2.Physics.position);
            
            GPObject.Debug.bv[j].Graphics.Set.blendColor(red);
        }
        else{
            if(!hit){GPObject.Debug.bv[fighterIndex].Graphics.Set.blendColor(blue);}
            GPObject.Debug.bv[j].Graphics.Set.blendColor(blue);
        }
    }
    
    for(var j = gunshipIndex - 1; j >= 0; j--){
        collision = os.physics.bvs[fighter1Index].CollisionTest(os.physics.bvs[j])
        if(collision){
            hit = true;
            GPObject.Debug.bv[fighter1Index].Graphics.Set.blendColor(red);
            //Position = OBB Cloesest Point + (radius * normal)
            vec3.scale(collision.normal, collision.obj1.halfSize, collision.normal);
            vec3.add(collision.point.obj2, collision.normal, collision.normal);
            vec3.set(collision.normal, GPObject.fighter1.Physics.position);
            
            GPObject.Debug.bv[j].Graphics.Set.blendColor(red);
        }
        else{
            if(!hit){GPObject.Debug.bv[fighter1Index].Graphics.Set.blendColor(blue);}
            GPObject.Debug.bv[j].Graphics.Set.blendColor(blue);
        }
    }
    
    collision = os.physics.bvs[fighter1Index].CollisionTest(os.physics.bvs[fighterIndex])
    if(collision){
        hit = true;
        GPObject.Debug.bv[fighter1Index].Graphics.Set.blendColor(red);
        //Position = OBB Cloesest Point + (radius * normal)
        vec3.scale(collision.normal, collision.obj1.halfSize + 15, collision.normal);
        vec3.add(collision.point.obj2, collision.normal, collision.normal);
        vec3.set(collision.normal, GPObject.fighter1.Physics.position);
        
        GPObject.Debug.bv[fighterIndex].Graphics.Set.blendColor(red);
    }
    else{
        if(!hit){GPObject.Debug.bv[fighter1Index].Graphics.Set.blendColor(blue);}
        GPObject.Debug.bv[fighterIndex].Graphics.Set.blendColor(blue);
    }
}
var GPBulletCollision = function(){
    var red = [0.57,0.26,0.40];
    var blue = [0.17,0.26,0.80];
    var gunshipIndex = 18;
    var fighter2Index = 19;
    var fighter1Index = 20;
    var collision = false;
    var hit = false;
    
    for(var i = GPObject.Bullets.list.length - 1; i >= 0; i--){
         quat4.set(GPObject.Bullets.list[i].orientation,GPObject.Bullets.bv.obj.orientation);
         vec3.set(GPObject.Bullets.list[i].Position, GPObject.Bullets.bv.obj.center);
        
        if(GPObject.Bullets.list[i].owner != GPObject.gunship.ID()){
            //Collied with Gunship
            if(GPObject.Bullets.bv.obj.CollisionTest(os.physics.bvs[gunshipIndex])){
                GPObject.Bullets.list.splice(i,1);
                GPObject.Debug.bv[gunshipIndex].Graphics.Set.blendColor(red);
                os.audio.Play("strike");
                ParticleManager.Start(GPObject.Explosions.Gunship.id);
                GPObject.gunship.hits++;
                GPObject.HUD.Health.Gunship.html.style.width = (100 * (GPObject.HUD.Health.Gunship.max - GPObject.gunship.hits)/GPObject.HUD.Health.Gunship.max).toFixed(0) + "%";
                
            }
        }
        //Collide with AI ship
        else if(GPObject.Bullets.bv.obj.CollisionTest(os.physics.bvs[fighter2Index])){
            GPObject.Debug.bv[fighter2Index].Graphics.Set.blendColor(red);
            GPObject.Bullets.list.splice(i,1);
            os.audio.Play("strike");
            ParticleManager.Start(GPObject.Explosions.Fighter2.id);
            os.physics.Create.Force.LocalImpulse(GPObject.fighter2.Physics,[100,0,0],[50,0,50]);
            if(GPObject.fighter2.AI.MovementAlgorithms.SeekEntity || GPObject.fighter2.AI.MovementAlgorithms.HideEntity){
                GPObject.fighter2.hits++;
                GPObject.HUD.Health.Fighter2.html.style.width = (100 * (GPObject.HUD.Health.Fighter2.max - GPObject.fighter2.hits)/GPObject.HUD.Health.Fighter2.max).toFixed(0) + "%";
            }
        }
        
        else if(GPObject.Bullets.bv.obj.CollisionTest(os.physics.bvs[fighter1Index])){
            GPObject.Debug.bv[fighter1Index].Graphics.Set.blendColor(red);
            GPObject.Bullets.list.splice(i,1);
            os.audio.Play("strike");
            ParticleManager.Start(GPObject.Explosions.Fighter1.id);
            os.physics.Create.Force.LocalImpulse(GPObject.fighter1.Physics,[100,0,0],[50,0,50]);
            if(GPObject.fighter1.AI.MovementAlgorithms.SeekEntity || GPObject.fighter1.AI.MovementAlgorithms.HideEntity){
                GPObject.fighter1.hits++;
                GPObject.HUD.Health.Fighter1.html.style.width = (100 * (GPObject.HUD.Health.Fighter1.max - GPObject.fighter1.hits)/GPObject.HUD.Health.Fighter1.max).toFixed(0) + "%";
            }
        }
    
    }
    
}

var GPObject = {
    gameStarted: false,
    updateTime: 0,
    updateAI: false,
    Menu:{
        menu: null,
        Descriptions: {
            container: null,
            currentDescription: null,
            description: null,
            play: null,
            network: null,
            controls: null,
            history: null,
            configure: null,
            credits: null
        },
        Buttons: {
            container: null,
            play: null,
            network: null,
            controls: null,
            history: null,
            configure: null,
            credits: null
        },
        video: null
    },
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
            os.console.Comment(GPObject.Debug.FPS.join(","));
        }
    },
    entitiesLoaded: 0,
    fighter1: null,
    fighter2: null,
    gunship:  null,
    station:  null,
    stationLarge: null,
    HUD:{
        obj: null,
        html: null,
        Health: {
            Fighter1: {
                obj: null,
                html: null,
                max: null,
                time: 0,
                SetWidth: null
            },
            Fighter2: {
                obj: null,
                html: null,
                max: null,
                time: 0,
                SetWidth: null
            },
            Gunship: {
                obj: null,
                html: null,
                max: null,
                time: 0,
                SetWidth: null
            }
        }  
    },
    Missile: {
        left: {
            graphics: null,
            thruster: null,
            lifetime: 0,
            bv: null,
            launched: false,
            time:0,
            fire: function(ent){
                GPObject.Missile.left.launched = true;
                mat4.rotateX(GPObject.Missile.left.graphics.Default.Offset, degToRad(-90), GPObject.Missile.left.graphics.Default.Offset);
                GPObject.Missile.left.graphics.AI.Movement.maxForce = 100;
                GPObject.Missile.left.graphics.Physics = os.physics.Create.Entity(0.5);
                GPObject.Missile.left.graphics.Physics.linearDampening = 0.999;
                GPObject.Missile.left.graphics.Physics.angularDampening = 0.8;
                
                GPObject.Missile.left.graphics.Set.Scale(0.5,0.5,0.5);
                GPObject.Missile.left.graphics.yaw =   GPObject.gunship.yaw;
                GPObject.Missile.left.graphics.pitch = GPObject.gunship.pitch;// - 90;
                GPObject.Missile.left.graphics.roll =  GPObject.gunship.roll;
                
                var cosX = Math.cos(degToRad(GPObject.Missile.left.graphics.pitch/2));
                var sinX = Math.sin(degToRad(GPObject.Missile.left.graphics.pitch/2));
                
                var cosY = Math.cos(degToRad(GPObject.Missile.left.graphics.yaw/2));
                var sinY = Math.sin(degToRad(GPObject.Missile.left.graphics.yaw/2));
                
                var cosZ = Math.cos(degToRad(GPObject.Missile.left.graphics.roll/2));
                var sinZ = Math.sin(degToRad(GPObject.Missile.left.graphics.roll/2));
                
                var qx = [sinX,0,0,cosX];
                var qy = [0,sinY,0,cosY];
                var qz = [0,0,sinZ,cosZ];
                
                quat4.multiply(qz,qy, GPObject.Missile.left.graphics.Physics.orientation);
                quat4.multiply(GPObject.Missile.left.graphics.Physics.orientation, qx, GPObject.Missile.left.graphics.Physics.orientation);
                
                quat4.normalize(GPObject.Missile.left.graphics.Physics.orientation, GPObject.Missile.left.graphics.Physics.orientation);
                GPObject.Missile.left.graphics.Physics.orientation[3]*=-1;
                vec3.set(GPObject.gunship.Position,GPObject.Missile.left.graphics.Physics.position);
                //vec3.set(GPObject.gunship.Position,GPObject.Missile.left.graphics.Position);
                
                vec3.set(GPObject.gunship.Axis.Look, GPObject.Missile.left.graphics.Axis.Look);
                vec3.set(GPObject.gunship.Axis.Right,GPObject.Missile.left.graphics.Axis.Right);
                vec3.set(GPObject.gunship.Axis.Up,   GPObject.Missile.left.graphics.Axis.Up);
                
                //mat4.identity(GPObject.Missile.left.graphics.Graphics.Matrix.Parent);
                GPObject.Missile.left.graphics.Graphics.Matrix.Parent = mat4.create();
                mat4.identity(GPObject.Missile.left.graphics.Graphics.Matrix.Parent);
                GPObject.Missile.left.thruster.Attach(GPObject.Missile.left.graphics);
                ParticleManager.Start(GPObject.Missile.left.thruster.id);
                
                
                GPObject.Missile.left.graphics.Physics.Add.InertialTensor(os.physics.Create.InertialTensor.Cube(GPObject.Missile.left.graphics.Physics,20,20,20));
                GPObject.Missile.left.graphics.Physics.CalculateDerivedData();
                os.audio.Play("rocket");
                GPObject.Missile.left.graphics.Graphics.Update = function(dt){
                    //var cur = (new Date()).getTime();
                    GPObject.Missile.left.time += dt;
                    if((GPObject.Missile.left.time) > 10000){
                        GPObject.Missile.left.graphics.AI.Movement.Disable.Seek.Entity();
                        GPObject.Missile.left.thruster.Stop();
                        os.graphics.RemoveFromUpdate(GPObject.Missile.left.graphics);
                        GPObject.Missile.left.launched = "DONE";
                        os.audio.Pause("rocket");
                        GPObject.Missile.left.time = 0;
                        

                        
                    }
                    else{
                        var dif = [];
                        vec3.subtract(GPObject.Missile.left.graphics.Physics.position, ent.Physics.position, dif)
                        if(vec3.length(dif) < 50){
                            GPObject.Missile.left.graphics.AI.Movement.Disable.Seek.Entity();
                            os.audio.Play("strike");
                            ent.hits += 2;
                            if(ent.AI.name == "Fighter 1"){
                                ParticleManager.Start(GPObject.Explosions.Fighter1.id);
                                GPObject.HUD.Health.Fighter1.html.style.width = (100 * (GPObject.HUD.Health.Fighter1.max - GPObject.fighter1.hits)/GPObject.HUD.Health.Fighter1.max).toFixed(0) + "%";  
                            }
                            else if(ent.AI.name == "Fighter 2"){
                                ParticleManager.Start(GPObject.Explosions.Fighter2.id);
                                GPObject.HUD.Health.Fighter2.html.style.width = (100 * (GPObject.HUD.Health.Fighter2.max - GPObject.fighter2.hits)/GPObject.HUD.Health.Fighter2.max).toFixed(0) + "%"; 
                            }
                            
                            os.graphics.RemoveFromUpdate(GPObject.Missile.left.graphics);
                            GPObject.Missile.left.thruster.Stop();
                            GPObject.Missile.left.launched = "DONE";
                            os.audio.Pause("rocket");
                            GPObject.Missile.left.time = 0;
                            

                        }
                        
                    }
                }
                os.graphics.AddToUpdate(GPObject.Missile.left.graphics);
                os.ai.Movement.Add.Seek.Entity(GPObject.Missile.left.graphics, ent);
                
                
            }
        },
        right: {
            graphics: null,
            thruster: null,
            lifetime: 0,
            bv: null,
            launched: false,
            time: 0,
            fire: function(ent){
                GPObject.Missile.right.launched = true;
                mat4.rotateX(GPObject.Missile.right.graphics.Default.Offset, degToRad(-90), GPObject.Missile.right.graphics.Default.Offset);
                GPObject.Missile.right.graphics.AI.Movement.maxForce = 500;
                GPObject.Missile.right.graphics.Physics = os.physics.Create.Entity(0.2);
                GPObject.Missile.right.graphics.Physics.linearDampening = 0.999;
                GPObject.Missile.right.graphics.Physics.angularDampening = 0.8;
                
                GPObject.Missile.right.graphics.Set.Scale(0.5,0.5,0.5);
                GPObject.Missile.right.graphics.yaw =   GPObject.gunship.yaw;
                GPObject.Missile.right.graphics.pitch = GPObject.gunship.pitch;// - 90;
                GPObject.Missile.right.graphics.roll =  GPObject.gunship.roll;
                
                var cosX = Math.cos(degToRad(GPObject.Missile.right.graphics.pitch/2));
                var sinX = Math.sin(degToRad(GPObject.Missile.right.graphics.pitch/2));
                
                var cosY = Math.cos(degToRad(GPObject.Missile.right.graphics.yaw/2));
                var sinY = Math.sin(degToRad(GPObject.Missile.right.graphics.yaw/2));
                
                var cosZ = Math.cos(degToRad(GPObject.Missile.right.graphics.roll/2));
                var sinZ = Math.sin(degToRad(GPObject.Missile.right.graphics.roll/2));
                
                var qx = [sinX,0,0,cosX];
                var qy = [0,sinY,0,cosY];
                var qz = [0,0,sinZ,cosZ];
                
                quat4.multiply(qz,qy, GPObject.Missile.right.graphics.Physics.orientation);
                quat4.multiply(GPObject.Missile.right.graphics.Physics.orientation, qx, GPObject.Missile.right.graphics.Physics.orientation);
                
                quat4.normalize(GPObject.Missile.right.graphics.Physics.orientation, GPObject.Missile.right.graphics.Physics.orientation);
                GPObject.Missile.right.graphics.Physics.orientation[3]*=-1;
                vec3.set(GPObject.gunship.Position,GPObject.Missile.right.graphics.Physics.position);
                //vec3.set(GPObject.gunship.Position,GPObject.Missile.right.graphics.Position);
                
                vec3.set(GPObject.gunship.Axis.Look, GPObject.Missile.right.graphics.Axis.Look);
                vec3.set(GPObject.gunship.Axis.Right,GPObject.Missile.right.graphics.Axis.Right);
                vec3.set(GPObject.gunship.Axis.Up,   GPObject.Missile.right.graphics.Axis.Up);
                
                //mat4.identity(GPObject.Missile.right.graphics.Graphics.Matrix.Parent);
                GPObject.Missile.right.graphics.Graphics.Matrix.Parent = mat4.create();
                mat4.identity(GPObject.Missile.right.graphics.Graphics.Matrix.Parent);
                GPObject.Missile.right.thruster.Attach(GPObject.Missile.right.graphics);
                ParticleManager.Start(GPObject.Missile.right.thruster.id);
                
                
                GPObject.Missile.right.graphics.Physics.Add.InertialTensor(os.physics.Create.InertialTensor.Cube(GPObject.Missile.right.graphics.Physics,20,20,20));
                GPObject.Missile.right.graphics.Physics.CalculateDerivedData();
                os.audio.Play("rocket");
                GPObject.Missile.right.graphics.Graphics.Update = function(dt){
                    //var cur = (new Date()).getTime();
                    GPObject.Missile.right.time += dt;
                    if((GPObject.Missile.right.time) > 10000){
                        GPObject.Missile.right.graphics.AI.Movement.Disable.Seek.Entity();
                        GPObject.Missile.right.thruster.Stop();
                        os.graphics.RemoveFromUpdate(GPObject.Missile.right.graphics);
                        GPObject.Missile.right.launched = "DONE";
                        os.audio.Pause("rocket");
                        GPObject.Missile.right.time = 0;
                        
                    }
                    else{
                        var dif = [];
                        vec3.subtract(GPObject.Missile.right.graphics.Physics.position, ent.Physics.position, dif)
                        if(vec3.length(dif) < 50){
                            GPObject.Missile.right.graphics.AI.Movement.Disable.Seek.Entity();
                            os.audio.Play("strike");
                            ent.hits += 2;
                            if(ent.AI.name == "Fighter 1"){
                                ParticleManager.Start(GPObject.Explosions.Fighter1.id);
                                GPObject.HUD.Health.Fighter1.html.style.width = (100 * (GPObject.HUD.Health.Fighter1.max - GPObject.fighter1.hits)/GPObject.HUD.Health.Fighter1.max).toFixed(0) + "%";  
                            }
                            else if(ent.AI.name == "Fighter 2"){
                                ParticleManager.Start(GPObject.Explosions.Fighter2.id);
                                GPObject.HUD.Health.Fighter2.html.style.width = (100 * (GPObject.HUD.Health.Fighter2.max - GPObject.fighter2.hits)/GPObject.HUD.Health.Fighter2.max).toFixed(0) + "%"; 
                            }
                            os.graphics.RemoveFromUpdate(GPObject.Missile.right.graphics);
                            GPObject.Missile.right.thruster.Stop();
                            GPObject.Missile.right.launched = "DONE";
                            os.audio.Pause("rocket");
                            GPObject.Missile.right.time = 0;
                        }
                        
                    }
                }
                os.graphics.AddToUpdate(GPObject.Missile.right.graphics);
                os.ai.Movement.Add.Seek.Entity(GPObject.Missile.right.graphics, ent);
            }
        },
        Reticle:{
            obj: null,
            html: null,
            position: null,
            width: null,
            height: null,
            Time: {
                fighter1: 0,
                fighter2: 0
            }
        }
    },
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
        }
    },
    Target: {
        obj: null,
        html: null,
        time: null,
        vp: null,
        position: null
    },
    Target2: {
        obj: null,
        html: null,
        time: null,
        vp: null,
        position: null
    },
    CurrentSong: null
}
var GPGameUpdate = function(){
    if(GPObject.gunship.hits >= GPObject.HUD.Health.Gunship.max){
        GPObject.gunship.hits = 0;
        GPObject.fighter1.hits = 0;
        GPObject.fighter2.hits = 0;
        
        GPObject.fighter2.AI.Movement.Disable.Seek.Entity();
        GPObject.fighter2.AI.Movement.Disable.Hide.Entity();
        GPObject.fighter1.AI.Movement.Disable.Seek.Entity();
        GPObject.fighter1.AI.Movement.Disable.Hide.Entity();
        os.ai.Movement.Add.Patrol.Circle(GPObject.fighter1, 1500, [0,0,0]);
        os.ai.Movement.Add.Patrol.Circle(GPObject.fighter2, 1500, [0,0,0]);
        
        GPObject.Thursters.Fighter2.left.Start();
        GPObject.Thursters.Fighter2.right.Start();
        GPObject.Thursters.Fighter1.botLeft.Start();
        GPObject.Thursters.Fighter1.botRight.Start();
        GPObject.Thursters.Fighter1.topLeft.Start();
        GPObject.Thursters.Fighter1.topRight.Start();
        
        GPObject.Thursters.Gunship.left.Stop();
        GPObject.Thursters.Gunship.right.Stop();
        
        var cam = os.graphics.Managers.Camera;
        cam.Attach();
        cam.Rotation.yaw = GPObject.gunship.yaw;
        cam.Rotation.pitch = GPObject.gunship.pitch;
        cam.Rotation.roll = GPObject.gunship.roll;
        cam.Position[0] = GPObject.gunship.Position[0];
        cam.Position[1] = GPObject.gunship.Position[1];
        cam.Position[2] = GPObject.gunship.Position[2];
            
        cam.MoveForward(50);
        cam.Rotation.yaw += 180;
        
        //GPObject.Missile.left.graphics.Physics = null;
        //GPObject.Missile.left.launched = false;
        //GPObject.Missile.left.graphics.Graphics.Matrix.Parent = GPObject.gunship.Graphics.Matrix.World;
        //GPObject.Missile.left.graphics.Set.Position(-1.55,-0.41,-0.495);
        //GPObject.Missile.left.graphics.Set.Scale(0.1,0.1,0.1);
        //GPObject.Missile.left.graphics.pitch = 11;
        //GPObject.Missile.left.graphics.yaw  = 0;
        //
        //GPObject.Missile.right.graphics.Physics = null;
        //GPObject.Missile.right.launched = false;
        //GPObject.Missile.right.graphics.Graphics.Matrix.Parent = GPObject.gunship.Graphics.Matrix.World;
        //GPObject.Missile.right.graphics.Set.Position(1.55,-0.41,-0.495);
        //GPObject.Missile.right.graphics.Set.Scale(0.1,0.1,0.1);
        //GPObject.Missile.right.graphics.pitch = 11;
        //GPObject.Missile.right.graphics.yaw  = 0;
        
        
    }
    if(GPObject.fighter2.hits >= GPObject.HUD.Health.Fighter2.max){
        //GPObject.fighter2.hits = 0;
        GPObject.fighter2.AI.Movement.Disable.Seek.Entity();
        GPObject.fighter2.AI.Movement.Disable.Hide.Entity();
        GPObject.Thursters.Fighter2.left.Stop();
        GPObject.Thursters.Fighter2.right.Stop();
        
    }
    else if(GPObject.fighter2.hits > 1){
        if(!GPObject.fighter2.AI.MovementAlgorithms.HideEntity){
            GPObject.fighter2.AI.Movement.Disable.Seek.Entity();
            var hidingSpots = [];
            hidingSpots.push([-660,15,910]);
            hidingSpots.push([-1075,5,-350]);
            hidingSpots.push([-5,10,-1130]);
            hidingSpots.push([1075,10,-350]);
            hidingSpots.push([670,5,915]);
            offsets = [420,420,420,420,420];
            os.ai.Movement.Add.Hide.Entity(GPObject.fighter2, GPObject.gunship,hidingSpots,offsets);
        }
        
    }
    
    if(GPObject.fighter1.hits >= GPObject.HUD.Health.Fighter1.max){
        //GPObject.fighter1.hits = 0;
        GPObject.fighter1.AI.Movement.Disable.Seek.Entity();
        GPObject.fighter1.AI.Movement.Disable.Hide.Entity();
        GPObject.Thursters.Fighter1.botLeft.Stop();
        GPObject.Thursters.Fighter1.botRight.Stop();
        GPObject.Thursters.Fighter1.topLeft.Stop();
        GPObject.Thursters.Fighter1.topRight.Stop();
                
    }
    else if(GPObject.fighter1.hits > 1){
        if(!GPObject.fighter1.AI.MovementAlgorithms.HideEntity){
            GPObject.fighter1.AI.Movement.Disable.Seek.Entity();
            var hidingSpots = [];
            hidingSpots.push([-660,15,910]);
            hidingSpots.push([-1075,5,-350]);
            hidingSpots.push([-5,10,-1130]);
            hidingSpots.push([1075,10,-350]);
            hidingSpots.push([670,5,915]);
            offsets = [420,420,420,420,420];
            os.ai.Movement.Add.Hide.Entity(GPObject.fighter1, GPObject.gunship,hidingSpots,offsets);
        }
        
    }
    
    if(!GPObject.fighter1.AI.MovementAlgorithms.HideEntity && !GPObject.fighter2.AI.MovementAlgorithms.HideEntity &&
       !GPObject.fighter1.AI.MovementAlgorithms.SeekEntity && !GPObject.fighter2.AI.MovementAlgorithms.SeekEntity &&
       (GPObject.CurrentSong != "menu")){
                
        os.audio.Play("menu");
        GPObject.CurrentSong = "menu";
        os.audio.Pause("battle");
    }
    if(GPObject.fighter1.AI.MovementAlgorithms.SeekEntity){
        var dist = [];
        vec3.subtract(GPObject.gunship.Position, GPObject.fighter1.Physics.position, dist);
        dist = vec3.length(dist);
        if(dist < 800){
            if(GPObject.Time.Fighter1.Laser.last + 1000 < os.graphics.Time.current){
                os.audio.Play("laser");
                GPObject.Time.Fighter1.Laser.last = os.graphics.Time.current;
                bullet = new CBullet(GPObject.fighter1);
                bullet.AddGraphic([10,0,0]);
                bullet.AddGraphic([-10,0,0]);
            }
        }
        
    }
    if(GPObject.fighter2.AI.MovementAlgorithms.SeekEntity){
        var dist = [];
        vec3.subtract(GPObject.gunship.Position, GPObject.fighter2.Physics.position, dist);
        dist = vec3.length(dist);
        if(dist < 800){
            if(GPObject.Time.Fighter2.Laser.last + 1000 < os.graphics.Time.current){
                os.audio.Play("laser");
                GPObject.Time.Fighter2.Laser.last = os.graphics.Time.current;
                bullet = new CBullet(GPObject.fighter2);
                bullet.AddGraphic([10,0,0]);
                bullet.AddGraphic([-10,0,0]);
            }
        }
        
    }
    
    //Update Target Tracker
    mat4.multiply(os.graphics.Matrix.Projection, os.graphics.Matrix.View, GPObject.Target.vp);
    var pos = GPObject.fighter2.Physics.position;
    mat4.multiplyVec4(GPObject.Target.vp, [pos[0], pos[1], pos[2], 1], GPObject.Target.position);
    GPObject.Target.position[0] /= GPObject.Target.position[3];
    GPObject.Target.position[1] /= GPObject.Target.position[3];
    GPObject.Target.position[2] /= GPObject.Target.position[3];
    if(GPObject.Target.position[3] < 0){GPObject.Target.html.style.display = "none"}
    else{GPObject.Target.html.style.display = "block"}
    var x = -12 + ((1 + GPObject.Target.position[0])*os.graphics.Get.Width())/2;
    var y = -12 + ((1 - GPObject.Target.position[1])*os.graphics.Get.Height())/2;
    GPObject.Target.position[0] = x;
    GPObject.Target.position[1] = y;
    
    GPObject.Target.html.style.left = (x.toFixed(0)) + "px";
    GPObject.Target.html.style.top =  (y.toFixed(0)) + "px";
    
    var pos1 = GPObject.fighter1.Physics.position;
    mat4.multiplyVec4(GPObject.Target.vp, [pos1[0], pos1[1], pos1[2], 1], GPObject.Target2.position);
    GPObject.Target2.position[0] /= GPObject.Target2.position[3];
    GPObject.Target2.position[1] /= GPObject.Target2.position[3];
    GPObject.Target2.position[2] /= GPObject.Target2.position[3];
    if(GPObject.Target2.position[3] < 0){GPObject.Target2.html.style.display = "none"}
    else{GPObject.Target2.html.style.display = "block"}
    x = -12 + ((1 + GPObject.Target2.position[0])*os.graphics.Get.Width())/2;
    y = -12 + ((1 - GPObject.Target2.position[1])*os.graphics.Get.Height())/2;
    GPObject.Target2.position[0] = x;
    GPObject.Target2.position[1] = y;
    GPObject.Target2.html.style.left = (x.toFixed(0)) + "px";
    GPObject.Target2.html.style.top =  (y.toFixed(0)) + "px";
    
    //Check for Missle Lock
    //  r^2 < dist^2
    if((GPObject.Target.position[3] > 0 )){
        var dif = [];
        vec3.subtract([GPObject.Target.position[0], GPObject.Target.position[1],0],[GPObject.Missile.Reticle.position[0],GPObject.Missile.Reticle.position[1],0],dif);
            if(2500 > vec3.dot(dif, dif)){
                GPObject.Missile.Reticle.Time.fighter2 += os.graphics.Time.dt;
                if(GPObject.Missile.Reticle.Time.fighter2 > 1000){
                    GPObject.Missile.Reticle.html.style.borderColor = "red";
                }
            }
            else{
                
                GPObject.Missile.Reticle.Time.fighter2 = 0;
            }
    }
    if((GPObject.Target2.position[3] > 0 )){
        var dif = [];
        vec3.subtract([GPObject.Target2.position[0], GPObject.Target2.position[1],0],[GPObject.Missile.Reticle.position[0],GPObject.Missile.Reticle.position[1],0],dif);
            if(2500 > vec3.dot(dif, dif)){
                GPObject.Missile.Reticle.Time.fighter1 += os.graphics.Time.dt;
                if(GPObject.Missile.Reticle.Time.fighter1 > 1000){
                    GPObject.Missile.Reticle.html.style.borderColor = "red";
                }
            }
            else{
                GPObject.Missile.Reticle.Time.fighter1 = 0;
                
                
            }
    }
    if((GPObject.Missile.Reticle.Time.fighter2 < 1000) && (GPObject.Missile.Reticle.Time.fighter1 < 1000)){
       GPObject.Missile.Reticle.html.style.borderColor = "green"; 
    }
    
}



var GPUpdateHealth = function(){
    GPObject.HUD.Health.Fighter1.time += os.graphics.Time.dt;
    if((GPObject.fighter1.hits < GPObject.HUD.Health.Fighter1.max) && (GPObject.HUD.Health.Fighter1.time > 10000)){
        GPObject.fighter1.hits--;
        GPObject.fighter1.hits = GPObject.fighter1.hits < 0 ? 0 : GPObject.fighter1.hits;
        GPObject.HUD.Health.Fighter1.html.style.width = (100 * (GPObject.HUD.Health.Fighter1.max - GPObject.fighter1.hits)/GPObject.HUD.Health.Fighter1.max).toFixed(0) + "%";  
        GPObject.HUD.Health.Fighter1.time = 0;
        if(GPObject.fighter1.AI.MovementAlgorithms.HideEntity && GPObject.fighter1.hits <= 1){
            GPObject.fighter1.AI.Movement.Disable.Hide.Entity();    
            os.ai.Movement.Add.Seek.Entity(GPObject.fighter1, GPObject.gunship);
        }
    }
    
    GPObject.HUD.Health.Fighter2.time += os.graphics.Time.dt;
    if((GPObject.fighter2.hits < GPObject.HUD.Health.Fighter2.max) && (GPObject.HUD.Health.Fighter2.time > 10000)){
        GPObject.fighter2.hits--;
        GPObject.fighter2.hits = GPObject.fighter2.hits < 0 ? 0 : GPObject.fighter2.hits;
        GPObject.HUD.Health.Fighter2.html.style.width = (100 * (GPObject.HUD.Health.Fighter2.max - GPObject.fighter2.hits)/GPObject.HUD.Health.Fighter2.max).toFixed(0) + "%";  
        GPObject.HUD.Health.Fighter2.time = 0;
        if(GPObject.fighter2.AI.MovementAlgorithms.HideEntity && GPObject.fighter2.hits <= 1){
            GPObject.fighter2.AI.Movement.Disable.Hide.Entity();    
            os.ai.Movement.Add.Seek.Entity(GPObject.fighter2, GPObject.gunship);
        }
    }
    
    GPObject.HUD.Health.Gunship.time += os.graphics.Time.dt;
    if((GPObject.gunship.hits < GPObject.HUD.Health.Gunship.max) && (GPObject.HUD.Health.Gunship.time > 10000)){
        GPObject.gunship.hits--;
        GPObject.gunship.hits = GPObject.gunship.hits < 0 ? 0 : GPObject.gunship.hits;
        GPObject.HUD.Health.Gunship.html.style.width = (100 * (GPObject.HUD.Health.Gunship.max - GPObject.gunship.hits)/GPObject.HUD.Health.Gunship.max).toFixed(0) + "%";  
        GPObject.HUD.Health.Gunship.time = 0;
    }
}
var GPUpdate = function(dt){
    GPObject.updateTime = GPObject.updateTime + dt;
    if(GPObject.updateTime > 50){
        
            GPGameUpdate();
            
            GPUpdateHealth();

        GPObject.updateTime = 0;
    }
    
    os.input.Update(dt);
    GPGunshipCollisionUpdate();
    GPFighter2CollisionUpdate();
    GPBulletCollision();
    os.physics.Update.All(0.033);
    os.ai.Update(dt);
    GPControls(dt);
    //GPObject.station.yaw += 0.1;
    
    
    ParticleManager.Update(dt);
    GPObject.Bullets.Update(dt);
    
    if(GPObject.Debug.set){
        GPDebugUpdate(dt);
    }
    
}

var GPDraw = function(){

    GPObject.fighter1.Graphics.Draw();
    GPObject.fighter2.Graphics.Draw();
    GPObject.gunship.Graphics.Draw();
    if(GPObject.Missile.left.launched  != "DONE"){GPObject.Missile.left.graphics.Graphics.Draw();}
    if(GPObject.Missile.right.launched != "DONE"){GPObject.Missile.right.graphics.Graphics.Draw();}
    GPObject.station.Graphics.Draw();
    GPObject.Bullets.Draw();
    //GPObject.stationLarge.Graphics.Draw();
    GPObject.skybox.Graphics.Draw();
    if(GPObject.Debug.set){
        GPDebugDraw();
    }
    
    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    ParticleManager.Draw();
    
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    
    
    
    
    
}
var GPDebugUpdate = function(dt){
    GPObject.Debug.time += os.graphics.Time.dt
    GPObject.Debug.numOfFrames++;
    
    if(GPObject.Debug.time > 1000){
        GPObject.Debug.time = GPObject.Debug.time / 1000;
        if(GPObject.Debug.CollectData){GPObject.Debug.FPS.push((GPObject.Debug.numOfFrames/GPObject.Debug.time).toFixed(3));}
        GPObject.Debug.Win.Set.statusbarText("FPS: " + (GPObject.Debug.numOfFrames/GPObject.Debug.time).toFixed(3));
        GPObject.Debug.time = 0;
        GPObject.Debug.numOfFrames = 0;
    }
    
    

    
}
var GPDebugDraw = function(){
    
    for(var i = GPObject.Debug.bv.length - 1; i >= 0; i--){
        if(i != 18){GPObject.Debug.bv[i].Graphics.Draw();}
    }
    for(var i = GPObject.Bullets.list.length - 1; i >= 0; i--){
         vec3.set(GPObject.Bullets.list[i].Position, GPObject.Bullets.bv.graphics.Physics.position);
         quat4.set(GPObject.Bullets.list[i].orientation, GPObject.Bullets.bv.graphics.Physics.orientation);
        GPObject.Bullets.bv.graphics.Graphics.Draw();
    }
    
}

var GPAssetComplete = function(){
    if(GPMeshMgr.Requested == GPMeshMgr.Loaded &&
       GPTextureMgr.Requested == GPTextureMgr.Loaded &&
       os.graphics.Managers.Texture.textures.get("skybox").GetCount() == 6){
        
        var TexturesCompleted = 0;
        var TexturesPending   = 0;
        os.console.Comment("All Assets Loaded");
        
        os.console.Comment("Initializing Input");
        //Load Input
        GPLoad.Input();
        
        os.console.Comment("Initializing AI");
        //Load Artifical Intelligence Core
        GPLoad.AI();
        
        os.console.Comment("Initializing Entities");
        //Load Entities
        GPLoad.Entities();
        
        os.console.Comment("Initializing Bullets");
        //Load Bullet Object
        GPLoad.Bullets();
        
        os.console.Comment("Initializing Particle Effects");
        //Load Particle System
        GPLoad.ParticleEffects();
        
        os.console.Comment("Initializing Bounding Volumes");
        //Load Bounding Volumes and Physics
        GPLoad.BoundingVolumes();
        
        os.console.Comment("Initializing Game Controls");
        //Load Game Controls
        GPLoad.Controls();
        
        os.console.Comment("Initializing Debug State");
        //Load Deubg Elements
        GPLoad.Debug();
        
        os.console.Comment("Initializing HUD");
        //Load Deubg Elements
        GPLoad.HUD();
        
        
       
        GPObject.skybox.Attach(GPObject.gunship);
       
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
                GPObject.Menu.Buttons.play.html().innerHTML = "Play Now";
                //os.graphics.Start();
                os.debugbar.Disable();
                GPObject.gunship.Set.Position(550,145, 225);
                
                GPObject.gunship.yaw = 248;
                GPObject.gunship.pitch = 13;
                os.graphics.Managers.Camera.Attach(GPObject.gunship);
                os.graphics.Managers.Camera.Offset = vec3.create([0,5,80]);
                
                os.graphics.Managers.Camera.Rotation.pitch = 13;
                os.graphics.Managers.Camera.Rotation.yaw = 248;
                //os.graphics.gl.cullFace(os.graphics.gl.BACK)
                //os.graphics.gl.enable(os.graphics.gl.CULL_FACE)
                //GPObject.Menu.video.html().pause();
                //GPObject.Menu.video.html().style.display = "none";
            }
            else{
               setTimeout(TexturesReady, 1000);
            }
            
        };
        
        setTimeout(TexturesReady, 1000);
        
    }
}
var Gamepad = function(){
    os = com.jahova.os.Instance();
    
    //Initialzie Gamepad App
    GPInit();
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

var CBullet = function(ent){
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
    
    GPObject.Bullets.list.push(this);

}

