const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { Octokit } = require("@octokit/rest");
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('.'));

// Initialize Octokit with GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

// Ensure messages directory exists
const messagesDir = path.join(__dirname, 'messages');
if (!fs.existsSync(messagesDir)) {
  fs.mkdirSync(messagesDir, { recursive: true });
}

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the message input page
app.get('/message-input', (req, res) => {
  res.sendFile(path.join(__dirname, 'message-input.html'));
});

// Handle message submission
app.post('/api/submit-message', async (req, res) => {
  const { message } = req.body;
  
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message' });
  }

  try {
    // Create a new txt file with timestamp
    const timestamp = Date.now();
    const filename = `message-${timestamp}.txt`;
    const filePath = path.join(messagesDir, filename);
    const messageContent = `m:${message}`;
    const relativePath = `messages/${filename}`;
    
    // Write the message to the txt file locally
    fs.writeFileSync(filePath, messageContent);
    
    // Update message.json locally
    const messageJsonPath = path.join(__dirname, 'message.json');
    const jsonData = {
      message_file: relativePath
    };
    fs.writeFileSync(messageJsonPath, JSON.stringify(jsonData, null, 2));
    
    // Push to GitHub using API
    try {
      // Upload the new message txt file
      const txtFileContent = fs.readFileSync(filePath, 'utf8');
      await octokit.repos.createOrUpdateFileContents({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: relativePath,
        message: `New message: ${message.substring(0, 50)}`,
        content: Buffer.from(txtFileContent).toString('base64')
      });
      
      // Update message.json
      const jsonFileContent = fs.readFileSync(messageJsonPath, 'utf8');
      await octokit.repos.createOrUpdateFileContents({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: 'message.json',
        message: `Update message reference: ${message.substring(0, 50)}`,
        content: Buffer.from(jsonFileContent).toString('base64')
      });
      
      console.log('Message pushed to GitHub successfully');
    } catch (gitError) {
      console.warn('GitHub API error (message still saved locally):', gitError.message);
    }
    
    res.json({ success: true, message: 'Message saved!' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
