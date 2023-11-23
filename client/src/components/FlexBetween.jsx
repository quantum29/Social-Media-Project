import { Box } from "@mui/material";
import { styled } from "@mui/system";
// styled se css = "" se likh skte hai kya 
const FlexBetween = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});
//by doing these , this allows us these set of css properties to different areas 
   

export default FlexBetween;