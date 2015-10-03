function Keyframe(t, position, rotation) {
  if (isNaN(t)) {
    throw "Not a number"
  }
  this.t = t
  this.position = position
  this.rotation = rotation

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

Keyframe.prototype.interpolate = function(nextFrame, u) {
  var newPosition = new THREE.Vector3()

  newPosition.lerpVectors(this.position, nextFrame.position, u)

  return new Keyframe(u, newPosition, this.rotation)
}

Keyframe.prototype.toString = function () {
    return "Keyframe: t -> " + this.t +
                   ", x ->" + this.position.x +
                   ", y ->" + this.position.y +
                   ", z ->" + this.position.z +
                   ", xa ->" + this.rotation.x +
                   ", ya ->" + this.rotation.y +
                   ", za ->" + this.rotation.z +
                   ", th ->" + this.rotation.w
};

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
