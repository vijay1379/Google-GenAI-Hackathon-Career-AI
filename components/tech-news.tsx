"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Newspaper,
  TrendingUp,
  Search,
  ExternalLink,
  Clock,
  Bookmark,
  Share,
  Filter,
  Zap,
  Code,
  Briefcase,
  Rocket,
} from "lucide-react"

interface NewsArticle {
  id: string
  title: string
  summary: string
  source: string
  author: string
  publishedAt: string
  category: string
  readTime: number
  url: string
  isBookmarked: boolean
  trending: boolean
  image?: string
}

export function TechNews() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>([])

  const newsArticles: NewsArticle[] = [
    {
      id: "1",
      title: "OpenAI Releases GPT-5: Revolutionary Breakthrough in AI Reasoning",
      summary:
        "OpenAI's latest model shows unprecedented capabilities in complex reasoning tasks, potentially transforming software development and problem-solving across industries.",
      source: "TechCrunch",
      author: "Sarah Chen",
      publishedAt: "2024-01-22T10:30:00Z",
      category: "AI/ML",
      readTime: 5,
      url: "#",
      isBookmarked: false,
      trending: true,
    },
    {
      id: "2",
      title: "React 19 Beta Released: New Features for Modern Web Development",
      summary:
        "The latest React beta introduces server components improvements, better concurrent features, and enhanced developer experience tools.",
      source: "React Blog",
      author: "Dan Abramov",
      publishedAt: "2024-01-22T08:15:00Z",
      category: "Web Dev",
      readTime: 7,
      url: "#",
      isBookmarked: true,
      trending: true,
    },
    {
      id: "3",
      title: "Indian Startup Ecosystem Raises $2.8B in Q1 2024",
      summary:
        "Despite global economic challenges, Indian startups continue to attract significant funding, with fintech and edtech leading the charge.",
      source: "Economic Times",
      author: "Rajesh Kumar",
      publishedAt: "2024-01-21T16:45:00Z",
      category: "Startups",
      readTime: 4,
      url: "#",
      isBookmarked: false,
      trending: false,
    },
    {
      id: "4",
      title: "Google Announces Major Updates to Cloud AI Platform",
      summary:
        "New machine learning tools and infrastructure improvements aim to make AI development more accessible to developers worldwide.",
      source: "Google Cloud Blog",
      author: "Sundar Pichai",
      publishedAt: "2024-01-21T14:20:00Z",
      category: "Cloud",
      readTime: 6,
      url: "#",
      isBookmarked: false,
      trending: false,
    },
    {
      id: "5",
      title: "Remote Work Trends: How Tech Companies Are Adapting in 2024",
      summary:
        "Analysis of remote work policies across major tech companies and their impact on hiring, productivity, and company culture.",
      source: "Harvard Business Review",
      author: "Emily Rodriguez",
      publishedAt: "2024-01-21T11:30:00Z",
      category: "Career",
      readTime: 8,
      url: "#",
      isBookmarked: true,
      trending: false,
    },
    {
      id: "6",
      title: "Cybersecurity Alert: New Vulnerabilities in Popular JavaScript Libraries",
      summary:
        "Security researchers discover critical vulnerabilities affecting millions of web applications. Immediate updates recommended.",
      source: "Security Week",
      author: "Alex Thompson",
      publishedAt: "2024-01-20T20:15:00Z",
      category: "Security",
      readTime: 3,
      url: "#",
      isBookmarked: false,
      trending: false,
    },
  ]

  const categories = ["All", "AI/ML", "Web Dev", "Startups", "Cloud", "Career", "Security"]

  const toggleBookmark = (articleId: string) => {
    setBookmarkedArticles((prev) =>
      prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId],
    )
  }

  const filteredArticles = newsArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeTab === "all" || article.category.toLowerCase() === activeTab.toLowerCase()
    const matchesBookmark =
      activeTab !== "bookmarked" || bookmarkedArticles.includes(article.id) || article.isBookmarked
    return matchesSearch && matchesCategory && matchesBookmark
  })

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "ai/ml":
        return <Zap className="w-4 h-4" />
      case "web dev":
        return <Code className="w-4 h-4" />
      case "startups":
        return <Rocket className="w-4 h-4" />
      case "career":
        return <Briefcase className="w-4 h-4" />
      default:
        return <Newspaper className="w-4 h-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Tech News</h1>
          <p className="text-muted-foreground text-pretty">
            Stay updated with the latest in technology, startups, and career insights
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="bg-transparent">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Trending Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Trending Now
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newsArticles
              .filter((article) => article.trending)
              .slice(0, 2)
              .map((article) => (
                <div
                  key={article.id}
                  className="flex gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2">{article.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(article.publishedAt)}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    Trending
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* News Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category.toLowerCase()}>
              {category}
            </TabsTrigger>
          ))}
          <TabsTrigger value="bookmarked">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No articles found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getCategoryIcon(article.category)}
                          <Badge variant="outline">{article.category}</Badge>
                          {article.trending && (
                            <Badge variant="secondary" className="bg-primary text-primary-foreground">
                              Trending
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg line-clamp-2 mb-2">{article.title}</CardTitle>
                        <CardDescription className="line-clamp-3">{article.summary}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleBookmark(article.id)}
                        className="flex-shrink-0"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            bookmarkedArticles.includes(article.id) || article.isBookmarked
                              ? "fill-primary text-primary"
                              : ""
                          }`}
                        />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">{article.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{article.author}</span>
                      </div>
                      <span>•</span>
                      <span>{article.source}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime} min read</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{formatTimeAgo(article.publishedAt)}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Share className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Read More
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
