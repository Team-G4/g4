import { Object3D, SphereGeometry, Geometry, TorusGeometry, Mesh, Material } from "three"
import { Ring } from "./ring"

type SerializedPrimitiveValue = number | boolean | string | SerializedPrimitiveObject | SerializedPrimitiveValue[]

type SerializedPrimitiveObject = {
    [prop: string]: SerializedPrimitiveValue
}

export type SerializedPrimitive = {
    type: string,
    [prop: string]: SerializedPrimitiveValue
}

export interface IPrimitive {
    ring: Ring

    serialize: () => SerializedPrimitive

    advance: (dTime: number) => void
    hitTest: (x: number, y: number, bulletRadius: number) => IPrimitive
}

export function isIPrimitive(o: any): o is IPrimitive {
    return "ring" in o
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

    hitTest(x: number, y: number, bulletRadius = 0): IPrimitive {
        let ballPos = this.ballPosition

        if (
            Math.hypot(ballPos.x - x, ballPos.y - y) < (bulletRadius + this.ballRadius)
        ) {
            return this
        }
        return null
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

    hitTest(x: number, y: number, bulletRadius = 0): IPrimitive {
        x -= this.ring.centerX
        y -= this.ring.centerY

        let angle = Math.atan2(y, x) / (2 * Math.PI)
        if (angle < 0) angle += 1

        let startAngle = this.angle % 1
        if (startAngle < 0) startAngle++
        let endAngle = (startAngle + this.length) % 1
        if (endAngle < 0) endAngle++

        let mightCollide = false

        if (endAngle >= startAngle) {
            mightCollide = angle >= startAngle && angle <= endAngle
        } else {
            mightCollide = angle >= startAngle || angle <= endAngle
        }

        if (!mightCollide) return null

        if (
            Math.abs(Math.hypot(x, y) - this.distance) < (this.barRadius + bulletRadius)
        ) {
            return this
        }

        return null
    }
}