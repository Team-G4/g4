import { BaseMode, ModeThemeColors, ModeThemeColorsGen, PrimitiveMaterial } from "../mode";
import { Color, ObjectLoader } from "three";
import { Level } from "../../level/level";
import { Ring } from "../../level/ring";
import { generateLegacyRing, LegacyRingType, LegacyRingDifficulty } from "../../generator/legacy";
import { Cannon } from "../../level/cannon";
import { IPrimitive } from "../../level/primitives/primitives";

export class EclipseMode extends BaseMode {
    public category = "G4"
    public modeID = "eclipse"
    public name = "Eclipse"

    public isThemeDynamic = true
    public isMaterialDynamic = true
    
    // getSchemeColors(scheme: string): ModeThemeColorsGen<Color> {
    //     const keys = [
    //         "background", "dim", "spotlight",
    //         "foreground", "accent", "secondaryAccent"
    //     ]
    //     const colors: any = {}

    //     keys.forEach(
    //         k => colors[k] = new Color(this.settings.getThemeColor(
    //             `g4.mode.${this.modeID}.${scheme}.${k}`
    //         ))
    //     )

    //     return colors as ModeThemeColorsGen<Color>
    // }
    
    getThemeColors(level: Level): ModeThemeColors {
        let time = (level.time % 2) / 2
        let darkLightFade = Math.min(
            1, Math.max(0, time * 20 - 9)
        )
        if (time > 0.5) {
            time = time * 2 - 1
            darkLightFade = 1 - Math.min(
                1, Math.max(0, time * 10 - 9)
            )
        }

        const colors = super.getThemeColors(level)

        colors.spotlight = "#" + new Color(colors.spotlight).multiplyScalar(1 - darkLightFade).add(
            new Color(colors.accent).multiplyScalar(darkLightFade)
        ).getHexString()

        return colors as ModeThemeColors
    }

    getMaterial(prim: IPrimitive): PrimitiveMaterial {
        const colors = this.getThemeColors(prim.ring.level)
        const colorsRaw = super.getThemeColors(prim.ring.level)
        let time = (prim.ring.level.time % 2) / 2
        let darkLightFade = Math.min(
            1, Math.max(0, time * 20 - 9)
        )
        if (time > 0.5) {
            time = time * 2 - 1
            darkLightFade = 1 - Math.min(
                1, Math.max(0, time * 10 - 9)
            )
        }

        let color = "#" + new Color(colorsRaw.accent).multiplyScalar(1 - darkLightFade).add(
            new Color(colorsRaw.spotlight).multiplyScalar(darkLightFade)
        ).getHexString()

        if (!prim.ring.isCollidable) color = colors.spotlight

        if (prim instanceof Cannon) color = "#" + new Color(colorsRaw.foreground).multiplyScalar(1 - darkLightFade).add(
            new Color(colorsRaw.background).multiplyScalar(darkLightFade)
        ).getHexString()

        return {
            color
        }
    }

    generateLevel(index: number): Level {
        const level = new Level(
            this, index
        )

        level.add(
            (() => {
                const ring = new Ring(level, 1, 0, 0, 0, null, false)
                ring.add(
                    ...generateLegacyRing(
                        ring, LegacyRingType.innerRing,
                        LegacyRingDifficulty.normal, 200
                    )
                )
                return ring
            })(),
            (() => {
                const ring = new Ring(level, 1)
                ring.add(
                    ...generateLegacyRing(
                        ring, LegacyRingType.innerRing,
                        LegacyRingDifficulty.normal, 200
                    )
                )
                return ring
            })(),
            
            (() => {
                const ring = new Ring(level, 0.5, 0, 0, 0, null, false)
                ring.add(
                    ...generateLegacyRing(
                        ring, LegacyRingType.innerRing,
                        LegacyRingDifficulty.easy, 400
                    )
                )
                return ring
            })(),
            (() => {
                const ring = new Ring(level, 0.5)
                ring.add(
                    ...generateLegacyRing(
                        ring, LegacyRingType.outerRing,
                        LegacyRingDifficulty.hard, 430
                    )
                )
                return ring
            })(),
            
            (() => {
                const ring = new Ring(level, 0.25, 0, 0, 0, null, false)
                ring.add(
                    ...generateLegacyRing(
                        ring, LegacyRingType.middleRing,
                        LegacyRingDifficulty.hard, 300
                    )
                )
                return ring
            })(),
            (() => {
                const ring = new Ring(level, -0.5)
                ring.add(
                    ...generateLegacyRing(
                        ring, LegacyRingType.outerRing,
                        LegacyRingDifficulty.normal, 370
                    )
                )
                return ring
            })(),
        )

        const cannonRing = new Ring(
            level, 1
        )

        cannonRing.add(
            new Cannon(
                cannonRing,
                0, 0, 0, -1
            )
        )

        level.add(cannonRing)

        return level
    }

    advance(level: Level, dTime: number) {
        const current = ((level.time + 0.05) % 2) >= 1

        for (let i = 0; i < level.rings.length - 1; i += 2) {
            const r1 = level.rings[i]
            const r2 = level.rings[i + 1]

            r1.isCollidable = current
            r2.isCollidable = !current
        }

        level.advance(dTime)
    }
}