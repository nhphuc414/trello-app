import { useState, useEffect, useRef } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ListAltIcon from '@mui/icons-material/ListAlt'
import HomeIcon from '@mui/icons-material/Home'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
// import CardMedia from '@mui/material/CardMedia'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import randomColor from 'randomcolor'
import SidebarCreateBoardModal from './create'

import { styled } from '@mui/material/styles'
import { fetchBoardsAPI } from '~/apis'
import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE,
  DEFAULT_SORT_BY
} from '~/utils/constants'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))

function Boards() {
  const [data, setData] = useState({
    boards: null,
    totalBoards: null
  })
  const page = useRef(DEFAULT_PAGE)
  const sortBy = useRef(DEFAULT_SORT_BY)
  const itemsPerPage = useRef(DEFAULT_ITEMS_PER_PAGE)
  const location = useLocation()
  const navigate = useNavigate()

  const updateStateData = (res) => {
    setData({
      boards: res.boards || [],
      totalBoards: res.totalBoards || 0
    })
  }
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const pageParam = parseInt(params.get('page'), 10) || DEFAULT_PAGE
    const sortByParam = params.get('sortBy') || DEFAULT_SORT_BY
    const itemsPerPageParam =
      params.get('itemsPerPage') || DEFAULT_ITEMS_PER_PAGE
    page.current = pageParam
    sortBy.current = sortByParam
    itemsPerPage.current = itemsPerPageParam
    fetchBoardsAPI(location.search).then(updateStateData)
  }, [location.search])
  const afterCreateNewBoard = () => {
    fetchBoardsAPI(location.search).then(updateStateData)
  }
  const handlePageChange = (event, value) => {
    setData(null)
    navigate(
      `/boards?sortBy=${sortBy.current}&itemsPerPage=${itemsPerPage.current}&page=${value}`
    )
  }
  const handleSortByChange = (event) => {
    setData(null)
    navigate(
      `/boards?sortBy=${event.target.value}&itemsPerPage=${itemsPerPage.current}&page=${page.current}`
    )
  }
  const handleItemsPerPageChange = (event) => {
    setData(null)
    navigate(
      `/boards?sortBy=${sortBy.current}&itemsPerPage=${
        event.target.value
      }&page=${1}`
    )
  }
  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{ paddingX: 2, my: 4 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={3}>
            <Stack direction='column' spacing={1}>
              <SidebarItem className='active'>
                <SpaceDashboardIcon fontSize='small' />
                Boards
              </SidebarItem>
              <SidebarItem>
                <ListAltIcon fontSize='small' />
                Templates
              </SidebarItem>
              <SidebarItem>
                <HomeIcon fontSize='small' />
                Home
              </SidebarItem>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction='column' spacing={1}>
              <SidebarCreateBoardModal
                afterCreateNewBoard={afterCreateNewBoard}
              />
            </Stack>
          </Grid>

          <Grid xs={12} sm={9}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant='h4' sx={{ fontWeight: 'bold', mb: 3 }}>
                Your boards:
              </Typography>
              <Box>
                <FormControl sx={{ ml: 2, minWidth: 120 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy.current}
                    onChange={handleSortByChange}
                    label='Sort By'
                  >
                    <MenuItem value='date'>Date</MenuItem>
                    <MenuItem value='alphabet'>A-Z</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ ml: 2, minWidth: 120 }}>
                  <InputLabel>Items Per Page</InputLabel>
                  <Select
                    value={itemsPerPage.current}
                    onChange={handleItemsPerPageChange}
                    label='Items Per Page'
                  >
                    <MenuItem value='6'>6</MenuItem>
                    <MenuItem value='12'>12</MenuItem>
                    <MenuItem value='24'>24</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            {!data?.boards && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <PageLoadingSpinner caption='Loading Boards...' />
              </Box>
            )}
            {data?.boards?.length === 0 && (
              <Typography variant='span' sx={{ fontWeight: 'bold', mb: 3 }}>
                No result found!
              </Typography>
            )}

            {data?.boards?.length > 0 && (
              <Grid container spacing={2}>
                {data?.boards.map((b) => (
                  <Grid xs={2} sm={3} md={4} key={b._id}>
                    <Card sx={{ width: '250px' }}>
                      <Box
                        sx={{ height: '50px', backgroundColor: randomColor() }}
                      ></Box>

                      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                        <Typography gutterBottom variant='h6' component='div'>
                          {b.title}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {b.description}
                        </Typography>
                        <Box
                          component={Link}
                          to={`/boards/${b.slug}/${b._id}`}
                          sx={{
                            mt: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            color: 'primary.main',
                            '&:hover': { color: 'primary.light' }
                          }}
                        >
                          Go to board <ArrowRightIcon fontSize='small' />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {data?.totalBoards > 0 && (
              <Box
                sx={{
                  my: 3,
                  pr: 5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end'
                }}
              >
                <Pagination
                  size='large'
                  color='secondary'
                  showFirstButton
                  showLastButton
                  count={Math.ceil(data?.totalBoards / itemsPerPage.current)}
                  page={page.current}
                  onChange={handlePageChange}
                  renderItem={(item) => <PaginationItem {...item} />}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Boards
