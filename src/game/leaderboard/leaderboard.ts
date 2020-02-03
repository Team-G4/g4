import { IMode } from "../mode/mode";

export interface ILeaderboardProvider {
    recordDeath: (mode: IMode, lvIndex: number) => Promise<boolean>
    recordSuccess: (mode: IMode, lvIndex: number) => Promise<boolean>
    recordReset: (mode: IMode, lvIndex: number) => Promise<boolean>
}