import type { WeeklyAvailability } from "./store-types"

export type StudyStyle =
  | "quiet-study"
  | "active-discussion"
  | "collaborative-problem-solving"
  | "peer-teaching"
  | "focused-review"
  | "catch-up-session"

export type RecommendationReason =
  | "same-course"
  | "similar-study-style"
  | "near-default-location"
  | "same-goal"

export interface Student {
  id: string
  name: string
  avatar: string
  verified: boolean
  subject: string
  programType: string
  year: number
  courses: string[]
  preferredTime?: string
  defaultLocation?: string
  habits?: string
  studentId?: string
  weeklyAvailability?: WeeklyAvailability
  program?: string
}

export interface Session {
  id: string
  student: Student
  location: string
  course: string
  goal: string
  studyStyle: StudyStyle
  duration: string
  time: string
  date: string
  recommendationReasons: RecommendationReason[]
}

export interface SavedPartner extends Student {
  sharedCourses: string[]
  fitSummary: string
}

export const COURSES = [
  "CSC343", "CSC165", "MAT137", "CSC318", "CSC311", "CSC309", "STA247", "ECO101",
] as const

export const SUBJECTS = ["CS", "Math", "Statistics", "Economics", "Other"] as const
export const PROGRAM_TYPES = ["Specialist", "Major", "Minor"] as const
export const ACADEMIC_LEVELS = ["Undergraduate", "Graduate", "Other"] as const
export const YEARS = [1, 2, 3, 4, 5] as const

export const LOCATIONS = [
  "Robarts Library",
  "Kelly Library",
  "Bahen Centre for Information Technology",
  "University College Library",
  "Near Bloor",
  "Claude T. Bissell",
] as const

export const LOCATION_COORDS: Record<string, [number, number]> = {
  "Robarts Library": [43.6681, -79.3955],
  "Kelly Library": [43.6622, -79.3895],
  "Bahen Centre for Information Technology": [43.6609, -79.3956],
  "University College Library": [43.6628, -79.3945],
  "Near Bloor": [43.6678, -79.399],
  "Claude T. Bissell": [43.667, -79.396],
}

export const STUDY_STYLES: { id: StudyStyle; label: string }[] = [
  { id: "quiet-study", label: "Quiet study" },
  { id: "active-discussion", label: "Active discussion" },
  { id: "collaborative-problem-solving", label: "Collaborative problem solving" },
  { id: "peer-teaching", label: "Peer teaching" },
  { id: "focused-review", label: "Focused review" },
  { id: "catch-up-session", label: "Catch-up session" },
]

export const GOALS = [
  "Prepare for midterm",
  "Review logic proof structure",
  "Ask each other questions",
  "Catch up on missed material",
  "Polish details before an assignment",
  "Work through problem sets together",
] as const

export const RECOMMENDATION_LABELS: Record<RecommendationReason, string> = {
  "same-course": "Same course",
  "similar-study-style": "Similar study style",
  "near-default-location": "Near your default location",
  "same-goal": "Same goal",
}

function futureDate(daysFromNow: number): string {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  return d.toISOString().split("T")[0]
}

function wa(days: Partial<Record<"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun", [string, string]>>): WeeklyAvailability {
  const base: WeeklyAvailability = {
    mon: { enabled: false, start: "09:00", end: "12:00" },
    tue: { enabled: false, start: "09:00", end: "12:00" },
    wed: { enabled: false, start: "09:00", end: "12:00" },
    thu: { enabled: false, start: "09:00", end: "12:00" },
    fri: { enabled: false, start: "09:00", end: "12:00" },
    sat: { enabled: false, start: "10:00", end: "14:00" },
    sun: { enabled: false, start: "10:00", end: "14:00" },
  }
  for (const [k, [s, e]] of Object.entries(days)) {
    const key = k as keyof WeeklyAvailability
    base[key] = { enabled: true, start: s, end: e }
  }
  return base
}

function st(id: string, name: string, avatar: string, verified: boolean, subject: string, programType: string, rest: Partial<Student>): Student {
  return { id, name, avatar, verified, subject, programType, program: `${subject} ${programType}`, year: 1, courses: [], ...rest }
}

