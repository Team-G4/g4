import { IPrimitive } from "./primitives"
import { IDrawable } from "../../renderer/drawable"
import { Group, Material } from "three"

export class Ring implements IDrawable {
    public items: (IPrimitive | Ring)[] = []

    public centerX = 0
    public centerY = 0
    public rotation = 0

    public threeObject = new Group()

    constructor(
        public timeMultiplier = 1,
        public distanceFromCenter = 0,
        public revolutionFrequency = 0,
        public revolutionPhase = 0,
        public parentRing: Ring = null
    ) {}

    add(...prim: (IPrimitive | Ring)[]) {
        this.items.push(...prim)
    }

    advanceRingPosition(dTime: number) {
        let parentX = this.parentRing?.centerX ?? 0
        let parentY = this.parentRing?.centerY ?? 0

        this.rotation += dTime

        this.centerX = parentX + Math.cos(this.rotation * this.revolutionFrequency * 2 * Math.PI + this.revolutionPhase * 2 * Math.PI) * this.distanceFromCenter
        this.centerY = parentY + Math.sin(this.rotation * this.revolutionFrequency * 2 * Math.PI + this.revolutionPhase * 2 * Math.PI) * this.distanceFromCenter
    }

    advance(dTime: number) {
        this.advanceRingPosition(dTime)
        this.items.forEach(i => i.advance(
            dTime * this.timeMultiplier
        ))
    }

    createThreeObject(mat: Material) {
        this.items.forEach(item => this.threeObject.add(
            item.createThreeObject(mat)
        ))
        return this.threeObject
    }

    refreshThreeObject() {
        this.items.forEach(item => item.refreshThreeObject())
    }

    get path2d() {
        let path = new Path2D()

        this.items.forEach(item => path.addPath(
            item.path2d
        ))

        return path
    }
}