# Lovitt's BJJ Website

This is the official website for Lovitt's BJJ, a Brazilian Jiu-Jitsu school in Concord, CA. Built by Cayvon Morady.

## Technical Stack

### Frontend
- **Next.js 15**: React framework with App Router for server-side rendering and static generation
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For responsive and utility-first styling
- **React**: For building interactive UI components

### Content Management
- **Sanity CMS**: Headless CMS + Studio (`/studio`) for managing:
  - Class schedules and program information
  - Instructor profiles
  - Pricing plans
  - Homepage alert/program sections
  - Gallery image content (schema exists)

### AI Chatbot
- **MistralAI**: Uses `open-mistral-nemo` for generated responses
- **Conversation Context**: Includes recent chat history in each API request
- **Fallback Responses**: Keyword-based response fallback if Mistral is unavailable
- **Web Crawler**: Custom crawler updates chatbot knowledge from site pages

### Deployment & Infrastructure
- **Vercel-compatible Next.js app**
- **Environment Variables**: For securely storing API keys and configuration

## Key Features

### Interactive Schedule
- Dynamic class schedule populated from Sanity CMS
- Visual indicators for different class types
- Mobile-responsive design

### Intelligent Chatbot
- Answers questions about schedule, pricing, programs, and contact info
- Uses crawler + structured program/pricing context for better accuracy
- Falls back to static responses if AI key/service is unavailable
- Handles follow-up questions with short conversation context

### Content Management
- Easy content updates through Sanity Studio
- Real-time updates to the website when content changes
- Image optimization and responsive delivery

### Instructor Page
- Instructor profiles loaded from Sanity
- Ordered display with bio, achievements, certifications, and social links

### Gallery Status
- Gallery schema/content type exists in Sanity
- Public gallery page is currently hidden in the app

## Development

### Prerequisites
- Node.js 18.18+ (Node.js 20 LTS recommended)
- npm (included with Node.js)

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Variables

Create a `.env.local` file with the following variables:
```
MISTRAL_API_KEY=your_mistral_api_key
```

Optional variables for migration/publish scripts:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token
```

### Updating the Chatbot Knowledge Base

The chatbot uses a crawler to gather information from the website. To update the knowledge base:

```bash
npm run crawl-website
```

This command is also run automatically before production builds via the `prebuild` script.

## Scripts

```bash
npm run dev            # Start local development server (Turbopack)
npm run lint           # Run ESLint
npm run crawl-website  # Crawl site content for chatbot context
npm run build          # Production build (runs prebuild first)
npm run start          # Start production server via server.js
```

Maintenance scripts:
```bash
npm run migrate-content
npm run publish-all
```

Note: maintenance scripts use `ts-node`. If not installed in your environment, install it first:
```bash
npm install --save-dev ts-node
```

Script note:
- `npm run populate-db` exists in `package.json` but currently points to `scripts/populate-db.ts`, which is not present in this repository.

## Deployment

This project is configured for standard Next.js deployment (including Vercel).  
During production builds, `prebuild` runs `crawl-website` to refresh chatbot content.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity CMS Documentation](https://www.sanity.io/docs)
- [MistralAI Documentation](https://docs.mistral.ai/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
