import React, { useState, useEffect } from "react";
import InsideHeader from "@/components/InsideHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Users, PanelsTopLeft, Table as TableIcon } from "lucide-react";
import { message } from "antd";
import Table from "@/components/Table";
import { getRooms, addRoom, deleteRoom, updateRoom } from "../API/rooms";
import { Room, RoomPayload } from "../types";

interface RoomFormState {
  roomNumber: string;
  name: string;
  capacity: string;
  type: string;
  facilities: string;
  status: string;
  location: string;
}

// Display-friendly room shape (capacity and facilities as strings)
interface DisplayRoom {
  _id: string;
  roomNumber: string;
  name: string;
  capacity: string;
  type: string;
  facilities: string;
  status: string;
  location: string;
}

const ManageRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  // Formatted data for display (capacity as string, facilities as comma string)
  const [formattedData, setFormattedData] = useState<DisplayRoom[]>([]);
  const [open, setOpen] = useState(false);
  const [newRoom, setNewRoom] = useState<RoomFormState>({
    roomNumber: "",
    name: "",
    capacity: "",
    type: "",
    facilities: "",
    status: "Available",
    location: "",
  });
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const resetForm = () => {
    setNewRoom({
      roomNumber: "",
      name: "",
      capacity: "",
      type: "",
      facilities: "",
      status: "Available",
      location: "",
    });
    setEditingRoom(null);
  };

  const handleDialogClose = () => {
    setOpen(false);
    resetForm();
  };

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await getRooms();
          const fd: DisplayRoom[] = data.map((room: Room) => {
            const r = room as unknown as Record<string, unknown>;
            const id = typeof r._id === "string" ? (r._id as string) : String(r._id ?? "");
            const roomNumber = typeof r.roomNumber === "number"
              ? String(r.roomNumber)
              : typeof r.roomNumber === "string"
              ? (r.roomNumber as string)
              : "";
            const name = typeof r.name === "string" ? (r.name as string) : String(r.name ?? "");
            const capacity =
              typeof r.capacity === "number"
                ? String(r.capacity)
                : typeof r.capacity === "string"
                ? (r.capacity as string)
                : "";
            const typeVal = typeof r.type === "string" ? (r.type as string) : String(r.type ?? "");
            const facilities = Array.isArray(r.facilities)
              ? (r.facilities as string[]).join(", ")
              : typeof r.facilities === "string"
              ? (r.facilities as string)
              : "";
            const status = typeof r.status === "string" ? (r.status as string) : "";
            const location = typeof r.location === "string" ? (r.location as string) : "";

            return {
              _id: id,
              roomNumber,
              name,
              capacity,
              type: typeVal,
              facilities,
              status,
              location,
            };
          });
      // keep rooms state as the raw API response for mutations
      setRooms(data);
      // set formatted data separately for display
      setFormattedData(fd);
    } catch {
      message.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleEditClick = (roomLike: Room | DisplayRoom) => {
    // Try to find the raw Room in `rooms` by _id. If not present, assume roomLike is raw.
    const maybeId = (roomLike as unknown) as Record<string, unknown>;
    const rid = typeof maybeId._id === "string" ? (maybeId._id as string) : undefined;
    const raw = rooms.find((r) => r._id === rid) || (roomLike as Room);

    setEditingRoom(raw);
    const rRec = (raw as unknown) as Record<string, unknown>;
    const name = typeof rRec.name === "string" ? (rRec.name as string) : "";
    const capacity =
      typeof rRec.capacity === "number"
        ? String(rRec.capacity)
        : typeof rRec.capacity === "string"
        ? (rRec.capacity as string)
        : "";
    const typeVal = typeof rRec.type === "string" ? (rRec.type as string) : "";
    const facilities = Array.isArray(rRec.facilities)
      ? (rRec.facilities as string[]).join(", ")
      : typeof rRec.facilities === "string"
      ? (rRec.facilities as string)
      : "";
    const status = typeof rRec.status === "string" ? (rRec.status as string) : "";
    const location = typeof rRec.location === "string" ? (rRec.location as string) : "";

    setNewRoom({
      roomNumber: rRec.roomNumber ? String(rRec.roomNumber) : "",
      name,
      capacity,
      type: typeVal,
      facilities,
      status,
      location,
    });
    setOpen(true);
  };

  const handleSubmitRoom = async () => {
    if (!newRoom.name || !newRoom.capacity || !newRoom.type || !newRoom.location) {
      message.warning("Please fill all required fields!");
      return;
    }

    const payload: RoomPayload = {
      ...newRoom,
      capacity: parseInt(newRoom.capacity),
      facilities: newRoom.facilities
        ? newRoom.facilities.split(",").map((f) => f.trim())
        : [],
    };

    try {
      if (editingRoom) {
        const updatedRoom = await updateRoom(editingRoom._id, payload);
        message.success("Room updated successfully");
        setRooms((prev) =>
          prev.map((r) => (r._id === editingRoom._id ? updatedRoom : r))
        );
      } else {
        const addedRoom = await addRoom(payload);
        message.success("Room added successfully");
        setRooms((prev) => [...prev, addedRoom]);
      }
      await fetchRooms();

      handleDialogClose();
    } catch {
      message.error(`Failed to ${editingRoom ? "update" : "add"} room`);
    }
  };

  const handleDeleteRoom = async (id: string) => {
    try {
      await deleteRoom(id);
      message.success("Room deleted successfully");
      setRooms((prev) => prev.filter((r) => r._id !== id));
    } catch {
      message.error("Failed to delete room");
    }
    await fetchRooms();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Occupied":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const tableColumns = [
    { key: "roomNumber", label: "Room Number" },
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "capacity", label: "Capacity" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Manage Rooms
            </h1>
            <p className="text-muted-foreground">
              View and manage examination rooms and their availability
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex rounded-lg overflow-hidden border border-gray-300">
              <div
                onClick={() => setViewMode("card")}
                className={`flex items-center justify-center px-4 py-2 cursor-pointer transition-colors duration-300 ${
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
                className={`flex items-center justify-center px-4 py-2 cursor-pointer transition-colors duration-300 ${
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
              onClick={() => {
                resetForm();
                setOpen(true);
              }}
            >
              Add New Room
            </Button>
          </div>
        </div>

        {/* Dialog */}
        <Dialog open={open} onOpenChange={handleDialogClose}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingRoom ? "Edit Room" : "Add New Room"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Label className="required">Room Number</Label>
              <Input
              required
                placeholder="101"
                value={newRoom.roomNumber}
                onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
              />
              <Label className="required">Room Name</Label>
              <Input
              required
                placeholder="Hall A-101"
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              />
              <Label className="required">Capacity</Label>
              <Input
              required
                type="number"
                placeholder="50"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
              />
              <Label className="required">Type</Label>
              <Input
              required
                placeholder="Lecture Hall / Classroom"
                value={newRoom.type}
                onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
              />
              <Label className="required">Facilities</Label>
              <Input
              required
                placeholder="Projector, AC, Whiteboard"
                value={newRoom.facilities}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, facilities: e.target.value })
                }
              />
              <Label className="required">Location</Label>
              <Input
              required
                placeholder="Block A, First Floor"
                value={newRoom.location}
                onChange={(e) => setNewRoom({ ...newRoom, location: e.target.value })}
              />
              {editingRoom && (
                <>
                  <Label>Status</Label>
                  <select
                    value={newRoom.status}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, status: e.target.value })
                    }
                    className="border rounded-md p-2 w-full"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button className="bg-primary" onClick={handleSubmitRoom}>
                {editingRoom ? "Save Changes" : "Save Room"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Content */}
        {loading ? (
          <p>Loading rooms...</p>
        ) : formattedData.length === 0 ? (
          <p>No rooms available.</p>
        ) : viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formattedData.map((room) => (
              <Card
                key={room._id}
                className="p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {room.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {room.type}
                      </p>
                    </div>
                    <Badge className={getStatusColor(room.status)}>
                      {room.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Capacity: {room.capacity} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{room.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditClick(room)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      size="sm"
                      onClick={() => handleDeleteRoom(room._id)}
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
            data={formattedData}
            columns={tableColumns}
            getStatusColor={getStatusColor}
            onEdit={handleEditClick}
            onDelete={handleDeleteRoom}
          />
        )}
      </div>
    </div>
  );
};

export default ManageRooms;
