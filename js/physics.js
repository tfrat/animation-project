
class PhysicsObject {

  constructor(object, mass, force) {
    this.inMotion = true
    this.uk = .09
    this.us = .5
    this.gravity = 9.8
    this.gravityVec = new THREE.Vector3(0, -.1, 0)
    this.object = object
    this.mass = mass
    this.force = force
    this.momentum = this.force.clone().multiplyScalar(1/mass)
    this.velocity = this.momentum.clone().multiplyScalar(1/mass)
    this.normal = this.mass * this.gravity
    this.staticForce = this.normal * this.us
    this.kineticForce = this.normal * this.uk
    this.restitution = .9
  }

  setKineticCoef(value) {
    this.uk = value
    this.kineticForce = this.normal * this.uk
  }

  getPosition() {
    return this.object.position
  }

  getID() {
    return this.object.id
  }

  setVelocity(velocity) {
    this.velocity = velocity
    this.momentum = this.velocity.clone().multiplyScalar(this.mass)
    this.force = this.momentum.clone().multiplyScalar(this.mass)
  }

  setForce(force) {
    this.force = force
    this.momentum = this.force.clone().multiplyScalar(1/this.mass)
    this.velocity = this.momentum.clone().multiplyScalar(1/this.mass)
  }

  addForce(force) {
    this.force.add(force)
  }

  updateForces( t ) {
    var fn = this.force.clone().normalize()
    fn.negate()
    fn.multiplyScalar(this.kineticForce)
    this.force.add(fn)

    this.force.add(this.gravityVec)

    this.applyForces(t)
  }

  applyForces( t ) {
    this.object.position.addScaledVector(this.velocity, t)
    var delta = this.force.clone().multiplyScalar(t)

    if(delta.length() > this.momentum.length() && this.getPosition().y <= ballRadius){
      this.setForce(new THREE.Vector3(0,0,0))
    } else {
      this.momentum.add(delta)
      this.velocity = this.momentum.clone().multiplyScalar(1/this.mass)
    }
  }

}

function printVector(s, v) {
  console.log(s + ": ( "+v.x+", "+v.y+", "+v.z+")")
}


function calculateNormal(ballOne, ballTwo) {
  return ballOne.getPosition().clone().sub(ballTwo.getPosition()).normalize()
}

function handleCollision(ballOne, ballTwo) {

  var normal = calculateNormal(ballOne, ballTwo)

  var a1 = ballOne.velocity.dot(normal)
  var a2 = ballTwo.velocity.dot(normal)

  var p = (2 * (a1 - a2)) / ballOne.mass

  var tmp = normal.clone().multiplyScalar(p/10)

  var v1 = ballOne.velocity.clone().sub(tmp)
  var v2 = ballTwo.velocity.clone().add(tmp)

  ballOne.setVelocity(v1)
  ballTwo.setVelocity(v2)
}

function detectSpheres() {
  for (var x = 0; x < balls.length; x++) {
    var ballOne = new THREE.Sphere(balls[x].getPosition(), ballRadius)
      for (var y = x + 1; y < balls.length; y++) {
        var ballTwo = new THREE.Sphere(balls[y].getPosition(), ballRadius)
        if(balls[x].velocity.dot(calculateNormal(balls[x],balls[y])) <= 0) {
          if (ballOne.intersectsSphere(ballTwo)) {
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
      if(Math.abs(walls[x].distanceToSphere(ball)) <= ballRadius) {

        if(balls[y].velocity.dot(walls[x].normal) < 0) {
          var ri = balls[y].velocity.clone().negate()
          var reflected = walls[x].normal.clone().multiplyScalar(2 * ri.dot(walls[x].normal))

          reflected.sub(ri)
          reflected.multiplyScalar(balls[y].restitution)
          balls[y].setVelocity(reflected)
        }
      }
    }
  }
}

function detectCollisions() {
  detectSpheres()

  detectWalls()
}

function randomRange(start, end) {
  return (Math.random() * (end - start)) + start
}
