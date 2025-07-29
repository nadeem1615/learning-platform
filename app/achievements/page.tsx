import type React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Award,
  BookOpen,
  Crown,
  Flame,
  Gamepad2,
  LayoutDashboard,
  type LucideIcon,
  Medal,
  Sparkles,
  Target,
  Trophy,
  Users,
} from "lucide-react"
import { getUserStats } from "@/lib/user-service"

export default async function AchievementsPage() {
  const userStats = await getUserStats()

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:flex-row">
        <div className="border-r bg-background p-2 sm:h-screen sm:w-64">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-6 w-6 text-primary" />
              <span>QuizQuest</span>
            </Link>
          </div>
          <nav className="grid gap-1 px-2 pt-4">
            <NavItem icon={LayoutDashboard} href="/" label="Dashboard" />
            <NavItem icon={BookOpen} href="/quizzes" label="Quizzes" />
            <NavItem icon={Gamepad2} href="/challenges" label="Challenges" />
            <NavItem icon={Trophy} href="/achievements" label="Achievements" active />
            <NavItem icon={Users} href="/leaderboard" label="Leaderboard" />
          </nav>
          <div className="absolute bottom-4 left-4 sm:fixed sm:bottom-4 sm:left-4 sm:w-56">
            <UserCard stats={userStats} />
          </div>
        </div>
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
              <p className="text-muted-foreground">Track your progress and earn rewards</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Your Stats</CardTitle>
                      <CardDescription>Your learning journey in numbers</CardDescription>
                    </div>
                    <Button variant="outline">View All Stats</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard icon={Trophy} value="24" label="Achievements" color="text-amber-500" />
                    <StatCard
                      icon={Flame}
                      value={userStats.streak.toString()}
                      label="Day Streak"
                      color="text-orange-500"
                    />
                    <StatCard
                      icon={BookOpen}
                      value={userStats.completedQuizzes.length.toString()}
                      label="Quizzes Completed"
                      color="text-blue-500"
                    />
                    <StatCard icon={Crown} value={userStats.xp.toString()} label="Total XP" color="text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Level Progress</CardTitle>
                  <CardDescription>Level {userStats.level} - Adventurer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center space-y-4 py-4">
                    <div className="relative">
                      <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-primary/20">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                          {userStats.level}
                        </div>
                      </div>
                      <div className="absolute -right-2 -top-2 rounded-full bg-primary p-1.5">
                        <Crown className="h-5 w-5 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2 text-center">
                      <div className="text-sm text-muted-foreground">450 XP to Level {userStats.level + 1}</div>
                      <Progress value={65} className="h-2 w-48" />
                      <div className="text-xs text-muted-foreground">
                        {userStats.xp} / {userStats.xp + 450} XP
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <Tabs defaultValue="all">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="all">All Achievements</TabsTrigger>
                    <TabsTrigger value="recent">Recently Earned</TabsTrigger>
                    <TabsTrigger value="progress">In Progress</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="rounded-full">
                      24/50 Earned
                    </Badge>
                  </div>
                </div>

                <TabsContent value="all" className="mt-6">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AchievementCard
                      icon={<Award className="h-10 w-10 text-amber-500" />}
                      title="Fast Learner"
                      description="Complete 5 quizzes in one day"
                      xp={150}
                      earned={true}
                      date="Today"
                    />
                    <AchievementCard
                      icon={<Trophy className="h-10 w-10 text-indigo-500" />}
                      title="Quiz Master"
                      description="Score 100% on 3 consecutive quizzes"
                      xp={200}
                      earned={true}
                      date="Yesterday"
                    />
                    <AchievementCard
                      icon={<Flame className="h-10 w-10 text-orange-500" />}
                      title="On Fire"
                      description="Maintain a 5-day learning streak"
                      xp={100}
                      earned={true}
                      date="2 days ago"
                    />
                    <AchievementCard
                      icon={<Medal className="h-10 w-10 text-blue-500" />}
                      title="Course Champion"
                      description="Complete your first quiz"
                      xp={300}
                      earned={true}
                      date="Last week"
                    />
                    <AchievementCard
                      icon={<Target className="h-10 w-10 text-red-500" />}
                      title="Goal Setter"
                      description="Complete all daily challenges for a week"
                      xp={250}
                      earned={false}
                      progress={3}
                      total={7}
                    />
                    <AchievementCard
                      icon={<Crown className="h-10 w-10 text-yellow-500" />}
                      title="Leaderboard Legend"
                      description="Reach the top 10 on the weekly leaderboard"
                      xp={500}
                      earned={false}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="recent" className="mt-6">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {userStats.recentAchievements.map((achievement) => (
                      <AchievementCard
                        key={achievement.id}
                        icon={achievement.icon}
                        title={achievement.title}
                        description={achievement.description}
                        xp={achievement.xp}
                        earned={true}
                        date={achievement.date}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="progress" className="mt-6">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AchievementCard
                      icon={<Target className="h-10 w-10 text-red-500" />}
                      title="Goal Setter"
                      description="Complete all daily challenges for a week"
                      xp={250}
                      earned={false}
                      progress={3}
                      total={7}
                    />
                    <AchievementCard
                      icon={<Crown className="h-10 w-10 text-yellow-500" />}
                      title="Leaderboard Legend"
                      description="Reach the top 10 on the weekly leaderboard"
                      xp={500}
                      earned={false}
                    />
                    <AchievementCard
                      icon={<BookOpen className="h-10 w-10 text-green-500" />}
                      title="Knowledge Seeker"
                      description="Complete 5 different quizzes"
                      xp={400}
                      earned={false}
                      progress={1}
                      total={5}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

interface NavItemProps {
  icon: LucideIcon
  href: string
  label: string
  active?: boolean
}

function NavItem({ icon: Icon, href, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  )
}

function UserCard({ stats }: { stats: any }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
      <div className="relative h-10 w-10 rounded-full bg-primary/10">
        <span className="absolute inset-0 flex items-center justify-center text-lg font-medium text-primary">
          {stats.name.charAt(0)}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{stats.name}</span>
        <span className="text-xs text-muted-foreground">Level {stats.level}</span>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: LucideIcon
  value: string
  label: string
  color: string
}

function StatCard({ icon: Icon, value, label, color }: StatCardProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <Icon className={`mb-2 h-8 w-8 ${color}`} />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

interface AchievementCardProps {
  icon: React.ReactNode
  title: string
  description: string
  xp: number
  earned: boolean
  date?: string
  progress?: number
  total?: number
}

function AchievementCard({ icon, title, description, xp, earned, date, progress, total }: AchievementCardProps) {
  return (
    <Card className={earned ? "border-primary/20 bg-primary/5" : ""}>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted">{icon}</div>
          <h3 className="mb-1 text-lg font-semibold">{title}</h3>
          <p className="mb-3 text-sm text-muted-foreground">{description}</p>
          <Badge variant="outline" className="mb-2 bg-primary/10 text-primary">
            +{xp} XP
          </Badge>
          {earned ? (
            <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
              <Trophy className="h-4 w-4" />
              <span>Earned {date}</span>
            </div>
          ) : progress && total ? (
            <div className="mt-2 w-full space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span>
                  {progress}/{total}
                </span>
              </div>
              <Progress value={(progress / total) * 100} className="h-1.5" />
            </div>
          ) : (
            <Button variant="outline" size="sm" className="mt-2">
              View Requirements
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
