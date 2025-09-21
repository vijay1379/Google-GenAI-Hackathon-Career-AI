"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { useRequireProfile } from "@/hooks/use-auth-guards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Trophy,
  Calendar,
  Users,
  Search,
  MapPin,
  ExternalLink,
  Star,
  Award,
} from "lucide-react"

const mockHackathons = [
  {
    id: 1,
    title: "AI Innovation Challenge 2024",
    organizer: "TechCorp",
    date: "Dec 15-17, 2024",
    location: "San Francisco, CA",
    type: "In-Person",
    prize: "$50,000",
    participants: 1200,
    difficulty: "Advanced",
    tags: ["AI", "Machine Learning", "Innovation"],
    description: "Build the next generation of AI applications that solve real-world problems.",
    status: "Open",
    deadline: "Dec 10, 2024",
  },
  {
    id: 2,
    title: "Web3 Future Hackathon",
    organizer: "BlockchainHub",
    date: "Jan 20-22, 2025",
    location: "Virtual",
    type: "Virtual",
    prize: "$25,000",
    participants: 800,
    difficulty: "Intermediate",
    tags: ["Blockchain", "Web3", "DeFi"],
    description: "Create decentralized applications that shape the future of finance.",
    status: "Open",
    deadline: "Jan 15, 2025",
  },
  {
    id: 3,
    title: "Green Tech Solutions",
    organizer: "EcoTech",
    date: "Feb 5-7, 2025",
    location: "Austin, TX",
    type: "Hybrid",
    prize: "$30,000",
    participants: 600,
    difficulty: "Beginner",
    tags: ["Sustainability", "IoT", "Clean Energy"],
    description: "Develop technology solutions for environmental challenges.",
    status: "Open",
    deadline: "Feb 1, 2025",
  },
  {
    id: 4,
    title: "Mobile App Championship",
    organizer: "AppDev Inc",
    date: "Nov 25-27, 2024",
    location: "New York, NY",
    type: "In-Person",
    prize: "$40,000",
    participants: 1000,
    difficulty: "Intermediate",
    tags: ["Mobile", "React Native", "Flutter"],
    description: "Build innovative mobile applications with cutting-edge features.",
    status: "Closed",
    deadline: "Nov 20, 2024",
  },
]

export default function HackathonsPage() {
  useRequireProfile()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterDifficulty, setFilterDifficulty] = useState("all")

  const filteredHackathons = mockHackathons.filter((hackathon) => {
    const matchesSearch =
      hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hackathon.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = filterType === "all" || hackathon.type.toLowerCase() === filterType.toLowerCase()
    const matchesDifficulty =
      filterDifficulty === "all" || hackathon.difficulty.toLowerCase() === filterDifficulty.toLowerCase()

    return matchesSearch && matchesType && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "advanced":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "Open"
      ? "bg-green-500/10 text-green-500 border-green-500/20"
      : "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Hackathons</h1>
          <p className="text-muted-foreground">Participate in coding competitions and showcase your skills</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Hackathons</CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+3 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prize Pool</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$500K</div>
              <p className="text-xs text-muted-foreground">Across all events</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15.2K</div>
              <p className="text-xs text-muted-foreground">Registered developers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Rank</CardTitle>
              <Star className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#247</div>
              <p className="text-xs text-muted-foreground">Global leaderboard</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search hackathons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Hackathons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHackathons.map((hackathon) => (
            <Card key={hackathon.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{hackathon.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">by {hackathon.organizer}</p>
                  </div>
                  <Badge className={getStatusColor(hackathon.status)}>{hackathon.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{hackathon.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{hackathon.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{hackathon.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span>{hackathon.prize}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{hackathon.participants} participants</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className={getDifficultyColor(hackathon.difficulty)}>{hackathon.difficulty}</Badge>
                  <Badge variant="outline">{hackathon.type}</Badge>
                  {hackathon.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" disabled={hackathon.status === "Closed"}>
                    {hackathon.status === "Open" ? "Register Now" : "Registration Closed"}
                  </Button>
                  <Button variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
