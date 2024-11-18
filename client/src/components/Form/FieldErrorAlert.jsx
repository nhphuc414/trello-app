import Box from '@mui/material/Box'

// Component này có nhiệm vụ trả về một Alert Message cho field chỉ định (nếu có).
function FieldErrorAlert({ errors, fieldName }) {
  if (!errors || !errors[fieldName]) return null
  return (
    <Box
      severity='error'
      sx={{
        mt: '0.5em',
        fontSize: '12px',
        boxSizing: 'border-box',
        color: '#d00e17',
        '.MuiAlert-message': { overflow: 'hidden' }
      }}
    >
      {errors[fieldName]?.message}
    </Box>
  )
}

export default FieldErrorAlert
