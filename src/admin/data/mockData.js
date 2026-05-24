export const GOVERNORATES = ["Irbid", "Ajloun", "Jerash", "Balqa", "Amman", "Mafraq", "Karak", "Tafileh"];



export const dailyOrderData = [
  ["Friday", 17], ["Thursday", 22], ["Wednesday", 14], ["Tuesday", 19], ["Monday", 11], ["Sunday", 15], ["Saturday", 12]
];

export const activityFeed = [
  { dot: "za-dot-green", text: "New product entry added for Al Rawabi Farm", meta: "10 mins ago" },
  { dot: "za-dot-blue", text: "New incoming order ZA-1081 pending approval", meta: "25 mins ago" },
  { dot: "za-dot-amber", text: "Logistics status update for order ZA-1079", meta: "1 hour ago" }
];

export const weeklyData = [["Week 1", 68], ["Week 2", 74], ["Week 3", 82], ["Week 4", 88]];

export const farmData = [
  ["Al Rawabi Farm", 88],
  ["Jabal Ajloun Farm", 65],
  ["Beit Ras Farm", 42],
  ["Zait Balqa Farm", 30],
  ["Green Jerash Farm", 27],
  ["Zahr Al Roman Farm", 21],
  ["Wadi Al Rayyan Farm", 18],
  ["Ghosn Al Zaiton Farm", 15]
];

export const sizeData = [
  ["5L Tin", 95],
  ["2L Bottle", 70],
  ["10L Box", 55],
  ["3L Tin", 30],
  ["4L Can", 22]
];

export const trackingData = [
  { batchId: "B-2401", farm: "Al Rawabi Farm", stage: "Bottling and Sealing", updatedBy: "Ahmad Khalil", time: "2026-05-22 11:00", status: "Delivered" },
  { batchId: "B-2402", farm: "Jabal Ajloun Farm", stage: "Cold Pressing Stage", updatedBy: "Mustafa Qudah", time: "2026-05-21 14:30", status: "Processing" },
  { batchId: "B-2403", farm: "Beit Ras Farm", stage: "Olive Harvesting Process", updatedBy: "Khaled Hamouri", time: "2026-05-20 09:15", status: "Pending" }
];



export const notificationsData = [
  { user: "System Broadcast", time: "2026-05-22 08:30", msg: "Platform pricing tables updated for 2026 harvest cycles.", type: "General", read: true },
  { user: "Ahmad Khalil", time: "2026-05-21 17:15", msg: "Batch B-2401 has cleared all internal quality control checks.", type: "Order update", read: false }
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
  dashboard: "Dashboard Overview",
  analytics: "Data Analytics",
  farms: "Farm Owners Management",
  products: "Products Inventory",
  orders: "Orders Ledger",
  tracking: "Batch Tracking",
  notifications: "System Notifications",
  users: "Customer Registry",
  reviews: "Customer Feedbacks & Reviews",
};