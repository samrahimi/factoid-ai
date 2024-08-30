const path = require('path')
const fs=require('fs')
require('dotenv').config({ path: '../.env' });
const express = require('express');
const http = require('http')
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const { spawn } = require('child_process');
const markdown = require('markdown-it')
const app = express();
const port = process.env.PORT || 1207;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const cors= require('cors')
app.use(cors())
app.use(express.json())

// Map to store open socket connections
const clients = new Map();

wss.on('connection', (ws) => {
  const clientId = uuidv4();
  clients.set(clientId, ws);

  // Send the clientId back to the client
  ws.send(JSON.stringify({ type: 'connection', clientId }));

  ws.on('message', (message) => {
    console.log(`Received message from client ${clientId}: ${message}`);
  });

  ws.on('close', () => {
    clients.delete(clientId);
    console.log(`Client ${clientId} disconnected`);
  });
});

// Function to send a message to a specific client
function sendMessageToClient(clientId, message) {
  const client = clients.get(clientId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(message));
  } else {
    console.log(`Client ${clientId} not found or connection not open`);
  }
}


// API to send message to a client
app.post('/api/notify', (req, res) => {
  const { clientId, eventData } = req.body;
  sendMessageToClient(clientId, { type: 'event', data: eventData });
  res.send('Event triggered');
});



app.get('/api/models', (req, res) => {
  const modelsDir = path.join(process.cwd(), 'models');
  const modelFiles = fs.readdirSync(modelsDir);
  const models = modelFiles
    .filter((file) => file.endsWith('.js'))
    .map((file) => file.replace('.js', ''));
  
  res.status(200).json(models);
})
app.get('/api/view-document', async(req, res) => {
  const { projectId, contentId } = req.query;
  const PROJECT_ROOT = process.env.PROJECT_ROOT || "./outputs"
  const PROJECT_PREFIX =  ""

  if (!projectId || !contentId || Array.isArray(projectId) || Array.isArray(contentId)) {
    return res.status(400).json({ error: 'Invalid projectId or contentId' });
  }

  try {
    // Construct the file path
    const filePath = path.join(process.env.PROJECT_ROOT || './outputs', projectId, `${contentId}_output.md`);

    // Read the markdown file
    const markdownContent = fs.readFileSync(filePath, 'utf-8');

    // Convert markdown to HTML
    const md = markdown();
    const htmlContent = md.render(markdownContent);

    // Set the content type to HTML and send the response
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(htmlContent);
  } catch (error) {
    console.error('Error processing markdown:', error);
    res.status(500).json({ error: 'Error processing markdown file' });
  }

})
app.post('/api/run-pipeline', (req, res) => {
  //const { model, prompt } = req.query;
  console.log(JSON.stringify(req.body))
  const {model, prompt, clientId} = req.body

  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

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
    res.write(data);
  });

  child.stderr.on('data', (data) => {
    //if (process.env.SHOW_ERRORS)
      res.write(data) 
  });

  child.on('close', (code) => {
    //res.write(`data: Process exited with code ${code}\n\n`);
    res.write("\n\n[done]")
    res.end();
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
