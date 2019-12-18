import * as three from "three"
import { Ring } from "./game/level/ring"
import { BallPrimitive, BarPrimitive } from "./game/level/primitives"

let camera = new three.PerspectiveCamera(70, innerWidth / innerHeight, 0.01, 10)
camera.position.z = 3

let scene = new three.Scene()

let mat = new three.MeshNormalMaterial()
let group = new three.Group()

let ring = new Ring()

let ball1 = new BallPrimitive(ring, 0, 1, 0.35)
let ball1o = new three.Mesh(
    ball1.threeGeometry, mat
)
group.add(ball1o)
ball1.threeObject = ball1o
ring.add(ball1)

let ball2 = new BallPrimitive(ring, 0.5, 1, 0.35)
let ball2o = new three.Mesh(
    ball2.threeGeometry, mat
)
group.add(ball2o)
ball2.threeObject = ball2o
ring.add(ball2)

let bar1 = new BarPrimitive(ring, 0, 0.33, 1, 0.08)
let bar1o = new three.Mesh(
    bar1.threeGeometry, mat
)
group.add(bar1o)
bar1.threeObject = bar1o
ring.add(bar1)

let bar2 = new BarPrimitive(ring, 0.5, 0.25, 1, 0.08)
let bar2o = new three.Mesh(
    bar2.threeGeometry, mat
)
group.add(bar2o)
bar2.threeObject = bar2o
ring.add(bar2)

scene.add(group)

let renderer = new three.WebGLRenderer({
    antialias: true
})
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)

function animate() {
    requestAnimationFrame(animate)

    ring.refreshThreeObject()

    ring.advance(1/300)

    renderer.render(scene, camera)
}

animate()