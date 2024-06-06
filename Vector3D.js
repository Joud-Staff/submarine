class Vector3D {
    constructor(x = 0, y = 0, z = 0) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  
    // Add another vector to this vector
    add(vector) {
      this.x += vector.x;
      this.y += vector.y;
      this.z += vector.z;
      return this;
    }
  
    // Subtract another vector from this vector
    subtract(vector) {
      this.x -= vector.x;
      this.y -= vector.y;
      this.z -= vector.z;
      return this;
    }
  
    // Multiply this vector by a scalar
    multiplyScalar(scalar) {
      this.x *= scalar;
      this.y *= scalar;
      this.z *= scalar;
      return this;
    }
  
    // Clone this vector
    clone() {
      return new Vector3D(this.x, this.y, this.z);
    }
  
    // Compute the length (magnitude) of the vector
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
  
    // Normalize the vector (make it unit length)
    normalize() {
      const len = this.length();
      if (len > 0) {
        this.multiplyScalar(1 / len);
      }
      return this;
    }
  }