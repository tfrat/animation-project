

function makeParticle(size, color) {
  var geometry = new THREE.SphereGeometry( size, 32, 32 );
	var material = new THREE.PointsMaterial(
		{
			color: color,
			size: size
		}
	);
	return new THREE.Points( geometry, material );
}
