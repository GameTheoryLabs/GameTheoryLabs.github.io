
//HTML Elements

//<div id='3d'></div>
//<div id='thumbnail'></div>
//<div id='options'><div>
//<div id='output'><div>

DistWebGLInit = function(){
    
    graphicsElement = os.resschmgr.Create.HTMLElement("div");
    graphicsElement.SetID('image-3d');
    
    graphicsDiv = document.getElementById('image-3d-window');
    
    thumbnailDiv = document.getElementById('thumbnail-window');
    optionsDiv = document.getElementById('properties-window');
    outputDiv = document.getElementById('output');
    
    bioCanvas = os.resschmgr.Create.HTMLElement("canvas");
    bioCanvas.html().style.width = "100%";
    bioCanvas.html().style.height = "100%";

    graphicsDiv.appendChild(bioCanvas.html());

    
    os.graphics.Load(false, false, bioCanvas.html());
    
    gl = os.graphics.gl;
    
    //Load Dynamic Shadow VS and FS
    os.graphics.Managers.Shader.Create.VertexShader("shadow", "scripts/jahova/OS/Cores/Graphics/shaders/shadow.vs");
    os.graphics.Managers.Shader.Create.FragmentShader("shadow", "scripts/jahova/OS/Cores/Graphics/shaders/shadow.fs");
    
    
    dropDown = document.getElementById("dropdown");
    
    dropDown.onchange = function(e){
        win = os.windows.WindowsManager.Windows.get("jahova.window.id." + e.currentTarget.value);
        win.MakeActive();
    }
    
    
    //BuildObjectWindow();
    BuildLightingWindow();
    BuildExponentialDist();
    BuildLogisticDist();
    BuildLogLogisticDist();
    BuildLogNormalDist();
    BuildNormalDist();
    BuildTriangularDist();
    BuildWeibullDist();
    
    
    
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
            //os.graphics.Managers.Camera.MoveForward(10);
            sceneNode.Move.Forward(10);
        }
        else if(String.fromCharCode(e.keyCode) == "S"){     //Backware
            //os.graphics.Managers.Camera.MoveBackward(10);
            sceneNode.Move.Backward(10);
        }
        else if(String.fromCharCode(e.keyCode) == "A"){     //Straif Left
            //os.graphics.Managers.Camera.MoveLeft(10);
            sceneNode.Move.Left(10);
        }
        else if(String.fromCharCode(e.keyCode) == "D"){     //Straif Right
            //os.graphics.Managers.Camera.MoveRight(10);
            sceneNode.Move.Right(10);
        }
        else if(String.fromCharCode(e.keyCode) == "Q"){     //Straif Up
            os.graphics.Managers.Camera.MoveUp(5);
            //sceneNode.Move.Up(10);
        }
        else if(String.fromCharCode(e.keyCode) == "E"){     //Straif Down
            os.graphics.Managers.Camera.MoveDown(10);
            //sceneNode.Move.Down(10);
        }
        else if(String.fromCharCode(e.keyCode) == "R"){     //Straif Down
            UpdateDistribution();
        }
        else if(String.fromCharCode(e.keyCode) == "F"){     //Straif Down
            fullscreen()
        }
        else if(e.keyCode == 27){     //Straif Down
            windowed();
        }
        else if(e.keyCode == 38){     //UP Arrow
            dropDown.selectedIndex--;
            if(dropDown.selectedIndex < 1){dropDown.selectedIndex = 1;}
            (os.windows.WindowsManager.Windows.get("jahova.window.id." + dropDown.value)).MakeActive();
           
        }
        else if(e.keyCode == 40){     //Down Arrow
            dropDown.selectedIndex++;
            if(dropDown.selectedIndex < 0){dropDown.selectedIndex = dropDown.length - 1;}
             (os.windows.WindowsManager.Windows.get("jahova.window.id." + dropDown.value)).MakeActive();
           
        }
        
        mat4.identity(DistData.bar.Graphics.Matrix.Parent.Translate);
        mat4.translate(DistData.bar.Graphics.Matrix.Parent.Translate, sceneNode.Position);
        mat4.multiply(DistData.bar.Graphics.Matrix.Parent.Translate, DistData.bar.Graphics.Matrix.Parent.Rotation, DistData.bar.Graphics.Matrix.Parent.World );
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
        //var cam = os.graphics.Managers.Camera;
        
        var newX = e.clientX;
        var newY = e.clientY;
    
        var deltaX = newX - Input.Mouse.lastX
        DistData.bar.yaw -= deltaX / 10;
        //cam.Rotation.yaw += deltaX / 10;
        
        //if(cam.Rotation.yaw > 360){ cam.Rotation.yaw  -= 360;}
        //else if(cam.Rotation.yaw < 0) { cam.Rotation.yaw += 360; }
        if(DistData.bar.yaw > 360){ DistData.bar.yaw  -= 360;}
        else if(DistData.bar.yaw < 0) { DistData.bar.yaw += 360; }
        
    
        var deltaY = newY - Input.Mouse.lastY;
        //cam.Rotation.pitch += deltaY / 10;
        DistData.bar.Default.pitch -= deltaY / 10;
        
        //if(cam.Rotation.pitch > 360){ cam.Rotation.pitch  -= 360;}
        //else if(cam.Rotation.pitch < 0) { cam.Rotation.pitch += 360; }
        
        if(DistData.bar.Default.pitch > 90){ DistData.bar.Default.pitch  = 90;}
        else if(DistData.bar.Default.pitch < 0) { DistData.bar.Default.pitch = 0; }
    
        //Reset offset
        mat4.identity(DistData.bar.Graphics.Matrix.Parent.Rotation);
        
        //Rotate Scene Node
        mat4.rotateX(DistData.bar.Graphics.Matrix.Parent.Rotation, degToRad(DistData.bar.Default.pitch), DistData.bar.Graphics.Matrix.Parent.Rotation);
        
        //Update Scene World Matrix
        mat4.multiply(DistData.bar.Graphics.Matrix.Parent.Translate, DistData.bar.Graphics.Matrix.Parent.Rotation, DistData.bar.Graphics.Matrix.Parent.World );
        
        Input.Mouse.lastX = newX
        Input.Mouse.lastY = newY;   
    }
    
    
    
    // Setup Event Handlers for User Input
    window.addEventListener("keydown", onKeyDown, false);
    os.graphics.Get.Canvas().addEventListener("mousedown", onMouseDown, false);
    document.addEventListener("mouseup", onMouseUp, false);
    document.addEventListener("mousemove", onMouseMove, false);
    
    sceneNode = os.graphics.Managers.Entity.Create();
    
    vec3.set([0,10,-100],os.graphics.Managers.Camera.Position);
    //os.graphics.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    
    os.graphics.Start();
}


fullscreen = function(){
    
    //Scroll Screen to top left, to hide any overflow
    scrollTo(0,0);
    
    var tn = document.getElementById("thumbnail");
    tn.style.display = "none";
    
    var properties = document.getElementById("properties");
    properties.style.display = "none";
    
    var button = document.getElementById("expand-button");
    button.style.display = "none";
    
    var win = document.getElementById("image-3d-window");
    win.setAttribute("class", "fullscreen");
    win.style.height = window.innerHeight + "px";
    
    document.body.style.overflow = "hidden";
    
    //Resets the graphics projection matrix once animation of screen resize has finished
    setTimeout(os.graphics.OnReset, 500);
    
    //Hide Debug Bar, to make sure its not causing any problems
    os.debugbar.Disable();
}

windowed = function(){
    var tn = document.getElementById("thumbnail");
    tn.style.display = "";
    
    var properties = document.getElementById("properties");
    properties.style.display = "";
    
    var button = document.getElementById("expand-button");
    button.style.display = "";
    
    var win = document.getElementById("image-3d-window");
    win.setAttribute("class", "image-3d-window");
    win.style.height = "";
    
    document.body.style.overflow = "";
    
    //Resets the graphics projection matrix once animation of screen resize has finished
    setTimeout(os.graphics.OnReset, 500);
    
    //Hide Debug Bar, to make sure its not causing any problems
    os.debugbar.Enable();    
}

//
//  Add Entity
//


