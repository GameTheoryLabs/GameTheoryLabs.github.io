EntityPlatform = function( px , py , pz , fanSpeed )
{
    this.ENTITY_ID = -1 ;
    
    const FAN_SPEED = fanSpeed ;
    
    var platform = new THREE.Object3D() ;
    
    platform.position.set( px , py , pz ) ;
    
    var fanArray = new Array() ;
    
    //load a mesh
    function load( id , px , py , pz , rx , ry , rz , sx, sy, sz )
    {
        var obj = gworld.cloneGfxObj( id ) ;
        
        obj.position.set ( px , py , pz ) ;
        obj.rotation.set ( rx , ry , rz ) ;
        obj.scale.set    ( sx , sy , sz ) ;
        
        platform.add( obj ) ;
        
        return obj ;
    }
    
    load( MODEL_PLAT_BORDER ,  0 , 0 , 0 , 0 , 0 , 0 , 2 , 2 , 2 ) ;
    
    fanArray.push( load( MODEL_PLAT_FAN , -25600 , -300 , -16000 , 0 , 0 , 0 , 1750 , 1750 , 1750 ) ) ;
    fanArray.push( load( MODEL_PLAT_FAN ,  25600 , -300 , -16000 , 0 , 0 , 0 , 1750 , 1750 , 1750 ) ) ;
    fanArray.push( load( MODEL_PLAT_FAN , -25600 , -300 ,  16000 , 0 , 0 , 0 , 1750 , 1750 , 1750 ) ) ;
    fanArray.push( load( MODEL_PLAT_FAN ,  25600 , -300 ,  16000 , 0 , 0 , 0 , 1750 , 1750 , 1750 ) ) ;
    
    gworld.scene.add( platform ) ;
    
    this.destroy = function()
    {
        gworld.scene.remove( platform ) ;
    }
    
    this.update = function( delta )
    {
        for( var i = 0 ; i < fanArray.length ; i++ )
        {
            fanArray[ i ].rotation.y -= FAN_SPEED * delta;
        }
    } ;
} ;