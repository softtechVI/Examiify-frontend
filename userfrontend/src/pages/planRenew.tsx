import React, { useState, useEffect } from "react";
import {
  GetAllPlan,
  GetAllCooupn,
  CheckValidCoupon,
  createOrder,
} from "../API/AllapiVerify";
import { Modal, Button, Select, Checkbox } from "antd";
import classNames from "classnames";
import { IconLockOpen,IconArrowLeft } from "@tabler/icons-react";
import useAlertStore from "../store/useAlertStore";
import useIsLoginStore from "../store/IsLoginStore";
import PaymentStatus from "./paymentStatus";


type Plan = {
  _id: string;
  planName: string;
  duration: number;
  category: number;
  price: string | number;
  plan_image: string;
  status?: number;
  createdAt: string;
  description: string;
};

type Coupon = {
  _id: string;
  couponCode: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  description: string;
};

type CreateOrderResponse = {
  status: number;
  data: {
    status: number;
  };
  [key: string]: any;
};

const PlanRenew: React.FC = () => {
  // get email id and role from query params
  const query = new URLSearchParams(window.location.search);
  const email = query.get("email") || "";
  const type = query.get("type") || "";
  const userId = query.get("id") || "";
  console.log("Email:", email, "Type:", type);

  const { showAlert } = useAlertStore();
  const { isLoginLoading, startLoading, stopLoading } = useIsLoginStore();

  const [isCouponLocked, setIsCouponLocked] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [allCoupon, setCoupon] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const [couponInput, setCouponInput] = useState<string>("");
  const [discount, setDiscount] = useState<number | null>(null);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [extraAddOn, setExtraAddOn] = useState(false); // New state for the add-on checkbox

  const [viewCoupon, setViewCoupon] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"1" | "2" | "0" | null>(
    null
  );
  const [expandedDescriptions, setExpandedDescriptions] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ✅ Fetch plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        startLoading("Fetching plans...");
        const fetchedPlans = await GetAllPlan(type);
        setPlans(fetchedPlans);
        if (fetchedPlans.length > 0) {
          setSelectedPlan(fetchedPlans[0]); // default first plan
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        showAlert("error", "Failed to fetch plans. Please try again later.");
      } finally {
        stopLoading();
      }
    };

    fetchPlans();
  }, [showAlert, startLoading, stopLoading]);

  // Effect to recalculate final price whenever selected plan, discount, or add-on changes
  useEffect(() => {
    if (selectedPlan) {
      const basePrice = Number(selectedPlan.price);
      let calculatedPrice = basePrice;

      if (discount !== null) {
        calculatedPrice = basePrice - discount;
      }
      
      if (extraAddOn) {
        calculatedPrice += 1000;
      }
      
      setFinalPrice(calculatedPrice);
    }
  }, [selectedPlan, discount, extraAddOn]);

  const handleViewCoupon = async () => {
    setViewCoupon(true);
    try {
      const fetchedCoupon = await GetAllCooupn();
      setCoupon(fetchedCoupon);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
      showAlert("error", "Failed to fetch coupons. Try again later.");
    }
  };

  const checkCouponValid = async () => {
    if (!selectedPlan?._id) {
      showAlert("warning", "Please select a plan before applying coupon.");
      return;
    }

    if (couponInput.trim() === "") {
      showAlert("warning", "Please enter a coupon code.");
      return;
    }

    try {
      startLoading("Validating coupon...");
      const res = await CheckValidCoupon(
        selectedCoupon?._id || "",
        selectedPlan._id || "",
        couponInput || ""
      );

      if (res?.status === 200) {
        setSelectedCoupon(res.data.coupon);
        setDiscount(res.data.discountByCheck);
        setFinalPrice(res.data.finalPriceByCheck);
        setIsCouponLocked(true);

        showAlert(
          "success",
          `Coupon "${res.data.coupon.couponCode}" applied successfully!`
        );
      } else {
        setSelectedCoupon(null);
        setDiscount(null);
        setFinalPrice(null);
        showAlert("error", "Invalid coupon code. Please try again.");
      }
    } catch (error :any) {
      console.error("Failed to validate coupon:", error);
      showAlert("error", error.response.data.message);
    } finally {
      stopLoading();
    }
  };

  const handleApplyCouponFromModal = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setCouponInput(coupon.couponCode || "");
    setViewCoupon(false);
    setIsCouponLocked(false);
  };

  const handlePayment = async () => {
    if (!selectedPlan) {
      showAlert("warning", "Please select a plan to proceed with payment.");
      return;
    }
    try {
      startLoading("Processing your payment...");
      const res = (await createOrder(
        selectedPlan._id,
        couponInput,
        selectedCoupon?._id || "",
        finalPrice !== null ? finalPrice : Number(selectedPlan.price),
        discount !== null ? discount : 0,
        userId,
      )) as CreateOrderResponse;

      if (res?.data.status == 1) {
        setPaymentStatus("1");
      } else if (res?.data.status == 2) {
        setPaymentStatus("2");
      } else {
        setPaymentStatus("0");
      }
    } catch (error:any) {
      console.error("Failed to create order:", error);
      showAlert("error",error.response.data.message);
    } finally {
      stopLoading();
    }
  };

  // ✅ If payment is done, show only PaymentStatus
  if (paymentStatus) {
    return <PaymentStatus status={paymentStatus} />;
  }

  return (
    <div className="p-4 md:p-2 lg:px-20 py-2 max-w-screen min-h-screen bg-gray-100 flex flex-col items-center">
      {!isLoginLoading && (
        <>
          <h1 className="text-2xl md:text-3xl font-bold mb-4 mt-2 text-center text-gray-800">
            Plan Details
          </h1>

          {plans.length === 0 ? (
            <p className="text-gray-500 text-center">
              No plans available at the moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start w-full max-w-7xl">
              {/* Left Section: Plan Dropdown + Info */}
              <div className="p-4 md:p-6 bg-white rounded-lg shadow-xl">
                {selectedPlan && (
                  <>
                    <img
                      src={selectedPlan.plan_image}
                      alt={selectedPlan.planName}
                      className="w-full h-40 md:h-56 object-cover rounded mb-4"
                    />

                    {/* Label and Dropdown in same row */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2 md:gap-0">
                      <h2 className="text-xl font-bold text-gray-800">
                        {selectedPlan.planName}
                      </h2>

                      <Select
                        value={selectedPlan?._id}
                        className="custom-select w-full md:w-64"
                        onChange={(value) => {
                          const plan = plans.find((p) => p._id === value);
                          setSelectedPlan(plan || null);
                          setCouponInput("");
                          setSelectedCoupon(null);
                          setDiscount(null);
                          setExtraAddOn(false); // Reset add-on
                          setIsCouponLocked(false);
                        }}
                        options={plans.map((plan) => ({
                          label: `${plan.planName} - ${plan.duration} months`,
                          value: plan._id,
                        }))}
                      />
                    </div>

                    <div
                      className="flex justify-center bg-gray-50 rounded p-2 text-sm text-gray-700 whitespace-pre-wrap break-words max-h-42 min-h-42 overflow-y-auto"
                      style={{ overflowX: "hidden" }}
                    >
                      {selectedPlan.description}
                    </div>

                    {/* New Checkbox for add-on */}
                    <div className="mt-4 flex items-center">
                      <Checkbox
                        checked={extraAddOn}
                        onChange={(e) => setExtraAddOn(e.target.checked)}
                        className="text-gray-700 font-medium"
                      >
                        Add 1000 to total
                      </Checkbox>
                    </div>
                  </>
                )}
              </div>

              {/* Right Section: Coupon + Billing */}
              <div className="flex flex-col gap-6 w-full">
                {/* Apply Coupon */}
                <div className="p-4 md:p-6 bg-white rounded-2xl shadow-lg w-full">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Apply Coupon</h2>

                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          setSelectedCoupon(null);
                        }}
                        placeholder="Enter coupon code"
                        disabled={isCouponLocked}
                        className={`border border-gray-300 rounded px-3 py-2 h-12 w-full focus:outline-none focus:ring-2 focus:ring-[#049F99] transition-colors ${
                          isCouponLocked ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                      />

                      {isCouponLocked && (
                        <button
                          onClick={() => {
                            setCouponInput("");
                            setSelectedCoupon(null);
                            setDiscount(null);
                            setIsCouponLocked(false);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#049F99] transition-colors"
                        >
                          <IconLockOpen size={20} />
                        </button>
                      )}
                    </div>

                    <button
                      onClick={checkCouponValid}
                      disabled={isCouponLocked}
                      className={`px-5 py-2 rounded bg-[#049F99] text-white font-bold h-12 transition-colors ${
                        isCouponLocked
                          ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                          : "hover:bg-[#037d77]"
                      }`}
                    >
                      Apply
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center mt-3 gap-2 sm:gap-0">
                    <p className="text-gray-500 text-sm">
                      Have a coupon? Enter it above.
                    </p>
                    <button
                      className={`px-4 py-2 rounded text-sm ${
                        isCouponLocked
                          ? "text-gray-500 font-bold cursor-not-allowed"
                          : "text-[#0b233c] font-bold"
                      }`}
                      onClick={handleViewCoupon}
                      disabled={isCouponLocked}
                    >
                      View Coupons
                    </button>
                  </div>
                </div>

                {/* Billing Summary */}
                {selectedPlan && (
                  <div className="p-4 md:p-6 bg-white rounded-2xl shadow-lg w-full">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Billing Summary</h2>
                    <div className="space-y-2 text-gray-700">
                      <p className="flex justify-between">
                        <span className="font-medium">Plan</span>
                        <span>{selectedPlan.planName}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium">Duration</span>
                        <span>{selectedPlan.duration} months</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium">Original Price</span>
                        <span>₹{selectedPlan.price}</span>
                      </p>

                      {extraAddOn && (
                          <p className="flex justify-between text-blue-600">
                              <span className="font-medium">Add-on</span>
                              <span>+₹1000</span>
                          </p>
                      )}

                      {discount !== null && (
                        <>
                          <p className="flex justify-between">
                            <span className="font-medium">Coupon Applied</span>
                            <span className="font-semibold text-[#049F99]">
                              {selectedCoupon?.couponCode}
                            </span>
                          </p>
                          <p className="flex justify-between text-green-600">
                            <span className="font-medium">Discount</span>
                            <span>-₹{discount}</span>
                          </p>
                        </>
                      )}
                    </div>

                    <hr className="my-3 border-gray-200" />

                    <p className="flex justify-between text-lg font-semibold">
                      <span>Final Price</span>
                      <span className="text-black">
                        ₹{finalPrice !== null ? finalPrice : Number(selectedPlan.price)}
                      </span>
                    </p>

                    <button
                      className="mt-4 w-full bg-[#049F99] text-white py-3 rounded-lg font-bold transition-colors hover:bg-[#037d77]"
                      onClick={handlePayment}
                    >
                      Proceed to Payment
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Coupon Modal */}
      <Modal
        open={viewCoupon}
        onCancel={() => setViewCoupon(false)}
        footer={null}
        width={600}
        className="custom-modal"
      >
        <h1 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <IconArrowLeft
            onClick={() => setViewCoupon(false)}
            className="cursor-pointer text-gray-600 hover:text-gray-900 transition-colors"
          />
          All Coupons
        </h1>

        {allCoupon.length === 0 ? (
          <p className="text-gray-500 text-center">No coupons available.</p>
        ) : (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {allCoupon.map((coupon) => {
              const isExpanded = expandedDescriptions[coupon._id];
              return (
                <div
                  key={coupon._id}
                  className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="w-full sm:w-[80%]">
                      <h3 className="text-xl font-bold text-[#049F99]">
                        {coupon.couponCode}
                      </h3>
                      <p className="text-gray-700 mb-1">
                        Discount:{" "}
                        <span className="font-medium">
                          {coupon.discountValue}
                          {coupon.discountType === "percentage"
                            ? "%"
                            : " ₹ flat off"}
                        </span>
                      </p>

                      <p
                        className={classNames(
                          "text-sm text-gray-600",
                          !isExpanded && "line-clamp-2"
                        )}
                      >
                        {coupon.description}
                      </p>

                      {coupon.description.length > 100 && (
                        <button
                          onClick={() => toggleDescription(coupon._id)}
                          className="text-blue-600 text-xs mt-1 hover:underline"
                        >
                          {isExpanded ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>

                    <div className="w-full sm:w-auto mt-2 sm:mt-0">
                      <Button
                        type="primary"
                        size="middle"
                        style={{
                          backgroundColor: "#049F99",
                          color: "#fff",
                          border: "none",
                          width: '100%'
                        }}
                        onClick={() => handleApplyCouponFromModal(coupon)}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PlanRenew;