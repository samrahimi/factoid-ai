'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MenuIcon, Search, User } from "lucide-react"
import Link from "next/link"

export function DarkModeNewsHomepage() {
  return (
    <div className="min-h-screen bg-black text-gray-100">
  
        <section className="py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <img
                alt="Featured news image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                src="/placeholder.svg"
                
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Breaking News: Major Climate Agreement Reached
                  </h1>
                  <p className="max-w-[600px] text-gray-400 md:text-xl">
                    World leaders come together to sign a landmark climate accord, promising significant reductions in
                    carbon emissions by 2030.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    href="#"
                  >
                    Read More
                  </Link>
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md border border-gray-800 bg-gray-950 px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-900 hover:text-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    href="#"
                  >
                    All Climate News
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-8">Recent News</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:gap-16 lg:grid-cols-3 xl:grid-cols-4 [&>*]:mx-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full max-w-sm space-y-2">
                  <img
                    alt={`Recent news ${i}`}
                    className="aspect-[4/3] overflow-hidden rounded-lg object-cover"
                    height="263"
                    src={`/placeholder.svg?height=263&width=350`}
                    width="350"
                  />
                  <h3 className="text-xl font-bold">New Breakthrough in Quantum Computing</h3>
                  <p className="text-sm text-gray-400">
                    Scientists achieve a major milestone in quantum computing, paving the way for unprecedented
                    computational power.
                  </p>
                  <Link
                    className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    href="#"
                  >
                    Read More
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      <footer style={{display: "none"}} className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">© 2023 NewsDaily. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-gray-100" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-gray-100" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}