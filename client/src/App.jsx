import Button from '@mui/material/Button'
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms'
import { useColorScheme } from '@mui/material/styles'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery
} from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'

import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import { Box } from '@mui/system'
function App() {
  const { mode, setMode } = useColorScheme()
  const ModeSelect = () => {
    const handleChange = (event) => {
      setMode(event.target.value)
    }

    return (
      <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
        <InputLabel id='label-select-dark-light-mode'>Mode</InputLabel>
        <Select
          labelId='label-select-dark-light-mode'
          id='select-dark-light-mode'
          value={mode}
          label='Mode'
          onChange={handleChange}
        >
          <MenuItem value='light'>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LightModeIcon /> Light
            </div>
          </MenuItem>
          <MenuItem value='dark'>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DarkModeOutlinedIcon /> Dark
            </Box>
          </MenuItem>
          <MenuItem value='system'>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsBrightnessIcon /> System
            </Box>
          </MenuItem>
        </Select>
      </FormControl>
    )
  }
  function ModeToggle() {
    const { mode, setMode } = useColorScheme()
    return (
      <Button
        onClick={() => {
          setMode(mode === 'light' ? 'dark' : 'light')
        }}
      >
        {mode === 'light' ? 'Turn dark' : 'Turn light'}
      </Button>
    )
  }
  return (
    <>
      <hr />
      <ModeSelect />
      <hr />
      <ModeToggle />
      <div>Hello</div>
      <Button variant='text'>Text</Button>
      <Button variant='contained'>Contained</Button>
      <Button variant='outlined'>Outlined</Button>
      <AccessAlarmsIcon />
    </>
  )
}

export default App
