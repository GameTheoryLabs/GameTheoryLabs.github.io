
//HTML Elements

//<div id='3d'></div>
//<div id='thumbnail'></div>
//<div id='options'><div>
//<div id='output'><div>

OBJWebGLInit = function(){
    
    graphicsElement = os.resschmgr.Create.HTMLElement("div");
    graphicsElement.html().id = 'image-3d';
    //graphicsElement.SetID('image-3d');
    
    graphicsDiv = document.getElementById('image-3d-window');
    
    thumbnailDiv = document.getElementById('thumbnail-window');
    optionsDiv = document.getElementById('properties-window');
    outputDiv = document.getElementById('output');
    
    bioCanvas = os.resschmgr.Create.HTMLElement("canvas");
    bioCanvas.html().style.width = "100%";
    bioCanvas.html().style.height = "100%";

    graphicsDiv.appendChild(bioCanvas.html());
    //graphicsDiv.style.overflow = "hidden";
    //graphicsDiv.style.width = "400px";
    //graphicsDiv.style.height = "400px";
    

    //thumbnailDiv.style.width = "400px";
    //thumbnailDiv.style.height = "400px";
    
    os.graphics.Load(false, false, bioCanvas.html());
    
    gl = os.graphics.gl;
    
    dropDown = document.getElementById("dropdown");
    
    dropDown.onchange = function(e){
        win = os.windows.WindowsManager.Windows.get("jahova.window.id." + e.currentTarget.value);
        win.MakeActive();
    }
    
    BuildLightingWindow();
    BuildObjectWindow();
    BuildInstructionsWindow();
    
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
            //os.graphics.Managers.Camera.MoveUp(5);
            sceneNode.Move.Up(10);
        }
        else if(String.fromCharCode(e.keyCode) == "E"){     //Straif Down
            //os.graphics.Managers.Camera.MoveDown(10);
            sceneNode.Move.Down(10);
        }
        else if(String.fromCharCode(e.keyCode) == "F"){     //Straif Down
            fullscreen()
        }
        else if(e.keyCode == 27){     //Straif Down
            windowed();
        }
        mat4.identity(cancer.Graphics.Matrix.Parent.Translate);
        mat4.translate(cancer.Graphics.Matrix.Parent.Translate, sceneNode.Position);
        mat4.multiply(cancer.Graphics.Matrix.Parent.Translate, cancer.Graphics.Matrix.Parent.Rotation, cancer.Graphics.Matrix.Parent.World );
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
        cancer.yaw -= deltaX / 10;
        //cam.Rotation.yaw += deltaX / 10;
        
        //if(cam.Rotation.yaw > 360){ cam.Rotation.yaw  -= 360;}
        //else if(cam.Rotation.yaw < 0) { cam.Rotation.yaw += 360; }
        if(cancer.yaw > 360){ cancer.yaw  -= 360;}
        else if(cancer.yaw < 0) { cancer.yaw += 360; }
        
    
        var deltaY = newY - Input.Mouse.lastY;
        //cam.Rotation.pitch += deltaY / 10;
        cancer.Default.pitch -= deltaY / 10;
        
        //if(cam.Rotation.pitch > 360){ cam.Rotation.pitch  -= 360;}
        //else if(cam.Rotation.pitch < 0) { cam.Rotation.pitch += 360; }
        
        if(cancer.Default.pitch > 360){ cancer.Default.pitch  -= 360;}
        else if(cancer.Default.pitch < 0) { cancer.Default.pitch += 360; }
    
        //Reset offset
        mat4.identity(cancer.Graphics.Matrix.Parent.Rotation);
        
        //Rotate Scene Node
        mat4.rotateX(cancer.Graphics.Matrix.Parent.Rotation, degToRad(cancer.Default.pitch), cancer.Graphics.Matrix.Parent.Rotation);
        
        //Update Scene World Matrix
        mat4.multiply(cancer.Graphics.Matrix.Parent.Translate, cancer.Graphics.Matrix.Parent.Rotation, cancer.Graphics.Matrix.Parent.World );
        
        Input.Mouse.lastX = newX
        Input.Mouse.lastY = newY;   
    }
    
    
    // Setup Event Handlers for User Input
    window.addEventListener("keydown", onKeyDown, false);
    os.graphics.Get.Canvas().addEventListener("mousedown", onMouseDown, false);
    document.addEventListener("mouseup", onMouseUp, false);
    document.addEventListener("mousemove", onMouseMove, false);
    
    sceneNode = os.graphics.Managers.Entity.Create();
    
    cancer = os.graphics.Managers.Entity.Create();
    cancer.Graphics.Set.specular(false);
    cancer.Default.pitch = 0;
    
    vec3.set([0,10,-100],os.graphics.Managers.Camera.Position);
    //os.graphics.gl.clearColor(0.0, 0.0, 0.0, 0.0);
}

