//
//  VECTOR/MATRIX MATH LIBRARY
//
//

if(typeof Float32Array != 'undefined') {
	glMatrixArrayType = Float32Array;
} else if(typeof WebGLFloatArray != 'undefined') {
	glMatrixArrayType = WebGLFloatArray;
} else {
	glMatrixArrayType = Array;
}

var vec3 = {};
vec3.create = function(vec) {
	var dest = new glMatrixArrayType(3);
	
	if(vec) {
		dest[0] = vec[0];
		dest[1] = vec[1];
		dest[2] = vec[2];
	}
	
	return dest;
};

vec3.set = function(vec, dest) {
	dest[0] = vec[0];
	dest[1] = vec[1];
	dest[2] = vec[2];
	
	return dest;
};

vec3.add = function(vec, vec2, dest) {
	if(!dest || vec == dest) {
		vec[0] += vec2[0];
		vec[1] += vec2[1];
		vec[2] += vec2[2];
		return vec;
	}
	
	dest[0] = vec[0] + vec2[0];
	dest[1] = vec[1] + vec2[1];
	dest[2] = vec[2] + vec2[2];
	return dest;
};

vec3.subtract = function(vec, vec2, dest) {
	if(!dest || vec == dest) {
		vec[0] -= vec2[0];
		vec[1] -= vec2[1];
		vec[2] -= vec2[2];
		return vec;
	}
	
	dest[0] = vec[0] - vec2[0];
	dest[1] = vec[1] - vec2[1];
	dest[2] = vec[2] - vec2[2];
	return dest;
};

vec3.negate = function(vec, dest) {
	if(!dest) { dest = vec; }
	
	dest[0] = -vec[0];
	dest[1] = -vec[1];
	dest[2] = -vec[2];
	return dest;
};

vec3.scale = function(vec, val, dest) {
	if(!dest || vec == dest) {
		vec[0] *= val;
		vec[1] *= val;
		vec[2] *= val;
		return vec;
	}
	
	dest[0] = vec[0]*val;
	dest[1] = vec[1]*val;
	dest[2] = vec[2]*val;
	return dest;
};

vec3.normalize = function(vec, dest) {
	if(!dest) { dest = vec; }
	
	var x = vec[0], y = vec[1], z = vec[2];
	var len = Math.sqrt(x*x + y*y + z*z);
	
	if (!len) {
		dest[0] = 0;
		dest[1] = 0;
		dest[2] = 0;
		return dest;
	} else if (len == 1) {
		dest[0] = x;
		dest[1] = y;
		dest[2] = z;
		return dest;
	}
	
	len = 1 / len;
	dest[0] = x*len;
	dest[1] = y*len;
	dest[2] = z*len;
	return dest;
};

vec3.cross = function(vec, vec2, dest){
	if(!dest) { dest = vec; }
	
	var x = vec[0], y = vec[1], z = vec[2];
	var x2 = vec2[0], y2 = vec2[1], z2 = vec2[2];
	
	dest[0] = y*z2 - z*y2;
	dest[1] = z*x2 - x*z2;
	dest[2] = x*y2 - y*x2;
	return dest;
};

vec3.length = function(vec){
	var x = vec[0], y = vec[1], z = vec[2];
	return Math.sqrt(x*x + y*y + z*z);
};

vec3.dot = function(vec, vec2){
	return vec[0]*vec2[0] + vec[1]*vec2[1] + vec[2]*vec2[2];
};

vec3.direction = function(vec, vec2, dest) {
	if(!dest) { dest = vec; }
	
	var x = vec[0] - vec2[0];
	var y = vec[1] - vec2[1];
	var z = vec[2] - vec2[2];
	
	var len = Math.sqrt(x*x + y*y + z*z);
	if (!len) { 
		dest[0] = 0; 
		dest[1] = 0; 
		dest[2] = 0;
		return dest; 
	}
	
	len = 1 / len;
	dest[0] = x * len; 
	dest[1] = y * len; 
	dest[2] = z * len;
	return dest; 
};

vec3.str = function(vec) {
	return '[' + vec[0] + ', ' + vec[1] + ', ' + vec[2] + ']'; 
};


var mat3 = {};
mat3.create = function(mat) {
	var dest = new glMatrixArrayType(9);
	
	if(mat) {
		dest[0] = mat[0];
		dest[1] = mat[1];
		dest[2] = mat[2];
		dest[3] = mat[3];
		dest[4] = mat[4];
		dest[5] = mat[5];
		dest[6] = mat[6];
		dest[7] = mat[7];
		dest[8] = mat[8];
		dest[9] = mat[9];
	}
	
	return dest;
};

mat3.set = function(mat, dest) {
	dest[0] = mat[0];
	dest[1] = mat[1];
	dest[2] = mat[2];
	dest[3] = mat[3];
	dest[4] = mat[4];
	dest[5] = mat[5];
	dest[6] = mat[6];
	dest[7] = mat[7];
	dest[8] = mat[8];
	return dest;
};

mat3.identity = function(dest) {
	dest[0] = 1;
	dest[1] = 0;
	dest[2] = 0;
	dest[3] = 0;
	dest[4] = 1;
	dest[5] = 0;
	dest[6] = 0;
	dest[7] = 0;
	dest[8] = 1;
	return dest;
};

mat3.toMat4 = function(mat, dest) {
	if(!dest) { dest = mat4.create(); }
	
	dest[0] = mat[0];
	dest[1] = mat[1];
	dest[2] = mat[2];
	dest[3] = 0;

	dest[4] = mat[3];
	dest[5] = mat[4];
	dest[6] = mat[5];
	dest[7] = 0;

	dest[8] = mat[6];
	dest[9] = mat[7];
	dest[10] = mat[8];
	dest[11] = 0;

	dest[12] = 0;
	dest[13] = 0;
	dest[14] = 0;
	dest[15] = 1;
	
	return dest;
}

mat3.str = function(mat) {
	return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] + 
		', ' + mat[3] + ', '+ mat[4] + ', ' + mat[5] + 
		', ' + mat[6] + ', ' + mat[7] + ', '+ mat[8] + ']';
};
mat3.multiply = function(mat, mat2, dest) {
	if(!dest) { dest = mat }
	
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2];
	var a10 = mat[3], a11 = mat[4], a12 = mat[5];
	var a20 = mat[6], a21 = mat[7], a22 = mat[8];
	
	var b00 = mat2[0], b01 = mat2[1], b02 = mat2[2];
	var b10 = mat2[3], b11 = mat2[4], b12 = mat2[5];
	var b20 = mat2[6], b21 = mat2[7], b22 = mat2[8];
	
	dest[0] = b00*a00 + b01*a10 + b02*a20;
	dest[1] = b00*a01 + b01*a11 + b02*a21;
	dest[2] = b00*a02 + b01*a12 + b02*a22;
	
	dest[3] = b10*a00 + b11*a10 + b12*a20;
	dest[4] = b10*a01 + b11*a11 + b12*a21;
	dest[5] = b10*a02 + b11*a12 + b12*a22;
	
	dest[6] = b20*a00 + b21*a10 + b22*a20;
	dest[7] = b20*a01 + b21*a11 + b22*a21;
	dest[8] = b20*a02 + b21*a12 + b22*a22;
	
	
	return dest;
};
mat3.multiplyVec3 = function(mat, vec, dest) {
	if(!dest) { dest = vec }
	
	var x = vec[0], y = vec[1], z = vec[2];
	
	dest[0] = mat[0]*x + mat[3]*y + mat[6]*z;
	dest[1] = mat[1]*x + mat[4]*y + mat[7]*z;
	dest[2] = mat[2]*x + mat[5]*y + mat[8]*z;
	
	
	return dest;
	
};
mat3.transpose = function (a, b) {
    if (!b || a == b) {
        var c = a[1],
            d = a[2],
            e = a[5];
			a[1] = a[3];
			a[2] = a[6];
			a[3] = c;
			a[5] = a[7];
			a[6] = d;
			a[7] = e;
			return a
    }
    b[0] = a[0];
    b[1] = a[3];
    b[2] = a[6];
    b[3] = a[1];
    b[4] = a[4];
    b[5] = a[7];
    b[6] = a[2];
    b[7] = a[5];
    b[8] = a[8];
    return b
};

var mat4 = {};
mat4.create = function(mat) {
	var dest = new glMatrixArrayType(16);
	
	if(mat) {
		dest[0] = mat[0];
		dest[1] = mat[1];
		dest[2] = mat[2];
		dest[3] = mat[3];
		dest[4] = mat[4];
		dest[5] = mat[5];
		dest[6] = mat[6];
		dest[7] = mat[7];
		dest[8] = mat[8];
		dest[9] = mat[9];
		dest[10] = mat[10];
		dest[11] = mat[11];
		dest[12] = mat[12];
		dest[13] = mat[13];
		dest[14] = mat[14];
		dest[15] = mat[15];
	}
	
	return dest;
};

mat4.set = function(mat, dest) {
	dest[0] = mat[0];
	dest[1] = mat[1];
	dest[2] = mat[2];
	dest[3] = mat[3];
	dest[4] = mat[4];
	dest[5] = mat[5];
	dest[6] = mat[6];
	dest[7] = mat[7];
	dest[8] = mat[8];
	dest[9] = mat[9];
	dest[10] = mat[10];
	dest[11] = mat[11];
	dest[12] = mat[12];
	dest[13] = mat[13];
	dest[14] = mat[14];
	dest[15] = mat[15];
	return dest;
};

