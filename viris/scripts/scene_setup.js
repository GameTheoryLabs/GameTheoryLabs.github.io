var GlobalRobot   = null ;
var GlobalComSat  = null ;
var GlobalStation = null ;
var GlobalCharger = null ;
var GlobalMineFacilities = [];

var hasQueuedScene   = false ;
var activeFloorTween = 0     ;

function queueScript()
{
    if( hasQueuedScene )
    {
        return ;
    }
    
    hasQueuedScene = true ;
    
    GlobalTaskManager.queueCommunication( GlobalComSat.ENTITY_ID , GlobalStation.ENTITY_ID ) ;
    
    //move to starting position from the charger
    GlobalTaskManager.queueMove( 19000 ,      0 , 2500 , false ) ;
    GlobalTaskManager.queueMove( 19000 , -18000 , 4000 , true  ) ;
    GlobalTaskManager.queueWait( 500 ) ;
    
    //start scanning on first row
    GlobalTaskManager.queueMove( -19000 , -18000 , 8000 , true ) ;
    GlobalTaskManager.queueMove( -19000 , -14500 , 2000 , true ) ;
    
    //start scanning on second row
    GlobalTaskManager.queueMove( 19000 , -14500 , 8000 , true ) ;
    GlobalTaskManager.queueMove( 19000 , -11000 , 2000 , true ) ;
    
    //start scanning third row - build!
    GlobalTaskManager.queueMove  ( -15000 , -11000 , 7000 , true ) ;
    GlobalTaskManager.queueWait  (   1000 ) ; //found something, pause
    GlobalTaskManager.queueMove  ( -19000 , -11000 , 1000 , false ) ;
    GlobalTaskManager.queueBuild ( -14000 , -10000 ) ;
    GlobalTaskManager.queueWait  (   1000 ) ;
    GlobalTaskManager.queueMove  ( -19000 , -7500 , 2000 , true ) ;
    
    //start scanning fourth row
    GlobalTaskManager.queueMove(  19000 , -7500 , 8000 , true ) ;
    GlobalTaskManager.queueMove(  19000 , -4000 , 2000 , true ) ;
    
    //start scanning fifth row
    GlobalTaskManager.queueMove( -19000 , -4000 , 8000 , true ) ;
    GlobalTaskManager.queueMove( -19000 , -500  , 2000 , true ) ;
    
    //start scanning sixth row
    GlobalTaskManager.queueMove(  19000 , -500 , 8000 , true ) ;
    GlobalTaskManager.queueMove(  19000 , 3000 , 2000 , true ) ;
    
    //start scanning seventh row
    GlobalTaskManager.queueMove( -19000 , 3000 , 8000 , true ) ;
    GlobalTaskManager.queueMove( -19000 , 6500 , 2000 , true ) ;
    
    //start scanning eighth row
    GlobalTaskManager.queueMove( 19000 ,  6500 , 8000 , true ) ;
    GlobalTaskManager.queueMove( 19000 , 10000 , 2000 , true ) ;
    
    //start scanning ninth row
    GlobalTaskManager.queueMove( -19000 , 10000 , 8000 , true ) ;
    GlobalTaskManager.queueMove( -19000 , 13500 , 2000 , true ) ;
    
    //start scanning tenth row - build!
    GlobalTaskManager.queueMove  ( 3000 , 13500 , 5000 , true ) ;
    GlobalTaskManager.queueWait  ( 1000 ) ; //found something, pause
    GlobalTaskManager.queueMove  ( 8000  , 13500 , 1000 , false ) ;
    GlobalTaskManager.queueBuild ( 1800  , 14700 ) ;
    GlobalTaskManager.queueMove  ( 19000 , 14700 , 3000 , true ) ;
    GlobalTaskManager.queueMove  ( 19000 , 18200 , 2000 , true ) ;
    
    //start scanning eleventh row - build!
    GlobalTaskManager.queueMove ( -19000 , 18200 , 8000 , true ) ;
    
    //done scanning, move back to the charger
    GlobalTaskManager.queueMove ( 25700 , 0 , 7000 , false ) ;
    GlobalTaskManager.queueCommunication( GlobalComSat.ENTITY_ID , GlobalStation.ENTITY_ID ) ;
}

