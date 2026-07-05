# Partha-Sarathi UI Generation Prompt

You are tasked with building the frontend for **Partha-Sarathi**, a philosophical AI chatbot grounded strictly in the Bhagavad Gita. The backend API is already built and handles the RAG pipeline. Your sole focus is creating an **imaginative, breathtaking, and incredibly smooth UI/UX** that perfectly balances the ancient, divine aura of Lord Krishna with a sleek, ultra-modern, and highly responsive web application.

## 🎨 Thematic Vision & Aesthetics (The "Wildest Imagination")
We want an interface that feels both ancient and futuristic—a digital chariot for the mind. 
- **Color Palette:** Deep, cosmic, and mystical. Think "Vishvarupa" (the Universal Form): deep cosmic voids (obsidian/midnight blues), accented with radiant, divine gold (amber/gold trim), subtle peacock-feather hues (iridescent teals and sapphire blues), and soft glowing text.
- **Typography:** Use a clean, modern sans-serif like **Inter** or **Outfit** for the main UI/chat text, but use a beautiful, classical serif like **Tiro Devanagari** or **Noto Serif Devanagari** specifically for the Sanskrit/Devanagari verses to give them profound reverence. Include a robust fallback chain for Devanagari: `font-family: 'Tiro Devanagari', 'Noto Sans Devanagari', system-ui, sans-serif`.
- **Micro-animations (Glassmorphism & Glows):** The UI should use heavily blurred glassmorphism (`backdrop-blur`) against a subtle, slow-moving cosmic or abstract cosmic-dust background. 
- **Smoothness:** Messages shouldn't just pop in; they should fade and slide up gracefully (e.g., Framer Motion or Tailwind animations). The UI must feel completely fluid and alive.

---

## 🧩 Required Components & Layout

1. **Disclaimer Banner (`DisclaimerBanner`)**
   - **Position:** Sticky at the very top (`z-50`).
   - **Aesthetic:** A subtle golden/amber warning bar.
   - **Text:** *"This is not professional advice and is based only on Gita facts. Please verify any advice and consult an expert."*
   - **Action:** Must be dismissible with a (✕) button. Must persist the dismiss state in `sessionStorage` so it doesn't re-appear on re-renders.

2. **Main Chat Layout & Window (`ChatWindow`)**
   - A centered, max-width container (like modern AI chat interfaces) that takes up the remaining viewport height.
   - Fully responsive (mobile-first).
   - **Scroll Behavior:** Auto-scroll to the bottom when new messages arrive *only if* the user is already at the bottom (within ~100px). If they have scrolled up to read history, show a floating "New message ↓" indicator button instead.
   - **Network Status:** Detect offline status (`navigator.onLine`) and display a persistent "You are offline" banner if connection is lost.

3. **Welcome View (`WelcomeShloka`)**
   - When the session starts (empty chat), display a visually stunning "Welcome" card. It should show a random Shloka (Sanskrit + English) in the center of the screen with a glowing, ethereal border to set the mood before the user types their dilemma.

4. **Message Bubbles (`MessageBubble`)**
   - **User Messages:** Right-aligned, perhaps a sleek, muted glass bubble.
   - **Bot Messages:** Left-aligned. The bot does not speak in normal paragraphs; it returns a heavily structured `ShlokaCard`.

5. **The Shloka Card (`ShlokaCard`)**
   - This is the centerpiece of the application. When the API returns a response, format it beautifully:
   - **Header:** The citation (e.g., "Chapter 2, Verse 47") in a glowing, golden accent.
   - **Sanskrit:** The Devanagari text, centered, using the `Tiro Devanagari` font, slightly larger, perhaps with a subtle text-shadow to make it feel sacred. Add `lang="sa"` for screen reader accessibility. Use `overflow-wrap: break-word` and responsive text sizing for very long verses. Gracefully hide this block if Devanagari is missing (`null`).
   - **Translation:** The English translation in italics.
   - **Application (The "Guidance"):** A distinctly separated block of text (the core advice) in clean sans-serif.
   - **Reflection:** A final question for the user to ponder, styled distinctly (e.g., inside a subtly colored accent box or blockquote) to invite a follow-up.

6. **Crisis Alert Component (`CrisisAlert`)**
   - If the API returns a crisis flag (`type: "crisis"`), the UI must display a highly distinct, urgent (but compassionate) card providing professional helpline information. No Sanskrit or philosophy here—just clean, prominent safety info.

7. **Input Bar (`InputBar`)**
   - Fixed at the bottom inside the central container. Ensure `position: sticky; bottom: 0` and include the viewport meta tag `interactive-widget=resizes-content` to prevent the mobile virtual keyboard from obscuring it.
   - A glowing, glassmorphic input field.
   - **Character Limit:** Limit input to 2000 characters and include a subtle character counter.
   - **Send Button:** Sleek icon (e.g., conch shell, chariot wheel, or a modern arrow). Disable the button if the input is empty or if the API is currently loading (debounce to prevent double-submits).
   - Must show a beautiful, mystical loading state (e.g., a pulsing golden chakra or glowing orbit) while waiting for the API.

---

## 🔌 Data Architecture & State (React Hooks)

You will need to implement two primary hooks to manage state, though for this prototype, you can **mock the API responses** with hardcoded data matching the structure below:

1. **`useSession`**: Generates and persists a unique `sessionId` (UUID v4) in `sessionStorage`. Wrap `sessionStorage` access in try/catch for browsers that block it (e.g., strict incognito).
2. **`useChat`**: Manages the `messages` array, `isLoading`, and `error` states. It handles the `sendMessage(text)` function.

### API Contract (For Mocking Data)
The backend returns this exact JSON structure for a standard response. Your UI must map these fields exactly into the `ShlokaCard`:

\`\`\`json
{
  "type": "shloka_response",
  "shloka": {
    "chapter": 2,
    "verse": 47,
    "citation": "Chapter 2, Verse 47",
    "devanagari": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥ ४७ ॥",
    "sanskrit_roman": "karmaṇy evādhikāras te..."
  },
  "translation": "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.",
  "application": "Your duty in life is to perform the activities prescribed for you, as determined by your situation.",
  "reflection": "Can you truly fulfill your duty without attachment to the results?",
  "sources": [{"chapter": 2, "verse": 47, "similarity": 0.85}]
}
\`\`\`

*(Note: The API may also return `{"type": "crisis", "message": "..."}` or `{"type": "decline", "message": "..."}` which should render as standard text bubbles or the `CrisisAlert`).*

---

## 🛠️ Tech Stack & Constraints
- **Framework:** React (Next.js, Vite, or standard React).
- **Styling:** Tailwind CSS. Use arbitrary values and modern Tailwind features for the glassmorphism (`backdrop-blur-xl`, `bg-white/5`, etc.).
- **Dark Mode:** Fully support system dark mode via Tailwind's `dark:` variants and `prefers-color-scheme: dark`. The cosmic theme naturally leans dark, but ensure contrast holds across both modes.
- **Icons:** Lucide React or similar clean icon set.
- **Animations:** Framer Motion (highly recommended for the message entry and glowing pulse effects) or Tailwind transitions.

**Final Directive:** Give the user chills when they load this app. It should feel like they are stepping onto the battlefield of Kurukshetra, seeking wisdom from the cosmos itself, wrapped in a pristine, 2026-era UI.
