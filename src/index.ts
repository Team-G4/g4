import { WebG4 } from "./g4"

import "./main.scss"

let g4 = new WebG4()

g4.preload().then(() => {
    g4.start()
})
