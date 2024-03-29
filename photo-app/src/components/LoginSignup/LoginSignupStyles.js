import { Box, Button, FormControl, TextField } from "@material-ui/core";
import styled from "styled-components";
import background from "./hejhej2.jpg";

export const StyledBoxContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(160deg, #daecf0 20%, #fff);
  @media only screen and (min-width: 768px) {
    background-image: url(${background});
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
`;

export const ButtonStyled = styled(Button)`
  font-family: "viga";
  width: 100%;
  background: linear-gradient(180deg, #f6ecda 50%, #f5d5a6);
  color: #bc5100;
  border: solid 2px #bc5100;
  margin-top: 15px;
  &:hover {
    color: #bc5100;
    border: solid 1px #bc5100;
    transition: 0.7s ease;
  }
`;
//#ff341a, #f7d10a
export const StyledForm = styled.div`
  padding: 15px;
  border-radius: 5px;
  border: 5px solid;
  border-image-source: linear-gradient(-30deg, #ff341a, #f7d10a);
  border-image-slice: 1;
  background: linear-gradient(-30deg, #f5bd8e 30%, #ffe5d4);
`;

export const FormControlStyled = styled(FormControl)`
  display: flex;
  justify-items: center;
`;

export const StyledTextField = styled(TextField)`
  && .MuiInput-underline:hover:before {
    border-bottom: 2px solid #ffb04c;
  }

  .MuiInput-underline:after {
    border-bottom: 2px solid #bc5100;
  }
`;
