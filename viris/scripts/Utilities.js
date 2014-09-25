function randomSpherePoint( vec , rad )
{
    var u     = Math.random() ;
    var v     = Math.random() ;
    var theta = 2 * Math.PI * u ;
    var phi   = Math.acos( 2 * v - 1 ) ;
    var x     = vec.x + ( rad * Math.sin( phi ) * Math.cos( theta ) ) ;
    var y     = vec.y + ( rad * Math.sin( phi ) * Math.sin( theta ) ) ;
    var z     = vec.z + ( rad * Math.cos( phi ) ) ;
    
    return ( new THREE.Vector3( x , y , z ) ) ;
}

function getObjForward( obj )
{
    var vec = new THREE.Vector3( 0 , 0 , -1 ) ;
    vec.applyQuaternion( obj.quaternion );
    return vec ;
}