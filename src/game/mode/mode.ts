import { IPrimitive, BallPrimitive } from "../level/primitives";
import { Level } from "../level/level";
import { Ring } from "../level/ring";

export type PrimitiveMaterial = {
    color: string
}

export interface IMode {
    isMaterialDynamic: boolean

    getMaterial: (prim: IPrimitive) => PrimitiveMaterial

    generateLevel: (index: number) => Level

    advance: (level: Level, dTime: number) => void
}

export class TestMode implements IMode {
    public isMaterialDynamic = true
    public goldenAngle = (3 - Math.sqrt(5)) / 2

    public time = 0

    getMaterial(prim: IPrimitive): PrimitiveMaterial {
        let count = prim.ring.items.length
        let index = prim.ring.items.indexOf(prim)

        return {
            color: (Math.abs(index - Math.floor(this.time % count)) < 4) ? "yellow" : "black"
        }
    }

    generateLevel(index: number): Level {
        let level = new Level(this)

        let ring = new Ring(
            level, 1, 0, 0, 0, null
        )

        for (let i = 0; i <= 30; i++) {
            ring.add(
                new BallPrimitive(
                    ring, i * this.goldenAngle, 100 + i * 4, 10
                )
            )
        }

        level.add(ring)

        return level
    }

    advance(level: Level, dTime: number) {
        this.time += dTime * 50

        level.advance(dTime)
    }
}