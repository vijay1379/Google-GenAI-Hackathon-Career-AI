"use client"

import { useState } from "react"
import { useRequireProfile } from "@/hooks/use-auth-guards"

interface Task {
  id: number
  time: string
  title: string
  type: string
  topic: string
  icon: any
  priority: string
}

type TaskData = {
  [key: string]: Task[]
}
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Calendar, Clock, BookOpen, Code, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Check } from "lucide-react"

export default function SchedulePage() {
  useRequireProfile()
  
  // Format today's date as YYYY-MM-DD for default selection
  const formatDateString = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }
  
  const today = new Date()
  const todayStr = formatDateString(today)
  
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)
  const [completedTasks, setCompletedTasks] = useState<number[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [taskDataState, setTaskDataState] = useState<TaskData>({
    "2025-09-24": [
      {
        id: 30,
        time: "9:00 AM - 10:30 AM",
        title: "Cloud Computing Fundamentals",
        type: "Learning Path",
        topic: "Cloud Development",
        icon: BookOpen,
        priority: "high",
      },
      {
        id: 31,
        time: "11:00 AM - 12:30 PM",
        title: "AWS Services Overview",
        type: "Learning Path",
        topic: "Cloud Development",
        icon: BookOpen,
        priority: "medium",
      },
      {
        id: 32,
        time: "2:00 PM - 3:30 PM",
        title: "Docker Container Practice",
        type: "Practice",
        topic: "DevOps",
        icon: Code,
        priority: "high",
      }
    ],
    "2025-09-20": [
      {
        id: 1,
        time: "9:00 AM - 10:30 AM",
        title: "React Hooks Deep Dive",
        type: "Learning Path",
        topic: "Full Stack Web Development",
        icon: BookOpen,
        priority: "high",
      },
      {
        id: 2,
        time: "11:00 AM - 12:00 PM",
        title: "JavaScript Algorithms Practice",
        type: "Practice",
        topic: "Full Stack Web Development",
        icon: Code,
        priority: "medium",
      },
      {
        id: 3,
        time: "2:00 PM - 3:00 PM",
        title: "Node.js Express Setup",
        type: "Learning Path",
        topic: "Full Stack Web Development",
        icon: BookOpen,
        priority: "high",
      },
    ],
    "2025-09-21": [
      {
        id: 4,
        time: "10:00 AM - 11:30 AM",
        title: "MongoDB Database Design",
        type: "Learning Path",
        topic: "Full Stack Web Development",
        icon: BookOpen,
        priority: "high",
      },
      {
        id: 5,
        time: "1:00 PM - 2:30 PM",
        title: "API Development Practice",
        type: "Practice",
        topic: "Full Stack Web Development",
        icon: Code,
        priority: "medium",
      },
      {
        id: 25,
        time: "3:00 PM - 4:00 PM",
        title: "GraphQL Fundamentals",
        type: "Learning Path",
        topic: "Backend Development",
        icon: BookOpen,
        priority: "low",
      },
    ],
    "2024-01-25": [
      {
        id: 21,
        time: "10:00 AM - 11:00 AM",
        title: "Blockchain Fundamentals",
        type: "Learning Path",
        topic: "Blockchain",
        icon: BookOpen,
        priority: "low",
      },
      {
        id: 22,
        time: "2:00 PM - 3:30 PM",
        title: "Smart Contract Development",
        type: "Practice",
        topic: "Blockchain",
        icon: Code,
        priority: "medium",
      },
    ],
    "2024-01-26": [
      {
        id: 23,
        time: "9:30 AM - 11:00 AM",
        title: "Performance Optimization",
        type: "Learning Path",
        topic: "Web Performance",
        icon: BookOpen,
        priority: "high",
      },
      {
        id: 24,
        time: "1:00 PM - 2:30 PM",
        title: "Code Splitting Techniques",
        type: "Practice",
        topic: "Web Performance",
        icon: Code,
        priority: "medium",
      },
    ],
  })

  const handleTaskComplete = (taskId: number, checked: boolean) => {
    if (checked) {
      setCompletedTasks((prev) => [...prev, taskId])
    } else {
      setCompletedTasks((prev) => prev.filter((id) => id !== taskId))
    }
  }

  const handleAddTask = (task: Task) => {
    if (selectedDate) {
      setTaskDataState((prev) => ({
        ...prev,
        [selectedDate]: [...(prev[selectedDate] || []), { ...task, icon: task.type === "Learning Path" ? BookOpen : Code }],
      }))
    }
  }

  const handleEditTask = (task: Task) => {
    if (selectedDate) {
      setTaskDataState((prev) => ({
        ...prev,
        [selectedDate]: prev[selectedDate].map((t) => (t.id === task.id ? { ...task, icon: task.type === "Learning Path" ? BookOpen : Code } : t)),
      }))
    }
    setSelectedTask(null)
  }

  const handleDeleteTask = () => {
    if (selectedDate && selectedTask) {
      setTaskDataState((prev) => ({
        ...prev,
        [selectedDate]: prev[selectedDate].filter((t) => t.id !== selectedTask.id),
      }))
      setSelectedTask(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const getDisplayTasks = () => {
    const dateToShow = selectedDate || hoveredDate
    if (!dateToShow) return []
    return taskDataState[dateToShow] || []
  }

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`
      const hasTask = taskDataState[dateStr]
      const isCurrentMonth = current.getMonth() === month

      days.push({
        date: new Date(current),
        dateStr,
        hasTask: !!hasTask,
        isCurrentMonth,
        taskCount: hasTask ? hasTask.length : 0,
      })

      current.setDate(current.getDate() + 1)
    }

    return days
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const navigateToToday = () => {
    const today = new Date()
    const todayStr = formatDateString(today)
    setSelectedDate(todayStr)
    setCurrentMonth(today)
  }

  const navigateToTomorrow = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = formatDateString(tomorrow)
    setSelectedDate(tomorrowStr)
    setCurrentMonth(tomorrow)
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Learning Schedule</h1>
          <p className="text-muted-foreground">Manage your learning activities with an interactive calendar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Total Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Object.values(taskDataState).flat().length}</div>
              <p className="text-sm text-muted-foreground">Scheduled activities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Study Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12.5h</div>
              <p className="text-sm text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{completedTasks.length}</div>
              <p className="text-sm text-muted-foreground">Tasks finished</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task List Container */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Learning Activities
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={navigateToToday} className="text-xs">
                    Today
                  </Button>
                  <Button size="sm" variant="ghost" onClick={navigateToTomorrow} className="text-xs">
                    Tomorrow
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center gap-1 bg-transparent"
                    onClick={() => setIsAddTaskOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Add Task
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {getDisplayTasks().length > 0 ? (
                getDisplayTasks().map((task) => (
                  <div
                    key={task.id}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    {/* Tick button - centered vertically */}
                    <div className="flex items-center justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className={`h-10 w-10 p-0 rounded-full border-2 flex-shrink-0 ${
                          completedTasks.includes(task.id) 
                            ? "border-green-500 bg-green-50 text-green-600" 
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onClick={() => handleTaskComplete(task.id, !completedTasks.includes(task.id))}
                      >
                        {completedTasks.includes(task.id) ? <Check className="w-4 h-4" /> : null}
                      </Button>
                    </div>
                    
                    {/* Task content - middle column */}
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2">
                        <task.icon className="w-4 h-4 text-primary" />
                        <span
                          className={`font-medium ${completedTasks.includes(task.id) ? "line-through text-muted-foreground" : ""}`}
                        >
                          {task.title}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {task.type}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(task.priority)} border-current`}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.time}
                        </span>
                        <span>Topic: {task.topic}</span>
                      </div>
                    </div>
                    
                    {/* Actions column */}
                    <div className="flex items-center gap-3">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setSelectedTask(task)
                          setIsEditTaskOpen(true)
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => {
                          setSelectedTask(task)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select or hover over a date to view tasks</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Calendar Container */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => (
                  <div
                    key={index}
                    className={`
                      relative p-2 text-center text-sm cursor-pointer rounded-md transition-all
                      ${!day.isCurrentMonth ? "text-muted-foreground/50" : ""}
                      ${day.hasTask ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-muted"}
                      ${selectedDate === day.dateStr ? "bg-primary text-primary-foreground" : ""}
                    `}
                    onMouseEnter={() => setHoveredDate(day.dateStr)}
                    onMouseLeave={() => setHoveredDate(null)}
                    onClick={() => setSelectedDate(selectedDate === day.dateStr ? null : day.dateStr)}
                  >
                    <span>{day.date.getDate()}</span>
                    {day.hasTask && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full">
                        <span className="sr-only">{day.taskCount} tasks</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-muted-foreground text-center">
                Click a date to pin tasks • Hover to preview
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Task Form Dialog for Add Task */}
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>Fill in the details for your learning task.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const newTask = {
                id: Date.now(),
                title: formData.get("title") as string,
                time: formData.get("time") as string,
                type: formData.get("type") as string,
                topic: formData.get("topic") as string,
                priority: formData.get("priority") as string,
                icon: formData.get("type") === "Learning Path" ? BookOpen : Code
              }
              handleAddTask(newTask as Task)
              setIsAddTaskOpen(false)
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input id="title" name="title" required className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">Time</Label>
                  <Input id="time" name="time" placeholder="e.g. 9:00 AM - 10:30 AM" required className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Type</Label>
                  <Select name="type" defaultValue="Learning Path">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Learning Path">Learning Path</SelectItem>
                      <SelectItem value="Practice">Practice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="topic" className="text-right">Topic</Label>
                  <Input id="topic" name="topic" required className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">Priority</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Task</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Task Form Dialog for Edit Task */}
        <Dialog open={isEditTaskOpen} onOpenChange={(open) => {
          setIsEditTaskOpen(open)
          if (!open) setSelectedTask(null)
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update the details for your learning task.</DialogDescription>
            </DialogHeader>
            {selectedTask && (
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const updatedTask = {
                  ...selectedTask,
                  title: formData.get("title") as string,
                  time: formData.get("time") as string,
                  type: formData.get("type") as string,
                  topic: formData.get("topic") as string,
                  priority: formData.get("priority") as string,
                  icon: formData.get("type") === "Learning Path" ? BookOpen : Code
                }
                handleEditTask(updatedTask as Task)
                setIsEditTaskOpen(false)
              }}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-title" className="text-right">Title</Label>
                    <Input id="edit-title" name="title" defaultValue={selectedTask.title} required className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-time" className="text-right">Time</Label>
                    <Input id="edit-time" name="time" defaultValue={selectedTask.time} required className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-type" className="text-right">Type</Label>
                    <Select name="type" defaultValue={selectedTask.type}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Learning Path">Learning Path</SelectItem>
                        <SelectItem value="Practice">Practice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-topic" className="text-right">Topic</Label>
                    <Input id="edit-topic" name="topic" defaultValue={selectedTask.topic} required className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-priority" className="text-right">Priority</Label>
                    <Select name="priority" defaultValue={selectedTask.priority}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => {
          setIsDeleteDialogOpen(open)
          if (!open) setSelectedTask(null)
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteTask}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  )
}
