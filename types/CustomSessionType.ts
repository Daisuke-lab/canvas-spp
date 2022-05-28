
import Session from "next-auth"

type SessionType = typeof Session
export interface CustomSessionType extends SessionType {
    id: string,
    accessToken: string
}

