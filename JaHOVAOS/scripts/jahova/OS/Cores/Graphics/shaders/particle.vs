attribute vec3 aVertexPosition;     //Vertex Position
attribute vec2 aTextureCoord;       //Texture Coordinate
attribute float aInstance;          //Instance ID

uniform mat4 uWMatrix;              //World
uniform mat4 uRMatrix;              //Rotation
uniform mat4 uVMatrix;              //View
uniform mat4 uPMatrix;              //Projection
uniform vec3 uScale;                //Scale
uniform vec3 uOffset;               //Offset for position
uniform vec3 uInstancePosition[100];//Array Holding Positions for each Instanced Object
uniform vec4 uInstanceColor[100];   //Array Holding Colors for each Instanced Object
uniform bool uUseInstacing;         //Enable Insacing

varying vec2 vTextureCoord;         //Output Texture Coordinate
varying vec4 vColor;                //Particle blend color

void main(void) {
    vec4 posH;
    
    //Output Texture Coord to Fragment Shader
    vTextureCoord = aTextureCoord;
    vColor = uInstanceColor[int(aInstance)];
    
    float positionX = uInstancePosition[int(aInstance)].x;
    float positionY = uInstancePosition[int(aInstance)].y;
    float positionZ = uInstancePosition[int(aInstance)].z;
    
    
    vec4 offset = uRMatrix * vec4(uOffset,1.0);
    
    mat4 mScaleMatrix =  mat4( uScale[0],  0,          0,          0,
                               0,          uScale[1],  0,          0,
                               0,          0,          uScale[2],  0,
                               0,          0,          0,          1);
    
    mat4 mOffsetMatrix =  mat4(1, 0,  0,  0,
                               0, 1,  0,  0,
                               0, 0,  1,  0,
                               offset.x, offset.y, offset.z, 1.0);
                               
    mat4 mPositionMatrix = mat4( 1, 0, 0, 0,
                                 0, 1, 0, 0,
                                 0, 0, 1, 0,
                                 positionX + offset.x, positionY + offset.y, positionZ + offset.z, 1 );


                         
    mat4 mRotation= mat4( uVMatrix[0][0], uVMatrix[1][0], uVMatrix[2][0], 0,
                          uVMatrix[0][1], uVMatrix[1][1], uVMatrix[2][1], 0,
                          uVMatrix[0][2], uVMatrix[1][2], uVMatrix[2][2], 0,
                          uVMatrix[0][3], uVMatrix[1][3], uVMatrix[2][3], uVMatrix[3][3] );
                          
 
//Parent, Translate, Rotate, Scale, Offset

    gl_Position = uPMatrix * uVMatrix *  mPositionMatrix * mRotation * mScaleMatrix *   vec4(aVertexPosition, 1.0);

}