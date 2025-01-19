
export const COMMON_CONSTANTS = {
  REGEX_BASE64:
    /^([\d+/A-Za-z]{4})*([\d+/A-Za-z]{4}|[\d+/A-Za-z]{3}=|[\d+/A-Za-z]{2}==)$/,
};

export enum OrderType {
  BUY = 'Buy',
  SELL = 'Sell',
}

export enum OrderStatus {
  PENDING = 'Pending',
  COMPLETE = 'Complete',
  REJECT = 'Reject',
}

export enum PaymentMethod {
  BANK = 'Bank',
  MOMO = 'Momo',
}

export enum TopupStatus {
  COMPLETE = 'Complete',
  DELETE = 'Delete',
}

export enum ServiceStatus {
  ACTIVE = 1,
  INACTIVE = 2,
}

export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  USER = 'user',
}