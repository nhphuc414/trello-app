import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { toast } from 'react-toastify'

function ToggleFocusInput({
  value,
  onChangedValue,
  inputFontSize = '16px',
  ...props
}) {
  const calculateTextWidth = (inputValue) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = `${inputFontSize} Roboto`
    return context.measureText(inputValue).width + 30
  }
  const [inputValue, setInputValue] = useState(value)
  const [width, setWidth] = useState(Math.max(50, calculateTextWidth(value)))

  const triggerBlur = () => {
    setInputValue(inputValue.trim())
    if (!inputValue || inputValue.trim() === value) {
      setWidth(Math.max(50, calculateTextWidth(value)))
      setInputValue(value)
      return
    }
    if (inputValue.length < 3 || inputValue.length > 50) {
      setWidth(Math.max(50, calculateTextWidth(value)))
      setInputValue(value)
      toast.error('Invalid Input!')
      return
    }
    onChangedValue(inputValue)
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.target.blur()
    }
  }

  return (
    <>
      <TextField
        id='toggle-focus-input-controlled'
        variant='outlined'
        size='small'
        value={inputValue}
        onChange={(event) => {
          setWidth(Math.max(50, calculateTextWidth(event.target.value)))
          setInputValue(event.target.value)
        }}
        onBlur={triggerBlur}
        onKeyDown={handleKeyDown}
        style={{ width: `${width}px` }}
        {...props}
        sx={{
          '& label': {},
          '& input': { fontSize: inputFontSize, fontWeight: 'bold' },
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'transparent',
            '& fieldset': { borderColor: 'transparent' }
          },
          '& .MuiOutlinedInput-root:hover': {
            borderColor: 'transparent',
            '& fieldset': { borderColor: 'transparent' }
          },
          '& .MuiOutlinedInput-root.Mui-focused': {
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? '#33485D' : 'white',
            '& fieldset': { borderColor: 'primary.main' }
          },
          '& .MuiOutlinedInput-input': {
            px: '6px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }
        }}
      />
    </>
  )
}

export default ToggleFocusInput
