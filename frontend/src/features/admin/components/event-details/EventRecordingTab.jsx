import { useEffect, useState } from 'react'
import { Copy, ExternalLink, Link2, Video } from 'lucide-react'
import Button from '../../../../components/ui/Button'
import Card, { CardBody, CardHeader } from '../../../../components/ui/Card'
import EmptyState from '../../../../components/ui/EmptyState'
import Input from '../../../../components/ui/Input'
import Label from '../../../../components/ui/Label'
import { EVENT_STATUS } from '../../../../constants/events'

export default function EventRecordingTab({
  event,
  onSave,
  isSaving,
  actionMessage,
}) {
  const [recordingUrl, setRecordingUrl] = useState(event.videoUrl ?? '')
  const [copyMessage, setCopyMessage] = useState('')

  useEffect(() => {
    setRecordingUrl(event.videoUrl ?? '')
  }, [event.videoUrl])

  if (event.status !== EVENT_STATUS.COMPLETED) {
    return (
      <EmptyState
        title="Recording unavailable"
        description="Recording management is available after the event is marked as completed."
      />
    )
  }

  async function handleCopy() {
    if (!event.videoUrl) return

    try {
      await navigator.clipboard.writeText(event.videoUrl)
      setCopyMessage('Link copied to clipboard.')
    } catch {
      setCopyMessage('Unable to copy the link.')
    }
  }

  async function handleSubmit(eventForm) {
    eventForm.preventDefault()
    const success = await onSave(recordingUrl.trim())
    if (success) {
      setCopyMessage('')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-base font-semibold text-text-primary">Recording status</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          {event.videoUrl ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              A recording URL is saved for this completed event.
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-surface-subtle px-4 py-3 text-sm text-text-secondary">
              No recording has been added yet. Paste a Google Drive, YouTube, or Meet recording link
              below.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="recording-url">Recording URL</Label>
              <Input
                id="recording-url"
                type="url"
                value={recordingUrl}
                onChange={(inputEvent) => setRecordingUrl(inputEvent.target.value)}
                placeholder="https://..."
                disabled={isSaving}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" fullWidth={false} className="px-4" isLoading={isSaving} disabled={isSaving}>
                <Link2 className="h-4 w-4" aria-hidden="true" />
                Save recording URL
              </Button>

              {event.videoUrl ? (
                <>
                  <a
                    href={event.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-subtle"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Watch recording
                  </a>
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth={false}
                    className="px-4"
                    onClick={handleCopy}
                  >
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    Copy link
                  </Button>
                </>
              ) : null}
            </div>
          </form>

          {actionMessage ? (
            <p role="status" className="text-sm text-emerald-700">
              {actionMessage}
            </p>
          ) : null}
          {copyMessage ? (
            <p role="status" className="text-sm text-text-secondary">
              {copyMessage}
            </p>
          ) : null}
        </CardBody>
      </Card>

      {!event.videoUrl ? (
        <Card>
          <CardBody className="flex items-start gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <Video className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium text-text-primary">No recording available yet</p>
              <p className="mt-1 text-sm text-text-secondary">
                After your Google Meet session ends, add the recording link so attendees can watch
                the replay from the public event page.
              </p>
            </div>
          </CardBody>
        </Card>
      ) : null}
    </div>
  )
}
