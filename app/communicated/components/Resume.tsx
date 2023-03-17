"use client"
import React from "react";
import styles from '../page.module.scss';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const Resume = () => {
    const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
return (
    <>
   <div className={styles.resume}>
     <div className={styles.user}>
     <img src='https://tpc.googlesyndication.com/simgad/13322565777955859947' />
     <div className={styles.info}>
        <p>John Doe</p>
        <span> 30 years old</span>
        <i>|</i>
        <span> 6 years exp</span>
        <i>|</i>
        <span> Field of study</span>
     </div>
    </div>    
      <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box>
     <button className={styles.btn}>
     Edit online resume
     </button>
   </div>
   <ul className={styles.type}>
        <li> Communicated (20)</li>
        <li> Exchanged (20)</li>
        <li> Saved (20)</li>
        <li> Interview (20)</li>
        <li> Viewed (20)</li>
     </ul>

     <div className={styles.upload}>
         <div className={styles.header}>
         Uploaded Resumes
         </div>
         <div className={styles.uploadContainer}>
            <p className={styles.noMore}>No resume, upload now!</p>
            <button className={styles.btn}>Upload resume</button>
         </div>
    </div> 
   </>
)
}
export default Resume;