import { IPrimitive, SerializedPrimitive } from "./primitives";
import { Ring } from "./ring";

export class Bullet {
    constructor(
        public x: number,
        public y: number,
        public vX = 0,
        public vY = 0
    ) {}
}

export class Cannon implements IPrimitive {
    constructor(
        public ring: Ring,
        public angle: number,
        public distance: number,
        public rotation = 0,
        public rotationFrequency = 1
    ) {}

    get position() {
        return {
            x: this.ring.centerX + Math.cos(this.angle * Math.PI * 2) * this.distance,
            y: this.ring.centerY + Math.sin(this.angle * Math.PI * 2) * this.distance
        }
    }

    serialize(): SerializedPrimitive {
        return {
            type: "Cannon",

            angle: this.angle,
            distance: this.distance,

            rotation: this.rotation,
            rotationFrequency: this.rotationFrequency
        }
    }

    advance(dTime: number) {
        this.angle += dTime
        this.rotation += dTime * this.rotationFrequency
    }

    hitTest(x: number, y: number, bulletRadius: number): IPrimitive {
        return null
    }
}