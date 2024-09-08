import Link from "next/link"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { HomeIcon, NewspaperIcon, ClubIcon, BriefcaseIcon, CpuIcon, MenuIcon } from "lucide-react"
export function Navigation() {
  return (
      <header className="bg-background border-b px-4 flex items-center justify-between  h-14 sm:h-16">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <NewspaperIcon className="h-6 w-6" />
          <span className="text-lg font-bold">defact</span>
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
                <Link href="#" className="flex items-center gap-2 text-lg font-medium" prefetch={false}>
                  <HomeIcon className="h-5 w-5" />
                  Home
                </Link>
                <Link href="#" className="flex items-center gap-2 text-lg font-medium" prefetch={false}>
                  <NewspaperIcon className="h-5 w-5" />
                  News
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-medium text-muted-foreground"
                  prefetch={false}
                >
                  <ClubIcon className="h-5 w-5" />
                  Sports
                </Link>
                <Link href="#" className="flex items-center gap-2 text-lg font-medium" prefetch={false}>
                  <BriefcaseIcon className="h-5 w-5" />
                  Business
                </Link>
                <Link href="#" className="flex items-center gap-2 text-lg font-medium" prefetch={false}>
                  <CpuIcon className="h-5 w-5" />
                  Technology
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
              Home
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
              News
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
              Sports
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
              Business
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
              Technology
            </Link>
          </nav>
        </div>
        <div className="relative flex-1 max-w-md">
          <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search news..." className="w-full rounded-lg bg-background pl-8" />
        </div>
      </header>
    )
}