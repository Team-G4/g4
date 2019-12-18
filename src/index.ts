import { WGLRenderer } from "./renderer/webgl"
import { Level } from "./game/level/level"
import { Ring } from "./game/level/ring"
import { BallPrimitive, BarPrimitive } from "./game/level/primitives"
import { Canvas2DRenderer } from "./renderer/canvas2D"
import { IRenderer } from "./renderer/renderer"

let level = new Level()

let ring = new Ring(
    1, 0, 0, 0, null
)

ring.add(
    new BallPrimitive(
        ring, 0, 200, 50
    ),
    new BallPrimitive(
        ring, 0.3333, 200, 50
    ),
    new BallPrimitive(
        ring, 0.6666, 200, 50
    ),
    new BarPrimitive(
        ring, 0, 0.3333, 200, 10
    ),
    new BarPrimitive(
        ring, 0.5, 0.16666, 200, 10
    )
)

level.add(ring)

let wglRenderer = new WGLRenderer()
wglRenderer.initLevel(level)

wglRenderer.updateSize(innerWidth, innerHeight)

let c2dRenderer = new Canvas2DRenderer()
c2dRenderer.initLevel(level)

c2dRenderer.updateSize(innerWidth, innerHeight)


let renderer: IRenderer = c2dRenderer
document.body.appendChild(
    renderer.domElement
)

let switchBtn = document.createElement("button")
switchBtn.textContent = "Switch!"

switchBtn.addEventListener("click", () => {
    document.body.removeChild(renderer.domElement)

    if (renderer == c2dRenderer) {
        renderer = wglRenderer
    } else {
        renderer = c2dRenderer
    }

    document.body.insertBefore(
        renderer.domElement, switchBtn
    )
})

document.body.appendChild(switchBtn)

function animate(timestamp: DOMHighResTimeStamp) {
    requestAnimationFrame(animate)

    renderer.render(timestamp)
}

requestAnimationFrame(animate)