import { useEffect, useState, FC } from "react";
import { Divider, Modal, Input, message, Button, Table, Tag } from "antd";
import Header from "../Components/Admin Navbar";
import { GetAiPrice, ModifyAiPrice,ModifyAiStatus } from "../API/AllApi";

interface AiPrice {
  _id: string;
  priceCents: number; // ✅ stored in rupees
  active: boolean;
  totalConnectedUsers: number;
  createdAt: string;
  updatedAt: string;
}

const AiPricing: FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [price, setPrice] = useState<string>("");
  const [aiDetail, setAiDetail] = useState<AiPrice[]>([]);

  // Fetch plans
  const fetchAiPrice = async () => {
    try {
      const res = await GetAiPrice();
      setAiDetail(res);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      message.error("Failed to fetch plans.");
    }
  };

  useEffect(() => {
    fetchAiPrice();
  }, []);

  // Save updated price
  const handleSave = async () => {
  const rupees = Number(price);

  if (!rupees || rupees <= 0) {
    alert("Please enter a valid whole rupee amount.");
    return;
  }

  try {
    await ModifyAiPrice(rupees); // your API call
    message.success("Price updated successfully!");
    setModalOpen(false);
    setPrice("");
    fetchAiPrice(); // refresh table
  } catch (error) {
    console.error(error);
    message.error("Failed to update price. Try again.");
  }
};

  // Update plan status (activate or deactivate)
const handleStatusChange = async (id: string, newStatus: boolean) => {
  try {
    const res = await ModifyAiStatus(id, newStatus);
    if (res) {
      message.success(`Plan ${newStatus ? "activated" : "deactivated"} successfully!`);
      fetchAiPrice(); // Refresh table
    }
  } catch (error) {
    console.error(error);
    message.error("Failed to update plan status.");
  }
};



  const columns = [
    {
  title: "Price (₹)",
  dataIndex: "priceCents",
  key: "priceCents",
  render: (val?: number) =>
    val !== undefined ? `₹${(val).toLocaleString("en-IN")}` : "N/A",
},
    {
    title: "Status",
    dataIndex: "active",
    key: "active",
    render: (val: boolean) =>
      val ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
  },
    {
      title: "Total Connected Users",
      dataIndex: "totalConnectedUsers",
      key: "totalConnectedUsers",
      // made it a button to indicate interactivity
      render: (val: number) => (
        <Button type="link">
          {val}
        </Button>
      ),
    },
   {
    title: "Actions",
    key: "actions",
    render: (_: any, record: AiPrice) => (
      <div className="space-x-2">
        <Button
          type="primary"
          onClick={() => {
            setPrice(record.priceCents?.toString() || "");
            setModalOpen(true);
          }}
        >
          Edit
        </Button>

        {/* Toggle Status Button */}
        <Button
          type={record.active ? "default" : "primary"}
          danger={record.active}
          onClick={() => handleStatusChange(record._id, !record.active)}
        >
          {record.active ? "Deactivate" : "Activate"}
        </Button>
      </div>
    ),
  },

  ];

  return (
    <div
      className="flex h-screen bg-gray-100 relative"
      onClick={() => {
        if (window.innerWidth < 768) {
          setSidebarOpen(false);
        }
      }}
    >
      {/* Sidebar */}
      <div
        className={`bg-white shadow-md z-30 transition-transform duration-300 fixed md:static top-0 left-0 h-full w-64 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 md:hidden">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(false);
              }}
              className="text-2xl font-bold"
            >
              &times;
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-2">
            <Header />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 w-full">
        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center mb-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(true);
            }}
            className="text-3xl text-gray-700 focus:outline-none"
          >
            &#9776;
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            AI Analysis Pricing
          </h1>
        </div>
        <Divider />

        {/* Plans Table */}
        <Table
          dataSource={aiDetail}
          columns={columns}
          rowKey="_id"
          pagination={false}
        />

        {/* Edit Modal */}
        <Modal
          title="Modify AI Plan Price"
          open={modalOpen}
          onCancel={() => {
            setModalOpen(false);
  
          }}
          onOk={handleSave}
          okText="Save"
          cancelText="Cancel"
        >
          <label className="block mb-2 font-medium">
            Enter AI Plan Price (₹)
          </label>
          <Input
            type="number"
            placeholder="Enter whole rupees"
            value={price}
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, ""); // digits only
              if (val.startsWith("0")) val = val.replace(/^0+/, ""); // no leading zeros
              setPrice(val);
            }}
          />
        </Modal>
      </main>
    </div>
  );
};

export default AiPricing;
