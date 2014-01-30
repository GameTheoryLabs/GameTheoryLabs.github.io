#ifdef GL_ES
precision highp float;
#endif

//
//  OUTPUT VARIABLES
//
varying vec2 vTextureCoord;         //Texture Coordinates
varying vec4 vColor;                //Particle blend color

//
//  TEXTURE VARIABLES
//
uniform sampler2D uSampler;         //Texture being applied to Model

void main(void) {
    
    //Value of pixel color (white or texture color)
    vec4 fragmentColor;

    //Sample Texture assigned to uSampler at UV coordinates to get color
    fragmentColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    
    //Instanced Blend Color
    fragmentColor *= vColor;
    
    gl_FragColor = vec4(fragmentColor.rgb , vColor.a);
        
    
}