function initScene()
{
    //Lighting Setup

    var ambient = gworld.issueAmbLight() ;
    ambient.visible = true ;
    ambient.color.setHex( 0x121212 ) ;

    var directionalLight = gworld.issueDirLight() ;
    directionalLight.visible = true ;
    directionalLight.color.setHex( 0xbebebe ) ;
    directionalLight.intensity = 1.75 ;
    directionalLight.position.set( 0.25 , 1 , 1 ) ;

    //create the platform
    GlobalEntityManager.createPlatform( 0 , 0 , 0 , 0.0025 ) ;

    GlobalStation = GlobalEntityManager.createStation( 0 , -75000 , -250000 , 0.00001 ) ;
    
    GlobalComSat = GlobalEntityManager.createComSat( -25500 , 0 , 0 , 0.001 ) ;
    
    GlobalCharger = GlobalEntityManager.createCharger( 25700 , 0 , 0 ) ;
    
    GlobalRobot = GlobalEntityManager.createRobot( 25700 , 0 , 0 , 0.001 ) ;
    
    GlobalCancerLevel = gworld.cloneGfxObj( MESH_FLOOR_CANCER_LEVEL ) ;
    gworld.scene.add( GlobalCancerLevel ) ;
    
    GlobalCancerLevel.material.visible = false ;
    GlobalCancerLevel.material.opacity = 0.0   ;
    GlobalCancerLevel.renderDepth      = 1.1   ;
    
    GlobalCancerLevel.fadeIn = function()
    {
        activeFloorTween++ ;
        GlobalCancerLevel.fadeInTween = new TWEEN.Tween( { op: 0.0 } ).to( { op:1.0 } , 3000 ) ;
        
        GlobalCancerLevel.fadeInTween.onUpdate( function()
        {
            GlobalCancerLevel.material.opacity = this.op ;
        } ) ;
        
        GlobalCancerLevel.fadeInTween.onComplete( function()
        {
            GlobalCancerLevel.material.transparent = false ;
            activeFloorTween-- ;
        } ) ;
        
        GlobalCancerLevel.material.transparent = true ;
        GlobalCancerLevel.material.visible     = true ;
        GlobalCancerLevel.fadeInTween.start() ;
		
		for(var i = GlobalMineFacilities.length - 1; i >= 0; i--){
			var mine = GlobalEntityManager.getEntityByID(GlobalMineFacilities[i].ENTITY_ID);
			mine.building.children[0].material.opacity = 0.4
		}
    };
    
    GlobalCancerLevel.fadeOut = function()
    {
        activeFloorTween++ ;
        GlobalCancerLevel.fadeOutTween = new TWEEN.Tween( { op: 1.0 } ).to( { op:0.0 } , 3000 ) ;
        
        GlobalCancerLevel.fadeOutTween.onUpdate( function()
        {
            GlobalCancerLevel.material.opacity =  this.op ;
        } ) ;
        
        GlobalCancerLevel.fadeOutTween.onComplete( function()
        {
            activeFloorTween-- ;
            GlobalCancerLevel.material.transparent = false ;
            GlobalCancerLevel.material.visible     = false ;
        } ) ;
                    
        GlobalCancerLevel.material.transparent = true ;
        GlobalCancerLevel.fadeOutTween.start() ;
		
		for(var i = GlobalMineFacilities.length - 1; i >= 0; i--){
			var mine = GlobalEntityManager.getEntityByID(GlobalMineFacilities[i].ENTITY_ID);
			mine.building.children[0].material.opacity = 1.0
		}
    
    };
    
    GlobalCancerLevel.SetActive = function()
    {
        GlobalCancerLevel.fadeIn () ;
        GlobalGameLevel.fadeOut  () ;
        GlobalGameLevel.active   = false ;
        GlobalCancerLevel.active = true  ;
    } ;
    
    GlobalCancerLevel.active = false ;
    
    GlobalGameLevel = gworld.cloneGfxObj( MESH_FLOOR_GAME_LEVEL ) ;
    gworld.scene.add( GlobalGameLevel ) ;
    
    GlobalGameLevel.material.opacity = 1.0 ;
    GlobalGameLevel.renderDepth      = 1.1 ;
    
    GlobalGameLevel.fadeIn = function()
    {
        activeFloorTween++ ;
        GlobalGameLevel.fadeInTween = new TWEEN.Tween( { op: 0.0 } ).to( { op:1.0 } , 3000 ) ;
        
        GlobalGameLevel.fadeInTween.onUpdate( function()
        {
            GlobalGameLevel.material.opacity = this.op ;
        } ) ;
        
        GlobalGameLevel.fadeInTween.onComplete( function()
        {
            activeFloorTween-- ;
            GlobalGameLevel.material.transparent = false ;
        } ) ;
        
        GlobalGameLevel.material.transparent = true;
        GlobalGameLevel.material.visible     = true;
        GlobalGameLevel.fadeInTween.start();
    } ;
    
    GlobalGameLevel.fadeOut = function()
    {
        activeFloorTween++ ;
        GlobalGameLevel.fadeOutTween = new TWEEN.Tween( { op: 1.0 } ).to( { op:0.0 } , 3000 ) ;
        GlobalGameLevel.fadeOutTween.onUpdate( function()
        {
            GlobalGameLevel.material.opacity = this.op;
        } ) ;
        
        GlobalGameLevel.fadeOutTween.onComplete( function()
        {
            activeFloorTween-- ;
            GlobalGameLevel.material.transparent = false ;
            GlobalGameLevel.material.visible     = false ;
        } ) ;
        GlobalGameLevel.material.transparent = true ;
        GlobalGameLevel.fadeOutTween.start() ;
    } ;
    
    GlobalGameLevel.SetActive = function()
    {
        GlobalGameLevel.fadeIn    () ;
        GlobalCancerLevel.fadeOut () ;
        GlobalGameLevel.active   = true  ;
        GlobalCancerLevel.active = false ;
    }
    
    GlobalGameLevel.active = true;
    
    gworld.scene.add( gworld.getGfxObjPtr( MESH_FLOOR_GRATING ) ) ;
    gworld.scene.add( gworld.getGfxObjPtr( MESH_FLOOR_BASE    ) ) ;
}