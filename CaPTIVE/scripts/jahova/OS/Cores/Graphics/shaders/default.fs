#ifdef GL_ES
precision highp float;
#endif

//
//  OUTPUT VARIABLES
//
varying vec2 vTextureCoord;         //Texture Coordinates
varying vec3 vTransformedNormal;    //Transformed Normal (linearly interporlated across face from Vertex Shader Normal)
varying vec4 vPosition;             //Vert Position in View Space
varying vec3 vPositionW;            //Vert Position in World Space
varying vec3 vPositionL;            //Vert Position in Local Space
varying float vMargin;              //Vert Margin


//
//  CONTROL VARIABLES
//
uniform bool uShowSpecularHighlights;  //Enable Spectural Highlights
uniform bool uUseLighting;              //Enable Lighting
uniform bool uUseTextures;              //Enable Textures
uniform bool uUseBlendColor;            //Enable Blending
uniform bool uEnableAlpha;              //Enable Alpha
uniform bool uUseFog;                   //Enable Fog
uniform bool uUseInstacing;             //Enable Instacing
uniform bool uAligned;                  //Model Has Been Aligned;

//
//  LIGHTING VARIABLES
//
uniform vec3 uAmbientColor;             //Ambient Color
uniform vec3 uPointLightSpecularColor;  //Specular Light Color
uniform vec3 uPointLightDiffuseColor;   //Diffuse Light Color

uniform vec3 uPointLightLocation;       //Location of Point Light

uniform float uMaterialShininess;       //User Defined Material Shininess

//
//  BLEND VARIABLES
//
uniform vec3 uBlendColor;               //Blend Color
uniform float uAlphaValue;              //Alpha Blend Value

//  FOG
uniform vec3 uCameraPosition;           //Camera Position
uniform vec3 uFogColor;                 //Fog Color
uniform float uFogEndPosition;           //Fog End Position
uniform float uFogBeginPosition;         //Fog Begin Position

// MARGIN VARIABLES
uniform bool uLowMarginEnable;
uniform bool uHighMarginEnable;
uniform float uLowMarginValue;
uniform float uHighMarginValue;

//
//  TEXTURE VARIABLES
//
uniform sampler2D uSampler;         //Texture being applied to Model

void main(void) {
    
    vec3 lightWeighting = vec3(0.0,0.0,0.0); //Multiplier for light intinsity
    
    if (!uUseLighting) {    // Lighting Disabled
        
        //Multiplier to final color, this will cause no change
        //  to calculated color
        lightWeighting = vec3(1.0, 1.0, 1.0);
    
    }
    else {  //Lighting Enabled
        
        //Get Direction of Light
        vec3 lightDirection = normalize(uPointLightLocation - vPosition.xyz);
        
        //Normalize Transformed Normal
        //  normalization is required since the vertex normals are linarely interpolated
        //  across the face of the poly
        vec3 normal = normalize(vTransformedNormal);
        
        //Initialize Specular Lighting Weight
        //  Defuault value will show no specular highlights
        float specularLightWeighting = 0.0;
        
        //Test to see if Specular Highlight is enabled
        //  If so, calculate Specular Highlight Weight
        if (uShowSpecularHighlights){   
            
            //  Get Direction of eye 
           vec3 eyeDirection = normalize(-vPosition.xyz);
           
            //  Get Light Reflecition Direction
            vec3 reflectionDirection = reflect(lightDirection, normal);
            
            //Specular Light Weight Calculation
            //  dot - Dot Product between Normalized Reflectiong Direction and Normlize Eye Direction
            //      returns cos of angle between two vectors
            //      This value will vary between 1 and -1, if < 0, no highlight over 90 degrees
            //  max - Takes the largest value between dot and 0, clamps output between 1 and 0
            //  pow - Adjust the intinsity/sharpness of highlight based upon Material Shininess
            specularLightWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), uMaterialShininess);
            lightWeighting = uPointLightSpecularColor * specularLightWeighting;
        }

        //Diffuse Light Weight Calculation
        //  dot - Dot Product between Surface Normal and Normalized Light Direction
        //          returns value between -1 and 1, any value above 0 is reflecting light
        //          values < 0 have not light reflection and therefore need to be clamped
        //  max - Clamps dot output between 0 and 1
        float diffuseLightWeighting = max(dot(normal, lightDirection), 0.0);
        
        //Determine Final Light Weighting
        //  Ambient + Specular + Diffuse
        //      Specular and Diffuse colors are multipled by there weighting to given them
        //      the proper strength based upon current positions
    
        lightWeighting += uAmbientColor + uPointLightDiffuseColor * diffuseLightWeighting;
    }

    //Value of pixel color (white or texture color)
    vec4 fragmentColor;
    
    //If Textures are enabled, get pixel color of texture at current location
    if (uUseTextures) {
        //Sample Texture assigned to uSampler at UV coordinates to get color
        fragmentColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
        
    } else {
        //No Texture selected, fragment color set to white
        fragmentColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    
    if(uUseBlendColor){
    
        fragmentColor = vec4(uBlendColor, fragmentColor.a);
            
    }
    
    if(uEnableAlpha){
        fragmentColor.a = uAlphaValue;
    }
    
    //Yellow RGB 227, 235, 14 = 0.89, 0.92, 0.055 ..  1.0, 0.816, 0.0
    //Green  RGB 17 , 171, 40 = 0.067,0.67, 0.157 ..  0.0, 1.0,   0.0
    //Black  RGB 94 , 97 , 99 = 0.368,0.368,0.368
    if(!uUseTextures){
        if(uAligned){
            if(vPositionL.z > 0.0){
                //fragmentColor.rgb = vec3(0.368,0.368,0.368);
            }
            else if(vPositionL.x < 0.0){
                //fragmentColor.rgb = vec3(0.89, 0.92, 0.055);
            }
            else{
                //fragmentColor.rgb = vec3(0.067,0.67, 0.157);
            }
        }
        else{
            
            if(vPositionW.z > 0.0){
                //fragmentColor.rgb = vec3(0.368,0.368,0.368);
            }
            else if(vPositionW.x < 0.0){
                //fragmentColor.rgb = vec3(1.0, 0.816, 0.0);
            }
            else{
                //fragmentColor.rgb = vec3(0.067,0.67, 0.157);
            }
        }
    }
    if(uHighMarginEnable){
        if((vMargin < uHighMarginValue) && (vMargin > 0.0)){
            fragmentColor.rgba = vec4(1.0, 0.816, 0.0, 1.0);
        }
    }
    
    if(uLowMarginEnable){
        if((vMargin < uLowMarginValue) && (vMargin > 0.0)){
            fragmentColor.rgba = vec4(1.0, 0.0, 0.0, 1.0);
        }
    }
    
    
    //Output final color
    //  fragment color (Texture color or White) Adjusted by Light Calculation Above
    if(uUseFog){
         vec4 surfaceColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a);
         
         float distance = length(vPositionW - uCameraPosition);
         float f = (uFogEndPosition - distance) / (uFogEndPosition - uFogBeginPosition);
         
         gl_FragColor = vec4(f * surfaceColor.rgb, surfaceColor.a) + vec4( (1.0 -f) * uFogColor, 0.0);
    }
    else{
        
        gl_FragColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a);
    }
    
}