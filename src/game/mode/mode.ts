import { IPrimitive } from "../level/primitives/primitives"
import { Level } from "../level/level"
import { Ring } from "../level/ring"
import { Cannon, Bullet } from "../level/cannon"
import { generateLegacyRing, LegacyRingType, LegacyRingDifficulty, getLegacyDifficulties, generateBasicLegacyRings } from "../generator/legacy"
import { BarPrimitive } from "../level/primitives/bar"
import { BallPrimitive } from "../level/primitives/ball"
import { exponentEasing, compositeEasing, inverseEasing, constantEasing, compoundEasing, linearEasing, biExponentEasing, remapEasing } from "../../animation/easing"
import { Color } from "../../util/color"
import { Pass } from "three/examples/jsm/postprocessing/Pass"

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
    name: string
    category: string

    isThemeDynamic: boolean
    getThemeColors: (level: Level) => ModeThemeColors

    isMaterialDynamic: boolean
    getMaterial: (prim: IPrimitive) => PrimitiveMaterial
    getBulletMaterial: (bullet: Bullet) => PrimitiveMaterial

    getEffectPass: () => Pass

    generateLevel: (index: number) => Level

    advance: (level: Level, dTime: number) => void
}
