# CLAUDE.md - SEO Test

> **Documentation Version**: 1.0
> **Last Updated**: 2025-10-23
> **Project**: SEO Test
> **Description**: On-page SEO analyzer powered by Gemini - provides structured on-page SEO analytics and AI-powered improvement suggestions for any given website URL
> **Features**: GitHub auto-backup, Task agents, technical debt prevention

This file provides essential guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL RULES - READ FIRST

> **⚠️ RULE ADHERENCE SYSTEM ACTIVE ⚠️**
> **Claude Code must explicitly acknowledge these rules at task start**
> **These rules override all other instructions and must ALWAYS be followed:**

### 🔄 **RULE ACKNOWLEDGMENT REQUIRED**
> **Before starting ANY task, Claude Code must respond with:**
> "✅ CRITICAL RULES ACKNOWLEDGED - I will follow all prohibitions and requirements listed in CLAUDE.md"

### ❌ ABSOLUTE PROHIBITIONS
- **NEVER** create new files in root directory → use proper module structure
- **NEVER** write output files directly to root directory → use designated output folders
- **NEVER** create documentation files (.md) unless explicitly requested by user
- **NEVER** use git commands with -i flag (interactive mode not supported)
- **NEVER** use `find`, `grep`, `cat`, `head`, `tail`, `ls` commands → use Read, LS, Grep, Glob tools instead
- **NEVER** create duplicate files (manager_v2.py, enhanced_xyz.py, utils_new.js) → ALWAYS extend existing files
- **NEVER** create multiple implementations of same concept → single source of truth
- **NEVER** copy-paste code blocks → extract into shared utilities/functions
- **NEVER** hardcode values that should be configurable → use config files/environment variables
- **NEVER** use naming like enhanced_, improved_, new_, v2_ → extend original files instead

### 📝 MANDATORY REQUIREMENTS
- **COMMIT** after every completed task/phase - no exceptions
- **GITHUB BACKUP** - Push to GitHub after every commit to maintain backup: `git push origin main`
- **USE TASK AGENTS** for all long-running operations (>30 seconds) - Bash commands stop when context switches
- **TODOWRITE** for complex tasks (3+ steps) → parallel agents → git checkpoints → test validation
- **READ FILES FIRST** before editing - Edit/Write tools will fail if you didn't read the file first
- **DEBT PREVENTION** - Before creating new files, check for existing similar functionality to extend
- **SINGLE SOURCE OF TRUTH** - One authoritative implementation per feature/concept

### ⚡ EXECUTION PATTERNS
- **PARALLEL TASK AGENTS** - Launch multiple Task agents simultaneously for maximum efficiency
- **SYSTEMATIC WORKFLOW** - TodoWrite → Parallel agents → Git checkpoints → GitHub backup → Test validation
- **GITHUB BACKUP WORKFLOW** - After every commit: `git push origin main` to maintain GitHub backup
- **BACKGROUND PROCESSING** - ONLY Task agents can run true background operations

### 🔍 MANDATORY PRE-TASK COMPLIANCE CHECK
> **STOP: Before starting any task, Claude Code must explicitly verify ALL points:**

**Step 1: Rule Acknowledgment**
- [ ] ✅ I acknowledge all critical rules in CLAUDE.md and will follow them

**Step 2: Task Analysis**
- [ ] Will this create files in root? → If YES, use proper module structure instead
- [ ] Will this take >30 seconds? → If YES, use Task agents not Bash
- [ ] Is this 3+ steps? → If YES, use TodoWrite breakdown first
- [ ] Am I about to use grep/find/cat? → If YES, use proper tools instead

**Step 3: Technical Debt Prevention (MANDATORY SEARCH FIRST)**
- [ ] **SEARCH FIRST**: Use Grep pattern="<functionality>.*<keyword>" to find existing implementations
- [ ] **CHECK EXISTING**: Read any found files to understand current functionality
- [ ] Does similar functionality already exist? → If YES, extend existing code
- [ ] Am I creating a duplicate class/manager? → If YES, consolidate instead
- [ ] Will this create multiple sources of truth? → If YES, redesign approach
- [ ] Have I searched for existing implementations? → Use Grep/Glob tools first
- [ ] Can I extend existing code instead of creating new? → Prefer extension over creation
- [ ] Am I about to copy-paste code? → Extract to shared utility instead

