import TextStyleType from "./TextStyleType"

export interface TextType {
    id: string,
    content: string,
    style: TextStyleType,
    updatedBy: string
}

export default TextType