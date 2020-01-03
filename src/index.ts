import { WGLRenderer } from "./renderer/webgl/webgl"
import { Level } from "./game/level/level"
import { Ring } from "./game/level/ring"
import { BallPrimitive, BarPrimitive } from "./game/level/primitives"
import { Canvas2DRenderer } from "./renderer/canvas2D/canvas2D"
import { IRenderer } from "./renderer/renderer"
import { Polygon, PolygonSymmetryType } from "./game/generator/polygon"
import { TestMode } from "./game/mode/mode"

let mode = new TestMode()

let level = mode.generateLevel(0)

let c2dRenderer = new Canvas2DRenderer()
c2dRenderer.initLevel(level)

c2dRenderer.updateSize(600, 600)

c2dRenderer.domElement.style.position = "fixed"
c2dRenderer.domElement.style.top = "0"
c2dRenderer.domElement.style.left = "0"
document.body.appendChild(
    c2dRenderer.domElement
)

let render = (timestamp: DOMHighResTimeStamp) => {
    c2dRenderer.render(timestamp)

    requestAnimationFrame(render)
}

requestAnimationFrame(render)

addEventListener("mousemove", (e) => {
    let hit = level.hitTest(
        e.clientX - 300,
        e.clientY - 300,
        10
    )
    console.log(hit)

    document.body.style.background = hit ? "#acf" : "white"
})