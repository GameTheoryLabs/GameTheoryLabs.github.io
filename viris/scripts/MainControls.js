MainControls = function()
{
    //Half-PI
    const PI_2 = Math.PI / 2 ;
    
    //create constants used for camera movement
    const baseCameraRot = -PI_2 / 2.5 ;
    const zoomSpeed     = 1.25        ; // mouse zoom speed modifier
    const moveSpeed     = 0.00025     ; // panning movement speed
    const boost         = 2.0         ; // speed boost scalar amount
    const touchPanDim   = 0.0025      ; // tablet touch panning reducer
    const touchZoomDim  = 0.000075    ; // tablet touch zoom reducer
    const drag          = 0.895       ; // drag amount to gradually slow down the camera's velocity
    const minAltitude   = 2000        ; // the minimum altitude the camera can go
    const maxAltitude   = 27500       ; // the maximum altitude the camera can go
    const rotAltThresh  = 10000       ; // altitude when rotation starts, needs to be higher than the minAltitude
    
    //initial camera positioning
    gworld.eyepoint.rotation.x = baseCameraRot ;
    gworld.eyepoint.position.y = 5000          ;
    gworld.eyepoint.position.z = 10000         ;
    
    //variables used for camera movement
    var speedBoost    = 1.0   ; // current speed boost amount scalar
    var touchPanning  = false ; // tablet panning
    var touchZooming  = false ; // tablet zooming
    var touchLastDist = 0     ; // the last 2D distance between fingers
    
    //vectors to keep track of the tablet finger 2D coordinates for panning and zooming
    var touchStartPos = [ new THREE.Vector2() , new THREE.Vector2() ] ;
    var touchStopPos  = [ new THREE.Vector2() , new THREE.Vector2() ] ;
    
    var movement    = new THREE.Vector3() ; // the amount of panning to calculate velocities off of
    var curVelocity = new THREE.Vector3() ; // the current camera velocity
    var translation = new THREE.Vector3() ; // the calculated translation amount used in the update loop
    
    //determine the static zoom forward position
    var zoomFloorForward = new THREE.Vector3( 0 , 0 , -1 ) ;
    zoomFloorForward.applyEuler( gworld.eyepoint.rotation ) ;
    zoomFloorForward.normalize() ;
    
    //determine the static zoom backward position
    var zoomCeilForward = new THREE.Vector3( 0 , 0 , 1 ) ;
    zoomCeilForward.applyEuler( gworld.eyepoint.rotation ) ;
    zoomCeilForward.normalize() ;
    
    //create the camera limit planes
    var zoomFloorPlane = new THREE.Plane( new THREE.Vector3( 0 ,  1 , 0 ) , -minAltitude ) ;
    var zoomCeilPlane  = new THREE.Plane( new THREE.Vector3( 0 , -1 , 0 ) ,  maxAltitude ) ;
    
    //create the ray objects
    var zoomFloorRay = new THREE.Ray( gworld.eyepoint.position , zoomFloorForward ) ;
    var zoomCeilRay  = new THREE.Ray( gworld.eyepoint.position , zoomCeilForward  ) ;
    
    //toggle between Cancer and Game Level
    var ToggleLevel = function()
    {
        if( activeFloorTween <= 0 )
        {
            GlobalGameLevel.active ? GlobalCancerLevel.SetActive() : GlobalGameLevel.SetActive() ;
        }
    }
    
    //clamp function used to constrain limits
    var clamp = function( x , min , max )
    {
        return x < min ? min : ( x > max ? max : x ) ;
    }
    
    //event fired when the mouse moves
    var onMouseMove = function( event )
    {
        event.preventDefault() ;
    }
    
    //event fired when the mouse button is down
    var onMouseDown = function( event )
    {
        event.preventDefault() ;
    }
    
    //event fired when the mouse button is up
    var onMouseUp = function( event )
    {
        event.preventDefault() ;
    }
    
    //event fired when the mouse wheel is scrolled
    var onMouseWheel = function( event )
    {
        event.preventDefault  () ;
        event.stopPropagation () ;
        
        var delta ;
        
        if( event.wheelDelta ) // WebKit / Opera / Explorer 9
        {
            delta = event.wheelDelta / 40 ;
        }
        else if( event.detail ) // Firefox
        {
            delta = -event.detail / 1.10 ;
        }
        
        //determine the zoom amount
        movement.y = zoomSpeed * -delta ;
    }
    
    //event fired when a keyboard key is pressed
    var onKeyDown = function( event )
    {
        switch( event.keyCode )
        {
        case 16: speedBoost  = boost ; break ; // SHIFT
        case 87: movement.z -= 1.0   ; break ; // W    
        case 83: movement.z += 1.0   ; break ; // S
        case 65: movement.x -= 1.0   ; break ; // A    
        case 68: movement.x += 1.0   ; break ; // D    
        }
        
        movement.clampScalar( -1.0 , 1.0 ) ;
    } ;
    
    //event fired when a keyboard key is released
    var onKeyUp = function( event )
    {
        switch( event.keyCode )
        {
        case 16: speedBoost = 1.0 ; break ; // SHIFT     
        case 87: movement.z = 0.0 ; break ; // W    
        case 83: movement.z = 0.0 ; break ; // S
        case 65: movement.x = 0.0 ; break ; // A    
        case 68: movement.x = 0.0 ; break ; // D
        case 84: ToggleLevel()    ; break ; // T
        case 32: queueScript()    ; break ; // Space Bar
        }
    } ;
    
    //for the tablet, when one or more fingers are first pressed on the screen
    var onTouchStart = function( event )
    {
        event.preventDefault() ;
        
        touchPanning = false ;
        touchZooming = false ;
        
        movement.set( 0 , 0 , 0 ) ;
        
        if( event.touches.length == 1 ) //1 finger is panning
        {
            touchPanning = true ;
            
            touchStartPos[ 0 ].x = event.touches[ 0 ].pageX ;
            touchStartPos[ 0 ].y = event.touches[ 0 ].pageY ;
        }
        else if( event.touches.length == 2 ) //2 fingers is zooming
        {
            touchZooming = true ;
            
            touchStartPos[ 0 ].x = event.touches[ 0 ].pageX ;
            touchStartPos[ 0 ].y = event.touches[ 0 ].pageY ;
            touchStartPos[ 1 ].x = event.touches[ 1 ].pageX ;
            touchStartPos[ 1 ].y = event.touches[ 1 ].pageY ;
            
            touchLastDist = touchStartPos[ 0 ].distanceToSquared( touchStartPos[ 1 ] ) ;
        }
        else if( event.touches.length == 3 ) //3 fingers fire an event
        {
            queueScript();
        }
        else if( event.touches.length == 4 ) //3 fingers fire an event
        {
            ToggleLevel();
        }
    }
    
    //for the tablet, when one or more fingers are moving on the screen
    var onTouchMove = function( event )
    {
        event.preventDefault() ;
        
        var touchobj = event.changedTouches[ 0 ] ;
        
        if( touchPanning ) //if we panning
        {
            //get the single finger X and Y position
            touchStopPos[ 0 ].x = event.touches[ 0 ].pageX ;
            touchStopPos[ 0 ].y = event.touches[ 0 ].pageY ;
            
            //determine planning movement
            movement.x = ( touchStopPos[ 0 ].x - touchStartPos[ 0 ].x ) * touchPanDim ;
            movement.z = ( touchStopPos[ 0 ].y - touchStartPos[ 0 ].y ) * touchPanDim ;
        }
        else if( touchZooming ) //if we zooming
        {
            //get both fingers X and Y positions
            touchStopPos[ 0 ].x = event.touches[ 0 ].pageX ;
            touchStopPos[ 0 ].y = event.touches[ 0 ].pageY ;
            touchStopPos[ 1 ].x = event.touches[ 1 ].pageX ;
            touchStopPos[ 1 ].y = event.touches[ 1 ].pageY ;
            
            var curDist = touchStopPos[ 0 ].distanceToSquared( touchStopPos[ 1 ] ) ;
            
            var distDelta = curDist - touchLastDist ;
            
            //determine the zoom amount on the tablet
            movement.y = distDelta * touchZoomDim * -1.0 ;
            
            touchLastDist = curDist ;
        }
    }
    
    //for the tablet, when one or more fingers are no longer on the screen
    var onTouchStop = function( event )
    {
        event.preventDefault() ;
        
             if( touchPanning ) { touchPanning = false ; }
        else if( touchZooming ) { touchZooming = false ; }
             
        movement.set( 0 , 0 , 0 ) ;
    }
    
    //If Firefox, then use a different scrolling event than everything else
    var mousewheelevt = ( /Firefox/i.test( navigator.userAgent ) ) ? "DOMMouseScroll" : "mousewheel" ; 
    
    //Create event listeners for the computer
    document.addEventListener( 'mousemove'   , onMouseMove  , false ) ;
    document.addEventListener( 'mousedown'   , onMouseDown  , false ) ;
    document.addEventListener( 'mouseup'     , onMouseUp    , false ) ;
    document.addEventListener( mousewheelevt , onMouseWheel , false ) ;
    document.addEventListener( 'keydown'     , onKeyDown    , false ) ;
    document.addEventListener( 'keyup'       , onKeyUp      , false ) ;
    
    //Create event listeners for the tablet
    document.addEventListener( 'touchstart'  , onTouchStart , false ) ;
    document.addEventListener( 'touchmove'   , onTouchMove  , false ) ;
    document.addEventListener( 'touchend'    , onTouchStop  , false ) ;
    document.addEventListener( 'touchcancel' , onTouchStop  , false ) ;
    
    //update function for the camera physics, taking in the frame time delta
    this.update = function( delta )
    {
        //copy the force vector to a local vector to manipulate
        translation.copy( movement ) ;
        
        //reset the "zoom" parameter to 0
        movement.y = 0 ;
        
        //calculate movement speed
        var speed = delta * moveSpeed * speedBoost * gworld.eyepoint.position.y ;
        
        //Apply the speed to the force being applied by the device inputs
        translation.multiplyScalar( speed ) ;
        
        //add the current translation information to the camera's current velocity
        curVelocity.add( translation ) ;
        
        //apply the drag force to "smooth" the camera's movement
        curVelocity.multiplyScalar( drag ) ;
        
        //set the camera rotation to the base so we can translate properly
        gworld.eyepoint.rotation.x = baseCameraRot ;
        
        if( curVelocity.y > 0 ) //we're zooming out -- so only test intersections with the ceiling
        {
            zoomCeilRay.origin.copy( gworld.eyepoint.position ) ;
            
            var distToCeilPlane = zoomCeilRay.distanceToPlane( zoomCeilPlane ) ;
            
            distToCeilPlane = distToCeilPlane ? distToCeilPlane : 0 ;
            curVelocity.y   = Math.min( curVelocity.y , distToCeilPlane ) ;
        }
        else if( curVelocity.y < 0 ) //we're zooming in -- so only test intersections with the floor
        {
            zoomFloorRay.origin.copy( gworld.eyepoint.position ) ;
            
            var distToFloorPlane = -zoomFloorRay.distanceToPlane( zoomFloorPlane ) ;
            
            distToFloorPlane = distToFloorPlane ? distToFloorPlane : 0 ;
            curVelocity.y    = Math.max( curVelocity.y , distToFloorPlane ) ;
        }
        
        //update the actual camera position
        gworld.eyepoint.translateZ( curVelocity.y ) ;
        
        gworld.eyepoint.position.x += curVelocity.x ;
        gworld.eyepoint.position.z += curVelocity.z ;
        
        //determine pitch adjustments based on altitude
        var percOfZoom = ( gworld.eyepoint.position.y - minAltitude ) / ( rotAltThresh - minAltitude ) ;
        
        percOfZoom = clamp( percOfZoom , 0 , 1.0 ) ;
        
        var rot = Math.max( baseCameraRot * percOfZoom , baseCameraRot ) ;
        
        gworld.eyepoint.rotation.x = baseCameraRot * percOfZoom ;
    } ;
} ;

var GlobalMainControls ;

function initControls()
{
    GlobalMainControls = new MainControls() ;
}

function updateControls( delta )
{
    GlobalMainControls.update( delta ) ;
}