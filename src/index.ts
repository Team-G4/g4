import { WGLRenderer } from "./renderer/webgl/webgl"
import { Canvas2DRenderer } from "./renderer/canvas2D/canvas2D"
import { TestMode } from "./game/mode/mode"
import { Cannon } from "./game/level/cannon"
import { MouseInputMethod } from "./input/mouse"
import { Game } from "./game/game"

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

let input = new MouseInputMethod(c2dRenderer.domElement)

let game = new Game()

game.mode = mode
game.level = level
game.addInput(input)
