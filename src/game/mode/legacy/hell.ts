import { IMode, ModeThemeColors } from "../mode";
import { G4LegacyMode } from "./legacy";
import { Level } from "../../level/level";
import { getLegacyDifficulties, generateBasicLegacyRings, generateLegacyRing, LegacyRingType, LegacyRingDifficulty } from "../../generator/legacy";
import { Ring } from "../../level/ring";
import { Cannon } from "../../level/cannon";

export class G4HellMode extends G4LegacyMode {
    public modeID = "g4_hell"
    public name = "Hell"

    getThemeColors(level: Level): ModeThemeColors {
        return {
            background: "#1D1111",
            dim: "#140912",
            spotlight: "#261E1C",

            foreground: "#FFFFFF",
            accent: "#E8CF43",
            secondaryAccent: "#DA4324"
        }
    }

    generateLevel(index: number): Level {
        const level = new Level(
            this, index
        )

        level.add(
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
                const ring = new Ring(level, 0.5)
                ring.add(
                    ...generateLegacyRing(
                        ring, LegacyRingType.innerRing,
                        LegacyRingDifficulty.normal, 200
                    )
                )
                return ring
            })(),
            (() => {
                const ring = new Ring(level, 0.25)
                ring.add(
                    ...generateLegacyRing(
                        ring, LegacyRingType.middleRing,
                        LegacyRingDifficulty.hard, 300
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
            })()
        )

        const cannonRing = new Ring(
            level, 1
        )

        cannonRing.add(
            new Cannon(
                cannonRing,
                0, 40, 0, -1
            )
        )

        level.add(cannonRing)

        return level
    }
}