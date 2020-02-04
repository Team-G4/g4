import { WGLRenderer } from "./renderer/webgl/webgl"
import { Canvas2DRenderer } from "./renderer/canvas2D/canvas2D"
import { TestMode } from "./game/mode/mode"
import { Cannon } from "./game/level/cannon"
import { MouseInputMethod } from "./input/mouse"
import { Game } from "./game/game"

let mode = new TestMode()

let game = new Game()

game.mode = mode

let c2dRenderer = new Canvas2DRenderer()

game.setRasterizer(c2dRenderer)

let input = new MouseInputMethod(c2dRenderer.domElement)
game.addInput(input)

c2dRenderer.updateSize(600, 600)

c2dRenderer.domElement.style.position = "fixed"
c2dRenderer.domElement.style.top = "0"
c2dRenderer.domElement.style.left = "0"
document.body.appendChild(
    c2dRenderer.domElement
)

let render = async (timestamp: DOMHighResTimeStamp) => {
    await game.advanceAndRender(timestamp)

    requestAnimationFrame(render)
}



game.generateLevel(0).then(() => {
    requestAnimationFrame(render)
})
