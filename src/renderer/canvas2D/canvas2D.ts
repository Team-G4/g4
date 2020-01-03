import { Level } from "../../game/level/level";
import { IVisualRenderer } from "../renderer";
import { Canvas2DRasterizer, ICanvas2DRasterizedPrimitive, Canvas2DRasterizedLevel } from "./rasterizer";
import { IMode } from "../../game/mode/mode";
import { BeatingHeart } from "../../util/heart";

export class Canvas2DRenderer implements IVisualRenderer {
    public canvas = document.createElement("canvas")
    public ctx = this.canvas.getContext("2d")

    public rasterizer = new Canvas2DRasterizer()

    public level: Level
    public rasterizedLevel: Canvas2DRasterizedLevel

    public heart = new BeatingHeart()

    // Spare the poor constructor
    // has it done anything to you
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
        this.rasterizedLevel = this.rasterizer.rasterize(level.mode, level) as Canvas2DRasterizedLevel
    }

    render(timestamp: DOMHighResTimeStamp) {
        let dTime = this.heart.beat(timestamp)

        this.level.mode.advance(this.level, dTime)
        this.rasterizedLevel.update(this.level.mode.isMaterialDynamic)

        this.ctx.clearRect(
            -this.canvas.width / 2,
            -this.canvas.height / 2,
            this.canvas.width,
            this.canvas.height
        )
        
        this.rasterizedLevel.path.render(this.ctx)
    }
}