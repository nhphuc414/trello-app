import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'
function BoardBar(props) {
  const MENU_STYLES = {
    color: 'white',
    bgcolor: 'transparent',
    border: 'none',
    paddingX: '5px',
    borderRadius: '4px',
    '.MuiSvgIcon-root': {
      color: 'white'
    },
    '&:hover': {
      color: 'primary.50'
    }
  }
  const { board } = props
  return (
    <Box
      sx={{
        paddingX: 2,
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        '&::-webkit-scrollbar-track': { m: 1 },
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLES}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
          />
        </Tooltip>
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label='Add To Google Drive'
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label='Automation'
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label='Filters'
          clickable
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant='outlined'
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white'
            }
          }}
          startIcon={<PersonAddIcon />}
        >
          Invite
        </Button>
        <AvatarGroup
          max={4}
          sx={{
            gap: 1,
            '& .MuiAvatar-root': {
              width: '34px',
              height: '34px',
              fontSize: '16px',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title='avatar'>
            <Avatar
              alt='Avatar'
              src='https://res.cloudinary.com/dm5nn54wh/image/upload/v1715756788/llvfrs79yiwk1ypovlbj.jpg'
            />
          </Tooltip>
          <Tooltip title='avatar'>
            <Avatar
              alt='Avatar'
              src='https://res.cloudinary.com/dm5nn54wh/image/upload/v1716093841/mbmwcwdzpf01yaso7ofx.jpg'
            />
          </Tooltip>
          <Tooltip title='avatar'>
            <Avatar
              alt='Avatar'
              src='https://res.cloudinary.com/dm5nn54wh/image/upload/v1716093841/mbmwcwdzpf01yaso7ofx.jpg'
            />
          </Tooltip>
          <Tooltip title='avatar'>
            <Avatar
              alt='Avatar'
              src='https://res.cloudinary.com/dm5nn54wh/image/upload/v1716093841/mbmwcwdzpf01yaso7ofx.jpg'
            />
          </Tooltip>
          <Tooltip title='avatar'>
            <Avatar
              alt='Avatar'
              src='https://res.cloudinary.com/dm5nn54wh/image/upload/v1716093841/mbmwcwdzpf01yaso7ofx.jpg'
            />
          </Tooltip>
          <Tooltip title='avatar'>
            <Avatar
              alt='Avatar'
              src='https://res.cloudinary.com/dm5nn54wh/image/upload/v1715498698/mgpbisssuw4jweetnlbw.jpg'
            />
          </Tooltip>
          <Tooltip title='avatar'>
            <Avatar
              alt='Avatar'
              src='https://res.cloudinary.com/dm5nn54wh/image/upload/v1715498698/mgpbisssuw4jweetnlbw.jpg'
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
