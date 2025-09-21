"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { useRequireProfile } from "@/hooks/use-auth-guards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Calendar,
  Clock,
  DollarSign,
  BookOpen,
  Gift,
  ExternalLink,
  Star,
  MapPin,
  Search,
} from "lucide-react"

interface Course {
  id: string
  title: string
  icon?: string
  description: string
  benefitType: "Free" | "Free + Discount" | "Free Credit" | "Student Discount"
  discount?: string | null
  freeDuration?: string
  creditAmount?: string
  validity: string
  link: string
  tag: string
  availability: string
}

// Mock courses data with student discounts
const mockCourses: Course[] = [
  {
    id: "benefit1",
    title: "GitHub Pro",
    icon: "github-pro-icon.png",
    description: "Full GitHub Pro plan for free while you are a verified student.",
    benefitType: "Free",
    discount: null,
    validity: "As long as student status persists",
    link: "https://education.github.com/pack",
    tag: "Version Control",
    availability: "Worldwide"
  },
  {
    id: "benefit2",
    title: "Educative – 6 months free + 30% off",
    icon: "educative-icon.png",
    description: "Access to over 70 practical courses free for 6 months, plus get 30% off any subscription plan afterwards.",
    benefitType: "Free + Discount",
    discount: "30%",
    freeDuration: "6 months",
    validity: "Subject to student verification",
    link: "https://www.educative.io/github-students",
    tag: "Learning & Courses",
    availability: "Worldwide"
  },
  {
    id: "benefit3",
    title: "Heroku – Platform Credits",
    icon: "heroku-icon.png",
    description: "Receive USD $13/month in platform credits for 24 months (total $312) for Heroku products (dynos, Postgres, etc.).",
    benefitType: "Free Credit",
    discount: null,
    creditAmount: "$312 over 24 months",
    validity: "For students age 18+ with GitHub Student Pack",
    link: "https://www.heroku.com/github-students",
    tag: "Cloud Hosting",
    availability: "Regions where Heroku supports Student Pack offers"
  },
  {
    id: "benefit4",
    title: "1Password – Free Year + Discount",
    icon: "1password-icon.png",
    description: "Get one year of 1Password free. After that, students may claim a **50% discount** on renewal.",
    benefitType: "Free + Discount",
    discount: "50% after free year",
    freeDuration: "1 year",
    validity: "One-time free; discount only while student",
    link: "https://1password.com/developers/students",
    tag: "Security & Productivity",
    availability: "Worldwide"
  },
  {
    id: "benefit5",
    title: "GitKraken – Student Plan (Free + Discount)",
    icon: "gitkraken-icon.png",
    description: "GitKraken Student plan free for first 6 months; after that lowest student-pricing (approx 75-80% off) while still verified.",
    benefitType: "Free + Discount",
    discount: "≈ 75-80% off after 6 months",
    freeDuration: "6 months",
    validity: "While student status remains verified",
    link: "https://www.gitkraken.com/github-student-developer-pack-bundle",
    tag: "Version Control / Dev Tools",
    availability: "Worldwide"
  }
]

