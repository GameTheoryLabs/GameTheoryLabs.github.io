
var gl;
var framebuffer;
var texture;
var canvas;

RTTWebGLInit = function(){
    
    var canvas = os.resschmgr.Create.HTMLElement("canvas");
    canvas.html().style.width = "100%";
    canvas.html().style.height = "100%";
    
    document.body.appendChild(canvas.html());
    document.body.style.overflow = "hidden";
    
    os.graphics.Load(false, true, canvas.html());
    
    gl = os.graphics.gl;
    
    //Set Up Control Window
    Win = os.windows.WindowsManager.Create.Window("Render To Texture", "PC");
    Win.Set.position(0,0);
    Win.elements.content.html().style.overflow = "hidden";
    Win.Set.statusbarText("");
    Win.Display.window();
    Win.Set.width(300);
    Win.Set.height(60);
    Win.Set.onMax(os.graphics.OnReset);
    Win.Set.onMin(os.graphics.Pause);
    
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
        else if(String.fromCharCode(e.keyCode) == "R"){     //Straif Down
            RTTRenderImposter();
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
var RTT = function(){
    
    //Set up canvas, window and input controls
    RTTWebGLInit();
    
    //Set global Draw and Update Callbacks
    os.graphics.Set.Callback.Draw(RTTDraw);
    os.graphics.Set.Callback.Update(RTTUpdate);
    
    //Load default mesh and texture
    os.graphics.Managers.Texture.Create.Texture("starhawk", "scripts/jahova/OS/Cores/Graphics/textures/starhawk.jpg");
    os.graphics.Managers.Mesh.Create.Mesh("starhawk", "scripts/jahova/OS/Cores/Graphics/meshes/starhawk.json");
    
    quad = os.graphics.Managers.Mesh.Create.Primitive.Quad("quad");
    quad.Initialize();
    
    //Build RTT buffers and texture
    RTTInitialize();
    
    //Build imposter
    imposter = os.graphics.Managers.Entity.Create();
    imposter.Graphics.Add.Mesh("quad");
    imposter.Graphics.Add.Texture("rtt");
    imposter.Graphics.Set.light(false);
    imposter.Graphics.Set.useBlendColor(false);
    imposter.Graphics.Set.texture(true);
    imposter.Set.Scale(200,200,200);
    imposter.Set.Position(0,200,300);
    
    //Build starhawk
    starhawk = os.graphics.Managers.Entity.Create();
    starhawk.Graphics.Add.Mesh("starhawk");
    starhawk.Graphics.Add.Texture("starhawk");
    starhawk.Graphics.Vectors.Scale.set([0.5,0.5,0.5]);
    starhawk.Set.Position(0,50,100);
    
    os.graphics.Managers.Camera.Position = vec3.create([-50,150,-430]);
    
    //RTTRenderImposter();
    blank = true;
    os.graphics.Start();
    
}

var RTTRenderImposter = function(){
    
    os.graphics.Managers.Camera.CalculateViewMatrix();
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    
    //Set Clear Color (r,g,b,a)
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    
    //Clear Color and Depth Buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    //Set Viewport
    os.graphics.gl.viewport(0,0,512, 512);
    mat4.perspective(45, 1, 0.1, 1000.0, os.graphics.Matrix.Projection);

    //Draw Objects to Texture
    starhawk.yaw = 45;               
                                
    starhawk.Graphics.Draw();
    
    //Reset Framebuffer to default
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
    //Set Clear Color (r,g,b,a)
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    //Reset Viewport
    os.graphics.OnReset();
    
    blank = false;
    test = true;
    
}
var RTTDraw = function(){

    starhawk.Graphics.Draw();
    imposter.Graphics.Draw();
    
}

var RTTUpdate = function(dt){
    //imposter.yaw += 0.05 * dt;
    Win.Set.statusbarText("FPS: " + (1/dt * 1000).toFixed(3) +", Polys: " + os.graphics.Managers.Mesh.totalPolys + ", Verts: " + os.graphics.Managers.Mesh.totalVerts);
    starhawk.yaw += 0.05 * dt;
}

var RTTInitialize = function(){
    
    
    //Create and bind framebuffer
    framebuffer = gl.createFramebuffer();
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    
    framebuffer.width = 512;
    framebuffer.height = 512;
    
    //Create texture
    os.graphics.Managers.Texture.Create.RenderTexture("rtt", framebuffer.width, framebuffer.height);
    texture = os.graphics.Managers.Texture.GetTexture("rtt").texture;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    //Depth Buffer
    var renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, framebuffer.width, framebuffer.height);
    
    //Attach texture and depth buffer to framebuffer
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
    
    //reset back to defaults
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
    
}