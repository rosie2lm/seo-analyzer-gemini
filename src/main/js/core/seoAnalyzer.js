const axios = require('axios');
const cheerio = require('cheerio');

class SEOAnalyzer {
  constructor() {
    this.timeout = 10000; // 10 seconds timeout
  }

  async analyzeURL(url) {
    try {
      // Validate URL
      if (!this.isValidURL(url)) {
        throw new Error('Invalid URL format');
      }

      // Fetch HTML content
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEO-Analyzer/1.0)'
        }
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Extract SEO metrics
      const analysis = {
        url: url,
        wordCount: this.getWordCount($),
        title: this.getTitle($),
        metaDescription: this.getMetaDescription($),
        images: this.getImageAnalysis($),
        headings: this.getHeadings($),
        links: this.getLinks($),
        loadingTime: Date.now() - this.startTime,
        timestamp: new Date().toISOString()
      };

      return analysis;
    } catch (error) {
      throw new Error(`Failed to analyze URL: ${error.message}`);
    }
  }

  isValidURL(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  getWordCount($) {
    const text = $('body').text();
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  getTitle($) {
    const title = $('title').text().trim();
    return {
      content: title,
      length: title.length,
      isOptimal: title.length >= 30 && title.length <= 60
    };
  }

  getMetaDescription($) {
    const description = $('meta[name="description"]').attr('content') || '';
    return {
      content: description,
      length: description.length,
      isOptimal: description.length >= 120 && description.length <= 160
    };
  }

  getImageAnalysis($) {
    const images = $('img');
    const totalImages = images.length;
    let missingAlt = 0;

    images.each((i, img) => {
      const alt = $(img).attr('alt');
      if (!alt || alt.trim() === '') {
        missingAlt++;
      }
    });

    return {
      total: totalImages,
      missingAlt: missingAlt,
      withAlt: totalImages - missingAlt,
      altPercentage: totalImages > 0 ? Math.round(((totalImages - missingAlt) / totalImages) * 100) : 100
    };
  }

  getHeadings($) {
    const headings = {
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: []
    };

    for (let i = 1; i <= 6; i++) {
      $(`h${i}`).each((index, element) => {
        headings[`h${i}`].push($(element).text().trim());
      });
    }

    return {
      structure: headings,
      h1Count: headings.h1.length,
      totalCount: Object.values(headings).flat().length
    };
  }

  getLinks($) {
    const links = $('a[href]');
    const internalLinks = [];
    const externalLinks = [];

    links.each((i, link) => {
      const href = $(link).attr('href');
      const text = $(link).text().trim();

      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        if (href.startsWith('http') || href.startsWith('//')) {
          externalLinks.push({ href, text });
        } else {
          internalLinks.push({ href, text });
        }
      }
    });

    return {
      total: links.length,
      internal: internalLinks.length,
      external: externalLinks.length,
      internalLinks,
      externalLinks
    };
  }

  start() {
    this.startTime = Date.now();
  }
}

module.exports = SEOAnalyzer;