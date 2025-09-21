"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Shield, Palette, Download, Plus, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { profileService, skillsService } from "@/lib/database/services"
import type { Skill } from "@/lib/database/types"

export function SettingsPanel() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    career_goals: '',
    current_year: '',
    college_id: ''
  })
  const [skills, setSkills] = useState<Skill[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const userProfile = await profileService.getProfile(user.id)
      if (userProfile) {
        setProfile({
          name: userProfile.name || '',
          email: user.email || '',
          career_goals: userProfile.career_goals || '',
          current_year: userProfile.current_year || '',
          college_id: userProfile.college_id || ''
        })
      }

      // Load user skills
      const userSkills = await skillsService.getUserSkills(user.id)
      setSkills(userSkills)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    try {
      setSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await profileService.updateProfile(user.id, {
        name: profile.name,
        career_goals: profile.career_goals,
        current_year: profile.current_year,
        college_id: profile.college_id
      })
      
      console.log('Profile updated successfully')
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const addSkill = async () => {
    if (!newSkill.trim()) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const skill = await skillsService.addSkill(user.id, newSkill.trim(), 'beginner')
      if (skill) {
        setSkills([skill, ...skills])
        setNewSkill('')
      }
    } catch (error) {
      console.error('Error adding skill:', error)
    }
  }

  const removeSkill = async (skillId: string) => {
    try {
      await skillsService.deleteSkill(skillId)
      setSkills(skills.filter(skill => skill.id !== skillId))
    } catch (error) {
      console.error('Error removing skill:', error)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">Settings</h1>
        <p className="text-muted-foreground text-pretty">Manage your account preferences and application settings</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="text-2xl">A</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="bg-transparent">
                    Change Photo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentYear">Current Year</Label>
                  <Input 
                    id="currentYear" 
                    value={profile.current_year}
                    onChange={(e) => setProfile({...profile, current_year: e.target.value})}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profile.email}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="careerGoals">Career Goals</Label>
                <Input 
                  id="careerGoals" 
                  value={profile.career_goals}
                  onChange={(e) => setProfile({...profile, career_goals: e.target.value})}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collegeId">College/University</Label>
                <Input 
                  id="collegeId" 
                  value={profile.college_id}
                  onChange={(e) => setProfile({...profile, college_id: e.target.value})}
                  disabled={loading}
                />
              </div>

              {/* Skills Section */}
              <div className="space-y-4">
                <Label>Skills</Label>
                
                {/* Add New Skill */}
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter a skill (e.g., React, Python, etc.)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    className="flex-1"
                  />
                  <Button onClick={addSkill} size="icon" disabled={!newSkill.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Skills List */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill.id} variant="secondary" className="flex items-center gap-1 pr-1">
                        <span>{skill.skill_name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeSkill(skill.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                {skills.length === 0 && (
                  <p className="text-sm text-muted-foreground">No skills added yet. Add your first skill above!</p>
                )}
              </div>

              <Button onClick={saveProfile} disabled={saving || loading}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Daily Streak Reminders</p>
                    <p className="text-sm text-muted-foreground">Get reminded to maintain your learning streak</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Course Recommendations</p>
                    <p className="text-sm text-muted-foreground">Receive personalized course suggestions</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mentor Messages</p>
                    <p className="text-sm text-muted-foreground">Notifications for mentor communications</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Achievement Unlocked</p>
                    <p className="text-sm text-muted-foreground">Celebrate when you earn new badges</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Progress Report</p>
                    <p className="text-sm text-muted-foreground">Summary of your weekly learning activities</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Control your privacy settings and data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Profile Visibility</p>
                    <p className="text-sm text-muted-foreground">Make your profile visible to mentors</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Learning Analytics</p>
                    <p className="text-sm text-muted-foreground">Allow collection of learning data for insights</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Online Status</p>
                    <p className="text-sm text-muted-foreground">Let others see when you're active</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-4">Data Management</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Download My Data
                  </Button>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Appearance
              </CardTitle>
              <CardDescription>Customize how the application looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg cursor-pointer hover:bg-muted">
                      <div className="w-full h-20 bg-white border rounded mb-2"></div>
                      <p className="text-sm text-center">Light</p>
                    </div>
                    <div className="p-4 border-2 border-primary rounded-lg cursor-pointer">
                      <div className="w-full h-20 bg-gray-900 rounded mb-2"></div>
                      <p className="text-sm text-center">Dark</p>
                    </div>
                    <div className="p-4 border rounded-lg cursor-pointer hover:bg-muted">
                      <div className="w-full h-20 bg-gradient-to-br from-white to-gray-900 rounded mb-2"></div>
                      <p className="text-sm text-center">System</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Compact Mode</p>
                    <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Animations</p>
                    <p className="text-sm text-muted-foreground">Enable smooth transitions and effects</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
