import { WebG4 } from "./g4"

import WebMidi, { Input } from "webmidi"

import "./main.scss"

const g4 = new WebG4()

g4.preload().then(() => {
    g4.start()
})
