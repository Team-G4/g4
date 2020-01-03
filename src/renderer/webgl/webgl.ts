import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import { PerspectiveCamera, Scene, MeshNormalMaterial, OrthographicCamera, Color, MeshBasicMaterial, MeshLambertMaterial, PointLight, DirectionalLight, Light } from "three";
import { Level } from "../../game/level/level";
import { IRenderer } from "../renderer";
import { WGLRasterizer, IWGLRasterizedPrimitive } from "./rasterizer";
import { IMode } from "../../game/mode/mode";

export class WGLRenderer implements IRenderer {
    public scene: Scene
    public camera: OrthographicCamera

    public mat = new MeshLambertMaterial({
        color: 0xA0A0A0
    })

    public rasterizer = new WGLRasterizer(this.mat)

    public wglRenderer = new WebGLRenderer({
        antialias: true
    })

    public level: Level
    public rasterizedLevel: IWGLRasterizedPrimitive

    public light: Light

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
        this.rasterizedLevel = this.rasterizer.rasterizePrimitive(level.mode, level)

        this.scene = new Scene()
        this.scene.scale.y = -1

        this.scene.background = new Color(0xFFFFFF)

        this.scene.add(
            this.rasterizedLevel.threeObject
        )

        this.light = new DirectionalLight(0xFFFFFF, 1)
        this.light.position.z = 100
        this.scene.add(this.light)
    }

    render(timestamp: DOMHighResTimeStamp) {
        this.level.mode.advance(this.level, 1/300)
        this.rasterizedLevel.update(this.level.mode.isMaterialDynamic)

        this.wglRenderer.render(
            this.scene, this.camera
        )
    }
}