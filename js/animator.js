function animate (scene, renderer, duration, animation) {

  var initialTime = Date.now()

  var render = function (duration) {
    requestAnimationFrame( render )

    var t = (Date.now() - initialTime) / 1000

    if (t <= duration) {
      animation(t)
      renderer.render( scene, camera )
    }
  }

  render(duration);
}
