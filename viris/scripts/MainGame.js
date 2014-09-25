var canvas          = document.createElement("canvas");
canvas.screencanvas = true;
canvas.width        = window.innerWidth;
canvas.height       = window.innerHeight;
document.body.appendChild( canvas );

var stats;
var rendererStats;
var gworld;
var time;

//Pre-initialization. Setup the initial environment, load models before the scene is ready to be built
function preInit()
{
    stats = new Stats() ;
    stats.domElement.style.position = 'absolute'  ;
    stats.domElement.style.top      = '0px'       ;
    stats.domElement.style.zIndex   = 100         ;
    document.body.appendChild( stats.domElement ) ;
    
    rendererStats  = new THREEx.RendererStats() ;
    rendererStats.domElement.style.position = 'absolute'  ;
    rendererStats.domElement.style.left     = '0px'       ;
    rendererStats.domElement.style.bottom   = '0px'       ;
    document.body.appendChild( rendererStats.domElement ) ;
    
    gworld = new GraphicsWorld( canvas ) ;
    time   = Date.now() ;
    
    var perc = 0.0 ;
    
    initAssetLoader   () ;
    initEntityManager () ;
    initControls      () ;
    
    loading() ;
}

//Post-initialization, after all the graphics environment is setup, the scene can be setup
function postInit()
{
    initScene          () ;
    initTaskManager    () ;
    initSandbox        () ;
}

//active frame when models are loading
function loading()
{
    var perc = GlobalAssetLoader.loadUpdate() ;
    
    console.log( "Percent Loaded" , perc ) ;
    
    if( perc < 1.0 )
    {
        requestAnimationFrame( loading ) ;
    }
    else
    {
        GlobalAssetLoader.cleanup();
        postInit () ;
        draw     () ;
    }
}

//active frame when the scene is rendering
function draw()
{
    var now   = Date.now() ;
    var delta = now - time ;
    
    time = now ;
    
    stats.update() ;
    rendererStats.update( gworld.renderer ) ;
    
    updateEntityManager  ( delta ) ;
    updateControls       ( delta ) ;
    updateTaskManager    ( delta ) ;
    updateSandbox        ( delta ) ;
    
    TWEEN.update() ;
    
    requestAnimationFrame( draw ) ;
    gworld.render() ;
}

preInit() ;