
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

function detectCollisions() {
  var cueSphere = new THREE.Sphere(cueBall.position, ballRadius)
  for (x in balls) {
    if (x > 0) {
      var ball = new THREE.Sphere(balls[x].getPosition(), ballRadius)
      if (ball.intersectsSphere(cueSphere)) {
        if(balls[0].velocity.dot(balls[x].velocity) == 0) {
          handleCollision(balls[0], balls[x])
        }
      }
    }
  }
}
