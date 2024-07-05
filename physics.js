import { b } from 'vite';

//shammout time
//clock function

var timer;
var ele = document.getElementById('timer');
var sec = 0;

function startTimer() {

  timer = setInterval(() => {

    ele.innerHTML = sec;

    sec++;

  }, 1000)

}

startTimer();


const gravity_acceleration = 9.81;

class Submarine {

  // //ashraf & shammout

  constructor(volume, water_density, mass, radius, length, propellerEfficiency) {

    this.position = new Vector3D(); // Submarine's position
    this.velocity = new Vector3D(); // Submarine's velocity
    this.acceleration = new Vector3D(); // Submarine's acceleration
    this.orientation = { roll: 0, pitch: 0, yaw: 0 }; // Submarine's orientation in radians

    this.volume = volume;
    this.water_density = water_density;
    this.mass = mass;
    this.radius = radius;
    this.length = length;
    this.weight = this.mass * gravity_acceleration;
    this.buoyant_force = this.calculateBuoyantForce();

    // Horizontal movement requirements

    this.projection = 2 * Math.PI * radius;
    this.friction_co = 0.05; // Assuming a default friction coefficient

    //horizontal

    this.propeller_power = 0;
    this.propeller_speed = propeller_speed;
    this.propellerEfficiency = propellerEfficiency;
    this.thrust = (this.propeller_power * this.propellerEfficiency) / Math.abs(this.submarine.velocity.x || 1);    // Prevent division by zero
    this.drag = (1 / 2) * this.friction_co * this.projection * this.water_density * this.velocity.x ** 2;

    this.rearWings = new this.RearWings(this);
    this.frontWings = new this.FrontWings(this);
    this.rudder = new this.Rudder(this);

    this.updateForceAndAcceleration();
    //for projecting force

      //for example

    this.angleOfHorizont = Math.PI / 4 // the angle between the submarine x axis and the world x axis (the horizont)
    this.angleAlfa = Math.PI / 4 // the angle between the sumarine x axis and the world z axis

      //end example

    this.object_force_x = this.thrust - this.drag; // the force along the submarine x axis


    this.lift = this.rearWings.lift + this.frontWings.lift;

    this.force = new Vector3D(this.object_force_x * Math.cos(this.angleOfHorizont),
      this.buoyant_force - this.weight + this.object_force_x * Math.sin(this.angleOfHorizont) + this.lift,
      this.object_force_x * Math.cos(this.angleAlfa));

    this.acceleration = this.force / this.mass;

    // the motion

    if (this.acceleration.x != 0) {

      this.velocity.x = this.velocity.x + this.acceleration.x * sec;
      this.position.x = this.position.x + this.velocity.x * sec + (1 / 2) * this.acceleration.x * sec ** 2;

    } else {

      this.position.x = this.position.x + this.velocity.x * sec;

    }

    if (this.acceleration.y != 0) {

      this.velocity.y = this.velocity.y + this.acceleration.y * sec;
      this.position.y = this.position.y + this.velocity.y * sec + (1 / 2) * this.acceleration.y * sec ** 2;

    } else {

      this.position.y = this.position.y + this.velocity.y * sec;

    }

    if (this.acceleration.z != 0) {

      this.velocity.z = this.velocity.z + this.acceleration.z * sec;
      this.position.z = this.position.z + this.velocity.z * sec + (1 / 2) * this.acceleration.z * sec ** 2;

    } else {

      this.position.z = this.position.z + this.velocity.z * sec;

    }


  }

  updateForceAndAcceleration() {
    this.object_force_x = this.thrust - this.drag;
    this.lift = this.rearWings.calculateLift() + this.frontWings.calculateLift();
    this.force = new Vector3D(
      this.object_force_x * Math.cos(this.angleOfHorizont),
      this.buoyant_force - this.weight + this.object_force_x * Math.sin(this.angleOfHorizont) + this.lift,
      this.object_force_x * Math.cos(this.angleAlfa)
    );

    this.acceleration = this.force.clone().multiplyScalar(1 / this.mass);
  }

  calculateBuoyantForce() {
    return this.volume * this.waterDensity * gravityAcceleration;
  }

