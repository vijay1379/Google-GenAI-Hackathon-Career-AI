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
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Search,
  Building,
  Users,
  TrendingUp,
  BookmarkPlus,
  ExternalLink,
  Heart,
} from "lucide-react"

const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    remote: "Hybrid",
    salary: "$120,000 - $160,000",
    posted: "2 days ago",
    description: "Join our team to build cutting-edge web applications using React and TypeScript.",
    requirements: ["React", "TypeScript", "Node.js", "5+ years experience"],
    benefits: ["Health Insurance", "401k", "Remote Work", "Stock Options"],
    logo: "/abstract-tech-logo.png",
    saved: false,
    applied: false,
    match: 92,
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "DataFlow Analytics",
    location: "New York, NY",
    type: "Full-time",
    remote: "Remote",
    salary: "$100,000 - $140,000",
    posted: "1 day ago",
    description: "Analyze complex datasets and build machine learning models to drive business insights.",
    requirements: ["Python", "Machine Learning", "SQL", "Statistics", "3+ years experience"],
    benefits: ["Health Insurance", "Flexible Hours", "Learning Budget", "Remote Work"],
    logo: "/data-analytics-logo.png",
    saved: true,
    applied: false,
    match: 88,
  },
  {
    id: 3,
    title: "Cloud Solutions Architect",
    company: "CloudTech Solutions",
    location: "Austin, TX",
    type: "Full-time",
    remote: "On-site",
    salary: "$130,000 - $170,000",
    posted: "3 days ago",
    description: "Design and implement scalable cloud infrastructure solutions for enterprise clients.",
    requirements: ["AWS", "Azure", "Kubernetes", "DevOps", "7+ years experience"],
    benefits: ["Health Insurance", "401k", "Certification Budget", "Bonus"],
    logo: "/cloud-solutions-company-logo.jpg",
    saved: false,
    applied: true,
    match: 85,
  },
  {
    id: 4,
    title: "Full-Stack Developer",
    company: "StartupXYZ",
    location: "Seattle, WA",
    type: "Full-time",
    remote: "Remote",
    salary: "$90,000 - $120,000",
    posted: "5 days ago",
    description: "Build and maintain web applications from frontend to backend in a fast-paced startup environment.",
    requirements: ["JavaScript", "React", "Node.js", "MongoDB", "2+ years experience"],
    benefits: ["Equity", "Health Insurance", "Flexible PTO", "Remote Work"],
    logo: "/startup-logo.png",
    saved: false,
    applied: false,
    match: 78,
  },
  {
    id: 5,
    title: "UX/UI Designer",
    company: "Design Studio Pro",
    location: "Los Angeles, CA",
    type: "Contract",
    remote: "Hybrid",
    salary: "$80 - $120 /hour",
    posted: "1 week ago",
    description: "Create intuitive and beautiful user experiences for mobile and web applications.",
    requirements: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "4+ years experience"],
    benefits: ["Flexible Schedule", "Creative Freedom", "Portfolio Projects"],
    logo: "/design-studio-logo.png",
    saved: true,
    applied: false,
    match: 82,
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "Infrastructure Inc.",
    location: "Denver, CO",
    type: "Full-time",
    remote: "Remote",
    salary: "$110,000 - $150,000",
    posted: "4 days ago",
    description: "Manage CI/CD pipelines and cloud infrastructure to ensure reliable software delivery.",
    requirements: ["Docker", "Kubernetes", "Jenkins", "AWS", "Linux", "5+ years experience"],
    benefits: ["Health Insurance", "401k", "Remote Work", "On-call Bonus"],
    logo: "/infrastructure-company-logo.png",
    saved: false,
    applied: false,
    match: 90,
  },
]

export default function JobsPage() {
  useRequireProfile()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLocation, setFilterLocation] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterRemote, setFilterRemote] = useState("all")
  const [showSavedOnly, setShowSavedOnly] = useState(false)

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requirements.some((req) => req.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesLocation =
      filterLocation === "all" || job.location.toLowerCase().includes(filterLocation.toLowerCase())
    const matchesType = filterType === "all" || job.type.toLowerCase() === filterType.toLowerCase()
    const matchesRemote = filterRemote === "all" || job.remote.toLowerCase() === filterRemote.toLowerCase()
    const matchesSaved = !showSavedOnly || job.saved

    return matchesSearch && matchesLocation && matchesType && matchesRemote && matchesSaved
  })

  const getMatchColor = (match: number) => {
    if (match >= 90) return "bg-green-500/10 text-green-500 border-green-500/20"
    if (match >= 80) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    return "bg-red-500/10 text-red-500 border-red-500/20"
  }

  const savedJobs = mockJobs.filter((job) => job.saved)
  const appliedJobs = mockJobs.filter((job) => job.applied)

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Job Search</h1>
          <p className="text-muted-foreground">
            Find your next career opportunity with personalized job recommendations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">+127 new this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appliedJobs.length}</div>
              <p className="text-xs text-muted-foreground">Pending responses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
              <Heart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{savedJobs.length}</div>
              <p className="text-xs text-muted-foreground">In your watchlist</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">This month</p>
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
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="san francisco">San Francisco</SelectItem>
                  <SelectItem value="new york">New York</SelectItem>
                  <SelectItem value="austin">Austin</SelectItem>
                  <SelectItem value="seattle">Seattle</SelectItem>
                  <SelectItem value="los angeles">Los Angeles</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRemote} onValueChange={setFilterRemote}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Work Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Styles</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="on-site">On-site</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={showSavedOnly ? "default" : "outline"}
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className="w-full md:w-auto"
              >
                Saved Jobs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={job.logo || "/placeholder.svg"}
                      alt={`${job.company} logo`}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building className="h-4 w-4" />
                          <span>{job.company}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getMatchColor(job.match)}>{job.match}% match</Badge>
                        {job.applied && (
                          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Applied</Badge>
                        )}
                        {job.saved && (
                          <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">Saved</Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-muted-foreground">{job.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{job.location}</span>
                        <Badge variant="outline" className="text-xs">
                          {job.remote}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span>{job.salary}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Requirements: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {job.requirements.map((req) => (
                            <Badge key={req} variant="secondary" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Benefits: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {job.benefits.map((benefit) => (
                            <Badge key={benefit} variant="outline" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-muted-foreground">Posted {job.posted}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <BookmarkPlus className="h-4 w-4 mr-2" />
                          {job.saved ? "Saved" : "Save"}
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" disabled={job.applied}>
                          {job.applied ? "Applied" : "Apply Now"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
