import type React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Crown,
  Flame,
  Gamepad2,
  LayoutDashboard,
  type LucideIcon,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react"
import { getRecentQuizzes } from "@/lib/quiz-service"
import { getUserStats } from "@/lib/user-service"

export default async function Dashboard() {
  const recentQuizzes = await getRecentQuizzes()
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
            <NavItem icon={LayoutDashboard} href="/" label="Dashboard" active />
            <NavItem icon={BookOpen} href="/quizzes" label="Quizzes" />
            <NavItem icon={Gamepad2} href="/challenges" label="Challenges" />
            <NavItem icon={Trophy} href="/achievements" label="Achievements" />
            <NavItem icon={Users} href="/leaderboard" label="Leaderboard" />
          </nav>
          <div className="absolute bottom-4 left-4 sm:fixed sm:bottom-4 sm:left-4 sm:w-56">
            <UserCard stats={userStats} />
          </div>
        </div>
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {userStats.name}! Continue your learning journey.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-amber-700">
                  <Flame className="h-4 w-4" />
                  <span className="text-sm font-medium">{userStats.streak} day streak!</span>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary">
                  <Crown className="h-4 w-4" />
                  <span className="text-sm font-medium">{userStats.xp} XP</span>
                </div>
              </div>
            </div>
            <Tabs defaultValue="quizzes">
              <TabsList className="mb-4">
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="quizzes" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recentQuizzes.map((quiz) => (
                    <QuizCard
                      key={quiz.id}
                      id={quiz.id}
                      title={quiz.title}
                      description={quiz.description}
                      progress={quiz.progress}
                      questions={quiz.questions}
                      completed={quiz.completed}
                      image={quiz.image}
                      tags={quiz.tags}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="recommended" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <QuizCard
                    id="science"
                    title="Science Quiz"
                    description="Test your knowledge of scientific facts and discoveries"
                    progress={0}
                    questions={10}
                    completed={0}
                    image="/placeholder.svg?height=200&width=400"
                    tags={["Science", "Medium"]}
                  />
                  <QuizCard
                    id="history"
                    title="History Trivia"
                    description="Explore historical events and figures"
                    progress={0}
                    questions={10}
                    completed={0}
                    image="/placeholder.svg?height=200&width=400"
                    tags={["History", "Hard"]}
                  />
                </div>
              </TabsContent>
              <TabsContent value="completed" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {userStats.completedQuizzes.map((quiz) => (
                    <QuizCard
                      key={quiz.id}
                      id={quiz.id}
                      title={quiz.title}
                      description={quiz.description}
                      progress={100}
                      questions={quiz.questions}
                      completed={quiz.questions}
                      image={quiz.image}
                      tags={quiz.tags}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                  <CardDescription>Your latest learning milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userStats.recentAchievements.map((achievement) => (
                      <Achievement
                        key={achievement.id}
                        icon={achievement.icon}
                        title={achievement.title}
                        description={achievement.description}
                        date={achievement.date}
                        xp={achievement.xp}
                      />
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/achievements">View All Achievements</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Leaderboard</CardTitle>
                  <CardDescription>This week's top learners</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userStats.leaderboard.map((item) => (
                      <LeaderboardItem
                        key={item.id}
                        rank={item.rank}
                        name={item.name}
                        points={item.points}
                        isUser={item.isUser}
                      />
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/leaderboard">View Full Leaderboard</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Daily Challenges</CardTitle>
                  <CardDescription>Complete for bonus XP</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userStats.dailyChallenges.map((challenge) => (
                      <Challenge
                        key={challenge.id}
                        title={challenge.title}
                        description={challenge.description}
                        reward={challenge.reward}
                        progress={challenge.progress}
                        total={challenge.total}
                      />
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/challenges">View All Challenges</Link>
                  </Button>
                </CardFooter>
              </Card>
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

interface QuizCardProps {
  id: string
  title: string
  description: string
  progress: number
  questions: number
  completed: number
  image: string
  tags: string[]
}

function QuizCard({ id, title, description, progress, questions, completed, image, tags }: QuizCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img src={image || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
      </div>
      <CardHeader>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {completed} of {questions} questions completed
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/quizzes/${id}`}>
            {progress === 0 ? "Start Quiz" : progress === 100 ? "Review Quiz" : "Continue Quiz"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

interface AchievementProps {
  icon: React.ReactNode
  title: string
  description: string
  date: string
  xp: number
}

function Achievement({ icon, title, description, date, xp }: AchievementProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{title}</h4>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-1 text-xs font-medium text-primary">+{xp} XP</div>
      </div>
    </div>
  )
}

interface LeaderboardItemProps {
  rank: number
  name: string
  points: number
  isUser?: boolean
}

function LeaderboardItem({ rank, name, points, isUser }: LeaderboardItemProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg p-2 ${
        isUser ? "bg-primary/10 font-medium text-primary" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
            rank === 1
              ? "bg-yellow-100 text-yellow-700"
              : rank === 2
                ? "bg-gray-100 text-gray-700"
                : rank === 3
                  ? "bg-amber-100 text-amber-700"
                  : "bg-muted text-muted-foreground"
          }`}
        >
          {rank}
        </div>
        <span>{name}</span>
      </div>
      <div className="flex items-center gap-1">
        <Crown className="h-3.5 w-3.5" />
        <span>{points} XP</span>
      </div>
    </div>
  )
}

interface ChallengeProps {
  title: string
  description: string
  reward: number
  progress: number
  total: number
}

function Challenge({ title, description, reward, progress, total }: ChallengeProps) {
  const percentage = (progress / total) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary">
          +{reward} XP
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Progress value={percentage} className="h-2 flex-1" />
        <span className="text-xs font-medium">
          {progress}/{total}
        </span>
      </div>
    </div>
  )
}
