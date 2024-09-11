/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/4FLyz0tvpjy
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Arimo } from 'next/font/google'
import { Rubik } from 'next/font/google'

arimo({
  subsets: ['latin'],
  display: 'swap',
})

rubik({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import Link from "next/link"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { HomeIcon, NewspaperIcon, ClubIcon, BriefcaseIcon, CpuIcon, MenuIcon, WandSparklesIcon } from "lucide-react"
import {Navigation} from "@/components/Navigation"
import { useEffect, useState } from "react"
import { getAllReports, getGroupedReports, Report,  groupFactoidsByCategory, getPublicAuthorProfile, Factuality } from "@/lib/reports"
import ReportDetails from "./ReportDetails"
import { useTags } from "@/lib/utils"
import Factoid from "./Factoid"
import HeroSection from "./ui/HeroSection"
import { ArticleHeader } from "./ArticleHeader"
import { get } from "http"
import { useRouter } from "next/navigation"

export function HomeScreen() {
  const [featuredFactoid, setFeaturedFactoid] = useState(null)
  const [factoids, setFactoids] = useState({}) 
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFactoid, setSelectedFactoid] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taggedFactoids, setTaggedFactoids] = useState([]);
  const router = useRouter();
  const handleReportClick = async(report: Report) => {
    const populatedReport = {...report, author: await getPublicAuthorProfile(report)}
    setSelectedFactoid(populatedReport);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFactoid(null);
  };


  useEffect(() => {
    const fetchFactoids = async () => {
      try {
          const allFactoids = await getAllReports() as any[];
          const featuredFactoid = allFactoids.shift() 

          setFeaturedFactoid(featuredFactoid);

          const groupedFactoids = groupFactoidsByCategory(allFactoids);
          setFactoids(groupedFactoids);

          //const {tags} = await useTags()
          //setTaggedFactoids(tags)
        }
       catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFactoids();
  }, []);


  function extractAdjudication(evaluation: string | undefined): any {
    if (evaluation?.includes("MOSTLY TRUE")) 
      return "MOSTLY TRUE"

    throw new Error("Function not implemented.")
  }


  return (
    <>
      {featuredFactoid && (
        <HeroSection imageUrl={featuredFactoid.cover_image ? `${process.env.NEXT_PUBLIC_IMAGE_SERVER_URL}/${featuredFactoid.cover_image}` : "/placeholder.svg"} 
        title={featuredFactoid?.parsed?.publication_info?.catchy_title || featuredFactoid.claim} 
        description={featuredFactoid.evaluation} handleReportClick={handleReportClick} />
      )}
    


      {factoids && Object.entries(factoids).map(([category, items]) => (
        <section key={category} className="w-full px-4 py-6 sm:py-9 md:py-12 lg:py-16 bg-muted">
          <div className="container">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{category}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {items.map((factoid) => (
                <Factoid factoid={factoid} handleReportClick={handleReportClick} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <div className="fixed bottom-4 right-4 z-50">
        <TooltipProvider>
          <Tooltip defaultOpen={true}>
            <TooltipTrigger asChild>
              <Button onClick={(e) => (router.push("/fact-check"))} size="icon" className="rounded-full bg-primary text-primary-foreground">
                <WandSparklesIcon className="h-10 w-10" />
                <span className="sr-only">Ask a question or debunk a myth</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ask a question or debunk a myth</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {isModalOpen && selectedFactoid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-full overflow-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-xl font-medium text-gray-100">Original Query: {selectedFactoid.claim}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-200">
                ✕
              </button>
            </div>
            <div className="p-4">
              <ArticleHeader factoid={selectedFactoid} 
              author={{username: selectedFactoid.author?.username || "Anonymous", avatar_url: selectedFactoid.author?.avatar_url || '/placeholder.svg'}} 
              date={(new Date(selectedFactoid.created_at)).toDateString()} 
              views="1.5k views" tags={selectedFactoid.parsed?.publication_info?.tags?.split(',') || []}
             
               category={selectedFactoid.parsed?.publication_info?.category || 'Other'} 
               title={selectedFactoid?.parsed?.publication_info?.catchy_title || selectedFactoid.claim} 
               original_prompt={selectedFactoid.claim} 
               imageUrl={selectedFactoid.cover_image ? `${process.env.NEXT_PUBLIC_IMAGE_SERVER_URL}/${selectedFactoid.cover_image}` : "/placeholder.svg"}
              adjudication={selectedFactoid.parsed?.publication_info?.adjudication || "INCONCLUSIVE"} />

              <ReportDetails tabView={true} data={selectedFactoid?.parsed} />

              <p className="hidden text-gray-300 mt-4">
                Permalink:
                <Link target="_blank" href={`/fact-check/report/${selectedFactoid.project_id}`} className="text-blue-400 hover:underline">
                  {`${process.env.NEXT_PUBLIC_IMAGE_SERVER_URL}/fact-check/report/${selectedFactoid.project_id}`}{" "}
                </Link>
              </p>
              
            </div>
          </div>
        </div>
      )}
    </>
  );
  }