mat4.identity = function(dest) {
	dest[0] = 1;
	dest[1] = 0;
	dest[2] = 0;
	dest[3] = 0;
	dest[4] = 0;
	dest[5] = 1;
	dest[6] = 0;
	dest[7] = 0;
	dest[8] = 0;
	dest[9] = 0;
	dest[10] = 1;
	dest[11] = 0;
	dest[12] = 0;
	dest[13] = 0;
	dest[14] = 0;
	dest[15] = 1;
	return dest;
};

mat4.transpose = function(mat, dest) {
	// If we are transposing ourselves we can skip a few steps but have to cache some values
	if(!dest || mat == dest) { 
		var a01 = mat[1], a02 = mat[2], a03 = mat[3];
		var a12 = mat[6], a13 = mat[7];
		var a23 = mat[11];
		
		mat[1] = mat[4];
		mat[2] = mat[8];
		mat[3] = mat[12];
		mat[4] = a01;
		mat[6] = mat[9];
		mat[7] = mat[13];
		mat[8] = a02;
		mat[9] = a12;
		mat[11] = mat[14];
		mat[12] = a03;
		mat[13] = a13;
		mat[14] = a23;
		return mat;
	}
	
	dest[0] = mat[0];
	dest[1] = mat[4];
	dest[2] = mat[8];
	dest[3] = mat[12];
	dest[4] = mat[1];
	dest[5] = mat[5];
	dest[6] = mat[9];
	dest[7] = mat[13];
	dest[8] = mat[2];
	dest[9] = mat[6];
	dest[10] = mat[10];
	dest[11] = mat[14];
	dest[12] = mat[3];
	dest[13] = mat[7];
	dest[14] = mat[11];
	dest[15] = mat[15];
	return dest;
};

mat4.determinant = function(mat) {
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
	var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

	return	a30*a21*a12*a03 - a20*a31*a12*a03 - a30*a11*a22*a03 + a10*a31*a22*a03 +
			a20*a11*a32*a03 - a10*a21*a32*a03 - a30*a21*a02*a13 + a20*a31*a02*a13 +
			a30*a01*a22*a13 - a00*a31*a22*a13 - a20*a01*a32*a13 + a00*a21*a32*a13 +
			a30*a11*a02*a23 - a10*a31*a02*a23 - a30*a01*a12*a23 + a00*a31*a12*a23 +
			a10*a01*a32*a23 - a00*a11*a32*a23 - a20*a11*a02*a33 + a10*a21*a02*a33 +
			a20*a01*a12*a33 - a00*a21*a12*a33 - a10*a01*a22*a33 + a00*a11*a22*a33;
};

mat4.inverse = function(mat, dest) {
	if(!dest) { dest = mat; }
	
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
	var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
	
	var b00 = a00*a11 - a01*a10;
	var b01 = a00*a12 - a02*a10;
	var b02 = a00*a13 - a03*a10;
	var b03 = a01*a12 - a02*a11;
	var b04 = a01*a13 - a03*a11;
	var b05 = a02*a13 - a03*a12;
	var b06 = a20*a31 - a21*a30;
	var b07 = a20*a32 - a22*a30;
	var b08 = a20*a33 - a23*a30;
	var b09 = a21*a32 - a22*a31;
	var b10 = a21*a33 - a23*a31;
	var b11 = a22*a33 - a23*a32;
	
	// Calculate the determinant (inlined to avoid double-caching)
	var invDet = 1/(b00*b11 - b01*b10 + b02*b09 + b03*b08 - b04*b07 + b05*b06);
	
	dest[0] = (a11*b11 - a12*b10 + a13*b09)*invDet;
	dest[1] = (-a01*b11 + a02*b10 - a03*b09)*invDet;
	dest[2] = (a31*b05 - a32*b04 + a33*b03)*invDet;
	dest[3] = (-a21*b05 + a22*b04 - a23*b03)*invDet;
	dest[4] = (-a10*b11 + a12*b08 - a13*b07)*invDet;
	dest[5] = (a00*b11 - a02*b08 + a03*b07)*invDet;
	dest[6] = (-a30*b05 + a32*b02 - a33*b01)*invDet;
	dest[7] = (a20*b05 - a22*b02 + a23*b01)*invDet;
	dest[8] = (a10*b10 - a11*b08 + a13*b06)*invDet;
	dest[9] = (-a00*b10 + a01*b08 - a03*b06)*invDet;
	dest[10] = (a30*b04 - a31*b02 + a33*b00)*invDet;
	dest[11] = (-a20*b04 + a21*b02 - a23*b00)*invDet;
	dest[12] = (-a10*b09 + a11*b07 - a12*b06)*invDet;
	dest[13] = (a00*b09 - a01*b07 + a02*b06)*invDet;
	dest[14] = (-a30*b03 + a31*b01 - a32*b00)*invDet;
	dest[15] = (a20*b03 - a21*b01 + a22*b00)*invDet;
	
	return dest;
};

mat4.toMat3 = function(mat, dest) {
	if(!dest) { dest = mat3.create(); }
	
	dest[0] = mat[0];
	dest[1] = mat[1];
	dest[2] = mat[2];
	dest[3] = mat[4];
	dest[4] = mat[5];
	dest[5] = mat[6];
	dest[6] = mat[8];
	dest[7] = mat[9];
	dest[8] = mat[10];
	
	return dest;
};

mat4.toInverseMat3 = function(mat, dest) {
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10];
	
	var b01 = a22*a11-a12*a21;
	var b11 = -a22*a10+a12*a20;
	var b21 = a21*a10-a11*a20;
		
	var d = a00*b01 + a01*b11 + a02*b21;
	if (!d) { return null; }
	var id = 1/d;
	
	if(!dest) { dest = mat3.create(); }
	
	dest[0] = b01*id;
	dest[1] = (-a22*a01 + a02*a21)*id;
	dest[2] = (a12*a01 - a02*a11)*id;
	dest[3] = b11*id;
	dest[4] = (a22*a00 - a02*a20)*id;
	dest[5] = (-a12*a00 + a02*a10)*id;
	dest[6] = b21*id;
	dest[7] = (-a21*a00 + a01*a20)*id;
	dest[8] = (a11*a00 - a01*a10)*id;
	
	return dest;
};

mat4.multiply = function(mat, mat2, dest) {
	if(!dest) { dest = mat }
	
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
	var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
	
	var b00 = mat2[0], b01 = mat2[1], b02 = mat2[2], b03 = mat2[3];
	var b10 = mat2[4], b11 = mat2[5], b12 = mat2[6], b13 = mat2[7];
	var b20 = mat2[8], b21 = mat2[9], b22 = mat2[10], b23 = mat2[11];
	var b30 = mat2[12], b31 = mat2[13], b32 = mat2[14], b33 = mat2[15];
	
	dest[0] = b00*a00 + b01*a10 + b02*a20 + b03*a30;
	dest[1] = b00*a01 + b01*a11 + b02*a21 + b03*a31;
	dest[2] = b00*a02 + b01*a12 + b02*a22 + b03*a32;
	dest[3] = b00*a03 + b01*a13 + b02*a23 + b03*a33;
	dest[4] = b10*a00 + b11*a10 + b12*a20 + b13*a30;
	dest[5] = b10*a01 + b11*a11 + b12*a21 + b13*a31;
	dest[6] = b10*a02 + b11*a12 + b12*a22 + b13*a32;
	dest[7] = b10*a03 + b11*a13 + b12*a23 + b13*a33;
	dest[8] = b20*a00 + b21*a10 + b22*a20 + b23*a30;
	dest[9] = b20*a01 + b21*a11 + b22*a21 + b23*a31;
	dest[10] = b20*a02 + b21*a12 + b22*a22 + b23*a32;
	dest[11] = b20*a03 + b21*a13 + b22*a23 + b23*a33;
	dest[12] = b30*a00 + b31*a10 + b32*a20 + b33*a30;
	dest[13] = b30*a01 + b31*a11 + b32*a21 + b33*a31;
	dest[14] = b30*a02 + b31*a12 + b32*a22 + b33*a32;
	dest[15] = b30*a03 + b31*a13 + b32*a23 + b33*a33;
	
	return dest;
};

mat4.multiplyVec3 = function(mat, vec, dest) {
	if(!dest) { dest = vec }
	
	var x = vec[0], y = vec[1], z = vec[2];
	
	dest[0] = mat[0]*x + mat[4]*y + mat[8]*z + mat[12];
	dest[1] = mat[1]*x + mat[5]*y + mat[9]*z + mat[13];
	dest[2] = mat[2]*x + mat[6]*y + mat[10]*z + mat[14];
	
	return dest;
};

mat4.multiplyVec4 = function(mat, vec, dest) {
	if(!dest) { dest = vec }
	
	var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
	
	dest[0] = mat[0]*x + mat[4]*y + mat[8]*z + mat[12]*w;
	dest[1] = mat[1]*x + mat[5]*y + mat[9]*z + mat[13]*w;
	dest[2] = mat[2]*x + mat[6]*y + mat[10]*z + mat[14]*w;
	dest[3] = mat[3]*x + mat[7]*y + mat[11]*z + mat[15]*w;
	
	return dest;
};

