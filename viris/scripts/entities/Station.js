EntityStation = function( px, py, pz, rot )
{
    scope = this ;
    
    this.ENTITY_ID = -1 ;
    
    const rotateVec = new THREE.Vector3( 0 , 0 , 1 ) ;
    
    var rotateSpeed = rot ;
    
    this.stationObj = gworld.cloneGfxObj( MODEL_STATION ) ;
    
    scope.stationObj.rotation.x = PI_2 ;
    scope.stationObj.rotation.y = PI_2 / 3.1 ;
    
    scope.stationObj.position.set( px , py , pz ) ;
    
    scope.stationObj.scale.set( 650 , 650 , 500 ) ;
    
    scope.stationObj.children[ 0 ].material.side = THREE.FrontSide ;
    
    scope.stationObj.frustumCulled = false ;
    
    gworld.scene.add( scope.stationObj ) ;
    
    this.destroy = function()
    {
        gworld.scene.remove( scope.stationObj ) ;
    }
    
    this.update = function( delta )
    {
        var angle = delta * rotateSpeed ;
        scope.stationObj.rotateOnAxis( rotateVec , angle ) ;
    } ;
} ;