import { Ring } from "./ring";
import { IDrawable } from "../../renderer/drawable";
import { Group, Material } from "three";

export class Level implements IDrawable {
    public rings: Ring[] = []

    public threeObject = new Group()

    add(...ring: Ring[]) {
        this.rings.push(...ring)
    }

    advance(dTime: number) {
        this.rings.forEach(r => r.advance(dTime))
    }

    createThreeObject(mat: Material) {
        this.rings.forEach(ring => this.threeObject.add(
            ring.createThreeObject(mat)
        ))
        return this.threeObject
    }

    refreshThreeObject() {
        this.rings.forEach(r => r.refreshThreeObject())
    }

    get path2d() {
        let path = new Path2D()

        this.rings.forEach(ring => path.addPath(
            ring.path2d
        ))

        return path
    }
}