  calculateNetForce() { //unfinished
        return new Vector3D(this.object_force_x * Math.cos(this.angleOfHorizont),
        this.buoyant_force - this.weight + this.object_force_x * Math.sin(this.angleOfHorizont) + this.lift,
        this.object_force_x * Math.cos(this.angleAlfa));
  }

  calculateAcceleration(netForce) {
    return netForce.clone().multiplyScalar(1 / this.mass);
  }

  updateSpeed(acceleration, deltaTime) {
    this.velocity.add(acceleration.clone().multiplyScalar(deltaTime));
  }

  // Calculate yaw, pitch, and roll
  calculateOrientation() {
    const yaw = Math.atan2(this.velocity.z, this.velocity.x) * (180 / Math.PI);
    const pitch = Math.atan2(this.velocity.y, Math.sqrt(this.velocity.x ** 2 + this.velocity.z ** 2)) * (180 / Math.PI);

    // Calculate roll based on the difference in lift forces between right and left wings
    const frontRightLift = this.frontWings.calculateRightLift();
    const frontLeftLift = this.frontWings.calculateLeftLift();
    const rearRightLift = this.rearWings.calculateRightLift();
    const rearLeftLift = this.rearWings.calculateLeftLift();

    const totalLift = frontRightLift + frontLeftLift + rearRightLift + rearLeftLift;
    const roll = Math.atan2((frontRightLift + rearRightLift) - (frontLeftLift + rearLeftLift), totalLift) * (180 / Math.PI);

    this.orientation = { yaw, pitch, roll };
  }

