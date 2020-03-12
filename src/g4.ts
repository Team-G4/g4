import { Game } from "./game/game"
import { IMode } from "./game/mode/mode"
import { IVisualRenderer } from "./renderer/renderer"
import { ISettingsManager } from "./settings/manager"
import { LocalStorageSettingsManager } from "./settings/localStorage"
import { Canvas2DRenderer } from "./renderer/canvas2D/canvas2D"
import { InputMethod } from "./input/input"
import { MouseInputMethod } from "./input/mouse"
import { getGameContainer, prepareViewport, attachStatEvents, updateUIColors, setupEvents, prepModeList } from "./ui/web"
import { WGLRenderer } from "./renderer/webgl/webgl"
import { G4EasyMode } from "./game/mode/legacy/easy"
import { G4NormalMode } from "./game/mode/legacy/normal"
import { G4HardMode } from "./game/mode/legacy/hard"
import { G4ShookMode } from "./game/mode/legacy/shook"
import { G4HellMode } from "./game/mode/legacy/hell"
import { G4ChaosMode } from "./game/mode/legacy/chaos"
import { MIDIInputMethod } from "./input/midi"
import { KeyboardInputMethod } from "./input/keyboard"
import { Settings } from "./settings/settings"

/**
 * The main G4 class
 */
export class G4 {
    /**
     * All modes registered in the game
     */
    public modes: IMode[] = [
        new G4EasyMode(),
        new G4NormalMode(),
        new G4HardMode(),
        new G4HellMode(),
        new G4ChaosMode(),
        new G4ShookMode()
    ]
    /**
     * The game object
     */
    public game: Game

    /**
     * The settings manager
     */
    public settings: Settings

    /**
     * The input methods
     */
    public inputs: InputMethod[]

    async preload(): Promise<void> {
        this.game = new Game(this.settings)
        this.inputs.forEach(i => this.game.addInput(i))

        this.modes.forEach(mode => mode.settings = this.settings)
    }

    async start(): Promise<void> {
        this.game.mode = this.modes[0]
        await this.game.generateLevel(0)
    }
}

export class WebG4 extends G4 {
    public settings = new Settings(
        new LocalStorageSettingsManager()
    )

    public renderer: IVisualRenderer

    public inputs = [
        new KeyboardInputMethod(
            getGameContainer(),
            this.settings
        ),
        new MouseInputMethod(
            getGameContainer()
        ),
        new MIDIInputMethod(null)
    ]

    async preload(): Promise<void> {
        await super.preload()
        await this.settings.init()

        this.renderer = new Canvas2DRenderer()
        prepareViewport(this.game, this.renderer)

        this.game.setRenderer(this.renderer)

        this.game.on("mode", () => {
            updateUIColors(this.game)
            this.game.generateLevel(0)
        })
        
        attachStatEvents(this.game)

        setupEvents()
    }

    async start(): Promise<void> {
        await super.start()
        updateUIColors(this.game)
        prepModeList(this)

        requestAnimationFrame((timestamp) => this.render(timestamp))
    }

    async render(timestamp: DOMHighResTimeStamp): Promise<void> {
        if (this.game.mode.isThemeDynamic)
            updateUIColors(this.game)

        await this.game.advanceAndRender(timestamp)

        requestAnimationFrame((timestamp) => this.render(timestamp))
    }
}