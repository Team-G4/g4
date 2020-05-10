import { ILeaderboardProvider, LeaderboardRecord } from "./leaderboard"
import { IMode } from "../mode/mode";
import { ISettingsManager } from "../../settings/manager";

export class LocalLeaderboardProvider implements ILeaderboardProvider {
    constructor(
        public settings: ISettingsManager
    ) {}

    getRecordPath(mode: IMode) {
        return `g4.localLeaderboard.${mode.modeID}`
    }

    async getRecord(mode: IMode): Promise<LeaderboardRecord> {
        const record: LeaderboardRecord = await this.settings.get(this.getRecordPath(mode), null)
        if (!record) return null

        record.recordDate = new Date(record.recordDate)

        return record
    }

    async storeRecord(mode: IMode, record: LeaderboardRecord) {
        record.recordDate = new Date()

        console.log(record)

        await this.settings.set(this.getRecordPath(mode), record)
    }

    async recordDeath(mode: IMode, lvIndex: number): Promise<boolean> {
        const currentRecord = await this.getRecord(mode)

        if (currentRecord) {
            currentRecord.deathCount++
            await this.storeRecord(mode, currentRecord)
        } else {
            await this.storeRecord(
                mode, {
                    deathCount: 1,
                    levelIndex: lvIndex,
                    recordDate: new Date()
                }
            )
        }

        return true
    }

    async recordSuccess(mode: IMode, lvIndex: number): Promise<boolean> {
        const currentRecord = await this.getRecord(mode)

        if (currentRecord && currentRecord.levelIndex < lvIndex) {
            currentRecord.levelIndex = lvIndex
            await this.storeRecord(mode, currentRecord)
        } else if (!currentRecord) {
            await this.storeRecord(
                mode, {
                    deathCount: 0,
                    levelIndex: lvIndex,
                    recordDate: null
                }
            )
        }

        return true
    }

    async recordReset(mode: IMode, lvIndex: number): Promise<boolean> {
        const currentRecord = await this.getRecord(mode)

        if (currentRecord) {
            currentRecord.levelIndex = 0
            currentRecord.deathCount = 0
            await this.storeRecord(mode, currentRecord)
        } else {
            await this.storeRecord(
                mode, {
                    deathCount: 0,
                    levelIndex: 0,
                    recordDate: null
                }
            )
        }

        return true
    }

    async recordNewLevel(mode: IMode, lvIndex: number): Promise<boolean> {
        return await this.recordSuccess(mode, lvIndex)
    }
}