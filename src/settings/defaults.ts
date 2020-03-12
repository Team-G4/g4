import { SettingsControlScheme, SettingsTheme } from "./settings";
import dark from "./defaultThemes/dark";

export const defaultControlScheme: SettingsControlScheme = {
    name: "Default",

    keybinds: {
        cannonShoot: "Space",
        slowModeEnable: "KeyS"
    },

    mousebinds: {
        cannonShoot: "primary",
        slowModeEnable: null
    },

    midiEnabled: false,
    midibinds: {
        cannonShoot: "C",
        slowModeEnable: "F#"
    },

    gamepadEnabled: false,
    gamepadbinds: {
        cannonShoot: null,
        slowModeEnable: null
    }
}

export const defaultThemes: SettingsTheme[] = [
    dark
]