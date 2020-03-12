import { InputMethod, InputAction, InputBinds } from "./input"
import { Settings } from "../settings/settings"

const defaultKeybinds: InputBinds = {
    cannonShoot: "Space",
    slowModeEnable: "KeyS"
}

/**
 * Keyboard input method <def not complete>
 */
export class KeyboardInputMethod extends InputMethod {
    public keybinds: InputBinds = {
        cannonShoot: "Space",
        slowModeEnable: "KeyS"
    }
    public evtCallback = (e: KeyboardEvent) => {
        this.handleEvent(e)
    }
    
    constructor(
        domTarget: HTMLElement,
        settings: Settings
    ) {
        super()

        this.loadKeybinds(settings).then(
            () => this.setupEvents(domTarget)
        )
    }

    handleEvent(e: KeyboardEvent) {
        if (e.code === this.keybinds.cannonShoot) {
            this.emit("input", InputAction.cannonShoot)
        } else if (e.code === this.keybinds.slowModeEnable) {
            this.emit("input", InputAction.slowModeEnable)
        }
    }

    setupEvents(domTarget: HTMLElement) {
        window.addEventListener("keydown", this.evtCallback)
    }

    async loadKeybinds(settings: Settings) {
        //todo
    }
}