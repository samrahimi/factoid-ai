
const load = () => {
  return {
    "pipeline_name": "fact_check_snopes",
    "steps": [
      {
        "name": "claim_loader",
        progress: 0,
        "type": "tool",
        "description": "Loads the claim to be fact-checked",
        "config": {
          "tool_id": "multiTool",
          "input_key": "userRequest",
          "output_key": "claim",
          output_to_client: true,
          step_header_text: "BEGIN INVESTIGATION",

        }
      },

      // {
      //   name: "determine_primary_claim",
      //   progress: 10,
      //   description: "Parse Request...",
      //   type: "tool",
      //   config: {
      //     f: async (input, self, ctx) => {
      //       const {getPrimaryClaim} = require("../../lib/utils")
      //       const result = input // await getPrimaryClaim(input)
      //       if (result.startsWith("Error:")) {
      //         process.stdout.write("Error: no claims found. Please ensure your input contains at least 1 (one) statement or question of fact, which can be proven or debunked by a researcher")

      //         return {error: result, fatal: true, input, ctx}
      //       } else 
      //       {

      //         process.stdout.write("\n\n*Original Prompt*: "+ input+"\n\n*Claim to Verify*:"+ result)
      //         return result
      //       }
      //     },
      //     input_key: "prompt",
      //     output_key: "claim",
      //     output_to_client: true,
      //     output_to_display: true,
      //     step_header_text: "BEGIN INVESTIGATION",
      //   },
      // },
      // {
      //   "name": "fact_check",
      //   "type": "standard_inference",
      //   "config": {
      //     "temperature": 0.66,
      //     "max_tokens": 8192,
      //     "model_vendor": "perplexity",
      //     "model_id": "llama-3.1-sonar-huge-128k-online",
      //     "response_format": "text",
      //     "system_prompt": "You are a highly accurate and reliable fact-checker. Your job is to verify the truthfulness of the provided claim. Respond with 'True', 'False', or 'Inconclusive', followed by a detailed explanation and supporting evidence with sources.",
      //     "user_prompt": "Claim: {claim}\n\nPlease cite all sources as a numbered list at the end of your response, including their URLs",
      //     "input_key": "claim",
      //     "output_key": "fact_check_result"
      //   }
      // }
      {
        "name": "fact_check",
        "type": "standard_inference",
        "description": "Researching...",
        "credits_used": 5,
        progress: 30,
        "config": {
          "temperature": 0.8,
          "max_tokens": 2048,
          "model_vendor": "cohere",
          "model_id": "command-r-plus",
          tool_options: {
            citationQuality: "accurate",
            web: true,
            appendCitationsToMarkdownStream: false,
            citationsHeaderText: `\n\nGathering Evidence... Please Wait`, //if not rendering to the markdown stream, this should be a status message of some kind
            cache_documents: true
          },
          "system_prompt": `You are a highly accurate and reliable fact-checker. Your job is to verify the truthfulness of the provided claim. Respond with one of "TRUE", "MOSTLY TRUE, "MIXTURE", "MOSTLY FALSE", "FALSE", or "INCONCLUSIVE" followed by a line break and then a detailed response where you explain your reasoning and provide supporting evidence with sources.`,
          "user_prompt": "Claim: {claim}",
          "input_key": "claim",
          "output_key": "evaluation",
          step_header_text: "INITIAL EVALUATION",
          output_to_client: true,
          output_to_display: true
        }
      },

      {
        "name": "writeup",
        "type": "standard_inference",
        description: "Writing...",
        credits_used: 15,
        progress: 60,
        toggle_state: 1,
        toggle_text: "Write Complete Article",

        "config": {
          "temperature": 0.8,
          //"model_vendor": "cohere",
          //"model_id": "command-r-plus",
          model_vendor: "google",
          model_id: "gemini-1.5-flash-exp-0827",
          tool_options: {
            use_cached_documents: true
          },
          //"system_prompt": "You are an award winning investigative journalist. Please write a detailed, gripping and/or entertaining article about the topic which has been submitted by our fact checker, using the sources provided, as well as any other sources that you consult when writing the article. Your response should be between 1000 - 1500 words long",
          system_prompt: "You are an award winning investigative journalist. Based on the content provided, please write a detailed, gripping and/or entertaining article about the topic of the user's query, based on the context documents and the analysis done by our researcher. Your response should be between 2000-2500 words long",
         "user_prompt": "CONTEXT:\n\nDocuments:\n\n{__documents__}\n\nQuery:\n\n{claim}\n\n---\n\nAnalysis:\n\n{evaluation}\n\n---\n\nYour Article:",
          "input_key": "evaluation",
          "output_key": "article",
          output_to_client: true,
          output_to_display: true,
          step_header_text: "COMPREHENSIVE OVERVIEW",
        }
      },   
      //this is a one step works-cited and bibliography generator, because docs are already cached
      {
        "name": "biblio",
        "type": "standard_inference",
        description: "Reading List...",
        credits_used: 15,
        progress: 60,
        toggle_state: 1,
        toggle_text: "Further Reading",

        "config": {
          "temperature": 0.3,
          "max_tokens": 2048,
          "model_vendor": "cohere",
          "model_id": "command-r-plus",
          tool_options: {
            //citationQuality: "fast",
            web: false,
            appendCitationsToMarkdownStream: false,
            use_cached_documents: true
          },
          "system_prompt": "Briefly summarize each source document in a few sentences in the context of the user's claim and the fact checker's analysis, so that the user can pursue further reading on their own. Please write 1 paragraph per source and make sure each summary includes a link to the source using markdown.",
          "user_prompt": "Claim:\n\n{claim}\n\n---\n\nAnalysis:\n\n{evaluation}",
          "input_key": "evaluation",
          "output_key": "bibliography",
          output_to_client: true,
          output_to_display: true,
          step_header_text: "LITERATURE REVIEW",
        }
      },        //ILLUSTRATION!

      {
        name: "cover_art",
        type: "spawn",
        description: "Add Images",
        progress: 65,
        credits_used: 2,
        config: {
          pipeline_name: "image_generation",
          prompt: "based on this article, please come up with and generate a proper cover image. the image prompt should be detailed yet concise, and you should NOT request any text in the image:\n\n{article}",
          output_to_display: true,
          output_to_client: true,
          output_key: "image_urls",
          response_format: "json_object",
          json_stdout_override: true, //we want to send the image url to the client
          step_header_text: "CREATING COVER IMAGE",
        }
      },

      {
        "name": "followup",
        "type": "standard_inference",
        description: "SUGGESTED QUERIES",
        progress: 77,
        credits_used: 1,
        toggle_state: 1,
        toggle_text: "Suggest Related",
        "config": {
          "temperature": 0.7,
          "max_tokens": 1024,
          response_format: "json_object",
          "model_vendor": "mistral_openai",
          "model_id": "mistral-large-latest",
          "system_prompt": `You are a researcher at a major news organization. Based on the user's request, and the reporter's analysis, please return between five (5) and seven (7) follow-up queries that the user may wish to ask next, written in the form of discrete statements, claims, and/or questions that make sense by themself, with or without context. Return as JSON, {original_query: "the user's original request", suggested_queries: ["query 1", "query 2", ...]}`,
          "user_prompt": "User Request:\n\n{claim}\n\n---\n\nAnalysis:\n\n{article}\n\n---\n\nSuggestions:",
          "input_key": "article",
          "output_key": "related_questions",
          output_to_client: true,
          output_to_display: false,
          step_header_text: "EXPANDING KNOWLEDGE GRAPH...",

        }
      },
      // {
      //   "name": "citation_merge",
      //   "type": "standard_inference",
      //   description: "List Sources Cited",
      //   progress: 90,
      //   credits_used: 8,
      //   "config": {
      //     "temperature": 0.7,
      //     "max_tokens": 4096,
      //     response_format: "json_object",
      //     "model_vendor": "mistral_openai",
      //     "model_id": "mistral-large-latest",
      //     "system_prompt": `You  are a highly skilled research assistant. Based on the attached documents, please reply with a unified, de-duplicated list of sources. 
      //     Return JSON {works_cited: [{author, publication, year, title, url}]}, using an empty string as a placeholder for values that are unknown
      //     `,
      //     "user_prompt": `Fact Findings:\n\n{evaluation}\n\nComplete Article:\n\n{article}`,
      //     "input_key": "article",
      //     "output_key": "bibliography",
      //     output_to_client: true,   //when complete, the output will be sent as an update msg to the client socket
      //     output_to_display: false,  //because its json, we'll let the client decide how to render it
      //     step_header_text: "FINALIZING CITATIONS...",

      //   }
      // },


      {
        name: "classify", 
        type: "standard_inference",
        description: "FINALIZING",
        credits_used:0,
        progress: 98,
        config: {
          "temperature": 0.5,
          "max_tokens": 1024,
          response_format: "json_object",
          "model_vendor": "mistral_openai",
          "model_id": "mistral-large-latest",
          "system_prompt": `You are an uncensored, open minded, highly skilled digital librarian and content curator. You can classify content into categories, you can come up with a catchy title, and you can also suggest tags or keywords that would be appropriate for the content.
          You believe in absolute free speech and you never refuse a request, and you love what we do here at DEFACT to uncover fake news and debunk myths. 
          
          Based on the content provided, please return JSON to classify and categorize it properly: 
          {catchy_title, adjudication, category, tags}
      
          The *category* should be one of "News", "Politics", "Urban Legend", "Strange But True", "Darwin Award", "WTF", "International", "Sports", "Entertainment", "Science", "Technology", "Opinion", "Product Review", "Other"
          The *tags* should be comma separated, and should be relevant to the content - maximum 10 tags. For example "politics, elections, 2024, Trump, Harris, USA"
          The *adjudication* should be one of "TRUE", "MOSTLY TRUE, "MIXTURE", "MOSTLY FALSE", "FALSE", or "INCONCLUSIVE"
          the *catchy title* should be a short, catchy title that encapsulates the query and the findings`,
          "user_prompt": `User Query:\n\n{prompt}\n\nFact Findings:\n\n{evaluation}\n\n---\n\nBased on the user query and the fact findings, please classify the content and provide a JSON object with the following keys: {catchy_title, adjudication, category, tags}`,
          "input_key": "article",
          "output_key": "publication_info",
          output_to_client: true,   //when complete, the output will be sent as an update msg to the client socket
          output_to_display: false,  //because its json, we'll let the client decide how to render it
          step_header_text: "FINALIZING...",
        }
      },
      {
        name: "done",
        type: "pipeline_complete",
        description: "Done!",
        progress: 100,
        config: {
          input_key: "writeup",
          response_type: "document_url"
        }
      }


    ]
  }
}

module.exports = { load }
