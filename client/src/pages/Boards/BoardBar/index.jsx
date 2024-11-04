import Box from '@mui/material/Box'
function BoardBar() {
  return (
    <Box
      sx={{
        backgroundColor: 'secondary.main',
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      Boardbar
    </Box>
  )
}

export default BoardBar