mat4.translate = function(mat, vec, dest) {
	var x = vec[0], y = vec[1], z = vec[2];
	
	if(!dest || mat == dest) {
		mat[12] = mat[0]*x + mat[4]*y + mat[8]*z + mat[12];
		mat[13] = mat[1]*x + mat[5]*y + mat[9]*z + mat[13];
		mat[14] = mat[2]*x + mat[6]*y + mat[10]*z + mat[14];
		mat[15] = mat[3]*x + mat[7]*y + mat[11]*z + mat[15];
		return mat;
	}
	
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
	
	dest[0] = a00;
	dest[1] = a01;
	dest[2] = a02;
	dest[3] = a03;
	dest[4] = a10;
	dest[5] = a11;
	dest[6] = a12;
	dest[7] = a13;
	dest[8] = a20;
	dest[9] = a21;
	dest[10] = a22;
	dest[11] = a23;
	
	dest[12] = a00*x + a10*y + a20*z + mat[12];
	dest[13] = a01*x + a11*y + a21*z + mat[13];
	dest[14] = a02*x + a12*y + a22*z + mat[14];
	dest[15] = a03*x + a13*y + a23*z + mat[15];
	return dest;
};

mat4.scale = function(mat, vec, dest) {
	var x = vec[0], y = vec[1], z = vec[2];
	
	if(!dest || mat == dest) {
		mat[0] *= x;
		mat[1] *= x;
		mat[2] *= x;
		mat[3] *= x;
		mat[4] *= y;
		mat[5] *= y;
		mat[6] *= y;
		mat[7] *= y;
		mat[8] *= z;
		mat[9] *= z;
		mat[10] *= z;
		mat[11] *= z;
		return mat;
	}
	
	dest[0] = mat[0]*x;
	dest[1] = mat[1]*x;
	dest[2] = mat[2]*x;
	dest[3] = mat[3]*x;
	dest[4] = mat[4]*y;
	dest[5] = mat[5]*y;
	dest[6] = mat[6]*y;
	dest[7] = mat[7]*y;
	dest[8] = mat[8]*z;
	dest[9] = mat[9]*z;
	dest[10] = mat[10]*z;
	dest[11] = mat[11]*z;
	dest[12] = mat[12];
	dest[13] = mat[13];
	dest[14] = mat[14];
	dest[15] = mat[15];
	return dest;
};

mat4.rotate = function(mat, angle, axis, dest) {
	var x = axis[0], y = axis[1], z = axis[2];
	var len = Math.sqrt(x*x + y*y + z*z);
	if (!len) { return null; }
	if (len != 1) {
		len = 1 / len;
		x *= len; 
		y *= len; 
		z *= len;
	}
	
	var s = Math.sin(angle);
	var c = Math.cos(angle);
	var t = 1-c;
	
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
	
	// Construct the elements of the rotation matrix
	var b00 = x*x*t + c, b01 = y*x*t + z*s, b02 = z*x*t - y*s;
	var b10 = x*y*t - z*s, b11 = y*y*t + c, b12 = z*y*t + x*s;
	var b20 = x*z*t + y*s, b21 = y*z*t - x*s, b22 = z*z*t + c;
	
	if(!dest) { 
		dest = mat 
	} else if(mat != dest) { // If the source and destination differ, copy the unchanged last row
		dest[12] = mat[12];
		dest[13] = mat[13];
		dest[14] = mat[14];
		dest[15] = mat[15];
	}
	
	// Perform rotation-specific matrix multiplication
	dest[0] = a00*b00 + a10*b01 + a20*b02;
	dest[1] = a01*b00 + a11*b01 + a21*b02;
	dest[2] = a02*b00 + a12*b01 + a22*b02;
	dest[3] = a03*b00 + a13*b01 + a23*b02;
	
	dest[4] = a00*b10 + a10*b11 + a20*b12;
	dest[5] = a01*b10 + a11*b11 + a21*b12;
	dest[6] = a02*b10 + a12*b11 + a22*b12;
	dest[7] = a03*b10 + a13*b11 + a23*b12;
	
	dest[8] = a00*b20 + a10*b21 + a20*b22;
	dest[9] = a01*b20 + a11*b21 + a21*b22;
	dest[10] = a02*b20 + a12*b21 + a22*b22;
	dest[11] = a03*b20 + a13*b21 + a23*b22;
	return dest;
};

mat4.rotateX = function(mat, angle, dest) {
	var s = Math.sin(angle);
	var c = Math.cos(angle);
	
	// Cache the matrix values (makes for huge speed increases!)
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];

	if(!dest) { 
		dest = mat 
	} else if(mat != dest) { // If the source and destination differ, copy the unchanged rows
		dest[0] = mat[0];
		dest[1] = mat[1];
		dest[2] = mat[2];
		dest[3] = mat[3];
		
		dest[12] = mat[12];
		dest[13] = mat[13];
		dest[14] = mat[14];
		dest[15] = mat[15];
	}
	
	// Perform axis-specific matrix multiplication
	dest[4] = a10*c + a20*s;
	dest[5] = a11*c + a21*s;
	dest[6] = a12*c + a22*s;
	dest[7] = a13*c + a23*s;
	
	dest[8] = a10*-s + a20*c;
	dest[9] = a11*-s + a21*c;
	dest[10] = a12*-s + a22*c;
	dest[11] = a13*-s + a23*c;
	return dest;
};

mat4.rotateY = function(mat, angle, dest) {
	var s = Math.sin(angle);
	var c = Math.cos(angle);
	
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
	
	if(!dest) { 
		dest = mat 
	} else if(mat != dest) { // If the source and destination differ, copy the unchanged rows
		dest[4] = mat[4];
		dest[5] = mat[5];
		dest[6] = mat[6];
		dest[7] = mat[7];
		
		dest[12] = mat[12];
		dest[13] = mat[13];
		dest[14] = mat[14];
		dest[15] = mat[15];
	}
	
	// Perform axis-specific matrix multiplication
	dest[0] = a00*c + a20*-s;
	dest[1] = a01*c + a21*-s;
	dest[2] = a02*c + a22*-s;
	dest[3] = a03*c + a23*-s;
	
	dest[8] = a00*s + a20*c;
	dest[9] = a01*s + a21*c;
	dest[10] = a02*s + a22*c;
	dest[11] = a03*s + a23*c;
	return dest;
};

mat4.rotateZ = function(mat, angle, dest) {
	var s = Math.sin(angle);
	var c = Math.cos(angle);
	
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	
	if(!dest) { 
		dest = mat 
	} else if(mat != dest) { // If the source and destination differ, copy the unchanged last row
		dest[8] = mat[8];
		dest[9] = mat[9];
		dest[10] = mat[10];
		dest[11] = mat[11];
		
		dest[12] = mat[12];
		dest[13] = mat[13];
		dest[14] = mat[14];
		dest[15] = mat[15];
	}
	
	// Perform axis-specific matrix multiplication
	dest[0] = a00*c + a10*s;
	dest[1] = a01*c + a11*s;
	dest[2] = a02*c + a12*s;
	dest[3] = a03*c + a13*s;
	
	dest[4] = a00*-s + a10*c;
	dest[5] = a01*-s + a11*c;
	dest[6] = a02*-s + a12*c;
	dest[7] = a03*-s + a13*c;
	
	return dest;
};

mat4.frustum = function(left, right, bottom, top, near, far, dest) {
	if(!dest) { dest = mat4.create(); }
	var rl = (right - left);
	var tb = (top - bottom);
	var fn = (far - near);
	dest[0] = (near*2) / rl;
	dest[1] = 0;
	dest[2] = 0;
	dest[3] = 0;
	dest[4] = 0;
	dest[5] = (near*2) / tb;
	dest[6] = 0;
	dest[7] = 0;
	dest[8] = (right + left) / rl;
	dest[9] = (top + bottom) / tb;
	dest[10] = -(far + near) / fn;
	dest[11] = -1;
	dest[12] = 0;
	dest[13] = 0;
	dest[14] = -(far*near*2) / fn;
	dest[15] = 0;
	return dest;
};

mat4.perspective = function(fovy, aspect, near, far, dest) {
	var top = near*Math.tan(fovy*Math.PI / 360.0);
	var right = top*aspect;
	return mat4.frustum(-right, right, -top, top, near, far, dest);
};

mat4.ortho = function(left, right, bottom, top, near, far, dest) {
	if(!dest) { dest = mat4.create(); }
	var rl = (right - left);
	var tb = (top - bottom);
	var fn = (far - near);
	dest[0] = 2 / rl;
	dest[1] = 0;
	dest[2] = 0;
	dest[3] = 0;
	dest[4] = 0;
	dest[5] = 2 / tb;
	dest[6] = 0;
	dest[7] = 0;
	dest[8] = 0;
	dest[9] = 0;
	dest[10] = -2 / fn;
	dest[11] = 0;
	dest[12] = (left + right) / rl;
	dest[13] = (top + bottom) / tb;
	dest[14] = (far + near) / fn;
	dest[15] = 1;
	return dest;
};

