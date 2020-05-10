import { Game } from "../game/game"
import { IVisualRenderer } from "../renderer/renderer"
import { G4 } from "../g4"
import { IMode } from "../game/mode/mode"

export function setupEvents() {
    document.querySelector("button.modeSelect").addEventListener("click", () => {
        (document.querySelector("dialog.modeSelect") as HTMLDialogElement).showModal()
    })

    document.querySelectorAll("dialog").forEach(dialog => {
        dialog.addEventListener("click", (e) => {
            const rect = dialog.getBoundingClientRect()
            const inDialog = (
                e.clientX >= rect.left && e.clientY >= rect.top &&
                e.clientX < rect.left + rect.width && e.clientY < rect.top + rect.height
            )

            if (!inDialog) dialog.close()
        })
    })
}

export function prepModeList(g4: G4) {
    let categories: {
        [prop: string]: IMode[]
    } = {}

    g4.modes.forEach(mode => {
        if (!(mode.category in categories))
            categories[mode.category] = []

        categories[mode.category].push(mode)
    })

    const container = document.querySelector("dialog.modeSelect")
    container.innerHTML = ""

    Object.keys(categories).forEach(catName => {
        const section = document.createElement("section")

        section.innerHTML = `<header>${catName}</header>`

        categories[catName].forEach(mode => {
            const modeSwitch = document.createElement("button")
            modeSwitch.classList.toggle("active", mode === g4.game.mode)

            modeSwitch.textContent = mode.name

            modeSwitch.addEventListener("click", () => {
                g4.game.mode = mode

                container.querySelector("button.active").classList.remove("active")
                modeSwitch.classList.add("active")

                document.querySelector("button.modeSelect").innerHTML = `${catName} <em>${mode.name}</em>`
            })

            section.appendChild(modeSwitch)
        })

        container.appendChild(section)
    })

    document.querySelector("button.modeSelect").innerHTML = `${g4.game.mode.category} <em>${g4.game.mode.name}</em>`
}

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

export async function updateLeaderboardStats(game: Game) {
    const record = await game.leaderboard.getRecord(game.mode)

    let hiScore = 0
    let deathCount = 0
    if (record) {
        hiScore = record.levelIndex
        deathCount = record.deathCount
    }

    const deathCounter = document.querySelector("button.deathCount em")
    const hiScoreCounter = document.querySelector("button.recordStat em")

    deathCounter.textContent = deathCount.toString()
    hiScoreCounter.textContent = hiScore.toString()
}

export function attachStatEvents(game: Game) {
    game.on("death", () => {
        const deathCounter = document.querySelector("button.deathCount em")

        deathCounter.textContent = (+deathCounter.textContent + 1).toString()

        updateLeaderboardStats(game)
    })
    game.on("level", (index: number) => {
        document.querySelector("button.levelIndex em").textContent = index.toString()
        updateLeaderboardStats(game)
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