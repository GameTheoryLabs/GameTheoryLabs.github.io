HologramShaderUniforms =
{
    "amplitude"   : { type: "f" , value : 1.0                         } ,
    "frequency"   : { type: "f" , value : 1.0                         } ,
    "shift"       : { type: "f" , value : 0.0                         } ,
    "yShift"      : { type: "f" , value : 0.0                         } ,
    "length"      : { type: "f" , value : 1.0                         } ,
    "ySinEnable"  : { type: "f" , value : 0.0                         } ,
    "zSinEnable"  : { type: "f" , value : 0.0                         } ,
    "yLenEnable"  : { type: "f" , value : 0.0                         } ,
    "wave"        : { type: "f" , value : 1.0                         } , 
    "alpha"       : { type: "f" , value : 1.0                         } ,
    glowColor     : { type: "c" , value : new THREE.Color( 0x2727ff ) } 
} ;

HologramShader =
{
    vertexShader:
    [
        "uniform float amplitude  ; " ,
        "uniform float frequency  ; " ,
        "uniform float shift      ; " ,
        "uniform float yShift     ; " ,
        "uniform float length     ; " ,
        "uniform float ySinEnable ; " ,
        "uniform float zSinEnable ; " ,
        "uniform float yLenEnable ; " ,
        "varying float alphaInten ; " ,
        "void main()" ,
        "{",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ) ; " ,
            "float sy    = ( ySinEnable == 1.0 ) ? ( amplitude * sin( frequency * position.y + shift ) + yShift ) : 1.0 ; " ,
            "float sz    = ( zSinEnable == 1.0 ) ? ( amplitude * sin( frequency * position.z + shift ) + yShift ) : 1.0 ; " ,
            "float lz    = ( yLenEnable == 1.0 ) ? 1.0 - ( position.z / length ) : 1.0 ; " ,
            "alphaInten  = sy * sz * lz ; " ,
        "}" ,
    ].join( "\n" ) ,
    
    fragmentShader:
    [
        "uniform vec3  glowColor  ; " ,
        "uniform float alpha      ; " ,
        "uniform float wave       ; " ,
        "varying float alphaInten ; " ,
        "void main()" ,
        "{" ,
            "vec3 col     = vec3( glowColor.r * wave , glowColor.g * wave , glowColor.b ) ; " ,
            "gl_FragColor = vec4( col , alpha * alphaInten ) ; " ,
        "}" ,
    ].join( "\n" )
} ;