import { WGLRenderer } from "./renderer/webgl/webgl"
import { Level } from "./game/level/level"
import { Ring } from "./game/level/ring"
import { BallPrimitive, BarPrimitive } from "./game/level/primitives"
import { Canvas2DRenderer } from "./renderer/canvas2D/canvas2D"
import { IRenderer } from "./renderer/renderer"

let level = new Level()

let ring = new Ring(
    1, 0, 0, 0, null
)

let ring2 = new Ring(
    1, 200, 1, 0, ring
)
ring2.add(
    new BarPrimitive(
        ring2, 0, 1, 80, 5
    )
)
ring.add(ring2)

let ring3 = new Ring(
    -1.5, 80, 3, 0, ring2
)
ring3.add(
    new BallPrimitive(
        ring3, 0, 40, 10
    ),
    new BallPrimitive(
        ring3, 0.25, 40, 10
    ),
    new BallPrimitive(
        ring3, 0.5, 40, 10
    ),
    new BallPrimitive(
        ring3, 0.75, 40, 10
    )
)
ring2.add(ring3)

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

let c2dRenderer = new WGLRenderer()
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