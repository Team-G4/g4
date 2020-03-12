import { WebG4 } from "./g4"

import WebMidi, { Input } from "webmidi"

import "./main.scss"
import { LocalStorageSettingsManager } from "./settings/localStorage"

const g4 = new WebG4()

g4.preload().then(() => {
    g4.start();
    
    // Just for playing around
    (window as any).setThemeColor = (color: string, value: string) => {
        g4.settings.setThemeColor(color, value)
    }
});
