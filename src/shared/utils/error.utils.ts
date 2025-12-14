export const ACCOUNT_NOT_FOUND = {
  message: 'Account not found',
  code: 'INF-001',
};

export const INVALID_PASSWORD = {
  message: 'Invalid password provided',
  code: 'INF-002',
};

export const PAYMENT_INITIALIZATION_FAILED = {
  message: 'Error initiating payment collection',
  code: 'INF-003',
};

export const PRODUCT_NOT_FOUND = {
  message: 'Product not found',
  code: 'INF-004',
};

export const USER_ACCOUNT_NOT_FOUND = {
  message: 'User account not found',
  code: 'INF-005',
};

export const ORDER_NOT_FOUND = {
  message: 'Order not found',
  code: 'INF-006',
};

export const INSUFFICIENT_BALANCE = {
  message: 'Insufficient balance',
  code: 'INF-007',
};

export function productOrCampaignNotFound(productId: string) {
  return {
    message: `Product or Campaign not found for ID: ${productId}`,
    code: 'INF-008',
  };
}

export function OUT_OF_STOCK(name: string) {
  return {
    message: `Quantity for product ${name} exceeds available stock.`,
    code: 'INF-009',
  };
}

export const SHIPPING_ADDRESS_EXIST = {
  message: ' Shipping address already exists ',
  code: 'INF-010',
};

export const SHIPPING_ADDRESS_NOT_FOUND = {
  message: ' Shipping address not found ',
  code: 'INF-011',
};
