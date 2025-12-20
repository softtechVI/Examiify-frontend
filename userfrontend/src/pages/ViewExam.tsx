import { useState, useEffect } from "react";
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
  Calendar,
  Clock,
  MapPin,
  Users,
  PanelsTopLeft,
  Table as TableIcon,
} from "lucide-react";
import { message } from "antd";
import Table from "@/components/Table";
import {
  getExam,
  addNewExam,
  updateExam,
  deleteExam,
} from "../API/examApi";
import { ExamData } from "../types";
import useSessionStore from "../store/userSession";

// Interface for displaying exams
export interface DisplayExam {
  _id: string;
  examName: string;
  examDate: string;
  examTime: string;
  duration: number;
  room?: string;
  studentCount: number;
  status: string;
  notes?: string;
  shift?: string;
  semesterAndClass?: string;
}

interface ExamFormState {
  examName: string;
  examDate: string;
  examTime: string;
  duration: number;
  shift: string;
  semesterAndClass: string;
  studentCount: string;
  notes: string;
}

const ViewExam: React.FC = () => {
  const [exams, setExams] = useState<DisplayExam[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [newExam, setNewExam] = useState<ExamFormState>({
    examName: "",
    examDate: "",
    examTime: "",
    duration: 0,
    shift: "",
    semesterAndClass: "",
    studentCount: "",
    notes: "",
  });
  const [editingExam, setEditingExam] = useState<DisplayExam | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const user = useSessionStore.getState().user;
  const instituteType: number = user?.institutionType
    ? Number(user.institutionType)
    : 1;

  // ✅ Fetch all exams
  const fetchExams = async (): Promise<void> => {
    setLoading(true);
    try {
      const data: ExamData[] = await getExam();
      console.log(data)
      const mappedExams: DisplayExam[] = data.map((d) => ({
        _id: d._id ?? "",
        examName: d.examName ?? "",
        examDate: d.examDate ?? "",
        examTime: d.examTime ?? "",
        duration: d.duration ?? 0,
        studentCount:
          typeof d.studentCount === "number"
            ? d.studentCount
            : parseInt(String(d.studentCount ?? "0"), 10) || 0,
        status: d.status ?? "Pending",
        notes: d.notes,
        shift: d.shifts,
        semesterAndClass: d.semesterAndClass,
      }));

      setExams(mappedExams);
    } catch (error) {
      // Log full error for debugging
      console.error("Failed to fetch exams:", error);

      // Try to extract a useful message from different error shapes
      let errMsg = "Failed to fetch exams";
      const errObj = error as unknown;
      if (typeof errObj === "object" && errObj !== null) {
        const obj = errObj as Record<string, unknown>;

        // axios-style: error.response?.data?.message
        if (
          obj.response &&
          typeof obj.response === "object" &&
          (obj.response as Record<string, unknown>).data &&
          typeof (obj.response as Record<string, unknown>).data === "object"
        ) {
          const data = (obj.response as Record<string, unknown>).data as Record<
            string,
            unknown
          >;
          if (typeof data.message === "string") {
            errMsg = data.message;
          }
        }

        // fallback: error.message
        if (typeof obj.message === "string") {
          errMsg = obj.message as string;
        }

        // final fallback: stringify the object
        if (errMsg === "Failed to fetch exams") {
          try {
            errMsg = JSON.stringify(obj);
          } catch (_) {
            // keep default
          }
        }
      }

      // Show a user-friendly message but include the extracted detail
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // ✅ Reset form
  const resetForm = (): void => {
    setNewExam({
      examName: "",
      examDate: "",
      examTime: "",
      duration: 0,
      shift: "",
      semesterAndClass: "",
      studentCount: "",
      notes: "",
    });
    setEditingExam(null);
  };

  // ✅ Close Dialog
  const handleDialogClose = (): void => {
    setOpen(false);
    resetForm();
  };

// ✅ Edit exam handler
  const handleEditClick = (exam: DisplayExam): void => {
    setEditingExam(exam);
    setNewExam({
      examName: exam.examName,
      examDate: exam.examDate,
      examTime: exam.examTime,
      duration: exam.duration,
      shift: exam.shift || "",
      semesterAndClass: exam.semesterAndClass || "",
      studentCount: exam.studentCount.toString(),
      notes: exam.notes || "",
    });
    setOpen(true);
  };

  // helper: convert API ExamData to DisplayExam
  const mapToDisplayExam = (d: ExamData): DisplayExam => ({
    _id: d._id ?? "",
    examName: d.examName ?? "",
    examDate: d.examDate ?? "",
    examTime: d.examTime ?? "",
    duration: d.duration ?? 0,
    studentCount:
      typeof d.studentCount === "number"
        ? d.studentCount
        : parseInt(String(d.studentCount ?? "0"), 10) || 0,
    status: d.status ?? "Pending",
    notes: d.notes,
    shift: (d.shifts as string) ?? "",
    semesterAndClass: d.semesterAndClass,
  });

const handleSubmitExam = async (): Promise<void> => {
  if (
    !newExam.examName ||
    !newExam.examDate ||
    !newExam.examTime ||
    !newExam.duration ||
    !newExam.shift
  ) {
    message.warning("Please fill all required fields!");
    return;
  }

  const payload: ExamData = {
    examName: newExam.examName,
    examDate: newExam.examDate,
    examTime: newExam.examTime,
    duration: newExam.duration,
    shifts: newExam.shift,
    semesterAndClass: newExam.semesterAndClass,
    studentCount: parseInt(newExam.studentCount || "0"),
    notes: newExam.notes,
  };

  try {
    if (editingExam?._id) {
      const updatedExam = await updateExam(editingExam._id, payload);
      message.success("Exam updated successfully!");

      // DisplayExam so the resulting array remains DisplayExam[].
      const mapped = mapToDisplayExam(updatedExam);
      setExams((prev) =>
        prev.map((e) => (e._id === editingExam._id ? { ...e, ...mapped } : e))
      );
    } else {
      const addedExam = await addNewExam(payload);
      message.success("Exam added successfully!");
      // Ensure the new item is treated as DisplayExam
      setExams((prev) => [...prev, mapToDisplayExam(addedExam)]);
    }

    handleDialogClose();
  } catch (error) {
    message.error(
      `Failed to ${editingExam ? "update" : "add"} exam. Please try again.`
    );
  }
};


  // ✅ Delete exam
  const handleDeleteExam = async (id: string): Promise<void> => {
    try {
      await deleteExam(id);
      message.success("Exam deleted successfully");
      setExams((prev) => prev.filter((e) => e._id !== id));
    } catch (error) {
      message.error("Failed to delete exam");
    }
  };

  // ✅ Status color utility
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Scheduled":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const tableColumns: { key: keyof DisplayExam | string; label: string }[] = [
    { key: "examName", label: "Exam Name" },
    { key: "examDate", label: "Date" },
    { key: "examTime", label: "Time" },
    { key: "duration", label: "Duration" },
    { key: "shift", label: "Shift" },
    {
      key: "semesterAndClass",
      label: instituteType === 2 ? "Semester" : "Class",
    },
    { key: "studentCount", label: "Students" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Manage Exams
            </h1>
            <p className="text-muted-foreground">
              View and manage all scheduled examinations
            </p>
          </div>

          {/* View Toggle + Add Button */}
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
              onClick={() => setOpen(true)}
            >
              Add New Exam
            </Button>
          </div>
        </div>

        {/* Main content */}
        {loading ? (
          <p>Loading exams...</p>
        ) : exams.length === 0 ? (
          <p>No exams found.</p>
        ) : viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <Card
                key={exam._id}
                className="p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{exam.examName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {exam.semesterAndClass || "N/A"} — {exam.shift}
                      </p>
                    </div>
                    <Badge className={getStatusColor(exam.status)}>
                      {exam.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{exam.examDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{exam.examTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Duration: {exam.duration || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{exam.room || "Not Assigned"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{exam.studentCount} students</span>
                    </div>
                  </div>

                  {/* Left-aligned buttons */}
                  <div className="flex gap-2 pt-4 border-t justify-start">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(exam)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => handleDeleteExam(exam._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Table
            data={exams}
            columns={tableColumns}
            getStatusColor={getStatusColor}
            onEdit={handleEditClick}
            onDelete={handleDeleteExam}
            idField="_id"
          />
        )}
      </div>

      {/* Add/Edit Exam Dialog */}
      <Dialog open={open} onOpenChange={handleDialogClose}>
        {/* <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingExam ? "Edit Exam" : "Add New Exam"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Label>Exam Name</Label>
            <Input
              value={newExam.examName}
              onChange={(e) =>
                setNewExam({ ...newExam, examName: e.target.value })
              }
              placeholder="Enter exam name"
            />
            <Label>Date</Label>
            <Input
              type="date"
              value={newExam.examDate}
              onChange={(e) =>
                setNewExam({ ...newExam, examDate: e.target.value })
              }
            />
            <Label>Time</Label>
            <Input
              type="time"
              value={newExam.examTime}
              onChange={(e) =>
                setNewExam({ ...newExam, examTime: e.target.value })
              }
            />
            <Label>Duration</Label>
            <Input
              placeholder="e.g., 2 hours"
              value={newExam.duration}
              onChange={(e) =>
                setNewExam({ ...newExam, duration: Number(e.target.value) })
              }
            />
            <Label>Shift</Label>
            <select
              className="border rounded-md p-2 w-full"
              value={newExam.shift}
              onChange={(e) =>
                setNewExam({ ...newExam, shift: e.target.value })
              }
            >
              <option value="">Select Shift</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>
            <Label>{instituteType === 2 ? "Semester" : "Class"}</Label>
            <Input
              placeholder={
                instituteType === 2 ? "Enter Semester" : "Enter Class"
              }
              value={newExam.semesterAndClass}
              onChange={(e) =>
                setNewExam({
                  ...newExam,
                  semesterAndClass: e.target.value,
                })
              }
            />
            <Label>Expected Students</Label>
            <Input
              type="number"
              placeholder="e.g., 50"
              value={newExam.studentCount}
              onChange={(e) =>
                setNewExam({
                  ...newExam,
                  studentCount: e.target.value,
                })
              }
            />
            <Label>Notes</Label>
            <Input
              placeholder="Any additional notes..."
              value={newExam.notes}
              onChange={(e) =>
                setNewExam({ ...newExam, notes: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button className="bg-primary" onClick={handleSubmitExam}>
              {editingExam ? "Save Changes" : "Save Exam"}
            </Button>
          </DialogFooter>
        </DialogContent> */}
        <DialogContent className="sm:max-w-[500px]">
  <DialogHeader>
    <DialogTitle>{editingExam ? "Edit Exam" : "Add New Exam"}</DialogTitle>
  </DialogHeader>

  <div className="space-y-4 py-2">
    {/* Exam Name */}
    <Label className="required">Exam Name</Label>
    <Input
      required
      value={newExam.examName}
      onChange={(e) => setNewExam({ ...newExam, examName: e.target.value })}
      placeholder="Enter exam name"
    />

    {/* Date */}
    <Label className="required">Date</Label>
    <Input
      type="date"
      required
      value={newExam.examDate}
      onChange={(e) => setNewExam({ ...newExam, examDate: e.target.value })}
    />

    {/* Time */}
    <Label className="required">Time</Label>
    <Input
      type="time"
      required
      value={newExam.examTime}
      onChange={(e) => setNewExam({ ...newExam, examTime: e.target.value })}
    />

    {/* Duration */}
    <Label className="required">Duration</Label>
    <Input
      type="number"
      required
      placeholder="e.g., 2 hours"
      value={newExam.duration}
      onChange={(e) =>
        setNewExam({ ...newExam, duration: Number(e.target.value) })
      }
    />

    {/* Shift */}
    <Label className="required">Shift</Label>
    <select
      required
      className="border rounded-md p-2 w-full"
      value={newExam.shift}
      onChange={(e) => setNewExam({ ...newExam, shift: e.target.value })}
    >
      <option value="">Select Shift</option>
      <option value="Morning">Morning</option>
      <option value="Afternoon">Afternoon</option>
      <option value="Evening">Evening</option>
    </select>

    {/* Semester/Class */}
    <Label>{instituteType === 2 ? "Semester" : "Class"}</Label>
    <Input
      placeholder={instituteType === 2 ? "Enter Semester" : "Enter Class"}
      value={newExam.semesterAndClass}
      onChange={(e) =>
        setNewExam({ ...newExam, semesterAndClass: e.target.value })
      }
    />

    {/* Expected Students */}
    <Label>Expected Students</Label>
    <Input
      type="number"
      placeholder="e.g., 50"
      value={newExam.studentCount}
      onChange={(e) =>
        setNewExam({ ...newExam, studentCount: e.target.value })
      }
    />

    {/* Notes */}
    <Label>Notes</Label>
    <Input
      placeholder="Any additional notes..."
      value={newExam.notes}
      onChange={(e) => setNewExam({ ...newExam, notes: e.target.value })}
    />
  </div>

  <DialogFooter>
    <Button variant="outline" onClick={handleDialogClose}>
      Cancel
    </Button>
    <Button className="bg-primary" onClick={handleSubmitExam}>
      {editingExam ? "Save Changes" : "Save Exam"}
    </Button>
  </DialogFooter>
</DialogContent>

      </Dialog>
    </div>
  );
};

export default ViewExam;
