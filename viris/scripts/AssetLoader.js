/************************
 * GRAPHICS DEFINITIONS *
 ***********************/

//models
const MODEL_PLAT_BORDER    = 3  ;
const MODEL_PLAT_FAN       = 4  ;
const MODEL_STATION        = 5  ;
const MODEL_COM_SAT_BASE   = 6  ;
const MODEL_COM_SAT_DISH   = 7  ;
const MODEL_MINE_FAC_BASE  = 8  ;
const MODEL_MINE_FAC_FAN   = 9  ;
const MODEL_MINE_FAC_WHEEL = 10 ;
const MODEL_MINE_FAC_FULL  = 11 ;
const MODEL_CHARGER        = 12 ;
const MODEL_ROBOT          = 13 ;

//textures
const TEX_FLOOR_GRATING = 100 ;
const TEX_FLOOR_TILE    = 101 ;
const TEX_FLOOR_BASE    = 102 ;
const TEX_CANCER_LEVEL  = 103 ;
const TEX_PRIMARY_3DRT  = 104 ;
const TEX_COM_SAT       = 105 ;
const TEX_MINE_FAC      = 106 ;
const TEX_STATION       = 107 ;

//materials
const MAT_BUILD_WIREFRAME  = 5000 ;
const MAT_BUILD_LASER      = 5001 ;
const MAT_BUILD_LASER_GLOW = 5002 ;
const MAT_COM_WAVE         = 5003 ;
const MAT_PRIMARY_3DRT     = 5004 ;
const MAT_COM_SAT          = 5005 ;
const MAT_MINE_FAC         = 5006 ;
const MAT_STATION          = 5007 ;
const MAT_HOLOGRAM         = 5008 ;

//geoms
const GEOM_BUILD_LASER_CONE = 10000 ;
const GEOM_BUILD_LASER      = 10001 ;
const GEOM_ROBOT_HOVER      = 10002 ;
const GEOM_ROBOT_SCAN       = 10003 ;

//mesh
const MESH_COM_WAVE           = 20000 ;
const MESH_FLOOR_GRATING      = 20001 ;
const MESH_FLOOR_BASE         = 20002 ;
const MESH_FLOOR_GAME_LEVEL   = 20003 ;
const MESH_FLOOR_CANCER_LEVEL = 20004 ;

