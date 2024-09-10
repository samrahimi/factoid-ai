import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getAllReports } from './reports';

export async function useTags() {
  return {tags: []}
  const reports = await getAllReports();
  //count the frequency of each tag
  
  const tags = reports.flatMap(report => report?.parsed?.publication_info?.tags.split(",") || ['untagged'])
  const uniqueTags = [...new Set(tags)]
  const tagsWithReports = uniqueTags.map(tag => ({tag:tag, reports: reports.filter(report => report.parsed.publication_info.tags.includes(tag.tag))}))

  return {tags: tagsWithReports}
  //return [...new Set(tagCounts)]
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
const getDangerousHtmlFromMarkdown = (markdownText) => {
    // Actual default values
    var md = new Remarkable({
        html:         true,        // Enable HTML tags in source
        xhtmlOut:     true,        // Use '/' to close single tags (<br />)
        breaks:       true,        // Convert '\n' in paragraphs into <br>
        langPrefix:   'language-',  // CSS language prefix for fenced blocks
    
        // Enable some language-neutral replacement + quotes beautification
        typographer:  false,
    
        // Double + single quotes replacement pairs, when typographer enabled,
        // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
        quotes: '“”‘’',
    
        // Highlighter function. Should return escaped HTML,
        // or '' if the source string is not changed
        highlight: function (/*str, lang*/) { return ''; }
    }).use(linkify);

    return md.render(markdownText)
  
}

export {getDangerousHtmlFromMarkdown}
