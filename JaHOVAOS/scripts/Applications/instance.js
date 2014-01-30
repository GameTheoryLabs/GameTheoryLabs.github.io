var gl;
var instacing = true;

InstanceWebGLInit = function(){
    
    var canvas = os.resschmgr.Create.HTMLElement("canvas");
    canvas.html().style.width = "100%";
    canvas.html().style.height = "100%";
    
    document.body.appendChild(canvas.html());
    document.body.style.overflow = "hidden";
    
    os.graphics.Load(false, true, canvas.html());
    
    gl = os.graphics.gl;
    
    //Set Up Control Window
    Win = os.windows.WindowsManager.Create.Window("Instacing: 1 Draw Call", "PC");
    Win.Set.position(0,0);
    Win.elements.content.html().style.overflow = "hidden";
    Win.Set.statusbarText("");
    Win.Display.window();
    Win.Set.width(300);
    Win.Set.height(60);
    Win.Set.onMax(os.graphics.OnReset);
    Win.Set.onMin(os.graphics.Pause);
    Win.Hide.menubar();
    Win.elements.content.html().innerHTML = "Press i to switch draw method";
    
    os.graphics.Managers.Camera.MoveUp(100);
    os.graphics.Managers.Camera.MoveLeft(30);  
    //Setup Input Controls
    Input = {
        Mouse: {
            lastX: 0,
            lastY: 0,
            pressed: false
        }
    }
    onKeyDown = function(e){
        if(String.fromCharCode(e.keyCode) == "W"){     //Forward
            os.graphics.Managers.Camera.MoveForward(10);   
        }
        else if(String.fromCharCode(e.keyCode) == "S"){     //Backware
            os.graphics.Managers.Camera.MoveBackward(10);
        }
        else if(String.fromCharCode(e.keyCode) == "A"){     //Straif Left
            os.graphics.Managers.Camera.MoveLeft(10);  
        }
        else if(String.fromCharCode(e.keyCode) == "D"){     //Straif Right
            os.graphics.Managers.Camera.MoveRight(10);
        }
        else if(String.fromCharCode(e.keyCode) == "Q"){     //Straif Up
            os.graphics.Managers.Camera.MoveUp(5);
        }
        else if(String.fromCharCode(e.keyCode) == "E"){     //Straif Down
            os.graphics.Managers.Camera.MoveDown(10);
        }
        else if(String.fromCharCode(e.keyCode) == "I"){     //Straif Down
            instacing = instacing ? false : true;
            
            if(instacing){Win.Set.title("Instacing: 1 Draw Call");}
            else{Win.Set.title("Instacing: " + numToDraw + " Draw Calls");}
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

Instancing = function(){
    InstanceWebGLInit();
    
    //Set global Draw and Update Callbacks
    os.graphics.Set.Callback.Draw(InstancingDraw);
    os.graphics.Set.Callback.Update(InstancingUpdate);
    
    //os.graphics.Managers.Texture.Create.Texture("starhawk", "scripts/jahova/OS/Cores/Graphics/textures/starhawk.jpg");
    //os.graphics.Managers.Mesh.Create.Mesh("starhawk", "scripts/jahova/OS/Cores/Graphics/meshes/starhawk.json");
    os.graphics.Managers.Texture.Create.Texture("crate", "scripts/jahova/OS/Cores/Graphics/textures/crate.jpg");
    
    quad = os.graphics.Managers.Mesh.Create.Primitive.Quad("quad");
    quad.Initialize();
    
    numToInstance = 500;//prompt("How many units would you like to instance (16,380 Max, will take very long time to load)");
    numToDraw = 50;//prompt("How many individual draw calls (Greater than 200, can stall out frame rates)")
    iQuad = os.graphics.Managers.Mesh.Create.Instanced("quad", "iQuad", numToInstance);
    iQuad.Initialize();

    single = os.graphics.Managers.Entity.Create();
    single.Graphics.Add.Mesh("quad");
    single.Graphics.Add.Texture("crate");
    single.Graphics.Set.texture(true);
    single.Set.Scale(1,1,1);
    single.Set.Position(-500,200,300);
    
    instanced = os.graphics.Managers.Entity.Create();
    instanced.Graphics.Add.Mesh("iQuad");
    instanced.Graphics.Add.Texture("crate");
    instanced.Graphics.Set.texture(true);
    instanced.Set.Scale(1,1,1);
    instanced.Set.Position(-500,200,300);

    for(var i = 0; i < numToInstance; i++){
        instanced.Graphics.Instanced.position[i*3 +  0] = -100.0 + (3.0 * ( i % 50.0) );
        instanced.Graphics.Instanced.position[i*3 +  1] = 100.0 - (3.0 * Math.floor(i/50.0));
        instanced.Graphics.Instanced.position[i*3 +  2] = -300.0;
    }
    
    os.graphics.Start();
    
    
}


InstancingDraw = function(){
    if(instacing){
        instanced.Graphics.Draw();
    }
    else{
        
        for(var i = 0; i < numToDraw; i++){
            var x = -100.0 + (3.0 * (i % 50.0));
            var y = 100.0 - (3.0 * Math.floor(i/50.0));
            var z = -300.0;
            single.Set.Position(x,y,z);
            single.Graphics.Draw();
        }
        
    }
}

InstancingUpdate = function(dt){
        
    Win.Set.statusbarText("FPS: " + (1/dt * 1000).toFixed(3) +", Polys: " + os.graphics.Managers.Mesh.totalPolys + ", Verts: " + os.graphics.Managers.Mesh.totalVerts);
}