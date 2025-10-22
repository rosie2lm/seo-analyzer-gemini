class SEOAnalyzer {
    constructor() {
        this.form = document.getElementById('analyzeForm');
        this.urlInput = document.getElementById('urlInput');
        this.loadingSection = document.getElementById('loadingSection');
        this.resultsSection = document.getElementById('resultsSection');
        this.errorSection = document.getElementById('errorSection');
        this.retryBtn = document.getElementById('retryBtn');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.retryBtn.addEventListener('click', () => this.retryAnalysis());

        // Add input validation
        this.urlInput.addEventListener('input', (e) => this.validateInput(e));
    }

    validateInput(event) {
        const input = event.target;
        const value = input.value.trim();

        // Basic URL validation
        if (value && !this.isValidURL(value)) {
            input.setCustomValidity('Please enter a valid URL (e.g., https://example.com)');
        } else {
            input.setCustomValidity('');
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

    async handleSubmit(event) {
        event.preventDefault();

        const url = this.urlInput.value.trim();
        if (!url) {
            this.showError('Please enter a website URL');
            return;
        }

        if (!this.isValidURL(url)) {
            this.showError('Please enter a valid URL (e.g., https://example.com)');
            return;
        }

        await this.analyzeWebsite(url);
    }

    async analyzeWebsite(url) {
        try {
            this.showLoading();

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Analysis failed');
            }

            if (!result.success) {
                throw new Error(result.message || 'Analysis failed');
            }

            this.displayResults(result);

        } catch (error) {
            console.error('Analysis error:', error);
            this.showError(error.message || 'Failed to analyze the website. Please try again.');
        }
    }

    showLoading() {
        this.hideAllSections();
        this.loadingSection.classList.remove('hidden');
        this.loadingSection.classList.add('fade-in');
    }

    displayResults(result) {
        this.hideAllSections();
        this.resultsSection.classList.remove('hidden');
        this.resultsSection.classList.add('fade-in');

        // Display SEO Score
        this.displayScore(result.aiSuggestions);

        // Display Structured Analysis
        this.displayStructuredAnalysis(result.analysis);

        // Display AI Suggestions
        this.displayAISuggestions(result.aiSuggestions);

        // Display Blog Ideas
        this.displayBlogIdeas(result.aiSuggestions);

        // Display Performance Stats
        this.displayPerformanceStats(result.performance);
    }

    displayScore(aiSuggestions) {
        const scoreElement = document.getElementById('seoScore');
        const explanationElement = document.getElementById('scoreExplanation');

        scoreElement.textContent = aiSuggestions.seoScore || 0;
        explanationElement.textContent = aiSuggestions.scoreExplanation || 'SEO analysis completed.';

        // Add color coding based on score
        const score = parseInt(scoreElement.textContent);
        scoreElement.className = 'score-number';

        if (score >= 80) {
            scoreElement.style.color = '#28a745'; // Green
        } else if (score >= 60) {
            scoreElement.style.color = '#ffc107'; // Yellow
        } else {
            scoreElement.style.color = '#dc3545'; // Red
        }
    }

    displayStructuredAnalysis(analysis) {
        const container = document.getElementById('structuredAnalysis');

        const html = `
            <div class="metric-item">
                <div class="metric-label">
                    <i class="fas fa-file-word"></i>
                    Word Count
                </div>
                <div class="metric-value">${analysis.wordCount || 0} words</div>
            </div>

            <div class="metric-item">
                <div class="metric-label">
                    <i class="fas fa-heading"></i>
                    Title Tag
                </div>
                <div class="metric-value">
                    ${analysis.title?.content || 'Not found'}
                    <span class="metric-status ${analysis.title?.isOptimal ? 'status-good' : 'status-warning'}">
                        ${analysis.title?.length || 0} chars
                    </span>
                </div>
            </div>

            <div class="metric-item">
                <div class="metric-label">
                    <i class="fas fa-tag"></i>
                    Meta Description
                </div>
                <div class="metric-value">
                    ${analysis.metaDescription?.content || 'Not found'}
                    <span class="metric-status ${analysis.metaDescription?.isOptimal ? 'status-good' : 'status-warning'}">
                        ${analysis.metaDescription?.length || 0} chars
                    </span>
                </div>
            </div>

            <div class="metric-item">
                <div class="metric-label">
                    <i class="fas fa-image"></i>
                    Images
                </div>
                <div class="metric-value">
                    ${analysis.images?.total || 0} total, ${analysis.images?.missingAlt || 0} missing alt
                    <span class="metric-status ${analysis.images?.altPercentage >= 90 ? 'status-good' : analysis.images?.altPercentage >= 70 ? 'status-warning' : 'status-bad'}">
                        ${analysis.images?.altPercentage || 0}% with alt
                    </span>
                </div>
            </div>

            <div class="metric-item">
                <div class="metric-label">
                    <i class="fas fa-header"></i>
                    Headings
                </div>
                <div class="metric-value">
                    ${analysis.headings?.totalCount || 0} total, ${analysis.headings?.h1Count || 0} H1 tags
                    <span class="metric-status ${analysis.headings?.h1Count === 1 ? 'status-good' : 'status-warning'}">
                        ${analysis.headings?.h1Count === 1 ? 'Optimal' : 'Needs attention'}
                    </span>
                </div>
            </div>

            <div class="metric-item">
                <div class="metric-label">
                    <i class="fas fa-link"></i>
                    Links
                </div>
                <div class="metric-value">
                    ${analysis.links?.total || 0} total (${analysis.links?.internal || 0} internal, ${analysis.links?.external || 0} external)
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    displayAISuggestions(aiSuggestions) {
        const container = document.getElementById('aiSuggestions');
        const improvements = aiSuggestions.improvements || [];

        if (improvements.length === 0) {
            container.innerHTML = '<p>No specific suggestions available.</p>';
            return;
        }

        const html = `
            <ul class="suggestions-list">
                ${improvements.map((suggestion, index) => `
                    <li>
                        <div class="suggestion-item">
                            <i class="fas fa-check-circle suggestion-icon"></i>
                            <div class="suggestion-text">${this.escapeHtml(suggestion)}</div>
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;

        container.innerHTML = html;
    }

    displayBlogIdeas(aiSuggestions) {
        const container = document.getElementById('blogIdeas');
        const blogIdeas = aiSuggestions.blogIdeas || [];

        if (blogIdeas.length === 0) {
            container.innerHTML = '<p>No blog post ideas available.</p>';
            return;
        }

        const html = `
            <ul class="blog-ideas-list">
                ${blogIdeas.map((idea, index) => `
                    <li>
                        <div class="blog-idea-item">
                            <i class="fas fa-lightbulb blog-idea-icon"></i>
                            <div class="blog-idea-text">${this.escapeHtml(idea)}</div>
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;

        container.innerHTML = html;
    }

    displayPerformanceStats(performance) {
        const container = document.getElementById('performanceStats');

        const html = `
            <div class="performance-stat">
                <span class="performance-stat-value">${performance.loadingTime || 0}ms</span>
                <span class="performance-stat-label">Page Load Time</span>
            </div>
            <div class="performance-stat">
                <span class="performance-stat-value">${performance.analysisTime || 0}ms</span>
                <span class="performance-stat-label">Analysis Time</span>
            </div>
        `;

        container.innerHTML = html;
    }

    showError(message) {
        this.hideAllSections();
        this.errorSection.classList.remove('hidden');
        this.errorSection.classList.add('fade-in');

        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = message;
    }

    retryAnalysis() {
        this.hideAllSections();
        this.form.reset();
        this.urlInput.focus();
    }

    hideAllSections() {
        this.loadingSection.classList.add('hidden');
        this.resultsSection.classList.add('hidden');
        this.errorSection.classList.add('hidden');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SEOAnalyzer();

    // Add some helpful console messages
    console.log('🚀 SEO Analyzer initialized');
    console.log('📊 Enter a website URL to get started');
});