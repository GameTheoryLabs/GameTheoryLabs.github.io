function $(v){return document.getElementById(v);}
CPhysics = function(ent){
    this.parent = ent;
    this.speed = 0;
    this.yawSpeed = 0;
    this.pitchSpeed = 0;
    this.mass = 1;
    this.inverseMass = 1;
    
    this.maxSpeed = 0.1;
    this.maxYawSpeed = 0.005;
    this.maxPitchSpeed = 0.005;
    this.maxRoll = 20;
    this.maxAcceleration = 0.001;
    
    this.acceleration = vec3.create([0,0,0]);
    this.heading = ent.Axis.Look;
    this.Forces = [];
    
    this.AddForce = function(force, duration){
        var frc = new CForce();
        frc.duration = duration
        frc.force = force;
        
        this.Forces.push(frc);
    }
    
    this.Update = function(dt){

        //this.UpdateAcceleration(dt);
        //this.UpdateVelocity(dt);
        this.UpdatePosition(dt);
        this.UpdateRotation(dt);
    }
    
    this.UpdateAcceleration = function(dt){
        //If no forces being applied, then no update required
        if(this.Forces.length > 0){
            //Calculate the total forces acting upon object
            var currentTime = (new Date()).getTime();
            var frc = vec3.create([0,0,0]);
            
            //Loop through all forces
            //  Remove forces that have expired
            //  Accumlate existiting forces
            for(var i = this.Forces.length - 1; i >= 0; i--){
                this.Forces[i].timeElapsed = currentTime - this.Forces[i].timeApplied;
                
                //See if force has expired and should be removed
                if(this.Forces[i].timeElapsed > this.Forces[i].duration){
                    this.Forces.splice(i,1);
                }
                else{
                    //Accumlate Force
                    vec3.add(frc, this.Forces[i].force);
                }
            }
            
            //Convert Force to acceleration
            vec3.scale(frc, this.inverseMass);
            
            var accelMag = vec3.length(frc);
            
            //Verify that max allowed accelration is not being violated
            if(accelMag > this.maxAcceleration){
                //Scale frc and save in acceleration
                vec3.scale(vec3.normalize(frc), this.maxAcceleration, this.acceleration);
            }
            else{
                this.acceleration = frc;
            }
        }
    }
    
    this.UpdateVelocity = function(dt){
        
        if(this.speed > this.maxSpeed)
            this.speed = this.maxSpeed;
            
        if((this.yawSpeed > this.maxYawSpeed) || (this.yawSpeed < (-1 * this.maxYawSpeed)))
        {
            this.yawSpeed = this.yawSpeed > 0 ? this.maxYawSpeed : -1 * this.maxYawSpeed;
        }
        
        if((this.pitchSpeed > this.maxPitchSpeed) || (this.pitchSpeed < (-1 * this.maxPitchSpeed)))
        {
            this.pitchSpeed = this.pitchSpeed > 0 ? this.maxPitchSpeed : -1 * this.maxPitchSpeed;
        }
        
        if(false){
            var vel = vec3.create();
            
            
            //Get current velocity from heading
            vec3.scale(this.heading, this.speed, vel);
            
            //Calculate new velocity from accelerations
            vec3.add(vel, vec3.scale(this.acceleration, dt));
            
            //New velocity magnitude (speed)
            var velMag = vec3.length(vel);
            
            //Set new speed
            if(velMag > this.maxSpeed){
                this.speed = this.maxSpeed;   
            }
            else{
                
                this.speed = velMag;
            }
            
            //Rotate Object to match heading with new velocity
            //  If speed is close to 0, dont rotate
            if( Math.abs(this.speed) > 0.001 ){
                var velNorm = vec3.create();
                vec3.normalize(vel, velNorm);
                
                var x, y, z;
                x = velNorm[0];
                y = velNorm[1];
                z = velNorm[2];
                
                if(velNorm != this.heading){
                    // Find angel between default look and [x,0,z]
                    //  this will adjust yaw
                    this.parent.yaw = radToDegrees(Math.acos(vec3.dot(this.parent.Default.Look, [x,0,z])));
                    
                    //Find angel between up  and [0, y, z]
                    //  this will give pitch
                    this.parent.pitch = radToDegrees(Math.acos(vec3.dot(this.parent.Default.Up, [0,y,z])));;
                    
                    //Find angel betwen default up and [x, y, 0]
                    //  this will adjust roll
                    
                    
                }
            }
        }

        
    }.bind(this);
    
    this.UpdatePosition = function(dt){
        //Takes current heading and scales by speed
        //  to obtain current velocity vector
        //Takes Velocity Vector and scales by dt
        //  adds to position to obtain new Position value
        vec3.add(this.parent.Position, vec3.scale(vec3.scale(this.heading, -1*this.speed), dt), this.parent.Position);
    }
    this.UpdateRotation = function(dt){
        this.parent.yaw += this.yawSpeed * dt;
        this.parent.pitch += this.pitchSpeed * dt;
    }
}

CForce = function(frc){
    this.force = vec3.create(frc);
    this.timeApplied = (new Date()).getTime();
    this.timeElapsed = 0;
    this.duration = 0;
}
CBullet = function(ent, offset){
    this.obj = os.graphics.Managers.Entity.Create();
    this.obj.Graphics.Add.Mesh("cube");
    this.obj.Graphics.Add.Texture("bullet");
    this.obj.Graphics.Set.light(false);
    this.obj.Set.Scale(1,1,5);
    
    vec3.set(ent.Axis.Look, this.obj.Axis.Look);
    vec3.set(ent.Axis.Up, this.obj.Axis.Up);
    vec3.set(ent.Axis.Right, this.obj.Axis.Right);
    vec3.set(ent.Position, this.obj.Position);
    
    this.obj.yaw = ent.yaw;
    this.obj.pitch = ent.pitch;
    this.obj.roll = ent.roll;
    
    this.obj.speed = ent.Physics.speed;
    
    this.obj.Position = vec3.create([ent.Position[0], ent.Position[1], ent.Position[2]]);
    this.obj.Position[0] += this.obj.Axis.Look[0] * offset[2];
    this.obj.Position[1] += this.obj.Axis.Look[1] * offset[2];
    this.obj.Position[2] += this.obj.Axis.Look[2] * offset[2];
    
    this.obj.Position[0] += this.obj.Axis.Right[0] * offset[0];
    this.obj.Position[1] += this.obj.Axis.Right[1] * offset[0];
    this.obj.Position[2] += this.obj.Axis.Right[2] * offset[0];
    
    this.obj.Position[0] += this.obj.Axis.Up[0] * offset[1];
    this.obj.Position[1] += this.obj.Axis.Up[1] * offset[1];
    this.obj.Position[2] += this.obj.Axis.Up[2] * offset[1];
    
    this.fireTime = (new Date()).getTime();
    this.duration = 3000;
    this.obj.Graphics.Update = function(dt){
        var cur = (new Date()).getTime();
        if((cur - this.fireTime) > this.duration){
            os.graphics.RemoveFromWorld(this.obj);
            this.obj.Graphics.Update = null;
        }
        else{
            //this.obj.Move.Forward(( -1 * dt * 0.5));
            var look = vec3.create();
            vec3.subtract(this.obj.Position, goliath.Position, look);
            var goliathDist = vec3.dot(look, look);
            var goliathRad = goliath.radius * goliath.radius + 4 ;
            
            //Collision Test with Goliath
            if(goliathRad > goliathDist){ //Collision Detected
                hud.AppendComment("Laser Strike on Alliance Space Station", "yellow");
                new CExplosion(this.obj, look, [0.17,0.26,0.40]);
                os.graphics.RemoveFromWorld(this.obj);
                this.obj.Graphics.Update = null;
                return
            
            }
            
            vec3.subtract(this.obj.Position, starfire.Position, look);
            var starfireDist = vec3.dot(look, look);
            var starfireRad = starfire.radius * starfire.radius + 4 ;
            
            //Collision Test with Goliath
            if(starfireRad > starfireDist){ //Collision Detected
                hud.AppendComment("Laser Strike on Alliance Patrol Ship", "yellow");
                new CExplosion(this.obj, look, [1.0,0.0,0.0]);
                os.graphics.RemoveFromWorld(this.obj);
                this.obj.Graphics.Update = null;
                return
            
            }
            
            //No Collision    
            this.obj.Move.Forward(( -1 * (this.obj.speed  + 0.5) * 1.2 * dt));

            
        }
        
    }.bind(this);
    
    os.graphics.AddToWorld(this.obj);
}

