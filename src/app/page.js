'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from "@/lib/LanguageContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast, Toaster } from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { CheckCircle2, Sun, Moon, Star, RefreshCw, Calendar, Clock, AlertTriangle, Repeat } from 'lucide-react'
import { useRouter } from 'next/navigation'

const FamilyTaskDashboard = () => {
  const { t } = useLanguage()
  const [children, setChildren] = useState([])
  const [tasks, setTasks] = useState({})
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const token = localStorage.getItem('token');
    const router = useRouter();
  
    if (!token) {
      // Redirect to login page if there's no token
      router.push('/login');
    } else {
      fetchChildrenAndTasks();
    }
  }, []);
  

  const fetchChildrenAndTasks = useCallback(async () => {
    setLoading(true)
    try {
      const childrenResponse = await fetch('backendforfamily-production.up.railway.app/api/children', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!childrenResponse.ok) throw new Error('Failed to fetch children')
      const childrenData = await childrenResponse.json()
      setChildren(childrenData)
  
      const tasksPromises = childrenData.map(child =>
        fetch(`backendforfamily-production.up.railway.app/api/child-tasks/${child._id}?timestamp=${Date.now()}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }).then(res => res.json())
      )
      const tasksData = await Promise.all(tasksPromises)
      const tasksObject = childrenData.reduce((acc, child, index) => {
        acc[child._id] = tasksData[index]
        return acc
      }, {})
      setTasks(tasksObject)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(t.errorFetchingData)
    } finally {
      setLoading(false)
    }
  }, [t])
  
  const completeTask = async (childId, taskId) => {
    setLoading(true)
    try {
      const response = await fetch(`backendforfamily-production.up.railway.app/api/child-tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'done' })
      })
  
      if (!response.ok) throw new Error('Failed to complete task')
  
      setTasks(prevTasks => ({
        ...prevTasks,
        [childId]: prevTasks[childId].map(task =>
          task._id === taskId ? { ...task, status: 'done' } : task
        )
      }))
  
      triggerCompletionEffects()
      await updateReward(childId, 10)
      toast.success(t.taskCompletedSuccess)
    } catch (error) {
      console.error("Error completing task:", error)
      toast.error(t.taskCompleteFailed)
    } finally {
      setLoading(false)
    }
  }
  
  const updateReward = async (childId, pointsToAdd) => {
    try {
      const response = await fetch(`backendforfamily-production.up.railway.app/api/children/${childId}/add-points`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ points: pointsToAdd }),
      })
      
      if (!response.ok) throw new Error('Failed to update reward')
      
      const updatedChild = await response.json()
      setChildren(prevChildren => 
        prevChildren.map(child => 
          child._id === childId ? { ...child, points: updatedChild.points } : child
        )
      )
    } catch (error) {
      console.error("Error updating reward:", error)
      toast.error(t.rewardUpdateFailed)
    }
  }

  const triggerCompletionEffects = () => {
    const sound = new Audio('/sound.mp3')
    sound.play()
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }
  
  const getCompletedTasksCount = (childId) => {
    if (tasks[childId]) {
      return tasks[childId].filter(task => task.status === 'done').length
    }
    return 0
  }
  
  const filterTasks = (childId, tab) => {
    if (!tasks[childId]) return []
  
    let filteredTasks = []
  
    switch (tab) {
      case 'morning':
        filteredTasks = tasks[childId].filter(task => task.period === 'morning')
        break
      case 'evening':
        filteredTasks = tasks[childId].filter(task => task.period === 'evening')
        break
      case 'weekly':
        filteredTasks = tasks[childId].filter(task => task.recurrence === 'weekly')
        break
      default:
        filteredTasks = tasks[childId]
    }
  
    return filteredTasks.sort((a, b) => {
      if (a.status === 'done' && b.status !== 'done') {
        return 1
      }
      if (a.status !== 'done' && b.status === 'done') {
        return -1
      }
      return 0
    })
  }

  const getTaskEmoji = (recurrence) => {
    switch (recurrence) {
      case 'daily':
        return '📅'
      case 'weekly':
        return '🗓️'
      case 'monthly':
        return '📆'
      default:
        return '✅'
    }
  }

  const getProgressColor = (progress) => {
    if (progress < 33) return 'bg-red-500'
    if (progress < 66) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 text-white'
      case 'medium':
        return 'bg-yellow-500 text-black'
      case 'low':
        return 'bg-green-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getDaysLeft = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
            {t.familyTaskDashboard}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {children.map((child, index) => (
            <motion.div
              key={child._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden shadow-lg">
                <CardHeader className="pb-3 bg-gradient-to-r from-blue-500 to-purple-500">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="w-20 h-20 border-4 border-white shadow-md">
                        <AvatarImage src={child.profilePicture} alt={child.name} />
                        <AvatarFallback>{child.name[0]}</AvatarFallback>
                      </Avatar>
                      <div 
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `conic-gradient(${getProgressColor((getCompletedTasksCount(child._id) / (tasks[child._id]?.length || 1)) * 100)} ${(getCompletedTasksCount(child._id) / (tasks[child._id]?.length || 1)) * 100}%, transparent 0)`,
                        }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-3xl text-white">{child.name}</CardTitle>
                      <CardDescription>
                        <Badge variant="secondary" className="mt-2 bg-yellow-400 text-gray-900">
                          <Star className="w-4 h-4 mr-1 inline-block" />
                          {child.points} {t.points}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {tasks[child._id] && tasks[child._id].length > 0 ? (
                    <>
                      <Progress 
                        value={(getCompletedTasksCount(child._id) / tasks[child._id].length) * 100} 
                        className="mb-4 h-3"
                      />
                      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {getCompletedTasksCount(child._id)} {t.of} {tasks[child._id].length} {t.tasksCompleted}
                      </p>
                    </>
                  ) : (
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {t.noTasksAvailable}
                    </p>
                  )}

                  <Tabs defaultValue="all" className="w-full">
                    {/* <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                      <TabsTrigger value="all" className="rounded-md" onClick={() => setActiveTab('all')}>{t.all}</TabsTrigger>
                      <TabsTrigger value="morning" className="rounded-md" onClick={() => setActiveTab('morning')}>{t.morning}</TabsTrigger>
                      <TabsTrigger value="evening" className="rounded-md" onClick={() => setActiveTab('evening')}>{t.evening}</TabsTrigger>
                      <TabsTrigger value="weekly" className="rounded-md" onClick={() => setActiveTab('weekly')}>{t.weekly}</TabsTrigger>
                    </TabsList> */}
                    <TabsContent value="all">
                      <AnimatePresence>
                        {filterTasks(child._id, activeTab).map((task, taskIndex) => (
                          <TaskCard 
                            key={task._id} 
                            task={task} 
                            completeTask={() => completeTask(child._id, task._id)}
                            index={taskIndex}
                            t={t}
                            getPriorityColor={getPriorityColor}
                            getDaysLeft={getDaysLeft}
                          />
                        ))}
                      </AnimatePresence>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <Button
            onClick={fetchChildrenAndTasks}
            variant="outline"
            className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t.refresh}
          </Button>
        </motion.div>
      </div>
      
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  )
}

const TaskCard = ({ task, completeTask, index, t, getPriorityColor, getDaysLeft }) => {
  const today = new Date().setHours(0, 0, 0, 0);  // Set to midnight of today for comparison

  const isToday = new Date(task.dueDate).setHours(0, 0, 0, 0) === today; // Check if task is due today
  const isOverdue = getDaysLeft(task.dueDate) < 0; // Check if the task is overdue

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className={`mb-6 overflow-hidden transition-all duration-300 ${task.status === 'done' ? 'bg-green-50 dark:bg-green-900/20' : 'hover:shadow-xl'}`}>
        <CardContent className="p-6 space-y-4">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{getTaskEmoji(task.recurrence)}</span>
              <div>
                <h3 className="text-xl font-semibold">{task.content}</h3>
                <div className="flex items-center space-x-3 mt-1">
                  <Badge variant="outline" className={`text-sm ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </Badge>
                  {task.recurrence !== 'none' && (
                    <Badge variant="outline" className="text-sm bg-blue-100 text-blue-800">
                      <Repeat className="w-3 h-3 mr-1" />
                      {t[task.recurrence]}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {task.recurrence === 'daily' && (
              task.period === 'morning' ? (
                <Sun className="h-8 w-8 text-yellow-500" />
              ) : (
                <Moon className="h-8 w-8 text-blue-500" />
              )
            )}
          </div>

          {/* Due Date Section */}
          {task.dueDate && (
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {task.dueDate && (
  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
    {getDaysLeft(task.dueDate) > 0 ? (
      <span>
        <Clock className="w-4 h-4 inline mr-1 text-blue-500" />
        {getDaysLeft(task.dueDate)} {t.daysLeft} - Task is due soon!
      </span>
    ) : (
      <span>
        <AlertTriangle className="w-4 h-4 inline mr-1 text-red-500" />
        {Math.abs(getDaysLeft(task.dueDate))} {t.daysOverdue} - Task is overdue!
      </span>
    )}
  </div>
)}

            </div>
          )}

          {/* Late Days Section */}
          {task.lateDays > 0 && (
            <div className="text-sm font-medium text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              {t.late}: {task.lateDays} {t.days}
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center mt-4">
            {task.status === 'done' ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center bg-green-500 text-white rounded-full w-16 h-16 shadow-lg"
              >
                <CheckCircle2 className="h-8 w-8" />
              </motion.div>
            ) : (
              <motion.button
                onClick={completeTask}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 flex items-center justify-center shadow-lg"
                aria-label={t.completeTask}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </motion.div>
              </motion.button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};




const getTaskEmoji = (recurrence) => {
  switch (recurrence) {
    case 'daily':
      return '📅'
    case 'weekly':
      return '🗓️'
    case 'monthly':
      return '📆'
    default:
      return '✅'
  }
}

export default FamilyTaskDashboard

