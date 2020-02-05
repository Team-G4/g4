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
}