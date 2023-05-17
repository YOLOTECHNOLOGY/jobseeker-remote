import React from 'react'
import { styled, alpha } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  // borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.55),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 1)
  },
  border: '0.5px solid #707070',
  borderRadius: '10px',
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto'
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch'
    }
  }
}))

export default function SearchBar({ inputProps, lang, ...rest }: any) {
  console.log(lang,'lang')
  return (
    <Search {...rest}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase placeholder={lang?.profile?.searchForJobTitle} {...inputProps} />
    </Search>
  )
}
