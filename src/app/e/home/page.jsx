'use client'

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Calendar, CheckSquare, Gift, ShoppingCart } from "lucide-react"
import Navbar from "@/app/navbar/page"
import { useLanguage } from "@/lib/LanguageContext"

const upcomingEvents = [
  { title: 'Math Class', date: 'Monday', time: '10 AM', category: 'School' },
  { title: 'Soccer Practice', date: 'Tuesday', time: '4 PM', category: 'Sports' },
  { title: 'Dentist Appointment', date: 'Wednesday', time: '2 PM', category: 'Health' },
]

const taskData = [
  { name: 'Mon', completed: 4, total: 6 },
  { name: 'Tue', completed: 3, total: 5 },
  { name: 'Wed', completed: 5, total: 5 },
  { name: 'Thu', completed: 2, total: 4 },
  { name: 'Fri', completed: 4, total: 7 },
  { name: 'Sat', completed: 3, total: 3 },
  { name: 'Sun', completed: 1, total: 2 },
]

export default function Dashboard() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <CardTitle>{t.weeklyTaskOverview}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  completed: {
                    label: t.tasksCompleted,
                    color: "hsl(var(--chart-1))",
                  },
                  total: {
                    label: t.weeklyTaskOverview,
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="completed" stackId="a" fill="var(--color-completed)" />
                    <Bar dataKey="total" stackId="a" fill="var(--color-total)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.todaysProgress}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>{t.tasksCompleted}</span>
                    <span>5/8</span>
                  </div>
                  <Progress value={62.5} className="mt-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>{t.studyTime}</span>
                    <span>2h 15m / 3h</span>
                  </div>
                  <Progress value={75} className="mt-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>{t.exercise}</span>
                    <span>30m / 45m</span>
                  </div>
                  <Progress value={66.7} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <CardTitle>{t.upcomingEvents}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <li key={index} className="flex justify-between items-center bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.date}, {event.time}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {event.category}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.quickActions}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center">
                  <CheckSquare className="h-6 w-6 mb-2" />
                  {t.addTask}
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center">
                  <Calendar className="h-6 w-6 mb-2" />
                  {t.scheduleEvent}
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center">
                  <ShoppingCart className="h-6 w-6 mb-2" />
                  {t.shoppingList}
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center">
                  <Gift className="h-6 w-6 mb-2" />
                  {t.rewards}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}