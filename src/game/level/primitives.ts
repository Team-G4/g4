import { Object3D, SphereGeometry, Geometry, TorusGeometry, Mesh, Material } from "three"
import { Ring } from "./ring"
import { IDrawable } from "../../renderer/drawable"

type SerializedPrimitiveValue = number | boolean | string | SerializedPrimitiveObject

type SerializedPrimitiveObject = {
    [prop: string]: SerializedPrimitiveValue
}

type SerializedPrimitive = {
    type: string,
    [prop: string]: SerializedPrimitiveValue
}

export interface IPrimitive extends IDrawable {
    serialize: () => SerializedPrimitive

    advance: (dTime: number) => void
}

export class BallPrimitive implements IPrimitive {
    public threeObject: Mesh = null

    constructor(
        public ring: Ring,
        public angle = 0,
        public distance = 0,
        public ballRadius = 0
    ) {}

    serialize() {
        return {
            type: "BallPrimitive",

            angle: this.angle,
            distance: this.distance,
            ballRadius: this.ballRadius
        }
    }

    advance(dTime: number) {
        this.angle += dTime
    }

    get ballPosition() {
        return {
            x: this.ring.centerX + Math.cos(this.angle * Math.PI * 2) * this.distance,
            y: this.ring.centerY + Math.sin(this.angle * Math.PI * 2) * this.distance
        }
    }

    get threeGeometry() {
        return new SphereGeometry(
            this.ballRadius, 24, 24
        )
    }

    createThreeObject(mat: Material) {
        this.threeObject = new Mesh(
            this.threeGeometry, mat
        )
        return this.threeObject
    }

    refreshThreeObject() {
        let {x, y} = this.ballPosition

        this.threeObject.position.x = x
        this.threeObject.position.y = y
    }

    get path2d() {
        let path = new Path2D()

        let {x, y} = this.ballPosition

        path.arc(
            x, y,
            this.ballRadius,
            0, 2 * Math.PI
        )

        return path
    }
}

export class BarPrimitive implements IPrimitive {
    public threeObject: Mesh = null

    constructor(
        public ring: Ring,
        public angle = 0,
        public length = 0,
        public distance = 0,
        public barRadius = 0
    ) {}

    serialize() {
        return {
            type: "BarPrimitive",

            angle: this.angle,
            length: this.length,

            distance: this.distance,
            barRadius: this.barRadius
        }
    }

    advance(dTime: number) {
        this.angle += dTime
    }

    get threeGeometry() {
        return new TorusGeometry(
            this.distance, this.barRadius, 16, 256, Math.PI * 2 * this.length
        )
    }

    createThreeObject(mat: Material) {
        this.threeObject = new Mesh(
            this.threeGeometry, mat
        )
        return this.threeObject
    }

    refreshThreeObject() {
        this.threeObject.position.x = this.ring.centerX
        this.threeObject.position.y = this.ring.centerY

        this.threeObject.rotation.z = 2 * Math.PI * this.angle
    }

    get path2d() {
        let path = new Path2D()

        path.arc(
            this.ring.centerX, this.ring.centerY,
            this.distance + this.barRadius,
            2 * Math.PI * this.angle - 0.01,
            2 * Math.PI * (this.angle + this.length) + 0.01
        )
        path.arc(
            this.ring.centerX, this.ring.centerY,
            this.distance - this.barRadius,
            2 * Math.PI * (this.angle + this.length) + 0.01,
            2 * Math.PI * this.angle - 0.01,
            true
        )

        return path
    }
}