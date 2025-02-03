"use client"

import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { performanceData, pieData, COLORS } from "@/data"



export default function Home() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <Link href="/dashboard" className="hover:text-white transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white">Overview</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, ERROR!</h1>
          <p className="text-gray-400">Here&apos;s what&apos;s happening with your network</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">View Analytics</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Connections" value="2,543" change="+12.5%" isPositive={true} delay={0.1} />
        <StatsCard title="Profile Views" value="1,234" change="+18.2%" isPositive={true} delay={0.2} />
        <StatsCard title="Messages" value="342" change="-5.1%" isPositive={false} delay={0.3} />
        <StatsCard title="Job Applications" value="28" change="+8.9%" isPositive={true} delay={0.4} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 rounded-lg p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Network Growth</h2>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip contentStyle={{ background: "#000", border: "1px solid rgba(255,255,255,0.1)" }} />
                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Activity Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 rounded-lg p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Network Activity</h2>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#000", border: "1px solid rgba(255,255,255,0.1)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-600" />
                <span className="text-sm text-gray-400">Active Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-700" />
                <span className="text-sm text-gray-400">Inactive Users</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/5 rounded-lg border border-white/10"
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <div className="divide-y divide-white/10">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-6 hover:bg-white/5 transition-colors duration-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-600/10 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">New connection request</h3>
                  <p className="text-sm text-gray-400">Sarah Lee sent you a connection request</p>
                </div>
                <span className="ml-auto text-sm text-gray-500">2h ago</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function StatsCard({
  title,
  value,
  change,
  isPositive,
  delay,
}: {
  title: string
  value: string
  change: string
  isPositive: boolean
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/5 rounded-lg p-6 border border-white/10"
    >
      <h3 className="text-gray-400 font-medium mb-2">{title}</h3>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-semibold">{value}</span>
        <span className={`flex items-center text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
          {change}
        </span>
      </div>
    </motion.div>
  )
}

