import { InputMethod, InputAction } from "../input/input";

/**
 * Represents a game
 */
export class Game {
    public inputMethods: InputMethod[] = []

    addInput(input: InputMethod) {
        this.inputMethods.push(input)

        input.on("input", (action: InputAction) => {
            this.processInput(action)
        })
    }

    processInput(action: InputAction) {}
}