import { InputMethod, InputAction } from "./input";

export class MouseInputMethod extends InputMethod {
    constructor(
        domElement: HTMLElement
    ) {
        super()

        domElement.addEventListener("click", () => {
            this.emit("input", InputAction.cannonShoot)
        })
    }
}