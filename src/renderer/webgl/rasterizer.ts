import { IRasterizer, IRasterizedPrimitive } from "../rasterizer";
import { IPrimitive } from "../../game/level/primitives";

import { Material, Object3D } from "three";

interface IWGLRasterizedPrimitive extends IRasterizedPrimitive {
    threeObject: Object3D
    createThreeObject: (mat: Material) => Object3D
    refreshThreeObject: () => void
}

// class WGLRasterizer implements IRasterizer {
//     rasterize(item: IPrimitive) {}
// }