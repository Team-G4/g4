import { IMode, ModeThemeColors } from "../mode";
import { G4LegacyMode } from "./legacy";
import { Level } from "../../level/level";
import { getLegacyDifficulties, generateBasicLegacyRings, generateLegacyRing, LegacyRingType } from "../../generator/legacy";
import { Ring } from "../../level/ring";
import { Cannon } from "../../level/cannon";

export class G4ShookMode extends G4LegacyMode {
    public modeID = "g4_shook"
    public name = "Shook"

    getThemeColors(level: Level): ModeThemeColors {
        return {
            background: "#1A2320",
            dim: "#151918",
            spotlight: "#202E22",

            foreground: "#F0EFE0",
            accent: "#CAEC12",
            secondaryAccent: "#52CF12"
        }
    }

    generateLevel(index: number): Level {
        const level = new Level(
            this, index
        )

        const n = Math.min(
            2 + Math.floor(index / 5),
            4
        )
        const rings: Ring[] = []

        for (let i = 0; i < n; i++) {
            const ring = new Ring(
                level, ((i % 2) ? -1 : 1) * 0.5**i
            )
            ring.add(
                ...generateLegacyRing(
                    ring, LegacyRingType.innerRing,
                    Math.round(Math.random() + 1), 200 + i * 100
                )
            )
            rings.push(
                ring
            )
        }

        level.add(...rings)

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
}