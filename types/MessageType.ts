export interface MessageType<T = any> {
    dataType: string,
    method: string,
    data: T
}

export default MessageType