import { ObjectType } from "../../types/ObjectType"

export function removeBlank(inputs:object) {
    const newInputs = {} as ObjectType
    Object.keys(inputs).map((key) => {
        if (key !== "") {
            newInputs[key] = inputs[key as keyof typeof inputs]
        }
    })
    return newInputs
}

export function removeNull(inputs:object) {
    const newInputs = {} as ObjectType
    Object.keys(inputs).map((key) => {
        if (key !== null) {
            newInputs[key] = inputs[key as keyof typeof inputs]
        }
    })
    return newInputs

}

export function removeBlankAndNull(inputs:object) {
    const newInputs = {} as ObjectType
    Object.keys(inputs).map((key) => {
        if (key !== null && key !== "") {
            newInputs[key] = inputs[key as keyof typeof inputs]
        }
    })
    return newInputs
}