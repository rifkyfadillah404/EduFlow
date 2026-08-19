import { PrismaClient } from '../src/generated/prisma/client.js'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { hash } from 'bcryptjs'

const adapter = new PrismaLibSql({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Clean existing data
  await prisma.certificate.deleteMany()
  await prisma.quizAttempt.deleteMany()
  await prisma.quizQuestion.deleteMany()
  await prisma.quiz.deleteMany()
  await prisma.lessonProgress.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const adminPassword = await hash('password123', 10)
  const studentPassword = await hash('password123', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin EduFlow',
      email: 'admin@eduflow.dev',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  })

  const student = await prisma.user.create({
    data: {
      name: 'Student Demo',
      email: 'student@eduflow.dev',
      passwordHash: studentPassword,
      role: 'STUDENT',
    },
  })

  // Course 1: Frontend Fundamentals
  const course1 = await prisma.course.create({
    data: {
      title: 'Frontend Fundamentals',
      slug: 'frontend-fundamentals',
      shortDescription: 'Learn the basics of HTML, CSS, and JavaScript',
      description:
        'This course covers the essential building blocks of web development. You will learn how to structure content with HTML, style it with CSS, and add interactivity with JavaScript.',
      category: 'Web Development',
      level: 'BEGINNER',
      isPublished: true,
      createdBy: admin.id,
    },
  })

  await prisma.lesson.createMany({
    data: [
      {
        courseId: course1.id,
        title: 'Introduction to HTML',
        slug: 'intro-html',
        contentType: 'TEXT',
        body: '# Introduction to HTML\n\nHTML (HyperText Markup Language) is the standard markup language for creating web pages.\n\n## Key Concepts\n\n- **Elements**: The building blocks of HTML\n- **Tags**: Used to create elements (`<p>`, `<div>`, `<h1>`)\n- **Attributes**: Provide additional info about elements\n\n## Example\n\n```html\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Hello World</h1>\n    <p>This is my first web page.</p>\n  </body>\n</html>\n```\n\nHTML is the foundation of every website. Master it, and you can build anything.',
        orderIndex: 0,
        isPreview: true,
      },
      {
        courseId: course1.id,
        title: 'Styling with CSS',
        slug: 'styling-css',
        contentType: 'TEXT',
        body: '# Styling with CSS\n\nCSS (Cascading Style Sheets) controls how HTML elements are displayed.\n\n## Selectors\n\n- Element: `p { color: blue; }`\n- Class: `.card { padding: 1rem; }`\n- ID: `#header { background: black; }`\n\n## Box Model\n\nEvery element is a box with:\n- Content\n- Padding\n- Border\n- Margin\n\n## Flexbox\n\n```css\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 1rem;\n}\n```\n\nFlexbox makes layout easy and responsive.',
        orderIndex: 1,
      },
      {
        courseId: course1.id,
        title: 'JavaScript Basics',
        slug: 'js-basics',
        contentType: 'TEXT',
        body: '# JavaScript Basics\n\nJavaScript adds interactivity to your web pages.\n\n## Variables\n\n```js\nconst name = "EduFlow";\nlet count = 0;\n```\n\n## Functions\n\n```js\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n```\n\n## DOM Manipulation\n\n```js\nconst btn = document.querySelector("#myBtn");\nbtn.addEventListener("click", () => {\n  alert("Clicked!");\n});\n```\n\nJavaScript is essential for building modern web applications.',
        orderIndex: 2,
      },
    ],
  })

  // Course 2: React for Beginners
  const course2 = await prisma.course.create({
    data: {
      title: 'React for Beginners',
      slug: 'react-beginners',
      shortDescription: 'Build modern UIs with React',
      description:
        'Learn React from scratch. This course covers components, props, state, effects, and data fetching to build real applications.',
      category: 'Frontend',
      level: 'INTERMEDIATE',
      isPublished: true,
      createdBy: admin.id,
    },
  })

  await prisma.lesson.createMany({
    data: [
      {
        courseId: course2.id,
        title: 'Components and Props',
        slug: 'components-props',
        contentType: 'TEXT',
        body: '# Components and Props\n\nReact apps are built from components — reusable pieces of UI.\n\n## Function Component\n\n```jsx\nfunction Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n```\n\n## Props\n\nProps are inputs to components — read-only data passed from parent to child.\n\n```jsx\n<Welcome name="Rifky" />\n```\n\nComponents let you split UI into independent, reusable pieces.',
        orderIndex: 0,
        isPreview: true,
      },
      {
        courseId: course2.id,
        title: 'State and Events',
        slug: 'state-events',
        contentType: 'TEXT',
        body: '# State and Events\n\nState lets components remember things between renders.\n\n## useState\n\n```jsx\nimport { useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Clicked {count} times\n    </button>\n  );\n}\n```\n\n## Event Handling\n\nReact events use camelCase: `onClick`, `onChange`, `onSubmit`.\n\nState + events = interactive UIs.',
        orderIndex: 1,
      },
      {
        courseId: course2.id,
        title: 'Effects and Data Fetching',
        slug: 'effects-data',
        contentType: 'TEXT',
        body: '# Effects and Data Fetching\n\nuseEffect lets you synchronize with external systems.\n\n## Basic Effect\n\n```jsx\nimport { useEffect, useState } from "react";\n\nfunction Posts() {\n  const [posts, setPosts] = useState([]);\n\n  useEffect(() => {\n    fetch("/api/posts")\n      .then(res => res.json())\n      .then(setPosts);\n  }, []);\n\n  return posts.map(p => <div key={p.id}>{p.title}</div>);\n}\n```\n\nEffects run after render. The dependency array controls when they re-run.',
        orderIndex: 2,
      },
    ],
  })

  // Course 3: Backend API Basics
  const course3 = await prisma.course.create({
    data: {
      title: 'Backend API Basics',
      slug: 'backend-api-basics',
      shortDescription: 'Understand REST APIs and authentication',
      description:
        'Learn what APIs are, how REST works, and how to implement basic authentication. Perfect foundation for fullstack development.',
      category: 'Backend',
      level: 'BEGINNER',
      isPublished: true,
      createdBy: admin.id,
    },
  })

  await prisma.lesson.createMany({
    data: [
      {
        courseId: course3.id,
        title: 'What is an API?',
        slug: 'what-is-api',
        contentType: 'TEXT',
        body: '# What is an API?\n\nAPI (Application Programming Interface) is a set of rules that allows programs to communicate.\n\n## REST API\n\nREST uses HTTP methods:\n- **GET** — Read data\n- **POST** — Create data\n- **PUT/PATCH** — Update data\n- **DELETE** — Remove data\n\n## Example\n\n```\nGET    /api/users       → list users\nGET    /api/users/1     → get user 1\nPOST   /api/users       → create user\nDELETE /api/users/1     → delete user 1\n```\n\nAPIs are the bridge between frontend and backend.',
        orderIndex: 0,
        isPreview: true,
      },
      {
        courseId: course3.id,
        title: 'REST API Concepts',
        slug: 'rest-concepts',
        contentType: 'TEXT',
        body: '# REST API Concepts\n\n## Status Codes\n\n- `200` — OK\n- `201` — Created\n- `400` — Bad Request\n- `401` — Unauthorized\n- `404` — Not Found\n- `500` — Internal Server Error\n\n## JSON\n\nAPIs typically exchange data as JSON:\n\n```json\n{\n  "id": 1,\n  "name": "Rifky",\n  "email": "rifky@example.com"\n}\n```\n\n## Headers\n\n- `Content-Type: application/json`\n- `Authorization: Bearer <token>`\n\nUnderstanding these concepts is key to working with any API.',
        orderIndex: 1,
      },
      {
        courseId: course3.id,
        title: 'Authentication Basics',
        slug: 'auth-basics',
        contentType: 'TEXT',
        body: '# Authentication Basics\n\nAuthentication verifies who a user is.\n\n## Common Methods\n\n1. **Session-based**: Server stores session, sends cookie\n2. **Token-based (JWT)**: Server sends signed token, client sends it back\n3. **OAuth**: Login with Google/GitHub/etc.\n\n## JWT Flow\n\n1. User sends email + password\n2. Server validates, creates JWT\n3. Client stores JWT\n4. Client sends JWT in Authorization header\n5. Server verifies JWT on each request\n\n```\nAuthorization: Bearer eyJhbGciOiJIUzI1NiIs...\n```\n\nAlways hash passwords. Never store plain text passwords.',
        orderIndex: 2,
      },
    ],
  })

  // Quiz for course 1
  const quiz1 = await prisma.quiz.create({
    data: {
      courseId: course1.id,
      title: 'Frontend Fundamentals Quiz',
      passingScore: 60,
    },
  })

  await prisma.quizQuestion.createMany({
    data: [
      {
        quizId: quiz1.id,
        question: 'What does HTML stand for?',
        options: JSON.stringify(['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language']),
        correctOptionIndex: 0,
        explanation: 'HTML stands for HyperText Markup Language.',
        orderIndex: 0,
      },
      {
        quizId: quiz1.id,
        question: 'Which CSS property is used to change text color?',
        options: JSON.stringify(['font-color', 'text-color', 'color', 'foreground']),
        correctOptionIndex: 2,
        explanation: 'The `color` property sets the text color.',
        orderIndex: 1,
      },
      {
        quizId: quiz1.id,
        question: 'Which keyword declares a constant in JavaScript?',
        options: JSON.stringify(['var', 'let', 'const', 'define']),
        correctOptionIndex: 2,
        explanation: '`const` declares a block-scoped constant.',
        orderIndex: 2,
      },
      {
        quizId: quiz1.id,
        question: 'What does CSS stand for?',
        options: JSON.stringify(['Computer Style Sheets', 'Creative Style System', 'Cascading Style Sheets', 'Colorful Style Sheets']),
        correctOptionIndex: 2,
        explanation: 'CSS stands for Cascading Style Sheets.',
        orderIndex: 3,
      },
      {
        quizId: quiz1.id,
        question: 'Which HTML tag is used for the largest heading?',
        options: JSON.stringify(['<heading>', '<h6>', '<head>', '<h1>']),
        correctOptionIndex: 3,
        explanation: '<h1> is the largest heading tag.',
        orderIndex: 4,
      },
    ],
  })

  // Quiz for course 2
  const quiz2 = await prisma.quiz.create({
    data: {
      courseId: course2.id,
      title: 'React Basics Quiz',
      passingScore: 60,
    },
  })

  await prisma.quizQuestion.createMany({
    data: [
      {
        quizId: quiz2.id,
        question: 'What hook is used to add state to a function component?',
        options: JSON.stringify(['useEffect', 'useState', 'useRef', 'useMemo']),
        correctOptionIndex: 1,
        explanation: 'useState adds state to function components.',
        orderIndex: 0,
      },
      {
        quizId: quiz2.id,
        question: 'Props in React are:',
        options: JSON.stringify(['Mutable', 'Read-only', 'Optional always', 'Only strings']),
        correctOptionIndex: 1,
        explanation: 'Props are read-only — a component must never modify its own props.',
        orderIndex: 1,
      },
      {
        quizId: quiz2.id,
        question: 'What does useEffect do?',
        options: JSON.stringify(['Manages state', 'Handles routing', 'Synchronizes with external systems', 'Styles components']),
        correctOptionIndex: 2,
        explanation: 'useEffect lets you synchronize a component with an external system.',
        orderIndex: 2,
      },
      {
        quizId: quiz2.id,
        question: 'How do you handle a click event in React?',
        options: JSON.stringify(['onclick', 'onClick', 'on-click', 'click']),
        correctOptionIndex: 1,
        explanation: 'React uses camelCase event names: onClick.',
        orderIndex: 3,
      },
      {
        quizId: quiz2.id,
        question: 'What is the correct way to render a list in React?',
        options: JSON.stringify(['for loop in JSX', 'forEach()', 'array.map()', 'while loop']),
        correctOptionIndex: 2,
        explanation: 'array.map() is the standard way to render lists in React.',
        orderIndex: 4,
      },
    ],
  })

  // Quiz for course 3
  const quiz3 = await prisma.quiz.create({
    data: {
      courseId: course3.id,
      title: 'Backend API Quiz',
      passingScore: 60,
    },
  })

  await prisma.quizQuestion.createMany({
    data: [
      {
        quizId: quiz3.id,
        question: 'Which HTTP method is used to create a resource?',
        options: JSON.stringify(['GET', 'POST', 'DELETE', 'PATCH']),
        correctOptionIndex: 1,
        explanation: 'POST is used to create new resources.',
        orderIndex: 0,
      },
      {
        quizId: quiz3.id,
        question: 'What status code means "Not Found"?',
        options: JSON.stringify(['200', '401', '404', '500']),
        correctOptionIndex: 2,
        explanation: '404 means the requested resource was not found.',
        orderIndex: 1,
      },
      {
        quizId: quiz3.id,
        question: 'What does JWT stand for?',
        options: JSON.stringify(['Java Web Token', 'JSON Web Token', 'JavaScript Web Tool', 'JSON Wrapper Type']),
        correctOptionIndex: 1,
        explanation: 'JWT stands for JSON Web Token.',
        orderIndex: 2,
      },
      {
        quizId: quiz3.id,
        question: 'Where should passwords be stored?',
        options: JSON.stringify(['Plain text in database', 'In cookies', 'As hashed values', 'In localStorage']),
        correctOptionIndex: 2,
        explanation: 'Passwords must always be hashed before storage.',
        orderIndex: 3,
      },
      {
        quizId: quiz3.id,
        question: 'Which header carries the authentication token?',
        options: JSON.stringify(['Content-Type', 'Authorization', 'Accept', 'Cookie']),
        correctOptionIndex: 1,
        explanation: 'The Authorization header carries Bearer tokens.',
        orderIndex: 4,
      },
    ],
  })

  // Enroll student in course 1
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course1.id,
      status: 'ACTIVE',
    },
  })

  console.log('✅ Seed complete!')
  console.log(`   Admin: admin@eduflow.dev / password123`)
  console.log(`   Student: student@eduflow.dev / password123`)
  console.log(`   Courses: ${course1.title}, ${course2.title}, ${course3.title}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
