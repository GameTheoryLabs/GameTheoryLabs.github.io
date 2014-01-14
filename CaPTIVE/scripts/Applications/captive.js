var os = null;

Load = function(){
    //Loads Modal
    //window.location.href = "#openModal";
    
    os = com.jahova.os.Instance();
    os.Load();
    
    CaPTIVE.Init();
    
}

CaPTIVE = {
    app: null,
    Entity: {
        Sensitivity: {
            yaw: 1,
            pitch: 1
        },
        Orientation: {
            mesh: null,
            arrows: null,
            rightArrows: null,
            leftArrows: null,
            rightTexture: null,
            leftTexture: null
        },
        scene: null,
        model: null,
        Cancers: [],
        Layers: [],
        Dimensions: {
            height: null,
            width: null,
            depth: null
        },
        Toggle: {
            LowMargin: function(){
                var shd = CaPTIVE.Entity.model.Graphics.Shaders.get("default");
                if(shd.Uniforms.get("uLowMarginEnable").value){
                    //CaPTIVE.Entity.model.Graphics.Set.lowMarginEnable(false);
                    CaPTIVE.Dashboard.SetLight.Red(document.getElementById("cancer-margin-low-toggle-light"));
                    
                    shd.Uniforms.get("uLowMarginEnable").value = false;
                }
                else{
                    //CaPTIVE.Entity.model.Graphics.Set.lowMarginEnable(true);
                    CaPTIVE.Dashboard.SetLight.Green(document.getElementById("cancer-margin-low-toggle-light"));
                    shd.Uniforms.get("uLowMarginEnable").value = true;
                }
            },
            HighMargin: function(){
                var shd = CaPTIVE.Entity.model.Graphics.Shaders.get("default");
                if(shd.Uniforms.get("uHighMarginEnable").value){
                    //CaPTIVE.Entity.model.Graphics.Set.highMarginEnable(false);
                    CaPTIVE.Dashboard.SetLight.Red(document.getElementById("cancer-margin-high-toggle-light"));
                    shd.Uniforms.get("uHighMarginEnable").value = false;
                }
                else{
                    //CaPTIVE.Entity.model.Graphics.Set.highMarginEnable(true);
                    CaPTIVE.Dashboard.SetLight.Green(document.getElementById("cancer-margin-high-toggle-light"));
                    shd.Uniforms.get("uHighMarginEnable").value = true;
                }
            },
            Specular: function(){
                var shd = CaPTIVE.Entity.model.Graphics.Shaders.get("default");
                if(shd.Uniforms.get("uShowSpecularHighlights").value){
                    shd.Uniforms.get("uShowSpecularHighlights").value = false;
                }
                else{
                    shd.Uniforms.get("uShowSpecularHighlights").value = true;
                }
                
                if(CaPTIVE.Entity.Cancers.length> 0){
                    for(var i = 0; i < CaPTIVE.Entity.Cancers.length; i++){
                        if(CaPTIVE.Entity.Cancers[i]){
                            var shd = CaPTIVE.Entity.Cancers[i].Graphics.Shaders.get("default");
                            if(shd.Uniforms.get("uShowSpecularHighlights").value){
                                shd.Uniforms.get("uShowSpecularHighlights").value = false;
                            }
                            else{
                                shd.Uniforms.get("uShowSpecularHighlights").value = true;
                            }
                        }
                    }
                }
                
            },
            Mirror: function(){
                CaPTIVE.Entity.model.Graphics.Vectors.Scale[0] *= -1
                
                if(CaPTIVE.Entity.Cancers.length> 0){
                    for(var i = 0; i < CaPTIVE.Entity.Cancers.length; i++){
                        if(CaPTIVE.Entity.Cancers[i]){
                            CaPTIVE.Entity.Cancers[i].Graphics.Vectors.Scale[0] *= -1;
                        }
                    }
                }
            }    
        },
        Set: {
            LeftHanded: function(e){
                CaPTIVE.Entity.Orientation.arrows = CaPTIVE.Entity.Orientation.leftArrows;
                CaPTIVE.States.S3DViewer.Input.Update();
            },
            RightHanded: function(e){
                CaPTIVE.Entity.Orientation.arrows = CaPTIVE.Entity.Orientation.rightArrows;
                CaPTIVE.States.S3DViewer.Input.Update();
            },
            LowMargin: function(e){
                var margin = document.getElementById("cancer-margin-low-value").value;
                var shd = CaPTIVE.Entity.model.Graphics.Shaders.get("default");
                shd.Uniforms.get("uLowMarginValue").value = +margin;
            },
            HighMargin: function(e){
                var margin = document.getElementById("cancer-margin-high-value").value;
                var shd = CaPTIVE.Entity.model.Graphics.Shaders.get("default");
                shd.Uniforms.get("uHighMarginValue").value = +margin;
            },
            AmbientLight: function(e){
                var lt = +e.target.value;
                CaPTIVE.Entity.model.Graphics.Set.ambientColor([lt,lt,lt]);
            },
            Orientation: function(yaw, pitch, roll){
                
                
                if(Number(roll) != 0){
                    CaPTIVE.Entity.model.roll += Number(roll);
                    CaPTIVE.Entity.Orientation.arrows.roll += Number(roll);
                }
                else{
                    CaPTIVE.Entity.model.Default.yaw = Number(yaw);
                    CaPTIVE.Entity.model.Default.pitch = Number(pitch);
                
                    CaPTIVE.Entity.model.roll = 0;
                    CaPTIVE.Entity.Orientation.arrows.roll = 0;
                }
                
                CaPTIVE.States.S3DViewer.Input.Update();
            },
            Specularity: function(e){
                CaPTIVE.Entity.model.Graphics.Set.shininess(+e.target.value);
            },
            Pitch: function(e){
                CaPTIVE.Entity.Sensitivity.pitch = +e.target.value;  
            },
            Yaw: function(e){
                CaPTIVE.Entity.Sensitivity.yaw = +e.target.value;  
            },
            Alpha: function(e){
                CaPTIVE.Entity.model.Graphics.Set.alphaValue(+e.target.value);
            },
            Scale: function(e){
                var sc = +e.target.value;
                CaPTIVE.Entity.model.Set.Scale(sc,sc,sc);
                if(CaPTIVE.Entity.Cancers.length> 0){
                    for(var i = 0; i < CaPTIVE.Entity.Cancers.length; i++){
                        if(CaPTIVE.Entity.Cancers[i]){
                            CaPTIVE.Entity.Cancers[i].Set.Scale(sc,sc,sc);
                        }
                    }
                }
    
            },
            Dimensions: function(){
                os.console.Comment("Setting Model Dimensions");
                //Save values in textboxes
                CaPTIVE.Entity.Dimensions.width = +document.getElementById("model-width").value
                CaPTIVE.Entity.Dimensions.height = +document.getElementById("model-height").value
                CaPTIVE.Entity.Dimensions.depth = +document.getElementById("model-depth").value
                
                //Set Status
                CaPTIVE.Status.OBJDimensions = true;
                
                
                //
                //  Update Lights in Dashboard and Model Menus
                //
                CaPTIVE.Dashboard.Model.Dimensions.message.innerHTML = "OBJ Dimensions Set Successfully";
                CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Model.Dimensions.light);
                if(CaPTIVE.Status.OBJLoaded && CaPTIVE.Status.OBJDimensions && CaPTIVE.Status.OBJOrientation){
                    CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Overview.Models.light);
                    CaPTIVE.Dashboard.Overview.Models.message.innerHTML = "3D Model is Loaded and Configured";
                }
                else{
                    CaPTIVE.Dashboard.SetLight.Yellow(CaPTIVE.Dashboard.Overview.Models.light);
                    CaPTIVE.Dashboard.Overview.Models.message.innerHTML = "3D Model Needs Configuration";
                }
                
                //Update Model Menu
                
                //Change Light Color on Overview
                document.getElementById("model-dimensions-light").className = "led-green";
                document.getElementById("model-dimensions-message").innerHTML = "3D Model Dimensions Set";
                
                //Open Define Layer OVerview Menu
                if(CaPTIVE.Menu.Current != "layers"){ CaPTIVE.Menu.SetActive("layers")};
                CaPTIVE.Menu.model.SetActiveOption(1);
                
                CaPTIVE.FSM.AnimatedTransition("SLayerDefinition");

            }
        }
    },
    Launch: {
        Viewer: function(){
            //Test to see if model has been loaded
            if(CaPTIVE.Status.OBJLoaded){
                CaPTIVE.FSM.AnimatedTransition("S3DViewer");
            }
            else{
                //Launch Modal
                document.getElementById("modalContent").innerHTML = "<h2>No OBJ Model Loaded</h2><p>You must load an OBJ before you can launch the 3D Viewer</p>";
                CaPTIVE.Modal.Show();
                CaPTIVE.FSM.AnimatedTransition('SStart');
            }
            
        },
        LayerEditor: function(){
            //Test to see if model has been loaded
            if(!CaPTIVE.Status.OBJLoaded){
                //Launch Modal
                document.getElementById("modalContent").innerHTML = "<h2>No OBJ Model Loaded</h2><p>You must load an OBJ before you can launch the 3D Viewer</p>";
                CaPTIVE.Modal.Show();
                CaPTIVE.FSM.AnimatedTransition('SStart');
                
            }
            else if(!CaPTIVE.Status.OBJOrientation){
                document.getElementById("modalContent").innerHTML = "<h2>3D Model Not Aligned</h2><p>You must align the 3D model before editing layers</p>";
                CaPTIVE.Modal.Show();
                
                //Open Alignment Menu
                if(CaPTIVE.Menu.Current != "model"){ CaPTIVE.Menu.SetActive("model")};
                CaPTIVE.Menu.model.SetActiveOption(2);
                
                //Open 3D Viewer
                CaPTIVE.FSM.AnimatedTransition("S3DViewer", msg.data);
            }
            else if(!CaPTIVE.Status.OBJDimensions){
                document.getElementById("modalContent").innerHTML = "<h2>No Model Dimensions</h2><p>You must give the 3D model dimensions before editing layers</p>";
                CaPTIVE.Modal.Show();
                
                if(CaPTIVE.Menu.Current != "model"){ CaPTIVE.Menu.SetActive("model")};
                CaPTIVE.Menu.model.SetActiveOption(3);
            }
            else if(!CaPTIVE.Status.LayersDefined){
                document.getElementById("modalContent").innerHTML = "<h2>Number Of Layers Has Not Been Set</h2><p>You must must define the total number of layers before using the Layer Editor</p>";
                CaPTIVE.Modal.Show();
            }
            else if(!CaPTIVE.Status.LayersWithCancer){
                document.getElementById("modalContent").innerHTML = "<h2>No Layers With Cancer</h2><p>You must identify which layers have cancer present before using the Layer Editor</p>";
                CaPTIVE.Modal.Show();
            }
            else{
                CaPTIVE.FSM.AnimatedTransition("SLayerEditor");
            }
        },
        Tracer: function(){
            
        }
    },
    Modal: {
        Show: function(){window.location = "#openModal";},
        Hide: function(){window.location = "#closeModal";}
    },
    Init: function(){
        CaPTIVE.app = document.getElementById("app");
        
        CaPTIVE.Load.Dashboard();
        CaPTIVE.Load.Events();
        CaPTIVE.Load.Menu();
        CaPTIVE.Load.Workers();
        CaPTIVE.Load.FSM();
        CaPTIVE.Load.States();
        CaPTIVE.Load.Graphics();
        CaPTIVE.Load.ImageEditor();
        CaPTIVE.FSM.SetState("SStart");
        
        os.debugbar.Disable();
        
        //Remove temporary hide from modal to allow functionality
        document.getElementById("openModal").className = "modalDialog";
    },
    Spinner: {
        Show: function(){
            document.getElementById("Spinner").className = "windows8";
        },
        Hide: function(){
            document.getElementById("Spinner").className = "windows8 hide";
        }
    },
    Files: {
        SaveOBJ: function(filename, model){
                 if(model.index.length > 0){
        
                    var file = "#Created By GameTheoryLabs\n";
                    
                    for(var i = 0; i < model.verts.length; i++){
                        file += "v " + model.verts[i][0] + " " + model.height + " " + model.verts[i][1] + " " + "0\n";
                    }
                    
                    var numOfPolys = model.index.length/3;
                    
                    for(var j = 0; j < numOfPolys; j++){
                        file += "f " + model.index[j*3 + 0] + " " + model.index[j*3 + 1] + "  " + model.index[j*3 + 2] + "\n";
                    }
                    var blob = new Blob([file]);
                    saveAs(blob, filename +".obj");
                    
                }
            },
        Load: function(e){
            //e.stopPropagation();
            //e.preventDefault();
            
            for(var i = 0; i < e.target.files.length; i++){
                var file = {};
                file.name = e.target.files[i].name;
                file.type = e.target.files[i].type;
                file.ext = e.target.files[i].name.substr(e.target.files[i].name.lastIndexOf(".") + 1).toUpperCase();
                file.obj = e.target.files[i];
                
                os.console.Comment("File Loaded: " + file.name);
                
                //test for image
                if(file.type.search("image") >= 0){
                    CaPTIVE.FSM.AnimatedTransition("SImageEditor", file);
                }
                
                //test for json
                else if(file.ext == "CAP"){
                    CaPTIVE.FSM.AnimatedTransition("SLoadJSON", file);
                }
                
                else if(file.ext == "OBJ"){
                    CaPTIVE.FSM.AnimatedTransition("SLoadOBJ", file);
                }
                
                //ignore file and warn user
                else{
                    os.console.Warning("File: " + e.target.files[i].name + " ignored, unhandled file type");
                }
            }
            
        },
        obj: null,
        mesh: null,
        json: {}
    },
    Workers: {
        files: null  
    },
    Load: {
        ImageEditor: function(){
            CaPTIVE.ImageEditor.Initialize();  
        },
        Dashboard: function(){

            CaPTIVE.Dashboard.Overview = {
                Models: {
                    light: document.getElementById("dashboard-model-light"),
                    message: document.getElementById("dashboard-model-message"),
                    event: null
                },
                Layers: {
                    light: document.getElementById("dashboard-layer-light"),
                    message: document.getElementById("dashboard-layer-message"),
                    event: null
                },
                Cancer: {
                    light: document.getElementById("dashboard-traces-light"),
                    message: document.getElementById("dashboard-traces-message"),
                    event: null
                }
            }
            CaPTIVE.Dashboard.Model = {
                OBJ: {
                    light: document.getElementById("dashboard-model-obj-light"),
                    message: document.getElementById("dashboard-model-obj-message"),
                    event: null
                },
                Aligned: {
                    light: document.getElementById("dashboard-model-aligned-light"),
                    message: document.getElementById("dashboard-model-aligned-message"),
                    event: null
                },
                Dimensions: {
                    light: document.getElementById("dashboard-model-dimension-light"),
                    message: document.getElementById("dashboard-model-dimension-message"),
                    event: null
                }
            }
            CaPTIVE.Dashboard.Layers = {
                Defined: {
                    light: document.getElementById("dashboard-layer-defined-light"),
                    message: document.getElementById("dashboard-layer-defined-message"),
                    event: null
                },
                Cancer: {
                    light: document.getElementById("dashboard-layer-cancer-light"),
                    message: document.getElementById("dashboard-layer-cancer-message"),
                    event: null
                }
            }
            CaPTIVE.Dashboard.Cancer = {
                Outlines: {
                    light: document.getElementById("dashboard-cancer-outlines-light"),
                    message: document.getElementById("dashboard-cancer-outlines-message"),
                    event: null
                },
                Generated: {
                    light: document.getElementById("dashboard-cancer-generated-light"),
                    message: document.getElementById("dashboard-cancer-generated-message"),
                    event: null
                }
            }
            
            //
            //  Overview 
            //
            
                //Model
            CaPTIVE.Dashboard.Overview.Models.event = function(){CaPTIVE.Menu["status"].SetActiveOption(1);};
            CaPTIVE.Dashboard.Overview.Models.message.onclick = CaPTIVE.Dashboard.Overview.Models.event;
                //Layers
            CaPTIVE.Dashboard.Overview.Layers.event = function(){CaPTIVE.Menu["status"].SetActiveOption(2);};
            CaPTIVE.Dashboard.Overview.Layers.message.onclick = CaPTIVE.Dashboard.Overview.Layers.event;
                //Cancer
            CaPTIVE.Dashboard.Overview.Cancer.event = function(){CaPTIVE.Menu["status"].SetActiveOption(3);};
            CaPTIVE.Dashboard.Overview.Cancer.message.onclick = CaPTIVE.Dashboard.Overview.Cancer.event;
            
            //
            //  Model
            //
                //OBJ
            CaPTIVE.Dashboard.Model.OBJ.event = function(){CaPTIVE.Menu.SetActive("model"); CaPTIVE.Menu["model"].SetActiveOption(1);};
            CaPTIVE.Dashboard.Model.OBJ.message.onclick = CaPTIVE.Dashboard.Model.OBJ.event;
                //Alignment
            CaPTIVE.Dashboard.Model.Aligned.event = function(){CaPTIVE.Menu.SetActive("model"); CaPTIVE.Menu["model"].SetActiveOption(2);};
            CaPTIVE.Dashboard.Model.Aligned.message.onclick = CaPTIVE.Dashboard.Model.Aligned.event;    
                //Dimensions
            CaPTIVE.Dashboard.Model.Dimensions.event = function(){CaPTIVE.Menu.SetActive("model"); CaPTIVE.Menu["model"].SetActiveOption(3);};
            CaPTIVE.Dashboard.Model.Dimensions.message.onclick = CaPTIVE.Dashboard.Model.Dimensions.event;
            
            //
            //  Layer
            //
                //Defined
            CaPTIVE.Dashboard.Layers.Defined.event = function(){CaPTIVE.Menu.SetActive("layers"); CaPTIVE.Menu["layers"].SetActiveOption(1);};
            CaPTIVE.Dashboard.Layers.Defined.message.onclick = CaPTIVE.Dashboard.Layers.Defined.event;
                //Cancer
            CaPTIVE.Dashboard.Layers.Cancer.event = function(){CaPTIVE.Menu.SetActive("layers"); CaPTIVE.Menu["layers"].SetActiveOption(1);};
            CaPTIVE.Dashboard.Layers.Cancer.message.onclick = CaPTIVE.Dashboard.Layers.Cancer.event;    

            //
            //  Cancer
            //
                //Outlines
            CaPTIVE.Dashboard.Cancer.Outlines.event = function(){CaPTIVE.Menu.SetActive("cancer"); CaPTIVE.Menu["cancer"].SetActiveOption(0);};
            CaPTIVE.Dashboard.Cancer.Outlines.message.onclick = CaPTIVE.Dashboard.Cancer.Outlines.event;
                //Generated
            CaPTIVE.Dashboard.Cancer.Generated.event = function(){CaPTIVE.Menu.SetActive("cancer"); CaPTIVE.Menu["cancer"].SetActiveOption(1);};
            CaPTIVE.Dashboard.Cancer.Generated.message.onclick = CaPTIVE.Dashboard.Cancer.Generated.event;    

            
        },
        Workers: function(){
            CaPTIVE.Workers.files = new Worker("scripts/Applications/fileWorker.js");
            CaPTIVE.Workers.files.addEventListener('error', function(e){
                os.console.AppendComment('FILE WORKER ERROR:');
                os.console.AppendComment('Line: ' + e.lineno);
                os.console.AppendComment('Message: ' + e.message);
                os.console.Comment("");
            }, false);
        },
        Events: function(){
            document.getElementById("SStart").addEventListener("drop", CaPTIVE.Files.Load, false);
            document.getElementById("fileSelector").addEventListener("change", CaPTIVE.Files.Load, false);
        },
        Menu: function(){
            CaPTIVE.Menu.Load();
            document.getElementById("model-pitch").onchange = CaPTIVE.Entity.Set.Pitch;
            document.getElementById("model-yaw").onchange = CaPTIVE.Entity.Set.Yaw;
            
        },
        FSM: function(){ CaPTIVE.FSM = new CFiniteStateMachine(CaPTIVE);},
        Graphics: function(){
            os.graphics.Load(false, false, document.getElementById("3DView"));
            vec3.set([0,-2,-100],os.graphics.Managers.Camera.Position);
            os.graphics.Set.Callback.Draw(CaPTIVE.States.S3DViewer.Draw);
            os.graphics.Set.Callback.Update(CaPTIVE.States.S3DViewer.Update);
            
            //Controls
            document.getElementById("model-scale").onchange = CaPTIVE.Entity.Set.Scale;
            document.getElementById("model-alpha").onchange = CaPTIVE.Entity.Set.Alpha;
            document.getElementById("model-ambient").onchange = CaPTIVE.Entity.Set.AmbientLight;
            document.getElementById("model-specularity").onchange = CaPTIVE.Entity.Set.Specularity;
            
            //Load Orientation Arrows
            CaPTIVE.Entity.Orientation.rightTexture = os.graphics.Managers.Texture.Create.Texture("rightArrows", "scripts/Applications/arrow/right.png");
            CaPTIVE.Entity.Orientation.leftTexture = os.graphics.Managers.Texture.Create.Texture("leftArrows", "scripts/Applications/arrow/left.png");
            CaPTIVE.Entity.Orientation.mesh = os.graphics.Managers.Mesh.Create.Mesh("arrows", "scripts/Applications/arrow/arrows.json");
            
            CaPTIVE.Entity.Orientation.rightArrows = os.graphics.Managers.Entity.Create();
            CaPTIVE.Entity.Orientation.rightArrows.Graphics.Add.Mesh("arrows");
            CaPTIVE.Entity.Orientation.rightArrows.Graphics.Add.Texture("rightArrows");
            CaPTIVE.Entity.Orientation.rightArrows.Set.Scale(1,1,1);
            CaPTIVE.Entity.Orientation.rightArrows.Set.Position(-45,30,0);
            
            CaPTIVE.Entity.Orientation.leftArrows = os.graphics.Managers.Entity.Create();
            CaPTIVE.Entity.Orientation.leftArrows.Graphics.Add.Mesh("arrows");
            CaPTIVE.Entity.Orientation.leftArrows.Graphics.Add.Texture("leftArrows");
            CaPTIVE.Entity.Orientation.leftArrows.Set.Scale(1,1,1);
            CaPTIVE.Entity.Orientation.leftArrows.Set.Position(-45,30,0);
            
            CaPTIVE.Entity.Orientation.arrows = CaPTIVE.Entity.Orientation.leftArrows;
            
            //os.graphics.AddToDraw(CaPTIVE.Entity.Orientation.leftArrows);

            
        },
        States: function(){
            //
            //  Start State
            CaPTIVE.States.SStart = new CState("SStart");
            CaPTIVE.States.SStart.html = document.getElementById("SStart");
            CaPTIVE.States.SStart.Enter = function(){
                
            }
            CaPTIVE.States.SStart.Execute = function(){
                
            }
            CaPTIVE.States.SStart.Exit = function(){
                
            }
            //
            //  Load OBJ State
            CaPTIVE.States.SLoadOBJ = new CState("SLoadOBJ");
            CaPTIVE.States.SLoadOBJ.html = document.getElementById("SLoadOBJ");
            CaPTIVE.States.SLoadOBJ.Enter = function(owner, file){
                os.console.Comment("Load OBJ State: " + file.name);
                
                //Save File Object
                CaPTIVE.Files.obj = file;
                
                //Show Loader Spinner
                CaPTIVE.Spinner.Show();
                
                //Add event listener for File WebWorker
                CaPTIVE.Workers.files.addEventListener('message',CaPTIVE.States.SLoadOBJ.onMessage, false);
                
                //Creaete File Reader Object
                var reader = new FileReader();
                
                //Define onload event
                reader.onload = function(e){
                    //Send File To Worker
                    CaPTIVE.Workers.files.postMessage({type: "OBJ", data: e.target.result});
                }
                
                //Start File reading
                reader.readAsText(file.obj);
            }
            CaPTIVE.States.SLoadOBJ.Execute = function(){
                
            }
            CaPTIVE.States.SLoadOBJ.Exit = function(){
                CaPTIVE.Workers.files.removeEventListener('message',CaPTIVE.States.SLoadOBJ.onMessage, false);
            }
            CaPTIVE.States.SLoadOBJ.onMessage = function(msg){
                os.console.Comment("File Worker Complete");
                CaPTIVE.Spinner.Hide();
                
                //Update Dashbaord
                CaPTIVE.Status.OBJLoaded = true;
                CaPTIVE.Dashboard.Model.OBJ.message.innerHTML = "OBJ Loaded Successfully";
                CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Model.OBJ.light);
                if(CaPTIVE.Status.OBJDimensions && CaPTIVE.Status.OBJOrientation){
                    CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Overview.Models.light);
                    CaPTIVE.Dashboard.Overview.Models.message.innerHTML = "3D Model is Loaded and Configured";
                }
                else{
                    CaPTIVE.Dashboard.SetLight.Yellow(CaPTIVE.Dashboard.Overview.Models.light);
                    CaPTIVE.Dashboard.Overview.Models.message.innerHTML = "3D Model Needs Configuration";
                }
                
                //Create Scene node
                CaPTIVE.Entity.scene = os.graphics.Managers.Entity.Create();
                
                //Load OBJ into Entity
                CaPTIVE.Entity.model = os.graphics.Managers.Entity.Create();
                
                var polys = 0;
                var verts = 0;
                
                CaPTIVE.Files.mesh = msg.data;

                for(var i = 0; i < msg.data.length; i++){
                    var msh = os.graphics.Managers.Mesh.Create.Mesh("mesh"+i, null, msg.data[i]);
                    msh.Initialize();
                    polys += msh.numOfPolys;
                    verts += msh.numOfVerts;
                    CaPTIVE.Entity.model.Graphics.Add.Mesh(msh.name);
                }
                
                CaPTIVE.Entity.model.Graphics.Set.texture(false);
                CaPTIVE.Entity.model.Set.Scale(1,1,1);
                CaPTIVE.Entity.model.Set.Position(0,0,0);
                CaPTIVE.Entity.model.Graphics.Set.useBlendColor(true);
                CaPTIVE.Entity.model.Graphics.Set.blendColor([0.5, 0.5, 0.5]);
                CaPTIVE.Entity.model.Graphics.Set.enableAlpha(true);
                CaPTIVE.Entity.model.Default.yaw = 0;
                CaPTIVE.Entity.model.Default.pitch = 0;
                CaPTIVE.Entity.model.Graphics.Matrix.Pitch = mat4.create();
                mat4.identity(CaPTIVE.Entity.model.Graphics.Matrix.Pitch);
                
                //os.graphics.AddToDraw(CaPTIVE.Entity.model);
                
                //Update 3D Model Menu
                
                //Change Light Color on Overview
                document.getElementById("model-loaded-light").className = "led-green";
                document.getElementById("model-loaded-message").innerHTML = "3D Model Loaded";
                
                //  Remove Click Event
                var content = document.getElementById("model-gtlMenu-options-1-content");
                content.innerHTML = "<table cellspacing='5px'><tr><td>OBJ Name: </td><td>" + CaPTIVE.Files.obj.name  + "</td></tr><tr><td>Number of Meshes: </td><td>" + msg.data.length  + "</td></tr><tr><td>Number of Polys</td><td>" + polys + "</td></tr><tr><td>Number of Verts</td><td>" + verts + "</td></tr></table>";
                
                //Open Alignment Menu
                if(CaPTIVE.Menu.Current != "model"){ CaPTIVE.Menu.SetActive("model")};
                CaPTIVE.Menu.model.SetActiveOption(2);
                
                //Open 3D Viewer
                CaPTIVE.FSM.AnimatedTransition("S3DViewer", msg.data);
    
                
                
            }
            //
            //  Load JSON State
            CaPTIVE.States.SLoadJSON = new CState("SLoadJSON");
            CaPTIVE.States.SLoadJSON.html = document.getElementById("SLoadJSON");
            CaPTIVE.States.SLoadJSON.Enter = function(owner, file){
                os.console.Comment("Load JSON State: " + file.name);
                
                
                //Show Loader Spinner
                CaPTIVE.Spinner.Show();
                
                //Creaete File Reader Object
                var reader = new FileReader();
                
                //Define onload event
                reader.onload = function(e){
                    CaPTIVE.Files.json = JSON.parse(e.target.result);
                    
                    //Save json properties to CaPTIVE
                    CaPTIVE.Status = CaPTIVE.Files.json.Status;
                    CaPTIVE.Entity.Dimensions = CaPTIVE.Files.json.Dimensions;
                    CaPTIVE.Entity.Layers = CaPTIVE.Files.json.Layers;
                    CaPTIVE.Files.mesh = CaPTIVE.Files.json.mesh;
                    CaPTIVE.Files.obj = CaPTIVE.Files.json.obj;
                    
                    document.getElementById('model-blue-label').value = CaPTIVE.Files.json.blue ? CaPTIVE.Files.json.blue : "";
                    document.getElementById('model-white-label').value = CaPTIVE.Files.json.red ? CaPTIVE.Files.json.red : "";
                    document.getElementById('model-green-label').value = CaPTIVE.Files.json.green ? CaPTIVE.Files.json.green : "";
                
                    
                    //Update CaPTIVE State
                    CaPTIVE.States.SLoadJSON.Load();
                    
                    //Load Complete, Hide Spinner
                    CaPTIVE.Spinner.Hide();
                    
                    //Transition to Layer Definition
                    CaPTIVE.FSM.AnimatedTransition("SLayerDefinition");
                    
                    //Open Alignment Menu
                    if(CaPTIVE.Menu.Current != "layers"){ CaPTIVE.Menu.SetActive("layers")};
                    CaPTIVE.Menu.model.SetActiveOption(1);
                    
                }
                
                //Start File reading
                reader.readAsText(file.obj);
            }
            CaPTIVE.States.SLoadJSON.Execute = function(){
                
            }
            CaPTIVE.States.SLoadJSON.Exit = function(){
                //Hide Spinner
                CaPTIVE.Spinner.Hide();
            }
            CaPTIVE.States.SLoadJSON.Load = function(){
                //
                //  3D Excision Model
                //
                if(CaPTIVE.Status.OBJLoaded){
                     //Update Dashbaord

                    CaPTIVE.Dashboard.Model.OBJ.message.innerHTML = "OBJ Loaded Successfully";
                    CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Model.OBJ.light);
                    if(CaPTIVE.Status.OBJDimensions && CaPTIVE.Status.OBJOrientation){
                        CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Overview.Models.light);
                        CaPTIVE.Dashboard.Overview.Models.message.innerHTML = "3D Model is Loaded and Configured";
                    }
                    else{
                        CaPTIVE.Dashboard.SetLight.Yellow(CaPTIVE.Dashboard.Overview.Models.light);
                        CaPTIVE.Dashboard.Overview.Models.message.innerHTML = "3D Model Needs Configuration";
                    }
                    
                    //Create Scene node
                    CaPTIVE.Entity.scene = os.graphics.Managers.Entity.Create();
                    
                    //Load OBJ into Entity
                    CaPTIVE.Entity.model = os.graphics.Managers.Entity.Create();
                    
                    var polys = 0;
                    var verts = 0;
                    
    
                    for(var i = 0; i < CaPTIVE.Files.mesh.length; i++){
                        var msh = os.graphics.Managers.Mesh.Create.Mesh("mesh"+i, null, CaPTIVE.Files.mesh[i]);
                        msh.Initialize();
                        polys += msh.numOfPolys;
                        verts += msh.numOfVerts;
                        CaPTIVE.Entity.model.Graphics.Add.Mesh(msh.name);
                    }
                    
                    CaPTIVE.Entity.model.Graphics.Set.texture(false);
                    CaPTIVE.Entity.model.Set.Scale(1,1,1);
                    CaPTIVE.Entity.model.Set.Position(0,0,0);
                    CaPTIVE.Entity.model.Graphics.Set.useBlendColor(true);
                    CaPTIVE.Entity.model.Graphics.Set.blendColor([0.5, 0.5, 0.5]);
                    CaPTIVE.Entity.model.Graphics.Set.enableAlpha(true);
                    CaPTIVE.Entity.model.Default.yaw = 0;
                    CaPTIVE.Entity.model.Default.pitch = 0;
                    CaPTIVE.Entity.model.Graphics.Matrix.Pitch = mat4.create();
                    mat4.identity(CaPTIVE.Entity.model.Graphics.Matrix.Pitch);
                    
                    os.graphics.AddToDraw(CaPTIVE.Entity.model);
                    
                    //Update 3D Model Menu
                    
                    //Change Light Color on Overview
                    document.getElementById("model-loaded-light").className = "led-green";
                    document.getElementById("model-loaded-message").innerHTML = "3D Model Loaded";
                    
                    //  Remove Click Event
                    var content = document.getElementById("model-gtlMenu-options-1-content");
                    content.innerHTML = "<table cellspacing='5px'><tr><td>OBJ Name: </td><td>" + CaPTIVE.Files.obj.name  + "</td></tr><tr><td>Number of Meshes: </td><td>" + CaPTIVE.Files.mesh.length  + "</td></tr><tr><td>Number of Polys</td><td>" + polys + "</td></tr><tr><td>Number of Verts</td><td>" + verts + "</td></tr></table>";
                    
                    if(CaPTIVE.Files.json.Margin){
                        if(CaPTIVE.Files.json.Margin.low){
                            document.getElementById("cancer-margin-low-value").value = CaPTIVE.Files.json.Margin.low;
                            CaPTIVE.Entity.Set.LowMargin();
                        }
                        
                        if(CaPTIVE.Files.json.Margin.high){
                            document.getElementById("cancer-margin-high-value").value = CaPTIVE.Files.json.Margin.high;
                            CaPTIVE.Entity.Set.HighMargin();
                            
                        }
                    }
                    
                }
                if(CaPTIVE.Status.OBJOrientation){
                    //
                    //  Update Lights in Dashboard and Model Menus
                    //
                    //Update Dashbaord
                    CaPTIVE.Dashboard.Model.Aligned.message.innerHTML = "OBJ Successfully Aligned";
                    CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Model.Aligned.light);
                    if(CaPTIVE.Status.OBJLoaded && CaPTIVE.Status.OBJDimensions && CaPTIVE.Status.OBJOrientation){
                        CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Overview.Models.light);
                        CaPTIVE.Dashboard.Overview.Models.message.innerHTML = "3D Model is Loaded and Configured";
                    }
                    else{
                        CaPTIVE.Dashboard.SetLight.Yellow(CaPTIVE.Dashboard.Overview.Models.light);
                        CaPTIVE.Dashboard.Overview.Models.message.innerHTML = "3D Model Needs Configuration";
                    }
                    
                    //Update 3D Model Menu
                    
                    //Change Light Color on Overview
                    document.getElementById("model-aligned-light").className = "led-green";
                    document.getElementById("model-aligned-message").innerHTML = "3D Model Aligned";
                   
                    //Set Alignment Shader Uniform
                    CaPTIVE.Entity.model.Graphics.Set.aligned(true);
                }
                if(CaPTIVE.Status.OBJDimensions){
                    //Save values in textboxes
                    document.getElementById("model-width").value = +CaPTIVE.Entity.Dimensions.width;
                    document.getElementById("model-height").value = +CaPTIVE.Entity.Dimensions.height;
                    document.getElementById("model-depth").value= +CaPTIVE.Entity.Dimensions.depth;
                    
                    
                    //
                    //  Update Lights in Dashboard and Model Menus
                    //
                    CaPTIVE.Dashboard.Model.Dimensions.message.innerHTML = "OBJ Dimensions Set Successfully";
                    CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Model.Dimensions.light);
                    if(CaPTIVE.Status.OBJLoaded && CaPTIVE.Status.OBJDimensions && CaPTIVE.Status.OBJOrientation){
                        CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Overview.Models.light);
                        CaPTIVE.Dashboard.Overview.Models.message.innerHTML = "3D Model is Loaded and Configured";
                    }
                    else{
                        CaPTIVE.Dashboard.SetLight.Yellow(CaPTIVE.Dashboard.Overview.Models.light);
                        CaPTIVE.Dashboard.Overview.Models.message.innerHTML = "3D Model Needs Configuration";
                    }
                    
                    //Update Model Menu
                    
                    //Change Light Color on Overview
                    document.getElementById("model-dimensions-light").className = "led-green";
                    document.getElementById("model-dimensions-message").innerHTML = "3D Model Dimensions Set";
                    
                }
                //
                //  Layers
                //
                if(CaPTIVE.Status.LayersDefined){
                    //Set Dashboard Light to Yellow
                    CaPTIVE.Dashboard.SetLight.Yellow(CaPTIVE.Dashboard.Overview.Layers.light);
                    CaPTIVE.Dashboard.Overview.Layers.message.innerHTML = "Layers Need Configuration";
                    
                    //Set Layer Dashboard Light Green    
                    CaPTIVE.Dashboard.Layers.Defined.message.innerHTML = CaPTIVE.Entity.Layers.length + " defined";
                    CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Layers.Defined.light);
                    
                    //Set Layer Overview Tab Light
                    CaPTIVE.Dashboard.SetLight.Green(document.getElementById("layer-defined-light"));
                    document.getElementById("layer-defined-message").innerHTML = CaPTIVE.Entity.Layers.length + " defined";
                    
                    
                    //Hide Input
                    document.getElementById("layer-definition").className += " hide";
                    
                    //Build Table
                    document.getElementById("layer-overview").className = "datagrid";  
                    CaPTIVE.States.SLoadJSON.BuildLayersTable();
                    
                    //Update Menu (Update/Remove Button)
                        //Overview
                    document.getElementById("layer-overview-button").innerHTML = "View Layers";
                    
                    
                    
                }
                if(CaPTIVE.Status.LayersWithCancer){
                    var configured = true;
                    var i = 0;
                    while((i < CaPTIVE.Entity.Layers.length) && configured){
                        if(CaPTIVE.Entity.Layers[i].cancer == null){
                            configured = false;
                        }
                        i++;
                    }
                    
                    if(configured){
                        //Update Lights and Labels
                        //Set Dashboard Light to Yellow
                        CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Overview.Layers.light);
                        CaPTIVE.Dashboard.Overview.Layers.message.innerHTML = "Layers Configured";
                        
                        //Set Layer Dashboard Light Green    
                        CaPTIVE.Dashboard.Layers.Cancer.message.innerHTML =  "Cancer Layers Identified";
                        CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Layers.Cancer.light);
                        
                        //Set Layer Overview Tab Light
                        CaPTIVE.Dashboard.SetLight.Green(document.getElementById("layer-cancer-light"));
                        document.getElementById("layer-cancer-message").innerHTML = "Cancer Layers Identified";
                        
                    }
                    
                    //
                    //  Cancer Outlines
                    //
                    //Test to see if all Cancer Layers Have Traces
                    //If so, enable Cancer Generation Mode and Update Lights
                    var tracesDefined = 0;
                    var tracesLoaded  = 0;
                    var i = 0;
                    
                    for(var i = 0; i < CaPTIVE.Entity.Layers.length; i++){
                        if(CaPTIVE.Entity.Layers[i].cancer){
                            tracesDefined++;
                            if(CaPTIVE.Entity.Layers[i].outlines.length > 0){
                                tracesLoaded++;
                            }
                        }
                    }
                    
                    //No Traces Defined, Set Light Red
                    if(tracesLoaded == 0){
                        CaPTIVE.Dashboard.SetLight.Red(CaPTIVE.Dashboard.Cancer.Outlines.light);
                        CaPTIVE.Dashboard.SetLight.Red(document.getElementById("cancer-outlines-light"));
                        CaPTIVE.Status.CancerLayersOutlined = false;
                    }
                    //All Traces Defined, Set Light Yellow
                    else if(tracesLoaded < tracesDefined){   
                        CaPTIVE.Dashboard.SetLight.Yellow(CaPTIVE.Dashboard.Cancer.Outlines.light);
                        CaPTIVE.Dashboard.SetLight.Yellow(document.getElementById("cancer-outlines-light"));
                        
                        CaPTIVE.Dashboard.Cancer.Outlines.message.innerHTML = "Some Cancer Missing Traces";
                        document.getElementById("cancer-outlines-message").innerHTML ="Some Cancer Missing Traces"
                        
                        CaPTIVE.Status.CancerLayersOutlined = false;
                    }
                    //All Loaded and Defined, Set Light Green
                    else { 
                        CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Cancer.Outlines.light);
                        CaPTIVE.Dashboard.SetLight.Green(document.getElementById("cancer-outlines-light"));
                        
                        CaPTIVE.Dashboard.Cancer.Outlines.message.innerHTML ="All Cancer Traces Complete";
                        document.getElementById("cancer-outlines-message").innerHTML ="All Cancer Traces Complete";
                        
                        //Set Dashboard Overview to Yellow
                        CaPTIVE.Dashboard.SetLight.Yellow(CaPTIVE.Dashboard.Overview.Cancer.light);
                        CaPTIVE.Dashboard.Overview.Cancer.message.innerHTML = "Cancer Need To Be Generated";
                        
                        CaPTIVE.Status.CancerLayersOutlined = true;
                    
                    }
                
                }
                if(CaPTIVE.Status.CancerObjectsGenerated){
                    //Create Cancer Entities                
                    for(var j = 0; j < CaPTIVE.Entity.Layers.length; j++){
                        var layer = CaPTIVE.Entity.Layers[j];
                        //If Cancer Exist In Layer, Build Graphics Entity
                        if(layer.cancer){
                            for(var k = 0; k < layer.json.length; k++){
                                var list = layer.json[k]
                                //Create Entity
                                CaPTIVE.Entity.Cancers[layer.id] = os.graphics.Managers.Entity.Create();
                                
                                CaPTIVE.Entity.Cancers[layer.id].Graphics.Set.texture(false);
                                CaPTIVE.Entity.Cancers[layer.id].Set.Scale(1,1,1);
                                CaPTIVE.Entity.Cancers[layer.id].Set.Position(0,0,0);
                                CaPTIVE.Entity.Cancers[layer.id].Graphics.Set.useBlendColor(true);
                                CaPTIVE.Entity.Cancers[layer.id].Graphics.Set.blendColor([0.5, 0.5, 0.5]);
                                CaPTIVE.Entity.Cancers[layer.id].Graphics.Set.enableAlpha(false);
                                CaPTIVE.Entity.Cancers[layer.id].Graphics.Set.aligned(true);
                                CaPTIVE.Entity.Cancers[layer.id].Default.yaw = 0;
                                CaPTIVE.Entity.Cancers[layer.id].Default.pitch = 0;
                                CaPTIVE.Entity.Cancers[layer.id].Graphics.Matrix.Pitch = mat4.create();
                                mat4.identity(CaPTIVE.Entity.Cancers[layer.id].Graphics.Matrix.Pitch);
                                    
                                for(var i = 0; i < list.length; i++){
                                    //Initialize Mesh
                                    var msh = os.graphics.Managers.Mesh.Create.Mesh("layer" + layer.id + "-" + j + "-" + i , null, list[i]);
                                    msh.Initialize();
                                    CaPTIVE.Entity.Cancers[layer.id].Graphics.Add.Mesh(msh.name);
                                }
                                
                            }
                            if(CaPTIVE.Entity.Cancers[i]){
                                //os.graphics.AddToDraw(CaPTIVE.Entity.Cancers[layer.id]);
                            }
                        }
                    }
                    
                    CaPTIVE.Dashboard.SetLight.Green(document.getElementById("cancer-generated-light"));
                    document.getElementById("cancer-generated-message").innerHTML ="Cancer Generation Complete";
                    
                    CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Overview.Cancer.light);
                    CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Cancer.Generated.light);
                    CaPTIVE.Dashboard.Cancer.Generated.message.innerHTML = "Cancer Generation Complete";
                    CaPTIVE.Dashboard.Overview.Cancer.message.innerHTML = "Cancer Generation Complete";
                    
                    
                }
            }
            CaPTIVE.States.SLoadJSON.BuildLayersTable = function(){
                var html = "";
                var ColorImage = function(layer){
                    return layer.img == null ? 'red' : 'green';
                }
                var AddImage = function(layer){
                    var out = "";
                    if(layer.img){
                        out = '<td><a target="_blank" href="' + layer.img + '"><div id="' + layer.id + '-layer-image" class="led-' + ColorImage(layer) + '"></div></a></td>'; 
                    }
                    else{
                        out = '<td><div id="' + layer.id + '-layer-image" class="led-' + ColorImage(layer) + '"></div></td>'; ;
                    }
                    return out;
                }
                var ColorCancer = function(layer){
                    var color = 'blue';
                    if(layer.cancer == true){color = 'green';}
                    else if(layer.cancer == false){color = 'red';}
                    
                    return color;
                }
                var ColorTrace = function(layer){
                    return layer.outlines.length > 0 ? 'green' : 'red';
                }
                var Color3D = function(layer){
                    return layer.json == null > 0 ? 'red' : 'green';
                }
                
                var AddRow = function(layer){
                    return "<tr>" +
                        "<td>" + (layer.id + 1) +"</td>" +
                        "<td>"+ layer.start.toFixed(1) +"</td>" +
                        "<td>"+ layer.stop.toFixed(1) +"</td>" +
                        "<td><div id='" + layer.id + "-layer-cancer' onclick='CaPTIVE.States.SLayerDefinition.ToggleCancer("+ layer.id +");' class='led-" + ColorCancer(layer) + "'></div></td>" +
                        AddImage(layer) +
                        //"<td><div id='" + layer.id + "-layer-image' class='led-" + ColorImage(layer) + "'></div></td>" +
                        "<td><div id='" + layer.id + "-layer-trace' class='led-" + ColorTrace(layer) + "'></div></td>" +
                        "<td><div id='" + layer.id + "-layer-3d' class='led-" + Color3D(layer) + "'></div></td>" +
                    "</tr>";
                }
                
                var AddAltRow = function(layer){
                    return "<tr class='alt'>" +
                        "<td>" + (layer.id + 1) +"</td>" +
                        "<td>"+ layer.start.toFixed(1) +"</td>" +
                        "<td>"+ layer.stop.toFixed(1) +"</td>" +
                        "<td><div id='" + layer.id + "-layer-cancer' onclick='CaPTIVE.States.SLayerDefinition.ToggleCancer("+ layer.id +");' class='led-" + ColorCancer(layer) + "'></div></td>" +
                        AddImage(layer) +
                        //"<td><div id='" + layer.id + "-layer-image' class='led-" + ColorImage(layer) + "'></div></td>" +
                        "<td><div id='" + layer.id + "-layer-trace' class='led-" + ColorTrace(layer) + "'></div></td>" +
                        "<td><div id='" + layer.id + "-layer-3d' class='led-" + Color3D(layer) + "'></div></td>" +
                    "</tr>";
                }
                
                //Add Table Header
                html = "<p>Layer Details</p><table><thead><tr><th>ID</th><th>Start</th><th>Stop</th><th>Cancer</th><th>Image</th><th>Trace</th><th>3D</th></tr></thead><tbody>"
                
                for(var i = 0; i < CaPTIVE.Entity.Layers.length; i++){
                    if(i%2){
                        html += AddRow(CaPTIVE.Entity.Layers[i]);
                    }
                    else{
                        html += AddAltRow(CaPTIVE.Entity.Layers[i]);
                    }
                }
                
                
                html += "</tbody></table>";
                document.getElementById("layer-overview").innerHTML = html;
            }
            //
            //  Save JSON State
            CaPTIVE.States.SSaveJSON = new CState("SSaveJSON");
            CaPTIVE.States.SSaveJSON.html = document.getElementById("SSaveJSON");
            CaPTIVE.States.SSaveJSON.Enter = function(){
                //Build Modal
                var caseNumber = CaPTIVE.Files.json.caseNumber ? CaPTIVE.Files.json.caseNumber : "";
                var date =  CaPTIVE.Files.json.date ? CaPTIVE.Files.json.date : "";
                var site = CaPTIVE.Files.json.site ? CaPTIVE.Files.json.site : "";
                var filename = CaPTIVE.Files.json.filename ? CaPTIVE.Files.json.filename : "";
                
                document.getElementById("modalContent").innerHTML = "<h2>Save Case</h2>"+
                '<table cellspacing="5px">' +
                '<tr>' +
                    '<td class="statusLabel">' +
                        'Case Number:' +
                    '</td>' +
                    '<td>' +
                       '<input class="textbox" type="text" id="json-caseNumber" value="' + caseNumber +'">' +
                    '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td class="statusLabel">' +
                        'Date:' +
                    '</td>' +
                    '<td>' +
                       '<input class="textbox" type="text" id="json-date" value="' + date +'">' +
                    '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td class="statusLabel">' +
                        'Specimen Site:' +
                    '</td>' +
                    '<td>' +
                       '<input class="textbox" type="text" id="json-site" value="' + site +'">' +
                    '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td class="statusLabel">' +
                        'Filename:' +
                    '</td>' +
                    '<td>' +
                       '<input class="textbox" type="text" id="json-filename" value="' + filename +'">' +
                    '</td>' +
                '</tr>' +
                "<tr><td></td><td><a class='button' onclick='CaPTIVE.States.SSaveJSON.Save();'>Save</a></td></tr></table>";
                
                
                CaPTIVE.Modal.Show();
            }
            CaPTIVE.States.SSaveJSON.Execute = function(){
                
            }
            CaPTIVE.States.SSaveJSON.Exit = function(){
                //Hide Spinner
                CaPTIVE.Spinner.Hide();
            }
            CaPTIVE.States.SSaveJSON.Save = function(){
                CaPTIVE.Modal.Hide();
                CaPTIVE.Spinner.Show();
                var filename = document.getElementById('json-filename').value;
                
                var output = {};
                output.Layers = CaPTIVE.Entity.Layers;
                output.Status = CaPTIVE.Status;
                output.Dimensions = CaPTIVE.Entity.Dimensions;
                output.mesh = CaPTIVE.Files.mesh;
                output.obj = CaPTIVE.Files.obj;
                output.filename = filename;
                output.caseNumber = document.getElementById('json-caseNumber').value;
                output.date = document.getElementById('json-date').value;
                output.site = document.getElementById('json-site').value;
                output.Margin ={
                    low: document.getElementById("cancer-margin-low-value").value,
                    high: document.getElementById("cancer-margin-high-value").value
                }
                
                output.blue = document.getElementById('model-blue-label').value;
                output.red = document.getElementById('model-white-label').value;
                output.green = document.getElementById('model-green-label').value;
                
                var blob = new Blob([JSON.stringify(output)]);
                saveAs(blob, filename +".cap");
                CaPTIVE.Spinner.Hide();
            }
            //
            //  Layer Editor State
            CaPTIVE.States.SLayerEditor = new CState("SLayerEditor");
            CaPTIVE.States.SLayerEditor.html = document.getElementById("SLayerEditor");
            CaPTIVE.States.SLayerEditor.Enter = function(owner, file){
                os.console.Comment("Layer Editor State");
                WinScene.elements.window.AppendToID("SLayerEditor");
                WinMiniMap.elements.window.AppendToID("SLayerEditor");
                CaPTIVE.ImageEditor.Toolbar.BuildLayerIcons();
                CaPTIVE.ImageEditor.Launch();
                
                CaPTIVE.States.SImageEditor.LoadEvents();
            }
            CaPTIVE.States.SLayerEditor.Execute = function(){
                
            }
            CaPTIVE.States.SLayerEditor.Exit = function(){
                CaPTIVE.ImageEditor.Toolbar.Clear();
                CaPTIVE.States.SImageEditor.RemoveEvents();
            }
            //
            //  Image Editor State
            CaPTIVE.States.SImageEditor = new CState("SImageEditor");
            CaPTIVE.States.SImageEditor.html = document.getElementById("SImageEditor");
            CaPTIVE.States.SImageEditor.Enter = function(owner, file){
                os.console.Comment("Image Editor State");
                WinScene.elements.window.AppendToID("SImageEditor");
                WinMiniMap.elements.window.AppendToID("SImageEditor");
                CaPTIVE.ImageEditor.Toolbar.BuildImageIcons();
                CaPTIVE.ImageEditor.Launch();
                
                //File was passed in
                if(file){
                    os.console.Comment("Loading Image: " + file.name);
                    var reader = new FileReader();
                    
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
                            CaPTIVE.ImageEditor.Scene.Entities.push(ent);
                            
                            //Loop through all entities and set scene size to 2 * largest entity
                            //  dimension
                            for(var i = 0; i < CaPTIVE.ImageEditor.Scene.Entities.length; i++){
                                if (CaPTIVE.ImageEditor.Scene.width < 2 * CaPTIVE.ImageEditor.Scene.Entities[i].width)
                                    CaPTIVE.ImageEditor.Scene.width = 2 * CaPTIVE.ImageEditor.Scene.Entities[i].width;
                            }
                            
                            CaPTIVE.ImageEditor.Scene.height = CaPTIVE.ImageEditor.Scene.width;
                            
                            ent.Position.x = 0;
                            ent.Position.y = 0;
                            
                            //Set scene scale
                            CaPTIVE.ImageEditor.Scene.scaleWidth =  CaPTIVE.ImageEditor.Scene.canvas.html().width / CaPTIVE.ImageEditor.Scene.width;
                            CaPTIVE.ImageEditor.Scene.scaleHeight = CaPTIVE.ImageEditor.Scene.canvas.html().height / CaPTIVE.ImageEditor.Scene.height;
                            
                            CaPTIVE.ImageEditor.MiniMap.scaleWidth = CaPTIVE.ImageEditor.MiniMap.canvas.html().width / CaPTIVE.ImageEditor.Scene.width;
                            CaPTIVE.ImageEditor.MiniMap.scaleHeight = CaPTIVE.ImageEditor.MiniMap.canvas.html().height / CaPTIVE.ImageEditor.Scene.height;
                            
                            CaPTIVE.ImageEditor.Viewport.scale = 1;
                            CaPTIVE.ImageEditor.Viewport.Position.x = 0;
                            CaPTIVE.ImageEditor.Viewport.Position.y = 0;
                            CaPTIVE.ImageEditor.Update();
                            img.style.width = "100px";
                            img.style.width = "100px";
                            }, 100)
                        
                    }
                    
                    reader.readAsDataURL(file.obj);
                }
                //Add Event Listeners
                CaPTIVE.States.SImageEditor.LoadEvents();
                
                
            }
            CaPTIVE.States.SImageEditor.Execute = function(){
                
            }
            CaPTIVE.States.SImageEditor.Exit = function(){
                
                CaPTIVE.ImageEditor.Toolbar.Clear();
                
                //Remove Event Listeners
                CaPTIVE.States.SImageEditor.RemoveEvents();
                
               }
            CaPTIVE.States.SImageEditor.Events = {
                Open: function(e){
                    var file = {};
                    file.name = e.target.files[0].name;
                    file.type = e.target.files[0].type;
                    file.ext = e.target.files[0].name.substr(e.target.files[0].name.lastIndexOf(".") + 1).toUpperCase();
                    file.obj = e.target.files[0];
                
                    os.console.Comment("File Loaded: " + file.name);
                
                    //test for image
                    if(file.type.search("image") >= 0){
                        os.console.Comment("Loading Image: " + file.name);
                        var reader = new FileReader();
                        
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
                                CaPTIVE.ImageEditor.Scene.Entities.push(ent);
                                
                                //Loop through all entities and set scene size to 2 * largest entity
                                //  dimension
                                for(var i = 0; i < CaPTIVE.ImageEditor.Scene.Entities.length; i++){
                                    if (CaPTIVE.ImageEditor.Scene.width < 2 * CaPTIVE.ImageEditor.Scene.Entities[i].width)
                                        CaPTIVE.ImageEditor.Scene.width = 2 * CaPTIVE.ImageEditor.Scene.Entities[i].width;
                                }
                                
                                CaPTIVE.ImageEditor.Scene.height = CaPTIVE.ImageEditor.Scene.width;
                                
                                ent.Position.x = 0;
                                ent.Position.y = 0;
                                
                                //Set scene scale
                                CaPTIVE.ImageEditor.Scene.scaleWidth =  CaPTIVE.ImageEditor.Scene.canvas.html().width / CaPTIVE.ImageEditor.Scene.width;
                                CaPTIVE.ImageEditor.Scene.scaleHeight = CaPTIVE.ImageEditor.Scene.canvas.html().height / CaPTIVE.ImageEditor.Scene.height;
                                
                                CaPTIVE.ImageEditor.MiniMap.scaleWidth = CaPTIVE.ImageEditor.MiniMap.canvas.html().width / CaPTIVE.ImageEditor.Scene.width;
                                CaPTIVE.ImageEditor.MiniMap.scaleHeight = CaPTIVE.ImageEditor.MiniMap.canvas.html().height / CaPTIVE.ImageEditor.Scene.height;
                                
                                CaPTIVE.ImageEditor.Viewport.scale = 1;
                                CaPTIVE.ImageEditor.Viewport.Position.x = 0;
                                CaPTIVE.ImageEditor.Viewport.Position.y = 0;
                                CaPTIVE.ImageEditor.Update();
                                img.style.width = "100px";
                                img.style.width = "100px";
                                }, 100)
                            
                        }
                        
                        reader.readAsDataURL(file.obj);
                    }
                },
                OpenLayer: function(e){
                    var file = {};
                    file.name = e.target.files[0].name;
                    file.type = e.target.files[0].type;
                    file.ext = e.target.files[0].name.substr(e.target.files[0].name.lastIndexOf(".") + 1).toUpperCase();
                    file.obj = e.target.files[0];
                
                    os.console.Comment("File Loaded: " + file.name);
                
                    //test for image
                    if(file.type.search("image") >= 0){
                        os.console.Comment("Loading Layer: " + file.name);
                        var reader = new FileReader();
                        
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
                                CaPTIVE.ImageEditor.Scene.Entities = [];
                                CaPTIVE.ImageEditor.Scene.Entities.push(ent);
                                
                                //Loop through all entities and set scene size to 2 * largest entity
                                //  dimension
                                for(var i = 0; i < CaPTIVE.ImageEditor.Scene.Entities.length; i++){
                                    if (CaPTIVE.ImageEditor.Scene.width < 2 * CaPTIVE.ImageEditor.Scene.Entities[i].width)
                                        CaPTIVE.ImageEditor.Scene.width = 2 * CaPTIVE.ImageEditor.Scene.Entities[i].width;
                                }
                                
                                CaPTIVE.ImageEditor.Scene.height = CaPTIVE.ImageEditor.Scene.width;
                                
                                ent.Position.x = 0;
                                ent.Position.y = 0;
                                
                                //Set scene scale
                                CaPTIVE.ImageEditor.Scene.scaleWidth =  CaPTIVE.ImageEditor.Scene.canvas.html().width / CaPTIVE.ImageEditor.Scene.width;
                                CaPTIVE.ImageEditor.Scene.scaleHeight = CaPTIVE.ImageEditor.Scene.canvas.html().height / CaPTIVE.ImageEditor.Scene.height;
                                
                                CaPTIVE.ImageEditor.MiniMap.scaleWidth = CaPTIVE.ImageEditor.MiniMap.canvas.html().width / CaPTIVE.ImageEditor.Scene.width;
                                CaPTIVE.ImageEditor.MiniMap.scaleHeight = CaPTIVE.ImageEditor.MiniMap.canvas.html().height / CaPTIVE.ImageEditor.Scene.height;
                                
                                CaPTIVE.ImageEditor.Viewport.scale = 1;
                                CaPTIVE.ImageEditor.Viewport.Position.x = 0;
                                CaPTIVE.ImageEditor.Viewport.Position.y = 0;
                                CaPTIVE.ImageEditor.Update();
                                img.style.width = "100px";
                                img.style.width = "100px";
                                }, 100)
                            
                        }
                        
                        reader.readAsDataURL(file.obj);
                    }

                },
                Keypress: function(e){
                    
                    //
                    //  Image Adjustments
                    //
                    
                    if(String.fromCharCode(e.keyCode) == "A"){     //Image Left
                        //os.graphics.Managers.Camera.MoveDown(10);
                        CaPTIVE.ImageEditor.Scene.Entities[CaPTIVE.ImageEditor.Scene.Entities.length - 1].Position.x -= 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        
                        var length = CaPTIVE.ImageEditor.Scene.Entities.length;
                        //if(CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask)
                        //    CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.start.x -= 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        //    //CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.start.y -= 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        //    CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.stop.x -= 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        //    //CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.stop.y -= 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        //
                        CaPTIVE.ImageEditor.Update();
                    }
                    else if(String.fromCharCode(e.keyCode) == "D"){     //Image Right
                        //os.graphics.Managers.Camera.MoveDown(10);
                        CaPTIVE.ImageEditor.Scene.Entities[CaPTIVE.ImageEditor.Scene.Entities.length - 1].Position.x += 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        
                        var length = CaPTIVE.ImageEditor.Scene.Entities.length;
                        //if(CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask)
                        //    CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.start.x += 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        //    //CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.start.y -= 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        //    CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.stop.x += 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        //    //CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.stop.y -= 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        //
                        CaPTIVE.ImageEditor.Update();
                    }
                    else if(String.fromCharCode(e.keyCode) == "W"){     //Image Up
                        //os.graphics.Managers.Camera.MoveDown(10);
                        CaPTIVE.ImageEditor.Scene.Entities[CaPTIVE.ImageEditor.Scene.Entities.length - 1].Position.y -= 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        
                        var length = CaPTIVE.ImageEditor.Scene.Entities.length;
                        //if(CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask)
                        //    //CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.start.x -= 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        //    CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.start.y -= 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        //    //CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.stop.x -= 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        //    CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.stop.y -= 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        //
                        CaPTIVE.ImageEditor.Update();
                    }
                    else if(String.fromCharCode(e.keyCode) == "S"){     //Image Down
                        //os.graphics.Managers.Camera.MoveDown(10);
                        CaPTIVE.ImageEditor.Scene.Entities[CaPTIVE.ImageEditor.Scene.Entities.length - 1].Position.y += 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        
                        var length = CaPTIVE.ImageEditor.Scene.Entities.length;
                        //if(CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask)
                        //    //CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.start.x -= 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        //    CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.start.y += 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        //    //CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.stop.x -= 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        //    CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.stop.y += 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        //
                        CaPTIVE.ImageEditor.Update();
                    }
                    
                    //
                    //  Viewport
                    //
                    
                    else if(e.keyCode == 37){     //Left Viewport
                        e.preventDefault();
                        CaPTIVE.ImageEditor.Viewport.Position.x += 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        CaPTIVE.ImageEditor.Update();
                    }
                    else if(e.keyCode == 39){     //Right Viewport
                        e.preventDefault();
                        CaPTIVE.ImageEditor.Viewport.Position.x -= 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        CaPTIVE.ImageEditor.Update();
                    }
                    else if(e.keyCode == 38){     //Up Viewport
                        e.preventDefault();
                        CaPTIVE.ImageEditor.Viewport.Position.y += 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        //CaPTIVE.ImageEditor.Viewport.Update();
                        CaPTIVE.ImageEditor.Update();
                    }
                    else if(e.keyCode == 40){     //Down Viewport
                        e.preventDefault();
                        CaPTIVE.ImageEditor.Viewport.Position.y -= 50 / CaPTIVE.ImageEditor.Viewport.scale;
                        //CaPTIVE.ImageEditor.Viewport.Update();
                        CaPTIVE.ImageEditor.Update();
                    }
                    
                    //
                    //  Image Editing Keys
                    //
                    else if(String.fromCharCode(e.keyCode) == "C"){     //Crop Enable
                        //CaPTIVE.States.SCaPTIVE.ImageEditor.Events.Editor.Mode = "CROP";
                        //WinScene.Set.statusbarText(CaPTIVE.States.SImageEditor.Events.Editor.Mode);
                        //os.console.Comment("Image Cropping Enable");
                    }
                    else if(e.keyCode == 13){     //Enter   Key/Save Canvas
                        if(CaPTIVE.States.SImageEditor.Events.Editor.Mode == "CROP"){
                            CaPTIVE.ImageEditor.CropImage();
                            WinScene.Set.statusbarText(CaPTIVE.States.SImageEditor.Events.Editor.Mode);
                        }
                        else if(CaPTIVE.States.SImageEditor.Events.Editor.Mode == "SAVE CANVAS"){
                            os.console.Comment("Saving Canvas To File");
                            CaPTIVE.ImageEditor.Modals.SaveCanvas();
                        }
                        
                    }
                    else if(String.fromCharCode(e.keyCode) == "M"){     //Image Moving Enable
                        os.console.Comment("Image Moving Enable");
                        CaPTIVE.ImageEditor.SetMode.ImageMove();
                    }
                    
                    //
                    //  Control Keys
                    //
                    
                    else if(e.keyCode == 16){     //Shift
                        e.preventDefault();
                        CaPTIVE.States.SImageEditor.Events.Key.shift = true;
                        CaPTIVE.States.SImageEditor.Events.Editor.Mode = "SELECT";
                        WinScene.Set.statusbarText("SELECT");
                    }
                    else if(e.keyCode == 17){     //Ctrl
                        CaPTIVE.States.SImageEditor.Events.Key.ctrl = true;
                    }
                    else if(e.keyCode == 18){     //Alt
                        CaPTIVE.States.SImageEditor.Events.Key.alt = true;
                    }
                    else if(e.keyCode == 27){     //ESC
                        CaPTIVE.States.SImageEditor.Events.Editor.Mode = "";
                        WinScene.Set.statusbarText("");
                    }
                    
                    
                   
                    
                },
                KeyUp: function(e){
                    if(e.keyCode == 16){     //Shift
                        CaPTIVE.States.SImageEditor.Events.Key.shift = false;
                    }
                    else if(e.keyCode == 17){     //Ctrl
                        CaPTIVE.States.SImageEditor.Events.Key.ctrl = false;
                    }
                    else if(e.keyCode == 18){     //Alt
                        CaPTIVE.States.SImageEditor.Events.Key.alt = false;
                    }
        
                },
                MiniMap: {
                    MouseDown: function(e){
                        var winPos = CaPTIVE.ImageEditor.GetOffset(e.target);//WinMiniMap.Get.position();
                        var x = e.pageX - (winPos.left + 3);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetLeft;
                        var y = e.pageY - (winPos.top + 4);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetTop;
                        
                        var view = CaPTIVE.ImageEditor.Convert.MiniMapTo.Viewport(x,y);
                        var scene = CaPTIVE.ImageEditor.Convert.MiniMapTo.Scene(x,y);
                        
                        CaPTIVE.ImageEditor.Viewport.Position.x = scene.x; 
                        CaPTIVE.ImageEditor.Viewport.Position.y = scene.y; 
                        
                        CaPTIVE.ImageEditor.Update();
                        
                        os.console.AppendComment("MiniMap Canvas Click");
                        os.console.AppendComment("Raw Canvas: x: " + x +", y: " + y);
                        CaPTIVE.ImageEditor.PlotPoint(x, y, CaPTIVE.ImageEditor.MiniMap.ctx);
                        os.console.AppendComment("View x: " + view.x + ", y: " + view.y);
                        CaPTIVE.ImageEditor.PlotPoint(view.x, view.y,CaPTIVE.ImageEditor.Scene.ctx);
                        os.console.AppendComment("Scene x: " + scene.x + ", y: " + scene.y);
                    },
                    MouseUp: function(e){
                        
                    }
                },
                Editor: {
                    Mode: "",
                    MouseDown: function(e){
                        CaPTIVE.States.SImageEditor.Events.Mouse.pressed = true;
                        
                        var winPos = CaPTIVE.ImageEditor.GetOffset(e.target);//WinScene.Get.position();
                        var x = e.pageX - (winPos.left + 3);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetLeft;
                        var y = e.pageY - (winPos.top + 4);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetTop;
                            
                        if(CaPTIVE.States.SImageEditor.Events.Editor.Mode == "CROP"){
                            CaPTIVE.ImageEditor.EditControls.cropStart = CaPTIVE.ImageEditor.Convert.ViewportTo.Scene(x,y);
                            
                        }
                        else if(CaPTIVE.States.SImageEditor.Events.Editor.Mode == "SELECT"){
                            var sc = CaPTIVE.ImageEditor.Convert.ViewportTo.Scene(x,y);
                            CaPTIVE.ImageEditor.SelectImage(sc.x, sc.y);
                        }
                        else if(CaPTIVE.States.SImageEditor.Events.Editor.Mode == "SAVE CANVAS"){
                            WinScene.Set.statusbarText(CaPTIVE.States.SImageEditor.Events.Editor.Mode);
                            CaPTIVE.ImageEditor.EditControls.cropStart = CaPTIVE.ImageEditor.Convert.ViewportTo.Scene(x,y);
                        }
                        else if(CaPTIVE.States.SImageEditor.Events.Editor.Mode == "TRACE"){
                            var img = CaPTIVE.ImageEditor.GetSelectedImage();
                            //var point = new CPoint();
                            var point = CaPTIVE.ImageEditor.Convert.ViewportTo.Scene(x,y);
                            //os.console.Comment("Scene: x: " + point.x + ", y: " + point.y );
                            
                            var ls = img.SceneToLocal(point.x, point.y);
                            //os.console.Comment("Local Space: x: " + ls.x + ", y: " + ls.y );
                            
                            point.x = ls.x;// -= img.Position.x;
                            point.y = ls.y;// -= img.Position.y;
                            
                            
                            img.Trace.points[img.Trace.points.length - 1].push(point);
                            
                            CaPTIVE.ImageEditor.Update();
                        }
                        
                        //var winPos = WinScene.Get.position();
                        //var x = e.pageX - (winPos.left + 1);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetLeft;
                        //var y = e.pageY - (winPos.top + 58);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetTop;
                            
                        var view = {x: x, y: y};//CaPTIVE.ImageEditor.Convert.MiniMapTo.Viewport(x,y);
                        var scene = CaPTIVE.ImageEditor.Convert.ViewportTo.Scene(x,y);
                        var mini = CaPTIVE.ImageEditor.Convert.ViewportTo.MiniMap(x,y);
                        
                        //os.console.AppendComment("MiniMap Canvas Click");
                        //os.console.AppendComment("Raw Canvas: x: " + x +", y: " + y);
                        CaPTIVE.ImageEditor.PlotPoint(x, y, CaPTIVE.ImageEditor.Scene.ctx);
                        //os.console.AppendComment("MiniMap x: " + mini.x + ", y: " + mini.y);
                        CaPTIVE.ImageEditor.PlotPoint(mini.x, mini.y,CaPTIVE.ImageEditor.MiniMap.ctx);
                        //os.console.AppendComment("Scene x: " + scene.x + ", y: " + scene.y);
                        
                        
                        CaPTIVE.States.SImageEditor.Events.Mouse.lastX = e.clientX;
                        CaPTIVE.States.SImageEditor.Events.Mouse.lastY = e.clientY;
                    },
                    MouseUp: function(e){
                        CaPTIVE.States.SImageEditor.Events.Mouse.pressed = false;
                        CaPTIVE.States.SImageEditor.Events.Controls.selected = false;
                        
                        if(CaPTIVE.States.SImageEditor.Events.Editor.Mode == "CROP"){
                            //var winPos = WinScene.Get.position();
                            //var x = e.pageX - (winPos.left + 1);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetLeft;
                            //var y = e.pageY - (winPos.top + 58);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetTop;
                            //
                            var winPos = CaPTIVE.ImageEditor.GetOffset(e.target);//WinScene.Get.position();
                            var x = e.pageX - (winPos.left + 3);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetLeft;
                            var y = e.pageY - (winPos.top + 4);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetTop;
                            
                            CaPTIVE.ImageEditor.EditControls.cropStop = CaPTIVE.ImageEditor.Convert.ViewportTo.Scene(x,y);
                            
                            CaPTIVE.ImageEditor.PlotPoint(x, y, CaPTIVE.ImageEditor.Scene.ctx);
                            WinScene.Set.statusbarText("Press Enter To Crop Selected Area");
                            
                            
                        }
                        if(CaPTIVE.States.SImageEditor.Events.Editor.Mode == "SAVE CANVAS"){
                            var winPos = WinScene.Get.position();
                            var x = e.pageX - (winPos.left + 1);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetLeft;
                            var y = e.pageY - (winPos.top + 58);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetTop;
                        
                            CaPTIVE.ImageEditor.EditControls.cropStop = CaPTIVE.ImageEditor.Convert.ViewportTo.Scene(x,y);
                            WinScene.Set.statusbarText("Press Enter To Save Selected Area");
                            
                        }
                    },
                    MouseMove: function(e){
                        if (!CaPTIVE.States.SImageEditor.Events.Mouse.pressed) {
                            return;
                        }
                        
                        var newX = e.clientX;
                        var newY = e.clientY;
                        
                        var deltaX = newX - CaPTIVE.States.SImageEditor.Events.Mouse.lastX;
                        var deltaY = newY - CaPTIVE.States.SImageEditor.Events.Mouse.lastY;
                            
                        if(CaPTIVE.States.SImageEditor.Events.Editor.Mode == "MOVE"){
                            //var winPos = WinScene.Get.position();
                            //var x = e.pageX - (winPos.left + 1);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetLeft;
                            //var y = e.pageY - (winPos.top + 58);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetTop;
                            //
                            var winPos = CaPTIVE.ImageEditor.GetOffset(e.target);//WinScene.Get.position();
                            var x = e.pageX - (winPos.left + 3);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetLeft;
                            var y = e.pageY - (winPos.top + 4);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetTop;
                            
                            var sc = CaPTIVE.ImageEditor.Convert.ViewportTo.Scene(x,y);
                            
                            
                            var length = CaPTIVE.ImageEditor.Scene.Entities.length;
                            if(length > 0){
                                CaPTIVE.ImageEditor.Scene.Entities[length - 1].Position.x += (1 * deltaX) * CaPTIVE.ImageEditor.Viewport.scale;
                                CaPTIVE.ImageEditor.Scene.Entities[length - 1].Position.y += (1 * deltaY) * CaPTIVE.ImageEditor.Viewport.scale;
                                
                                //if(CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask)
                                //    CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.start.x += (1 * deltaX) * CaPTIVE.ImageEditor.Viewport.scale;
                                //    CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.start.y += (1 * deltaY) * CaPTIVE.ImageEditor.Viewport.scale;
                                //    CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.stop.x += (1 * deltaX) * CaPTIVE.ImageEditor.Viewport.scale;
                                //    CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.stop.y += (1 * deltaY) * CaPTIVE.ImageEditor.Viewport.scale;
                                //
                                CaPTIVE.ImageEditor.Update();
                            }
                            
                        }
                        else if(CaPTIVE.States.SImageEditor.Events.Editor.Mode == "STRETCH WIDTH"){
                            
                            var length = CaPTIVE.ImageEditor.Scene.Entities.length;
                            
                            if(length > 0){
                                var img = CaPTIVE.ImageEditor.Scene.Entities[length - 1];
                               
                                var scale = (0.01 * deltaX) * CaPTIVE.ImageEditor.Viewport.scale;;
                                img.Scale.x += scale;
                                
                                CaPTIVE.ImageEditor.Update();
                            }
                            
                        }
                        else if(CaPTIVE.States.SImageEditor.Events.Editor.Mode == "STRETCH HEIGHT"){
                            var length = CaPTIVE.ImageEditor.Scene.Entities.length;
                            
                            if(length > 0){
                                var img = CaPTIVE.ImageEditor.Scene.Entities[length - 1];
                                var scale = (0.01 * deltaY) * CaPTIVE.ImageEditor.Viewport.scale;;
                                img.Scale.y += scale;
                                
                                CaPTIVE.ImageEditor.Update();
                            }
                            
                        }
                        else if(CaPTIVE.States.SImageEditor.Events.Editor.Mode == "STRETCH IMAGE"){
                            var length = CaPTIVE.ImageEditor.Scene.Entities.length;
                            
                            if(length > 0){
                                var img = CaPTIVE.ImageEditor.Scene.Entities[length - 1];
                                var scale = (0.01 * deltaY) * CaPTIVE.ImageEditor.Viewport.scale;;
                                img.Scale.y += scale;
                                img.Scale.x += scale;
                                
                                
                                CaPTIVE.ImageEditor.Update();
                            }
                            
                        }
                        else if(CaPTIVE.States.SImageEditor.Events.Editor.Mode == "ROTATE WITH MOUSE"){
                            //var winPos = WinScene.Get.position();
                            //var x = e.pageX - (winPos.left + 1);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetLeft;
                            //var y = e.pageY - (winPos.top + 58);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetTop;
                            //
                            //var sc = CaPTIVE.ImageEditor.Convert.ViewportTo.Scene(x,y);
        
                            var length = CaPTIVE.ImageEditor.Scene.Entities.length;
                            if(length > 0){
                                CaPTIVE.ImageEditor.Scene.Entities[length - 1].Rotation += (0.01 * deltaY);// * CaPTIVE.ImageEditor.Viewport.scale;
                                if(CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask){
                                    CaPTIVE.ImageEditor.Scene.Entities[length - 1].Mask.Rotation += (0.01 * deltaY);
                                }
                                //CaPTIVE.ImageEditor.Scene.Entities[length - 1].halfWidth = CaPTIVE.ImageEditor.Scene.Entities[length - 1].width/2;
                                //CaPTIVE.ImageEditor.Scene.Entities[length - 1].Position.y += (1 * deltaY) * CaPTIVE.ImageEditor.Viewport.scale;
                                CaPTIVE.ImageEditor.Update();
                            }
                            
                        }
                        else if(CaPTIVE.States.SImageEditor.Events.Editor.Mode == "CROP"){
                            //var winPos = WinScene.Get.position();
                            //var x = e.pageX - (winPos.left + 1);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetLeft;
                            //var y = e.pageY - (winPos.top + 58);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetTop;
                            //
                            var winPos = CaPTIVE.ImageEditor.GetOffset(e.target);//WinScene.Get.position();
                            var x = e.pageX - (winPos.left + 3);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetLeft;
                            var y = e.pageY - (winPos.top + 4);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetTop;
                            
                            
                            var start = CaPTIVE.ImageEditor.Convert.SceneTo.Viewport(CaPTIVE.ImageEditor.EditControls.cropStart.x, CaPTIVE.ImageEditor.EditControls.cropStart.y);
                            
                            
                            CaPTIVE.ImageEditor.Update();
                            CaPTIVE.ImageEditor.Scene.ctx.strokeStyle = "red";
                            CaPTIVE.ImageEditor.Scene.ctx.fillStyle = "red";
                            CaPTIVE.ImageEditor.Scene.ctx.lineWidth = 2;
                            CaPTIVE.ImageEditor.Scene.ctx.strokeRect(start.x, start.y , x -start.x, y - start.y);
                            
                        }
                        else if(CaPTIVE.States.SImageEditor.Events.Editor.Mode == "SAVE CANVAS"){
                            //var winPos = WinScene.Get.position();
                            //var x = e.pageX - (winPos.left + 1);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetLeft;
                            //var y = e.pageY - (winPos.top + 58);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetTop;
                            //
                            var winPos = CaPTIVE.ImageEditor.GetOffset(e.target);//WinScene.Get.position();
                            var x = e.pageX - (winPos.left + 3);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetLeft;
                            var y = e.pageY - (winPos.top + 4);//CaPTIVE.ImageEditor.MiniMap.canvas.html().offsetTop;
                            
                            var start = CaPTIVE.ImageEditor.Convert.SceneTo.Viewport(CaPTIVE.ImageEditor.EditControls.cropStart.x, CaPTIVE.ImageEditor.EditControls.cropStart.y);
                            
                            
                            CaPTIVE.ImageEditor.Update();
                            CaPTIVE.ImageEditor.Scene.ctx.strokeStyle = "red";
                            CaPTIVE.ImageEditor.Scene.ctx.fillStyle = "red";
                            CaPTIVE.ImageEditor.Scene.ctx.lineWidth = 2;
                            CaPTIVE.ImageEditor.Scene.ctx.strokeRect(start.x, start.y , x -start.x, y - start.y);
                            
                        }
                        else if(CaPTIVE.States.SImageEditor.Events.Editor.Mode == "PAN"){
                            CaPTIVE.ImageEditor.Viewport.Position.x += (1 * deltaX) * CaPTIVE.ImageEditor.Viewport.scaleWidth;
                            CaPTIVE.ImageEditor.Viewport.Position.y += (1  * deltaY) * CaPTIVE.ImageEditor.Viewport.scaleHeight;
                            CaPTIVE.ImageEditor.Update();
                        }
                        
                            
                        CaPTIVE.States.SImageEditor.Events.Mouse.lastX = e.clientX;
                        CaPTIVE.States.SImageEditor.Events.Mouse.lastY = e.clientY;
                    },
                    MouseWheelMove: function(e){
                        e.preventDefault();
                        
                        CaPTIVE.ImageEditor.Viewport.scaleHeight += 0.001 * e.wheelDelta;
                        if(CaPTIVE.ImageEditor.Viewport.scaleHeight <= 1){ CaPTIVE.ImageEditor.Viewport.scaleHeight = 1};
                        
                        CaPTIVE.ImageEditor.Viewport.scaleWidth = CaPTIVE.ImageEditor.Viewport.scaleHeight;// * CaPTIVE.ImageEditor.Scene.width / CaPTIVE.ImageEditor.Scene.height;
                        
                        CaPTIVE.ImageEditor.Update();
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
            }
            
            CaPTIVE.States.SImageEditor.LoadEvents = function(){
                document.getElementById("imageSelector").addEventListener("change", CaPTIVE.States.SImageEditor.Events.Open, false);
                document.getElementById("layerSelector").addEventListener("change", CaPTIVE.States.SImageEditor.Events.OpenLayer, false);
                document.getElementById("SImageEditor").addEventListener("keydown", CaPTIVE.States.SImageEditor.Events.Keypress, false);
                document.getElementById("SLayerEditor").addEventListener("keydown", CaPTIVE.States.SImageEditor.Events.Keypress, false);
                //CaPTIVE.ImageEditor.Scene.canvas.html().addEventListener("keydown", CaPTIVE.States.SImageEditor.Events.Keypress, false);
                CaPTIVE.ImageEditor.Scene.canvas.html().addEventListener("mousewheel", CaPTIVE.States.SImageEditor.Events.Editor.MouseWheelMove, false);
                CaPTIVE.ImageEditor.MiniMap.canvas.html().addEventListener("mousedown", CaPTIVE.States.SImageEditor.Events.MiniMap.MouseDown, false);
                CaPTIVE.ImageEditor.Scene.canvas.html().addEventListener("mousedown", CaPTIVE.States.SImageEditor.Events.Editor.MouseDown,false);
                document.addEventListener("mouseup", CaPTIVE.States.SImageEditor.Events.Editor.MouseUp, false);
                document.addEventListener("mousemove", CaPTIVE.States.SImageEditor.Events.Editor.MouseMove, false);
                window.addEventListener("keyup", CaPTIVE.States.SImageEditor.Events.KeyUp, false);
            }
            CaPTIVE.States.SImageEditor.RemoveEvents = function(){
                 document.getElementById("layerSelector").removeEventListener("change", CaPTIVE.States.SImageEditor.Events.OpenLayer, false);
                document.getElementById("imageSelector").removeEventListener("change", CaPTIVE.States.SImageEditor.Events.Open, false);
                document.getElementById("SImageEditor").removeEventListener("keydown", CaPTIVE.States.SImageEditor.Events.Keypress, false);
                //CaPTIVE.ImageEditor.Scene.canvas.html().removeEventListener("keydown", CaPTIVE.States.SImageEditor.Events.Keypress, false);
                CaPTIVE.ImageEditor.Scene.canvas.html().removeEventListener("mousewheel", CaPTIVE.States.SImageEditor.Events.Editor.MouseWheelMove, false);
                CaPTIVE.ImageEditor.MiniMap.canvas.html().removeEventListener("mousedown", CaPTIVE.States.SImageEditor.Events.MiniMap.MouseDown, false);
                CaPTIVE.ImageEditor.Scene.canvas.html().removeEventListener("mousedown", CaPTIVE.States.SImageEditor.Events.Editor.MouseDown,false);
                document.removeEventListener("mouseup", CaPTIVE.States.SImageEditor.Events.Editor.MouseUp, false);
                document.removeEventListener("mousemove", CaPTIVE.States.SImageEditor.Events.Editor.MouseMove, false);
                window.removeEventListener("keyup", CaPTIVE.States.SImageEditor.Events.KeyUp, false);
            }
            //
            // Model Alignment State
            CaPTIVE.States.SModelAlignment = new CState("SModelAlignment");
            CaPTIVE.States.SModelAlignment.html = document.getElementById("SModelAlignment");
            CaPTIVE.States.SModelAlignment.Enter = function(owner, data){
                os.console.Comment("Align Model State");
                
                //Verify OBJ has been loaded
                if(CaPTIVE.Status.OBJLoaded){
                    //Launch Model
                    document.getElementById("modalContent").innerHTML = "<h2>Setting Model Alignment</h2><p>CaPTIVE is saving current alignment in 3D Viewer as default</p><p>Once complete the color coding of the model will be static</p>"
                    CaPTIVE.Modal.Show();
                    
                    //Show Loader Spinner
                    CaPTIVE.Spinner.Show();
                    
                    //Add event listener for WebWorker
                    CaPTIVE.Workers.files.addEventListener('message',CaPTIVE.States.SModelAlignment.onMessage, false);
                    
                    CaPTIVE.Workers.files.postMessage({
                                                        type: "Align",
                                                        data: {
                                                                matrix: CaPTIVE.Entity.model.Graphics.Matrix.World ,
                                                                meshes: CaPTIVE.Files.mesh,
                                                                layers: CaPTIVE.Entity.Layers 
                                                        }
                                                    });
                }
                else{
                    //Launch Modal
                    document.getElementById("modalContent").innerHTML = "<h2>No OBJ Model Loaded</h2><p>You must load an OBJ before you can perform alignment</p>";
                    CaPTIVE.Modal.Show();
                    CaPTIVE.FSM.AnimatedTransition('SStart');
                }
                
                
            }
            CaPTIVE.States.SModelAlignment.Execute = function(owner, data){
                
            }
            CaPTIVE.States.SModelAlignment.Exit = function(owner, data){
                
                //Add event listener for WebWorker
                CaPTIVE.Workers.files.removeEventListener('message',CaPTIVE.States.SModelAlignment.onMessage, false);
            }
            CaPTIVE.States.SModelAlignment.onMessage = function(msg){
                os.console.Comment("Alignment Worker Complete");
                
                //Remove rotations
                CaPTIVE.Entity.model.Default.pitch = 0;
                CaPTIVE.Entity.model.Default.yaw = 0;
                CaPTIVE.Entity.model.Set.Scale(1,1,1);
                
                //Reset offset
                mat4.identity(CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation);
                mat4.identity(CaPTIVE.Entity.model.Graphics.Matrix.Pitch);
                                        
                //Rotate Yaw Scene Node
                mat4.rotateY(CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation, degToRad(CaPTIVE.Entity.model.Default.yaw), CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation);                       
                //Rotate Pitch Scene Node
                mat4.rotateX(CaPTIVE.Entity.model.Graphics.Matrix.Pitch, degToRad(CaPTIVE.Entity.model.Default.pitch), CaPTIVE.Entity.model.Graphics.Matrix.Pitch);
                
                mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Parent.Translate, CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation, CaPTIVE.Entity.model.Graphics.Matrix.Parent.World );
                mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Pitch , CaPTIVE.Entity.model.Graphics.Matrix.Parent.World, CaPTIVE.Entity.model.Graphics.Matrix.Parent.World);
                                
                
                
                //
                CaPTIVE.Spinner.Hide();
                
                //Load New JSONs into model entity
                //Save JSON Mesh for Alignment
                CaPTIVE.Files.mesh = msg.data.meshes;
                
                for(var i = 0; i < msg.data.meshes.length; i++){
                    var msh = os.graphics.Managers.Mesh.Create.Mesh("mesh"+i, null, msg.data.meshes[i]);
                    msh.Initialize();
                    CaPTIVE.Entity.model.Graphics.Add.Mesh(msh.name);
                }
                
                //
                //  Update Cancers if they exist
                //
                if(msg.data.layers){
                    for(var i = 0; i < msg.data.layers.length; i++){
                        var layer = msg.data.layers[i];
                        
                        if(layer.cancer){
                            for(var j = 0; j < layer.json.length; j++){
                                var obj = layer.json[j];
                                
                                CaPTIVE.Entity.Cancers[layer.id].Graphics.Mesh.removeAll();
                                
                                for(var k = 0; k < obj.length; k++){

                                    //Initialize Mesh
                                    var msh = os.graphics.Managers.Mesh.Create.Mesh("layer" + layer.id + "-" + j + "-" + k , null, obj[k]);
                                    msh.Initialize();
                                    CaPTIVE.Entity.Cancers[layer.id].Graphics.Add.Mesh(msh.name);
                            
                                }
                            }
                        }
                    }
                }
                
                //
                //  Update Lights in Dashboard and Model Menus
                //
                //Update Dashbaord
                CaPTIVE.Status.OBJOrientation = true;
                CaPTIVE.Dashboard.Model.Aligned.message.innerHTML = "OBJ Successfully Aligned";
                CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Model.Aligned.light);
                if(CaPTIVE.Status.OBJLoaded && CaPTIVE.Status.OBJDimensions && CaPTIVE.Status.OBJOrientation){
                    CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Overview.Models.light);
                    CaPTIVE.Dashboard.Overview.Models.message.innerHTML = "3D Model is Loaded and Configured";
                }
                else{
                    CaPTIVE.Dashboard.SetLight.Yellow(CaPTIVE.Dashboard.Overview.Models.light);
                    CaPTIVE.Dashboard.Overview.Models.message.innerHTML = "3D Model Needs Configuration";
                }
                
                //Update 3D Model Menu
                
                //Change Light Color on Overview
                document.getElementById("model-aligned-light").className = "led-green";
                document.getElementById("model-aligned-message").innerHTML = "3D Model Aligned";
                
                //Open Dimensions Menu
                if(CaPTIVE.Menu.Current != "model"){ CaPTIVE.Menu.SetActive("model")};
                CaPTIVE.Menu.model.SetActiveOption(3);
                
                //Set Alignment Shader Uniform
                CaPTIVE.Entity.model.Graphics.Set.aligned(true);
                
                //Reset Orientation Arrows
                CaPTIVE.States.S3DViewer.Input.Reset();
                
                //Open 3D Viewer
                CaPTIVE.FSM.AnimatedTransition("S3DViewer", msg.data);

            }
            //
            //  3D Viewer State
            CaPTIVE.States.S3DViewer = new CState("S3DViewer");
            CaPTIVE.States.S3DViewer.html = document.getElementById("S3DViewer");
            CaPTIVE.States.S3DViewer.Enter = function(owner, data){
                os.console.Comment("3D Viewer State");
                if(CaPTIVE.Entity.model){
                    os.graphics.Get.Pause() ? os.graphics.Pause() : os.graphics.Start();
                
                    os.graphics.Set.Callback.Draw(CaPTIVE.States.S3DViewer.Draw);
    
                                            
                    //os.graphics.Start(); 
                    setTimeout(os.graphics.OnReset, 1000);
                    var can = os.graphics.Get.Canvas();
                    
                    // Load Movement Events
                    window.addEventListener("keydown", CaPTIVE.States.S3DViewer.Input.onKeyDown, false);
                    os.graphics.Get.Canvas().addEventListener("mousedown", CaPTIVE.States.S3DViewer.Input.onMouseDown, false);
                    document.addEventListener("mouseup", CaPTIVE.States.S3DViewer.Input.onMouseUp, false);
                    document.addEventListener("mousemove", CaPTIVE.States.S3DViewer.Input.onMouseMove, false);
                    //Load Hot Keys
                }
                else{
                    CaPTIVE.FSM.AnimatedTransition("SStart");
                }
                
            }
            CaPTIVE.States.S3DViewer.Execute = function(){
                
            }
            CaPTIVE.States.S3DViewer.Exit = function(){
                os.graphics.Pause();
                
                //Check to see if Fullscreen, remove
                CaPTIVE.Status.fullscreen ? CaPTIVE.ToggleFullscreen() : null;
                
                //Remove Movement Events
                window.removeEventListener("keydown", CaPTIVE.States.S3DViewer.Input.onKeyDown, false);
                os.graphics.Get.Canvas().removeEventListener("mousedown", CaPTIVE.States.S3DViewer.Input.onMouseDown, false);
                document.removeEventListener("mouseup", CaPTIVE.States.S3DViewer.Input.onMouseUp, false);
                document.removeEventListener("mousemove", CaPTIVE.States.S3DViewer.Input.onMouseMove, false);

            }
            CaPTIVE.States.S3DViewer.Input = {
                Mouse: {
                    lastX: 0,
                    lastY: 0,
                    pressed: false
                },
                Reset: function(){
                    
                    CaPTIVE.Entity.model.Default.pitch = 0;
                    CaPTIVE.Entity.model.Default.yaw = 0;
                    CaPTIVE.Entity.model.roll = 0;
                    
                    CaPTIVE.Entity.Orientation.arrows.pitch = CaPTIVE.Entity.model.Default.pitch;//deltaY;
                    CaPTIVE.Entity.Orientation.arrows.yaw = CaPTIVE.Entity.model.Default.yaw;
                    CaPTIVE.Entity.Orientation.arrows.roll = 0;
                        
                    //Reset offset
                    mat4.identity(CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation);
                    mat4.identity(CaPTIVE.Entity.model.Graphics.Matrix.Pitch);
                    //mat4.identity(CaPTIVE.Entity.model.Graphics.Matrix.Parent.World);
                    
                    //Rotate Yaw Scene Node
                    mat4.rotateY(CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation, degToRad(CaPTIVE.Entity.model.Default.yaw), CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation);
                    
                    //Rotate Pitch Scene Node
                    mat4.rotateX(CaPTIVE.Entity.model.Graphics.Matrix.Pitch, degToRad(CaPTIVE.Entity.model.Default.pitch), CaPTIVE.Entity.model.Graphics.Matrix.Pitch);
                    
                    
                    //Update Scene World Matrix
                    //mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Pitch ,CaPTIVE.Entity.model.Graphics.Matrix.Parent.Translate, CaPTIVE.Entity.model.Graphics.Matrix.Parent.World );
                    //mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Parent.World, CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation, CaPTIVE.Entity.model.Graphics.Matrix.Parent.World );
                    mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Parent.Translate, CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation, CaPTIVE.Entity.model.Graphics.Matrix.Parent.World );
                    //mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Parent.World, CaPTIVE.Entity.model.Graphics.Matrix.Pitch ,CaPTIVE.Entity.model.Graphics.Matrix.Parent.World);
                    mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Pitch , CaPTIVE.Entity.model.Graphics.Matrix.Parent.World, CaPTIVE.Entity.model.Graphics.Matrix.Parent.World);
                    
                    if(CaPTIVE.Entity.Cancers.length > 0){
                        for(var i = 0; i < CaPTIVE.Entity.Cancers.length; i++){
                            if(CaPTIVE.Entity.Cancers[i]){
                                CaPTIVE.Entity.Cancers[i].Default.yaw = 0;
                                CaPTIVE.Entity.Cancers[i].Default.pitch = 0;
                                if(CaPTIVE.Entity.Cancers[i].Default.pitch > 90){ CaPTIVE.Entity.Cancers[i].Default.pitch = 90;}
                                else if(CaPTIVE.Entity.Cancers[i].Default.pitch < -90) { CaPTIVE.Entity.Cancers[i].Default.pitch = -90; }
                                
                                if(CaPTIVE.Entity.Cancers[i].Default.yaw > 360){ CaPTIVE.Entity.Cancers[i].Default.yaw  -= 360;}
                                else if(CaPTIVE.Entity.Cancers[i].Default.yaw < 0) { CaPTIVE.Entity.Cancers[i].Default.yaw += 360; }
                    
                                
                                mat4.identity(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Rotation);
                                mat4.identity(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Pitch);
                                
                                //Rotate Yaw Scene Node
                                mat4.rotateY(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Rotation, degToRad(CaPTIVE.Entity.Cancers[i].Default.yaw), CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Rotation);
                        
                                //Rotate Pitch Scene Node
                                mat4.rotateX(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Pitch, degToRad(CaPTIVE.Entity.Cancers[i].Default.pitch), CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Pitch);
                                
                                 mat4.multiply(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Translate, CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Rotation, CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.World );
                                //mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Parent.World, CaPTIVE.Entity.model.Graphics.Matrix.Pitch ,CaPTIVE.Entity.model.Graphics.Matrix.Parent.World);
                                mat4.multiply(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Pitch , CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.World, CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.World);
                            
                            }
                        }
                    }
                },
                Update: function(){
                    if(CaPTIVE.Entity.model.Default.pitch > 90){ CaPTIVE.Entity.model.Default.pitch = 90;}
                        else if(CaPTIVE.Entity.model.Default.pitch < -90) { CaPTIVE.Entity.model.Default.pitch = -90; }
                        
                        //CaPTIVE.Entity.model.yaw -= deltaX;
                        //CaPTIVE.Entity.model.Default.pitch < 0 ? CaPTIVE.Entity.model.Default.yaw += deltaX : CaPTIVE.Entity.model.Default.yaw -= deltaX ;
                        if(CaPTIVE.Entity.model.Default.yaw > 360){ CaPTIVE.Entity.model.Default.yaw  -= 360;}
                        else if(CaPTIVE.Entity.model.Default.yaw < 0) { CaPTIVE.Entity.model.Default.yaw += 360; }
                        
                        //CaPTIVE.Entity.model.yaw -= deltaX;
                        //if(CaPTIVE.Entity.model.yaw > 180){ CaPTIVE.Entity.model.yaw = 180;}
                        //else if(CaPTIVE.Entity.model.yaw < -180) { CaPTIVE.Entity.model.yaw = -180; }
                        
                        CaPTIVE.Entity.Orientation.arrows.pitch = CaPTIVE.Entity.model.Default.pitch;//deltaY;
                        CaPTIVE.Entity.Orientation.arrows.yaw = CaPTIVE.Entity.model.Default.yaw;
                        
                        //Reset offset
                        mat4.identity(CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation);
                        mat4.identity(CaPTIVE.Entity.model.Graphics.Matrix.Pitch);
                        //mat4.identity(CaPTIVE.Entity.model.Graphics.Matrix.Parent.World);
                        
                        //Rotate Yaw Scene Node
                        mat4.rotateY(CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation, degToRad(CaPTIVE.Entity.model.Default.yaw), CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation);
                        
                        //Rotate Pitch Scene Node
                        mat4.rotateX(CaPTIVE.Entity.model.Graphics.Matrix.Pitch, degToRad(CaPTIVE.Entity.model.Default.pitch), CaPTIVE.Entity.model.Graphics.Matrix.Pitch);
                        
                        
                        //Update Scene World Matrix
                        //mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Pitch ,CaPTIVE.Entity.model.Graphics.Matrix.Parent.Translate, CaPTIVE.Entity.model.Graphics.Matrix.Parent.World );
                        //mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Parent.World, CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation, CaPTIVE.Entity.model.Graphics.Matrix.Parent.World );
                        mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Parent.Translate, CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation, CaPTIVE.Entity.model.Graphics.Matrix.Parent.World );
                        //mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Parent.World, CaPTIVE.Entity.model.Graphics.Matrix.Pitch ,CaPTIVE.Entity.model.Graphics.Matrix.Parent.World);
                        mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Pitch , CaPTIVE.Entity.model.Graphics.Matrix.Parent.World, CaPTIVE.Entity.model.Graphics.Matrix.Parent.World);
                        
                        if(CaPTIVE.Entity.Cancers.length > 0){
                            for(var i = 0; i < CaPTIVE.Entity.Cancers.length; i++){
                                if(CaPTIVE.Entity.Cancers[i]){
                                    CaPTIVE.Entity.Cancers[i].Default.yaw = CaPTIVE.Entity.model.Default.yaw;
                                    CaPTIVE.Entity.Cancers[i].Default.pitch = CaPTIVE.Entity.model.Default.pitch;
                                    if(CaPTIVE.Entity.Cancers[i].Default.pitch > 90){ CaPTIVE.Entity.Cancers[i].Default.pitch = 90;}
                                    else if(CaPTIVE.Entity.Cancers[i].Default.pitch < -90) { CaPTIVE.Entity.Cancers[i].Default.pitch = -90; }
                                    
                                    if(CaPTIVE.Entity.Cancers[i].Default.yaw > 360){ CaPTIVE.Entity.Cancers[i].Default.yaw  -= 360;}
                                    else if(CaPTIVE.Entity.Cancers[i].Default.yaw < 0) { CaPTIVE.Entity.Cancers[i].Default.yaw += 360; }
                        
                                    
                                    mat4.identity(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Rotation);
                                    mat4.identity(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Pitch);
                                    
                                    //Rotate Yaw Scene Node
                                    mat4.rotateY(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Rotation, degToRad(CaPTIVE.Entity.Cancers[i].Default.yaw), CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Rotation);
                            
                                    //Rotate Pitch Scene Node
                                    mat4.rotateX(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Pitch, degToRad(CaPTIVE.Entity.Cancers[i].Default.pitch), CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Pitch);
                                    
                                     mat4.multiply(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Translate, CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Rotation, CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.World );
                                    //mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Parent.World, CaPTIVE.Entity.model.Graphics.Matrix.Pitch ,CaPTIVE.Entity.model.Graphics.Matrix.Parent.World);
                                    mat4.multiply(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Pitch , CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.World, CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.World);
                                
                                }
                            }
                        }
                },
                onKeyDown: function(e){
                    var deltaX = 0;
                    var deltaY = 0;
                    
                    var KeyUpdate = function(){
                        if(CaPTIVE.Entity.model.Default.pitch > 90){ CaPTIVE.Entity.model.Default.pitch = 90;}
                        else if(CaPTIVE.Entity.model.Default.pitch < -90) { CaPTIVE.Entity.model.Default.pitch = -90; }
                        
                        //CaPTIVE.Entity.model.yaw -= deltaX;
                        //CaPTIVE.Entity.model.Default.pitch < 0 ? CaPTIVE.Entity.model.Default.yaw += deltaX : CaPTIVE.Entity.model.Default.yaw -= deltaX ;
                        if(CaPTIVE.Entity.model.Default.yaw > 360){ CaPTIVE.Entity.model.Default.yaw  -= 360;}
                        else if(CaPTIVE.Entity.model.Default.yaw < 0) { CaPTIVE.Entity.model.Default.yaw += 360; }
                        
                        //CaPTIVE.Entity.model.yaw -= deltaX;
                        //if(CaPTIVE.Entity.model.yaw > 180){ CaPTIVE.Entity.model.yaw = 180;}
                        //else if(CaPTIVE.Entity.model.yaw < -180) { CaPTIVE.Entity.model.yaw = -180; }
                        
                        CaPTIVE.Entity.Orientation.arrows.pitch = CaPTIVE.Entity.model.Default.pitch;//deltaY;
                        CaPTIVE.Entity.Orientation.arrows.yaw = CaPTIVE.Entity.model.Default.yaw;
                        
                        //Reset offset
                        mat4.identity(CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation);
                        mat4.identity(CaPTIVE.Entity.model.Graphics.Matrix.Pitch);
                        //mat4.identity(CaPTIVE.Entity.model.Graphics.Matrix.Parent.World);
                        
                        //Rotate Yaw Scene Node
                        mat4.rotateY(CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation, degToRad(CaPTIVE.Entity.model.Default.yaw), CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation);
                        
                        //Rotate Pitch Scene Node
                        mat4.rotateX(CaPTIVE.Entity.model.Graphics.Matrix.Pitch, degToRad(CaPTIVE.Entity.model.Default.pitch), CaPTIVE.Entity.model.Graphics.Matrix.Pitch);
                        
                        
                        //Update Scene World Matrix
                        //mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Pitch ,CaPTIVE.Entity.model.Graphics.Matrix.Parent.Translate, CaPTIVE.Entity.model.Graphics.Matrix.Parent.World );
                        //mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Parent.World, CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation, CaPTIVE.Entity.model.Graphics.Matrix.Parent.World );
                        mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Parent.Translate, CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation, CaPTIVE.Entity.model.Graphics.Matrix.Parent.World );
                        //mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Parent.World, CaPTIVE.Entity.model.Graphics.Matrix.Pitch ,CaPTIVE.Entity.model.Graphics.Matrix.Parent.World);
                        mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Pitch , CaPTIVE.Entity.model.Graphics.Matrix.Parent.World, CaPTIVE.Entity.model.Graphics.Matrix.Parent.World);
                        
                        if(CaPTIVE.Entity.Cancers.length > 0){
                            for(var i = 0; i < CaPTIVE.Entity.Cancers.length; i++){
                                if(CaPTIVE.Entity.Cancers[i]){
                                    CaPTIVE.Entity.Cancers[i].Default.yaw -= deltaX;
                                    CaPTIVE.Entity.Cancers[i].Default.pitch += deltaY;
                                    if(CaPTIVE.Entity.Cancers[i].Default.pitch > 90){ CaPTIVE.Entity.Cancers[i].Default.pitch = 90;}
                                    else if(CaPTIVE.Entity.Cancers[i].Default.pitch < -90) { CaPTIVE.Entity.Cancers[i].Default.pitch = -90; }
                                    
                                    if(CaPTIVE.Entity.Cancers[i].Default.yaw > 360){ CaPTIVE.Entity.Cancers[i].Default.yaw  -= 360;}
                                    else if(CaPTIVE.Entity.Cancers[i].Default.yaw < 0) { CaPTIVE.Entity.Cancers[i].Default.yaw += 360; }
                        
                                    
                                    mat4.identity(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Rotation);
                                    mat4.identity(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Pitch);
                                    
                                    //Rotate Yaw Scene Node
                                    mat4.rotateY(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Rotation, degToRad(CaPTIVE.Entity.Cancers[i].Default.yaw), CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Rotation);
                            
                                    //Rotate Pitch Scene Node
                                    mat4.rotateX(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Pitch, degToRad(CaPTIVE.Entity.Cancers[i].Default.pitch), CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Pitch);
                                    
                                     mat4.multiply(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Translate, CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Rotation, CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.World );
                                    //mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Parent.World, CaPTIVE.Entity.model.Graphics.Matrix.Pitch ,CaPTIVE.Entity.model.Graphics.Matrix.Parent.World);
                                    mat4.multiply(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Pitch , CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.World, CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.World);
                                
                                }
                            }
                        }

                    }
                    if(String.fromCharCode(e.keyCode) == "W"){          //Pitch Up
                        CaPTIVE.Entity.model.Default.pitch += 2;
                        deltaX = 0;
                        deltaY = 2;
                        KeyUpdate();
                    }
                    else if(String.fromCharCode(e.keyCode) == "S"){     //Pitch Down
                        CaPTIVE.Entity.model.Default.pitch -= 2;
                        deltaX = 0;
                        deltaY = -2;
                        KeyUpdate();
                    }
                    
                    else if(String.fromCharCode(e.keyCode) == "A"){     //Turn Left
                        CaPTIVE.Entity.model.Default.yaw += 2;
                        deltaX = -2;
                        deltaY = 0;
                        KeyUpdate();
                    }
                    
                    else if(String.fromCharCode(e.keyCode) == "D"){     //Turn Right
                        CaPTIVE.Entity.model.Default.yaw -= 2;
                        deltaX = 2;
                        deltaY = 0;
                        KeyUpdate();
                    }
                    else if(e.keyCode == 27){                           //ESC - Return to default orientation
                        CaPTIVE.States.S3DViewer.Input.Reset();
                    }
                    
                },
                onMouseDown: function(e){
                    CaPTIVE.States.S3DViewer.Input.Mouse.pressed = true;
                    
                    
                    CaPTIVE.States.S3DViewer.Input.Mouse.lastX = e.clientX;
                    CaPTIVE.States.S3DViewer.Input.Mouse.lastY = e.clientY;
                },
                onMouseUp: function(e){
                    CaPTIVE.States.S3DViewer.Input.Mouse.pressed = false;
                },
                onMouseWheel: function(e){
                    
                },
                onMouseMove: function(e){
                                //var cam = os.graphics.Managers.Camera;
                    if(CaPTIVE.States.S3DViewer.Input.Mouse.pressed){
                        var newX = e.clientX;
                        var newY = e.clientY;
                        
                        var deltaY = newY - CaPTIVE.States.S3DViewer.Input.Mouse.lastY;
                        deltaY *= CaPTIVE.Entity.Sensitivity.pitch;
                        
                        CaPTIVE.Entity.model.Default.pitch -= deltaY;
                        if(CaPTIVE.Entity.model.Default.pitch > 90){ CaPTIVE.Entity.model.Default.pitch = 90;}
                        else if(CaPTIVE.Entity.model.Default.pitch < -90) { CaPTIVE.Entity.model.Default.pitch = -90; }
                        
                        
                        var deltaX = newX - CaPTIVE.States.S3DViewer.Input.Mouse.lastX
                        deltaX *= CaPTIVE.Entity.Sensitivity.yaw;
                        
                        CaPTIVE.Entity.model.Default.yaw -= deltaX;
                        
                        
                        //CaPTIVE.Entity.model.yaw -= deltaX;
                        //CaPTIVE.Entity.model.Default.pitch < 0 ? CaPTIVE.Entity.model.Default.yaw += deltaX : CaPTIVE.Entity.model.Default.yaw -= deltaX ;
                        if(CaPTIVE.Entity.model.Default.yaw > 360){ CaPTIVE.Entity.model.Default.yaw  -= 360;}
                        else if(CaPTIVE.Entity.model.Default.yaw < 0) { CaPTIVE.Entity.model.Default.yaw += 360; }
                        
                        //CaPTIVE.Entity.model.yaw -= deltaX;
                        //if(CaPTIVE.Entity.model.yaw > 180){ CaPTIVE.Entity.model.yaw = 180;}
                        //else if(CaPTIVE.Entity.model.yaw < -180) { CaPTIVE.Entity.model.yaw = -180; }
                        
                        

                        CaPTIVE.Entity.Orientation.arrows.pitch = CaPTIVE.Entity.model.Default.pitch;//deltaY;
                        CaPTIVE.Entity.Orientation.arrows.yaw = CaPTIVE.Entity.model.Default.yaw;
                        
                        
                        //Reset offset
                        mat4.identity(CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation);
                        mat4.identity(CaPTIVE.Entity.model.Graphics.Matrix.Pitch);
                        //mat4.identity(CaPTIVE.Entity.model.Graphics.Matrix.Parent.World);
                        
                        //Rotate Yaw Scene Node
                        mat4.rotateY(CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation, degToRad(CaPTIVE.Entity.model.Default.yaw), CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation);
                        
                        //Rotate Pitch Scene Node
                        mat4.rotateX(CaPTIVE.Entity.model.Graphics.Matrix.Pitch, degToRad(CaPTIVE.Entity.model.Default.pitch), CaPTIVE.Entity.model.Graphics.Matrix.Pitch);
                        
                        
                        //Update Scene World Matrix
                        //mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Pitch ,CaPTIVE.Entity.model.Graphics.Matrix.Parent.Translate, CaPTIVE.Entity.model.Graphics.Matrix.Parent.World );
                        //mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Parent.World, CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation, CaPTIVE.Entity.model.Graphics.Matrix.Parent.World );
                        mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Parent.Translate, CaPTIVE.Entity.model.Graphics.Matrix.Parent.Rotation, CaPTIVE.Entity.model.Graphics.Matrix.Parent.World );
                        //mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Parent.World, CaPTIVE.Entity.model.Graphics.Matrix.Pitch ,CaPTIVE.Entity.model.Graphics.Matrix.Parent.World);
                        mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Pitch , CaPTIVE.Entity.model.Graphics.Matrix.Parent.World, CaPTIVE.Entity.model.Graphics.Matrix.Parent.World);
                        
                        if(CaPTIVE.Entity.Cancers.length > 0){
                            for(var i = 0; i < CaPTIVE.Entity.Cancers.length; i++){
                                if(CaPTIVE.Entity.Cancers[i]){
                                    CaPTIVE.Entity.Cancers[i].Default.yaw -= deltaX;
                                    CaPTIVE.Entity.Cancers[i].Default.pitch -= deltaY;
                                    if(CaPTIVE.Entity.Cancers[i].Default.pitch > 90){ CaPTIVE.Entity.Cancers[i].Default.pitch = 90;}
                                    else if(CaPTIVE.Entity.Cancers[i].Default.pitch < -90) { CaPTIVE.Entity.Cancers[i].Default.pitch = -90; }
                                    
                                    if(CaPTIVE.Entity.Cancers[i].Default.yaw > 360){ CaPTIVE.Entity.Cancers[i].Default.yaw  -= 360;}
                                    else if(CaPTIVE.Entity.Cancers[i].Default.yaw < 0) { CaPTIVE.Entity.Cancers[i].Default.yaw += 360; }
                        
                                    mat4.identity(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Rotation);
                                    mat4.identity(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Pitch);
                                    
                                    //Rotate Yaw Scene Node
                                    mat4.rotateY(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Rotation, degToRad(CaPTIVE.Entity.Cancers[i].Default.yaw), CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Rotation);
                            
                                    //Rotate Pitch Scene Node
                                    mat4.rotateX(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Pitch, degToRad(CaPTIVE.Entity.Cancers[i].Default.pitch), CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Pitch);
                                    
                                     mat4.multiply(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Translate, CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.Rotation, CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.World );
                                    //mat4.multiply(CaPTIVE.Entity.model.Graphics.Matrix.Parent.World, CaPTIVE.Entity.model.Graphics.Matrix.Pitch ,CaPTIVE.Entity.model.Graphics.Matrix.Parent.World);
                                    mat4.multiply(CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Pitch , CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.World, CaPTIVE.Entity.Cancers[i].Graphics.Matrix.Parent.World);
                                
                                }
                            }
                        }
                        
                        CaPTIVE.States.S3DViewer.Input.Mouse.lastX = newX;
                        CaPTIVE.States.S3DViewer.Input.Mouse.lastY = newY;
                    }
                }
            }
            CaPTIVE.States.S3DViewer.Draw = function(){
                if(CaPTIVE.Entity.Cancers.length > 0){
                    for(var i = 0; i < CaPTIVE.Entity.Cancers.length; i++){
                        if(CaPTIVE.Entity.Cancers[i]){
                            CaPTIVE.Entity.Cancers[i].Graphics.Draw();
                        }
                    }
                }
                
                if(CaPTIVE.Entity.model){
                    CaPTIVE.Entity.model.Graphics.Draw();
                    CaPTIVE.Entity.Orientation.arrows.Graphics.Draw();
                }
            }
            CaPTIVE.States.S3DViewer.Update = function(dt){
                
            }
            //
            //  Layer Definition State
            CaPTIVE.States.SLayerDefinition = new CState("SLayerDefinition");
            CaPTIVE.States.SLayerDefinition.html = document.getElementById("SLayerDefinition");
            CaPTIVE.States.SLayerDefinition.Enter = function(){
                
                //Verify Dimensions of OBJ Have been set
                if(!CaPTIVE.Status.OBJDimensions){
                    document.getElementById("modalContent").innerHTML = "<h2>No Model Dimensions</h2><p>You must give the 3D model dimensions before editing layers</p>";
                    CaPTIVE.Modal.Show();
                    
                    if(CaPTIVE.Menu.Current != "model"){ CaPTIVE.Menu.SetActive("model")};
                    CaPTIVE.Menu.model.SetActiveOption(3);
                    
                    CaPTIVE.FSM.AnimatedTransition("S3DViewer");
                }
                else if(CaPTIVE.Status.LayersDefined && !CaPTIVE.Status.LayersWithCancer){
                    //Show Modal Requesting user to identify which layers have cancer
                    //  Click Blue Light to toggle betwen Green and Red
                    //  Green = Cancer
                    //  Red = No cancer
                    //Launch Model
                    document.getElementById("modalContent").innerHTML = "<h2>Identify Layers With Cancer</h2>Click on the <span style='color: blue;'>blue</span> lights in the Cancer column to identify which layers have cancer present</p><br/><span style='color: green;'>Green = Cancer</span><br/><span style='color: red'>Red = NO Cancer</span>"
                    CaPTIVE.Modal.Show();
                }
                
            }
            CaPTIVE.States.SLayerDefinition.Execute = function(){
                
            }
            CaPTIVE.States.SLayerDefinition.Exit = function(){
                
            }
            CaPTIVE.States.SLayerDefinition.Set = function(){
                //Get Number of Layers
                var totLayers = document.getElementById("slayerdefinition-total").value | 0;
                
                //Set Status To True
                CaPTIVE.Status.LayersDefined = true;
                
                //Set Dashboard Light to Yellow
                CaPTIVE.Dashboard.SetLight.Yellow(CaPTIVE.Dashboard.Overview.Layers.light);
                CaPTIVE.Dashboard.Overview.Layers.message.innerHTML = "Layers Need Configuration";
                
                //Set Layer Dashboard Light Green    
                CaPTIVE.Dashboard.Layers.Defined.message.innerHTML = totLayers + " defined";
                CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Layers.Defined.light);
                
                //Set Layer Overview Tab Light
                CaPTIVE.Dashboard.SetLight.Green(document.getElementById("layer-defined-light"));
                document.getElementById("layer-defined-message").innerHTML = totLayers + " defined";
                
                //Build CLayer Objects
                for(var i = 0; i < totLayers; i++){
                    //var startDepth = i * CaPTIVE.Entity.Dimensions.height/totLayers;
                    //var endDepth = startDepth + CaPTIVE.Entity.Dimensions.height/totLayers;
                    
                    var startDepth = (totLayers - i) * CaPTIVE.Entity.Dimensions.height/totLayers;
                    var endDepth = startDepth - CaPTIVE.Entity.Dimensions.height/totLayers;
                    
                    
                    CaPTIVE.Entity.Layers.push(new CLayer(i,startDepth, endDepth));
                }
                
                //Hide Input
                document.getElementById("layer-definition").className += " hide";
                
                //Build Table
                document.getElementById("layer-overview").className = "datagrid";  
                CaPTIVE.States.SLayerDefinition.BuildTable();
                
                //Update Menu (Update/Remove Button)
                    //Overview
                document.getElementById("layer-overview-button").innerHTML = "View Layers"

                    
                //Show Modal Requesting user to identify which layers have cancer
                //  Click Blue Light to toggle betwen Green and Red
                //  Green = Cancer
                //  Red = No cancer
                //Launch Model
                document.getElementById("modalContent").innerHTML = "<h2>Identify Layers With Cancer</h2>Click on the <span style='color: blue;'>blue</span> lights in the Cancer column to identify which layers have cancer present</p><br/><span style='color: green;'>Green = Cancer</span><br/><span style='color: red'>Red = NO Cancer</span>"
                CaPTIVE.Modal.Show();
            }
            CaPTIVE.States.SLayerDefinition.BuildTable = function(){
                 var html = "";
                 
                var AddRow = function(layer){
                    return "<tr>" +
                        "<td>" + (layer.id + 1) +"</td>" +
                        "<td>"+ layer.start.toFixed(1) +"</td>" +
                        "<td>"+ layer.stop.toFixed(1) +"</td>" +
                        "<td><div id='" + layer.id + "-layer-cancer' onclick='CaPTIVE.States.SLayerDefinition.ToggleCancer("+ layer.id +");' class='led-blue'></div></td>" +
                        "<td><div id='" + layer.id + "-layer-image' class='led-red'></div></td>" +
                        "<td><div id='" + layer.id + "-layer-trace' class='led-red'></div></td>" +
                        "<td><div id='" + layer.id + "-layer-3d' class='led-red'></div></td>" +
                    "</tr>";
                }
                
                var AddAltRow = function(layer){
                    return "<tr class='alt'>" +
                        "<td>" + (layer.id + 1) +"</td>" +
                        "<td>"+ layer.start.toFixed(1) +"</td>" +
                        "<td>"+ layer.stop.toFixed(1) +"</td>" +
                        "<td><div id='" + layer.id + "-layer-cancer' onclick='CaPTIVE.States.SLayerDefinition.ToggleCancer("+ layer.id +");' class='led-blue'></div></td>" +
                        "<td><div id='" + layer.id + "-layer-image' class='led-red'></div></td>" +
                        "<td><div id='" + layer.id + "-layer-trace' class='led-red'></div></td>" +
                        "<td><div id='" + layer.id + "-layer-3d' class='led-red'></div></td>" +
                    "</tr>";
                }
                
                //Add Table Header
                html = "<p>Layer Details</p><table><thead><tr><th>ID</th><th>Start</th><th>Stop</th><th>Cancer</th><th>Image</th><th>Trace</th><th>3D</th></tr></thead><tbody>"
                
                for(var i = 0; i < CaPTIVE.Entity.Layers.length; i++){
                    if(i%2){
                        html += AddRow(CaPTIVE.Entity.Layers[i]);
                    }
                    else{
                        html += AddAltRow(CaPTIVE.Entity.Layers[i]);
                    }
                }
                
                
                html += "</tbody></table>";
                document.getElementById("layer-overview").innerHTML = html;
                
            }
            CaPTIVE.States.SLayerDefinition.ToggleCancer = function(id){
                var layer = CaPTIVE.Entity.Layers[id|0];
                if(layer.cancer == null){
                    //Set Red
                    CaPTIVE.Dashboard.SetLight.Red(document.getElementById(layer.id + "-layer-cancer"));
                    layer.cancer = false;
                }
                else if(layer.cancer == true){
                    //Set Red
                    CaPTIVE.Dashboard.SetLight.Red(document.getElementById(layer.id + "-layer-cancer"));
                    layer.cancer = false;
                }
                else{
                    //Set Green
                    CaPTIVE.Dashboard.SetLight.Green(document.getElementById(layer.id + "-layer-cancer"));
                    layer.cancer = true;
                }
                
                //Test to see if all cancers have been configured
                if(!CaPTIVE.Status.LayersWithCancer){
                    var configured = true;
                    var i = 0;
                    while((i < CaPTIVE.Entity.Layers.length) && configured){
                        if(CaPTIVE.Entity.Layers[i].cancer == null){
                            configured = false;
                        }
                        i++;
                    }
                    
                    if(configured){
                        CaPTIVE.Status.LayersWithCancer = true;
                        //Update Lights and Labels
                        //Set Dashboard Light to Yellow
                        CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Overview.Layers.light);
                        CaPTIVE.Dashboard.Overview.Layers.message.innerHTML = "Layers Configured";
                        
                        //Set Layer Dashboard Light Green    
                        CaPTIVE.Dashboard.Layers.Cancer.message.innerHTML =  "Cancer Layers Identified";
                        CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Layers.Cancer.light);
                        
                        //Set Layer Overview Tab Light
                        CaPTIVE.Dashboard.SetLight.Green(document.getElementById("layer-cancer-light"));
                        document.getElementById("layer-cancer-message").innerHTML = "Cancer Layers Identified";
                        
                    }
                }

            }
            CaPTIVE.States.SLayerDefinition.Edit = function(){
                //Warn with Modal, this will delete all layer information
                
                //Change Button onclick to SLayerDefinition.Set
            }
            //
            //  Cancer Generation State
            CaPTIVE.States.SCancerGeneration = new CState("SCancerGeneration");
            CaPTIVE.States.SCancerGeneration.html = document.getElementById("SCancerGeneration");
            CaPTIVE.States.SCancerGeneration.Enter = function(){
                
                //Verify All Cancer Layers have Traces
                if(CaPTIVE.Status.CancerLayersOutlined){
                    
                    //Launch Modal
                    var html = "<h2>Cancer Properties</h2>";
                    html += "<p>Thickness: <input class='slider' id='cancer-thickness' type='range' min='0.1' max='0.9' step='0.1' value='0.1'></p><br/>";
                    html += '<a class="button" onclick="CaPTIVE.States.SCancerGeneration.Generate()">Generate</a>'
                    document.getElementById("modalContent").innerHTML = html;
                    
                    CaPTIVE.Modal.Show();
                    
                    //Show Loader Spinner
                    CaPTIVE.Spinner.Show();

                }
                else{
                    //Launch Modal
                    document.getElementById("modalContent").innerHTML = "<h2>Cancer Outlines Incomplete</h2><p>All layers that have cancer present must have traces before 3D Cancer models can be generated</p>";
                    CaPTIVE.Modal.Show();
                    
                    //Transition to Layer Definition
                    CaPTIVE.FSM.AnimatedTransition("SLayerDefinition");
                    
                    //Open Alignment Menu
                    if(CaPTIVE.Menu.Current != "layers"){ CaPTIVE.Menu.SetActive("layers")};
                    CaPTIVE.Menu.model.SetActiveOption(1);
                }
            }
            CaPTIVE.States.SCancerGeneration.Execute = function(){
            
            }
            CaPTIVE.States.SCancerGeneration.Exit = function(){
                //Remove event listener for WebWorker
                CaPTIVE.Workers.files.removeEventListener('message',CaPTIVE.States.SCancerGeneration.onMessage, false);
            }
            CaPTIVE.States.SCancerGeneration.Generate = function(){
                 //Add event listener for WebWorker
                    CaPTIVE.Workers.files.addEventListener('message',CaPTIVE.States.SCancerGeneration.onMessage, false);
                    
                    var thickness = document.getElementById("cancer-thickness").value;
                    thickness /= 2;
                    CaPTIVE.Entity.Dimensions.top = 0.5 - thickness;
                    CaPTIVE.Entity.Dimensions.bottom = 0.5 + thickness;
                    
                    CaPTIVE.Workers.files.postMessage({
                                                        type: "Cancer",
                                                        data: {
                                                                layers: CaPTIVE.Entity.Layers,
                                                                meshes: CaPTIVE.Files.mesh,
                                                                dimensions: CaPTIVE.Entity.Dimensions
                                                        }
                                                    });
                    
                    CaPTIVE.Modal.Hide();
            }
            
            CaPTIVE.States.SCancerGeneration.onMessage = function(e){
                
                //Get Updated Layers
                CaPTIVE.Entity.Layers = e.data.layers;
                
                //Create Cancer Entities                
                for(var j = 0; j < CaPTIVE.Entity.Layers.length; j++){
                    var layer = CaPTIVE.Entity.Layers[j];
                    
                    //If Cancer Exist In Layer, Build Graphics Entity
                    if(layer.cancer){
                        for(var k = 0; k < layer.json.length; k++){
                            var list = layer.json[k]
                            //Create Entity
                            CaPTIVE.Entity.Cancers[layer.id] = os.graphics.Managers.Entity.Create();
                            
                            CaPTIVE.Entity.Cancers[layer.id].Graphics.Set.texture(false);
                            CaPTIVE.Entity.Cancers[layer.id].Set.Scale(1,1,1);
                            CaPTIVE.Entity.Cancers[layer.id].Set.Position(0,0,0);
                            CaPTIVE.Entity.Cancers[layer.id].Graphics.Set.useBlendColor(true);
                            CaPTIVE.Entity.Cancers[layer.id].Graphics.Set.blendColor([0.5, 0.5, 0.5]);
                            CaPTIVE.Entity.Cancers[layer.id].Graphics.Set.enableAlpha(false);
                            CaPTIVE.Entity.Cancers[layer.id].Graphics.Set.aligned(true);
                            CaPTIVE.Entity.Cancers[layer.id].Default.yaw = 0;
                            CaPTIVE.Entity.Cancers[layer.id].Default.pitch = 0;
                            CaPTIVE.Entity.Cancers[layer.id].Graphics.Matrix.Pitch = mat4.create();
                            mat4.identity(CaPTIVE.Entity.Cancers[layer.id].Graphics.Matrix.Pitch);
                            
                            CaPTIVE.Entity.Cancers[layer.id].Graphics.Mesh.removeAll();
                            
                            for(var i = 0; i < list.length; i++){
                                //Initialize Mesh
                                var msh = os.graphics.Managers.Mesh.Create.Mesh("layer" + layer.id + "-" + k + "-" + i , null, list[i]);
                                msh.Initialize();
                                CaPTIVE.Entity.Cancers[layer.id].Graphics.Add.Mesh(msh.name);
                            }
                            
                            CaPTIVE.Dashboard.SetLight.Green(document.getElementById(layer.id + "-layer-3d"));
                        }
                        
                        if(CaPTIVE.Entity.Cancers[i]){
                            //os.graphics.AddToDraw(CaPTIVE.Entity.Cancers[layer.id]);
                        }
                    }
                }
                
                //Update Margins on Excision Mesh
                var meshes = e.data.meshes;
                
                for(var i = 0; i < meshes.length; i++){
                
                    var msh = CaPTIVE.Entity.model.Graphics.Mesh.get("mesh"+i);
                    
                    for(var j = 0; j < msh.model.vertexMargins.length; j++){
                        msh.model.vertexMargins[j] = meshes[i].vertexMargins[j];
                    }
                    
                    var gl = os.graphics.gl;
                    gl.bindBuffer(gl.ARRAY_BUFFER, msh.Buffers.Margin);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(msh.model.vertexMargins), gl.STATIC_DRAW);
                
                }
                
                
                CaPTIVE.Status.CancerObjectsGenerated = true;
                
                CaPTIVE.Spinner.Hide();
                
                CaPTIVE.Launch.Viewer();
                
                CaPTIVE.Dashboard.SetLight.Green(document.getElementById("cancer-generated-light"));
                document.getElementById("cancer-generated-message").innerHTML ="Cancer Generation Complete";
                    
                CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Overview.Cancer.light);
                CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Cancer.Generated.light);
                CaPTIVE.Dashboard.Cancer.Generated.message.innerHTML = "Cancer Generation Complete";
                CaPTIVE.Dashboard.Overview.Cancer.message.innerHTML = "Cancer Generation Complete";
                
                CaPTIVE.States.S3DViewer.Input.Reset();
            }
            
            
        }
    },
    FSM: null,
    States: {
        
    },
    Menu: null,
    Set: {
        
    },
    ToggleFullscreen: function(){
        var canvas = os.graphics.Get.Canvas();
        if(CaPTIVE.FSM.GetState() == "S3DViewer"){
            if(CaPTIVE.Status.fullscreen){
                CaPTIVE.Status.fullscreen = false;
                canvas.style.position = "";
                canvas.parentNode.className = "S3DViewer mask";
                
                //Return app container to normal 
                document.getElementById('app').className = "app flyIn";
                
                var parent = canvas.offsetParent;
                
                canvas.style.left = "";
                canvas.style.top = "";
                
                
                canvas.style.width = "100%";
                canvas.style.height = "100%";
                setTimeout(function(){
                    os.graphics.OnReset();
                }, 1000);
            }
            else{
                CaPTIVE.Status.fullscreen = true;
                canvas.style.position = "absolute";
                canvas.parentNode.className = "S3DViewer";
                
                //Remove shadow from app container
                document.getElementById('app').className = "app flyIn shadowRemoval";
                
                var parent = canvas.offsetParent;
                canvas.style.left = -(parent.offsetLeft + 1) + "px";
                canvas.style.top = -parent.offsetTop + "px";
                
                canvas.style.width = window.innerWidth + "px";
                canvas.style.height = window.innerHeight + "px";
                setTimeout(function(){
                    os.graphics.OnReset();
                }, 1000);
            }
        }
        
        
    },
    Status: {
        OBJLoaded: false,
        OBJOrientation: false,
        OBJDimensions: false,
        LayersDefined: false,
        LayersWithCancer: false,
        CancerLayersOutlined: false,
        CancerObjectsGenerated: false,
        fullscreen: false
    },
    Dashboard: {
        SetLight: {
            Red: function(light){
                light.className = "led-red";
            },
            Yellow: function(light){
                light.className = "led-yellow";
            },
            Green: function(light){
                light.className = "led-green";
            },
            Blue: function(light){
                light.className = "led-blue";
            }
        },
        Overview: null,
        Model: null,
        Layers: {
            
        },
        Cancer: {
            
        }
    },
    ImageEditor: {
        Toolbar: {
            Clear: function(){
                WinScene.elements.toolbar.html().innerHTML = "";                               
            },
            BuildImageIcons: function(){
                //Load up Tool bar Icons
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/OpenFile.png", "Open Image",WinScene, CaPTIVE.ImageEditor.SetMode.OpenFile);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/SaveCanvas.png", "Save Canvas",WinScene, CaPTIVE.ImageEditor.SetMode.SaveCanvas);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/SaveImage.png", "Save Selected Image",WinScene, CaPTIVE.ImageEditor.Modals.SaveImage);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/MousePointer.png", "Select Image",WinScene, CaPTIVE.ImageEditor.SetMode.Select);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/Pan.png", "Pan Canvas",WinScene, CaPTIVE.ImageEditor.SetMode.Pan);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/Move.png", "Move Image",WinScene, CaPTIVE.ImageEditor.SetMode.Move);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/Crop.png", "Crop",WinScene, CaPTIVE.ImageEditor.SetMode.Crop);
                //CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/CurvePoints.png", "Trace",WinScene, CaPTIVE.ImageEditor.SetMode.Trace);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/FlipHorizontally.png", "Flip Horizontal",WinScene, CaPTIVE.ImageEditor.SetMode.MirrorHorizontal);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/FlipVertical.png", "Flip Vertical",WinScene, CaPTIVE.ImageEditor.SetMode.MirrorVertical);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/RotateCCW.png", "Rotate Left",WinScene, CaPTIVE.ImageEditor.SetMode.RotateCCW);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/RotateCW.png", "Rotate Right",WinScene, CaPTIVE.ImageEditor.SetMode.RotateCW);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/Rotation.png", "Rotate with Mouse",WinScene, CaPTIVE.ImageEditor.SetMode.RotateWithMouse);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/StretchLeft-right.png", "Stretch Width",WinScene, CaPTIVE.ImageEditor.SetMode.StretchWidth);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/StretchUp-down.png", "Stretch Height",WinScene, CaPTIVE.ImageEditor.SetMode.StretchHeight);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/ResizeImage.png", "Scale Image",WinScene, CaPTIVE.ImageEditor.SetMode.StretchImage);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/Extents.png", "Extents",WinScene, CaPTIVE.ImageEditor.Extents);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/ZoomIn.png", "Zoom In",WinScene, CaPTIVE.ImageEditor.SetMode.ZoomIn);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/ZoomOut.png", "Zoom Out",WinScene, CaPTIVE.ImageEditor.SetMode.ZoomOut);
                //CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/BuildCancers.png", "Build 3D Cancer Models",WinScene, CaPTIVE.ImageEditor.BuildCancers);
                
            },
            BuildLayerIcons: function(){
                //Load up Tool bar Icons
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/OpenFile.png", "Open Layer",WinScene, CaPTIVE.ImageEditor.SetMode.OpenLayer);
                //CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/SaveCanvas.png", "Save Canvas",WinScene, CaPTIVE.ImageEditor.SetMode.SaveCanvas);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/SaveImage.png", "Save Selected Image",WinScene, CaPTIVE.ImageEditor.Modals.SaveLayer);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/MousePointer.png", "Select Image",WinScene, CaPTIVE.ImageEditor.SetMode.Select);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/Pan.png", "Pan Canvas",WinScene, CaPTIVE.ImageEditor.SetMode.Pan);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/Move.png", "Move Image",WinScene, CaPTIVE.ImageEditor.SetMode.Move);
                //CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/Crop.png", "Crop",WinScene, CaPTIVE.ImageEditor.SetMode.Crop);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/CurvePoints.png", "Trace",WinScene, CaPTIVE.ImageEditor.SetMode.Trace);
                //CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/FlipHorizontally.png", "Flip Horizontal",WinScene, CaPTIVE.ImageEditor.SetMode.MirrorHorizontal);
                //CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/FlipVertical.png", "Flip Vertical",WinScene, CaPTIVE.ImageEditor.SetMode.MirrorVertical);
                //CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/RotateCCW.png", "Rotate Left",WinScene, CaPTIVE.ImageEditor.SetMode.RotateCCW);
                //CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/RotateCW.png", "Rotate Right",WinScene, CaPTIVE.ImageEditor.SetMode.RotateCW);
                //CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/Rotation.png", "Rotate with Mouse",WinScene, CaPTIVE.ImageEditor.SetMode.RotateWithMouse);
                //CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/StretchLeft-right.png", "Stretch Width",WinScene, CaPTIVE.ImageEditor.SetMode.StretchWidth);
                //CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/StretchUp-down.png", "Stretch Height",WinScene, CaPTIVE.ImageEditor.SetMode.StretchHeight);
                //CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/ResizeImage.png", "Scale Image",WinScene, CaPTIVE.ImageEditor.SetMode.StretchImage);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/Extents.png", "Extents",WinScene, CaPTIVE.ImageEditor.Extents);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/ZoomIn.png", "Zoom In",WinScene, CaPTIVE.ImageEditor.SetMode.ZoomIn);
                CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/ZoomOut.png", "Zoom Out",WinScene, CaPTIVE.ImageEditor.SetMode.ZoomOut);
                //CaPTIVE.ImageEditor.AddToolbarImage("scripts/Applications/ImageEditorIcons/BuildCancers.png", "Build 3D Cancer Models",WinScene, CaPTIVE.ImageEditor.BuildCancers);                
            }
        },
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
                    point = CaPTIVE.ImageEditor.CalculateIntersection([oEdge.Center.x, oEdge.Center.y, 0], [oPoint.x, oPoint.y, 0],[oEdge.Points[i].x, oEdge.Points[i].y, 0], [oEdge.Points[i-1].x, oEdge.Points[i-1].y, 0] );
                }
            }
            
            if(point == null){
                point = CaPTIVE.ImageEditor.CalculateIntersection([oEdge.Center.x, oEdge.Center.y, 0], [oPoint.x, oPoint.y, 0],[oEdge.Points[0].x, oEdge.Points[0].y, 0], [oEdge.Points[oEdge.Points.length-1].x, oEdge.Points[oEdge.Points.length-1].y, 0] );
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
                CaPTIVE.ImageEditor.Scene.Clear();
       
                //Save Draw States and Transforms
                CaPTIVE.ImageEditor.Scene.ctx.save();
            
                //Set Scale for Scene
                CaPTIVE.ImageEditor.Scene.ctx.scale(CaPTIVE.ImageEditor.Scene.scaleWidth, CaPTIVE.ImageEditor.Scene.scaleHeight);
                CaPTIVE.ImageEditor.Scene.ctx.scale(CaPTIVE.ImageEditor.Viewport.scaleWidth , CaPTIVE.ImageEditor.Viewport.scaleHeight);
                CaPTIVE.ImageEditor.Scene.ctx.translate(-CaPTIVE.ImageEditor.Viewport.Position.x, -CaPTIVE.ImageEditor.Viewport.Position.y);
                
                //Loop through scene entities and Draw Images
                for(var i = 0; i < CaPTIVE.ImageEditor.Scene.Entities.length; i++){
                    CaPTIVE.ImageEditor.Scene.Entities[i].Draw(CaPTIVE.ImageEditor.Scene.ctx);
                }
                
                CaPTIVE.ImageEditor.Scene.Entities[i-1].Outline(CaPTIVE.ImageEditor.Scene.ctx,2, "red");
                
                //Restore States and Transforms
                CaPTIVE.ImageEditor.Scene.ctx.restore();
                
                
            },
            Clear: function(){
            
                //http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#transformations
                //Set Transform(a,b,c,d,e,f)
                //  a	c	e
                //  b	d	f
                //  0	0	1
    
                CaPTIVE.ImageEditor.Scene.ctx.save();
                CaPTIVE.ImageEditor.Scene.ctx.setTransform(1, 0, 0, 1, 0, 0);
                CaPTIVE.ImageEditor.Scene.ctx.clearRect(0, 0, CaPTIVE.ImageEditor.Scene.width, CaPTIVE.ImageEditor.Scene.height);
                
                CaPTIVE.ImageEditor.Scene.ctx.strokeStyle = "black";
                CaPTIVE.ImageEditor.Scene.ctx.fillStyle = "black";
                CaPTIVE.ImageEditor.Scene.ctx.lineWidth = 1;
                CaPTIVE.ImageEditor.Scene.ctx.strokeRect(0, 0, CaPTIVE.ImageEditor.Scene.width, CaPTIVE.ImageEditor.Scene.height);
                CaPTIVE.ImageEditor.Scene.ctx.restore();
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
                CaPTIVE.ImageEditor.MiniMap.Clear();
                
                //Save Draw States and Transforms
                CaPTIVE.ImageEditor.MiniMap.ctx.save();
                
                //Set Scale for Scene
                CaPTIVE.ImageEditor.MiniMap.ctx.scale(CaPTIVE.ImageEditor.MiniMap.scaleWidth, CaPTIVE.ImageEditor.MiniMap.scaleHeight);
                
                //Loop through scene entities and Draw Images
                for(var i = 0; i < CaPTIVE.ImageEditor.Scene.Entities.length; i++){
                    CaPTIVE.ImageEditor.Scene.Entities[i].Draw(CaPTIVE.ImageEditor.MiniMap.ctx);
                }
                
                //Save Draw States and Transforms
                CaPTIVE.ImageEditor.MiniMap.ctx.restore();
                
                //
                //  Draw Viewport Box
                //
                
                CaPTIVE.ImageEditor.MiniMap.ctx.save();
                
                    //Set Box Color
                CaPTIVE.ImageEditor.MiniMap.ctx.strokeStyle = "red";
                
                    //Get get position of Viewport in MiniMap
                var vp = CaPTIVE.ImageEditor.Convert.SceneTo.MiniMap(CaPTIVE.ImageEditor.Viewport.Position.x, CaPTIVE.ImageEditor.Viewport.Position.y);
                var br = CaPTIVE.ImageEditor.Convert.SceneTo.MiniMap(CaPTIVE.ImageEditor.Viewport.Position.x + CaPTIVE.ImageEditor.Viewport.width, CaPTIVE.ImageEditor.Viewport.Position.y + CaPTIVE.ImageEditor.Viewport.height)
                     
                    //Calculate Viewport width and height in MiniMap
                var width  = br.x - vp.x; //CaPTIVE.ImageEditor.MiniMap.width / CaPTIVE.ImageEditor.Viewport.scale;//
                var height = br.y - vp.y; //CaPTIVE.ImageEditor.MiniMap.height / CaPTIVE.ImageEditor.Viewport.scale;//
                
                    //Clip width and height to MiniMap boundaries
                if(vp.x + width > CaPTIVE.ImageEditor.MiniMap.width){ width = CaPTIVE.ImageEditor.MiniMap.width - vp.x; }
                if(vp.y + height > CaPTIVE.ImageEditor.MiniMap.height){ height = CaPTIVE.ImageEditor.MiniMap.height - vp.y; }
                
                    //Draw Viewport on MiniMap
                CaPTIVE.ImageEditor.MiniMap.ctx.strokeRect(vp.x, vp.y,  width, height);
                
                CaPTIVE.ImageEditor.MiniMap.ctx.restore();
            },
            Clear: function(){
                CaPTIVE.ImageEditor.MiniMap.ctx.save();
                CaPTIVE.ImageEditor.MiniMap.ctx.setTransform(1, 0, 0, 1, 0, 0);
                CaPTIVE.ImageEditor.MiniMap.ctx.clearRect(0, 0, CaPTIVE.ImageEditor.MiniMap.width, CaPTIVE.ImageEditor.MiniMap.height);
                CaPTIVE.ImageEditor.MiniMap.ctx.strokeStyle = "black";
                CaPTIVE.ImageEditor.MiniMap.ctx.fillStyle = "black";
                CaPTIVE.ImageEditor.MiniMap.ctx.lineWidth = 1;
                CaPTIVE.ImageEditor.MiniMap.ctx.strokeRect(0, 0, CaPTIVE.ImageEditor.MiniMap.width, CaPTIVE.ImageEditor.MiniMap.height);
                CaPTIVE.ImageEditor.MiniMap.ctx.restore();
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
                CaPTIVE.ImageEditor.Viewport.width = CaPTIVE.ImageEditor.Scene.width / CaPTIVE.ImageEditor.Viewport.scaleWidth;
                CaPTIVE.ImageEditor.Viewport.height = CaPTIVE.ImageEditor.Scene.height / CaPTIVE.ImageEditor.Viewport.scaleHeight;
                CaPTIVE.ImageEditor.Viewport.halfWidth = CaPTIVE.ImageEditor.Viewport.width/2;
                CaPTIVE.ImageEditor.Viewport.halfHeight = CaPTIVE.ImageEditor.Viewport.height/2;
                
            },
            Clear: function(){
                CaPTIVE.ImageEditor.Viewport.ctx.save();
                CaPTIVE.ImageEditor.Viewport.ctx.setTransform(1, 0, 0, 1, 0, 0);
                CaPTIVE.ImageEditor.Viewport.ctx.clearRect(0, 0, CaPTIVE.ImageEditor.Scene.width, CaPTIVE.ImageEditor.Scene.height);
                
                CaPTIVE.ImageEditor.Viewport.ctx.restore();
            }
            
        },
        Convert: {
            MiniMapTo: {
                Viewport: function(x, y){
                    var out = {
                        x: 0,
                        y: 0
                    }
                    //Convert to Scene
                    out = CaPTIVE.ImageEditor.Convert.MiniMapTo.Scene(x,y);
                    
                    //Scene To Viewport
                    out = CaPTIVE.ImageEditor.Convert.SceneTo.Viewport(out.x, out.y);
                    
                    return out;
                },
                Scene: function(x, y){
                    var out = {
                        x: 0,
                        y: 0
                    }
                    out.x = x / CaPTIVE.ImageEditor.MiniMap.scaleWidth;
                    out.y = y / CaPTIVE.ImageEditor.MiniMap.scaleHeight;
                    
                    return out;
                }
            },
            ViewportTo: {
                MiniMap: function(x,y){
                    var out = {
                        x: 0,
                        y: 0
                    }
                    //Convert to Scene
                    out = CaPTIVE.ImageEditor.Convert.ViewportTo.Scene(x,y);
                    
                    //Scene To MiniMap
                    out = CaPTIVE.ImageEditor.Convert.SceneTo.MiniMap(out.x, out.y);
                    
                    return out;
                },
                Scene: function(x,y){
                    var out = {
                        x: 0,
                        y: 0
                    }
                    
                    out.x = x * CaPTIVE.ImageEditor.Viewport.width  / CaPTIVE.ImageEditor.Scene.canvas.html().width  + CaPTIVE.ImageEditor.Viewport.Position.x;
                    out.y = y * CaPTIVE.ImageEditor.Viewport.height / CaPTIVE.ImageEditor.Scene.canvas.html().height + CaPTIVE.ImageEditor.Viewport.Position.y;
                    return out;
                }
            },
            SceneTo: {
                MiniMap: function(x,y){
                    var out = {
                        x: 0,
                        y: 0
                    }
                    out.x = x * CaPTIVE.ImageEditor.MiniMap.scaleWidth;
                    out.y = y * CaPTIVE.ImageEditor.MiniMap.scaleHeight;
                    
                    return out;
                },
                Viewport: function(x, y){
                    var out = {
                        x: 0,
                        y: 0
                    }
                    out.x = (x - CaPTIVE.ImageEditor.Viewport.Position.x) * CaPTIVE.ImageEditor.Scene.canvas.html().width  / CaPTIVE.ImageEditor.Viewport.width;
                    out.y = (y - CaPTIVE.ImageEditor.Viewport.Position.y) * CaPTIVE.ImageEditor.Scene.canvas.html().height / CaPTIVE.ImageEditor.Viewport.height;
                    
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
            WinScene.Hide.titlebar();
            WinScene.Hide.menubar();
            WinScene.Set.position(-100,-45)
            
            //WinScene.elements.window.AppendToID("SImageEditor");
            
            //CaPTIVE.ImageEditor.Toolbar.BuildImageIcons();
            
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
            WinMiniMap.Hide.titlebar();
            WinMiniMap.Hide.statusbar();
            WinMiniMap.Hide.menubar();
            WinMiniMap.Hide.toolbar();
            //WinMiniMap.Set.position(75,100);
            WinMiniMap.Set.position(-100,770);
            //WinMiniMap.Minimize();
            
            
            //WinMiniMap.elements.window.AppendToID("SImageEditor");
            //
            //Build Scene Canvas
            //
            CaPTIVE.ImageEditor.Scene.canvas = os.resschmgr.Create.HTMLElement("canvas");
            CaPTIVE.ImageEditor.Scene.canvas.html().setAttribute('tabindex', "1");
            CaPTIVE.ImageEditor.Scene.ctx = CaPTIVE.ImageEditor.Scene.canvas.html().getContext('2d');
            CaPTIVE.ImageEditor.Scene.ctx.setTransform(1, 0, 0, 1, 0, 0);
            CaPTIVE.ImageEditor.Scene.canvas.html().width = 800;
            CaPTIVE.ImageEditor.Scene.canvas.html().height = 800;
            CaPTIVE.ImageEditor.Scene.width = 800;
            CaPTIVE.ImageEditor.Scene.height = 800;
            CaPTIVE.ImageEditor.Scene.canvas.AppendTo(WinScene.elements.content.html());
            WinScene.Set.height(678);
            //
            //Build Minimap Canvas
            //
            CaPTIVE.ImageEditor.MiniMap.canvas = os.resschmgr.Create.HTMLElement("canvas");
            CaPTIVE.ImageEditor.MiniMap.ctx = CaPTIVE.ImageEditor.MiniMap.canvas.html().getContext('2d');
            
            //Default width and height is 10% of Scene canvas
            CaPTIVE.ImageEditor.MiniMap.canvas.html().width = 150;;
            CaPTIVE.ImageEditor.MiniMap.canvas.html().height = 150;;
            CaPTIVE.ImageEditor.MiniMap.ctx.setTransform(1, 0, 0, 1, 0, 0);
            CaPTIVE.ImageEditor.MiniMap.width = 150;
            CaPTIVE.ImageEditor.MiniMap.height = 150;;
            
            CaPTIVE.ImageEditor.MiniMap.canvas.AppendTo(WinMiniMap.elements.content.html());
            
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
                WinScene.Set.statusbarText(CaPTIVE.States.SImageEditor.Events.Editor.Mode);
            }
            
            
            a.appendChild(img);
            
            win.elements.toolbar.AppendChild(a);
        },
        Update: function(){
            
            //Update Viewport Properties
            CaPTIVE.ImageEditor.Viewport.Update();
                
            //Draw the scene
            CaPTIVE.ImageEditor.Scene.Draw();
            
            //Draw the MiniMap
            CaPTIVE.ImageEditor.MiniMap.Draw();
        
        },
        SelectImage: function(x,y){
            
            var picked = false;
            var i = CaPTIVE.ImageEditor.Scene.Entities.length - 1;
            var pt, tl, tr, bl, br;
            var img = null;
            var v1DotPt, v2DotPt, v3DotPt, v4DotPt;
            
            while((i >= 0) && (!picked)){
                img = CaPTIVE.ImageEditor.Scene.Entities[i];
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
                CaPTIVE.ImageEditor.Scene.Entities.push(CaPTIVE.ImageEditor.Scene.Entities.splice(i,1)[0]);
                CaPTIVE.ImageEditor.Update();
            }
        },
        GetSelectedImage: function(){
            return  CaPTIVE.ImageEditor.Scene.Entities[CaPTIVE.ImageEditor.Scene.Entities.length - 1]
        },
        CropImage: function(){
            var img = CaPTIVE.ImageEditor.GetSelectedImage();
            var stop  = img.SceneToLocal(CaPTIVE.ImageEditor.EditControls.cropStop.x,  CaPTIVE.ImageEditor.EditControls.cropStop.y );
            
            var width  = CaPTIVE.ImageEditor.EditControls.cropStop.x - CaPTIVE.ImageEditor.EditControls.cropStart.x;
            var height = CaPTIVE.ImageEditor.EditControls.cropStop.y - CaPTIVE.ImageEditor.EditControls.cropStart.y;
            
            var tl = img.SceneToLocal(CaPTIVE.ImageEditor.EditControls.cropStart.x, CaPTIVE.ImageEditor.EditControls.cropStart.y);
            var tr = img.SceneToLocal(CaPTIVE.ImageEditor.EditControls.cropStart.x + width, CaPTIVE.ImageEditor.EditControls.cropStart.y);
            var br = img.SceneToLocal(CaPTIVE.ImageEditor.EditControls.cropStop.x,  CaPTIVE.ImageEditor.EditControls.cropStop.y );
            var bl = img.SceneToLocal(CaPTIVE.ImageEditor.EditControls.cropStop.x - width,  CaPTIVE.ImageEditor.EditControls.cropStop.y);
            
            img.Mask ={};
            
            img.Mask.tl = tl;
            img.Mask.tr = tr;
            img.Mask.br = br;
            img.Mask.bl = bl;
            
            CaPTIVE.States.SImageEditor.Events.Editor.Mode = ""
            
            CaPTIVE.ImageEditor.Update();
        },
        Modals: {
            ProcessSaveImageModal: function(){
                var img = CaPTIVE.ImageEditor.GetSelectedImage();
                var filename = document.getElementById('ie-filename').value;
                var width = document.getElementById('ie-width').value;
                var height = document.getElementById('ie-height').value;
                CaPTIVE.ImageEditor.SaveImage(img, filename, width, height);
                CaPTIVE.Modal.Hide();
            },
            SaveImage: function(){
                //Launch Model
                document.getElementById("modalContent").innerHTML = "<h2>Save Image</h2>"+
                '<table cellspacing="5px">' +
                '<tr>' +
                    '<td class="statusLabel">' +
                        'Filename:' +
                    '</td>' +
                    '<td>' +
                       '<input class="textbox" type="text" id="ie-filename">' +
                    '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td class="statusLabel">' +
                       ' Width' +
                    '</td>' +
                    '<td>' +
                       '<input class="textbox" type="text" id="ie-width">' +
                    '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td class="statusLabel">' +
                        'Height' +
                    '</td>' +
                    '<td>' +
                       '<input class="textbox" type="text" id="ie-height">' +
                    '</td>' +
                '</tr>' +
                "<tr><td></td><td><a class='button' onclick='CaPTIVE.ImageEditor.Modals.ProcessSaveImageModal()'>Save</a></td></tr></table>";
                
                
                CaPTIVE.Modal.Show();
                var img = CaPTIVE.ImageEditor.GetSelectedImage();
            
                document.getElementById("ie-width").value = Math.floor(img.width * Math.abs(img.Scale.x) );
                document.getElementById("ie-height").value = Math.floor(img.height * Math.abs(img.Scale.y));
                
            },
            ProcessSaveCanvasModal: function(){
                var filename = document.getElementById("ie-canvas-filename").value;
                CaPTIVE.ImageEditor.SaveCanvas(filename);
                CaPTIVE.Modal.Hide();
            },
            SaveCanvas: function(){
                //var filename = prompt("Enter Filename");
                //Launch Model
                document.getElementById("modalContent").innerHTML = "<h2>Save Canvas</h2>"+
                '<table cellspacing="5px">' +
                '<tr>' +
                    '<td class="statusLabel">' +
                        'Filename:' +
                    '</td>' +
                    '<td>' +
                       '<input class="textbox" type="text" id="ie-canvas-filename">' +
                    '</td>' +
                '</tr>' +
                //'<tr>' +
                //    '<td class="statusLabel">' +
                //       ' Width' +
                //    '</td>' +
                //    '<td>' +
                //       '<input class="textbox" type="text" id="ie-width">' +
                //    '</td>' +
                //'</tr>' +
                //'<tr>' +
                //    '<td class="statusLabel">' +
                //        'Height' +
                //    '</td>' +
                //    '<td>' +
                //       '<input class="textbox" type="text" id="ie-height">' +
                //    '</td>' +
                //'</tr>' +
                "<tr><td></td><td><a class='button' onclick='CaPTIVE.ImageEditor.Modals.ProcessSaveCanvasModal()'>Save</a></td></tr></table>";
                
                
                CaPTIVE.Modal.Show();
            },
            SaveLayer: function(){

                //Launch Model
                var html = "<h2>Save Layer</h2>"+
                '<table cellspacing="5px">' +
                '<tr>' +
                    '<td class="statusLabel">' +
                        'Select Layer:' +
                    '</td>' +
                    '<td>' +
                       '<select id="save-layer-selection">';
                
                //Add dropdown options
                for(var i = 0; i < CaPTIVE.Entity.Layers.length; i++){
                    html += '<option value="' + CaPTIVE.Entity.Layers[i].id + '">' + (CaPTIVE.Entity.Layers[i].id + 1) + '</option>';
                }
                
                html +=  '</select>' +
                    '</td>' +
                '</tr>' +
                "<tr><td></td><td><a class='button' onclick='CaPTIVE.ImageEditor.Modals.ProcessSaveLayerModal()'>Save</a></td></tr></table>";
                
                document.getElementById("modalContent").innerHTML = html;
                
                CaPTIVE.Modal.Show();
                
                
            },
            ProcessSaveLayerModal: function(){
                CaPTIVE.Modal.Hide();
                
                os.console.Comment("Processing Layer " + document.getElementById('save-layer-selection').value);
                
                //Get Layer ID
                var layer = CaPTIVE.Entity.Layers[document.getElementById('save-layer-selection').value | 0];
                
                //Save data url to Layer Object
                layer.img = CaPTIVE.ImageEditor.Scene.canvas.html().toDataURL();
                
                //Add hyperlink to show image
                document.getElementById(layer.id + "-layer-image").parentElement.innerHTML = '<a target="_blank" href="' + CaPTIVE.Entity.Layers[layer.id].img + '"><div id="' + layer.id + '-layer-image" class="led-red"></div></a>';
                
                //Update Image Light in Layer Overview Panel
                CaPTIVE.Dashboard.SetLight.Green(document.getElementById(layer.id + "-layer-image"));
                
                //If traces present, Update Trace Light And Save Traces To CLayer Object
                if(CaPTIVE.ImageEditor.Scene.Entities[0].Trace.points.length > 0){
                    CaPTIVE.Dashboard.SetLight.Green(document.getElementById(layer.id + "-layer-trace"));
                    layer.outlines = CaPTIVE.ImageEditor.Scene.Entities[0].Trace.points;
                }
                else{
                    CaPTIVE.Dashboard.SetLight.Red(document.getElementById(layer.id + "-layer-trace"));
                    CaPTIVE.Status.CancerLayersOutlined = false;
                    layer.outlines = [];
                }
                
                
                //Test to see if all Cancer Layers Have Traces
                    //If so, enable Cancer Generation Mode and Update Lights
                var tracesDefined = 0;
                var tracesLoaded  = 0;
                var i = 0;
                
                for(var i = 0; i < CaPTIVE.Entity.Layers.length; i++){
                    if(CaPTIVE.Entity.Layers[i].cancer){
                        tracesDefined++;
                        if(CaPTIVE.Entity.Layers[i].outlines.length > 0){
                            tracesLoaded++;
                        }
                    }
                }
                
                //No Traces Defined, Set Light Red
                if(tracesLoaded == 0){
                    CaPTIVE.Dashboard.SetLight.Red(CaPTIVE.Dashboard.Cancer.Outlines.light);
                    CaPTIVE.Dashboard.SetLight.Red(document.getElementById("cancer-outlines-light"));
                    CaPTIVE.Status.CancerLayersOutlined = false;
                }
                //All Traces Defined, Set Light Yellow
                else if(tracesLoaded < tracesDefined){   
                    CaPTIVE.Dashboard.SetLight.Yellow(CaPTIVE.Dashboard.Cancer.Outlines.light);
                    CaPTIVE.Dashboard.SetLight.Yellow(document.getElementById("cancer-outlines-light"));
                    
                    CaPTIVE.Dashboard.Cancer.Outlines.message.innerHTML = "Some Cancer Missing Traces";
                    document.getElementById("cancer-outlines-message").innerHTML ="Some Cancer Missing Traces"
                    
                    CaPTIVE.Status.CancerLayersOutlined = false;
                }
                //All Loaded and Defined, Set Light Green
                else { 
                    CaPTIVE.Dashboard.SetLight.Green(CaPTIVE.Dashboard.Cancer.Outlines.light);
                    CaPTIVE.Dashboard.SetLight.Green(document.getElementById("cancer-outlines-light"));
                    
                    CaPTIVE.Dashboard.Cancer.Outlines.message.innerHTML ="All Cancer Traces Complete";
                    document.getElementById("cancer-outlines-message").innerHTML ="All Cancer Traces Complete";
                    
                    //Set Dashboard Overview to Yellow
                    CaPTIVE.Dashboard.SetLight.Yellow(CaPTIVE.Dashboard.Overview.Cancer.light);
                    CaPTIVE.Dashboard.Overview.Cancer.message.innerHTML = "Cancer Need To Be Generated";
                    
                    CaPTIVE.Status.CancerLayersOutlined = true;
                }
                
                
            }
        },
        SaveImage: function(img, filename, width, height){
            //var filename = prompt("Enter Filename");
            //var img = CaPTIVE.ImageEditor.GetSelectedImage();
            
            CaPTIVE.ImageEditor.Scene.ctx.save();
            var defaultWidth = CaPTIVE.ImageEditor.Scene.canvas.html().width;
            var defaultHeight = CaPTIVE.ImageEditor.Scene.canvas.html().height;
            CaPTIVE.ImageEditor.Scene.canvas.html().width = img.width
            CaPTIVE.ImageEditor.Scene.canvas.html().height = img.height;
            var context = CaPTIVE.ImageEditor.Scene.ctx;
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
            
            ctx.setTransform(1, 0, 0, 1, 0, 0);
              
            //var width, height;    
            //width = prompt("What width (Native Width x Height: " + Math.floor(img.width * Math.abs(img.Scale.x) )+" x "+ Math.floor(img.height * Math.abs(img.Scale.y)));//img.width;
            //height = prompt("What height (Native Width x Height: " + Math.floor(img.width * Math.abs(img.Scale.x)) +" x "+ Math.floor(img.height * Math.abs(img.Scale.y)));//img.height
            //
            //width = width == "" ? img.width * Math.abs(img.Scale.x) : width;
            //height = height == "" ? img.height  * Math.abs(img.Scale.y): height;
            
            canvas.html().width = width;
            canvas.html().height = height;
            
            ctx.drawImage(CaPTIVE.ImageEditor.Scene.canvas.html(), 0,0, img.width , img.height,0,0,width, height);
            
            canvas.html().toBlob(function(blob) {
                        saveAs(blob, filename +".png");
                    }, "image/png");
            
            WinScene.Set.statusbarText("");
            
            img.Rotation = tempRot;
            img.Scale.x = tempScaleX;
            img.Scale.y = tempScaleY;
            img.Position.x = tempPosX;
            img.Position.y = tempPosY
            CaPTIVE.ImageEditor.Scene.canvas.html().width = defaultWidth;
            CaPTIVE.ImageEditor.Scene.canvas.html().height = defaultHeight;
            CaPTIVE.ImageEditor.Scene.ctx.restore();
            CaPTIVE.ImageEditor.Update();
            
        },
        SaveCanvas: function(filename){
            
            
            //Draw Canavs at With Viewport = 1, with no outlines
                
            //Clear the Scene

            //Save Draw States and Transforms
            CaPTIVE.ImageEditor.Scene.ctx.save();
            var defaultWidth = CaPTIVE.ImageEditor.Scene.canvas.html().width;
            var defaultHeight = CaPTIVE.ImageEditor.Scene.canvas.html().height;
            CaPTIVE.ImageEditor.Scene.canvas.html().width = CaPTIVE.ImageEditor.Scene.width;
            CaPTIVE.ImageEditor.Scene.canvas.html().height = CaPTIVE.ImageEditor.Scene.height;
            
            //Loop through scene entities and Draw Images
            for(var i = 0; i < CaPTIVE.ImageEditor.Scene.Entities.length; i++){
                CaPTIVE.ImageEditor.Scene.Entities[i].Draw(CaPTIVE.ImageEditor.Scene.ctx);
            }
            //Restore States and Transforms
            CaPTIVE.ImageEditor.Scene.ctx.restore();
             
            //Adjust Start and Stop of Crop Area
            var start ={}, stop = {};
            if(CaPTIVE.ImageEditor.EditControls.cropStart.x < CaPTIVE.ImageEditor.EditControls.cropStop.x){
                start.x = CaPTIVE.ImageEditor.EditControls.cropStart.x;
                stop.x = CaPTIVE.ImageEditor.EditControls.cropStop.x;
            }
            else{
                stop.x = CaPTIVE.ImageEditor.EditControls.cropStart.x;
                start.x = CaPTIVE.ImageEditor.EditControls.cropStop.x;   
            }
            
            if(CaPTIVE.ImageEditor.EditControls.cropStart.y < CaPTIVE.ImageEditor.EditControls.cropStop.y){
                start.y = CaPTIVE.ImageEditor.EditControls.cropStart.y;
                stop.y = CaPTIVE.ImageEditor.EditControls.cropStop.y;
            }
            else{
                stop.y = CaPTIVE.ImageEditor.EditControls.cropStart.y
                start.y = CaPTIVE.ImageEditor.EditControls.cropStop.y;
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
            ctx.drawImage(CaPTIVE.ImageEditor.Scene.canvas.html(), start.x, start.y, width, height,0,0,width, height);
            
            //Convert local canvas to PNG
            canvas.html().toBlob(function(blob) {
                        saveAs(blob, filename+".png");
                    }, "image/png");
            
            CaPTIVE.States.SImageEditor.Events.Editor.Mode= "";
            WinScene.Set.statusbarText("");
            CaPTIVE.ImageEditor.Scene.canvas.html().width = defaultWidth;
            CaPTIVE.ImageEditor.Scene.canvas.html().height = defaultHeight;
            
            CaPTIVE.ImageEditor.Update();
            
        },
        PlotPoint: function(x, y, ctx){
            ctx.strokeStyle = "yellow";
            ctx.strokeRect(x, y,  1, 1);
        },
        GetOffset: function( el ) {
            var _x = 0;
            var _y = 0;
            while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
                _x += el.offsetLeft - el.scrollLeft;
                _y += el.offsetTop - el.scrollTop;
                el = el.offsetParent;
            }
            return { top: _y, left: _x };
        },
        SetMode: {
            Select: function(){
                CaPTIVE.States.SImageEditor.Events.Editor.Mode = "SELECT";
                WinScene.Set.statusbarText("SELECT");
            },
            SaveCanvas: function(){
                CaPTIVE.States.SImageEditor.Events.Editor.Mode = "SAVE CANVAS";
                WinScene.Set.statusbarText("SAVE CANVAS");
            },
            Move: function(){
                CaPTIVE.States.SImageEditor.Events.Editor.Mode = "MOVE";
                WinScene.Set.statusbarText("MOVE");
            },
            Pan: function(){
                CaPTIVE.States.SImageEditor.Events.Editor.Mode = "PAN";
                WinScene.Set.statusbarText("PAN");
            },
            Crop: function(){
                CaPTIVE.States.SImageEditor.Events.Editor.Mode = "CROP";
                WinScene.Set.statusbarText("CROP");
            },
            Trace: function(){
                CaPTIVE.States.SImageEditor.Events.Editor.Mode = "TRACE";
                WinScene.Set.statusbarText("TRACE");
                var img = CaPTIVE.ImageEditor.GetSelectedImage();
                img.Trace.points.push([]);
            },
            StretchWidth: function(){
                CaPTIVE.States.SImageEditor.Events.Editor.Mode = "STRETCH WIDTH";
                WinScene.Set.statusbarText("STRETCH WIDTH");
            },
            StretchHeight: function(){
                CaPTIVE.States.SImageEditor.Events.Editor.Mode = "STRETCH HEIGHT";
                WinScene.Set.statusbarText("STRETCH HEIGHT");
            },
            StretchImage: function(){
                CaPTIVE.States.SImageEditor.Events.Editor.Mode = "STRETCH IMAGE";
                WinScene.Set.statusbarText("STRETCH IMAGE");
            },
            RotateWithMouse: function(){
                CaPTIVE.States.SImageEditor.Events.Editor.Mode = "ROTATE WITH MOUSE";
                WinScene.Set.statusbarText("ROTATE WITH MOUSE");
            },
            RotateCW: function(){
                CaPTIVE.ImageEditor.Scene.Entities[CaPTIVE.ImageEditor.Scene.Entities.length - 1].Rotation += (Math.PI / 2);
                CaPTIVE.ImageEditor.Update();
            },
            RotateCCW: function(){
                CaPTIVE.ImageEditor.Scene.Entities[CaPTIVE.ImageEditor.Scene.Entities.length - 1].Rotation -= (Math.PI / 2);
                CaPTIVE.ImageEditor.Update();
            },
            MirrorHorizontal: function(){
                CaPTIVE.ImageEditor.Scene.Entities[CaPTIVE.ImageEditor.Scene.Entities.length - 1].Scale.x *= -1;
                CaPTIVE.ImageEditor.Update();
            },
            MirrorVertical: function(){
                CaPTIVE.ImageEditor.Scene.Entities[CaPTIVE.ImageEditor.Scene.Entities.length - 1].Scale.y *= -1;
                CaPTIVE.ImageEditor.Update();
            },
            OpenFile: function(){
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent('click', false, true ); // event type,bubbling,cancelable
                document.getElementById('imageSelector').dispatchEvent(evt);
            },
            OpenLayer: function(){
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent('click', false, true ); // event type,bubbling,cancelable
                document.getElementById('layerSelector').dispatchEvent(evt);
            },
            ZoomIn: function(){
                CaPTIVE.ImageEditor.Viewport.scaleHeight += 0.1;
                if(CaPTIVE.ImageEditor.Viewport.scaleHeight <= 1){ CaPTIVE.ImageEditor.Viewport.scaleHeight = 1};
                
                CaPTIVE.ImageEditor.Viewport.scaleWidth = CaPTIVE.ImageEditor.Viewport.scaleHeight;// * CaPTIVE.ImageEditor.Scene.width / CaPTIVE.ImageEditor.Scene.height;
                
                CaPTIVE.ImageEditor.Update();
            },
            ZoomOut: function(){
                CaPTIVE.ImageEditor.Viewport.scaleHeight -= 0.1;
                if(CaPTIVE.ImageEditor.Viewport.scaleHeight <= 1){ CaPTIVE.ImageEditor.Viewport.scaleHeight = 1};
                
                CaPTIVE.ImageEditor.Viewport.scaleWidth = CaPTIVE.ImageEditor.Viewport.scaleHeight;// * CaPTIVE.ImageEditor.Scene.width / CaPTIVE.ImageEditor.Scene.height;
                
                CaPTIVE.ImageEditor.Update();
            }
        },
        BuildCancers: function(){
            var traces = [];
            
            //Loop through all images and save traces
            var numOfImages = CaPTIVE.ImageEditor.Scene.Entities.length;
            for(var i = numOfImages - 1; i >= 0; i--){
                var img = CaPTIVE.ImageEditor.Scene.Entities[i];
                
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
                        var point = CaPTIVE.ImageEditor.IntersectionWithEdge(outerEdge, Outlines[i].Points[j]);
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
            CaPTIVE.ImageEditor.Viewport.Position.x = 0;
            CaPTIVE.ImageEditor.Viewport.Position.y = 0;
            CaPTIVE.ImageEditor.Viewport.scaleHeight = 1;
            CaPTIVE.ImageEditor.Viewport.scaleWidth = 1;
            CaPTIVE.ImageEditor.Update();
        }
    }
}
//Layer Object
var CLayer = function(id, start, stop){
    this.id = id;
    this.img = null;
    this.outlines = [];
    this.json = [];
    this.start = start;
    this.stop = stop;
    this.cancer = null;
}

