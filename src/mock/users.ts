export type UserRole = "client" | "host"

export interface MockUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string | null
  initials: string
  createdAt: string
}

export const mockUsers: MockUser[] = [
  {
    id: "u1",
    name: "Maria Santos",
    email: "maria@example.com",
    role: "client",
    avatar: null,
    initials: "MS",
    createdAt: "2025-03-10T10:00:00Z",
  },
  {
    id: "u2",
    name: "John Davis",
    email: "john@parkhub.com",
    role: "host",
    avatar: null,
    initials: "JD",
    createdAt: "2025-01-15T08:30:00Z",
  },
  {
    id: "u3",
    name: "Ana Costa",
    email: "ana@example.com",
    role: "client",
    avatar: null,
    initials: "AC",
    createdAt: "2025-05-20T14:00:00Z",
  },
  {
    id: "u4",
    name: "Carlos Mendes",
    email: "carlos@parkhub.com",
    role: "host",
    avatar: null,
    initials: "CM",
    createdAt: "2025-02-08T09:00:00Z",
  },
  {
    id: "u5",
    name: "Laura Kim",
    email: "laura@example.com",
    role: "client",
    avatar: null,
    initials: "LK",
    createdAt: "2025-07-01T16:30:00Z",
  },
  {
    id: "u6",
    name: "Rafael Torres",
    email: "rafael@parkhub.com",
    role: "host",
    avatar: null,
    initials: "RT",
    createdAt: "2025-04-12T11:00:00Z",
  },
]

export const defaultClient = mockUsers.find((u) => u.role === "client")!
export const defaultHost = mockUsers.find((u) => u.role === "host")!
