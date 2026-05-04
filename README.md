# tldr — AI Page Summarizer

A modern Chrome Extension (Manifest V3) that extracts webpage content and generates structured AI summaries using Gemini 1.5 Flash.

## Features
- One-Click Summarization: Extracts the main article content and generates a concise summary.
- Executive Summary: 3-5 bullet points covering the core message.
- Key Insights: Highlighted takeaways and important quotes.
- Reading Time: Estimates how long the original article takes to read.
- Smart Caching: Stores summaries per URL to prevent redundant API calls.
- Clean UI: Built with Tailwind CSS v4 for a premium experience.

## Technical Stack
- Framework: React + TypeScript
- Styling: Tailwind CSS v4
- Build Tool: Vite + @crxjs/vite-plugin
- Content Parsing: @mozilla/readability (Mozilla's Reader View engine)
- AI Integration: Google Gemini API (Gemini 1.5 Flash)

## Architecture
The extension follows a decoupled architecture to ensure performance and security:

1.  Popup UI (src/popup/): A React application that handles user interaction and displays the summary.
2.  Content Script (src/content/): Injected into the active tab. It clones the DOM and uses Readability to extract clean text while stripping navigation, ads, and sidebars.
3.  Background Service Worker (src/background/): Acts as a secure proxy. It receives the extracted text, retrieves the API key from chrome.storage, and communicates with the Gemini API.
4.  Options Page (src/options/): A dedicated settings page for secure API key management.

## Security Decisions
- Bring-Your-Own-Key (BYOK): To ensure absolute security without an expensive backend proxy, users provide their own Gemini API key.
- Local Storage Encryption: Keys are stored in chrome.storage.local, which is scoped to the extension and inaccessible to websites.
- Background API Calls: All AI requests are made from the Background Service Worker. This prevents the API key from ever being exposed to the webpage DOM or the Content Script environment.
- Content Sanitization: Use of Readability ensures only meaningful text is processed, reducing the risk of prompt injection from malicious page elements.

## Setup Instructions
1.  Clone the Repository:
    ```bash
    git clone git@github:mryan-3/tldr.git
    cd tldr
    ```
2.  Install Dependencies:
    ```bash
    pnpm install
    ```
3.  Build the Extension:
    ```bash
    pnpm run build
    ```
4.  Load in Chrome:
    - Open Chrome and navigate to chrome://extensions/
    - Enable Developer mode (top right).
    - Click Load unpacked.
    - Select the dist folder generated in the project root.
5.  Configure API Key:
    - Right-click the extension icon and select Options.
    - Enter your Gemini API key and click Save.

## Trade-offs
- Readability Size: Including @mozilla/readability increases the bundle size slightly, but it provides significantly better extraction than custom regex-based heuristics.
- Client-Side AI: While a backend proxy would allow for a more "seamless" onboarding (no API key needed), the BYOK model is more privacy-centric and cost-effective for an open-source tool.
