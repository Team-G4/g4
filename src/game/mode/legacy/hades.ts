import { PrimitiveMaterial } from "../mode";
import { G4LegacyMode } from "./legacy";
import { Level } from "../../level/level";
import { generateLegacyRing, LegacyRingType, LegacyRingDifficulty } from "../../generator/legacy";
import { Ring } from "../../level/ring";
import { Cannon } from "../../level/cannon";
import { BarPrimitive } from "../../level/primitives/bar";
import { IPrimitive } from "../../level/primitives/primitives";

export class G4HadesMode extends G4LegacyMode {
    public modeID = "g4_hades"
    public name = "Hades"

    getMaterial(prim: IPrimitive): PrimitiveMaterial {
        const colors = this.getThemeColors(prim.ring.level)

        const accentAlt = this.settings.getThemeColor(
            `g4.mode.${this.modeID}.accentAlt`
        )
        const accentAlt2 = this.settings.getThemeColor(
            `g4.mode.${this.modeID}.secondaryAccentAlt`
        )

        let color = prim.ring.isCollidable ? accentAlt : accentAlt2

        if (prim instanceof Cannon) color = colors.foreground
        else if (prim instanceof BarPrimitive)
            color = prim.ring.isCollidable ? colors.accent : colors.secondaryAccent

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
                        ring, LegacyRingType.middleRing,
                        LegacyRingDifficulty.hard, 300
                    )
                )
                return ring
            })(),
            (() => {
                const ring = new Ring(level, 0.5, 0, 0, 0, null, false)
                ring.add(
                    ...generateLegacyRing(
                        ring, LegacyRingType.outerRing,
                        LegacyRingDifficulty.hard, 400
                    )
                )
                return ring
            })(),
            (() => {
                const ring = new Ring(level, 0.75, 0, 0, 0, null, false)
                ring.add(
                    ...generateLegacyRing(
                        ring, LegacyRingType.innerRing,
                        LegacyRingDifficulty.normal, 150
                    )
                )
                return ring
            })(),

            (() => {
                const ring = new Ring(level, 1)
                ring.add(
                    ...generateLegacyRing(
                        ring, LegacyRingType.innerRing,
                        LegacyRingDifficulty.easy, 100
                    )
                )
                return ring
            })(),
            (() => {
                const ring = new Ring(level, 0.5)
                ring.add(
                    ...generateLegacyRing(
                        ring, LegacyRingType.innerRing,
                        LegacyRingDifficulty.hard, 300
                    )
                )
                return ring
            })(),
            (() => {
                const ring = new Ring(level, 0.25)
                ring.add(
                    ...generateLegacyRing(
                        ring, LegacyRingType.outerRing,
                        LegacyRingDifficulty.hard, 400
                    )
                )
                return ring
            })(),
            (() => {
                const ring = new Ring(level, 0.125)
                ring.add(
                    ...generateLegacyRing(
                        ring, LegacyRingType.outerRing,
                        LegacyRingDifficulty.hard, 400
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
                0, 200, 0, -1.5
            )
        )

        level.add(cannonRing)

        return level
    }
}