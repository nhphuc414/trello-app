import { useState } from 'react'
import { useColorScheme } from '@mui/material/styles'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { toast } from 'react-toastify'

function CardDescriptionMdEditor({
  cardDescriptionProp,
  handleUpdateCardDescription
}) {
  const { mode } = useColorScheme()

  const [markdownEditMode, setMarkdownEditMode] = useState(false)
  const [cardDescription, setCardDescription] = useState(cardDescriptionProp)

  const updateCardDescription = () => {
    setMarkdownEditMode(false)
    if (cardDescription === cardDescriptionProp) return
    if (!cardDescription) {
      setCardDescription(cardDescriptionProp)
      toast.error('Description not null!')
      return
    }
    handleUpdateCardDescription(cardDescription)
  }
  const cancelUpdateCardDescription = () => {
    setMarkdownEditMode(false)
    setCardDescription(cardDescriptionProp)
  }
  return (
    <Box sx={{ mt: -4 }}>
      {markdownEditMode ? (
        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box data-color-mode={mode}>
            <MDEditor
              value={cardDescription}
              onChange={setCardDescription}
              previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
              height={400}
              preview='edit'
            />
          </Box>
          <Box
            sx={{
              gap: 1,
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              sx={{ alignSelf: 'flex-end' }}
              onClick={cancelUpdateCardDescription}
              className='interceptor-loading'
              type='button'
              variant='contained'
              size='small'
              color='info'
            >
              Cancel
            </Button>
            <Button
              sx={{ alignSelf: 'flex-end' }}
              onClick={updateCardDescription}
              className='interceptor-loading'
              type='button'
              variant='contained'
              size='small'
              color='info'
            >
              Save
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            sx={{ alignSelf: 'flex-end' }}
            onClick={() => setMarkdownEditMode(true)}
            type='button'
            variant='contained'
            color='info'
            size='small'
            startIcon={<EditNoteIcon />}
          >
            Edit
          </Button>
          <Box data-color-mode={mode}>
            <MDEditor.Markdown
              source={cardDescription}
              style={{
                whiteSpace: 'pre-wrap',
                padding: cardDescription ? '10px' : '0px',
                border: cardDescription
                  ? '0.5px solid rgba(0, 0, 0, 0.2)'
                  : 'none',
                borderRadius: '8px'
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default CardDescriptionMdEditor
