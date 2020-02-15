import { IPrimitive } from "../level/primitives/primitives"
import { Level } from "../level/level"
import { Ring } from "../level/ring"
import { Cannon, Bullet } from "../level/cannon"
import { generateLegacyRing, LegacyRingType, LegacyRingDifficulty, getLegacyDifficulties, generateBasicLegacyRings } from "../generator/legacy"
import { BarPrimitive } from "../level/primitives/bar"
import { BallPrimitive } from "../level/primitives/ball"
import { exponentEasing, compositeEasing, inverseEasing, constantEasing, compoundEasing, linearEasing, biExponentEasing, remapEasing } from "../../animation/easing"
import { Color } from "../../util/color"

/**
 * The material structure used by the rendering system.
 */
export type PrimitiveMaterial = {
    color: string;
    // More properties added when required
}

export type ModeThemeColors = {
    background: string;
    dim: string;
    spotlight: string;

    foreground: string;
    accent: string;
    secondaryAccent: string;
}

/**
 * Represents a game mode
 */
export interface IMode {
    modeID: string;

    isThemeDynamic: boolean;
    getThemeColors: (level: Level) => ModeThemeColors;

    isMaterialDynamic: boolean;
    getMaterial: (prim: IPrimitive) => PrimitiveMaterial;
    getBulletMaterial: (bullet: Bullet) => PrimitiveMaterial;

    generateLevel: (index: number) => Level;

    advance: (level: Level, dTime: number) => void;
}

export class TestMode implements IMode {
    public modeID = "g48_test"
    public isMaterialDynamic = false
    public isThemeDynamic = true
    public goldenAngle = (3 - Math.sqrt(5)) / 2

    public time = 0

    public easing = compositeEasing(
        compoundEasing(
            biExponentEasing(5),
            compositeEasing(biExponentEasing(5), inverseEasing, remapEasing(-1, 0))
        ),
        remapEasing(0, 2)
    )

    getThemeColors(level: Level): ModeThemeColors {
        return {
            background: "#1A2320",
            dim: "#151918",
            spotlight: "#202E22",

            foreground: "#F0EFE0",
            accent: "#CAEC12",
            secondaryAccent: "#52CF12"
        }
    }

    getMaterial(prim: IPrimitive): PrimitiveMaterial {
        const colors = this.getThemeColors(prim.ring.level)

        let color = colors.accent

        if (prim instanceof Cannon) color = colors.foreground
        else if (prim instanceof BarPrimitive) color = colors.secondaryAccent

        return {
            color
        }
    }

    getBulletMaterial(bullet: Bullet): PrimitiveMaterial {
        const colors = this.getThemeColors(
            bullet.source.ring.level
        )

        return {
            color: colors.foreground
        }
    }

    generateLevel(index: number): Level {
        const level = new Level(this, index)

        const difficulties = getLegacyDifficulties(index)

        console.log(difficulties)
        level.add(
            ...generateBasicLegacyRings(
                level, difficulties
            )
        )

        const cannonRing = new Ring(
            level, 1, 0, 0, 0, null
        )

        cannonRing.add(
            new Cannon(
                cannonRing, 0, 0, 0, -1
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