//
//  WINDOW FUNCTIONS
//
BuildObjectWindow = function(){
    //Set Up Control Window
    Win = os.windows.WindowsManager.Create.Window("Object Properties", "PC");
    //Win.elements.content.html().style.overflow = "hidden";
    Win.Set.statusbarText("");
    Win.Display.window();
    Win.elements.titlebar.buttons.close.html().onclick = function(e){
        DockWindow(os.windows.WindowsManager.Windows.get(e.target.id));    
    }
    
    //Scale Control
    var scaleLabel = os.resschmgr.Create.HTMLElement("label");
    scaleLabel.html().for = "scale";
    scaleLabel.html().innerHTML = "Object Scale&nbsp&nbsp&nbsp&nbsp";
    scaleLabel.AppendTo(Win.elements.content.html());
    var scale = os.resschmgr.Create.HTMLElement("input");
    scale.html().type = "range";
    scale.html().id = "scale";
    scale.html().min = 0.1;
    scale.html().max = 10;
    scale.html().step = 0.1;
    scale.html().value = 1;
    scale.html().onchange = function(e){
        var scale = e.target.value;
        var multi = 1;
        if(mirrorCheckbox.html().checked){
            multi = -1;
        }

        DistData.bar.Set.Scale(multi * scale,scale,scale);
    }
    scale.AppendTo(Win.elements.content.html());
    
    //Mirror Texture
    mirrorLabel = os.resschmgr.Create.HTMLElement("label");
    mirrorLabel.html().for = "mirror";
    mirrorLabel.html().innerHTML = "<br/>Mirror Texture &nbsp &nbsp";
    mirrorLabel.AppendTo(Win.elements.content.html());
    
    mirrorCheckbox = os.resschmgr.Create.HTMLElement("input");
    mirrorCheckbox.html().id = "mirror";
    mirrorCheckbox.html().type = "checkbox";
    mirrorCheckbox.html().checked = true;
    mirrorCheckbox.AppendTo(Win.elements.content.html());
    
    mirrorCheckbox.html().onchange = function(e){
        var scaleValue = scale.html().value;
        var multi = 1;
        if(e.target.checked){multi = -1;}
        
        DistData.bar.Set.Scale(multi * scaleValue,scaleValue,scaleValue);
    }
    
    //Auto Rotate
    rotateLabel = os.resschmgr.Create.HTMLElement("label");
    rotateLabel.html().for = "rotate";
    rotateLabel.html().innerHTML = "<br/>Auto Rotate &nbsp &nbsp";
    rotateLabel.AppendTo(Win.elements.content.html());
    
    rotateCheckbox = os.resschmgr.Create.HTMLElement("input");
    rotateCheckbox.html().id = "rotate";
    rotateCheckbox.html().type = "checkbox";
    rotateCheckbox.html().checked = false;
    rotateCheckbox.AppendTo(Win.elements.content.html());
    
    var rotateSpeedLabel = os.resschmgr.Create.HTMLElement("label");
    rotateSpeedLabel.html().for = "rotateSpeed";
    rotateSpeedLabel.html().innerHTML = "<br/>Rotate Speed&nbsp&nbsp&nbsp&nbsp";
    rotateSpeedLabel.AppendTo(Win.elements.content.html());
    
    rotateSpeed = os.resschmgr.Create.HTMLElement("input");
    rotateSpeed.html().type = "range";
    rotateSpeed.html().id = "rotateSpeed";
    rotateSpeed.html().min = 0.0;
    rotateSpeed.html().max = 2.0;
    rotateSpeed.html().step = 0.001;
    rotateSpeed.html().value = 0.1;

    rotateSpeed.AppendTo(Win.elements.content.html());
    
    
    //Auto Center Model on Import
    autocenterLabel = os.resschmgr.Create.HTMLElement("label");
    autocenterLabel.html().for = "autocenter";
    autocenterLabel.html().innerHTML = "<br/>Auto Center Model on Import&nbsp &nbsp";
    autocenterLabel.AppendTo(Win.elements.content.html());
    
    autocenterCheckbox = os.resschmgr.Create.HTMLElement("input");
    autocenterCheckbox.html().id = "autocenter";
    autocenterCheckbox.html().type = "checkbox";
    autocenterCheckbox.html().checked = true;
    autocenterCheckbox.AppendTo(Win.elements.content.html());
    
    
    //Alpha Blend
    alphaLabel = os.resschmgr.Create.HTMLElement("label");
    alphaLabel.html().for = "alphacheckbox";
    alphaLabel.html().innerHTML = "<br/>Enable Alpha Scale &nbsp &nbsp";
    alphaLabel.AppendTo(Win.elements.content.html());
    
    alphaCheckbox = os.resschmgr.Create.HTMLElement("input");
    alphaCheckbox.html().id = "alphacheckbox";
    alphaCheckbox.html().type = "checkbox";
    alphaCheckbox.html().checked = false;
    alphaCheckbox.html().onchange = function(e){
        if(e.target.checked){
            DistData.bar.Graphics.Set.enableAlpha(true);
        }
        else{
            DistData.bar.Graphics.Set.enableAlpha(false);
        }
    }
    alphaCheckbox.AppendTo(Win.elements.content.html());
    
    
    var alphaScaleLabel = os.resschmgr.Create.HTMLElement("label");
    alphaScaleLabel.html().for = "alpha";
    alphaScaleLabel.html().innerHTML = "<br/>Alpha Value&nbsp&nbsp&nbsp&nbsp";
    alphaScaleLabel.AppendTo(Win.elements.content.html());
    var alpha = os.resschmgr.Create.HTMLElement("input");
    alpha.html().type = "range";
    alpha.html().id = "scale";
    alpha.html().min = 0.0;
    alpha.html().max = 1.0;
    alpha.html().step = 0.01;
    alpha.html().value = 0.5;
    alpha.html().onchange = function(e){
        if(alphaCheckbox.html().checked){
            DistData.bar.Graphics.Set.alphaValue(e.target.value);
        }
    }
    alpha.AppendTo(Win.elements.content.html());
    
    DockWindow(Win);
     
}

BuildLightingWindow = function(){
     Win2 = os.windows.WindowsManager.Create.Window("Lighting Properties", "PC");
    Win2.elements.content.html().style.overflow = "hidden";
    //Win2.elements.content.html().innerHTML= "Options Window 2";
    Win2.Set.statusbarText("");
    Win2.Display.window();
    Win2.elements.titlebar.buttons.close.html().onclick = function(e){
        DockWindow(os.windows.WindowsManager.Windows.get(e.target.id));    
    }
    //Add Lighting GUI controls

    //Ambinet Light Control
    var ambientLabel = os.resschmgr.Create.HTMLElement("label");
    ambientLabel.html().for = "ambientLight";
    ambientLabel.html().innerHTML = "Ambient Light&nbsp&nbsp&nbsp&nbsp";
    ambientLabel.AppendTo(Win2.elements.content.html());
    var ambientLightSlider = os.resschmgr.Create.HTMLElement("input");
    ambientLightSlider.html().type = "range";
    ambientLightSlider.html().id = "ambientLight";
    ambientLightSlider.html().min = 0;
    ambientLightSlider.html().max = 1;
    ambientLightSlider.html().step = 0.1;
    ambientLightSlider.html().value = 0.5;
    ambientLightSlider.html().onchange = function(e){
        var light = e.target.value;
        DistData.bar.Graphics.Set.ambientColor([light, light, light]);
    }
    ambientLightSlider.AppendTo(Win2.elements.content.html());
    
    //Specular Highlight Control
    var specularEnableLabel = os.resschmgr.Create.HTMLElement("label");
    specularEnableLabel.html().for = "specularLightEnable";
    specularEnableLabel.html().innerHTML = "<br/>Enable Specular Highlights &nbsp &nbsp";
    specularEnableLabel.AppendTo(Win2.elements.content.html());
    
    specularLightEnableCheckbox = os.resschmgr.Create.HTMLElement("input");
    specularLightEnableCheckbox.html().id = "specularLightEnable";
    specularLightEnableCheckbox.html().type = "checkbox";
    specularLightEnableCheckbox.html().checked = false;
    specularLightEnableCheckbox.html().onchange = function(e){
        DistData.bar.Graphics.Set.specular(e.target.checked);
    }
    specularLightEnableCheckbox.AppendTo(Win2.elements.content.html());
    
    var shininessLabel = os.resschmgr.Create.HTMLElement("label");
    shininessLabel.html().for = "shininess";
    shininessLabel.html().innerHTML = "<br/>Material Shininess&nbsp&nbsp";
    shininessLabel.AppendTo(Win2.elements.content.html());
    var shininessSlider = os.resschmgr.Create.HTMLElement("input");
    shininessSlider.html().type = "range";
    shininessSlider.html().id = "shininess";
    shininessSlider.html().min = 1.0;
    shininessSlider.html().max = 30;
    shininessSlider.html().step = 0.1;
    shininessSlider.html().value = 1.0;
    shininessSlider.html().onchange = function(e){
        var shine = e.target.value;
        DistData.bar.Graphics.Set.shininess(shine);
    }
    shininessSlider.AppendTo(Win2.elements.content.html());
    
    DockWindow(Win2);
}
DockWindow = function(win){

    win.Set.position(0,0);
    win.Set.width(358);
    win.Set.height(228);
    win.Hide.menubar();
    win.Hide.titlebar();
    win.Hide.statusbar();
    win.elements.window.Class.Remove("pcWindow");
    win.elements.window.Class.Add("pcWindow-NoShadow");
    document.body.removeChild(win.elements.window.html());
    optionsDiv.appendChild(win.elements.window.html());
    
    var idString = win.Get.id();
    idString = idString.split(".");
    
    var opt = document.createElement("option");
    opt.value = idString[idString.length - 1];
    opt.innerHTML = win.Get.title();
    
    dropDown.add(opt);
    
    dropDown.selectedIndex = opt.index;
    
}

