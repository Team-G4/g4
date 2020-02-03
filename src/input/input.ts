import { EventEmitter } from "../util/events";

export enum InputAction {
    cannonShoot,
    slowModeEnable,
    slowModeDisable
}

/**
 * Represents an input method
 */
export class InputMethod extends EventEmitter {
}