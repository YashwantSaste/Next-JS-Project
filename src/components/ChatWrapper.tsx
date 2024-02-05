import Message from "./Message"
import ChatField from "./ChatField"
const ChatWrapper = () => {
  return (
    <div className="relative min-h-full bg-zinc-50 divide-y divide-zinc-200 flex flex-col justify-between gap-2">
      <div className="flex-1 justify-between flex flex-col mb-28">
        <Message/>
      </div>
       <ChatField/>
    </div>
  )
}

export default ChatWrapper