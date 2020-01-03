import { IPrimitive } from "../game/level/primitives";
import { Ring } from "../game/level/ring";
import { Level } from "../game/level/level";
import { IMode } from "../game/mode/mode";

export type Rasterizable = IPrimitiveLike | Ring | Level

export interface IRasterizedPrimitive {
    update: () => void
}

export interface IRasterizer {
    rasterizePrimitive: (mode: IMode, prim: Rasterizable) => IRasterizedPrimitive
}