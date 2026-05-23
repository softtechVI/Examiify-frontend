// Plan Types
export interface Plan {
  _id?: string;
  planName: string;
  duration: number;
  price: string | number;
  plan_image: string;
  status?: number;
  createdAt: string;
  instituteType: number;
  description: string;
}

export interface AddPlanFormValues {
  planName: string;
  duration: string | number;
  instituteType: string | number;
  price: string | number;
  image?: File;
  description: string;
}

// Coupon Types
export interface Coupon {
  _id: string;
  couponCode: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  instituteType?: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  couponUsed?: number;
  perUserLimit: number;
  status: string;
  applicablePlanName?: string[];
  planId?: string[];
}

export interface AddCouponFormValues {
  couponCode: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  instituteType?: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  perUserLimit: number;
  planId?: string[];
}

// AI Pricing Types
export interface AiPrice {
  _id: string;
  priceCents: number;
  active: boolean;
  totalConnectedUsers: number;
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface User {
  _id: string;
  email: string;
  role: number;
  name?: string;
}

export interface RoleRecord {
  _id: string;
  code: number;
  key: string;
  name: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface RoleCatalogResponse {
  roles: RoleRecord[];
  permissionCatalog: string[];
  defaultRoleTemplates: Array<{
    code: number;
    key: string;
    name: string;
    description: string;
    permissions: string[];
    isSystem: boolean;
  }>;
}

export type ContactStatus = "new" | "read" | "replied" | "resolved" | "rejected";

export interface ContactItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}