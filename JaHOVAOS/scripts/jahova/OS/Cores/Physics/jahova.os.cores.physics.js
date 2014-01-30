com.jahova.os.Instance().Cores.Instance().Physics = (function()
{
    var pInstance;

    function constructor()
    {
        //PRIVATE ATTRIBUTES
        var NAME = "JaHOVA OS Internal API : Physics Core";
        var VERSION = "0v5";
        var PATH = "scripts/jahova/OS/Cores/Audio/jahova.os.cores.physics.js";
        var ID = null;
        
        var os = com.jahova.os.Instance();
        var utilities = com.jahova.utilities.Instance();
        
        var numOfForces = 0;
        var numOfEntities = 0;
        /*
         **/
        //PRIVATE METHODS
        
        
        //Private Classes
        var CImpulse = function(id, oEntity,vContactLocal, vForce){
            var _id = id;
            var point = [];
            var applied  = false;
            var entity = oEntity;
            var contact = vContactLocal;
            var force = vForce;
            
            this.Update = function(dt){
                
                entity.Get.PointInWorld(contact, point);
                entity.Add.ForceAtWorldPoint(force, point);
                applied = true;
                
               return -1;
                
            }
            
        }
        var CLocalImpulse = function(id, oEntity,vContactLocal, vForceLocal){
            var _id = id;
            var point = [];
            var applied  = false;
            var entity = oEntity;
            var contact = vContactLocal;
            var force = vForceLocal;
            
            this.Update = function(dt){
                var rot = [];
                //Get rotation matrix
                quat4.toMat4(entity.orientation, rot);
                //Convert Force from local to world cordinates
                mat4.multiplyVec3(rot, force, force);
                
                entity.Get.PointInWorld(contact, point);
                entity.Add.ForceAtWorldPoint(force, point);
                applied = true;
                
               return -1;
                
            }
            
        }
        var CSpringForce = function(id, oEntity, k, length, vPt1, vPt2, oSeconEntity){
            var _id = id;
            this.type = "SPRING";
            
            this.pt1 = vPt1;
            this.pt2 = vPt2;
            this.duration = 0;
            
            this.contactEntity = oSeconEntity;
            
            this.springConstant = k;
            this.restLength = length;
            var positive = null;
            
            //
            //  DEFAULT PROPERTIES/METHODS
            //
            this.entity = oEntity;
            this.Cancel = function(){
                this.duration = -1;
            }
            this.Update = function(dt){
                
                var entity = [];
                var anchor = [];
                
                //if contactEntity is null, pt2 is a world point
                //  otherwise it is anchored to another entity
                //  and pt2 is a local point of entity
                if(this.contactEntity){
                    
                    this.contactEntity.Get.PointInWorld(this.pt2, anchor);
                }
                else{
                    anchor = this.pt2;
                }
                this.entity.Get.PointInWorld(this.pt1 , entity);
                                    
                var kX = [];
                vec3.subtract(anchor, entity, kX);
                
                var mag = vec3.length(kX);  //Length of spring (stretched or compressed)
                
                dx = mag - this.restLength;     //Get ammount of compression or stretched (displacment from rest)
                
                dx = dx * this.springConstant;  //Magnitude of force
                
                vec3.normalize(kX);         //Directon of force
                vec3.scale(kX, dx, kX);   //Scaled by calculated magnitude
                
                //Apply force to object
                this.entity.Add.ForceAtWorldPoint(kX, entity);
                
                return this.duration;
                
                
            }
            this.ID = function(){
                return _id;
            }
            
            
        }
        
        
        var CPhysicsEntity =  function(ID, invMass){
            var self = this;
            var _id = ID;
            this.inverseMass = invMass;
            this.linearDampening = 1;
            this.angularDampening = 1;
            this.maxSpeed = 1000;
            
            this.orientation = quat4.create();
            this.position = vec3.create();
            this.velocity = vec3.create();
            this.omega = vec3.create();
            this.linearAccel = vec3.create();
            this.rotAccel = vec3.create();
            this.forceAccum = vec3.create();
            this.torqueAccum = vec3.create();
            this.gravity = vec3.create();
            
            this.awake = true;
            this.motion = 0;
            
            var inverseInertiaTensorWorld = mat3.create();
            var inverseInertiaTensorLocal = mat3.create();
            this.transformMatrix = mat4.create();
            
            
            //Initialize 3x3 Matrix
            //mat3.identity(this.inverseInertiaTensorLocal);
            //mat3.identity(this.inverseInertiaTensorWorld);
            
            //Set Zero Rotation
            quat4.set([0,0,0,1], this.orientation);
            
            //Initialize 4x4 Matrix
            mat4.identity(this.transformMatrix);
            
            this.Get = {
                ID: function(){
                    return _id;
                },
                PointInLocal: function(vPoint, vOut){
                    var inverse = [];
                    mat4.inverse(self.transformMatrix, inverse);
                    mat4.multiplyVec3(inverse, vPoint, vOut);
                    
                },
                PointInWorld: function(vPoint, vOut){
                    mat4.multiplyVec3(self.transformMatrix, vPoint, vOut);
                },
                InertialTensor: function(){
                    return inverseInertiaTensorLocal;
                }
            }
            
            this.Add ={
                ForceAtCM: function(){
                    
                },
                ForceAtWorldPoint: function(vForce, vPoint){
                    
                    //Linear Motion forceAccum += vForce
                    vec3.add(vForce, self.forceAccum, self.forceAccum);
                    
                    //Rotational
                    var r = []; //radial arm
                    vec3.subtract(vPoint, self.position, r);
                    
                    var torque = [];
                    vec3.cross(r, vForce, torque);
                    //vec3.cross(vForce, r, torque);
                    
                    //torqueAccum += torque
                    vec3.add(torque, self.torqueAccum, self.torqueAccum);

                    self.awake = true;
                    
                }.bind(this),
                ForceAtLocalPoint: function(vForce, vPoint){
                    var point = [];
                    self.Get.PointInWorld(vPoint, point);
                    self.Add.ForceAtWorldPoint(vForce, point);
                },
                Torque: function(){
                    
                },
                InertialTensor: function(mat){
                    inverseInertiaTensorLocal = mat;
                }
            }
            this.PrintRot = function(){
                var rot  = [];
                quat4.toMat3(self.orientation,rot);
                //mat3.transpose(rot, rot);
                
                var localX = [rot[0],rot[1],rot[2]];
                var localY = [rot[3],rot[4],rot[5]];
                var localZ = [rot[6],rot[7],rot[8]];
                
                vec3.normalize(localX, localX);
                vec3.normalize(localY, localY);
                vec3.normalize(localZ, localZ);
                
                os.console.Comment("Theta X: " + (180 * Math.acos(vec3.dot(localX, [1,0,0])).toFixed(2) / Math.PI));
                os.console.Comment("Theta Y: " + (180 * Math.acos(vec3.dot(localY, [0,1,0])).toFixed(2) / Math.PI));
                os.console.Comment("Theta Z: " + (180 * Math.acos(vec3.dot(localZ, [0,0,1])).toFixed(2) / Math.PI));
            }
            this.Clear = function(){
                vec3.set([0,0,0], self.forceAccum);
                vec3.set([0,0,0], self.torqueAccum);
            }
            
            this.CalculateDerivedData = function(){
                quat4.normalize(self.orientation, self.orientation);
                
                var rot = quat4.toMat3(self.orientation);
                var rotInv = [];
                
                mat3.transpose(rot, rotInv);//[rot[0], rot[3], rot[6], rot[1], rot[4], rot[7], rot[2], rot[5], rot[8]];//mat4.toInverseMat3(rot);
                
                //var rot = quat4.toMat4(self.orientation);
                //var rotInv = mat4.inverse(rot);
                
                //mat3.multiply(rotInv, inverseInertiaTensorLocal, inverseInertiaTensorWorld);
                //mat3.multiply(inverseInertiaTensorWorld, rot, inverseInertiaTensorWorld);
                
                mat3.multiply(rot, inverseInertiaTensorLocal, inverseInertiaTensorWorld);
                mat3.multiply(inverseInertiaTensorWorld, rotInv, inverseInertiaTensorWorld);
                
                mat4.identity(self.transformMatrix);
                quat4.toMat4(self.orientation,self.transformMatrix);
                //mat4.transpose(self.transformMatrix);
                //mat4.translate(self.transformMatrix, self.position, self.transformMatrix);
                self.transformMatrix[12] = self.position[0];
                self.transformMatrix[13] = self.position[1];
                self.transformMatrix[14] = self.position[2];
                
                //for debugging, was getting NaN in transform matrix
                if(isNaN(self.transformMatrix[0])){
                    var out = 0;
                    out++;
                }
            }
            this.Update = function(dt){
                if(self.awake){
                    self.CalculateDerivedData();
                    
                    
                    //***********************************
                    //  LINEAR MOTION
                    //***********************************
                    
                    //Calculate Linear Acceleration
                    // a = 1/m * F
                    vec3.scale(self.forceAccum, self.inverseMass, self.linearAccel);
                    
                    //Determine new velocity
                    //   V = Vo*d^dt + a*dt
                    var VoD = [];
                    var aDt = [];
                    vec3.scale(self.velocity, Math.pow(self.linearDampening,dt), VoD);
                    vec3.scale(self.linearAccel, dt, aDt);
                    
                    vec3.add( VoD, aDt, self.velocity);
                    
                    //if(vec3.length(self.velocity) > self.maxSpeed){
                    //    vec3.normalize(self.velocity, self.velocity);
                    //    vec3.scale(self.velocity, self.maxSpeed, self.velocity);
                    //}
                    //Determine new position
                    //   X = Xo + Vo*dt
                    var VoDt = [];
                    vec3.scale(self.velocity, dt, VoDt);
                    
                    vec3.add(self.position, VoDt, self.position);
                    
                    //***********************************
                    //  ROTATIONAL MOTION
                    //**********************************
                    
                    //Calculate Rotation Acceleration
                    // alpha = I^-1 * Torque
                    mat3.multiplyVec3(inverseInertiaTensorWorld, self.torqueAccum, self.rotAccel);                    
                    
                    //Determine new angular velocity
                    //    W = Wo*d^dt + alpha * dt
                    var WoD = [];
                    var alphaDt = [];
                    
                    vec3.scale(self.omega, Math.pow(self.angularDampening, dt),WoD );
                    vec3.scale(self.rotAccel, dt, alphaDt);
                    
                    vec3.add(WoD, alphaDt, self.omega);

                    //Determine new angular displacement
                    //    0 = 0o + t/2*Wo*0o
                    var temp = [];
                    quat4.multiply([self.omega[0], self.omega[1], self.omega[2],0],self.orientation, temp);
                    //quat4.multiplyVec3(self.orientation, self.omega, temp);
                    //quat4.normalize(temp,temp);
                    self.orientation = [self.orientation[0] + temp[0] * dt/2, self.orientation[1] + temp[1] * dt/2, self.orientation[2] + temp[2] * dt/2, self.orientation[3] + temp[3] * dt/2];
                    
                    
                    
                }
            }
            
            
        }
        var COBB = function(){
            var self = this;
            this.entity = null;
            this.name = "";
            this.type = "OBB";
            this.center = [];
            this.halfSize = [];
            this.orientation = [];
            this.transpose = [];
            this.CollisionTest = function(oBV){
                var collision = false;
                
                if(oBV.type ==  "OBB"){
                    collision = true;
                    var a0 = self.halfSize[0], a1 = self.halfSize[1], a2 = self.halfSize[2];
                    var b0 = oBV.halfSize[0],  b1 = oBV.halfSize[1],  b2 = oBV.halfSize[2];
                    var A = [];     //Transform Matrix of Current
                    var B = [];     //Transform Matrix of oBV
                    var C = [];     //Transform Matrix, C = A^T*B, A,B rotation/orientation matricies
                    var D = [];     //Distance Vector, distance between centers
                    
                    quat4.toMat3(this.orientation, A);
                    var A0 = [A[0], A[3], A[6]];
                    var A1 = [A[1], A[4], A[7]];
                    var A2 = [A[2], A[5], A[8]];
                    quat4.toMat3(oBV.orientation,  B);
                    var B0 = [B[0], B[3], B[6]];
                    var B1 = [B[1], B[4], B[7]];
                    var B2 = [B[2], B[5], B[8]];
                    
                    mat3.transpose(A, this.transpose);
                    //mat4.transpose(B, oBV.transpose);
                    mat3.multiply(this.transpose, B,C);
                                       
                    // Cache the matrix values (makes for huge speed increases!)
                    var c00 = C[0], c01 = C[1], c02 = C[2];
                    var c10 = C[3], c11 = C[4], c12 = C[5];
                    var c20 = C[6], c21 = C[7], c22 = C[8];
                    
                    vec3.subtract(oBV.center, this.center, D);
                    
                    //Non-Intersection Test if R > Ro + R1
                    var Ro, R1, R;
                    //
                    //  A
                    //
                    Ro = a0;
                    R1 = b0 * Math.abs(c00) + b1 * Math.abs(c10) + b2* Math.abs(c20);
                    R  = vec3.dot(A0, D);
                    if(R > (Ro + R1)){return false};
                    
                    Ro = a1;
                    R1 = b0 * Math.abs(c01) + b1 * Math.abs(c11) + b2 * Math.abs(c21);
                    R  = vec3.dot(A1, D);
                    if(R > (Ro + R1)){return false};
                    
                    Ro = a2;
                    R1 = b0 * Math.abs(c02) + b1 * Math.abs(c12) + b2 * Math.abs(c22);
                    R  = vec3.dot(A2, D);
                    if(R > (Ro + R1)){return false};
                    
                    //
                    //  B
                    //
                    Ro = a0 * Math.abs(c00) + a1* Math.abs(c01) + a2 * Math.abs(c02);
                    R1 = b0;
                    R  = vec3.dot(B0, D);
                    if(R > (Ro + R1)){return false};
                    
                    Ro = a0 * Math.abs(c10) + a1 * Math.abs(c11) + a2 * Math.abs(c12);
                    R1 = b1
                    R  = vec3.dot(B1, D);
                    if(R > (Ro + R1)){return false};
                    
                    Ro = a0 * Math.abs(c20) + a1 * Math.abs(c21) + a2 * Math.abs(c22);
                    R1 = b2;
                    R  = vec3.dot(B2, D);
                    if(R > (Ro + R1)){return false};
                    
                    //
                    //  A0 X Bi
                    //
                    Ro = a1 * Math.abs(c02) + a2 * Math.abs(c01);
                    R1 = b1 * Math.abs(c20) + b2 * Math.abs(c10);
                    R  = Math.abs(c01 * vec3.dot(A2,D) - c02 * vec3.dot(A1,D));
                    if(R > (Ro + R1)){return false};
                    
                    Ro = a1 * Math.abs(c12) + a2 * Math.abs(c11);
                    R1 = b0 * Math.abs(c20) + b2 * Math.abs(c00);
                    R  = Math.abs(c11 * vec3.dot(A2,D) - c12 * vec3.dot(A1,D));
                    if(R > (Ro + R1)){return false};
                    
                    Ro = a1 * Math.abs(c22) + a2 * Math.abs(c21);
                    R1 = b0 * Math.abs(c10) + b1 * Math.abs(c00);
                    R  = Math.abs(c21 * vec3.dot(A2,D) - c22 * vec3.dot(A1,D));
                    if(R > (Ro + R1)){return false};
                    
                    //
                    //  A1 X Bi
                    //
                    Ro = a0 * Math.abs(c02) + a2 * Math.abs(c00);
                    R1 = b1 * Math.abs(c21) + b2 * Math.abs(c11);
                    R  = Math.abs(c02 * vec3.dot(A0,D) - c00 * vec3.dot(A2,D));
                    if(R > (Ro + R1)){return false};
                    
                    Ro = a0 * Math.abs(c12) + a2 * Math.abs(c10);
                    R1 = b0 * Math.abs(c21) + b2 * Math.abs(c01);
                    R  = Math.abs(c12 * vec3.dot(A0,D) - c10 * vec3.dot(A2,D));
                    if(R > (Ro + R1)){return false};
                    
                    Ro = a0 * Math.abs(c22) + a2 * Math.abs(c20);
                    R1 = b0 * Math.abs(c11) + b1 * Math.abs(c01);
                    R  = Math.abs(c22 * vec3.dot(A0,D) - c20 * vec3.dot(A2,D));
                    if(R > (Ro + R1)){return false};
                    
                    //
                    //  A2 X Bi
                    //
                    Ro = a0 * Math.abs(c01) + a1 * Math.abs(c00);
                    R1 = b1 * Math.abs(c22) + b2 * Math.abs(c12);
                    R  = Math.abs(c00 * vec3.dot(A1,D) - c01 * vec3.dot(A0,D));
                    if(R > (Ro + R1)){return false};
                    
                    Ro = a0 * Math.abs(c11) + a1 * Math.abs(c10);
                    R1 = b0 * Math.abs(c22) + b2 * Math.abs(c02);
                    R  = Math.abs(c10 * vec3.dot(A1,D) - c11 * vec3.dot(A0,D));
                    if(R > (Ro + R1)){return false};
                    
                    Ro = a0 * Math.abs(c21) + a1 * Math.abs(c20);
                    R1 = b0 * Math.abs(c12) + b1 * Math.abs(c02);
                    R  = Math.abs(c20 * vec3.dot(A1,D) - c21 * vec3.dot(A0,D));
                    if(R > (Ro + R1)){return false};
                    
                    
                    collision = new CCollision();
                    collision.obj2 = oBV;
                    collision.point.obj2 = oBV.ClosestPoint(self.center);
                    
                    collision.obj1 = self;
                    collision.point.obj1 = self.ClosestPoint(oBV.center);
                    
                    vec3.subtract(collision.point.obj2, collision.point.obj1, collision.normal);
                    vec3.normalize(collision.normal,collision.normal);
                    
                    
                }
                else if(oBV.type == "AABB"){
                    
                }
                else if(oBV.type == "SPHERE"){
                    var r2 = oBV.halfSize * oBV.halfSize;
                    var closestPoint = self.ClosestPoint(oBV.center);
                    
                    var dist = [];
                    vec3.subtract(closestPoint, oBV.center,dist);
                    
                    collision  = r2 > vec3.dot(dist, dist) ? true : false;
                    if(collision){
                        collision = new CCollision();
                        collision.obj2 = oBV;
                        collision.point.obj2 = oBV.ClosestPoint(self.center);
                        
                        collision.obj1 = self;
                        collision.point.obj1 = closestPoint;
                        
                        vec3.subtract(collision.point.obj2, collision.point.obj1, collision.normal);
                        vec3.normalize(collision.normal,collision.normal);
                    }
                    
                }
                else{
                    //Error, unkknow type
                }
                
                return collision;
            }
            this.ClosestPoint = function(point){
                var distance = [];
                var out = [];
                var length = [];
                var A = []; //3x3 Transform Matrix
                quat4.toMat3(self.orientation, A);
                var Axis = [];
                Axis[0] = [A[0], A[3], A[6]];
                Axis[1] = [A[1], A[4], A[7]];
                Axis[2] = [A[2], A[5], A[8]];
                
                var temp = [];
                
                
                vec3.subtract(point, self.center, distance);
                vec3.set(self.center, out);
            
                for (var i = 0; i < 3; i++) {
                    length = vec3.dot(distance, Axis[i]);
            
                    if (length > self.halfSize[i]){ length =  self.halfSize[i];}
                    else if (length < -self.halfSize[i]){ length = -self.halfSize[i];}
                    
                    //out[i] += length;
                    vec3.scale(Axis[i], length, temp);
                    vec3.add(out, temp, out);
                }
                
                return out;
            }
        }
        var CSphere = function(){
            var self = this;
            this.entity = null;
            this.name = "";
            this.type = "SPHERE";
            this.center = [];
            this.halfSize = 0;
            this.CollisionTest = function(oBV){
                var collision = false;
                
                if(oBV.type ==  "OBB"){
                    var r2 = self.halfSize * self.halfSize;
                    var closestPoint = oBV.ClosestPoint(self.center);
                    
                    var dist = [];
                    vec3.subtract(self.center,closestPoint,dist);
                    
                    collision  = r2 > vec3.dot(dist, dist) ? true : false;
                    if(collision){
                        collision = new CCollision();
                        collision.obj2 = oBV;
                        collision.point.obj2 = closestPoint;
                        
                        collision.obj1 = self;                    
                        vec3.normalize(dist,collision.normal);
                        vec3.scale(dist,collision.normal, self.halfSize, dist);
                        collision.point.obj1 = dist;
                    }
                }
                else if(oBV.type == "AABB"){
                    
                }
                else if(oBV.type == "SPHERE"){
                    var r2 = (self.halfSize + oBV.halfSize) * (self.halfSize + oBV.halfSize);
                    var dist = [];
                    vec3.subtract(self.center, oBV.center,dist);
                    
                    collision  = r2 > vec3.dot(dist, dist) ? true : false;
                    if(collision){
                        collision = new CCollision();
                        
                        vec3.normalize(dist,collision.normal);
                        collision.obj1 = self;
                        vec3.scale(dist,collision.normal, self.halfSize, collision.point.obj1);
                        
                        collision.obj2 = oBV;
                        vec3.scale(collision.normal, oBV.halfSize, collision.point.obj2);
                        vec3.add(oBV.center,collision.point.obj2,collision.point.obj2);
                        
                        
                        
                        
                    }
                }
                else{
                    //Error, unkknow type
                }
                
                return collision;
            }
            this.ClosestPoint = function(point){
                var dir = [];
                vec3.subtract(point,self.center,dir);
                vec3.normalize(dir,dir);
                vec3.scale(dir, self.halfSize, dir);
                return dir;
            }
            
        }
        var CAABB = function(){
            var self = this;
            this.type = "AABB";
            this.center = [];
            this.halfSize = [];
            this.CollisionTest = function(oBV){
                var collision = false;
                
                if(oBV.type ==  "OBB"){
                    
                }
                else if(oBV.type == "AABB"){
                    collision = true;
                    if((Math.abs(self.center[0] - oBV.center[0]) > (self.halfSize[0] + oBV.halfSize[0]))){
                        collision = false;
                    }
                    else if((Math.abs(self.center[1] - oBV.center[1]) > (self.halfSize[1] + oBV.halfSize[1]))){
                        collision = false;
                    }
                    else if((Math.abs(self.center[2] - oBV.center[2]) > (self.halfSize[2] + oBV.halfSize[2]))){
                        collision = false;
                    }
                }
                else if(oBV.type == "SPHERE"){
                    
                }
                else{
                    //Error, unkknow type
                }
                
                return collision;
            }
        
        }
        var CCollision = function(){
            this.obj1 = null;
            this.obj2 = null;
            this.point = {
                obj1: [],
                obj2: []
            }
            this.normal = [];
        }
        return{
            //PUBLIC ATTRIBUTES
            forces: [],
            collisions: [],
            bvs:[],
            entities: null,
            forceMap: null,
            gravity: [],
            maxContacts: 10,
            contacts: [],
            Create: {
                Force: {
                    Impulse: function(oEntity, vContactLocal, vForce){
                        var force = new CImpulse(numOfForces++, oEntity,vContactLocal, vForce);
                        os.physics.forces.push(force);
                        //os.physics.forceMap.put(numOfForces, force);
                        return force;
                        
                    },
                    LocalImpulse: function(oEntity, vContactLocal, vForceLocal){
                        var force = new CLocalImpulse(numOfForces++, oEntity, vContactLocal, vForceLocal);
                        os.physics.forces.push(force);
                        return force;
                    },
                    Spring: function(oEntity, k, length, vPt1,vPt2,oSecondEntity){
                        var force = new CSpringForce(numOfForces++, oEntity, k, length, vPt1, vPt2, oSecondEntity);
                        os.physics.forces.push(force);
                        //os.physics.forceMap.put(numOfForces, force);
                        return force;
                    },
                    Blast: function(){
                        
                    }
                },
                BV: {
                    OBB: function(oPhysicsEntity, vHalfSize, vCenter){
                        var obb  = new COBB();
                        obb.entity = oPhysicsEntity;
                        obb.halfSize = vHalfSize;
                        obb.orientation = oPhysicsEntity ? oPhysicsEntity.orientation : [0,0,0,1];
                        if(vCenter){obb.center = vCenter;}
                        else{obb.center = oPhysicsEntity.position;}
                        os.physics.bvs.push(obb);
                        return obb;
                    },
                    Sphere: function(oPhysicsEntity, fRadius, vCenter){
                        var sphere  = new CSphere();
                        sphere.entity = oPhysicsEntity;
                        sphere.halfSize = fRadius;
                        if(vCenter){sphere.center = vCenter;}
                        else{sphere.center = oPhysicsEntity.position;}
                        os.physics.bvs.push(sphere);
                        return sphere;
                    },
                    ABB: function(oPhysicsEntity, vHalfSize, vCenter){
                        
                    }
                },
                Entity: function(invMass){
                    var ent = new CPhysicsEntity(numOfEntities++, invMass);
                    os.physics.entities.put(numOfEntities, ent)
                    return ent;
                },
                InertialTensor: {
                    SphereSolid: function(obj, radius){
                        var temp = (5/(2 * radius * radius) * obj.inverseMass)
                        
                        var it = [
                            temp,   0,      0,
                            0,      temp,   0,
                            0,      0,      temp];
                        
                        return it;
                    },
                    SphereHollow: function(obj, radius){
                        var temp = (3/(2 * radius * radius) * obj.inverseMass)
                        
                        var it = [
                            temp,   0,      0,
                            0,      temp,   0,
                            0,      0,      temp];
                        
                        return it;
                    },
                    EllipsoidSolid: function(obj, dx, dy, dz){
                        var temp1 = (5/(dy*dy + dz*dz) * obj.inverseMass);
                        var temp2 = (5/(dx*dx + dz*dz) * obj.inverseMass);
                        var temp3 = (5/(dx*dx + dy*dy) * obj.inverseMass);
                        
                        var it = [
                            temp1,  0,      0,
                            0,      temp2,  0,
                            0,      0,      temp3];
                        
                        return it;
                    },
                    Cone: function(obj, radius, height){
                        var temp1 = 1/( (3/5)*height*height + (3/20)*radius*radius) * obj.inverseMass;
                        var temp2 = (10/(3*radius*radius) * obj.inverseMass);
                        
                        var it = [
                            temp1,  0,      0,
                            0,      temp1,  0,
                            0,      0,      temp2];
                        
                        return it;
                    },
                    Cube: function(obj, dx, dy, dz){
                        var temp1 = (12/(dy*dy + dz*dz) * obj.inverseMass);
                        var temp2 = (12/(dx*dx + dz*dz) * obj.inverseMass);
                        var temp3 = (12/(dx*dx + dy*dy) * obj.inverseMass);
                        
                        var it = [
                            temp1,  0,      0,
                            0,      temp2,  0,
                            0,      0,      temp3];
                        
                        return it;
                    },
                    CylinderSolid: function(obj, radius, height){
                        var temp1 = 1/(12 * (3 * radius * radius + height * height)) * obj.inverseMass;
                        var temp2 = (2/(radius*radius) * obj.inverseMass);
                        
                        var it = [
                            temp1,  0,      0,
                            0,      temp1,  0,
                            0,      0,      temp2];
                        
                        return it;
                    },
                    CylinderHollow: function(obj, innerRadius, outerRadius, height){
                        var temp1 = 1/(12 * (3 * (innerRadius*innerRadius + outerRadius*outerRadius) + height * height)) * obj.inverseMass;
                        var temp2 = (2/((innerRadius*innerRadius + outerRadius*outerRadius)) * obj.inverseMass);
                        
                        var it = [
                            temp1,  0,      0,
                            0,      temp1,  0,
                            0,      0,      temp2];
                        
                        return it;
                    }
                }
            },
            Delete: {
                Force: function(){
                
                },
                Entity: function(){
                    
                }
            },        
            Register: {
                Force: function(){
                
                },
                Entity: function(){
                    
                }
            },
            Update: {
                All: function(dt){
                    os.physics.Update.Accumulators();
                    os.physics.Update.Forces(dt);
                    os.physics.Update.Entities(dt);
                },
                Accumulators: function(){
                    //Clear all Force/Torque Accumulators in Entities
                    for(var i = 0; i < os.physics.entities.size; i++){
                        (os.physics.entities.value()).Clear();
                        os.physics.entities.next();
                    }
                },
                Forces: function(dt){
                    
                    //Update all forces in regsitry
                    for(var i = os.physics.forces.length - 1; i >= 0 ; i--){
                        
                        if(os.physics.forces[i].Update(dt) < 0){
                            //Remove element if duration has gone to -1
                            os.physics.forces.splice(i,1);
                        }
                    }
                },
                Entities: function(dt){
                    //Update Physcis Entities Position/Rotations
                    for(var i = 0; i < os.physics.entities.size; i++){
                        (os.physics.entities.value()).Update(dt);
                        os.physics.entities.next();
                    }
                }
            },
            Contacts: {
                Generate: function(){
                    var collision = false;
                    for(var i = os.physics.bvs.length - 1; i >= 0; i--){
                        for(var j = i - 1; j >= 0; j--){
                            if(os.physics.bvs[i].CollisionTest(os.physics.bvs[j])){
                                //create Collision Object
                            }
                        }
                    }
                },
                Resolve: function(){
                    
                }
            },
            //PUBLIC PRIVILEDGE METHODS
            
            GetName: function(){
                return NAME;
            },
            
            GetVersion: function(){
                return VERSION;
            },
            
            GetPath: function(){
                return PATH;
            },
           
            GetID: function(){
                return ID;
            },
            
            Initialize: function(){
                os.physics.entities = os.resschmgr.Create.Map();
                //os.physics.bvs = os.resschmgr.Create.Map();
                os.physics.forceMap = os.resschmgr.Create.Map();
                vec3.create(os.physics.gravity);
            }
            
        }
    }
    
    return {
        //OBJECT ACCESSOR
        Instance: function()
        {
            if(!pInstance)
            {
                //Instantiate if pInstance does not exist
                pInstance = constructor();
            }
            
            return pInstance;
        }
    }
})();