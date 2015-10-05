/**
 * Create a new Frame object.
 * @param t - The time of the frame, in seconds.
 * @param position - The three dimensional position of the frame.
 * @param roation - The quaternion representation of the rotation.
 */
function Frame(t, position, rotation) {
  // Make sure t is valid
  if (isNaN(t)) {
    throw "Not a number"
  }
  
  this.t = t
  this.position = position
  this.rotation = rotation

  this.next = null
}

/**
 * Add a new frame to the list.
 */
Frame.prototype.push = function(keyframe) {
  if(!this.hasNext()) {
    this.next = keyframe
  } else {
    this.next.push(keyframe)
  }
}

/**
 * Returns the next node in the list.
 */
Frame.prototype.peek = function() {
  return this.next
}

/**
 * Returns whether or not there is another node in the list.
 */
Frame.prototype.hasNext = function() {
  return this.next != null
}

/**
 * Return the last variable in the frame list.
 */
Frame.prototype.getLast = function() {
  if(!this.hasNext()) {
    return this
  }else{
    return this.peek().getLast()
  }
}

/**
 * Create a new frame from the interpolation between two Keyframes
 * @param nextFrame - The second Keyframe.
 * @param u - the alpha value for the interpolation.
 */
Frame.prototype.interpolate = function(nextFrame, u) {
  var newPosition = new THREE.Vector3()

  newPosition.lerpVectors(this.position, nextFrame.position, u)

  var newRotation = new THREE.Quaternion()
  THREE.Quaternion.slerp(this.rotation, nextFrame.rotation, newRotation, u)

  return new Frame(u, newPosition, newRotation)
}

/**
 * Returns the string representation of the frame.
 */
Frame.prototype.toString = function () {
    return "Keyframe: t -> " + this.t +
                   ", x ->" + this.position.x +
                   ", y ->" + this.position.y +
                   ", z ->" + this.position.z +
                   ", xa ->" + this.rotation.x +
                   ", ya ->" + this.rotation.y +
                   ", za ->" + this.rotation.z +
                   ", th ->" + this.rotation.w
};

/**
 * Handles animating the given scene.
 * @param scene - The scene to be render.
 * @param renderer - Three.js WebGL renderer.
 * @param duration - Time, in seconds, for the animation to occur.
 * @param animation - Function that modifies the scene for the animation.
 *                    Needs to take time as a parameter.
 */
function animate (scene, renderer, duration, animation) {

  var initialTime = Date.now()

  var render = function () {
    requestAnimationFrame( render )

    var t = (Date.now() - initialTime) / 1000

    // Stop animating once the duration has been reached
    if (t <= duration) {
      animation(t)
      renderer.render( scene, camera )
    }
  }

  render();
}
