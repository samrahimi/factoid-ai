const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const utils = require('../lib/utils')
// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });
  // Initialize the context object to store intermediate results
var context = { };
var SESSION_ID="" //the client session ID, for sending back status messages
var PROJECT_ID="" //the ID that determines where results are stored

const API_SERVER = process.env.PIPELINE_API_SERVER || 'http://45.63.9.142:1207'
const UI_SERVER = process.env.UI_SERVER || 'http://localhost:3000'

async function triggerEventForClient(clientId, eventData) {
  const endpoint = '/api/notify';

  try {
    const response = await fetch(`${API_SERVER}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clientId, eventData }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.text();
    //console.log('Event triggered successfully:', result);
    return result;
  } catch (error) {
    //console.error('Error triggering event:', error);
    //throw error;
  }
}


//send a one way message to the client, to update status or what have you
function sendControlMessage(messageType, messagePayload) {
  triggerEventForClient(SESSION_ID, {messageType, messagePayload})
  ////console.log(`@@${messageType.toUpperCase()} ${messagePayload}`)
}




const agentFactory = require('../lib/agent');
const { stdout, stderr } = require('process');
const logContext=() =>true; 

async function runPipeline(configPath, userRequest, sessionId) {
  context = {userRequest}
  SESSION_ID = sessionId
  // Read and parse the configuration file
  //const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const config = require(configPath).load()
  // Generate a unique project ID
  PROJECT_ID = 'project-' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  // Create a new folder for the project
  const projectDir = path.join(process.cwd(), process.env.OUTPUT_PATH || "outputs", PROJECT_ID);
  fs.mkdirSync(projectDir, { recursive: true });
  clientContext = {userRequest, PROJECT_ID, done: false}

  // sendControlMessage("project_id", PROJECT_ID),
  // sendControlMessage("execution_plan", JSON.stringify({
  //   steps: config.steps.map(s => ({name: s.name, desc: s.description, type: s.type}))
  // }))
  // Execute each step in the pipeline
  for (const step of config.steps) {
    //console.log(`\n--- Executing step: ${step.name} ---`);
    sendControlMessage("begin_step", {name: step.name, description: step.description, progress: step.progress})
    if (step.config.step_header_text)
      process.stdout.write("\n\n### "+step.config.step_header_text+"\n\n")

    //console.log(`Executing step: ${step.name || "undef"}`)
    switch (step.type) {
      case 'tool': 
        await runTool(step, projectDir)
        logContext()
        break
      case 'standard_inference':
        await executeStandardInference(step, projectDir);
        logContext()
        break;
      case 'mapper':
        await executeMapperFunction(step, projectDir);
        logContext()

        break;
      case 'reducer':
        await executeReducer(step, projectDir);
        break;
      case 'spawn':
        await spawn(step.config.child_model, sessionId, 
          replaceVariables(step.config.prompt, context))
        break;
      case 'pipeline_complete': 
        await executeFinalizer(step, projectDir);
        break

      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }

    if (step.config.output_to_client && step.config.output_key) {
      clientContext[step.config.output_key] = context[step.config.output_key]
      sendControlMessage("update_results",clientContext)
    }
  }

  //console.log('\n--- Pipeline execution completed ---');
  return context;
}
async function executeFinalizer(step, projectDir) {
  /*         {
          name: "done",
          type: "pipeline_complete",
          description: "Done!",
          progress: 100,
          config: {
            input_key: "final_output",
            response_type: "document_url"
          }
        }
   */
  clientContext.done = true
  clientContext.report_url=`${API_SERVER}/api/view-document?projectId=${PROJECT_ID}&contentId=${step.config.input_key}`
  sendControlMessage("update_context",clientContext)
}
const spawn=(model, clientId, prompt) => {
  const { spawn } = require('child_process');
  const child = spawn('node', ['flexible_pipeline.js',"./models/"+model+".js", clientId, prompt], {
    env: {
      ...process.env,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
      MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
      PERPLEXITY_API_KEY:process.env.PERPLEXITY_API_KEY

    }
  });

  child.stdout.on('data', (data) => {
    stdout.write(data);
  });

  child.stderr.on('data', (data) => {
    //if (process.env.SHOW_ERRORS)
      stderr.write(data) 
  });

  child.on('close', (code) => {
    //res.write(`data: Process exited with code ${code}\n\n`);
    res.write("[sidechain done]")
    res.end();
  });
}
async function runTool(step, projectDir) {
  try {
  //setting tool_id is how you run any function in utils as a tool
  const toolFunction = step.config.tool_id? utils[step.config.tool_id] : step.config.f
  const toolInput = step.config?.tool_options?.tool_input  ? step.config["tool_options"]["tool_input"]: context[step.config.input_key]
  
  //console.log({toolInput})

  const result = await toolFunction(toolInput, step, context)  
  if (result.error && result.fatal) {
    throw new Error(result.error)
  }
  //debug
  //console.log({result})
  
  // Save the result to a file
  if (typeof result !== "string")
    fs.writeFileSync(path.join(projectDir, `${step.name}_output.json`), JSON.stringify(result, null, 2))
  else
    fs.writeFileSync(path.join(projectDir, `${step.name}_output.md`), result)  

  // Update the context with the result
  if (step.config.response_format && step.config.response_format == "json_object")
    result = utils.fixJson(result)
  context[step.config.output_key] = result;
  return result;
  } catch  (err) {
    sendControlMessage("error", {step, error_message: err.message, error_details: err.toString() })
    throw err
  }
}

async function executeStandardInference(step, projectDir) {
  const agent = agentFactory.createFromSettings(step.config);

  //if you specify an input_key and context[input_key] is an object
  //we make a temporary_context object containing all of the keys in context
  //AND all of the keys in context[input_key] merged into one object

  //this lets you bind your prompt templates to properties of the input object or other properties in the context
  //if input_key is not specified, or context[input_key] is NOT an object
  //then you can bind prompt templates to any top level key in the context. input_key is ignored and has no effect

  //example: context: {user_profile: {name: 'Hamster dog', species:'Unclear', annoying: true}}
  //         input_key: "user_profile"
             
  //           since context.user_profile is an object, and user_profile is the input key, 
  //           we merge it into the top level context resulting in:

  //           temporary_context = {name: 'hamster dog', species: 'unclear', annoying: true, user_profile: {name: 'Hamster dog', species:'Unclear', annoying: true}}
  //           Therefore, in your step.config.user_prompt or system_prompt templates, using 
  //           {name} will become 'hamster dog', etc... 
  //           {user_profile} will become the serialized context.user_profile (name, species, annoying)


  const temporary_context = (step.config.input_key && typeof context[step.config.input_key] == "object") ? 
                      {...context, ...context[step.config.input_key]} 
                      
                      : 
                      
                      context
  
  
    
  const promptContent = replaceVariables(step.config.user_prompt, temporary_context);

  //console.log("PROMPT:", promptContent)
  
  // if (step.config.tool_options && step.config.tool_options.show_as_code) 
  //   console.log("```json")
  // Attn: this is now being done by @/lib/agent.js to delimit json or code outputs more precisely
  
  let result = await agent.performInference(promptContent, context);
  
  // if (step.config.tool_options && step.config.tool_options.show_as_code) 
  //   console.log("```")


  // Save the result to a file
  fs.writeFileSync(path.join(projectDir, `${step.name}_output.md`), result);

  // Update the context with the result
  if (step.config.response_format && step.config.response_format == "json_object")
    result = utils.fixJson(result)
  context[step.config.output_key] = result;
  return result;
}

async function executeMapperFunction(step, projectDir) {
  const agent = agentFactory.createFromSettings(step.config);
  //const current_context = step.config.context_key ? context[step.config.input_key][step.config.context_key]: "" //an optional shared context value for all tasks, taken from output of previous stage
  
  const input_context = context[step.config.input_key] //should be JSON object
  var tasks = input_context[step.config.tasks_key] //the array of tasks to map
  context={...context, ...input_context} //so the fields can be referenced in later steps
  //if downsampling is in effect, we save money by randomly sampling a number of tasks to do
  if (step.config.downsample_to) {
    tasks = utils.downsampleArray(tasks, step.config.downsample_to)
    //console.log(`[debug] downsample pending tasks to ${tasks.length}`)
  }
  //console.log(JSON.stringify(step.config, null, 2))
  if (step.config.task_transform) 
    tasks = step.config.task_transform(tasks)    
  
  let results = [];
  let aggregatedResults = ""

  for (let i = 0; i < tasks.length; i++) {
    let result
    stdout.write(`\n\n [step: ${step.name}, iteration: ${i}, input: ${tasks[i]}] \n\n`)
    //needs refactor
    if ( typeof step.config.f === "function") {
      result= await step.config.f(tasks[i], step, context) 
    } else if (typeof step.config.tool_id !== "undefined") {
      result= await utils[step.config.tool_id](tasks[i], step, context) //run a tool on each task
    } 
    else
    {
      const flattened_task_context =  {...context,  task: tasks[i] }
      if (step.config.aggregation_key) {
        console.log("AGGREGATION KEY: "+step.config.aggregation_key)
        aggregatedResults = `${aggregatedResults}\n\n---\n\n${result}`
        flattened_task_context[step.config.aggregation_key] = aggregatedResults
      }
      //console.log(JSON.stringify(flattened_task_context))
      let promptContent = replaceVariables(step.config.user_prompt, flattened_task_context);
      if (i ==0 && step.config.user_grounding_context) {
        const groundingPrefix = replaceVariables(step.config.user_grounding_context, flattened_task_context)
        console.log("GROUNDING: "+groundingPrefix)
        promptContent = groundingPrefix + promptContent
      }
      
      //console.log("PROMPT: "+promptContent)
      //excellent. our prompt is now prepared, with session- and task-specific variables subbed in

      //if this step has a function implemented, run that - otherwise run the default llm inference function
      result =await agent.performInference(promptContent)
    }

    // Save individual task results
    fs.writeFileSync(path.join(projectDir, `${step.name}_task_${i + 1}.md`), result.toString());
    results.push({ id: i, task: tasks[i], output: result });

  }
  if (step.config.output_transform) 
    results = step.config.output_transform(results)
  
  context[step.config.output_key] = results

}

function executeReducer(step, projectDir) {
  const {config} = step
  const inputData = context[config.input_key];
  let result;
  if (step.config.custom_reduce_function) {
      const f = eval(config.reduce_function)
      result = f(inputData)
  } else {
  switch (config.reduce_function) {
      case 'save_only':
        result = inputData
      case 'concatenate':
        if (config.include_task_prompts) 
          result = inputData.map(item => `${config.task_prompt_prefix}${item.task}\n\n${config.task_response_prefix}${item.output}`).join(config.delimiter);
        else
          result = inputData.map(item => `${config.task_response_prefix}${item.output}`).join(config.delimiter);
        //console.log(JSON.stringify(result, null, 2))
        break;
      // Add more reduce functions as needed
      default:
        throw new Error(`Unknown reduce function: ${step.config.reduce_function}`);
    }
  }

  // Update the context with the reduced result
  context[config.output_key] = result;

  // Save 
  fs.writeFileSync(path.join(projectDir, `${step.name}.md`), result);

}

function stringifyIfNeeded(unknownObject) {
  if (typeof unknownObject !== "string")
    return JSON.stringify(unknownObject, null, 2)
  else
    return unknownObject
}
function replaceVariables(template, context) {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return stringifyIfNeeded(context[key]) || match;
  });
}


// Example usage
const configPath = process.argv[2];
const sessionId= process.argv[3]
const userRequest = process.argv[4];
//const customProjectId = process.argv[4]
//console.log({configPath, sessionId, userRequest})
sendControlMessage("status", "Starting...")
runPipeline(configPath, userRequest, sessionId)
  .then(result => result)
  .catch(error => {process.stdout.write(error.message);});