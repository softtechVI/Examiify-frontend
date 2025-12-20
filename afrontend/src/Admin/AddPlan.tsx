import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  Upload,
  Modal,
  message,
  Select,
  Spin, // Make sure Spin is imported
  Divider,
} from "antd";
const { TextArea } = Input;
import Header from "../Components/Admin Navbar/index";
import { UploadOutlined, PictureOutlined } from "@ant-design/icons";
import { AddPlan,GetAllPlan } from "../API/AllApi";
import PlanDescription from "../Components/PlanDescription";

type Plan = {
  _id?: string;
  planName: string;
  duration: number;
  // category: number;
  price: string | number;
  plan_image: string;
  status?: number;
  createdAt: string;
  instituteType: number;
  description: string;
};

function Addplan() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // State for general loading (e.g., fetching plans)
  const [addingPlan, setAddingPlan] = useState(false); // State for adding a new plan
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [form] = Form.useForm();

  const fetchPlans = async () => {
    setLoading(true); // Start loading before fetching plans
    try {
      const plan = await GetAllPlan();
      setPlans(plan);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      message.error("Failed to fetch plans."); // Display error message
    } finally {
      setLoading(false); // End loading after fetching (success or failure)
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset form fields when modal is cancelled
  };

  type AddPlanFormValues = {
    planName: string;
    duration: string | number;
    instituteType: string | number;
    price: string | number;
    image?: { originFileObj: File }[];
    description: string;
  };

  const handleFinish = async (values: AddPlanFormValues) => {
    setAddingPlan(true); // Start loading for adding a plan
    try {
      const formData = new FormData();
      formData.append("planName", values.planName);
      formData.append("duration", values.duration.toString());
      formData.append("instituteType", values.instituteType.toString());
      formData.append("price", values.price.toString());
      formData.append("description", values.description);

      if (values.image && values.image[0]) {
        formData.append("plan_image", values.image[0].originFileObj);
      }

      const data = await AddPlan(formData);
      message.success(data.message); // Use Ant Design message for success
      form.resetFields();
      setIsModalVisible(false);
      await fetchPlans(); // Re-fetch plans to show the newly added one
    } catch (error: unknown) {
      console.error("Error adding plan:", error);
      if (error instanceof Error) {
        message.error(error.message || "Failed to add plan. Please try again.");
      } else {
        message.error("Failed to add plan. Please try again.");
      }
    } finally {
      setAddingPlan(false); // End loading for adding a plan
    }
  };

  const getReadableDuration = (months: number) => {
    const durationMap: { [key: string]: string } = {
      "1": "Monthly (1 Month)",
      "3": "Quarterly (3 Months)",
      "6": "Half-Yearly (6 Months)",
      "12": "Yearly (12 Months)",
    };
    return durationMap[months.toString()] || `${months} Month(s)`;
  };

  const getReadableCategory = (instituteType: number) => {
    const categoryMap: { [key: string]: string } = {
      "1": "School",
      "2": "College & University",
    };
    return categoryMap[instituteType] || "Unknown Category";
  };

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
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => {
          if (window.innerWidth < 768) {
            e.preventDefault();
            setSidebarOpen(false);
          }
        }}
      >
        <div className="flex flex-col h-full sc">
          {/* Sidebar Header with Close Button */}
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

          {/* Sidebar Items */}
          <div
            className="flex-1 overflow-auto p-4 space-y-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onClick={() => {
              if (window.innerWidth < 768) {
                setSidebarOpen(false);
              }
            }}
          >
            <Header />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main
        className="flex-1 p-4 md:p-8 w-full"
        onClick={(e) => e.stopPropagation()}
      >
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

        {/* Header and Add Button */}
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Active Plans
          </h1>
          <button
            onClick={showModal}
            className="text-base md:text-xl font-semibold h-10 w-full md:w-40 rounded-xl bg-[#049F99] text-white cursor-pointer"
            disabled={loading} // Disable button while fetching plans
          >
            Add New Plan
          </button>
        </div>
        <Divider />

        {/* Plan Cards */}
        <div
          className="w-full max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-6
            lg:max-h-[580px] lg:overflow-y-auto lg:overflow-x-hidden "
        >
          {loading ? ( // Show Spin while loading plans
            <div className="flex justify-center items-center h-48">
              <Spin size="large" tip="Loading Plans..." />
            </div>
          ) : plans.length === 0 ? (
            <p className="text-center text-gray-600">No active plans found. Add a new plan to get started!</p>
          ) : (
            plans.map((plan, index) => (
              <div
                key={plan._id || index}
                className="flex flex-col md:flex-row md:justify-between bg-white shadow-md items-start md:items-center p-4 rounded-xl mb-6 w-full right-section-column"
              >
                {/* Left */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto ">
                  <button
                    onClick={() => window.open(plan.plan_image, "_blank")}
                    className="bg-transparent border-none cursor-pointer"
                    title="View Image"
                  >
                    <PictureOutlined
                      style={{ fontSize: "190px", color: "#4B5563" }}
                    />
                  </button>

                  <div>
                    <h1 className="text-base md:text-xl font-bold">
                      {plan.planName}
                    </h1>
                    <p className="text-sm text-gray-600">
                      Duration: {getReadableDuration(plan.duration)}
                    </p>
                    <p className="text-sm text-gray-600">Price: ₹{plan.price}</p>
                    <p className="text-sm text-gray-600">
                      Category: {getReadableCategory(plan.instituteType)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Created Date :{" "}
                      {new Date(plan.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <PlanDescription description={plan.description} />
                  </div>
                </div>

                {/* Right */}
                <div className="w-50%">
                  <div className="flex flex-row gap-2 mt-4 md:mt-0 w-full justify-end p-5 right-section-row">
                    <button className="h-10 px-4 bg-red-500 rounded text-white w-full md:w-auto">
                      Delete
                    </button>
                    <button
                      className={`h-10 px-4 rounded text-white w-full md:w-auto ${
                        plan.status === 1 ? "bg-gray-500" : "bg-green-600"
                      }`}
                    >
                      {plan.status === 1 ? "In-Active" : "Active"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        <Modal
          title="Add New Plan"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={window.innerWidth < 820 ? "90%" : 600}
          maskClosable={!addingPlan} // Prevent closing modal by clicking outside while adding plan
        >
          <Spin spinning={addingPlan} tip="Adding Plan..."> {/* Show Spin when addingPlan is true */}
            <Form form={form} layout="vertical" onFinish={handleFinish}>
              <Form.Item
                label="Plan Name"
                name="planName"
                rules={[
                  { required: true, message: "Please enter the plan name" },
                ]}
              >
                <Input placeholder="Enter plan name" disabled={addingPlan} />
              </Form.Item>

              <Form.Item
                label="Duration"
                name="duration"
                rules={[{ required: true, message: "Please select a duration" }]}
              >
                <Select placeholder="Select duration" disabled={addingPlan}>
                  <Select.Option value="1">Monthly (1 Month)</Select.Option>
                  <Select.Option value="3">Quarterly (3 Months)</Select.Option>
                  <Select.Option value="6">Half-Yearly (6 Months)</Select.Option>
                  <Select.Option value="12">Yearly (12 Months)</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Category"
                name="instituteType"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Radio.Group disabled={addingPlan}>
                  <Radio value="1">School</Radio>
                  <Radio value="2">College & University</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: "Please enter the price" }]}
              >
                <Input placeholder="Enter price" disabled={addingPlan} />
              </Form.Item>
              <Form.Item
                label="Description "
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please enter the plan description ",
                  },
                ]}
              >
                <TextArea
                  rows={2}
                  placeholder="Please enter the plan description"
                  maxLength={1000}
                  disabled={addingPlan}
                />
              </Form.Item>
              <Form.Item
                label="Upload Image"
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              >
                <Upload
                  name="image"
                  listType="picture"
                  beforeUpload={() => false}
                  disabled={addingPlan}
                >
                  <Button icon={<UploadOutlined />} disabled={addingPlan}>Click to Upload</Button>
                </Upload>
              </Form.Item>

              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button onClick={handleCancel} disabled={addingPlan}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit" loading={addingPlan}> {/* Show loading on submit button */}
                    Submit
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Spin>
        </Modal>
      </main>
    </div>
  );
}

export default Addplan;