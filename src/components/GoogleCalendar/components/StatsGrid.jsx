import { Card, CardContent, Grid, Typography } from "@mui/material";
import { formatStatLabel } from "../../../utils/calendar/helpers";

export const StatsGrid = ({ stats, limit }) => {
  const entries = Object.entries(stats);
  const displayEntries = limit ? entries.slice(0, limit) : entries;

  return (
    <Grid container spacing={2} sx={{ mb: limit ? 3 : 0 }}>
      {displayEntries.map(([key, value]) => (
        <Grid item xs={limit ? 6 : 6} sm={limit ? 3 : undefined} key={key}>
          <Card>
            <CardContent sx={{ textAlign: "center", p: limit ? 2 : 1 }}>
              <Typography
                variant={limit ? "h3" : "h4"}
                color="primary"
              >
                {value}
              </Typography>
              <Typography variant={limit ? "body2" : "caption"} color="textSecondary">
                {formatStatLabel(key)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
