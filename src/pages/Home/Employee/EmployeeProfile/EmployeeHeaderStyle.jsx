import { Box } from '@mui/material';

const EmployeeHeaderStyle = () => {
    return (
        <Box
          sx={{
            height: 200,
            background:
              "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #667eea 75%, #764ba2 100%)",
            backgroundSize: "400% 400%",
            animation: "gradientShift 8s ease infinite",
            position: "relative",
            overflow: "hidden",
            "@keyframes gradientShift": {
              "0%": { backgroundPosition: "0% 50%" },
              "50%": { backgroundPosition: "100% 50%" },
              "100%": { backgroundPosition: "0% 50%" },
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -30,
              left: -30,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              animation: "float 6s ease-in-out infinite",
              "@keyframes float": {
                "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
                "50%": { transform: "translateY(-20px) rotate(180deg)" },
              },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -50,
              right: -50,
              width: 250,
              height: 250,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              animation: "float 8s ease-in-out infinite reverse",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "20%",
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              animation: "pulse 4s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)", opacity: 0.8 },
                "50%": { transform: "scale(1.2)", opacity: 0.4 },
              },
            }}
          />
        </Box>
    );
};

export default EmployeeHeaderStyle;