UnDockWindow = function(e){
    var win = win = os.windows.WindowsManager.Windows.get("jahova.window.id." + dropDown[dropDown.selectedIndex].value);
    
    win.Set.position(100,100);
    win.Set.width(358);
    win.Set.height(228);
    win.Display.titlebar();
    win.Display.statusbar();
    win.elements.window.html().style.position = "absolute";
    win.elements.window.Class.Remove("pcWindow-NoShadow");
    win.elements.window.Class.Add("pcWindow");
    win.MakeActive();
    
    optionsDiv.removeChild(win.elements.window.html());
    document.body.appendChild(win.elements.window.html());

    dropDown.remove(dropDown[dropDown.selectedIndex]);
}

UpdateDistribution = function(e){
    var win = os.windows.WindowsManager.Windows.get("jahova.window.id." + dropDown[dropDown.selectedIndex].value);
    win.Update();
}


//
//  DISTRIBUTION WINDOWS
//
BuildUniformDist = function(){
    //Set Up Control Window
    var Win = os.windows.WindowsManager.Create.Window("Uniform Distribution", "PC");
    //Win.elements.content.html().style.overflow = "hidden";
    Win.Set.statusbarText("");
    Win.Display.window();
    
    //Number of Bins
    var numOfBinsLabel = os.resschmgr.Create.HTMLElement("label");
    numOfBinsLabel.html().for = "numOfBins";
    numOfBinsLabel.html().innerHTML = "<br/>Number Of Bins: &nbsp &nbsp";
    numOfBinsLabel.AppendTo(Win.elements.content.html());
    
    var numOfBinsTextbox = os.resschmgr.Create.HTMLElement("input");
    numOfBinsTextbox.html().id = "numOfBins";
    numOfBinsTextbox.html().type = "text";
    numOfBinsTextbox.html().size = 3;
    numOfBinsTextbox.html().value = "20";
    numOfBinsTextbox.html().style.resize = "none";
    numOfBinsTextbox.AppendTo(Win.elements.content.html());
    
    //Number of Points
    var numOfPointsLabel = os.resschmgr.Create.HTMLElement("label");
    numOfPointsLabel.html().for = "numOfPoints";
    numOfPointsLabel.html().innerHTML = "<br/>Number Of Points: &nbsp";
    numOfPointsLabel.AppendTo(Win.elements.content.html());
    
    var numOfPointsTextbox = os.resschmgr.Create.HTMLElement("input");
    numOfPointsTextbox.html().id = "numOfPoints";
    numOfPointsTextbox.html().type = "text";
    numOfPointsTextbox.html().size = 3;
    numOfPointsTextbox.html().value = "1000";
    numOfPointsTextbox.html().style.resize = "none";
    numOfPointsTextbox.AppendTo(Win.elements.content.html());
    
    //Auto Range
    var autoRangeLabel = os.resschmgr.Create.HTMLElement("label");
    autoRangeLabel.html().for = "autoRange";
    autoRangeLabel.html().innerHTML = "<br/>Auto Range: &nbsp &nbsp";
    autoRangeLabel.AppendTo(Win.elements.content.html());
    
    var autoRangeCheckbox = os.resschmgr.Create.HTMLElement("input");
    autoRangeCheckbox.html().id = "autoRange";
    autoRangeCheckbox.html().type = "checkbox";
    autoRangeCheckbox.html().checked = true;
    autoRangeCheckbox.AppendTo(Win.elements.content.html());
    
    Win.Update = function(){
        DistData.bins = Number(numOfBinsTextbox.html().value);
        DistData.numOfPoints = Number(numOfPointsTextbox.html().value);
        DistData.data = [];
        DistData.height = [];
        DistData.sum = 0;
        DistData.avg = 0;
        DistData.std = 0;
        DistData.binWidth = 0;
        DistData.max = 0;
        DistData.min = 0;
        DistData.maxHeight = 1;
        
        for(var i = 0; i < DistData.numOfPoints; i++){
            //Generate random value
            var temp = Variates.Uniform(0,1);//DistData.MT.random();
            
            //Test for max or min
            if(temp > DistData.max){DistData.max = temp;}
            if(temp < DistData.min){DistData.min = temp;}
            
            //Accumlate Sum
            DistData.sum += temp;
            
            //Save Data point
            DistData.data.push(temp);
            
        }
        
        //Calculate Average
        DistData.avg = DistData.sum / DistData.numOfPoints;
        
        //Calculate Bin Width
        DistData.binWidth = (DistData.max - DistData.min) / DistData.bins;
        
        //Initialize Bin frequencies
        for(var i = 0; i < DistData.bins; i++){
            DistData.height.push(0);
        }
        
        //Calculate Bin Frequencies
        for(var i = 0; i < DistData.data.length; i++){
            var j = 0;
            while(!(DistData.data[i] < (DistData.min + (DistData.binWidth * j)))){
                j++;
            }
            
            //Accumalte frequency
            DistData.height[j]++;
            
            //Save the max frequency
            if(DistData.height[j] > DistData.maxHeight){ DistData.maxHeight = DistData.height[j];}
        }
        
        //Normalize Frequencies for Graphing
        for(var i = 0; i < DistData.height.length; i++){
            DistData.height[i] = 20 * (DistData.height[i] / DistData.maxHeight);
        }
    }
    
    DockWindow(Win);
    
    Win.Update();
}

BuildExponentialDist = function(){
    //Set Up Control Window
    var Win = os.windows.WindowsManager.Create.Window("Exponential Distribution", "PC");
    //Win.elements.content.html().style.overflow = "hidden";
    Win.Set.statusbarText("");
    Win.Display.window();
    
    //Number of Bins
    var numOfBinsLabel = os.resschmgr.Create.HTMLElement("label");
    numOfBinsLabel.html().for = "numOfBins";
    numOfBinsLabel.html().innerHTML = "<br/>Number Of Bins: &nbsp &nbsp";
    numOfBinsLabel.AppendTo(Win.elements.content.html());
    
    var numOfBinsTextbox = os.resschmgr.Create.HTMLElement("input");
    numOfBinsTextbox.html().id = "numOfBins";
    numOfBinsTextbox.html().type = "text";
    numOfBinsTextbox.html().size = 3;
    numOfBinsTextbox.html().value = "20";
    numOfBinsTextbox.html().style.resize = "none";
    numOfBinsTextbox.AppendTo(Win.elements.content.html());
    
    //Number of Points
    var numOfPointsLabel = os.resschmgr.Create.HTMLElement("label");
    numOfPointsLabel.html().for = "numOfPoints";
    numOfPointsLabel.html().innerHTML = "<br/>Number Of Points: &nbsp";
    numOfPointsLabel.AppendTo(Win.elements.content.html());
    
    var numOfPointsTextbox = os.resschmgr.Create.HTMLElement("input");
    numOfPointsTextbox.html().id = "numOfPoints";
    numOfPointsTextbox.html().type = "text";
    numOfPointsTextbox.html().size = 3;
    numOfPointsTextbox.html().value = "1000";
    numOfPointsTextbox.html().style.resize = "none";
    numOfPointsTextbox.AppendTo(Win.elements.content.html());
    
    //Auto Range
    var autoRangeLabel = os.resschmgr.Create.HTMLElement("label");
    autoRangeLabel.html().for = "autoRange";
    autoRangeLabel.html().innerHTML = "<br/>Auto Range: &nbsp &nbsp";
    autoRangeLabel.AppendTo(Win.elements.content.html());
    
    var autoRangeCheckbox = os.resschmgr.Create.HTMLElement("input");
    autoRangeCheckbox.html().id = "autoRange";
    autoRangeCheckbox.html().type = "checkbox";
    autoRangeCheckbox.html().checked = true;
    autoRangeCheckbox.AppendTo(Win.elements.content.html());
    
    //Beta
    var betaLabel = os.resschmgr.Create.HTMLElement("label");
    betaLabel.html().for = "beta";
    betaLabel.html().innerHTML = "<br/>&#946: &nbsp";
    betaLabel.AppendTo(Win.elements.content.html());
    
    var betaTextbox = os.resschmgr.Create.HTMLElement("input");
    betaTextbox.html().id = "beta";
    betaTextbox.html().type = "text";
    betaTextbox.html().size = 3;
    betaTextbox.html().value = "0.25";
    betaTextbox.html().style.resize = "none";
    betaTextbox.AppendTo(Win.elements.content.html());
    
    
    Win.Update = function(){
        DistData.bins = Number(numOfBinsTextbox.html().value);
        DistData.numOfPoints = Number(numOfPointsTextbox.html().value);
        DistData.data = [];
        DistData.height = [];
        DistData.sum = 0;
        DistData.avg = 0;
        DistData.std = 0;
        DistData.binWidth = 0;
        DistData.max = 0;
        DistData.min = 0;
        DistData.maxHeight = 1;
        
        //Distribution Specific Variables
        var beta = Number(betaTextbox.html().value);
        var invBeta = beta ? 1/beta : 1;
        
        for(var i = 0; i < DistData.numOfPoints; i++){
            //Generate random value
            var temp = Variates.Exponential(beta);//invBeta * Math.exp(-1 * invBeta * DistData.MT.random());
            
            //Test for max or min
            if(temp > DistData.max){DistData.max = temp;}
            if(temp < DistData.min){DistData.min = temp;}
            
            //Accumlate Sum
            DistData.sum += temp;
            
            //Save Data point
            DistData.data.push(temp);
            
        }
        
        //Calculate Average
        DistData.avg = DistData.sum / DistData.numOfPoints;
        
        //Calculate Bin Width
        DistData.binWidth = (DistData.max - DistData.min) / DistData.bins;
        
        //Initialize Bin frequencies
        for(var i = 0; i < DistData.bins; i++){
            DistData.height.push(0);
        }
        
        //Calculate Bin Frequencies
        for(var i = 0; i < DistData.data.length; i++){
            var j = 0;
            while(!(DistData.data[i] < (DistData.min + (DistData.binWidth * j)))){
                j++;
            }
            
            //Accumalte frequency
            DistData.height[j]++;
            
            //Save the max frequency
            if(DistData.height[j] > DistData.maxHeight){ DistData.maxHeight = DistData.height[j];}
        }
        
        //Normalize Frequencies for Graphing
        for(var i = 0; i < DistData.height.length; i++){
            DistData.height[i] = 20 * (DistData.height[i] / DistData.maxHeight);
        }
    }
    DockWindow(Win);
}

