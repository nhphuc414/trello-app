import { useEffect, useRef, useState } from 'react'
import TextField from '@mui/material/TextField'
import { toast } from 'react-toastify'

function ToggleFocusInput({
  value,
  onChangedValue,
  inputFontSize = '16px',
  ...props
}) {
  const [inputValue, setInputValue] = useState(value)
  const [width, setWidth] = useState(150)
  const spanRef = useRef(null)
  const triggerBlur = () => {
    setInputValue(inputValue.trim())
    if (!inputValue || inputValue.trim() === value) {
      setInputValue(value)
      return
    }
    if (inputValue.length < 3 || inputValue.length > 50) {
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
  useEffect(() => {
    if (spanRef.current) {
      setWidth(spanRef.current.offsetWidth + 20)
    }
  }, [inputValue])
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span
        ref={spanRef}
        style={{
          visibility: 'hidden',
          position: 'absolute',
          whiteSpace: 'pre'
        }}
      >
        {inputValue}
      </span>
      <TextField
        id='toggle-focus-input-controlled'
        variant='outlined'
        size='small'
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value)
          if (spanRef.current) {
            setWidth(spanRef.current.offsetWidth + 30)
          }
        }}
        onBlur={triggerBlur}
        onKeyDown={handleKeyDown}
        {...props}
        sx={{
          width: { width },
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
    </div>
  )
}

export default ToggleFocusInput
