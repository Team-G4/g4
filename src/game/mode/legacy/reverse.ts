import { IMode, ModeThemeColors } from "../mode";
import { G4LegacyMode } from "./legacy";
import { Level } from "../../level/level";
import { getLegacyDifficulties, generateBasicLegacyRings, generateLegacyRing, LegacyRingType, LegacyRingDifficulty } from "../../generator/legacy";
import { Ring } from "../../level/ring";
import { Cannon } from "../../level/cannon";

export class G4ReverseMode extends G4LegacyMode {
    public modeID = "g4_reverse"
    public name = "Reverse"

    generateLevel(index: number): Level {
        const level = new Level(
            this, index
        )

        level.add(
            (() => {
                const ring = new Ring(level, 1)
                ring.add(
                    ...generateLegacyRing(
                        ring, LegacyRingType.outerRing,
                        LegacyRingDifficulty.normal, 150
                    )
                )
                return ring
            })(),
            (() => {
                const ring = new Ring(level, 0.5)
                ring.add(
                    ...generateLegacyRing(
                        ring, LegacyRingType.outerRing,
                        LegacyRingDifficulty.hard, 300
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
                0.5, 400, 0, 1
            )
        )

        level.add(cannonRing)

        return level
    }
}