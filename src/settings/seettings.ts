import { ISettingsManager } from "./manager";
import { InputBinds } from "../input/input";

export type SettingsControlScheme = {
    name: string

    keybinds: InputBinds
    mousebinds: InputBinds
    midibinds: InputBinds
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

/*
    G4 settings structure

    {
        controlSchemes: SettingsControlScheme[]
        currentControlScheme: number

        themes: SettingsTheme[]
        currentTheme: number

        localLeaderboard: SettingsLocalLeaderboardEntry[]
    }
*/

export class Settings {
    constructor(
        public manager: ISettingsManager
    ) {}
}