BuildWeibullDist = function(){
    //Set Up Control Window
    var Win = os.windows.WindowsManager.Create.Window("Weibull Distribution", "PC");
    //Win.elements.content.html().style.overflow = "hidden";
    Win.Set.statusbarText("");
    Win.Display.window();
    
    //Number of Bins
    var numOfBinsLabel = os.resschmgr.Create.HTMLElement("label");
    numOfBinsLabel.html().for = "numOfBins";
    numOfBinsLabel.html().innerHTML = "<br/>Number Of Bins: &nbsp &nbsp";
    numOfBinsLabel.AppendTo(Win.elements.content.html());
    
    var numOfBinsTextbox = os.resschmgr.Create.HTMLElement("input");
    numOfBinsTextbox.html().id = "numOfBins";
    numOfBinsTextbox.html().type = "text";
    numOfBinsTextbox.html().size = 3;
    numOfBinsTextbox.html().value = "20";
    numOfBinsTextbox.html().style.resize = "none";
    numOfBinsTextbox.AppendTo(Win.elements.content.html());
    
    //Number of Points
    var numOfPointsLabel = os.resschmgr.Create.HTMLElement("label");
    numOfPointsLabel.html().for = "numOfPoints";
    numOfPointsLabel.html().innerHTML = "<br/>Number Of Points: &nbsp";
    numOfPointsLabel.AppendTo(Win.elements.content.html());
    
    var numOfPointsTextbox = os.resschmgr.Create.HTMLElement("input");
    numOfPointsTextbox.html().id = "numOfPoints";
    numOfPointsTextbox.html().type = "text";
    numOfPointsTextbox.html().size = 3;
    numOfPointsTextbox.html().value = "1000";
    numOfPointsTextbox.html().style.resize = "none";
    numOfPointsTextbox.AppendTo(Win.elements.content.html());
    
    //Auto Range
    var autoRangeLabel = os.resschmgr.Create.HTMLElement("label");
    autoRangeLabel.html().for = "autoRange";
    autoRangeLabel.html().innerHTML = "<br/>Auto Range: &nbsp &nbsp";
    autoRangeLabel.AppendTo(Win.elements.content.html());
    
    var autoRangeCheckbox = os.resschmgr.Create.HTMLElement("input");
    autoRangeCheckbox.html().id = "autoRange";
    autoRangeCheckbox.html().type = "checkbox";
    autoRangeCheckbox.html().checked = true;
    autoRangeCheckbox.AppendTo(Win.elements.content.html());
    
    //A
    var aLabel = os.resschmgr.Create.HTMLElement("label");
    aLabel.html().for = "a";
    aLabel.html().innerHTML = "<br/>a: &nbsp";
    aLabel.AppendTo(Win.elements.content.html());
    
    var aTextbox = os.resschmgr.Create.HTMLElement("input");
    aTextbox.html().id = "a";
    aTextbox.html().type = "text";
    aTextbox.html().size = 3;
    aTextbox.html().value = "0.0";
    aTextbox.html().style.resize = "none";
    aTextbox.AppendTo(Win.elements.content.html());
    
    //B
    var bLabel = os.resschmgr.Create.HTMLElement("label");
    bLabel.html().for = "b";
    bLabel.html().innerHTML = "<br/>b: &nbsp";
    bLabel.AppendTo(Win.elements.content.html());
    
    var bTextbox = os.resschmgr.Create.HTMLElement("input");
    bTextbox.html().id = "b";
    bTextbox.html().type = "text";
    bTextbox.html().size = 3;
    bTextbox.html().value = "1.0";
    bTextbox.html().style.resize = "none";
    bTextbox.AppendTo(Win.elements.content.html());
    
    //C
    var cLabel = os.resschmgr.Create.HTMLElement("label");
    cLabel.html().for = "c";
    cLabel.html().innerHTML = "<br/>c: &nbsp";
    cLabel.AppendTo(Win.elements.content.html());
    
    var cTextbox = os.resschmgr.Create.HTMLElement("input");
    cTextbox.html().id = "c";
    cTextbox.html().type = "text";
    cTextbox.html().size = 3;
    cTextbox.html().value = "3.0";
    cTextbox.html().style.resize = "none";
    cTextbox.AppendTo(Win.elements.content.html());
    
    
    Win.Update = function(){
        DistData.bins = Number(numOfBinsTextbox.html().value);
        DistData.numOfPoints = Number(numOfPointsTextbox.html().value);
        DistData.data = [];
        DistData.height = [];
        DistData.sum = 0;
        DistData.avg = 0;
        DistData.std = 0;
        DistData.binWidth = 0;
        DistData.max = 0;
        DistData.min = 0;
        DistData.maxHeight = 1;
        
        //Distribution Specific Variables
        var a = Number(aTextbox.html().value);
        var b = Number(bTextbox.html().value) ? Number(bTextbox.html().value) : 1;
        var c = Number(cTextbox.html().value) ? Number(cTextbox.html().value) : 1;
        var invC = c ? 1/c : 1;
        
        for(var i = 0; i < DistData.numOfPoints; i++){
            //Generate random value
            var temp = Variates.Weibull(a,b,c); //a + b * Math.pow(-1 * Math.log(DistData.MT.random()), invC);
            
            //Test for max or min
            if(temp > DistData.max){DistData.max = temp;}
            if(temp < DistData.min){DistData.min = temp;}
            
            //Accumlate Sum
            DistData.sum += temp;
            
            //Save Data point
            DistData.data.push(temp);
            
        }
        
        //Calculate Average
        DistData.avg = DistData.sum / DistData.numOfPoints;
        
        //Calculate Bin Width
        DistData.binWidth = (DistData.max - DistData.min) / DistData.bins;
        
        //Initialize Bin frequencies
        for(var i = 0; i < DistData.bins; i++){
            DistData.height.push(0);
        }
        
        //Calculate Bin Frequencies
        for(var i = 0; i < DistData.data.length; i++){
            var j = 0;
            while(!(DistData.data[i] < (DistData.min + (DistData.binWidth * j)))){
                j++;
            }
            
            //Accumalte frequency
            DistData.height[j]++;
            
            //Save the max frequency
            if(DistData.height[j] > DistData.maxHeight){ DistData.maxHeight = DistData.height[j];}
        }
        
        //Normalize Frequencies for Graphing
        for(var i = 0; i < DistData.height.length; i++){
            DistData.height[i] = 20 * (DistData.height[i] / DistData.maxHeight);
        }
    }
    DockWindow(Win);
}

