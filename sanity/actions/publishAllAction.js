import { useState } from 'react'
import { useToast } from '@sanity/ui'
import { useClient } from 'sanity'

// This is a document action that will be available on all documents
export function publishAllAction(props) {
  return {
    label: 'Publish All Drafts',
    icon: () => '🚀',
    onHandle: async () => {
      const client = useClient({ apiVersion: '2023-05-03' })
      const toast = useToast()
      
      try {
        // Fetch all documents that have a draft version
        const query = '*[_id in path("drafts.**")]'
        const drafts = await client.fetch(query)
        
        let publishedCount = 0
        let failedCount = 0
        
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
            
            publishedCount++
          } catch (err) {
            console.error(`Failed to publish ${draft._id}:`, err)
            failedCount++
          }
        }
        
        toast.push({
          status: failedCount > 0 ? 'warning' : 'success',
          title: `Published ${publishedCount} of ${drafts.length} documents`,
          description: failedCount > 0 ? `${failedCount} documents failed to publish` : undefined
        })
      } catch (err) {
        console.error('Error in publish operation:', err)
        toast.push({
          status: 'error',
          title: 'Publishing failed',
          description: 'An error occurred while trying to publish documents'
        })
      }
    }
  }
}
