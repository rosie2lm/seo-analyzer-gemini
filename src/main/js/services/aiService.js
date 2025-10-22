const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.SILICON_FLOW_API_KEY;
    this.baseURL = process.env.SILICON_FLOW_BASE_URL || 'https://api.siliconflow.cn/v1';
    this.model = process.env.SILICON_FLOW_MODEL || 'deepseek-ai/DeepSeek-V2-Chat';
  }

  async generateSEOSuggestions(analysis) {
    try {
      if (!this.apiKey) {
        throw new Error('硅基流动 API key not configured');
      }

      const prompt = this.buildPrompt(analysis);

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an SEO expert. Provide detailed, actionable SEO improvement suggestions based on website analysis data.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      return this.parseAIResponse(aiResponse);
    } catch (error) {
      console.error('AI Service Error:', error.message);
      return this.getFallbackSuggestions(analysis);
    }
  }

  buildPrompt(analysis) {
    return `Based on this SEO analysis data, provide comprehensive SEO improvement suggestions:

Website Analysis:
- URL: ${analysis.url}
- Word Count: ${analysis.wordCount}
- Title: "${analysis.title.content}" (Length: ${analysis.title.length} characters)
- Meta Description: "${analysis.metaDescription.content}" (Length: ${analysis.metaDescription.length} characters)
- Images: ${analysis.images.total} total, ${analysis.images.missingAlt} missing alt attributes
- Headings: ${analysis.headings.totalCount} total headings, ${analysis.headings.h1Count} H1 tags
- Links: ${analysis.links.total} total links (${analysis.links.internal} internal, ${analysis.links.external} external)

Please provide:
1. An overall SEO score (0-100) with explanation
2. A prioritized checklist of 3-5 specific improvement suggestions
3. Two creative blog post ideas based on the page's content

Format your response as JSON with these keys:
{
  "seoScore": number,
  "scoreExplanation": string,
  "improvements": [string],
  "blogIdeas": [string]
}`;
  }

  parseAIResponse(response) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback: parse structured text
      return this.parseStructuredResponse(response);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return this.getFallbackSuggestions();
    }
  }

  parseStructuredResponse(response) {
    const lines = response.split('\n').filter(line => line.trim());

    let seoScore = 75;
    let scoreExplanation = 'Based on standard SEO best practices analysis.';
    const improvements = [];
    const blogIdeas = [];

    lines.forEach(line => {
      // Extract SEO score
      if (line.includes('SEO Score') || line.includes('Overall Score')) {
        const scoreMatch = line.match(/(\d+)/);
        if (scoreMatch) {
          seoScore = parseInt(scoreMatch[1]);
        }
      }

      // Extract improvements (lines starting with numbers or bullets)
      if (line.match(/^\d+\./) || line.match(/^[-*]/)) {
        const improvement = line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim();
        if (improvement && improvements.length < 5) {
          improvements.push(improvement);
        }
      }

      // Extract blog ideas
      if (line.toLowerCase().includes('blog') || line.toLowerCase().includes('post')) {
        const idea = line.replace(/^[-*]\s*/, '').trim();
        if (idea && blogIdeas.length < 2) {
          blogIdeas.push(idea);
        }
      }
    });

    return {
      seoScore,
      scoreExplanation,
      improvements: improvements.length > 0 ? improvements : this.getDefaultImprovements(),
      blogIdeas: blogIdeas.length > 0 ? blogIdeas : this.getDefaultBlogIdeas()
    };
  }

  getFallbackSuggestions(analysis) {
    const improvements = [];

    if (analysis.title.length < 30) {
      improvements.push('Title tag is too short. Aim for 30-60 characters for optimal display in search results.');
    }

    if (analysis.title.length > 60) {
      improvements.push('Title tag is too long. Consider shortening to 30-60 characters for better visibility.');
    }

    if (analysis.metaDescription.length < 120) {
      improvements.push('Meta description is too short. Expand to 120-160 characters for better search result snippets.');
    }

    if (analysis.metaDescription.length > 160) {
      improvements.push('Meta description is too long. Shorten to 120-160 characters to avoid truncation.');
    }

    if (analysis.images.missingAlt > 0) {
      improvements.push(`${analysis.images.missingAlt} images are missing alt attributes. Add descriptive alt text for better accessibility and SEO.`);
    }

    if (analysis.headings.h1Count === 0) {
      improvements.push('No H1 heading found. Add a clear H1 heading that includes your main keyword.');
    }

    if (analysis.headings.h1Count > 1) {
      improvements.push('Multiple H1 headings detected. Use only one H1 per page for better SEO structure.');
    }

    return {
      seoScore: Math.max(50, 100 - improvements.length * 10),
      scoreExplanation: 'Based on fundamental SEO best practices and common issues found.',
      improvements: improvements.slice(0, 5),
      blogIdeas: this.getDefaultBlogIdeas()
    };
  }

  getDefaultImprovements() {
    return [
      'Optimize title tag length to 30-60 characters for better search visibility',
      'Create compelling meta description (120-160 characters) to improve click-through rates',
      'Add descriptive alt attributes to all images for accessibility and SEO benefits',
      'Structure content with proper heading hierarchy (H1, H2, H3)',
      'Include relevant internal and external links to provide additional value'
    ];
  }

  getDefaultBlogIdeas() {
    return [
      '10 Essential SEO Best Practices for 2024: A Comprehensive Guide',
      'How to Optimize Your Website Content for Better Search Engine Rankings'
    ];
  }
}

module.exports = AIService;