# About This Repo

This repo contains two projects: an agentic pipeline with declarative workflow engine, and a web application that lets users check facts and write properly researched journalistic content using a pipeline with no less than 6 different LLMs... 

Right now I can't recommend that you use any of this in your applications because of hard coded URLs, poor documentation, and extreme overuse of Javascript's dynamic typing making it very hard to use the code if you didn't write it yourself. 

There is major refactoring needed - specifically the pipeline engine, and its interfaces (a CLI and a REST API) need to go into their own project / repository, and the webapp (which is a usecase for the pipeline) needs to have its own repo, and then we need to completely rewrite the logic for streaming output to the UI during generation, and progressively updating a database record as each new section (which maps to a db column) is output for an article currently in progress.

Just to explain why things got so hacky: in a normal chatgpt-like solution, you just insert to the database *after* each inference request is completed. If the request fails halfway, well then, the user can copy paste the partial output from their screen if they care to save it, otherwise its gone forever. But the fact checking / journalist pipeline (models/fact_check_fun.js) contains about 10 steps, can take up to 5 minutes to complete, and it is the opposite of transactional: frequently one or more steps will fail, but its a pretty robust and redundant architecture and often excellent results are produced with only 7 out of 10 pipeline stages having completed... Anyways its a nightmare and if you wanna help with this I would be eternally grateful.




# Pipeline Documentation

## 1. Pipeline Structure

The pipeline is a series of interconnected blocks that process data in a specific order. Each block represents a distinct operation or transformation on the data. The pipeline structure is defined in JavaScript and can be visualized and edited through a web-based UI.

## 2. Types of Blocks

There are several types of blocks available in the pipeline:

1. **Universal Loader**:
   - Accepts text, URLs, and file uploads
   - Type: "tool"
   - Inputs: userRequest
   - Outputs: document
2. **Standard Inference**:
   - Performs inference using a specified AI model
   - Type: "standard_inference"
   - Inputs: Varies (e.g., document)
   - Outputs: Varies (e.g., factoids, exec_summary)
3. **Mapper**:
   - Applies a function to each item in a list
   - Type: "mapper"
   - Inputs: List of items
   - Outputs: List of processed items
4. **Reducer**:
   - Combines multiple inputs into a single output
   - Type: "reducer"
   - Inputs: List of items
   - Outputs: Single combined item

## 3. Block Connections

Blocks are connected through their input and output keys. The output of one block becomes the input for the next block in the pipeline. This is defined in the configuration of each block:

- `input_key`: Sets the *default* key, not always needed
-  `output_key`: Defines the key under which this block's output will be stored

For example, in the "factoid" block:

```
"input_key": "document",
"output_key": "factoids"
```

This means it takes the "document" output from the previous block as input and produces "factoids" as output, which can be used by subsequent blocks.

## 4. Block Configuration

Each block has a configuration object that defines its behavior. Common configuration options include:

- `name`: The name of the block

- `description`: A brief description of the block's purpose

- `type`: The type of block (e.g., "tool", "standard_inference", "mapper", "reducer")

- ```
  config
  ```

  : An object containing block-specific configuration options, such as:

  - `temperature`: For AI model inference
  - `max_tokens`: Maximum number of tokens for AI model output
  - `model_vendor`: The AI model provider
  - `model_id`: The specific AI model to use
  - `system_prompt`: Instructions for the AI model
  - `user_prompt`: The prompt template for user input
  - `input_key`: The input data key
  - `output_key`: The output data key
  - `tasks_key`: For mapper blocks, specifies the key for the list of tasks
  - `downsample_to`: For mapper blocks, limits the number of items to process

## 5. Pipeline UI

The pipeline UI is a web-based interface for creating and editing pipelines. It consists of two main sections:

1. **Palette**:
   - Located on the left side of the screen
   - Contains available block types that can be added to the pipeline
   - Users can click on a block in the palette to add it to the pipeline
2. **Pipeline**:
   - Located on the right side of the screen
   - Displays the current pipeline configuration
   - Users can drag and drop blocks to reorder them
   - Each block in the pipeline can be minimized or deleted

### UI Features:

- **Block Customization**: Users can edit the configuration of each block directly in the UI by modifying input fields.
- **Drag and Drop**: Blocks can be reordered within the pipeline using drag and drop functionality.
- **Minimize/Expand**: Each block can be minimized to save space or expanded to show full details.
- **Delete**: Blocks can be removed from the pipeline using the delete button.
- **Save**: The current pipeline configuration can be saved as a JavaScript file.
- **Copy to Clipboard**: The pipeline configuration can be copied to the clipboard in JSON format.

### Styling:

The UI uses a dark theme for better readability and reduced eye strain. Key style elements include:

- Dark background colors (#1e1e1e, #252525, #2a2a2a)
- Light text colors (#e0e0e0, #b0b0b0)
- Accent color for highlights and buttons (#4a9eff)
- Hover effects and transitions for improved user experience

## 6. API Integration

The pipeline system includes an API (api.js) that allows for:

- Listing available pipeline models
- Running a specific pipeline with a given prompt

## Conclusion

This pipeline system provides a flexible and user-friendly way to create, edit, and execute complex data processing workflows. It combines the power of various AI models and custom processing steps into a cohesive and visual pipeline structure, making it easier for users to build and understand sophisticated data processing tasks.
