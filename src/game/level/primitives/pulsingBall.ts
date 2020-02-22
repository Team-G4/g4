import { BallPrimitive } from "./ball";
import { Ring } from "../ring";

export class PulsingBallPrimitive extends BallPrimitive {
    constructor(
        ring: Ring,
        angle = 0,
        distance = 0,
        public startBallRadius = 0,
        public endBallRadius = 0,
        public pulseFrequency = 0
    ) {
        super(ring, angle, distance, startBallRadius)
    }

    serialize() {
        return {
            type: "PulsingBallPrimitive",

            angle: this.angle,
            distance: this.distance,
            ballRadius: this.ballRadius,
            startBallRadius: this.startBallRadius,
            endBallRadius: this.endBallRadius,
            pulseFrequency: this.pulseFrequency
        }
    }

    advance(dTime: number, levelTime: number) {
        super.advance(dTime, levelTime)
        
        const pos = Math.cos(
            levelTime * 2 * Math.PI * this.pulseFrequency
        ) / 2 + 0.5

        this.ballRadius = this.endBallRadius + pos * (
            this.startBallRadius - this.endBallRadius
        )
    }

    getSpan() {
        const {x, y} = this.ballPosition
        return Math.hypot(
            x, y
        ) + Math.max(
            this.startBallRadius,
            this.endBallRadius
        )
    }
}

export class LegacyPulsingBallPrimitive extends PulsingBallPrimitive {
    constructor(
        ring: Ring,
        angle = 0,
        distance = 0,
        radius = 0,
        pulseFrequency = 0
    ) {
        super(
            ring, angle, distance,
            radius * 2 / 3,
            radius * 4 / 3,
            pulseFrequency
        )
    }
}