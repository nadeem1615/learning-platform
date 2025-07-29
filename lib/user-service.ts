"use server"

import { Award, Flame, Trophy } from "lucide-react"
import { cookies } from "next/headers"

// Get user stats
export async function getUserStats() {
  // In a real app, this would come from a database
  // For now, we'll use cookies to store some basic stats
  const cookieStore = cookies()
  const userStatsStr = cookieStore.get("userStats")?.value

  // Default stats if none exist
  const defaultStats = {
    name: "Alex Johnson",
    level: 12,
    xp: 2450,
    streak: 5,
    completedQuizzes: [
      {
        id: "17-0",
        title: "Science & Nature Quiz",
        description: "Test your knowledge of scientific facts",
        questions: 10,
        image: "/placeholder.svg?height=200&width=400&text=Science",
        tags: ["Science", "Easy"],
      },
    ],
    recentAchievements: [
      {
        id: "1",
        icon: "award",
        title: "Fast Learner",
        description: "Completed 5 quizzes in one day",
        date: "Today",
        xp: 150,
      },
      {
        id: "2",
        icon:"trophy",
        title: "Quiz Master",
        description: "Scored 100% on 3 consecutive quizzes",
        date: "Yesterday",
        xp: 200,
      },
      {
        id: "3",
        icon: "flame",
        title: "On Fire",
        description: "Maintained a 5-day learning streak",
        date: "2 days ago",
        xp: 100,
      },
    ],
    leaderboard: [
      { id: "1", rank: 1, name: "Sarah J.", points: 3200 },
      { id: "2", rank: 2, name: "Michael T.", points: 2950 },
      { id: "3", rank: 3, name: "Alex Johnson", points: 2450, isUser: true },
      { id: "4", rank: 4, name: "David L.", points: 2300 },
      { id: "5", rank: 5, name: "Emma R.", points: 2100 },
    ],
    dailyChallenges: [
      {
        id: "1",
        title: "Quiz Champion",
        description: "Complete 3 quizzes with at least 80% score",
        reward: 100,
        progress: 1,
        total: 3,
      },
      {
        id: "2",
        title: "Study Session",
        description: "Spend 30 minutes learning today",
        reward: 50,
        progress: 15,
        total: 30,
      },
      {
        id: "3",
        title: "Perfect Score",
        description: "Get 100% on any quiz",
        reward: 150,
        progress: 0,
        total: 1,
      },
    ],
  }

  // If we have stored stats, merge them with defaults
  if (userStatsStr) {
    try {
      const storedStats = JSON.parse(userStatsStr)
      return {
        ...defaultStats,
        ...storedStats,
      }
    } catch (e) {
      // If parsing fails, return defaults
      return defaultStats
    }
  }

  // Initialize user stats in cookies
  cookieStore.set(
    "userStats",
    JSON.stringify({
      xp: defaultStats.xp,
      completedQuizzes: defaultStats.completedQuizzes,
    }),
    {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    },
  )

  return defaultStats
}

// Update user XP
export async function updateUserXP(xpToAdd: number) {
  const cookieStore = cookies()
  const userStatsStr = cookieStore.get("userStats")?.value

  if (userStatsStr) {
    try {
      const userStats = JSON.parse(userStatsStr)
      userStats.xp = (userStats.xp || 0) + xpToAdd

      cookieStore.set("userStats", JSON.stringify(userStats), {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      })

      return { success: true, newXP: userStats.xp }
    } catch (e) {
      return { success: false, error: "Failed to update XP" }
    }
  }

  return { success: false, error: "User stats not found" }
}

// Add completed quiz
export async function addCompletedQuiz(quiz: any) {
  const cookieStore = cookies()
  const userStatsStr = cookieStore.get("userStats")?.value

  if (userStatsStr) {
    try {
      const userStats = JSON.parse(userStatsStr)

      // Add to completed quizzes if not already there
      if (!userStats.completedQuizzes) {
        userStats.completedQuizzes = []
      }

      if (!userStats.completedQuizzes.some((q: any) => q.id === quiz.id)) {
        userStats.completedQuizzes.push(quiz)
      }

      cookieStore.set("userStats", JSON.stringify(userStats), {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      })

      return { success: true }
    } catch (e) {
      return { success: false, error: "Failed to update completed quizzes" }
    }
  }

  return { success: false, error: "User stats not found" }
}
