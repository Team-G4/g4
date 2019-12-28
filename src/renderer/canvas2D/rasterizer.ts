import { IRasterizer, IRasterizedPrimitive, Rasterizable } from "../rasterizer";
import { BallPrimitive, BarPrimitive } from "../../game/level/primitives";
import { Level } from "../../game/level/level";
import { Ring } from "../../game/level/ring";

export interface ICanvas2DRasterizedPrimitive extends IRasterizedPrimitive {
    path2d: Path2D
}

export class Canvas2DRasterizedBallPrimitive implements ICanvas2DRasterizedPrimitive {
    public path2d: Path2D

    constructor(
        rasterizer: Canvas2DRasterizer,
        public ball: BallPrimitive
    ) {}

    update() {
        let path = new Path2D()

        let {x, y} = this.ball.ballPosition

        path.arc(
            x, y,
            this.ball.ballRadius,
            0, 2 * Math.PI
        )

        this.path2d = path
    }
}

export class Canvas2DRasterizedBarPrimitive implements ICanvas2DRasterizedPrimitive {
    public path2d: Path2D

    constructor(
        rasterizer: Canvas2DRasterizer,
        public bar: BarPrimitive
    ) {}

    update() {
        let path = new Path2D()

        path.arc(
            this.bar.ring.centerX, this.bar.ring.centerY,
            this.bar.distance + this.bar.barRadius,
            2 * Math.PI * this.bar.angle - 0.01,
            2 * Math.PI * (this.bar.angle + this.bar.length) + 0.01
        )
        path.arc(
            this.bar.ring.centerX, this.bar.ring.centerY,
            this.bar.distance - this.bar.barRadius,
            2 * Math.PI * (this.bar.angle + this.bar.length) + 0.01,
            2 * Math.PI * this.bar.angle - 0.01,
            true
        )

        this.path2d = path
    }
}

export class Canvas2DRasterizedRing implements ICanvas2DRasterizedPrimitive {
    public path2d: Path2D

    public items: ICanvas2DRasterizedPrimitive[]

    constructor(
        rasterizer: Canvas2DRasterizer,
        public ring: Ring
    ) {
        this.items = this.ring.items.map(item => rasterizer.rasterize(item))
    }

    update() {
        let path = new Path2D()
        
        this.items.forEach(item => {
            item.update()
            path.addPath(item.path2d)
        })

        this.path2d = path
    }
}

export class Canvas2DRasterizedLevel implements ICanvas2DRasterizedPrimitive {
    public path2d: Path2D

    public rings: Canvas2DRasterizedRing[]

    constructor(
        rasterizer: Canvas2DRasterizer,
        public level: Level
    ) {
        this.rings = this.level.rings.map(ring => new Canvas2DRasterizedRing(rasterizer, ring))
    }

    update() {
        let path = new Path2D()
        
        this.rings.forEach(ring => {
            ring.update()
            path.addPath(ring.path2d)
        })

        this.path2d = path
    }
}

export class Canvas2DRasterizer implements IRasterizer {
    rasterize(prim: Rasterizable): ICanvas2DRasterizedPrimitive {
        if (prim instanceof BallPrimitive) {
            return new Canvas2DRasterizedBallPrimitive(this, prim)
        } else if (prim instanceof BarPrimitive) {
            return new Canvas2DRasterizedBarPrimitive(this, prim)
        } else if (prim instanceof Ring) {
            return new Canvas2DRasterizedRing(this, prim)
        } else if (prim instanceof Level) {
            return new Canvas2DRasterizedLevel(this, prim)
        }

        return null
    }
}