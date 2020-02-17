import { IMode, ModeThemeColors } from "../mode";
import { G4LegacyMode } from "./legacy";
import { Level } from "../../level/level";
import { getLegacyDifficulties, generateBasicLegacyRings } from "../../generator/legacy";
import { Ring } from "../../level/ring";
import { Cannon } from "../../level/cannon";

export class G4HardMode extends G4LegacyMode {
    public modeID = "g4_hard"
    public name = "Hard"

    getThemeColors(level: Level): ModeThemeColors {
        return {
            background: "#171925",
            dim: "#131316",
            spotlight: "#1E262D",

            foreground: "#F7F4F0",
            accent: "#4DDED7",
            secondaryAccent: "#3671C7"
        }
    }

    generateLevel(index: number): Level {
        const level = new Level(
            this, index
        )

        const difficulties = getLegacyDifficulties(index).map(
            x => x ? 3 : 0
        )

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
                0, 40, 0, -1
            )
        )

        level.add(cannonRing)

        return level
    }
}