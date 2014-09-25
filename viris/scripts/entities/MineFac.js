EntityMineFac = function( px , py , pz , speed )
{
    this.ENTITY_ID = -1 ;
    
    const ASTATE =
    {
        ANIM_START    : 0 ,
        FADE_DOME_IN  : 1 ,
        FADE_WIRE_IN  : 2 ,
        FADE_TEX_IN   : 3 ,
        FADE_WIRE_OUT : 4 ,
        FADE_DOME_OUT : 5 ,
        ANIM_REMOVE   : 6 ,
        FAN_TURN      : 7
    } ;
    
    const rotSpeed = speed ;
    const rotAxis  = new THREE.Vector3( 0, 0, 1 ) ;
    
    var mineFacObj      = gworld.cloneGfxObj( MODEL_MINE_FAC_BASE  ) ; //main building
    var mineFacWire     = gworld.cloneGfxObj( MODEL_MINE_FAC_FULL  ) ; //wireframe building
    var mineFacFanObj   = gworld.cloneGfxObj( MODEL_MINE_FAC_FAN   ) ; //fan
    var mineFacWheelObj = gworld.cloneGfxObj( MODEL_MINE_FAC_WHEEL ) ; //wheel
	
    mineFacObj.position.set( px , py , pz ) ;
    mineFacObj.scale.set( 250 , 250 , 250 ) ;
    
    mineFacFanObj.position.set( px , py + 1400 , pz ) ;
    mineFacFanObj.scale.set( 250 , 250 , 250 ) ;
    
    mineFacWheelObj.position.set( px + 1455 , py + 600 , pz ) ;
    mineFacWheelObj.scale.set( 250 , 250 , 250 ) ;
    
    var mineFacMat = mineFacObj.children[ 0 ].material.clone() ; //get the reference to the material
    
    mineFacWire.position.set( px , py , pz ) ;
    mineFacWire.scale.set( 250 , 250 , 250 ) ;
    
    var wireFrameMat   = gworld.getGfxObjPtr ( MAT_BUILD_WIREFRAME ) ;
    var buildShaderMat = gworld.cloneGfxObj  ( MAT_HOLOGRAM        ) ;
    
    buildShaderMat.uniforms[ "ySinEnable" ].value = 1.0  ;
    buildShaderMat.uniforms[ "amplitude"  ].value = 1.75 ;
    buildShaderMat.uniforms[ "frequency"  ].value = 2.75 ;
    buildShaderMat.uniforms[ "alpha"      ].value = 0.5  ;
    
    var sphereMesh = new THREE.Mesh( new THREE.SphereGeometry( 2500 , 24 , 24 ) , buildShaderMat ) ;
    
    sphereMesh.position.set( px, py, pz );
    
    //set child material for the main mesh
    for( var i = 0 ; i < mineFacObj.children.length ; i++ )
    {
        mineFacObj.children[ i ].material = mineFacMat ;
    }
    
    //set child material for the fan
    for( var i = 0 ; i < mineFacFanObj.children.length ; i++ )
    {
        mineFacFanObj.children[ i ].material = mineFacMat ;
    }
    
    //set child material for the wheel
    for( var i = 0 ; i < mineFacWheelObj.children.length ; i++ )
    {
        mineFacWheelObj.children[ i ].material = mineFacMat ;
    }
    
    //set child material for the wireframe
    for( var i = 0 ; i < mineFacWire.children.length ; i++ )
    {
        mineFacWire.children[ i ].scale.multiplyScalar( 1.01 ); //make the wireframe less broken
    }
    
    wireFrameMat.transparent = true ;
    wireFrameMat.opacity     = 0.0  ;
    wireFrameMat.overdraw    = true ;
    
    mineFacMat.transparent = true ;
    mineFacMat.opacity     = 0.0  ;
    
    var reactorLight = gworld.issuePointLight() ;
    if( reactorLight )
    {
        reactorLight.color.setHex( 0x3737ff ) ;
        reactorLight.intensity = 0 ;
        reactorLight.distance  = 750 ;
        reactorLight.position.set( px, py + 2000, pz ) ;
    }
    
    gworld.scene.add( mineFacObj      ) ;
    gworld.scene.add( mineFacFanObj   ) ;
    gworld.scene.add( mineFacWheelObj ) ;
    gworld.scene.add( mineFacWire     ) ;
    gworld.scene.add( sphereMesh      ) ;
    
	this.building = mineFacFanObj;
	this.fan      = mineFacFanObj;
	this.wheel    = mineFacWheelObj;
	
    var animationState = ASTATE.ANIM_START ;
    var pause = 0;
    var wave  = 0;
    
    function animationUpdate( delta )
    {
        switch( animationState )
        {
        case ASTATE.ANIM_START:
            pause += delta * 0.0025;
            animationState = pause > 1.0 ? ASTATE.FADE_DOME_IN : ASTATE.ANIM_START ;
            break;
        
        case ASTATE.FADE_DOME_IN:
            buildShaderMat.uniforms[ "alpha" ].value += 0.00015 * delta ;
            animationState = buildShaderMat.uniforms[ "alpha" ].value >= 0.25 ? ASTATE.FADE_WIRE_IN : ASTATE.FADE_DOME_IN ;
            break;
        
        case ASTATE.FADE_WIRE_IN:
            wireFrameMat.opacity += 0.0005 * delta ;
            animationState = wireFrameMat.opacity >= 1.0 ? ASTATE.FADE_TEX_IN : ASTATE.FADE_WIRE_IN ;
            break;
        
        case ASTATE.FADE_TEX_IN:
            mineFacMat.opacity += 0.0002 * delta ;
            animationState = mineFacMat.opacity >= 1.0 ? ASTATE.FADE_WIRE_OUT : ASTATE.FADE_TEX_IN ;
            break;
        
        case ASTATE.FADE_WIRE_OUT:
            wireFrameMat.opacity -= 0.001 * delta ;
            animationState = wireFrameMat.opacity <= 0.0 ? ASTATE.FADE_DOME_OUT : ASTATE.FADE_WIRE_OUT ;
            break;
        
        case ASTATE.FADE_DOME_OUT:
            buildShaderMat.uniforms[ "alpha" ].value -= 0.001 * delta ;
            var expand = delta * 0.015 ;
            sphereMesh.scale.y += expand ;
            sphereMesh.scale.z += expand ;
            sphereMesh.scale.x += expand ;
            animationState = buildShaderMat.uniforms[ "alpha" ].value <= 0.0 ? ASTATE.ANIM_REMOVE : ASTATE.FADE_DOME_OUT ;
            break;
        
        case ASTATE.ANIM_REMOVE:
            if( reactorLight )
            {
                reactorLight.intensity = 90 ;
            }
            
            gworld.scene.remove( mineFacWire );
            gworld.scene.remove( sphereMesh  );
            animationState = ASTATE.FAN_TURN;
            break;
        
        case ASTATE.FAN_TURN:
            mineFacFanObj.rotation.y   += rotSpeed * delta ;
            mineFacWheelObj.rotation.z -= rotSpeed * delta ;
            break;
        }
    
        //if the dome is present
        if( animationState >= ASTATE.FADE_DOME_IN && animationState <= ASTATE.FADE_DOME_OUT )
        {
            var speed = 0.005 * delta ;
            wave += speed ;
            
            buildShaderMat.uniforms[ "shift" ].value = wave * 1.5 ;
            buildShaderMat.uniforms[ "wave"  ].value = ( Math.sin( wave ) / 0.75 ) + 1.0 ;
            
            sphereMesh.rotation.y += wave * 0.005 ;
        }
    }

    this.destroy = function()
    {
        gworld.scene.remove( mineFacObj      ) ;
        gworld.scene.remove( mineFacWheelObj ) ;
        gworld.scene.remove( mineFacFanObj   ) ;
        gworld.scene.remove( mineFacWire     ) ;
        gworld.scene.remove( sphereMesh      ) ;
    }

    this.update = function( delta )
    {
        animationUpdate( delta ) ;
    } ;
} ;