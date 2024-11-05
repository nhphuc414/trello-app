import Typography from '@mui/material/Typography'
import { useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import ContentCut from '@mui/icons-material/ContentCut'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import AddCardIcon from '@mui/icons-material/AddCard'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import GroupIcon from '@mui/icons-material/Group'
function BoardContent() {
  const COLUMN_HEADER_HEIGHT = '50px'
  const COLUMN_FOOTER_HEIGHT = '60px'
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '5px 0'
      }}
    >
      <Box
        sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': { m: 1 }
        }}
      >
        <Box
          sx={{
            minWidth: '300px',
            maxWidth: '300px',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#333643' : '#ebecf0',
            ml: 2,
            borderRadius: '6px',
            height: 'fit-content',
            maxHeight: (theme) =>
              `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
          }}
        >
          {/* Header */}
          <Box
            sx={{
              height: COLUMN_HEADER_HEIGHT,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography
              variant='h6'
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Column Title
            </Typography>

            <Box>
              <Tooltip title='More options'>
                <ExpandMoreIcon
                  id='basic-button-column-dropdown'
                  aria-controls={
                    open ? 'basic-menu-column-dropdown' : undefined
                  }
                  aria-haspopup='true'
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  sx={{ color: 'text.primary', cursor: 'pointer' }}
                />
              </Tooltip>
              <Menu
                id='basic-menu-column-dropdown'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button-column-dropdown'
                }}
              >
                <MenuItem>
                  <ListItemIcon>
                    <AddCardIcon fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Add new card</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCut fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Cut</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCopyIcon fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentPasteIcon fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Paste</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem>
                  <ListItemIcon>
                    <Cloud fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Archive this column</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <DeleteForeverIcon fontSize='small' sx={{ color: 'red' }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: 'red' }}>
                    Remove this column
                  </ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          {/* Card */}
          <Box
            sx={{
              p: '0 5px',
              m: '0 5px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              overflowX: 'hidden',
              overflowY: 'auto',
              maxHeight: (theme) =>
                `calc(${theme.trello.boardContentHeight} -
             ${theme.spacing(5)} -
             ${COLUMN_HEADER_HEIGHT} -
             ${COLUMN_FOOTER_HEIGHT}
            )`,
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#ced0da',
                borderRadius: '10px'
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#bfc2cf'
              }
            }}
          >
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardMedia
                sx={{ height: 140 }}
                image='https://img.pokemondb.net/artwork/large/charizard.jpg'
                title='green iguana'
              />
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Mern Stack</Typography>
              </CardContent>
              <CardActions sx={{ p: '0 4px 8px 4px' }}>
                <Button size='small' startIcon={<GroupIcon />}>
                  20
                </Button>
                <Button size='small' startIcon={<CommentIcon />}>
                  15
                </Button>
                <Button size='small' startIcon={<AttachmentIcon />}>
                  10
                </Button>
              </CardActions>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Card 01</Typography>
              </CardContent>
            </Card>
          </Box>
          {/* Footer */}
          <Box
            sx={{
              height: COLUMN_FOOTER_HEIGHT,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Button startIcon={<AddCardIcon />}>Add new card</Button>
            <Tooltip title='Drag to move'>
              <DragHandleIcon sx={{ cursor: 'pointer' }} />
            </Tooltip>
          </Box>
        </Box>
        <Box
          sx={{
            minWidth: '300px',
            maxWidth: '300px',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#333643' : '#ebecf0',
            ml: 2,
            borderRadius: '6px',
            height: 'fit-content',
            maxHeight: (theme) =>
              `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
          }}
        >
          {/* Header */}
          <Box
            sx={{
              height: COLUMN_HEADER_HEIGHT,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography
              variant='h6'
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Column Title
            </Typography>

            <Box>
              <Tooltip title='More options'>
                <ExpandMoreIcon
                  id='basic-button-column-dropdown'
                  aria-controls={
                    open ? 'basic-menu-column-dropdown' : undefined
                  }
                  aria-haspopup='true'
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  sx={{ color: 'text.primary', cursor: 'pointer' }}
                />
              </Tooltip>
              <Menu
                id='basic-menu-column-dropdown'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button-column-dropdown'
                }}
              >
                <MenuItem>
                  <ListItemIcon>
                    <AddCardIcon fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Add new card</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCut fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Cut</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCopyIcon fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentPasteIcon fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Paste</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem>
                  <ListItemIcon>
                    <Cloud fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Archive this column</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <DeleteForeverIcon fontSize='small' sx={{ color: 'red' }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: 'red' }}>
                    Remove this column
                  </ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          {/* Card */}
          <Box
            sx={{
              p: '0 5px',
              m: '0 5px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              overflowX: 'hidden',
              overflowY: 'auto',
              maxHeight: (theme) =>
                `calc(${theme.trello.boardContentHeight} -
             ${theme.spacing(5)} -
             ${COLUMN_HEADER_HEIGHT} -
             ${COLUMN_FOOTER_HEIGHT}
            )`,
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#ced0da',
                borderRadius: '10px'
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#bfc2cf'
              }
            }}
          >
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardMedia
                sx={{ height: 140 }}
                image='https://img.pokemondb.net/artwork/large/charizard.jpg'
                title='green iguana'
              />
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Mern Stack</Typography>
              </CardContent>
              <CardActions sx={{ p: '0 4px 8px 4px' }}>
                <Button size='small' startIcon={<GroupIcon />}>
                  20
                </Button>
                <Button size='small' startIcon={<CommentIcon />}>
                  15
                </Button>
                <Button size='small' startIcon={<AttachmentIcon />}>
                  10
                </Button>
              </CardActions>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Card 01</Typography>
              </CardContent>
            </Card>
          </Box>
          {/* Footer */}
          <Box
            sx={{
              height: COLUMN_FOOTER_HEIGHT,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Button startIcon={<AddCardIcon />}>Add new card</Button>
            <Tooltip title='Drag to move'>
              <DragHandleIcon sx={{ cursor: 'pointer' }} />
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
export default BoardContent
