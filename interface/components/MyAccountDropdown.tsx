import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
//import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
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
import { useEffect, useState } from "react"
import { Router } from "lucide-react"
export const MyAccountDropdown = () => {
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: session } = await supabase.auth.getSession()
            if (!session) {
                return;
            }
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session?.session?.user?.id)
                .single()    
            setProfile(profile)
        }
        fetchProfile()
    }, [])
    
  return (
 profile ? (
    <DropdownMenu>
    <DropdownMenuTrigger>    
           <div className="flex items-center gap-5 max-w-80 p-2 bg-background">
                  <img src={profile.avatar_url} alt="User Avatar" className="h-8 w-8 rounded-full" />
                  <span className="font-semibold">{profile.username}</span>
                </div>
  
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem onClick={(e) => location.href='/auth/edit-profile'}>
        <User className="mr-2 h-4 w-4" />
        <span>Profile Settings</span>
        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={(e) => location.href='/fact-check/my-reports'}>
        <Keyboard className="mr-2 h-4 w-4" />
        <span>My Factoids</span>
        <DropdownMenuShortcut>⌘F</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={(e) => location.href='/auth/logout'}>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log Out</span>
        <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    </DropdownMenuContent>

  </DropdownMenu>
  

): <div>Loading...</div>
)

}