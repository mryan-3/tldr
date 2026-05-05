# tldr — AI Page Summarizer

A modern Chrome Extension (Manifest V3) that extracts webpage content and generates structured AI summaries using Gemini 2.5 Flash.

## Setup Instructions

1.  **Clone the Repository**:
    ```bash
    git clone git@github:mryan-3/tldr.git
    cd tldr
    ```
2.  **Install Dependencies**:
    The project uses `pnpm` as the package manager.
    ```bash
    pnpm install
    ```
3.  **Build the Extension**:
    ```bash
    pnpm run build
    ```
4.  **Load in Chrome**:
    - Open Chrome and navigate to `chrome://extensions/`.
    - Enable **Developer mode** (top right toggle).
    - Click **Load unpacked**.
    - Select the `dist` folder generated in the project root.
5.  **Configure API Key**:
    - Right-click the extension icon and select **Options**.
    - Enter your [Google Gemini API Key](https://aistudio.google.com/app/apikey).
    - Click **Save**.

---

## Architecture

The extension follows a decoupled architecture to ensure performance, security, and a smooth user experience:

1.  **Popup UI (`src/popup/`)**: A lightweight Vanilla JS interface for instant loading. It handles user triggers and displays the results.
2.  **Content Script (`src/content/`)**: Injected into the active tab. It clones the DOM and uses `@mozilla/readability` to extract clean text while stripping navigation, ads, and sidebars.
3.  **Background Service Worker (`src/background/`)**: Acts as a secure orchestrator. It receives extracted text, retrieves the API key from `chrome.storage`, and communicates with the Gemini API.
4.  **Options Page (`src/options/`)**: A React-based settings page for secure API key management and configuration.

---

## AI Integration

The extension integrates with Google's **Gemini 2.5 Flash** model to provide fast and accurate summaries.

-   **Prompt Engineering**: We use a structured prompt that enforces a JSON response schema. This ensures the output can be reliably parsed and displayed in the UI.
-   **Structured Output**: The AI is instructed to return a specific JSON object containing a bulleted `summary`, `keyInsights`, and an estimated `readingTime`.
-   **Error Handling**: The background script includes retry logic and defensive parsing (regex-based JSON extraction) to handle AI responses that might include conversational filler.

---

## Security Decisions

-   **Bring-Your-Own-Key (BYOK)**: To ensure privacy and avoid centralized data storage, users provide their own Gemini API key.
-   **Isolated Execution**: All AI communication happens in the **Background Service Worker**. The API key is never exposed to the webpage DOM or the Content Script environment.
-   **Secure Storage**: Keys are stored in `chrome.storage.local`, which is encrypted at rest by the browser and accessible only to the extension.
-   **Content Sanitization**: By using Mozilla's `Readability` engine, we strip out potentially malicious scripts and focus only on relevant text content before sending it to the AI.

---

## Trade-offs

-   **Readability Bundle Size**: Including `@mozilla/readability` adds approximately 100KB to the bundle. However, it provides industry-standard extraction that far exceeds what custom regex or selector-based logic can achieve.
-   **Vanilla JS Popup**: While the options page uses React, the popup uses Vanilla JS to ensure sub-millisecond initialization times when the user clicks the extension icon.
-   **BYOK Model**: Requiring a user API key adds a setup hurdle compared to a managed backend. However, it provides a "free-forever" model for users and ensures absolute data privacy.
