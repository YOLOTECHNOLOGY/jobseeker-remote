import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import { common, grey } from '@mui/material/colors';


export const ColorButton = styled(Button)<ButtonProps>(() => ({
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

