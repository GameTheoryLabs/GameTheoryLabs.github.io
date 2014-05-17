//Requires:
//          glMatrix.js -     Googles Matrix Library
//          webgl-util.js  -  Google webgl context generation tool (checks for proper format based upon browser)
//          webgl-debug.js -  Google webgl debug context generation
function degToRad(degrees) {
        return degrees * (Math.PI / 180.0);
}

function radToDegrees(rad) {
        return rad * (180.0 / Math.PI);
}

com.jahova.os.Instance().Cores.Instance().Graphics = (function()
{
    var pInstance;

    function constructor()
    {
        //PRIVATE ATTRIBUTES
        var NAME = "JaHOVA OS Internal API : Graphics Core";
        var VERSION = "0v5";
        var PATH = "scripts/jahova/OS/Cores/Graphics/jahova.os.cores.graphics.js";
        var ID = null;
        
        var os = com.jahova.os.Instance();
        var utilities = com.jahova.utilities.Instance();
        
        var _viewport = {
                width:  0,
                height: 0
            };
            
        var _fullscreen = false;
        
        var _pause = false;
        
        var _canvas = null;     //WebGL Canvas Object
        
        var _update      = null;
        var _updateScope = null;
        
        var _draw       = null;
        var _drawScope  = null;
        
        var _reset      = null;
        var _resetScope = null;
        
        //PRIVATE METHODS
        var _get3DContext = function(canvas, opt_attribs) {
            var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            var context = null;
            for (var ii = 0; ii < names.length; ++ii) {
              try {
                context = canvas.getContext(names[ii], opt_attribs);
              } catch(e) {}
              if (context) {
                break;
              }
            }
            if(context){}
            else{
              alert("Could Not Create WebGL Context");
            }
            
            return context;
        }

        
        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame ||
                   window.webkitRequestAnimationFrame ||
                   window.mozRequestAnimationFrame ||
                   window.oRequestAnimationFrame ||
                   window.msRequestAnimationFrame ||
                   function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                     window.setTimeout(callback, 1000/60);
                   };
          })();
        //Private Classes
        CVertexShader = function(key, url){
            this.filename = url;
            this.name = key;
            this.loaded = false;
            this.code = "";
            this.shader = null;
            this.compiled = false;
            
            this.Load = function(){
                var xhr = os.resschmgr.Create.XHRObject();
                var filepath = this.filename;
                os.console.Comment("Requesting:\n" + filepath);
                
                xhr.open('GET',filepath,false);
                xhr.onreadystatechange = function(){
                  if(xhr.readyState==4){ //4==DONE
                        if((xhr.status == 200) || (xhr.status == 0))
                        {
                            this.code = xhr.responseText;
                            this.loaded = true;
                            this.Initialize();
                        }
                        else{
                            os.windows.Create.ErrorWindow('Shader Failer', "Failed to load Vertex Shader: " + this.name +"<br/>At URL: " + this.filename + "<br/><br/>Check url and filename");
                        }
                  }
                    
                }.bind(this);
                
                xhr.send();
            };
            
            this.Initialize = function(){
                var gl = os.graphics.gl;
                
                //Create Shader Object
                this.shader = gl.createShader(gl.VERTEX_SHADER);
                
                //Add Code to Shader Object
                gl.shaderSource(this.shader, this.code);
                
                //Compile Shader
                gl.compileShader(this.shader);
                
                //Verify Shader was able to compile without Errors
                if(!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)){
                    os.windows.Create.ErrorWindow("Shader Compile Error","Vertex Shader: " + this.name + "<br/><br/>" + gl.getShaderInfoLog(this.shader));
                }
                else{
                    this.compiled = true;
                }
            }.bind(this);
            
            this.Load();
        };
        
        CFragmentShader = function(key, url){
            this.filename = url;
            this.name = key;
            this.loaded = false;
            this.code = "";
            this.shader = null;
            
            this.Load = function(){
                var xhr = os.resschmgr.Create.XHRObject();
                var filepath = this.filename;
                os.console.Comment("Requesting:\n" + filepath);
                
                xhr.open('GET',filepath,false);
                xhr.onreadystatechange = function(){
                  if(xhr.readyState==4){ //4==DONE
                        if((xhr.status == 200) || (xhr.status == 0))
                        {
                            this.code = xhr.responseText;
                            this.loaded = true;
                            this.Initialize();
                        }
                        else{
                            os.windows.Create.ErrorWindow('Shader Failer', "Failed to load Fragment Shader: " + this.name +"<br/>At URL: " + this.filename + "<br/><br/>Check url and filename");
                        }
                  }
                    
                }.bind(this);
                
                xhr.send();
            };
            
            this.Initialize = function(){
                var gl = os.graphics.gl;
                
                //Create Shader Object
                this.shader = gl.createShader(gl.FRAGMENT_SHADER);
                
                //Add Code to Shader Object
                gl.shaderSource(this.shader, this.code);
                
                //Compile Shader
                gl.compileShader(this.shader);
                
                //Verify Shader was able to compile without Errors
                if(!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)){
                    os.windows.Create.ErrorWindow("Shader Compile Error", "Fragment Shader: " + this.name + "<br/><br/>" +gl.getShaderInfoLog(this.shader));
                }
                else{
                    this.compiled = true;
                }
            }.bind(this);
            
            this.Load();
        };
        
        CProgram = function(vs, fs, key){
            var gl = os.graphics.gl;
            
            this.name = key;
            this.compiled = false;
            this.attributes = os.resschmgr.Create.Map();
            this.uniforms = os.resschmgr.Create.Map();
            
            //Get fragment and vertex shader objects
            this.fragment = os.graphics.Managers.Shader.Maps.FragmentShaders.get(fs);
            this.vertex = os.graphics.Managers.Shader.Maps.VertexShaders.get(vs);
            
            //Create program object
            this.program = gl.createProgram();
            
            //Attach compiled shaders to program
            gl.attachShader(this.program, this.fragment.shader);
            gl.attachShader(this.program, this.vertex.shader);
            
            //Link/build program
            gl.linkProgram(this.program);
            
            //Test if linking was successful
            if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)){
                os.windows.Create.ErrorWindow("Program Link Error", "Program: " + this.name + "<br/><br/>Unable to initialize program")
            }
            else
                this.compiled = true;
            
            this.CreateAttribute = function(aName){
                
                //Test if program is active, if not, set active
                if(os.graphics.Managers.Shader.ActiveProgram != this.name){
                    os.graphics.Managers.Shader.SetActiveProgram(this);
                }
                
                //Get pointer to attribute variable in program
                var attrib = gl.getAttribLocation(this.program, aName);
                
                //Save attribute pointer in map
                this.attributes.put(aName, attrib);
                
                //Enable Attribute in Shader
                gl.enableVertexAttribArray(attrib);
            };
            
            this.CreateUniform = function(uName){
                //Test if program is active, if not, set active
                if(os.graphics.Managers.Shader.ActiveProgram != this.name){
                    os.graphics.Managers.Shader.SetActiveProgram(this);
                }
                
                //Get pointer to attribute variable in program
                var uniform = gl.getUniformLocation(this.program, uName);
                
                //Save attribute pointer in map
                this.uniforms.put(uName, uniform);
                
            }
            
        };
        
        CShader = function(prg){
            //Maps to hold shader varibles
            this.Uniforms = os.resschmgr.Create.Map();
            this.Attributes = os.resschmgr.Create.Map();
            
            //Shader Program Object
            this.Program = prg;
            
            //Connect Variable to Attribute in Program
            this.AddAttribute = function(shdVarName, shdDataType, jsBufferPointer, attributeType, itemSize){
                //Test if program is active, if not, set active
                if(os.graphics.Managers.Shader.ActiveProgram != this.name){
                    os.graphics.Managers.Shader.SetActiveProgram(this);
                }
                
                var a = os.graphics.Managers.Shader.Create.Attribute(shdVarName, shdDataType, attributeType);
                a.location = this.Program.attributes.get(shdVarName);
                
                //If attribute Type = Vertex, Normal or Texture, don't need jsBufferPointer,
                //  values will be pulled from active mesh during draw call
    
                //If type is CUSTOM, gl.Buffer object needs to be created
                //      and jsBufferPointer needs to be loaded as data values
                //      pointer to attribute array must be set so it
                //      can be binded on loop through in Shader Draw method
                if(attributeType.toUpperCase() == "CUSTOM"){
                    var gl = os.graphics.gl;
                    
                    //Create WebGL Buffer to hold Vertex Normals
                    a.value = gl.createBuffer();
                    
                    //Set array as Active Buffer for WebGL Operations
                    gl.bindBuffer(gl.ARRAY_BUFFER, a.buffer);
                        
                    //Set Array as Data for Active Buffer 
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(jsBufferPointer), gl.STATIC_DRAW);
                    
                    //3 Elements Per Data Point
                    a.buffer.itemSize = itemSize;
                    
                    //Total Number Data points
                    a.buffer.numItems = jsBufferPointer.length / a.buffer.itemSize;
                        
                }
                
                this.Attributes.put(a.key, a);
            }.bind(this);
            
            //Connect Variable to Uniform in Program
            this.AddUniform = function(shdVarName, shdVarType, jsVarPtr){
                //Test if program is active, if not, set active
                if(os.graphics.Managers.Shader.ActiveProgram != this.Program.name){
                    os.graphics.Managers.Shader.SetActiveProgram(this.Program.name);
                }
                
                var u  = os.graphics.Managers.Shader.Create.Uniform(shdVarName, shdVarType, jsVarPtr);
                u.location = this.Program.uniforms.get(shdVarName);
                
                this.Uniforms.put(u.key, u);
            }.bind(this);
            //Bind Attribute Buffers
            this.BindAttributes = function(msh){
                var gl = os.graphics.gl;
                //loop this.Attributes
                //  if attributeType == CUSTOM, bind data in value property
                //  if attributeType == VERTEX, set mesh.Buffer.Vertex as data
                for(var i = this.Attributes.size; i--; this.Attributes.next()){
                    
                    var a = this.Attributes.value();
                    
                    if(a.attributeType.toUpperCase() == "CUSTOM"){
                        gl.bindBuffer(gl.ARRAY_BUFFER,a.buffer );
                        gl.vertexAttribPointer(a.location, a.buffer.itemSize, gl.FLOAT, false, 0, 0);
                    }
                    else{
                        if(this.Attributes.value().attributeType.toUpperCase() == "VERTEX"){
                            gl.bindBuffer(gl.ARRAY_BUFFER, msh.Buffers.Vertex );
                            gl.vertexAttribPointer(a.location, msh.Buffers.Vertex.itemSize, gl.FLOAT, false, 0, 0);
                        }
                        else if(this.Attributes.value().attributeType.toUpperCase() == "NORMAL"){
                            gl.bindBuffer(gl.ARRAY_BUFFER, msh.Buffers.Normal );
                            gl.vertexAttribPointer(a.location, msh.Buffers.Normal.itemSize, gl.FLOAT, false, 0, 0);
                        }
                        else if(this.Attributes.value().attributeType.toUpperCase() == "TEXTURE"){
                            gl.bindBuffer(gl.ARRAY_BUFFER, msh.Buffers.Texture );
                            gl.vertexAttribPointer(a.location, msh.Buffers.Texture.itemSize, gl.FLOAT, false, 0, 0);
                        }
                        else if(this.Attributes.value().attributeType.toUpperCase() == "MARGIN"){
                            gl.bindBuffer(gl.ARRAY_BUFFER, msh.Buffers.Margin );
                            gl.vertexAttribPointer(a.location, msh.Buffers.Margin.itemSize, gl.FLOAT, false, 0, 0);
                        }
                        else if(this.Attributes.value().attributeType.toUpperCase() == "INSTANCE"){
                            gl.bindBuffer(gl.ARRAY_BUFFER, msh.Buffers.Instance );
                            gl.vertexAttribPointer(a.location, msh.Buffers.Instance.itemSize, gl.FLOAT, false, 0, 0);
                        }
                    }
                }
            }.bind(this);
            
            //Set Uniform values before Draw Command
            this.SetUniforms = function(){
                
                for(i = this.Uniforms.size; i--; this.Uniforms.next()){
                    var u = this.Uniforms.value();
                    var gl = os.graphics.gl;
                    
                    if(u.type == "BOOL"){
                        gl.uniform1i(u.location, u.value);
                    }
                    else if(u.type == "4X4"){
                        gl.uniformMatrix4fv(u.location, false, u.value);
                    }
                    else if(u.type == "3X3"){
                        gl.uniformMatrix3fv(u.location, false, u.value);
                    }
                    else if(u.type == "VEC3"){
                        gl.uniform3f(u.location, u.value[0],u.value[1],u.value[2]);
                    }
                    else if(u.type == "VEC4"){
                        gl.uniform4f(u.location, u.value[0],u.value[1],u.value[2],u.value[3]);
                    }
                    else if(u.type == "FLOAT"){
                        gl.uniform1f(u.location, u.value);
                    }
                    else if(u.type == "ARRAY_VEC3"){
                        gl.uniform3fv(u.location, u.value);
                    }
                    else{
                        os.windows.Create.ErrorWindow("Shader Error","Unknown Uniform Type: " + u.type + " Found During SetUniforms()");
                    }
                }
            }.bind(this);
            
            
        };
        
        CAttribute = function(shdVarName, shdDataType, attributeType){
            this.key = shdVarName;
            this.variableName = shdVarName;
            this.buffer = null;
            this.location = "";
            this.dataType = shdDataType;
            this.attributeType = attributeType;
            this.itemSize = null;
        };
        
        CUniform = function(shdVarName, shdVarType, jsVarPtr){
            this.key = shdVarName;
            this.variableName = shdVarName;
            this.value = jsVarPtr;              //JavaScript Variable Pointer/Value
            this.location = "";                 //Shader Uniform Location
            this.type = shdVarType;             //(bool, 4x4,3x3,vec3,vec4,float,etc)

        };
        
        CTexture = function(key, url){
            var gl = os.graphics.gl;
            
            this.key = key;
            this.initialized = false;
            this.type = gl.TEXTURE_2D;
            
            //Create gl Texture object
            this.texture = gl.createTexture();
            
            //Create HTML Image
            this.image = new Image();
            this.image.src = url;
            
            this.image.onload = function(){
                this.Initialize();
            }.bind(this);
            
            this.Initialize = function(){
                
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.generateMipmap(gl.TEXTURE_2D);
                
                gl.bindTexture(gl.TEXTURE_2D, null);
                
                this.initialized = true;
            }.bind(this);
        };
        CRenderTexture = function(sKey, iWidth, iHeight){
            var gl = os.graphics.gl;
            
            this.key = sKey;
            this.initialized = false;
            this.type = gl.TEXTURE_2D;
            this.width = iWidth;
            this.height = iHeight;
            
            //Create gl Texture object
            this.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    
            this.initialized = true;
        };
        CCubeMap = function(key){
            var gl = os.graphics.gl;
            
            var _count = 0;
            this.type = gl.TEXTURE_CUBE_MAP;
            this.key = key;
            this.initialized = false;
            this.texture = gl.createTexture();
            
            var OnLoad = function(){
                _count++;
                if(_count == 6){
                    Initialize();
                }
            }.bind(this);
            
            var Initialize = function(){
                
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
                
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.Images.positiveX);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.Images.negativeX);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.Images.positiveY);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.Images.negativeY);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.Images.positiveZ);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.Images.negativeZ);
        
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        
            }.bind(this);
            
            this.GetCount = function(){return _count;}
            this.Images = {
                positiveX: null,
                negativeX: null,
                positiveY: null,
                negativeY: null,
                positiveZ: null,
                negativeZ: null
            };
            
            this.Load = {
                positiveX: function(url){
                    this.Images.positiveX = new Image();
                    this.Images.positiveX.src = url;
                    
                    this.Images.positiveX.onload = OnLoad;
                    
                }.bind(this),
                negativeX: function(url){
                    this.Images.negativeX = new Image();
                    this.Images.negativeX.src = url;
                    
                    this.Images.negativeX.onload = OnLoad;
                }.bind(this),
                positiveY: function(url){
                    this.Images.positiveY = new Image();
                    this.Images.positiveY.src = url;
                    
                    this.Images.positiveY.onload = OnLoad;
                }.bind(this),
                negativeY: function(url){
                    this.Images.negativeY = new Image();
                    this.Images.negativeY.src = url;
                    
                    this.Images.negativeY.onload = OnLoad;
                }.bind(this),
                positiveZ: function(url){
                    this.Images.positiveZ = new Image();
                    this.Images.positiveZ.src = url;
                    
                    this.Images.positiveZ.onload = OnLoad;
                }.bind(this),
                negativeZ: function(url){
                    this.Images.negativeZ = new Image();
                    this.Images.negativeZ.src = url;
                    
                    this.Images.negativeZ.onload = OnLoad;
                }.bind(this)
            };
            
            
        };
        
        CMesh = function(key, url){
            this.name = key;
            this.filename = url;
            this.loaded = false;
            this.numOfPolys = 0;
            this.numOfVerts = 0;
            this.instanced = false;
            this.model = null;
            this.onLoad = null;
            
            this.Buffers = {
                Vertex: null,
                Margin: null,
                Normal: null,
                Texture: null,
                Instance: null,
                Index: null
            }
            
            this.Load = function(){
                
                var xhr = os.resschmgr.Create.XHRObject();
                var filepath = this.filename;
                os.console.Comment("Requesting:\n" + filepath);
                
                xhr.open('GET',filepath,true);
                xhr.onreadystatechange = function(){
                  if(xhr.readyState==4){ //4==DONE
                        if((xhr.status == 200) || (xhr.status == 0))
                        {
                            try{
                                this.model = JSON.parse(xhr.responseText);
                                this.Initialize();
                                if(this.onLoad){
                                    this.onLoad();
                                }
                            }
                            catch(e){
                                os.windows.Create.ErrorWindow('Mesh Failer', "Failed to parse Mesh: " + this.name +"<br/>At URL: " + this.filename + "<br/><br/>The file was not a compatiable JSON format");
                            }
                            
                        }
                        else{
                            os.windows.Create.ErrorWindow('Mesh Failure', "Failed to load Mesh: " + this.name +"<br/>At URL: " + this.filename + "<br/><br/>Check url and filename");
                        }
                  }
                    
                }.bind(this);
                
                xhr.send();
                
            }.bind(this);
            
            this.Initialize = function(){
                var gl = os.graphics.gl;
                
                //**************************
                //  NORMAL BUFFER
                //**************************
                
                //Test to see if model has vertex normals
                if(this.model.vertexNormals){
                    
                    //Create WebGL Buffer to hold Vertex Normals
                    this.Buffers.Normal = gl.createBuffer();
                    
                    //Set Normal array as Active Buffer for WebGL Operations
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.Buffers.Normal);
                        
                    //Set Normal Array as Data for Active Buffer 
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.model.vertexNormals), gl.STATIC_DRAW);
                    
                    //3 Elements Per Data Point
                    this.Buffers.Normal.itemSize = 3;
                    
                    //Total Number Data points
                    this.Buffers.Normal.numItems = this.model.vertexNormals.length / this.Buffers.Normal.itemSize;
                }

                //**************************
                //  TEXTURE BUFFER
                //**************************
                
                //Test to see if model has texture data
                if(this.model.vertexTextureCoords){
                    
                    //Create WebGL Buffer to hold Texture Coordinates
                    this.Buffers.Texture = gl.createBuffer();
                    
                    //Set Texture array as Active Buffer for WebGL Operations
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.Buffers.Texture);
                        
                    //Set Texture Array as Data for Active Buffer 
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.model.vertexTextureCoords), gl.STATIC_DRAW);
                    
                    //Elements Per Data Point
                    this.Buffers.Texture.itemSize = 2;
                    
                    //Total Number Data points
                    this.Buffers.Texture.numItems = this.model.vertexTextureCoords.length / this.Buffers.Texture.itemSize;
                    
                }
                
                
                //**************************
                //  INDEX BUFFER
                //**************************
                
                //Test to see if model has indicies
                if(this.model.indices){
                    //Create WebGL Buffer to hold Indicies
                    this.Buffers.Index = gl.createBuffer();
                    
                    //Set Index array as Active Buffer for WebGL Operations
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.Buffers.Index);
                        
                    //Set Index Array as Data for Active Buffer
                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.model.indices), gl.STATIC_DRAW);
                    
                    //Elements Per Data Point
                    this.Buffers.Index.itemSize = 1;
                    
                    //Total Number Data points
                    this.Buffers.Index.numItems = this.model.indices.length / this.Buffers.Index.itemSize;
                    
                    
                }
                
                //**************************
                //  INSTANCE BUFFER
                //**************************
                
                //Test to see if model has texture data
                if(this.model.instance){
                    
                    //Create WebGL Buffer to hold Texture Coordinates
                    this.Buffers.Instance = gl.createBuffer();
                    
                    //Set Texture array as Active Buffer for WebGL Operations
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.Buffers.Instance);
                        
                    //Set Texture Array as Data for Active Buffer 
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.model.instance), gl.STATIC_DRAW);
                    
                    //Elements Per Data Point
                    this.Buffers.Instance.itemSize = 1;
                    
                    //Total Number Data points
                    this.Buffers.Instance.numItems = this.model.instance.length / this.Buffers.Instance.itemSize;
                    
                    this.instanced = true;
                    
                }
                
                //**************************
                //  Vertex BUFFER
                //**************************
                
                //Create WebGL Buffer to hold Vertex Positions
                this.Buffers.Vertex = gl.createBuffer();
                
                //Set Position array as Active Buffer for WebGL Operations
                gl.bindBuffer(gl.ARRAY_BUFFER, this.Buffers.Vertex);
                    
                //Set Position Array as Data for Active Buffer 
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.model.vertexPositions), gl.STATIC_DRAW);
                
                //Elements Per Data Point
                this.Buffers.Vertex.itemSize = 3;
                
                //Total Number Data points
                this.Buffers.Vertex.numItems = this.model.vertexPositions.length / this.Buffers.Vertex.itemSize;
 
                // Total Numver of Verts and Polys for Given Mesh
                this.numOfVerts = this.Buffers.Vertex.numItems;
                this.numOfPolys = this.Buffers.Index.numItems / 3;
                
                //**************************
                //  MARGIN BUFFER
                //**************************
                
                //Test to see if model has vertex normals
                if(! this.model.vertexMargins){
                    
                    this.model.vertexMargins = [];
                    for(var i = 0; i < this.Buffers.Vertex.numItems; i++){
                        this.model.vertexMargins.push(-1.0);
                    }
                }   
                //Create WebGL Buffer to hold Vertex Normals
                this.Buffers.Margin = gl.createBuffer();
                
                //Set Normal array as Active Buffer for WebGL Operations
                gl.bindBuffer(gl.ARRAY_BUFFER, this.Buffers.Margin);
                    
                //Set Normal Array as Data for Active Buffer 
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.model.vertexMargins), gl.STATIC_DRAW);
                
                //3 Elements Per Data Point
                this.Buffers.Margin.itemSize = 1;
                
                //Total Number Data points
                this.Buffers.Margin.numItems = this.model.vertexMargins.length;
               
                //Set Loaded Property so Draw Method will be called
                this.loaded = true;

            }.bind(this);
            
            this.Draw = function(){
                var gl = os.graphics.gl;
                
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.Buffers.Index);
                gl.drawElements(gl.TRIANGLES, this.Buffers.Index.numItems, gl.UNSIGNED_SHORT, 0);
                
                os.graphics.Managers.Mesh.totalPolys += this.numOfPolys;
                os.graphics.Managers.Mesh.totalVerts += this.numOfVerts;
            }
            this.DrawArray = function(){
                var gl = os.graphics.gl;
                
                gl.drawArrays(gl.TRIANGLES, 0, this.Buffers.Vertex.numItems);
            }
            
            //If url was passed in, download and initialize Mesh
            if(url){this.Load();}
        };
        CGraphicsEntity = function(ent){
            
            //Holds Parent CEntity object
            this.parent = ent;
            
            //Holds textures used for the Entity
            this.Texture = os.resschmgr.Create.Map();
            
            //Holds the Mesh (and/or Sub Meshes)
            this.Mesh = os.resschmgr.Create.Map();
            
            //Holds the Shaders used for drawing
            this.Shaders = os.resschmgr.Create.Map();
            
            this.Vectors = {
                Position: vec3.create(),
                Scale: vec3.create([1,1,1]),
                Rotate: vec3.create(),
                Offset: vec3.create()
                
            };
            this.Matrix = {
                World: mat4.create(),
                Translate: mat4.create(),
                Scale: mat4.create(),
                Rotation: mat4.create(),
                RotateX: mat4.create(),
                RotateY: mat4.create(),
                RotateZ: mat4.create(),
                Normal: mat3.create(),
                Parent: {
                    World: mat4.create(),
                    Rotation: mat4.create(),
                    Translate: mat4.create()
                }
            };
            mat4.identity(this.Matrix.Parent.World);
            mat4.identity(this.Matrix.Parent.Rotation);
            mat4.identity(this.Matrix.Parent.Translate);
            
            this.Add = {
                Shader: function(shaderKey, prgKey){
                    //Get Program Object
                    var prg = os.graphics.Managers.Shader.Maps.Programs.get(prgKey);
                    //Create new shader with desire program object
                    var shd = os.graphics.Managers.Shader.Create.Shader(prg);
                    
                    //Place shader in Map
                    this.Shaders.put(shaderKey, shd);
                    
                    return shd;
                }.bind(this),
                Mesh: function(mshID){
                    var msh = os.graphics.Managers.Mesh.meshes.get(mshID);
                    
                    //If mesh is instanced, and default shader is used, enable Instacing
                    if(msh.instanced){
                        var shd = this.Shaders.get("default");
                        if(shd){
                            shd.Program.CreateAttribute("aInstance");
                            shd.AddAttribute("aInstance", "FLOAT", null, "INSTANCE", null);
                            
                            shd.Uniforms.get("uUseInstacing").value = true;
                        }
                    }
                    
                    this.Mesh.put(mshID, msh);
                    
                    return msh;
                }.bind(this),
                Texture: function(textID){
                    var texture = os.graphics.Managers.Texture.textures.get(textID);
                    this.Texture.put(textID, texture);
                    return texture;
                }.bind(this)
            }
            this.Update = function(dt){
                
            }
            
            this.Draw = function(shdID, mshID){
                var shd = null;
                var msh = null;
                
                //Draw()            : Draw All Meshes with current shader
                //Draw(shd),        : Draw All Meshes with supplied Shader
                //Draw(shd, msh)    : Draw supplied mesh with supplied shader
                
                if(shdID){  //Test to see if Shader was passed in
                    shd = this.Shaders.get(shdID);
                }
                else{       //Else get current Shader in map
                    shd = this.Shaders.value();
                }
                
                
                if(mshID){   //Test to see if meshID was supplied
                    msh = this.Mesh.get(mshID);
                    _Draw(msh,shd);
                    
                }
                else{       //loop through all mesh object in draw
                    
                    for(var i = this.Mesh.size; i--; this.Mesh.next()){
                        _Draw(this.Mesh.value(),shd);
                    }
                }

                
               
            }
            //Private Method that will draw a specific Mesh with Specific shader
            var _Draw = function(msh, shd){
                var gl = os.graphics.gl;
                
                //Test if program is active, if not, set active
                if(os.graphics.Managers.Shader.ActiveProgram != shd.Program.name){
                    os.graphics.Managers.Shader.SetActiveProgram(shd.Program);
                }
                
                //If mesh has not been loaded, return 
                if(!msh.loaded){return;}
                
                //*********************************
                //  BUILD TRANSFORMS
                //*********************************
                
                
                
                //Build Scale Matrix
                mat4.identity(this.Matrix.Scale);
                mat4.scale(this.Matrix.Scale, this.Vectors.Scale, this.Matrix.Scale);
                
                //mat4.transpose(this.Matrix.Scale, this.Matrix.Scale);
                
                //Build Translation Matrix
                mat4.identity(this.Matrix.Translate);
                mat4.translate(this.Matrix.Translate, this.parent.Position);
                
                //Build Translation Default Offset Matrix
                var offset = mat4.create();
                mat4.identity(offset);
                mat4.translate(offset, this.parent.Default.Offset);
                
                //var toLocal = mat4.create();
                //mat4.identity(toLocal);
                //mat4.translate(toLocal, [-1 * this.parent.Position[0],-1 * this.parent.Position[1], -1 * this.parent.Position[2]]);
                //mat4.translate(this.Matrix.Translate, this.Vectors.Position);
                //mat4.translate(this.Matrix.Translate, [- this.Offset.x, - this.Offset.y, - this.Offset.z]);
                
                
        
                //Build Rotation Matrix              
                this.CalculateRotationMatrix();
                
                mat4.identity(this.Matrix.RotateX);
                mat4.identity(this.Matrix.RotateY);
                mat4.identity(this.Matrix.RotateZ);
                
                //Build Rotation Matrix
                mat4.rotateZ(this.Matrix.RotateZ, degToRad(this.parent.roll), this.Matrix.RotateZ);
                
                mat4.rotateX(this.Matrix.RotateX, degToRad(this.parent.pitch), this.Matrix.RotateX);
                
                mat4.rotateY(this.Matrix.RotateY, degToRad(this.parent.yaw), this.Matrix.RotateY);
                
                mat4.identity(this.Matrix.Rotation);
                //mat4.multiply(this.Matrix.RotateY, this.Matrix.RotateX, this.Matrix.Rotation);
                //mat4.multiply(this.Matrix.Rotation, this.Matrix.RotateZ, this.Matrix.Rotation);
                
                //mat4.multiply(this.parent.Default.Rotation, this.Matrix.RotateY, this.Matrix.Rotation);
                mat4.multiply(this.Matrix.Rotation, this.Matrix.RotateY, this.Matrix.Rotation);
                mat4.multiply(this.Matrix.Rotation, this.Matrix.RotateX, this.Matrix.Rotation);
                mat4.multiply(this.Matrix.Rotation, this.Matrix.RotateZ, this.Matrix.Rotation);
                
                //Build Translation Matrix
                //var Translate2 = mat4.create();
                //mat4.identity(Translate2);
                //mat4.translate(Translate2, [this.Vectors.Position[0] + this.Vectors.Offset[0], this.Vectors.Position[1] + this.Vectors.Offset[1], this.Vectors.Position[2] + this.Vectors.Offset[2]]);
                //mat4.translate(Translate2, [this.Position.x + this.Offset.x, this.Position.y + this.Offset.y, this.Position.z + this.Offset.z]);
                
                //Buidl World Matrix
                mat4.identity(this.Matrix.World);
                mat4.multiply(this.Matrix.World, this.Matrix.Parent.World, this.Matrix.World);
                //mat4.multiply(this.Matrix.Translate, this.Matrix.Rotation, this.Matrix.World );
                mat4.multiply(this.Matrix.World, this.Matrix.Translate, this.Matrix.World );
                mat4.multiply(this.Matrix.World, this.Matrix.Rotation, this.Matrix.World );
                mat4.multiply(this.Matrix.World, this.Matrix.Scale, this.Matrix.World);
                mat4.multiply(this.Matrix.World, offset, this.Matrix.World);
                //mat4.multiply(this.Matrix.World, this.Matrix.Parent.World, this.Matrix.World);
                
                
                
                //mat4.multiply(this.Matrix.World, Translate2, this.Matrix.World);
                //mat4.multiply(this.Matrix.RotateZ, this.Matrix.RotateX, this.Matrix.Rotation);
                //mat4.multiply(this.Matrix.Rotation, this.Matrix.RotateY, this.Matrix.Rotation);
                //
                //mat4.multiply(this.Matrix.Translate, this.Matrix.Rotation, this.Matrix.World);
                //mat4.multiply(this.Matrix.World, this.Matrix.Scale, this.Matrix.World);
                
                //Build Normal Matrix (View Matrix must already be calculated)
                var temp = mat4.create();
                
                //mat4.identity(this.Matrix.Normal);
                //mat4.multiply(this.Matrix.World, os.graphics.Matrix.View, temp);
                //mat4.toInverseMat3(temp, this.Matrix.Normal);
                mat4.toInverseMat3(this.Matrix.World, this.Matrix.Normal);
                mat3.transpose(this.Matrix.Normal, this.Matrix.Normal);
                
                //mat3.transpose(this.Matrix.World, this.Matrix.Normal);
                
                //*********************************
                //  SET TEXTURE
                //*********************************
                if(shd.Program.name == "default"){
                    var useTexture = shd.Uniforms.get("uUseTextures")
                    if(useTexture){
                        if(useTexture.value){
                            if(this.Texture.value())
                            {
                                gl.activeTexture(gl.TEXTURE0);
                                gl.bindTexture(this.Texture.value().type, this.Texture.value().texture);
                                gl.generateMipmap(gl.TEXTURE_2D);   
                                gl.uniform1i(shd.Uniforms.get("uSampler"), 0);
                            }
                            else{
                                throw new Error("Error: Texture Enabled for Entity: " + this.Texture.value().key + " , But No Texture Loaded");
                                
                                //os.windows.Create.ErrorWindow("Texture Error", "Error: Texture Enabled for Entity: " + this.Texture.value().key + " , But No Texture Loaded");
                            }
                        }
                    } 
                }
                else if(this.Texture.size > 0){
                
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(this.Texture.value().type, this.Texture.value().texture);
                    gl.uniform1i(shd.Uniforms.get("uSampler"), 0);
                   
                }
                
                
                
                //*********************************
                //  SET UNIFORMS
                //*********************************
                shd.SetUniforms();
                
                //*********************************
                //  BIND VERTEX BUFFERS
                //*********************************
                shd.BindAttributes(msh);
                
                //*********************************
                //  DRAW MESH
                //*********************************
                msh.Draw();
                
                
            }.bind(this);
            
        }

        return{
            //PUBLIC CLASSES
            
            //PUBLIC ATTRIBUTES
            gl: null,
            Managers: {
                Shader:{
                    Maps: {
                        VertexShaders: new os.resschmgr.Create.Map(),
                        FragmentShaders: new os.resschmgr.Create.Map(),
                        Programs: new os.resschmgr.Create.Map()
                    },
                    Create: {
                        VertexShader: function(key, url){
                            var shd = new CVertexShader(key, url);
                            os.graphics.Managers.Shader.Maps.VertexShaders.put(key,shd);
                            return shd;
                        },
                        FragmentShader: function(key, url){
                            var shd = new CFragmentShader(key, url);
                            os.graphics.Managers.Shader.Maps.FragmentShaders.put(key,shd);
                            return shd;
                        },
                        Program: function(vs, fs, key){
                            //Create Program
                            var prg = new CProgram(vs, fs, key);
                            
                            //Register Program with Manager
                            os.graphics.Managers.Shader.Maps.Programs.put(key, prg);
                            
                            return prg;    
                        },
                        Shader: function(prg){
                            var shd =  new CShader(prg);
                        
                            return shd;
                        },
                        Uniform: function(shdVarName, shdVarType, jsVarPtr){
                            var u = new CUniform(shdVarName, shdVarType, jsVarPtr);
                            
                            return u;
                        },
                        Attribute: function(shdVarName, shdDataType, attributeType){
                            var a = new CAttribute(shdVarName, shdDataType, attributeType)
                            
                            return a;
                        }
                    },
                    SetActiveProgram: function(prg){
                        //Set key to Active Program
                        os.graphics.Managers.Shader.ActiveProgram = prg.name;
                        
                        //Assign Active Program to gl
                        os.graphics.gl.useProgram(prg.program);
                    },
                    ActiveProgram: null
                },
                Mesh:{
                    meshes: os.resschmgr.Create.Map(),
                    totalPolys: 0,
                    totalVerts: 0,
                    Create: {
                        Mesh: function(key, url, json){
                            if(url){
                                var msh = new CMesh(key, url);
                            }
                            else{
                                var msh = new CMesh(key);
                                msh.model = json;
                            }
                            
                            
                            os.graphics.Managers.Mesh.meshes.put(key, msh);
                            
                            return msh;
                        },
                        Primitive: {
                            Cube:   function(key){
                                var msh = new CMesh(key);
                                
                                msh.model = {};
                                msh.model.indices = [
                                    0, 1, 2,      0, 2, 3,    // Front face
                                    4, 5, 6,      4, 6, 7,    // Back face
                                    8, 9, 10,     8, 10, 11,  // Top face
                                    12, 13, 14,   12, 14, 15, // Bottom face
                                    16, 17, 18,   16, 18, 19, // Right face
                                    20, 21, 22,   20, 22, 23  // Left face
                                ];
                                
                                msh.model.vertexNormals = [
                                    // Front face
                                    0.0,  0.0,  1.0,
                                    0.0,  0.0,  1.0,
                                    0.0,  0.0,  1.0,
                                    0.0,  0.0,  1.0,
                            
                                   // Back face
                                    0.0,  0.0, -1.0,
                                    0.0,  0.0, -1.0,
                                    0.0,  0.0, -1.0,
                                    0.0,  0.0, -1.0,
                                   
                                   // Top face
                                    0.0,  1.0,  0.0,
                                    0.0,  1.0,  0.0,
                                    0.0,  1.0,  0.0,
                                    0.0,  1.0,  0.0,
                                   
                                   // Bottom face
                                    0.0, -1.0,  0.0,
                                    0.0, -1.0,  0.0,
                                    0.0, -1.0,  0.0,
                                    0.0, -1.0,  0.0,
                                   
                                   // Right face
                                    1.0,  0.0,  0.0,
                                    1.0,  0.0,  0.0,
                                    1.0,  0.0,  0.0,
                                    1.0,  0.0,  0.0,
                                   
                                   // Left face
                                   -1.0,  0.0,  0.0,
                                   -1.0,  0.0,  0.0,
                                   -1.0,  0.0,  0.0,
                                   -1.0,  0.0,  0.0
                                ];
                                msh.model.vertexPositions = [
                                    //// Front face
                                    -1.0, -1.0,  1.0,
                                     1.0, -1.0,  1.0,
                                     1.0,  1.0,  1.0,
                                    -1.0,  1.0,  1.0,
                                    
                                    // Back face
                                    -1.0, -1.0, -1.0,
                                    -1.0,  1.0, -1.0,
                                     1.0,  1.0, -1.0,
                                     1.0, -1.0, -1.0,
                                    
                                    // Top face
                                    -1.0,  1.0, -1.0,
                                    -1.0,  1.0,  1.0,
                                     1.0,  1.0,  1.0,
                                     1.0,  1.0, -1.0,
                                    
                                    // Bottom face
                                    -1.0, -1.0, -1.0,
                                     1.0, -1.0, -1.0,
                                     1.0, -1.0,  1.0,
                                    -1.0, -1.0,  1.0,
                                    
                                    // Right face
                                     1.0, -1.0, -1.0,
                                     1.0,  1.0, -1.0,
                                     1.0,  1.0,  1.0,
                                     1.0, -1.0,  1.0,
                                    
                                    // Left face
                                    -1.0, -1.0, -1.0,
                                    -1.0, -1.0,  1.0,
                                    -1.0,  1.0,  1.0,
                                    -1.0,  1.0, -1.0
                                ];
                                msh.model.vertexTextureCoords = [
                                    // Front face
                                    0.0, 0.0,
                                    1.0, 0.0,
                                    1.0, 1.0,
                                    0.0, 1.0,
                          
                                    // Back face
                                    1.0, 0.0,
                                    1.0, 1.0,
                                    0.0, 1.0,
                                    0.0, 0.0,
                          
                                    // Top face
                                    0.0, 1.0,
                                    0.0, 0.0,
                                    1.0, 0.0,
                                    1.0, 1.0,
                          
                                    // Bottom face
                                    1.0, 1.0,
                                    0.0, 1.0,
                                    0.0, 0.0,
                                    1.0, 0.0,
                          
                                    // Right face
                                    1.0, 0.0,
                                    1.0, 1.0,
                                    0.0, 1.0,
                                    0.0, 0.0,
                          
                                    // Left face
                                    0.0, 0.0,
                                    1.0, 0.0,
                                    1.0, 1.0,
                                    0.0, 1.0,
                                ];
                                //msh.Initialize();
                                //msh.loaded = true;
                                
                                os.graphics.Managers.Mesh.meshes.put(key, msh);
                                
                                return msh;
                            },
                            Quad: function(key){
                                var msh = new CMesh(key);
                                
                                msh.model ={};
                                msh.model.indices = [
                                    0, 1, 2,
                                    0, 2, 3    
                                ];
                                msh.model.vertexNormals = [
                                    0.0,  0.0,  1.0,
                                    0.0,  0.0,  1.0,
                                    0.0,  0.0,  1.0,
                                    0.0,  0.0,  1.0
                                ];
                                msh.model.vertexPositions =[
                                    -1.0, -1.0,  1.0,
                                     1.0, -1.0,  1.0,
                                     1.0,  1.0,  1.0,
                                    -1.0,  1.0,  1.0
                                ];
                                msh.model.vertexTextureCoords = [
                                    0.0, 0.0,
                                    1.0, 0.0,
                                    1.0, 1.0,
                                    0.0, 1.0
                                ];
                                
                                os.graphics.Managers.Mesh.meshes.put(key, msh);
                                
                                return msh;
                            }
                        },
                        Instanced: function(sMesh, sKey, number){
                            //Mesh to be instanced
                            var msh = os.graphics.Managers.Mesh.GetMesh(sMesh);
                            
                            //Instanced Mesh
                            var out = os.graphics.Managers.Mesh.Create.Mesh(sKey);
                            
                            //Building Model Buffers
                            out.model = {};
                            out.model.indices = [];
                            out.model.vertexNormals = [];
                            out.model.vertexPositions = [];
                            out.model.vertexTextureCoords = [];
                            out.model.instance = [];
                            
                            for(var i = 0; i < number; i++){
                                
                                out.model.vertexPositions = out.model.vertexPositions.concat(msh.model.vertexPositions);
                                out.model.vertexNormals = out.model.vertexNormals.concat(msh.model.vertexNormals);
                                out.model.vertexTextureCoords = out.model.vertexTextureCoords.concat(msh.model.vertexTextureCoords);
                                //out.model.indices = out.model.indices.concat(msh.model.indices);
                                
                                for(var j = 0; j < msh.model.indices.length; j++){
                                    out.model.indices.push(msh.model.indices[j] + (i * msh.numOfVerts));
                                    //out.model.indices.push(msh.model.indices[j]);
                                    
                                }
                                
                                for(var k = 0; k < msh.numOfVerts; k++){
                                    out.model.instance.push(i);
                                }
                            }
                            
                            out.instanced = true;
                            os.graphics.Managers.Mesh.meshes.put(sKey, out);
                            
                            return out;
                        }
                    },
                    
                    GetMesh: function(key){
                        return os.graphics.Managers.Mesh.meshes.get(key);
                    }
                    
                },
                Sprite:{
                },
                Texture:{
                    textures: new os.resschmgr.Create.Map(),
                    Create: {
                        Texture:   function(key, url){
                            var tex = new CTexture(key, url);
                            
                            os.graphics.Managers.Texture.textures.put(key, tex);
                            
                            return tex;
                        },
                        CubeMap: function(key){
                            var tex = new CCubeMap(key);
                            
                            os.graphics.Managers.Texture.textures.put(key, tex);
                            
                            return tex;
                        },
                        RenderTexture: function(sKey, iWidth, iHeight){
                            var tex = new CRenderTexture(sKey, iWidth, iHeight);
                            os.graphics.Managers.Texture.textures.put(sKey, tex);
                            
                            return tex;
    
                        }
                    },
                    GetTexture: function(key){
                       return os.graphics.Managers.Texture.textures.get(key);
                    }
                },
                Entity:{
                    Entities: new os.resschmgr.Create.Map(),
                    _count: 0,
                    Create : function(program, id){
                        var entID;
                        
                        //If ID passed in, use as key for entity map
                        //  otherwise increment count and place in entity map
                        if(id){
                            entID = id;
                            os.graphics.Managers.Entity._count++;
                        }
                        else{
                            entID = os.graphics.Managers.Entity._count++;
                        }
                        
                        //Create Base Entity
                        var ent =  new os.resschmgr.Create.Entity(entID);
                        
                        //Add Graphics Object to Entity
                        os.graphics.Managers.Entity.EnableGraphics(ent, program);
                        

                        return ent;
                        
                    },
                    EnableGraphics: function(ent, program){
                        
                        ent.Graphics = new CGraphicsEntity(ent);
                        
                        //Add Default shader to object if program is set to default or not defined
                        if((!program) || (program == "default")){
                            
                                                         //shader name , program name
                            var shd = ent.Graphics.Add.Shader("default", "default");
                            
                            //Add Attributes
                            //shd.AddAttribute(shdVarName, shdDataType, jsBufferPointer, attributeType, itemSize);
                            shd.AddAttribute("aVertexPosition", "FLOAT", null, "VERTEX", null);
                            shd.AddAttribute("aVertexMargin", "FLOAT", null, "MARGIN", null);
                            shd.AddAttribute("aVertexNormal", "FLOAT", null, "NORMAL", null);
                            shd.AddAttribute("aTextureCoord","FLOAT", null, "TEXTURE", null);
                                                        

                            //Add Uniforms to Entity
                            //shd.AddUniform(shdVarName, shdVarType, jsVarPtr);
                            shd.AddUniform("uPMatrix", "4X4", os.graphics.Matrix.Projection);
                            shd.AddUniform("uVMatrix", "4X4", os.graphics.Matrix.View);
                            shd.AddUniform("uWMatrix", "4X4", ent.Graphics.Matrix.World);
                            shd.AddUniform("uNMatrix", "3X3", ent.Graphics.Matrix.Normal);
                            
                            //Control Variables
                            shd.AddUniform("uShowSpecularHighlights", "BOOL", true);
                            shd.AddUniform("uUseTextures", "BOOL", true);
                            shd.AddUniform("uUseLighting", "BOOL", true);
                            shd.AddUniform("uUseBlendColor", "BOOL", false);
                            shd.AddUniform("uEnableAlpha", "BOOL", false);
                            shd.AddUniform("uUseFog", "BOOL", false);
                            shd.AddUniform("uUseInstacing", "BOOL", false);
                            shd.AddUniform("uAligned", "BOOL", false);
                            
                            //Lighting Variables
                            shd.AddUniform("uMaterialShininess", "FLOAT", 1.0);
                            shd.AddUniform("uAmbientColor", "VEC3", [0.6,0.6,0.6]);
                            
                            shd.AddUniform("uPointLightDiffuseColor", "VEC3", [0.8,0.8,0.8]);
                            shd.AddUniform("uPointLightSpecularColor", "VEC3", [0.8,0.8,0.8]);
                            shd.AddUniform("uPointLightLocation", "VEC3", [0.0, 0.0, -100.0]);
                            
                            
                            //Fog Variables
                            shd.AddUniform("uFogColor", "VEC3", [0.0,0.0,0.0]);
                            shd.AddUniform("uFogEndPosition", "FLOAT", 100.0);
                            shd.AddUniform("uFogBeginPosition", "FLOAT", 10.0);
                            shd.AddUniform("uCameraPosition", "VEC3", os.graphics.Managers.Camera.Position);
                            
                            //Material Coloring
                            shd.AddUniform("uBlendColor", "VEC3", [0.0,0.0,0.0]);
                            shd.AddUniform("uAlphaValue", "FLOAT", 1.0);
                            
                            //Margin Variables
                            shd.AddUniform("uLowMarginEnable", "BOOL", false);
                            shd.AddUniform("uHighMarginEnable", "BOOL", false);
                            shd.AddUniform("uLowMarginValue", "FLOAT", 2.0);
                            shd.AddUniform("uHighMarginValue", "FLOAT", 5.0);
                            
                            //Texture Sampler
                            //Texture Handled independently at the momemnt
                            
                            //Instanced Variables
                            ent.Graphics.Instanced = {};
                            ent.Graphics.Instanced.position = [0,0,0];
                            
                            shd.AddUniform("uInstancePosition", "ARRAY_VEC3", ent.Graphics.Instanced.position);
                            
                            //Add Accessor Object to Adjust Uniforms
                            ent.Graphics.Set = {};
                            ent.Graphics.Set.lowMarginEnable = function(va){
                                var shd = this.Graphics.Shaders.get("default");
                                    shd.Uniforms.get("uLowMarginEnable").value = val;
                            }
                            ent.Graphics.Set.highMarginEnable = function(va){
                                var shd = this.Graphics.Shaders.get("default");
                                    shd.Uniforms.get("uHighMarginEnable").value = val;
                            }
                            
                            ent.Graphics.Set.lowMarginValue = function(va){
                                var shd = this.Graphics.Shaders.get("default");
                                    shd.Uniforms.get("uLowMarginValue").value = val;
                            }
                            ent.Graphics.Set.highMarginValue = function(va){
                                var shd = this.Graphics.Shaders.get("default");
                                    shd.Uniforms.get("uHighMarginValue").value = val;
                            }
                            ent.Graphics.Set.aligned = function(val){
                                    var shd = this.Graphics.Shaders.get("default");
                                    shd.Uniforms.get("uAligned").value = val;
                                    
                                }.bind(ent);
                            ent.Graphics.Set.ambientColor = function(color){
                                var shd = this.Graphics.Shaders.get("default");
                                shd.Uniforms.get("uAmbientColor").value = color;
                            }.bind(ent);
                            ent.Graphics.Set.light = function(val){
                                
                                    var shd = this.Graphics.Shaders.get("default");
                                    shd.Uniforms.get("uUseLighting").value = val;
                                    
                                }.bind(ent);
                            ent.Graphics.Set.specular = function(val){
                                
                                    var shd = this.Graphics.Shaders.get("default");
                                    shd.Uniforms.get("uShowSpecularHighlights").value = val;
                                    
                                }.bind(ent);
                            ent.Graphics.Set.shininess = function(val){
                                var shd = this.Graphics.Shaders.get("default");
                                shd.Uniforms.get("uMaterialShininess").value = val;
                            }.bind(ent)
                            ent.Graphics.Set.texture = function(val){
                                
                                    var shd = this.Graphics.Shaders.get("default");
                                    shd.Uniforms.get("uUseTextures").value = val;
                                    
                                }.bind(ent);
                            ent.Graphics.Set.fog = function(val){
                                
                                    var shd = this.Graphics.Shaders.get("default");
                                    shd.Uniforms.get("uUseFog").value = val;
                                    
                                }.bind(ent);
                            ent.Graphics.Set.fogColor = function(val){
                                
                                    var shd = this.Graphics.Shaders.get("default");
                                    shd.Uniforms.get("uFogColor").value = val;
                                    
                                }.bind(ent);
                            ent.Graphics.Set.fogBeginPosition = function(val){
                                
                                    var shd = this.Graphics.Shaders.get("default");
                                    shd.Uniforms.get("uFogBeginPosition").value = val;
                                    
                                }.bind(ent);
                            ent.Graphics.Set.fogEndPosition = function(val){
                                
                                    var shd = this.Graphics.Shaders.get("default");
                                    shd.Uniforms.get("uFogEndPosition").value = val;
                                    
                                }.bind(ent);
                            ent.Graphics.Set.glow = function(val){
                                
                                    var shd = this.Graphics.Shaders.get("default");
                                    shd.Uniforms.get("uUseGlow").value = val;
                                    
                                }.bind(ent);
                            ent.Graphics.Set.useBlendColor = function(val){
                                
                                    var shd = this.Graphics.Shaders.get("default");
                                    shd.Uniforms.get("uUseBlendColor").value = val;
                                    
                                }.bind(ent);
                            ent.Graphics.Set.blendColor = function(val){
                                
                                    var shd = this.Graphics.Shaders.get("default");
                                    shd.Uniforms.get("uBlendColor").value = val;
                                    
                                }.bind(ent);
                            ent.Graphics.Set.enableAlpha = function(val){
                                
                                    var shd = this.Graphics.Shaders.get("default");
                                    shd.Uniforms.get("uEnableAlpha").value = val;
                                    
                                }.bind(ent);
                            ent.Graphics.Set.alphaValue = function(val){
                                
                                    var shd = this.Graphics.Shaders.get("default");
                                    shd.Uniforms.get("uAlphaValue").value = val;
                                    
                                }.bind(ent);
                            
                            

                        }
                        
                        ent.Position = vec3.create();
                        ent.yaw = 0;
                        ent.pitch = 0;
                        ent.roll = 0;
                        
                        ent.Set.Position = function(x, y, z){
                            this.Position[0] = x;
                            this.Position[1] = y;
                            this.Position[2] = z;
                        }.bind(ent);
                        
                        ent.Set.Rotation = function(x,y,z){
                            this.yaw = y;
                            this.pitch = x;
                            this.roll = z;
                        }.bind(ent);
                        ent.Set.Scale = function(x,y,z){
                                vec3.set([x,y,z], this.Graphics.Vectors.Scale);
                        }.bind(ent);
                        
                        ent.Default = {
                            Look:  vec3.create([0,0,1]),
                            Right: vec3.create([1,0,0]),
                            Up:    vec3.create([0,1,0]),
                            Rotation: mat4.create(),
                            Offset: vec3.create([0,0,0])
                        }
                        
                        ent.Axis = {
                            Look:  vec3.create(ent.Default.Look),
                            Right: vec3.create(ent.Default.Right),
                            Up:    vec3.create(ent.Default.Up)
                            
                        }
                        
                        
                        ent.Matrix = {
                            Yaw:   mat4.create(),
                            Pitch: mat4.create(),
                            Roll:  mat4.create(),
                            Rotation: mat4.create()
                        };
                        mat4.identity(ent.Default.Rotation);
                        ent.Graphics.CalculateRotationMatrix = function(){
                            //Reset Axis
                            vec3.set(this.Default.Up,  this.Axis.Up);
                            vec3.set(this.Default.Look, this.Axis.Look);
                            vec3.set(this.Default.Right,  this.Axis.Right);
                            
                            //Clear Rotation Matrices
                            mat4.identity(this.Matrix.Yaw);
                            mat4.identity(this.Matrix.Pitch);
                            mat4.identity(this.Matrix.Roll);
                            
                            //Calculate Rotations
                            
                            mat4.rotate(this.Matrix.Yaw, degToRad(this.yaw), this.Axis.Up);
                            mat4.multiplyVec3(this.Matrix.Yaw, this.Axis.Look);
                            mat4.multiplyVec3(this.Matrix.Yaw, this.Axis.Right);
                            
                            mat4.rotate(this.Matrix.Pitch, degToRad(this.pitch), this.Axis.Right);
                            mat4.multiplyVec3(this.Matrix.Pitch, this.Axis.Look);
                            mat4.multiplyVec3(this.Matrix.Pitch, this.Axis.Up);

                            mat4.rotate(this.Matrix.Roll, degToRad(this.roll), this.Axis.Look);
                            mat4.multiplyVec3(this.Matrix.Roll, this.Axis.Right);
                            mat4.multiplyVec3(this.Matrix.Roll, this.Axis.Up);
                            
                            var pos = vec3.create([ent.Position[0], ent.Position[1], ent.Position[2]]);
                            
                            ent.Matrix.Rotation[0] =  this.Axis.Right[0];
                            ent.Matrix.Rotation[1] =  this.Axis.Up[0];
                            ent.Matrix.Rotation[2] =  this.Axis.Look[0];
                            ent.Matrix.Rotation[3] =  0;
                            ent.Matrix.Rotation[4] =  this.Axis.Right[1];
                            ent.Matrix.Rotation[5] =  this.Axis.Up[1];
                            ent.Matrix.Rotation[6] =  this.Axis.Look[1];
                            ent.Matrix.Rotation[7] =  0;
                            ent.Matrix.Rotation[8] =  this.Axis.Right[2];
                            ent.Matrix.Rotation[9] =  this.Axis.Up[2];
                            ent.Matrix.Rotation[10] = this.Axis.Look[2];
                            ent.Matrix.Rotation[11] = 0;
                            ent.Matrix.Rotation[12] = -1 * vec3.dot(pos, this.Axis.Right);//-(x0*eyex + x1*eyey + x2*eyez);
                            ent.Matrix.Rotation[13] = -1 * vec3.dot(pos, this.Axis.Up);   //-(y0*eyex + y1*eyey + y2*eyez);
                            ent.Matrix.Rotation[14] = -1 * vec3.dot(pos, this.Axis.Look); //-(z0*eyex + z1*eyey + z2*eyez);
                            ent.Matrix.Rotation[15] = 1;
                            
                            return ent.Matrix.Rotation;
                        }.bind(ent);
                        
                        ent.Move = {
                            Forward: function(distance){
                                
                                this.Position[0] += this.Axis.Look[0] * distance;
                                this.Position[1] += this.Axis.Look[1] * distance;
                                this.Position[2] += this.Axis.Look[2] * distance;
                            
                            }.bind(ent),
                            Backward: function(distance){
                               
                                this.Position[0] -= this.Axis.Look[0] * distance;
                                this.Position[1] -= this.Axis.Look[1] * distance;
                                this.Position[2] -= this.Axis.Look[2] * distance;
                                
                            }.bind(ent),
                            Left: function(distance){
                                
                                this.Position[0] -= this.Axis.Right[0] * distance;
                                this.Position[1] -= this.Axis.Right[1] * distance;
                                this.Position[2] -= this.Axis.Right[2] * distance;
                                
                            }.bind(ent),
                            Right: function(distance){
                                
                                this.Position[0] += this.Axis.Right[0] * distance;
                                this.Position[1] += this.Axis.Right[1] * distance;
                                this.Position[2] += this.Axis.Right[2] * distance;
                                
                            }.bind(ent),
                            Up: function(distance){
                                 
                                this.Position[0] += this.Axis.Up[0] * distance;
                                this.Position[1] += this.Axis.Up[1] * distance;
                                this.Position[2] += this.Axis.Up[2] * distance;
                                
                            }.bind(ent),
                            Down: function(distance){
                                 
                                this.Position[0] -= this.Axis.Up[0] * distance;
                                this.Position[1] -= this.Axis.Up[1] * distance;
                                this.Position[2] -= this.Axis.Up[2] * distance;
                                
                            }.bind(ent)
                        }
                        ent.AttachCamera = function(x, y, z){
                                vec3.set([x,y,z],ent.CameraOffset);
                                
                                os.graphics.Managers.Camera.Position = ent.Position;
                                os.graphics.Managers.Camera.Offset = ent.CameraOffset;
                        }
                        ent.CameraOffset = vec3.create();
                        
                        
                        return ent;
                    }
                },
                Camera:{
                    Position: vec3.create([0,0,0]),
                    Offset: vec3.create([0,0,0]),
                    Attach: function(ent){
                        
                        os.graphics.Managers.Camera.attachedEntity = ent;
                        vec3.set([0,0,0], os.graphics.Managers.Camera.Offset);
                        
                        if(ent){
                            os.graphics.Managers.Camera.attached = true;
                        }
                        else
                            os.graphics.Managers.Camera.attached = false;
                    },
                    attached: false,
                    attachedEntity: null,
                    Rotation: {
                        yaw:   0,
                        pitch: 0,
                        roll:  0
                    },
                    LookAtPoint: {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    Axis: {
                        Look:  vec3.create([0,0,-1]),
                        Right: vec3.create([1,0,0]),
                        Up:    vec3.create([0,1,0])
                    },
                    Matrix: {
                        Yaw:   mat4.create(),
                        Pitch: mat4.create(),
                        Roll:  mat4.create(),
                        Rotation: mat4.create(),
                        Translate: mat4.create()
                    },
                    MoveForward: function(distance){
                        var pos = vec3.create(os.graphics.Managers.Camera.Position);
                        
                        mat4.multiplyVec4(os.graphics.Matrix.View, [0,0,-1*distance,0], pos);
                        
                        os.graphics.Managers.Camera.Position[0] += pos[0];
                        os.graphics.Managers.Camera.Position[1] += pos[1];
                        os.graphics.Managers.Camera.Position[2] += pos[2];
                    },
                    MoveBackward: function(distance){
                        var pos = vec3.create(os.graphics.Managers.Camera.Position);
                        
                        mat4.multiplyVec4(os.graphics.Matrix.View, [0,0,distance,0],pos);
                        
                        os.graphics.Managers.Camera.Position[0] += pos[0];
                        os.graphics.Managers.Camera.Position[1] += pos[1];
                        os.graphics.Managers.Camera.Position[2] += pos[2];
                        
                    },
                    MoveLeft: function(distance){
                        var pos = vec3.create(os.graphics.Managers.Camera.Position);
                        
                        mat4.multiplyVec4(os.graphics.Matrix.View, [-1*distance,0,0,0],pos);
                        
                        os.graphics.Managers.Camera.Position[0] += pos[0];
                        os.graphics.Managers.Camera.Position[1] += pos[1];
                        os.graphics.Managers.Camera.Position[2] += pos[2];
                    },
                    MoveRight: function(distance){
                        var pos = vec3.create(os.graphics.Managers.Camera.Position);
                        
                        mat4.multiplyVec4(os.graphics.Matrix.View, [distance,0,0,0],pos);
                        
                        os.graphics.Managers.Camera.Position[0] += pos[0];
                        os.graphics.Managers.Camera.Position[1] += pos[1];
                        os.graphics.Managers.Camera.Position[2] += pos[2];
                    },
                    MoveUp: function(distance){
                        var pos = vec3.create(os.graphics.Managers.Camera.Position);
                        
                        mat4.multiplyVec4(os.graphics.Matrix.View, [0,distance,0,0],pos);
                        
                        os.graphics.Managers.Camera.Position[0] += pos[0];
                        os.graphics.Managers.Camera.Position[1] += pos[1];
                        os.graphics.Managers.Camera.Position[2] += pos[2];
                    },
                    MoveDown: function(distance){
                        var pos = vec3.create(os.graphics.Managers.Camera.Position);
                        
                        mat4.multiplyVec4(os.graphics.Matrix.View, [0,-1*distance,0,0],pos);
                        
                        os.graphics.Managers.Camera.Position[0] += pos[0];
                        os.graphics.Managers.Camera.Position[1] += pos[1];
                        os.graphics.Managers.Camera.Position[2] += pos[2];            
                    },
                    Roll: function(angle){
                        
                    },
                    Pitch: function(angle){
                        
                    },
                    Yaw: function(angle){
                        
                    },
                    CalculateViewMatrix: function(){
                        var cam = os.graphics.Managers.Camera;
                        var pos;
                        
                        if(cam.attached)
                        {
                                pos = vec3.create([cam.attachedEntity.Position[0], cam.attachedEntity.Position[1], cam.attachedEntity.Position[2]]);
                                pos[0] += cam.Axis.Look[0] * cam.Offset[2];
                                pos[1] += cam.Axis.Look[1] * cam.Offset[2];
                                pos[2] += cam.Axis.Look[2] * cam.Offset[2];
                                
                                pos[0] += cam.Axis.Right[0] * cam.Offset[0];
                                pos[1] += cam.Axis.Right[1] * cam.Offset[0];
                                pos[2] += cam.Axis.Right[2] * cam.Offset[0];
                                
                                pos[0] += cam.Axis.Up[0] * cam.Offset[1];
                                pos[1] += cam.Axis.Up[1] * cam.Offset[1];
                                pos[2] += cam.Axis.Up[2] * cam.Offset[1];
                        }
                        else{
                                pos = vec3.create([cam.Position[0], cam.Position[1], cam.Position[2]]);
                        }
                        
                        //Reset Axis
                        vec3.set([0,1,0],  os.graphics.Managers.Camera.Axis.Up);
                        vec3.set([0,0,-1], os.graphics.Managers.Camera.Axis.Look);
                        vec3.set([1,0,0],  os.graphics.Managers.Camera.Axis.Right);
                        
                        //Clear Rotation Matracies
                        mat4.identity(os.graphics.Managers.Camera.Matrix.Yaw);
                        mat4.identity(os.graphics.Managers.Camera.Matrix.Pitch);
                        mat4.identity(os.graphics.Managers.Camera.Matrix.Roll);
                        
                        mat4.rotate(os.graphics.Managers.Camera.Matrix.Yaw, degToRad(os.graphics.Managers.Camera.Rotation.yaw), os.graphics.Managers.Camera.Axis.Up);
                        mat4.multiplyVec3(os.graphics.Managers.Camera.Matrix.Yaw, os.graphics.Managers.Camera.Axis.Look);
                        mat4.multiplyVec3(os.graphics.Managers.Camera.Matrix.Yaw, os.graphics.Managers.Camera.Axis.Right);
                        
                        mat4.rotate(os.graphics.Managers.Camera.Matrix.Pitch, degToRad(os.graphics.Managers.Camera.Rotation.pitch), os.graphics.Managers.Camera.Axis.Right);
                        mat4.multiplyVec3(os.graphics.Managers.Camera.Matrix.Pitch, os.graphics.Managers.Camera.Axis.Look);
                        mat4.multiplyVec3(os.graphics.Managers.Camera.Matrix.Pitch, os.graphics.Managers.Camera.Axis.Up);
                        
                        mat4.rotate(os.graphics.Managers.Camera.Matrix.Roll, degToRad(os.graphics.Managers.Camera.Rotation.roll), os.graphics.Managers.Camera.Axis.Look);
                        mat4.multiplyVec3(os.graphics.Managers.Camera.Matrix.Roll, os.graphics.Managers.Camera.Axis.Right);
                        mat4.multiplyVec3(os.graphics.Managers.Camera.Matrix.Roll, os.graphics.Managers.Camera.Axis.Up);

                        
                        os.graphics.Matrix.View[0] =  os.graphics.Managers.Camera.Axis.Right[0];
                        os.graphics.Matrix.View[1] =  os.graphics.Managers.Camera.Axis.Up[0];
                        os.graphics.Matrix.View[2] =  os.graphics.Managers.Camera.Axis.Look[0];
                        os.graphics.Matrix.View[3] =  0;
                        os.graphics.Matrix.View[4] =  os.graphics.Managers.Camera.Axis.Right[1];
                        os.graphics.Matrix.View[5] =  os.graphics.Managers.Camera.Axis.Up[1];
                        os.graphics.Matrix.View[6] =  os.graphics.Managers.Camera.Axis.Look[1];
                        os.graphics.Matrix.View[7] =  0;
                        os.graphics.Matrix.View[8] =  os.graphics.Managers.Camera.Axis.Right[2];
                        os.graphics.Matrix.View[9] =  os.graphics.Managers.Camera.Axis.Up[2];
                        os.graphics.Matrix.View[10] = os.graphics.Managers.Camera.Axis.Look[2];
                        os.graphics.Matrix.View[11] = 0;
                        os.graphics.Matrix.View[12] = -1 * vec3.dot(pos, os.graphics.Managers.Camera.Axis.Right);//-(x0*eyex + x1*eyey + x2*eyez);
                        os.graphics.Matrix.View[13] = -1 * vec3.dot(pos, os.graphics.Managers.Camera.Axis.Up);   //-(y0*eyex + y1*eyey + y2*eyez);
                        os.graphics.Matrix.View[14] = -1 * vec3.dot(pos, os.graphics.Managers.Camera.Axis.Look); //-(z0*eyex + z1*eyey + z2*eyez);
                        os.graphics.Matrix.View[15] = 1;
                        
                        
                        
                    },
                    ResetAxis: function(){
                        
                    },
                    GetViewMatrix: function(){
                        
                    }
                }
            },
            Matrix: {
                Projection: mat4.create(),
                View: mat4.create()
            },
            Time: {
                current:    0,
                previous:   0,
                elapsed:    0,
                dt:         0
            },
            
            Get: {
                Canvas: function(){return _canvas;},
                Pause: function(){return _pause;},
                Fullscreen: function(){return _fullscreen;},
                Width: function(){return _width;},
                Height: function(){return _height;}
            },
            Set: {
                Callback:{
                    Update: function(updateFunction, updateScope){
                        _update = updateFunction;
                        _updateScope = updateScope;
                    },
                    Draw: function(drawFunction, drawScope){
                        _draw = drawFunction;
                        _drawScope = drawScope;
                    },
                    Reset: function(resetFunction, resetScope){
                        _reset = resetFunction;
                        _resetScope = resetScope;
                    }
                    
                },
                Fullscreen: function(isFullscreen){
                    //Call 
                },
                Viewport: function(width, height){
                    
                }
            },
            Maps: {
                update: null,
                draw: null,
                name2id: null
            },
            
            //PUBLIC PRIVILEDGE METHODS
            Initialize: function(){
                //Initialize Managers
                
                //Create Entity Maps
                os.graphics.Maps.update = os.resschmgr.Create.Map();
                os.graphics.Maps.draw = os.resschmgr.Create.Map();
                os.graphics.Maps.name2id = os.resschmgr.Create.Map();
                
                //Create mat4 for Matrices
                os.graphics.Matrix.View = mat4.create();
                os.graphics.Matrix.Projection = mat4.create();
                
                //Load Default Vertex and Fragment Shaders
            },
            Load: function(isDebug, isFullscreen, canvas){
                
                //If Canvas was passed in, use it, otherwise create a canvas object
                if(canvas){ _canvas = canvas; }
                else{ _canvas = document.createElement("canvas"); }
                
                //Set attribute to fullscreen if value exist
                if(isFullscreen){ _fullscreen = true;}
                else{_fullscreen = false;}
                
                //Create Debug context, otherwise create standard WebGL context
                if(isDebug){ os.graphics.gl = WebGLDebugUtils.makeDebugContext(_get3DContext(_canvas, {preserveDrawingBuffer: true}));}
                else{ os.graphics.gl = _get3DContext(_canvas);}
                
                var gl = os.graphics.gl;
                
                
                //Set Default Camera Position
                //mat4.lookAt( [0,0,-1000], [0,0,0], [0,1,0],os.graphics.Matrix.View);
                os.graphics.Managers.Camera.Position[0] = 0;
                os.graphics.Managers.Camera.Position[1] = 0;
                os.graphics.Managers.Camera.Position[2] = -500;
                os.graphics.Managers.Camera.Rotation.pitch = 0;
                os.graphics.Managers.Camera.Rotation.yaw = 0;
                os.graphics.Managers.Camera.Rotation.roll = 0
                
                os.graphics.Managers.Camera.CalculateViewMatrix();
                
                _canvas.width = _canvas.clientWidth;
                _canvas.height = _canvas.clientHeight;
                
                //Set ViewPort
                mat4.perspective(45, _canvas.clientWidth / _canvas.clientHeight, 0.1, 10000.0, os.graphics.Matrix.Projection);
                gl.viewport(0,0,_canvas.clientWidth, _canvas.clientHeight);
                
                
                
                
                //_canvas.addEventListener("onchange", os.graphics.OnReset, false);
                window.onresize = os.graphics.OnReset;
        
        
                //Set Clear Color (r,g,b,a)
                //gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.clearColor(0.2745, 0.435, 0.812, 1.0);
                //gl.clearColor(0.6275, 0.2353, 0.7843, 1.0);
                
                //Enable Depth Testing
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(gl.LESS);
                
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
                //Verify WebGL context was created
                //  download, build and complie default Shader and Program
                if(_canvas){
                
                    //Download and compile Default Shaders
                    os.graphics.Managers.Shader.Create.VertexShader("default", "scripts/jahova/OS/Cores/Graphics/shaders/default.vs");
                    os.graphics.Managers.Shader.Create.FragmentShader("default", "scripts/jahova/OS/Cores/Graphics/shaders/default.fs");
                    
                    //Build Default Program and Link
                    var prg = os.graphics.Managers.Shader.Create.Program("default", "default", "default");
                    
                    //Add Attributes to Default Program
                    prg.CreateAttribute("aVertexPosition");
                    prg.CreateAttribute("aVertexMargin");
                    prg.CreateAttribute("aVertexNormal");
                    prg.CreateAttribute("aTextureCoord");
                    
                    //Add Uniforms to Default Program
                    prg.CreateUniform("uPMatrix");
                    prg.CreateUniform("uVMatrix");
                    prg.CreateUniform("uWMatrix");
                    prg.CreateUniform("uNMatrix");
                    prg.CreateUniform("uShowSpecularHighlights");
                    prg.CreateUniform("uUseTextures");
                    prg.CreateUniform("uUseLighting");
                    prg.CreateUniform("uUseBlendColor");
                    prg.CreateUniform("uUseInstacing");
                    prg.CreateUniform("uInstancePosition");
                    prg.CreateUniform("uAmbientColor");
                    prg.CreateUniform("uBlendColor");
                    prg.CreateUniform("uPointLightSpecularColor");
                    prg.CreateUniform("uPointLightDiffuseColor");
                    prg.CreateUniform("uPointLightLocation");
                    prg.CreateUniform("uMaterialShininess");
                    prg.CreateUniform("uSampler");
                    prg.CreateUniform("uUseFog");
                    prg.CreateUniform("uCameraPosition");
                    prg.CreateUniform("uFogColor");
                    prg.CreateUniform("uFogEndPosition");
                    prg.CreateUniform("uFogBeginPosition");
                    prg.CreateUniform("uEnableAlpha");
                    prg.CreateUniform("uAlphaValue");
                    prg.CreateUniform("uAligned");
                    prg.CreateUniform("uLowMarginEnable");
                    prg.CreateUniform("uLowMarginValue");
                    prg.CreateUniform("uHighMarginEnable");
                    prg.CreateUniform("uHighMarginValue");

                }
                
                
                return _canvas;
                
            },
            Start: function(){
                if(!_pause){
                    requestAnimFrame(os.graphics.Start);
                    
                    os.graphics.Update();
                    
                    os.graphics.Draw();
                }
            },
            Pause: function(){
                if(!_pause){
                    
                    _pause = true;
                    
                }
                else{
                    os.graphics.Resume();
                }
            },
            Resume: function(){
                if(_pause){
                    
                    _pause = false;
                    
                    //Restore Time and Call os.graphics.Start()
                        //Save Previous
                    os.graphics.Time.previous = os.graphics.Time.current;
                    
                        //Get Current
                    os.graphics.Time.current = (new Date()).getTime();
                    
                        //Increment elapsed time with stored dt
                    os.graphics.Time.elapsed += os.graphics.Time.dt;
                    
                    os.graphics.Start();
                }
            },            
            Update: function(){
                
                //Update Time
                    //Save Previous
                os.graphics.Time.previous = os.graphics.Time.current;
                
                    //Get Current
                os.graphics.Time.current = (new Date()).getTime();
                
                    //Calculate dt
                os.graphics.Time.dt = os.graphics.Time.current - os.graphics.Time.previous;
                
                    //Increment elapsed time
                os.graphics.Time.elapsed += os.graphics.Time.dt;
                
                //Call user defined update funciton (if exist)
                if(_update){
                    
                    //If scope was set, call using scope, otherwise call directly
                    if(_updateScope){ _update.apply(_updateScope, os.graphics.Time.dt); }
                    else{ _update(os.graphics.Time.dt);}
                }
                
                //Loop through os.graphics.Maps.update and call Update(os.graphics.Time.dt) methods
                for(var i = os.graphics.Maps.update.size; i--; os.graphics.Maps.update.next())
                        os.graphics.Maps.update.value().Graphics.Update(os.graphics.Time.dt);
                
            },
            Draw: function(){
                var gl = os.graphics.gl;
                
                //Reset Poly/Vert Count
                os.graphics.Managers.Mesh.totalPolys = 0;
                os.graphics.Managers.Mesh.totalVerts = 0;
                
                os.graphics.Managers.Camera.CalculateViewMatrix();
        
                //Clear Color and Depth Buffers
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                
                //Call user defined draw function (if exist)
                if(_draw){
                    
                    //If scope was set, call using scope, otherwise call directly
                    if(_drawScope){ _draw.apply(_drawScope, os.graphics.Time.dt); }
                    else{ _draw(os.graphics.Time.dt);}
                }

                //Loop through os.graphics.Maps.draw and call Draw() methods
                for(var i = os.graphics.Maps.draw.size; i--; os.graphics.Maps.draw.next())
                        os.graphics.Maps.draw.value().Graphics.Draw();
            },
            AddToWorld: function(entity){
                os.graphics.AddToDraw(entity);
                os.graphics.AddToUpdate(entity);
            },
            AddToDraw: function(entity){
                os.graphics.Maps.draw.put(entity.ID(), entity);
            },
            AddToUpdate: function(entity){
                os.graphics.Maps.update.put(entity.ID(), entity);
            },
            RemoveFromWorld: function(ent){
                os.graphics.RemoveFromDraw(ent);
                os.graphics.RemoveFromUpdate(ent);
            },
            RemoveFromDraw: function(ent){
                os.graphics.Maps.draw.remove(ent.ID());
            },
            RemoveFromUpdate: function(ent){
                os.graphics.Maps.update.remove(ent.ID());
            },
            OnReset: function(){
                //Set ViewPort
                _canvas.width = _canvas.clientWidth;
                _canvas.height = _canvas.clientHeight;
                
                //Call user defined reset funciton (if exist)
                if(_reset){
                    
                    //If scope was set, call using scope, otherwise call directly
                    if(_resetScope){ _reset.apply(_resetScope, os.graphics.Time.dt); }
                    else{ _reset(os.graphics.Time.dt);}
                }
                
                
                
                os.graphics.gl.viewport(0,0,_canvas.clientWidth, _canvas.clientHeight);
                mat4.perspective(45, _canvas.clientWidth / _canvas.clientHeight, 0.1, 10000.0, os.graphics.Matrix.Projection);

            },
            
            GetName: function(){
                return NAME;
            },
            
            GetVersion: function(){
                return VERSION;
            },
            
            GetPath: function(){
                return PATH;
            },
           
            GetID: function(){
                return ID;
            } 
            
        }
    }
    
    return {
        //OBJECT ACCESSOR
        Instance: function()
        {
            if(!pInstance)
            {
                //Instantiate if pInstance does not exist
                pInstance = constructor();
            }
            
            return pInstance;
        }
    }
})();