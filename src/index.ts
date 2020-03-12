import { WebG4 } from "./g4"

import "./main.scss"

const g4 = new WebG4()

g4.preload().then(() => {
    document.body.classList.add("loaded");

    document.querySelector("button.startGame").addEventListener("click", () => {
        (document.querySelector("div.loadingScreen") as HTMLDivElement).style.display = "none"
        g4.start()
    });
    
    // Just for playing around
    (window as any).setThemeColor = (color: string, value: string) => {
        g4.settings.setThemeColor(color, value)
    }
});
