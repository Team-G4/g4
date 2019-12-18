import { Material, Object3D } from "three";

export interface IDrawable {
    // Three.js / WebGL rendering
    threeObject: Object3D
    createThreeObject: (mat: Material) => Object3D
    refreshThreeObject: () => void

    // CanvasRenderingContext2D rendering
    path2d: Path2D
}