BuildTriangularDist = function(){
    //Set Up Control Window
    var Win = os.windows.WindowsManager.Create.Window("Triangle Distribution", "PC");
    //Win.elements.content.html().style.overflow = "hidden";
    Win.Set.statusbarText("");
    Win.Display.window();
    
    //Number of Bins
    var numOfBinsLabel = os.resschmgr.Create.HTMLElement("label");
    numOfBinsLabel.html().for = "numOfBins";
    numOfBinsLabel.html().innerHTML = "<br/>Number Of Bins: &nbsp &nbsp";
    numOfBinsLabel.AppendTo(Win.elements.content.html());
    
    var numOfBinsTextbox = os.resschmgr.Create.HTMLElement("input");
    numOfBinsTextbox.html().id = "numOfBins";
    numOfBinsTextbox.html().type = "text";
    numOfBinsTextbox.html().size = 3;
    numOfBinsTextbox.html().value = "20";
    numOfBinsTextbox.html().style.resize = "none";
    numOfBinsTextbox.AppendTo(Win.elements.content.html());
    
    //Number of Points
    var numOfPointsLabel = os.resschmgr.Create.HTMLElement("label");
    numOfPointsLabel.html().for = "numOfPoints";
    numOfPointsLabel.html().innerHTML = "<br/>Number Of Points: &nbsp";
    numOfPointsLabel.AppendTo(Win.elements.content.html());
    
    var numOfPointsTextbox = os.resschmgr.Create.HTMLElement("input");
    numOfPointsTextbox.html().id = "numOfPoints";
    numOfPointsTextbox.html().type = "text";
    numOfPointsTextbox.html().size = 3;
    numOfPointsTextbox.html().value = "1000";
    numOfPointsTextbox.html().style.resize = "none";
    numOfPointsTextbox.AppendTo(Win.elements.content.html());
    
    //Auto Range
    var autoRangeLabel = os.resschmgr.Create.HTMLElement("label");
    autoRangeLabel.html().for = "autoRange";
    autoRangeLabel.html().innerHTML = "<br/>Auto Range: &nbsp &nbsp";
    autoRangeLabel.AppendTo(Win.elements.content.html());
    
    var autoRangeCheckbox = os.resschmgr.Create.HTMLElement("input");
    autoRangeCheckbox.html().id = "autoRange";
    autoRangeCheckbox.html().type = "checkbox";
    autoRangeCheckbox.html().checked = true;
    autoRangeCheckbox.AppendTo(Win.elements.content.html());
    
    //x Min
    var aLabel = os.resschmgr.Create.HTMLElement("label");
    aLabel.html().for = "a";
    aLabel.html().innerHTML = "<br/>X Min: &nbsp";
    aLabel.AppendTo(Win.elements.content.html());
    
    var aTextbox = os.resschmgr.Create.HTMLElement("input");
    aTextbox.html().id = "a";
    aTextbox.html().type = "text";
    aTextbox.html().size = 3;
    aTextbox.html().value = "0.0";
    aTextbox.html().style.resize = "none";
    aTextbox.AppendTo(Win.elements.content.html());
    
    //X Max
    var bLabel = os.resschmgr.Create.HTMLElement("label");
    bLabel.html().for = "b";
    bLabel.html().innerHTML = "<br/>X Max: &nbsp";
    bLabel.AppendTo(Win.elements.content.html());
    
    var bTextbox = os.resschmgr.Create.HTMLElement("input");
    bTextbox.html().id = "b";
    bTextbox.html().type = "text";
    bTextbox.html().size = 3;
    bTextbox.html().value = "1.0";
    bTextbox.html().style.resize = "none";
    bTextbox.AppendTo(Win.elements.content.html());
    
    //C
    var cLabel = os.resschmgr.Create.HTMLElement("label");
    cLabel.html().for = "c";
    cLabel.html().innerHTML = "<br/>c: &nbsp";
    cLabel.AppendTo(Win.elements.content.html());
    
    var cTextbox = os.resschmgr.Create.HTMLElement("input");
    cTextbox.html().id = "c";
    cTextbox.html().type = "text";
    cTextbox.html().size = 3;
    cTextbox.html().value = "0.5";
    cTextbox.html().style.resize = "none";
    cTextbox.AppendTo(Win.elements.content.html());
    
    
    Win.Update = function(){
        DistData.bins = Number(numOfBinsTextbox.html().value);
        DistData.numOfPoints = Number(numOfPointsTextbox.html().value);
        DistData.data = [];
        DistData.height = [];
        DistData.sum = 0;
        DistData.avg = 0;
        DistData.std = 0;
        DistData.binWidth = 0;
        DistData.max = 0;
        DistData.min = 0;
        DistData.maxHeight = 1;
        
        //Distribution Specific Variables
        var xMin = Number(aTextbox.html().value);
        var xMax = Number(bTextbox.html().value) ;
        var c = Number(cTextbox.html().value);
        
        var test = true;
        if(!(xMin < xMax && xMin <= c && c <= xMax )){
                alert("Improper Inputs");
                test = false;
        }
            
        for(var i = 0; i < DistData.numOfPoints; i++){
            var temp = 1;
            
            //Generate random value
            
            if(test){                
                temp = Variates.Triangular(xMin, xMax, c);
            }
            
            //Test for max or min
            if(temp > DistData.max){DistData.max = temp;}
            if(temp < DistData.min){DistData.min = temp;}
            
            //Accumlate Sum
            DistData.sum += temp;
            
            //Save Data point
            DistData.data.push(temp);
            
        }
        
        //Calculate Average
        DistData.avg = DistData.sum / DistData.numOfPoints;
        
        //Calculate Bin Width
        DistData.binWidth = (DistData.max - DistData.min) / DistData.bins;
        
        //Initialize Bin frequencies
        for(var i = 0; i < DistData.bins; i++){
            DistData.height.push(0);
        }
        
        //Calculate Bin Frequencies
        for(var i = 0; i < DistData.data.length; i++){
            var j = 0;
            while(!(DistData.data[i] < (DistData.min + (DistData.binWidth * j)))){
                j++;
            }
            
            //Accumalte frequency
            DistData.height[j]++;
            
            //Save the max frequency
            if(DistData.height[j] > DistData.maxHeight){ DistData.maxHeight = DistData.height[j];}
        }
        
        //Normalize Frequencies for Graphing
        for(var i = 0; i < DistData.height.length; i++){
            DistData.height[i] = 20 * (DistData.height[i] / DistData.maxHeight);
        }
    }
    DockWindow(Win);
}

BuildLogLogisticDist = function(){
    //Set Up Control Window
    var Win = os.windows.WindowsManager.Create.Window("Log Logistic Distribution", "PC");
    //Win.elements.content.html().style.overflow = "hidden";
    Win.Set.statusbarText("");
    Win.Display.window();
    
    //Number of Bins
    var numOfBinsLabel = os.resschmgr.Create.HTMLElement("label");
    numOfBinsLabel.html().for = "numOfBins";
    numOfBinsLabel.html().innerHTML = "<br/>Number Of Bins: &nbsp &nbsp";
    numOfBinsLabel.AppendTo(Win.elements.content.html());
    
    var numOfBinsTextbox = os.resschmgr.Create.HTMLElement("input");
    numOfBinsTextbox.html().id = "numOfBins";
    numOfBinsTextbox.html().type = "text";
    numOfBinsTextbox.html().size = 3;
    numOfBinsTextbox.html().value = "20";
    numOfBinsTextbox.html().style.resize = "none";
    numOfBinsTextbox.AppendTo(Win.elements.content.html());
    
    //Number of Points
    var numOfPointsLabel = os.resschmgr.Create.HTMLElement("label");
    numOfPointsLabel.html().for = "numOfPoints";
    numOfPointsLabel.html().innerHTML = "<br/>Number Of Points: &nbsp";
    numOfPointsLabel.AppendTo(Win.elements.content.html());
    
    var numOfPointsTextbox = os.resschmgr.Create.HTMLElement("input");
    numOfPointsTextbox.html().id = "numOfPoints";
    numOfPointsTextbox.html().type = "text";
    numOfPointsTextbox.html().size = 3;
    numOfPointsTextbox.html().value = "1000";
    numOfPointsTextbox.html().style.resize = "none";
    numOfPointsTextbox.AppendTo(Win.elements.content.html());
    
    //Auto Range
    var autoRangeLabel = os.resschmgr.Create.HTMLElement("label");
    autoRangeLabel.html().for = "autoRange";
    autoRangeLabel.html().innerHTML = "<br/>Auto Range: &nbsp &nbsp";
    autoRangeLabel.AppendTo(Win.elements.content.html());
    
    var autoRangeCheckbox = os.resschmgr.Create.HTMLElement("input");
    autoRangeCheckbox.html().id = "autoRange";
    autoRangeCheckbox.html().type = "checkbox";
    autoRangeCheckbox.html().checked = true;
    autoRangeCheckbox.AppendTo(Win.elements.content.html());
    
    //Alpha
    var alphaLabel = os.resschmgr.Create.HTMLElement("label");
    alphaLabel.html().for = "alpha";
    alphaLabel.html().innerHTML = "<br/>&#945: &nbsp";
    alphaLabel.AppendTo(Win.elements.content.html());
    
    var alphaTextbox = os.resschmgr.Create.HTMLElement("input");
    alphaTextbox.html().id = "alpha";
    alphaTextbox.html().type = "text";
    alphaTextbox.html().size = 3;
    alphaTextbox.html().value = "1.0";
    alphaTextbox.html().style.resize = "none";
    alphaTextbox.AppendTo(Win.elements.content.html());
    
    //Beta
    var betaLabel = os.resschmgr.Create.HTMLElement("label");
    betaLabel.html().for = "beta";
    betaLabel.html().innerHTML = "<br/>&#946: &nbsp";
    betaLabel.AppendTo(Win.elements.content.html());
    
    var betaTextbox = os.resschmgr.Create.HTMLElement("input");
    betaTextbox.html().id = "beta";
    betaTextbox.html().type = "text";
    betaTextbox.html().size = 3;
    betaTextbox.html().value = "8";
    betaTextbox.html().style.resize = "none";
    betaTextbox.AppendTo(Win.elements.content.html());
    
    
    Win.Update = function(){
        DistData.bins = Number(numOfBinsTextbox.html().value);
        DistData.numOfPoints = Number(numOfPointsTextbox.html().value);
        DistData.data = [];
        DistData.height = [];
        DistData.sum = 0;
        DistData.avg = 0;
        DistData.std = 0;
        DistData.binWidth = 0;
        DistData.max = 0;
        DistData.min = 0;
        DistData.maxHeight = 1;
        
        //Distribution Specific Variables
        var alpha = Number(alphaTextbox.html().value);
        var invAlpha = alpha ? 1/alpha : 1;
        
        var beta = Number(betaTextbox.html().value);
        
        var test = true;
        
        if(!(alpha > 0 && beta > 0)){
            alert("Incorrect Inputs");
            test = false;
        }
        
        for(var i = 0; i < DistData.numOfPoints; i++){
            //Generate random value
            var temp = 1;
            if(test){
                //var x = DistData.MT.random();
                temp = Variates.LogLogistic(alpha, beta);//( (beta * invAlpha) * Math.pow(x*invAlpha, beta - 1)) / ((1 + Math.pow(x*invAlpha, beta)) * (1 + Math.pow(x*invAlpha, beta)))
            }
            
            //Test for max or min
            if(temp > DistData.max){DistData.max = temp;}
            if(temp < DistData.min){DistData.min = temp;}
            
            //Accumlate Sum
            DistData.sum += temp;
            
            //Save Data point
            DistData.data.push(temp);
            
        }
        
        //Calculate Average
        DistData.avg = DistData.sum / DistData.numOfPoints;
        
        //Calculate Bin Width
        DistData.binWidth = (DistData.max - DistData.min) / DistData.bins;
        
        //Initialize Bin frequencies
        for(var i = 0; i < DistData.bins; i++){
            DistData.height.push(0);
        }
        
        //Calculate Bin Frequencies
        for(var i = 0; i < DistData.data.length; i++){
            var j = 0;
            while(!(DistData.data[i] < (DistData.min + (DistData.binWidth * j)))){
                j++;
            }
            
            //Accumalte frequency
            DistData.height[j]++;
            
            //Save the max frequency
            if(DistData.height[j] > DistData.maxHeight){ DistData.maxHeight = DistData.height[j];}
        }
        
        //Normalize Frequencies for Graphing
        for(var i = 0; i < DistData.height.length; i++){
            DistData.height[i] = 20 * (DistData.height[i] / DistData.maxHeight);
        }
    }
    DockWindow(Win);
}


