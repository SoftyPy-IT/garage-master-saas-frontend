/* eslint-disable react/prop-types */
import React from "react";
import { Grid, Card, Avatar, Typography, List, ListItem, ListItemText, ListItemIcon, Checkbox, Divider, Button, Box, useTheme, alpha } from "@mui/material";

const RolePermissionsTab = ({ roles, permissionMatrix, handleDialogOpen }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      {roles.map((role) => (
        <Grid item xs={12} md={6} key={role.id}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              height: "100%",
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette[role.color].main, 0.2)}`,
              transition: "all 0.3s",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                transform: "translateY(-4px)",
              },
            }}
          >
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  mr: 2,
                  bgcolor: alpha(theme.palette[role.color].main, 0.1),
                  color: theme.palette[role.color].main,
                }}
              >
                {role.icon}
              </Avatar>
              <Typography variant="h6" fontWeight={600}>
                {role.name}
              </Typography>
            </Box>

            <List dense>
              {permissionMatrix.map((category, catIndex) => (
                <div key={catIndex}>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    mt={1}
                    mb={1}
                    color={theme.palette[role.color].main}
                  >
                    {category.category}
                  </Typography>
                  {category.permissions.map((permission, permIndex) => (
                    <ListItem key={permIndex} disablePadding>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={permission[role.name.toLowerCase()]}
                          tabIndex={-1}
                          disableRipple
                          color={role.color}
                        />
                      </ListItemIcon>
                      <ListItemText primary={permission.name} />
                    </ListItem>
                  ))}
                  {catIndex < permissionMatrix.length - 1 && (
                    <Divider component="li" sx={{ my: 1 }} />
                  )}
                </div>
              ))}
            </List>

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                size="small"
                color={role.color}
                onClick={() => handleDialogOpen("role")}
              >
                Edit Permissions
              </Button>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RolePermissionsTab;
