# SEO Test

On-page SEO analyzer powered by Gemini - provides structured on-page SEO analytics and AI-powered improvement suggestions for any given website URL.

## Quick Start

1. **Read CLAUDE.md first** - Contains essential rules for Claude Code
2. Follow the pre-task compliance checklist before starting any work
3. Use proper module structure under `src/main/js/`
4. Commit after each completed task

## Project Overview

This tool provides users with structured on-page SEO analytics and AI-powered improvement suggestions for any given website URL. It is powered by Google's Gemini 1.5 Pro model.

### Core Functionality

1. **Input**: A single input field for a user to paste a website URL
2. **Web Scraping**: The backend uses `axios` to fetch the page's HTML and `cheerio` to parse it
3. **Structured Analytics**: Extracts key metrics including:
   - Word Count
   - Title Tag content and length
   - Meta Description content and length
   - Count of images missing `alt` attributes
4. **AI-Powered SEO Suggestions**: Sends analytics to Google Gemini 1.5 Pro API to generate:
   - Overall **SEO Score** out of 100 with explanation
   - **Prioritized checklist** of 3-5 specific improvement suggestions
   - **Two creative blog post ideas** based on the page's topic

### UI/UX Design

- **Theme**: Professional dark mode (#1A1A1A background, white text, #007BFF accent)
- **Layout**: Clean header, loading indicator, organized results display
- **Results Structure**:
  - "Structured Analysis" in two-column grid
  - "AI-Powered Suggestions" in separate card

## Technology Stack

- **Backend**: Node.js with Express
- **Frontend**: Static files in `public/` directory
- **Web Scraping**: axios + cheerio
- **AI Integration**: @google/generative-ai (Gemini 1.5 Pro)
- **Environment**: dotenv for configuration

## Project Structure

```
seo-test/
├── CLAUDE.md                    # Essential rules for Claude Code
├── README.md                    # Project documentation
├── package.json                 # Node.js dependencies
├── server.js                    # Express backend server
├── src/                         # Source code
│   └── main/js/                 # JavaScript backend modules
├── public/                      # Frontend static files
│   ├── index.html              # Main HTML file
│   ├── css/style.css           # Dark mode stylesheet
│   └── js/script.js            # Client-side JavaScript
├── docs/                        # Documentation
└── output/                      # Generated output files
```

## Development Guidelines

- **Always search first** before creating new files
- **Extend existing** functionality rather than duplicating
- **Use Task agents** for operations >30 seconds
- **Single source of truth** for all functionality
- **Commit frequently** after each completed feature
- **Follow CLAUDE.md rules** for technical debt prevention

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   PORT=3000
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open browser to `http://localhost:3000`

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode

## Environment Variables

- `GEMINI_API_KEY` - Google Gemini API key (required)
- `PORT` - Server port (default: 3000)

## Features in Development

- ✅ Project structure setup
- ✅ Essential configuration files
- 🔄 Backend API implementation
- 🔄 Frontend UI development
- 🔄 AI integration with Gemini
- ⏳ SEO analysis algorithms
- ⏳ Results display optimization

## Contributing

This project follows the CLAUDE.md guidelines for technical debt prevention and clean code architecture. Always read and acknowledge the rules before making changes.\n\n---\n\n**Template by Chang Ho Chien | HC AI 說人話channel | v1.0.0**\n**📺 Tutorial: https://youtu.be/8Q1bRZaHH24**