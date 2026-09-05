import { useEffect, useState } from "react";
import { AdminLayout } from "@/Components/layout/AdminLayout";
import { GetBlockedIps, UnblockIp } from "../services/api";

import {
    Card,
    CardContent,
    Typography,
    Box,
    InputAdornment,
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";

import { ShieldOff, Search, Unlock } from "lucide-react";
import { brandColors } from "@/theme";

interface BlockedIP {
    ip: string;
    email?: string;
    reason?: string;
    blockedAt?: string;
}

const IpUnblock = () => {
    const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const loadBlockedIps = async () => {
        try {
        setLoading(true);

        const response = await GetBlockedIps();

        setBlockedIPs(response?.data || []);
        } catch (error) {
        console.error("Failed to load blocked IPs:", error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        loadBlockedIps();
    }, []);

    const handleUnblock = async (ip: string) => {
        try {
        await UnblockIp(ip);

        setBlockedIPs((prev) =>
            prev.filter((item) => item.ip !== ip)
        );
        } catch (error) {
        console.error("Failed to unblock IP:", error);
        }
    };

    const filteredIPs = blockedIPs.filter((item) => {
        const searchText = search.toLowerCase();

        return (
        item.ip?.toLowerCase().includes(searchText) ||
        item.email?.toLowerCase().includes(searchText)
        );
    });

    const summaryStats = [
        {
        label: "TOTAL BLOCKED",
        value: blockedIPs.length,
        },
        {
        label: "UNIQUE USERS",
        value: blockedIPs.length,
        },
        {
        label: "SHOWING",
        value: filteredIPs.length,
        },
    ];

    return (
        <AdminLayout>
        <Box
            sx={{
            p: { xs: 3, lg: 4 },
            display: "flex",
            flexDirection: "column",
            gap: 4,
            }}
        >
            {/* Header */}
            <Box
            sx={{
                ml: { xs: 0, sm: "40px" },
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
            }}
            >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <ShieldOff size={28} color={brandColors.primary} />

                <Box>
                <Typography
                    variant="h3"
                    sx={{
                    fontWeight: "bold",
                    color: "text.primary",
                    mb: 0.5,
                    }}
                >
                    IP Unblock
                </Typography>

                <Typography
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                >
                    Review blocked IP addresses and restore access for legitimate
                    users.
                </Typography>
                </Box>
            </Box>

            <TextField
                placeholder="Search IP or email"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: { xs: "100%", sm: 280 } }}
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                    <Search size={16} color="grey" />
                    </InputAdornment>
                ),
                }}
            />
            </Box>

            {/* Summary Cards */}
            <Box
            sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, 1fr)",
                },
            }}
            >
            {summaryStats.map((stat) => (
                <Card
                key={stat.label}
                sx={{
                    position: "relative",
                    overflow: "hidden",
                }}
                >
                <CardContent>
                    <Typography
                    variant="caption"
                    sx={{
                        fontWeight: 800,
                        color: "text.secondary",
                        letterSpacing: 1,
                    }}
                    >
                    {stat.label}
                    </Typography>

                    <Typography
                    sx={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                        color: "text.primary",
                        mt: 0.5,
                    }}
                    >
                    {stat.value}
                    </Typography>
                </CardContent>

                <Box
                    sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(to right, ${brandColors.primary}33, ${brandColors.primary}0D)`,
                    }}
                />
                </Card>
            ))}
            </Box>

            {/* Table */}
            <Card>
            <CardContent sx={{ p: 0 }}>
                <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns:
                    "1.2fr 1.8fr 1.5fr 1.2fr 0.8fr",
                    px: 3,
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "action.hover",
                }}
                >
                {[
                    "IP Address",
                    "Email",
                    "Reason",
                    "Blocked At",
                    "Action",
                ].map((col) => (
                    <Typography
                    key={col}
                    variant="caption"
                    sx={{
                        fontWeight: 800,
                        color: "text.secondary",
                    }}
                    >
                    {col}
                    </Typography>
                ))}
                </Box>

                {loading ? (
                <Box
                    sx={{
                    py: 5,
                    display: "flex",
                    justifyContent: "center",
                    }}
                >
                    <CircularProgress />
                </Box>
                ) : filteredIPs.length === 0 ? (
                <Box sx={{ py: 5, textAlign: "center" }}>
                    <Typography color="text.secondary">
                    No blocked IPs found.
                    </Typography>
                </Box>
                ) : (
                filteredIPs.map((row, index) => (
                    <Box
                    key={row.ip}
                    sx={{
                        display: "grid",
                        gridTemplateColumns:
                        "1.2fr 1.8fr 1.5fr 1.2fr 0.8fr",
                        alignItems: "center",
                        px: 3,
                        py: 2,
                        borderBottom:
                        index < filteredIPs.length - 1
                            ? "1px solid"
                            : "none",
                        borderColor: "divider",
                        "&:hover": {
                        backgroundColor: "action.hover",
                        },
                    }}
                    >
                    <Typography
                        variant="body2"
                        sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        }}
                    >
                        {row.ip}
                    </Typography>

                    <Typography variant="body2">
                        {row.email || "-"}
                    </Typography>

                    <Typography variant="body2">
                        {row.reason || "-"}
                    </Typography>

                    <Typography variant="body2">
                        {row.blockedAt || "-"}
                    </Typography>

                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<Unlock size={14} />}
                        onClick={() => handleUnblock(row.ip)}
                        sx={{
                        backgroundColor: brandColors.primary,
                        color: "#fff",
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 2,
                        "&:hover": {
                            backgroundColor: brandColors.primary,
                            opacity: 0.88,
                        },
                        }}
                    >
                        Unblock
                    </Button>
                    </Box>
                ))
                )}
            </CardContent>
            </Card>
        </Box>
        </AdminLayout>
    );
};

export default IpUnblock;