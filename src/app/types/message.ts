import { AppRouter } from '@/trpc'
import { inferRouterOutputs } from '@trpc/server'

type RouterOutput = inferRouterOutputs<AppRouter>

type Messages = RouterOutput['getFileMessages']['messages']

type OmitText = Omit<Messages[number], 'text'>

type ExtendedText = {
    text: string | JSX.Element,
    id: string; 
    createdAt: Date | String;
    isUserMessage: boolean
}

export type ExtendedMessage = OmitText & ExtendedText