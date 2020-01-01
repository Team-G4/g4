import { WGLRenderer } from "./renderer/webgl/webgl"
import { Level } from "./game/level/level"
import { Ring } from "./game/level/ring"
import { BallPrimitive, BarPrimitive } from "./game/level/primitives"
import { Canvas2DRenderer } from "./renderer/canvas2D/canvas2D"
import { IRenderer } from "./renderer/renderer"
import { Polygon, PolygonSymmetryType } from "./game/generator/polygon"

let level = new Level()

let ring = new Ring(
    1, 0, 0, 0, null
)

ring.add(
    ...new Polygon(7).symmetry(
        PolygonSymmetryType.centerPointSymmetry
    ).angles.map((angle, i) => new BallPrimitive(
        ring, angle, 200, (i % 2) ? 50 : 30
    ))
)
ring.add(
    new BarPrimitive(
        ring, 0.25, 0.1, 200, 10
    )
)

level.add(ring)

let c2dRenderer = new Canvas2DRenderer()
c2dRenderer.initLevel(level)

c2dRenderer.updateSize(600, 600)

c2dRenderer.domElement.style.position = "fixed"
c2dRenderer.domElement.style.top = "0"
c2dRenderer.domElement.style.left = "0"
document.body.appendChild(
    c2dRenderer.domElement
)

c2dRenderer.render(0)

addEventListener("mousemove", (e) => {
    let hit = level.hitTest(
        e.clientX - 300,
        e.clientY - 300,
        10
    )
    console.log(hit)

    document.body.style.background = hit ? "#acf" : "white"
})