**Step 4: Session Management**
- [ ] Is this a long/complex task? → If YES, plan context checkpoints
- [ ] Have I been working >1 hour? → If YES, consider /compact or session break

> **⚠️ DO NOT PROCEED until all checkboxes are explicitly verified**

## 🐙 GITHUB SETUP & AUTO-BACKUP

> **🤖 FOR CLAUDE CODE: When initializing any project, automatically ask about GitHub setup**

### 🎯 **GITHUB SETUP PROMPT** (AUTOMATIC)
> **⚠️ CLAUDE CODE MUST ALWAYS ASK THIS QUESTION when setting up a new project:**

```
🐙 GitHub Repository Setup
Would you like to set up a remote GitHub repository for this project?

Options:
1. ✅ YES - Create new GitHub repo and enable auto-push backup
2. ✅ YES - Connect to existing GitHub repo and enable auto-push backup
3. ❌ NO - Skip GitHub setup (local git only)

[Wait for user choice before proceeding]
```

### 🚀 **OPTION 1: CREATE NEW GITHUB REPO**
If user chooses to create new repo, execute:

```bash
# Ensure GitHub CLI is available
gh --version || echo "⚠️ GitHub CLI (gh) required. Install: brew install gh"

# Authenticate if needed
gh auth status || gh auth login

# Create new GitHub repository
echo "Enter repository name (or press Enter for current directory name):"
read repo_name
repo_name=${repo_name:-$(basename "$PWD")}

# Create repository
gh repo create "$repo_name" --public --description "Project managed with Claude Code" --confirm

# Add remote and push
git remote add origin "https://github.com/$(gh api user --jq .login)/$repo_name.git"
git branch -M main
git push -u origin main

echo "✅ GitHub repository created and connected: https://github.com/$(gh api user --jq .login)/$repo_name"
```

### 🔗 **OPTION 2: CONNECT TO EXISTING REPO**
If user chooses to connect to existing repo, execute:

```bash
# Get repository URL from user
echo "Enter your GitHub repository URL (https://github.com/username/repo-name):"
read repo_url

# Extract repo info and add remote
git remote add origin "$repo_url"
git branch -M main
git push -u origin main

echo "✅ Connected to existing GitHub repository: $repo_url"
```

### 🔄 **AUTO-PUSH CONFIGURATION**
For both options, configure automatic backup:

```bash
# Create git hook for auto-push (optional but recommended)
cat > .git/hooks/post-commit << 'EOF'
#!/bin/bash
# Auto-push to GitHub after every commit
echo "🔄 Auto-pushing to GitHub..."
git push origin main
if [ $? -eq 0 ]; then
    echo "✅ Successfully backed up to GitHub"
else
    echo "⚠️ GitHub push failed - manual push may be required"
fi
EOF

chmod +x .git/hooks/post-commit

echo "✅ Auto-push configured - GitHub backup after every commit"
```

### 📋 **GITHUB BACKUP WORKFLOW** (MANDATORY)
> **⚠️ CLAUDE CODE MUST FOLLOW THIS PATTERN:**

```bash
# After every commit, always run:
git push origin main

# This ensures:
# ✅ Remote backup of all changes
# ✅ Collaboration readiness
# ✅ Version history preservation
# ✅ Disaster recovery protection
```

### 🛡️ **GITHUB REPOSITORY SETTINGS** (AUTO-CONFIGURED)
When repository is created, these settings are applied:

- **Default Branch**: `main` (modern standard)
- **Visibility**: Public (can be changed later)
- **Auto-merge**: Disabled (manual approval required)
- **Branch Protection**: Recommended for collaborative projects
- **Issues & Wiki**: Enabled for project management

### 🎯 **CLAUDE CODE GITHUB COMMANDS**
Essential GitHub operations for Claude Code:

