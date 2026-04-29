# PCOS Companion – MVP Design (Next.js + Clerk + OpenAI)

## 1. Design Philosophy

- Mobile-first experience
- Clean and calming UI
- Fast interactions
- AI as a supportive coach

---

## 2. Tech Stack

| Layer         | Technology            |
| ------------- | --------------------- |
| Frontend      | Next.js (App Router)  |
| Styling       | Tailwind CSS          |
| Auth          | Clerk                 |
| Database      | Supabase (PostgreSQL) |
| AI            | OpenAI API            |
| Backend Logic | Next.js API Routes    |

---

## 3. Architecture

Client (Next.js)
↓
Next.js API Routes
↓
OpenAI API
↓
Supabase Database

### Notes

- OpenAI calls only via API routes (secure)
- Clerk manages user identity
- Supabase handles data + RLS

---

## 4. Folder Structure

app/
├── (auth)/
├── onboarding/
├── dashboard/
├── log/
├── cycle/

app/api/
├── ai/route.js

components/
├── Card.jsx
├── Input.jsx
├── BottomNav.jsx

lib/
├── supabase.js
├── clerk.js

utils/
├── aiPrompt.js
├── ovulation.js

---

## 5. Database Design

### Profiles

- id (Clerk user ID)
- name
- age
- weight
- pcos

---

### Logs

- id
- user_id
- sleep
- water
- exercise
- created_at (date)

---

### Symptoms

- id
- user_id
- type
- severity
- created_at

---

### Cycles

- id
- user_id
- start_date
- end_date

---

## 6. AI System Design

## 6.1 Flow

1. Fetch user history
2. Preprocess data
3. Send structured prompt to OpenAI
4. Return response

---

## 6.2 Prompt Design

Example:

User has PCOS.
Here is their recent health data:

Sleep: 5 hours
Water: 1L
Exercise: 10 min

History:

Frequent fatigue
Irregular cycles

Give:

Short actionable tips
Friendly explanation

Tone: supportive coach, not medical

---

## 6.3 API Route

POST /api/ai

### Input

- userId

### Process

- Fetch logs + cycles + symptoms
- Build prompt
- Call OpenAI

### Output

- Advice text

---

## 6.4 Rate Limiting

- Max 10 calls/day/user
- Track in DB or memory

---

## 7. UI Design

## 7.1 Layout

max-w-md
mx-auto
min-h-screen
p-4

---

## 7.2 Navigation

Bottom Tabs:

- Dashboard
- Log
- Cycle

---

## 7.3 Screens

### Dashboard

- Greeting
- Today’s data
- AI advice card

---

### Log Screen

- Sleep input
- Water input
- Exercise input
- Symptoms dropdown

---

### Cycle Screen

- Date pickers
- Predicted ovulation display

---

## 8. Ovulation Logic

Simple formula:

Ovulation Day = Cycle Length - 14

Use average of past cycles.

---

## 9. State Management

- Server Components for data
- Minimal client state
- Fetch on render

---

## 10. Performance

- Cache AI responses
- Avoid unnecessary re-fetch
- Use server actions

---

## 11. Security

- Clerk handles auth
- API routes protect OpenAI key
- Supabase RLS for data isolation

---

## 12. Error Handling

- Form validation
- API error fallback
- Empty state UI

---

## 13. Future Enhancements

- Real AI personalization
- Charts and analytics
- Habit streaks
- Community features

---

## 14. Design Success Criteria

- App feels like mobile app
- Smooth navigation
- AI response feels human
- Minimal friction UX
