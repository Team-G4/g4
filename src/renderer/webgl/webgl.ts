import { WebGLRenderer } from "three/src/renderers/WebGLRenderer"
import { Scene, OrthographicCamera, Color, MeshLambertMaterial } from "three"
import { Level } from "../../game/level/level"
import { IVisualRenderer } from "../renderer"
import { WGLRasterizer, IWGLRasterizedPrimitive } from "./rasterizer"

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass"

export class WGLRenderer implements IVisualRenderer {
    public scene: Scene
    public camera = new OrthographicCamera(
        -1, 1, 1, -1, 0.01, 10000
    )

    public mat = new MeshLambertMaterial({
        color: 0xA0A0A0
    })

    public rasterizer = new WGLRasterizer()

    public wglRenderer = new WebGLRenderer({
        antialias: true
    })
    public wglComposer: EffectComposer

    public level: Level
    public rasterizedLevel: IWGLRasterizedPrimitive

    public lastScaleFactor: number

    get domElement(): HTMLCanvasElement {
        return this.wglRenderer.domElement
    }

    rescaleLevel() {
        const w = this.wglRenderer.domElement.width
        const h = this.wglRenderer.domElement.height
        const scaleFactor = this.level ? this.level.getScaleFactor(
            Math.min(w, h)
        ) : 1

        if (!this.lastScaleFactor)
            this.lastScaleFactor = scaleFactor
        else
            this.lastScaleFactor = 0.5 * scaleFactor + 0.5 * this.lastScaleFactor

        if (this.scene)
            this.scene.scale.set(
                this.lastScaleFactor, -this.lastScaleFactor, this.lastScaleFactor
            )
    }

    updateSize(w: number, h: number) {
        this.camera.left = -w / 2
        this.camera.right = w / 2
        this.camera.top = h / 2
        this.camera.bottom = -h / 2
        this.camera.updateProjectionMatrix()

        this.camera.position.z = 500

        this.wglRenderer.setSize(w, h)
        
        this.rescaleLevel()
    }

    initLevel(level: Level) {
        if (this.rasterizedLevel) this.rasterizedLevel.dispose()
        
        this.level = level
        this.rasterizedLevel = this.rasterizer.rasterize(level.mode, level)

        this.scene = new Scene()
        this.scene.scale.y = -1

        this.scene.add(
            this.rasterizedLevel.threeObject
        )

        this.wglComposer = new EffectComposer(
            this.wglRenderer
        )

        const renderPass = new RenderPass(
            this.scene, this.camera
        )
        const fxPass = level.mode.getEffectPass()

        this.wglComposer.addPass(renderPass)
        this.wglComposer.addPass(fxPass)
    }

    render(dTime: number) {
        this.rescaleLevel()

        this.level.mode.advance(this.level, dTime)
        this.rasterizedLevel.update(this.level.mode.isMaterialDynamic)
        
        this.wglComposer.render()
    }
}