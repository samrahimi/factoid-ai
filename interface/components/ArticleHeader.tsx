'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye, Share2, User } from "lucide-react"
import { FactualityIndicator } from "./FactualityIndicator"
import { Factuality } from "@/lib/reports"
import Share from "@/components/ui/share"
export function ArticleHeader({factoid, title, imageUrl, author, date, views, tags, category, original_prompt, adjudication}) {
  return (
    <div className="bg-gray-900 text-white p-6 rounded shadow-lg max-w-4xl mx-auto mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img 
            src={author.avatar_url || "/placeholder.svg"}
            alt={author.username || "@anonymous"}
            className="rounded-full w-12 h-12"
          />
          <Link href="#" onClick={e => alert('Coming Soon!')} className="text-sm font-medium hover:underline">
            @{author.username || "anonymous"}
          </Link>
        </div>
        <Button variant="outline" size="sm" className="text-white border-white hover:bg-gray-800">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
      {factoid.parsed.publication_info ? (
        <>
      <h1 className="text-xl font-bold mb-2">{title}</h1>
      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{date}</span>
        </div>
        <div className="flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          <span>{Math.floor((Math.random() * 10000)+ 100)} views</span>
        </div>
        <div className="flex items-center text-lg">
          <FactualityIndicator status={adjudication.trim()} />
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <Badge variant="secondary" className="bg-blue-600 hover:bg-blue-700">
          {category}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        {
          tags.map(tag => (
            <Badge variant="outline" className="text-gray-300 border-gray-600" key={tag}>
              {tag}
            </Badge>
          ))
        }
      </div>
      </>) : (
        
        <>
        <h1 className="text-xl font-bold mb-2">{title}</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{date}</span>
        </div>
        <div className="flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          <span>{Math.floor((Math.random() * 10000)+ 100)} views</span>
        </div>
      </div></>
    
    )}
    </div>
    
  )
}