export default function ResourcesPage() {
  useRequireProfile()
  
  const [courses] = useState<Course[]>(mockCourses)
  const [hasCollegeEmail, setHasCollegeEmail] = useState<string>("")
  const [tempCollegeEmail, setTempCollegeEmail] = useState<string>("")
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [hasCheckedEligibility, setHasCheckedEligibility] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  const getTypeColor = (benefitType: string) => {
    switch (benefitType) {
      case "Free":
        return "bg-green-500 text-white"
      case "Free + Discount":
        return "bg-blue-500 text-white"
      case "Free Credit":
        return "bg-purple-500 text-white"
      case "Student Discount":
        return "bg-orange-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStudentDiscountCourses = () => {
    if (hasCollegeEmail === "yes") {
      return courses
    } else {
      return courses.filter((course) => course.benefitType === "Free")
    }
  }

  const filteredCourses = getStudentDiscountCourses().filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tag.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || course.benefitType.toLowerCase() === filterType.toLowerCase()
    const matchesCategory = filterCategory === "all" || course.tag.toLowerCase().includes(filterCategory.toLowerCase())

    return matchesSearch && matchesType && matchesCategory
  })

  // Get unique benefit types and categories from the data
  const availableBenefitTypes = [...new Set(getStudentDiscountCourses().map(course => course.benefitType))]
  const availableCategories = [...new Set(getStudentDiscountCourses().map(course => course.tag))]

  const getRequirementBadge = (benefitType: string) => {
    if (benefitType === "Free") {
      return { text: "No Requirements", color: "bg-green-100 text-green-800 border-green-200" }
    } else {
      return { text: "Student Email Required", color: "bg-blue-100 text-blue-800 border-blue-200" }
    }
  }

  const handleOpenDialog = () => {
    setTempCollegeEmail(hasCollegeEmail)
    setShowEmailDialog(true)
  }

  const renderCourseCard = (course: Course) => {
    const requirementBadge = getRequirementBadge(course.benefitType)
    
    return (
      <Card key={course.id} className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{course.tag}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Badge className={getTypeColor(course.benefitType)}>{course.benefitType}</Badge>
              <Badge variant="outline" className={`text-xs ${requirementBadge.color}`}>
                {requirementBadge.text}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{course.description}</p>

          <div className="grid grid-cols-1 gap-4 text-sm">
            {course.freeDuration && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Free for: {course.freeDuration}</span>
              </div>
            )}
            {course.creditAmount && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>Credits: {course.creditAmount}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{course.availability}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{course.validity}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {course.discount && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                {course.discount} off
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              {course.tag}
            </Badge>
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="flex-1" asChild>
              <a href={course.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Get Benefit
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Student Resources</h1>
          <p className="text-muted-foreground">
            Access exclusive student discounts and free learning resources to boost your career.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Student Discounts & Free Resources</h3>
                <p className="text-sm text-muted-foreground">
                  Access exclusive student discounts and free learning resources.
                </p>
              </div>
              <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={handleOpenDialog}>
                    <Gift className="w-4 h-4 mr-2" />
                    Check Eligibility
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Student Discount Eligibility</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base">Do you have a college/university email address?</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Many platforms offer exclusive discounts for students with .edu email addresses.
                      </p>
                      <RadioGroup value={tempCollegeEmail} onValueChange={setTempCollegeEmail}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="yes" />
                          <Label htmlFor="yes">Yes, I have a college email</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="no" />
                          <Label htmlFor="no">No, I don't have a college email</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <Button 
                      onClick={() => {
                        setHasCollegeEmail(tempCollegeEmail)
                        setShowEmailDialog(false)
                        setHasCheckedEligibility(true)
                      }} 
                      className="w-full"
                      disabled={!tempCollegeEmail}
                    >
                      Update Resource Recommendations
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {hasCollegeEmail === "no" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Free Learning Resources</h4>
                    <p className="text-sm text-blue-700">
                      Don't worry! We've curated excellent free resources and tools that don't require student
                      verification.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {hasCollegeEmail === "yes" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Gift className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">Student Discounts Available!</h4>
                    <p className="text-sm text-green-700">
                      Great! You're eligible for exclusive student discounts and free access to premium resources.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {hasCheckedEligibility && (
          <>
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search resources..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Benefit Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {availableBenefitTypes.map(type => (
                        <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {availableCategories.map(category => (
                        <SelectItem key={category} value={category.toLowerCase()}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="font-medium">Available Benefits</span>
                  </div>
                  <div className="text-2xl font-bold">{filteredCourses.length}</div>
                  <p className="text-sm text-muted-foreground">Student opportunities</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-5 h-5 text-primary" />
                    <span className="font-medium">Free Benefits</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {filteredCourses.filter((c) => c.benefitType === "Free").length}
                  </div>
                  <p className="text-sm text-muted-foreground">No cost required</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-primary" />
                    <span className="font-medium">Categories</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {[...new Set(filteredCourses.map(course => course.tag))].length}
                  </div>
                  <p className="text-sm text-muted-foreground">Different types</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map(renderCourseCard)}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}