import { InputMethod, InputAction } from "./input"
import WebMidi, { InputEventNoteon } from "webmidi"
import { ISettingsManager } from "../settings/manager"
import { Settings } from "../settings/settings"

/**
 * MIDI input
 */
export class MIDIInputMethod extends InputMethod {
    /**
     * Creates a MIDI input handler
     */
    constructor(
        settings: Settings
    ) {
        super()

        WebMidi.enable((err) => {
            if (err) return // Oh well, sad

            const input = WebMidi.inputs[0]
            input.addListener("noteon", "all", (e) => this.onNote(e))
        }, true)
    }

    onNote(event: InputEventNoteon) {
        if (event.note.name === "C") this.emit("input", InputAction.cannonShoot)
    }
}