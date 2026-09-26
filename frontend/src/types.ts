export type Role = "student" | "volunteer" | "admin";
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
};
export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  status: "upcoming" | "live" | "ended";
  maxParticipants: number;
  registered: number;
  image: string;
};
export type Registration = {
  id: string;
  eventId: string;
  userId: string;
  teamName: string;
  members: string[];
  registeredAt: string;
  status: "confirmed" | "pending";
  ticketId: string;
};
export type Scan = {
  id: string;
  ticketId: string;
  scannedBy: string;
  scannedAt: string;
  status: "valid_entry" | "duplicate" | "invalid";
};
export type QuizQuestion = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
};
export type Quiz = {
  id: string;
  title: string;
  duration: number;
  questions: QuizQuestion[];
};
export type Rank = {
  rank: number;
  userName: string;
  score: number;
  timeTaken: string;
};
export type Notice = {
  id: string;
  type: "result" | "event" | "registration" | "announcement" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
};
