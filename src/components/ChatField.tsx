import { Send } from "lucide-react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { useContext , useRef} from "react"
import { ChatContext } from "@/context/ChatContext"

interface ChatFiledProps {
  isDisabled?: boolean
}

const ChatField = ({isDisabled}:ChatFiledProps) => {
  const {addMessage,handleInputChange,isLoading,message} =useContext(ChatContext)

  const textareaRef= useRef<HTMLTextAreaElement>(null)
  return (
    <div className="absolute bottom-0 left-0 w-full">
      <form className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea rows={1} maxRows={4}  autoFocus placeholder="Enter your question"
              ref={textareaRef}
              onChange={handleInputChange}
              value={message}
              onKeyDown={(event)=>{
                if(event.key==="Enter" && !event.shiftKey){
                  event.preventDefault()
                  addMessage()
                  textareaRef.current?.focus()
                }
              }}
              className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch`"
              />
              <Button aria-label="send-message"
              className="absolute bottom-1.5 right-[8px]"
              disabled={isLoading || isDisabled}
              type="submit"
              onClick={(event)=>{
                event.preventDefault()
                addMessage()
                textareaRef.current?.focus()
              }}
              >
                <Send className="h-4 w-4"/>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )

}

export default ChatField