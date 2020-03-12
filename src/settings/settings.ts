import { ISettingsManager } from "./manager";
import { InputBinds } from "../input/input";
import { defaultControlScheme, defaultThemes } from "./defaults";

export type SettingsControlScheme = {
    name: string

    keybinds: InputBinds
    mousebinds: InputBinds

    midiEnabled: boolean
    midibinds: InputBinds

    gamepadEnabled: boolean
    gamepadbinds: InputBinds
}

export type SettingsTheme = {
    name: string

    colors: {
        [prop: string]: string
    }
}

export type SettingsLocalLeaderboardEntry = {
    modeId: string

    level: number
    deathCount: number
}

export type G4Settings = {
    controlSchemes: SettingsControlScheme[]
    currentControlScheme: number

    themes: SettingsTheme[]
    currentTheme: number

    localLeaderboard: SettingsLocalLeaderboardEntry[]
}

export class Settings {
    public cachedSettings: G4Settings = {} as G4Settings

    constructor(
        public manager: ISettingsManager
    ) {}

    async init() {
        if (true) // Right now it will reset the settings every launch
            await this.setupSettings()
        
        const keys = [
            "controlSchemes", "currentControlScheme",
            "themes", "currentTheme",
            "localLeaderboard"
        ]
        const values = await Promise.all(
            keys.map(k => this.manager.get(k, null))
        )

        keys.forEach((k, i) => (this.cachedSettings as any)[k] = values[i])
    }

    async setupSettings() {
        await Promise.all([
            this.manager.set("controlSchemes", [defaultControlScheme]),
            this.manager.set("currentControlScheme", 0),

            this.manager.set("themes", defaultThemes),
            this.manager.set("currentTheme", 0),
            
            this.manager.set("localLeaderboard", []),

            this.manager.set("g4settings", true)
        ])
    }

    async updateSettings() {
        const keys = [
            "controlSchemes", "currentControlScheme",
            "themes", "currentTheme",
            "localLeaderboard"
        ]

        await Promise.all(
            keys.map(
                k => this.manager.set(k, (this.cachedSettings as any)[k])
            )
        )
    }

    getThemeColor(color: string, themeIndex: number = null) {
        return this.cachedSettings.themes[
            themeIndex ?? this.cachedSettings.currentTheme
        ].colors[color]
    }

    async setThemeColor(color: string, value: string, themeIndex: number = null) {
        this.cachedSettings.themes[
            themeIndex ?? this.cachedSettings.currentTheme
        ].colors[color] = value

        await this.updateSettings()
    }
}