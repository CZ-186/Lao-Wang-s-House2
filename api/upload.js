const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/api/upload', async (req, res) => {
  const { fileName, fileContent, contributor } = req.body;

  if (!fileName || !fileContent) {
    return res.status(400).json({ error: 'Missing file data' });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Server misconfiguration: No GitHub Token' });
  }

  try {
    const safeContributor = contributor ? contributor.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '') : '神秘人';
    const safeName = fileName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5.]/g, '');
    const finalFileName = `${safeName.replace(/\.[^/.]+$/, "")}_${safeContributor}.m4a`;

    const repo = 'CZ-186/Lao-Wang-s-House2';
    const path = `audio/${finalFileName}`;
    const url = `https://api.github.com/repos/${repo}/contents/${path}`;

    // Upload directly to GitHub using API
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload new song from web: ${finalFileName}`,
        content: fileContent.split(',')[1] || fileContent, // Remove base64 header if present
        branch: 'main'
      })
    });

    if (response.ok) {
      res.json({ success: true, message: 'Upload successful!' });
    } else {
      const errorData = await response.json();
      res.status(response.status).json({ error: 'GitHub API error', details: errorData });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = app;