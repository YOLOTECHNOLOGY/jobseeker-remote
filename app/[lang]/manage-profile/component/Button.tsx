import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { common, grey } from '@mui/material/colors';

const BootstrapButton = styled(Button)({
  boxShadow: `0px 5px 22px 0px rgba(0, 0, 0, 0.12)`,
  textTransform: 'none',
  fontSize: 16,
  lineHeight: 1.5,
  backgroundColor: '#ffffff',
  display: 'flex',
  minWidth: 127,
  height: 42,
  padding: '10px 20px',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: '#0069d9',
  },
  '&:active': {
    backgroundColor: '#0062cc',
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
  },
});

export const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: common.black,
  backgroundColor: common.white,
  minWidth: 127,
  height: 42,
  padding: "10px 20px",
  boxShadow: `0px 5px 22px 0px rgba(0, 0, 0, 0.12)`,
  borderRadius: "8px",
  '&:hover': {
    backgroundColor: grey[50],
  },
}));