mat4.lookAt = function(eye, center, up, dest) {
	if(!dest) { dest = mat4.create(); }
	
	var eyex = eye[0],
		eyey = eye[1],
		eyez = eye[2],
		upx = up[0],
		upy = up[1],
		upz = up[2],
		centerx = center[0],
		centery = center[1],
		centerz = center[2];

	if (eyex == centerx && eyey == centery && eyez == centerz) {
		return mat4.identity(dest);
	}
	
	var z0,z1,z2,x0,x1,x2,y0,y1,y2,len;
	
	//vec3.direction(eye, center, z);
	z0 = eyex - center[0];
	z1 = eyey - center[1];
	z2 = eyez - center[2];
	
	// normalize (no check needed for 0 because of early return)
	len = 1/Math.sqrt(z0*z0 + z1*z1 + z2*z2);
	z0 *= len;
	z1 *= len;
	z2 *= len;
	
	//vec3.normalize(vec3.cross(up, z, x));
	x0 = upy*z2 - upz*z1;
	x1 = upz*z0 - upx*z2;
	x2 = upx*z1 - upy*z0;
	len = Math.sqrt(x0*x0 + x1*x1 + x2*x2);
	if (!len) {
		x0 = 0;
		x1 = 0;
		x2 = 0;
	} else {
		len = 1/len;
		x0 *= len;
		x1 *= len;
		x2 *= len;
	};
	
	//vec3.normalize(vec3.cross(z, x, y));
	y0 = z1*x2 - z2*x1;
	y1 = z2*x0 - z0*x2;
	y2 = z0*x1 - z1*x0;
	
	len = Math.sqrt(y0*y0 + y1*y1 + y2*y2);
	if (!len) {
		y0 = 0;
		y1 = 0;
		y2 = 0;
	} else {
		len = 1/len;
		y0 *= len;
		y1 *= len;
		y2 *= len;
	}
	
	dest[0] = x0;
	dest[1] = y0;
	dest[2] = z0;
	dest[3] = 0;
	dest[4] = x1;
	dest[5] = y1;
	dest[6] = z1;
	dest[7] = 0;
	dest[8] = x2;
	dest[9] = y2;
	dest[10] = z2;
	dest[11] = 0;
	dest[12] = -(x0*eyex + x1*eyey + x2*eyez);
	dest[13] = -(y0*eyex + y1*eyey + y2*eyez);
	dest[14] = -(z0*eyex + z1*eyey + z2*eyez);
	dest[15] = 1;
	
	return dest;
};

mat4.str = function(mat) {
	return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] + ', ' + mat[3] + 
		', '+ mat[4] + ', ' + mat[5] + ', ' + mat[6] + ', ' + mat[7] + 
		', '+ mat[8] + ', ' + mat[9] + ', ' + mat[10] + ', ' + mat[11] + 
		', '+ mat[12] + ', ' + mat[13] + ', ' + mat[14] + ', ' + mat[15] + ']';
};


quat4 = {};
quat4.create = function(quat) {
	var dest = new glMatrixArrayType(4);
	
	if(quat) {
		dest[0] = quat[0];
		dest[1] = quat[1];
		dest[2] = quat[2];
		dest[3] = quat[3];
	}
	
	return dest;
};

quat4.set = function(quat, dest) {
	dest[0] = quat[0];
	dest[1] = quat[1];
	dest[2] = quat[2];
	dest[3] = quat[3];
	
	return dest;
};

quat4.calculateW = function(quat, dest) {
	var x = quat[0], y = quat[1], z = quat[2];

	if(!dest || quat == dest) {
		quat[3] = -Math.sqrt(Math.abs(1.0 - x*x - y*y - z*z));
		return quat;
	}
	dest[0] = x;
	dest[1] = y;
	dest[2] = z;
	dest[3] = -Math.sqrt(Math.abs(1.0 - x*x - y*y - z*z));
	return dest;
}

quat4.inverse = function(quat, dest) {
	if(!dest || quat == dest) {
		quat[0] *= 1;
		quat[1] *= 1;
		quat[2] *= 1;
		return quat;
	}
	dest[0] = -quat[0];
	dest[1] = -quat[1];
	dest[2] = -quat[2];
	dest[3] = quat[3];
	return dest;
}

quat4.length = function(quat) {
	var x = quat[0], y = quat[1], z = quat[2], w = quat[3];
	return Math.sqrt(x*x + y*y + z*z + w*w);
}

quat4.normalize = function(quat, dest) {
	if(!dest) { dest = quat; }
	
	var x = quat[0], y = quat[1], z = quat[2], w = quat[3];
	var len = Math.sqrt(x*x + y*y + z*z + w*w);
	if(len == 0) {
		dest[0] = 0;
		dest[1] = 0;
		dest[2] = 0;
		dest[3] = 0;
		return dest;
	}
	len = 1/len;
	dest[0] = x * len;
	dest[1] = y * len;
	dest[2] = z * len;
	dest[3] = w * len;
	
	return dest;
}

quat4.multiply = function(quat, quat2, dest) {
	if(!dest) { dest = quat; }
	
	var qax = quat[0], qay = quat[1], qaz = quat[2], qaw = quat[3];
	var qbx = quat2[0], qby = quat2[1], qbz = quat2[2], qbw = quat2[3];
	
	dest[0] = qax*qbw + qaw*qbx + qay*qbz - qaz*qby;
	dest[1] = qay*qbw + qaw*qby + qaz*qbx - qax*qbz;
	dest[2] = qaz*qbw + qaw*qbz + qax*qby - qay*qbx;
	dest[3] = qaw*qbw - qax*qbx - qay*qby - qaz*qbz;
	
	return dest;
}

quat4.multiplyVec3 = function(quat, vec, dest) {
	if(!dest) { dest = vec; }
	
	var x = vec[0], y = vec[1], z = vec[2];
	var qx = quat[0], qy = quat[1], qz = quat[2], qw = quat[3];

	// calculate quat * vec
	var ix = qw*x + qy*z - qz*y;
	var iy = qw*y + qz*x - qx*z;
	var iz = qw*z + qx*y - qy*x;
	var iw = -qx*x - qy*y - qz*z;
	
	// calculate result * inverse quat
	dest[0] = ix*qw + iw*-qx + iy*-qz - iz*-qy;
	dest[1] = iy*qw + iw*-qy + iz*-qx - ix*-qz;
	dest[2] = iz*qw + iw*-qz + ix*-qy - iy*-qx;
	
	return dest;
}

quat4.toMat3 = function(quat, dest) {
	if(!dest) { dest = mat3.create(); }
	
	var x = quat[0], y = quat[1], z = quat[2], w = quat[3];

	var x2 = x + x;
	var y2 = y + y;
	var z2 = z + z;

	var xx = x*x2;
	var xy = x*y2;
	var xz = x*z2;

	var yy = y*y2;
	var yz = y*z2;
	var zz = z*z2;

	var wx = w*x2;
	var wy = w*y2;
	var wz = w*z2;

	dest[0] = 1 - (yy + zz);
	dest[1] = xy - wz;
	dest[2] = xz + wy;

	dest[3] = xy + wz;
	dest[4] = 1 - (xx + zz);
	dest[5] = yz - wx;

	dest[6] = xz - wy;
	dest[7] = yz + wx;
	dest[8] = 1 - (xx + yy);
	
	return dest;
}

quat4.toMat4 = function(quat, dest) {
	if(!dest) { dest = mat4.create(); }
	
	var x = quat[0], y = quat[1], z = quat[2], w = quat[3];

	var x2 = x + x;
	var y2 = y + y;
	var z2 = z + z;

	var xx = x*x2;
	var xy = x*y2;
	var xz = x*z2;

	var yy = y*y2;
	var yz = y*z2;
	var zz = z*z2;

	var wx = w*x2;
	var wy = w*y2;
	var wz = w*z2;

	dest[0] = 1 - (yy + zz);
	dest[1] = xy - wz;
	dest[2] = xz + wy;
	dest[3] = 0;

	dest[4] = xy + wz;
	dest[5] = 1 - (xx + zz);
	dest[6] = yz - wx;
	dest[7] = 0;

	dest[8] = xz - wy;
	dest[9] = yz + wx;
	dest[10] = 1 - (xx + yy);
	dest[11] = 0;

	dest[12] = 0;
	dest[13] = 0;
	dest[14] = 0;
	dest[15] = 1;
	
	return dest;
}

quat4.slerp = function (quat, quat2, c, dest) {
    dest || (dest = quat);
    var e = c;
    if (quat[0] * quat2[0] + quat[1] * quat2[1] + quat[2] * quat2[2] + quat[3] * quat2[3] < 0) e = -1 * c;
    dest[0] = 1 - c * quat[0] + e * quat2[0];
    dest[1] = 1 - c * quat[1] + e * quat2[1];
    dest[2] = 1 - c * quat[2] + e * quat2[2];
    dest[3] = 1 - c * quat[3] + e * quat2[3];
    return dest
};

quat4.str = function(quat) {
	return '[' + quat[0] + ', ' + quat[1] + ', ' + quat[2] + ', ' + quat[3] + ']'; 
};




