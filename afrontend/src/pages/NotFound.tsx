// import  { FC } from "react";
// import { Link } from "react-router-dom";
// import bgIllustration from '../assets/cloud.png'; // cloud + pot
// import person from "../assets/perosn.png"; // person only

// const NotFound: FC = () => {
//   return (
//     <div className="flex flex-col md:flex-row items-center justify-between h-screen w-full bg-white px-8 md:px-20 relative overflow-hidden">
//       {/* LEFT SIDE */}
//       <div className="md:w-1/2 text-left z-20">
//         <h1 className="text-5xl font-extrabold text-gray-900">Page 404</h1>
//         <h2 className="text-2xl font-semibold text-gray-700 mt-2">Not Found</h2>
//         <p className="text-gray-500 mt-4 max-w-md">
//           The page you are looking for might have been removed from Examiify, had its name
//           changed, or is temporarily unavailable. Don’t worry, you can always go
//           back to your dashboard.
//         </p>
//         <Link
//           to="/login"
//           className="inline-block mt-6 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
//         >
//           Back to Dashboard
//         </Link>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="md:w-1/2 flex justify-center mt-10 md:mt-0 relative z-20">
//         {/* Big 404 */}
//         <h1 className="text-[6rem] md:text-[10rem] font-extrabold text-teal-500 relative z-20">
//           404
//         </h1>
//       </div>

//       {/* BACKGROUND CLOUD + POT */}
//       <img
//         src={bgIllustration}
//         alt="404 Background"
//         className="absolute ml-150 mb-25 right-0 w-[60%] md:w-[50%] h-[50%] object-contain opacity-90 z-10"
//       />

//       {/* PERSON IMAGE */}
//       <img
//         src={person}
//         alt="Person Illustration"
//         className="absolute right-1 w-[10%] md:w-[25%] h-[45%] mb-27 object-contain z-20"
//       />
//     </div>
//   );
// };

// export default NotFound;


import { FC } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import bgIllustration from "../assets/cloud.png";
import person from "../assets/perosn.png";
import { brandColors } from "@/theme";

const NotFound: FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        height: "100vh",
        width: "100%",
        bgcolor: "#ffffff",
        px: { xs: 4, md: 10 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* LEFT SIDE */}
      <Box sx={{ width: { md: "50%" }, textAlign: "left", zIndex: 20 }}>

        {/* "Page 404" — h1 variant → DIN Bold */}
        <Typography variant="h1" sx={{ color: "#111827", fontSize: "2.75rem", fontWeight: 9000 }}>
          Page 404 
        </Typography>

        {/* "Not Found" — h4 variant → DIN Bold */}
        <Typography variant="h4" sx={{ color: "#374151", mt: 1, fontSize: "1.75rem" }}>
          Not Found
        </Typography>

        {/* Description — body2 variant → DIN */}
        <Typography
          variant="body2"
          sx={{ mt: 2, maxWidth: 448, lineHeight: 1.7, color: "#6b7280", fontSize: "1.25rem" }}
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
            bgcolor: brandColors.primary,
            boxShadow: "0 4px 6px rgba(0,0,0,0.12)",
            "&:hover": { bgcolor: brandColors.primaryDark },
          }}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* RIGHT SIDE — big 404 */}
      <Box
        sx={{
          width: { md: "50%" },
          display: "flex",
          justifyContent: "center",
          mt: { xs: 5, md: 0 },
          position: "relative",
          zIndex: 20,
        }}
      >
        {/* h1 variant → DIN Bold, override size for big display */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "6rem", md: "10rem" },
            color: brandColors.primary,
            lineHeight: 1,
          }}
        >
          404
        </Typography>
      </Box>

      {/* BACKGROUND CLOUD + POT */}
      <Box
        component="img"
        src={bgIllustration}
        alt="404 Background"
        sx={{
          position: "absolute",
          right: 0,
          ml: "37.5rem",
          width: { xs: "60%", md: "50%" },
          height: "50%",
          objectFit: "contain",
          opacity: 0.9,
          zIndex: 10,
        }}
      />

      {/* PERSON IMAGE */}
      <Box
        component="img"
        src={person}
        alt="Person Illustration"
        sx={{
          position: "absolute",
          right: 4,
          width: { xs: "10%", md: "25%" },
          height: "45%",
          objectFit: "contain",
          zIndex: 20,
        }}
      />
    </Box>
  );
};

export default NotFound;