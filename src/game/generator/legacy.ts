import { IPrimitive } from "../level/primitives";

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

/**
 * Generates a legacy ring.
 * @param type - type of the ring
 * @param difficulty - difficulty of the generated ring
 * @param distance - the radius of the ring
 */
export function generateRing(
    type: LegacyRingType,
    difficulty: LegacyRingDifficulty,
    distance: number
): IPrimitive[] {
    return []
}