export const ALL_STUDENTS: Student[] = [
  st("1", "Diego Zhu", "DZ", true, "CS", "Specialist", {
    preferredTime: "Tue, Fri afternoons",
    defaultLocation: "Robarts Library",
    habits: "Quiet study",
    studentId: "1001234567",
    year: 1,
    courses: ["CSC343", "CSC165"],
    weeklyAvailability: wa({ tue: ["13:30", "16:45"], fri: ["14:00", "17:00"] }),
  }),
  st("2", "Alex Chen", "AC", true, "CS", "Major", {
    year: 2, courses: ["CSC165", "MAT137"], defaultLocation: "Kelly Library",
    habits: "Active discussion", studentId: "1002345678",
    weeklyAvailability: wa({ mon: ["14:00", "16:00"], wed: ["14:00", "16:00"], fri: ["10:00", "12:00"] }),
  }),
  st("3", "Jordan Lee", "JL", false, "Math", "Major", {
    year: 1, courses: ["MAT137"], defaultLocation: "Near Bloor",
    habits: "Collaborative problem solving", studentId: "1003456789",
    weeklyAvailability: wa({ tue: ["15:00", "17:00"], thu: ["15:00", "17:00"] }),
  }),
  st("4", "Sam Patel", "SP", true, "CS", "Specialist", {
    year: 2, courses: ["CSC343", "CSC318", "STA247"], defaultLocation: "Bahen Centre for Information Technology",
    habits: "Peer teaching", studentId: "1004567890",
    weeklyAvailability: wa({ mon: ["13:00", "15:00"], wed: ["13:00", "15:00"], thu: ["13:00", "15:00"] }),
  }),
  st("5", "Maya Kim", "MK", true, "Statistics", "Major", {
    year: 1, courses: ["STA247", "MAT137"], defaultLocation: "Robarts Library",
    habits: "Focused review", studentId: "1005678901",
    weeklyAvailability: wa({ tue: ["14:30", "16:00"], fri: ["14:30", "16:00"], sat: ["10:00", "13:00"] }),
  }),
  st("6", "Taylor Wong", "TW", true, "CS", "Minor", {
    year: 3, courses: ["CSC309", "CSC311"], defaultLocation: "University College Library",
    habits: "Active discussion", studentId: "1006789012",
    weeklyAvailability: wa({ mon: ["10:00", "12:00"], wed: ["10:00", "12:00"] }),
  }),
  st("7", "Riley Moore", "RM", false, "Economics", "Major", {
    year: 2, courses: ["ECO101", "MAT137"], defaultLocation: "Kelly Library",
    habits: "Quiet study", studentId: "1007890123",
    weeklyAvailability: wa({ tue: ["16:00", "17:30"], thu: ["16:00", "17:30"] }),
  }),
  st("8", "Jordan Hayes", "JH", true, "Math", "Specialist", {
    year: 1, courses: ["MAT137", "CSC165"], defaultLocation: "Claude T. Bissell",
    habits: "Collaborative problem solving", studentId: "1008901234",
    weeklyAvailability: wa({ wed: ["15:00", "17:00"], fri: ["15:00", "17:00"] }),
  }),
  st("9", "Morgan Reed", "MR", true, "CS", "Major", {
    year: 2, courses: ["CSC343", "STA247"], defaultLocation: "Robarts Library",
    habits: "Peer teaching", studentId: "1009012345",
    weeklyAvailability: wa({ mon: ["12:00", "14:00"], thu: ["12:00", "14:00"] }),
  }),
  st("10", "Casey Park", "CP", false, "Statistics", "Minor", {
    year: 3, courses: ["STA247", "ECO101"], defaultLocation: "Kelly Library",
    habits: "Quiet study", studentId: "1010123456",
    weeklyAvailability: wa({ wed: ["15:00", "16:30"], sat: ["11:00", "14:00"] }),
  }),
  st("11", "Blake Sullivan", "BS", true, "Math", "Major", {
    year: 2, courses: ["MAT137", "CSC165"], defaultLocation: "Bahen Centre for Information Technology",
    habits: "Active discussion", studentId: "1011234567",
    weeklyAvailability: wa({ tue: ["16:00", "18:00"], fri: ["16:00", "18:00"] }),
  }),
]

