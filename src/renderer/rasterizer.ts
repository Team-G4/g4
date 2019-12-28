import { IPrimitive } from "../game/level/primitives";
import { Ring } from "../game/level/ring";
import { Level } from "../game/level/level";

export type Rasterizable = IPrimitive | Ring | Level

export interface IRasterizedPrimitive {
    update: () => void
}

export interface IRasterizer {
    rasterize: (prim: Rasterizable) => IRasterizedPrimitive
}