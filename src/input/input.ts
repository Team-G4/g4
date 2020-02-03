import { EventEmitter } from "../util/events";

export enum InputAction {
    cannonShoot,
    slowModeEnable,
    slowModeDisable
}

export type InputBinding = {
    action: InputAction
    input: any
}

/**
 * Represents an input method
 */
export class InputMethod extends EventEmitter {
    public bindings: InputBinding[] = []
}