BuildLogisticDist = function(){
    //Set Up Control Window
    var Win = os.windows.WindowsManager.Create.Window("Logistic Distribution", "PC");
    //Win.elements.content.html().style.overflow = "hidden";
    Win.Set.statusbarText("");
    Win.Display.window();
    
    //Number of Bins
    var numOfBinsLabel = os.resschmgr.Create.HTMLElement("label");
    numOfBinsLabel.html().for = "numOfBins";
    numOfBinsLabel.html().innerHTML = "<br/>Number Of Bins: &nbsp &nbsp";
    numOfBinsLabel.AppendTo(Win.elements.content.html());
    
    var numOfBinsTextbox = os.resschmgr.Create.HTMLElement("input");
    numOfBinsTextbox.html().id = "numOfBins";
    numOfBinsTextbox.html().type = "text";
    numOfBinsTextbox.html().size = 3;
    numOfBinsTextbox.html().value = "20";
    numOfBinsTextbox.html().style.resize = "none";
    numOfBinsTextbox.AppendTo(Win.elements.content.html());
    
    //Number of Points
    var numOfPointsLabel = os.resschmgr.Create.HTMLElement("label");
    numOfPointsLabel.html().for = "numOfPoints";
    numOfPointsLabel.html().innerHTML = "<br/>Number Of Points: &nbsp";
    numOfPointsLabel.AppendTo(Win.elements.content.html());
    
    var numOfPointsTextbox = os.resschmgr.Create.HTMLElement("input");
    numOfPointsTextbox.html().id = "numOfPoints";
    numOfPointsTextbox.html().type = "text";
    numOfPointsTextbox.html().size = 3;
    numOfPointsTextbox.html().value = "1000";
    numOfPointsTextbox.html().style.resize = "none";
    numOfPointsTextbox.AppendTo(Win.elements.content.html());
    
    //Auto Range
    var autoRangeLabel = os.resschmgr.Create.HTMLElement("label");
    autoRangeLabel.html().for = "autoRange";
    autoRangeLabel.html().innerHTML = "<br/>Auto Range: &nbsp &nbsp";
    autoRangeLabel.AppendTo(Win.elements.content.html());
    
    var autoRangeCheckbox = os.resschmgr.Create.HTMLElement("input");
    autoRangeCheckbox.html().id = "autoRange";
    autoRangeCheckbox.html().type = "checkbox";
    autoRangeCheckbox.html().checked = true;
    autoRangeCheckbox.AppendTo(Win.elements.content.html());
    
    //A
    var aLabel = os.resschmgr.Create.HTMLElement("label");
    aLabel.html().for = "a";
    aLabel.html().innerHTML = "<br/>&#956: &nbsp";
    aLabel.AppendTo(Win.elements.content.html());
    
    var aTextbox = os.resschmgr.Create.HTMLElement("input");
    aTextbox.html().id = "a";
    aTextbox.html().type = "text";
    aTextbox.html().size = 3;
    aTextbox.html().value = "0.0";
    aTextbox.html().style.resize = "none";
    aTextbox.AppendTo(Win.elements.content.html());
    
    //B
    var bLabel = os.resschmgr.Create.HTMLElement("label");
    bLabel.html().for = "b";
    bLabel.html().innerHTML = "<br/>s: &nbsp";
    bLabel.AppendTo(Win.elements.content.html());
    
    var bTextbox = os.resschmgr.Create.HTMLElement("input");
    bTextbox.html().id = "b";
    bTextbox.html().type = "text";
    bTextbox.html().size = 3;
    bTextbox.html().value = "0.5";
    bTextbox.html().style.resize = "none";
    bTextbox.AppendTo(Win.elements.content.html());
    
    
    Win.Update = function(){
        DistData.bins = Number(numOfBinsTextbox.html().value);
        DistData.numOfPoints = Number(numOfPointsTextbox.html().value);
        DistData.data = [];
        DistData.height = [];
        DistData.sum = 0;
        DistData.avg = 0;
        DistData.std = 0;
        DistData.binWidth = 0;
        DistData.max = 0;
        DistData.min = 0;
        DistData.maxHeight = 1;
        
        //Distribution Specific Variables
        var a = Number(aTextbox.html().value);
        var b = Number(bTextbox.html().value);
        
        var test = true;
        
        if( b < 0){
            alert ("Invalide inputs");
            test = false;
        }
        
        for(var i = 0; i < DistData.numOfPoints; i++){
            //Generate random value
            var temp = 1;
            if(test){
                //var x = DistData.MT.random();
                temp = Variates.Logistic(a,b);//a + b *(Math.log(x / (1 - x)));
            }
            
            //Test for max or min
            if(temp > DistData.max){DistData.max = temp;}
            if(temp < DistData.min){DistData.min = temp;}
            
            //Accumlate Sum
            DistData.sum += temp;
            
            //Save Data point
            DistData.data.push(temp);
            
        }
        
        //Calculate Average
        DistData.avg = DistData.sum / DistData.numOfPoints;
        
        //Calculate Bin Width
        DistData.binWidth = Math.abs(DistData.max - DistData.min) / DistData.bins;
        
        //Initialize Bin frequencies
        for(var i = 0; i < DistData.bins; i++){
            DistData.height.push(0);
        }
        
        //Calculate Bin Frequencies
        for(var i = 0; i < DistData.data.length; i++){
            var j = 0;
            while(!(DistData.data[i] < (DistData.min + (DistData.binWidth * j)))){
                j++;
            }
            
            //Accumalte frequency
            DistData.height[j]++;
            
            //Save the max frequency
            if(DistData.height[j] > DistData.maxHeight){ DistData.maxHeight = DistData.height[j];}
        }
        
        //Normalize Frequencies for Graphing
        for(var i = 0; i < DistData.height.length; i++){
            DistData.height[i] = 20 * (DistData.height[i] / DistData.maxHeight);
        }
    }
    DockWindow(Win);
}

