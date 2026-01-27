#!/bin/bash

# This script creates all admin dashboard files automatically
# Run this in your admin-dashboard folder

mkdir -p app

# Create package.json
cat > package.json << 'EOF'
{
  "name": "rizz-assist-admin",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.38.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.292.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.2.0",
    "@types/node": "^20.5.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
EOF

# Create next.config.js
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {}
module.exports = nextConfig
EOF

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {"@/*": ["./*"]}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# Create tailwind.config.ts
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}','./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {extend: {}},
  plugins: [],
}
export default config
EOF

# Create postcss.config.js
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
.next/
.env
.env.local
.DS_Store
*.log
EOF

# Create .env.example
cat > .env.example << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://owkepgkdiiesunwkleur.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
EOF

# Create app/globals.css
cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #000000;
  --foreground: #ffffff;
}

body {
  background: var(--background);
  color: var(--foreground);
}
EOF

# Create app/layout.tsx
cat > app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rizz Assist Admin',
  description: 'Admin dashboard for Rizz Assist Pro',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
EOF

# Create app/page.tsx
cat > app/page.tsx << 'EOF'
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')

interface StatCard {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
}

interface UserData {
  id: string
  email: string
  plan: string
  total_uses: number
  tokens_remaining: number
  created_at: string
}

interface DailyAnalytics {
  date: string
  active_users: number
  total_api_calls: number
  total_cost_usd: number
}

export default function Dashboard() {
  const [users, setUsers] = useState<UserData[]>([])
  const [analytics, setAnalytics] = useState<DailyAnalytics[]>([])
  const [stats, setStats] = useState({totalUsers: 0, totalCost: 0, activeUsers: 0, totalCalls: 0})
  const [loading, setLoading] = useState(true)

  useEffect(() => {loadData()}, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const { data: usersData } = await supabase.from('user_stats').select('*')
      if (usersData) setUsers(usersData)
      const { data: analyticsData } = await supabase.from('daily_analytics').select('*').order('date', { ascending: false }).limit(30)
      if (analyticsData) setAnalytics(analyticsData)
      if (usersData && analyticsData) {
        const totalCost = analyticsData.reduce((sum, day) => sum + (day.total_cost_usd || 0), 0)
        const totalCalls = analyticsData.reduce((sum, day) => sum + (day.total_api_calls || 0), 0)
        const activeUsers = analyticsData[0]?.active_users || 0
        setStats({totalUsers: usersData.length, totalCost, activeUsers, totalCalls})
      }
    } catch (error) {console.error('Error loading data:', error)}
    finally {setLoading(false)}
  }

  const statCards: StatCard[] = [
    {title: 'Total Users', value: stats.totalUsers, icon: <Users className="w-6 h-6" />, color: 'from-blue-500 to-blue-600'},
    {title: 'Monthly Cost (USD)', value: `$${stats.totalCost.toFixed(2)}`, icon: <DollarSign className="w-6 h-6" />, color: 'from-green-500 to-green-600'},
    {title: 'Active Users (Today)', value: stats.activeUsers, icon: <Activity className="w-6 h-6" />, color: 'from-purple-500 to-purple-600'},
    {title: 'Total API Calls', value: stats.totalCalls.toLocaleString(), icon: <TrendingUp className="w-6 h-6" />, color: 'from-pink-500 to-pink-600'},
  ]

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-xl text-white">Loading dashboard...</div></div>

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Rizz Assist Admin</h1>
          <p className="text-gray-400">Manage users, costs, and analytics</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <div key={card.title} className={`bg-gradient-to-br ${card.color} rounded-lg p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{card.title}</p>
                  <p className="text-2xl font-bold mt-2">{card.value}</p>
                </div>
                {card.icon}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Daily Costs</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[...analytics].reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #444' }} />
                <Line type="monotone" dataKey="total_cost_usd" stroke="#ec4899" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Daily API Calls</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #444' }} />
                <Bar dataKey="total_api_calls" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Plan</th>
                  <th className="text-left py-3 px-4">Total Uses</th>
                  <th className="text-left py-3 px-4">Tokens Left</th>
                  <th className="text-left py-3 px-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 20).map((user) => (
                  <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${user.plan === 'gold' ? 'bg-yellow-900 text-yellow-200' : user.plan === 'silver' ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-gray-300'}`}>
                        {user.plan?.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">{user.total_uses}</td>
                    <td className="py-3 px-4">{user.tokens_remaining}</td>
                    <td className="py-3 px-4 text-gray-400">{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
EOF

echo "✅ Admin dashboard files created!"
echo "📦 Now run: npm install && npm run build"
