import { IMode, ModeThemeColors } from "../mode";
import { G4LegacyMode } from "./legacy";
import { Level } from "../../level/level";
import { getLegacyDifficulties, generateBasicLegacyRings } from "../../generator/legacy";
import { Ring } from "../../level/ring";
import { Cannon } from "../../level/cannon";

export class G4NormalMode extends G4LegacyMode {
    public modeID = "g4_normal"
    public name = "Normal"

    getThemeColors(level: Level): ModeThemeColors {
        return {
            background: "#21201B",
            dim: "#191515",
            spotlight: "#2A2621",

            foreground: "#F7F4F0",
            accent: "#CFC04E",
            secondaryAccent: "#CCB240"
        }
    }

    generateLevel(index: number): Level {
        const level = new Level(
            this, index
        )

        const difficulties = getLegacyDifficulties(index)

        level.add(
            ...generateBasicLegacyRings(
                level, difficulties
            )
        )

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