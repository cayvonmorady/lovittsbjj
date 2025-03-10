// StudioNavbar.jsx
import React from 'react'
import { Card, Flex, Stack, Text, Button, useToast } from '@sanity/ui'
import { PublishIcon } from '@sanity/icons'
import { useClient } from 'sanity'

export default function StudioNavbar(props) {
  const [isPublishing, setIsPublishing] = React.useState(false)
  const [results, setResults] = React.useState(null)
  const toast = useToast()
  const client = useClient({ apiVersion: '2023-05-03' })

  const handlePublishAll = async () => {
    if (isPublishing) return
    
    setIsPublishing(true)
    setResults(null)
    
    try {
      // Fetch all documents that have a draft version
      const query = '*[_id in path("drafts.**")]'
      const drafts = await client.fetch(query)
      
      if (drafts.length === 0) {
        toast.push({
          status: 'info',
          title: 'No drafts to publish',
          description: 'There are no draft documents to publish.'
        })
        setIsPublishing(false)
        return
      }
      
      // Create a single transaction for all documents
      const transaction = client.transaction()
      
      // Add all documents to the transaction
      for (const draft of drafts) {
        const publishId = draft._id.replace('drafts.', '')
        
        // Create or replace the published document
        transaction.createOrReplace({
          ...draft,
          _id: publishId
        })
        
        // Delete the draft
        transaction.delete(draft._id)
      }
      
      // Commit the transaction
      await transaction.commit()
      
      // Only trigger a SINGLE revalidation AFTER all documents are published
      try {
        // Use the batch revalidation endpoint
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        await fetch(`${baseUrl}/api/revalidate?batch=true`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ type: 'batch-publish' })
        });
        
        console.log('Triggered batch revalidation for all published documents');
      } catch (err) {
        console.error('Error triggering revalidation:', err)
      }
      
      setResults({
        published: drafts.length,
        failed: 0,
        total: drafts.length
      })
      
      toast.push({
        status: 'success',
        title: `Published ${drafts.length} documents`,
        description: 'All draft documents have been published successfully with a single deployment.'
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
    <div>
      <Card padding={4} radius={2} shadow={1} tone="primary" margin={4}>
        <Stack space={4}>
          <Flex align="center">
            <PublishIcon style={{ marginRight: '0.5em' }} />
            <Text size={2} weight="semibold">
              Publish All Drafts
            </Text>
          </Flex>
          
          <Text size={1}>
            Publish all draft documents in a single operation with one deployment.
          </Text>
          
          <Button 
            tone="primary" 
            text={isPublishing ? 'Publishing...' : 'Publish All'} 
            onClick={handlePublishAll}
            disabled={isPublishing}
            loading={isPublishing}
          />
          
          {results && (
            <Text size={1}>
              Published {results.published} of {results.total} documents
              {results.failed > 0 && ` (${results.failed} failed)`}
            </Text>
          )}
        </Stack>
      </Card>
      
      {props.renderDefault(props)}
    </div>
  )
}