//
//
//  ENTITIES
//
var CEntity = function(){
    this.Position = vec3.create();
    this.yaw = 0;
    this.pitch = 0;
    this.roll = 0;
    this.Physics = null;
    this.AI = null;
    this.id = null;
    this.type = "";
}
//
//      AI SECTION
//
//
var CAIEntity = function(){
    var self = this;
    this.MovementAlgorithms = {
        SeekEntity: false,
        SeekPosition: false,
        FleeEntity: false,
        FleePosition: false,
        ArriveEntity: false,
        ArrivePosition: false,
        PatrolCircle: false,
        HideEntity: false,
        Flock: false,
        Cohesion: false,
        Alignment: false,
        Seperation: false,
        Avoidance: false
    }
    
    this.Movement ={
        Disable: {
            Seek: {
                Entity: function(){
                    self.MovementAlgorithms.SeekEntity = false;
                },
                Position: function(){
                    self.MovementAlgorithms.SeekPosition = false;
                }
            },
            Hide: {
                Entity: function(){
                    self.MovementAlgorithms.HideEntity = false;
                }
            },
            Arrive: {
                Entity: function(){
                    self.MovementAlgorithms.ArriveEntity = false;
                },
                Position: function(){
                    self.MovementAlgorithms.ArrivePosition = false;
                }
            },
            Flee: {
                Entity: function(){
                    self.MovementAlgorithms.ArriveEntity = false;
                },
                Position: function(){
                    self.MovementAlgorithms.ArrivePosition = false;
                }
            },
            Patrol: {
                Circle: function(){
                    self.MovementAlgorithms.PatrolCircle = false;
                }
            },
            Flock: function(){
                self.MovementAlgorithms.Flock = false;
            },
            Cohesion: function(){
                self.MovementAlgorithms.Cohesion = false
            },
            Alignment: function(){
                self.MovementAlgorithms.Alignment = false;
            },
            Seperation: function(){
                self.MovementAlgorithms.Seperation = false;
            },
            Avoidance: function(){
                self.MovementAlgorithms.Avoidance = false;
            }
        },
        maxForce: 100
    }
}

var CSeekPosition = function(oEntity, vTarget){
    
    var self = this;
    this.entity = oEntity;
    this.Update = function(){
        var desired = [];
        var applied = [];
        
        //Desired Velocity
        vec3.subtract(self.target,self.entity.Physics.position, desired);
        vec3.normalize(desired,desired);
        //**********************
        //   Adjust rotation
        //
        //**********************
        //Find axis of rotation 
        var rot = [];
        vec3.cross([0,0,-1], desired, rot);
        var angle = Math.acos(vec3.dot(desired, [0,0,1]));//Math.asin(vec3.length(rot));
        
        vec3.normalize(rot,rot);
        var cos = Math.cos(angle/2);
        var sin = Math.sin(angle/2);

        var percent = 1;
        var quat = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
        
        self.entity.Physics.orientation = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
        
        //**********************
        //   LinearForce Calculation
        //
        //**********************
        
        vec3.scale(desired,self.entity.AI.Movement.maxForce,desired);
        
        //Applied Velocity
        vec3.subtract(desired,self.entity.Axis.Look, applied);
        
        //Scale Final Applied Force
        if(vec3.length(applied) > self.entity.AI.Movement.maxForce){
            vec3.normalize(applied, applied);
            vec3.scale(applied, self.entity.AI.Movement.maxForce);
        }
        
        //Apply Force
        os.physics.Create.Force.Impulse(self.entity.Physics,[0,0,-1],applied);
        
    }
    
    this.target = vTarget;
    
    
}
var CSeekEntity = function(oEntity, oTarget){
    var self = this;
    this.entity = oEntity;
    this.Update = function(){
        var t = [];
        t = self.target.Physics ? self.target.Physics.position : self.target.Position;
        var desired = [];
        var applied = [];
        
        //Desired Velocity
        vec3.subtract(t,self.entity.Physics.position, desired);
        vec3.normalize(desired,desired);
        
        //Adjust rotation
        //Find axis of rotation 
        var rot = [];
        
        vec3.cross([0,0,-1], desired, rot);
    
        var angle = Math.acos(vec3.dot(desired, [0,0,1]));//Math.asin(vec3.length(rot));
        
        vec3.normalize(rot,rot);
        
        //If greater than 5 degrees
        //if(angle > 0.087266)
            var cos = Math.cos(angle/2);
            var sin = Math.sin(angle/2);

            var percent = 1;
            var quat = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
            
            self.entity.Physics.orientation = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
            
            //quat4.slerp(self.entity.Physics.orientation, quat, 1, self.entity.Physics.orientation);
            //var orientInv = [];
            //quat4.inverse(self.entity.Physics.orientation, orientInv);
            //
            //quat4.multiply(orientInv, quat, quat);
            //
            //quat[0] = Math.pow(quat[0], percent);
            //quat[1] = Math.pow(quat[1], percent);
            //quat[2] = Math.pow(quat[2], percent);
            //quat[3] = Math.pow(quat[3], percent);
            //
            //quat4.normalize(quat,quat);
            //
            //quat4.multiply(self.entity.Physics.orientation,quat ,self.entity.Physics.orientation);

        //
        //else
        //                                            //greater than 90                   less than 90
        //    vec3.dot([0,0,-1], desired) <  0 ? self.entity.Physics.orientation : quat4.inverse(self.entity.Physics.orientation);
        //    
        //
        
        vec3.scale(desired,self.entity.AI.Movement.maxForce,desired);
        
        //Applied Velocity
        vec3.subtract(desired,self.entity.Axis.Look, applied);
        
        //Scale Final Applied Force
        if(vec3.length(applied) > self.entity.AI.Movement.maxForce){
            vec3.normalize(applied, applied);
            vec3.scale(applied, self.entity.AI.Movement.maxForce);
        }
        
        //Apply Force
        os.physics.Create.Force.Impulse(self.entity.Physics,[0,0,0],applied);
        
        
        
    }
    
    this.target = oTarget;
}

var CFleePosition = function(){
    
}
var CFleeEntity = function(oEntity, oTarget){
    var self = this;
    this.entity = oEntity;
    this.Update = function(){
        var t = [];
        t = self.target.Physics ? self.target.Physics.position : self.target.Position;
        var desired = [];
        var applied = [];
        
        //Desired Velocity
        vec3.subtract(self.entity.Physics.position,t, desired);
        vec3.normalize(desired,desired);
        
        //Adjust rotation
        //Find axis of rotation 
        var rot = [];
        
        vec3.cross([0,0,-1], desired, rot);
    
        var angle = Math.acos(vec3.dot(desired, [0,0,1]));//Math.asin(vec3.length(rot));
        
        vec3.normalize(rot,rot);
        
        var cos = Math.cos(angle/2);
        var sin = Math.sin(angle/2);

        var percent = 1;
        var quat = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
        
        self.entity.Physics.orientation = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
            
        
        vec3.scale(desired,self.entity.AI.Movement.maxForce,desired);
        
        //Applied Velocity
        vec3.subtract(desired,self.entity.Axis.Look, applied);
        
        //Scale Final Applied Force
        if(vec3.length(applied) > self.entity.AI.Movement.maxForce){
            vec3.normalize(applied, applied);
            vec3.scale(applied, self.entity.AI.Movement.maxForce);
        }
        
        //Apply Force
        os.physics.Create.Force.Impulse(self.entity.Physics,[0,0,0],applied);
        
        
        
    }
    
    this.target = oTarget;
}
var CFleeEntityBound = function(){
    
}

var CArrivePosition = function(oEntity, vTarget){
     var self = this;
    this.entity = oEntity;
    this.Update = function(){
        var desired = [];
        var applied = [];
        var distance = [];
        //Calculate Distance
        vec3.subtract(self.target, self.entity.Physics.position, distance);
        distance = Math.sqrt(vec3.dot(distance, distance));
        
        //Desired Velocity
        vec3.subtract(self.target,self.entity.Physics.position, desired);
        vec3.normalize(desired,desired);
        //**********************
        //   Adjust rotation
        //
        //**********************
        //Find axis of rotation 
        var rot = [];
        vec3.cross([0,0,-1], desired, rot);
        var angle = Math.acos(vec3.dot(desired, [0,0,1]));//Math.asin(vec3.length(rot));
        
        vec3.normalize(rot,rot);
        var cos = Math.cos(angle/2);
        var sin = Math.sin(angle/2);

        var percent = 1;
        var quat = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
        
        self.entity.Physics.orientation = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
        
        //**********************
        //   LinearForce Calculation
        //
        //**********************
        
        vec3.scale(desired,self.entity.AI.Movement.maxForce,desired);
        
        //Applied Velocity
        vec3.subtract(desired,self.entity.Axis.Look, applied);
        
        //Scale Final Applied Force
        if(distance < (2 * self.offsetDistance)){
            
            if(vec3.length(applied) > (self.entity.AI.Movement.maxForce / 10)){
                vec3.normalize(applied, applied);
                vec3.scale(applied, self.entity.AI.Movement.maxForce / 10);
            }
            
        }else{
            if(vec3.length(applied) > self.entity.AI.Movement.maxForce){
                vec3.normalize(applied, applied);
                vec3.scale(applied, self.entity.AI.Movement.maxForce);
            }
        }
        
        
        if(distance > self.offsetDistance){
            //Apply Force
            os.physics.Create.Force.Impulse(self.entity.Physics,[0,0,-1],applied);
        }
        else{
            //self.entity.AI.MovementAlgorithms.ArrivePosition = false;
        }
        
        
    }
    
    this.target = vTarget;
    this.offsetDistance = 100;
}

