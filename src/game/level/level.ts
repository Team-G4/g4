import { Ring } from "./ring";
import { Group } from "three";
import { SerializedPrimitive, IPrimitive } from "./primitives";
import { IMode } from "../mode/mode";
import { Bullet } from "./cannon";

export class Level {
    public rings: Ring[] = []
    public bullets: Bullet[] = []
    
    constructor(
        public mode: IMode,
        public index: number
    ) {}

    add(...ring: Ring[]) {
        this.rings.push(...ring)
    }

    serialize(): SerializedPrimitive {
        return {
            type: "Level",

            rings: this.rings.map(item => item.serialize())
        }
    }

    advance(dTime: number) {
        this.rings.forEach(r => r.advance(dTime))
    }

    hitTest(x: number, y: number, bulletRadius = 0): IPrimitive {
        for (let ring of this.rings) {
            let hit = ring.hitTest(x, y, bulletRadius)
            if (hit) return hit
        }

        return null
    }

    testBulletCollision(): IPrimitive {
        for (let bullet of this.bullets) {
            let collision = this.hitTest(
                bullet.x, bullet.y, bullet.radius
            )
            if (collision) return collision
        }

        return null
    }
}