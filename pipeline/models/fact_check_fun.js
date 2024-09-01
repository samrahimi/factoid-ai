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
            "output_key": "prompt",
            output_to_client: true
          }
        },

        {
          name: "determine_primary_claim",
          progress: 10,
          description: "Parse Request...",
          type: "tool",
          config: {
            f: async (input, self, ctx) => {
              const {getPrimaryClaim} = require("../../lib/utils")
              const result = input // await getPrimaryClaim(input)
              if (result.startsWith("Error:")) {
                process.stdout.write("Error: no claims found. Please ensure your input contains at least 1 (one) statement or question of fact, which can be proven or debunked by a researcher")

                return {error: result, fatal: true, input, ctx}
              } else 
              {

                process.stdout.write("\n\n*Original Prompt*: "+ input+"\n\n*Claim to Verify*:"+ result)
                return result
              }
            },
            input_key: "prompt",
            output_key: "claim",
            output_to_client: true,
            output_to_display: true,
            step_header_text: "BEGIN INVESTIGATION",
          },
        },
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
          "description": "Research - Phase 1",
          "credits_used": 5,
          progress: 30,
          "config": {
            "temperature": 0.66,
            "max_tokens": 2048,
            "model_vendor": "cohere",
            "model_id": "command-r-plus-08-2024",
            tool_options: {
              citationQuality: "accurate",
              web: true,
              appendCitationsToMarkdownStream: false,
              citationsHeaderText: `\n\nGathering Evidence... Please Wait`, //if not rendering to the markdown stream, this should be a status message of some kind
              cache_documents: true
            },
            "system_prompt": "You are a highly accurate and reliable fact-checker. Your job is to verify the truthfulness of the provided claim. Respond with one of 'TRUE', 'FALSE', or 'INCONCLUSIVE' followed by a line break and then a detailed response where you explain your reasoning and provide supporting evidence with sources.",
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
            "temperature": 0.5,
            "max_tokens": 3000,
            "model_vendor": "cohere",
            "model_id": "command-r-plus-08-2024",
            tool_options: {
              //citationQuality: "fast",
              web: false,
              appendCitationsToMarkdownStream: true,
              citationsHeaderText: `\n\nConfirming all citations and creating your reading list, please wait...\n\n`, //if not rendering to the markdown stream, this should be a status message of some kind
              use_cached_documents: true
            },
            "system_prompt": "You are an award winning investigative journalist. Please write a detailed, gripping and/or entertaining article about the topic which has been submitted by our fact checker, using the sources provided, as well as any other sources that you consult when writing the article. Your response should be approximately 1000-1200 words long",
            "user_prompt": "Claim:\n\n{claim}\n\n---\n\nAnalysis:\n\n{evaluation}\n\n---\n\nYour Article:",
            "input_key": "evaluation",
            "output_key": "article",
            output_to_client: true,
            output_to_display: true,
            step_header_text: "COMPREHENSIVE OVERVIEW",
          }
        },
        //ILLUSTRATION!
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
		step_header_text: "CREATING COVER IMAGE",
          }
        },
        {
          "name": "followup",
          "type": "standard_inference",
          description: "Next Steps...",
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
            "system_prompt": `You are a researcher at a major news organization. Based on the user's claim, and the response by our fact checker, please return between three (3) and six (6) related questions that may interest the user, written in the form of discrete *claims* that the user might want to ask a fact checker. Return as JSON, {original_claim: "the original claim", related_claims: ["claim 1", "claim 2", ...]}`,
            "user_prompt": "Claim:\n\n{claim}\n\n---\n\nAnalysis:\n\n{article}\n\n---\n\nRelated Claims:",
            "input_key": "article",
            "output_key": "related_questions",
            output_to_client: true,
            output_to_display: false,
            step_header_text: "Building knowledge graph (Related Claims), please wait...",

          }
        },
        {
          "name": "citation_merge",
          "type": "standard_inference",
          description: "List Sources Cited",
          progress: 95,
          credits_used: 8,
          "config": {
            "temperature": 0.7,
            "max_tokens": 4096,
            response_format: "json_object",
            "model_vendor": "mistral_openai",
            "model_id": "mistral-large-latest",
            "system_prompt": `You  are a highly skilled research assistant. Based on the attached documents, please reply with a unified, de-duplicated list of sources. 
            Return JSON {works_cited: [{author, publication, year, title, url}]}, using an empty string as a placeholder for values that are unknown
            `,
            "user_prompt": `Fact Findings:\n\n{evaluation}\n\nComplete Article:\n\n{article}`,
            "input_key": "article",
            "output_key": "bibliography",
            output_to_client: true,   //when complete, the output will be sent as an update msg to the client socket
            output_to_display: false,  //because its json, we'll let the client decide how to render it
            step_header_text: "Finalizing your Reading List, please wait...",

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
