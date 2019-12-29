export enum PolygonSymmetryType {
    centerPointSymmetry = "point",
    mirrorSymmetry = "mirror"
}

export class Polygon {
    public angles: number[]
    
    constructor(
        vertexCount: number
    ) {
        this.angles = Array<number>(vertexCount).fill(0).map(
            (x, i) => i / vertexCount
        )
    }

    static fromAngles(angles: number[]) {
        let p = new Polygon(angles.length)
        p.angles = angles.sort((a1, a2) => a1 - a2)

        return p
    }

    shift(angle: number): Polygon {
        return Polygon.fromAngles(
            this.angles.map(ang => {
                let a = (ang + angle) % 1
                if (a < 0) a += 1

                return a
            })
        )
    }

    symmetry(type: PolygonSymmetryType, start = 0) {
        let startAngles = this.shift(-start).angles
        let angles: number[] = []

        for (let angle of startAngles) {
            if (type == PolygonSymmetryType.centerPointSymmetry) {
                if (angle >= 0.5) break
                angles = [...angles, angle, angle + 0.5]
            } else if (type == PolygonSymmetryType.mirrorSymmetry) {
                if (angle > 0.5) break
                if (angle == 0 || angle == 0.5) {
                    angles = [...angles, angle]
                } else {
                    angles = [...angles, angle, 1 - angle]
                }
            }
        }

        return Polygon.fromAngles(angles).shift(start)
    }
}