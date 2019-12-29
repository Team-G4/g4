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
    ).angles.map(angle => new BallPrimitive(
        ring, angle, 200, 30
    ))
)

level.add(ring)

let c2dRenderer = new Canvas2DRenderer()
c2dRenderer.initLevel(level)

c2dRenderer.updateSize(600, 600)

document.body.appendChild(
    c2dRenderer.domElement
)

function animate(timestamp: DOMHighResTimeStamp) {
    requestAnimationFrame(animate)
    
    c2dRenderer.render(timestamp)
}

requestAnimationFrame(animate)