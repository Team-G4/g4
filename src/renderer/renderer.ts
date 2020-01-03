import { Level } from "../game/level/level";

export interface IRenderer {
    domElement: HTMLCanvasElement

    updateSize: (w: number, h: number) => void

    initLevel: (level: Level) => void

    render: (timestamp: DOMHighResTimeStamp) => void
}