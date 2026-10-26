# qpdrwn Project Brief + Telegram

A responsive project brief form with server-side Telegram Bot API delivery. Form submissions and optional attachments are sent to the Telegram chat you configure.

## Security note

**Never put your Telegram bot token in `public/script.js`, HTML, or any code delivered to the browser.** Keep it in `.env` on the server. If you have already published a bot token, regenerate it with `@BotFather` before using this project.

## Requirements

- Node.js 20 or newer
- A Telegram bot created with `@BotFather`
- The target Telegram chat ID

## Setup

The site can start before Telegram credentials are added, so you can preview the pages. Submitting the form will return a clear configuration error until both Telegram values are set in `.env`.


1. Create a bot by opening Telegram and chatting with `@BotFather`. Use `/newbot` and follow its instructions. Copy the bot token.
2. Open the bot's chat and send `/start`.
3. To find your chat ID, open this URL in a browser after replacing `YOUR_BOT_TOKEN` with your token:

   `https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates`

   Look for `message` → `chat` → `id` in the response. Keep that URL private because it contains your secret token. If `result` is empty, send another message to your bot and refresh. For a group, add the bot to the group and use the group's chat ID.
4. Copy `.env.example` to a new file named `.env` and fill in `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. Never commit or share `.env`.
5. Install dependencies and start the app:

   ```sh
   npm install
   npm start
   ```

6. Visit `http://localhost:3000/` or `http://localhost:3000/brief.html`. The homepage redirects to the project brief. Submit a test brief. The configured Telegram chat should receive the details and, if attached, the file.

## Attachments and validation

- Optional one-file upload: JPG, JPEG, PNG, PDF, SVG, AI, or PSD.
- Maximum upload size: 10 MB.
- Inputs are validated on the server; a basic in-memory limit allows up to five submissions per IP per ten minutes.
- Keep this Node server running and deploy it to a server/platform that supports Node.js. A static-only host cannot run `server.js`; deploy the whole app or configure a serverless equivalent.

## Existing qpdrwn site

The page lives in `public/brief.html`, with its styles and browser behavior in `public/style.css` and `public/script.js`. A simple `index.html` redirect and a starter `services.html` page are included so navigation does not lead to missing pages. Replace these with your own pages if you have them. If your current site already has its own stylesheet/scripts, merge the relevant styles carefully to avoid replacing your other pages' styles.
