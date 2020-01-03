import { Level } from "../game/level/level";
import { IMode } from "../game/mode/mode";

export interface IRenderer {
    domElement: HTMLCanvasElement

    updateSize: (w: number, h: number) => void

    initLevel: (mode: IMode, level: Level) => void

    render: (timestamp: DOMHighResTimeStamp) => void
}