import Link from "next/link"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { HomeIcon, NewspaperIcon, ClubIcon, BriefcaseIcon, CpuIcon, MenuIcon } from "lucide-react"
import { MyAccountDropdown } from "./MyAccountDropdown"
export function Navigation() {
  return (
      <header className="bg-background border-b px-4 flex items-center justify-between    h-14 sm:h-16 fixed top-0 w-full z-10">
        <Link href="#" className="flex items-center gap-1" prefetch={false}>
          <NewspaperIcon className="h-6 w-6" />
          <div>
          <span className="text-lg font-bold text-gray-100">de</span>
          <span className='text-teal-500 text-lg font-bold'>fact</span>
          </div>
        </Link>
        <div className="flex items-center gap-4 mx-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="md:hidden text-muted-foreground">
              <nav className="grid gap-4 py-6">
                <Link href="/" className="flex items-center gap-2 text-lg font-medium" prefetch={false}>
                  <HomeIcon className="h-5 w-5" />
                  Browse Factoids
                  </Link>
                <Link href="/fact-check" className="flex items-center gap-2 text-lg font-medium" prefetch={false}>
                  <NewspaperIcon className="h-5 w-5" />
                  FactCheck
                  </Link>
                <Link href="#" className="flex items-center gap-2 text-lg font-medium" prefetch={false}>
                  <CpuIcon className="h-5 w-5" />
                  Help &amp; FAQ
                  </Link>
              </nav>

              <div className="fixed w-full bottom-8 z-20 flex items-center gap-4">
                <MyAccountDropdown  />

              </div>
            </SheetContent>
          </Sheet>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Browse Factoids
            </Link>
            <Link href="/fact-check" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            FactCheck
            </Link>
            <Link href="#" onClick={(e) => alert('Coming Soon... If you need immediate support, email sam@defact.org and an engineer will assist you')} className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Help &amp; FAQ
            </Link>
          </nav>
        </div>
        <div className="hidden md:flex items-end gap-4">
          <MyAccountDropdown />
        </div>

      </header>
    )
}