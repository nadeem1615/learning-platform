"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, Clock, Crown, Play, Sparkles } from "lucide-react"

export default function CoursePage({ params }: { params: { id: string } }) {
  // This would normally come from a database
  const courseData = {
    id: params.id,
    title: "Web Development Fundamentals",
    description: "Learn the core technologies that power the web: HTML, CSS, and JavaScript.",
    instructor: "Sarah Johnson",
    instructorRole: "Senior Web Developer",
    totalLessons: 12,
    completedLessons: 8,
    totalTime: "6 hours",
    level: "Beginner",
    tags: ["Coding", "Web", "HTML", "CSS", "JavaScript"],
    progress: 65,
    image: "/placeholder.svg?height=400&width=800",
    instructorImage: "/placeholder.svg?height=100&width=100",
    currentModule: "CSS Fundamentals",
    xpEarned: 1250,
    totalXp: 2000,
  }

  const modules = [
    {
      id: "1",
      title: "Introduction to HTML",
      description: "Learn the basics of HTML structure and elements",
      lessons: [
        { id: "1-1", title: "What is HTML?", duration: "10 min", completed: true },
        { id: "1-2", title: "HTML Document Structure", duration: "15 min", completed: true },
        { id: "1-3", title: "Working with Text Elements", duration: "20 min", completed: true },
        { id: "1-4", title: "HTML Quiz", duration: "10 min", completed: true, isQuiz: true },
      ],
      completed: true,
    },
    {
      id: "2",
      title: "CSS Fundamentals",
      description: "Style your HTML with Cascading Style Sheets",
      lessons: [
        { id: "2-1", title: "Introduction to CSS", duration: "15 min", completed: true },
        { id: "2-2", title: "Selectors and Properties", duration: "20 min", completed: true },
        { id: "2-3", title: "Box Model", duration: "25 min", completed: true },
        { id: "2-4", title: "Layouts and Positioning", duration: "30 min", completed: false },
        { id: "2-5", title: "CSS Quiz", duration: "15 min", completed: false, isQuiz: true },
      ],
      completed: false,
    },
    {
      id: "3",
      title: "JavaScript Basics",
      description: "Add interactivity to your websites",
      lessons: [
        { id: "3-1", title: "Introduction to JavaScript", duration: "20 min", completed: false },
        { id: "3-2", title: "Variables and Data Types", duration: "25 min", completed: false },
        { id: "3-3", title: "Functions and Events", duration: "30 min", completed: false },
        { id: "3-4", title: "DOM Manipulation", duration: "35 min", completed: false },
        { id: "3-5", title: "JavaScript Quiz", duration: "15 min", completed: false, isQuiz: true },
      ],
      completed: false,
    },
  ]

  const [activeLesson, setActiveLesson] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container py-6">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {activeLesson ? (
          <LessonView lessonId={activeLesson} onBack={() => setActiveLesson(null)} />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                  <img
                    src={courseData.image || "/placeholder.svg"}
                    alt={courseData.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Button size="lg" className="gap-2">
                      <Play className="h-5 w-5" />
                      Continue Learning
                    </Button>
                  </div>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Course Progress</CardTitle>
                  <CardDescription>Track your learning journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Overall Progress</span>
                      <span className="font-medium">{courseData.progress}%</span>
                    </div>
                    <Progress value={courseData.progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {courseData.completedLessons} of {courseData.totalLessons} lessons completed
                      </span>
                      <span>{courseData.totalTime} total</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Current Module</div>
                      <Badge variant="outline" className="bg-primary/20">
                        In Progress
                      </Badge>
                    </div>
                    <div className="mt-1 text-base font-semibold">{courseData.currentModule}</div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-amber-100 p-3 text-amber-800">
                    <Crown className="h-5 w-5" />
                    <div>
                      <div className="text-sm font-medium">XP Earned</div>
                      <div className="text-base font-semibold">
                        {courseData.xpEarned} / {courseData.totalXp} XP
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Continue Learning</Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <Tabs defaultValue="content">
                  <TabsList className="mb-4">
                    <TabsTrigger value="content">Course Content</TabsTrigger>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                  </TabsList>
                  <TabsContent value="content" className="space-y-4">
                    <div className="space-y-4">
                      {modules.map((module) => (
                        <Card key={module.id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{module.title}</CardTitle>
                              {module.completed ? (
                                <Badge className="bg-green-100 text-green-800">Completed</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-primary/10 text-primary">
                                  In Progress
                                </Badge>
                              )}
                            </div>
                            <CardDescription>{module.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {module.lessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-muted"
                                  onClick={() => setActiveLesson(lesson.id)}
                                >
                                  <div className="flex items-center gap-3">
                                    {lesson.completed ? (
                                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : lesson.isQuiz ? (
                                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                                        <span className="text-xs font-bold">Q</span>
                                      </div>
                                    ) : (
                                      <Play className="h-5 w-5 text-muted-foreground" />
                                    )}
                                    <span className={lesson.completed ? "text-muted-foreground" : ""}>
                                      {lesson.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Clock className="h-3.5 w-3.5" />
                                      {lesson.duration}
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="overview">
                    <Card>
                      <CardHeader>
                        <CardTitle>Course Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="mb-2 font-semibold">About This Course</h3>
                          <p className="text-muted-foreground">
                            This comprehensive course will teach you the fundamentals of web development. You'll learn
                            HTML for structure, CSS for styling, and JavaScript for interactivity. By the end of this
                            course, you'll be able to build your own responsive websites from scratch.
                          </p>
                        </div>
                        <div>
                          <h3 className="mb-2 font-semibold">What You'll Learn</h3>
                          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                            <li>HTML document structure and semantic elements</li>
                            <li>CSS styling, layouts, and responsive design</li>
                            <li>JavaScript fundamentals and DOM manipulation</li>
                            <li>Building interactive web pages</li>
                            <li>Web development best practices</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="mb-2 font-semibold">Prerequisites</h3>
                          <p className="text-muted-foreground">
                            No prior programming experience is required. Basic computer skills and familiarity with
                            using the internet are recommended.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="discussion">
                    <Card>
                      <CardHeader>
                        <CardTitle>Course Discussion</CardTitle>
                        <CardDescription>Connect with other learners</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <p className="text-muted-foreground mb-4">Join the conversation about this course</p>
                          <Button>View Discussion Forum</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Your Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3 h-24 w-24 overflow-hidden rounded-full">
                        <img
                          src={courseData.instructorImage || "/placeholder.svg"}
                          alt={courseData.instructor}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-semibold">{courseData.instructor}</h3>
                      <p className="text-sm text-muted-foreground">{courseData.instructorRole}</p>
                      <p className="mt-4 text-sm text-muted-foreground">
                        Sarah is a senior web developer with over 10 years of experience building websites and
                        applications. She specializes in frontend technologies and loves teaching beginners.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Profile
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Course Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Level</span>
                        <Badge variant="outline">{courseData.level}</Badge>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Lessons</span>
                        <span className="font-medium">{courseData.totalLessons}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Duration</span>
                        <span className="font-medium">{courseData.totalTime}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Topics</span>
                        <div className="flex flex-wrap justify-end gap-1">
                          {courseData.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

interface LessonViewProps {
  lessonId: string
  onBack: () => void
}

function LessonView({ lessonId, onBack }: LessonViewProps) {
  // This would normally come from a database based on the lessonId
  const lessonData = {
    id: lessonId,
    title: "Box Model",
    module: "CSS Fundamentals",
    duration: "25 min",
    videoUrl: "/placeholder.svg?height=400&width=800",
    content: `
      <h2>The CSS Box Model</h2>
      <p>The CSS box model is a fundamental concept for layout and design on the web. It describes how elements are rendered on a page.</p>
      <p>Every HTML element is treated as a box with the following properties:</p>
      <ul>
        <li><strong>Content</strong>: The actual content of the element (text, images, etc.)</li>
        <li><strong>Padding</strong>: The space between the content and the border</li>
        <li><strong>Border</strong>: The line that surrounds the padding</li>
        <li><strong>Margin</strong>: The space outside the border</li>
      </ul>
      <p>Understanding the box model is essential for creating layouts and positioning elements correctly.</p>
    `,
  }

  const [showCongrats, setShowCongrats] = useState(false)

  const completeLesson = () => {
    setShowCongrats(true)
    // In a real app, you would update the database here
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2 -ml-3 gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Course
          </Button>
          <h1 className="text-2xl font-bold">{lessonData.title}</h1>
          <p className="text-muted-foreground">
            {lessonData.module} • {lessonData.duration}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1">
            <BookOpen className="h-4 w-4" />
            Notes
          </Button>
          <Button onClick={completeLesson}>Mark as Complete</Button>
        </div>
      </div>

      {showCongrats ? (
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Congratulations!</h2>
            <p className="max-w-md text-muted-foreground">
              You've completed this lesson and earned 50 XP. Keep up the great work!
            </p>
            <div className="mt-2 flex items-center gap-3">
              <Button onClick={onBack}>Back to Course</Button>
              <Button variant="outline">Next Lesson</Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <img
              src={lessonData.videoUrl || "/placeholder.svg"}
              alt="Lesson video"
              className="h-full w-full object-cover"
            />
          </div>

          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content">Lesson Content</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <Card>
                <CardContent className="pt-6">
                  <div
                    className="prose max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: lessonData.content }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="resources">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Additional Resources</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-md bg-primary/10 p-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">CSS Box Model Cheat Sheet</div>
                            <div className="text-sm text-muted-foreground">PDF • 2.3 MB</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-md bg-primary/10 p-2">
                            <Play className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Box Model Interactive Demo</div>
                            <div className="text-sm text-muted-foreground">Interactive • 5 min</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Open
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="discussion">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Join the discussion about this lesson</p>
                    <Button>View Discussion</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
