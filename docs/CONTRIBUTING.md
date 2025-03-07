# Contributing to InBody Measurement Tracker

Thank you for your interest in contributing to the InBody Measurement Tracker project! This document provides guidelines and instructions for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Environment](#development-environment)
4. [Development Workflow](#development-workflow)
5. [Pull Request Process](#pull-request-process)
6. [Coding Standards](#coding-standards)
7. [Testing](#testing)
8. [Documentation](#documentation)
9. [Issue Reporting](#issue-reporting)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. Please:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. **Fork the Repository**
   - Click the "Fork" button at the top right of the repository page
   - This creates a copy of the repository in your GitHub account

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/your-username/inbody-measurement-tracker.git
   cd inbody-measurement-tracker
   ```

3. **Add the Upstream Remote**
   ```bash
   git remote add upstream https://github.com/original-owner/inbody-measurement-tracker.git
   ```

4. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
   
   Branch naming conventions:
   - `feature/` - for new features
   - `bugfix/` - for bug fixes
   - `docs/` - for documentation changes
   - `refactor/` - for code refactoring
   - `test/` - for adding or updating tests

## Development Environment

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- Google Cloud Platform account with:
  - Vertex AI API enabled
  - Firestore database
  - Service account with appropriate permissions

### Setup

1. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

3. **Environment Variables**
   - Copy `.env.example` to `.env` and update with your settings
   - Set up Google Cloud credentials as described in the README

4. **Running the Development Servers**
   
   Backend:
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```
   
   Frontend:
   ```bash
   cd frontend
   npm start
   ```

## Development Workflow

1. **Keep Your Fork Updated**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   git push origin main
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write code that follows the project's coding standards
   - Add or update tests as necessary
   - Update documentation to reflect your changes

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
   
   Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` - a new feature
   - `fix:` - a bug fix
   - `docs:` - documentation changes
   - `style:` - formatting changes that don't affect code behavior
   - `refactor:` - code changes that neither fix bugs nor add features
   - `test:` - adding or updating tests
   - `chore:` - maintenance tasks, dependency updates, etc.

5. **Push Your Changes**
   ```bash
   git push origin feature/your-feature-name
   ```

## Pull Request Process

1. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your feature branch
   - Click "Create Pull Request"

2. **PR Description**
   - Provide a clear description of the changes
   - Reference any related issues using the syntax `Fixes #123` or `Relates to #123`
   - Include screenshots or GIFs for UI changes if applicable

3. **Code Review**
   - Maintainers will review your code
   - Address any feedback or requested changes
   - Update your branch as needed

4. **Merge**
   - Once approved, a maintainer will merge your PR
   - Your contribution will be part of the next release

## Coding Standards

### General Guidelines

- Write clean, readable, and maintainable code
- Follow the principle of "Do One Thing" for functions and classes
- Keep functions small and focused
- Use meaningful variable and function names
- Add comments for complex logic, but prefer self-documenting code

### Python (Backend)

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) style guide
- Use type hints where appropriate
- Document functions and classes using docstrings
- Use f-strings for string formatting
- Organize imports alphabetically within groups:
  1. Standard library imports
  2. Related third-party imports
  3. Local application/library specific imports

### JavaScript/React (Frontend)

- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use ES6+ features where appropriate
- Prefer functional components with hooks over class components
- Use destructuring for props and state
- Keep components small and focused on a single responsibility
- Use PropTypes or TypeScript for type checking

## Testing

### Backend Testing

- Write unit tests for all new functionality
- Use pytest for testing
- Aim for high test coverage, especially for critical paths
- Run tests before submitting a PR:
  ```bash
  cd backend
  pytest
  ```

### Frontend Testing

- Write unit tests for components and utilities
- Use Jest and React Testing Library
- Test user interactions and component rendering
- Run tests before submitting a PR:
  ```bash
  cd frontend
  npm test
  ```

## Documentation

Good documentation is crucial for the project's usability and maintainability:

- Update the README.md if you change project setup or requirements
- Document new features in the appropriate documentation files
- Add JSDoc or docstring comments to functions and classes
- Update API documentation when changing endpoints
- Create or update user guides for significant UI changes

## Issue Reporting

If you find a bug or have a feature request:

1. Check if the issue already exists in the GitHub Issues
2. If not, create a new issue with:
   - A clear title and description
   - Steps to reproduce (for bugs)
   - Expected and actual behavior (for bugs)
   - Screenshots or GIFs if applicable
   - Any relevant logs or error messages
   - Your environment (browser, OS, etc.)

## Feature Requests

When proposing new features:

1. Explain the problem the feature would solve
2. Describe how users would use the feature
3. Suggest an implementation approach if possible
4. Discuss alternatives you've considered

---

Thank you for contributing to the InBody Measurement Tracker project! Your efforts help make this tool better for everyone.
