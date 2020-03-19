import { IMode, ModeThemeColors, PrimitiveMaterial } from "../mode";
import { G4LegacyMode } from "./legacy";
import { Level } from "../../level/level";
import { getLegacyDifficulties, generateBasicLegacyRings, generateLegacyRing, LegacyRingType, LegacyRingDifficulty } from "../../generator/legacy";
import { Ring } from "../../level/ring";
import { Cannon } from "../../level/cannon";
import { IPrimitive } from "../../level/primitives/primitives";
import { BarPrimitive } from "../../level/primitives/bar";

export class G4NoxMode extends G4LegacyMode {
    public modeID = "g4_nox"
    public name = "Nox"

    getMaterial(prim: IPrimitive): PrimitiveMaterial {
        const colors = this.getThemeColors(prim.ring.level)
        const ringParity = prim.ring.level.rings.indexOf(prim.ring) % 2

        const accentAlt = this.settings.getThemeColor(
            `g4.mode.${this.modeID}.accentAlt`
        )
        const accentAlt2 = this.settings.getThemeColor(
            `g4.mode.${this.modeID}.secondaryAccentAlt`
        )

        let color = ringParity ? accentAlt : accentAlt2

        if (prim instanceof Cannon) color = colors.foreground
        else if (prim instanceof BarPrimitive)
            color = ringParity ? colors.accent : colors.secondaryAccent

        return {
            color
        }
    }

    generateLevel(index: number): Level {
        const level = new Level(
            this, index
        )

        const rings: Ring[] = [];

        (() => {
            const ring = new Ring(level, 0.5)
            ring.add(
                ...generateLegacyRing(
                    ring, LegacyRingType.outerRing,
                    LegacyRingDifficulty.normal, 500
                )
            )
            rings.push(ring)
        })()

        if (index > 12) {
            (() => {
                const ring = new Ring(level, 0.5)
                ring.add(
                    ...generateLegacyRing(
                        ring, LegacyRingType.middleRing,
                        LegacyRingDifficulty.hard, 250
                    )
                )
                rings.push(ring)
            })()
        }

        const diffOffset = (index > 9) ? 2 : 1
        const nOffset = (index > 4) ? 2 : 3
        const n = Math.round(Math.random() * 2) + nOffset

        for (let i = 0; i < n; i++) {
            const phase = i / n
            const ringRadius = 400
            const ringDistance = 100

            const ringDifficulty = diffOffset + Math.round(Math.random())

            const ring = new Ring(
                level, 1, ringDistance, 0.5, phase
            )
            ring.add(
                ...generateLegacyRing(
                    ring, LegacyRingType.innerRing,
                    ringDifficulty, ringRadius
                )
            )
            rings.push(ring)
        }

        level.add(...rings)

        const cannonRing = new Ring(
            level, 1
        )

        cannonRing.add(
            new Cannon(
                cannonRing,
                0, 0, 0, -1.5
            )
        )

        level.add(cannonRing)

        return level
    }
}