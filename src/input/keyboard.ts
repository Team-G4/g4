import { InputMethod, InputAction, InputBinds } from "./input"
import { ISettingsManager } from "../settings/manager"

const defaultKeybinds: InputBinds = {
    cannonShoot: "Space",
    slowModeEnable: "KeyS"
}

/**
 * Keyboard input method <def not complete>
 */
export class KeyboardInputMethod extends InputMethod {
    public keybinds: InputBinds
    public evtCallback = (e: KeyboardEvent) => {
        this.handleEvent(e)
    }
    
    constructor(
        domTarget: HTMLElement,
        settings: ISettingsManager
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

    async loadKeybinds(settings: ISettingsManager) {
        if (await settings.exists("keybinds")) {
            this.keybinds = await settings.get("keybinds", defaultKeybinds)
        } else {
            this.keybinds = defaultKeybinds
            await settings.set("keybinds", this.keybinds)
        }
    }
}