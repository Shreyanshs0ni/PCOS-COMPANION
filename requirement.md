# PCOS Companion – MVP Requirements (Clerk + OpenAI)

## 1. Overview

### 1.1 Product Vision

PCOS Companion is a **mobile-first AI health companion** designed specifically for women diagnosed with PCOS.  
It helps users track daily health data and provides **personalized, friendly AI-driven guidance**.

### 1.2 MVP Goal

> Deliver a system where users log daily data and receive **context-aware AI coaching based on full history**.

---

## 2. Target Users

- Women diagnosed with PCOS
- Age: 16–35 (primary range)
- Comfortable with smartphone apps
- Seeking lifestyle guidance (not medical diagnosis)

---

## 3. Core Value Proposition

> A **friendly AI coach** that understands your history and gives actionable daily guidance.

---

## 4. Functional Requirements

## 4.1 Authentication (Clerk)

### Features

- Email/password login
- Google OAuth login
- Session persistence

### Flow

- **Sign Up → Onboarding**
- **Sign In → Dashboard**

---

## 4.2 Onboarding

### Purpose

Collect initial user data for personalization.

### Fields

- Name
- Age
- Weight
- PCOS confirmation (boolean)

### Requirements

- Mandatory after signup
- Stored in database (linked with Clerk user ID)

---

## 4.3 Daily Logging System

### Constraint

- One log per user per day

### Inputs

- Sleep (hours)
- Water intake (liters)
- Exercise (minutes)
- Symptoms (fixed list)
- Optional notes

### Requirements

- Overwrite/update same-day log
- Timestamped
- Linked to user ID

---

## 4.4 Symptoms System

### Type

Fixed predefined list

### Example

- Acne
- Fatigue
- Mood swings
- Hair loss
- Irregular periods

### Input

- Symptom type
- Severity (1–5)

---

## 4.5 Cycle Tracking + Ovulation

### Inputs

- Cycle start date
- Cycle end date

### Features

- Store history
- Predict ovulation window (basic logic)

### Requirements

- Use average cycle length
- Display next predicted ovulation

---

## 4.6 Dashboard

### Content

- Today’s log summary
- AI-generated advice

### Requirements

- Mobile-first layout
- Minimal UI
- Fast load

---

## 4.7 AI Recommendation System (OpenAI)

### Type

Hybrid system:

- Data preprocessing (rules)
- AI-generated explanation

---

### Input to AI

- Latest log
- Full historical data
- Cycle data
- Symptom trends

---

### Output

- Short actionable tips
- Friendly explanation

---

### Behavior

- Friendly coach tone
- Non-medical guidance
- Encouraging and supportive

---

### Constraints

- Max 10 API calls per user per day
- Cached responses allowed

---

## 4.8 Navigation

### Style

Bottom tab navigation

### Tabs

- Dashboard
- Log
- Cycle

---

## 5. Non-Functional Requirements

## 5.1 Performance

- Page load < 2s
- AI response < 5s

---

## 5.2 Usability

- Logging time < 30 seconds
- Minimal inputs
- Mobile-first UI

---

## 5.3 Security

- Clerk authentication
- Supabase Row Level Security
- API routes protect OpenAI key

---

## 5.4 Reliability

- No duplicate logs per day
- Data consistency across sessions

---

## 5.5 Scalability

- Modular DB schema
- Extendable AI system

---

## 6. Constraints

- Requires internet
- Depends on user input accuracy
- Not a medical diagnosis tool

---

## 7. Success Criteria

- User logs data successfully
- AI gives meaningful advice
- Smooth mobile UX
- No crashes/errors

---

## 8. Definition of Done

- Clerk auth working
- Onboarding implemented
- Logging system functional
- AI recommendations integrated
- Dashboard complete
- Mobile responsive UI
