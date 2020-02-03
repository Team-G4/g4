import { InputMethod, InputAction } from "../input/input";
import { IMode } from "./mode/mode";
import { Level } from "./level/level";

/**
 * Represents a game
 */
export class Game {
    public inputMethods: InputMethod[] = []

    public mode: IMode
    public level: Level

    addInput(input: InputMethod) {
        this.inputMethods.push(input)

        input.on("input", (action: InputAction) => {
            this.processInput(action)
        })
    }

    processInput(action: InputAction) {
        switch (action) {
            case InputAction.cannonShoot:
                this.level.shoot()
                console.log(this.level.bullets)
                break
        }
    }
}