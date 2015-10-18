
function Properties(object, velocity, mass, restitution) {
  this.object = object
  this.tVelocity = velocity
  this.mass = mass
  this.restitution = restitution
}

function Velocity(x, y, z, mag) {
  this.direction = new THREE.Vector3(x, y, z)
  this.mag = mag
}
