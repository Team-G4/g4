import { Ring } from "./ring";
import { Group } from "three";
import { SerializedPrimitive, IPrimitive } from "./primitives";
import { IMode } from "../mode/mode";
import { Bullet, Cannon } from "./cannon";

/**
 * The level structure
 */
export class Level {
    /**
     * The level construct ("rings")
     */
    public rings: Ring[] = []
    /**
     * An array of bullets present on the board
     */
    public bullets: Bullet[] = []
    
    constructor(
        public mode: IMode,
        public index: number
    ) {}

    /**
     * Add ring(s) to the construct
     * @param ring - rings to be added
     */
    add(...rings: Ring[]) {
        this.rings.push(...rings)
    }

    serialize(): SerializedPrimitive {
        return {
            type: "Level",

            rings: this.rings.map(item => item.serialize())
        }
    }

    /**
     * Advance the level structure in time
     * @param dTime - the time step
     */
    advance(dTime: number) {
        this.rings.forEach(r => r.advance(dTime))
        this.bullets.forEach(b => b.advance(dTime))
    }

    /**
     * Check for collision between the level construct and a ball/bullet
     * @param x - the X coordinate of the ball
     * @param y - the Y coordinate of the ball
     * @param bulletRadius - the radius of the ball
     */
    hitTest(x: number, y: number, bulletRadius = 0): IPrimitive {
        for (let ring of this.rings) {
            let hit = ring.hitTest(x, y, bulletRadius)
            if (hit) return hit
        }

        return null
    }

    /**
     * Test for collision with all bullets present on the board
     */
    isBulletColliding(): IPrimitive {
        for (let bullet of this.bullets) {
            let collision = this.hitTest(
                bullet.x, bullet.y, bullet.radius
            )
            if (collision) return collision
        }

        return null
    }

    /**
     * Test whether all bullets have escaped the construct (win condition)
     */
    areBulletsOutside(): boolean {
        if (!this.bullets.length) return false

        let levelSpan = this.getSpan()
        return this.bullets.every(bullet => {
            let distance = Math.hypot(bullet.x, bullet.y)

            return distance > (levelSpan + 10)
        })
    }

    findPrimitivesInRing(type: Function, ring: Ring): IPrimitive[] {
        return [
            ...ring.items.filter(
                i => i instanceof Ring
            ).map(
                r => this.findPrimitivesInRing(type, r as Ring)
            ),

            ...ring.items.filter(
                i => i instanceof type
            )
        ].flat()
    }

    findPrimitives(type: Function): IPrimitive[] {
        return this.rings.map(r => this.findPrimitivesInRing(type, r)).flat()
    }

    /**
     * Shoot bullets out of every cannon
     */
    shoot() {
        if (this.bullets.length) return

        let cannons = this.findPrimitives(Cannon) as Cannon[]

        this.bullets.push(
            ...cannons.map(c => c.shoot())
        )
    }

    getSpan(): number {
        return Math.max(
            ...this.rings.map(r => r.getSpan())
        )
    }
}