export const ALL_SESSIONS: Session[] = [
  {
    id: "s1", student: ALL_STUDENTS[0], location: "Robarts Library",
    course: "CSC343", goal: "Looking for someone to prepare for the midterm together and ask each other questions.",
    studyStyle: "quiet-study", duration: "1.5–2 hr", time: "13:30 – 16:45", date: futureDate(1),
    recommendationReasons: [],
  },
  {
    id: "s2", student: ALL_STUDENTS[1], location: "Kelly Library",
    course: "CSC165", goal: "Review logic proof structure together.",
    studyStyle: "active-discussion", duration: "2 hr", time: "14:00 – 16:00", date: futureDate(2),
    recommendationReasons: [],
  },
  {
    id: "s3", student: ALL_STUDENTS[2], location: "Near Bloor",
    course: "MAT137", goal: "Catch up on missed material and work through problem sets.",
    studyStyle: "collaborative-problem-solving", duration: "1.5 hr", time: "15:00 – 16:30", date: futureDate(3),
    recommendationReasons: [],
  },
  {
    id: "s4", student: ALL_STUDENTS[3], location: "Bahen Centre for Information Technology",
    course: "CSC318", goal: "Work through UI design concepts together.",
    studyStyle: "peer-teaching", duration: "2 hr", time: "13:00 – 15:00", date: futureDate(1),
    recommendationReasons: [],
  },
  {
    id: "s5", student: ALL_STUDENTS[4], location: "Robarts Library",
    course: "STA247", goal: "Prepare for midterm and ask each other questions.",
    studyStyle: "focused-review", duration: "1.5 hr", time: "14:30 – 16:00", date: futureDate(4),
    recommendationReasons: [],
  },
  {
    id: "s6", student: ALL_STUDENTS[5], location: "University College Library",
    course: "CSC309", goal: "Polish details before an assignment.",
    studyStyle: "active-discussion", duration: "2 hr", time: "10:00 – 12:00", date: futureDate(2),
    recommendationReasons: [],
  },
  {
    id: "s7", student: ALL_STUDENTS[6], location: "Kelly Library",
    course: "ECO101", goal: "Catch up on missed material.",
    studyStyle: "quiet-study", duration: "1.5 hr", time: "16:00 – 17:30", date: futureDate(5),
    recommendationReasons: [],
  },
  {
    id: "s8", student: ALL_STUDENTS[7], location: "Claude T. Bissell",
    course: "MAT137", goal: "Work through problem sets together.",
    studyStyle: "collaborative-problem-solving", duration: "2 hr", time: "15:00 – 17:00", date: futureDate(3),
    recommendationReasons: [],
  },
  {
    id: "s9", student: ALL_STUDENTS[8], location: "Robarts Library",
    course: "CSC343", goal: "Prepare for midterm and review proofs.",
    studyStyle: "peer-teaching", duration: "2 hr", time: "12:00 – 14:00", date: futureDate(6),
    recommendationReasons: [],
  },
  {
    id: "s10", student: ALL_STUDENTS[9], location: "Kelly Library",
    course: "STA247", goal: "Polish details before an assignment.",
    studyStyle: "quiet-study", duration: "1.5 hr", time: "15:00 – 16:30", date: futureDate(4),
    recommendationReasons: [],
  },
  {
    id: "s11", student: ALL_STUDENTS[10], location: "Bahen Centre for Information Technology",
    course: "MAT137", goal: "Ask each other questions and review logic.",
    studyStyle: "active-discussion", duration: "2 hr", time: "16:00 – 18:00", date: futureDate(5),
    recommendationReasons: [],
  },
]

