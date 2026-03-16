# ARCHITECTURE.md

## System Overview

This project is an AI-powered journaling system where users can write journal entries and receive AI-generated insights such as:

- Emotion detection
- Keyword extraction
- Summary generation

Tech Stack:
- Frontend: React
- Backend: Node.js with Express
- Database: MongoDB
- AI Analysis: LLM API

The system is designed to be scalable, secure, and cost-efficient.

-----------------------------------------------------

## High Level Architecture

Users
  |
Frontend (React)
  |
API Server (Node.js + Express)
  |
  |-- Authentication (JWT)
  |-- Journal APIs
  |-- Insights APIs
  |
MongoDB Database
  |
LLM Service (Emotion Analysis)

-----------------------------------------------------

## 1. How would you scale this to 100k users?

To support 100k users, the system would need improvements in infrastructure and database performance.

Horizontal Scaling

Instead of running a single backend server, deploy multiple Node.js servers behind a load balancer.

Example:

Load Balancer
   |
----------------------
|        |           |
API      API         API
Server   Server      Server

This distributes incoming traffic across multiple servers.

Database Optimization

Add indexes for frequently used queries.

Example:

journalSchema.index({ userId: 1 });

This improves performance when fetching journals for a user.

MongoDB can also scale using:
- MongoDB clusters
- Database sharding

Asynchronous AI Processing

LLM analysis can be slow. Instead of processing it during the request:

1. Save the journal entry
2. Send a job to a queue
3. A worker processes the AI analysis
4. Update the journal entry with results

This keeps the API fast and scalable.

-----------------------------------------------------

## 2. How would you reduce LLM cost?

LLM usage can become expensive if every request triggers AI analysis.

Limit Input Size

Only send necessary text to the LLM.

Example:

const limitedText = text.slice(0, 500);

This reduces token usage.

Store Analysis Results

Once a journal entry is analyzed, store the results in the database.

Example document:

{
 text: "...",
 emotion: "calm",
 keywords: ["rain", "peace"],
 summary: "User felt relaxed after listening to rain"
}

This ensures the analysis is done only once per entry.

Use Smaller Models

Emotion detection and keyword extraction can work with smaller and cheaper models.

Batch Requests

Multiple journal entries can be analyzed together to reduce the number of API calls.

Optional: Self-hosted Models

Open-source models (such as Llama or Mistral) can reduce dependency on paid APIs.

-----------------------------------------------------

## 3. How would you cache repeated analysis?

Users may write similar journal entries. Re-analyzing the same text wastes resources.

A caching system can be implemented using Redis.

Process:

1. Generate a hash from the journal text
2. Check if the result exists in Redis
3. If cached → return cached result
4. If not cached → call the LLM and store the result

Example flow:

Journal Text
     |
Generate Hash
     |
Check Redis
     |
Found → Return Cached Result
Not Found → Call LLM
     |
Store Result in Redis

Example code:

const hash = crypto.createHash("md5").update(text).digest("hex");

const cached = await redis.get(hash);

if (cached) {
  return JSON.parse(cached);
}

const result = await analyzeEmotion(text);

await redis.set(hash, JSON.stringify(result), "EX", 86400);

This reduces both LLM cost and response time.

-----------------------------------------------------

## 4. How would you protect sensitive journal data?

Journal entries may contain private and personal information, so security is very important.

Encryption at Rest

Journal text can be encrypted before storing it in the database using strong encryption such as AES-256.

Secure Communication

All communication between frontend and backend should use HTTPS.

Authentication

Use JWT-based authentication so only authorized users can access the system.

Example request header:

Authorization: Bearer <token>

Access Control

Users should only be able to access their own journal entries.

Example query:

Journal.find({ userId: req.userId });

Data Minimization

Only send necessary information to the AI service to reduce exposure of personal data.

Rate Limiting

Limit API requests per user to prevent abuse.

Example:

100 requests per minute per user

-----------------------------------------------------

## Conclusion

This architecture ensures that the system is:

- Scalable (can support large numbers of users)
- Secure (protects sensitive journal data)
- Cost-efficient (reduces LLM usage)
- Fast (uses caching and asynchronous processing)

The system can scale to tens of thousands of users while maintaining performance and reliability.


