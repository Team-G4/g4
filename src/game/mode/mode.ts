import { IPrimitive } from "../level/primitives/primitives"
import { Level } from "../level/level"
import { Ring } from "../level/ring"
import { Cannon, Bullet } from "../level/cannon"
import { generateLegacyRing, LegacyRingType, LegacyRingDifficulty } from "../generator/legacy"
import { BarPrimitive } from "../level/primitives/bar"
import { BallPrimitive } from "../level/primitives/ball"
import { exponentEasing, compositeEasing, inverseEasing, constantEasing } from "../../animation/easing"

/**
 * The material structure used by the rendering system.
 */
export type PrimitiveMaterial = {
    color: string;
    // More properties added when required
}

/**
 * Represents a game mode
 */
export interface IMode {
    modeID: string;
    isMaterialDynamic: boolean;

    getMaterial: (prim: IPrimitive) => PrimitiveMaterial;
    getBulletMaterial: (bullet: Bullet) => PrimitiveMaterial;

    generateLevel: (index: number) => Level;

    advance: (level: Level, dTime: number) => void;
}

export class TestMode implements IMode {
    public modeID = "g48_test"
    public isMaterialDynamic = true
    public goldenAngle = (3 - Math.sqrt(5)) / 2

    public time = 0

    getMaterial(prim: IPrimitive): PrimitiveMaterial {
        const count = prim.ring.items.length
        const index = prim.ring.items.indexOf(prim)

        let color = "#CAEC12"

        if (prim instanceof Cannon) color = "#F0EFE0"
        else if (prim instanceof BarPrimitive) color = "#52CF12"

        return {
            color
        }
    }

    getBulletMaterial(bullet: Bullet): PrimitiveMaterial {
        const color = "#F0EFE0"

        return {
            color
        }
    }

    generateLevel(index: number): Level {
        const level = new Level(this, index)

        const ring = new Ring(
            level, 1, 0, 0, 0, null,
            constantEasing(0.4)
        )
        
        ring.add(
            ...generateLegacyRing(
                ring, LegacyRingType.typeA, LegacyRingDifficulty.hard, 200
            ).sort((prim1, prim2) => {
                const v1 = prim1 instanceof BallPrimitive ? 1 : 0
                const v2 = prim2 instanceof BallPrimitive ? 1 : 0
                return v1 - v2
            })
        )

        level.add(ring)

        const ring2 = new Ring(
            level,0.5, 0, 0, 0, null,
            compositeEasing(exponentEasing(5), inverseEasing)
        )
        
        ring2.add(
            ...generateLegacyRing(
                ring2, LegacyRingType.typeA, LegacyRingDifficulty.hard, 350
            ).sort((prim1, prim2) => {
                const v1 = prim1 instanceof BallPrimitive ? 1 : 0
                const v2 = prim2 instanceof BallPrimitive ? 1 : 0
                return v1 - v2
            })
        )

        level.add(ring2)

        const cannonRing = new Ring(
            level, 1, 0, 0, 0, null
        )

        cannonRing.add(
            new Cannon(
                cannonRing, 0, 0, 0, -1.5
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