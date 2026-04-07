// import { FC } from "react";
// import { Link } from "react-router-dom";
// import { Box, Typography, Button } from "@mui/material";
// import bgIllustration from "../assets/cloud.png";
// import person from "../assets/perosn.png";
// import { brandColors } from "@/theme";

// const NotFound: FC = () => {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: { xs: "column", md: "row" },
//         alignItems: "center",
//         justifyContent: "space-between",
//         height: "100vh",
//         width: "100%",
//         bgcolor: "#ffffff",
//         px: { xs: 4, md: 10 },
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       {/* LEFT SIDE */}
//       <Box sx={{ width: { md: "50%" }, textAlign: "left", zIndex: 20 }}>

//         {/* "Page 404" — h1 variant → DIN Bold */}
//         <Typography variant="h1" sx={{ color: "#111827", fontSize: "2.75rem", fontWeight: 9000 }}>
//           Page 404 
//         </Typography>

//         {/* "Not Found" — h4 variant → DIN Bold */}
//         <Typography variant="h4" sx={{ color: "#374151", mt: 1, fontSize: "1.75rem" }}>
//           Not Found
//         </Typography>

//         {/* Description — body2 variant → DIN */}
//         <Typography
//           variant="body2"
//           sx={{ mt: 2, maxWidth: 448, lineHeight: 1.7, color: "#6b7280", fontSize: "1.25rem" }}
//         >
//           The page you are looking for might have been removed from Examiify,
//           had its name changed, or is temporarily unavailable. Don't worry, you
//           can always go back to your dashboard.
//         </Typography>

//         <Button
//           component={Link}
//           to="/login"
//           variant="contained"
//           sx={{
//             mt: 3,
//             px: 3,
//             py: 1.5,
//             borderRadius: 2,
//             fontWeight: 600,
//             bgcolor: brandColors.primary,
//             boxShadow: "0 4px 6px rgba(0,0,0,0.12)",
//             "&:hover": { bgcolor: brandColors.primaryDark },
//           }}
//         >
//           Back to Dashboard
//         </Button>
//       </Box>

//       {/* RIGHT SIDE — big 404 */}
//       <Box
//         sx={{
//           width: { md: "50%" },
//           display: "flex",
//           justifyContent: "center",
//           mt: { xs: 5, md: 0 },
//           position: "relative",
//           zIndex: 20,
//         }}
//       >
//         {/* h1 variant → DIN Bold, override size for big display */}
//         <Typography
//           variant="h1"
//           sx={{
//             fontSize: { xs: "6rem", md: "10rem" },
//             color: brandColors.primary,
//             lineHeight: 1,
//           }}
//         >
//           404
//         </Typography>
//       </Box>

//       {/* BACKGROUND CLOUD + POT */}
//       <Box
//         component="img"
//         src={bgIllustration}
//         alt="404 Background"
//         sx={{
//           position: "absolute",
//           right: 0,
//           ml: "37.5rem",
//           width: { xs: "60%", md: "50%" },
//           height: "50%",
//           objectFit: "contain",
//           opacity: 0.9,
//           zIndex: 10,
//         }}
//       />

//       {/* PERSON IMAGE */}
//       <Box
//         component="img"
//         src={person}
//         alt="Person Illustration"
//         sx={{
//           position: "absolute",
//           right: 4,
//           width: { xs: "10%", md: "25%" },
//           height: "45%",
//           objectFit: "contain",
//           zIndex: 20,
//         }}
//       />
//     </Box>
//   );
// };

// export default NotFound;


import { FC } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import bgIllustration from "../assets/cloud.png";
import person from "../assets/perosn.png";

const NotFound: FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "100vh",
        width: "100%",
        bgcolor: "background.paper",
        px: { xs: 3, sm: 6, md: 10 },
        py: { xs: 4, sm: 6, md: 0 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* LEFT */}
      <Box
        sx={{
          width: { xs: "100%", sm: "80%", md: "50%" },
          textAlign: { xs: "center", md: "left" },
          zIndex: 20,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            color: "text.primary",
            fontSize: { xs: "2rem", sm: "2.4rem", md: "2.75rem" },
          }}
        >
          Page 404
        </Typography>

        <Typography
          variant="h4"
          sx={{
            color: "text.secondary",
            mt: 1,
            fontSize: { xs: "1.4rem", sm: "1.6rem", md: "1.75rem" },
          }}
        >
          Not Found
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 2,
            maxWidth: { xs: "100%", sm: 500, md: 448 },
            lineHeight: 1.7,
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
            mx: { xs: "auto", md: 0 },
          }}
        >
          The page you are looking for might have been removed from Examiify,
          had its name changed, or is temporarily unavailable. Don't worry, you
          can always go back to your dashboard.
        </Typography>

        <Button
          component={Link}
          to="/login"
          variant="contained"
          sx={{
            mt: 3,
            px: 3,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* RIGHT */}
      <Box
        sx={{
          width: { xs: "100%", sm: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          mt: { xs: 4, sm: 5, md: 0 },
          position: "relative",
          zIndex: 20,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2rem", sm: "7rem", md: "8rem" },
            color: "primary.main",
            lineHeight: 1,
            mt: { xs: 0, sm: 10, md: 10 },
          }}
        >
          404
        </Typography>
      </Box>

      {/* BACKGROUND */}
      <Box
        component="img"
        src={bgIllustration}
        alt="bg"
        sx={{
          position: "absolute",
          right: { xs: "-20%", sm: "-10%", md: "5%" },
          bottom: { xs: 0, sm: "5%", md: "21%" },
          width: { xs: "50%", sm: "40%", md: "40%" },
          opacity: 1,
          zIndex: 10,
        }}
      />

      {/* PERSON */}
      <Box
        component="img"
        src={person}
        alt="person"
        sx={{
          position: "absolute",
          right: { xs: "10%", sm: "15%", md: "8%" },
          bottom: { xs: "50%", sm: "80%", md: "25%" },
          width: { xs: "30%", sm: "22%", md: "15%" },
          zIndex: 20,
        }}
      />
    </Box>
  );
};

export default NotFound;