CExplosion = function(ent, look, color){
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

CCannonball = function(){

    var ent = ironstar;
    this.obj1 = os.graphics.Managers.Entity.Create();
    
    this.obj1.Graphics.Add.Mesh("cube");
    this.obj1.Graphics.Add.Texture("bullet");
    this.obj1.Graphics.Set.light(false);
    this.obj1.Set.Scale(3,3,8);
    
    vec3.set(ent.Axis.Look, this.obj1.Axis.Look);
    vec3.set(ent.Axis.Up, this.obj1.Axis.Up);
    vec3.set(ent.Axis.Right, this.obj1.Axis.Right);
    vec3.set(ent.Position, this.obj1.Position);
    //this.obj1.Set.Position(ent.Position[0] + 10.5, ent.Position[1] + 9.5, ent.Position[2]+ -21);
    
    this.obj1.yaw = ent.yaw;
    this.obj1.pitch = ent.pitch;
    this.obj1.roll = ent.roll;
    
    this.obj1.speed = ent.Physics.speed;
    
    vec3.set([10.5,9.5,-21],this.obj1.Default.Offset);
    
    mat4.rotate(this.obj1.Default.Rotation, degToRad(ironstar.turretYaw), ent.Axis.Up, this.obj1.Default.Rotation);
    
    this.obj2 = os.graphics.Managers.Entity.Create();
    
    this.obj2.Graphics.Add.Mesh("cube");
    this.obj2.Graphics.Add.Texture("bullet");
    this.obj2.Set.Scale(3,3,8);
    this.obj2.Graphics.Set.light(false);
    
    vec3.set(ent.Axis.Look, this.obj2.Axis.Look);
    vec3.set(ent.Axis.Up, this.obj2.Axis.Up);
    vec3.set(ent.Axis.Right, this.obj2.Axis.Right);
    vec3.set(ent.Position, this.obj2.Position);
    //this.obj1.Set.Position(ent.Position[0] - 10.5, ent.Position[1]+ 9.5, ent.Position[2]+ -21);
    
    this.obj2.yaw = ent.yaw;
    this.obj2.pitch = ent.pitch;
    this.obj2.roll = ent.roll;
    
    this.obj2.speed = ent.Physics.speed;
    
    vec3.set([-10.5,9.5,-21],this.obj2.Default.Offset);

    mat4.rotate(this.obj2.Default.Rotation, degToRad(ironstar.turretYaw), ent.Axis.Up, this.obj2.Default.Rotation);
    
    this.heading = vec3.create([0,0,1]);
    this.RotateX = mat4.create();
    this.RotateY = mat4.create();
    this.RotateZ = mat4.create();
    this.DefaultRotate = mat4.create();
    this.Rotation = mat4.create();
    
    mat4.set(this.obj1.Default.Rotation, this.DefaultRotate);
    
    mat4.identity(this.RotateX);
    mat4.identity(this.RotateY);
    mat4.identity(this.RotateZ);
    
    //Build Rotation Matrix
    mat4.rotateZ(this.RotateZ, degToRad(ent.roll), this.RotateZ);
    
    mat4.rotateX(this.RotateX, degToRad(ent.pitch), this.RotateX);
    
    mat4.rotateY(this.RotateY, degToRad(ent.yaw), this.RotateY);
    
    mat4.identity(this.Rotation);
    
    mat4.multiply(this.DefaultRotate, this.RotateY, this.Rotation);
    mat4.multiply(this.Rotation, this.RotateX, this.Rotation);
    mat4.multiply(this.Rotation, this.RotateZ, this.Rotation);
    
    
    mat4.multiplyVec3(this.Rotation, this.heading);
                            
    this.fireTime = (new Date()).getTime();
    this.duration = 5000;
    this.Update = function(dt){
        var cur = (new Date()).getTime();
        if((cur - this.fireTime) > this.duration){
            os.graphics.RemoveFromWorld(this.obj1);
            os.graphics.RemoveFromWorld(this.obj2);
            this.obj1.Graphics.Update = null;
            this.obj2.Graphics.Update = null;
        }
        else{
            var look = vec3.create();
            vec3.subtract(this.obj1.Position, goliath.Position, look);
            var dist = vec3.dot(look, look);
            var rad = goliath.radius * goliath.radius + 4 ;
            
            //Collision Test with Goliath
            if(rad > dist){ //Collision Detected
                hud.AppendComment("Cannon Strike on Alliance Space Station", "yellow");
                new CExplosion(this.obj1, look, [0.17,0.26,0.40]);
                os.graphics.RemoveFromWorld(this.obj1);
                os.graphics.RemoveFromWorld(this.obj2);
                this.obj1.Graphics.Update = null;
                this.obj2.Graphics.Update = null; 
            }
            else{ //No Collision
                //this.obj.Move.Forward(( -1 * dt * 0.5));
                this.obj1.Position[0] += this.heading[0] * ( -1 * (this.obj1.speed  + 0.7) * dt * 1.2);
                this.obj1.Position[1] += this.heading[1] * ( -1 * (this.obj1.speed  + 0.7) * dt * 1.2);
                this.obj1.Position[2] += this.heading[2] * ( -1 * (this.obj1.speed  + 0.7) * dt * 1.2);
                
                this.obj2.Position[0] += this.heading[0] * ( -1 * (this.obj2.speed  + 0.7) * dt * 1.2);
                this.obj2.Position[1] += this.heading[1] * ( -1 * (this.obj2.speed  + 0.7) * dt * 1.2);
                this.obj2.Position[2] += this.heading[2] * ( -1 * (this.obj2.speed  + 0.7) * dt * 1.2);
            }
            
        }
        
    }.bind(this);
    
    this.obj1.Graphics.Update = this.Update;
    //this.obj2.Graphics.Update = this.Update;
    
    os.graphics.AddToWorld(this.obj1);
    os.graphics.AddToWorld(this.obj2);
    
    
    

}
LoadMeshes = function(){
    os.graphics.Managers.Mesh.Create.Mesh("asteroid", "scripts/jahova/OS/Cores/Graphics/meshes/asteroid.json");
    os.graphics.Managers.Mesh.Create.Mesh("scorpion", "scripts/jahova/OS/Cores/Graphics/meshes/scorpion.json");
    os.graphics.Managers.Mesh.Create.Mesh("goliath", "scripts/jahova/OS/Cores/Graphics/meshes/goliath.json");
    os.graphics.Managers.Mesh.Create.Mesh("starfire", "scripts/jahova/OS/Cores/Graphics/meshes/starfire.json");
    os.graphics.Managers.Mesh.Create.Mesh("ironstarBody", "scripts/jahova/OS/Cores/Graphics/meshes/ironstarBody.json");
    os.graphics.Managers.Mesh.Create.Mesh("ironstarTurret", "scripts/jahova/OS/Cores/Graphics/meshes/ironstarTurret.json");
    
    cube = os.graphics.Managers.Mesh.Create.Primitive.Cube("cube");
    cube.Initialize();
    
    quad = os.graphics.Managers.Mesh.Create.Primitive.Quad("quad");
    quad.Initialize();
}
LoadTextures = function(){
    
    os.graphics.Managers.Texture.Create.Texture("asteroid", "scripts/jahova/OS/Cores/Graphics/textures/asteroid.jpg");
    os.graphics.Managers.Texture.Create.Texture("rock", "scripts/jahova/OS/Cores/Graphics/textures/rock.jpg");
    os.graphics.Managers.Texture.Create.Texture("scorpion", "scripts/jahova/OS/Cores/Graphics/textures/scorpion.jpg");
    os.graphics.Managers.Texture.Create.Texture("goliath", "scripts/jahova/OS/Cores/Graphics/textures/goliath.jpg");
    os.graphics.Managers.Texture.Create.Texture("starfire", "scripts/jahova/OS/Cores/Graphics/textures/starfire.jpg");
    os.graphics.Managers.Texture.Create.Texture("ironstar", "scripts/jahova/OS/Cores/Graphics/textures/ironstarparts.jpg");
    os.graphics.Managers.Texture.Create.Texture("bullet", "scripts/jahova/OS/Cores/Graphics/textures/bullet.bmp");
    os.graphics.Managers.Texture.Create.Texture("forcefield", "scripts/jahova/OS/Cores/Graphics/textures/forcefield.png");
    
    var space = os.graphics.Managers.Texture.Create.CubeMap("skybox");
    space.Load.positiveX("scripts/jahova/OS/Cores/Graphics/textures/cubemaps/space/space_positive_x.png");
    space.Load.negativeX("scripts/jahova/OS/Cores/Graphics/textures/cubemaps/space/space_negative_x.png");
    space.Load.positiveY("scripts/jahova/OS/Cores/Graphics/textures/cubemaps/space/space_positive_y.png");
    space.Load.negativeY("scripts/jahova/OS/Cores/Graphics/textures/cubemaps/space/space_negative_y.png");
    space.Load.positiveZ("scripts/jahova/OS/Cores/Graphics/textures/cubemaps/space/space_positive_z.png");
    space.Load.negativeZ("scripts/jahova/OS/Cores/Graphics/textures/cubemaps/space/space_negative_z.png");
}
LoadSkybox = function(){
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
    skybox = os.graphics.Managers.Entity.Create("skybox");
    
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
    os.graphics.AddToWorld(skybox);
    
    //Setup Update Function
    skybox.Graphics.Update = function(dt){
        if(skybox.attached){
            vec3.set(skybox.attachedEntity.Position, skybox.Position);
        }
    }.bind(skybox);
    
    
    
}
LoadHUD = function(){
    
    //Create HUD Window Theme
    var hudTheme = new os.windows.Create.Theme("HUD");
    hudTheme.menubarIntegrated = true;
    hudTheme.type = "STD";
    hudTheme.url = os.GetDomain + "styles/jahova.window.hud.css";
    hudTheme.Position.top = 0;
    hudTheme.Position.left = 0;
    hudTheme.Class.window = "hudWindow";
    hudTheme.Class.windowMinimized = "hudWindowMinimized";
    hudTheme.Class.windowMaximized = "hudWindowMaximized";
    hudTheme.Class.titlebar = "hudTitlebar";
    hudTheme.Class.titlebarText = "hudTitlebarText";
    hudTheme.Class.titlebarButtonContainer = "hudButtonContainer";
    hudTheme.Class.titlebarButtonMax = "hudButtonMax";
    hudTheme.Class.titlebarButtonMin = "hudButtonMin";
    hudTheme.Class.titlebarButtonClose = "hudButtonClose";
    hudTheme.Class.titlebarMinimized = "hudTitlebarMinimized";
    hudTheme.Class.menubar = "hudMenubar";
    hudTheme.Class.menubarElement = "hudMenubarElement";
    hudTheme.Class.toolbar = "hudToolbar";
    hudTheme.Class.toolbarElement = "hudToolbarElement";
    hudTheme.Class.content = "hudContent";
    hudTheme.Class.statusbar = "hudStatusbar";
    hudTheme.Class.statusbarText = "hudStatusbarText";
    
    //save theme
    os.windows.WindowsManager.Themes.put(hudTheme.name, hudTheme);
    
    //Game List Window
    gameList = os.windows.Create.Window("ORN Interface", "HUD");
    gameList.elements.titlebar.buttons.close.html().style.display = "none";
    gameList.Hide.menubar();
    gameList.elements.content.Class.Add("hudTextareaTop");
    
    gameList.Set.statusbarText("Press R to Refresh List");
            
    //Waiting Window
    waiting = os.windows.Create.Window("ORN Interface", "HUD");
    waiting.elements.titlebar.buttons.close.html().style.display = "none";
    waiting.Hide.menubar();
    waiting.elements.content.Class.Add("hudTextareaTop");
    waiting.Set.position(300,300);
    waiting.Set.width(275);
    waiting.Set.height(100)
    waitingText = os.resschmgr.Create.HTMLElement("div");
    waitingText.html().style.width = "100%"
    waitingText.html().innerHTML = "<font size = '7'> WAITING... </FONT>"
    
    waiting.elements.content.AppendChild(waitingText.html());
    
    
    //Debug Window
    debug = os.windows.Create.Window("Debug Window", "HUD");
    debug.elements.titlebar.buttons.close.html().style.display = "none";
    debug.Hide.menubar();
    debug.elements.content.Class.Add("hudTextareaTop");
    debug.Set.position(0,418);
    debug.Set.width(375);
    debug.Set.height(300)
    debugText = os.resschmgr.Create.HTMLElement("div");
    debugText.html().style.width = "100%";
    
    debug.elements.content.AppendChild(debugText.html());
    
    debug.Comment = function(cmt, color){
        if(color){
            debugText.html().innerHTML += "<font color='" + color + "'>" + cmt + "</font><br />";
        }
        else{
            debugText.html().innerHTML += cmt + "<br />";
        }
        debugText.html().scrollTop = debugText.html().scrollHeight;
    }
    
    debug.Clear = function(){
        debugText.html().innerHTML ="";
    };
    
    debug.Display.window();
    debug.Minimize();
    
    //HUD Window
    hud = os.windows.Create.Window("Active HUD", "HUD");
    hud.elements.titlebar.buttons.close.html().style.display = "none";
    hud.Hide.menubar();
    hud.Display.window();
    
    
    hudInput = os.resschmgr.Create.HTMLElement("input");
    hudInput.Class.Add("hudInput");
    hudInput.html().onfocus = function(){
        Omega.inputFocus = true;};
    hudInput.html().onblur = function(){
        Omega.inputFocus = false;};
    hud.elements.content.AppendChild(hudInput.html());
    
    hudOutput = os.resschmgr.Create.HTMLElement("pre");
    hudOutput.Class.Add("hudTextarea");
    hudOutput.html().style.bottom = 20;
    hud.elements.content.AppendChild(hudOutput.html());
    
    hud.AppendComment = function(cmt, color){
        if(color){
            hudOutput.html().innerHTML += "<font color='" + color + "'>" + cmt + "</font><br />";
        }
        else{
            hudOutput.html().innerHTML += cmt + "<br />";
        }
        hudOutput.html().scrollTop = hudOutput.html().scrollHeight;
    }
    
    hud.Clear = function(){
        hudOutput.html().innerHTML = "";
    }
    
    //hudOutput.html().value += "HUD Activated";
    hud.AppendComment("HUD Activated");
    
    
    
    gVelocity = os.resschmgr.Create.HTMLElement("div");
    gVelocity.AppendTo(hud.elements.content.html());
    gVelocity.html().style.position = "absolute";
    gVelocity.html().style.top = "22px";
    gVelocity.html().style.left = "0px";
    velocity = gauge.add(gVelocity.html(), {name: 'velocity', width: 15, height: 100, vertical: true, opacity: 0.1, gradient: true, colors:['#ff0000','#00ff00'], values: [0,4]});
    //velocity = gauge.add(gVelocity.html(), {name: 'velocity',vertical: true, width:15, height:100, name: 'test', limit: true, gradient: true, scale: 10, colors:['#00ff00','#ff0000'], values:[0,4]})
    
    gYaw = os.resschmgr.Create.HTMLElement("div");
    gYaw.AppendTo(hud.elements.content.html());
    gYaw.html().style.position = "absolute";
    gYaw.html().style.top = "22px";
    gYaw.html().style.left = "15px";
    yaw = gauge.add(gYaw.html(), {name: 'yaw', width: 100, height: 15, vertical: false, opacity: 0.1, gradient: true, colors:['#ff0000', '#00ff00'], values: [0,0.001]});
    
    gPitch = os.resschmgr.Create.HTMLElement("div");
    gPitch.AppendTo(hud.elements.content.html());
    gPitch.html().style.position = "absolute";
    gPitch.html().style.top = "37px";
    gPitch.html().style.left = "15px";
    pitch = gauge.add(gPitch.html(), {name: 'pitch', width: 100, height: 15, vertical: false, opacity: 0.1, gradient: true, colors:['#ff0000', '#00ff00'], values: [0,0.001]});
    
    
    
}
SetupUserInput = function(){

    
    Input = {
        Mouse: {
            lastX: 0,
            lastY: 0,
            pressed: false
        }
    }
    
    onKeyDown = function(e){
        var time = (new Date()).getTime();
        
            if(Omega.gameStarted && !Omega.inputFocus){
            //
            //      SHIP CONTROLS
            //
            if (String.fromCharCode(e.keyCode) == "W") {        //Increase Velocity
                //ironstar.Move.Backward(10);
                if(Omega.pilot || Omega.singlePlayer){
                    if(ironstar.Physics){
                        ironstar.Physics.speed += 0.01;
                        JOSS.Update.Velocity();
                        gauge.modify($('velocity'), {values: [ironstar.Physics.speed, ironstar.Physics.maxSpeed]});
                    }
                }
                
            
            }
            else if(String.fromCharCode(e.keyCode) == "S"){     //Descrease Velocity
                //ironstar.Move.Forward(10);
                if(Omega.pilot || Omega.singlePlayer){
                    if(ironstar.Physics){
                        ironstar.Physics.speed -= 0.01;
                        if(ironstar.Physics.speed < 0)
                            ironstar.Physics.speed = 0;
                        JOSS.Update.Velocity();   
                        gauge.modify($('velocity'), {values: [ironstar.Physics.speed, ironstar.Physics.maxSpeed]});
                    }
                }
            }
            else if(String.fromCharCode(e.keyCode) == "A"){     //Turn Left
                
                if(Omega.pilot || Omega.singlePlayer){
                   //ironstar.yaw -= 0.1 * os.graphics.Time.dt;
                    if(ironstar.Physics){
                        ironstar.Physics.yawSpeed -= 0.001;
                        JOSS.Update.Velocity();
                        gauge.modify($('yaw'), {values: [Math.abs(ironstar.Physics.yawSpeed), ironstar.Physics.maxYawSpeed]});
                    } 
                }
                else{
                    ironstar.turretYaw -= 2.8;
                    JOSS.Update.Turret();
                }
                
            }
            else if(String.fromCharCode(e.keyCode) == "D"){     //Turn Right
                if(Omega.pilot || Omega.singlePlayer){
                   //ironstar.yaw += 0.1 * os.graphics.Time.dt;
                    if(ironstar.Physics){
                        ironstar.Physics.yawSpeed += 0.001;
                        JOSS.Update.Velocity();
                        gauge.modify($('yaw'), {values: [Math.abs(ironstar.Physics.yawSpeed), ironstar.Physics.maxYawSpeed]});
                    } 
                }
                else{
                    ironstar.turretYaw += 2.8;
                    JOSS.Update.Turret();
                }
                
            }
            else if(String.fromCharCode(e.keyCode) == "Q"){     //Pitch Up
                if(Omega.pilot || Omega.singlePlayer){
                    if(ironstar.Physics){
                        ironstar.Physics.pitchSpeed += 0.001;
                        JOSS.Update.Velocity();
                        gauge.modify($('pitch'), {values: [Math.abs(ironstar.Physics.pitchSpeed), ironstar.Physics.maxPitchSpeed]});
                    }
                }
                
            }
            else if(String.fromCharCode(e.keyCode) == "E"){     //Pitch Down
                if(Omega.pilot || Omega.singlePlayer){
                    if(ironstar.Physics){
                        ironstar.Physics.pitchSpeed -= 0.001;
                        JOSS.Update.Velocity();
                        gauge.modify($('pitch'), {values: [Math.abs(ironstar.Physics.pitchSpeed), ironstar.Physics.maxPitchSpeed]});
                    }
                }
            }
            else if(String.fromCharCode(e.keyCode) == "C"){     //All Stop
                if(Omega.pilot || Omega.singlePlayer){
                    if(ironstar.Physics){
                        ironstar.Physics.pitchSpeed = 0;
                        ironstar.Physics.yawSpeed = 0;
                        ironstar.Physics.speed = 0;
                        JOSS.Update.Velocity();
                        gauge.modify($('pitch'), {values: [Math.abs(ironstar.Physics.pitchSpeed), ironstar.Physics.maxPitchSpeed]});
                        gauge.modify($('yaw'), {values: [Math.abs(ironstar.Physics.yawSpeed), ironstar.Physics.maxYawSpeed]});
                        gauge.modify($('velocity'), {values: [ironstar.Physics.speed, ironstar.Physics.maxSpeed]});
                    }
                }
            }
            else if(String.fromCharCode(e.keyCode) == "Y"){     //Rotate Turret Right
                if(!Omega.pilot || Omega.singlePlayer){
                    ironstar.turretYaw += 2.8;
                    JOSS.Update.Turret();
                }
            }
            else if(String.fromCharCode(e.keyCode) == "T"){     //Rotate Turret Left
                if(!Omega.pilot || Omega.singlePlayer){
                    ironstar.turretYaw -= 2.8;
                    JOSS.Update.Turret();
                }
            }
            
            else if(String.fromCharCode(e.keyCode) == "M"){     //Rotate Turret Left
                inpoot.openMenu();
            }
            
            //
            //  CAMERA CONTROLS
            //
            else if(String.fromCharCode(e.keyCode) == "I"){     //Forward
                os.graphics.Managers.Camera.MoveForward(5);   
            }
            else if(String.fromCharCode(e.keyCode) == "K"){     //Backware
                os.graphics.Managers.Camera.MoveBackward(5);
            }
            else if(String.fromCharCode(e.keyCode) == "J"){     //Straif Left
                os.graphics.Managers.Camera.MoveLeft(5);  
            }
            else if(String.fromCharCode(e.keyCode) == "L"){     //Straif Right
                os.graphics.Managers.Camera.MoveRight(5);
            }
            else if(String.fromCharCode(e.keyCode) == "U"){     //Straif Up
                os.graphics.Managers.Camera.MoveUp(5);
            }
            else if(String.fromCharCode(e.keyCode) == "O"){     //Straif Down
                os.graphics.Managers.Camera.MoveDown(10);
            }
            else if(String.fromCharCode(e.keyCode) == "1"){     //Return Camera to Home
    
                os.graphics.Managers.Camera.Attach();
                skybox.Attach(os.graphics.Managers.Camera);
            }
            else if(String.fromCharCode(e.keyCode) == "2"){     //Attach Camera to ironstar Turret
                os.graphics.Managers.Camera.Attach(ironstar);
                os.graphics.Managers.Camera.Offset = vec3.create([0,60,0]);
                skybox.Attach(ironstar)
                
            }
            else if(String.fromCharCode(e.keyCode) == "3"){     //Attach Camera to ironstar Cockpit
    
                os.graphics.Managers.Camera.Attach(ironstar);
                os.graphics.Managers.Camera.Offset = vec3.create([0,30,-90]);
                skybox.Attach(ironstar)
            }
            else if(String.fromCharCode(e.keyCode) == "4"){     //Ironstar 3rd Person
    
                os.graphics.Managers.Camera.Attach(ironstar);
                os.graphics.Managers.Camera.Offset = vec3.create([0,110,310]);  //pilot View
                //os.graphics.Managers.Camera.Offset = vec3.create([0,110,210]); //Gunner View
                skybox.Attach(ironstar);
            }
            else if(String.fromCharCode(e.keyCode) == "5"){     //Ironstar Interior
    
                os.graphics.Managers.Camera.Attach(ironstar);
                os.graphics.Managers.Camera.Offset = vec3.create([0,0,-50]);
                skybox.Attach(ironstar)
            }
            else if(String.fromCharCode(e.keyCode) == "6"){     //Move Camera to Current entity position
    
                vec3.set(os.graphics.Managers.Camera.attachedEntity.Position, os.graphics.Managers.Camera.Position);
                os.graphics.Managers.Camera.Attach();
                os.graphics.Managers.Camera.Offset = vec3.create([0,0,0]);
                skybox.Attach(os.graphics.Managers.Camera);
            }
            //
            //  RESET CONTROLS
            //
            else if(String.fromCharCode(e.keyCode) == "R"){     //Resets Position of Ironstar to home
    
                ironstar.Set.Position(0,0,0);
                JOSS.Update.Position();
                
    
            }
            else if(String.fromCharCode(e.keyCode) == "F"){     //Add Physics to starfire
    
    
            }
           
            
            //
            //  WORLD CONTROLS
            //
            else if(String.fromCharCode(e.keyCode) == "P"){     //Pause world
                os.graphics.Pause();
            }
            //
            //  Audio CONTROLS
            //
            else if(String.fromCharCode(e.keyCode) == "0"){     //Toggle Battle Theme
                var btl = AudioManager.Get("battle").audio.html()
                btl.paused ? btl.play() : btl.pause();
    
            }
            else if(String.fromCharCode(e.keyCode) == "9"){     //Toggle Menu Theme
                var mnu = AudioManager.Get("menu").audio.html()
                mnu.paused ? mnu.play() : mnu.pause();
                
            }
            else if(String.fromCharCode(e.keyCode) == "V"){     //Play Explosion 
                if(!Omega.pilot || Omega.singlePlayer){
                    if((Omega.lastCannon + (1.1 * AudioManager.Duration("explosion") * 1000)) < time){
                    //if(AudioManager.Get("explosion").audio.html().ended){
                        AudioManager.Play("explosion");
                        new CCannonball();
                        JOSS.Create.Cannonball();
                        Omega.lastCannon = time;
                    }
                }
            }
            else if(e.keyCode == 32){//SpaceBar                 //Play Laser
                if(!Omega.pilot || Omega.singlePlayer){
                    if((Omega.lastLaser + (1.2 * AudioManager.Duration("laser") * 1000)) < time){
                        AudioManager.Play("laser");
                        new CBullet(ironstar, vec3.create([0,5,-170]));
                        JOSS.Create.Bullet();
                        Omega.lastLaser = time;
                    }
                }
                
            }
                
        }
        else{
            if(e.keyCode == 13){//Enter                        //Send Chat Packet
                JOSS.SendChat();
            }
            else if(!Omega.gameStarted && !Omega.inputFocus && String.fromCharCode(e.keyCode) == "R"){     //Resets Position of Ironstar to home
    
                JOSS.GetListOfGames();
                
    
            }
        }
    }
    
    onMouseDown = function(e){
        Input.Mouse.lastX = e.clientX;
        Input.Mouse.lastY = e.clientY;
        Input.Mouse.pressed = true;
    }
    
    onMouseUp = function(e){
        Input.Mouse.pressed = false;
    }
    
    onMouseMove = function(e){
        if (!Input.Mouse.pressed) {
            return;
        }
        var cam = os.graphics.Managers.Camera;
        
        var newX = e.clientX;
        var newY = e.clientY;
    
        var deltaX = newX - Input.Mouse.lastX
        cam.Rotation.yaw += deltaX / 10;
        
        if(cam.Rotation.yaw > 360){ cam.Rotation.yaw  -= 360;}
        else if(cam.Rotation.yaw < 0) { cam.Rotation.yaw += 360; }
    
        var deltaY = newY - Input.Mouse.lastY;
        cam.Rotation.pitch += deltaY / 10;
        if(cam.Rotation.pitch > 360){ cam.Rotation.pitch  -= 360;}
        else if(cam.Rotation.pitch < 0) { cam.Rotation.pitch += 360; }
    
        Input.Mouse.lastX = newX
        Input.Mouse.lastY = newY;   
    }
    
    // Setup Event Handlers for User Input
    
    window.addEventListener("keydown", onKeyDown, false);
    os.graphics.Get.Canvas().addEventListener("mousedown", onMouseDown, false);
    document.addEventListener("mouseup", onMouseUp, false);
    document.addEventListener("mousemove", onMouseMove, false);
}

AsteroidManager = {
    //asteroids: os.resschmgr.Create.Map(),
    bounds: {
        x: 5000,
        y: 250,
        z: 5000
    },
    Create: function(){
        var am = AsteroidManager;
        var tmp = new os.graphics.Managers.Entity.Create();
        tmp.Graphics.Add.Mesh("asteroid");
        tmp.Graphics.Add.Texture("rock");
        tmp.Set.Position((am.bounds.x * 2 * Math.random()) - am.bounds.x, (am.bounds.y * 2 * Math.random()) - am.bounds.y, (am.bounds.z * 2 * Math.random()) - am.bounds.z);
        tmp.yaw = Math.random() * 360;
        tmp.pitch = Math.random() * 360;
        tmp.Set.Scale(2,2,2);
        tmp.Physics = new CPhysics(tmp);
        tmp.Physics.speed = 0.08;
        tmp.Physics.yawSpeed = 0.05;
        tmp.Physics.pitchSpeed = 0.05;
        
        tmp.Graphics.Update = function(dt){
            tmp.Physics.Update(dt);
            
            if((Math.abs(tmp.Position[0]) > am.bounds.x) || (Math.abs(tmp.Position[1]) > am.bounds.y) || (Math.abs(tmp.Position[2]) > am.bounds.z) ){
                
                tmp.Set.Position((am.bounds.x * 2 * Math.random()) - am.bounds.x, (am.bounds.y * 2 * Math.random()) - am.bounds.y, (am.bounds.z * 2 * Math.random()) - am.bounds.z);
            }
            else{
                var look = vec3.create();
                vec3.subtract(tmp.Position, goliath.Position, look);
                var goliathDist = vec3.dot(look, look);
                var goliathRad = goliath.radius * goliath.radius + 4 ;
                
                //Collision Test with Goliath
                if(goliathRad > goliathDist){ //Collision Detected
                    //hud.AppendComment("Laser Strike on Alliance Space Station", "yellow");
                    new CExplosion(tmp, look, [0.17,0.26,0.40]);
                    tmp.Set.Position((am.bounds.x * 2 * Math.random()) - am.bounds.x, (am.bounds.y * 2 * Math.random()) - am.bounds.y, (am.bounds.z * 2 * Math.random()) - am.bounds.z);
                    //os.graphics.RemoveFromWorld(this.obj);
                    //this.obj.Graphics.Update = null;
                    return
                
                }
                
                vec3.subtract(tmp.Position, ironstar.Position, look);
                var ironstarDist = vec3.dot(look, look);
                var ironstarRad = ironstar.radius * ironstar.radius + 4 ;
                
                //Collision Test with Ironstar
                if(ironstarRad > ironstarDist){ //Collision Detected
                    hud.AppendComment("Careful, you were hit by an asteroid", "red");
                    tmp.Set.Position((am.bounds.x * 2 * Math.random()) - am.bounds.x, (am.bounds.y * 2 * Math.random()) - am.bounds.y, (am.bounds.z * 2 * Math.random()) - am.bounds.z);
                    new CExplosion(tmp, look, [1.0,0.0,0.0]);
                    //os.graphics.RemoveFromWorld(tmp);
                    //this.obj.Graphics.Update = null;
                    return
                
                }
            }
        }
        
        
        os.graphics.AddToWorld(tmp);
        
        return tmp;
    }
}
CSound =  function(key){
    this.key = key;
    this.path = "";
    this.loop = false;
    this.autoplay = false;
    this.type = "";
    this.duration = "";
    this.volume = "";
    this.audio = os.resschmgr.Create.HTMLElement("audio");
}
AudioManager = {
    sounds: null,
    
    Initialize: function(){
        AudioManager.sounds = os.resschmgr.Create.Map();
    },
    Add: function(key, path, loop, autoplay, type){
        
        var snd = new CSound(key);
        snd.loop = loop;
        snd.autoplay = autoplay;
        
        if(type){
            snd.type = type;
            snd.path = path;
            var source = document.createElement('source');
            if(type.toUpperCase() == "MP3"){
                
                if (snd.audio.html().canPlayType('audio/mpeg;')) {
                    source.type= 'audio/mpeg';
                    source.src= path;
                    snd.audio.html().setAttribute('preload', 'auto');
                    
                    if(loop){snd.audio.html().setAttribute('loop', loop);}
                    if(autoplay){snd.audio.html().setAttribute('autoplay', autoplay);}
                    
                    snd.audio.html().appendChild(source);
                    
                    AudioManager.sounds.put(key, snd);
                }
                else{
                    os.windows.Create.ErrorWindow(" Audio", "Audio File: " +  key + " not loaded <br/>Audio File Type: " + type + " is not supported by browser")
                }
                
            }
            else if(type.toUpperCase == "OGG"){
                
                if(snd.audio.html().canPlayType('audio/ogg;')) {
                    source.type= 'audio/ogg';
                    source.src= path;
                    snd.audio.html().setAttribute('preload', 'auto');
                    
                    if(loop){snd.audio.html().setAttribute('loop', loop);}
                    if(autoplay){snd.audio.html().setAttribute('autoplay', autoplay);}
                    if(loop){
                        snd.audio.html().addEventListener('ended', function(){
                             snd.audio.html().currentTime = 0;
                             BattleAudioOn ? BattleTheme2.play() : BattleTheme.pause();
                         }  , false); 
                    }
                    
                    snd.audio.html().appendChild(source);
                    
                    AudioManager.sounds.put(key, snd);
                }
                else{
                    os.windows.Create.ErrorWindow(" Audio", "Audio File: " +  key + " not loaded <br/>Audio File Type: " + type + " is not supported by browser")
                }
            }
        }
        else{
            snd.type = type;
            snd.path = path;
            var source = document.createElement('source');
            
            if (snd.audio.html().canPlayType('audio/mpeg;')) {
                source.type= 'audio/mpeg';
                source.src= path + ".mp3";
                snd.audio.html().setAttribute('preload', 'auto');
                
                if(loop){snd.audio.html().setAttribute('loop', loop);}
                if(autoplay){snd.audio.html().setAttribute('autoplay', autoplay);}
                
                snd.audio.html().appendChild(source);
                
                AudioManager.sounds.put(key, snd);
            }
            else if(snd.audio.html().canPlayType('audio/ogg;')) {
                source.type= 'audio/ogg';
                source.src= path + ".ogg";
                snd.audio.html().setAttribute('preload', 'auto');
                
                if(loop){snd.audio.html().setAttribute('loop', loop);}
                if(autoplay){snd.audio.html().setAttribute('autoplay', autoplay);}
                if(loop){
                    snd.audio.html().addEventListener('ended', function(){
                         snd.audio.html().currentTime = 0;
                         BattleAudioOn ? BattleTheme2.play() : BattleTheme.pause();
                     }  , false); 
                }
                
                snd.audio.html().appendChild(source);
                
                AudioManager.sounds.put(key, snd);
            }
            
        }
        
        snd.duration = snd.audio.html().duration;
        snd.volume = snd.audio.html().volume;
    },
    SetVolume: function(key, vol){
        var snd = AudioManager.sounds.get(key);
        snd.audio.html().volume = vol;
        snd.volume = vol;
    },
    GetVolume: function(key){
        return AudioManager.sounds.get(key).volume;
    },
    Play: function(key){
        AudioManager.sounds.get(key).audio.html().play();
    },
    Pause: function(){
        AudioManager.sounds.get(key).audio.html().play();
    },
    Duration: function(key){
        return AudioManager.sounds.get(key).audio.html().duration;
    },
    Get: function(key){
        return AudioManager.sounds.get(key);
    }
}
JOSS = {
    server: null,
    gameID: null,
    Connect: function(){
        var domain = "orn.nodester.com";//prompt("Enter Domain for Server");
        var port = "80"; //prompt("Enter Port for Server");
        JOSS.server = os.network.Create.JOSServer(domain, port, "");
        JOSS.server.Events.onMessage = JOSS.onMessage;
        JOSS.server.Events.onError = JOSS.onError;
        JOSS.server.Events.onClose = JOSS.onClose;
        JOSS.server.Connect();
        
        
    },
    Disconnect: function(){
        JOSS.server.Disconnect();  
    },
    GetListOfGames: function(){
        JOSS.server.Get.SessionList("Omega");
    },
    JoinGame: function(id, type){
        JOSS.gameID = Number(id);
        type.toUpperCase() == "PILOT" ? Omega.pilotID = JOSS.server.userID : Omega.gunnerID = JOSS.server.userID;
        JOSS.server.JoinSession(Number(id),"");
    },
    StartGame: function(){
        var data = {};
            data.msgType = "StartGame";
            if(JOSS.gameID){
                JOSS.server.Broadcast(JOSS.gameID, data);
            }
            else{
                JOSS.server.Broadcast(JOSS.server.mainSessionID, data);
            }
            
            //JOSS.server?JOSS.server.Broadcast(JOSS.gameID, data):data;
    },
    SendChat: function(){
        var data = {};
        data.msgType = "Chat";
        data.msg = hudInput.html().value;
        hud.AppendComment(data.msg, "white");
        hudInput.html().value = "";
        JOSS.server.Broadcast(JOSS.gameID, data)
    },
    Update: {
        Velocity: function(){
            var data = {};
            data.msgType = "VelocityUpdate";
            data.speed = ironstar.Physics.speed;
            data.yawSpeed = ironstar.Physics.yawSpeed;
            data.pitchSpeed = ironstar.Physics.pitchSpeed;
            //JOSS.server?JOSS.server.Broadcast(JOSS.gameID, data):data;
            JOSS.server.Broadcast(JOSS.gameID, data)
        },
        Turret: function(){
            var data = {};
            data.msgType = "TurretUpdate";
            data.turretYaw = ironstar.turretYaw;
            JOSS.server.Broadcast(JOSS.gameID, data)
            //JOSS.server?JOSS.server.Broadcast(JOSS.gameID, data):data;
        },
        Position: function(){
            var data = {};
            data.msgType = "PositionUpdate";
            data.position = {};
            data.position.x = ironstar.Position[0];
            data.position.y = ironstar.Position[1];
            data.position.z = ironstar.Position[2];
            //data.speed = ironstar.Physics.speed;
            data.yaw = ironstar.yaw;
            data.pitch = ironstar.pitch;
            JOSS.server.Broadcast(JOSS.gameID, data)
        },
        Goliath: function(){
            var data = {};
            data.msgType = "GoliathUpdate";
            data.yaw = goliath.yaw;
            JOSS.server.Broadcast(JOSS.gameID, data)
            
        },
        Starfire: function(){
            var data = {};
            data.msgType = "StarfireUpdate";
            data.position = {};
            data.position.x = starfire.Position[0];
            data.position.y = starfire.Position[1];
            data.position.z = starfire.Position[2];
            data.yaw = starfire.yaw;
            data.pitch = starfire.pitch;
            JOSS.server.Broadcast(JOSS.gameID, data)
        },
        Asteroid: function(ast){
            
        }
    },
    Create: {
        Game: function(type){
            JOSS.server.Create.RegisteredSession("Omega","");
            type ==  "pilot" ? Omega.pilotID = JOSS.server.userID : Omega.gunnerID = JOSS.server.userID;
        },
        Bullet: function(){
            var data = {};
            data.msgType = "CreateBullet";
            JOSS.server.Broadcast(JOSS.gameID, data);
        },
        Cannonball: function(){
            var data = {};
            data.msgType = "CreateCannonball";
            JOSS.server.Broadcast(JOSS.gameID, data);
        },
        Asteroid: function(){
            
        }
    },
    onError: function(e){
        //throw new Error("JaHOVA OS Error");
        os.console.Error("JaHOVA OS Server Error");
        hud.AppendComment("Omega Resistance Network Offline, you are on your own... Good Luck!");
        Omega.singlePlayer = true;
        StartGame();
    },
    onClose: function(){
        JOSS.LeaveSession(JOSS.gameID);
    },
    onMessage: function(msg){
        //Handle Messages
        try{
            var type = msg.Data.Type;
            var data = msg.Data.Args[0];
        }
        catch(ex){
            os.console.Comment(ex);
        }
        
        if(type == "sessionBroadcast"){
            if(data.msgType == "VelocityUpdate"){
                ironstar.Physics.speed = data.speed;
                ironstar.Physics.yawSpeed = data.yawSpeed;
                ironstar.Physics.pitchSpeed = data.pitchSpeed;
                gauge.modify($('pitch'), {values: [Math.abs(ironstar.Physics.pitchSpeed), ironstar.Physics.maxPitchSpeed]});
                gauge.modify($('yaw'), {values: [Math.abs(ironstar.Physics.yawSpeed), ironstar.Physics.maxYawSpeed]});
                gauge.modify($('velocity'), {values: [ironstar.Physics.speed, ironstar.Physics.maxSpeed]});
            }
            else if(data.msgType == "TurretUpdate"){
                ironstar.turretYaw = data.turretYaw;
            }
            else if(data.msgType == "PositionUpdate"){
                ironstar.Position[0] = data.position.x;
                ironstar.Position[1] = data.position.y;
                ironstar.Position[2] = data.position.z;
                ironstar.pitch = data.pitch;
                ironstar.yaw = data.yaw;
            }
            else if(data.msgType == "StarfireUpdate"){
                starfire.Position[0] = data.position.x;
                starfire.Position[1] = data.position.y;
                starfire.Position[2] = data.position.z;
                starfire.yaw = data.yaw;
                starfire.pitch = data.pitch;
            }
            else if(data.msgType == "CreateBullet"){
                AudioManager.Play("laser");
                new CBullet(ironstar, vec3.create([0,5,-170]));
            }
            else if(data.msgType == "CreateCannonball"){
                AudioManager.Play("explosion");
                new CCannonball();
            }
            else if(data.msgType == "CreateAsteroid"){
                
            }
            else if(data.msgType == "UpdateAsteroid"){
                
            }
            else if(data.msgType == "StartGame"){
                hud.AppendComment("Your Request for assistance has been answered, Good Luck!", "red");
                StartGame();
            }
            else if(data.msgType == "GoliathUpdate"){
                goliath.yaw = data.yaw;
            }
            else if(data.msgType == "Chat"){
                hud.AppendComment(data.msg);
                AudioManager.Play("chat");
            }
            else{
                hud.AppendComment("Unknow Broadcast Message from ORN:" + data.msg);
            }
            
        }
        else if(type == "sessionList"){
            
            gameList.elements.content.RemoveAllChildren();
            
            var singlePlayer = os.resschmgr.Create.HTMLElement("a");
            //Place what is requested pilot or gunner
            singlePlayer.html().innerHTML = "Click <U>Here</U> to take on the Alliance Alone<br/> ";
            singlePlayer.html().style.cursor='pointer';
            singlePlayer.html().style.display = "block";
            //Add onclick event that will request join of session
            singlePlayer.html().onclick = function(e){
                
                hud.AppendComment("Omega Resistance Network Offline, you are on your own... Good Luck!");
                Omega.singlePlayer = true;
                StartGame();
            }
            
            //Add to Window Content
            gameList.elements.content.AppendChild(singlePlayer.html());
                    
                    
            //Add Create Request Dialogue
            var createGame = os.resschmgr.Create.HTMLElement("div");
            //createGame.Class.Add("hudTextareaTop");
            //Place what is requested pilot or gunner
            createGame.html().innerHTML = "Find an Open Conflict Area and Register on ORN as a: ";
            gameList.elements.content.AppendChild(createGame.html());
            
            var pilot = os.resschmgr.Create.HTMLElement("a");
            pilot.html().innerHTML = "<U>PILOT</U> "
            pilot.html().style.cursor='pointer';
            //pilot.Class.Add("hudTextarea");
            //Add onclick event that will request join of session
            pilot.html().onclick = function(){
                JOSS.Create.Game("pilot");
                hud.AppendComment("Requesting Assignment as a Pilot on ORN", "yellow");
            }
            
            var gunner = os.resschmgr.Create.HTMLElement("a");
            gunner.html().innerHTML = "<U>GUNNER</U><br/>";
            gunner.html().style.cursor='pointer';
            //gunner.Class.Add("hudTextarea");
            gunner.html().onclick = function(){
                JOSS.Create.Game("gunner");
                hud.AppendComment("Requesting Assignment as a Gunner on ORN", "yellow");
            }
            
            //Add to Window Content
            createGame.AppendChild(pilot.html());
            createGame.AppendChild(gunner.html());
            var assist = os.resschmgr.Create.HTMLElement("div");
            assist.html().innerHTML += "<br/>Assit an Omega Operative in an Active Conflict Area below <br/>"
            createGame.AppendChild(assist.html());
            
            if(msg.Data.Args){
                hud.AppendComment("Found " + msg.Data.Args.length + " operatives in active conflicts requesting assistance", "red");
                
                for(var i = 0; i < msg.Data.Args.length; i++){
                    //Create List element
                    var game = os.resschmgr.Create.HTMLElement("a");
                    //var playerType = msg.Data.Args[i].properties.key ? "Pilot" : "Gunner";
                    var playerType = msg.Data.Args[i].properties[0].key.toUpperCase() == "PILOT" ? "Gunner" : "Pilot"
                    //Place what is requested pilot or gunner
                    game.html().innerHTML = msg.Data.Args[i].id + ": <U>Operative Requesting: " + playerType + "</U>";
                    game.html().style.cursor='pointer';
                    game.html().style.display = "block";
                    game.html().id = msg.Data.Args[i].id;
                    game.html().name = playerType;
                    //Add onclick event that will request join of session
                    game.html().onclick = function(e){
                        
                        JOSS.JoinGame(e.currentTarget.id, e.currentTarget.name);
                        hud.AppendComment("Answering Operatives Request", "yellow");
                    }
                    
                    //Add to Window Content
                    gameList.elements.content.AppendChild(game.html());
                }
            }
            else{
                hud.AppendComment("No Operatives Found Needing Assistance");
            }
            
            gameList.Set.position(300,300);
            gameList.Display.window();
            
        }
        else if(type == "userID"){
            hud.AppendComment("Connected to Omega Resistance Network (ORN)..", "red");
            hud.AppendComment("Searching ORN for resistance operatives needing assistance...", "red");
            setTimeout(JOSS.GetListOfGames, 1000);
        }
        else if(type == "sessionJoined"){
            JOSS.StartGame();
            
            hud.AppendComment("Entering Conflict Area.... Good Luck!", "red");
            gameList.Hide.window();
            //set Session Property 
            if(Omega.pilotID){
                JOSS.server.Set.SessionProperty(JOSS.gameID, "pilot", Omega.pilotID);
            }
            else{
                JOSS.server.Set.SessionProperty(JOSS.gameID, "gunner", Omega.gunnerID);
            }
            
            StartGame();
            
        }
        else if(type == "sessionCreated"){
            hud.AppendComment("Entering Conflict Area: " + data + ", waiting for assistance.... Good Luck!", "red");
            
            //Save Game ID
            JOSS.gameID = Number(data);
            
            //set Session Property 
            if(Omega.pilotID){
                //setTimeout( function(){JOSS.server.Set.SessionProperty(JOSS.gameID, "pilot", Omega.pilotID); }, 1000);
                JOSS.server.Set.SessionProperty(JOSS.gameID, "pilot", Omega.pilotID);
            }
            else{
                //setTimeout( function(){JOSS.server.Set.SessionProperty(JOSS.gameID, "gunner", Omega.gunnerID); }, 1000);
                JOSS.server.Set.SessionProperty(JOSS.gameID, "gunner", Omega.gunnerID); 
            }
            var requestType = Omega.pilotID ? "Gunner" : "Pilot"
            hud.AppendComment("Placing Request for " + requestType  + " via the ORN", "yellow");
            
            
            
            gameList.Hide.window();
            waiting.Display.window();
            
        }
        else if(type == "propertySet"){
            hud.AppendComment("ORN has assigned you as a " + data, "red");
            Omega.pilotID == JOSS.server.userID ? Omega.pilot = true : Omega.pilot = false;
        }
        else{
            hud.AppendComment("Unknow Message from ORN:" + type);
        }
    }
    
}
Update = function(dt){
    debug.Clear();
    debug.Set.statusbarText("FPS: " + (1/dt * 1000).toFixed(3) +", Polys: " + os.graphics.Managers.Mesh.totalPolys + ", Verts: " + os.graphics.Managers.Mesh.totalVerts);
    debug.Comment("Ironstar: X: " + ironstar.Position[0].toFixed(1) + ", Y: " + ironstar.Position[1].toFixed(1) + ", Z: " + ironstar.Position[2].toFixed(1));
    debug.Comment("Pilot: " + Omega.pilot + ", PilotID: " + Omega.pilotID + ", GunnerID: " + Omega.gunnerID);
    debug.Comment("Starfire: X: " + starfire.Position[0].toFixed(1) + ", Y: " + starfire.Position[1].toFixed(1) + ", Z: " + starfire.Position[2].toFixed(1));
    debug.Comment("Starfire: Yaw: " + starfire.yaw.toFixed(1) + ", Pitch: " + starfire.pitch.toFixed(1) + ", Speed: " + starfire.Physics.speed.toFixed(1));
    debug.Comment("Goliath: Yaw: " + goliath.yaw.toFixed(1));
    debug.Comment("Update Frequency: " + Omega.SyncDuration + ", Last Update: " + Omega.lastSync);
    
    if(ironstar.Physics.speed > 0){
        var look = vec3.create();
        vec3.subtract(ironstar.Position, goliath.Position, look);
        var dist = vec3.length(look);
        var goliathDist = vec3.dot(look, look);
        var goliathRad = goliath.radius * goliath.radius + ironstar.radius * ironstar.radius ;
        
        //Collision Test with Goliath
        if(goliathRad > goliathDist){ //Collision Detected
            hud.AppendComment("You collided with the Alliance Space Station", "red");
            //new CExplosion(ironstar, look, [0.17,0.26,0.40]);
            vec3.normalize(look);
            ironstar.Position[0] += look[0] * ( (ironstar.radius + goliath.radius) - dist);
            ironstar.Position[1] += look[1] * ( (ironstar.radius + goliath.radius) - dist);
            ironstar.Position[2] += look[2] * ( (ironstar.radius + goliath.radius) - dist);
        
        }
    }
    
    Omega.lastSync += os.graphics.Time.dt;
    if((Omega.lastSync > Omega.SyncDuration) && JOSS.server && Omega.pilot && Omega.gameStarted){
        JOSS.Update.Position();
        Omega.lastSync = os.graphics.Time.dt;
    }
}
Draw = function(dt){

    ironstar.Graphics.Draw("default", "ironstarBody");

    //Get offset rotation to apply to turret
    mat4.rotate(ironstar.Default.Rotation, degToRad(ironstar.turretYaw), ironstar.Axis.Up, ironstar.Default.Rotation);
     
    //Draw Turret
    ironstar.Graphics.Draw("default", "ironstarTurret");
    
    //Reset offset
    mat4.identity(ironstar.Default.Rotation);
    
}
StartGame = function(){
    //Omega.pilotID == JOSS.server.userID ? Omega.pilot = true : Omega.pilot = false;
    gameList.Hide.window();
    waiting.Hide.window();
    Omega.gameStarted = true;
    if(Omega.pilot){
        JOSS.Update.Goliath();
        JOSS.Update.Starfire();
    }
    
    
}
Omega = {
    gameStarted: false,
    inputFocus: false,
    pilotID: null,
    gunnerID: null,
    pilot: false,
    singlePlayer: false,
    lastLaser: 0,
    laserDuration: 0,
    lastCannon: 0,
    cannonDuration: 0,
    lastSync: 201,
    SyncDuration: 200
}


            
WebGL = function(){
    //Hide OS Debug Bar
    os.debugbar.Disable();
    
    //Load HUD
    LoadHUD();
    
    AudioManager.Initialize();
    AudioManager.Add("battle","scripts/Applications/Audio/BattleTheme",true, false);
    AudioManager.Add("menu","scripts/Applications/Audio/MenuTheme",true, true);
    AudioManager.SetVolume("menu", 0.5);
    AudioManager.Add("explosion","scripts/Applications/Audio/Explosion",false, false);
    AudioManager.SetVolume("explosion", 0.5);
    Omega.cannonDuration = AudioManager.Duration("explosion") * 1000;
    
    AudioManager.Add("laser","scripts/Applications/Audio/Laser",false, false);
    AudioManager.SetVolume("laser", 0.5);
    Omega.laserDuration = AudioManager.Duration("laser") * 1000;
    
    AudioManager.Add("chat","scripts/Applications/Audio/Chirp",false, false);
    AudioManager.SetVolume("chat", 1.0);
   

    var canvas = os.resschmgr.Create.HTMLElement("canvas");
    canvas.html().style.width = "100%";
    canvas.html().style.height = "100%";
    
    document.body.appendChild(canvas.html());
    document.body.style.overflow = "hidden";
    
    //Load WebGL (Debug: false, fullscreen: false, canvas HTML object)
    os.graphics.Load(false, false, canvas.html());
    
    os.graphics.Set.Callback.Update(Update);
    os.graphics.Set.Callback.Draw(Draw);
    
    //Load default mesh and texture
    LoadTextures();
    LoadMeshes();
    
    //Load Space Skybox
    LoadSkybox();
    
    //Creates a standard entity object and extends the graphics object
    scorpion = os.graphics.Managers.Entity.Create();
    goliath  = os.graphics.Managers.Entity.Create();
    starfire = os.graphics.Managers.Entity.Create();
    ironstar = os.graphics.Managers.Entity.Create();
    
    
    
    
    //Adds mesh and texture to object
    scorpion.Graphics.Add.Mesh("scorpion");
    scorpion.Graphics.Add.Texture("scorpion");
    
    starfire.Graphics.Add.Mesh("starfire");
    starfire.Graphics.Add.Texture("starfire");
    
    goliath.Graphics.Add.Mesh("goliath");
    goliath.Graphics.Add.Texture("goliath");
    goliath.radius = 1250;
    
    starfire.Graphics.Add.Mesh("starfire");
    starfire.Graphics.Add.Texture("starfire");
    starfire.radius = 150;
    
    ironstar.Graphics.Add.Mesh("ironstarBody");
    ironstar.Graphics.Add.Mesh("ironstarTurret");
    ironstar.Graphics.Add.Texture("ironstar");
    ironstar.radius = 150;
    
    
    
    //
    //  Set Initial Conditions
    //


    //******* IRONSTAR **************// 
    ironstar.yaw = 180;
    ironstar.Set.Scale(0.1,0.1,0.1);
    
    //Key Press 4 - Attach Camera and Make ironstar center of universe
    os.graphics.Managers.Camera.Attach(ironstar);
    os.graphics.Managers.Camera.Offset = vec3.create([0,110,310]);
    skybox.Attach(ironstar);
    
    //Enable Physics
    ironstar.Physics = new CPhysics(ironstar);
    ironstar.turretYaw = 0;
    
    ironstar.Graphics.Update = function(dt){
        ironstar.Physics.Update(dt);
    }
    
    //******* GOLIATH **************// 
    goliath.Set.Position(-2000,0,4000);
    goliath.Set.Scale(0.5,0.5,0.5);
    
    //******* STARFIRE **************//
    starfire.Set.Position(-1200, -300, 4000);
    starfire.Set.Scale(0.5, 0.5, 0.5);
    
    starfire.Physics = new CPhysics(starfire);
    
    
    starfire.Graphics.Update = function(dt){
        starfire.Physics.Update(dt);
    }.bind(starfire);
    
    
    
    
    //Adds object to be auto updated and drawn
    os.graphics.AddToUpdate(ironstar);
    os.graphics.AddToWorld(goliath);
    os.graphics.AddToWorld(starfire);
    
    //Start graphics context to draw and update
    os.graphics.Start();
    
    
    
    AsteroidManager.Create();
    AsteroidManager.Create();
    AsteroidManager.Create();
    AsteroidManager.Create();
    AsteroidManager.Create();
    AsteroidManager.Create();
    AsteroidManager.Create();
    AsteroidManager.Create();
    AsteroidManager.Create();
    AsteroidManager.Create();
    AsteroidManager.Create();
    AsteroidManager.Create();
    AsteroidManager.Create();
    AsteroidManager.Create();
    AsteroidManager.Create();
    //AsteroidManager.Create();
    //AsteroidManager.Create();
    //AsteroidManager.Create();
    //AsteroidManager.Create();
    //AsteroidManager.Create();
    //AsteroidManager.Create();
    //AsteroidManager.Create();
    //AsteroidManager.Create();
    //AsteroidManager.Create();
    //AsteroidManager.Create();
    //AsteroidManager.Create();
    //
    
    starfire.Physics.speed = -0.1;
    starfire.Physics.yawSpeed  = -0.005;
    SetupUserInput();
    
    JOSS.Connect();
    

    
    
    //**********DEMO CODE - REMOVE FOR FINAL *********************//
    //ironstar.Graphics.Update = function(dt){
    //    this.yaw += 0.02 *dt;
    //}.bind(ironstar);
    
    goliath.Graphics.Update = function(dt){
        this.yaw += 0.005 * dt;
    }.bind(goliath);
}