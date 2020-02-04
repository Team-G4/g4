/**
 * The BeatingHeart class provides a simple ability to turn timestamps into time intervals represented as a fraction of the "beat" time
 */
export class BeatingHeart {
    public lastTimestamp: DOMHighResTimeStamp
    public currentTime = 0

    /**
     * Creates an instance of the BeatingHeart class.
     * @param bpm - the number of beats per minute
     * @param defaultInterval - the default interval returned by BeatingHeart.beat() in milliseconds
     * @param signature - number of beats in a bar
     */
    constructor(
        public bpm = 16.25,
        public defaultInterval = 100 / 6,
        public signature = 4
    ) {}

    /**
     * Resets the current time to 0.
     */
    start() {
        this.currentTime = 0
    }

    /**
     * Returns the current bar index in reference to the last call to start()
     */
    get bar() {
        return Math.floor(this.currentTime / this.signature)
    }

    /**
     * Returns the current time in bar time
     */
    get barTime() {
        return this.currentTime / this.signature - this.bar
    }

    /**
     * Makes the heart beat.
     * @param timestamp - a timestamp in seconds
     * @returns the interval between timestamps represented as a fraction of the beat time
     */
    beat(timestamp: DOMHighResTimeStamp): number {
        let correctedLastTimestamp = this.lastTimestamp ?? (timestamp - this.defaultInterval)
        let interval = timestamp - correctedLastTimestamp

        this.lastTimestamp = timestamp

        let dTime = interval / (60 / this.bpm)
        this.currentTime += dTime

        return dTime
    }
}
