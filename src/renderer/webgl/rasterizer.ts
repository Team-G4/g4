import { IRasterizer, IRasterizedPrimitive, Rasterizable } from "../rasterizer";
import { IPrimitive, BallPrimitive, BarPrimitive } from "../../game/level/primitives";

import { Material, Object3D, Mesh, SphereGeometry, Group, TorusGeometry, MeshBasicMaterial } from "three";
import { Ring } from "../../game/level/ring";
import { Level } from "../../game/level/level";
import { IMode, PrimitiveMaterial } from "../../game/mode/mode";

export interface IWGLRasterizedPrimitive extends IRasterizedPrimitive {
    threeObject: Object3D
}

export class WGLRasterizedBallPrimitive implements IWGLRasterizedPrimitive {
    public threeObject: Mesh = null
    
    constructor(
        rasterizer: WGLRasterizer,
        public ball: BallPrimitive,
        mode: IMode
    ) {
        this.createThreeObject(
            rasterizer.getMaterialFromPrimMat(
                mode.getMaterial(ball)
            )
        )
    }

    get threeGeometry() {
        return new SphereGeometry(
            this.ball.ballRadius, 24, 24
        )
    }

    createThreeObject(mat: Material) {
        this.threeObject = new Mesh(
            this.threeGeometry, mat
        )
    }

    update() {
        let {x, y} = this.ball.ballPosition

        this.threeObject.position.x = x
        this.threeObject.position.y = y
    }
}

export class WGLRasterizedBarPrimitive implements IWGLRasterizedPrimitive {
    public threeObject: Mesh = null
    
    constructor(
        rasterizer: WGLRasterizer,
        public bar: BarPrimitive,
        mode: IMode
    ) {
        this.createThreeObject(
            rasterizer.getMaterialFromPrimMat(
                mode.getMaterial(bar)
            )
        )
    }

    get threeGeometry() {
        return new TorusGeometry(
            this.bar.distance, this.bar.barRadius, 16, 256, Math.PI * 2 * this.bar.length
        )
    }

    createThreeObject(mat: Material) {
        this.threeObject = new Mesh(
            this.threeGeometry, mat
        )
    }

    update() {
        this.threeObject.position.x = this.bar.ring.centerX
        this.threeObject.position.y = this.bar.ring.centerY

        this.threeObject.rotation.z = 2 * Math.PI * this.bar.angle
    }
}

export class WGLRasterizedRing implements IWGLRasterizedPrimitive {
    public threeObject = new Group()

    public items: IWGLRasterizedPrimitive[]

    constructor(
        rasterizer: WGLRasterizer,
        public ring: Ring,
        mode: IMode
    ) {
        this.items = this.ring.items.map(item => rasterizer.rasterizePrimitive(mode, item))

        this.threeObject.add(
            ...this.items.map(item => item.threeObject)
        )
    }

    update() {
        this.items.forEach(item => item.update())
    }
}

export class WGLRasterizedLevel implements IWGLRasterizedPrimitive {
    public threeObject = new Group()

    public rings: WGLRasterizedRing[]

    constructor(
        rasterizer: WGLRasterizer,
        public level: Level,
        mode: IMode
    ) {
        this.rings = this.level.rings.map(ring => new WGLRasterizedRing(rasterizer, ring, mode))

        this.threeObject.add(
            ...this.rings.map(ring => ring.threeObject)
        )
    }

    update() {
        this.rings.forEach(ring => ring.update())
    }
}

export class WGLRasterizer implements IRasterizer {
    constructor(
        public mat: Material
    ) {}

    getMaterialFromPrimMat(pm: PrimitiveMaterial) {
        return new MeshBasicMaterial({
            color: pm.color
        })
    }

    rasterizePrimitive(mode: IMode, prim: Rasterizable): IWGLRasterizedPrimitive {
        if (prim instanceof BallPrimitive) {
            return new WGLRasterizedBallPrimitive(this, prim, mode)
        } else if (prim instanceof BarPrimitive) {
            return new WGLRasterizedBarPrimitive(this, prim, mode)
        } else if (prim instanceof Ring) {
            return new WGLRasterizedRing(this, prim, mode)
        } else if (prim instanceof Level) {
            return new WGLRasterizedLevel(this, prim, mode)
        }

        return null
    }
}