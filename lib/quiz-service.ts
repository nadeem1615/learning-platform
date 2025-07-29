"use server"
import { cookies } from "next/headers"

// Types
interface Question {
  category: string
  type: string
  difficulty: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
  answers: string[] // Combined and shuffled answers
}

interface Quiz {
  id: string
  title: string
  description: string
  difficulty: string
  category: string
  questions: Question[]
  image: string
}

interface QuizCategory {
  id: number
  name: string
  quizzes: {
    id: string
    title: string
    description: string
    difficulty: string
    questions: number
    image: string
  }[]
}

interface UserQuiz {
  id: string
  title: string
  description: string
  progress: number
  questions: number
  completed: number
  image: string
  tags: string[]
}

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Get all quiz categories from OpenTDB
export async function getAllQuizCategories(): Promise<QuizCategory[]> {
  try {
    // Fetch categories from OpenTDB
    const response = await fetch("https://opentdb.com/api_category.php")
    const data = await response.json()

    // Create sample quizzes for each category
    const categories: QuizCategory[] = data.trivia_categories.map((category: any) => {
      // Generate 3 sample quizzes for each category
      const quizzes = Array.from({ length: 3 }, (_, i) => {
        const difficulty = ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)]
        return {
          id: `${category.id}-${i}`,
          title: `${category.name} Quiz ${i + 1}`,
          description: `Test your knowledge about ${category.name}`,
          difficulty,
          questions: 10,
          image: `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(category.name)}`,
        }
      })

      return {
        id: category.id,
        name: category.name,
        quizzes,
      }
    })

    return categories
  } catch (error) {
    console.error("Failed to fetch quiz categories:", error)
    return []
  }
}

// Get quiz by ID (fetch from OpenTDB)
export async function getQuizById(id: string): Promise<Quiz | null> {
  try {
    // Parse the ID to get category and difficulty
    const [categoryId, quizIndex] = id.split("-").map(Number)

    // Default to 10 questions if not specified
    const amount = 10

    // Determine difficulty based on quiz index
    const difficulties = ["easy", "medium", "hard"]
    const difficulty = difficulties[quizIndex % 3]

    // Fetch questions from OpenTDB
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&difficulty=${difficulty}&type=multiple`
    const response = await fetch(url)
    const data = await response.json()

    if (data.response_code !== 0) {
      throw new Error("Failed to fetch quiz questions")
    }

    // Get category name for the title
    const categoriesResponse = await fetch("https://opentdb.com/api_category.php")
    const categoriesData = await categoriesResponse.json()
    const category = categoriesData.trivia_categories.find((c: any) => c.id === categoryId)

    // Process questions
    const questions = data.results.map((q: any) => {
      // Combine and shuffle answers
      const answers = shuffleArray([...q.incorrect_answers, q.correct_answer])

      return {
        ...q,
        answers,
      }
    })

    return {
      id,
      title: `${category?.name || "General Knowledge"} Quiz`,
      description: `Test your knowledge about ${category?.name || "various topics"}`,
      difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
      category: category?.name || "General Knowledge",
      questions,
      image: `/placeholder.svg?height=400&width=800&text=${encodeURIComponent(category?.name || "Quiz")}`,
    }
  } catch (error) {
    console.error("Failed to fetch quiz:", error)
    return null
  }
}

// Submit quiz answer
export async function submitQuizAnswer(
  quizId: string,
  questionIndex: number,
  answer: string,
): Promise<{ correct: boolean }> {
  try {
    // Get the quiz
    const quiz = await getQuizById(quizId)
    if (!quiz) {
      throw new Error("Quiz not found")
    }

    const question = quiz.questions[questionIndex]
    const isCorrect = question.correct_answer === answer

    // In a real app, we would save this to a database
    // For now, we'll just return the result
    
    return { correct: isCorrect }
  } catch (error) {
    console.error("Failed to submit answer:", error)
    throw new Error("Failed to submit answer")
  }
}

// Get recent quizzes for the user
export async function getRecentQuizzes(): Promise<UserQuiz[]> {
  // In a real app, this would come from a database
  // For now, we'll return some sample data
  return [
    {
      id: "9-0", // General Knowledge - Easy
      title: "General Knowledge Quiz",
      description: "Test your knowledge on various topics",
      progress: 30,
      questions: 10,
      completed: 3,
      image: "/placeholder.svg?height=200&width=400&text=General%20Knowledge",
      tags: ["General", "Easy"],
    },
    {
      id: "15-1", // Video Games - Medium
      title: "Video Games Quiz",
      description: "Test your knowledge about video games",
      progress: 70,
      questions: 10,
      completed: 7,
      image: "/placeholder.svg?height=200&width=400&text=Video%20Games",
      tags: ["Gaming", "Medium"],
    },
    {
      id: "23-2", // History - Hard
      title: "History Quiz",
      description: "Test your knowledge of historical events",
      progress: 10,
      questions: 10,
      completed: 1,
      image: "/placeholder.svg?height=200&width=400&text=History",
      tags: ["History", "Hard"],
    },
  ]
}
