import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Select, Modal, Radio, Spin } from "antd"; // Import Spin
import { RegisterUser, OtpRequest  } from "../API/AllapiVerify"; // Adjust the import path as necessary
const { TextArea } = Input;
const { Option, OptGroup } = Select;
import OTPModel from "@/components/OTPModel/index"; // Adjust the import path as necessary
import PasswordModal from "@/components/SetPassword/index"; // <--- Import new PasswordModal
import useIsLoginStore from "@/store/IsLoginStore";
import logo from "../assets/logo5.png";
import homeimg from "../assets/homeimage-login.png";
import DashboardButton from "../components/Dashboard/index";

const stateCityMap: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati", "Rajahmundry", "Kadapa", "Anantapur", "Eluru"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Bomdila", "Ziro", "Roing", "Tezu", "Daporijo", "Khonsa"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Karimganj", "Diphu"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Arrah", "Begusarai", "Katihar", "Munger"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur", "Raigarh", "Ambikapur", "Dhamtari"],
  "Goa": ["Panaji", "Vasco da Gama", "Margao", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Sanquelim", "Valpoi", "Canacona"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand", "Nadiad"],
  "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula"],
  "Himachal Pradesh": ["Shimla", "Mandi", "Solan", "Dharamshala", "Bilaspur", "Hamirpur", "Una", "Kullu", "Chamba", "Nahan"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh", "Giridih", "Ramgarh", "Chaibasa", "Phusro"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubli-Dharwad", "Mangaluru", "Belagavi", "Ballari", "Davangere", "Tumakuru", "Shivamogga", "Bidar"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Alappuzha", "Palakkad", "Malappuram", "Kannur", "Kottayam"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Nanded"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Ukhrul", "Senapati", "Tamenglong", "Kakching", "Jiribam", "Moreh"],
  "Meghalaya": ["Shillong", "Tura", "Nongstoin", "Jowai", "Baghmara", "Williamnagar", "Resubelpara", "Mairang", "Nongpoh", "Mawkyrwat"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Saiha", "Lawngtlai", "Mamit", "Khawzawl", "Saitual"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Mon", "Phek", "Kiphire", "Longleng"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jeypore"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur", "Moga", "Pathankot", "Firozpur"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bhilwara", "Sikar", "Pali"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo", "Jorethang", "Singtam", "Pakyong", "Ravangla", "Soreng"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore", "Erode", "Thoothukudi", "Dindigul"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Siddipet"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia", "Ambassa", "Khowai", "Sonamura", "Teliamura", "Panisagar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Bareilly", "Aligarh", "Moradabad"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Haldwani", "Roorkee", "Rudrapur", "Kashipur", "Rishikesh", "Nainital", "Pithoragarh", "Almora"],
  "West Bengal": ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Howrah", "Bardhaman", "Malda", "Kharagpur", "Berhampore", "Jalpaiguri"],
  "Andaman and Nicobar Islands": ["Port Blair", "Diglipur", "Mayabunder", "Rangat", "Hut Bay", "Car Nicobar", "Campbell Bay", "Kamorta", "Nancowry", "Katchal"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa", "Amli", "Kachigam", "Naroli", "Samarvarni", "Sayli", "Rakholi", "Varkund"],
  "Delhi": ["New Delhi", "Dwarka", "Rohini", "Pitampura", "Saket", "Karol Bagh", "Lajpat Nagar", "Vasant Kunj", "Mayur Vihar", "Connaught Place"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur", "Kathua", "Sopore", "Rajouri", "Pulwama", "Kupwara"],
  "Ladakh": ["Leh", "Kargil", "Diskit", "Nubra", "Padum", "Dras", "Zanskar", "Tangtse", "Nyoma", "Turtuk"],
  "Lakshadweep": ["Kavaratti", "Agatti", "Amini", "Andrott", "Kalpeni", "Kadmat", "Minicoy", "Bitra", "Chetlat", "Kiltan"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam", "Ozhukarai", "Villianur", "Bahour", "Ariyankuppam", "Thirunallar", "Nedungadu"]
};

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const unionTerritories = [
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const countryCodes = [
  { code: '+91', country: 'India', length: 10, pattern: /^\d{10}$/ },
  { code: '+1', country: 'USA', length: 10, pattern: /^\d{10}$/ },
  { code: '+44', country: 'UK', length: 10, pattern: /^\d{10}$/ },
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [otherCity, setOtherCity] = useState<string | null>("");
  const [isOTPModalVisible, setOTPIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  const [fullPhoneNumber, setFullPhoneNumber] = useState<string | null>(null);
const { startLoading, stopLoading } = useIsLoginStore();

  type FormDataType = {
    name: string;
    institutionType: string;
    institute: string;
    email: string;
    address: string;
    state: string;
    city: string;
    otherCity?: string;
    phoneNumber: number;
    countryCode: string;
    fullPhoneNumber?: string;
    password?: string;
  };
  const [formData, setFormData] = useState<FormDataType | null>(null);
  const [form] = Form.useForm();

  const handleRegister = useCallback(async (values: FormDataType) => {
        startLoading("Sending OTP...");
    try {
      const fullPhoneNumber = `${selectedCountryCode}${values.phoneNumber}`;
      values.fullPhoneNumber = fullPhoneNumber;
      setFullPhoneNumber(fullPhoneNumber);
     const resp =  await OtpRequest(values.email, fullPhoneNumber);
     if (resp && resp.status === 200) {
       setFormData(values);
       setOTPIsModalVisible(true);
     }
      
    } catch (error) {
      message.error("Failed to send OTP. Please try again.");
      console.error("OTP Request error:", error);
    } finally {
      stopLoading();
    }
  }, [selectedCountryCode]);

  const handleOTPSuccess = () => {
    setOTPIsModalVisible(false);
    setIsPasswordModalVisible(true);
  };

  const handlePasswordSetAndRegister = async (password: string) => {
    if (!formData) return;

   startLoading("Registering user..."); // Start loading for final registration
    const finalCity = formData.city === "Other" ? (formData.otherCity || "") : formData.city;

    try {
      const result = await RegisterUser({
        name: formData.name,
        institutionType: formData.institutionType,
        phoneNumber: formData.fullPhoneNumber || fullPhoneNumber || "",
        institute: formData.institute,
        email: formData.email,
        address: formData.address,
        state: formData.state,
        city: finalCity,
        password: password,
      });
      const encodedEmail = encodeURIComponent(result.email);
          const encodedToken = encodeURIComponent(result.id);
          const encodedType = encodeURIComponent(result.institutionType);

      setIsPasswordModalVisible(false);
      navigate(`/plan-renew?email=${encodedEmail}&id=${encodedToken}&type=${encodedType}`, { state: { message: "Registration successful! Please log in." } });
      alert("Registration successful! Procces to Payment");
    } catch (error) {
     alert("Something went wrong during registration.");
      console.error("Registration error:", error);
    } finally {
      stopLoading();
    }
  };

  const handleCountryCodeChange = (value: string) => {
    setSelectedCountryCode(value);
    form.validateFields(['phoneNumber']);
  }
  const currentCountry = countryCodes.find(c => c.code === selectedCountryCode);
  const phoneNumberLength = currentCountry ? currentCountry.length : 10;
  const phoneNumberPattern = currentCountry ? currentCountry.pattern : /^\d{10}$/;

  const handleCityChange = (value: string) => {
    setCity(value);
    if (value !== "Other") {
      setOtherCity("");
    }
  };

  return (
    <div className="min-h-screen max-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col lg:flex-row w-full h-full bg-white pt-10">
          {/* Left Side - Brand Info (Hidden on small screens) */}
          <div className="hidden lg:flex bg-white items-center justify-center">
            <img src={homeimg} className="w-full h-175 object-cover" alt="Brand" />
          </div>

          {/* Right Side - Registration Form */}
          <DashboardButton className="bg-[#038a85] text-white font-bold hover:bg-[#038a85]" />
          <div className="w-full lg:w-1/2 flex flex-col justify-center h-screen overflow-hidden mt-10">
          
            <div className="bg-white w-full max-w-md mx-auto px-6 overflow-y-auto max-h-[90vh] no-scrollbar">
              <div className="flex flex-col items-center justify-center">
                <img src={logo} className="w-50 h-28 block" alt="Logo" />
                <p className="text-2xl font-bold text-[#049F99] leading-[0.1] mb-10">Registration</p>
              </div>

              <Form requiredMark={true} layout="vertical" onFinish={handleRegister} form={form}>
                <Form.Item
                  label="Your Name"
                  name="name"
                  rules={[{ required: true, message: "Please enter your Name!" }]}
                >
                  <Input placeholder="Enter your Name" />
                </Form.Item>
                <Form.Item
                  label="Institution Type"
                  name="institutionType"
                  rules={[{ required: true, message: "Please select your Institution Type" }]}
                >
                  <Radio.Group>
                    <Radio value="School">School</Radio>
                    <Radio value="College/University">College & University</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  label="Institute Name"
                  name="institute"
                  rules={[{ required: true, message: "Please enter your Institute Name" }]}
                >
                  <Input placeholder="Enter your Institute Name" />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Please enter your Email" }, { type: 'email', message: "Please enter a valid email!" }]}
                >
                  <Input placeholder="Enter your Email" />
                </Form.Item>

                <Form.Item label="Phone Number" required>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Form.Item
                      name="countryCode"
                      noStyle
                      rules={[{ required: true, message: "Code required" }]}
                      initialValue="+91"
                    >
                      <Select
                        onChange={handleCountryCodeChange}
                        style={{ flexShrink: 0, width: '110px' }}
                      >
                        {countryCodes.map((country) => (
                          <Option key={country.code} value={country.code}>
                            {country.code} ({country.country})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="phoneNumber"
                      noStyle
                      rules={[
                        { required: true, message: "Phone number required" },
                        { pattern: phoneNumberPattern, message: `Number must be ${phoneNumberLength} digits.` },
                      ]}
                    >
                      <Input
                        style={{ flexGrow: 1 }}
                        placeholder="Enter your Phone Number"
                        maxLength={phoneNumberLength}
                      />
                    </Form.Item>
                  </div>
                </Form.Item>

                <Form.Item
                  label="Address"
                  name="address"
                  rules={[{ required: true, message: "Please enter your Address" }]}
                >
                  <TextArea placeholder="Enter your Address" />
                </Form.Item>

                <Form.Item
                  label="State / Union Territory"
                  name="state"
                  rules={[{ required: true, message: "Please select your State or UT" }]}
                >
                  <Select
                    placeholder="-- Select State or UT --"
                    onChange={(value) => {
                      setSelectedState(value);
                      form.setFieldsValue({ city: undefined });
                      setCity(null);
                      setOtherCity("");
                    }}
                    allowClear
                  >
                    <Option value={null} disabled>
                      -- Select State or UT --
                    </Option>
                    <OptGroup label="States">
                      {states.map((state) => (
                        <Option key={state} value={state}>
                          {state}
                        </Option>
                      ))}
                    </OptGroup>
                    <OptGroup label="Union Territories">
                      {unionTerritories.map((ut) => (
                        <Option key={ut} value={ut}>
                          {ut}
                        </Option>
                      ))}
                    </OptGroup>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="City"
                  name="city"
                  rules={[{ required: true, message: "Please select your City" }]}
                >
                  <Select
                    placeholder="--Select City--"
                    disabled={!selectedState}
                    value={city}
                    onChange={handleCityChange}
                    allowClear
                  >
                    {selectedState &&
                      stateCityMap[selectedState]?.map((city) => (
                        <Option key={city} value={city}>
                          {city}
                        </Option>
                      ))}
                    <Option value="Other">Other (Please specify)</Option>
                  </Select>
                </Form.Item>

                {city === "Other" && (
                  <Form.Item
                    label="Other City"
                    name="otherCity"
                    rules={[{ required: true, message: "Please specify your city" }]}
                  >
                    <Input
                      value={otherCity || ""}
                      onChange={(e) => setOtherCity(e.target.value)}
                      placeholder="Enter your City"
                    />
                  </Form.Item>
                )}

                <Form.Item className="mt-6">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full !bg-[#049F99] !border-none hover:!bg-[#337774]"
                   // loading={loading} // Disable button and show loading on the button itself
                  >
                    Register
                  </Button>
                </Form.Item>
              </Form>

              <Modal
                title="Verify OTPs"
                open={isOTPModalVisible}
                onCancel={() => setOTPIsModalVisible(false)}
                footer={null}
                centered
                destroyOnClose
              >
                <OTPModel
                  email={formData?.email || ""}
                  phone={formData?.fullPhoneNumber || ""}
                  onVerifiedSubmit={handleOTPSuccess}
                  onClose={() => setOTPIsModalVisible(false)}
                />
              </Modal>

              {/* New Password Modal */}
              <Modal
                title="Set Your Password"
                open={isPasswordModalVisible}
                onCancel={() => setIsPasswordModalVisible(false)}
                footer={null}
                centered
                destroyOnClose
              >
                <PasswordModal
                  onSetPassword={handlePasswordSetAndRegister}
                  onClose={() => setIsPasswordModalVisible(false)}
                />
              </Modal>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Register;