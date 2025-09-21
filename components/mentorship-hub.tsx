"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Search,
  MessageCircle,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Heart,
  Clock,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Mentor {
  id: string
  name: string
  title: string
  company: string
  location: string
  experience: number
  rating: number
  totalMentees: number
  skills: string[]
  bio: string
  availability: "Available" | "Busy" | "Unavailable"
  responseTime: string
  isAlumni: boolean
  university?: string
  graduationYear?: number
  profileImage?: string
  hourlyRate?: number
  isFavorite: boolean
}

interface MentorshipRequest {
  id: string
  mentorName: string
  status: "pending" | "accepted" | "completed" | "declined"
  requestDate: string
  topic: string
  duration: string
}

export function MentorshipHub() {
  const [activeTab, setActiveTab] = useState("browse")
  const [searchQuery, setSearchQuery] = useState("")
  const [skillFilter, setSkillFilter] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [favorites, setFavorites] = useState<string[]>([])

  const mentors: Mentor[] = [
    {
      id: "1",
      name: "Priya Sharma",
      title: "Senior Software Engineer",
      company: "Google",
      location: "Bangalore, India",
      experience: 6,
      rating: 4.9,
      totalMentees: 45,
      skills: ["React", "Node.js", "System Design", "Leadership"],
      bio: "Passionate about helping junior developers grow their careers. Specialized in full-stack development and system architecture.",
      availability: "Available",
      responseTime: "< 2 hours",
      isAlumni: true,
      university: "IIT Delhi",
      graduationYear: 2018,
      hourlyRate: 2500,
      isFavorite: false,
    },
    {
      id: "2",
      name: "Rahul Gupta",
      title: "Principal Engineer",
      company: "Microsoft",
      location: "Hyderabad, India",
      experience: 8,
      rating: 4.8,
      totalMentees: 62,
      skills: ["Python", "Machine Learning", "Data Science", "Azure"],
      bio: "ML engineer with expertise in building scalable AI systems. Love mentoring students interested in AI/ML careers.",
      availability: "Busy",
      responseTime: "< 1 day",
      isAlumni: true,
      university: "BITS Pilani",
      graduationYear: 2016,
      hourlyRate: 3000,
      isFavorite: true,
    },
    {
      id: "3",
      name: "Anita Desai",
      title: "Product Manager",
      company: "Flipkart",
      location: "Mumbai, India",
      experience: 5,
      rating: 4.7,
      totalMentees: 38,
      skills: ["Product Strategy", "User Research", "Analytics", "Leadership"],
      bio: "Product manager helping students transition from engineering to product roles. Focus on user-centric product development.",
      availability: "Available",
      responseTime: "< 4 hours",
      isAlumni: false,
      hourlyRate: 2000,
      isFavorite: false,
    },
    {
      id: "4",
      name: "Vikram Singh",
      title: "DevOps Architect",
      company: "Amazon",
      location: "Chennai, India",
      experience: 7,
      rating: 4.9,
      totalMentees: 29,
      skills: ["AWS", "Kubernetes", "CI/CD", "Infrastructure"],
      bio: "DevOps expert helping students understand cloud infrastructure and deployment strategies. AWS certified solutions architect.",
      availability: "Available",
      responseTime: "< 3 hours",
      isAlumni: true,
      university: "NIT Trichy",
      graduationYear: 2017,
      hourlyRate: 2800,
      isFavorite: false,
    },
    {
      id: "5",
      name: "Sneha Patel",
      title: "UX Design Lead",
      company: "Zomato",
      location: "Delhi, India",
      experience: 4,
      rating: 4.6,
      totalMentees: 33,
      skills: ["UI/UX Design", "Figma", "User Research", "Design Systems"],
      bio: "Design leader passionate about creating intuitive user experiences. Helping students build strong design portfolios.",
      availability: "Unavailable",
      responseTime: "< 1 week",
      isAlumni: false,
      hourlyRate: 1800,
      isFavorite: true,
    },
  ]

  const mentorshipRequests: MentorshipRequest[] = [
    {
      id: "1",
      mentorName: "Priya Sharma",
      status: "accepted",
      requestDate: "2024-01-20",
      topic: "Career Transition to Full-Stack Development",
      duration: "1 hour",
    },
    {
      id: "2",
      mentorName: "Rahul Gupta",
      status: "pending",
      requestDate: "2024-01-22",
      topic: "Machine Learning Project Guidance",
      duration: "45 minutes",
    },
    {
      id: "3",
      mentorName: "Vikram Singh",
      status: "completed",
      requestDate: "2024-01-15",
      topic: "AWS Certification Preparation",
      duration: "1.5 hours",
    },
  ]

  const toggleFavorite = (mentorId: string) => {
    setFavorites((prev) => (prev.includes(mentorId) ? prev.filter((id) => id !== mentorId) : [...prev, mentorId]))
  }

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      mentor.company.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSkill =
      skillFilter === "all" || mentor.skills.some((skill) => skill.toLowerCase().includes(skillFilter.toLowerCase()))

    const matchesAvailability = availabilityFilter === "all" || mentor.availability.toLowerCase() === availabilityFilter

    return matchesSearch && matchesSkill && matchesAvailability
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
      case "declined":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
      case "Busy":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
      case "Unavailable":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Mentorship Hub</h1>
          <p className="text-muted-foreground text-pretty">
            Connect with experienced professionals and alumni to accelerate your career growth
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Mentors</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mentors.filter((m) => m.availability === "Available").length}</div>
              <p className="text-xs text-muted-foreground">Ready to help</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <MessageCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mentorshipRequests.filter((r) => r.status === "accepted").length}
              </div>
              <p className="text-xs text-muted-foreground">Ongoing mentorships</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alumni Mentors</CardTitle>
              <GraduationCap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mentors.filter((m) => m.isAlumni).length}</div>
              <p className="text-xs text-muted-foreground">From your network</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">Mentor satisfaction</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Mentors</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        {/* Browse Mentors Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search mentors by name, skills, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={skillFilter} onValueChange={setSkillFilter}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Filter by skill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skills</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="machine learning">Machine Learning</SelectItem>
                    <SelectItem value="product">Product Management</SelectItem>
                    <SelectItem value="design">UI/UX Design</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Filter by availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Availability</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMentors.map((mentor) => (
              <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={mentor.profileImage || "/placeholder.svg"} />
                        <AvatarFallback className="text-lg">{mentor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{mentor.name}</CardTitle>
                          {mentor.isAlumni && (
                            <Badge variant="secondary" className="bg-primary text-primary-foreground">
                              Alumni
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{mentor.title}</p>
                        <p className="text-sm font-medium">{mentor.company}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{mentor.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            <span>{mentor.experience} years</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => toggleFavorite(mentor.id)}>
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.includes(mentor.id) || mentor.isFavorite ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{mentor.bio}</p>

                  <div className="flex flex-wrap gap-2">
                    {mentor.skills.slice(0, 4).map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.skills.length > 4 && <Badge variant="outline">+{mentor.skills.length - 4} more</Badge>}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{mentor.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{mentor.totalMentees} mentees</span>
                      </div>
                    </div>
                    <Badge className={getAvailabilityColor(mentor.availability)}>{mentor.availability}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Responds {mentor.responseTime}</span>
                      </div>
                      {mentor.hourlyRate && <p className="mt-1">₹{mentor.hourlyRate}/hour</p>}
                    </div>
                    <Button size="sm" disabled={mentor.availability === "Unavailable"}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mentorship Requests</CardTitle>
              <CardDescription>Track your mentorship requests and sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mentorshipRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex-1">
                      <h4 className="font-medium">{request.topic}</h4>
                      <p className="text-sm text-muted-foreground">with {request.mentorName}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(request.requestDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{request.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                      {request.status === "accepted" && (
                        <Button size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Join Session
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Mentors</CardTitle>
              <CardDescription>Your saved mentors for quick access</CardDescription>
            </CardHeader>
            <CardContent>
              {mentors.filter((m) => favorites.includes(m.id) || m.isFavorite).length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No favorite mentors yet. Start browsing to add some!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {mentors
                    .filter((m) => favorites.includes(m.id) || m.isFavorite)
                    .map((mentor) => (
                      <div key={mentor.id} className="flex items-center gap-4 p-4 rounded-lg border">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{mentor.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {mentor.title} at {mentor.company}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" className="bg-transparent">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
