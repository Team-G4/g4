import { Level } from "../../game/level/level";
import { IRenderer } from "../renderer";
import { Canvas2DRasterizer, ICanvas2DRasterizedPrimitive, Canvas2DRasterizedLevel } from "./rasterizer";

export class Canvas2DRenderer implements IRenderer {
    public canvas = document.createElement("canvas")
    public ctx = this.canvas.getContext("2d")

    public rasterizer = new Canvas2DRasterizer()

    public level: Level
    public rasterizedLevel: Canvas2DRasterizedLevel

    constructor() {
    }

    get domElement(): HTMLCanvasElement {
        return this.canvas
    }

    updateSize(w: number, h: number) {
        this.canvas.width = w
        this.canvas.height = h

        this.ctx.resetTransform()
        this.ctx.translate(w / 2, h / 2)
    }

    initLevel(level: Level) {
        this.level = level
        this.rasterizedLevel = this.rasterizer.rasterize(level) as Canvas2DRasterizedLevel
    }

    render(timestamp: DOMHighResTimeStamp) {
        this.level.advance(1/300)
        this.rasterizedLevel.update()

        this.ctx.clearRect(
            -this.canvas.width / 2,
            -this.canvas.height / 2,
            this.canvas.width,
            this.canvas.height
        )
        
        this.ctx.fill(
            this.rasterizedLevel.path2d
        )
    }
}