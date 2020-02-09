/**
 * An RGB color
 */
export class Color {
    constructor(
        public r = 0,
        public g = 0,
        public b = 0
    ) {}

    toString() {
        let red = Math.max(Math.min(Math.round(this.r * 255), 255), 0)
        let green = Math.max(Math.min(Math.round(this.g * 255), 255), 0)
        let blue = Math.max(Math.min(Math.round(this.b * 255), 255), 0)

        return `rgb(${red}, ${green}, ${blue})`
    }
}