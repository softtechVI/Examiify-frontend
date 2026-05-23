import { createTheme } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import EinaRegular from "./fonts/Eina01-Regular.ttf";
import EinaSemiBold from "./fonts/Eina01-SemiBold.ttf";
import EinaBold from "./fonts/Eina01-Bold.ttf";
import DinBold from "./fonts/DIN Alternate Bold.ttf";

// ─────────────────────────────────────────────────────────────
//  Brand tokens  (change here → changes everywhere)
// ─────────────────────────────────────────────────────────────
const BRAND_PRIMARY      = "#049F99";
const BRAND_PRIMARY_DARK = "#038a85";
const BRAND_HOVER_BG     = "rgba(4,159,153,0.08)";
const BRAND_LIGHT_BG     = "rgba(4,159,153,0.1)";
const BRAND_WHITE        = "#fafafa";

// ─────────────────────────────────────────────────────────────
//  MUI Theme
// ─────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    primary: {
      main:         BRAND_PRIMARY,
      dark:         BRAND_PRIMARY_DARK,
      contrastText: "#ffffff",
    },
    error:   { main: "#d32f2f", contrastText: "#ffffff" },
    success: { main: "#2e7d32", contrastText: "#ffffff" },
    text: {
      primary:   "#1a1a1a",
      secondary: "#6b7280",
    },
    background: {
      default: "#f9fafb",
      paper:   "#ffffff",
    },
    action:  { hover: "#f3f4f6" },
    divider: "#e5e7eb",
  },

  typography: {
    fontFamily: "Eina, sans-serif",
    h1:        { fontFamily: "DIN", fontWeight: 700, fontSize: "2.25rem" },
    h2:        { fontFamily: "DIN", fontWeight: 700, fontSize: "2rem" },
    h3:        { fontFamily: "DIN", fontWeight: 700, fontSize: "1.875rem" },
    h4:        { fontFamily: "DIN", fontWeight: 700, fontSize: "1.75rem" },
    h6:        { fontFamily: "DIN", fontWeight: 600, fontSize: "1.125rem" },
    subtitle2: { fontFamily: "DIN", fontWeight: 600, fontSize: "0.875rem" },
    body2:     { fontFamily: "DIN", fontSize: "0.975rem", color: "#6b7280" },
    caption:   { fontFamily: "DIN", fontSize: "0.75rem",  color: "#6b7280" },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Eina';
          src: url(${EinaRegular}) format('truetype');
          font-weight: 400;
          font-style: normal;
        }
        @font-face {
          font-family: 'Eina';
          src: url(${EinaSemiBold}) format('truetype');
          font-weight: 600;
          font-style: normal;
        }
        @font-face {
          font-family: 'Eina';
          src: url(${EinaBold}) format('truetype');
          font-weight: 700;
          font-style: normal;
        }
        @font-face {
          font-family: 'DIN';
          src: url(${DinBold}) format('truetype');
          font-weight: 700;
          font-style: normal;
        }
      `,
    },

    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 500, borderRadius: 8, fontFamily: "Eina, sans-serif" },
        containedPrimary: {
          backgroundColor: BRAND_PRIMARY,
          color: "#ffffff",
          "&:hover": { backgroundColor: BRAND_PRIMARY_DARK },
        },
        outlinedPrimary: {
          borderColor: BRAND_PRIMARY,
          color:       BRAND_PRIMARY,
          "&:hover": { borderColor: BRAND_PRIMARY, backgroundColor: BRAND_HOVER_BG },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: "0px 1px 3px rgba(0,0,0,0.08),0px 1px 2px rgba(0,0,0,0.06)",
          overflow: "hidden",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: { padding: 24, "&:last-child": { paddingBottom: 24 } },
      },
    },

    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 12 } },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: "1.125rem", padding: "20px 24px 8px" },
      },
    },
    MuiDialogContent: {
      styleOverrides: { root: { padding: "8px 24px 16px" } },
    },
    MuiDialogActions: {
      styleOverrides: { root: { padding: "8px 16px 16px", gap: 8 } },
    },

    MuiChip: {
      styleOverrides: {
        root:         { fontWeight: 500, fontSize: "0.75rem", height: 24, borderRadius: 6 },
        colorSuccess: { backgroundColor: "#dcfce7", color: "#15803d" },
        colorError:   { backgroundColor: "#fee2e2", color: "#b91c1c" },
      },
    },

    MuiTextField: {
      defaultProps: { variant: "outlined", size: "small", fullWidth: true, margin: "dense" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&:hover .MuiOutlinedInput-notchedOutline":       { borderColor: BRAND_PRIMARY },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: BRAND_PRIMARY },
          },
          "& .MuiInputLabel-root.Mui-focused": { color: BRAND_PRIMARY },
        },
      },
    },

    MuiSelect:        { styleOverrides: { root: { borderRadius: 8 } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&:hover .MuiOutlinedInput-notchedOutline":       { borderColor: BRAND_PRIMARY },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: BRAND_PRIMARY },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { "&.Mui-focused": { color: BRAND_PRIMARY } } },
    },

    MuiRadio: {
      styleOverrides: {
        root: { color: BRAND_PRIMARY, "&.Mui-checked": { color: BRAND_PRIMARY } },
      },
    },

    // ── Checkbox — brand color ───────────────────────
    MuiCheckbox: {
      styleOverrides: {
        root: { color: BRAND_PRIMARY, "&.Mui-checked": { color: BRAND_PRIMARY } },
      },
    },

    MuiCircularProgress: {
      defaultProps:   { size: 32 },
      styleOverrides: { root: { color: BRAND_PRIMARY } },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          "&:hover":              { backgroundColor: BRAND_LIGHT_BG },
          "&.Mui-selected":       { backgroundColor: BRAND_LIGHT_BG },
          "&.Mui-selected:hover": { backgroundColor: BRAND_LIGHT_BG },
        },
      },
    },

    // ── Table ────────────────────────────────────────
    MuiTableCell: {
      styleOverrides: {
        root: { fontSize: "0.875rem", borderColor: "#e5e7eb" },
        head: { fontWeight: 600, color: "#1a1a1a", backgroundColor: "#f9fafb" },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { "&:hover": { backgroundColor: "rgba(4,159,153,0.03)" } },
      },
    },

    // ── IconButton ──────────────────────────────────
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 8, "&:hover": { backgroundColor: BRAND_HOVER_BG } },
      },
    },
  },

  spacing: 8,
  shape: { borderRadius: 4 },
});

export default theme;

// ─────────────────────────────────────────────────────────────
//  Brand color object — use instead of raw hex strings
// ─────────────────────────────────────────────────────────────
export const brandColors = {
  primary:     BRAND_PRIMARY,
  primaryDark: BRAND_PRIMARY_DARK,
  hoverBg:     BRAND_HOVER_BG,
  lightBg:     BRAND_LIGHT_BG,
  white:       BRAND_WHITE,
};

// ─────────────────────────────────────────────────────────────
//  Page layout sx
// ─────────────────────────────────────────────────────────────

export const pageWrapperSx: SxProps<Theme> = {
  p:             { xs: 2, sm: 3, lg: 4 },
  display:       "flex",
  flexDirection: "column",
  gap:           3,
};

export const pageHeaderSx: SxProps<Theme> = {
  display:        "flex",
  flexDirection:  { xs: "column", sm: "row" },
  justifyContent: "space-between",
  alignItems:     { xs: "flex-start", sm: "center" },
  gap:            2,
};

export const pageTitleStackSx: SxProps<Theme> = {
  display:       "flex",
  flexDirection: "column",
  gap:           0.5,
};

export const pageTitleSx: SxProps<Theme> = {
  fontSize:   { xs: "20px", sm: "24px", lg: "30px" },
  fontWeight: "bold",
  color:      "text.primary",
  ml:        5, // slight left shift to visually align with content below
};

// ─────────────────────────────────────────────────────────────
//  Header button
// ─────────────────────────────────────────────────────────────

export const addPlanBtnSx: SxProps<Theme> = {
  height:     "40px",
  minWidth:   "130px",
  background: BRAND_PRIMARY,
  color:      "#fff",
  "&:hover":  { background: BRAND_PRIMARY_DARK },
};

// ─────────────────────────────────────────────────────────────
//  Filter buttons
// ─────────────────────────────────────────────────────────────

export const filterRowSx: SxProps<Theme> = {
  display:  "flex",
  gap:      1,
  flexWrap: "wrap",
};

export const filterButtonSx = (isActive: boolean): SxProps<Theme> => ({
  color:           isActive ? "#fff"        : BRAND_PRIMARY,
  backgroundColor: isActive ? BRAND_PRIMARY : "transparent",
  borderColor:     BRAND_PRIMARY,
  borderWidth:     1,
  borderStyle:     "solid",
  "&:hover": {
    backgroundColor: isActive ? BRAND_PRIMARY_DARK : BRAND_LIGHT_BG,
    borderColor:     BRAND_PRIMARY,
  },
});

// ─────────────────────────────────────────────────────────────
//  Stat cards
// ─────────────────────────────────────────────────────────────

export const statCardSx: SxProps<Theme> = {
  width:        200,
  borderRadius: 3,
  boxShadow:    3,
};

export const statCardContentSx: SxProps<Theme> = { pt: 3 };

// ─────────────────────────────────────────────────────────────
//  Plan list
// ─────────────────────────────────────────────────────────────

export const planListSx: SxProps<Theme> = {
  display:       "flex",
  flexDirection: "column",
  gap:           3,
};

export const planCardSx: SxProps<Theme> = { overflow: "hidden" };

export const planCardRowSx: SxProps<Theme> = {
  display:       "flex",
  flexDirection: { xs: "column", lg: "row" },
};

export const planImagePanelSx: SxProps<Theme> = {
  width:          { lg: 190 },
  bgcolor:        "action.hover",
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  p:              1,
};

export const planImageBoxSx: SxProps<Theme> = {
  width:          160,
  height:         130,
  borderRadius:   2,
  bgcolor:        "background.paper",
  border:         "1px solid #ddd",
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  overflow:       "hidden",
};

export const planImgSx: SxProps<Theme> = {
  width:     "100%",
  height:    "100%",
  objectFit: "contain",
};

export const planContentSx: SxProps<Theme> = { flex: 1, p: 3 };

export const planDetailsRowSx: SxProps<Theme> = {
  display:        "flex",
  flexDirection:  { xs: "column", lg: "row" },
  justifyContent: "space-between",
  gap:            2,
};

export const planNameRowSx: SxProps<Theme> = {
  display:    "flex",
  alignItems: "center",
  gap:        1,
  flexWrap:   "wrap",
};

export const planMetaRowSx: SxProps<Theme> = {
  display:  "flex",
  flexWrap: "wrap",
  gap:      2,
  color:    "text.secondary",
};

export const planMetaItemSx: SxProps<Theme> = {
  display:    "flex",
  alignItems: "center",
  gap:        0.5,
};

export const planActionsSx: SxProps<Theme> = { display: "flex", gap: 1 };

export const viewBtnSx: SxProps<Theme> = {
  height:     30,
  width:      60,
  color:      BRAND_WHITE,
  background: BRAND_PRIMARY,
};

export const deleteBtnSx: SxProps<Theme> = { height: 30, width: 70 };

export const powerBtnSx: SxProps<Theme> = {
  height:      30,
  width:       60,
  color:       BRAND_PRIMARY,
  borderColor: BRAND_PRIMARY,
  "&:hover": {
    borderColor:     BRAND_PRIMARY,
    backgroundColor: BRAND_HOVER_BG,
  },
};

// ─────────────────────────────────────────────────────────────
//  Dialog buttons
// ─────────────────────────────────────────────────────────────

export const dialogBtnSx: SxProps<Theme> = {
  background: BRAND_PRIMARY,
  color:      "#fff",
  "&:hover":  { background: BRAND_PRIMARY_DARK },
};

// ─────────────────────────────────────────────────────────────
//  View-plan dialog
// ─────────────────────────────────────────────────────────────

export const viewPlanImageSx: SxProps<Theme> = {
  width:        "80%",
  height:       "240px",
  objectFit:    "contain",
  border:       "1px solid #ddd",
  borderRadius: "8px",
  mb:           2,
};

export const viewPlanChipRowSx: SxProps<Theme> = {
  display:  "flex",
  gap:      "10px",
  flexWrap: "wrap",
  mb:       2,
};

// ─────────────────────────────────────────────────────────────
//  Loading spinner
// ─────────────────────────────────────────────────────────────

export const loadingWrapperSx: SxProps<Theme> = {
  display:        "flex",
  justifyContent: "center",
  py:             10,
};