  updatePhysics(deltaTime) {  //unfinished
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

  increasePower() {
    this.propeller_power += 1;
  }

  decreasePower() {
    this.propeller_power -= 1;
  }
  
  increaseMass() {
    this.mass += 1;
  }

  decreaseMass() {
    this.mass -= 1;
  }

  //thear
  update(deltaTime) {

    this.rearWings.updateForces(deltaTime);
    this.frontWings.updateForces(deltaTime);
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));

  }

  // joud

  FrontWings = class {

    constructor(submarine) {

      this.submarine = submarine;
      this.area = 10; //const for submarine  // it seem incorrect // the area is the projection area propaply
      this.angleOfAttackRight = 0; // Angle of attack for right side
      this.angleOfAttackLeft = 0; // Angle of attack for left side
      this.liftCoefficient = 0.5; //changeable
      this.dragCoefficient = 0.05; //changeable
      this.waterDensity = 1000;
      this.maxAngleOfAttack = 15;

    }

    setAngleOfAttack(angle) {

      this.angleOfAttack = Math.max(0, Math.min(this.maxAngleOfAttack, angle)); //i don't understand it

    }

    calculateRightLift() {
      const speedSquared = Math.pow(this.submarine.velocity.length(), 2); // find wether the speed should be on x axis or the magnitude of the vector
      return (
        0.5 *
        this.waterDensity *
        speedSquared *
        this.area * //projection area of the right wing
        (this.liftCoefficient/2) *
        Math.sin((this.angleOfAttack * Math.PI) / 180)
      );    }

    calculateLeftLift() {
      const speedSquared = Math.pow(this.submarine.velocity.length(), 2); // find wether the speed should be on x axis or the magnitude of the vector
      return (
        0.5 *
        this.waterDensity *
        speedSquared *
        this.area * //projection area of the left wing
        (this.liftCoefficient/2) *
        Math.sin((this.angleOfAttack * Math.PI) / 180)
      );    }

    calculateTotalLift() {
      return this.calculateLeftLift + this.calculateRightLift;
    }

    calculateLeftDrag() {

      const speedSquared = Math.pow(this.submarine.velocity.length(), 2);
      return (
        0.5 *
        this.waterDensity *
        speedSquared *
        this.area * //projection area of the left wing
        (this.dragCoefficient/2)
      );

    }

    calculateRightDrag() {

      const speedSquared = Math.pow(this.submarine.velocity.length(), 2);
      return (
        0.5 *
        this.waterDensity *
        speedSquared *
        this.area * //projection area of the right wing
        (this.dragCoefficient/2)
      );

    }

    calculateTotalDrag() {
      return this.calculateLeftDrag + this.calculateRightDrag;
    }

    updateForces(deltaTime) {

      const lift = this.calculateLift();
      const drag = this.calculateDrag();
      const thrust = this.submarine.thrust; //unneeded
      const netForce = this.submarine.calculateNetForce(lift, drag, thrust);
      const acceleration = this.submarine.calculateAcceleration(netForce);
      this.submarine.updateSpeed(acceleration, deltaTime);

    }

    updateAngleOfAttack() {

      const speed = this.submarine.velocity.length();
      this.angleOfAttack =
        Math.atan2(speed, this.submarine.depth) * (180 / Math.PI);
      this.angleOfAttack = Math.max(
        0,
        Math.min(this.maxAngleOfAttack, this.angleOfAttack)
      );

    }

    get_pitch_control() {
      const pitchAngle = Math.atan2(this.submarine.velocity.z, this.submarine.velocity.x) * (180 / Math.PI);
      const pitchTorque = this.calculateLift() * Math.cos(pitchAngle * (Math.PI / 180)); // Assuming the lift force contributes to pitch torque
      return { pitchAngle, pitchTorque };
    }

    get_roll_control() {
      const rollAngle = Math.atan2(this.submarine.velocity.y, this.submarine.velocity.x) * (180 / Math.PI);
      const rollTorque = this.calculateLift() * Math.sin(rollAngle * (Math.PI / 180)); // Assuming the lift force contributes to roll torque
      return { rollAngle, rollTorque };
    }

    // Increase angle of attack for the right side of front wings
  increaseAngleOfAttackRight() {
    this.angleOfAttackRight += 0.1;
    if (this.angleOfAttackRight > this.maxAngleOfAttack) {
      this.angleOfAttackRight = this.maxAngleOfAttack;
    }
  }

  // Decrease angle of attack for the right side of front wings
  decreaseAngleOfAttackRight() {
    this.angleOfAttackRight -= 0.1;
    if (this.angleOfAttackRight < 0) {
      this.angleOfAttackRight = 0;
    }
  }

  // Increase angle of attack for the left side of front wings
  increaseAngleOfAttackLeft() {
    this.angleOfAttackLeft += 0.1;
    if (this.angleOfAttackLeft > this.maxAngleOfAttack) {
      this.angleOfAttackLeft = this.maxAngleOfAttack;
    }
  }

  // Decrease angle of attack for the left side of front wings
  decreaseAngleOfAttackLeft() {
    this.angleOfAttackLeft -= 0.1;
    if (this.angleOfAttackLeft < 0) {
      this.angleOfAttackLeft = 0;
    }
  }

   // Increase angle of attack for both right and left wings simultaneously
   increaseAngleOfAttack() {
    this.angleOfAttack.right += 0.1;
    this.angleOfAttack.left += 0.1;
    this.angleOfAttack.right = Math.min(this.angleOfAttack.right, this.maxAngleOfAttack);
    this.angleOfAttack.left = Math.min(this.angleOfAttack.left, this.maxAngleOfAttack);
  }

  // Decrease angle of attack for both right and left wings simultaneously
  decreaseAngleOfAttack() {
    this.angleOfAttack.right -= 0.1;
    this.angleOfAttack.left -= 0.1;
    this.angleOfAttack.right = Math.max(this.angleOfAttack.right, 0);
    this.angleOfAttack.left = Math.max(this.angleOfAttack.left, 0);
  }

  };

  // end joud


  //     // Thaer


  RearWings = class {

    constructor(submarine) {

      this.submarine = submarine;
      this.area = 10; //const for submarine  // it seem incorrect // the area is the projection area propaply
      this.angleOfAttackRight = 0; // Angle of attack for right side
      this.angleOfAttackLeft = 0; // Angle of attack for left side
      this.liftCoefficient = 0.5; //changeable
      this.dragCoefficient = 0.05; //changeable
      this.waterDensity = 1000;
      this.maxAngleOfAttack = 15;

    }

    setAngleOfAttack(angle) {

      this.angleOfAttack = Math.max(0, Math.min(this.maxAngleOfAttack, angle)); //i don't understand it

    }

    calculateRightLift() {
      const speedSquared = Math.pow(this.submarine.velocity.length(), 2); // find wether the speed should be on x axis or the magnitude of the vector
      return (
        0.5 *
        this.waterDensity *
        speedSquared *
        this.area * //projection area of the right wing
        (this.liftCoefficient/2) *
        Math.sin((this.angleOfAttack * Math.PI) / 180)
      );    }

    calculateLeftLift() {
      const speedSquared = Math.pow(this.submarine.velocity.length(), 2); // find wether the speed should be on x axis or the magnitude of the vector
      return (
        0.5 *
        this.waterDensity *
        speedSquared *
        this.area * //projection area of the left wing
        (this.liftCoefficient/2) *
        Math.sin((this.angleOfAttack * Math.PI) / 180)
      );    }

    calculateTotalLift() {
      return this.calculateLeftLift + this.calculateRightLift;
    }

    calculateLeftDrag() {

      const speedSquared = Math.pow(this.submarine.velocity.length(), 2);
      return (
        0.5 *
        this.waterDensity *
        speedSquared *
        this.area * //projection area of the left wing
        (this.dragCoefficient/2)
      );

    }

    calculateRightDrag() {

      const speedSquared = Math.pow(this.submarine.velocity.length(), 2);
      return (
        0.5 *
        this.waterDensity *
        speedSquared *
        this.area * //projection area of the right wing
        (this.dragCoefficient/2)
      );

    }

    calculateTotalDrag() {
      return this.calculateLeftDrag + this.calculateRightDrag;
    }

    updateForces(deltaTime) {

      const lift = this.calculateLift();
      const drag = this.calculateDrag();
      const netForce = this.submarine.calculateNetForce(lift, drag, submarine.thrust /*i don't know if needed*/ );
      const acceleration = this.submarine.calculateAcceleration(netForce);
      this.submarine.updateSpeed(acceleration, deltaTime);

    }

    updateAngleOfAttack() {

      const speed = this.submarine.velocity.length();
      this.angleOfAttack =
        Math.atan2(speed, this.submarine.depth) * (180 / Math.PI);
      this.angleOfAttack = Math.max(
        0,
        Math.min(this.maxAngleOfAttack, this.angleOfAttack)
      );
    }

    get_pitch_control() {
      const pitchAngle = Math.atan2(this.submarine.velocity.z, this.submarine.velocity.x) * (180 / Math.PI);
      const pitchTorque = this.calculateLift() * Math.cos(pitchAngle * (Math.PI / 180)); // Assuming the lift force contributes to pitch torque
      return { pitchAngle, pitchTorque };
    }

    get_roll_control() {
      const rollAngle = Math.atan2(this.submarine.velocity.y, this.submarine.velocity.x) * (180 / Math.PI);
      const rollTorque = this.calculateLift() * Math.sin(rollAngle * (Math.PI / 180)); // Assuming the lift force contributes to roll torque
      return { rollAngle, rollTorque };
    }

   // Increase angle of attack for the right side of rear wings
  increaseAngleOfAttackRight() {
    this.angleOfAttackRight += 0.1;
    if (this.angleOfAttackRight > this.maxAngleOfAttack) {
      this.angleOfAttackRight = this.maxAngleOfAttack;
    }
  }

  // Decrease angle of attack for the right side of rear wings
  decreaseAngleOfAttackRight() {
    this.angleOfAttackRight -= 0.1;
    if (this.angleOfAttackRight < 0) {
      this.angleOfAttackRight = 0;
    }
  }

  // Increase angle of attack for the left side of rear wings
  increaseAngleOfAttackLeft() {
    this.angleOfAttackLeft += 0.1;
    if (this.angleOfAttackLeft > this.maxAngleOfAttack) {
      this.angleOfAttackLeft = this.maxAngleOfAttack;
    }
  }

  // Decrease angle of attack for the left side of rear wings
  decreaseAngleOfAttackLeft() {
    this.angleOfAttackLeft -= 0.1;
    if (this.angleOfAttackLeft < 0) {
      this.angleOfAttackLeft = 0;
    }
  }

  // Increase angle of attack for both right and left wings simultaneously
  increaseAngleOfAttack() {
    this.angleOfAttack.right += 0.1;
    this.angleOfAttack.left += 0.1;
    this.angleOfAttack.right = Math.min(this.angleOfAttack.right, this.maxAngleOfAttack);
    this.angleOfAttack.left = Math.min(this.angleOfAttack.left, this.maxAngleOfAttack);
  }

  // Decrease angle of attack for both right and left wings simultaneously
  decreaseAngleOfAttack() {
    this.angleOfAttack.right -= 0.1;
    this.angleOfAttack.left -= 0.1;
    this.angleOfAttack.right = Math.max(this.angleOfAttack.right, 0);
    this.angleOfAttack.left = Math.max(this.angleOfAttack.left, 0);
  }

  };
  //     //end Thaer


  //     //Sera
  Rudder = class {

    constructor(submarine) {

      this.rudderAngle = 0;
      this.speed = 0;
      this.k = 1;  // Proportional constant (k) for the specific ship

    }

    // Set the rudder angle (in degrees)
    setRudderAngle(angle) {


      this.rudderAngle = angle;
    }

    // Calculate the yaw rate (in degrees per second)
    calculateYawRate() {

      // Yaw rate formula: yawRate = k * rudderAngle / speed
      if (this.speed == 0) {
        throw new Error("Speed must be greater than 0 to calculate yaw rate.");
      }
      return this.submarine.length * Math.tan(this.rudderAngle) / this.submarine.velocity.x.length();

    }

    // Calculate the yaw angle over a given time period (in seconds)
    calculateYawAngle(sec) {

      const yawRate = this.calculateYawRate();
      return yawRate * sec;
    }

    toRight() {
      this.rudderAngle += 0.1;
    }

    toLeft() {
      this.rudderAngle -= 0.1;
    }
  }
  //     //end Sera
  
}

