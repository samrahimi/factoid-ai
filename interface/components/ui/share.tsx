import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function Share({url, title, snippet}) {
  const [copied, setCopied] = useState(false)
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${url}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const handleTweetContent = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?url=${url}&text=${snippet}`
    window.open(tweetUrl, "_blank")
  }
  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${snippet}`
    window.open(facebookUrl, "_blank")
  }
  const handleShareMessenger = () => {
    const messengerUrl = `https://www.facebook.com/dialog/send?link=${url}`
    window.open(messengerUrl, "_blank")
  }
  const handleShareWhatsApp = () => {
    const whatsAppUrl = `https://api.whatsapp.com/send?text=${snippet}&${url}`
    window.open(whatsAppUrl, "_blank")
  }
  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-muted-foreground bg-background">
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-muted text-muted-foreground">
        <DialogHeader>
          <DialogTitle className="text-muted-foreground">Share This Factoid</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Share this Factoid on your favorite platforms.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <LinkIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none text-muted-foreground">${url}</p>
                <p className="text-sm text-muted-foreground">Copy link</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyLink}
              className={`rounded-full ${
                copied ? "bg-green-500 text-green-50 hover:bg-green-600" : "hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              {copied ? (
                <CheckIcon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <CopyIcon className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <TwitterIcon className="h-5 w-5 text-[#1DA1F2] text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none text-muted-foreground">Tweet</p>
                <p className="text-sm text-muted-foreground">Share on Twitter</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleTweetContent}
              className="rounded-full hover:bg-muted/50 text-muted-foreground"
            >
              <ExternalLinkIcon className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <FacebookIcon className="h-5 w-5 text-[#4267B2] text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none text-muted-foreground">Facebook</p>
                <p className="text-sm text-muted-foreground">Share on Facebook</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShareFacebook}
              className="rounded-full hover:bg-muted/50 text-muted-foreground"
            >
              <ExternalLinkIcon className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <MessagesSquareIcon className="h-5 w-5 text-[#0084FF] text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none text-muted-foreground">Messenger</p>
                <p className="text-sm text-muted-foreground">Share on Messenger</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShareMessenger}
              className="rounded-full hover:bg-muted/50 text-muted-foreground"
            >
              <ExternalLinkIcon className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <PhoneIcon className="h-5 w-5 text-[#25D366] text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none text-muted-foreground">WhatsApp</p>
                <p className="text-sm text-muted-foreground">Share on WhatsApp</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShareWhatsApp}
              className="rounded-full hover:bg-muted/50 text-muted-foreground"
            >
              <ExternalLinkIcon className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}


function CopyIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}


function ExternalLinkIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  )
}


function FacebookIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}


function LinkIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}


function MessagesSquareIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z" />
      <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
    </svg>
  )
}


function PhoneIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}


function TwitterIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}