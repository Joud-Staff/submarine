const gravity_acceleration = 9.81;
let time = 0;
//clock class
// const clock = new THREE.Clock();

// time = clock.getElapsedTime();
console.log(time);
// the time shoud increase by a clock not depended on the divce processing speed!

class Submarine {
  constructor(volume, water_density, mass, radius) {
    this.position = new Vector3D(); // Submarine's position
    this.velocity = new Vector3D(); // Submarine's velocity
    this.acceleration = new Vector3D(); // Submarine's acceleration
    this.orientation = { roll: 0, pitch: 0, yaw: 0 }; // Submarine's orientation in radians
    // this.dragCoefficient = 0.05; // Drag coefficient //unused for now
    //init status
    // this.vertical_acceleration = 0; //not needed
    // this.vertical_velocity = 0;
    // this.y = 0;
    //my attributes
    this.volume = volume;
    this.water_density = water_density;
    this.mass = mass;
    this.radius = radius;
    this.weight = this.mass * gravity_acceleration;
    this.buoyant_force =
      this.volume * this.water_density * gravity_acceleration;
    // this.vertical_force = this.buoyant_force - this.weight; //unneeded
    this.acceleration.y = this.vertical_force / this.mass;
    if (this.acceleration.y != 0) {
      this.velocity.y = this.velocity.y + this.acceleration.y * time;
      this.position.y =
        (this.position.y +
          this.velocity.y * time +
          (1 / 2) * this.acceleration.y * time) ^
        2;
    } else {
      this.y = this.y + this.velocity.y * time;
    }
    //requirments for horizontal
    this.projection = 2 * Math.PI * radius;
    //horizontal
    this.propeller_power = propeller_power;
    this.propeller_speed = propeller_speedspeed;
    this.drag_engine = this.propeller_power * this.propeller_speed;
    this.resistance.x =
      (1 / 2) *
      this.friction_co *
      this.projection *
      this.water_density *
      this.velocity.x ** 2;
    //for example use the vector
    this.force = new Vector3D(
      this.drag_engine - this.resistance.x,
      this.buoyant_force - this.weight,
      fz
      //thaer
      this.rearWings = new this.RearWings(this);
    );
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