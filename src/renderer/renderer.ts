import { Level } from "../game/level/level";

/**
 * Represents a renderer
 */
export interface IRenderer {
    updateSize: (w: number, h: number) => void

    initLevel: (level: Level) => void

    render: (timestamp: DOMHighResTimeStamp) => void
}

/**
 * Represents a textual renderer
 */
export interface ITextualRenderer extends IRenderer {
    render: (timestamp: DOMHighResTimeStamp) => string
}

/**
 * Represents an on-screen visual renderer
 */
export interface IVisualRenderer extends IRenderer {
    /**
     * The Canvas element containing the rendered game
     */
    domElement: HTMLCanvasElement
}
