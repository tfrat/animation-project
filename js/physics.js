
class PhysicsObject {

  constructor(object, mass, force) {
    this.inMotion = true
    this.uk = .09
    this.us = .5
    this.gravity = 9.8
    this.object = object
    this.mass = mass
    this.force = force
    this.momentum = this.force.clone().multiplyScalar(1/mass)
    this.velocity = this.momentum.clone().multiplyScalar(1/mass)
    this.normal = this.mass * this.gravity
    this.staticForce = this.normal * this.us
    this.kineticForce = this.normal * this.uk
  }

  setKineticCoef(value) {
    this.uk = value
    this.kineticForce = this.normal * this.uk
  }

  getPosition() {
    return this.object.position
  }

  setForce(force) {
    printVector("Set force", force )
    this.force = force
    this.momentum = this.force.clone().multiplyScalar(1/this.mass)
    this.velocity = this.momentum.clone().multiplyScalar(1/this.mass)
  }

  updateForces( t ) {
    if(this.inMotion) {
      var fn = this.force.clone().normalize()
      fn.negate()
      fn.multiplyScalar(this.kineticForce)
      this.force.add(fn)

      this.applyForces(t)
    }

    return this.inMotion
  }

  applyForces( t ) {
    if(this.inMotion) {
        this.object.position.addScaledVector(this.velocity, t)
        var delta = this.force.clone().multiplyScalar(t)

        printVector("Delta", delta)
        printVector("Momentum", this.momentum)

        if(delta.length() > this.momentum.length()){
          this.inMotion = false
          this.setForce(new THREE.Vector3(0,0,0))
        } else {
          this.momentum.add(delta)
          this.velocity = this.momentum.clone().multiplyScalar(1/this.mass)
        }
      }
  }

}

function printVector(s, v) {
    console.log(s + ": ( "+v.x+", "+v.y+", "+v.z+")")
}