BuildNormalDist = function(){
    //Set Up Control Window
    var Win = os.windows.WindowsManager.Create.Window("Normal Distribution", "PC");
    //Win.elements.content.html().style.overflow = "hidden";
    Win.Set.statusbarText("");
    Win.Display.window();
    
    //Number of Bins
    var numOfBinsLabel = os.resschmgr.Create.HTMLElement("label");
    numOfBinsLabel.html().for = "numOfBins";
    numOfBinsLabel.html().innerHTML = "<br/>Number Of Bins: &nbsp &nbsp";
    numOfBinsLabel.AppendTo(Win.elements.content.html());
    
    var numOfBinsTextbox = os.resschmgr.Create.HTMLElement("input");
    numOfBinsTextbox.html().id = "numOfBins";
    numOfBinsTextbox.html().type = "text";
    numOfBinsTextbox.html().size = 3;
    numOfBinsTextbox.html().value = "20";
    numOfBinsTextbox.html().style.resize = "none";
    numOfBinsTextbox.AppendTo(Win.elements.content.html());
    
    //Number of Points
    var numOfPointsLabel = os.resschmgr.Create.HTMLElement("label");
    numOfPointsLabel.html().for = "numOfPoints";
    numOfPointsLabel.html().innerHTML = "<br/>Number Of Points: &nbsp";
    numOfPointsLabel.AppendTo(Win.elements.content.html());
    
    var numOfPointsTextbox = os.resschmgr.Create.HTMLElement("input");
    numOfPointsTextbox.html().id = "numOfPoints";
    numOfPointsTextbox.html().type = "text";
    numOfPointsTextbox.html().size = 3;
    numOfPointsTextbox.html().value = "1000";
    numOfPointsTextbox.html().style.resize = "none";
    numOfPointsTextbox.AppendTo(Win.elements.content.html());
    
    //Auto Range
    var autoRangeLabel = os.resschmgr.Create.HTMLElement("label");
    autoRangeLabel.html().for = "autoRange";
    autoRangeLabel.html().innerHTML = "<br/>Auto Range: &nbsp &nbsp";
    autoRangeLabel.AppendTo(Win.elements.content.html());
    
    var autoRangeCheckbox = os.resschmgr.Create.HTMLElement("input");
    autoRangeCheckbox.html().id = "autoRange";
    autoRangeCheckbox.html().type = "checkbox";
    autoRangeCheckbox.html().checked = true;
    autoRangeCheckbox.AppendTo(Win.elements.content.html());
    
    //Mean
    var meanLabel = os.resschmgr.Create.HTMLElement("label");
    meanLabel.html().for = "mean";
    meanLabel.html().innerHTML = "<br/>&#956: &nbsp";
    meanLabel.AppendTo(Win.elements.content.html());
    
    var meanTextbox = os.resschmgr.Create.HTMLElement("input");
    meanTextbox.html().id = "mean";
    meanTextbox.html().type = "text";
    meanTextbox.html().size = 3;
    meanTextbox.html().value = "0";
    meanTextbox.html().style.resize = "none";
    meanTextbox.AppendTo(Win.elements.content.html());
    
    //Standar Deviation
    var stdLabel = os.resschmgr.Create.HTMLElement("label");
    stdLabel.html().for = "std";
    stdLabel.html().innerHTML = "<br/>&#963: &nbsp";
    stdLabel.AppendTo(Win.elements.content.html());
    
    var stdTextbox = os.resschmgr.Create.HTMLElement("input");
    stdTextbox.html().id = "std";
    stdTextbox.html().type = "text";
    stdTextbox.html().size = 3;
    stdTextbox.html().value = "1";
    stdTextbox.html().style.resize = "none";
    stdTextbox.AppendTo(Win.elements.content.html());
    
    
    Win.Update = function(){
        DistData.bins = Number(numOfBinsTextbox.html().value);
        DistData.numOfPoints = Number(numOfPointsTextbox.html().value);
        DistData.data = [];
        DistData.height = [];
        DistData.sum = 0;
        DistData.avg = 0;
        DistData.std = 0;
        DistData.binWidth = 0;
        DistData.max = 0;
        DistData.min = 0;
        DistData.maxHeight = 1;
        
        //Distribution Specific Variables
        var mean = Number(meanTextbox.html().value);
        
        var std = Number(stdTextbox.html().value);
        
        var test = true;
        
        if(!(std > 0)){
            alert("Incorrect Inputs");
            test = false;
        }
        
        for(var i = 0; i < DistData.numOfPoints; i++){
            //Generate random value
            var temp = 1;
            if(test){
                temp = Variates.Normal(mean, std); //mean + std * x1 * Math.sqrt(-2 * Math.log(x) / x);
            }
            
            //Test for max or min
            if(temp > DistData.max){DistData.max = temp;}
            if(temp < DistData.min){DistData.min = temp;}
            
            //Accumlate Sum
            DistData.sum += temp;
            
            //Save Data point
            DistData.data.push(temp);
            
        }
        
        //Calculate Average
        DistData.avg = DistData.sum / DistData.numOfPoints;
        
        //Calculate Bin Width
        DistData.binWidth = (DistData.max - DistData.min) / DistData.bins;
        
        //Initialize Bin frequencies
        for(var i = 0; i < DistData.bins; i++){
            DistData.height.push(0);
        }
        
        //Calculate Bin Frequencies
        for(var i = 0; i < DistData.data.length; i++){
            var j = 0;
            while(!(DistData.data[i] < (DistData.min + (DistData.binWidth * j)))){
                j++;
            }
            
            //Accumalte frequency
            DistData.height[j]++;
            
            //Save the max frequency
            if(DistData.height[j] > DistData.maxHeight){ DistData.maxHeight = DistData.height[j];}
        }
        
        //Normalize Frequencies for Graphing
        for(var i = 0; i < DistData.height.length; i++){
            DistData.height[i] = 20 * (DistData.height[i] / DistData.maxHeight);
        }
    }
    DockWindow(Win);
}
BuildLogNormalDist = function(){
    //Set Up Control Window
    var Win = os.windows.WindowsManager.Create.Window("Log Normal Distribution", "PC");
    //Win.elements.content.html().style.overflow = "hidden";
    Win.Set.statusbarText("");
    Win.Display.window();
    
    //Number of Bins
    var numOfBinsLabel = os.resschmgr.Create.HTMLElement("label");
    numOfBinsLabel.html().for = "numOfBins";
    numOfBinsLabel.html().innerHTML = "<br/>Number Of Bins: &nbsp &nbsp";
    numOfBinsLabel.AppendTo(Win.elements.content.html());
    
    var numOfBinsTextbox = os.resschmgr.Create.HTMLElement("input");
    numOfBinsTextbox.html().id = "numOfBins";
    numOfBinsTextbox.html().type = "text";
    numOfBinsTextbox.html().size = 3;
    numOfBinsTextbox.html().value = "20";
    numOfBinsTextbox.html().style.resize = "none";
    numOfBinsTextbox.AppendTo(Win.elements.content.html());
    
    //Number of Points
    var numOfPointsLabel = os.resschmgr.Create.HTMLElement("label");
    numOfPointsLabel.html().for = "numOfPoints";
    numOfPointsLabel.html().innerHTML = "<br/>Number Of Points: &nbsp";
    numOfPointsLabel.AppendTo(Win.elements.content.html());
    
    var numOfPointsTextbox = os.resschmgr.Create.HTMLElement("input");
    numOfPointsTextbox.html().id = "numOfPoints";
    numOfPointsTextbox.html().type = "text";
    numOfPointsTextbox.html().size = 3;
    numOfPointsTextbox.html().value = "1000";
    numOfPointsTextbox.html().style.resize = "none";
    numOfPointsTextbox.AppendTo(Win.elements.content.html());
    
    //Auto Range
    var autoRangeLabel = os.resschmgr.Create.HTMLElement("label");
    autoRangeLabel.html().for = "autoRange";
    autoRangeLabel.html().innerHTML = "<br/>Auto Range: &nbsp &nbsp";
    autoRangeLabel.AppendTo(Win.elements.content.html());
    
    var autoRangeCheckbox = os.resschmgr.Create.HTMLElement("input");
    autoRangeCheckbox.html().id = "autoRange";
    autoRangeCheckbox.html().type = "checkbox";
    autoRangeCheckbox.html().checked = true;
    autoRangeCheckbox.AppendTo(Win.elements.content.html());
    
    //A
    var aLabel = os.resschmgr.Create.HTMLElement("label");
    aLabel.html().for = "a";
    aLabel.html().innerHTML = "<br/>a: &nbsp";
    aLabel.AppendTo(Win.elements.content.html());
    
    var aTextbox = os.resschmgr.Create.HTMLElement("input");
    aTextbox.html().id = "a";
    aTextbox.html().type = "text";
    aTextbox.html().size = 3;
    aTextbox.html().value = "0";
    aTextbox.html().style.resize = "none";
    aTextbox.AppendTo(Win.elements.content.html());
    
    //Mean
    var meanLabel = os.resschmgr.Create.HTMLElement("label");
    meanLabel.html().for = "mean";
    meanLabel.html().innerHTML = "<br/>&#956: &nbsp";
    meanLabel.AppendTo(Win.elements.content.html());
    
    var meanTextbox = os.resschmgr.Create.HTMLElement("input");
    meanTextbox.html().id = "mean";
    meanTextbox.html().type = "text";
    meanTextbox.html().size = 3;
    meanTextbox.html().value = "0";
    meanTextbox.html().style.resize = "none";
    meanTextbox.AppendTo(Win.elements.content.html());
    
    //Standar Deviation
    var stdLabel = os.resschmgr.Create.HTMLElement("label");
    stdLabel.html().for = "std";
    stdLabel.html().innerHTML = "<br/>&#963: &nbsp";
    stdLabel.AppendTo(Win.elements.content.html());
    
    var stdTextbox = os.resschmgr.Create.HTMLElement("input");
    stdTextbox.html().id = "std";
    stdTextbox.html().type = "text";
    stdTextbox.html().size = 3;
    stdTextbox.html().value = "0.5";
    stdTextbox.html().style.resize = "none";
    stdTextbox.AppendTo(Win.elements.content.html());
    
    
    Win.Update = function(){
        DistData.bins = Number(numOfBinsTextbox.html().value);
        DistData.numOfPoints = Number(numOfPointsTextbox.html().value);
        DistData.data = [];
        DistData.height = [];
        DistData.sum = 0;
        DistData.avg = 0;
        DistData.std = 0;
        DistData.binWidth = 0;
        DistData.max = 0;
        DistData.min = 0;
        DistData.maxHeight = 1;
        
        //Distribution Specific Variables
        var a = Number(aTextbox.html().value);
        var mean = Number(meanTextbox.html().value);
        
        var std = Number(stdTextbox.html().value);
        
        var test = true;
        
        if(!(std > 0)){
            alert("Incorrect Inputs");
            test = false;
        }
        
        for(var i = 0; i < DistData.numOfPoints; i++){
            //Generate random value
            var temp = 1;
            if(test){                
                temp = Variates.LogNormal(a,mean, std);
            }
            
            //Test for max or min
            if(temp > DistData.max){DistData.max = temp;}
            if(temp < DistData.min){DistData.min = temp;}
            
            //Accumlate Sum
            DistData.sum += temp;
            
            //Save Data point
            DistData.data.push(temp);
            
        }
        
        //Calculate Average
        DistData.avg = DistData.sum / DistData.numOfPoints;
        
        //Calculate Bin Width
        DistData.binWidth = (DistData.max - DistData.min) / DistData.bins;
        
        //Initialize Bin frequencies
        for(var i = 0; i < DistData.bins; i++){
            DistData.height.push(0);
        }
        
        //Calculate Bin Frequencies
        for(var i = 0; i < DistData.data.length; i++){
            var j = 0;
            while(!(DistData.data[i] < (DistData.min + (DistData.binWidth * j)))){
                j++;
            }
            
            //Accumalte frequency
            DistData.height[j]++;
            
            //Save the max frequency
            if(DistData.height[j] > DistData.maxHeight){ DistData.maxHeight = DistData.height[j];}
        }
        
        //Normalize Frequencies for Graphing
        for(var i = 0; i < DistData.height.length; i++){
            DistData.height[i] = 20 * (DistData.height[i] / DistData.maxHeight);
        }
    }
    DockWindow(Win);
}
//
//  DISTRIBUTION FUNCTIONS
//
Variates = {
    MT: null,
    Uniform: function(min, max){
        return min + (max - min) * Variates.MT.random();
    },
    Exponential: function(beta){
        var invBeta = 1/beta;
        return invBeta * Math.exp(-1 * invBeta * Variates.MT.random());    
    },
    Weibull: function(a,b,c){
        return a + b * Math.pow(-1 * Math.log(Variates.MT.random()), 1/c);
    },
    Triangular: function(xMin, xMax, c){
        var p = Variates.MT.random();
        var q = 1 - p;
        var temp = 1;
        if( p <= ((c -xMin) / (xMax - xMin))){
            temp = xMin + Math.sqrt((xMax - xMin) * (c - xMin) * p);
        }
        else{
            temp = xMax - Math.sqrt((xMax - xMin) * (xMax - c) * q);
        }
        
        return temp;
    },
    LogLogistic: function(alpha, beta){
        var x = Variates.MT.random();
        var invAlpha = 1/alpha;
        return Math.exp(1/beta * Math.log((x * Math.pow(alpha, beta))/ ( 1 - x)));
        //return ( (beta * invAlpha) * Math.pow(x*invAlpha, beta - 1)) / ((1 + Math.pow(x*invAlpha, beta)) * (1 + Math.pow(x*invAlpha, beta)))
            
    },
    Logistic: function(mu, s){
        var x = Variates.MT.random();
        return mu + s *(Math.log(x / (1 - x)));
    },
    Normal: function(mean, std){
        var x1 = Variates.Uniform(-1,1);//-1 + 2*Variates.MT.random();
        var x2 = Variates.Uniform(-1,1);//-1 + 2*Variates.MT.random();
        var x  = x1 * x1 + x2 * x2;
        
        while(x >= 1.0){
            x1 = Variates.Uniform(-1,1);//-1 + 2*Variates.MT.random();
            x2 = Variates.Uniform(-1,1);//-1 + 2*Variates.MT.random();
            x  = x1 * x1 + x2 * x2;
        }
        
        return mean + std * x1 * Math.sqrt(-2 * Math.log(x) / x);
    },
    LogNormal: function(a, mu, sigma){
        return a + Math.exp(Variates.Normal(mu,sigma));
    }
    
}



