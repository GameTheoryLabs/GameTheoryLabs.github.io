EntityComSat = function( px , py , pz , speed )
{
    var scope = this ;
    
    this.ENTITY_ID = -1 ;
    
    const rotSpeed = speed ;
    
    this.IsCommunicating = false ;
    
    this.comSatBaseObj = gworld.cloneGfxObj( MODEL_COM_SAT_BASE ) ;
    comSatDishObj      = gworld.cloneGfxObj( MODEL_COM_SAT_DISH ) ;
    
    scope.comSatBaseObj.position.set ( px , py        , pz ) ;
    comSatDishObj.position.set       ( px , py + 1100 , pz ) ;
    
    scope.comSatBaseObj.scale.set ( 350 , 350 , 350 ) ;
    comSatDishObj.scale.set       ( 350 , 350 , 350 ) ;
    
    // Robot Communication Effect
    var comWaveObj = gworld.cloneGfxObj( MESH_COM_WAVE );
    comWaveObj.material = comWaveObj.material.clone() ;
    comWaveObj.material.visible = false ;
    
    gworld.scene.add( scope.comSatBaseObj ) ;
    gworld.scene.add( comSatDishObj       ) ;
    gworld.scene.add( comWaveObj          ) ;
    
    this.communicate = function( station , robot )
    {
        scope.IsCommunicating = true ;
        
        var forward = new THREE.Vector3( 0 , 0 , -1 ) ;
        
        var rpos = new THREE.Vector3().copy( robot.robotObj.position ) ;
        rpos.sub( comSatDishObj.position ) ;
        
        var spos = new THREE.Vector3().copy( station.stationObj.position ) ;
        spos.sub( comSatDishObj.position ) ;
        
        var robotAngle      = { x : 0 , y : -forward.angleTo( rpos ) , z : 0 } ;
        var stationAngle    = { x : 0 , y : -forward.angleTo( spos ) , z : 0 } ;
        var robotLocation   = new THREE.Vector3().copy( robot.robotObj.position     ) ;
        var stationLocation = new THREE.Vector3().copy( station.stationObj.position ) ;
        var satDishLocation = new THREE.Vector3().copy( comSatDishObj.position      ) ;
        
        stationLocation.y += 125000 ;
        stationLocation.z += 25000  ;
        
        satDishLocation.y += 450 ;
        
        comWaveObj.lookAt( stationLocation ) ;
        
        var wavePos  ;
        var rotation ;
        
        var phase = 0 ;
        
        var updateState = -1 ;
        
        function update()
        {
            if( updateState == 0 )
            {
                comSatDishObj.rotation.set( 0 , rotation.y , 0 ) ;
            }
            else if( updateState == 1 )
            {
                comWaveObj.position.set( wavePos.x , wavePos.y , wavePos.z ) ;
                comWaveObj.position.y += 600 ;
            }
        }
        
        function phaseChange()
        {
            phase++ ;
            
            switch( phase )
            {
            case 1:
                //Receive data from robot part 1
                updateState = 1 ;
                
                comWaveObj.position.copy( robotLocation ) ;
                comWaveObj.scale.set( 1 , 1 , 1 ) ;
                comWaveObj.lookAt( satDishLocation ) ;
                comWaveObj.position.y += 600 ;
                
                wavePos = new THREE.Vector3().copy( robotLocation ) ;
                
                var look = getObjForward ( comWaveObj ) ;
                look.multiplyScalar      ( -1500      ) ;
                comWaveObj.position.add  ( look       ) ;
                wavePos.add              ( look       ) ;
                
                var tween = new TWEEN.Tween( wavePos ).to( satDishLocation , 500 ) ;
                tween.onUpdate   ( update   ) ;
                tween.onComplete ( phaseChange ) ;
                tween.start() ;
                
                comWaveObj.material.visible = true ;
                comWaveObj.material.color.setHex( 0x1118ff ) ;
                break;
            
            case 2:
                //Receive data from robot part 2
                updateState = 1 ;
                
                comWaveObj.position.copy( robotLocation ) ;
                comWaveObj.scale.set( 1 , 1 , 1 ) ;
                comWaveObj.lookAt( satDishLocation ) ;
                comWaveObj.position.y += 600 ;
                
                wavePos = new THREE.Vector3().copy( robotLocation ) ;
                
                var look = getObjForward ( comWaveObj ) ;
                look.multiplyScalar      ( -1500      ) ;
                comWaveObj.position.add  ( look       ) ;
                wavePos.add              ( look       ) ;
                
                var tween = new TWEEN.Tween( wavePos ).to( satDishLocation , 500 ) ;
                tween.onUpdate   ( update   ) ;
                tween.onComplete ( phaseChange ) ;
                tween.start() ;
                
                comWaveObj.material.visible = true ;
                comWaveObj.material.color.setHex( 0x1118ff ) ;
                break;
            
            case 3:
                //Rotate to face the station
                updateState = 0 ;
                
                rotation = new THREE.Vector3().copy( comSatDishObj.rotation ) ;
                
                var tween = new TWEEN.Tween( rotation ).to( stationAngle , 750 ) ;
                tween.easing( TWEEN.Easing.Quadratic.InOut ) ;
                tween.onUpdate   ( update   ) ;
                tween.onComplete ( phaseChange ) ;
                tween.delay( 500 ) ;
                tween.start() ;
                
                comWaveObj.material.visible = false ;
                break;
            
            case 4:
                //Send data to station part 1
                updateState = 1 ;
                
                comWaveObj.position.copy( satDishLocation ) ;
                comWaveObj.scale.set( 3 , 3 , 3 ) ;
                comWaveObj.lookAt( stationLocation ) ;
                comWaveObj.position.y += 600 ;
                
                wavePos = new THREE.Vector3().copy( satDishLocation ) ;
                
                var look = getObjForward ( comWaveObj ) ;
                look.multiplyScalar      ( -6000      ) ;
                comWaveObj.position.add  ( look       ) ;
                wavePos.add              ( look       ) ;
                
                var tween = new TWEEN.Tween( wavePos ).to( stationLocation , 1750 ) ;
                tween.onUpdate   ( update   ) ;
                tween.onComplete ( phaseChange ) ;
                tween.start() ;
                
                comWaveObj.material.visible = true ;
                comWaveObj.material.color.setHex( 0x1118ff ) ;
                break;
            
            case 5:
                //Send data to station part 2
                updateState = 1 ;
                
                comWaveObj.position.copy( satDishLocation ) ;
                comWaveObj.scale.set( 3 , 3 , 3 ) ;
                comWaveObj.lookAt( stationLocation ) ;
                comWaveObj.position.y += 600 ;
                
                wavePos = new THREE.Vector3().copy( satDishLocation ) ;
                
                var look = getObjForward ( comWaveObj ) ;
                look.multiplyScalar      ( -6000      ) ;
                comWaveObj.position.add  ( look       ) ;
                wavePos.add              ( look       ) ;
                
                var tween = new TWEEN.Tween( wavePos ).to( stationLocation , 1750 ) ;
                tween.onUpdate   ( update   ) ;
                tween.onComplete ( phaseChange ) ;
                tween.start() ;
                
                comWaveObj.material.visible = true ;
                comWaveObj.material.color.setHex( 0x1118ff ) ;
                break;
            
            case 6:
                //Receive data from station part 1
                updateState = 1 ;
                
                comWaveObj.position.copy( stationLocation ) ;
                comWaveObj.scale.set( 3 , 3 , 3 ) ;
                comWaveObj.lookAt( satDishLocation ) ;
                comWaveObj.position.y += 600 ;
                
                wavePos = new THREE.Vector3().copy( stationLocation ) ;
                
                var tween = new TWEEN.Tween( wavePos ).to( satDishLocation , 1750 ) ;
                tween.onUpdate   ( update   ) ;
                tween.onComplete ( phaseChange ) ;
                tween.start() ;
                
                comWaveObj.material.visible = true ;
                comWaveObj.material.color.setHex( 0x11dd18 ) ;
                break;
            
            case 7:
                //Receive data from station part 2
                updateState = 1 ;
                
                comWaveObj.position.copy( stationLocation ) ;
                comWaveObj.scale.set( 3 , 3 , 3 ) ;
                comWaveObj.lookAt( satDishLocation ) ;
                
                wavePos = new THREE.Vector3().copy( stationLocation ) ;
                
                var tween = new TWEEN.Tween( wavePos ).to( satDishLocation , 1750 ) ;
                tween.onUpdate   ( update   ) ;
                tween.onComplete ( phaseChange ) ;
                tween.start() ;
                
                comWaveObj.material.visible = true ;
                comWaveObj.material.color.setHex( 0x11dd18 ) ;
                break;
            
            case 8:
                //Rotate to face the robot
                updateState = 0 ;
                
                rotation = new THREE.Vector3().copy( comSatDishObj.rotation ) ;
                
                var tween = new TWEEN.Tween( rotation ).to( robotAngle , 750 ) ;
                tween.easing( TWEEN.Easing.Quadratic.InOut ) ;
                tween.onUpdate   ( update   ) ;
                tween.onComplete ( phaseChange ) ;
                tween.delay( 500 ) ;
                tween.start() ;
                
                comWaveObj.material.visible = false ;
                break;
            
            case 9:
                //Send data from robot part 1
                updateState = 1 ;
                
                comWaveObj.position.copy( satDishLocation ) ;
                comWaveObj.scale.set( 1 , 1 , 1 ) ;
                comWaveObj.lookAt( robotLocation ) ;
                comWaveObj.position.y += 600 ;
                
                wavePos = new THREE.Vector3().copy( satDishLocation ) ;
                
                var look = getObjForward ( comWaveObj ) ;
                look.multiplyScalar      ( -1500      ) ;
                comWaveObj.position.add  ( look       ) ;
                wavePos.add              ( look       ) ;
                
                var tween = new TWEEN.Tween( wavePos ).to( robotLocation , 500 ) ;
                tween.onUpdate   ( update   ) ;
                tween.onComplete ( phaseChange ) ;
                tween.start() ;
                
                comWaveObj.material.visible = true ;
                comWaveObj.material.color.setHex( 0x11dd18 ) ;
                break;
            
            case 10:
                //Send data from robot part 1
                updateState = 1 ;
                
                comWaveObj.position.copy( satDishLocation ) ;
                comWaveObj.scale.set( 1 , 1 , 1 ) ;
                comWaveObj.lookAt( robotLocation ) ;
                comWaveObj.position.y += 600 ;
                
                wavePos = new THREE.Vector3().copy( satDishLocation ) ;
                
                var look = getObjForward ( comWaveObj ) ;
                look.multiplyScalar      ( -1500      ) ;
                comWaveObj.position.add  ( look       ) ;
                wavePos.add              ( look       ) ;
                
                var tween = new TWEEN.Tween( wavePos ).to( robotLocation , 500 ) ;
                tween.onUpdate   ( update   ) ;
                tween.onComplete ( phaseChange ) ;
                tween.start() ;
                
                comWaveObj.material.visible = true ;
                comWaveObj.material.color.setHex( 0x11dd18 ) ;
                break;
            
            case 11:
                //Finished communicating, so turn off everything and continue normal operations
                comWaveObj.material.visible = false ;
                scope.IsCommunicating       = false ;
                break;
            }
        }
    
        //Rotate to face the robot
        updateState = 0 ;
        
        rotation = new THREE.Vector3().copy( comSatDishObj.rotation ) ;
        
        var tween = new TWEEN.Tween( rotation ).to( robotAngle , 1250 ) ;
        tween.easing( TWEEN.Easing.Quadratic.InOut ) ;
        tween.onUpdate   ( update   ) ;
        tween.onComplete ( phaseChange ) ;
        tween.start() ;
    } ;
    
    this.destroy = function()
    {
        gworld.scene.remove( scope.comSatBaseObj ) ;
        gworld.scene.remove( comSatDishObj       ) ;
    } ;
    
    this.update = function( delta )
    {
        if( !scope.IsCommunicating )
        {
            comSatDishObj.rotation.y -= rotSpeed * delta ;
        
            comSatDishObj.rotation.y = Math.abs( comSatDishObj.rotation.y ) > 2 * PI ? 0 : comSatDishObj.rotation.y ;
        }
    } ;
} ;