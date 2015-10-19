
class PhysicsObject {
  constructor(object, velocity, mass, restitution) {
    this.object = object
    this.tVelocity = velocity
    this.mass = mass
    this.restitution = restitution
  }

  applyForces( t )
  {
      this.object.position.addScaledVector(this.tVelocity, t)
  }

}
