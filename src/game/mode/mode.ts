import { IPrimitive, BallPrimitive } from "../level/primitives";
import { Level } from "../level/level";
import { Ring } from "../level/ring";
import { Cannon, Bullet } from "../level/cannon";
import { generateLegacyRing, LegacyRingType, LegacyRingDifficulty } from "../generator/legacy"

/**
 * The material structure used by the rendering system.
 */
export type PrimitiveMaterial = {
    color: string
    // More properties added when required
}

/**
 * Represents a game mode
 */
export interface IMode {
    modeID: string
    isMaterialDynamic: boolean

    getMaterial: (prim: IPrimitive) => PrimitiveMaterial
    getBulletMaterial: (bullet: Bullet) => PrimitiveMaterial

    generateLevel: (index: number) => Level

    advance: (level: Level, dTime: number) => void
}

export class TestMode implements IMode {
    public modeID = "g48_test"
    public isMaterialDynamic = true
    public goldenAngle = (3 - Math.sqrt(5)) / 2

    public time = 0

    getMaterial(prim: IPrimitive): PrimitiveMaterial {
        let count = prim.ring.items.length
        let index = prim.ring.items.indexOf(prim)

        let color = "blue"

        if (prim instanceof Cannon) color = "black"

        return {
            color
        }
    }

    getBulletMaterial(bullet: Bullet): PrimitiveMaterial {
        let color = "red"

        return {
            color
        }
    }

    generateLevel(index: number): Level {
        let level = new Level(this, index)

        let ring = new Ring(
            level, 1, 0, 0, 0, null
        )
        
        ring.add(
            ...generateLegacyRing(
                ring, LegacyRingType.typeA, LegacyRingDifficulty.hard, 200
            )
        )

        level.add(ring)

        let cannonRing = new Ring(
            level, 0, 0, 0, 0, null
        )

        ring.add(
            new Cannon(
                ring, 0, 50, 0, -1.5
            ),
            new Cannon(
                ring, 0.5, 50, 0, -1.5
            )
        )

        level.add(cannonRing)

        return level
    }

    advance(level: Level, dTime: number) {
        this.time += dTime * 50

        level.advance(dTime)
    }
}