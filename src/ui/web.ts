import { Game } from "../game/game"
import { IVisualRenderer } from "../renderer/renderer"

export function getGameContainer() {
    return document.querySelector("div.gameContainer") as HTMLElement
}

export function prepareViewport(game: Game, renderer: IVisualRenderer) {
    const container = getGameContainer()

    container.appendChild(renderer.domElement)

    updateViewportSize(renderer)

    window.addEventListener("resize", () => {
        updateViewportSize(renderer)
    })
}

export function updateViewportSize(renderer: IVisualRenderer) {
    const size = getGameContainer().getBoundingClientRect()

    renderer.updateSize(
        size.width, size.height
    )
}

export function attachStatEvents(game: Game) {
    game.on("death", () => {
        const deathCounter = document.querySelector("button.deathCount em")

        deathCounter.textContent = (+deathCounter.textContent + 1).toString()
    })
    game.on("level", (index: number) => {
        document.querySelector("button.levelIndex em").textContent = index.toString()
    })
}

export function updateUIColors(game: Game) {
    const root = document.documentElement
    const colors = game.mode.getThemeColors(
        game.level
    )

    root.style.setProperty(
        "--g4-dark3", colors.dim
    )
    root.style.setProperty(
        "--g4-dark2", colors.background
    )
    root.style.setProperty(
        "--g4-dark1", colors.spotlight
    )
    root.style.setProperty(
        "--g4-light1", colors.foreground
    )
    root.style.setProperty(
        "--g4-light2", colors.accent
    )
    root.style.setProperty(
        "--g4-light3", colors.secondaryAccent
    )
}