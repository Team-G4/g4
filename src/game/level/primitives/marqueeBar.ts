import { BarPrimitive } from "./bar";
import { Ring } from "../ring";

export class MarqueeBarPrimitive extends BarPrimitive {
    constructor(
        ring: Ring,
        public baseStart = 0,
        public baseLength = 0,
        distance = 0,
        barRadius = 0,
        public marqueeFrequency = 0
    ) {
        super(
            ring,
            baseStart, baseLength,
            distance, barRadius
        )
    }

    serialize() {
        return {
            type: "MarqueeBarPrimitive",

            angle: this.angle,
            length: this.length,

            baseStart: this.baseStart,
            baseLength: this.baseLength,
            marqueeFrequency: this.marqueeFrequency,

            distance: this.distance,
            barRadius: this.barRadius
        }
    }
}

export class ShrinkingMarqueeBarPrimitive extends MarqueeBarPrimitive {
    advance(dTime: number, levelTime: number) {
        const pos = Math.sin(
            levelTime * 2 * Math.PI * this.marqueeFrequency
        ) / 2 + 0.5

        this.baseStart += dTime
        this.length = pos * this.baseLength
        this.angle = this.baseStart + (this.baseLength - this.length) / 2
    }

    serialize() {
        return {
            ...super.serialize(),
            type: "ShrinkingMarqueeBarPrimitive"
        }
    }
}