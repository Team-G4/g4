export class CubicBezier {
    constructor(
        public ax: number,
        public ay: number,
        public bx: number,
        public by: number
    ) {}

    getFuncs(t: number): number[] {
        return [
            (1 - t)**3,
            3 * t * (1 - t)**2,
            3 * t**2 * (1 - t),
            t**3
        ]
    }
}