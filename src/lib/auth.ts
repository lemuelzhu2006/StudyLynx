export interface AuthUser {
  email: string
  password: string
  name: string
}

export async function loadUsers(): Promise<AuthUser[]> {
  try {
    const res = await fetch("/users.csv")
    const text = await res.text()
    const lines = text.trim().split("\n")
    if (lines.length < 2) return []
    const [, ...rows] = lines
    return rows.map((row) => {
      const [email, password, name] = row.split(",").map((s) => s.trim())
      return { email, password, name }
    })
  } catch {
    return []
  }
}

export async function authenticate(email: string, password: string): Promise<AuthUser | null> {
  const users = await loadUsers()
  const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password)
  return u ?? null
}

export function isNewUser(email: string, knownEmails: string[]): boolean {
  return !knownEmails.some((e) => e.toLowerCase() === email.toLowerCase())
}