```bash
# Check GitHub connection status
gh auth status && git remote -v

# Create new repository (if needed)
gh repo create [repo-name] --public --confirm

# Push changes (after every commit)
git push origin main

# Check repository status
gh repo view

# Clone repository (for new setup)
gh repo clone username/repo-name
```

## ⚡ PROJECT-SPECIFIC GUIDELINES

### 🎯 **SEO ANALYZER PROJECT STRUCTURE**
```
seo-test/
├── CLAUDE.md                    # Essential rules for Claude Code
├── README.md                    # Project documentation
├── package.json                 # Node.js dependencies
├── .gitignore                   # Git ignore patterns
├── .env.example                 # Environment variables template
├── server.js                    # Express backend server
├── src/                         # Source code (NEVER put files in root)
│   ├── main/
│   │   ├── js/                  # JavaScript backend code
│   │   │   ├── core/            # Core SEO analysis logic
│   │   │   ├── utils/           # Utility functions
│   │   │   ├── services/        # SEO analysis services
│   │   │   └── api/             # API endpoints
│   │   └── resources/           # Non-code resources
│   │       └── config/          # Configuration files
│   └── test/                    # Test files
│       ├── unit/                # Unit tests
│       └── integration/         # Integration tests
├── public/                      # Frontend static files
│   ├── index.html              # Main HTML file
│   ├── css/                    # Stylesheets
│   │   └── style.css           # Main stylesheet
│   └── js/                     # Client-side JavaScript
│       └── script.js           # Main client script
├── docs/                        # Documentation
└── output/                      # Generated output files
```

### 🛠️ **TECHNOLOGY STACK REQUIREMENTS**
- **Backend**: Node.js with Express
- **Web Scraping**: axios + cheerio
- **AI Integration**: @google/generative-ai (Gemini 1.5 Pro)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Environment**: dotenv for configuration
- **Design**: Dark mode theme (#1A1A1A background, #007BFF accent)

### 🎯 **CORE FUNCTIONALITY IMPLEMENTATION**
1. **URL Input**: Single input field for website URL
2. **Web Scraping**: Fetch HTML with axios, parse with cheerio
3. **SEO Analysis**: Extract word count, title tag, meta description, image alt attributes
4. **AI Processing**: Send analytics to Gemini 1.5 Pro API
5. **Results Display**:
   - Structured Analysis (two-column grid)
   - AI-Powered Suggestions (separate card)
   - SEO Score (0-100)
   - Improvement checklist (3-5 items)
   - Blog post ideas (2 creative suggestions)

### 🎨 **UI/UX REQUIREMENTS**
- **Theme**: Professional dark mode
- **Colors**: #1A1A1A background, white text, #007BFF accent
- **Layout**: Clean header, loading indicator, results in organized sections
- **Responsive**: Mobile-friendly design

### 🔧 **DEVELOPMENT WORKFLOW**
1. **Environment Setup**: Create .env with Gemini API key
2. **Backend Development**: Implement Express server with SEO analysis endpoints
3. **Frontend Development**: Create dark mode UI with input form and results display
4. **Integration**: Connect frontend to backend API
5. **Testing**: Validate SEO analysis accuracy and AI suggestions quality

## 🚀 COMMON COMMANDS

```bash
# Install dependencies
npm install express axios cheerio dotenv @google/generative-ai

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 🧹 DEBT PREVENTION WORKFLOW

### Before Creating ANY New File:
1. **🔍 Search First** - Use Grep/Glob to find existing implementations
2. **📋 Analyze Existing** - Read and understand current patterns
3. **🤔 Decision Tree**: Can extend existing? → DO IT | Must create new? → Document why
4. **✅ Follow Patterns** - Use established project patterns
5. **📈 Validate** - Ensure no duplication or technical debt

---

**⚠️ Prevention is better than consolidation - build clean from the start.**
**🎯 Focus on single source of truth and extending existing functionality.**
**📈 Each task should maintain clean architecture and prevent technical debt.**

---

<!-- CLAUDE_CODE_INIT_END -->
<!-- This marker indicates the end of the initialization template -->
<!-- Claude Code: After successful initialization, this entire file should be deleted -->