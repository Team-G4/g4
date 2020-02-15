import { IPrimitive } from "../level/primitives/primitives"
import { Polygon } from "./polygon"
import { Ring } from "../level/ring"
import { BallPrimitive } from "../level/primitives/ball"
import { BarPrimitive } from "../level/primitives/bar"
import { Level } from "../level/level"

/**
 * The type of the generated legacy ring
 */
export enum LegacyRingType {
    /**
     * The inner ring (type A)
     */
    innerRing,
    /**
     * The middle ring (type B)
     */
    middleRing,
    /**
     * The outer ring (type C)
     */
    outerRing,
    /**
     * The Denise ring (type D)
     */
    deniseRing,
    /**
     * The inner ring (type A)
     */
    typeA = innerRing,
    /**
     * The middle ring (type B)
     */
    typeB = middleRing,
    /**
     * The outer ring (type C)
     */
    typeC = outerRing,
    /**
     * The Denise ring (type D)
     */
    typeD = deniseRing
}

/**
 * The difficulty of the generated ring
 */
export enum LegacyRingDifficulty {
    /**
     * None - the ring will not be generated
     */
    none = 0,
    /**
     * Easy - not available for type B rings
     */
    easy = 1,
    /**
     * Normal
     */
    normal = 2,
    /**
     * Hard
     */
    hard = 3,
    /**
     * Extreme - only available for type D rings
     */
    extreme = 4
}

export class LegacyPolygon extends Polygon {
    /**
     * Generates a legacy polygon
     * @param vertexCount - the number of verices
     * @param isSmall - whether the generated ring is small
     * @param isEasy - whether the generated ring is easy
     */
    constructor(
        vertexCount: number,
        isSmall = false,
        isEasy = false
    ) {
        super(vertexCount)

        this.generateVertices(
            vertexCount, isSmall, isEasy
        )
    }

    private generateVertices(
        n: number,
        isSmall: boolean,
        isEasy: boolean
    ): void {
        const dAngle = 1 / n

        const shiftAngle = dAngle / 3
        const isShifted = isEasy ? (Math.random() >= 0.5) : false
        const shiftSign = (Math.random() >= 0.5) ? 1 : -1

        this.angles = this.angles.map((angle, i) => {
            if (isShifted && n == 4 && i % 2)
                angle += shiftSign *  shiftAngle
            else if (isShifted && n == 6 && !isSmall) {
                if (i % 3 == 0) angle += shiftSign * shiftAngle
                else if (i % 3 == 1) angle -= shiftSign * shiftAngle
            }

            return angle
        })
    }
}

function generateInnerRing(
    ring: Ring,
    difficulty: LegacyRingDifficulty,
    distance: number
): IPrimitive[] {
    // don't even ask
    const primitives: IPrimitive[] = []

    let n = 2
    if (difficulty === LegacyRingDifficulty.normal)
        n = Math.floor(Math.random() * 2) + 2
    else if (difficulty === LegacyRingDifficulty.hard)
        n = 4

    n += Math.round(Math.random() * 2)

    const angles = new LegacyPolygon(
        n, true, difficulty < LegacyRingDifficulty.hard
    ).angles

    angles.forEach((angle, i) => {
        const isBall = Math.random() >= 0.5

        if (isBall || (!isBall && !i)) {
            primitives.push(
                new BallPrimitive(
                    ring, angle, distance, 50
                )
            )

            if (
                Math.random() >= 0.7 && i > 0 &&
                difficulty > LegacyRingDifficulty.easy
            ) {
                primitives.push(
                    new BallPrimitive(
                        ring, angle - 0.08, distance, 20
                    ),
                    new BallPrimitive(
                        ring, angle + 0.08, distance, 20
                    )
                )
            }
        } else if (!isBall && i > 0) {
            let length = angles[(i + 1) % angles.length] - angle
            if (length < 0) length++

            primitives.push(
                new BarPrimitive(
                    ring, angle, length, distance, 10
                )
            )

            if (Math.random() >= 0.5)
                primitives.push(
                    new BallPrimitive(
                        ring, angle, distance, 30
                    ),
                    new BallPrimitive(
                        ring, angle + length, distance, 30
                    )
                )
        }
    })

    return primitives
}

function generateMiddleRing(
    ring: Ring,
    difficulty: LegacyRingDifficulty,
    distance: number
): IPrimitive[] {
    const primitives: IPrimitive[] = []

    if (difficulty === LegacyRingDifficulty.easy) return primitives
    let n = (difficulty - 1) * 2
    if (difficulty === LegacyRingDifficulty.hard && Math.random() >= 0.6)
        n = 6
    
    const angles = new LegacyPolygon(n).angles

    for (let i = 0; i < n / 2; i++) {
        const angleStart = angles[2 * i]
        const angleLength = angles[2 * i + 1] - angleStart

        if (difficulty === LegacyRingDifficulty.hard && Math.random() >= 0.5) {
            // replace with marquee bar later
            primitives.push(
                new BarPrimitive(
                    ring, angleStart, angleLength, distance, 10
                )
            )
        } else {
            primitives.push(
                new BarPrimitive(
                    ring, angleStart, angleLength, distance, 10
                )
            )
        }
    }

    return primitives
}

