import { IPrimitive, SerializedPrimitive } from "./primitives";
import { Ring } from "./ring";

/**
 * A buller
 */
export class Bullet {
    /**
     * Creates a bullet
     * @param x - the X coordinate of the bullet
     * @param y - the Y coordinate of the bullet
     * @param vX - the X component of bullet velocity
     * @param vY - the Y component of bullet velocity
     */
    constructor(
        public x: number,
        public y: number,
        public vX = 0,
        public vY = 0
    ) {}
}

/**
 * A cannon
 */
export class Cannon implements IPrimitive {
    /**
     * Creates a cannon
     * @param ring - the parent ring
     * @param angle - the initial position on the ring <0-1>
     * @param distance - the distance to the center of the ring
     * @param rotation - the rotation of the cannon
     * @param rotationFrequency - the frequency of the cannon rotation
     */
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