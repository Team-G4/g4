import { Object3D, SphereGeometry, Geometry, TorusGeometry, Mesh, Material } from "three"
import { Ring } from "./ring"

type SerializedPrimitiveValue = number | boolean | string | SerializedPrimitiveObject

type SerializedPrimitiveObject = {
    [prop: string]: SerializedPrimitiveValue
}

type SerializedPrimitive = {
    type: string,
    [prop: string]: SerializedPrimitiveValue
}

export interface IPrimitive {
    serialize: () => SerializedPrimitive

    advance: (dTime: number) => void
}

export class BallPrimitive implements IPrimitive {
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
}

export class BarPrimitive implements IPrimitive {
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
}