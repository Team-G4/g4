import { Object3D } from "three";

type SerializedPrimitiveValue = number | boolean | string | SerializedPrimitive

type SerializedPrimitive = {
    [prop: string]: SerializedPrimitiveValue
}

export interface IPrimitive {
    hash: string

    serialize: () => SerializedPrimitive

    threeObject: Object3D
    refreshThreeObject: (o: Object3D) => void
}