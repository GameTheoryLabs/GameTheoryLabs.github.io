EntityRobot = function( px , py , pz , animSpeed )
{
    var scope = this ;
    
    this.ENTITY_ID = -1 ;
    
    // Animation States
    const ASTATE =
    {
        ANIM_IDLE            : 0 ,
        BUILD_ANIM_START     : 1 ,
        BUILD_FADE_LASER_IN  : 2 ,
        BUILD_HOLD_LASER     : 3 ,
        BUILD_FADE_LASER_OUT : 4 ,
        BUILD_ANIM_STOP      : 5
    };
    
    // Defines
    const speed       = animSpeed ;
    const height      = 650       ;
    const laserHeight = 1200      ;
    
    this.IsBuilding = false ;
    this.IsMoving   = false ;
    
    //Animation Variables
    var animationState = ASTATE.ANIM_IDLE ;
    var pause    = 0 ;
    var coneIter = 0 ;
    var scanIter = 0 ;
    var wave     = 0 ;
    var lTime    = 0 ;
    var curIter  = 0 ;
    var lookVec  = null ;
    
    // Clone the robot model
    this.robotObj = gworld.cloneGfxObj( MODEL_ROBOT ) ;
    scope.robotObj.position.set( px , py + height , pz ) ;
    scope.robotObj.scale.set( 500 , 500 , 500 ) ;
    
    // Build Laser Effect
    var laserConeGeom = gworld.cloneGfxObj( GEOM_BUILD_LASER_CONE    ) ;
    var laserConeMat  = gworld.cloneGfxObj( MAT_HOLOGRAM             ) ;
    var laserConeMesh = new THREE.Mesh( laserConeGeom , laserConeMat ) ;
    
    laserConeMat.uniforms[ "zSinEnable" ].value = 1.0    ;
    laserConeMat.uniforms[ "ySinEnable" ].value = 1.0    ;
    laserConeMat.uniforms[ "yLenEnable" ].value = 1.0    ;
    laserConeMat.uniforms[ "amplitude"  ].value = 0.5    ;
    laserConeMat.uniforms[ "frequency"  ].value = 0.0055 ;
    laserConeMat.uniforms[ "yShift"     ].value = 1.0    ;
    laserConeMat.uniforms[ "alpha"      ].value = 0.0    ;
    laserConeMat.uniforms[ "length"     ].value = 4500.0 ;
    
    laserConeMesh.opacity     = 1.0 ;
    laserConeMesh.position.y  = laserHeight ;
    laserConeMesh.rotation.z  = PI_2 ;
    laserConeMesh.renderDepth = 0.90 ;
    
    var laserLineGeom = gworld.cloneGfxObj( GEOM_BUILD_LASER         ) ;
    var laserLineMat  = gworld.cloneGfxObj( MAT_BUILD_LASER          ) ;
    var laserLineMesh = new THREE.Mesh( laserLineGeom , laserLineMat ) ;
    
    laserLineMesh.visible = false ;
    laserLineMesh.scale.z = 1.25 ;
    
    var laserLineGlowGeom = gworld.cloneGfxObj( GEOM_BUILD_LASER                 ) ;
    var laserLineGlowMat  = gworld.cloneGfxObj( MAT_BUILD_LASER_GLOW             ) ;
    var laserLineGlowMesh = new THREE.Mesh( laserLineGlowGeom , laserLineGlowMat ) ;
    
    laserLineGlowMat.transparent = true ;
    laserLineGlowMesh.visible    = false ;
    laserLineGlowMesh.scale.set( 3.0 , 3.0 , 1.25 ) ;
    
    var laserObj = new THREE.Object3D() ;
    laserObj.add( laserLineMesh     ) ;
    laserObj.add( laserLineGlowMesh ) ;
    
    // Robot Hover Effect
    var hoverGeom = gworld.cloneGfxObj( GEOM_ROBOT_HOVER ) ;
    var hoverMat  = gworld.cloneGfxObj( MAT_HOLOGRAM     ) ;
    var hoverMesh = new THREE.Mesh( hoverGeom , hoverMat ) ;
    
    hoverMat.uniforms[ "ySinEnable" ].value = 1.00 ;
    hoverMat.uniforms[ "frequency"  ].value = 0.02 ;
    hoverMat.uniforms[ "alpha"      ].value = 0.50 ;
    
    hoverMesh.position.y = 550 ;
    
    var hoverLight = gworld.issuePointLight() ;
    if( hoverLight )
    {
        hoverLight.color.setHex( 0x3737ff ) ;
        hoverLight.intensity = 10 ;
        hoverLight.distance  = 1250 ;
        hoverLight.position.set( 0 , 375 , 0 ) ;
    }
    
    // Robot Scan Effect
    var robotScanGeom = gworld.cloneGfxObj( GEOM_ROBOT_SCAN ) ;
    var robotScanMat  = gworld.cloneGfxObj( MAT_HOLOGRAM    ) ;
    var robotScanMesh = new THREE.Mesh( robotScanGeom , robotScanMat ) ;
    
    robotScanMat.uniforms[ "ySinEnable" ].value = 1.0  ;
    robotScanMat.uniforms[ "alpha"      ].value = 0.75 ;
    
    robotScanMesh.renderDepth = 1.10 ;
    
    var robotScanObj = new THREE.Object3D() ;
    robotScanObj.add( robotScanMesh ) ;
    robotScanMesh.visible = false ;
    
    gworld.scene.add( scope.robotObj ) ;
    gworld.scene.add( laserConeMesh  ) ;
    gworld.scene.add( laserObj       ) ;
    gworld.scene.add( hoverMesh      ) ;
    gworld.scene.add( robotScanObj   ) ;
    
    //Tasking Functions
    this.moveTo = function( px , pz , time , scan )
    {
        var pos = new THREE.Vector3() ;
        pos.copy( scope.robotObj.position ) ;
        
        var target = { x : px , z : pz } ;
        var activeTween = new TWEEN.Tween( pos ).to( target , time ) ;
        
        activeTween.easing( TWEEN.Easing.Quadratic.InOut ) ;
        activeTween.start() ;
        
        scope.IsMoving = true ;
        
        robotScanObj.lookAt ( new THREE.Vector3( px , 0 , pz ) ) ;
        laserObj.lookAt     ( new THREE.Vector3( px , 0 , pz ) ) ;
        
        laserLineMesh.rotation.x     = PI_2 / 2.85 ;
        laserLineGlowMesh.rotation.x = PI_2 / 2.85 ;
        
        robotScanMesh.visible     = scan ;
        laserLineMesh.visible     = scan ;
        laserLineGlowMesh.visible = scan ;
        
        activeTween.onUpdate( function()
        {
            scope.robotObj.position.x = pos.x ;
            scope.robotObj.position.z = pos.z ;
        } ) ;
        
        activeTween.onComplete( function()
        {
            scope.IsMoving            = false ;
            robotScanMesh.visible     = false ;
            laserLineMesh.visible     = false ;
            laserLineGlowMesh.visible = false ;
        } ) ;
    } ;
    
    this.build = function( px, py, pz )
    {
        scope.IsBuilding = true ;
        animationState = ASTATE.BUILD_ANIM_START ;
        lookVec = new THREE.Vector3( px , py + 500 , pz ) ;
    } ;
    
    function animationCommonUpdate( delta )
    {
        //Robot
        var deltaSpeed = delta * speed ;
        scope.robotObj.rotation.y += deltaSpeed * 0.75 ;
        curIter += deltaSpeed * 2.15 ;
        scope.robotObj.position.y = ( Math.sin( curIter ) * 75 ) + height ;
        
        //Robot Hover
        hoverMat.uniforms[ "shift" ].value += delta * 0.0075 ; 
        hoverMesh.position.x  = scope.robotObj.position.x ;
        hoverMesh.position.z  = scope.robotObj.position.z ;
        
        if( hoverLight )
        {
            hoverLight.position.x = hoverMesh.position.x ;
            hoverLight.position.z = hoverMesh.position.z ;
        }
        
        //used frequently enough to keep updated
        laserObj.position.copy( scope.robotObj.position ) ;
        laserObj.position.y += 700 ;
    }
    
    //Build Effect
    function animationBuildUpdate( delta )
    {
        switch( animationState )
        {
        case ASTATE.BUILD_ANIM_START:
            lTime = 15.0 ;
            laserConeMat.visible      = true ;
            laserLineMesh.visible     = true ;
            laserLineGlowMesh.visible = true ;
            
            laserLineMesh.rotation.set     ( 0 , 0 , 0 ) ;
            laserLineGlowMesh.rotation.set ( 0 , 0 , 0 ) ;
            
            laserConeMat.uniforms[ "alpha" ].value = 0.0 ;
            animationState = ASTATE.BUILD_FADE_LASER_IN ;
            break;
        
        case ASTATE.BUILD_FADE_LASER_IN:
            laserConeMat.visible = true ;
            laserConeMat.uniforms[ "alpha" ].value += 0.00025 * delta ;
            animationState = ( laserConeMat.uniforms[ "alpha" ].value >= 0.35 ) ? ASTATE.BUILD_HOLD_LASER : ASTATE.BUILD_FADE_LASER_IN ;
            pause = 0 ;
            break;
        
        case ASTATE.BUILD_HOLD_LASER:
            pause += 0.0025 * delta ;
            animationState = ( pause > 14.0 ) ? ASTATE.BUILD_FADE_LASER_OUT : ASTATE.BUILD_HOLD_LASER ;
            break;
        
        case ASTATE.BUILD_FADE_LASER_OUT:
            laserConeMat.uniforms[ "alpha" ].value -= 0.00025 * delta ;
            animationState = ( laserConeMat.uniforms[ "alpha" ].value <= 0.0 ) ? ASTATE.BUILD_ANIM_STOP : ASTATE.BUILD_FADE_LASER_OUT ;
            pause = 0 ;
            break;
        
        case ASTATE.BUILD_ANIM_STOP:
            laserConeMat.visible      = false ;
            laserLineMesh.visible     = false ;
            laserLineGlowMesh.visible = false ;
            scope.IsBuilding          = false ;
            animationState            = ASTATE.ANIM_IDLE ;
            break;
        }
        
        //if the laser is present then do a constant animation
        if( animationState >= ASTATE.BUILD_FADE_LASER_IN && animationState <= ASTATE.BUILD_FADE_LASER_OUT )
        {
            laserConeMesh.position.copy( scope.robotObj.position ) ;
            laserConeMesh.position.y += 700 ;
            
            coneIter -= 0.005 * delta ;
            laserConeMat.uniforms[ "shift" ].value = coneIter ;
            
            lTime += 0.075 * delta ;
            
            if( lTime > 10 )
            {
                lTime = 0 ;
                laserObj.lookAt( randomSpherePoint( lookVec , 1250 ) ) ;
            }
            
            laserConeMesh.lookAt( lookVec ) ;
            
            if( curIter > 2 * PI )
            {
                curIter = 0 ;
            }
        }
    }
    
    function animationScanUpdate( delta )
    {
        robotScanObj.position.copy( scope.robotObj.position ) ;
        robotScanObj.position.y += 700 ;
        robotScanObj.position.z += 250 ;
        
        scanIter += 0.001 * delta ;
        
        if( robotScanMesh.visible )
        {
            robotScanMat.uniforms[ "shift" ].value = scanIter * 10 ;
            
            laserLineMesh.rotation.y = ( 0.5 * Math.sin( scanIter * 5.0 ) ) ;
            laserLineGlowMesh.rotation.y = ( 0.5 * Math.sin( scanIter * 5.0 ) ) ;
        }
    }
    
    this.destroy = function()
    {
        gworld.scene.remove( scope.robotObj ) ;
        gworld.scene.remove( laserConeMesh  ) ;
        gworld.scene.remove( laserObj       ) ;
        gworld.scene.remove( hoverMesh      ) ;
        gworld.scene.remove( hoverLight     ) ;
        gworld.scene.remove( robotScanObj   ) ;
    } ;
    
    this.update = function( delta )
    {
        animationCommonUpdate ( delta ) ;
        animationBuildUpdate  ( delta ) ;
        animationScanUpdate   ( delta ) ;
    } ;
} ;