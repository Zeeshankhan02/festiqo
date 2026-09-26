import type {
  Event,
  Notice,
  Quiz,
  Rank,
  Registration,
  Scan,
  User,
} from "./types";

export const sampleUser: User = {
  id: "u1",
  name: "Rahul Sharma",
  email: "rahul@college.edu",
  role: "student",
  avatar: "https://i.pravatar.cc/150?u=rahul",
};
export const sampleEvent: Event = {
  id: "e1",
  title: "CodeSprint 2026",
  description:
    "A 24-hour hackathon for the curious, the builders, and the big thinkers.",
  date: "2026-10-15",
  time: "09:00 AM",
  venue: "Main Auditorium",
  category: "Technical",
  status: "upcoming",
  maxParticipants: 100,
  registered: 72,
  image:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
};
export const sampleRegistration: Registration = {
  id: "r1",
  eventId: "e1",
  userId: "u1",
  teamName: "ByteBusters",
  members: ["Rahul", "Priya"],
  registeredAt: "2026-09-18T10:30:00Z",
  status: "confirmed",
  ticketId: "TKT-2026-E1-R1",
};
export const sampleScan: Scan = {
  id: "v1",
  ticketId: "TKT-2026-E1-R1",
  scannedBy: "volunteer_01",
  scannedAt: "2026-10-15T08:45:00Z",
  status: "valid_entry",
};
export const sampleQuiz: Quiz = {
  id: "q1",
  title: "Tech Trivia",
  duration: 60,
  questions: [
    {
      id: "q1_1",
      text: "What does TS stand for?",
      options: ["TypeScript", "TensorScript", "TransScript", "TechScript"],
      correctAnswer: 0,
    },
  ],
};
export const sampleRank: Rank = {
  rank: 1,
  userName: "Rahul Sharma",
  score: 100,
  timeTaken: "12s",
};
export const sampleNotice: Notice = {
  id: "n1",
  type: "result",
  title: "Quiz Results Out",
  message: "Results for Tech Trivia published.",
  timestamp: "2026-09-19T14:00:00Z",
  isRead: false,
};
// ponytail: generated display rows keep the fixture file to one canonical object per entity.
export const events: Event[] = [
  sampleEvent,
  ...[
    [
      "e2",
      "Neon Nights",
      "An open-air music celebration, from campus bands to late-night DJs.",
      "Music",
      "2026-10-16",
      "06:30 PM",
      "Central Lawn",
      184,
      300,
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=85",
    ],
    [
      "e3",
      "The Big Frame",
      "A fast-paced short-film challenge for storytellers and filmmakers.",
      "Creative",
      "2026-10-17",
      "11:00 AM",
      "Media Lab",
      38,
      80,
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85",
    ],
  ].map(
    ([
      id,
      title,
      description,
      category,
      date,
      time,
      venue,
      registered,
      maxParticipants,
      image,
    ]) => ({
      ...sampleEvent,
      id: String(id),
      title: String(title),
      description: String(description),
      category: String(category),
      date: String(date),
      time: String(time),
      venue: String(venue),
      registered: Number(registered),
      maxParticipants: Number(maxParticipants),
      image: String(image),
    })
  ),
];
export const ranks: Rank[] = [
  sampleRank,
  ...[
    ["Aarav Mehta", 94, "18s"],
    ["Maya Kapoor", 89, "22s"],
    ["Ishaan Das", 82, "28s"],
  ].map(([userName, score, timeTaken], i) => ({
    rank: i + 2,
    userName: String(userName),
    score: Number(score),
    timeTaken: String(timeTaken),
  })),
];
export const notices: Notice[] = [
  sampleNotice,
  ...[
    [
      "n2",
      "event",
      "Neon Nights venue update",
      "Meet us at the Central Lawn. Doors open at 6 PM.",
      "2026-09-19T12:00:00Z",
      false,
    ],
    [
      "n3",
      "registration",
      "You’re on the list",
      "Your CodeSprint registration is confirmed.",
      "2026-09-18T10:30:00Z",
      true,
    ],
  ].map(([id, type, title, message, timestamp, isRead]) => ({
    id: String(id),
    type: String(type) as Notice["type"],
    title: String(title),
    message: String(message),
    timestamp: String(timestamp),
    isRead: Boolean(isRead),
  })),
];
