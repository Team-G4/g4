/**
 * The BeatingHeart class provides a simple ability to turn timestamps into time intervals represented as a fraction of the "beat" time
 */
export class BeatingHeart {
    public lastTimestamp: DOMHighResTimeStamp

    /**
     * Creates an instance of the BeatingHeart class.
     * @param bpm - the number of beats per minute
     * @param defaultInterval - the default interval returned by BeatingHeart.beat() in milliseconds
     */
    constructor(
        public bpm = 16.25,
        public defaultInterval = 100 / 6
    ) {}

    /**
     * Makes the heart beat.
     * @param timestamp - a timestamp in milliseconds
     * @returns The interval between timestamps represented as a fraction of the beat time
     */
    beat(timestamp: DOMHighResTimeStamp): number {
        let correctedLastTimestamp = this.lastTimestamp ?? (timestamp - this.defaultInterval)
        let interval = timestamp - correctedLastTimestamp

        this.lastTimestamp = timestamp

        return (interval / 1000) / (60 / this.bpm)
    }
}