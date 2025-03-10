// scripts/publish-all.ts
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN, // You need a write token
  useCdn: false,
  apiVersion: '2023-05-03'
})

// Function to publish all draft documents
async function publishAllDrafts() {
  try {
    // Fetch all documents that have a draft version
    const query = '*[_id in path("drafts.**")]'
    const drafts = await client.fetch(query)
    
    console.log(`Found ${drafts.length} draft documents to publish`)
    
    // Process each draft document
    for (const draft of drafts) {
      const publishId = draft._id.replace('drafts.', '')
      
      try {
        // Publish the document (copy the draft to the published version)
        await client
          .transaction()
          .createOrReplace({
            ...draft,
            _id: publishId
          })
          .commit()
        
        console.log(`Published: ${draft._id} → ${publishId}`)
      } catch (err: any) {
        console.error(`Failed to publish ${draft._id}:`, err.message)
      }
    }
    
    console.log('Publish operation completed')
  } catch (err: any) {
    console.error('Error in publish operation:', err)
  }
}

// Run the function
publishAllDrafts()