export function getRecommendedSessions(
  userCoursesStr: string,
  userLocation: string,
  userHabits: string,
  date?: string
): Session[] {
  const userCourses = userCoursesStr ? userCoursesStr.split(",").map((c) => c.trim()) : []
  const userGoals = ["midterm", "proof", "questions", "catch up", "polish", "problem"]
  const habitToStyle: Record<string, StudyStyle> = {
    "quiet": "quiet-study",
    "active": "active-discussion",
    "collaborative": "collaborative-problem-solving",
    "peer": "peer-teaching",
    "focused": "focused-review",
    "catch-up": "catch-up-session",
  }
  let userStyle: StudyStyle = "quiet-study"
  const habitsLower = userHabits.toLowerCase()
  for (const [k, v] of Object.entries(habitToStyle)) {
    if (habitsLower.includes(k)) { userStyle = v; break }
  }

  let sessions = ALL_SESSIONS
  if (date) sessions = sessions.filter((s) => s.date === date)

  return sessions.map((session) => {
    const reasons: RecommendationReason[] = []
    if (userCourses.some((c) => session.course === c || session.student.courses.includes(c)))
      reasons.push("same-course")
    if (session.studyStyle === userStyle) reasons.push("similar-study-style")
    if (session.location === userLocation || session.location.includes(userLocation.split(" ")[0]))
      reasons.push("near-default-location")
    if (userGoals.some((g) => session.goal.toLowerCase().includes(g)))
      reasons.push("same-goal")
    return { ...session, recommendationReasons: reasons }
  }).filter((s) => s.recommendationReasons.length > 0)
}

export function getMatchingSessions(
  course: string,
  _location: string,
  studyStyle: string,
  goal: string,
  date?: string
): Session[] {
  const styleId = STUDY_STYLES.find((s) => s.label === studyStyle)?.id ?? "quiet-study"
  const goalLower = goal.toLowerCase()

  let sessions = ALL_SESSIONS
  if (date) sessions = sessions.filter((s) => s.date === date)

  const byCourse = sessions.filter((s) => s.course === course)
  const matched = byCourse.filter((s) => {
    const styleMatch = s.studyStyle === styleId
    const goalMatch =
      !goal.trim() ||
      goalLower.split(/\s+/).some((w) => w.length > 2 && s.goal.toLowerCase().includes(w))
    return styleMatch || goalMatch
  })
  return (matched.length > 0 ? matched : byCourse).slice(0, 3)
}

export const savedPartners: SavedPartner[] = [
  { ...ALL_STUDENTS[0], sharedCourses: ["CSC343", "CSC165"], fitSummary: "Great quiet study partner, same midterm goals" },
  { ...ALL_STUDENTS[1], sharedCourses: ["CSC165"], fitSummary: "Good for logic review sessions" },
]

export const chatPrompts = {
  opening: [
    "Hi — want to study together for [COURSE]?",
    "No pressure — open to one trial session?",
    "Let's do a focused session this week.",
  ],
  alignment: [
    "I prefer short sessions — does that work?",
    "I'm open to one trial session first.",
    "I'm behind and need a catch-up session.",
    "I'm mostly on track — want to polish details together?",
  ],
  "time-setting": [
    "Does 2 hours work for you?",
    "Would tomorrow afternoon work?",
    "Let's aim for 1.5 hours.",
  ],
  followup: [
    "Same time next week?",
    "Want to schedule another session?",
    "That was helpful — thanks!",
  ],
  refusal: [
    "Sorry, I can't make that time.",
    "Maybe another day?",
    "I'll pass for now.",
  ],
}

export function getStudentById(id: string): Student | undefined {
  return ALL_STUDENTS.find((s) => s.id === id)
}

export function getStudentByName(name: string): Student | undefined {
  return ALL_STUDENTS.find((s) => s.name.toLowerCase() === name.toLowerCase())
}

export function getSessionById(id: string): Session | undefined {
  return ALL_SESSIONS.find((s) => s.id === id)
}

export function formatSessionDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00")
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

export function formatTimeRange(start: string, end: string): string {
  const fmt = (t: string) => {
    const [h, m] = t.split(":").map(Number)
    const ampm = h >= 12 ? "PM" : "AM"
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`
  }
  return `${fmt(start)} – ${fmt(end)}`
}
