import * as three from "three"

let camera = new three.PerspectiveCamera(70, innerWidth / innerHeight, 0.01, 10)
camera.position.z = 5

let scene = new three.Scene()

let mat = new three.MeshNormalMaterial()
let group = new three.Group()
group.add(
    new three.Mesh(
        new three.TorusGeometry(1, 0.1, 16, 128, Math.PI),
        mat
    )
)

scene.add(group)

let renderer = new three.WebGLRenderer({
    antialias: false
})
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)

function animate() {
    requestAnimationFrame(animate)

    group.rotation.z += 0.03

    renderer.render(scene, camera)
}

animate()