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
* Extracts the keyframe data and creates a linkedlist of keyframes.
* Also launches the animation once the keyframes have been extracted.
* @param file - The keyframe file to load.
*/
function loadKeyframes(file) {
  // Make sure the browser supports FileReader
  if (typeof FileReader !== "undefined") {
    var reader = new FileReader();
    reader.onload = function (evt) {
      // Each file has the form:
      // t x y z xa ya za theta
      // 0 1 2 3  4  5  6     7
      temp = this.result.split("\n")
      // Iterate over every line in the file and add it to our keyframes list
      for (line in temp) {
        var lineSplit = temp[line].trim().split(/\s+/)
        try {
          // Set the time of the keyframe
          var t = parseInt(lineSplit[0])

          // Create the poition portion of our frame as vector
          var position = new THREE.Vector3(parseInt(lineSplit[1]),
          parseInt(lineSplit[2]),
          parseInt(lineSplit[3]))

          // Create the rotation portion of our frame as a quaternion
          var rotation = new THREE.Quaternion()
          rotation.setFromAxisAngle(new THREE.Vector3(parseInt(lineSplit[4]),
          parseInt(lineSplit[5]),
          parseInt(lineSplit[6])),
          THREE.Math.degToRad(parseInt(lineSplit[7])))
          // Only use normalize quaternions
          rotation.normalize()
          var frame = new Frame(t, position, rotation)

          // If the list is empty this frame is at the head
          if(keyframe == null) {
            keyframe = frame
            // Else add it to the back of the list
          } else {
            keyframe.push(frame)
          }
        }catch(err) {
          // Given a line that doesn't match the keyframe syntax
          console.log(err.message)
        }
      }
      // Initialize the frames for animation
      currentFrame = keyframe

      // Begin animation
      animate(scene, renderer, keyframe.getLast().t, animation)
    }
    reader.readAsText(file)
  }
}

/**
* Handles animating the given scene.
* @param scene - The scene to be render.
* @param renderer - Three.js WebGL renderer.
* @param duration - Time, in seconds, for the animation to occur.
* @param animation - Function that modifies the scene for the animation.
*                    Needs to take time as a parameter.
*/
function animate (scene, renderer, duration, animation) {

  var clock = new THREE.Clock()

  var render = function () {
    requestAnimationFrame( render )

    var t = clock.getElapsedTime()

    // Stop animating once the duration has been reached
    if (t <= duration) {
      animation(t)
      renderer.render( scene, camera )
    } else {
      clock.stop()
    }
  }

  render();
}
