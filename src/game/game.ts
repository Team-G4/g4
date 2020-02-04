import { InputMethod, InputAction } from "../input/input";
import { IMode } from "./mode/mode";
import { Level } from "./level/level";

/**
 * Represents a game
 */
export class Game {
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