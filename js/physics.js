
function Properties(object, velocity, mass, restitution) {
  this.object = object
  this.tVelocity = velocity
  this.mass = mass
  this.restitution = restitution
}

Properties.prototype.applyForces = function( t )
 {
    this.object.position.addScaledVector(this.tVelocity, t)
 }
