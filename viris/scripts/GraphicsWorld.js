/***********
 * DEFINES *
 **********/
const PI_2 = Math.PI / 2 ;
const PI   = Math.PI     ;

/******************
 * GRAPHICS WORLD *
 *****************/
function GraphicsWorld( canvas )
{
    // store the scope of this object
    var scope = this ;
    
    // ThreeJS Renderer
    this.renderer = new THREE.WebGLRenderer( { canvas : canvas } ) ;
    
    // camera setup variables
    const nearPlane  = 150    ; // Near PLane
    const farPlane   = 700000 ; // Far Plane
    const fov        = 60     ; // Field of View
    
    // Light setup
    const maxPointLights = 3 ; // Maximum Number of Point Lights to be added to the scene
    const maxDirLights   = 1 ; // Maximum Number of Directional Lights to be added to the scene
    const maxAmbLights   = 1 ; // Maximum Number of Ambient Lights to be added to the scene
    
    var curPointLightIdx = 0 ;
    var curDirLightIdx   = 0 ;
    var curAmbLightIdx   = 0 ;
    
    var pointLightArray = [] ;
    var dirLightArray   = [] ;
    var ambLightArray   = [] ;
    
    // calculated viewport information
    var appWidth     = ( window.innerWidth  / window.devicePixelRatio ) ; // Width of the rendering application
    var appHeight    = ( window.innerHeight / window.devicePixelRatio ) ; // Height of the application
    var appSizeRatio = appWidth / appHeight ;                             // Size Ration for the camera
    
    // Containers
    var graphicsMap = new Object() ; // Stores graphics information such as meshes, textures, objects, etc
    
    // World Setup
    this.scene    = new THREE.Scene() ;                                                        // Primary rendering scene
    this.eyepoint = new THREE.PerspectiveCamera( fov , appSizeRatio , nearPlane , farPlane ) ; // Primary scene eyepoint
    
    // Memory Scene
    var memScene = new THREE.Scene() ;
    var memCam   = new THREE.PerspectiveCamera( 100 , 1 , 0.1 , 10000 ) ;
    memCam.position.z = 0 ;
    
    // Skybox Setup
    var skyScene  = new THREE.Scene() ;                                                        // Skybox Scene
    var skyCam    = new THREE.PerspectiveCamera( fov , appSizeRatio , nearPlane , farPlane ) ; // Skybox Camera
    var skyLoaded = false ;                                                                    // Flag if the skybox has been loaded
    
    // Set some rendering options
    this.renderer.autoClear = false ;               // Disable the auto-clear because we will be using a skybox
    this.renderer.setSize( appWidth , appHeight ) ; // Set the renderer application size
    
    // Mesh group setup variables for primitive shapes ( spheres, cubes, planes, etc )
    var activeMeshGeom       ; // The active mesh geometry being built
    var activeMaterialId     ; // The material ID to assign to the active mesh when it's complete
    var activeMaterialOpaque ; // The opacity of the material being applied
    var inMeshGroup = false  ; // Flag to determine if we are in a mesh group or not during the mesh building process
    
    // Point Light Allocation
    for( var i = 0 ; i < maxPointLights ; i++ )
    {
        var light = new THREE.PointLight() ;
        light.intensity = 0.0 ;
        light.distance  = 0.0 ;
        pointLightArray.push ( light ) ;
        scope.scene.add      ( light ) ;
    }
    
    // Directional Light Allocation
    for( var i = 0 ; i < maxDirLights ; i++ )
    {
        var light = new THREE.DirectionalLight() ;
        light.intensity = 0.0 ;
        dirLightArray.push ( light ) ;
        scope.scene.add    ( light ) ;
    }
    
    // Ambient Light Allocation
    for( var i = 0 ; i < maxAmbLights ; i++ )
    {
        var light = new THREE.AmbientLight() ;
        ambLightArray.push ( light ) ;
        scope.scene.add    ( light ) ;
    }
    
    // Issue an allocated point light
    this.issuePointLight = function()
    {
        if( pointLightArray.length != 0 )
        {
            return pointLightArray.pop() ;
        }
        else
        {
            console.log( "No more point lights to issue! Allocate more in GraphicsWorld.js" ) ;
        }
    } ;
    
    // Issue an allocated directional light
    this.issueDirLight = function()
    {
        if( dirLightArray.length != 0 )
        {
            return dirLightArray.pop() ;
        }
        else
        {
            console.log( "No more directional lights to issue! Allocate more in GraphicsWorld.js" ) ;
        }
    } ;
    
    // Issue an allocated ambient light
    this.issueAmbLight = function()
    {
        if( ambLightArray.length != 0 )
        {
            return ambLightArray.pop() ;
        }
        else
        {
            console.log( "No more ambient lights to issue! Allocate more in GraphicsWorld.js" ) ;
        }
    } ;
    
    // Start a new mesh group for primitive shapes
    this.startStaticMeshGroup = function( tex_id , op )
    {
        if( !inMeshGroup )
        {
            activeMaterialOpaque = op                   ;
            activeMaterialId     = tex_id               ;
            activeMeshGeom       = new THREE.Geometry() ;
            inMeshGroup          = true                 ;
        }
        else
        {
            console.log( "Tried to start new mesh group without closing the previous!" ) ;
        }
    } ;
    
    // Close a mesh group for primitive shapes
    this.closeStaticMeshGroup = function()
    {
        if( inMeshGroup )
        {
            var graphic = graphicsMap[ activeMaterialId ] ;
            
            var material ;
            
            if( graphic instanceof THREE.Material )
            {
                material = graphic ;
            }
            else if( graphic instanceof THREE.Texture )
            {
                var material = new THREE.MeshLambertMaterial( { map     : graphic  ,
                                                                color   : 0xffffff ,
                                                                ambient : 0xdedede } ) ;
            }
            else
            {
                console.log( "closeStaticMeshGroup - Error: Unknown reference to create material" ) ;
                return ;
            }
        
            if( activeMaterialOpaque )
            {
                material.transparent = true                 ;
                material.opacity     = activeMaterialOpaque ;
            }
            
            scope.warmShader( material ) ;
            
            var mesh = new THREE.Mesh( activeMeshGeom , material ) ;
            
            inMeshGroup = false ;
            
            return mesh ;
        }
        else
        {
            console.log( "Tried to close mesh group without starting it first!" ) ;
        }
    } ;
    
    // Build a speific mesh into the active mesh group
    function addGeomToGroup( geometry , px , py , pz , rx , ry , rz , stationary )
    {
        if( inMeshGroup )
        {
            var mesh = new THREE.Mesh( geometry ) ;
            
            mesh.position.set( px , py , pz ) ;
            mesh.rotation.set( rx , ry , rz ) ;
            
            if( stationary )
            {
                mesh.matrixAutoUpdate = false ;
            }
            
            mesh.updateMatrix() ;
        
            activeMeshGeom.merge(  mesh.geometry , mesh.matrix ) ; // merge the geometry together
        }
        else
        {
            console.log( "Adding a new mesh, but you are not in a mesh group! Nothing will be added" ) ;
        }
    }
    
    // Create a cube ( position, rotation, scale ) -- Works with active mesh groupings
    this.createStaticCube = function( px , py , pz ,
                              rx , ry , rz ,
                              sx , sy , sz )
    {
        var geometry = new THREE.CubeGeometry( sx , sy , sz ) ;
        addGeomToGroup( geometry , px , py , pz , rx , ry , rz , true ) ;
    } ;
    
    // Create a cylinder ( position, rotation, scale, segments, open ended ) -- Works with active mesh groupings
    this.createStaticCylinder = function( px , py , pz ,
                                  rx , ry , rz ,
                                  sx , sy , sz ,
                                  segx , segy ,
                                  open )
    {
        var geometry = new THREE.CylinderGeometry( sx , sz , sy , segx , segy , open ) ;
        addGeomToGroup( geometry , px , py , pz , rx , ry , rz , true ) ;
    } ;
    
    // Create a Torus ( position, rotation, radius, segments, arc ) -- Works with active mesh groupings
    this.createStaticTorus = function( px , py , pz ,
                               rx , ry , rz ,
                               rad , tube ,
                               radSeg , radTub ,
                               arc )
    {
        var geometry = new THREE.TorusGeometry( rad , tube , radSeg , radTub , arc ) ;
        addGeomToGroup( geometry , px , py , pz , rx , ry , rz , false ) ;
    } ;
    
    // Create a plane ( position, rotation, scale, segments ) -- Works with active mesh groupings
    this.createStaticPlane = function( px , py , pz ,
                               rx , ry , rz ,
                               sx , sy ,
                               segx , segy )
    {
        var geometry = new THREE.PlaneGeometry( sx , sy , segx , segy ) ;
        addGeomToGroup( geometry , px , py , pz , rx , ry , rz , true ) ;
    } ;
    
    // Se the skybox
    this.setSkybox = function( px , nx , py , ny , pz , nz , cb )
    {
        var paths = [ px, nx, py, ny, pz, nz ] ;
        var textureCube = THREE.ImageUtils.loadTextureCube( paths , null , cb ) ;
        
        textureCube.format = THREE.RGBFormat ;
        
        var shader = THREE.ShaderLib[ "cube" ] ;
        shader.uniforms[ "tCube" ].value = textureCube ;
        
        var material = new THREE.ShaderMaterial(
        {
            fragmentShader : shader.fragmentShader ,
            vertexShader   : shader.vertexShader   ,
            uniforms       : shader.uniforms       ,
            depthWrite     : false                 ,
            side           : THREE.BackSide
        } ) ;
        
        var skybox = new THREE.Mesh( new THREE.BoxGeometry( 5000 , 5000 , 5000 ) , material ) ;
        
        // add it to the scene
        skyScene.add( skybox ) ;
        
        skyLoaded = true ;
    } ;
    
    // get the pointer to the graphics object so it can be modified
    this.getGfxObjPtr = function( id )
    {
        return graphicsMap[ id ] ;
    } ;
    
    // access a stored ThreeJS object that was loaded
    this.cloneGfxObj = function( id )
    {
        var clone = graphicsMap[ id ].clone() ;
        return clone ;
    } ;
    
    // store new Gfx Object
    this.storeNewGfxObj = function( id , obj )
    {
        graphicsMap[ id ] = obj ;
        
        if( obj instanceof THREE.Material )
        {
            scope.warmShader( obj ) ;
        }
    } ;
    
    // access stored collada information
    this.getCollada = function( id )
    {
        return colladaMap[ id ] ;
    } ;
    
    // Load a new OBJ with MTL model
    this.createNewObjMesh = function( objPath , id , cb )
    {
        var loader = new THREE.OBJLoader() ;
        
        loader.load( objPath , function( object )
        {
            graphicsMap[ id ] = object ;
            cb( id ) ;
        } ) ;
    } ;
    
    // Create a new texture and store it
    this.createNewTexture = function( texturePath , repeat , segx , segy , id , cb )
    {
        THREE.ImageUtils.loadTexture( texturePath , null , function( tex )
        {
            if( repeat )
            {
                tex.wrapS = tex.wrapT = THREE.RepeatWrapping ;
                tex.repeat.set( segx , segy ) ;
            }
            
            graphicsMap[ id ] = tex ;
            cb( id ) ;
        } ) ;
    } ;
    
    // Preload the mesh object to the GPU
    this.preloadMeshObj = function( mesh )
    {
        mesh.position.z = -100 ;
        memScene.add( mesh ) ;
        scope.renderer.render( memScene , memCam ) ;
    } ;
    
    // pre-compile a material's shader
    this.warmShader = function( mat )
    {
        gworld.renderer.initMaterial( mat , gworld.scene.__lights , gworld.scene.fog ) ;
    } ;
    
    // Graphics rendering function
    this.render = function()
    {
        skyCam.rotation.copy( scope.eyepoint.rotation ) ;
        
        // If the sky is loaded, then render it
        if( skyLoaded )
        {
            scope.renderer.render( skyScene , skyCam ) ;
        }
        
        // Render the primary scene
        scope.renderer.render( scope.scene , scope.eyepoint ) ;
    };
        
    // Resize event if the window changes
    function onWindowResized( event )
    {
        // calculate the new application size info
        appWidth     = window.innerWidth / window.devicePixelRatio ;
        appHeight    = window.innerHeight / window.devicePixelRatio ;
        appSizeRatio = appWidth / appHeight ;
        
        // set the new size in the renderer
        scope.renderer.setSize( appWidth , appHeight ) ;
        
        // update the primary rendering eyepoint
        scope.eyepoint.projectionMatrix.makePerspective( fov , appSizeRatio , nearPlane , farPlane ) ;
        
        // if the skybox is loaded then update then update the skybox camera information
        if( skyLoaded )
        {
            skyCam.projectionMatrix.makePerspective( fov , appSizeRatio , nearPlane , farPlane ) ;
        }
    }

    // Add the resize event listener in case the window changes size
    window.addEventListener( 'resize' , onWindowResized , false ) ;
}