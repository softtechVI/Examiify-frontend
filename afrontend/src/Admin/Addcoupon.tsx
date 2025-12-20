import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  Modal,
  message,
  Divider,
  Select,
  Spin,
  Popconfirm,
  Alert,
} from "antd";
import Header from "../Components/Admin Navbar/index";
import { AddCoupon,GetAllCoupon,GetAllPlan,DeleteCoupon, UpdateCouponStatus, updateCouponData } from "../API/AllApi";
import CouponDescription from "../Components/CouponDescription";


function Addcoupon() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false); // New state for details modal
  type CouponDetails = {
    _id: string;
    couponCode: string;
    description: string;
    discountType: string;
    discountValue: number;
    maxDiscount?: number;
    minOrderAmount?: number;
    instituteType?: string;
    startDate: string;
    endDate: string;
    usageLimit: number;
    coupanUsed?: number;
    perUserLimit: number;
    status: string;
    applicablePlanName?: string[];
    planId?: string[];
  };

  const [selectedCouponDetails, setSelectedCouponDetails] =
    useState<CouponDetails | null>(null); // New state for selected coupon details
  const [form] = Form.useForm();
 const [coupons, setCoupons] = useState<any[]>([]);

  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const planData = await GetAllPlan();
      const couponData = await GetAllCoupon();

      setCoupons(Array.isArray(couponData) ? couponData : []);
    setPlans(Array.isArray(planData) ? planData : []);
      // setPlans(planData);
    } catch (error) {
      message.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await DeleteCoupon(id);
      setAlertMsg("Coupon deleted successfully!");
      setAlertType("success");
      message.success("Coupon deleted successfully!");
      fetchInitialData();

      setTimeout(() => {
        setAlertMsg(null);
        setAlertType(null);
      }, 900);
    } catch {
      setAlertMsg("Failed to delete coupon.");
      setAlertType("error");
      message.error("Failed to delete coupon.");
      setTimeout(() => {
        setAlertMsg(null);
        setAlertType(null);
      }, 900);
    }
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "1" ? "0" : "1";
      await UpdateCouponStatus(id, newStatus);
      message.success(
        `Coupon ${
          newStatus === "1" ? "activated" : "deactivated"
        } successfully!`
      );
      fetchInitialData();
    } catch (error) {
      message.error("Failed to update coupon status");
    }
  };

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCouponId(null);
    form.resetFields();
  };

  const showDetailsModal = (coupon: any) => {
    setSelectedCouponDetails(coupon);
    setIsDetailsModalVisible(true);
  };

  const handleDetailsModalCancel = () => {
    setIsDetailsModalVisible(false);
    setSelectedCouponDetails(null);
  };

  type AddCouponFormValues = {
    couponCode: string;
    isVisible: "yes" | "no";
    discountType: "flat" | "percentage";
    discountValue: number;
    maxDiscount?: number;
    minOrderAmount?: number;
    description: string;
    category: "school" | "college";
    startDate: string; // or Date
    endDate: string; // or Date
    usageLimit: number;
    perUserLimit: number;
    status: "active" | "inactive";
    planId: string[]; // Changed to string[] to accommodate multiple selections
  };

  const handleFinish = async (values: AddCouponFormValues) => {
    try {
      const formData = new FormData();
      formData.append("couponCode", values.couponCode);
      formData.append("isVisible", values.isVisible === "yes" ? "1" : "0");
      formData.append("discountType", values.discountType);
      formData.append("discountValue", values.discountValue.toString());
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("startDate", values.startDate);
      formData.append("endDate", values.endDate);
      formData.append("usageLimit", values.usageLimit.toString());
      formData.append("perUserLimit", values.perUserLimit.toString());
      formData.append("status", values.status);

      // Handle multiple plan IDs
      if (values.planId && values.planId.length > 0) {
        values.planId.forEach((id) => {
          formData.append("planId", id); // Append each plan ID individually
        });
      }

      if (values.maxDiscount) {
        formData.append("maxDiscount", values.maxDiscount.toString());
      }

      if (values.minOrderAmount) {
        formData.append("minOrderAmount", values.minOrderAmount.toString());
      }

      if (editingCouponId) {
        // Update existing coupon
       const res =  await updateCouponData(editingCouponId, formData); // Replace with your actual update function
       if(res.status === 200){
        message.success("Coupon updated successfully!");
       }
      } else {
        // Add new coupon
        await AddCoupon(formData);
        message.success("Coupon added successfully!");
      }

      form.resetFields();
      setIsModalVisible(false);
      setEditingCouponId(null);
      fetchInitialData();
    } catch (error: any) {
      message.error(error.message || "Failed to submit coupon");
    }
  };

  const handleEditCoupon = (coupon: any) => {
    setIsModalVisible(true);
    setEditingCouponId(coupon._id); // set id to know it's edit mode

    // Pre-fill form with coupon data
    form.setFieldsValue({
      couponCode: coupon.couponCode,
      isVisible: coupon.isVisible ? "yes" : "no",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount,
      minOrderAmount: coupon.minOrderAmount,
      description: coupon.description,
      category: coupon.instituteType, // Use instituteType if that's the correct backend field
      startDate: coupon.startDate ? coupon.startDate.split("T")[0] : null, // format date for input
      endDate: coupon.endDate ? coupon.endDate.split("T")[0] : null,
      usageLimit: coupon.usageLimit,
      perUserLimit: coupon.perUserLimit,
      status: coupon.status,
      planId: coupon.planId, // This should be an array of IDs if multiple are associated
    });
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
      {alertMsg && alertType && (
        <div className="fixed top-4 left-0 right-0 flex justify-center items-center z-50">
          <Alert
            message={alertMsg}
            type={alertType}
            onClose={() => setAlertMsg(null)}
            className="w-[300px]"
            showIcon
          />
        </div>
      )}
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
            Manage Coupons
          </h1>
          <button
            onClick={showModal}
            className="text-base md:text-xl font-semibold h-10 w-full md:w-40 rounded-xl bg-[#049F99] text-white cursor-pointer"
          >
            Add Coupon
          </button>
        </div>
        <Divider />
        <div
          className="w-full max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-6
          lg:max-h-[580px] lg:overflow-y-auto lg:overflow-x-hidden "
        >
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Spin tip="Loading coupons..." />
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {/* Display coupons */}
              {coupons.length === 0 ? (
                <p className="text-center text-gray-500">
                  No coupons available.
                </p>
              ) : (
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...coupons].map((coupon: any) => (
                    <div
                      key={coupon._id}
                      className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between"
                    >
                      <div>
                        <h2 className="text-lg font-bold text-[#049F99]">
                          {coupon.couponCode}
                        </h2>
                        <CouponDescription description={coupon.description} />
                        <p className="p-1 text-sm">
                          <strong>Status:</strong>
                          <span
                            className={`ml-1 font-medium ${
                              coupon.status === "1"
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {coupon.status === "1" ? "Active" : "Inactive"}
                          </span>
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        <Popconfirm
                          title="Are you sure to delete this coupon?"
                          onConfirm={() => handleDelete(coupon._id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button danger size="small">
                            Delete
                          </Button>
                        </Popconfirm>

                        <Button
                          onClick={() =>
                            handleUpdateStatus(coupon._id, coupon.status)
                          }
                          type="primary"
                          size="small"
                          style={{
                            backgroundColor:
                              coupon.status === "1" ? "#ff4d4f" : "#52c41a", // red / green
                            borderColor:
                              coupon.status === "1" ? "#ff4d4f" : "#52c41a",
                            color: "#fff",
                          }}
                        >
                          {coupon.status === "1" ? "Deactivate" : "Activate"}
                        </Button>

                        <Button
                          onClick={() => handleEditCoupon(coupon)}
                          type="default"
                          size="small"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => showDetailsModal(coupon)}
                          type="dashed"
                          size="small"
                        >
                          More Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add/Edit Coupon Modal */}
        <Modal
          title={editingCouponId ? "Edit Coupon" : "Add New Coupon"}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Form.Item
              label="Coupon Code"
              name="couponCode"
              rules={[
                {
                  required: true,
                  message: "Please enter a unique coupon code",
                },
              ]}
            >
              <Input placeholder="e.g. WELCOME50" />
            </Form.Item>
<Form.Item
              label="Is Coupon Code Visible to Users?"
              name="isVisible"
              rules={[
                {
                  required: true,
                  message: "Please Chouse an option",
                },
              ]}
            >
              <Radio.Group>
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Discount Type"
              name="discountType"
              rules={[
                { required: true, message: "Please select discount type" },
              ]}
            >
              <Radio.Group>
                <Radio value="flat">Flat</Radio>
                <Radio value="percentage">Percentage</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Discount Value"
              name="discountValue"
              rules={[
                { required: true, message: "Please enter the discount value" },
              ]}
            >
              <Input placeholder="e.g. 100 or 10%" type="number" min={1} />
            </Form.Item>

            <Form.Item
              label="Max Discount (optional)"
              name="maxDiscount"
              tooltip="Only applies to percentage discount"
            >
              <Input placeholder="e.g. 500" type="number" />
            </Form.Item>

            <Form.Item
              label="Minimum Order Amount (optional)"
              name="minOrderAmount"
            >
              <Input placeholder="e.g. 1000" type="number" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <Input placeholder="e.g. 10% off for all school users" />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select category" }]}
            >
              <Radio.Group>
                <Radio value="school">School</Radio>
                <Radio value="college">College</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: "Select a start date" }]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true, message: "Select an end date" }]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item
              label="Total Usage Limit"
              name="usageLimit"
              rules={[{ required: true, message: "Enter total usage limit" }]}
            >
              <Input placeholder="e.g. 100" type="number" min={1} />
            </Form.Item>

            <Form.Item
              label="Per User Limit"
              name="perUserLimit"
              rules={[
                { required: true, message: "Enter per-user usage limit" },
              ]}
            >
              <Input placeholder="e.g. 1" type="number" min={1} />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Select status" }]}
            >
              <Radio.Group>
                <Radio value="1">Active</Radio>
                <Radio value="0">Inactive</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Associated Plan"
              name="planId"
              rules={[
                {
                  required: true,
                  message: "Please select at least one plan to associate",
                },
              ]}
            >
              <Select mode="multiple" placeholder="Select plans" allowClear>
                {plans.map((plan: any) => (
                  <Select.Option key={plan._id} value={plan._id}>
                    {plan.planName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button onClick={handleCancel}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  {editingCouponId ? "Update Coupon" : "Add Coupon"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Coupon Details Modal */}
        <Modal
          title="Coupon Details"
          open={isDetailsModalVisible}
          onCancel={handleDetailsModalCancel}
          footer={[
            <Button key="close" onClick={handleDetailsModalCancel}>
              Close
            </Button>,
          ]}
        >
          {selectedCouponDetails && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold text-[#049F99] mb-4">
                {selectedCouponDetails.couponCode}
              </h3>
              <p className="mb-1">
                <strong>Discount Type:</strong>{" "}
                {selectedCouponDetails.discountType}
              </p>
              <p className="mb-1">
                <strong>Discount Value:</strong>{" "}
                {selectedCouponDetails.discountValue}
                {selectedCouponDetails.discountType === "percentage" ? "%" : ""}
              </p>
              {selectedCouponDetails.maxDiscount && (
                <p className="mb-1">
                  <strong>Max Discount:</strong> ₹
                  {selectedCouponDetails.maxDiscount}
                </p>
              )}
              {selectedCouponDetails.minOrderAmount && (
                <p className="mb-1">
                  <strong>Min Order Amount:</strong> ₹
                  {selectedCouponDetails.minOrderAmount}
                </p>
              )}
              <p className="mb-1">
                <strong>Category:</strong> {selectedCouponDetails.instituteType}
              </p>
              <p className="mb-1">
                <strong>Start Date:</strong>{" "}
                {new Date(selectedCouponDetails.startDate).toLocaleDateString()}
              </p>
              <p className="mb-1">
                <strong>End Date:</strong>{" "}
                {new Date(selectedCouponDetails.endDate).toLocaleDateString()}
              </p>
              <p className="mb-1">
                <strong>Total Usage Limit:</strong>{" "}
                {selectedCouponDetails.usageLimit}
              </p>
              <p className="mb-1">
                <strong>Coupons Used:</strong>{" "}
                {selectedCouponDetails.coupanUsed}
              </p>
              <p className="mb-1">
                <strong>Per User Limit:</strong>{" "}
                {selectedCouponDetails.perUserLimit}
              </p>
              <p className="">
                <strong>Status:</strong>
                <span
                  className={`ml-1 font-medium ${
                    selectedCouponDetails.status === "1"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {selectedCouponDetails.status === "1" ? "Active" : "Inactive"}
                </span>
              </p>
              <p className="flex items-center">
                <strong>Associated Plan Names:</strong>
                <div className="flex flex-wrap gap-2 mt-1 px-1">
                  {selectedCouponDetails.applicablePlanName?.map(
                    (plan: string, index: number) => (
                      <span
                        key={index}
                        className="bg-[#a1dbd9] text-[#0c827e]  px-2 py-1 rounded text-xs"
                      >
                        {plan}
                      </span>
                    )
                  )}
                </div>
              </p>
              <p className="text-gray-700 mb-2 flex">
                <strong>Description:</strong>
                <CouponDescription
                  description={selectedCouponDetails.description}
                />
              </p>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}

export default Addcoupon;
