importScripts('../../js/three.min.js')

function updatePosition(pos, id, lifetimeRatio) {
  self.postMessage({'cmd' : 'update', 'id' : id,
                    'pos' : {'x' : pos.x, 'y' : pos.y, 'z' : pos.z},
                    'lifetimeRatio' : lifetimeRatio})
}

function log(message, id) {
  self.postMessage({'cmd' : 'message', 'id' : id, 'msg' : message})
}

self.addEventListener('message', function(e) {
  var clock = new THREE.Clock(true)

  var id = e.data.id
  var lifetime = e.data.lifetime
  var pos = new THREE.Vector3(e.data.pos.x, e.data.pos.y, e.data.pos.z)
  var vel = new THREE.Vector3(e.data.vel.x, e.data.vel.y, e.data.vel.z)

  //log('Loop started...', id)
  while( clock.getElapsedTime() <= lifetime) {

    var delta = clock.getDelta()
      if( delta != 0 ) {
          pos.addScaledVector(vel, delta)
          updatePosition(pos, id, (lifetime - clock.getElapsedTime())/lifetime)
    }
  }

  //log('Thread closing...', id)
  self.postMessage({'cmd':'terminate', 'id' : id})


})