var CArriveEntity = function(){
    
}
var CHideEntity = function(oEntity, oTarget, vHidingPositions, vOffsets){
    var self = this;
    this.entity = oEntity;
    this.Update = function(){
        
        var flee = [];
        flee = self.target.Physics ? self.target.Physics.position : self.target.Position;
        
        var position = [];
        var distance = 0;
        var target = [];
        for(var i = vHidingPositions.length - 1; i >= 0; i--){
            
            // HidingPosition - Flee
            var direction = [];
            vec3.subtract(vHidingPositions[i], flee, direction);
            
            // Distance = Mag(HidingPosition - Flee)
            var dist = vec3.length(direction);
            
            // Normalize (HidingPosition - Flee)
            vec3.normalize(direction, direction);
            
            // Scale(Normalize(HidingPosition - Flee), distance + offset);
            vec3.scale(direction, vOffsets[i] + dist, position);
            
            // Flee + Distance
            vec3.add(position, flee, position);
            
            //Get Distance to offset
            vec3.subtract(position, self.entity.Physics.position, direction);
            
            if(distance == 0){distance = vec3.length(direction)}
            
            //Find cloesest point to target 
            if(vec3.length(direction) < distance){
                
                vec3.set(position, target);
            }
        
        }
        
        var desired = [];
        var applied = [];
        
        
        //Desired Velocity
        vec3.subtract(target,self.entity.Physics.position, desired);
        vec3.normalize(desired,desired);
        
        //Adjust rotation
        //Find axis of rotation 
        var rot = [];
        
        vec3.cross([0,0,-1], desired, rot);
    
        var angle = Math.acos(vec3.dot(desired, [0,0,1]));//Math.asin(vec3.length(rot));
        
        vec3.normalize(rot,rot);

        var cos = Math.cos(angle/2);
        var sin = Math.sin(angle/2);

        var percent = 1;
        var quat = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
        
        self.entity.Physics.orientation = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
            

        
        vec3.scale(desired,self.entity.AI.Movement.maxForce,desired);
        
        //Applied Velocity
        vec3.subtract(desired,self.entity.Axis.Look, applied);
        
        //Scale Final Applied Force
        if(vec3.length(applied) > self.entity.AI.Movement.maxForce){
            vec3.normalize(applied, applied);
            vec3.scale(applied, self.entity.AI.Movement.maxForce);
        }
        
        //Apply Force
        os.physics.Create.Force.Impulse(self.entity.Physics,[0,0,0],applied);
        
        
        
    }
    
    this.target = oTarget;
}
var CPatrolCircle = function(oEntity, fRadius, vCenter){
    var self = this;
    this.entity = oEntity;
    this.radius = fRadius;
    this.center = vCenter;
    this.Update = function(){
        var position  = [];
        
        //Get predictd next position
        var VoDt = [];
        vec3.scale(self.entity.Physics.velocity, 1.05, VoDt);
        vec3.add(self.entity.Physics.position, VoDt, position);
        
        //Map predicted position to sphere
        //  Get direction
        vec3.subtract(position, self.center, position);
        vec3.normalize(position, position);
        //Scale by radius
        vec3.scale(position, self.radius, position);
        //Add to center to get current position on path
        vec3.add(self.center, position, position);
        
        var desired = [];
        var applied = [];
        
        //Desired Velocity
        vec3.subtract(position,self.entity.Physics.position, desired);
        vec3.normalize(desired,desired);
        //**********************
        //   Adjust rotation
        //
        //**********************
        //Find axis of rotation 
        var rot = [];
        vec3.cross([0,0,-1], desired, rot);
        var angle = Math.acos(vec3.dot(desired, [0,0,1]));//Math.asin(vec3.length(rot));
        
        vec3.normalize(rot,rot);
        var cos = Math.cos(angle/2);
        var sin = Math.sin(angle/2);

        var percent = 1;
        var quat = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
        
        self.entity.Physics.orientation = [rot[0]*sin, rot[1]*sin, rot[2]*sin, cos];
        
        //**********************
        //   LinearForce Calculation
        //
        //**********************
        
        vec3.scale(desired,self.entity.AI.Movement.maxForce,desired);
        
        //Applied Velocity
        vec3.subtract(desired,self.entity.Axis.Look, applied);
        
        //Scale Final Applied Force
        if(vec3.length(applied) > self.entity.AI.Movement.maxForce){
            vec3.normalize(applied, applied);
            vec3.scale(applied, self.entity.AI.Movement.maxForce);
        }
        
        //Apply Force
        os.physics.Create.Force.Impulse(self.entity.Physics,[0,0,-1],applied);
        
    }
}

var CFlock = function(){
    
}

var CCohesion = function(){
    
}
var CAvoidance = function(oEntity, vHalfSizes, vBVs){
    var self = this;
    this.entity = oEntity;
    this.halfSize = vHalfSizes;
    this.obstacles = vBVs;
    this.bv = os.physics.Create.BV.OBB(null,self.halfSize,self.entity.Physics.position);
    this.bv.name = oEntity.ID();
    
    this.Update = function(){
        for(var i = self.obstacles.length - 1; i >= 0; i--){
            collision = self.bv.CollisionTest(self.obstacles[i]);
            
            if(collision){
                //Position = OBB Cloesest Point + (radius * normal)
                var distance = [];
                vec3.subtract(collision.point.obj1, self.entity.Physics.position, distance);
                distance = vec3.length(distance);
                
                //Collision on left side
                if(collision.point.obj1[0] < 0){
                    self.entity.Physics.Add.ForceAtLocalPoint([10000,0,0], [0,0,40]);
                }
                //Collision on Right Side
                else{
                    self.entity.Physics.Add.ForceAtLocalPoint([-10000,0,0], [0,0,40]);
                }
                
            }
            
        }
    }
}

//Holds Arrays of Alogorithms to be updated every loop
//      key: AlogName, value: AlgoName[CMovingAlgorithm...]
var _MovementAlgorithms = null; //new CMap();

//Arrays of Algorithms to be updated every loop
//  AlgoName[CAlgoType] --> stored in MovementAlgo map
var _SeekEntity = [];
var _SeekPosition = [];
var _ArrivePosition = [];
var _ArriveEntity = [];
var _FleeEntity = [];
var _PatrolCircle = [];
var _HideEntity = [];
var _Avoidance = [];
var os = {};
os.ai = {
    Initialize: function(){
        _MovementAlgorithms = new CMap();
        
        //Load all algo arrays into movment map
        _MovementAlgorithms.put("SeekEntity", _SeekEntity);
        _MovementAlgorithms.put("SeekPosition", _SeekPosition);
        _MovementAlgorithms.put("ArriveEntity", _ArriveEntity);
        _MovementAlgorithms.put("ArrivePosition", _ArrivePosition);
        _MovementAlgorithms.put("FleeEntity", _FleeEntity);
        _MovementAlgorithms.put("FleeEntity", _FleeEntity);
        _MovementAlgorithms.put("PatrolCircle", _PatrolCircle);
        _MovementAlgorithms.put("HideEntity", _HideEntity);
        _MovementAlgorithms.put("Avoidance", _Avoidance);
        
    },
    Create: {
        Entity: function(){
            var ent = new CAIEntity();
            
            return ent;
        }
    },
    Update: function(dt){
        
        //Update Movement Algorithms
        os.ai.Movement.Update(dt);
        
    },
    Movement: {
        Add: {
            Seek: {
                Position: function(oEntity, vTarget){
                    var algo = new CSeekPosition(oEntity, vTarget);
                    _SeekPosition.push(algo);
                    oEntity.AI.MovementAlgorithms.SeekPosition = true;
                    return algo;
                },
                Entity: function(oEntity, oTarget){
                    var algo = new CSeekEntity(oEntity, oTarget);
                    _SeekEntity.push(algo);
                    oEntity.AI.MovementAlgorithms.SeekEntity = true;
                    return algo;
                }
            },
            Flee: {
                Position: function(){
                    
                },
                Entity: function(oEntity, oTarget){
                    var algo = new CFleeEntity(oEntity, oTarget);
                    _FleeEntity.push(algo);
                    oEntity.AI.MovementAlgorithms.FleeEntity = true;
                    return algo;
                }
            },
            Arrive: {
                Position: function(oEntity, vTarget){
                    var algo = new CArrivePosition(oEntity, vTarget);
                    _ArrivePosition.push(algo);
                    oEntity.AI.MovementAlgorithms.ArrivePosition = true;
                    return algo;
                },
                Entity: function(){
                    
                }
            },
            Hide: {
                Entity: function(oEntity, oTarget, vHidingPositions, vOffsets){
                    var algo = new CHideEntity(oEntity, oTarget, vHidingPositions, vOffsets);
                    _HideEntity.push(algo);
                    oEntity.AI.MovementAlgorithms.HideEntity = true;
                    return algo;
                }
            },
            Patrol: {
                Circle: function(oEntity, fRadius, vCenter){
                    var algo = new CPatrolCircle(oEntity, fRadius, vCenter);
                    _PatrolCircle.push(algo);
                    oEntity.AI.MovementAlgorithms.PatrolCircle = true;
                    return algo;
                }
            },
            Avoidance: function(oEntity, vHalfSizes, vBVs){
                var algo = new CAvoidance(oEntity, vHalfSizes, vBVs);
                _Avoidance.push(algo);
                oEntity.AI.MovementAlgorithms.Avoidance = true;
                return algo;
            }
            
        },
        Update: function(dt){
            
            for(var i = _MovementAlgorithms.size; i--; _MovementAlgorithms.next()){
                //Get Algorithm Array, and Key (Algorithm Type)
                var algo = _MovementAlgorithms.value();
                var type = _MovementAlgorithms.key();
                
                for(var j = algo.length - 1; j >= 0; j--){
                    
                    algo[j].entity.AI.MovementAlgorithms[type] ? algo[j].Update(dt) : algo.splice(j,1);
                    
                }
            }
        }
    }
}

//
//
//  PHYSICS SECTION
//

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
        

