importScripts("../../scripts/jahova/OS/Cores/Graphics/glMatrix.js", "workerUtils.js");


self.addEventListener('message', function(e) {
    var msg = e.data;
    var result = {msg: "ERROR", data: "Error, Unknown Message"};
    
    if(msg.type == "OBJ"){
        var result = BuildJSON(ParseOBJ(msg.data, true));
    }
    else if(msg.type == "Align"){
        var result = AlignJSON(msg.data);
    }
    else if(msg.type == "Cancer"){
        var layers = GenerateCancer(msg.data);
        result = {meshes: msg.data.meshes,
                  layers: layers};
    }
    
    self.postMessage(result);
    
}, false);


GenerateCancer = function(data){
    var meshes = data.meshes;
    var layers = data.layers;
    
    dimensions = data.dimensions;
    
    //dimensions.top = 0.45;
    //dimensions.bottom = 0.55;
    
    Min = {
        x: 0,
        y: 0,
        z: 0
    }
    Max = {
        x: 0,
        y: 0,
        z: 0
    }
    
    //  Loop Through Mesh to Find Extents
    for(var i = 0; i < meshes.length; i++){
        for(var j = 0; j < meshes[i].vertexPositions.length; j+=3){
            Min.x = Min.x < meshes[i].vertexPositions[j + 0] ? Min.x : meshes[i].vertexPositions[j + 0];
            Min.y = Min.y < meshes[i].vertexPositions[j + 1] ? Min.y : meshes[i].vertexPositions[j + 1];
            Min.z = Min.z < meshes[i].vertexPositions[j + 2] ? Min.z : meshes[i].vertexPositions[j + 2];
            
            Max.x = Max.x > meshes[i].vertexPositions[j + 0] ? Max.x : meshes[i].vertexPositions[j + 0];
            Max.y = Max.y > meshes[i].vertexPositions[j + 1] ? Max.y : meshes[i].vertexPositions[j + 1];
            Max.z = Max.z > meshes[i].vertexPositions[j + 2] ? Max.z : meshes[i].vertexPositions[j + 2];
        }
    }
    
    //  Create Conversion Rate
    mmToMesh = (Max.y - Min.y) / dimensions.height;
    
    //  Calculate Bounding Volumes
    for(var i = 0; i < layers.length; i++){
        if(layers[i].outlines.length > 0){
            layers[i].BVs = []
            Cancer.Calculate.BVs(layers[i].outlines, layers[i].BVs);
        }
        
    }
    
    //Find Excision Border
    for(var i = 0; i < layers.length; i++){
        if(layers[i].outlines.length > 0){
            Cancer.Calculate.Border(layers[i]);
        }
        
    }

    //  Build Cancer Array
    for(var i = 0; i < layers.length; i++){
        if(layers[i].outlines.length > 0){
            layers[i].cancers = [];
            
            for(var j = 0; j < layers[i].outlines.length; j++){
                if(j != layers[i].borderID){
                    layers[i].cancers.push(layers[i].outlines[j]);
                }
            }
        }
    }

    

    //  Calculate Offsets
    for(var i = 0; i < layers.length; i++){
        if(layers[i].outlines.length > 0){
            Cancer.Calculate.Offsets(layers[i]);
        }
        
    }


    //  Calculate Mesh Intersections
    for(var i = 0; i < layers.length; i++){
        if(layers[i].outlines.length > 0){
            Cancer.Calculate.MeshIntersectionVolumetric(meshes, layers[i]);
        }
        
    }
        
    
    //  Calcualte Cancer Boundary
    for(var i = 0; i < layers.length; i++){
        if(layers[i].outlines.length > 0){
            Cancer.Calculate.CancerVolumetricBoundary(layers[i]);
        }
        
    }
    

    //  Calcualte Triangles
    for(var i = 0; i < layers.length; i++){
        if(layers[i].outlines.length > 0){
            Cancer.Calculate.TrianglesVolumetric(layers[i]);
        }
        
    }

    //  Calcualte OBJs
    for(var i = 0; i < layers.length; i++){
        if(layers[i].outlines.length > 0){
            Cancer.Calculate.VolumetricOBJ(layers[i]);
        }
        
    }
    

    //  Calcualte JSONs
    for(var i = 0; i < layers.length; i++){
        if(layers[i].outlines.length > 0){ 
            Cancer.Calculate.VolumetricJSON(layers[i]);
        }
        
    }
    
    //Return Updated Layers
    return layers;
};
Cancer = {};
Cancer.Calculate = {
    
    JSON: function(layer){
        for(var i = 0; i < layer.outlines.length; i++){
            if(i != layer.borderID && layer.Intersection[i].Mesh.length > 0){
                out = BuildJSON(ParseOBJ(layer.obj[i],false));
                out.id = i;
                layer.json.push(out);
            }
        }
    },
    VolumetricJSON: function(layer){
        layer.json = [];
        
        for(var i = 0; i < layer.outlines.length; i++){
            var top;
            var bot;
            var mid;
            var out = [];
            
            if(i != layer.borderID && layer.Intersection[i].Mesh.Top.length > 0){
                top = BuildJSON(ParseOBJ(layer.obj.top[i],false));
                top.id = i;
                
                for(var j = 0; j < top.length; j++){
                    out.push(top[j]);
                }
            }
            if(i != layer.borderID && layer.Intersection[i].Mesh.Bot.length > 0){
                bot = BuildJSON(ParseOBJ(layer.obj.bot[i],false));
                bot.id = i;
                
                for(var j = 0; j < bot.length; j++){
                    out.push(bot[j]);
                }
            }
            
            if(i != layer.borderID && (layer.Intersection[i].Mesh.Bot.length > 0) && (layer.Intersection[i].Mesh.Top.length > 0)){
                mid = BuildJSON(ParseOBJ(layer.obj.mid[i],false));
                mid.id = i;
                
                for(var j = 0; j < mid.length; j++){
                    out.push(mid[j]);
                }
            }
            
            layer.json.push(out);
        }
    },
    VolumetricOBJ: function(layer){
        layer.obj = {top: [], bot: [], mid: []}
        
        for(var k = 0; k < layer.outlines.length; k++){
            
            if(k != layer.borderID){
                
                var objVerts = [];
                var verts2Perimeter = new CMap();
                    
                var vertsPerSide = 0;
                var totTopVerts = 0;
                
                var top = [];
                var bot = [];
                    
                if(layer.Models[k].top.index.length > 0){
                    
                    var file = "#Created By GameTheoryLabs\n";
                    var map = new CMap();
                    var lookup = new CMap();
                    var verts = [];
                    
                    //Create Map to hold verts
                    for(var m = 0; m < layer.Models[k].top.index.length; m++){
                        //Does the vert already exist?
                        if(undefined == lookup.get(layer.Models[k].top.index[m])){
                            //map.put(layer.Models[k].top.index[m], layer.Models[k].top.verts[m]);
                            lookup.put(layer.Models[k].top.index[m], verts.length);
                            verts.push(layer.Models[k].top.verts[m]);
                            
                            //for(var i = 0; i < layer.Perimeter.Top[k].length; i++){
                            //    var perimeter = layer.Perimeter.Top[k][i];
                            //    var v = layer.Models[k].top.verts[m];
                            //    if((perimeter[0] == v[0]) && (perimeter[1] == v[1])){
                            //        verts2Perimeter.put(i + 1, verts.length);
                            //    }
                            //}
                        }
                        //map.put(layer.Models[k].top.index[m], layer.Models[k].top.verts[m]);
                    }
                    totTopVerts = lookup.size;
                    vertsPerSide = lookup.size;
                    
                    //Ouptut verts to file
                    
                    for(var i = 0; i < verts.length; i++){
                        var vert = verts[i];
                        
                        //Output to OBJ File
                        try{
                            if(vert){
                                file += "v " + vert[0] + " " + layer.Models[k].top.height + " " + vert[1] + "\n";
                                objVerts.push("v " + vert[0] + " " + layer.Models[k].top.height + " " + vert[1] + "\n");
                            }
                        }
                        catch(e){
                            //console.error(e);
                        }
                        
                    }
                    
                    //for(var i = 0; i < map.size; i++){
                    //    var vert = map.get(i+1);
                    //    
                    //    //Output to OBJ File
                    //    try{
                    //        if(vert){
                    //            file += "v " + vert[0] + " " + layer.Models[k].top.height + " " + vert[1] + "\n";
                    //            objVerts.push("v " + vert[0] + " " + layer.Models[k].top.height + " " + vert[1] + "\n");
                    //        }
                    //    }
                    //    catch(e){
                    //        console.error(e);
                    //    }
                    //    
                    //}
                    
                    
                    var numOfPolys = layer.Models[k].top.index.length/3;
                    
                    for(var j = 0; j < numOfPolys; j++){
                        file += "f " + (lookup.get(layer.Models[k].top.index[j*3 + 0]) + 1) + " " + (lookup.get(layer.Models[k].top.index[j*3 + 1]) + 1) + "  " + (lookup.get(layer.Models[k].top.index[j*3 + 2]) + 1) + "\n";
                    }
                    layer.Models[k].top.obj = file;
                    layer.obj.top[k] = file;
                    top = verts;
                }
                
                if(layer.Models[k].bot.index.length > 0){
                    
                    var file = "#Created By GameTheoryLabs\n";
                    var map = new CMap();
                    var lookup = new CMap();
                    var verts = [];
                    
                    //Create Map to hold verts
                    for(var m = 0; m < layer.Models[k].bot.index.length; m++){
                        
                        //Does the vert already exist?
                        if(undefined == lookup.get(layer.Models[k].bot.index[m])){
                            //map.put(layer.Models[k].top.index[m], layer.Models[k].top.verts[m]);
                            lookup.put(layer.Models[k].bot.index[m], verts.length);
                            verts.push(layer.Models[k].bot.verts[m]);
                            
                            //for(var i = 0; i < layer.Perimeter.Bot[k].length; i++){
                            //    var perimeter = layer.Perimeter.Bot[k][i];
                            //    var v = layer.Models[k].bot.verts[m];
                            //    if(perimeter[0] == v[0] && perimeter[1] == v[1]){
                            //        verts2Perimeter.put(totTopVerts + (i + 1), totTopVerts + verts.length);
                            //    }
                            //}
                        }
                        
                        //map.put(layer.Models[k].bot.index[m], layer.Models[k].bot.verts[m]);
                    }
                    
                    vertsPerSide = (vertsPerSide < 1) ? lookup.size : vertsPerSide;
                    
                     //Ouptut verts to file
                    for(var i = 0; i < verts.length; i++){
                        var vert = verts[i];
                        
                        //Output to OBJ File
                        try{
                            if(vert){
                                file += "v " + vert[0] + " " + layer.Models[k].bot.height + " " + vert[1] + "\n";
                                objVerts.push("v " + vert[0] + " " + layer.Models[k].bot.height + " " + vert[1] + "\n");
                            }
                        }
                        catch(e){
                            //console.error(e);
                        }
                        
                    }
                    
                    ////Ouptut verts to file
                    //for(var i = 0; i < map.size; i++){
                    //    var vert = map.get(i+1);
                    //    
                    //    //Output to OBJ File
                    //    try{
                    //        if(vert){
                    //            file += "v " + vert[0] + " " + layer.Models[k].bot.height + " " + vert[1] + "\n";
                    //            objVerts.push("v " + vert[0] + " " + layer.Models[k].bot.height + " " + vert[1] + "\n");
                    //        }
                    //    }
                    //    catch(e){
                    //        console.error(e);
                    //    }
                    //    
                    //}
                    
                    
                    var numOfPolys = layer.Models[k].bot.index.length/3;
                    
                    for(var j = 0; j < numOfPolys; j++){
                        file += "f " + (lookup.get(layer.Models[k].bot.index[j*3 + 0]) + 1) + " " + (lookup.get(layer.Models[k].bot.index[j*3 + 1]) + 1) + "  " + (lookup.get(layer.Models[k].bot.index[j*3 + 2]) + 1) + "\n";
                    }
                    layer.Models[k].bot.obj = file;
                    layer.obj.bot[k] = file;
                    bot = verts;
                }
                if((layer.Models[k].top.index.length > 0) && (layer.Models[k].bot.index.length > 0) ){
                    
                    var file = "#Created By GameTheoryLabs\n";
                    var topPerimeter = [];
                    var botPerimeter = [];
                    
                    for(var i = 0; i < layer.Perimeter.Top[k].length; i++){
                        
                        var vert = layer.Perimeter.Top[k][i];
                        
                        for(var j = 0; j < top.length; j++){
                            var val = top[j];
                            
                            if(vert[0] == val[0]  && vert[1] == val[1]){
                                topPerimeter.push(vert);
                                file += "v " + vert[0] + " " + layer.Models[k].top.height + " " + vert[1] + "\n";
                                break;
                            }
                        }
                    }
                    
                    for(var i = 0; i < layer.Perimeter.Bot[k].length; i++){
                        
                        var vert = layer.Perimeter.Bot[k][i];
                        
                        for(var j = 0; j < bot.length; j++){
                            var val = bot[j];
                            
                            if(vert[0] == val[0]  && vert[1] == val[1]){
                                topPerimeter.push(vert);
                                file += "v " + vert[0] + " " + layer.Models[k].bot.height + " " + vert[1] + "\n";
                                break;
                            }
                        }
                    }
                    
                    ////Push top verts to file
                    //for(var i = 0; i < layer.Perimeter.Top[k].length; i++){
                    //    var vert = layer.Perimeter.Top[k][i];
                    //    
                    //    //Output to OBJ File
                    //    try{
                    //        if(vert){
                    //            file += "v " + vert[0] + " " + layer.Models[k].top.height + " " + vert[1] + "\n";
                    //        }
                    //    }
                    //    catch(e){
                    //        console.error(e);
                    //    }
                    //    
                    //}
                    ////Push bot verts to file
                    //for(var i = 0; i < layer.Perimeter.Bot[k].length; i++){
                    //    var vert = layer.Perimeter.Bot[k][i];
                    //    
                    //    //Output to OBJ File
                    //    try{
                    //        if(vert){
                    //            file += "v " + vert[0] + " " + layer.Models[k].bot.height + " " + vert[1] + "\n";
                    //        }
                    //    }
                    //    catch(e){
                    //        console.error(e);
                    //    }
                    //    
                    //}
                    
                    totTopVerts = top.length;//layer.Perimeter.Top[k].length;
                    var numOfPolys = (vertsPerSide * 2) - 2;
                    
                    for(var j = 1; j < vertsPerSide; j++){
                        
                        //Bottom Tris
                        // tri: b[i], b[i+1], t[i+1]
                        file += "f " + ((totTopVerts + j)) + " " + ((totTopVerts + j + 1)) + " " + (j + 1) + "\n";
                        
                        //Top tris
                        // tri: b[i], t[i+1], t[i]
                        file += "f " + ((totTopVerts + j)) + " " + (j + 1) + " " + (j) + "\n";
                    }
                        //Final Bottom
                        file += "f " + (totTopVerts * 2) + " " + ((totTopVerts + 1)) + " " + (1) + "\n";
                        
                        //Final Top
                        file += "f " + (totTopVerts * 2) + " " + (1) + " " + (totTopVerts) + "\n";
                        
                     
                    //for(var j = 1; j < vertsPerSide; j++){
                    //    
                    //    //Bottom Tris
                    //    // tri: b[i], b[i+1], t[i+1]
                    //    file += "f " + (vertsPerSide + j) + " " + (vertsPerSide + j + 1) + " " + (j + 1) + "\n";
                    //    
                    //    //Top tris
                    //    // tri: b[i], t[i+1], t[i]
                    //    file += "f " + (vertsPerSide + j) + " " + (j + 1) + " " + (j) + "\n";
                    //}
                    //    //Final Bottom
                    //    file += "f " + (vertsPerSide * 2) + " " + (vertsPerSide + 1) + " " + (1) + "\n";
                    //    
                    //    //Final Top
                    //    file += "f " + (vertsPerSide * 2) + " " + (1) + " " + (vertsPerSide) + "\n";
                    
                    layer.Models[k].mid.obj = file;
                    layer.obj.mid[k] = file;
                    
                    
                }
            }
        }
    },
    OBJ: function(layer){
        layer.obj = []
        for(var k = 0; k < layer.outlines.length; k++){
            if(k != layer.borderID){
                if(layer.Models[k].index.length > 0){
                    
                    var file = "#Created By GameTheoryLabs\n";
                    var map = new CMap();
                    
                    //Create Map to hold verts
                    for(var m = 0; m < layer.Models[k].index.length; m++){
                        map.put(layer.Models[k].index[m], layer.Models[k].verts[m]);
                    }
                    
                    //Ouptut verts to file
                    for(var i = 0; i < map.size; i++){
                        var vert = map.get(i+1);
                        
                        //Output to OBJ File
                        try{
                            if(vert){
                                file += "v " + vert[0] + " " + layer.Models[k].height + " " + vert[1] + "\n";
                            }
                        }
                        catch(e){
                            //console.error(e);
                        }
                        
                    }
                    
                    
                    var numOfPolys = layer.Models[k].index.length/3;
                    
                    for(var j = 0; j < numOfPolys; j++){
                        file += "f " + layer.Models[k].index[j*3 + 0] + " " + layer.Models[k].index[j*3 + 1] + "  " + layer.Models[k].index[j*3 + 2] + "\n";
                    }
                    layer.Models[k].obj = file;
                    layer.obj[k] = file;
                }
            }
        }
    },
    TrianglesVolumetric: function(layer){
        layer.Models = [];
        
        for(var i = 0; i < layer.outlines.length; i++){
            
            if(i != layer.borderID){
                var model = {};
                model.top = {
                    verts: [],
                    index: [],
                    margins: [],
                    height: 1 * ((( ((layer.stop - layer.start) * dimensions.top) + layer.start ) -  dimensions.height/2) * mmToMesh)
                }
                model.bot  = {
                    verts: [],
                    index: [],
                    margins:[],
                    height: 1 * ((( ((layer.stop - layer.start) * dimensions.bottom) + layer.start ) -  dimensions.height/2) * mmToMesh)
                }
                
                model.mid  = {
                    verts: [],
                    index: [],
                    margins: [],
                    height: 0
                }
                
                Triangulate.Process(layer.Perimeter.Top[i], model.top.verts, model.top.index);
                Triangulate.Process(layer.Perimeter.Bot[i], model.bot.verts, model.bot.index);
                                
                layer.Models[i] = model;
            }
        }  
    },
    Triangles: function(layer){
        layer.Models = [];
        for(var i = 0; i < layer.outlines.length; i++){
            
            if(i != layer.borderID){
                var model = {
                    verts: [],
                    index: [],
                    height: ((( ((layer.stop - layer.start)/2) + layer.start ) -  dimensions.height/2) * mmToMesh)
                    //Min.y + (layer.start * mmToMesh)
                }
                
                Triangulate.Process(layer.Perimeter[i], model.verts, model.index);
                                
                layer.Models[i] = model;
            }
        }
        

    },
    CancerVolumetricBoundary: function(layer){
        layer.Perimeter = {Top: [], Bot: []};
        
        for(var j = 0; j < layer.outlines.length; j++){
            if(j != layer.borderID){
                var cancer = layer.outlines[j];
                
                layer.Perimeter.Top[j] = [];
                layer.Perimeter.Bot[j] = [];
                
                var pointTop = [];
                var pointBot = [];
                
                var center = {
                    x: layer.BVs[j].Cx,
                    y: layer.BVs[j].Cy
                };
                
                for(var i = 0; i < cancer.length; i++){
                    if(layer.Intersection[j].Mesh.Top[i]){
                        layer.Perimeter.Top[j].push([layer.Intersection[j].Mesh.Top[i][0] * (layer.Offsets[j].percentage[i]), layer.Intersection[j].Mesh.Top[i][2] * (layer.Offsets[j].percentage[i]) ]);
                        
                    }
                    
                    if(layer.Intersection[j].Mesh.Bot[i]){
                        layer.Perimeter.Bot[j].push([layer.Intersection[j].Mesh.Bot[i][0] * (layer.Offsets[j].percentage[i]), layer.Intersection[j].Mesh.Bot[i][2] * (layer.Offsets[j].percentage[i] )]);
                        
                    }
                    
                }
            }
        }
    },
    CancerBoundary: function(layer){
        layer.Perimeter = [];
        
        for(var j = 0; j < layer.outlines.length; j++){
            if(j != layer.borderID){
                var cancer = layer.outlines[j];
                layer.Perimeter[j] = [];
                var point = [];
                var center = {
                    x: layer.BVs[j].Cx,
                    y: layer.BVs[j].Cy
                };
                
                for(var i = 0; i < cancer.length; i++){
                    if(layer.Intersection[j].Mesh[i]){
                        layer.Perimeter[j].push([layer.Intersection[j].Mesh[i][0] * layer.Offsets[j].percentage[i], layer.Intersection[j].Mesh[i][2] * layer.Offsets[j].percentage[i]]);
                        
                    }
                    
                }
            }
        }
        
    },
    MeshIntersectionVolumetric:function(mesh, layer){
        var transform = {top: [], bot:[]};

        var revTrans = {top: [], bot:[]};
        
        var center = [layer.BVs[layer.borderID].Cx,layer.BVs[layer.borderID].Cy, 0];
        
        for(var k = 0; k < layer.outlines.length; k++){
            
            if(k != layer.borderID){
                
                var cancer = layer.outlines[k];
                layer.Intersection[k].Mesh = {Top: [], Bot: []};
                layer.Intersection[k].Margin = {Top: [], Bot: []};
                
                var ray = null;
                var tri = null;
                var pointTop = null;
                var pointBot = null;
                
                heightTop = ((( ((layer.stop - layer.start) * dimensions.top) + layer.start ) -  dimensions.height/2) * mmToMesh);
                heightBottom = ((( ((layer.stop - layer.start) * dimensions.bottom) + layer.start ) -  dimensions.height/2) * mmToMesh);
                
                mat4.identity(transform.top);
                mat4.identity(transform.bot);

                //Translate Triangle Back To Position - Height
                //mat4.translate(transform, [0,0,(((layer.stop - layer.start)/2) * mmToMesh) + Min.y], transform);
                mat4.translate(transform.top, [0,0,heightTop], transform.top);
                mat4.translate(transform.bot, [0,0,heightBottom], transform.bot);
                
                //Rotate Triangle By 90 on X Axis
                mat4.rotateX(transform.top, Math.PI/-2, transform.top);
                mat4.rotateX(transform.bot, Math.PI/-2, transform.bot);
                
                mat4.identity(revTrans.top);
                mat4.identity(revTrans.bot);
                                
                //Rotate Triangle By -90 on X Axis
                mat4.rotateX(revTrans.top, Math.PI/2, revTrans.top);
                mat4.rotateX(revTrans.bot, Math.PI/2, revTrans.bot);
                
                //Translate point By Height - Position
                //mat4.translate(revTrans, [0,0, -1 * ((((layer.stop - layer.start)/2) * mmToMesh) + Min.y) ], revTrans);
                mat4.translate(revTrans.top, [0,0, -1 * heightTop ], revTrans.top);
                mat4.translate(revTrans.bot, [0,0, -1 * heightBottom ], revTrans.bot);
                
                            
                //Loop through each ray
                for(var i = 0; i < cancer.length; i++){
                    ray = new CRay(0,0, cancer[i].x - center[0], cancer[i].y - center[1]);
                    var tIntersection = [];
                    var bInterscetion = [];
                    
                    var topIntersection = false;
                    var botIntersection = false;
                    for(var m = 0; m < mesh.length; m++){
                        
                        var msh = mesh[m];
                        
                        
                        //Loop through each tri in mesh
                        for(var j = 0; j < msh.indices.length; j += 3){
                            
                            //Intersection Test on Top
                            if(!topIntersection){
                                var v0 = [msh.vertexPositions[msh.indices[j + 0] * 3],msh.vertexPositions[(msh.indices[j + 0] * 3) + 1], msh.vertexPositions[(msh.indices[j + 0] * 3) + 2] ];
                                var v1 = [msh.vertexPositions[msh.indices[j + 1] * 3],msh.vertexPositions[(msh.indices[j + 1] * 3) + 1], msh.vertexPositions[(msh.indices[j + 1] * 3) + 2] ];
                                var v2 = [msh.vertexPositions[msh.indices[j + 2] * 3],msh.vertexPositions[(msh.indices[j + 2] * 3) + 1], msh.vertexPositions[(msh.indices[j + 2] * 3) + 2] ];
                                
                                //Create New Triangle
                                var t0 = [], t1 = [], t2= [];
                                mat4.multiplyVec3(transform.top, v0, v0);
                                mat4.multiplyVec3(transform.top, v1, v1);
                                mat4.multiplyVec3(transform.top, v2, v2);
                                var t = new CTriangle(v0,v1,v2);
                                
                                pointTop = Cancer.Calculate.RayTriangleCollision(ray, t);
                                
                                if(pointTop != null){
                                    //Move Point back to Original Position
                                    mat4.multiplyVec3(revTrans.top, pointTop, pointTop);
                                    
                                    tIntersection.push(pointTop);
                                    layer.Intersection[k].Mesh.Top.push(pointTop);
                                    
                                    //Calculate distance between pointTop and vertexPosition
                                    
                                    var margin = vec3.length(pointTop) * (1 - layer.Offsets[k].percentage[layer.Intersection[k].Mesh.Top.length - 1]);
                                    
                                    //Acounts for margins caused from outside of mesh (i.e. cancer penetrates mesh boundary)
                                    margin = margin < 0 ? 0.01 : margin;
                                    
                                    layer.Intersection[k].Margin.Top.push(margin);
                                    
                                    msh.vertexMargins[msh.indices[j + 0]] = ((msh.vertexMargins[msh.indices[j + 0]] > 0)  &&  (msh.vertexMargins[msh.indices[j + 0]] > margin)) || (msh.vertexMargins[msh.indices[j + 0]] < 0)  ? margin : msh.vertexMargins[msh.indices[j + 0]];
                                    msh.vertexMargins[msh.indices[j + 1]] = ((msh.vertexMargins[msh.indices[j + 1]] > 0)  &&  (msh.vertexMargins[msh.indices[j + 1]] > margin)) || (msh.vertexMargins[msh.indices[j + 1]] < 0)  ? margin : msh.vertexMargins[msh.indices[j + 1]];
                                    msh.vertexMargins[msh.indices[j + 2]] = ((msh.vertexMargins[msh.indices[j + 2]] > 0)  &&  (msh.vertexMargins[msh.indices[j + 2]] > margin)) || (msh.vertexMargins[msh.indices[j + 2]] < 0)  ? margin : msh.vertexMargins[msh.indices[j + 2]];
                                    
                                    topIntersection = true;
                                }
                            }
                            
                            //Intersection Test on Bottom
                            if(!botIntersection){
                                var v0 = [msh.vertexPositions[msh.indices[j + 0] * 3],msh.vertexPositions[(msh.indices[j + 0] * 3) + 1], msh.vertexPositions[(msh.indices[j + 0] * 3) + 2] ];
                                var v1 = [msh.vertexPositions[msh.indices[j + 1] * 3],msh.vertexPositions[(msh.indices[j + 1] * 3) + 1], msh.vertexPositions[(msh.indices[j + 1] * 3) + 2] ];
                                var v2 = [msh.vertexPositions[msh.indices[j + 2] * 3],msh.vertexPositions[(msh.indices[j + 2] * 3) + 1], msh.vertexPositions[(msh.indices[j + 2] * 3) + 2] ];
                            
                                //Create New Triangle
                                var t0 = [], t1 = [], t2= [];
                                mat4.multiplyVec3(transform.bot, v0, v0);
                                mat4.multiplyVec3(transform.bot, v1, v1);
                                mat4.multiplyVec3(transform.bot, v2, v2);
                                
                                var t = new CTriangle(v0,v1,v2);
                            
                                pointBot = Cancer.Calculate.RayTriangleCollision(ray, t);
                                if(pointBot != null){
                                    //Move Point back to Original Position
                                    mat4.multiplyVec3(revTrans.bot, pointBot, pointBot);
                                    
                                    layer.Intersection[k].Mesh.Bot.push(pointBot);
                                    bInterscetion.push(pointBot);
                                    
                                    var margin = vec3.length(pointBot) * (1 - layer.Offsets[k].percentage[layer.Intersection[k].Mesh.Bot.length - 1]);
                                    
                                    //Acounts for margins caused from outside of mesh (i.e. cancer penetrates mesh boundary)
                                    margin = margin < 0 ? 0.01 : margin;
                                    
                                    layer.Intersection[k].Margin.Bot.push(margin);
                                    
                                    msh.vertexMargins[msh.indices[j + 0]] = ((msh.vertexMargins[msh.indices[j + 0]] > 0)  &&  (msh.vertexMargins[msh.indices[j + 0]] > margin)) || (msh.vertexMargins[msh.indices[j + 0]] < 0) ? margin : msh.vertexMargins[msh.indices[j + 0]];
                                    msh.vertexMargins[msh.indices[j + 1]] = ((msh.vertexMargins[msh.indices[j + 1]] > 0)  &&  (msh.vertexMargins[msh.indices[j + 1]] > margin)) || (msh.vertexMargins[msh.indices[j + 1]] < 0) ? margin : msh.vertexMargins[msh.indices[j + 1]];
                                    msh.vertexMargins[msh.indices[j + 2]] = ((msh.vertexMargins[msh.indices[j + 2]] > 0)  &&  (msh.vertexMargins[msh.indices[j + 2]] > margin)) || (msh.vertexMargins[msh.indices[j + 2]] < 0) ? margin : msh.vertexMargins[msh.indices[j + 2]];
                                    
                                    
                                    botIntersection = true;
                                }
                            }
                            
                            //Test to see if both have found intersection
                            //  Break if true, no need to keep testing
                            if(topIntersection && botIntersection){
                                break;
                            }
                            
                        }
                        
                        for(var j = 0; j < msh.vertexMargins.length; j++){
                            
                            //Had an intersection
                            if(msh.vertexMargins[j] < 0){
                                msh.vertexMargins[j] = 1000;//Number.MAX_VALUE / 2;
                            }
                        }
                    }
                    if(tIntersection.length > 1 || bInterscetion.length > 1){
//console.log("Layer " + k + " has multiple intersections, Top: " + tIntersection.length + ", Bot: " + bInterscetion.length);

                    }
                    if(!topIntersection || !botIntersection){
                        //console.error("Failed to find Mesh Intersection");
                        //console.error("Ray: " + JSON.stringify(ray, null, "\t"));
                        //console.error("Seg: " + JSON.stringify(seg, null, "\t"));
                        //console.error("Point: " + JSON.stringify(point, null, "\t"));
                        if(topIntersection && !botIntersection){
                            layer.Intersection[k].Mesh.Bot.push(layer.Intersection[k].Mesh.Top[layer.Intersection[k].Mesh.Top.length-1]);
                            layer.Intersection[k].Margin.Bot.push(layer.Intersection[k].Margin.Top[layer.Intersection[k].Margin.Top.length-1]);
                                    
                        }
                        else if(!topIntersection && botIntersection){
                            layer.Intersection[k].Mesh.Top.push(layer.Intersection[k].Mesh.Bot[layer.Intersection[k].Mesh.Bot.length-1]);
                            layer.Intersection[k].Margin.Top.push(layer.Intersection[k].Margin.Bot[layer.Intersection[k].Margin.Bot.length-1]);
                        }    
                                
                        //Normailize Margins
                        
                    }
                    
                    if(layer.Intersection[k].Mesh.Top.length != layer.Intersection[k].Mesh.Bot.length){
                        //console.log("Whoa there nelly");
                    }
                    
                }
            }
        }
    },
    MeshIntersection: function(mesh, layer){
        var transform = [];
        var revTrans = [];
        var center = [layer.BVs[layer.borderID].Cx,layer.BVs[layer.borderID].Cy, 0];
        
        for(var k = 0; k < layer.outlines.length; k++){
            if(k != layer.borderID){
                
                var cancer = layer.outlines[k];
                layer.Intersection[k].Mesh = [];
                
                var ray = null;
                var tri = null;
                var point = null;
                
                heightY = ((( ((layer.stop - layer.start)/2) + layer.start ) -  dimensions.height/2) * mmToMesh);
                mat4.identity(transform);

                //Translate Triangle Back To Position - Height
                //mat4.translate(transform, [0,0,(((layer.stop - layer.start)/2) * mmToMesh) + Min.y], transform);
                mat4.translate(transform, [0,0,heightY], transform);
                
                //Rotate Triangle By 90 on X Axis
                mat4.rotateX(transform, Math.PI/2, transform);
                
                
                mat4.identity(revTrans);
                                
                //Rotate Triangle By -90 on X Axis
                mat4.rotateX(revTrans, Math.PI/-2, revTrans);
                
                //Translate point By Height - Position
                //mat4.translate(revTrans, [0,0, -1 * ((((layer.stop - layer.start)/2) * mmToMesh) + Min.y) ], revTrans);
                mat4.translate(revTrans, [0,0, -1 * heightY ], revTrans);
                
                            
                //Loop through each ray
                for(var i = 0; i < cancer.length; i++){
                    ray = new CRay(0,0, cancer[i].x - center[0], cancer[i].y - center[1]);
                    
                    for(var m = 0; m < mesh.length; m++){
                        var msh = mesh[m];
                        //Loop through each tri in mesh
                        for(var j = 0; j < msh.indices.length; j += 3){
                            var v0 = [msh.vertexPositions[msh.indices[j + 0] * 3],msh.vertexPositions[(msh.indices[j + 0] * 3) + 1], msh.vertexPositions[(msh.indices[j + 0] * 3) + 2] ];
                            var v1 = [msh.vertexPositions[msh.indices[j + 1] * 3],msh.vertexPositions[(msh.indices[j + 1] * 3) + 1], msh.vertexPositions[(msh.indices[j + 1] * 3) + 2] ];
                            var v2 = [msh.vertexPositions[msh.indices[j + 2] * 3],msh.vertexPositions[(msh.indices[j + 2] * 3) + 1], msh.vertexPositions[(msh.indices[j + 2] * 3) + 2] ];
                            
                            //var v0 = [msh.vertexPositions[msh.indices[(j + 0) * 3]],msh.vertexPositions[msh.indices[((j + 0) * 3) + 1]], msh.vertexPositions[msh.indices[((j + 0) * 3) + 2]] ];
                            //var v1 = [msh.vertexPositions[msh.indices[(j + 1) * 3]],msh.vertexPositions[msh.indices[((j + 1) * 3) + 1]], msh.vertexPositions[msh.indices[((j + 1) * 3) + 2]] ];
                            //var v2 = [msh.vertexPositions[msh.indices[(j + 2) * 3]],msh.vertexPositions[msh.indices[((j + 2) * 3) + 1]], msh.vertexPositions[msh.indices[((j + 2) * 3) + 2]] ];
                            
                            tri = new CTriangle(v0, v1, v2);
                            //point = Cancer.Calculate.RayTriangleCollision(ray, tri);
                            
                            
                            //Create New Triangle
                            var t0 = [], t1 = [], t2= [];
                            mat4.multiplyVec3(transform, v0, v0);
                            mat4.multiplyVec3(transform, v1, v1);
                            mat4.multiplyVec3(transform, v2, v2);
                            var t = new CTriangle(v0,v1,v2);
                            
                            point = Cancer.Calculate.RayTriangleCollision(ray, t);
                            
                            
                            
                            if(point != null){
                                //Move Point back to Original Position
                                mat4.multiplyVec3(revTrans, point, point);
                                
                                layer.Intersection[k].Mesh.push(point);
                                break;
                            }
                        }
                        
                        if(point == null){
                            //os.debugbar.AnchorConsolePage();
                            //layer.Intersection[k].Mesh.push(point);
                            //os.console.Comment("No collision found!");
                            
                            //console.error("Failed to find Intersection");
                            //console.error("Ray: " + JSON.stringify(ray, null, "\t"));
                            //console.error("Tri: " + JSON.stringify(tri, null, "\t"));
                            //console.error("Point: " + JSON.stringify(point, null, "\t"));
                        }
                        else{
                            //os.console.Comment("Collision Point: (" + point[0].toFixed(3) + ", " + point[1].toFixed(3) + ", " + point[2].toFixed(3) + ")")
                        }
                    }
                }
            }
        }
        
    },
    Border: function(layer){
        var borderID = 0;
        
        for(var i = 0; i < layer.outlines.length; i++){
            if(layer.BVs[i].area > layer.BVs[borderID].area){
                borderID = i;
            }
        }
        layer.borderID = borderID;
        layer.border = layer.outlines[borderID];
    },
    Offsets: function(layer){
               
        var border = layer.border
        
        
        for(var k = 0; k < layer.outlines.length; k++){
            if(layer.borderID != k){
                var cancer = layer.outlines[k];
                
                if(!layer.Offsets){
                    layer.Offsets = [];
                }
                
                layer.Offsets[k] = {};
                layer.Offsets[k].absolute = [];
                layer.Offsets[k].percentage = [];
                
                if(!layer.Intersection){
                    layer.Intersection = [];
                }
                
                layer.Intersection[k] = {};
                layer.Intersection[k].Trace = [];
                
                var center = {
                    x: layer.BVs[layer.borderID].Cx,//layer.BVs[k].Cx,
                    y: layer.BVs[layer.borderID].Cy//layer.BVs[k].Cy
                };
                
                for(var i = 0; i < cancer.length; i++){
                    
                    //Get ray from center to trace point
                    var ray = new CRay(center.x, center.y, cancer[i].x, cancer[i].y);
                    
                    //Test last segment first
                    var seg = new CSegment(border[border.length - 1].x, border[border.length -1].y, border[0].x, border[0].y);
                    var point = Cancer.Calculate.RaySegmentCollision(ray, seg);
                    
                    //Loop through rest of border segments until intersection found
                    if(point == null){
                        //Test intersection on each segment of border
                        for(var j = 0; j < border.length - 1; j++){
                            seg = new CSegment(border[j].x, border[j].y, border[j + 1].x, border[j + 1].y);
                            point = Cancer.Calculate.RaySegmentCollision(ray, seg);
                            
                            if(point != null){
                                break;
                            }
                            
                        }
                    }
                    
                    if(point == null){
                        //console.error("Failed to find Intersection");
                        //console.error("Ray: " + JSON.stringify(ray, null, "\t"));
                        //console.error("Seg: " + JSON.stringify(seg, null, "\t"));
                        //console.error("Point: " + JSON.stringify(point, null, "\t"));
                        
                        //os.debugbar.AnchorConsolePage();
                        //os.console.Comment("No collision found!");
                    }
                    else{
                        layer.Intersection[k].Trace.push(point);
                        var totalDist = vec2.distance(point, [center.x, center.y]);
                        var cancerDist = vec2.distance([cancer[i].x, cancer[i].y], [center.x, center.y]);
                        
                        layer.Offsets[k].absolute.push(totalDist - cancerDist);
                        layer.Offsets[k].percentage.push(cancerDist/totalDist);
                    }
                    
                }
            }
        }
        
    },
    BVs: function(traces, BVs){
        //Are there any traces?
        if(traces.length > 0){
            for( var j = 0; j < traces.length; j++){
                //Create BV
                var bv = new CBV();
                
                //Get current Trace
                var trace = traces[j];
                
                //Initialize BV with first point
                bv.xMax = trace[0].x;
                bv.xMin = trace[0].x;
                bv.yMax = trace[0].y;
                bv.yMin = trace[0].y;
                
                //Loop through trace to find Max and Min
                for(var i = 0; i < trace.length; i++){
                    bv.xMax = trace[i].x > bv.xMax ? trace[i].x : bv.xMax;
                    bv.yMax = trace[i].y > bv.yMax ? trace[i].y : bv.yMax;
                    
                    bv.xMin = trace[i].x < bv.xMin ? trace[i].x : bv.xMin;
                    bv.yMin = trace[i].y < bv.yMin ? trace[i].y : bv.yMin;
                    
                    bv.Cx += trace[i].x;
                    bv.Cy += trace[i].y;
                }
                
                bv.area = (bv.xMax - bv.xMin) * (bv.yMax - bv.yMin);
                bv.Cx /= trace.length;
                bv.Cy /= trace.length;
                bv.id = j;
                BVs.push(bv);
            }
        }
    },
    RaySegmentCollision: function(ray, segment){
        var scale = 0;
        var point = null;
        
        var w = [segment.xo - ray.x, segment.yo - ray.y];
        
        var denom = ray.dirX * segment.dirY - ray.dirY * segment.dirX; //vec2.perpDot(ray.vec, segment.vec);
        
        if(denom != 0.0){
            var num = ray.dirY * w[0] - ray.dirX * w[1];
            
            scale = num/denom;
            if(num > 0 && denom > 0 && scale >= 0.0 && scale <= 1.0){
                point = [];
                vec2.scale(point, segment.vec, scale);
                vec2.add(point, point, [segment.xo, segment.yo]);
            }
            
        }
        
        return point;
        
    },
    RayTriangleCollision: function(ray, tri){
        var point = null;
        
        var w0 = [];
        //vec3.subtract([ray.x, y, ray.y], tri.v0, w0);
        vec3.subtract([ray.x, ray.y, 0], tri.v0, w0);
        //vec3.subtract([ray.x, heightY, ray.y], tri.v0, w0);
        
        //var dir = [ray.dirX, y, ray.dirY] ;
        var dir = [ray.dirX, ray.dirY, 0] ;
        //var dir = [ray.dirX, 0, ray.dirY] ;
        var a = -1 * vec3.dot(tri.normal, w0);
        var b = vec3.dot(tri.normal, dir)
        
        if(Math.abs(b) > 0.0001){
            if(a != 0.0){
                var r = a / b;
                if(r > 0.0){
                    //Get point
                    point = [];
                    vec3.scale(dir, r, point);
                    //vec3.add([ray.x, y, ray.y], point, point);
                    vec3.add([ray.x, ray.y, 0], point, point);
                    
                    //Test to see if inside of Tri
                    var uu = vec3.dot(tri.edge1, tri.edge1);
                    var uv = vec3.dot(tri.edge1, tri.edge2);
                    var vv = vec3.dot(tri.edge2, tri.edge2);
                    var w = [];
                    vec3.subtract(point, tri.v0, w);
                    var wu = vec3.dot(w, tri.edge1);
                    var wv = vec3.dot(w, tri.edge2);
                    
                    var D = uv * uv - uu * vv;
                    
                    var s = (uv * wv - vv * wu) / D;
                    if(s >= 0.0 && s <= 1.0){
                        var t = (uv * wu - uu * wv) / D;
                        if(t < 0.0 || (s + t) > 1.0){
                            point = null;
                        }
                    }
                    else{
                        point = null;
                    }
                }
            }
        }
        
        return point;
    }
}
var Triangulate = {
    EPSILON: 0.0000000001,
    Process: function(contour, result, index){

        var n = contour.length;
        
        if(n < 3){return false}
        
        var V = [];
        
        if(0.0 < Triangulate.Area(contour)){
            for(var v = 0; v < n; v++){
                V[v] = v;
            }
        }
        else{
            for(var v = 0; v < n; v++){
                V[v] = (n-1)-v;
            }
        }
            
        var nv = n;
        
        var count = 2*nv;
        
        for(var m=0, v=nv-1; nv > 2;){
            if(0 >= (count--)){
                return false;
            }
            var u = v; if(nv <= u){ u = 0; }
            v = u + 1; if(nv <= v){ v = 0; }
            //var w = v + 1; if (nv < w){ w = 0; }
            var w = v + 1; if (nv <= w){ w = 0; }
            
            if( Triangulate.Snip(contour, u,v,w,nv,V)){
                var a,b,c,s,t;
                
                a = V[u], b = V[v], c = V[w];
                
                if(index){
                    index.push(a + 1);
                    index.push(b + 1);
                    index.push(c + 1);
                }
                result.push(contour[a]);
                result.push(contour[b]);
                result.push(contour[c]);
                
                m++;
                
                for(s=v, t=v+1; t < nv; s++, t++){
                    V[s] = V[t];
                }
                
                nv--;
                count = 2 * nv;
            }
        }
        V = null;
        return true;
    },
    Area: function(contour){
        
        var area = 0.0;
        
        var n = contour.length;
        var q = 0;
        
        for(var p = n - 1; q < n; p=q++){
            area += (contour[p][0] * contour[q][1]) - (contour[q][0] * contour[p][1]);
        }
        
        return area * 0.5;
    },
    InsideTriangle: function(A, B, C, P){
        var ax, ay, bx, by, cx, cy, apx, apy, bpx, bpy, cpx, cpy;
        var cCROSSap, bCROSScp, aCROSSbp;
      
        ax = C[0]  - B[0] ;  ay = C[1]  - B[1];
        bx = A[0]  - C[0] ;  by = A[1]  - C[1];
        cx = B[0]  - A[0] ;  cy = B[1]  - A[1];
        apx= P[0]  - A[0] ;  apy= P[1]  - A[1];
        bpx= P[0]  - B[0] ;  bpy= P[1]  - B[1];
        cpx= P[0]  - C[0] ;  cpy= P[1]  - C[1];
      
        aCROSSbp = ax*bpy - ay*bpx;
        cCROSSap = cx*apy - cy*apx;
        bCROSScp = bx*cpy - by*cpx;
      
        return ((aCROSSbp >= 0.0) && (bCROSScp >= 0.0) && (cCROSSap >= 0.0));
    },
    Snip: function(contour, u,v,w,n,V){
        var p;
        var A = [], B = [], C = [], P = [];
      
        A[0] = contour[V[u]][0];
        A[1] = contour[V[u]][1];
      
        B[0] = contour[V[v]][0];
        B[1] = contour[V[v]][1];
      
        C[0] = contour[V[w]][0];
        if([V[w]][0] == undefined){
            var i =0;
            i++;
        }
        C[1] = contour[V[w]][1];
      
        if ( Triangulate.EPSILON > (((B[0]-A[0])*(C[1]-A[1])) - ((B[1]-A[1])*(C[0]-A[0]))) ) return false;
      
        for (p=0;p<n;p++)
        {
          if( (p == u) || (p == v) || (p == w) ) continue;
          P[0] = contour[V[p]][0];
          P[1] = contour[V[p]][1];
          if (Triangulate.InsideTriangle(A,B,C,P)) return false;
        }
      
        return true;
    }
    
}
AlignJSON = function(data){
    var meshes = data.meshes;
    var matrix = mat4.create();
    mat4.set(data.matrix, matrix);
    
    var pos = [0,0,0];
    
    
    for(var i = meshes.length - 1; i >= 0; i--){
        for(var j = 0; j < meshes[i].vertexPositions.length; j += 3){
            pos[0] = meshes[i].vertexPositions[j];
            pos[1] = meshes[i].vertexPositions[j + 1];
            pos[2] = meshes[i].vertexPositions[j + 2]
            
            mat4.multiplyVec3(matrix, pos, pos);
            
            meshes[i].vertexPositions[j]        = pos[0];
            meshes[i].vertexPositions[j + 1]    = pos[1];
            meshes[i].vertexPositions[j + 2]    = pos[2];
        }
        
        for(var j = 0; j < meshes[i].vertexNormals.length; j += 3){
            pos[0] = meshes[i].vertexNormals[j];
            pos[1] = meshes[i].vertexNormals[j + 1];
            pos[2] = meshes[i].vertexNormals[j + 2]
            
            mat4.multiplyVec3(matrix, pos, pos);
            
            meshes[i].vertexNormals[j]        = pos[0];
            meshes[i].vertexNormals[j + 1]    = pos[1];
            meshes[i].vertexNormals[j + 2]    = pos[2];
        }
    }
    
    if(data.layers){
        for(var i = 0; i < data.layers.length; i++){
            var layer = data.layers[i];
            
            if(layer.cancer){
                for(var j = 0; j < layer.json.length; j++){
                    var obj = layer.json[j];
                    
                    for(var k = 0; k < obj.length; k++){
                        var msh = obj[k];
                        
                        for(var m = 0; m < msh.vertexPositions.length; m+=3){
                            pos[0] = msh.vertexPositions[m];
                            pos[1] = msh.vertexPositions[m + 1];
                            pos[2] = msh.vertexPositions[m + 2]
                            
                            mat4.multiplyVec3(matrix, pos, pos);
                            
                            msh.vertexPositions[m]        = pos[0];
                            msh.vertexPositions[m + 1]    = pos[1];
                            msh.vertexPositions[m + 2]    = pos[2];
                        }
                        
                        for(var m = 0; m < msh.vertexNormals.length; m+=3){
                            pos[0] = msh.vertexNormals[m];
                            pos[1] = msh.vertexNormals[m + 1];
                            pos[2] = msh.vertexNormals[m + 2]
                            
                            mat4.multiplyVec3(matrix, pos, pos);
                            
                            msh.vertexNormals[m]        = pos[0];
                            msh.vertexNormals[m + 1]    = pos[1];
                            msh.vertexNormals[m + 2]    = pos[2];
                        }
                    }
                }
            }
        }
    }
    return {meshes: meshes,
            layers: data.layers};    
}

ParseOBJ = function(file, centered){
    
    file = file.split('\n');
    
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
    }
    
    
    if(centered){
       
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
    }
    //obj.face = obj.face.reverse();
    return obj;
}

BuildJSON = function(obj){

    var out = [];
    var json = os.resschmgr.Create.JSON();
    //json.vertexPositions = [];
    //json.vertexMargins = [];
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
                else{
                    //console.log("X, Y, and Z were left to default values");
                    //x = json.vertexPositions[json.vertexPositions.length - 3];
                    //y = json.vertexPositions[json.vertexPositions.length - 2];
                    //z = json.vertexPositions[json.vertexPositions.length - 1];
                    
                    
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
    for(var i = 0; i < out.length; i++){
        var numOfVerts = (out[i].vertexPositions.length) / 3;
        for(var j= 0; j < numOfVerts; j++){
            out[i].vertexMargins.push(-1.0);
        }
    }

    return out;
}