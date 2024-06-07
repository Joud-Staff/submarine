const gravity_acceleration = 9.81;
let time = 0;
//clock class
const clock = new THREE.Clock();

time = clock.getElapsedTime();
console.log(time);
// the time shoud increase by a clock not depended on the divce processing speed!

class Submarine {
    constructor(volume,water_density,mass) {
        this.position = new Vector3D(); // Submarine's position
        this.velocity = new Vector3D(); // Submarine's velocity
        this.acceleration = new Vector3D(); // Submarine's acceleration
        this.orientation = { roll: 0, pitch: 0, yaw: 0 }; // Submarine's orientation in radians
        this.dragCoefficient = 0.05; // Drag coefficient
        //init status
        this.vertical_acceleration = 0;
        this.vertical_velocity = 0;
        this.y = 0;
        //my attributes
        this.volume = volume;
        this.water_density = water_density;
        this.mass = mass;
        this.weight = this.mass * gravity_acceleration;
        this.buoyant_force = this.volume * this.water_density * gravity_acceleration;
        this.vertical_force = this.buoyant_force - this.weight;
        this.vertical_acceleration = this.vertical_force / this.mass;
        if(this.vertical_acceleration != 0) {
            this.vertical_velocity = this.vertical_velocity + this.vertical_acceleration * time;
            this.y = this.y + this.vertical_velocity * time + 1/2 * this.vertical_acceleration * time^2;
        }
        else{
            this.y = this.y + this.vertical_velocity * time;
        }
        //horizontal
        this.propeller_power =  propeller_power;
        this.propeller_speed = propeller_speedspeed;
        this.drag_engine = this.propeller_power * this.propeller_speed;
        this.resistance.x = 1/2 * this.friction_co * this.projection * this.water_density * this.velocity.x **2;
        //for example use the vector
        this.force = new Vector3D(this.drag_engine - this.resistance.x,this.buoyant_force - this.weight,fz)
    }
    // class Front_wings {
    //     // joud

    //     // end joud
    // }
    // class Back_wings {
    //     // Thaer

    //     //end Thaer
    // }
    // class Rudder {
    //     //Sera

    //     //end Sera
    // }
    // //ashraf
}