//
//  Data Wrapper
//
DistData ={
    data: [],
    height: [],
    sum: 0,
    bins: 0,
    avg: 0,
    std:0,
    min:0,
    max:0,
    binWidth: 0,
    numOfPoints: 0,
    maxHeight: 1,
    bar: null,
    MT: null,
    Draw: function(){
        for(var i = 0; i < DistData.height.length; i++){
            DistData.bar.Set.Scale(1, DistData.height[i], 1);
            DistData.bar.Set.Position(2*i, DistData.height[i], 0);
            DistData.bar.Graphics.Draw("default");
            DistData.bar.Graphics.Draw("shadow");
        }
    },
    Initialize: function(){
        //Create RNG
        DistData.MT = new MersenneTwister(123);
        Variates.MT = DistData.MT;
        
        //Create Graphical Bar Entity;
        DistData.bar = os.graphics.Managers.Entity.Create();
        DistData.bar.Graphics.Add.Mesh("bar");
        DistData.bar.Graphics.Set.light(true);
        DistData.bar.Graphics.Set.useBlendColor(true);
        DistData.bar.Graphics.Set.texture(false);
        DistData.bar.Graphics.Set.blendColor([0.73,0.078,0.263]);
        DistData.bar.Default.pitch = 0;
        //Green [0.153,0.878,0.086]
        //Blue [0.078,0.165,0.522]
        //Create Shadow Shader for Ship
        var shadowShader = DistData.bar.Graphics.Add.Shader("shadow", "shadow");
        
        //Add Attribute and Uniform Pointers
        shadowShader.AddAttribute("aVertexPosition", "FLOAT", null, "VERTEX", null);
        
        //Add Uniforms to Entity
        shadowShader.AddUniform("uPMatrix", "4X4", os.graphics.Matrix.Projection);
        shadowShader.AddUniform("uVMatrix", "4X4", os.graphics.Matrix.View);
        shadowShader.AddUniform("uWMatrix", "4X4", DistData.bar.Graphics.Matrix.World);
        shadowShader.AddUniform("uLight", "VEC3", [-100.0, 150.0, -100.0]);
        
        //Set Graphcis Callback
        os.graphics.Set.Callback.Draw(DistData.Draw);
    }
}


Distribution = function(){
    //Graphics Initializtion
    DistWebGLInit();
    
    //Create and Initalize Floor Quad
    (os.graphics.Managers.Mesh.Create.Primitive.Quad("quad")).Initialize();
    
    //Create Terrain
    var terrain = os.graphics.Managers.Entity.Create();
    terrain.Graphics.Add.Mesh("quad");
    terrain.Graphics.Set.light(false);
    terrain.Graphics.Set.useBlendColor(true);
    terrain.Graphics.Set.texture(false);
    terrain.Graphics.Set.blendColor([0.17,0.26,0.40]);
    terrain.Set.Scale(2000,2000,1);
    terrain.pitch = 90;
    terrain.Set.Position(0,0,0);
    terrain.Graphics.Set.fog(true);
    terrain.Graphics.Set.fogEndPosition(1000.0);
    terrain.Graphics.Set.fogBeginPosition(200.0);
    os.graphics.AddToWorld(terrain);
    
    //Build Shadow Program and Link
    var prgShadow = os.graphics.Managers.Shader.Create.Program("shadow", "shadow", "shadow");
    
     //Add Attributes to Shadow Program
    prgShadow.CreateAttribute("aVertexPosition");
                    
    //Add Uniforms to Skybox Program
    prgShadow.CreateUniform("uPMatrix");
    prgShadow.CreateUniform("uVMatrix");
    prgShadow.CreateUniform("uWMatrix");
    prgShadow.CreateUniform("uLight");
    
    
    //Create and Initialize Bar Mesh
    (os.graphics.Managers.Mesh.Create.Primitive.Cube("bar")).Initialize();
    

    DistData.Initialize();
    
    BuildUniformDist();

    
    
}