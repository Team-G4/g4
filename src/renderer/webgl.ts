import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import { PerspectiveCamera, Scene, MeshNormalMaterial, OrthographicCamera } from "three";
import { Level } from "../game/level/level";
import { IRenderer } from "./renderer";

export class WGLRenderer implements IRenderer {
    public scene: Scene
    public camera: OrthographicCamera

    public mat = new MeshNormalMaterial()

    public wglRenderer = new WebGLRenderer({
        antialias: true
    })

    public level: Level

    constructor() {
    }

    get domElement(): HTMLCanvasElement {
        return this.wglRenderer.domElement
    }

    updateSize(w: number, h: number) {
        this.camera = new OrthographicCamera(
            -w / 2, w / 2, h / 2, -h / 2, 0.01, 10000
        )
        this.camera.position.z = 500

        this.wglRenderer.setSize(w, h)
    }

    initLevel(level: Level) {
        this.level = level

        this.scene = new Scene()
        this.scene.scale.y = -1

        this.scene.add(
            this.level.createThreeObject(
                this.mat
            )
        )
    }

    render(timestamp: DOMHighResTimeStamp) {
        this.level.refreshThreeObject()
        this.level.advance(1/300)

        this.wglRenderer.render(
            this.scene, this.camera
        )
    }
}