
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

  setVelocity(velocity) {
    this.velocity = velocity
    this.momentum = this.velocity.clone().multiplyScalar(this.mass)
    this.force = this.momentum.clone().multiplyScalar(this.mass)
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

      //printVector("Delta", delta)
      //printVector("Momentum", this.momentum)

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


function calculateNormal(ballOne, ballTwo) {
  return ballOne.getPosition().clone().sub(ballTwo.getPosition()).normalize()
}

function calculateImpulse(ballOne, ballTwo, normal) {

  var impulse = normal.clone()
  var scalar = (ballMass * (ballTwo.velocity.dot(normal) - ballOne.velocity.dot(normal)))/2
  impulse.multiplyScalar(scalar)

  return impulse
}

function applyImpulse(ball, impulse, normal) {
  var newVelocity = ball.velocity.clone()

  var tmp = normal.clone().multiplyScalar(impulse.dot(normal)/ball.mass)

  newVelocity.add(tmp)

  ball.setVelocity(newVelocity)
}

function handleCollision(ballOne, ballTwo) {

  var normal = calculateNormal(ballOne, ballTwo)
  var impulse = calculateImpulse(ballOne, ballTwo, normal)

  applyImpulse(ballOne, impulse, normal)
  applyImpulse(ballTwo, impulse.clone().multiplyScalar(-1), normal)

}

function detectSpheres() {
  for (var x = 0; x < balls.length; x++) {
    var ballOne = new THREE.Sphere(balls[x].getPosition(), ballRadius)
    for (var y = x + 1; y < balls.length; y++) {
      var ballTwo = new THREE.Sphere(balls[y].getPosition(), ballRadius)
      if (ballOne.intersectsSphere(ballTwo)) {
        if(balls[x].velocity.dot(balls[y].velocity) == 0) {
          handleCollision(balls[x], balls[y])
        }
      }
    }
  }
}

function detectWalls() {
  for(var y = 0; y < balls.length; y++) {
    var ball = new THREE.Sphere(balls[y].getPosition(), ballRadius)
    for(var x = 0; x < walls.length; x++) {
      if(Math.abs(walls[x].distanceToSphere(ball)) < ballRadius) {
          var ri = balls[y].velocity.clone().multiplyScalar(-1)
          var reflected = walls[x].normal.clone().multiplyScalar(2 * ri.dot(walls[x].normal))

          reflected.sub(ri)
          reflected.multiplyScalar(restitution)
          balls[y].setVelocity(reflected)
        }
      
    }
  }
}

function detectCollisions() {
  detectSpheres()

  detectWalls()
}
