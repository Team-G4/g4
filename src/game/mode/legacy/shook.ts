import { IMode, ModeThemeColors, PrimitiveMaterial } from "../mode";
import { G4LegacyMode } from "./legacy";
import { Level } from "../../level/level";
import { getLegacyDifficulties, generateBasicLegacyRings, generateLegacyRing, LegacyRingType } from "../../generator/legacy";
import { Ring } from "../../level/ring";
import { Cannon } from "../../level/cannon";
import { IPrimitive } from "../../level/primitives/primitives";
import { BarPrimitive } from "../../level/primitives/bar";
//F59327
//724399
export class G4ShookMode extends G4LegacyMode {
    public modeID = "g4_shook"
    public name = "Shook"

    getThemeColors(level: Level): ModeThemeColors {
        return {
            background: "#12121A",
            dim: "#070710",
            spotlight: "#181822",

            foreground: "#F1FBFF",
            accent: "#F5652B",
            secondaryAccent: "#473B99"
        }
    }

    getMaterial(prim: IPrimitive): PrimitiveMaterial {
        const colors = this.getThemeColors(prim.ring.level)
        const ringParity = prim.ring.level.rings.indexOf(prim.ring) % 2

        let color = ringParity ? "#F59327" : "#724399"

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
                0, 0, 0, -1.5
            )
        )

        level.add(cannonRing)

        return level
    }
}