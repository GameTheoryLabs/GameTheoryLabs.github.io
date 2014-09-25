EntityCharger = function( px , py , pz )
{
    this.ENTITY_ID = -1 ;
    
    const rotateVec = new THREE.Vector3( 0 , 0 , 1 ) ;
    
    var chargerObj = gworld.cloneGfxObj( MODEL_CHARGER ) ;
    
    chargerObj.position.set( px , py , pz ) ;
    
    chargerObj.scale.set( 1250 , 625 , 1250 ) ;
    
    gworld.scene.add( chargerObj ) ;
    
    this.destroy = function()
    {
        gworld.scene.remove( chargerObj ) ;
    } ;
    
    this.update = function( delta )
    {
    } ;
} ;