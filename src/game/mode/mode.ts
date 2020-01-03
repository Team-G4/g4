import { IPrimitive } from "../level/primitives";
import { Level } from "../level/level";

export type PrimitiveMaterial = {
    color: string
}

export interface IMode {
    getMaterial: (prim: IPrimitive) => PrimitiveMaterial

    generateLevel: (index: number) => Level

    advance: (level: Level, dTime: number) => void
}

export class TestMode implements IMode {
    getMaterial(prim: IPrimitive): PrimitiveMaterial {
        return {
            color: (prim.ring.items.indexOf(prim) % 2) ? "red" : "green"
        }
    }

    generateLevel(index: number): Level {
        let level = new Level()

        return level
    }

    advance(level: Level, dTime: number) {
        level.advance(dTime)
    }
}