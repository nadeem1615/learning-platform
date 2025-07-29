"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CheckCircle2, Crown, HelpCircle, Loader2, Sparkles, Timer, XCircle } from "lucide-react"
import { getQuizById, submitQuizAnswer } from "@/lib/quiz-service"
import { decodeHtml } from "@/lib/utils"

export default function QuizPage({ params }: { params: { id: string } }) {
  const [quiz, setQuiz] = useState<any>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await getQuizById(params.id)
        setQuiz(quizData)
        setLoading(false)
      } catch (err) {
        setError("Failed to load quiz. Please try again.")
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [params.id])

  useEffect(() => {
    if (loading || quizCompleted || isAnswerSubmitted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestionIndex, loading, quizCompleted, isAnswerSubmitted])

  const handleTimeUp = () => {
    if (!selectedAnswer) {
      setIsAnswerSubmitted(true)
      setIsCorrect(false)
    }
  }

  const handleAnswerSelect = (answer: string) => {
    if (isAnswerSubmitted) return
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || isAnswerSubmitted) return

    setIsAnswerSubmitted(true)

    try {
      const result = await submitQuizAnswer(params.id, currentQuestionIndex, selectedAnswer)

      setIsCorrect(result.correct)
      if (result.correct) {
        setScore((prev) => prev + 1)
      }
    } catch (err) {
      setError("Failed to submit answer. Please try again.")
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex >= (quiz?.questions.length || 0) - 1) {
      setQuizCompleted(true)
      return
    }

    setCurrentQuestionIndex((prev) => prev + 1)
    setSelectedAnswer(null)
    setIsAnswerSubmitted(false)
    setIsCorrect(null)
    setTimeLeft(30)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Something went wrong</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/quizzes">Back to Quizzes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Quiz Not Found</CardTitle>
            <CardDescription>The quiz you're looking for doesn't exist</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/quizzes">Back to Quizzes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <QuizResults score={score} totalQuestions={quiz.questions.length} quizId={params.id} quizTitle={quiz.title} />
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-6">
        <Link
          href="/quizzes"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quizzes
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p className="text-muted-foreground">{quiz.description}</p>
        </div>
        <Badge variant="outline" className="w-fit gap-1 bg-primary/10 px-3 py-1.5 text-primary">
          <Crown className="h-4 w-4" />
          <span>+10 XP per correct answer</span>
        </Badge>
      </div>

      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-amber-800">
            <Timer className="h-4 w-4" />
            <span className="text-sm font-medium">{timeLeft}s</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-xl">{decodeHtml(currentQuestion.question)}</CardTitle>
            <Badge
              className={`${
                currentQuestion.difficulty === "easy"
                  ? "bg-green-100 text-green-800"
                  : currentQuestion.difficulty === "medium"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
            </Badge>
          </div>
          <CardDescription>Category: {currentQuestion.category}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedAnswer || ""} className="space-y-3">
            {currentQuestion.answers.map((answer: string, index: number) => {
              const isSelected = selectedAnswer === answer
              const isCorrectAnswer = isAnswerSubmitted && currentQuestion.correct_answer === answer
              const isWrongSelection = isAnswerSubmitted && isSelected && !isCorrectAnswer

              return (
                <div
                  key={index}
                  className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                    isSelected && !isAnswerSubmitted
                      ? "border-primary bg-primary/5"
                      : isCorrectAnswer
                        ? "border-green-500 bg-green-50"
                        : isWrongSelection
                          ? "border-red-500 bg-red-50"
                          : "hover:bg-muted/50"
                  } ${isAnswerSubmitted ? "cursor-default" : "cursor-pointer"}`}
                  onClick={() => handleAnswerSelect(answer)}
                >
                  <RadioGroupItem
                    value={answer}
                    id={`answer-${index}`}
                    disabled={isAnswerSubmitted}
                    className={isAnswerSubmitted ? "cursor-default" : ""}
                  />
                  <label
                    htmlFor={`answer-${index}`}
                    className="flex flex-1 items-center justify-between text-base font-medium"
                  >
                    {decodeHtml(answer)}
                    {isCorrectAnswer && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    {isWrongSelection && <XCircle className="h-5 w-5 text-red-500" />}
                  </label>
                </div>
              )
            })}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {isAnswerSubmitted ? (
            <div className="w-full space-y-4">
              <div
                className={`rounded-lg p-4 text-center ${
                  isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                <div className="mb-1 flex items-center justify-center gap-2">
                  {isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  <span className="font-medium">{isCorrect ? "Correct!" : "Incorrect!"}</span>
                </div>
                {!isCorrect && (
                  <p className="text-sm">The correct answer is: {decodeHtml(currentQuestion.correct_answer)}</p>
                )}
              </div>
              <Button onClick={handleNextQuestion} className="w-full">
                {currentQuestionIndex >= quiz.questions.length - 1 ? "Complete Quiz" : "Next Question"}
              </Button>
            </div>
          ) : (
            <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="w-full">
              Submit Answer
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="flex items-center justify-between rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Need a hint?</h3>
            <p className="text-sm text-muted-foreground">Use a hint to get help with this question</p>
          </div>
        </div>
        <Button variant="outline" disabled={isAnswerSubmitted}>
          Use Hint (-5 XP)
        </Button>
      </div>
    </div>
  )
}

interface QuizResultsProps {
  score: number
  totalQuestions: number
  quizId: string
  quizTitle: string
}

function QuizResults({ score, totalQuestions, quizId, quizTitle }: QuizResultsProps) {
  const percentage = (score / totalQuestions) * 100
  const xpEarned = score * 10

  let resultMessage = ""
  let resultClass = ""

  if (percentage >= 80) {
    resultMessage = "Excellent! You're a quiz master!"
    resultClass = "bg-green-100 text-green-800"
  } else if (percentage >= 60) {
    resultMessage = "Good job! You know your stuff!"
    resultClass = "bg-blue-100 text-blue-800"
  } else if (percentage >= 40) {
    resultMessage = "Not bad! Keep learning!"
    resultClass = "bg-amber-100 text-amber-800"
  } else {
    resultMessage = "Keep practicing! You'll get better!"
    resultClass = "bg-red-100 text-red-800"
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
          <CardDescription>{quizTitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`rounded-lg p-4 text-center ${resultClass}`}>
            <p className="text-lg font-medium">{resultMessage}</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span>Your Score</span>
              <span>{percentage.toFixed(0)}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
            <div className="text-center text-sm text-muted-foreground">
              {score} out of {totalQuestions} questions answered correctly
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">XP Earned</span>
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary">
                <Crown className="h-4 w-4" />
                <span className="font-medium">+{xpEarned} XP</span>
              </div>
            </div>

            {percentage >= 70 && (
              <div className="flex items-center justify-between">
                <span className="font-medium">Achievement Unlocked</span>
                <Badge className="bg-amber-100 text-amber-800">Quiz Whiz</Badge>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/quizzes">Find Another Quiz</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href={`/quizzes/${quizId}/review`}>Review Answers</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
