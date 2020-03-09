import { ISettingsManager } from "./manager"

export class LocalStorageSettingsManager implements ISettingsManager {
    async get(setting: string, defaultValue: any): Promise<any> {
        if (await this.exists(setting)) {
            return JSON.parse(localStorage.getItem(setting))
        } else {
            await this.set(setting, defaultValue)
            return defaultValue
        }
    }

    async exists(setting: string): Promise<boolean> {
        return setting in localStorage
    }

    async remove(setting: string): Promise<void> {
        localStorage.removeItem(setting)
    }

    async set(setting: string, value: any): Promise<void> {
        localStorage.setItem(
            setting, JSON.stringify(value)
        )
    }
}
