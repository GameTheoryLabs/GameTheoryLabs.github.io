var gl;
var models;

ViRISWebGLInit = function(){
    
    var canvas = os.resschmgr.Create.HTMLElement("canvas");
    canvas.html().style.width = "100%";
    canvas.html().style.height = "100%";
    
    document.body.appendChild(canvas.html());
    document.body.style.overflow = "hidden";
    
    os.graphics.Load(false, true, canvas.html());
    
    gl = os.graphics.gl;
    
    //Set Up Control Window
    Win = os.windows.WindowsManager.Create.Window("ViRIS Model Viewer", "PC");
    Win.Set.position(0,0);
    Win.elements.content.html().style.overflow = "hidden";
    Win.Set.statusbarText("");
    Win.Display.window();
    Win.Set.width(300);
    Win.Set.height(60);
    Win.Set.onMax(os.graphics.OnReset);
    Win.Set.onMin(os.graphics.Pause);
    Win.Hide.menubar();
    Win.elements.content.html().innerHTML = "Press i to switch model";
    
    
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
            models.next();
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

ViRIS = function(){
    ViRISWebGLInit();
    
    models =  os.resschmgr.Create.Map();
    
    //Set global Draw and Update Callbacks
    os.graphics.Set.Callback.Draw(ViRISDraw);
    os.graphics.Set.Callback.Update(ViRISUpdate);
    
    //Load Models
    os.graphics.Managers.Mesh.Create.Mesh("outpost", "scripts/Applications/ViRIS/meshes/outpost.json");
    os.graphics.Managers.Mesh.Create.Mesh("robot", "scripts/Applications/ViRIS/meshes/robot.json");
    os.graphics.Managers.Mesh.Create.Mesh("robotBox", "scripts/Applications/ViRIS/meshes/robotBox.json");
    os.graphics.Managers.Mesh.Create.Mesh("raptor", "scripts/Applications/ViRIS/meshes/raptor.json");
    os.graphics.Managers.Mesh.Create.Mesh("column1", "scripts/Applications/ViRIS/meshes/column1.json");
    os.graphics.Managers.Mesh.Create.Mesh("column2", "scripts/Applications/ViRIS/meshes/column2.json");
    os.graphics.Managers.Mesh.Create.Mesh("column3", "scripts/Applications/ViRIS/meshes/column3.json");
    os.graphics.Managers.Mesh.Create.Mesh("column4", "scripts/Applications/ViRIS/meshes/column4.json");
    os.graphics.Managers.Mesh.Create.Mesh("wall1A", "scripts/Applications/ViRIS/meshes/wall1A.json");
    os.graphics.Managers.Mesh.Create.Mesh("wall1B", "scripts/Applications/ViRIS/meshes/wall1B.json");
    os.graphics.Managers.Mesh.Create.Mesh("wall1C", "scripts/Applications/ViRIS/meshes/wall1C.json");
    os.graphics.Managers.Mesh.Create.Mesh("wall1D", "scripts/Applications/ViRIS/meshes/wall1D.json");
    os.graphics.Managers.Mesh.Create.Mesh("gate1", "scripts/Applications/ViRIS/meshes/NS3DGate1.json");
    os.graphics.Managers.Mesh.Create.Mesh("gate2", "scripts/Applications/ViRIS/meshes/NS3DGate1.json");
    os.graphics.Managers.Mesh.Create.Mesh("turrent", "scripts/Applications/ViRIS/meshes/NS3DTurrent.json");
    
    //Load Textures
    os.graphics.Managers.Texture.Create.Texture("metal", "scripts/Applications/ViRIS/textures/metal_flat.jpg");
    os.graphics.Managers.Texture.Create.Texture("outpost", "scripts/Applications/ViRIS/textures/outpost.jpg");
    os.graphics.Managers.Texture.Create.Texture("robot", "scripts/Applications/ViRIS/textures/robot.jpg");
    os.graphics.Managers.Texture.Create.Texture("robotBox", "scripts/Applications/ViRIS/textures/robotBox.jpg");
    os.graphics.Managers.Texture.Create.Texture("raptor", "scripts/Applications/ViRIS/textures/raptor.jpg");
    os.graphics.Managers.Texture.Create.Texture("column", "scripts/Applications/ViRIS/textures/column.jpg");
    os.graphics.Managers.Texture.Create.Texture("wall1", "scripts/Applications/ViRIS/textures/wall1.jpg");
    os.graphics.Managers.Texture.Create.Texture("wall2", "scripts/Applications/ViRIS/textures/wall2.jpg");
    os.graphics.Managers.Texture.Create.Texture("gate1", "scripts/Applications/ViRIS/textures/NS3DGate1.jpg");
    os.graphics.Managers.Texture.Create.Texture("gate2", "scripts/Applications/ViRIS/textures/NS3DGate2.jpg");
    os.graphics.Managers.Texture.Create.Texture("turrent", "scripts/Applications/ViRIS/textures/NS3DTurrent.jpg");
    
    //Create Outpost
    var outpost = os.graphics.Managers.Entity.Create();
    outpost.Graphics.Add.Mesh("outpost");
    outpost.Graphics.Add.Texture("outpost");
    outpost.Graphics.Set.texture(true);
    outpost.Set.Scale(0.5,0.5,0.5);
    outpost.Set.Position(0,0,300);
    
    models.put("outpost", outpost);
    
    //Create Robot
    var robot = os.graphics.Managers.Entity.Create();
    //robot.Graphics.Add.Mesh("robotBox");
    robot.Graphics.Add.Mesh("robot");
    robot.Graphics.Add.Texture("robot");
    robot.Graphics.Set.texture(true);
    //robot.Graphics.Set.useBlendColor(false);
    //robot.Graphics.Set.blendColor([0.17,0.26,0.40]);
    robot.Set.Scale(1.0,1.0,1.0);
    robot.Set.Position(0,0,300);
    
    models.put("robot", robot);
    
    //Create Raptor
    var raptor = os.graphics.Managers.Entity.Create();
    raptor.Graphics.Add.Mesh("raptor");
    raptor.Graphics.Add.Texture("raptor");
    raptor.Graphics.Set.texture(true);
    raptor.Set.Scale(1.0,1.0,1.0);
    raptor.Set.Position(0,0,300);
    
    models.put("raptor", raptor);
    
    //Create Raptor
    var column1 = os.graphics.Managers.Entity.Create();
    column1.Graphics.Add.Mesh("column1");
    column1.Graphics.Add.Texture("column");
    column1.Graphics.Set.texture(true);
    column1.Set.Scale(1.0,1.0,1.0);
    column1.Set.Position(0,0,300);
    
    models.put("column1", column1);
    
    //Create Gate 1
    var gate1 = os.graphics.Managers.Entity.Create();
    gate1.Graphics.Add.Mesh("gate1");
    gate1.Graphics.Add.Texture("gate1");
    gate1.Graphics.Set.texture(true);
    gate1.Set.Scale(1.0,1.0,1.0);
    gate1.Set.Position(0,0,300);
    
    models.put("gate1", gate1);
    
    //Create Gate 2
    var gate2 = os.graphics.Managers.Entity.Create();
    gate2.Graphics.Add.Mesh("gate2");
    gate2.Graphics.Add.Texture("gate2");
    gate2.Graphics.Set.texture(true);
    gate2.Set.Scale(1.0,1.0,1.0);
    gate2.Set.Position(0,0,300);
    
    models.put("gate2", gate2);
    
    //Create Turrent
    var turrent = os.graphics.Managers.Entity.Create();
    turrent.Graphics.Add.Mesh("turrent");
    turrent.Graphics.Add.Texture("turrent");
    turrent.Graphics.Set.texture(true);
    turrent.Set.Scale(1.0,1.0,1.0);
    turrent.Set.Position(0,0,300);
    
    models.put("turrent", turrent);
    
    
    
    //Create Raptor
    var column2 = os.graphics.Managers.Entity.Create();
    column2.Graphics.Add.Mesh("column2");
    column2.Graphics.Add.Texture("column");
    column2.Graphics.Set.texture(true);
    column2.Set.Scale(1.0,1.0,1.0);
    column2.Set.Position(0,0,300);
    
    models.put("column2", column2);
    
    //Create Raptor
    var column3 = os.graphics.Managers.Entity.Create();
    column3.Graphics.Add.Mesh("column3");
    column3.Graphics.Add.Texture("column");
    column3.Graphics.Set.texture(true);
    column3.Set.Scale(1.0,1.0,1.0);
    column3.Set.Position(0,0,300);
    
    models.put("column3", column3);
    
    //Create Raptor
    var column4 = os.graphics.Managers.Entity.Create();
    column4.Graphics.Add.Mesh("column4");
    column4.Graphics.Add.Texture("column");
    column4.Graphics.Set.texture(true);
    column4.Set.Scale(1.0,1.0,1.0);
    column4.Set.Position(0,0,300);
    
    models.put("column4", column4);
    
    //Create Raptor
    var wall1A = os.graphics.Managers.Entity.Create();
    wall1A.Graphics.Add.Mesh("wall1A");
    wall1A.Graphics.Add.Texture("wall1");
    wall1A.Graphics.Set.texture(true);
    wall1A.Set.Scale(1.0,1.0,1.0);
    wall1A.Set.Position(0,0,300);
    
    models.put("wall1A", wall1A);
    
    //Create Raptor
    var wall1B = os.graphics.Managers.Entity.Create();
    wall1B.Graphics.Add.Mesh("wall1B");
    wall1B.Graphics.Add.Texture("wall1");
    wall1B.Graphics.Set.texture(true);
    wall1B.Set.Scale(1.0,1.0,1.0);
    wall1B.Set.Position(0,0,300);
    
    models.put("wall1B", wall1B);
    
    //Create Raptor
    var wall1C = os.graphics.Managers.Entity.Create();
    wall1C.Graphics.Add.Mesh("wall1C");
    wall1C.Graphics.Add.Texture("wall2");
    wall1C.Graphics.Set.texture(true);
    wall1C.Set.Scale(1.0,1.0,1.0);
    wall1C.Set.Position(0,0,300);
    
    models.put("wall1C", wall1C);
    
    //Create Raptor
    var wall1D = os.graphics.Managers.Entity.Create();
    wall1D.Graphics.Add.Mesh("wall1D");
    wall1D.Graphics.Add.Texture("wall2");
    wall1D.Graphics.Set.texture(true);
    wall1D.Set.Scale(1.0,1.0,1.0);
    wall1D.Set.Position(0,0,300);
    
    models.put("wall1D", wall1D);
    
    //os.graphics.Managers.Camera.Position = vec3.create([0,500,-500]);
    //os.graphics.Managers.Camera.Rotation.pitch = -20;
    os.graphics.Start();
}

ViRISDraw = function(){
    models.value().Graphics.Draw();

}

ViRISUpdate = function(dt){
     Win.Set.statusbarText("FPS: " + (1/dt * 1000).toFixed(3) +", Polys: " + os.graphics.Managers.Mesh.totalPolys + ", Verts: " + os.graphics.Managers.Mesh.totalVerts);

}