//Image
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

//  Finite State Machine
var CFiniteStateMachine = function(cEntity){
    var owner = cEntity;
    var _CurrentState = new CState();
    var self = this;
    var nextName = "";
    var nextMessage = "";
    var _Enter = function(oMessage){
        _CurrentState.Enter(owner, oMessage);
    }
    
    var _Exit = function(oMessage){
        _CurrentState.Exit(owner, oMessage);
    }
    
    var _Execute = function(oMessage){
        _CurrentState.Execute(owner, oMessage);
    }
    
    //Control Methods
    this.AnimatedTransition = function(sName, oMessage){
        nextName = sName;
        nextMessage = oMessage;
        CaPTIVE.app.className = "app flyOut";
        CaPTIVE.app.addEventListener('webkitTransitionEnd', CaPTIVE.FSM.Animate, false);
    }
    
    this.Animate = function(sName, oMessage){
        //Remove Event Listener
        CaPTIVE.app.removeEventListener('webkitTransitionEnd', CaPTIVE.FSM.Animate, false);
        
        //Hide Current State Div
        CaPTIVE.States[CaPTIVE.FSM.GetState()].html.className = "hide";
        
        //Call Exit for Current State
        _Exit(nextMessage);
        
        //Set Next State Visible
        CaPTIVE.States[nextName].html.className = "";
        
        //Get New State to Transition Too
        _CurrentState = CaPTIVE.States[nextName];
        
        //Transition
        CaPTIVE.app.className = "app flyIn";
        
        //Call New States Setup and Exectue Methods
        _Enter(nextMessage);
        _Execute(nextMessage);
    }
    
    this.Transition = function(sName, oMessage){
        //Call Exit for Current State
        _Exit(oMessage);
        
        //Hide Current State Div
        CaPTIVE.States[CaPTIVE.FSM.GetState()].html.className = "hide";
        
        //Get New State to Transition Too
        _CurrentState = CaPTIVE.States[sName];
        
        //Set Next State Visible
        CaPTIVE.States[sName].html.className = "";
        
        //Call New States Setup and Exectue Methods
        _Enter(oMessage);
        _Execute(oMessage);
    }
    this.SetState = function(sName){
        _CurrentState = CaPTIVE.States[sName];
        CaPTIVE.States[sName].html.className = "";
    }
    this.Update = function(oMessage){
        _Execute(oMessage);
    }
    this.GetState = function(){
        return _CurrentState.GetName();
    }
}

