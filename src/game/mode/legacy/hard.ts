import { IMode, ModeThemeColors } from "../mode";
import { G4LegacyMode } from "./legacy";
import { Level } from "../../level/level";
import { getLegacyDifficulties, generateBasicLegacyRings } from "../../generator/legacy";
import { Ring } from "../../level/ring";
import { Cannon } from "../../level/cannon";

export class G4HardMode extends G4LegacyMode {
    public modeID = "g4_hard"
    public name = "Hard"

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
                0, 40, 0, -1.5
            )
        )

        level.add(cannonRing)

        return level
    }
}