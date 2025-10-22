const express = require('express');
const SEOAnalyzer = require('../core/seoAnalyzer');
const AIService = require('../services/aiService');

const router = express.Router();
const seoAnalyzer = new SEOAnalyzer();
const aiService = new AIService();

// POST /api/analyze - Analyze a website URL
router.post('/', async (req, res) => {
  try {
    const { url } = req.body;

    // Validate input
    if (!url) {
      return res.status(400).json({
        error: 'URL is required',
        message: 'Please provide a website URL to analyze'
      });
    }

    console.log(`🔍 Analyzing URL: ${url}`);

    // Start timing
    seoAnalyzer.start();

    // Perform SEO analysis
    const analysis = await seoAnalyzer.analyzeURL(url);
    console.log(`✅ SEO analysis completed for: ${url}`);

    // Generate AI-powered suggestions
    let aiSuggestions;
    try {
      aiSuggestions = await aiService.generateSEOSuggestions(analysis);
      console.log(`🤖 AI suggestions generated`);
    } catch (aiError) {
      console.error('AI service error:', aiError.message);
      aiSuggestions = aiService.getFallbackSuggestions(analysis);
    }

    // Combine results
    const result = {
      success: true,
      url: analysis.url,
      timestamp: analysis.timestamp,
      analysis: {
        wordCount: analysis.wordCount,
        title: analysis.title,
        metaDescription: analysis.metaDescription,
        images: analysis.images,
        headings: analysis.headings,
        links: analysis.links
      },
      aiSuggestions: aiSuggestions,
      performance: {
        loadingTime: analysis.loadingTime,
        analysisTime: Date.now() - new Date(analysis.timestamp).getTime()
      }
    };

    res.json(result);

  } catch (error) {
    console.error('Analysis error:', error.message);

    res.status(500).json({
      success: false,
      error: 'Analysis failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/analyze/health - Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;