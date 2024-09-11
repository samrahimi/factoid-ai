'use client'
import { useRouter } from "next/navigation"

import { useEffect, useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogIn,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabaseClient"

export const MyAccountDropdown = ({isSideMenu}) => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
    const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: session } = await supabase.auth.getSession()
      if (session?.session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.session.user.id)
          .single()
        setProfile(profile)
      }
      setLoading(false)
    }
    fetchProfile()
  }, [profile])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {profile ? (
          <div className="flex items-center gap-5 max-w-80 p-2 bg-background cursor-pointer">
            <img src={profile.avatar_url || '/placeholder.svg'} alt="User Avatar" className="h-8 w-8 rounded-full" />
            <span className="font-semibold text-teal-500">{profile.username}</span>
          </div>
        ) : (
          <Button className={isSideMenu? "text-lg text-yellow-300": "text-yellow-300"} variant="outline">
            <LogIn className="mr-2 h-4 w-4" />
            Login / Signup
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {profile ? (
          <>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/auth/edit-profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/fact-check/my-reports')}>
                <Keyboard className="mr-2 h-4 w-4" />
                <span>My Factoids</span>
                <DropdownMenuShortcut>⌘F</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/auth/logout')}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
                <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => router.push('/auth?state=login')}>
              <LogIn className="mr-2 h-4 w-4" />
              <span>Login</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/auth?state=signup')}>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Sign Up</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}