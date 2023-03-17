import { TextField, Button } from 'app/components/MUIs'

const Search = () => {
  return (
    <section>
      <TextField
        label='Job title or company'
        variant='outlined'
        size='small'
        sx={{
          borderRadius: '10px',
          backgroundColor: '#FFFFFF',
          height: '44px'
        }}
      />
      <Button variant='contained' sx={{ textTransform: 'capitalize', backgroundColor: '#136FD3' }}>
        Search
      </Button>
    </section>
  )
}

export default Search