// States for FSM
var CState = function(sName){
    var _name = sName;
    var self = this;
    
    this.Enter = function(cEntity, oMessage){
        //Override this Method
    }
    
    this.Exit = function(cEntity, oMessage){
        //Override this Method
    }
    
    this.Execute = function(cEntity, oMessage){
        //Override this Method
    }
    
    this.GetName = function(){
        return _name;
    }

}

        
CaPTIVE.Menu = (function(){

    var CMenu = function(oTopLevelHTML){
        var self = this;
        self.id = oTopLevelHTML.id;
        self.selector = oTopLevelHTML;
        self.selector.addEventListener('click', Menu.SetActiveEvent, false);
        self.Menu = document.getElementById(self.id + "-gtlMenu");
        self.Options = (document.getElementById(self.id + "-gtlMenu-options")).getElementsByTagName('a');
        self.Contents = self.Menu.getElementsByClassName("gtlMenuSelectedContent");
        
        self.height = self.Menu.scrollHeight;
        self.currentSelection = -1;
        self.SetActiveOption(0);
        self.Select = function(e){
            var id = e.currentTarget.id.substring(e.currentTarget.id.lastIndexOf("-") + 1);
            self.SetActiveOption(id)
        }
        
        for(var i = 0; i < self.Options.length; i++){
            self.Options[i].addEventListener('click', self.Select, false);
        }
        
    }
    CMenu.prototype.Expand = function(){
        this.Menu.className = "gtlMenuSecondLevel";
        this.Menu.style.height = this.height + "px";
        this.selector.parentElement.style.backgroundColor = "#EEEEEE";
        this.selector.parentElement.style.borderTopLeftRadius = "10px";
        this.selector.parentElement.style.borderBottomRightRadius = "10px";
        this.selector.style.color = "#161616";
    }
    CMenu.prototype.Collapse = function(){
        this.Menu.className = "gtlMenuSecondLevel collapse";
        this.Menu.style.height = "0px";
        this.selector.parentElement.style.backgroundColor = "";
        this.selector.parentElement.style.borderTopLeftRadius = "";
        this.selector.parentElement.style.borderBottomRightRadius = "";
        this.selector.style.color = "";
    }
    CMenu.prototype.SetActiveOption = function(index){
        //Release Current Selection
        if(this.currentSelection >= 0){
            //Clear li
            this.Options[this.currentSelection].parentElement.className = "";
            this.Options[this.currentSelection].style.color = "";
            
            //Clear Content
            this.Contents[this.currentSelection].style.display = "none";
        }
        
        //Clear li
        this.Options[index].parentElement.className = "gtlMenuSelected";
        this.Options[index].style.color = "#161616";
        
        //Clear Content
        this.Contents[index].style.display = "block";
        
        this.currentSelection = index;
    }
    
    var Menu = {
        HTML: {
            Main: null,
            Toggle: {
                a: null,
                img: null
            },
            TopLevel: {
                html: null,
                anchors: []
            }
        },
        Load: function(){
            //Connect to Menu HTML Object
            Menu.HTML.Main = document.getElementById("gtlMenu");
            
            //Connect to HTML arrow for collapse/expand of menu
            Menu.HTML.Toggle.a = document.getElementById("gtlMenu-toggle");
            Menu.HTML.Toggle.img = Menu.HTML.Toggle.a.childNodes[0];
            
            Menu.HTML.Toggle.a.addEventListener('click', Menu.Toggle, false);
            
            //Connect to Main Menu
            Menu.HTML.TopLevel.html = document.getElementById("gtlMenuTopLevel");
            Menu.HTML.TopLevel.anchors = Menu.HTML.TopLevel.html.getElementsByTagName('a');
            
            //Build Menu object for each element of Main Menu
            for(var i = 0; i < Menu.HTML.TopLevel.anchors.length; i++){
                Menu[Menu.HTML.TopLevel.anchors[i].id] = new CMenu( Menu.HTML.TopLevel.anchors[i]);
            }
            
        },
        Toggle: function(e){
            
            if(Menu.visible){
                //Collapse Active gtlMenu
                if(Menu.Current != ""){
                    Menu[Menu.Current].Collapse();
                }
                
                Menu.HTML.Main.style.bottom = "-37px";
                Menu.HTML.Toggle.img.src = "images/arrow_top.png";
                Menu.visible = false;
            }
            else{
                Menu.HTML.Main.style.bottom = "0px";
                 Menu.HTML.Toggle.img.src = "images/arrow_bottom.png";
                Menu.visible = true;
            }
        },
        visible: true,
        SetActive: function(sMenu){
            //Clear Current
            if(Menu.Current != ""){
                Menu[Menu.Current].Collapse();
            }
            
            //If already selected, Collapse gtlMenu
            if(Menu.Current == sMenu){
                Menu[sMenu].Collapse();
                Menu.Current = "";
            }
            else{//Otherwise Expand
                Menu[sMenu].Expand();
                
                Menu.Current = sMenu;
            }
        },
        SetActiveEvent: function(e){
            //Clear Current
            if(Menu.Current != ""){
                Menu[Menu.Current].Collapse();
            }
            
            //If already selected, Collapse gtlMenu
            if(Menu.Current == e.currentTarget.id){
                Menu[e.currentTarget.id].Collapse();
                Menu.Current = "";
            }
            else{//Otherwise Expand
                Menu[e.currentTarget.id].Expand();
                
                Menu.Current = e.currentTarget.id;
            }
            
            
        },
        Current: ""
        
    }
    
    return Menu;
})();

flyIn = function(){
    document.getElementById("app").className = "app flyIn";
}
flyOut = function(){
    document.getElementById("app").className = "app flyOut";
}