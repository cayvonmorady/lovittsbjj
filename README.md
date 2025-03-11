# Lovitt's BJJ Website

This is the official website for Lovitt's BJJ, a Brazilian Jiu-Jitsu school in Concord, CA. Built by Cayvon Morady.

## Technical Stack

### Frontend
- **Next.js 14**: React framework with App Router for server-side rendering and static generation
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For responsive and utility-first styling
- **React**: For building interactive UI components

### Content Management
- **Sanity CMS**: Headless CMS for managing website content including:
  - Class schedules and program information
  - Instructor profiles
  - News and announcements
  - Image gallery

### AI Chatbot
- **MistralAI**: Integrated with the open-mistral-7b model for natural language processing
- **Conversation Memory**: Maintains context across multiple messages to provide relevant responses
- **Web Crawler**: Custom crawler to keep the chatbot's knowledge base updated with the latest website content

### Deployment & Infrastructure
- **Vercel**: For hosting and continuous deployment
- **Environment Variables**: For securely storing API keys and configuration

## Key Features

### Interactive Schedule
- Dynamic class schedule populated from Sanity CMS
- Visual indicators for different class types
- Mobile-responsive design

### Intelligent Chatbot
- Answers questions about class schedules, pricing, and programs
- Remembers user preferences across conversation
- Provides concise responses with relevant information
- Handles follow-up questions with context awareness

### Content Management
- Easy content updates through Sanity Studio
- Real-time updates to the website when content changes
- Image optimization and responsive delivery

## Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Variables

Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token
MISTRAL_API_KEY=your_mistral_api_key
```

### Updating the Chatbot Knowledge Base

The chatbot uses a crawler to gather information from the website. To update the knowledge base:

```bash
npm run crawler
```

This command should be run after significant content updates or during deployment.

## Deployment

The website is deployed on Vercel with automatic deployments from the main branch. The crawler runs during the build process to ensure the chatbot has the latest information.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity CMS Documentation](https://www.sanity.io/docs)
- [MistralAI Documentation](https://docs.mistral.ai/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)