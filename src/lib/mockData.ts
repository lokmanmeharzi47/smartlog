// ==========================================
// Mock Data — Management Reports Dashboard
// ==========================================

export const overviewKPIs = [
  { id: "bags", label: "Bags Collected", value: "32,490", unit: "", trend: 1.2, trendLabel: "today", subLabel: "This month", accent: "default" as const },
  { id: "avg-time", label: "Avg Collection Time", value: "12", unit: "min", subLabel: "Within target", accent: "success" as const },
  { id: "compliance", label: "Compliance Rate", value: "98.7", unit: "%", trend: -0.3, trendLabel: "vs last month", accent: "default" as const },
  { id: "delay", label: "Delay Rate", value: "4.2", unit: "%", trend: 0.8, trendLabel: "from yesterday", accent: "warning" as const },
  { id: "errors", label: "Sorting Errors", value: "12", unit: "items", subLabel: "8 mixed / 4 forgotten", accent: "error" as const },
  { id: "fastest", label: "Fastest Service", value: "12", unit: "min", subLabel: "Emergency Dept. avg", accent: "success" as const },
];

export const volumeData = [
  { label: "Oct 1", value: 1240, secondary: 1400 },
  { label: "Oct 5", value: 1380, secondary: 1400 },
  { label: "Oct 10", value: 1520, secondary: 1400 },
  { label: "Oct 15", value: 1290, secondary: 1400 },
  { label: "Oct 20", value: 1650, secondary: 1400 },
  { label: "Oct 25", value: 1480, secondary: 1400 },
  { label: "Oct 31", value: 1320, secondary: 1400 },
];

export const errorsByType = [
  { label: "Misclassified Waste", value: 28, color: "#1A2B4B" },
  { label: "Missing Labels", value: 19, color: "#4E5E81" },
  { label: "Container Overflow", value: 14, color: "#B6C6EF" },
  { label: "Missed Collection", value: 8, color: "#DADFF1" },
  { label: "Other", value: 5, color: "#E1E3E4" },
];

export const liveActivity = [
  { id: "#BAG-29402", type: "Biohazard - Level 2", location: "Cardiology Wing B", collectedBy: "J. Chen", time: "2 min ago", flagged: false },
  { id: "#BAG-29398", type: "Recyclable Glass", location: "Maternity Ward", collectedBy: "M. Rossi", time: "14 min ago", flagged: false },
  { id: "#BAG-29384", type: "Chemical Waste", location: "Pathology Lab", collectedBy: undefined, time: "28 min ago", flagged: true, flagLabel: "Audit Required" },
  { id: "#BAG-29371", type: "Organic Waste", location: "Oncology West", collectedBy: "A. Popov", time: "41 min ago", flagged: false },
  { id: "#BAG-29360", type: "Sharps", location: "ICU Floor 3", collectedBy: "L. Mbeki", time: "55 min ago", flagged: false },
];

export const criticalAlerts = [
  {
    title: "Operating Room 04",
    description: "High-volume surgical waste pending collection. Threshold exceeded by 15%.",
    severity: "critical" as const,
    location: "Block C, Floor 2",
    time: "5 min ago",
  },
  {
    title: "Radiology South",
    description: "Metallic object detected in organic waste stream. Bin locked automatically.",
    severity: "critical" as const,
    location: "Block A, Floor 1",
    time: "18 min ago",
  },
  {
    title: "Hazardous Storage A2",
    description: "Internal storage temp rising above 8°C. Check ventilation systems.",
    severity: "warning" as const,
    location: "Basement Level",
    time: "32 min ago",
  },
  {
    title: "Waste Compactor Unit 3",
    description: "Scheduled maintenance overdue by 3 days. Performance degraded 12%.",
    severity: "info" as const,
    location: "Service Area B",
    time: "2 hr ago",
  },
];

export const reportKPIs = [
  { label: "Volumes Collected", value: "12,482", unit: "L" },
  { label: "Avg Collection Time", value: "6.4", unit: "min/unit" },
  { label: "Delayed Services", value: "14", trend: -2 },
  { label: "Critical Errors", value: "02", subLabel: "Stable" },
];

export const recentReports = [
  { title: "October 2023 - Full Summary", period: "Oct 01 – Oct 31, 2023", type: "Monthly Performance", status: "ready" as const, size: "2.4 MB", generatedAt: "Nov 1, 2023" },
  { title: "Q3 2023 - Compliance Audit", period: "Jul – Sep 2023", type: "Quarterly Audit", status: "ready" as const, size: "5.1 MB", generatedAt: "Oct 3, 2023" },
  { title: "Radiology Incident Report", period: "Oct 22, 2023", type: "Incident Report", status: "ready" as const, size: "1.1 MB", generatedAt: "Oct 22, 2023" },
  { title: "November 2023 - Draft", period: "Nov 01 – Present", type: "Monthly Performance", status: "draft" as const },
  { title: "Annual Compliance 2023", period: "Jan – Dec 2023", type: "Annual Report", status: "processing" as const },
];

export const recommendations = [
  {
    id: "r1",
    title: "Optimize Route B-4",
    description: "Data indicates a 14% delay pattern on Tuesday mornings. Shifting collection to 05:30 AM could improve throughput by 22%.",
    action: "Apply Change",
    impact: "high" as const,
  },
  {
    id: "r2",
    title: "Staff Training Triggered",
    description: "Errors in \"Misclassified Waste\" have peaked in Radiology. Scheduling a 15-minute refresher for Floor 4 staff is recommended.",
    action: "Schedule Now",
    impact: "high" as const,
  },
  {
    id: "r3",
    title: "Supply Buffer Adjustment",
    description: "Biohazard container utilization is at 94% capacity. Increase secondary storage buffer by 15 units to avoid collection stops.",
    action: "Approve Order",
    impact: "medium" as const,
  },
];

export const capacityZones = [
  { name: "Main Dock", value: 80 },
  { name: "Hazardous A", value: 94 },
  { name: "Organic Bay", value: 51 },
  { name: "Recyclables", value: 37 },
];

export const performanceData = [
  { label: "Emergency", value: 97, target: 95 },
  { label: "ICU", value: 94, target: 95 },
  { label: "Oncology", value: 81, target: 95 },
  { label: "Radiology", value: 88, target: 95 },
  { label: "Maternity", value: 96, target: 95 },
  { label: "Pathology", value: 92, target: 95 },
];

export const trainingData = [
  { department: "Emergency Dept.", staff: 24, trained: 24, rate: 100 },
  { department: "Oncology West", staff: 31, trained: 27, rate: 87 },
  { department: "Radiology South", staff: 18, trained: 14, rate: 78 },
  { department: "Pathology Lab", staff: 12, trained: 12, rate: 100 },
  { department: "ICU Floor 3", staff: 22, trained: 20, rate: 91 },
  { department: "Maternity Ward", staff: 29, trained: 28, rate: 97 },
];