AssetLoader = function()
{
    const buildLaserLength = 4000 ;
    const robotScanLength  = 2500 ;
    
    var   loadPhase  = 0     ;
    var   activeLoad = false ;
    var   loadArray  = new Array() ;
    
    // Load Skybox
    loadArray.push( function()
    {
        gworld.setSkybox( "images/skybox/space_pos_x.png" ,
                          "images/skybox/space_neg_x.png" ,
                          "images/skybox/space_pos_y.png" ,
                          "images/skybox/space_neg_y.png" ,
                          "images/skybox/space_pos_z.png" ,
                          "images/skybox/space_neg_z.png" , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Load Station Texture
    loadArray.push( function()
    {
        gworld.createNewTexture( "images/station.jpg" , true , 1  , 1 , TEX_STATION , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Load Station Material
    loadArray.push( function()
    {
        var mat = new THREE.MeshLambertMaterial( { map : gworld.getGfxObjPtr( TEX_STATION ) } ) ;
        gworld.storeNewGfxObj( MAT_STATION ,  mat ) ;
        finished( MAT_STATION ) ;
    } ) ;
    
    // Load primary 3DRT Texture
    loadArray.push( function()
    {
        gworld.createNewTexture( "images/3drt_const_kit_blue.jpg" , true , 1  , 1 , TEX_PRIMARY_3DRT , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Load primary 3DRT Material
    loadArray.push( function()
    {
        var mat = new THREE.MeshLambertMaterial( { map : gworld.getGfxObjPtr( TEX_PRIMARY_3DRT ) } ) ;
        gworld.storeNewGfxObj( MAT_PRIMARY_3DRT ,  mat ) ;
        finished( MAT_PRIMARY_3DRT ) ;
    } ) ;
    
    // Load Com Sat Texture
    loadArray.push( function()
    {
        gworld.createNewTexture( "images/com_sat.jpg" , true , 1  , 1 , TEX_COM_SAT , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Load Com sat Material
    loadArray.push( function()
    {
        var mat = new THREE.MeshLambertMaterial( { map   : gworld.getGfxObjPtr( TEX_COM_SAT ) ,
                                                   color : 0xaaaaaa } );
        gworld.storeNewGfxObj( MAT_COM_SAT , mat ) ;
        finished( MAT_COM_SAT ) ;
    } ) ;
    
    // Load Mine Fac Texture
    loadArray.push( function()
    {
        gworld.createNewTexture( "images/mine_fac.jpg" , true , 1  , 1 , TEX_MINE_FAC , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Load Mine Fac Material
    loadArray.push( function()
    {
        var mat = new THREE.MeshLambertMaterial( { map   : gworld.getGfxObjPtr( TEX_MINE_FAC ) ,
                                                   color : 0xaaaaaa } );
        gworld.storeNewGfxObj( MAT_MINE_FAC , mat ) ;
        finished( MAT_MINE_FAC ) ;
    } ) ;
    
    // Load Build Wireframe Material
    loadArray.push( function()
    {
        var mat = new THREE.MeshLambertMaterial( { color     : 0x3333ff             ,
                                                   ambient   : 0x1111ff             ,
                                                   emissive  : 0x1111ff             ,
                                                   wireframe : true                 ,
                                                   side      : THREE.FrontSide      ,
                                                   shading   : THREE.FlatShading    ,
                                                   blending  : THREE.NormalBlending
                                                 } ) ;
        gworld.storeNewGfxObj( MAT_BUILD_WIREFRAME , mat ) ;
        finished( MAT_BUILD_WIREFRAME ) ;
    } ) ;
    
    // Load Hologram Material
    loadArray.push( function()
    {
        var mat = new THREE.ShaderMaterial( { uniforms       : HologramShaderUniforms        ,
                                              vertexShader   : HologramShader.vertexShader   ,
                                              fragmentShader : HologramShader.fragmentShader ,
                                              side           : THREE.FrontSide               ,
                                              blending       : THREE.AdditiveBlending        ,
                                              transparent    : true                          ,
                                              wireframe      : true
                                            } ) ;
        gworld.storeNewGfxObj( MAT_HOLOGRAM , mat ) ;
        finished( MAT_HOLOGRAM ) ;
    } ) ;
    
    // Load Laser Line Material
    loadArray.push( function()
    {
        var mat = new THREE.MeshBasicMaterial( { color    : 0x9898ff ,
                                                 opacity  : 1.0      ,
                                                 blending : THREE.AdditiveBlending 
                                               } ) ;
        gworld.storeNewGfxObj( MAT_BUILD_LASER , mat ) ;
        finished( MAT_BUILD_LASER ) ;
    } ) ;
    
    // Load Laser Glow Material
    loadArray.push( function()
    {
        var mat = new THREE.MeshLambertMaterial( { color    : 0x1118ff ,
                                                   opacity  : 1.0      ,
                                                   blending : THREE.AdditiveBlending 
                                                 } ) ;
        gworld.storeNewGfxObj( MAT_BUILD_LASER_GLOW , mat ) ;
        finished( MAT_BUILD_LASER_GLOW ) ;
    } ) ;
    
    // Load Com Wave Material
    loadArray.push( function()
    {
        var mat = new THREE.MeshLambertMaterial( { color       : 0x1118ff ,
                                                   opacity     : 1.0      ,
                                                   transparent : true     ,
                                                   blending    : THREE.AdditiveBlending 
                                                 } ) ;
        gworld.storeNewGfxObj( MAT_COM_WAVE , mat ) ;
        finished( MAT_COM_WAVE ) ;
    } ) ;
    
    // Load Laser Cone Geom
    loadArray.push( function()
    {
        var geom = new THREE.CylinderGeometry( 0 , 1750 , buildLaserLength , 32 , 32 , true ) ;
        geom.applyMatrix( new THREE.Matrix4().makeTranslation( 0 , -buildLaserLength / 2 , 0 ) ) ;
        geom.applyMatrix( new THREE.Matrix4().makeRotationFromEuler( new THREE.Euler( -PI_2 , 0 , 0 , "XYZ" ) ) ) ;
        gworld.storeNewGfxObj( GEOM_BUILD_LASER_CONE , geom ) ;
        finished( GEOM_BUILD_LASER_CONE ) ;
    } ) ;
    
    // Load Laser Line Geom
    loadArray.push( function()
    {
        var geom = new THREE.CylinderGeometry( 20 , 10 , buildLaserLength , 5 , 5 , true ) ;
        geom.applyMatrix( new THREE.Matrix4().makeTranslation( 0 , -buildLaserLength / 2 , 0 ) ) ;
        geom.applyMatrix( new THREE.Matrix4().makeRotationFromEuler( new THREE.Euler( -PI_2 , 0 , 0 , "XYZ" ) ) ) ;
        gworld.storeNewGfxObj( GEOM_BUILD_LASER , geom ) ;
        finished( GEOM_BUILD_LASER ) ;
    } ) ;
    
    // Load Robot Hover Geom
    loadArray.push( function()
    {
        var geom = new THREE.CylinderGeometry( 500 , 100 , 1000 , 32 , 32 , true ) ;
        gworld.storeNewGfxObj( GEOM_ROBOT_HOVER , geom ) ;
        finished( GEOM_ROBOT_HOVER ) ;
    } ) ;
    
    // Load Robot Scan Geom
    loadArray.push( function ()
    {
        var geom = new THREE.CylinderGeometry( 0 , 1750 , robotScanLength , 32 , 32 , true ) ;
        geom.applyMatrix( new THREE.Matrix4().makeTranslation( 0 , ( -robotScanLength / 2 ) , 0 ) ) ;
        geom.applyMatrix( new THREE.Matrix4().makeScale( 1 , 1 , 0.1 ) ) ;
        geom.applyMatrix( new THREE.Matrix4().makeRotationFromEuler( new THREE.Euler( -PI_2 / 1.5 , 0 , 0 , "XYZ" ) ) ) ;
        gworld.storeNewGfxObj( GEOM_ROBOT_SCAN , geom ) ;
        finished( GEOM_ROBOT_SCAN ) ;
    } ) ;
    
    // Load Com Wave Geom
    loadArray.push( function()
    {
        gworld.startStaticMeshGroup( MAT_COM_WAVE ) ;
        gworld.createStaticTorus( 0 , 0 ,   0  , 0 , 0 , 0 , 200 , 50 , 3 , 32 ) ;
        gworld.createStaticTorus( 0 , 0 , 600  , 0 , 0 , 0 , 200 , 50 , 3 , 32 ) ;
        gworld.createStaticTorus( 0 , 0 , 1200 , 0 , 0 , 0 , 200 , 50 , 3 , 32 ) ;
        gworld.createStaticTorus( 0 , 0 , 1800 , 0 , 0 , 0 , 200 , 50 , 3 , 32 ) ;
        var mesh = gworld.closeStaticMeshGroup() ;
        mesh.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0 , 0 , -1800 ) ) ;
        gworld.storeNewGfxObj( MESH_COM_WAVE , mesh ) ;
        finished( MESH_COM_WAVE ) ;
    } ) ;
    
    // Load Main Floor Texture
    loadArray.push( function()
    {
        gworld.createNewTexture( "images/metal_FloorHoles_1k_d.jpg" , true , 10 , 10 , TEX_FLOOR_TILE , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Load Grate Texture
    loadArray.push( function()
    {
        gworld.createNewTexture( "images/transparent_grate.png" , true , 1  , 1 , TEX_FLOOR_GRATING , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Load Floor Base Texture
    loadArray.push( function()
    {
        gworld.createNewTexture( "images/Metal_FloorPanelModular_1k_d.jpg" , true , 1  , 1 , TEX_FLOOR_BASE , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Load Cancer Level Texture
    loadArray.push( function()
    {
        gworld.createNewTexture( "images/cancer_level.jpg" , true , 1  , 1 , TEX_CANCER_LEVEL , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Load Platform Edge Model
    loadArray.push( function()
    {
        gworld.createNewObjMesh( "models/plat_border.obj" , MODEL_PLAT_BORDER , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Load Platform Fan Model
    loadArray.push( function()
    {
        gworld.createNewObjMesh( "models/plat_fan.obj" , MODEL_PLAT_FAN , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Load Station Model
    loadArray.push( function()
    {
        gworld.createNewObjMesh( "models/station.obj" , MODEL_STATION , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Load Com Sat Base Model
    loadArray.push( function()
    {
        gworld.createNewObjMesh( "models/com_sat_base.obj" , MODEL_COM_SAT_BASE , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Load Come Sat Dish Model
    loadArray.push( function()
    {
        gworld.createNewObjMesh( "models/com_sat_dish.obj" , MODEL_COM_SAT_DISH , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Load Mine Facility Base Model
    loadArray.push( function()
    {
        gworld.createNewObjMesh( "models/mine_fac_base.obj" , MODEL_MINE_FAC_BASE , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Load Mine Facility Fan Model
    loadArray.push( function()
    {
        gworld.createNewObjMesh( "models/mine_fac_fan.obj" , MODEL_MINE_FAC_FAN , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Load Mine Facility Wheel
    loadArray.push( function()
    {
        gworld.createNewObjMesh( "models/mine_fac_wheel.obj" , MODEL_MINE_FAC_WHEEL , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Load Mine facility Full Model 
    loadArray.push( function()
    {
        gworld.createNewObjMesh( "models/mine_fac_full.obj" , MODEL_MINE_FAC_FULL , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Load Charger Model
    loadArray.push( function()
    {
        gworld.createNewObjMesh( "models/charger.obj" , MODEL_CHARGER , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Load Robot Model
    loadArray.push( function()
    {
        gworld.createNewObjMesh( "models/robot.obj" , MODEL_ROBOT , finished ) ;
        activeLoad = true ;
    } ) ;
    
    // Apply Station
    loadArray.push( function()
    {
        setSharedMat( MODEL_STATION , MAT_STATION ) ;
        finished( -1 ) ;
    } ) ;
    
    // Apply 3DRT Material
    loadArray.push( function()
    {
        setSharedMat( MODEL_PLAT_BORDER , MAT_PRIMARY_3DRT ) ;
        setSharedMat( MODEL_PLAT_FAN    , MAT_PRIMARY_3DRT ) ;
        setSharedMat( MODEL_CHARGER     , MAT_PRIMARY_3DRT ) ;
        setSharedMat( MODEL_ROBOT       , MAT_PRIMARY_3DRT ) ;
        finished( -1 ) ;
    } ) ;
    
    // Apply Com Sat Material
    loadArray.push( function()
    {
        setSharedMat( MODEL_COM_SAT_BASE , MAT_COM_SAT ) ;
        setSharedMat( MODEL_COM_SAT_DISH , MAT_COM_SAT ) ;
        finished( -1 ) ;
    } ) ;
    
    // Apply Mine Facility Material
    loadArray.push( function()
    {
        setSharedMat( MODEL_MINE_FAC_BASE  , MAT_MINE_FAC        ) ;
        setSharedMat( MODEL_MINE_FAC_FAN   , MAT_MINE_FAC        ) ;
        setSharedMat( MODEL_MINE_FAC_WHEEL , MAT_MINE_FAC        ) ;
        setSharedMat( MODEL_MINE_FAC_FULL  , MAT_BUILD_WIREFRAME ) ;
        finished( -1 ) ;
    } ) ;
    
    // Create Floor Grate Mesh
    loadArray.push( function()
    {
        gworld.startStaticMeshGroup( TEX_FLOOR_GRATING , 1.0 ) ;
        gworld.createStaticPlane( -25600 , 0 , -7667 , -PI_2 , 0 , 0 , 8400 , 7667 , 1 , 1 ) ;
        gworld.createStaticPlane( -25600 , 0 ,  7667 , -PI_2 , 0 , 0 , 8400 , 7667 , 1 , 1 ) ;
        gworld.createStaticPlane(  25600 , 0 , -7667 , -PI_2 , 0 , 0 , 8400 , 7667 , 1 , 1 ) ;
        gworld.createStaticPlane(  25600 , 0 ,  7667 , -PI_2 , 0 , 0 , 8400 , 7667 , 1 , 1 ) ;
        gworld.storeNewGfxObj( MESH_FLOOR_GRATING , gworld.closeStaticMeshGroup() ) ;
        finished( -1 ) ;
    } ) ;
    
    // Create Floor Base Mesh
    loadArray.push( function ()
    {
        gworld.startStaticMeshGroup( TEX_FLOOR_BASE ) ;
        gworld.createStaticPlane( -25600 , 0 , 0 , -PI_2 , 0 , 0 , 8400 , 7667 , 1 , 1 ) ;
        gworld.createStaticPlane(  25600 , 0 , 0 , -PI_2 , 0 , 0 , 8400 , 7667 , 1 , 1 ) ;
        gworld.storeNewGfxObj( MESH_FLOOR_BASE , gworld.closeStaticMeshGroup() ) ;
        finished( -1 ) ;
    } ) ;
    
    // Create Game Level Floor
    loadArray.push( function()
    {
        gworld.startStaticMeshGroup( TEX_FLOOR_TILE ) ;
        gworld.createStaticPlane( 0 , 0 , 0 , -PI_2 , 0 , 0 , 42800 , 40960 , 100 , 100 ) ;
        gworld.storeNewGfxObj( MESH_FLOOR_GAME_LEVEL , gworld.closeStaticMeshGroup() ) ;
        finished( -1 ) ;
    } ) ;
    
    // Create Cancer Level Floor
    loadArray.push( function()
    {
        gworld.startStaticMeshGroup( TEX_CANCER_LEVEL ) ;
        gworld.createStaticPlane( 0 , -10 , 0 , -PI_2 , 0 , 0 , 42800 , 40960 , 1 , 1 ) ;
        gworld.storeNewGfxObj( MESH_FLOOR_CANCER_LEVEL , gworld.closeStaticMeshGroup() ) ;
        finished( -1 ) ;
    } ) ;
    
    // Preload some material and object pairs (doens't matter what material is on what obj to get it in GPU memory)
    loadArray.push( function()
    {
        gworld.preloadMeshObj( gworld.getGfxObjPtr( MODEL_MINE_FAC_BASE  ) ) ;
        gworld.preloadMeshObj( gworld.getGfxObjPtr( MODEL_MINE_FAC_FAN   ) ) ;
        gworld.preloadMeshObj( gworld.getGfxObjPtr( MODEL_MINE_FAC_WHEEL ) ) ;
        gworld.preloadMeshObj( gworld.getGfxObjPtr( MODEL_MINE_FAC_FULL  ) ) ;
        finished( -1 ) ;
    } ) ;
    
    // Set shared material id to the given mesh id's children
    function setSharedMat( meshID , matID )
    {
        var mesh = gworld.getGfxObjPtr( meshID ) ;
        var mat  = gworld.getGfxObjPtr( matID  ) ;
                
        for( var i = 0 ; i < mesh.children.length ; i++ )
        {
            mesh.children[ i ].material = mat ;
        }
    }
    
    function finished( id )
    {
        loadPhase++ ;
        activeLoad = false ;
    }
    
    this.loadUpdate = function( delta )
    {
        if( !activeLoad )
        {
            loadArray[ loadPhase ]() ;
        }
        
        return ( loadPhase / loadArray.length ) ;
    } ;
    
    this.cleanup = function()
    {
        loadArray.length = 0 ;
    }
} ;

var GlobalAssetLoader ;

function initAssetLoader()
{
    GlobalAssetLoader = new AssetLoader() ;
}