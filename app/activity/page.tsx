"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { useRequireProfile } from "@/hooks/use-auth-guards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Github,
  Linkedin,
  ExternalLink,
  GitBranch,
  Star,
  Users,
  MessageSquare,
  Heart,
  Share2,
  Eye,
  Code,
} from "lucide-react"

export default function ActivityPage() {
  useRequireProfile()
  
  const [githubStats, setGithubStats] = useState({
    commits: 23,
    repositories: 8,
    stars: 45,
    followers: 12,
    weeklyCommits: [3, 5, 2, 8, 4, 1, 0],
  })

  const [linkedinStats, setLinkedinStats] = useState({
    posts: 5,
    connections: 234,
    profileViews: 89,
    postViews: 1250,
    weeklyEngagement: [12, 18, 25, 31, 22, 15, 8],
  })

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Social Activity</h1>
          <p className="text-muted-foreground">
            Track your GitHub contributions and LinkedIn engagement to build your professional presence.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="github">GitHub</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GitHub Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="w-5 h-5" />
                    GitHub Activity
                  </CardTitle>
                  <CardDescription>Your coding contributions this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{githubStats.commits}</div>
                      <div className="text-xs text-muted-foreground">Commits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{githubStats.repositories}</div>
                      <div className="text-xs text-muted-foreground">Repositories</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Weekly Goal</span>
                      <span>15/20 commits</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View GitHub Profile
                  </Button>
                </CardContent>
              </Card>

              {/* LinkedIn Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Linkedin className="w-5 h-5" />
                    LinkedIn Engagement
                  </CardTitle>
                  <CardDescription>Your professional network activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{linkedinStats.posts}</div>
                      <div className="text-xs text-muted-foreground">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{linkedinStats.connections}</div>
                      <div className="text-xs text-muted-foreground">Connections</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Weekly Goal</span>
                      <span>5/7 posts</span>
                    </div>
                    <Progress value={71} className="h-2" />
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View LinkedIn Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Activity Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
                <CardDescription>Boost your professional presence with these activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Github className="w-4 h-4 text-primary" />
                      <span className="font-medium">GitHub</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Commit to your learning project daily to maintain your streak
                    </p>
                    <Button size="sm" variant="outline">
                      Create Repository
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-primary" />
                      <span className="font-medium">LinkedIn</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Share your learning progress or tech insights to engage your network
                    </p>
                    <Button size="sm" variant="outline">
                      Draft Post
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="github" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-primary" />
                    Commits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{githubStats.commits}</div>
                  <p className="text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    Stars Earned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{githubStats.stars}</div>
                  <p className="text-sm text-muted-foreground">Total stars</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Followers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{githubStats.followers}</div>
                  <p className="text-sm text-muted-foreground">GitHub followers</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Repositories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "react-todo-app", language: "TypeScript", stars: 12, updated: "2 days ago" },
                  { name: "python-data-analysis", language: "Python", stars: 8, updated: "5 days ago" },
                  { name: "portfolio-website", language: "JavaScript", stars: 25, updated: "1 week ago" },
                ].map((repo) => (
                  <div key={repo.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        <span className="font-medium">{repo.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{repo.language}</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {repo.stars}
                        </span>
                        <span>Updated {repo.updated}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="linkedin" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Profile Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{linkedinStats.profileViews}</div>
                  <p className="text-sm text-muted-foreground">This week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Post Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{linkedinStats.postViews}</div>
                  <p className="text-sm text-muted-foreground">Total impressions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Connections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{linkedinStats.connections}</div>
                  <p className="text-sm text-muted-foreground">Professional network</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    content: "Just completed my React certification! Excited to apply these skills in real projects.",
                    engagement: { likes: 23, comments: 5, shares: 2 },
                    date: "2 days ago",
                  },
                  {
                    content:
                      "Sharing my experience with the latest JavaScript frameworks and their impact on web development.",
                    engagement: { likes: 18, comments: 8, shares: 3 },
                    date: "5 days ago",
                  },
                  {
                    content:
                      "Attended an amazing tech meetup on AI and machine learning. Key takeaways in the comments!",
                    engagement: { likes: 31, comments: 12, shares: 7 },
                    date: "1 week ago",
                  },
                ].map((post, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <p className="text-sm">{post.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.engagement.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {post.engagement.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="w-3 h-3" />
                          {post.engagement.shares}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">{post.date}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