os.physics = {
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
    Initialize: function(){
        os.physics.entities = new CMap();
        //os.physics.bvs = os.resschmgr.Create.Map();
        os.physics.forceMap = new CMap();
        vec3.create(os.physics.gravity);
    }
}
var CMap = function(linkEntries){
    this.current = undefined;
    this.size = 0;
    this.isLinked = true;
    
    if(linkEntries === false)
    {
            this.disableLinking();
    }
            
    this.from = function(obj, foreignKeys, linkEntries)
    {
        var map = new Map(linkEntries);
    
        for(var prop in obj) {
                if(foreignKeys || obj.hasOwnProperty(prop))
                        map.put(prop, obj[prop]);
        }
    
        return map;
    }
    
    this.noop = function()
    {
            return this;
    }
    
    this.illegal = function()
    {
            throw new Error('can\'t do this with unlinked maps');
    }
    
    this.reverseIndexTableFrom = function(array, linkEntries)
    {
        var map = new Map(linkEntries);
    
        for(var i = 0, len = array.length; i < len; ++i) {
                var	entry = array[i],
                        list = map.get(entry);
    
                if(list) list.push(i);
                else map.put(entry, [i]);
        }
    
        return map;
    }

    this.cross = function(map1, map2, func, thisArg)
    {
        var linkedMap, otherMap;
    
        if(map1.isLinked) {
                linkedMap = map1;
                otherMap = map2;
        }
        else if(map2.isLinked) {
                linkedMap = map2;
                otherMap = map1;
        }
        else Map.illegal();
    
        for(var i = linkedMap.size; i--; linkedMap.next()) {
                var key = linkedMap.key();
                if(otherMap.contains(key))
                        func.call(thisArg, key, map1.get(key), map2.get(key));
        }
    
        return thisArg;
    }
    
    this.uniqueArray = function(array)
    {
            var map = new Map;
    
            for(var i = 0, len = array.length; i < len; ++i)
                    map.put(array[i]);
    
            return map.listKeys();
    }                                    
};

CMap.prototype.disableLinking = function(){
    this.isLinked = false;
    this.link = Map.noop;
    this.unlink = Map.noop;
    this.disableLinking = Map.noop;
    this.next = Map.illegal;
    this.key = Map.illegal;
    this.value = Map.illegal;
    this.removeAll = Map.illegal;
    this.each = Map.illegal;
    this.flip = Map.illegal;
    this.drop = Map.illegal;
    this.listKeys = Map.illegal;
    this.listValues = Map.illegal;
    
    return this;
};

CMap.prototype.hash = function(value){
    return value instanceof Object ? (value.__hash ||
        (value.__hash = 'object ' + ++arguments.callee.current)) :
        (typeof value) + ' ' + String(value);
};

CMap.prototype.hash.current = 0;            
CMap.prototype.link = function(entry){
    if(this.size === 0) {
            entry.prev = entry;
            entry.next = entry;
            this.current = entry;
    }
    else {
            entry.prev = this.current.prev;
            entry.prev.next = entry;
            entry.next = this.current;
            this.current.prev = entry;
    }
};

CMap.prototype.unlink = function(entry) {
    if(this.size === 0)
            this.current = undefined;
    else {
            entry.prev.next = entry.next;
            entry.next.prev = entry.prev;
            if(entry === this.current)
                    this.current = entry.next;
    }
};

CMap.prototype.get = function(key) {
    var entry = this[this.hash(key)];
    return typeof entry === 'undefined' ? undefined : entry.value;
};

CMap.prototype.put = function(key, value) {
    var hash = this.hash(key);

    if(this.hasOwnProperty(hash))
            this[hash].value = value;
    else {
            var entry = { key : key, value : value };
            this[hash] = entry;

            this.link(entry);
            ++this.size;
    }

    return this;
};

CMap.prototype.remove = function(key) {
    var hash = this.hash(key);

    if(this.hasOwnProperty(hash)) {
            --this.size;
            this.unlink(this[hash]);

            delete this[hash];
    }

    return this;
};

CMap.prototype.removeAll = function() {
    while(this.size)
            this.remove(this.key());

    return this;
};

CMap.prototype.contains = function(key) {
    return this.hasOwnProperty(this.hash(key));
};

CMap.prototype.isUndefined = function(key) {
    var hash = this.hash(key);
    return this.hasOwnProperty(hash) ?
            typeof this[hash] === 'undefined' : false;
};

CMap.prototype.next = function() {
    this.current = this.current.next;
};

CMap.prototype.key = function() {
    return this.current.key;
};

CMap.prototype.value = function() {
    return this.current.value;
};

CMap.prototype.each = function(func, thisArg) {
    if(typeof thisArg === 'undefined')
            thisArg = this;

    for(var i = this.size; i--; this.next()) {
            var n = func.call(thisArg, this.key(), this.value(), i > 0);
            if(typeof n === 'number')
                    i += n; // allows to add/remove entries in func
    }

    return this;
};

CMap.prototype.flip = function(linkEntries) {
    var map = new Map(linkEntries);

    for(var i = this.size; i--; this.next()) {
            var	value = this.value(),
                    list = map.get(value);

            if(list) list.push(this.key());
            else map.put(value, [this.key()]);
    }

    return map;
};

CMap.prototype.drop = function(func, thisArg) {
    if(typeof thisArg === 'undefined')
            thisArg = this;

    for(var i = this.size; i--; ) {
            if(func.call(thisArg, this.key(), this.value())) {
                    this.remove(this.key());
                    --i;
            }
            else this.next();
    }

    return this;
};

CMap.prototype.listValues = function() {
    var list = [];

    for(var i = this.size; i--; this.next())
            list.push(this.value());

    return list;
}

CMap.prototype.listKeys = function() {
    var list = [];

    for(var i = this.size; i--; this.next())
            list.push(this.key());

    return list;
}

CMap.prototype.toString = function() {
    var string = '[object Map';

    function addEntry(key, value, hasNext) {
            string += '    { ' + this.hash(key) + ' : ' + value + ' }' +
                    (hasNext ? ',' : '') + '\n';
    }

    if(this.isLinked && this.size) {
            string += '\n';
            this.each(addEntry);
    }

    string += ']';
    return string;
};
var CTask = function(){
    this.msgID;
    this.taskID;
    this.threadID;
    this.taskType;
    this.data;
    this.timeSent;
    
};

CTask.prototype.Serialize = function(){
    return JSON.stringify(this);
};

CTask.prototype.Parse = function(input){
    var temp = JSON.parse(input);
    
    this.msgID      = temp.msgID;
    this.taskID     = temp.taskID;
    this.threadID   = temp.threadID;
    this.taskType   = temp.taskType;
    this.data       = temp.data;
    this.timeSent   = temp.timeSent;
};

