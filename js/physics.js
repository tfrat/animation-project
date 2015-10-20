
class PhysicsObject {
  constructor(object, mass, velocity, acceleration) {
    this.object = object
    this.mass = mass
    this.velocity = velocity
    this.acceleration = acceleration
    this.force = acceleration.clone().multiplyScalar(mass)
    this.momentum = velocity.clone().multiplyScalar(mass)
  }

  getPosition() {
    return this.object.position
  }
  updateForces( t ) {
    this.force = this.acceleration.clone().multiplyScalar(this.mass)
  }
  applyForces( t ) {

      this.object.position.addScaledVector(this.velocity, t)
      this.momentum.addScaledVector(this.force, t)
      this.velocity = this.momentum.clone().multiplyScalar(1/this.mass)
      //console.log(this.velocity.length())
  }
  }

}
