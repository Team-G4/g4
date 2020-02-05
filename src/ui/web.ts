import { Game } from "../game/game";
import { IVisualRenderer } from "../renderer/renderer";

export namespace UI {
    export function getGameContainer() {
        return document.querySelector("div.gameContainer") as HTMLElement
    }

    export function prepareViewport(game: Game, renderer: IVisualRenderer) {
        let container = getGameContainer()

        container.appendChild(renderer.domElement)

        updateViewportSize(renderer)

        window.addEventListener("resize", () => {
            updateViewportSize(renderer)
        })
    }

    export function updateViewportSize(renderer: IVisualRenderer) {
        let size = getGameContainer().getBoundingClientRect()

        renderer.updateSize(
            size.width, size.height
        )
    }

    export function attachStatEvents(game: Game) {
        game.on("death", () => {
            let deathCounter = document.querySelector("button.deathCount em")

            deathCounter.textContent = (+deathCounter.textContent + 1).toString()
        })
        game.on("level", (index: number) => {
            document.querySelector("button.levelIndex em").textContent = index.toString()
        })
    }
}