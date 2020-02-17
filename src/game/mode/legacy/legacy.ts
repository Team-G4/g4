import { IMode, ModeThemeColors, PrimitiveMaterial } from "../mode";
import { Level } from "../../level/level";
import { IPrimitive } from "../../level/primitives/primitives";
import { Cannon, Bullet } from "../../level/cannon";
import { BarPrimitive } from "../../level/primitives/bar";
import { Ring } from "../../level/ring";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

export class G4LegacyMode implements IMode {
    public modeID = ""
    public category = "G4 Legacy"
    public name = ""
    
    public isMaterialDynamic = false
    public isThemeDynamic = false
    
    getThemeColors(level: Level): ModeThemeColors {
        return {
            background: "#1A2320",
            dim: "#151918",
            spotlight: "#202E22",

            foreground: "#F0EFE0",
            accent: "#CAEC12",
            secondaryAccent: "#52CF12"
        }
    }

    getMaterial(prim: IPrimitive): PrimitiveMaterial {
        const colors = this.getThemeColors(prim.ring.level)

        let color = colors.accent

        if (prim instanceof Cannon) color = colors.foreground
        else if (prim instanceof BarPrimitive) color = colors.secondaryAccent

        return {
            color
        }
    }

    getBulletMaterial(bullet: Bullet): PrimitiveMaterial {
        const colors = this.getThemeColors(
            bullet.source.ring.level
        )

        return {
            color: colors.foreground
        }
    }


    getEffectPass() {
        return new ShaderPass({
            uniforms: {
                "tDiffuse": {value: null}
            },
            vertexShader: `
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    
                    gl_Position = projectionMatrix *
                                  modelViewMatrix *
                                  vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                varying vec2 vUv;

                void main() {
                    gl_FragColor = texture2D(
                        tDiffuse, vUv
                    );
                }
            `
        })
    }

    generateLevel(index: number): Level {
        const level = new Level(this, index)

        const cannonRing = new Ring(
            level, 1, 0, 0, 0, null
        )

        cannonRing.add(
            new Cannon(
                cannonRing, 0, 0, 0, -1
            )
        )

        level.add(cannonRing)

        return level
    }

    advance(level: Level, dTime: number) {
        level.advance(dTime)
    }
}