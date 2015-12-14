function makeSphere(radius, texture) {
  var sphereGeometry = new THREE.SphereGeometry( radius, 32, 32 )
	var sphereTexture = new THREE.ImageUtils.loadTexture(texture)
	sphereTexture.minFilter = THREE.LinearFilter
	var sphereMaterial = new THREE.MeshPhongMaterial( {
		map: sphereTexture,
		specular: 0x222222,
		shininess: 100,
		shading: THREE.SmoothShading
	} )

	var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial )
	sphere.castShadow = true
	sphere.receieveShadow = true

  return sphere
}
