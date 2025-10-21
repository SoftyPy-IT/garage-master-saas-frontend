/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledGradientText = styled(Typography)(({ theme, gradient }) => {
  const gradientMap = {
    primary: "linear-gradient(90deg, #3a36db 0%, #5630ff 100%)",
    secondary: "linear-gradient(90deg, #00c6b6 0%, #00a99b 100%)",
    accent: "linear-gradient(90deg, #ff5757 0%, #ff8a85 100%)",
    "primary-secondary": "linear-gradient(90deg, #3a36db 0%, #00c6b6 100%)",
    "primary-accent": "linear-gradient(90deg, #3a36db 0%, #ff5757 100%)",
    "secondary-accent": "linear-gradient(90deg, #00c6b6 0%, #ff5757 100%)",
    rainbow:
      "linear-gradient(90deg, #3a36db 0%, #00c6b6 33%, #ff5757 66%, #ffc400 100%)",
  };

  return {
    background: gradientMap[gradient] || gradient || gradientMap.primary,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textFillColor: "transparent",
    display: "inline-block",
  };
});

const GradientText = ({ children, gradient = "primary", ...props }) => {
  return (
    <StyledGradientText gradient={gradient} {...props}>
      {children}
    </StyledGradientText>
  );
};

export default GradientText;
