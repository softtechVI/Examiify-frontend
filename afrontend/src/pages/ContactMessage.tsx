    import { useEffect, useState } from "react";
    import { AdminLayout } from "@/Components/layout/AdminLayout";
    import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    } from "@mui/material";
    import { pageWrapperSx, loadingWrapperSx } from "@/theme";
    import { GetAllContacts } from "@/services/api";
    import useAlertStore from "@/store/useAlertStore";
    import { ContactItem } from "@/types";

    const ContactMessages = () => {
    const [contacts, setContacts] = useState<ContactItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { showAlert } = useAlertStore();

    const fetchContacts = async () => {
        try {
        const data = await GetAllContacts();
        setContacts(data);
        } catch {
        showAlert("error", "Failed to load contact messages");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

return (
        <AdminLayout>
        <Box sx={pageWrapperSx}>
            {/* Page Header */}
            <Box>
            <Typography variant="h4" sx={{ml : 5}}>Contact Messages</Typography>
            <Typography variant="body2" sx={{ mt: 0.5, ml : 5 }}>
                Messages submitted from Contact page
            </Typography>
            </Box>

            {/* Table Card */}
            <Card>
            <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                {/* Card Header */}
                <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                <Typography variant="h6">All Messages</Typography>
                <Typography variant="body2">
                    User inquiries and support requests
                </Typography>
                </Box>

                {/* Loading State */}
                {loading ? (
                <Box sx={loadingWrapperSx}>
                    <CircularProgress />
                </Box>
                ) : contacts.length === 0 ? (
                <Box sx={{ py: 8, textAlign: "center" }}>
                    <Typography variant="body2">No messages found.</Typography>
                </Box>
                ) : (
                <TableContainer>
                    <Table>
                    <TableHead>
                        <TableRow>
                        {["Name", "Email", "Phone No.", "Institute", "Message", "Status", "Date"].map(
                            (col) => (
                            <TableCell key={col}>{col}</TableCell>
                            )
                        )}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {contacts.map((c) => (
                        <TableRow key={c._id}>
                            <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                            <TableCell>{c.email}</TableCell>
                            <TableCell>{c.phone}</TableCell>
                            <TableCell>{c.company || "—"}</TableCell>
                            <TableCell
                            sx={{
                                maxWidth: 260,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                            >
                            {c.message}
                            </TableCell>
                            <TableCell>
                            <Chip
                                label={c.status}
                                size="small"
                                color={
                                c.status === "resolved"
                                    ? "success"
                                    : c.status === "rejected"
                                    ? "error"
                                    : "default"
                                }
                            />
                            </TableCell>
                            <TableCell>
                            {new Date(c.createdAt).toLocaleDateString()}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
                )}
            </CardContent>
            </Card>
        </Box>
        </AdminLayout>
    );
};

export default ContactMessages;