import { InputMethod, InputAction } from "../input/input";
import { IMode } from "./mode/mode";
import { Level } from "./level/level";
import { IRenderer } from "../renderer/renderer";
import { ILeaderboardProvider } from "./leaderboard/leaderboard";
import { EventEmitter } from "../util/events";
import { BeatingHeart } from "../util/heart";

/**
 * Represents a game
 */
export class Game extends EventEmitter {
    /**
     * The list of all input methods in use by the game
     */
    public inputMethods: InputMethod[] = []

    /**
     * The current game mode
     */
    public mode: IMode
    /**
     * The current level
     */
    public level: Level

    /**
     * The current level renderer
     */
    public renderer: IRenderer

    /**
     * The leaderboard service
     */
    public leaderboard: ILeaderboardProvider

    /**
     * A little timer used for smooth level transitions
     */
    public gameTime = 0
    /**
     * A heart beating at nice 999999 BPM
     */
    public heart = new BeatingHeart()

    /**
     * Set the current game renderer
     * @param renderer - the renderer
     */
    setRasterizer(renderer: IRenderer) {
        this.renderer = renderer

        if (this.level)
            renderer.initLevel(this.level)
    }
    
    /**
     * Generate a level
     * @param levelIndex - the level number
     */
    async generateLevel(levelIndex: number) {
        this.level = this.mode.generateLevel(levelIndex)
        this.level.advance(this.gameTime) // s m o o t h

        this.emit("level", levelIndex)

        if (this.renderer)
            this.renderer.initLevel(this.level)
        
        if (this.leaderboard)
            await this.leaderboard.recordNewLevel(
                this.mode, levelIndex
            )
    }

    /**
     * Registers a "death" and resets game progress
     */
    async death() {
        await this.generateLevel(0)

        if (this.leaderboard)
            await this.leaderboard.recordDeath(
                this.mode, this.level.index
            )
    }

    /**
     * Proceeds to the next level
     */
    async nextLevel() {
        await this.generateLevel(this.level.index + 1)

        if (this.leaderboard)
            await this.leaderboard.recordNewLevel(
                this.mode, this.level.index
            )
    }

    /**
     * Render the level and advance the physics
     * @param timestamp - the timestamp from requestAnimationFrame
     */
    async advanceAndRender(timestamp: DOMHighResTimeStamp) {
        if (!this.renderer || !this.level) return

        let dTime = this.heart.beat(timestamp)
        this.gameTime += dTime

        this.renderer.render(dTime)

        if (this.level.isBulletColliding()) {
            await this.death()
        } else if (this.level.areBulletsOutside()) {
            await this.nextLevel()
        }
    }

    /**
     * Adds an input method to the game
     * @param input - the InputMethod object
     */
    addInput(input: InputMethod) {
        this.inputMethods.push(input)

        input.on("input", (action: InputAction) => {
            this.processInput(action)
        })
    }

    /**
     * Does logic to the input
     * @param action - the action triggered by the input method
     */
    processInput(action: InputAction) {
        switch (action) {
            case InputAction.cannonShoot:
                this.level.shoot()
                console.log(this.level.bullets)
                break
        }
    }
}