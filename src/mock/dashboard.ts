export interface StatData {
  title: string
  value: string
  change: number
  prefix?: string
}

export interface ChartDataPoint {
  day: string
  value: number
}

export const dashboardStats: StatData[] = [
  {
    title: "Parking Sessions",
    value: "24.8K",
    change: 32.5,
  },
  {
    title: "Total Revenue",
    value: "$482.5K",
    change: 18,
  },
  {
    title: "Violations Issued",
    value: "1,247",
    change: -6,
  },
]

export const sessionsChartData: ChartDataPoint[] = [
  { day: "01", value: 520 },
  { day: "02", value: 580 },
  { day: "03", value: 640 },
  { day: "04", value: 610 },
  { day: "05", value: 720 },
  { day: "06", value: 850 },
  { day: "07", value: 920 },
  { day: "08", value: 780 },
  { day: "09", value: 690 },
  { day: "10", value: 740 },
  { day: "11", value: 810 },
  { day: "12", value: 870 },
  { day: "13", value: 930 },
  { day: "14", value: 860 },
  { day: "15", value: 780 },
  { day: "16", value: 720 },
  { day: "17", value: 690 },
  { day: "18", value: 750 },
  { day: "19", value: 830 },
  { day: "20", value: 910 },
  { day: "21", value: 960 },
  { day: "22", value: 890 },
  { day: "23", value: 840 },
  { day: "24", value: 770 },
  { day: "25", value: 810 },
  { day: "26", value: 880 },
  { day: "27", value: 950 },
  { day: "28", value: 1020 },
  { day: "29", value: 940 },
  { day: "30", value: 870 },
  { day: "31", value: 920 },
]

export const revenueChartData: ChartDataPoint[] = [
  { day: "01", value: 8200 },
  { day: "02", value: 9100 },
  { day: "03", value: 10400 },
  { day: "04", value: 9800 },
  { day: "05", value: 11200 },
  { day: "06", value: 13500 },
  { day: "07", value: 15200 },
  { day: "08", value: 12800 },
  { day: "09", value: 11000 },
  { day: "10", value: 12100 },
  { day: "11", value: 13200 },
  { day: "12", value: 14100 },
  { day: "13", value: 15500 },
  { day: "14", value: 16200 },
  { day: "15", value: 14800 },
  { day: "16", value: 13200 },
  { day: "17", value: 11900 },
  { day: "18", value: 12400 },
  { day: "19", value: 13800 },
  { day: "20", value: 15100 },
  { day: "21", value: 16400 },
  { day: "22", value: 15200 },
  { day: "23", value: 14300 },
  { day: "24", value: 13100 },
  { day: "25", value: 13900 },
  { day: "26", value: 15200 },
  { day: "27", value: 16800 },
  { day: "28", value: 18200 },
  { day: "29", value: 17100 },
  { day: "30", value: 15600 },
  { day: "31", value: 16400 },
]

export const hostUser = {
  name: "John D.",
  initials: "JD",
  email: "john@parkhub.com",
}
