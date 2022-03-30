import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

interface MaterialRoundedPaginationProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>, val?: any) => void
  defaultPage: number
  spacing?: number | undefined
  totalPages: number
  page?: number
}

const MaterialRoundedPagination = ({
  spacing = 2,
  totalPages,
  onChange,
  defaultPage = 1,
  page
}: MaterialRoundedPaginationProps) => {
  const theme = createTheme({
    components: {
      MuiPagination: {
        styleOverrides: {
          ul: {
            justifyContent: 'center',
          },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            fontSize: '13px',
            backgroundColor: 'transparent',
            '&.Mui-selected': {
              backgroundColor: '#2379ea !important',
              color: 'white',
            },
          },
        },
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <Stack spacing={spacing}>
        <Pagination
          onChange={onChange}
          count={totalPages}
          defaultPage={defaultPage}
          boundaryCount={0}
          shape='rounded'
          size='large'
          page={page}
        />
      </Stack>
    </ThemeProvider>
  )
}

export default MaterialRoundedPagination
