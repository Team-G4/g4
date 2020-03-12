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
import { Settings } from "../../settings/settings"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"

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

    settings: Settings

    isThemeDynamic: boolean
    getThemeColors: (level: Level) => ModeThemeColors

    isMaterialDynamic: boolean
    getMaterial: (prim: IPrimitive) => PrimitiveMaterial
    getBulletMaterial: (bullet: Bullet) => PrimitiveMaterial

    getEffectPass: () => Pass

    generateLevel: (index: number) => Level

    advance: (level: Level, dTime: number) => void
}

export class BaseMode implements IMode{
    public modeID = ""
    public category = ""
    public name = ""

    public settings: Settings
    
    // For now until theme change-based reloading is up
    public isMaterialDynamic = true
    public isThemeDynamic = true
    
    getThemeColors(level: Level): ModeThemeColors {
        const keys = [
            "background", "dim", "spotlight",
            "foreground", "accent", "secondaryAccent"
        ]
        const colors: any = {}

        keys.forEach(
            k => colors[k] = this.settings.getThemeColor(
                `g4.mode.${this.modeID}.${k}`
            )
        )

        return colors as ModeThemeColors
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


    getEffectPass() {
        return new ShaderPass({
            uniforms: {
                "tDiffuse": {value: null}
            },
            vertexShader: `
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    
                    gl_Position = projectionMatrix *
                                  modelViewMatrix *
                                  vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                varying vec2 vUv;

                void main() {
                    gl_FragColor = texture2D(
                        tDiffuse, vUv
                    );
                }
            `
        })
    }

    generateLevel(index: number): Level {
        const level = new Level(this, index)

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
        level.advance(dTime)
    }
}