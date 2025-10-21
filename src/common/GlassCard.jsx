import { Card, alpha } from "@mui/material";
import { styled } from "@mui/material/styles";

const GlassCard = styled(Card)(
  ({ theme, intensity = 0.1, border = false, hoverEffect = true }) => ({
    background: alpha(theme.palette.background.paper, 0.7 + intensity * 0.2),
    backdropFilter: "blur(10px)",
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[3],
    border: border
      ? `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
      : "none",
    transition: "all 0.3s ease",
    overflow: "hidden",
    ...(hoverEffect && {
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: theme.shadows[10],
      },
    }),
  })
);

export default GlassCard;
