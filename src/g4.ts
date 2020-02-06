import { Game } from "./game/game";
import { IMode, TestMode } from "./game/mode/mode";
import { IRenderer, IVisualRenderer } from "./renderer/renderer";
import { ISettingsManager } from "./settings/manager";
import { LocalStorageSettingsManager } from "./settings/localStorage";
import { Canvas2DRenderer } from "./renderer/canvas2D/canvas2D";
import { UI } from "./ui/web";
import { InputMethod } from "./input/input";
import { MouseInputMethod } from "./input/mouse";

/**
 * The main G4 class
 */
export class G4 {
    /**
     * All modes registered in the game
     */
    public modes: IMode[] = [
        new TestMode()
    ]
    /**
     * The game object
     */
    public game: Game

    /**
     * The settings manager
     */
    public settings: ISettingsManager

    /**
     * The input methods
     */
    public inputs: InputMethod[]

    async preload() {
        this.game = new Game()
        this.inputs.forEach(i => this.game.addInput(i))
    }

    async start() {
        this.game.mode = this.modes[0]
        await this.game.generateLevel(0)
    }
}

export class WebG4 extends G4 {
    public settings = new LocalStorageSettingsManager()

    public renderer: IVisualRenderer

    public inputs = [
        new MouseInputMethod(
            UI.getGameContainer()
        )
    ]

    async preload() {
        await super.preload()

        this.renderer = new Canvas2DRenderer()
        UI.prepareViewport(this.game, this.renderer)

        this.game.setRenderer(this.renderer)
        
        UI.attachStatEvents(this.game)
    }

    async start() {
        await super.start()

        requestAnimationFrame((timestamp) => this.render(timestamp))
    }

    async render(timestamp: DOMHighResTimeStamp) {
        await this.game.advanceAndRender(timestamp)

        requestAnimationFrame((timestamp) => this.render(timestamp))
    }
}