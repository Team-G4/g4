import { EventEmitter } from "../util/events"

/**
 * An action triggered by the input
 */
export enum InputAction {
    /**
     * The "shoot" action
     */
    cannonShoot,
    /**
     * The "enable slow mode" action
     */
    slowModeEnable
}

export type InputBinds = {
    cannonShoot: string,
    slowModeEnable: string
}

/**
 * Represents an input method
 */
export class InputMethod extends EventEmitter {
}