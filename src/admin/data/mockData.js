export const GOVERNORATES = [
  "Amman",
  "Irbid",
  "Zarqa",
  "Balqa",
  "Mafraq",
  "Jerash",
  "Ajloun",
  "Madaba",
  "Karak",
  "Tafileh",
  "Ma'an",
  "Aqaba",
];

export const dailyOrderData = [
  ["Friday", 17], ["Thursday", 22], ["Wednesday", 14], ["Tuesday", 19], ["Monday", 11], ["Sunday", 15], ["Saturday", 12]
];

export const activityFeed = [
  { dot: "za-dot-green", text: "New product entry added for Al Rawabi Farm", meta: "10 mins ago" },
  { dot: "za-dot-blue", text: "New incoming order ZA-1081 pending approval", meta: "25 mins ago" },
  { dot: "za-dot-amber", text: "Logistics status update for order ZA-1079", meta: "1 hour ago" }
];

export const navItems = [
  {
    section: "Overview",
    items: [
      { id: "dashboard", icon: "bi-grid-1x2", label: "Dashboard" },
      { id: "analytics", icon: "bi-bar-chart-line", label: "Analytics" },
    ],
  },
  {
    section: "Management",
    items: [
      { id: "farms", icon: "bi-tree", label: "Farm Owners" },
      { id: "products", icon: "bi-droplet-half", label: "Products" },
      { id: "orders", icon: "bi-bag-check", label: "Orders" },
      { id: "tracking", icon: "bi-geo-alt", label: "Tracking" },
    ],
  },
  {
    section: "System",
    items: [
      { id: "notifications", icon: "bi-bell", label: "Notifications" },
      { id: "users", icon: "bi-people", label: "Customers" },
      { id: "reviews", icon: "bi-chat-left-text", label: "Feedbacks" },
    ],
  },
];

export const sectionTitles = {
  dashboard:     "Dashboard Overview",
  analytics:     "Data Analytics",
  farms:         "Farm Owners Management",
  products:      "Products Inventory",
  orders:        "Orders Ledger",
  tracking:      "Batch Tracking",
  notifications: "System Notifications",
  users:         "Customer Registry",
  reviews:       "Customer Feedbacks & Reviews",
};