var Thread = {
    threadFunction: null,
    activeThreads: null,
    sharedData: null,
    entities: null,
    bvs: null,
    commands: null,
    inputs: null,
    threadID: null,
    osID: null,
    active: true,
    ThreadController: null,
    ThreadControllerPath: "scripts/jahova/OS/Cores/Threads/jahova.os.cores.thread.swcontroller.js",
    currentTask: null,
    Initialize: function(){
        Thread.ThreadController = new SharedWorker(Thread.ThreadControllerPath);
        Thread.ThreadController.port.start();
        Thread.ThreadController.port.onmessage = Thread.ProcessRequest;
        
        
        
        //Create Custom Command Map
        Thread.customCommands = new CMap();
        Thread.activeThreads = new CMap();
        Thread.entities = new CMap();
        Thread.sharedData = new CMap();
        
        //Load Custom Commands
        Thread.customCommands.put("START", Start);
        Thread.customCommands.put("STOP", Stop);
        Thread.customCommands.put("GETSHAREDMEMORY", MergeSharedMemory);
        Thread.customCommands.put("SETSHAREDMEMORY", SetSharedMemory);
        Thread.customCommands.put("REGISTERED", Thread.Registered);
        Thread.customCommands.put("UPDATEACTIVETHREADS", Thread.UpdateActiveThreads);
        Thread.customCommands.put("UPDATE", Update);
        Thread.customCommands.put("UPDATEAI", UpdateAI);
        Thread.customCommands.put("UPDATEPHYSICS", UpdatePhysics);
        Thread.customCommands.put("UPDATEENTITIES", UpdateEntities);
        Thread.customCommands.put("ADDENTITY", AddEntity);
        Thread.customCommands.put("UPDATEENTITY", UpdateEntity);
        Thread.customCommands.put("ENABLEAI", EnableAI);
        Thread.customCommands.put("ENABLEPHYSICS", EnablePhysics);
        Thread.customCommands.put("CREATEBV", CreateBV);
        Thread.customCommands.put("ENABLESEEKENTITY", Movement.Enable.Seek.Entity);
        Thread.customCommands.put("ENABLESEEKPOSITION", Movement.Enable.Seek.Position);
        Thread.customCommands.put("ENABLEHIDEENTITY", Movement.Enable.Hide.Entity);
        Thread.customCommands.put("ENABLEPATROLCIRCLE", Movement.Enable.Patrol.Circle);
        Thread.customCommands.put("ENABLEAVOIDANCE", Movement.Enable.Avoidance);
        Thread.customCommands.put("DISABLESEEKENTITY", Movement.Disable.Seek.Entity);
        Thread.customCommands.put("DISABLESEEKPOSITION", Movement.Disable.Seek.Position);
        Thread.customCommands.put("DISABLEHIDEENTITY", Movement.Disable.Hide.Entity);
        Thread.customCommands.put("DISABLEPATROLCIRCLE", Movement.Disable.Patrol.Circle);
        Thread.customCommands.put("DISABLEAVOIDANCE", Movement.Disable.Avoidance);
        
        //Debug
        Thread.customCommands.put("GETENTITIES", GetEntities);
        
        //Create Command Map
        Thread.commands = new CMap();
        
        //Load Command Map
        Thread.commands.put("SETFUNCTION", Thread.SetFunction);
        Thread.commands.put("EXECUTE", Thread.Execute);
        Thread.commands.put("ECHO", Thread.Echo);
        Thread.commands.put("REGISTERED", Thread.Registered);
        Thread.commands.put("GETCURRENTFUNCTION", Thread.GetCurrentFunction);
        
        //Initalize currentTask object
        Thread.currentTask = new CTask();
        
        os.ai.Initialize();
        os.physics.Initialize();
        
    },
    UpdateActiveThreads: function(task){
        Thread.activeThreads.removeAll();
        for(var i = task.threads.length - 1; i >= 0; i--){
            Thread.activeThreads.put(task.threads[i].name, task.threads[i]);
        }
    },
    ProcessRequest: function(e){
        
        //Initialize Task Object
        Thread.currentTask.Parse(e.data);
        
        var msgHandler = false;
        
        //Get pointer to specific handler for given taskType
        if(Thread.currentTask.taskType)
        {
            msgHandler = Thread.commands.get(Thread.currentTask.taskType.toUpperCase());   
        }
        
        //Test if request is for a know taskType
        if(msgHandler)
        {
            //Call Proper Task Handler
            msgHandler(Thread.currentTask);
        }
        else
        {
            //Unknown taskType
            Thread.currentTask.data = "Error: Unknon Task Type";
        
            //Send Response to Controller, alerting task is complete and Thread is IDLE
            Thread.SendResponse(Thread.currentTask.Serialize());
        }
        
        
    },
    SendResponse: function(jsonData){
        Thread.ThreadController.port.postMessage(jsonData);
    },
    SendError: function(task){
        task.taskType = "ERROR";
        Thread.SendResponse(taslk.Serialize());
    },
    SetFunction: function(task){
        
        // new Function ([param1, param2, param3,..., paramN], funcBody)
        Thread.threadFunction = new Function(["input"], Thread.currentTask.data.func);
        Thread.currentTask.data = "Function Set";
        
    },
    Execute: function(task){
        var msgHandler = false;
        var msg = task.data;
        
        //Get pointer to specific handler for given taskType
        if(task.data.type)
        {
            msgHandler = Thread.customCommands.get(task.data.type.toUpperCase());   
        }
        
        //Test if request is for a know taskType
        if(msgHandler)
        {
            //Call Proper Task Handler
            msgHandler(task.data);
        }
        else
        {
            //Unknown taskType
            Thread.currentTask.data = "Error: Unknon Custom Command Type: " + task.data;
        }

    },
    Registered: function(task){
        
    },
    Echo: function(task){
        //Send Response to Controller, alerting task is complete and Thread is IDLE
        Thread.SendResponse(Thread.currentTask.Serialize());
    },
    GetCurrentFunction: function(task){
        
        //Get Current Thread Function
        Thread.currentTask.data = Thread.threadFunction.toString();
    }
};
SetSharedMemory = function(){
    Thread.currentTask.taskType = "SetSharedMemory";
    var list = [];
    for(var i = Thread.sharedData.size; i--; Thread.sharedData.next()){
        var obj = {};
        obj.key = Thread.sharedData.key();
        obj.value = Thread.sharedData.value();
        list.push(obj);
    }
    Thread.currentTask.data = list;
    Thread.SendResponse(Thread.currentTask.Serialize());
}
MergeSharedMemory = function(task){
    Thread.sharedData.removeAll();
    
    var list = task.data;
    
    for(var i = list.length - 1; i >= 0; i--){
        //Update Local Copy of Shared Data
        Thread.sharedData.put(list[i].id, list[i]);
        
        if(list[i].type == "ENTITY"){
            var ent = Thread.entities.get(list[i].id);
            if(ent){ //Entity exist in map, merge
                MergeEntity(list[i],ent);
            }
            else{    //Entity does not exist, create new
                CreateEntity(list[i]);
            }
        }
    }

    
}
Start = function(){
    Thread.active = true;
}
Stop = function(){
    Thread.active = false;
}
AddEntity = function(task){
    CreateEntity(task.data);
}
Update = function(task){
    os.physics.Update.All(0.033);
    os.ai.Update(task.dt);
}
UpdateAI = function(task){
    os.physics.Update.All(0.033);
    os.ai.Update(task.dt);
}
UpdatePhysics = function(task){
    os.physics.Update.All(0.033);
}
UpdateEntities = function(task){
    Thread.currentTask.taskType = "GetSharedMemory";
    Thread.SendResponse(Thread.currentTask.Serialize());
}
EnableAI = function(data){
    var ent = Thread.entities.get(data.id);
    ent.AI = os.ai.Create.Entity();
    ent.AI.name = data.name;
 
}
EnablePhysics = function(data){
    var ent = Thread.entities.get(data.id);
    ent.Physics = os.physics.Create.Entity(data.invMass);
    ent.Physics.linearDampening = data.linearDampening;
    ent.Physics.angularDampening = data.angularDampening;
    vec3.set(data.position, ent.Physics.position);
    ent.Physics.Add.InertialTensor(os.physics.Create.InertialTensor.Cube(ent.Physics,20,20,20));
    ent.Physics.CalculateDerivedData();
    
    //var sd = Thread.sharedData.get(data.id);
    //sd.Physics = {};
    //sd.Physics.orientation = [];
    //sd.Physics.position = [];
    //
    //quat4.set(ent.Physics.orientation, sd.Physics.orientation);
    //vec3.set(ent.Physics.position, sd.Physics.position);
}
MergeEntity = function(oSource, oTarget){
    vec3.set(oSource.Position, oTarget.Position)
    oTarget.yaw = oSource.yaw;
    oTarget.pitch = oSource.pitch;
    oTarget.roll = oSource.roll;
    oTarget.Axis = oSource.Axis;
    if(oSource.Physics){
        quat4.set(oSource.Physics.orientation, oTarget.Physics.orientation);
        vec3.set(oSource.Physics.position, oTarget.Physics.position)
    }
    
    if(oSource.AI){
        oTarget.AI.name = oSource.AI.name;
    }
}
CreateEntity = function(oEntity){
    var ent = new CEntity();
    ent.id = oEntity.id;
    vec3.set(oEntity.Position, ent.Position);
    ent.yaw = oEntity.yaw;
    ent.pitch = oEntity.pitch;
    ent.roll = oEntity.roll;
    ent.type = oEntity.type;
    ent.Axis = oEntity.Axis;
    if(oEntity.Physics){
        quat4.set(oEntity.Physics.orientation, ent.Physics.orientation);
        vec3.set(oEntity.Physics.position, ent.Physics.position)
    }
    
    if(oEntity.AI){
        ent.AI.name = oEntity.AI.name;
    }

    Thread.entities.put(ent.id, ent);
    Thread.sharedData.put(ent.id, ent);
}
UpdateEntity = function(task){
    var ent = Thread.entities.get(task.data.id);
    MergeEntity(task.data,ent);
}
CreateBV = function(task){
    if(task.bvType == "SPHERE"){
        os.physics.Create.BV.Sphere(null,task.halfSize,task.center);
    }
    else if(task.bvType == "OBB"){
        var bv = os.physics.Create.BV.OBB(null,task.halfSize,task.center);
         quat4.set(task.orientation, bv.orientation);
    }
    
}
Movement = {
    Enable: {
        Seek: {
            Entity: function(data){
                os.ai.Movement.Add.Seek.Entity(Thread.entities.get(data.id), Thread.entities.get(data.target));
            },
            Position: function(data){
                os.ai.Movement.Add.Seek.Position(Thread.entities.get(data.id), data.position);
            }
        },
        Hide: {
            Entity: function(data){
                os.ai.Movement.Add.Hide.Entity(Thread.entities.get(data.id), Thread.entities.get(data.target), data.hidingPositions, data.offsets);
            }
                
        },
        Patrol: {
            Circle: function(data){
                os.ai.Movement.Add.Patrol.Circle(Thread.entities.get(data.id), data.radius, data.center);
            }
        },
        Avoidance: function(data){
            os.ai.Movement.Add.Avoidance(Thread.entities.get(data.id),data.halfSize,os.physics.bvs.slice(0,18));
        }
    },
    Disable: {
        Seek: {
            Entity: function(data){
                (Thread.entities.get(data.id)).AI.Movement.Disable.Seek.Entity();
            },
            Position: function(data){
                (Thread.entities.get(data.id)).AI.Movement.Disable.Seek.Position();
            }
        },
        Hide: {
            Entity: function(data){
                (Thread.entities.get(data.id)).AI.Movement.Disable.Hide.Entity();
            }
                
        },
        Patrol: {
            Circle: function(data){
                (Thread.entities.get(data.id)).AI.Movement.Disable.Patrol.Circle();
            }
        },
        Avoidance: function(data){
            (Thread.entities.get(data.id)).AI.Movement.Disable.Avoidance();
        }
    }
}
//DEBUG
GetEntities = function(){
    Thread.currentTask.taskType = "EntityList";
    Thread.currentTask.data.type = "EntityList";
    Thread.currentTask.data.list = Thread.sharedData.listValues();
    Thread.SendResponse(Thread.currentTask.Serialize());
}


Thread.Initialize();




