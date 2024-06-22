//shammout time
//clock function
var timer;
var ele = document.getElementById('timer');

function startTimer(){

  var sec = 0;
  var min = 0;
  timer = setInterval(()=>{

    if(sec >= 60){

      sec = 0;
      min ++;

    }

    if(min > 0){

      if(sec < 10){

        ele.innerHTML = '0' + min + ':0' + sec;

      }else{

      ele.innerHTML = '0' + min + ':' + sec;

      }

    }else if(sec >= 10){

      ele.innerHTML = min + ':' + sec;

    }else{

    ele.innerHTML = min + ':0' + sec;

    }
    sec ++;

  }, 1000)

}

startTimer();
let time = 0;
const gravity_acceleration = 9.81;

class Submarine {
  constructor(volume, water_density, mass, radius, propeller_efficiency, propeller_power) {
    this.position = new Vector3D(); // Submarine's position
    this.velocity = new Vector3D(); // Submarine's velocity
    this.acceleration = new Vector3D(); // Submarine's acceleration
    this.orientation = { roll: 0, pitch: 0, yaw: 0 }; // Submarine's orientation in radians

    //my attributes
    this.volume = volume;
    this.water_density = water_density;
    this.mass = mass;
    this.radius = radius;
    this.weight = this.mass * gravity_acceleration;
    this.buoyant_force = this.volume * this.water_density * gravity_acceleration;
    // Horizontal movement requirements
    this.projection = 2 * Math.PI * radius;
    this.friction_co = 0.05; // Assuming a default friction coefficient
    //horizontal
    this.propeller_power = propeller_power;
    this.propeller_speed = propeller_speedspeed;
    this.propeller_efficiency = propeller_efficiency;
    let velocityX = this.submarine.velocity.x || 1; // Prevent division by zero
    this.thrust = (this.propeller_power * this.propeller_efficiency) / velocityX;
    this.drag = (1 / 2) * this.friction_co * this.projection * this.water_density * this.velocity.x ** 2;

    //for projecting force
     //for example
    this.angleOfHorizont = Math.PI / 4 // the angle between the submarine x axis and the world x axis (the horizont)
    this.angleAlfa = Math.PI / 4 // the angle between the sumarine x axis and the world z axis
     //end example
    this.object_force_x = this.thrust - this.drag; // the force along the submarine x axis

    this.rearWings = new this.RearWings(this);

    this.lift = this.rearWings.lift + this.frontWings.lift;

    this.force = new Vector3D(this.object_force_x * Math.cos(this.angleOfHorizont),
     this.buoyant_force - this.weight + this.object_force_x * Math.sin(this.angleOfHorizont) + this.lift, 
     this.object_force_x * Math.cos(this.angleAlfa));

    this.acceleration = this.force / this.mass;
    // the motion
    if (this.acceleration.x != 0) {
      this.velocity.x = this.velocity.x + this.acceleration.x * time;
      this.position.x = this.position.x + this.velocity.x * time + (1 / 2) * this.acceleration.x * time ** 2;
    } else {
      this.position.x = this.position.x + this.velocity.x * time;
    }

    if (this.acceleration.y != 0) {
      this.velocity.y = this.velocity.y + this.acceleration.y * time;
      this.position.y = this.position.y + this.velocity.y * time + (1 / 2) * this.acceleration.y * time ** 2;
    } else {
      this.position.y = this.position.y + this.velocity.y * time;
    }

    if (this.acceleration.z != 0) {
      this.velocity.z = this.velocity.z + this.acceleration.z * time;
      this.position.z = this.position.z + this.velocity.z * time + (1 / 2) * this.acceleration.z * time ** 2;
    } else {
      this.position.z = this.position.z + this.velocity.z * time;
    }
    
    
  }
  // class Front_wings {
  //     // joud

  //     // end joud
  // }
  calculateNetForce(lift, drag, thrust) {
    return new Vector3D(thrust - drag, lift - this.weight, 0);
  }

  calculateAcceleration(netForce) {
    return netForce.clone().multiplyScalar(1 / this.mass);
  }

  updateSpeed(acceleration, deltaTime) {
    this.velocity.add(acceleration.clone().multiplyScalar(deltaTime));
  }

  update(deltaTime) {
    this.rearWings.updateForces(deltaTime);
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
  }
  // class Back_wings {
  //     // Thaer
  RearWings = class {
    constructor(submarine) {
      this.submarine = submarine;
      this.area = 10; //const for submarine
      this.angleOfAttack = 0;
      this.liftCoefficient = 0.5; //changeable
      this.dragCoefficient = 0.05; //changeable
      this.waterDensity = 1000;
      this.maxAngleOfAttack = 15;
    }

    setAngleOfAttack(angle) {
      this.angleOfAttack = Math.max(0, Math.min(this.maxAngleOfAttack, angle)); //i don't understand it
    }

    calculateLift() {
      const speedSquared = Math.pow(this.submarine.velocity.length(), 2); // find wether the speed should be on x axis or the magnitude of the vector
      return (
        0.5 *
        this.waterDensity *
        speedSquared *
        this.area *
        this.liftCoefficient *
        Math.sin((this.angleOfAttack * Math.PI) / 180)
      );
    }

    calculateDrag() {
      const speedSquared = Math.pow(this.submarine.velocity.length(), 2);
      return (
        0.5 *
        this.waterDensity *
        speedSquared *
        this.area *
        this.dragCoefficient
      );
    }

    updateForces(deltaTime) {
      const lift = this.calculateLift();
      const drag = this.calculateDrag();
      const thrust = this.submarine.drag_engine; //unneeded
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
  };
  //     //end Thaer
  // }
  // class Rudder {
  //     //Sera

  //     //end Sera
  // }
  // //ashraf & shammout
}