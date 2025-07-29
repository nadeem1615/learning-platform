import type React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  Flame,
  Gamepad2,
  LayoutDashboard,
  type LucideIcon,
  Sparkles,
  Target,
  Trophy,
  Users,
} from "lucide-react"
import { getUserStats } from "@/lib/user-service"

export default async function ChallengesPage() {
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
            <NavItem icon={Gamepad2} href="/challenges" label="Challenges" active />
            <NavItem icon={Trophy} href="/achievements" label="Achievements" />
            <NavItem icon={Users} href="/leaderboard" label="Leaderboard" />
          </nav>
          <div className="absolute bottom-4 left-4 sm:fixed sm:bottom-4 sm:left-4 sm:w-56">
            <UserCard stats={userStats} />
          </div>
        </div>
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Challenges</h1>
              <p className="text-muted-foreground">Complete challenges to earn bonus XP and rewards</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Daily Challenges</CardTitle>
                      <CardDescription>Refreshes in 8 hours</CardDescription>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>1/3 Completed</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userStats.dailyChallenges.map((challenge) => (
                    <ChallengeItem
                      key={challenge.id}
                      title={challenge.title}
                      description={challenge.description}
                      reward={challenge.reward}
                      progress={challenge.progress}
                      total={challenge.total}
                      icon={
                        challenge.title.includes("Quiz") ? (
                          <Target className="h-10 w-10 text-primary" />
                        ) : challenge.title.includes("Session") ? (
                          <Clock className="h-10 w-10 text-blue-500" />
                        ) : (
                          <Trophy className="h-10 w-10 text-amber-500" />
                        )
                      }
                    />
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Challenge Stats</CardTitle>
                  <CardDescription>Your challenge performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-muted p-4 text-center">
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-xs text-muted-foreground">Challenges Completed</div>
                    </div>
                    <div className="rounded-lg bg-muted p-4 text-center">
                      <div className="text-2xl font-bold">850</div>
                      <div className="text-xs text-muted-foreground">XP Earned</div>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-medium">Weekly Streak</div>
                      <Badge variant="outline" className="bg-amber-100 text-amber-800">
                        {userStats.streak} Days
                      </Badge>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                        <div
                          key={day}
                          className={`flex flex-col items-center rounded p-1.5 text-xs ${
                            i < userStats.streak ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <span>{day}</span>
                          {i < userStats.streak && <CheckCircle2 className="mt-1 h-3 w-3" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <Tabs defaultValue="weekly">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="weekly">Weekly Challenges</TabsTrigger>
                    <TabsTrigger value="special">Special Events</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1 rounded-full">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Resets in 2 days</span>
                    </Badge>
                  </div>
                </div>

                <TabsContent value="weekly" className="mt-6">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <WeeklyChallengeCard
                      title="Quiz Explorer"
                      description="Start 2 new quizzes this week"
                      reward={200}
                      progress={1}
                      total={2}
                      icon={<BookOpen className="h-12 w-12 text-blue-500" />}
                    />
                    <WeeklyChallengeCard
                      title="Quiz Master"
                      description="Complete 5 quizzes with a score of 90% or higher"
                      reward={300}
                      progress={3}
                      total={5}
                      icon={<Target className="h-12 w-12 text-primary" />}
                    />
                    <WeeklyChallengeCard
                      title="Learning Streak"
                      description="Learn for at least 15 minutes every day this week"
                      reward={250}
                      progress={userStats.streak}
                      total={7}
                      icon={<Flame className="h-12 w-12 text-orange-500" />}
                    />
                    <WeeklyChallengeCard
                      title="Module Master"
                      description="Complete 3 quizzes"
                      reward={350}
                      progress={userStats.completedQuizzes.length}
                      total={3}
                      icon={<Trophy className="h-12 w-12 text-amber-500" />}
                    />
                    <WeeklyChallengeCard
                      title="XP Hunter"
                      description="Earn 1000 XP this week"
                      reward={400}
                      progress={userStats.xp > 1000 ? 1000 : userStats.xp}
                      total={1000}
                      icon={<Crown className="h-12 w-12 text-yellow-500" />}
                    />
                    <WeeklyChallengeCard
                      title="Social Learner"
                      description="Participate in 3 quiz discussions"
                      reward={150}
                      progress={0}
                      total={3}
                      icon={<Users className="h-12 w-12 text-indigo-500" />}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="special" className="mt-6">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <SpecialEventCard
                      title="Trivia Marathon"
                      description="Complete 10 quizzes in a single day"
                      reward="500 XP + Special Badge"
                      startDate="May 15"
                      endDate="May 17"
                      image="/placeholder.svg?height=200&width=400&text=Trivia%20Marathon"
                    />
                    <SpecialEventCard
                      title="Science Week"
                      description="Complete 3 science quizzes"
                      reward="400 XP + Certificate"
                      startDate="May 20"
                      endDate="May 27"
                      image="/placeholder.svg?height=200&width=400&text=Science%20Week"
                    />
                    <SpecialEventCard
                      title="History Challenge"
                      description="Score 100% on a history quiz"
                      reward="450 XP + Special Badge"
                      startDate="June 1"
                      endDate="June 7"
                      image="/placeholder.svg?height=200&width=400&text=History%20Challenge"
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

interface ChallengeItemProps {
  title: string
  description: string
  reward: number
  progress: number
  total: number
  icon: React.ReactNode
}

function ChallengeItem({ title, description, reward, progress, total, icon }: ChallengeItemProps) {
  const percentage = (progress / total) * 100
  const isCompleted = progress >= total

  return (
    <div className={`rounded-lg border p-4 ${isCompleted ? "border-green-200 bg-green-50" : ""}`}>
      <div className="flex gap-4">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-muted">{icon}</div>
        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-semibold">{title}</h3>
            {isCompleted ? (
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            ) : (
              <Badge variant="outline" className="bg-primary/10 text-primary">
                +{reward} XP
              </Badge>
            )}
          </div>
          <p className="mb-3 text-sm text-muted-foreground">{description}</p>
          <div className="flex items-center gap-2">
            <Progress value={percentage} className="h-2 flex-1" />
            <span className="text-xs font-medium">
              {progress}/{total}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface WeeklyChallengeCardProps {
  title: string
  description: string
  reward: number
  progress: number
  total: number
  icon: React.ReactNode
}

function WeeklyChallengeCard({ title, description, reward, progress, total, icon }: WeeklyChallengeCardProps) {
  const percentage = (progress / total) * 100
  const isCompleted = progress >= total

  return (
    <Card className={isCompleted ? "border-green-200 bg-green-50" : ""}>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">{icon}</div>
          <h3 className="mb-1 text-lg font-semibold">{title}</h3>
          <p className="mb-4 text-sm text-muted-foreground">{description}</p>
          {isCompleted ? (
            <Badge className="mb-4 bg-green-100 text-green-800">Completed</Badge>
          ) : (
            <Badge variant="outline" className="mb-4 bg-primary/10 text-primary">
              +{reward} XP
            </Badge>
          )}
          <div className="w-full space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span>
                {progress}/{total}
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface SpecialEventCardProps {
  title: string
  description: string
  reward: string
  startDate: string
  endDate: string
  image: string
}

function SpecialEventCard({ title, description, reward, startDate, endDate, image }: SpecialEventCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img src={image || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            Event
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {startDate} - {endDate}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <span>{reward}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Join Challenge</Button>
      </CardFooter>
    </Card>
  )
}
