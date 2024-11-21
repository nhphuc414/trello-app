import ModeSelect from '../ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import Box from '@mui/material/Box'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
import CloseIcon from '@mui/icons-material/Close'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Notifications from './Notifications/Notifications'
import AppBarCreateBoardModal from './AppBarCreateBoardModal'
import { handleFeatureInDevelopment } from '~/utils/handleFeatureInDevelopment'
function AppBar() {
  const [searchValue, setSearchValue] = useState('')
  return (
    <Box
      sx={{
        paddingX: 2,
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        '&::-webkit-scrollbar-track': { m: 1 },
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link to='/boards' sx={{ color: 'inherit' }}>
          <Tooltip title='Board list'>
            <AppsIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
          </Tooltip>
        </Link>

        <Link to='/' sx={{ color: 'inherit' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon
              component={TrelloIcon}
              inheritViewBox
              fontSize='small'
              sx={{ color: 'white' }}
            />
            <Typography
              variant='span'
              sx={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}
            >
              Trello
            </Typography>
          </Box>
        </Link>
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1
          }}
        >
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />
          <AppBarCreateBoardModal />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',

          gap: 2
        }}
      >
        <TextField
          id='outlined-search'
          label='Search...'
          type='text'
          size='small'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position='end'>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color: searchValue ? 'white' : 'transparent',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSearchValue('')}
                />
              </InputAdornment>
            )
          }}
          sx={{
            minWidth: '120px',
            maxWidth: '170px',
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white'
              },
              '&:hover fieldset': {
                borderColor: 'white'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white'
              }
            }
          }}
        />
        <ModeSelect />
        <Notifications />
        <Tooltip title='Help' onClick={handleFeatureInDevelopment}>
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }} />
        </Tooltip>
        <Profiles sx={{ cursor: 'pointer' }} />
      </Box>
    </Box>
  )
}

export default AppBar