FileInit = function(){

    var bHaveFileAPI = (window.File && window.FileReader);
    
    if(!bHaveFileAPI){
        alert("This browser doesn't support the File API");
        return;
    }
    
    //Set up mesh event listeners
    document.getElementById("meshFile").addEventListener("change", onFileChanged);
    document.getElementById("bio-container").addEventListener("drop", onFilesDropped);
    document.getElementById("bio-container").addEventListener("dragover", onDragOver);
    
    //Set up image event listeners
    document.getElementById("imgFile").addEventListener("change", onFileChanged);
    //document.getElementById("thumbnail").addEventListener("drop", onFilesDropped);
    //document.getElementById("thumbnail").addEventListener("dragover", onDragOver);
    
    //Handler for Button Click
    function onFileChanged(evt){
        var files = evt.target.files;
        var totalBytes = 0;
        
        //document.getElementById("data").innerHTML = "";
        
        for(var i = 0; i < files.length; i++){
            var fileInfo = "File Name: " + files[i].name + "; Size: " + files[i].size + "; Type: " + files[i].type ;
            totalBytes += files[i].size;
            os.console.AppendComment(fileInfo);
        }
        
        os.console.Comment( "\nTotal of " + files.length + " files, " + totalBytes + " bytes.");
        
        FileLoader(files);
    }
    
    
    //Handlers for File Drag and Drop
    function onDragOver(evt){
        evt.stopPropagation();
        evt.preventDefault();
    }
    
    
    function onFilesDropped(evt){
        evt.stopPropagation();
        evt.preventDefault();
        
        var files = evt.dataTransfer.files;
        var totalBytes = 0;
        
        //document.getElementById("data").innerHTML = "";
        
        for(var i = 0; i < files.length; i++){
            var fileInfo = "File Name: " + files[i].name + "; Size: " + files[i].size + "; Type: " + files[i].type;
            totalBytes += files[i].size;
            os.console.AppendComment(fileInfo);
        }
        
        os.console.Comment("\nTotal of " + files.length + " files, " + totalBytes + " bytes.");
        
        FileLoader(files);
    }
    
    function FileLoader(files){
        
        for(var i = 0; i < files.length; i++){
            var fileInfo = {};
            fileInfo.name = files[i].name;
            fileInfo.type = files[i].type;
            fileInfo.ext = files[i].name.substr(files[i].name.lastIndexOf(".") + 1).toUpperCase();
            
            //test for image
            if(fileInfo.type.search("image") >= 0){
                LoadImageFile(files[i]);
            }
            
            //test for json
            else if(fileInfo.ext == "JSON"){
                LoadMeshFile(files[i]);
            }
            
            else if(fileInfo.ext == "OBJ"){
                LoadObjFile(files[i]);
            }
            
            //ignore file and warn user
            else{
                os.console.Warning("File: " + files[i].name + " ignored, unhandled file type");
            }
        }
    }
}

