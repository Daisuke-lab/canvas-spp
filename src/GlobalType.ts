export interface RefType<T> {
    current: T
}


export interface LocationType {
    x: number,
    y: number
}

export interface BoxType {
    width: number | string,
    height: number | string
}


export type ConnectionOptionType = "one" | "many" | "one-or-many" | "only-one" | "zero-or-many" | "zero-or-one" | "normal"