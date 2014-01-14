
//HTML Elements

BiopsyWebGLInit = function(){
    
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
    
    //Setup Input Controls
    Input = {
        Mouse: {
            lastX: 0,
            lastY: 0,
            pressed: false
        }
    }
    onKeyDown = function(e){
        
        
        if(BiopsyInput.Mode == "MODELVIEWER"){
            BiopsyInput.ModelView.Keypress(e);
        }
        else if(BiopsyInput.Mode == "IMAGEEDITOR"){
            BiopsyInput.ImageEditor.Keypress(e);
        }
        
    }
    onMouseDown = function(e){
        Input.Mouse.pressed = true;
        
        if(BiopsyInput.Mode == "MODELVIEWER"){
            BiopsyInput.ModelView.MouseDown(e);
        }
        else if(BiopsyInput.Mode == "IMAGEEDITOR"){
            BiopsyInput.ImageEditor.MouseDown(e);
        }
        
        Input.Mouse.lastX = e.clientX;
        Input.Mouse.lastY = e.clientY;
    }
    
    onMouseUp = function(e){
        Input.Mouse.pressed = false;
        
        if(BiopsyInput.Mode == "MODELVIEWER"){
            BiopsyInput.ModelView.MouseUp(e);
        }
        else if(BiopsyInput.Mode == "IMAGEEDITOR"){
            BiopsyInput.ImageEditor.MouseUp(e);
        }
    }
    
    onMouseMove = function(e){
        
        if (!Input.Mouse.pressed) {
            return;
        }
        
        
        if(BiopsyInput.Mode == "MODELVIEWER"){
            BiopsyInput.ModelView.MouseMove(e);
        }
        else if(BiopsyInput.Mode == "IMAGEEDITOR"){
            BiopsyInput.ImageEditor.MouseMove(e);
        }
        
        
        Input.Mouse.lastX = e.clientX
        Input.Mouse.lastY = e.clientY;  
        
        
         
    }
    onMouseWheel = function(e){
        
        if(BiopsyInput.Mode == "MODELVIEWER"){
            BiopsyInput.ModelView.MouseWheelMove(e);
        }
        else if(BiopsyInput.Mode == "IMAGEEDITOR"){
            BiopsyInput.ImageEditor.Editor.MouseWheelMove(e);
        }
    }
    
    
    // Setup Event Handlers for User Input
    window.addEventListener("keydown", onKeyDown, false);
    os.graphics.Get.Canvas().addEventListener("mousedown", onMouseDown, false);
    document.addEventListener("mouseup", onMouseUp, false);
    document.addEventListener("mousemove", onMouseMove, false);
    //document.addEventListener("mousewheel", onMouseWheel, false);

    
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
    //document.getElementById("imgFile").addEventListener("change", onFileChanged);
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
    json = "";
    var reader = new FileReader();
    
    reader.onload = function(evt){
        //var resultText = evt.target.result;
        json = BuildJSON(ParseOBJ(evt.target.result));
        AddEntityFromJSON(json);
        BiopsyInput.Mode = "MODELVIEWER"
    }
    
    reader.readAsText(file);
    
    
    
}
LoadMeshFile = function(file){
    os.console.Comment("Loading Mesh: " + file.name);

    //var objectURL = window.webkitURL.createObjectURL(file);
    //os.console.Comment("File Path: " + objectURL);
    //os.graphics.Managers.Mesh.Create.Mesh("mesh", objectURL);
    //
    //AddEntity("mesh");
    //BiopsyInput.Mode = "MODELVIEWER"
    
    json = "";
    var reader = new FileReader();
    
    reader.onload = function(evt){
        json = [JSON.parse(evt.target.result)];
        AddEntityFromJSON(json);
        BiopsyInput.Mode = "MODELVIEWER"
    }
    
    reader.readAsText(file);
    
    
    
}

