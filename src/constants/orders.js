// Order status flow shared by admin and customer views.
export const ORDER_STATUSES = [
  'placed',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

export const STATUS_LABELS = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

// Steps shown in the customer tracking timeline (excludes cancelled).
export const TRACKING_STEPS = ['placed', 'confirmed', 'processing', 'shipped', 'delivered']
