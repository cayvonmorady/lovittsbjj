import React from 'react'
import { Button, Card, Flex, Stack, Text, useToast } from '@sanity/ui'
import { PublishIcon } from '@sanity/icons'
import { createClient } from '@sanity/client'

// Define the PublishAll component
export default function PublishAllTool() {
  const [isPublishing, setIsPublishing] = React.useState(false)
  const [results, setResults] = React.useState(null)
  const toast = useToast()
  
  // Create a client manually since useClient hook might not be available in tool context
  const client = createClient({
    projectId: 'xtgasnb2',
    dataset: 'production',
    apiVersion: '2023-05-03',
    useCdn: false,
    token: typeof window !== 'undefined' ? window.localStorage.getItem('sanityAuthToken') || undefined : undefined
  })

  const handlePublishAll = async () => {
    if (isPublishing) return
    
    setIsPublishing(true)
    setResults(null)
    
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
      
      setResults({
        published: publishedCount,
        failed: failedCount,
        total: drafts.length
      })
      
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
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <Card padding={4} radius={2} shadow={1} tone="primary">
      <Stack space={4}>
        <Flex align="center">
          <PublishIcon style={{ marginRight: '0.5em' }} />
          <Text size={2} weight="semibold">
            Publish All Drafts
          </Text>
        </Flex>
        
        <Text size={1}>
          Publish all draft documents in one click. This will publish all documents that have unpublished changes.
        </Text>
        
        <Button
          text="Publish All Drafts"
          tone="primary"
          onClick={handlePublishAll}
          disabled={isPublishing}
          loading={isPublishing}
        />
        
        {results && (
          <Card padding={3} tone={results.failed > 0 ? 'caution' : 'positive'}>
            <Text size={1}>
              Published {results.published} of {results.total} documents
              {results.failed > 0 ? ` (${results.failed} failed)` : ''}
            </Text>
          </Card>
        )}
      </Stack>
    </Card>
  )
}