LoadImageFile = function(file){
    os.console.Comment("Loading Image: " + file.name);
    var reader = new FileReader();
    
    BiopsyInput.Mode = "IMAGEEDITOR";
    
    reader.onload = function(evt){
        var resultdata = evt.target.result;
        
        var img = new Image();
        img.src = event.target.result;
        setTimeout(function(){
            var ent = new CImage();
            ent.img = img;
            
            ent.width = img.width;
            ent.height = img.height;
            ent.nativeWidth = img.width;
            ent.nativeHeight = img.height;
            ent.halfWidth = (img.width / 2 | 0);
            ent.halfHeight = (img.height / 2 | 0);
            ent.Rotation = 0;//3.14/2;
            ImageEditor.Scene.Entities.push(ent);
            
            //Loop through all entities and set scene size to 2 * largest entity
            //  dimension
            for(var i = 0; i < ImageEditor.Scene.Entities.length; i++){
                if (ImageEditor.Scene.width < 2 * ImageEditor.Scene.Entities[i].width)
                    ImageEditor.Scene.width = 2 * ImageEditor.Scene.Entities[i].width;
            }
            
            ImageEditor.Scene.height = ImageEditor.Scene.width;
            
            //ent.Position.x = ImageEditor.Scene.width / 2;
            //ent.Position.y = ImageEditor.Scene.height / 2;
            
            ent.Position.x = 0;//360;//ImageEditor.Scene.width / 2 - ent.halfWidth;
            ent.Position.y = 0;//270;//ImageEditor.Scene.height / 2 - ent.halfHeight;
            
            //Set scene scale
            ImageEditor.Scene.scaleWidth =  ImageEditor.Scene.canvas.html().width / ImageEditor.Scene.width;
            ImageEditor.Scene.scaleHeight = ImageEditor.Scene.canvas.html().height / ImageEditor.Scene.height;
            
            ImageEditor.MiniMap.scaleWidth = ImageEditor.MiniMap.canvas.html().width / ImageEditor.Scene.width;
            ImageEditor.MiniMap.scaleHeight = ImageEditor.MiniMap.canvas.html().height / ImageEditor.Scene.height;
            
            ImageEditor.Viewport.scale = 1;
            ImageEditor.Viewport.Position.x = 0;//ImageEditor.Scene.width / 2;
            ImageEditor.Viewport.Position.y = 0;//ImageEditor.Scene.height / 2;
            ImageEditor.Update();
            img.style.width = "100px";
        img.style.width = "100px";
        document.getElementById("thumbnail-window").appendChild(img);
        }, 100)
        
        
        //var tex = os.graphics.Managers.Texture.Create.Texture("mesh", img.src);
        //cancer.Graphics.Add.Texture("mesh");
        //cancer.Graphics.Set.texture(true);
        //cancer.Graphics.Set.useBlendColor(false);
        //tex.Initialize();
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

    cancer.Graphics.Set.texture(false);
    cancer.Set.Scale(1,1,1);
    cancer.Set.Position(0,0,0);
    cancer.Graphics.Set.useBlendColor(true);
    cancer.Graphics.Set.blendColor([0.5, 0.5, 0.5]);
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

//
//  UPDATE
//
EntityUpdate = function(dt){
    if(rotateCheckbox.html().checked){
        cancer.yaw += Number(rotateSpeed.html().value);
    }
}

//
//  Image Editor
//
ImageEditor = {
    CalculateIntersection: function(vRayOrigin, vRayPoint, vSegOrigin, vSegEnd ){
        var intersection = null;

        var t = null;
        var s = -1;
        
        var segDir = [];
        vec3.subtract(vSegEnd, vSegOrigin, segDir);
        
        var segNorm = [];
        segNorm[0] = segDir[1];
        segNorm[1] = -segDir[0];
        segNorm[2] = 0;
        
        var rayDir = [];
        vec3.subtract(vRayPoint, vRayOrigin, rayDir);
        
        var rayNormDot = vec3.dot(segNorm, rayDir);
        
        if(rayNormDot != 0){
            var raySeg = [];
            vec3.subtract(vSegOrigin, vRayOrigin, raySeg);
            
            t = (vec3.dot(segNorm, raySeg)) / (rayNormDot);
            if(t >= 0 ){
                var segPoint = [];
                vec3.scale(rayDir, t, segPoint);
                vec3.add(vRayOrigin, segPoint, segPoint);
                
                if( Math.min(vSegEnd[0], vSegOrigin[0]) <= segPoint[0] && Math.max(vSegEnd[0], vSegOrigin[0])){//(s >= 0.0)){// && (s <= 1.0)){
                    if( Math.min(vSegEnd[1], vSegOrigin[1]) <= segPoint[1] && Math.max(vSegEnd[1], vSegOrigin[1])){
                        intersection = segPoint;
                    }
                }
            }
            
        }
        
        return intersection;
    },
    IntersectionWithEdge: function(oEdge, oPoint){
        var point = null;
        for(var i = oEdge.Points.length - 1; i > 0; i--){
            if(point == null){
                point = ImageEditor.CalculateIntersection([oEdge.Center.x, oEdge.Center.y, 0], [oPoint.x, oPoint.y, 0],[oEdge.Points[i].x, oEdge.Points[i].y, 0], [oEdge.Points[i-1].x, oEdge.Points[i-1].y, 0] );
            }
        }
        
        if(point == null){
            point = ImageEditor.CalculateIntersection([oEdge.Center.x, oEdge.Center.y, 0], [oPoint.x, oPoint.y, 0],[oEdge.Points[0].x, oEdge.Points[0].y, 0], [oEdge.Points[oEdge.Points.length-1].x, oEdge.Points[oEdge.Points.length-1].y, 0] );
        }
        
        return point;
    },
    Launch: function(){
        WinScene.Display.window();
        WinMiniMap.Display.window();
    },
    Scene: {
        canvas: null,
        ctx: null,
        scaleWidth: 1.0,
        scaleHeight: 1.0,
        width: 1,
        height: 1,
        Entities: [],
        Draw: function(){
            //Clear the Scene
            ImageEditor.Scene.Clear();
   
            //Save Draw States and Transforms
            ImageEditor.Scene.ctx.save();
        
            //Set Scale for Scene
            //ImageEditor.Scene.ctx.translate(-ImageEditor.Viewport.Position.x,-ImageEditor.Viewport.Position.y);
            //ImageEditor.Scene.ctx.translate(-ImageEditor.Viewport.width/2 ,-ImageEditor.Viewport.height/2);
            //ImageEditor.Scene.ctx.translate(ImageEditor.Scene.canvas.html().width/2, ImageEditor.Scene.canvas.html().height/2);
            //ImageEditor.Scene.ctx.translate(ImageEditor.Scene.width/2, ImageEditor.Scene.height/2);
            ImageEditor.Scene.ctx.scale(ImageEditor.Scene.scaleWidth, ImageEditor.Scene.scaleHeight);
            //ImageEditor.Scene.ctx.translate(ImageEditor.Scene.width/2, ImageEditor.Scene.height/2);
            //ImageEditor.Scene.ctx.translate(ImageEditor.Viewport.Position.x + ImageEditor.Viewport.width/2 ,ImageEditor.Viewport.Position.y + ImageEditor.Viewport.height/2);
            ImageEditor.Scene.ctx.scale(ImageEditor.Viewport.scaleWidth , ImageEditor.Viewport.scaleHeight);
            //ImageEditor.Scene.ctx.translate(-ImageEditor.Viewport.width/2, -ImageEditor.Viewport.height/2);
            //ImageEditor.Scene.ctx.translate(-(ImageEditor.Viewport.Position.x + ImageEditor.Viewport.width/2) ,-(ImageEditor.Viewport.Position.y + ImageEditor.Viewport.height/2));
            //ImageEditor.Scene.ctx.scale(ImageEditor.Viewport.scaleWidth , ImageEditor.Viewport.scaleHeight);
            //ImageEditor.Scene.ctx.translate(-(ImageEditor.Scene.width * ImageEditor.Viewport.scaleWidth)/2, -(ImageEditor.Scene.height * ImageEditor.Viewport.scaleHeight)/2);
            //ImageEditor.Scene.ctx.translate(-ImageEditor.Scene.width/2, -ImageEditor.Scene.height/2);
            //ImageEditor.Scene.ctx.translate(-(ImageEditor.Scene.canvas.html().width / (ImageEditor.Scene.scaleWidth * ImageEditor.Viewport.scaleWidth))/2, -(ImageEditor.Scene.canvas.html().height / (ImageEditor.Scene.scaleHeight * ImageEditor.Viewport.scaleHeight))/2)
            
            //ImageEditor.Scene.ctx.translate(-(ImageEditor.Viewport.Position.x + ImageEditor.Viewport.width/2) ,-(ImageEditor.Viewport.Position.y + ImageEditor.Viewport.height/2));
            //ImageEditor.Scene.ctx.translate(ImageEditor.Viewport.Position.x + ImageEditor.Viewport.width/2 ,ImageEditor.Viewport.Position.y + ImageEditor.Viewport.height/2);
            //ImageEditor.Scene.ctx.scale(ImageEditor.Viewport.scale, ImageEditor.Viewport.scale);
            ImageEditor.Scene.ctx.translate(-ImageEditor.Viewport.Position.x, -ImageEditor.Viewport.Position.y);
            //ImageEditor.Scene.ctx.scale(ImageEditor.Viewport.scaleWidth , ImageEditor.Viewport.scaleHeight);
            //ImageEditor.Scene.ctx.translate(ImageEditor.Viewport.Position.x, ImageEditor.Viewport.Position.y);
            //ImageEditor.Scene.ctx.scale(ImageEditor.Scene.scaleWidth, ImageEditor.Scene.scaleHeight);
            //ImageEditor.Scene.ctx.translate(-(ImageEditor.Viewport.width/2) ,-(ImageEditor.Viewport.height/2));
            
            //Loop through scene entities and Draw Images
            for(var i = 0; i < ImageEditor.Scene.Entities.length; i++){
                ImageEditor.Scene.Entities[i].Draw(ImageEditor.Scene.ctx);
            }
            
            //ImageEditor.Scene.ctx.translate(-ImageEditor.Viewport.Position.x - ImageEditor.Viewport.width/2 ,-ImageEditor.Viewport.Position.y - ImageEditor.Viewport.height/2);
            
            //ImageEditor.Scene.ctx.globalAlpha = 0.5
            ImageEditor.Scene.Entities[i-1].Outline(ImageEditor.Scene.ctx,2, "red");
            //ImageEditor.Scene.ctx.globalAlpha = 0.0
            
            //Restore States and Transforms
            ImageEditor.Scene.ctx.restore();
            
            
        },
        Clear: function(){
            //  Test performance of clearRect to set Width
            //ImageEditor.Scene.canvas.html().width = ImageEditor.Scene.canvas.html().width;
            
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#transformations
            //Set Transform(a,b,c,d,e,f)
            //  a	c	e
            //  b	d	f
            //  0	0	1

            ImageEditor.Scene.ctx.save();
            ImageEditor.Scene.ctx.setTransform(1, 0, 0, 1, 0, 0);
            ImageEditor.Scene.ctx.clearRect(0, 0, ImageEditor.Scene.width, ImageEditor.Scene.height);
            
            ImageEditor.Scene.ctx.strokeStyle = "black";
            ImageEditor.Scene.ctx.fillStyle = "black";
            ImageEditor.Scene.ctx.lineWidth = 1;
            ImageEditor.Scene.ctx.strokeRect(0, 0, ImageEditor.Scene.width, ImageEditor.Scene.height);
            ImageEditor.Scene.ctx.restore();
        }
    },
    MiniMap: {
        canvas: null,
        ctx: null,
        width: 1,
        height: 1,
        scaleWidth: 1,
        scaleHeight: 1,
        Draw: function(){
            //Clear the Scene
            ImageEditor.MiniMap.Clear();
            
            //Save Draw States and Transforms
            ImageEditor.MiniMap.ctx.save();
            
            //Set Scale for Scene
            ImageEditor.MiniMap.ctx.scale(ImageEditor.MiniMap.scaleWidth, ImageEditor.MiniMap.scaleHeight);
            
            //Loop through scene entities and Draw Images
            for(var i = 0; i < ImageEditor.Scene.Entities.length; i++){
                ImageEditor.Scene.Entities[i].Draw(ImageEditor.MiniMap.ctx);
            }
            
            //Save Draw States and Transforms
            ImageEditor.MiniMap.ctx.restore();
            
            //
            //  Draw Viewport Box
            //
            
            ImageEditor.MiniMap.ctx.save();
            
                //Set Box Color
            ImageEditor.MiniMap.ctx.strokeStyle = "red";
            
                //Get get position of Viewport in MiniMap
            //var vp = ImageEditor.Convert.ViewportTo.MiniMap(ImageEditor.Viewport.Position.x, ImageEditor.Viewport.Position.y);
            //var br = ImageEditor.Convert.SceneTo.MiniMap(ImageEditor.Viewport.Position.x + ImageEditor.Viewport.width/2, ImageEditor.Viewport.Position.y + ImageEditor.Viewport.height /2)
            
            var vp = ImageEditor.Convert.SceneTo.MiniMap(ImageEditor.Viewport.Position.x, ImageEditor.Viewport.Position.y);
            var br = ImageEditor.Convert.SceneTo.MiniMap(ImageEditor.Viewport.Position.x + ImageEditor.Viewport.width, ImageEditor.Viewport.Position.y + ImageEditor.Viewport.height)
                 
                //Calculate Viewport width and height in MiniMap
            //var width = br.x - vp.x; //ImageEditor.MiniMap.width / ImageEditor.Viewport.scale;//
            //var height = br.y - vp.y; //ImageEditor.MiniMap.height / ImageEditor.Viewport.scale;//
            
            //var width = ImageEditor.MiniMap.width / ImageEditor.Viewport.scale;//
            //var height = ImageEditor.MiniMap.height / ImageEditor.Viewport.scale;//
            
            var width  = br.x - vp.x; //ImageEditor.MiniMap.width / ImageEditor.Viewport.scale;//
            var height = br.y - vp.y; //ImageEditor.MiniMap.height / ImageEditor.Viewport.scale;//
            
                //Clip width and height to MiniMap boundaries
            if(vp.x + width > ImageEditor.MiniMap.width){ width = ImageEditor.MiniMap.width - vp.x; }
            if(vp.y + height > ImageEditor.MiniMap.height){ height = ImageEditor.MiniMap.height - vp.y; }
            
                //Draw Viewport on MiniMap
            ImageEditor.MiniMap.ctx.strokeRect(vp.x, vp.y,  width, height);
            //ImageEditor.MiniMap.ctx.translate(vp.x, vp.y);
            //ImageEditor.MiniMap.ctx.strokeRect(-width/2, -height/2, width, height );
            
            ImageEditor.MiniMap.ctx.restore();
        },
        Clear: function(){
            ImageEditor.MiniMap.ctx.save();
            ImageEditor.MiniMap.ctx.setTransform(1, 0, 0, 1, 0, 0);
            ImageEditor.MiniMap.ctx.clearRect(0, 0, ImageEditor.MiniMap.width, ImageEditor.MiniMap.height);
            ImageEditor.MiniMap.ctx.strokeStyle = "black";
            ImageEditor.MiniMap.ctx.fillStyle = "black";
            ImageEditor.MiniMap.ctx.lineWidth = 1;
            ImageEditor.MiniMap.ctx.strokeRect(0, 0, ImageEditor.MiniMap.width, ImageEditor.MiniMap.height);
            ImageEditor.MiniMap.ctx.restore();
        }
    },
    Viewport: {
        Position: {
            x: 0,
            y: 0
        },
        canvas: null,
        ctx: null,
        width: 1,
        height: 1,
        halfWidth: 1,
        halfHeight: 1,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        scale: 1,
        scaleWidth: 1,
        scaleHeight: 1,
        Update: function(){
            ImageEditor.Viewport.width = ImageEditor.Scene.width / ImageEditor.Viewport.scaleWidth;
            ImageEditor.Viewport.height = ImageEditor.Scene.height / ImageEditor.Viewport.scaleHeight;
            ImageEditor.Viewport.halfWidth = ImageEditor.Viewport.width/2;
            ImageEditor.Viewport.halfHeight = ImageEditor.Viewport.height/2;
            
            //ImageEditor.Viewport.width = ImageEditor.Scene.canvas.html().width / ImageEditor.Scene.scaleWidth / ImageEditor.Viewport.scale;//ImageEditor.Scene.width / ImageEditor.Viewport.scale;
            //ImageEditor.Viewport.height = ImageEditor.Scene.canvas.html().height / ImageEditor.Scene.scaleHeight / ImageEditor.Viewport.scale;
            //ImageEditor.Viewport.Clear();
            //
            //ImageEditor.Viewport.ctx.save();
            ////Set Scale for Scene
            //ImageEditor.Viewport.ctx.scale(ImageEditor.Scene.scaleWidth, ImageEditor.Scene.scaleHeight);
            //ImageEditor.Viewport.ctx.translate(ImageEditor.Viewport.Position.x, ImageEditor.Viewport.Position.y);
            //
            //ImageEditor.Viewport.ctx.scale(ImageEditor.Viewport.scale, ImageEditor.Viewport.scale);
            //
            ////ImageEditor.Viewport.ctx.drawImage(ImageEditor.Scene.ctx, -ImageEditor.Scene.canvas.html().width/2, -ImageEditor.Scene.canvas.html().height/2);
            //ImageEditor.Viewport.ctx.drawImage(ImageEditor.Scene.ctx.canvas, -ImageEditor.Scene.canvas.html().width/2, -ImageEditor.Scene.canvas.html().height/2);
            //ImageEditor.Viewport.ctx.restore();
        },
        Clear: function(){
            ImageEditor.Viewport.ctx.save();
            ImageEditor.Viewport.ctx.setTransform(1, 0, 0, 1, 0, 0);
            ImageEditor.Viewport.ctx.clearRect(0, 0, ImageEditor.Scene.width, ImageEditor.Scene.height);
            
            //ImageEditor.Scene.ctx.strokeStyle = "black";
            //ImageEditor.Scene.ctx.fillStyle = "black";
            //ImageEditor.Scene.ctx.lineWidth = 1;
            //ImageEditor.Scene.ctx.strokeRect(0, 0, 500, 500);
            ImageEditor.Viewport.ctx.restore();
        }
        
    },
    Convert: {
        MiniMapTo: {
            Viewport: function(x, y){
                var out = {
                    x: 0,
                    y: 0
                }
                //out.x = x * 1 / ImageEditor.MiniMap.scaleWidth * ImageEditor.Viewport.scale;
                //out.y = y * 1 / ImageEditor.MiniMap.scaleHeight * ImageEditor.Viewport.scale;
                //out.x = x  * (ImageEditor.Scene.scaleWidth  / ImageEditor.MiniMap.scaleWidth)  * ImageEditor.Viewport.scaleWidth;
                //out.y = y  * (ImageEditor.Scene.scaleHeight / ImageEditor.MiniMap.scaleHeight) * ImageEditor.Viewport.scaleHeight;
                
                //Convert to Scene
                out = ImageEditor.Convert.MiniMapTo.Scene(x,y);
                
                //Scene To Viewport
                out = ImageEditor.Convert.SceneTo.Viewport(out.x, out.y);
                
                return out;
            },
            Scene: function(x, y){
                var out = {
                    x: 0,
                    y: 0
                }
                out.x = x / ImageEditor.MiniMap.scaleWidth;
                out.y = y / ImageEditor.MiniMap.scaleHeight;
                
                return out;
            }
        },
        ViewportTo: {
            MiniMap: function(x,y){
                var out = {
                    x: 0,
                    y: 0
                }
                //out = ImageEditor.Convert.ViewportTo.Scene(x,y);
                //out.x = out.x * ImageEditor.MiniMap.scaleWidth / ImageEditor.Viewport.scale;
                //out.y = out.y * ImageEditor.MiniMap.scaleHeight / ImageEditor.Viewport.scale;
                
                //out.x = x * (ImageEditor.MiniMap.scaleWidth  / ImageEditor.Scene.scaleWidth)  / ImageEditor.Viewport.scaleWidth;
                //out.y = y * (ImageEditor.MiniMap.scaleHeight / ImageEditor.Scene.scaleHeight) / ImageEditor.Viewport.scaleHeight;
                
                //Convert to Scene
                out = ImageEditor.Convert.ViewportTo.Scene(x,y);
                
                //Scene To MiniMap
                out = ImageEditor.Convert.SceneTo.MiniMap(out.x, out.y);
                
                return out;
            },
            Scene: function(x,y){
                var out = {
                    x: 0,
                    y: 0
                }
                //out.x = ((x - ImageEditor.Viewport.Position.x) / ImageEditor.Scene.scaleWidth + ImageEditor.Viewport.Position.x) | 0;
                //out.y = ((y - ImageEditor.Viewport.Position.y) / ImageEditor.Scene.scaleHeight + ImageEditor.Viewport.Position.y) | 0;
                
                //out.x = (x * ImageEditor.Viewport.scaleWidth  / ImageEditor.Scene.width) -  ImageEditor.Viewport.Position.x;
                //out.y = (y * ImageEditor.Viewport.scaleHeight / ImageEditor.Scene.height) - ImageEditor.Viewport.Position.y;
                
                out.x = x * ImageEditor.Viewport.width  / ImageEditor.Scene.canvas.html().width  + ImageEditor.Viewport.Position.x;
                out.y = y * ImageEditor.Viewport.height / ImageEditor.Scene.canvas.html().height + ImageEditor.Viewport.Position.y;
                return out;
            }
        },
        SceneTo: {
            MiniMap: function(x,y){
                var out = {
                    x: 0,
                    y: 0
                }
                out.x = x * ImageEditor.MiniMap.scaleWidth;
                out.y = y * ImageEditor.MiniMap.scaleHeight;
                
                return out;
            },
            Viewport: function(x, y){
                var out = {
                    x: 0,
                    y: 0
                }
                //out.x = x  * ImageEditor.Viewport.scale;
                //out.y = y  * ImageEditor.Viewport.scale;
                
                //out.x = x  * ImageEditor.Scene.scaleWidth  / ImageEditor.Viewport.scaleWidth;
                //out.y = y  * ImageEditor.Scene.scaleHeight / ImageEditor.Viewport.scaleHeight;
                
                out.x = (x - ImageEditor.Viewport.Position.x) * ImageEditor.Scene.canvas.html().width  / ImageEditor.Viewport.width;
                out.y = (y - ImageEditor.Viewport.Position.y) * ImageEditor.Scene.canvas.html().height / ImageEditor.Viewport.height;
                
                return out;
            }
        }
    },
    EditControls: {
        cropping: false,
        cropStart: 0,
        cropStop: 0
    },
    Initialize: function(){
        
        //Set Up ImageEditor Window
        WinScene = os.windows.WindowsManager.Create.Window("Image Editor", "PC");
        WinScene.elements.content.html().style.overflow = "hidden";
        WinScene.Callbacks.onMin = function(){
            //WinScene.Hide.statusbar();
            WinScene.Hide.menubar();
        }
        WinScene.Set.statusbarText("");
        //WinScene.Display.window();
        WinScene.Set.height(678);
        WinScene.Set.width(800);
        WinScene.Display.titlebar();
        //WinScene.Hide.statusbar();
        WinScene.Hide.menubar();
        WinScene.Set.position(16,45)
        //WinScene.Minimize();
        WinScene.elements.titlebar.buttons.close.html().onclick = function(e){
            WinScene.Hide.window();    
        }
        
        //Load up Tool bar Icons
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/OpenFile.png", "Open Image",WinScene, ImageEditor.SetMode.OpenFile);
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/SaveCanvas.png", "Save Canvas",WinScene, ImageEditor.SetMode.SaveCanvas);
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/SaveImage.png", "Save Selected Image",WinScene, ImageEditor.SaveImage);
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/MousePointer.png", "Select Image",WinScene, ImageEditor.SetMode.Select);
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/Pan.png", "Pan Canvas",WinScene, ImageEditor.SetMode.Pan);
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/Move.png", "Move Image",WinScene, ImageEditor.SetMode.Move);
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/Crop.png", "Crop",WinScene, ImageEditor.SetMode.Crop);
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/CurvePoints.png", "Trace",WinScene, ImageEditor.SetMode.Trace);
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/FlipHorizontally.png", "Flip Horizontal",WinScene, ImageEditor.SetMode.MirrorHorizontal);
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/FlipVertical.png", "Flip Vertical",WinScene, ImageEditor.SetMode.MirrorVertical);
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/RotateCCW.png", "Rotate Left",WinScene, ImageEditor.SetMode.RotateCCW);
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/RotateCW.png", "Rotate Right",WinScene, ImageEditor.SetMode.RotateCW);
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/Rotation.png", "Rotate with Mouse",WinScene, ImageEditor.SetMode.RotateWithMouse);
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/StretchLeft-right.png", "Stretch Width",WinScene, ImageEditor.SetMode.StretchWidth);
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/StretchUp-down.png", "Stretch Height",WinScene, ImageEditor.SetMode.StretchHeight);
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/ResizeImage.png", "Scale Image",WinScene, ImageEditor.SetMode.StretchImage);
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/Extents.png", "Extents",WinScene, ImageEditor.Extents);
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/ZoomIn.png", "Zoom In",WinScene, ImageEditor.SetMode.ZoomIn);
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/ZoomOut.png", "Zoom Out",WinScene, ImageEditor.SetMode.ZoomOut);
        ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/BuildCancers.png", "Build 3D Cancer Models",WinScene, ImageEditor.BuildCancers);
        
        //Set Up ImageEditor Window
        WinMiniMap = os.windows.WindowsManager.Create.Window("Mini Map", "PC");
        WinMiniMap.elements.content.html().style.overflow = "hidden";
        WinMiniMap.Callbacks.onMin = function(){
            WinMiniMap.Hide.statusbar();
            WinMiniMap.Hide.menubar();
            
        }
        WinMiniMap.Set.statusbarText("");
        //WinMiniMap.Display.window();
        WinMiniMap.Set.width(150);
        WinMiniMap.Set.height(170);
        WinMiniMap.Display.titlebar();
        WinMiniMap.Hide.statusbar();
        WinMiniMap.Hide.menubar();
        WinMiniMap.Hide.toolbar();
        //WinMiniMap.Set.position(75,100);
        WinMiniMap.Set.position(131,854);
        //WinMiniMap.Minimize();
        WinMiniMap.elements.titlebar.buttons.close.html().onclick = function(e){
            WinMiniMap.Hide.window();    
        }
    
        //
        //Build Scene Canvas
        //
        ImageEditor.Scene.canvas = os.resschmgr.Create.HTMLElement("canvas");
        ImageEditor.Scene.ctx = ImageEditor.Scene.canvas.html().getContext('2d');
        ImageEditor.Scene.ctx.setTransform(1, 0, 0, 1, 0, 0);
        ImageEditor.Scene.canvas.html().width = 800;
        ImageEditor.Scene.canvas.html().height = 800;
        ImageEditor.Scene.width = 800;
        ImageEditor.Scene.height = 800;
        ImageEditor.Scene.canvas.AppendTo(WinScene.elements.content.html());
        WinScene.Set.height(678);
        //
        //Build Minimap Canvas
        //
        ImageEditor.MiniMap.canvas = os.resschmgr.Create.HTMLElement("canvas");
        ImageEditor.MiniMap.ctx = ImageEditor.MiniMap.canvas.html().getContext('2d');
        
        //Default width and height is 10% of Scene canvas
        ImageEditor.MiniMap.canvas.html().width = 150;;
        ImageEditor.MiniMap.canvas.html().height = 150;;
        ImageEditor.MiniMap.ctx.setTransform(1, 0, 0, 1, 0, 0);
        ImageEditor.MiniMap.width = 150;
        ImageEditor.MiniMap.height = 150;;
        
        ImageEditor.MiniMap.canvas.AppendTo(WinMiniMap.elements.content.html());
        
        ImageEditor.Scene.canvas.html().addEventListener("mousewheel", BiopsyInput.ImageEditor.Editor.MouseWheelMove, false);
        ImageEditor.MiniMap.canvas.html().addEventListener("mousedown", BiopsyInput.ImageEditor.MiniMap.MouseDown, false);
        ImageEditor.Scene.canvas.html().addEventListener("mousedown", BiopsyInput.ImageEditor.Editor.MouseDown,false);
        document.addEventListener("mouseup", BiopsyInput.ImageEditor.Editor.MouseUp, false);
        document.addEventListener("mousemove", BiopsyInput.ImageEditor.Editor.MouseMove, false);
        window.addEventListener("keyup", BiopsyInput.ImageEditor.KeyUp, false);
    },
    AddToolbarImage: function(path, tooltip, win, callback){
        
        var img = new Image();
        img.src = path;
        img.alt = tooltip;
        img.title = tooltip;
        img.onclick = callback;
        
        
        var a = document.createElement("a");
        a.onmouseover = function(){
            WinScene.Set.statusbarText(tooltip);
        }
        
        a.onmouseout = function(){
            WinScene.Set.statusbarText(BiopsyInput.ImageEditor.Editor.Mode);
        }
        
        
        a.appendChild(img);
        
        win.elements.toolbar.AppendChild(a);
    },
    Update: function(){
        
        //Update Viewport Properties
        ImageEditor.Viewport.Update();
            
        //Draw the scene
        ImageEditor.Scene.Draw();
        
        //Draw the MiniMap
        ImageEditor.MiniMap.Draw();
    
    },
    SelectImage: function(x,y){
        
        var picked = false;
        var i = ImageEditor.Scene.Entities.length - 1;
        var pt, tl, tr, bl, br;
        var img = null;
        var v1DotPt, v2DotPt, v3DotPt, v4DotPt;
        
        while((i >= 0) && (!picked)){
            img = ImageEditor.Scene.Entities[i];
            pt = img.SceneToLocal(x,y);
            
            if(img.Mask){
                
                var cos45 = Math.cos(45);
                var v1 = {
                    x: img.Mask.br.x - img.Mask.tl.x,
                    y: img.Mask.br.y - img.Mask.tl.x
                }
                
                var v1Mag = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
                var pt2tl = {
                    x: pt.x - img.Mask.tl.x,
                    y: pt.y - img.Mask.tl.y
                }
                var pt2tlMag = Math.sqrt(pt2tl.x * pt2tl.x + pt2tl.y * pt2tl.y);
                
                var pt2br = {
                    x: pt.x - img.Mask.br.x,
                    y: pt.y - img.Mask.br.y
                }
                var pt2brMag = Math.sqrt(pt2br.x * pt2br.x + pt2br.y * pt2br.y);
                
                var v1DotPt2tl = (v1.x * pt2tl.x + v1.y * pt2tl.y);
                var v1DotPt2br = (-v1.x * pt2br.x - v1.y * pt2br.y);
                
                var tlTest = v1DotPt2tl / (v1Mag * pt2tlMag);
                var brTest = v1DotPt2br / (v1Mag * pt2brMag);
                
                if( tlTest >= cos45 && brTest >= cos45){
                    
                    picked = true;
                }
                else{
                   i--; 
                }
                
                
            }
            else{
                //tl = {x: 0, y:0};
                //tr = {x: img.width, y:0};
                //bl = {x: 0, y: img.height};
                //br = {x: img.width, y: img.height};
                
                if( pt.x > 0 && pt.y > 0 && pt.x < img.width && pt.y < img.height ){
                    
                    picked = true;
                }
                else{
                   i--; 
                }
            }
            
            
            
            
            
            
        }
        
        if(picked)
        {
            os.console.Comment("Image Was Picked");
            ImageEditor.Scene.Entities.push(ImageEditor.Scene.Entities.splice(i,1)[0]);
            ImageEditor.Update();
        }
    },
    GetSelectedImage: function(){
        return  ImageEditor.Scene.Entities[ImageEditor.Scene.Entities.length - 1]
    },
    CropImage: function(){
        var img = ImageEditor.GetSelectedImage();
        
        //var start ={}, stop = {};
        //var start = img.SceneToLocal(ImageEditor.EditControls.cropStart.x, ImageEditor.EditControls.cropStart.y);
        //var stop  = img.SceneToLocal(ImageEditor.EditControls.cropStop.x,  ImageEditor.EditControls.cropStop.y );
        
        var width  = ImageEditor.EditControls.cropStop.x - ImageEditor.EditControls.cropStart.x;
        var height = ImageEditor.EditControls.cropStop.y - ImageEditor.EditControls.cropStart.y;
        
        var tl = img.SceneToLocal(ImageEditor.EditControls.cropStart.x, ImageEditor.EditControls.cropStart.y);
        var tr = img.SceneToLocal(ImageEditor.EditControls.cropStart.x + width, ImageEditor.EditControls.cropStart.y);
        var br = img.SceneToLocal(ImageEditor.EditControls.cropStop.x,  ImageEditor.EditControls.cropStop.y );
        var bl = img.SceneToLocal(ImageEditor.EditControls.cropStop.x - width,  ImageEditor.EditControls.cropStop.y);
        
        //if(ImageEditor.EditControls.cropStart.x < ImageEditor.EditControls.cropStop.x)
        //    start.x = ImageEditor.EditControls.cropStart.x;
        //    stop.x = ImageEditor.EditControls.cropStop.x;
        //
        //else
        //    stop.x = ImageEditor.EditControls.cropStart.x;
        //    start.x = ImageEditor.EditControls.cropStop.x;   
        //
        //
        //if(ImageEditor.EditControls.cropStart.y < ImageEditor.EditControls.cropStop.y)
        //    start.y = ImageEditor.EditControls.cropStart.y;
        //    stop.y = ImageEditor.EditControls.cropStop.y;
        //
        //else
        //    stop.y = ImageEditor.EditControls.cropStart.y
        //    start.y = ImageEditor.EditControls.cropStop.y;
        //
        
        //var x = start.x;// - (img.Position.x);
        //var y = start.y;// - (img.Position.y)
        //
        ////stop.x = stop.x > img.Position.x + img.width  ? img.Position.x + img.width  : stop.x;
        ////stop.y = stop.y > img.Position.y + img.heigth ? img.Position.y + img.height : stop.y;
        //stop.x = stop.x > img.width  ? img.width  : stop.x;
        //stop.y = stop.y > img.heigth ? img.height : stop.y;
        

        //img.Mask ={};
        //img.Mask.Rotation = 0;//img.Rotation;
        //img.Mask.start = ImageEditor.EditControls.cropStart;//start;
        //img.Mask.stop =  ImageEditor.EditControls.cropStop;//stop;
        
        img.Mask ={};
        //img.Mask.Rotation = img.Rotation;
        //img.Mask.start = start;
        //img.Mask.stop =  stop;
        
        img.Mask.tl = tl;
        img.Mask.tr = tr;
        img.Mask.br = br;
        img.Mask.bl = bl;
        
        //img.Mask.width  = ImageEditor.EditControls.cropStop.x - ImageEditor.EditControls.cropStart.x;
        //img.Mask.height = ImageEditor.EditControls.cropStop.y - ImageEditor.EditControls.cropStart.y;

        
        BiopsyInput.ImageEditor.Editor.Mode = ""
        
        ImageEditor.Update();
    },
    SaveImage: function(){
        var filename = prompt("Enter Filename");
        var img = ImageEditor.GetSelectedImage();
        
        ImageEditor.Scene.ctx.save();
        var defaultWidth = ImageEditor.Scene.canvas.html().width;
        var defaultHeight = ImageEditor.Scene.canvas.html().height;
        ImageEditor.Scene.canvas.html().width = img.width
        ImageEditor.Scene.canvas.html().height = img.height;
        var context = ImageEditor.Scene.ctx;
        var tempRot = img.Rotation;
        var tempScaleX = img.Scale.x;
        var tempScaleY = img.Scale.y;
        var tempPosX = img.Position.x;
        var tempPosY = img.Position.y;
        
        img.Position.x = 0;
        img.Position.y = 0;
        
        img.Scale.x = img.Scale.x / Math.abs(img.Scale.x);
        img.Scale.y = img.Scale.y / Math.abs(img.Scale.y);
            
        if(img.Mask){
            var vector = {x: img.Mask.tr.x - img.Mask.tl.x, y: img.Mask.tr.y - img.Mask.tl.y};
            var magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            var theta = Math.acos(vector.x / magnitude);
            img.Rotation = theta;
            
        }
        else{
            img.Rotation = 0;
        }
        
        img.Draw(context);
        
        
        

        
        //Create new local canvas the size and width of crop area
        var canvas = os.resschmgr.Create.HTMLElement("canvas");
        var ctx = canvas.html().getContext('2d');
        var width, height;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        //if(img.Mask)
        //    
        //    
        //    
        //    context.save();
        //
        //    //Place Canvas at center of image for rotation
        //    context.translate(img.halfWidth, img.halfHeight);
        //
        //    //Rotate Image
        //    context.rotate(img.Rotation);
        //    context.scale(img.Scale.x, img.Scale.y);
        //    
        //    //if(this.Mask)
        //        context.translate(-img.halfWidth, -(img.halfHeight));
        //        
        //        //Draw Mask Clipping Path
        //        context.beginPath(); 
        //        context.lineWidth="5";
        //        context.strokeStyle="yellow"; // Green path
        //        context.moveTo(img.Mask.tl.x, img.Mask.tl.y);
        //        context.lineTo(img.Mask.tr.x, img.Mask.tr.y);
        //        context.lineTo(img.Mask.br.x, img.Mask.br.y);
        //        context.lineTo(img.Mask.bl.x, img.Mask.bl.y);
        //        context.closePath();
        //        //ctx.stroke(); // Draw it
        //        context.clip();
        //
        //        //context.translate((this.halfWidth), (this.halfHeight));
        //
        //    //
        //    
        //    //ctx.drawImage(this.img, -this.halfWidth, -this.halfHeight, this.width, this.height);
        //    context.drawImage(img.img, img.Mask.tl.x, img.Mask.tl.y,img.width, img.height);
        //    
        //    if(img.Trace.points.length > 0)
        //        
        //        context.translate(-(this.halfWidth), -(this.halfHeight));
        //        
        //        context.beginPath(); 
        //        context.lineWidth="5";
        //        context.strokeStyle="green"; // Green path
        //        
        //        context.moveTo(img.Trace.points[0].x , img.Trace.points[0].y);
        //        for(var i = 1; i < img.Trace.points.length; i++)
        //            
        //            context.lineTo(img.Trace.points[i].x , img.Trace.points[i].y);
        //        
        //
        //        context.closePath();
        //        context.stroke(); 
        //        
        //    
        //    
        //    
        //    context.restore();
        //
        //    var maskWidth =  Math.sqrt((img.Mask.tl.x - img.Mask.tr.x) * (img.Mask.tl.x - img.Mask.tr.x) + (img.Mask.tl.y - img.Mask.tr.y) * (img.Mask.tl.y - img.Mask.tr.y));
        //    var maskHeight = Math.sqrt((img.Mask.tl.x - img.Mask.bl.x) * (img.Mask.tl.x - img.Mask.bl.x) + (img.Mask.tl.y - img.Mask.bl.y) * (img.Mask.tl.y - img.Mask.bl.y))
        //    width = prompt("What width (Native Width x Height: " + maskWidth + " x " + maskHeight);//img.width;
        //    height = prompt("What height (Native Width x Height: " + maskWidth + " x " + maskHeight);//img.height
        //    
        //    width = width == "" ? maskWidth : width;
        //    height = height == "" ? maskHeight: height;
        //    
        //    //find top left point
        //    var top = img.Mask.tl;
        //    if(img.Mask.tl.x < img.Mask.tr.l)
        //        top = img.Mask.tl;
        //    
        //    if(img.Mask.bl.x < top.x)
        //        top = img.Mask.bl;
        //    
        //    if(img.Mask.br.x < top)
        //        top = img.Mask.br;
        //    
        //    //ctx.translate(img.Mask.tl.x, img.Mask.tl.y);
        //    
        //
        //else
            
            width = prompt("What width (Native Width x Height: " + Math.floor(img.width * Math.abs(img.Scale.x) )+" x "+ Math.floor(img.height * Math.abs(img.Scale.y)));//img.width;
            height = prompt("What height (Native Width x Height: " + Math.floor(img.width * Math.abs(img.Scale.x)) +" x "+ Math.floor(img.height * Math.abs(img.Scale.y)));//img.height
            
            width = width == "" ? img.width * Math.abs(img.Scale.x) : width;
            height = height == "" ? img.height  * Math.abs(img.Scale.y): height;
        //
        canvas.html().width = width;
        canvas.html().height = height;
        
        
            
        //if(img.Mask)
        //    ctx.drawImage(ImageEditor.Scene.canvas.html(), 0, 0, maskWidth, maskHeight,0,0,width, height);
        //
        //else
            ctx.drawImage(ImageEditor.Scene.canvas.html(), 0,0, img.width , img.height,0,0,width, height);
        //
        canvas.html().toBlob(function(blob) {
                    saveAs(blob, filename +".png");
                }, "image/png");
        
        BiopsyInput.ImageEditor.Editor.Mode = "";
        WinScene.Set.statusbarText("");
        
        img.Rotation = tempRot;
        img.Scale.x = tempScaleX;
        img.Scale.y = tempScaleY;
        img.Position.x = tempPosX;
        img.Position.y = tempPosY
        ImageEditor.Scene.canvas.html().width = defaultWidth;
        ImageEditor.Scene.canvas.html().height = defaultHeight;
        ImageEditor.Scene.ctx.restore();
        ImageEditor.Update();
        
    },
    SaveCanvas: function(){
        var filename = prompt("Enter Filename");
        
        //Draw Canavs at With Viewport = 1, with no outlines
            
            //Clear the Scene
            //ImageEditor.Scene.Clear();
            //Save Draw States and Transforms
            ImageEditor.Scene.ctx.save();
            var defaultWidth = ImageEditor.Scene.canvas.html().width;
            var defaultHeight = ImageEditor.Scene.canvas.html().height;
            ImageEditor.Scene.canvas.html().width = ImageEditor.Scene.width;
            ImageEditor.Scene.canvas.html().height = ImageEditor.Scene.height;
            
            //ImageEditor.Scene.ctx.scale(ImageEditor.Scene.scaleWidth, ImageEditor.Scene.scaleHeight);
            //Loop through scene entities and Draw Images
            for(var i = 0; i < ImageEditor.Scene.Entities.length; i++){
                ImageEditor.Scene.Entities[i].Draw(ImageEditor.Scene.ctx);
            }
            //Restore States and Transforms
            ImageEditor.Scene.ctx.restore();
         
        //Adjust Start and Stop of Crop Area
            var start ={}, stop = {};
            if(ImageEditor.EditControls.cropStart.x < ImageEditor.EditControls.cropStop.x){
                start.x = ImageEditor.EditControls.cropStart.x;
                stop.x = ImageEditor.EditControls.cropStop.x;
            }
            else{
                stop.x = ImageEditor.EditControls.cropStart.x;
                start.x = ImageEditor.EditControls.cropStop.x;   
            }
            
            if(ImageEditor.EditControls.cropStart.y < ImageEditor.EditControls.cropStop.y){
                start.y = ImageEditor.EditControls.cropStart.y;
                stop.y = ImageEditor.EditControls.cropStop.y;
            }
            else{
                stop.y = ImageEditor.EditControls.cropStart.y
                start.y = ImageEditor.EditControls.cropStop.y;
            }
        
        //Create new local canvas the size and width of crop area
            var canvas = os.resschmgr.Create.HTMLElement("canvas");
            var ctx = canvas.html().getContext('2d');
            var width = stop.x - start.x;
            var height = stop.y - start.y;
            canvas.html().width = width;
            canvas.html().height = height;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            
        //Copy cropped portion of scene canvas to new local canvas
            ctx.drawImage(ImageEditor.Scene.canvas.html(), start.x, start.y, width, height,0,0,width, height);
        
        //Convert local canvas to PNG
        canvas.html().toBlob(function(blob) {
                    saveAs(blob, filename+".png");
                }, "image/png");
        
        BiopsyInput.ImageEditor.Editor.Mode = "";
        WinScene.Set.statusbarText("");
        ImageEditor.Scene.canvas.html().width = defaultWidth;
        ImageEditor.Scene.canvas.html().height = defaultHeight;
        
        ImageEditor.Update();
        
    },
    PlotPoint: function(x, y, ctx){
        ctx.strokeStyle = "yellow";
        ctx.strokeRect(x, y,  1, 1);
    },
    SetMode: {
        Select: function(){
            BiopsyInput.ImageEditor.Editor.Mode = "SELECT";
            WinScene.Set.statusbarText("SELECT");
        },
        SaveCanvas: function(){
            BiopsyInput.ImageEditor.Editor.Mode = "SAVE CANVAS";
            WinScene.Set.statusbarText("SAVE CANVAS");
        },
        Move: function(){
            BiopsyInput.ImageEditor.Editor.Mode = "MOVE";
            WinScene.Set.statusbarText("MOVE");
        },
        Pan: function(){
            BiopsyInput.ImageEditor.Editor.Mode = "PAN";
            WinScene.Set.statusbarText("PAN");
        },
        Crop: function(){
            BiopsyInput.ImageEditor.Editor.Mode = "CROP";
            WinScene.Set.statusbarText("CROP");
        },
        Trace: function(){
            BiopsyInput.ImageEditor.Editor.Mode = "TRACE";
            WinScene.Set.statusbarText("TRACE");
            var img = ImageEditor.GetSelectedImage();
            img.Trace.points.push([]);
            //img.Trace.offset.x = img.Position.x;
            //img.Trace.offset.y = img.Position.y;
            //img.Trace.rotation = img.Rotation;
        },
        StretchWidth: function(){
            BiopsyInput.ImageEditor.Editor.Mode = "STRETCH WIDTH";
            WinScene.Set.statusbarText("STRETCH WIDTH");
        },
        StretchHeight: function(){
            BiopsyInput.ImageEditor.Editor.Mode = "STRETCH HEIGHT";
            WinScene.Set.statusbarText("STRETCH HEIGHT");
        },
        StretchImage: function(){
            BiopsyInput.ImageEditor.Editor.Mode = "STRETCH IMAGE";
            WinScene.Set.statusbarText("STRETCH IMAGE");
        },
        RotateWithMouse: function(){
            BiopsyInput.ImageEditor.Editor.Mode = "ROTATE WITH MOUSE";
            WinScene.Set.statusbarText("ROTATE WITH MOUSE");
        },
        RotateCW: function(){
            ImageEditor.Scene.Entities[ImageEditor.Scene.Entities.length - 1].Rotation += (Math.PI / 2);
            //if(ImageEditor.Scene.Entities[ImageEditor.Scene.Entities.length - 1].Mask)
            //    ImageEditor.Scene.Entities[ImageEditor.Scene.Entities.length - 1].Mask.Rotation += (Math.PI / 2);
            //
            ImageEditor.Update();
        },
        RotateCCW: function(){
            ImageEditor.Scene.Entities[ImageEditor.Scene.Entities.length - 1].Rotation -= (Math.PI / 2);
            //if(ImageEditor.Scene.Entities[ImageEditor.Scene.Entities.length - 1].Mask)
            //    ImageEditor.Scene.Entities[ImageEditor.Scene.Entities.length - 1].Mask.Rotation += (Math.PI / 2);
            //
            ImageEditor.Update();
        },
        MirrorHorizontal: function(){
            ImageEditor.Scene.Entities[ImageEditor.Scene.Entities.length - 1].Scale.x *= -1;
            ImageEditor.Update();
        },
        MirrorVertical: function(){
            ImageEditor.Scene.Entities[ImageEditor.Scene.Entities.length - 1].Scale.y *= -1;
            ImageEditor.Update();
        },
        OpenFile: function(){
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent('click', false, true ); // event type,bubbling,cancelable
            document.getElementById('meshFile').dispatchEvent(evt);
        },
        ZoomIn: function(){
            ImageEditor.Viewport.scaleHeight += 0.1;
            if(ImageEditor.Viewport.scaleHeight <= 1){ ImageEditor.Viewport.scaleHeight = 1};
            
            ImageEditor.Viewport.scaleWidth = ImageEditor.Viewport.scaleHeight;// * ImageEditor.Scene.width / ImageEditor.Scene.height;
            
            ImageEditor.Update();
        },
        ZoomOut: function(){
            ImageEditor.Viewport.scaleHeight -= 0.1;
            if(ImageEditor.Viewport.scaleHeight <= 1){ ImageEditor.Viewport.scaleHeight = 1};
            
            ImageEditor.Viewport.scaleWidth = ImageEditor.Viewport.scaleHeight;// * ImageEditor.Scene.width / ImageEditor.Scene.height;
            
            ImageEditor.Update();
        }
    },
    BuildCancers: function(){
        var traces = [];
        
        //Loop through all images and save traces
        var numOfImages = ImageEditor.Scene.Entities.length;
        for(var i = numOfImages - 1; i >= 0; i--){
            var img = ImageEditor.Scene.Entities[i];
            
            //If Image has traces, save to outlines
            if(img.Trace.points.length > 0){
                
                for(var j = 0; j < img.Trace.points.length; j++){
                    traces.push(img.Trace.points[j]);
                }
            }
        }
        
        var Outlines = [];
        
        //Find max and min X &Y for each trace
        for(var i = traces.length - 1; i >= 0; i--){
            Outlines[i] = {};
            Outlines[i].X = {}
            Outlines[i].X.min = 99999999999;
            Outlines[i].X.max = -1;
            
            Outlines[i].Y = {}
            Outlines[i].Y.min = 99999999999;
            Outlines[i].Y.max = -1;
            
            Outlines[i].index = i;
            
            var trace = traces[i];
            Outlines[i].Points = trace;
            
            for(var j = trace.length - 1; j >= 0; j--){
                
                
                Outlines[i].X.max = trace[j].x > Outlines[i].X.max ? trace[j].x : Outlines[i].X.max;
                Outlines[i].X.min = trace[j].x < Outlines[i].X.min ? trace[j].x : Outlines[i].X.min;
                
                Outlines[i].Y.max = trace[j].y > Outlines[i].Y.max ? trace[j].y : Outlines[i].Y.max;
                Outlines[i].Y.min = trace[j].y < Outlines[i].Y.min ? trace[j].y : Outlines[i].Y.min;
            }
            
        }
        
        //Calcualte AABB Area for each outline and Find Biopsy Outline
        var outerEdge = Outlines[Outlines.length - 1];
        
        for( var i = Outlines.length - 1; i >= 0; i--){
            Outlines[i].area = (Outlines[i].X.max - Outlines[i].X.min) *   (Outlines[i].Y.max - Outlines[i].Y.min);
            outerEdge = Outlines[i].area > outerEdge.area ? Outlines[i] : outerEdge;
        }
        
        //Find center of Biopsy Outline
        outerEdge.Center ={};
        outerEdge.Center.x = 0;
        outerEdge.Center.y = 0;
        for(var i = outerEdge.Points.length - 1; i >= 0; i--){
            outerEdge.Center.x += outerEdge.Points[i].x;
            outerEdge.Center.y += outerEdge.Points[i].y;
        }
        
        outerEdge.Center.x = outerEdge.Center.x / outerEdge.Points.length;
        outerEdge.Center.y = outerEdge.Center.y / outerEdge.Points.length;
        
        //Find offsets for each cancer point from outer edge
        for( var i = Outlines.length - 1; i >= 0; i--){
            
            //Ignore Outer Edge, Only test cancers
            if(i != outerEdge.index){
                
                Outlines[i].Offsets = [];
                
                for(var j = Outlines[i].Points.length - 1; j >= 0; j--){
                    var point = ImageEditor.IntersectionWithEdge(outerEdge, Outlines[i].Points[j]);
                    if(point != null){
                        var pointToEdge = [];
                        vec3.subtract(point, [Outlines[i].Points[j].x, Outlines[i].Points[j].y, 0],pointToEdge);
                        
                        var centerToEdge = [];
                        vec3.subtract(point, [outerEdge.Center.x, outerEdge.Center.y, 0], centerToEdge);
                        
                        var offset = pointToEdge[0] / centerToEdge[0];//, pointToEdge[1] / centerToEdge[1], 0];
                        Outlines[i].Offsets.push(offset);
                        os.console.Comment("Point: <" + Outlines[i].Points[j].x.toFixed(2) +", " + Outlines[i].Points[j].y.toFixed(2) +"> Offset: " + ((1 - offset) * 100).toFixed(2) + "%" );
                        
                    }
                    else{
                        os.console.Error("Point Does Not Have Offset");
                    }
                    
                }
                
                Outlines[i].Offsets.reverse();
                  
            }
        }
        os.console.Comment("Finished");
    },
    Extents: function(){
        ImageEditor.Viewport.Position.x = 0;
        ImageEditor.Viewport.Position.y = 0;
        ImageEditor.Viewport.scaleHeight = 1;
        ImageEditor.Viewport.scaleWidth = 1;
        ImageEditor.Update();
    }
}

var CImage = function(){
    this.img = null;
    this.Position = {
        x: 0,
        y: 0,
        z: 0
    }
    
    this.Rotation = 0;
    this.Mask = false;
    this.Trace = {
        points: [],
        offset: {
            x: 0,
            y: 0
        },
        rotation: 0
    }
    this.Scale = {
        x: 1.0,
        y: 1.0
    }
        
    this.Selected = false;
    this.width = 1;
    this.height = 1;
    this.nativeWidth = 0;
    this.nativeHeight = 0;
    this.halfWidth = 1;
    this.halfHeight = 1;
    this.SceneToLocal = function(x, y){
          var out = {
            x: 0,
            y: 0
          }
        var cos = Math.cos(this.Rotation);
        var sin = Math.sin(this.Rotation);
        
        //Translate to center of image
        var xT = x - (this.Position.x + this.halfWidth);
        var yT = y - (this.Position.y + this.halfHeight);
        
        xT /= this.Scale.x;
        yT /= this.Scale.y;
        
         //Rotate image
        var xRot = xT*cos + yT*sin;
        var yRot = -xT*sin + yT*cos;
          
        //Translate to Top Left
        var xf = xRot +  (this.halfWidth);
        var yf = yRot +  (this.halfHeight);
        //os.console.Comment("X: " + x + " --> " + xf);
        //os.console.Comment("Y: " + y + " --> " + yf);
        //Result is in Local Image Space
        out.x = xf;
        out.y = yf;
        
        return out;
    };
    this.Outline = function(ctx, width, color){
        ctx.save();
        
        ctx.translate(this.Position.x + this.halfWidth, this.Position.y + this.halfHeight);
        ctx.rotate(this.Rotation);
        ctx.scale(this.Scale.x, this.Scale.y);
        
        if(this.Mask){
            ctx.translate(-(this.halfWidth), -(this.halfHeight));  
            ctx.beginPath(); 
            ctx.lineWidth=width;
            ctx.strokeStyle=color; // Green path
            //ctx.moveTo(this.Mask.start.x, this.Mask.start.y);
            //ctx.lineTo(this.Mask.stop.x,this.Mask.start.y);
            //ctx.lineTo(this.Mask.stop.x,this.Mask.stop.y);
            //ctx.lineTo(this.Mask.start.x,this.Mask.stop.y);
            
            ctx.moveTo(this.Mask.tl.x, this.Mask.tl.y);
            ctx.lineTo(this.Mask.tr.x, this.Mask.tr.y);
            ctx.lineTo(this.Mask.br.x, this.Mask.br.y);
            ctx.lineTo(this.Mask.bl.x, this.Mask.bl.y);
            
            ctx.closePath();
            ctx.stroke(); // Draw it


        }
        else{
            
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.strokeRect(-this.halfWidth, -this.halfHeight , this.width, this.height);
        }
        
        ctx.restore();
    }
    this.Draw = function(ctx){
        ctx.save();
        
        //Place Canvas at center of image for rotation
        ctx.translate(this.Position.x + this.halfWidth, this.Position.y + this.halfHeight);

        //Rotate Image
        //ctx.scale(this.Scale.x, this.Scale.y);
        //if(this.Mask)
        //    var v1 =[0,0,0];
        //    //vec3.create(v1);
        //    vec3.set([this.Mask.br.x - this.Mask.tl.x, this.Mask.br.y - this.Mask.tl.y, 0], v1);
        //    var mag = vec3.length(v1);
        //    var norm = [0,0,0];
        //    //vec3.create(norm);
        //    vec3.normalize(v1, norm);
        //    
        //    var midpoint = [0,0,0];
        //    //vec3.create(midpoint);
        //    vec3.add([this.Mask.tl.x, this.Mask.tl.y, 0],vec3.scale(norm,mag/2), midpoint);
        //    
        //    ctx.translate(midpoint[0] - this.halfWidth, midpoint[1] - this.halfHeight);
        //    ctx.rotate(this.Rotation);
        //    ctx.translate(this.halfWidth - midpoint[0], this.halfHeight - midpoint[1])
        //
        //else
            ctx.rotate(this.Rotation);
        //
            ctx.scale(this.Scale.x, this.Scale.y);
        
        
        if(this.Mask){
            ctx.translate(-(this.halfWidth), -(this.halfHeight));
            
            //Draw Mask Clipping Path
            ctx.beginPath(); 
            ctx.lineWidth="5";
            ctx.strokeStyle="yellow"; // Green path
            ctx.moveTo(this.Mask.tl.x, this.Mask.tl.y);
            ctx.lineTo(this.Mask.tr.x, this.Mask.tr.y);
            ctx.lineTo(this.Mask.br.x, this.Mask.br.y);
            ctx.lineTo(this.Mask.bl.x, this.Mask.bl.y);
            ctx.closePath();
            //ctx.stroke(); // Draw it
            ctx.clip();

            ctx.translate((this.halfWidth), (this.halfHeight));

        }
        
        ctx.drawImage(this.img, -this.halfWidth, -this.halfHeight, this.width, this.height);
        
        if(this.Trace.points.length > 0){
            
            ctx.translate(-(this.halfWidth), -(this.halfHeight));
            
            
            ctx.lineWidth="5";
            ctx.strokeStyle="green"; // Green path
            var numOfTraces = this.Trace.points.length;
            for(var j = 0; j < numOfTraces; j++){
                var path = this.Trace.points[j];
                ctx.beginPath(); 
                ctx.moveTo(path[0].x , path[0].y);
                for(var i = 1; i < path.length; i++){
                    
                    ctx.lineTo(path[i].x , path[i].y);
                }
                ctx.closePath();
                ctx.stroke(); 
            }
            

            
            
        }
        
        
        ctx.restore();
    }
    
    
}


//
//  INPUT
//
BiopsyInput = {
    ModelView: {
        Keypress: function(e){
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
        },
        MouseDown: function(e){
            
        },
        MouseUp: function(e){
            
        },
        MouseMove: function(e){
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
            
        },
        MouseWheelMove: function(e){
            
        }
    },
    ImageEditor:{
        Keypress: function(e){
            
            //
            //  Image Adjustments
            //
            
            if(String.fromCharCode(e.keyCode) == "A"){     //Image Left
                //os.graphics.Managers.Camera.MoveDown(10);
                ImageEditor.Scene.Entities[ImageEditor.Scene.Entities.length - 1].Position.x -= 50 / ImageEditor.Viewport.scale;
                
                var length = ImageEditor.Scene.Entities.length;
                //if(ImageEditor.Scene.Entities[length - 1].Mask)
                //    ImageEditor.Scene.Entities[length - 1].Mask.start.x -= 50 / ImageEditor.Viewport.scale;
                //    //ImageEditor.Scene.Entities[length - 1].Mask.start.y -= 50 / ImageEditor.Viewport.scale;
                //    ImageEditor.Scene.Entities[length - 1].Mask.stop.x -= 50 / ImageEditor.Viewport.scale;
                //    //ImageEditor.Scene.Entities[length - 1].Mask.stop.y -= 50 / ImageEditor.Viewport.scale;
                //
                ImageEditor.Update();
            }
            else if(String.fromCharCode(e.keyCode) == "D"){     //Image Right
                //os.graphics.Managers.Camera.MoveDown(10);
                ImageEditor.Scene.Entities[ImageEditor.Scene.Entities.length - 1].Position.x += 50 / ImageEditor.Viewport.scale;
                
                var length = ImageEditor.Scene.Entities.length;
                //if(ImageEditor.Scene.Entities[length - 1].Mask)
                //    ImageEditor.Scene.Entities[length - 1].Mask.start.x += 50 / ImageEditor.Viewport.scale;
                //    //ImageEditor.Scene.Entities[length - 1].Mask.start.y -= 50 / ImageEditor.Viewport.scale;
                //    ImageEditor.Scene.Entities[length - 1].Mask.stop.x += 50 / ImageEditor.Viewport.scale;
                //    //ImageEditor.Scene.Entities[length - 1].Mask.stop.y -= 50 / ImageEditor.Viewport.scale;
                //
                ImageEditor.Update();
            }
            else if(String.fromCharCode(e.keyCode) == "W"){     //Image Up
                //os.graphics.Managers.Camera.MoveDown(10);
                ImageEditor.Scene.Entities[ImageEditor.Scene.Entities.length - 1].Position.y -= 50 / ImageEditor.Viewport.scale;
                
                var length = ImageEditor.Scene.Entities.length;
                //if(ImageEditor.Scene.Entities[length - 1].Mask)
                //    //ImageEditor.Scene.Entities[length - 1].Mask.start.x -= 50 / ImageEditor.Viewport.scale;
                //    ImageEditor.Scene.Entities[length - 1].Mask.start.y -= 50 / ImageEditor.Viewport.scale;
                //    //ImageEditor.Scene.Entities[length - 1].Mask.stop.x -= 50 / ImageEditor.Viewport.scale;
                //    ImageEditor.Scene.Entities[length - 1].Mask.stop.y -= 50 / ImageEditor.Viewport.scale;
                //
                ImageEditor.Update();
            }
            else if(String.fromCharCode(e.keyCode) == "S"){     //Image Down
                //os.graphics.Managers.Camera.MoveDown(10);
                ImageEditor.Scene.Entities[ImageEditor.Scene.Entities.length - 1].Position.y += 50 / ImageEditor.Viewport.scale;
                
                var length = ImageEditor.Scene.Entities.length;
                //if(ImageEditor.Scene.Entities[length - 1].Mask)
                //    //ImageEditor.Scene.Entities[length - 1].Mask.start.x -= 50 / ImageEditor.Viewport.scale;
                //    ImageEditor.Scene.Entities[length - 1].Mask.start.y += 50 / ImageEditor.Viewport.scale;
                //    //ImageEditor.Scene.Entities[length - 1].Mask.stop.x -= 50 / ImageEditor.Viewport.scale;
                //    ImageEditor.Scene.Entities[length - 1].Mask.stop.y += 50 / ImageEditor.Viewport.scale;
                //
                ImageEditor.Update();
            }
            
            //
            //  Viewport
            //
            
            else if(e.keyCode == 37){     //Left Viewport
                e.preventDefault();
                ImageEditor.Viewport.Position.x += 50 / ImageEditor.Viewport.scale;
                ImageEditor.Update();
            }
            else if(e.keyCode == 39){     //Right Viewport
                e.preventDefault();
                ImageEditor.Viewport.Position.x -= 50 / ImageEditor.Viewport.scale;
                ImageEditor.Update();
            }
            else if(e.keyCode == 38){     //Up Viewport
                e.preventDefault();
                ImageEditor.Viewport.Position.y += 50 / ImageEditor.Viewport.scale;
                //ImageEditor.Viewport.Update();
                ImageEditor.Update();
            }
            else if(e.keyCode == 40){     //Down Viewport
                e.preventDefault();
                ImageEditor.Viewport.Position.y -= 50 / ImageEditor.Viewport.scale;
                //ImageEditor.Viewport.Update();
                ImageEditor.Update();
            }
            
            //
            //  Image Editing Keys
            //
            else if(String.fromCharCode(e.keyCode) == "C"){     //Crop Enable
                //BiopsyInput.ImageEditor.Editor.Mode = "CROP";
                //WinScene.Set.statusbarText(BiopsyInput.ImageEditor.Editor.Mode);
                //os.console.Comment("Image Cropping Enable");
            }
            else if(e.keyCode == 13){     //Enter   Key/Save Canvas
                if(BiopsyInput.ImageEditor.Editor.Mode == "CROP"){
                    ImageEditor.CropImage();
                    WinScene.Set.statusbarText(BiopsyInput.ImageEditor.Editor.Mode);
                }
                else if(BiopsyInput.ImageEditor.Editor.Mode == "SAVE CANVAS"){
                    os.console.Comment("Saving Canvas To File");
                    ImageEditor.SaveCanvas();
                }
                
            }
            else if(String.fromCharCode(e.keyCode) == "M"){     //Image Moving Enable
                os.console.Comment("Image Moving Enable");
                ImageEditor.SetMode.ImageMove();
            }
            
            //
            //  Control Keys
            //
            
            else if(e.keyCode == 16){     //Shift
                e.preventDefault();
                BiopsyInput.ImageEditor.Key.shift = true;
                BiopsyInput.ImageEditor.Editor.Mode = "SELECT";
                WinScene.Set.statusbarText("SELECT");
            }
            else if(e.keyCode == 17){     //Ctrl
                BiopsyInput.ImageEditor.Key.ctrl = true;
            }
            else if(e.keyCode == 18){     //Alt
                BiopsyInput.ImageEditor.Key.alt = true;
            }
            else if(e.keyCode == 27){     //ESC
                BiopsyInput.ImageEditor.Editor.Mode = "";
                WinScene.Set.statusbarText("");
            }
            
            
           
            
        },
        KeyUp: function(e){
            if(e.keyCode == 16){     //Shift
                BiopsyInput.ImageEditor.Key.shift = false;
            }
            else if(e.keyCode == 17){     //Ctrl
                BiopsyInput.ImageEditor.Key.ctrl = false;
            }
            else if(e.keyCode == 18){     //Alt
                BiopsyInput.ImageEditor.Key.alt = false;
            }

        },
        MiniMap: {
            MouseDown: function(e){
                var winPos = WinMiniMap.Get.position();
                var x = e.pageX - (winPos.left + 1);//ImageEditor.MiniMap.canvas.html().offsetLeft;
                var y = e.pageY - (winPos.top + 22);//ImageEditor.MiniMap.canvas.html().offsetTop;
                
                var view = ImageEditor.Convert.MiniMapTo.Viewport(x,y);
                var scene = ImageEditor.Convert.MiniMapTo.Scene(x,y);
                
                ImageEditor.Viewport.Position.x = scene.x; 
                ImageEditor.Viewport.Position.y = scene.y; 
                
                ImageEditor.Update();
                
                os.console.AppendComment("MiniMap Canvas Click");
                os.console.AppendComment("Raw Canvas: x: " + x +", y: " + y);
                ImageEditor.PlotPoint(x, y, ImageEditor.MiniMap.ctx);
                os.console.AppendComment("View x: " + view.x + ", y: " + view.y);
                ImageEditor.PlotPoint(view.x, view.y,ImageEditor.Scene.ctx);
                os.console.AppendComment("Scene x: " + scene.x + ", y: " + scene.y);
            },
            MouseUp: function(e){
                
            }
        },
        Editor: {
            Mode: "",
            MouseDown: function(e){
                BiopsyInput.ImageEditor.Mouse.pressed = true;
                
                var winPos = WinScene.Get.position();
                var x = e.pageX - (winPos.left + 1);//ImageEditor.MiniMap.canvas.html().offsetLeft;
                var y = e.pageY - (winPos.top + 58);//ImageEditor.MiniMap.canvas.html().offsetTop;
                    
                if(BiopsyInput.ImageEditor.Editor.Mode == "CROP"){
                    ImageEditor.EditControls.cropStart = ImageEditor.Convert.ViewportTo.Scene(x,y);
                    
                }
                else if(BiopsyInput.ImageEditor.Editor.Mode == "SELECT"){
                    var sc = ImageEditor.Convert.ViewportTo.Scene(x,y);
                    ImageEditor.SelectImage(sc.x, sc.y);
                }
                else if(BiopsyInput.ImageEditor.Editor.Mode == "SAVE CANVAS"){
                    WinScene.Set.statusbarText(BiopsyInput.ImageEditor.Editor.Mode);
                    ImageEditor.EditControls.cropStart = ImageEditor.Convert.ViewportTo.Scene(x,y);
                }
                else if(BiopsyInput.ImageEditor.Editor.Mode == "TRACE"){
                    var img = ImageEditor.GetSelectedImage();
                    //var point = new CPoint();
                    var point = ImageEditor.Convert.ViewportTo.Scene(x,y);
                    //os.console.Comment("Scene: x: " + point.x + ", y: " + point.y );
                    
                    var ls = img.SceneToLocal(point.x, point.y);
                    //os.console.Comment("Local Space: x: " + ls.x + ", y: " + ls.y );
                    
                    point.x = ls.x;// -= img.Position.x;
                    point.y = ls.y;// -= img.Position.y;
                    
                    
                    img.Trace.points[img.Trace.points.length - 1].push(point);
                    
                    ImageEditor.Update();
                }
                
                //var winPos = WinScene.Get.position();
                //var x = e.pageX - (winPos.left + 1);//ImageEditor.MiniMap.canvas.html().offsetLeft;
                //var y = e.pageY - (winPos.top + 58);//ImageEditor.MiniMap.canvas.html().offsetTop;
                    
                var view = {x: x, y: y};//ImageEditor.Convert.MiniMapTo.Viewport(x,y);
                var scene = ImageEditor.Convert.ViewportTo.Scene(x,y);
                var mini = ImageEditor.Convert.ViewportTo.MiniMap(x,y);
                
                //os.console.AppendComment("MiniMap Canvas Click");
                //os.console.AppendComment("Raw Canvas: x: " + x +", y: " + y);
                ImageEditor.PlotPoint(x, y, ImageEditor.Scene.ctx);
                //os.console.AppendComment("MiniMap x: " + mini.x + ", y: " + mini.y);
                ImageEditor.PlotPoint(mini.x, mini.y,ImageEditor.MiniMap.ctx);
                //os.console.AppendComment("Scene x: " + scene.x + ", y: " + scene.y);
                
                
                BiopsyInput.ImageEditor.Mouse.lastX = e.clientX;
                BiopsyInput.ImageEditor.Mouse.lastY = e.clientY;
            },
            MouseUp: function(e){
                BiopsyInput.ImageEditor.Mouse.pressed = false;
                BiopsyInput.ImageEditor.Controls.selected = false;
                
                if(BiopsyInput.ImageEditor.Editor.Mode == "CROP"){
                    var winPos = WinScene.Get.position();
                    var x = e.pageX - (winPos.left + 1);//ImageEditor.MiniMap.canvas.html().offsetLeft;
                    var y = e.pageY - (winPos.top + 58);//ImageEditor.MiniMap.canvas.html().offsetTop;
                    ImageEditor.EditControls.cropStop = ImageEditor.Convert.ViewportTo.Scene(x,y);
                    
                    ImageEditor.PlotPoint(x, y, ImageEditor.Scene.ctx);
                    WinScene.Set.statusbarText("Press Enter To Crop Selected Area");
                    
                    
                }
                if(BiopsyInput.ImageEditor.Editor.Mode == "SAVE CANVAS"){
                    var winPos = WinScene.Get.position();
                    var x = e.pageX - (winPos.left + 1);//ImageEditor.MiniMap.canvas.html().offsetLeft;
                    var y = e.pageY - (winPos.top + 58);//ImageEditor.MiniMap.canvas.html().offsetTop;
                
                    ImageEditor.EditControls.cropStop = ImageEditor.Convert.ViewportTo.Scene(x,y);
                    WinScene.Set.statusbarText("Press Enter To Save Selected Area");
                    
                }
            },
            MouseMove: function(e){
                if (!BiopsyInput.ImageEditor.Mouse.pressed) {
                    return;
                }
                
                var newX = e.clientX;
                var newY = e.clientY;
                
                var deltaX = newX - BiopsyInput.ImageEditor.Mouse.lastX;
                var deltaY = newY - BiopsyInput.ImageEditor.Mouse.lastY;
                    
                if(BiopsyInput.ImageEditor.Editor.Mode == "MOVE"){
                    var winPos = WinScene.Get.position();
                    var x = e.pageX - (winPos.left + 1);//ImageEditor.MiniMap.canvas.html().offsetLeft;
                    var y = e.pageY - (winPos.top + 58);//ImageEditor.MiniMap.canvas.html().offsetTop;

                    var sc = ImageEditor.Convert.ViewportTo.Scene(x,y);
                    
                    
                    var length = ImageEditor.Scene.Entities.length;
                    if(length > 0){
                        ImageEditor.Scene.Entities[length - 1].Position.x += (1 * deltaX) * ImageEditor.Viewport.scale;
                        ImageEditor.Scene.Entities[length - 1].Position.y += (1 * deltaY) * ImageEditor.Viewport.scale;
                        
                        //if(ImageEditor.Scene.Entities[length - 1].Mask)
                        //    ImageEditor.Scene.Entities[length - 1].Mask.start.x += (1 * deltaX) * ImageEditor.Viewport.scale;
                        //    ImageEditor.Scene.Entities[length - 1].Mask.start.y += (1 * deltaY) * ImageEditor.Viewport.scale;
                        //    ImageEditor.Scene.Entities[length - 1].Mask.stop.x += (1 * deltaX) * ImageEditor.Viewport.scale;
                        //    ImageEditor.Scene.Entities[length - 1].Mask.stop.y += (1 * deltaY) * ImageEditor.Viewport.scale;
                        //
                        ImageEditor.Update();
                    }
                    
                }
                else if(BiopsyInput.ImageEditor.Editor.Mode == "STRETCH WIDTH"){
                    
                    var length = ImageEditor.Scene.Entities.length;
                    
                    if(length > 0){
                        var img = ImageEditor.Scene.Entities[length - 1];
                       
                        var scale = (0.01 * deltaX) * ImageEditor.Viewport.scale;;
                        img.Scale.x += scale;
                        
                        ImageEditor.Update();
                    }
                    
                }
                else if(BiopsyInput.ImageEditor.Editor.Mode == "STRETCH HEIGHT"){
                    var length = ImageEditor.Scene.Entities.length;
                    
                    if(length > 0){
                        var img = ImageEditor.Scene.Entities[length - 1];
                        var scale = (0.01 * deltaY) * ImageEditor.Viewport.scale;;
                        img.Scale.y += scale;
                        
                        ImageEditor.Update();
                    }
                    
                }
                else if(BiopsyInput.ImageEditor.Editor.Mode == "STRETCH IMAGE"){
                    var length = ImageEditor.Scene.Entities.length;
                    
                    if(length > 0){
                        var img = ImageEditor.Scene.Entities[length - 1];
                        var scale = (0.01 * deltaY) * ImageEditor.Viewport.scale;;
                        img.Scale.y += scale;
                        img.Scale.x += scale;
                        
                        
                        ImageEditor.Update();
                    }
                    
                }
                else if(BiopsyInput.ImageEditor.Editor.Mode == "ROTATE WITH MOUSE"){
                    //var winPos = WinScene.Get.position();
                    //var x = e.pageX - (winPos.left + 1);//ImageEditor.MiniMap.canvas.html().offsetLeft;
                    //var y = e.pageY - (winPos.top + 58);//ImageEditor.MiniMap.canvas.html().offsetTop;
                    //
                    //var sc = ImageEditor.Convert.ViewportTo.Scene(x,y);

                    var length = ImageEditor.Scene.Entities.length;
                    if(length > 0){
                        ImageEditor.Scene.Entities[length - 1].Rotation += (0.01 * deltaY);// * ImageEditor.Viewport.scale;
                        if(ImageEditor.Scene.Entities[length - 1].Mask){
                            ImageEditor.Scene.Entities[length - 1].Mask.Rotation += (0.01 * deltaY);
                        }
                        //ImageEditor.Scene.Entities[length - 1].halfWidth = ImageEditor.Scene.Entities[length - 1].width/2;
                        //ImageEditor.Scene.Entities[length - 1].Position.y += (1 * deltaY) * ImageEditor.Viewport.scale;
                        ImageEditor.Update();
                    }
                    
                }
                else if(BiopsyInput.ImageEditor.Editor.Mode == "CROP"){
                    var winPos = WinScene.Get.position();
                    var x = e.pageX - (winPos.left + 1);//ImageEditor.MiniMap.canvas.html().offsetLeft;
                    var y = e.pageY - (winPos.top + 58);//ImageEditor.MiniMap.canvas.html().offsetTop;
                    
                    var start = ImageEditor.Convert.SceneTo.Viewport(ImageEditor.EditControls.cropStart.x, ImageEditor.EditControls.cropStart.y);
                    
                    
                    ImageEditor.Update();
                    ImageEditor.Scene.ctx.strokeStyle = "red";
                    ImageEditor.Scene.ctx.fillStyle = "red";
                    ImageEditor.Scene.ctx.lineWidth = 2;
                    ImageEditor.Scene.ctx.strokeRect(start.x, start.y , x -start.x, y - start.y);
                    
                }
                else if(BiopsyInput.ImageEditor.Editor.Mode == "SAVE CANVAS"){
                    var winPos = WinScene.Get.position();
                    var x = e.pageX - (winPos.left + 1);//ImageEditor.MiniMap.canvas.html().offsetLeft;
                    var y = e.pageY - (winPos.top + 58);//ImageEditor.MiniMap.canvas.html().offsetTop;
                    
                    var start = ImageEditor.Convert.SceneTo.Viewport(ImageEditor.EditControls.cropStart.x, ImageEditor.EditControls.cropStart.y);
                    
                    
                    ImageEditor.Update();
                    ImageEditor.Scene.ctx.strokeStyle = "red";
                    ImageEditor.Scene.ctx.fillStyle = "red";
                    ImageEditor.Scene.ctx.lineWidth = 2;
                    ImageEditor.Scene.ctx.strokeRect(start.x, start.y , x -start.x, y - start.y);
                    
                }
                else if(BiopsyInput.ImageEditor.Editor.Mode == "PAN"){
                    ImageEditor.Viewport.Position.x += (1 * deltaX) * ImageEditor.Viewport.scaleWidth;
                    ImageEditor.Viewport.Position.y += (1  * deltaY) * ImageEditor.Viewport.scaleHeight;
                    ImageEditor.Update();
                }
                
                    
                BiopsyInput.ImageEditor.Mouse.lastX = e.clientX;
                BiopsyInput.ImageEditor.Mouse.lastY = e.clientY;
            },
            MouseWheelMove: function(e){
                e.preventDefault();
                
                ImageEditor.Viewport.scaleHeight += 0.001 * e.wheelDelta;
                if(ImageEditor.Viewport.scaleHeight <= 1){ ImageEditor.Viewport.scaleHeight = 1};
                
                ImageEditor.Viewport.scaleWidth = ImageEditor.Viewport.scaleHeight;// * ImageEditor.Scene.width / ImageEditor.Scene.height;
                
                ImageEditor.Update();
            }
        },
        MouseDown: function(e){
            
        },
        
        MouseUp: function(e){
            
        },
        Mouse: {
            lastX: 0,
            lastY: 0,
            pressed: false
        },
        Key: {
            ctrl: false,
            shift: false,
            alt: false
        },
        Controls: {
            selected: false
        }
    },
    Mode: null
}
Biopsy = function(){
    //Graphics Initializtion
    BiopsyWebGLInit();
    
    //Initilalize File Input
    FileInit();
    
    //Initialize Image Editor
    ImageEditor.Initialize();

}