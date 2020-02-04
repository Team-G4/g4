import { IMode } from "../mode/mode";

export type LeaderboardRecord = {
    levelIndex: number
    deathCount: number

    recordDate: Date
}

export interface ILeaderboardProvider {
    getRecord: (mode: IMode) => Promise<LeaderboardRecord>

    recordDeath: (mode: IMode, lvIndex: number) => Promise<boolean>
    recordSuccess: (mode: IMode, lvIndex: number) => Promise<boolean>
    recordReset: (mode: IMode, lvIndex: number) => Promise<boolean>
    recordNewLevel: (mode: IMode, lvIndex: number) => Promise<boolean>
}
