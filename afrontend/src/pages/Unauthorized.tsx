import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
        p: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 520,
          width: "100%",
          bgcolor: "#fff",
          borderRadius: 4,
          p: 4,
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Access denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You do not have permission to open this section with the current role.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/admindashboard")}>
          Go to dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default Unauthorized;
