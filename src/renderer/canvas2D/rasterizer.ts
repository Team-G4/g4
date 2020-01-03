import { IRasterizer, IRasterizedPrimitive, Rasterizable } from "../rasterizer";
import { BallPrimitive, BarPrimitive } from "../../game/level/primitives";
import { Level } from "../../game/level/level";
import { Ring } from "../../game/level/ring";
import { IMode, PrimitiveMaterial } from "../../game/mode/mode";
import { StyledPathGroup, StyledPath } from "./path";
import { Cannon } from "../../game/level/cannon";

export interface ICanvas2DRasterizedPrimitive extends IRasterizedPrimitive {
    /**
     * The styled path created after rasterization
     */
    path: StyledPathGroup | StyledPath
}

export class Canvas2DRasterizedBallPrimitive implements ICanvas2DRasterizedPrimitive {
    path: StyledPathGroup | StyledPath

    /**
     * Creates a rasterized ball
     * @param rasterizer - the Canvas2D rasterizer
     * @param ball - the ball primitive to rasterize
     * @param mode - the game mode
     */
    constructor(
        public rasterizer: Canvas2DRasterizer,
        public ball: BallPrimitive,
        public mode: IMode
    ) {}

    /**
     * Updates the rasterized ball every frame.
     * 
     * @param deepUpdate - doesn't affect the Canvas renderer
     */
    update(deepUpdate: boolean) {
        let path = new Path2D()

        let {x, y} = this.ball.ballPosition

        path.arc(
            x, y,
            this.ball.ballRadius,
            0, 2 * Math.PI
        )

        this.path = new StyledPath(
            path, this.rasterizer.getStyleFromPrimMat(
                this.mode.getMaterial(this.ball)
            )
        )
    }
}

export class Canvas2DRasterizedBarPrimitive implements ICanvas2DRasterizedPrimitive {
    path: StyledPathGroup | StyledPath

    /**
     * Creates a rasterized bar
     * @param rasterizer - the Canvas2D rasterizer
     * @param bar - the bar primitive to rasterize
     * @param mode - the game mode
     */
    constructor(
        public rasterizer: Canvas2DRasterizer,
        public bar: BarPrimitive,
        public mode: IMode
    ) {}

    /**
     * Updates the rasterized bar every frame.
     * 
     * @param deepUpdate - doesn't affect the Canvas renderer
     */
    update(deepUpdate: boolean) {
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

        this.path = new StyledPath(
            path, this.rasterizer.getStyleFromPrimMat(
                this.mode.getMaterial(this.bar)
            )
        )
    }
}

export class Canvas2DRasterizedRing implements ICanvas2DRasterizedPrimitive {
    public path: StyledPathGroup

    /**
     * An array of rasterized prims and other objects
     */
    public items: ICanvas2DRasterizedPrimitive[]

    /**
     * Creates a rasterized ring
     * @param rasterizer - the Canvas2D rasterizer
     * @param ring - the ring to rasterize
     * @param mode - the game mode
     */
    constructor(
        rasterizer: Canvas2DRasterizer,
        public ring: Ring,
        mode: IMode
    ) {
        this.items = this.ring.items.map(item => rasterizer.rasterize(mode, item))
    }

    /**
     * Updates the rasterized ring every frame.
     * 
     * @param deepUpdate - doesn't affect the Canvas renderer
     */
    update(deepUpdate: boolean) {
        let path = new StyledPathGroup()
        
        this.items.forEach(item => {
            item.update(deepUpdate)
            path.addPath(item.path)
        })

        this.path = path
    }
}

export class Canvas2DRasterizedLevel implements ICanvas2DRasterizedPrimitive {
    public path: StyledPathGroup

    /**
     * An array of rasterized rings
     */
    public rings: Canvas2DRasterizedRing[]

    /**
     * Creates a rasterized level
     * @param rasterizer - the Canvas2D rasterizer
     * @param level - the level to rasterize
     * @param mode - the game mode
     */
    constructor(
        rasterizer: Canvas2DRasterizer,
        public level: Level,
        mode: IMode
    ) {
        this.rings = this.level.rings.map(ring => new Canvas2DRasterizedRing(rasterizer, ring, mode))
    }

    /**
     * Updates the rasterized level every frame.
     * 
     * @param deepUpdate - doesn't affect the Canvas renderer
     */
    update(deepUpdate: boolean) {
        let path = new StyledPathGroup()
        
        this.rings.forEach(ring => {
            ring.update(deepUpdate)
            path.addPath(ring.path)
        })

        this.path = path
    }
}

export class Canvas2DRasterizedCannon implements ICanvas2DRasterizedPrimitive {
    path: StyledPathGroup | StyledPath

    /**
     * Creates a rasterized cannon
     * @param rasterizer - the Canvas2D rasterizer
     * @param cannon - the cannon to rasterize
     * @param mode - the game mode
     */
    constructor(
        public rasterizer: Canvas2DRasterizer,
        public cannon: Cannon,
        public mode: IMode
    ) {}

    /**
     * Updates the rasterized cannon every frame.
     * 
     * @param deepUpdate - doesn't affect the Canvas renderer
     */
    update(deepUpdate: boolean) {
        let path = new Path2D()

        let {x, y} = this.cannon.position
        let angle = this.cannon.rotation * Math.PI * 2

        path.moveTo(
            x + Math.cos(angle) * 20,
            y + Math.sin(angle) * 20
        )
        path.lineTo(
            x + Math.cos(Math.PI - 0.8 + angle) * 20,
            y + Math.sin(Math.PI - 0.8 + angle) * 20
        )
        path.lineTo(
            x + Math.cos(Math.PI + angle) * 8,
            y + Math.sin(Math.PI + angle) * 8
        )
        path.lineTo(
            x + Math.cos(Math.PI + 0.8 + angle) * 20,
            y + Math.sin(Math.PI + 0.8 + angle) * 20
        )

        this.path = new StyledPath(
            path, this.rasterizer.getStyleFromPrimMat(
                this.mode.getMaterial(this.cannon)
            )
        )
    }
}

export class Canvas2DRasterizer implements IRasterizer {
    /**
     * Converts the provided PrimitiveMaterial to a single color
     * @param pm - the PrimitiveMaterial object
     * @returns a CSS color
     */
    getStyleFromPrimMat(pm: PrimitiveMaterial) {
        return pm.color
    }

    /**
     * Rasterizes an object
     * @param mode - the current game mode
     * @param prim - the Rasterizable object to rasterize
     * @returns a rasterized primitive
     */
    rasterize(mode: IMode, prim: Rasterizable): ICanvas2DRasterizedPrimitive {
        if (prim instanceof BallPrimitive) {
            return new Canvas2DRasterizedBallPrimitive(this, prim, mode)
        } else if (prim instanceof BarPrimitive) {
            return new Canvas2DRasterizedBarPrimitive(this, prim, mode)
        } else if (prim instanceof Ring) {
            return new Canvas2DRasterizedRing(this, prim, mode)
        } else if (prim instanceof Level) {
            return new Canvas2DRasterizedLevel(this, prim, mode)
        } else if (prim instanceof Cannon) {
            return new Canvas2DRasterizedCannon(this, prim, mode)
        }

        return null
    }
}