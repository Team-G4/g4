import { Ring } from "./ring";
import { Group } from "three";

export class Level {
    public rings: Ring[] = []

    public threeObject = new Group()

    add(...ring: Ring[]) {
        this.rings.push(...ring)
    }

    advance(dTime: number) {
        this.rings.forEach(r => r.advance(dTime))
    }

    // createThreeObject(mat: Material) {
    //     this.rings.forEach(ring => this.threeObject.add(
    //         ring.createThreeObject(mat)
    //     ))
    //     return this.threeObject
    // }

    // refreshThreeObject() {
    //     this.rings.forEach(r => r.refreshThreeObject())
    // }
}