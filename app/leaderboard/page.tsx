import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Crown,
  Gamepad2,
  LayoutDashboard,
  type LucideIcon,
  Medal,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react"
import { getUserStats } from "@/lib/user-service"

export default async function LeaderboardPage() {
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
            <NavItem icon={Trophy} href="/achievements" label="Achievements" />
            <NavItem icon={Users} href="/leaderboard" label="Leaderboard" active />
          </nav>
          <div className="absolute bottom-4 left-4 sm:fixed sm:bottom-4 sm:left-4 sm:w-56">
            <UserCard stats={userStats} />
          </div>
        </div>
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
              <p className="text-muted-foreground">See how you rank against other learners</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <Tabs defaultValue="weekly">
                    <div className="flex items-center justify-between">
                      <CardTitle>Leaderboard Rankings</CardTitle>
                      <TabsList>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        <TabsTrigger value="allTime">All Time</TabsTrigger>
                      </TabsList>
                    </div>
                    <CardDescription>Compete with other learners for the top spot</CardDescription>
                  </Tabs>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="weekly">
                    <TabsContent value="weekly" className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        {userStats.leaderboard.slice(0, 3).map((user, index) => {
                          // Reorder for display (2nd, 1st, 3rd)
                          const displayIndex = index === 0 ? 1 : index === 1 ? 0 : 2
                          const topUser = userStats.leaderboard[displayIndex]
                          return (
                            <TopRanker
                              key={topUser.id}
                              rank={topUser.rank}
                              name={topUser.name}
                              points={topUser.points}
                              image="/placeholder.svg?height=100&width=100"
                              quizzes={topUser.rank === 1 ? 5 : topUser.rank === 2 ? 4 : 3}
                              isUser={topUser.isUser}
                            />
                          )
                        })}
                      </div>

                      <div className="mt-6 space-y-2">
                        {userStats.leaderboard.slice(3).map((user) => (
                          <LeaderboardItem
                            key={user.id}
                            rank={user.rank}
                            name={user.name}
                            points={user.points}
                            quizzes={user.rank === 4 ? 3 : user.rank === 5 ? 2 : 1}
                            isUser={user.isUser}
                          />
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="monthly">
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">Monthly leaderboard resets in 12 days</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="allTime">
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">All-time rankings since you joined</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Ranking</CardTitle>
                    <CardDescription>Current position and stats</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center space-y-4 text-center">
                      <div className="relative">
                        <div className="h-24 w-24 rounded-full bg-primary/10">
                          <span className="absolute inset-0 flex items-center justify-center text-lg font-medium text-primary">
                            {userStats.name.charAt(0)}
                          </span>
                        </div>
                        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                          3
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{userStats.name}</h3>
                        <p className="text-muted-foreground">Level {userStats.level} • Adventurer</p>
                      </div>
                      <div className="grid w-full grid-cols-2 gap-4 pt-2">
                        <div className="rounded-lg bg-muted p-3 text-center">
                          <div className="text-2xl font-bold text-primary">{userStats.xp}</div>
                          <div className="text-xs text-muted-foreground">XP This Week</div>
                        </div>
                        <div className="rounded-lg bg-muted p-3 text-center">
                          <div className="text-2xl font-bold">{userStats.completedQuizzes.length}</div>
                          <div className="text-xs text-muted-foreground">Quizzes Completed</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Rewards</CardTitle>
                    <CardDescription>Earn special rewards by ranking high</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Crown className="h-5 w-5 text-yellow-500" />
                          <h3 className="font-semibold">Top 3 Finisher</h3>
                        </div>
                        <p className="mb-3 text-sm text-muted-foreground">
                          Finish in the top 3 on the weekly leaderboard
                        </p>
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          500 XP Bonus
                        </Badge>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Medal className="h-5 w-5 text-amber-500" />
                          <h3 className="font-semibold">Weekly Champion</h3>
                        </div>
                        <p className="mb-3 text-sm text-muted-foreground">Reach #1 on the weekly leaderboard</p>
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Exclusive Badge + 1000 XP
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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

interface TopRankerProps {
  rank: number
  name: string
  points: number
  image: string
  quizzes: number
  isUser?: boolean
}

function TopRanker({ rank, name, points, image, quizzes, isUser }: TopRankerProps) {
  return (
    <div
      className={`flex flex-col items-center rounded-lg p-4 text-center ${
        rank === 1
          ? "order-2 border-2 border-yellow-400 bg-yellow-50"
          : rank === 2
            ? "order-1 border border-gray-300 bg-gray-50"
            : "order-3 border border-amber-300 bg-amber-50"
      } ${isUser ? "ring-2 ring-primary ring-offset-2" : ""}`}
    >
      <div className="relative mb-2">
        {rank === 1 && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <Crown className="h-8 w-8 text-yellow-500" />
          </div>
        )}
        <div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-background">
          <img src={image || "/placeholder.svg"} alt={name} className="h-full w-full object-cover" />
        </div>
        <div
          className={`absolute -bottom-2 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full text-sm font-bold ${
            rank === 1
              ? "bg-yellow-500 text-yellow-50"
              : rank === 2
                ? "bg-gray-500 text-gray-50"
                : "bg-amber-500 text-amber-50"
          }`}
        >
          {rank}
        </div>
      </div>
      <h3 className="text-base font-semibold">{name}</h3>
      <div className="mt-1 flex items-center gap-1 text-sm font-medium">
        <Crown className="h-4 w-4" />
        <span>{points} XP</span>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{quizzes} completed quizzes</div>
      {isUser && (
        <Badge variant="outline" className="mt-2 bg-primary/10 text-primary">
          You
        </Badge>
      )}
    </div>
  )
}

interface LeaderboardItemProps {
  rank: number
  name: string
  points: number
  quizzes: number
  isUser?: boolean
}

function LeaderboardItem({ rank, name, points, quizzes, isUser }: LeaderboardItemProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-3 ${
        isUser ? "bg-primary/5 ring-1 ring-primary" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
            rank <= 3
              ? rank === 1
                ? "bg-yellow-100 text-yellow-700"
                : rank === 2
                  ? "bg-gray-100 text-gray-700"
                  : "bg-amber-100 text-amber-700"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {rank}
        </div>
        <div>
          <div className="font-medium">
            {name} {isUser && <span className="text-primary">(You)</span>}
          </div>
          <div className="text-xs text-muted-foreground">{quizzes} completed quizzes</div>
        </div>
      </div>
      <div className="flex items-center gap-1 font-medium">
        <Crown className="h-4 w-4" />
        <span>{points} XP</span>
      </div>
    </div>
  )
}
