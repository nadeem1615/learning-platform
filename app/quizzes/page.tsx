import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Crown,
  Gamepad2,
  LayoutDashboard,
  type LucideIcon,
  Search,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react"
import { getAllQuizCategories } from "@/lib/quiz-service"

export default async function QuizzesPage() {
  const categories = await getAllQuizCategories()

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
            <NavItem icon={BookOpen} href="/quizzes" label="Quizzes" active />
            <NavItem icon={Gamepad2} href="/challenges" label="Challenges" />
            <NavItem icon={Trophy} href="/achievements" label="Achievements" />
            <NavItem icon={Users} href="/leaderboard" label="Leaderboard" />
          </nav>
          <div className="absolute bottom-4 left-4 sm:fixed sm:bottom-4 sm:left-4 sm:w-56">
            <UserCard />
          </div>
        </div>
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
              <p className="text-muted-foreground">Explore quizzes in various categories</p>
            </div>

            <div className="mb-6 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search quizzes..." className="w-full bg-background pl-8" />
              </div>
              <Button>Find Quizzes</Button>
            </div>

            <Tabs defaultValue="categories">
              <TabsList className="mb-4">
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
              </TabsList>
              <TabsContent value="categories" className="space-y-6">
                {categories.map((category) => (
                  <div key={category.id}>
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-xl font-semibold">{category.name}</h2>
                      <Button variant="ghost" size="sm" className="gap-1" asChild>
                        <Link href={`/quizzes/category/${category.id}`}>View All</Link>
                      </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {category.quizzes.map((quiz) => (
                        <QuizCard
                          key={quiz.id}
                          id={quiz.id}
                          title={quiz.title}
                          description={quiz.description}
                          difficulty={quiz.difficulty}
                          questions={quiz.questions}
                          image={quiz.image}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="popular">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{/* Popular quizzes would go here */}</div>
              </TabsContent>
              <TabsContent value="new">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{/* New quizzes would go here */}</div>
              </TabsContent>
            </Tabs>
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

function UserCard() {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
      <div className="relative h-10 w-10 rounded-full bg-primary/10">
        <span className="absolute inset-0 flex items-center justify-center text-lg font-medium text-primary">A</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">Alex Johnson</span>
        <span className="text-xs text-muted-foreground">Level 12</span>
      </div>
    </div>
  )
}

interface QuizCardProps {
  id: string
  title: string
  description: string
  difficulty: string
  questions: number
  image: string
}

function QuizCard({ id, title, description, difficulty, questions, image }: QuizCardProps) {
  const difficultyColor =
    difficulty === "Easy"
      ? "bg-green-100 text-green-800"
      : difficulty === "Medium"
        ? "bg-amber-100 text-amber-800"
        : "bg-red-100 text-red-800"

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img src={image || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1">{title}</CardTitle>
          <Badge className={difficultyColor}>{difficulty}</Badge>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{questions} Questions</span>
          <div className="flex items-center gap-1">
            <Crown className="h-4 w-4 text-amber-500" />
            <span>Top 10 Popular</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/quizzes/${id}`}>Start Quiz</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