// Assuming 'submarine' is an instance of your Submarine class

// Function to handle keydown events
function handleKeyDown(event) {
  switch (event.key) {
    case 'ArrowUp':
      submarine.increasePower();
      break;
    case 'ArrowDown':
      submarine.decreasePower();
      break;
    case 'ArrowLeft':
      submarine.rudder.toLeft();
      break;
    case 'ArrowRight':
      submarine.rudder.toRight();
      break;

    //tanks
    case 'm':
      submarine.increaseMass();
      break;
    case 'n':
      submarine.decreaseMass();
      break;

    //front
    case 'w':
      submarine.frontWings.increaseAngleOfAttack();
      break;
    case 's':
      submarine.frontWings.decreaseAngleOfAttack();
      break;
    case 'q':
      submarine.frontWings.increaseAngleOfAttackLeft();
      break;
    case 'a':
      submarine.frontWings.decreaseAngleOfAttackLeft();
      break;
    case 'e':
      submarine.frontWings.increaseAngleOfAttackRight();
      break;
    case 'd':
      submarine.frontWings.decreaseAngleOfAttackRight();
      break;

    //rear
    case 'i':
      submarine.rearWings.increaseAngleOfAttack();
      break;
    case 'k':
      submarine.rearWings.decreaseAngleOfAttack();
      break;
    case 'u':
      submarine.rearWings.increaseAngleOfAttackLeft();
      break;
    case 'j':
      submarine.rearWings.decreaseAngleOfAttackLeft();
      break;
    case 'o':
      submarine.rearWings.increaseAngleOfAttackRight();
      break;
    case 'l':
      submarine.rearWings.decreaseAngleOfAttackRight();
      break;
    // Add more cases for other keys as needed
  }
}

// Function to handle keyup events (if necessary)
function handleKeyUp(event) {
  // Add handling for keyup events if you need to stop certain actions when keys are released
}

// Event listener to listen for keydown events
document.addEventListener('keydown', handleKeyDown);

// Event listener to listen for keyup events (if needed)
document.addEventListener('keyup', handleKeyUp);