function generateOuterRing(
    ring: Ring,
    difficulty: LegacyRingDifficulty,
    distance: number
): IPrimitive[] {
    const primitives: IPrimitive[] = []

    if (difficulty === LegacyRingDifficulty.easy && Math.random() >= 0.5)
        return primitives
    
    const n = 3 + Math.round(1.2 * difficulty * Math.random())
    const isPulsing = Math.random() >= 0.5 && difficulty > LegacyRingDifficulty.easy
    const willGenerateBars = difficulty > LegacyRingDifficulty.normal

    const angles = new LegacyPolygon(n).angles

    angles.forEach((angle, i) => {
        if (isPulsing && i % 2) {
            // todo pulsing ball here
            primitives.push(
                new BallPrimitive(
                    ring, angle, distance, 20
                )
            )
        } else {
            primitives.push(
                new BallPrimitive(
                    ring, angle, distance, 20
                )
            )
        }
    })

    if (willGenerateBars) {
        for (let i = 0; i < n / 2; i++) {
            let angle1 = angles[i * 2]
            let angle2 = angles[(i * 2 + 1) % angles.length]
            if (angle2 < angle1) angle2 += 1

            const length = (angle2 - angle1) * (Math.random() * 0.4 + 0.2)
            const start = (angle1 + angle2) / 2 - length / 2
            
            primitives.push(
                new BarPrimitive(
                    ring, start, length, distance, 10
                )
            )
        }
    }

    return primitives
}

/**
 * Generates a legacy ring.
 * @param ring - the target ring
 * @param type - type of the ring
 * @param difficulty - difficulty of the generated ring
 * @param distance - the radius of the ring
 */
export function generateLegacyRing(
    ring: Ring,
    type: LegacyRingType,
    difficulty: LegacyRingDifficulty,
    distance: number
): IPrimitive[] {
    switch (type) {
        case LegacyRingType.innerRing:
            return generateInnerRing(
                ring, difficulty, distance
            )
        case LegacyRingType.middleRing:
            return generateMiddleRing(
                ring, difficulty, distance
            )
        case LegacyRingType.outerRing:
                return generateOuterRing(
                    ring, difficulty, distance
                )
    }
    return []
}

export function generateBasicLegacyRings(
    level: Level,
    [inner, middle, outer]: LegacyRingDifficulty[]
): Ring[] {
    const rings: Ring[] = []

    if (inner !== LegacyRingDifficulty.none) {
        const innerRing = new Ring(level, 1)

        innerRing.add(
            ...generateInnerRing(innerRing, inner, 200)
        )

        rings.push(innerRing)
    }
    if (middle !== LegacyRingDifficulty.none) {
        const middleRing = new Ring(level, 0.5)

        middleRing.add(
            ...generateMiddleRing(middleRing, middle, 300)
        )

        rings.push(middleRing)
    }
    if (outer !== LegacyRingDifficulty.none) {
        const outerRing = new Ring(level, 0.25)

        outerRing.add(
            ...generateInnerRing(outerRing, outer, 500)
        )

        rings.push(outerRing)
    }

    return rings
}

const staticProgression = [
    [1, 0, 0],
    [1, 0, 0],
    [2, 0, 0],
    [2, 0, 0],
    [2, 0, 0],
    [3, 0, 0],
    [3, 0, 1],
    [2, 0, 2],
    [2, 0, 2],
    [2, 0, 2],
    [2, 1, 2],
    [2, 1, 2]
]
const loopedProgression = [
    [3, 1, 2],
    [2, 2, 2],
    [2, 2, 2],
    [2, 3, 2],
    [2, 3, 1],
    [2, 2, 2],
    [2, 2, 2],
    [3, 1, 2],
    [2, 1, 2],
    [3, 1, 2],
    [2, 2, 2],
    [2, 2, 2],
    [2, 3, 2],
    [3, 3, 3],
    [2, 2, 2],
    [2, 2, 2],
    [3, 1, 2],
    [2, 1, 2]
]

export function getLegacyDifficulties(levelIndex: number): LegacyRingDifficulty[] {
    if (levelIndex < staticProgression.length) return staticProgression[levelIndex]
    return loopedProgression[
        (levelIndex - staticProgression.length) % loopedProgression.length
    ]
}