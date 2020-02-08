export type EasingFunction = (coeff: number) => number

export let inverseEasing: EasingFunction = (coeff: number): number => {
    return 1 - coeff
}

export let linearEasing: EasingFunction = (coeff: number): number => {
    return coeff
}

export function exponentEasing(exp: number): EasingFunction {
    return (coeff: number): number => {
        return coeff ** exp
    }
}

export function compositeEasing(...easings: EasingFunction[]): EasingFunction {
    return (coeff: number): number => {
        easings.forEach(easing => coeff = easing(coeff))
        return coeff
    }
}

export function remapDTime(
    dTime: number, levelTime: number,
    easingFunction: EasingFunction
): {
    dTime: number, levelTime: number
} {
    let intPart = Math.floor(levelTime)
    let presentFractLevelTime = levelTime - intPart
    let pastFractLevelTime = presentFractLevelTime - dTime

    presentFractLevelTime = easingFunction(presentFractLevelTime)
    if (pastFractLevelTime < 0)
        pastFractLevelTime = easingFunction(pastFractLevelTime + 1) - 1
    else
        pastFractLevelTime = easingFunction(pastFractLevelTime)

    return {
        dTime: presentFractLevelTime - pastFractLevelTime,
        levelTime: intPart + presentFractLevelTime
    }
}