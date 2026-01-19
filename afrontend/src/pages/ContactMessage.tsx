    import { useEffect, useState } from "react";
    import { AdminLayout } from "@/components/layout/AdminLayout";
    import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    } from "@/components/ui/table";
    import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    } from "@/components/ui/card";
    import { Badge } from "@/components/ui/badge";
    import { useToast } from "@/hooks/use-toast";
    import { GetAllContacts} from "@/services/api";

    const ContactMessages = () => {
    const [contacts, setContacts] = useState<ContactItem[]>([]);
    const { toast } = useToast();

    const fetchContacts = async () => {
        try {
        const data = await GetAllContacts();
        setContacts(data);
        } catch (err: any) {
        toast({
            title: "Error",
            description: "Failed to load contact messages",
            variant: "destructive",
        });
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <AdminLayout>
        <div className="p-6 lg:p-8 space-y-6">
            <div>
            <h1 className="text-2xl lg:text-3xl font-bold">
                Contact Messages
            </h1>
            <p className="text-muted-foreground">
                Messages submitted from Contact page
            </p>
            </div>

            <Card>
            <CardHeader>
                <CardTitle>All Messages</CardTitle>
                <CardDescription>
                User inquiries and support requests
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone No.</TableHead>
                        <TableHead>Institute</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                    </TableHeader>


                <TableBody>
                    {contacts.map((c) => (
                        <TableRow key={c._id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>{c.email}</TableCell>
                        <TableCell>{c.phone}</TableCell>
                        <TableCell>{c.company || "-"}</TableCell>
                        <TableCell className="max-w-xs truncate">{c.message}</TableCell>
                        <TableCell>
                            <Badge variant="secondary">{c.status}</Badge>
                        </TableCell>
                        <TableCell>
                            {new Date(c.createdAt).toLocaleDateString()}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>

                </Table>
            </CardContent>
            </Card>
        </div>
        </AdminLayout>
    );
    };

    export default ContactMessages;
