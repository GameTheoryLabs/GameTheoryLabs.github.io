attribute vec3 aVertexPosition;     //Vertex Position
attribute float aVertexMargin;      //Vertex Margin
attribute vec3 aVertexNormal;       //Vertex Normal
attribute vec2 aTextureCoord;       //Texture Coordinate
attribute float aInstance;          //Instance ID

uniform mat4 uWMatrix;              //World
uniform mat4 uVMatrix;              //View
uniform mat4 uPMatrix;              //Projection
uniform mat3 uNMatrix;              //Normal Transform Matrix
uniform vec3 uInstancePosition[2];//Array Holding Positions for each Instanced Object
uniform bool uUseInstacing;         //Enable Instacing

varying vec2 vTextureCoord;         //Output Texture Coordinate
varying vec3 vTransformedNormal;    //Normal Transformed to Clip Space
varying vec4 vPosition;             //Ouput Vert Position in View Space
varying vec3 vPositionW;            //Vert Position in World Space
varying vec3 vPositionL;            //Vert Position in Local Space
varying float vMargin;              //Vert Margin
//varying float vInstanceID;          //Object ID

void main(void) {
    vec4 posH;
    //Local Space Vertex
    vPositionL = aVertexPosition;
    
    // View Space Position, used in Lighting Calculations in fragment shader
    vPosition = uVMatrix * uWMatrix * vec4(aVertexPosition, 1.0);
    
    //World Position of Vert
    vPositionW = vec4( uWMatrix * vec4(aVertexPosition, 1.0) ).xyz;
    
    //Output Texture Coord to Fragment Shader
    vTextureCoord = aTextureCoord;
    
    //Output Normal Trnasformed into View Space to Fragment Shader
    //      For Lighting Calculations
    vTransformedNormal = uNMatrix * aVertexNormal;
    
    vMargin = aVertexMargin;
    
    if(!uUseInstacing){
        //Calculates Final Position of Vert
        posH = uPMatrix * uVMatrix * uWMatrix * vec4(aVertexPosition, 1.0);
        //World = uWMatrix;
        
    }
    else{
        
        float offsetX = uInstancePosition[int(aInstance)].x;//-500.0 + (3.0 * mod( float(aInstance), 300.0));
        float offsetY = uInstancePosition[int(aInstance)].y;//200.0 - (3.0 * floor(float(aInstance)/300.0));
        float offsetZ = uInstancePosition[int(aInstance)].z;//300.0;
        
        mat4 WMatrix = mat4( 1.0, 0.0, 0.0, 0.0,
                             0.0, 1.0, 0.0, 0.0,
                             0.0, 0.0, 1.0, 0.0,
                             offsetX, offsetY, offsetZ, 1.0 );
        
        posH = uPMatrix * uVMatrix * WMatrix * vec4(aVertexPosition, 1.0);
        
        //Sets Instance ID;
        //vInstanceID = aInstance;
        
    }
    
    gl_Position = posH; 

}