// thear code :
class Vector3D {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
  
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        return this;
    }
  
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
        return this;
    }
  
    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }
  
    clone() {
        return new Vector3D(this.x, this.y, this.z);
    }
  
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
  
    normalize() {
        const len = this.length();
        if (len > 0) {
            this.multiplyScalar(1 / len);
        }
        return this;
    }
  }
  
  const gravityAcceleration = 9.81;
  
  class Submarine {
    constructor(volume, waterDensity, mass, propellerPower, propellerSpeed) {
        this.position = new Vector3D(); // Submarine's position
        this.velocity = new Vector3D(); // Submarine's velocity
        this.acceleration = new Vector3D(); // Submarine's acceleration
        this.orientation = { roll: 0, pitch: 0, yaw: 0 }; // Submarine's orientation in radians
  
        this.volume = volume;
        this.waterDensity = waterDensity;
        this.mass = mass;
        this.weight = this.mass * gravityAcceleration;
        this.buoyantForce = this.volume * this.waterDensity * gravityAcceleration;
  
        this.propellerPower = propellerPower;
        this.propellerSpeed = propellerSpeed;
        this.dragCoefficient = 0.05; // Drag coefficient for horizontal movement
  
        this.frontWings = new this.FrontWings(this);
        this.rearWings = new this.RearWings(this);
        this.rudder = new this.Rudder(this);
    }
  
    calculateBuoyantForce() {
        return this.volume * this.waterDensity * gravityAcceleration;
    }    
  
    calculateNetForce(lift, drag, thrust) {
        return new Vector3D(thrust - drag, lift, 0);
    }
    
  
    calculateAcceleration(netForce) {
        return netForce.clone().multiplyScalar(1 / this.mass);
    }
    
  
    updateSpeed(acceleration, deltaTime) {
        this.velocity.add(acceleration.clone().multiplyScalar(deltaTime));
    }
    
    updatePhysics(deltaTime) {
        const buoyantForce = this.calculateBuoyantForce();
        const netVerticalForce = buoyantForce - this.weight;
        const verticalAcceleration = netVerticalForce / this.mass;
    
        // Update vertical motion
        this.velocity.y += verticalAcceleration * deltaTime;
        this.position.y += this.velocity.y * deltaTime + 0.5 * verticalAcceleration * deltaTime * deltaTime;
    
        // Update forces from wings and rudder
        this.frontWings.updateForces(deltaTime);
        this.rearWings.updateForces(deltaTime);
        this.rudder.updateForces(deltaTime);
    
        // Update orientation based on forces
        this.orientation.pitch += (this.frontWings.calculateLift() - this.rearWings.calculateLift()) * deltaTime;
        this.orientation.yaw += this.rudder.calculateYawForce() * deltaTime;
    
        // Apply drag force
        const drag = this.velocity.length() * this.dragCoefficient;
        const dragForce = this.velocity.clone().normalize().multiplyScalar(-drag);
        const netForce = this.calculateNetForce(0, drag, this.propellerPower * this.propellerSpeed);
        const acceleration = this.calculateAcceleration(netForce);
    
        // Update horizontal motion
        this.updateSpeed(acceleration, deltaTime);
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    }
    
  
    FrontWings = class {
        constructor(submarine) {
            this.submarine = submarine;
            this.area = 10; // Wing area in square meters
            this.angleOfAttack = 0; // Angle of attack in degrees
            this.liftCoefficient = 0.5; // Lift coefficient
            this.dragCoefficient = 0.05; // Drag coefficient
            this.waterDensity = 1000; // كثافة الماء
            this.maxAngleOfAttack = 15; // الحد الأقصى لزاوية الهجوم
        }
  
        setAngleOfAttack(angle) {
            this.angleOfAttack = Math.max(0, Math.min(this.maxAngleOfAttack, angle));
        }
        calculateLift() {
            const speedSquared = Math.pow(this.submarine.velocity.length(), 2);
            return 0.5 * this.waterDensity * speedSquared * this.area * this.liftCoefficient * Math.sin(this.angleOfAttack * Math.PI / 180);
        }
  
        calculateDrag() {
            const speedSquared = Math.pow(this.submarine.velocity.length(), 2);
            return 0.5 * this.waterDensity * speedSquared * this.area * this.dragCoefficient;
        }
  
        updateForces(deltaTime) {
            const lift = this.calculateLift();
            const drag = this.calculateDrag();
            const thrust = this.submarine.propellerPower * this.submarine.propellerSpeed;
            const netForce = this.submarine.calculateNetForce(lift, drag, thrust);
            const acceleration = this.submarine.calculateAcceleration(netForce);
            this.submarine.updateSpeed(acceleration, deltaTime);
        }
  
        updateAngleOfAttack() {
            const speed = this.submarine.velocity.length();
            this.angleOfAttack = Math.atan2(speed, this.submarine.depth) * (180 / Math.PI);
            this.angleOfAttack = Math.max(0, Math.min(this.maxAngleOfAttack, this.angleOfAttack));
        }
        
    }
  
    RearWings = class {
        constructor(submarine) {
            this.submarine = submarine;
            this.area = 10; 
            this.angleOfAttack = 0; 
            this.liftCoefficient = 0.5; 
            this.dragCoefficient = 0.05; 
            this.waterDensity = 1000; 
            this.maxAngleOfAttack = 15; 
        }
  
        setAngleOfAttack(angle) {
            this.angleOfAttack = Math.max(0, Math.min(this.maxAngleOfAttack, angle));
        }
  
        calculateLift() {
            const speedSquared = Math.pow(this.submarine.velocity.length(), 2);
            return 0.5 * this.waterDensity * speedSquared * this.area * this.liftCoefficient * Math.sin(this.angleOfAttack * Math.PI / 180);
        }
  
        calculateDrag() {
            const speedSquared = Math.pow(this.submarine.velocity.length(), 2);
            return 0.5 * this.waterDensity * speedSquared * this.area * this.dragCoefficient;
        }
  
        updateForces(deltaTime) {
            const lift = this.calculateLift();
            const drag = this.calculateDrag();
            const thrust = this.submarine.propellerPower * this.submarine.propellerSpeed;
            const netForce = this.submarine.calculateNetForce(lift, drag, thrust);
            const acceleration = this.submarine.calculateAcceleration(netForce);
            this.submarine.updateSpeed(acceleration, deltaTime);
        }
  
        updateAngleOfAttack() {
            const speed = this.submarine.velocity.length();
            this.angleOfAttack = Math.atan2(speed, this.submarine.depth) * (180 / Math.PI);
            this.angleOfAttack = Math.max(0, Math.min(this.maxAngleOfAttack, this.angleOfAttack));
        }
        
    }
  
    Rudder = class {
        constructor(submarine) {
            this.submarine = submarine;
            this.area = 5; // Rudder area in square meters
            this.angleOfAttack = 0; // Angle of attack in degrees
            this.liftCoefficient = 0.3; // Lift coefficient for yaw
            this.waterDensity = 1000; // كثافة الماء
        }
  
        calculateYawForce() {
            const speedSquared = Math.pow(this.submarine.velocity.length(), 2);
            return 0.5 * this.waterDensity * speedSquared * this.area * this.liftCoefficient * Math.sin(this.angleOfAttack * Math.PI / 180);
        }
  
        setAngleOfAttack(angle) {
            this.angleOfAttack = angle;
        }
  
        updateForces(deltaTime) {
            const yawForce = this.calculateYawForce();
            this.submarine.orientation.yaw += yawForce * deltaTime / this.submarine.mass;
        }
    }
  }
  
  let submarine = new Submarine(100, 1025, 50000, 1000, 10);
  submarine.frontWings.setAngleOfAttack(5);
  submarine.rearWings.setAngleOfAttack(3);
  submarine.rudder.setAngleOfAttack(2);
  
  let deltaTime = 0.1; // Time step in seconds
  for (let i = 0; i < 100; i++) {
    submarine.updatePhysics(deltaTime);
    console.log(Position: ${submarine.position.x}, ${submarine.position.y}, ${submarine.position.z});
  }