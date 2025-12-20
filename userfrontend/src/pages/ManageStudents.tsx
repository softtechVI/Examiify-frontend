import React, { useEffect, useState, useCallback } from "react";
import InsideHeader from "@/components/InsideHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Users,
  PanelsTopLeft,
  Table as TableIcon,
} from "lucide-react";
import { message } from "antd";
import Table from "@/components/Table";
import {
  addNewStudent,
  getStudent,
  updateStudent,
  deleteStudent,
} from "@/API/studentApi";

// Types and Interfaces
interface BaseStudent {
  name: string;
  email: string;
  phone: string;
  course: string;
  year: string;
  status: number;
}

interface Student extends BaseStudent {
  _id?: string;
}

interface StudentData extends BaseStudent {
  _id?: string;
}

interface StudentResponse extends BaseStudent {
  _id: string;
}

interface TableColumn {
  key: keyof Student;
  label: string;
}

const ManageStudents: React.FC = () => {
  // State management with proper types
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState<Student>({
    name: "",
    email: "",
    phone: "",
    course: "",
    year: "",
    status: 1
  });

  // ✅ Fetch students
  const fetchStudents = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getStudent();
      const formattedStudents: Student[] = response.map((student: StudentResponse) => ({
        ...student,
        status: student.status || 1
      }));
      
      if (searchTerm) {
        const filtered = formattedStudents.filter((student) =>
          Object.values(student)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
        setStudents(filtered);
      } else {
        setStudents(formattedStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // ✅ Reset form
  const resetForm = () => {
    setNewStudent({
      name: "",
      email: "",
      phone: "",
      course: "",
      year: "",
      status: 1,
    });
    setEditingStudent(null);
  };

  // ✅ Close Dialog
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  // ✅ Edit student
  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setNewStudent(student);
    setIsDialogOpen(true);
  };

  // ✅ Add/Update student
  const handleSubmitStudent = async () => {
    if (!newStudent.name || !newStudent.email || !newStudent.phone) {
      message.warning("Please fill all required fields!");
      return;
    }

    try {
      if (editingStudent?._id) {
        const updateData = {
          ...newStudent,
          _id: editingStudent._id,
          status: newStudent.status || 1
        };

        const response = await updateStudent(editingStudent._id, updateData);
        setStudents((prev) =>
          prev.map((s) => (s._id === response._id ? {
            ...response,
            status: response.status
          } : s))
        );
        message.success("Student updated successfully!");
      } else {
        const createData = {
          ...newStudent,
          _id: '', // Required by API type
          status: newStudent.status || 1
        };

        const response = await addNewStudent(createData);
        setStudents((prev) => [...prev, {
          ...response,
          status: response.status
        }]);
        message.success("Student added successfully!");
      }
      handleDialogClose();
    } catch (error) {
      console.error('Error saving student:', error);
      message.error("Failed to save student");
    }
  };

  // ✅ Delete student
  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s._id !== id));
      message.success("Student deleted successfully");
    } catch (error) {
      message.error("Failed to delete student");
    }
  };

  const tableColumns: TableColumn[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "course", label: "Course" },
    { key: "year", label: "Year" }
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Manage Students
            </h1>
            <p className="text-muted-foreground">
              View and manage all registered students
            </p>
          </div>

          {/* View toggle + Add button */}
          <div className="flex items-center gap-4">
            <div className="flex rounded-lg overflow-hidden border border-gray-300">
              <div
                onClick={() => setViewMode("card")}
                className={`flex items-center justify-center px-4 py-2 cursor-pointer ${
                  viewMode === "card"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                title="Card View"
              >
                <PanelsTopLeft className="h-5 w-5" />
              </div>
              <div
                onClick={() => setViewMode("table")}
                className={`flex items-center justify-center px-4 py-2 cursor-pointer ${
                  viewMode === "table"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                title="Table View"
              >
                <TableIcon className="h-5 w-5" />
              </div>
            </div>
            <Button
              className="bg-primary hover:bg-primary-dark"
              onClick={() => setIsDialogOpen(true)}
            >
              Add New Student
            </Button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <p>Loading students...</p>
        ) : students.length === 0 ? (
          <p>No students found.</p>
        ) : viewMode === "card" ? (
          // ✅ Card View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <Card
                key={student._id}
                className="p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {student.course} — Year {student.year}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{student.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{student.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>{student.course}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Year: {student.year}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 pt-4 border-t justify-start">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(student)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => handleDeleteStudent(student._id!)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          // ✅ Table View
          <Table
            data={students}
            columns={tableColumns}
            onEdit={handleEditClick}
            onDelete={(id) => handleDeleteStudent(id)}
            idField="_id"
          />
        )}
      </div>

      {/* Add/Edit Student Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingStudent ? "Edit Student" : "Add New Student"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Label className="required">Name</Label>
            <Input
            required
              value={newStudent.name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, name: e.target.value })
              }
              placeholder="Enter student name"
            />
            <Label className="required">Email</Label>
            <Input
            required
              type="email"
              value={newStudent.email}
              onChange={(e) =>
                setNewStudent({ ...newStudent, email: e.target.value })
              }
              placeholder="Enter student email"
            />
            <Label className="required">Phone</Label>
            <Input
            required 
              value={newStudent.phone}
              onChange={(e) =>
                setNewStudent({ ...newStudent, phone: e.target.value })
              }
              placeholder="Enter phone number"
            />
            <Label className="required">Course</Label>
            <Input
            required
              value={newStudent.course}
              onChange={(e) =>
                setNewStudent({ ...newStudent, course: e.target.value })
              }
              placeholder="Enter course name"
            />
            <Label className="required">Year</Label>
            <Input
            required
              value={newStudent.year}
              onChange={(e) =>
                setNewStudent({ ...newStudent, year: e.target.value })
              }
              placeholder="Enter year"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button className="bg-primary" onClick={handleSubmitStudent}>
              {editingStudent ? "Save Changes" : "Save Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageStudents;
