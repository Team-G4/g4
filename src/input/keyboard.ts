import { InputMethod } from "./input";
import { ISettingsManager } from "../settings/manager";

/**
 * Represents keyboard input
 */
export class KeyboardInputMethod extends InputMethod {
    constructor(
        domTarget: Element,
        settings: ISettingsManager
    ) {
        super()
    }
}