LoadObjFile = function(file){
    os.console.Comment("Loading OBJ: " + file.name);
    
    var reader = new FileReader();
    
    reader.onload = function(evt){
        //var resultText = evt.target.result;
        json = BuildJSON(ParseOBJ(evt.target.result));
        AddEntityFromJSON(json);
    }
    
    reader.readAsText(file);
    
    
    
}
LoadMeshFile = function(file){
    os.console.Comment("Loading Mesh: " + file.name);

    var objectURL = window.webkitURL.createObjectURL(file);
    os.console.Comment("File Path: " + objectURL);
    if(os.graphics.Managers.Mesh.meshes.size > 0){
        
        if(cancer.Graphics.Mesh.value().filename != objetURL){
            os.graphics.Managers.Mesh.Create.Mesh("mesh"+cancer.Graphics.Mesh.size(), objectURL);
            cancer.Graphics.Mesh.removeAll();
            cancer.Graphics.Add.Mesh("mesh"+cancer.Graphics.Mesh.size());
            
        }
    }
    else{
        os.graphics.Managers.Mesh.Create.Mesh("mesh", objectURL);
        AddEntity("mesh");
    }
    
    
    
    
    
}

LoadImageFile = function(file){
    os.console.Comment("Loading Image: " + file.name);
    var reader = new FileReader();
    reader.onload = function(evt){
        var resultdata = evt.target.result;
        
        //Does a texture already exist for the object
        if(cancer.Graphics.Texture.size > 0){
            
            //If texture is the same, ignore
            //  otherwise remove current texture and add this
            //  as new texture
            if(cancer.Graphics.Texture.value() != event.target.result){
                img = new Image();
                img.src = event.target.result;
                img.style.width = "100px";
                img.style.width = "100px";
                document.getElementById("thumbnail-window").appendChild(img);
                cancer.Graphics.Texture.removeAll();
                
                var tex = os.graphics.Managers.Texture.Create.Texture("mesh", img.src);
                cancer.Graphics.Add.Texture("mesh");
                tex.Initialize();
            }

        }
        else{
            img = new Image();
            img.src = event.target.result;
            img.style.width = "100px";
            img.style.width = "100px";
            document.getElementById("thumbnail-window").appendChild(img);
            var tex = os.graphics.Managers.Texture.Create.Texture("mesh", img.src);
            cancer.Graphics.Add.Texture("mesh");
            cancer.Graphics.Set.texture(true);
            cancer.Graphics.Set.useBlendColor(false);
            tex.Initialize();
        }
        
    }
    
    reader.readAsDataURL(file);
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
AddEntity = function(key){
    
    
    cancer.Graphics.Add.Mesh(key);
    cancer.Graphics.Set.texture(false);
    cancer.Set.Scale(1,1,1);
    cancer.Set.Position(0,0,0);
    cancer.Graphics.Set.useBlendColor(true);
    cancer.Graphics.Set.blendColor([0.5, 0.5, 0.5]);
    cancer.Graphics.Update = EntityUpdate;
    
    os.graphics.Set.Callback.Update(UpdateEntity);
    os.graphics.Set.Callback.Draw(DrawEntity);
    
    os.graphics.Start();
}
UpdateEntity = function(dt){
    
    cancer.Graphics.Update(dt);
}
DrawEntity = function(){
    
    cancer.Graphics.Draw();
}
AddEntityFromJSON = function(json){
    
    os.console.Comment("Creating Mesh from JSON");
    
    
    for(var i = 0; i < json.length; i++){
        var msh = os.graphics.Managers.Mesh.Create.Mesh("mesh"+i, null, json[i]);
        msh.Initialize();
        cancer.Graphics.Add.Mesh(msh.name);
        
    }
    
    if(cancer.Graphics.Texture.size == 0){
        cancer.Graphics.Set.texture(false);
        cancer.Graphics.Set.useBlendColor(true);
        cancer.Graphics.Set.blendColor([0.5, 0.5, 0.5]);
    }
    
    cancer.Set.Scale(1,1,1);
    cancer.Set.Position(0,0,0);
    
    cancer.Graphics.Update = EntityUpdate;
    
    os.graphics.Set.Callback.Update(UpdateEntity);
    os.graphics.Set.Callback.Draw(DrawEntity);
    
    os.console.Comment("Model Import Complete");
    os.graphics.Start();
}

ParseOBJ = function(file){
    
    file = file.split('\n');
    
    os.console.Comment("Parsing OBJ Model");
    
    var obj = {};
    obj.vertex = [];
    obj.normal = [];
    obj.texture = [];
    obj.face = [];
    
    var CalculateSurfaceNormal = function(index1,index2,index3){
        //Norm( (index3 - index1) CROSS (index2 - index1) );
        var pt1 = [obj.vertex[index1 * 3], obj.vertex[index1 * 3 + 1], obj.vertex[index1 * 3 + 2]];
        var pt2 = [obj.vertex[index2 * 3], obj.vertex[index2 * 3 + 1], obj.vertex[index2 * 3 + 2]];
        var pt3 = [obj.vertex[index3 * 3], obj.vertex[index3 * 3 + 1], obj.vertex[index3 * 3 + 2]];
        
        var surfaceNormal = [];
        var side1 = [];
        var side2 = [];
        
        vec3.subtract(pt3, pt1, side1);
        vec3.subtract(pt2, pt1, side2);
        
        vec3.cross(side2, side1, surfaceNormal);
        vec3.normalize(surfaceNormal, surfaceNormal);
        
        return surfaceNormal;
        
    }
    
    var CalculateTriArea = function(sn){
        return (0.5 * vec3.length(sn));
    }

    for (var lineIndex in file) {
        
        //Grab line from file
        var line = file[lineIndex].replace(/[ \t]+/g, " ").replace(/\s\s*$/, "");
        
        // ignore comments
        if (line[0] == "#")
            continue;
        
        //Divide line on spaces
        var array = line.split(" ");
        
        if (array[0] == "v") {//vertex
            
            obj.vertex.push(parseFloat(array[1]));
            obj.vertex.push(parseFloat(array[2]));
            obj.vertex.push(parseFloat(array[3]));
        }
        else if (array[0] == "vt") {//texture

            obj.texture.push(parseFloat(array[1]));
            obj.texture.push(parseFloat(array[2]));
        }
        else if (array[0] == "vn") {//normal

            obj.normal.push(parseFloat(array[1]));
            obj.normal.push(parseFloat(array[2]));
            obj.normal.push(parseFloat(array[3]));
        }
        else if (array[0] == "f") {//face

            if (array.length != 4) { //Quads

                obj.face.push(array);
            }
            else{//Tris
                obj.face.push(array);
            }

        }
    }
    
    //Generate Normals if they dont exist
    if(obj.normal.length < 1){
        os.console.Comment("Generating Vertex Normals");
        
        //Initialize all normals to 0;
        for(var i = 0; i < obj.vertex.length; i++){
            obj.normal[i] = 0;
        }
        
        
        //Calculate all surface normals for each face
        for(var i = 0; i < obj.face.length; i++){
            
            //Take the 3 Verts for the face,
            //  seperate them, and get the Vertex Position index
            var pt1Index = obj.face[i][1].split("/");
            pt1Index = parseFloat(pt1Index[0]) - 1;
            
            var pt2Index = obj.face[i][2].split("/");
            pt2Index = parseFloat(pt2Index[0]) - 1;
            
            var pt3Index = obj.face[i][3].split("/");
            pt3Index = parseFloat(pt3Index[0]) - 1; 
            
            //Pass Vertex Position Index to get Surface Normal of Poly
            var sn = CalculateSurfaceNormal(pt1Index, pt2Index, pt3Index);
            var area = CalculateTriArea(sn);
            
            //Weight Surface Normal with Area
            vec3.scale(sn, area, sn);
            
            var temp = [];
            
            //*************************
            //  Point 1
            //*************************
            
            //Get current normal stored in array
            temp = [obj.normal[pt1Index * 3], obj.normal[pt1Index * 3 + 1], obj.normal[pt1Index * 3 + 2]];
            
            //Accumalte normals
            vec3.add(temp, sn, temp);
            
            //Normalize calculated vert normal
            //vec3.normalize(temp, temp);
            
            obj.normal[pt1Index * 3]     = temp[0];
            obj.normal[pt1Index * 3 + 1] = temp[1];
            obj.normal[pt1Index * 3 + 2] = temp[2];
            
            
            //*************************
            //  Point 2
            //*************************
            
            //Get current normal stored in array
            temp = [obj.normal[pt2Index * 3], obj.normal[pt2Index * 3 + 1], obj.normal[pt2Index * 3 + 2]];
            
            //Accumalte normals
            vec3.add(temp, sn, temp);
            
            //Normalize calculated vert normal
            //vec3.normalize(temp, temp);
            
            obj.normal[pt2Index * 3]     = temp[0];
            obj.normal[pt2Index * 3 + 1] = temp[1];
            obj.normal[pt2Index * 3 + 2] = temp[2];
            
            //*************************
            //  Point 3
            //*************************
            
            //Get current normal stored in array
            temp = [obj.normal[pt3Index * 3], obj.normal[pt3Index * 3 + 1], obj.normal[pt3Index * 3+ 2]];
            
            //Accumalte normals
            vec3.add(temp, sn, temp);
            
            //Normalize calculated vert normal
            //vec3.normalize(temp, temp);
            
            obj.normal[pt3Index * 3]     = temp[0];
            obj.normal[pt3Index * 3 + 1] = temp[1];
            obj.normal[pt3Index * 3 + 2] = temp[2];

        }
        
        //Normalize all of the accumlated vertex normals
        for(var i = 0; i < obj.vertex.length; i+=3){
            var temp = [obj.normal[i], obj.normal[i + 1], obj.normal[i + 2]];
            vec3.normalize(temp, temp);
            
            obj.normal[i]     = temp[0];
            obj.normal[i + 1] = temp[1];
            obj.normal[i + 2] = temp[2];
        }
        os.console.Comment(obj.normal.length + " Vertex Normals Generated");
    }
    
    if(document.getElementById("autocenter").checked){
        os.console.Comment("Auto Centering Model");
        //Sum up all vert positions
        var sum = [0,0,0];
        for(var i = 0; i < obj.vertex.length; i+=3){
            sum[0] += obj.vertex[i];
            sum[1] += obj.vertex[i+1];
            sum[2] += obj.vertex[i+2];
        }
        
        //Covert sum into average position
        sum[0] = sum[0]/(obj.vertex.length/3);
        sum[1] = sum[1]/(obj.vertex.length/3);
        sum[2] = sum[2]/(obj.vertex.length/3);
        
        //Translate each position by calculated average
        for(var i = 0; i < obj.vertex.length; i+=3){
            obj.vertex[i]   -= sum[0];
            obj.vertex[i+1] -= sum[1];
            obj.vertex[i+2] -= sum[2];
        }
        
        os.console.Comment("Auto Centering Complete");
    }
    os.console.Comment("Parse Complete:\nVerts: " + obj.vertex.length / 3 + "\nNorms: " + obj.normal.length / 3 + "\nTexture: " + obj.texture.length / 2+  "\nPolys: " + obj.face.length);
    //obj.face = obj.face.reverse();
    return obj;
}


BuildJSON = function(obj){
    os.console.Comment("Building JSON model");
    var out = [];
    var json = os.resschmgr.Create.JSON();
    //json.vertexPositions = [];
    //json.vertexNormals = [];
    //json.vertexTextureCoords = [];
    //json.indices = [];
    
    var verts = os.resschmgr.Create.Map();
    
    var addTriFace = function(face){
        for(var j = 1; j < 4; ++j){
            
            //Test if face already exist
            //      key: v/t/n
            if((verts.get(face[j])) == undefined){
                
                var f = face[j].split("/");
                var v, t, n;
                
                if(f.length == 1){//vertex
                    v = parseInt(f[0]) - 1;
                    //t = v;
                    n = v;
                }
                else if(f.length == 2){//vertex/texture
                    v = parseInt(f[0]) - 1;
                    t = parseInt(f[1]) - 1;
                    n = v; //parseInt(f[0]) - 1;
                }
                else if(f.length == 3){//vertex/texture/normal
                    v = parseInt(f[0]) - 1;
                    t = parseInt(f[1]) - 1;
                    n = parseInt(f[2]) - 1;
                }
                else{
                    //os.console.Warning("Invalid number of faces");
                    return;
                }
                
                
                //Verify that the position will not extend outside
                //  of obj.vertex array
                
                var x = 0;
                var y = 0;
                var z = 0;
                
                if( ((v * 3) + 2) < obj.vertex.length){
                    x = obj.vertex[v*3];
                    y = obj.vertex[v*3 + 1];
                    z = obj.vertex[v*3 + 2];
                }
                
                json.vertexPositions.push(x);
                json.vertexPositions.push(y);
                json.vertexPositions.push(z);
                
                //Verify that the position will not extend outside
                //  of obj.texture array
                
                var u = 0;
                var v = 0;
                
                if( ((t * 2) + 1) < obj.texture.length){
                    u = obj.texture[t*2];
                    v = obj.texture[t*2 + 1];
                }
                
                json.vertexTextureCoords.push(u);
                json.vertexTextureCoords.push(v);
                
                //Verify that the position will not extend outside
                //  of obj.normal array
                
                var nx = 0;
                var ny = 0;
                var nz = 0;
                
                if( ((n * 3) + 2) < obj.normal.length){
                    nx = obj.normal[n*3];
                    ny = obj.normal[n*3 + 1];
                    nz = obj.normal[n*3 + 2];
                }
                
                json.vertexNormals.push(nx);
                json.vertexNormals.push(ny);
                json.vertexNormals.push(nz);
                
                //Place vert from face into verts map
                //  Key: v/t/n
                //  Value: index of array (= size of map)
                verts.put(face[j], verts.size);
            }
            
            //Add face vert to indice array
            json.indices.push(verts.get(face[j]));
        }
    }
    
    var addQuadFace = function(face){
        //f 1 2 3 4
        
        //os.console.Warning("Adding Quad Face");
        //f  1 2 3 
        var tri1 = [face[0],face[1],face[2],face[3]];
        addTriFace(tri1);
        
        //f 1 3 4 
        var tri2 = [face[0],face[1],face[3],face[4]];
        addTriFace(tri2);
    }
    
    
    //Loop through face and build json
    for(var i = 0; i < obj.face.length; i++){
        
        if(obj.face[i].length == 4){ //Add Tri
            addTriFace(obj.face[i]);
        }
        else if(obj.face[i].length == 5){ //Add Quad
            addQuadFace(obj.face[i]);   
        }
        
        if(json.vertexPositions.length >= 135000){
            out.push(json);
            json = os.resschmgr.Create.JSON();
            verts.removeAll();
        }
    }
    
    out.push(json);
    
    os.console.Comment("JSON Model Build Complete");
    
    
    
    return out;
}
SaveJSON = function(){
    var filename = prompt("Enter Model Name");
    
    if(json.length == 1){
        var blob = new Blob([JSON.stringify(json[0])]);
        saveAs(blob, filename +".json");
        os.console.Comment("Saved File: " + filename +".json To Download Folder");
    }
    else{
        for(var i = json.length -1; i >= 0; i--){
            var blob = new Blob([JSON.stringify(json[i])]);
            saveAs(blob, filename + i +".json");
            os.console.Comment("Saved File: " + filename + i + ".json To Download Folder");
            
        }
    }
    
}
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
    
    //Save Model
    var saveLabel = os.resschmgr.Create.HTMLElement("label");
    saveLabel.html().for = "scale";
    saveLabel.html().innerHTML = "Object Scale&nbsp&nbsp&nbsp&nbsp";
    saveLabel.AppendTo(Win.elements.content.html());
    var save = os.resschmgr.Create.HTMLElement("input");
    save.html().type = "button";
    save.html().id = "save";
    save.html().value = "Save Model To JSON";
    save.html().onclick = SaveJSON;
    save.AppendTo(Win.elements.content.html());
    
    
    //Scale Control
    var scaleLabel = os.resschmgr.Create.HTMLElement("label");
    scaleLabel.html().for = "scale";
    scaleLabel.html().innerHTML = "<br/>Object Scale&nbsp&nbsp&nbsp&nbsp";
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

        cancer.Set.Scale(multi * scale,scale,scale);
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
        
        cancer.Set.Scale(multi * scaleValue,scaleValue,scaleValue);
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
            cancer.Graphics.Set.enableAlpha(true);
        }
        else{
            cancer.Graphics.Set.enableAlpha(false);
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
            cancer.Graphics.Set.alphaValue(e.target.value);
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
        cancer.Graphics.Set.ambientColor([light, light, light]);
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
        cancer.Graphics.Set.specular(e.target.checked);
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
        cancer.Graphics.Set.shininess(shine);
    }
    shininessSlider.AppendTo(Win2.elements.content.html());
    
    DockWindow(Win2);
}
BuildInstructionsWindow = function(){
    var Win2 = os.windows.WindowsManager.Create.Window("Instructions", "PC");
    //Win2.elements.content.html().style.overflow = "hidden";
    Win2.elements.content.html().innerHTML = "This is a model viewer (currently only OBJ) that can view mutli object, Tri and Quad based models.  The models are converted into a JSON format that is compatiable with JaHOVA OS<br/><br/>";
    Win2.elements.content.html().innerHTML += "Load OBJ and texture files by dragging into either dropzone, or use the File Selectors<br/><br/>";
    Win2.elements.content.html().innerHTML += "Limitations: <br/>Although textures are supported only 1 texture per model, so for muti group OBJs all textures must be merged together<br/>";
    Win2.elements.content.html().innerHTML += "While textures are supported materials are not supported<br/><br/>";
    Win2.elements.content.html().innerHTML += "Controls:<br/> F / ESC: Fullscreen ane Exit Fullscreen <br/> Undocked Windows will be accessible in Fullscreen mode <br/>LMB + Move: Rotates Object <br/> WASD Q/E: Move Object in Scene <br/><br/>Cntrl + ~: Show/Hide JaHOVA OS Sidebar" ;
    Win2.Set.statusbarText("");
    Win2.Hide.menubar();
    Win2.Display.window();
    Win2.elements.titlebar.buttons.close.html().onclick = function(e){
        DockWindow(os.windows.WindowsManager.Windows.get(e.target.id));    
    }
    
    //DockWindow(Win2);
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
    var win = os.windows.WindowsManager.Windows.get("jahova.window.id." + dropDown[dropDown.selectedIndex].value);
    
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
    
    win = os.windows.WindowsManager.Windows.get("jahova.window.id." + dropDown[dropDown.selectedIndex].value);
    win.MakeActive();
    
}

//
//  UPDATE
//
EntityUpdate = function(dt){
    if(rotateCheckbox.html().checked){
        cancer.yaw += Number(rotateSpeed.html().value);
    }
}



Application = function(){
    //Graphics Initializtion
    OBJWebGLInit();
    
    //Initilalize File Input
    FileInit();
    
    
}