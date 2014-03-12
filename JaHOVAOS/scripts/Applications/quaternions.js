
Quaternion = function(){
    
    
    //JaHOVA OS Instance
    var os = com.jahova.os.Instance();
        
    
    
    (execute = function(){
        
        //hijack console function
        console.log = os.console.AppendComment;
    
        //Clear screen
        os.console.Clear();
        
        var theta = 0;
        var phi   = 0;
        //called from command prompt, check to see if theta and phi were passed in
        if((arguments.length > 0) && (arguments[0].toUpperCase() != 'QUATERNIONS')){
            var angles = arguments[0].split(" ");
            theta = +angles[0];
            phi   = +angles[1];
            
        }
        else{
            theta = 90;
            phi   = 90;
        }
        
        //Creating functions to nicely print out matrix, quat, and vectors
        mat3.toString = function(m){
            var out = function(v){
                return v < 0 ? v.toFixed(3) : " " + v.toFixed(3);
            }
            return out(m[0]) + "   " + out(m[3]) + "   " + out(m[6]) + "\n" +
                   out(m[1]) + "   " + out(m[4]) + "   " + out(m[7]) + "\n" +
                   out(m[2]) + "   " + out(m[5]) + "   " + out(m[8]);
        }
        quat4.str = function(v){
            var out = function(val){
                return val < 0 ? val.toFixed(3) : " " + val.toFixed(3);
            }
            
            return out(v[0]) + ", " + out(v[1]) + ", " + out(v[2]) + ", " + out(v[3]);
        }
        vec3.str = function(v){
            var out = function(val){
                return val < 0 ? val.toFixed(3) : " " + val.toFixed(3);
            }
            
            return out(v[0]) + ", " + out(v[1]) + ", " + out(v[2]);
        }
    
        
        //Create inital 4x4 matrix
        var matrix = mat4.create();
        
        //3x3 rotation matrix
        var matrix3 = mat3.create();
        
        //Initialize to identiy matricies
        mat4.identity(matrix);
        mat4.toMat3(matrix, matrix3);
        
        //Create default quaternion (0,0,0,1)
        var quat = quat4.create();
        quat[3] = 1;
        
        //Rotation matrix calculated from quaternion
        var quatMatrix = mat3.create();
        
        
        //Get rotation matrix
        quat4.toMat3(quat, quatMatrix);
        
        console.log("Initial rotation matricies")
        console.log("Mat3");
        console.log(mat3.toString(matrix3));
        console.log("Quat: " + quat4.str(quat));
        console.log(mat3.toString(quatMatrix));
        
        
        
        
        //Rotate by theta on X axis, Then 45 on Y axis
        mat4.rotateY(matrix, theta * Math.PI / 180, matrix);  //Yaw
        mat4.rotateX(matrix, theta * Math.PI / 180, matrix);  //Pitch
        mat4.rotateZ(matrix, theta * Math.PI / 180, matrix);  //Roll
        mat4.toMat3(matrix, matrix3);
        
        //Create Axis rotation quants
        var quatRotX = quat4.create();
        var quatRotY = quat4.create();   
        var quatRotZ = quat4.create();
        
        var quatOut = quat4.create();
        
        //Yaw
        quatRotY[0] = 0 * Math.sin(theta/2 * Math.PI / 180);
        quatRotY[1] = 1 * Math.sin(theta/2 * Math.PI / 180);
        quatRotY[2] = 0 * Math.sin(theta/2 * Math.PI / 180);
        quatRotY[3] = Math.cos(theta/2 * Math.PI / 180);
        
        //Pitch
        quatRotX[0] = 1 * Math.sin(theta/2 * Math.PI / 180);
        quatRotX[1] = 0 * Math.sin(theta/2 * Math.PI / 180);
        quatRotX[2] = 0 * Math.sin(theta/2 * Math.PI / 180);
        quatRotX[3] = Math.cos(theta/2 * Math.PI / 180);
        
        //Roll
        quatRotZ[0] = 0 * Math.sin(theta/2 * Math.PI / 180);
        quatRotZ[1] = 0 * Math.sin(theta/2 * Math.PI / 180);
        quatRotZ[2] = 1 * Math.sin(theta/2 * Math.PI / 180);
        quatRotZ[3] = Math.cos(theta/2 * Math.PI / 180);
        
        //Perform rotations through quaternion multiplication 
        quat4.multiply(quatRotY, quatRotX, quatOut);
        quat4.multiply(quatOut, quatRotZ, quatOut);
        quat4.multiply(quatOut, quat, quatOut);
                
        //Convert to rotation matrix
        quat4.toMat3(quatOut, quatMatrix);
        
        
        console.log("\n\n" + theta + " Degrees (Theta) of Rotation on Y (Yaw), then X (Pitch), then Z (Roll)")
        console.log("Mat3");
        console.log(mat3.toString(matrix3));
        console.log("Quat: " + quat4.str(quatOut));
        console.log(mat3.toString(mat3.transpose(quatMatrix)));
        
        //Create vector to rotate by matrix and quaternion
        var start = vec3.create();
        start[0] = 0;
        start[1] = 1;
        start[2] = 0;
        
        var fin = vec3.create();
        
        console.log("\n\n" + "Rotate Vector by Euler Matrix: M * V")
        mat3.multiplyVec3(matrix3, start, fin);
        console.log("Start: " + vec3.str(start));
        console.log("Final: " + vec3.str(fin));
        
        start[0] = 0;
        start[1] = 1;
        start[2] = 0;
        console.log("Rotate Vector by Quaternion: Q * V * InvQ")
        //Performs  Q * V * Q^-1
        quat4.multiplyVec3(quatOut, start, fin);
        console.log("Start: " + vec3.str(start));
        console.log("Final: " + vec3.str(fin));
        
        
         //Use Quaternions to rotate degrees about Up axis (Yaw)
         
         //Rotation quaternion for Yaw by phi degrees
        var quatYaw = quat4.create();
        quatYaw[0] = quatMatrix[3] * Math.sin(phi/2 * Math.PI / 180);
        quatYaw[1] = quatMatrix[4] * Math.sin(phi/2 * Math.PI / 180);
        quatYaw[2] = quatMatrix[5] * Math.sin(phi/2 * Math.PI / 180);
        quatYaw[3] = Math.cos(phi/2 * Math.PI / 180);
        
        console.log("\n\n" + phi + " Degrees (Phi) of Rotation around Up Axis (yaw) using quaternions");
        quat4.multiply(quatYaw, quatOut, quatOut);
        console.log("Quat: " + quat4.str(quatOut));
        quat4.toMat3(quatOut, quatMatrix);
        console.log(mat3.toString(mat3.transpose(quatMatrix)));
        os.console.Comment("");
    })();
    
    
    os.debugbar.AnchorConsole();
    os.console.AddCommand("quaternions",execute, window, "Run demo for quaternions [pass in theta and phi in degrees]\nExample>>Quaternions 45 90" );
}

