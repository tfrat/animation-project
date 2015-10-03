function Keyframe(t, x, y, z, xa, ya, za, theta) {
  if (isNaN(t)) {
    throw "Not a number"
  }
  this.t = t
  this.x = x
  this.y = y
  this.z = z
  this.xa = xa
  this.ya = ya
  this.za = za
  this.theta = theta

  this.head = true
  this.next = null
}

Keyframe.prototype.push = function(keyframe) {
  if(!this.hasNext()) {
    this.next = keyframe
  } else {
    this.next.push(keyframe)
  }
}

Keyframe.prototype.peek = function() {
  return this.next
}

Keyframe.prototype.hasNext = function() {
  return this.next != null
}

Keyframe.prototype.getLast = function() {
  if(!this.hasNext()) {
    return this
  }else{
    return this.peek().getLast()
  }
}

Keyframe.prototype.toString = function () {
    return "Keyframe: t -> " + this.t +
                   ", x ->" + this.x +
                   ", y ->" + this.y +
                   ", z ->" + this.z +
                   ", xa ->" + this.xa +
                   ", ya ->" + this.ya +
                   ", za ->" + this.za +
                   ", theta ->" + this.theta
};

function interpolate(frameOne, frameTwo, t) {

  var newX = (frameTwo.x - frameOne.x) * t + frameOne.x
  var newY = (frameTwo.y - frameOne.y) * t + frameOne.y
  var newZ = (frameTwo.z - frameOne.z) * t + frameOne.z

  return new Keyframe(t, newX, newY, newZ, 0, 0, 0, 0)
}

function animate (scene, renderer, duration, animation) {

  var initialTime = Date.now()

  var render = function () {
    requestAnimationFrame( render )

    var t = (Date.now() - initialTime) / 1000

    if (t <= duration) {
      animation(t)
    }
    renderer.render( scene, camera )
  }

  render();
}
