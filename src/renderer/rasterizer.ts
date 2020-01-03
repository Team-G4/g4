import { IPrimitive } from "../game/level/primitives";
import { Ring } from "../game/level/ring";
import { Level } from "../game/level/level";
import { IMode } from "../game/mode/mode";

export type Rasterizable = IPrimitive | Ring | Level

export interface IRasterizedPrimitive {
    update: (deepUpdate: boolean) => void
}

export interface IRasterizer {
    rasterizePrimitive: (mode: IMode, prim: Rasterizable) => IRasterizedPrimitive
}