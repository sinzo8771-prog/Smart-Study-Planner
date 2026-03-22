import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env file with override
config({ path: resolve(process.cwd(), '.env'), override: true });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Use 12 salt rounds to match auth.ts
const SALT_ROUNDS = 12;

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin users if not exists
  let adminUser = await prisma.user.findUnique({
    where: { email: 'admin@smartstudy.com' }
  });

  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('Admin@123456', SALT_ROUNDS);
    adminUser = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@smartstudy.com',
        password: hashedPassword,
        role: 'admin',
        emailVerified: new Date(),
      }
    });
    console.log('✅ Created admin user (admin@smartstudy.com)');
  } else {
    console.log('⏭️ Admin user already exists (admin@smartstudy.com)');
  }

  // Create second admin user with credentials from previous session
  let adminUser2 = await prisma.user.findUnique({
    where: { email: 'admin@studyplanner.com' }
  });

  if (!adminUser2) {
    const hashedPassword2 = await bcrypt.hash('Admin@123456', SALT_ROUNDS);
    adminUser2 = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@studyplanner.com',
        password: hashedPassword2,
        role: 'admin',
        emailVerified: new Date(),
      }
    });
    console.log('✅ Created admin user (admin@studyplanner.com)');
  } else {
    console.log('⏭️ Admin user already exists (admin@studyplanner.com)');
  }

  // Create sample student users
  const studentUsers = [
    { name: 'John Doe', email: 'john@example.com', password: 'Student@123' },
    { name: 'Jane Smith', email: 'jane@example.com', password: 'Student@123' },
    { name: 'Bob Wilson', email: 'bob@example.com', password: 'Student@123' },
    { name: 'Alice Johnson', email: 'alice@example.com', password: 'Student@123' },
    { name: 'Charlie Brown', email: 'charlie@example.com', password: 'Student@123' },
  ];

  for (const studentData of studentUsers) {
    const existingStudent = await prisma.user.findUnique({
      where: { email: studentData.email }
    });

    if (!existingStudent) {
      const hashedPassword = await bcrypt.hash(studentData.password, SALT_ROUNDS);
      await prisma.user.create({
        data: {
          name: studentData.name,
          email: studentData.email,
          password: hashedPassword,
          role: 'student',
          emailVerified: new Date(),
        }
      });
      console.log(`✅ Created student user: ${studentData.email}`);
    } else {
      console.log(`⏭️ Student user already exists: ${studentData.email}`);
    }
  }

  // Sample courses data
  const coursesData = [
    {
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for beginners who want to start their journey in web development.',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
      category: 'Programming',
      level: 'beginner',
      duration: 120,
      isPublished: true,
      modules: [
        {
          title: 'Getting Started with HTML',
          description: 'Learn the basics of HTML and document structure',
          content: `# Getting Started with HTML

## What is HTML?

HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using a series of elements.

## Basic Structure

Every HTML document has a basic structure:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first web page.</p>
</body>
</html>
\`\`\`

## Key Concepts

- **Elements**: Building blocks of HTML
- **Tags**: Labels that define elements
- **Attributes**: Additional information about elements

## Practice Exercise

Create a simple HTML page with:
1. A heading with your name
2. A paragraph about yourself
3. A list of your hobbies`,
          duration: 15,
          order: 1
        },
        {
          title: 'CSS Fundamentals',
          description: 'Style your web pages with CSS',
          content: `# CSS Fundamentals

## What is CSS?

CSS (Cascading Style Sheets) controls the visual presentation of HTML elements.

## Basic Syntax

\`\`\`css
selector {
    property: value;
}

/* Example */
h1 {
    color: blue;
    font-size: 24px;
}
\`\`\`

## Selectors

- **Element**: \`p { }\`
- **Class**: \`.my-class { }\`
- **ID**: \`#my-id { }\`

## The Box Model

Every element is a box with:
- Content
- Padding
- Border
- Margin

## Practice

Style your HTML page from the previous lesson!`,
          duration: 20,
          order: 2
        },
        {
          title: 'JavaScript Basics',
          description: 'Add interactivity with JavaScript',
          content: `# JavaScript Basics

## What is JavaScript?

JavaScript is a programming language that makes web pages interactive.

## Variables

\`\`\`javascript
// Modern JavaScript
let name = "John";
const age = 25;

// Old way (avoid)
var city = "New York";
\`\`\`

## Functions

\`\`\`javascript
function greet(name) {
    return "Hello, " + name + "!";
}

// Arrow functions
const greetArrow = (name) => \`Hello, \${name}!\`;
\`\`\`

## DOM Manipulation

\`\`\`javascript
// Get element
const heading = document.querySelector('h1');

// Change content
heading.textContent = 'New Title';

// Add event listener
heading.addEventListener('click', () => {
    alert('Clicked!');
});
\`\`\`

## Practice

Create a button that changes the background color when clicked!`,
          duration: 25,
          order: 3
        },
        {
          title: 'Building Your First Website',
          description: 'Put it all together',
          content: `# Building Your First Website

## Project Overview

Let's create a personal portfolio page using HTML, CSS, and JavaScript!

## Step 1: HTML Structure

Create sections for:
- Header with navigation
- Hero section
- About section
- Projects section
- Contact form
- Footer

## Step 2: Styling

Add CSS for:
- Responsive layout
- Color scheme
- Typography
- Animations

## Step 3: Interactivity

Add JavaScript for:
- Mobile menu toggle
- Smooth scrolling
- Form validation
- Dynamic content

## Best Practices

1. **Mobile-first design**
2. **Semantic HTML**
3. **Accessible content**
4. **Performance optimization**

## Final Project

Create a complete portfolio website and share it with the world!`,
          duration: 30,
          order: 4
        }
      ]
    },
    {
      title: 'Mathematics: Algebra Fundamentals',
      description: 'Master the basics of algebra including equations, inequalities, and functions. Build a strong foundation for advanced mathematics.',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
      category: 'Mathematics',
      level: 'beginner',
      duration: 90,
      isPublished: true,
      modules: [
        {
          title: 'Understanding Variables and Expressions',
          description: 'Learn what variables are and how to write algebraic expressions',
          content: `# Variables and Expressions

## What is a Variable?

A variable is a symbol (usually a letter) that represents an unknown number.

**Example**: In \`x + 5\`, x is a variable.

## Algebraic Expressions

An algebraic expression combines numbers, variables, and operations.

| Expression | Meaning |
|------------|---------|
| 2x | 2 times x |
| x + 3 | x plus 3 |
| x² | x squared |
| x/2 | x divided by 2 |

## Evaluating Expressions

To evaluate an expression, substitute the variable with a number.

**Example**: Evaluate \`3x + 2\` when \`x = 4\`

\`3(4) + 2 = 12 + 2 = 14\`

## Practice Problems

1. Evaluate \`2x + 5\` when \`x = 3\`
2. Evaluate \`x² - 4\` when \`x = 5\`
3. Evaluate \`4x - 7\` when \`x = 2\`

## Real-World Application

If you buy x apples at $2 each, the total cost is \`2x\` dollars. How much for 7 apples?`,
          duration: 15,
          order: 1
        },
        {
          title: 'Solving Linear Equations',
          description: 'Learn to solve equations with one variable',
          content: `# Solving Linear Equations

## What is an Equation?

An equation states that two expressions are equal.

**Example**: \`2x + 3 = 11\`

## Golden Rule

Whatever you do to one side, you must do to the other!

## Steps to Solve

1. Simplify both sides
2. Get all variables on one side
3. Get all constants on the other side
4. Isolate the variable

## Example

Solve: \`2x + 3 = 11\`

\`\`\`
2x + 3 = 11
2x + 3 - 3 = 11 - 3    (subtract 3)
2x = 8
2x ÷ 2 = 8 ÷ 2         (divide by 2)
x = 4
\`\`\`

**Check**: \`2(4) + 3 = 8 + 3 = 11\` ✓

## Practice

Solve these equations:
1. \`x + 7 = 15\`
2. \`3x = 18\`
3. \`2x - 5 = 9\`
4. \`4x + 8 = 24\``,
          duration: 20,
          order: 2
        },
        {
          title: 'Working with Inequalities',
          description: 'Understand and solve inequalities',
          content: `# Working with Inequalities

## What are Inequalities?

Inequalities compare two expressions using symbols:

| Symbol | Meaning |
|--------|---------|
| < | Less than |
| > | Greater than |
| ≤ | Less than or equal to |
| ≥ | Greater than or equal to |

## Solving Inequalities

Solve just like equations, BUT:

⚠️ When multiplying or dividing by a negative number, **flip the inequality sign**!

## Example

Solve: \`-2x > 10\`

\`\`\`
-2x > 10
-2x ÷ (-2) < 10 ÷ (-2)    (flip the sign!)
x < -5
\`\`\`

## Graphing Solutions

On a number line:
- **<** or **>**: Open circle (not included)
- **≤** or **≥**: Closed circle (included)

## Practice

1. Solve: \`x + 4 > 12\`
2. Solve: \`-3x ≤ 15\`
3. Solve: \`2x - 5 < 7\``,
          duration: 15,
          order: 3
        },
        {
          title: 'Introduction to Functions',
          description: 'Learn what functions are and how to use them',
          content: `# Introduction to Functions

## What is a Function?

A function is a relationship where each input has exactly one output.

**Notation**: \`f(x)\` read as "f of x"

## Example

\`f(x) = 2x + 3\`

| Input (x) | Output f(x) |
|-----------|-------------|
| 0 | 3 |
| 1 | 5 |
| 2 | 7 |
| 3 | 9 |

## Domain and Range

- **Domain**: All possible input values
- **Range**: All possible output values

## Function Types

1. **Linear**: \`f(x) = mx + b\`
2. **Quadratic**: \`f(x) = ax² + bx + c\`
3. **Exponential**: \`f(x) = aˣ\`

## Evaluating Functions

Given \`f(x) = 3x - 1\`:

Find \`f(4)\`:
\`f(4) = 3(4) - 1 = 12 - 1 = 11\`

## Practice

For \`f(x) = x² + 2x - 1\`:
1. Find \`f(0)\`
2. Find \`f(2)\`
3. Find \`f(-3)\``,
          duration: 20,
          order: 4
        }
      ]
    },
    {
      title: 'Data Science with Python',
      description: 'Learn data analysis, visualization, and machine learning basics using Python. Perfect for aspiring data scientists.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      category: 'Data Science',
      level: 'intermediate',
      duration: 180,
      isPublished: true,
      modules: [
        {
          title: 'Python for Data Science',
          description: 'Python basics tailored for data science',
          content: `# Python for Data Science

## Why Python?

Python is the most popular language for data science because of:
- Simple syntax
- Rich ecosystem of libraries
- Strong community support

## Essential Libraries

\`\`\`python
import numpy as np          # Numerical computing
import pandas as pd         # Data manipulation
import matplotlib.pyplot as plt  # Visualization
import seaborn as sns       # Statistical visualization
\`\`\`

## Data Types

\`\`\`python
# Numbers
x = 42          # integer
y = 3.14        # float

# Collections
my_list = [1, 2, 3]           # list
my_dict = {'name': 'Alice'}   # dictionary
\`\`\`

## List Comprehensions

\`\`\`python
# Traditional way
squares = []
for i in range(10):
    squares.append(i ** 2)

# List comprehension
squares = [i ** 2 for i in range(10)]
\`\`\`

## Practice

Create a list of even numbers from 1 to 20 using list comprehension.`,
          duration: 20,
          order: 1
        },
        {
          title: 'NumPy Fundamentals',
          description: 'Master numerical computing with NumPy',
          content: `# NumPy Fundamentals

## What is NumPy?

NumPy provides support for large, multi-dimensional arrays and matrices.

## Creating Arrays

\`\`\`python
import numpy as np

# From list
arr = np.array([1, 2, 3, 4, 5])

# Built-in functions
zeros = np.zeros(5)           # [0, 0, 0, 0, 0]
ones = np.ones(5)             # [1, 1, 1, 1, 1]
range_arr = np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]
random_arr = np.random.rand(5)   # Random values
\`\`\`

## Array Operations

\`\`\`python
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# Element-wise operations
a + b     # [5, 7, 9]
a * b     # [4, 10, 18]
a ** 2    # [1, 4, 9]

# Statistical operations
np.mean(a)   # 2.0
np.sum(a)    # 6
np.std(a)    # Standard deviation
\`\`\`

## 2D Arrays

\`\`\`python
matrix = np.array([[1, 2, 3], [4, 5, 6]])
matrix.shape    # (2, 3)
matrix.reshape(3, 2)  # Reshape to 3x2
\`\`\``,
          duration: 25,
          order: 2
        },
        {
          title: 'Pandas for Data Analysis',
          description: 'Data manipulation and analysis with Pandas',
          content: `# Pandas for Data Analysis

## What is Pandas?

Pandas provides data structures and tools for data manipulation.

## DataFrame Basics

\`\`\`python
import pandas as pd

# Create DataFrame
df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'city': ['NYC', 'LA', 'Chicago']
})

# Read from CSV
df = pd.read_csv('data.csv')
\`\`\`

## Basic Operations

\`\`\`python
# View data
df.head()          # First 5 rows
df.info()          # Column info
df.describe()      # Statistics

# Select columns
df['name']         # Single column
df[['name', 'age']]  # Multiple columns

# Filter rows
df[df['age'] > 25]
df[(df['age'] > 25) & (df['city'] == 'NYC')]
\`\`\`

## Data Cleaning

\`\`\`python
# Handle missing values
df.dropna()              # Drop rows with NaN
df.fillna(0)             # Fill NaN with 0
df['age'].fillna(df['age'].mean())  # Fill with mean

# Remove duplicates
df.drop_duplicates()
\`\`\``,
          duration: 30,
          order: 3
        },
        {
          title: 'Data Visualization',
          description: 'Create beautiful visualizations with Matplotlib and Seaborn',
          content: `# Data Visualization

## Matplotlib Basics

\`\`\`python
import matplotlib.pyplot as plt

# Line plot
plt.plot([1, 2, 3, 4], [1, 4, 2, 3])
plt.title('Simple Line Plot')
plt.xlabel('X-axis')
plt.ylabel('Y-axis')
plt.show()

# Bar chart
plt.bar(['A', 'B', 'C', 'D'], [3, 7, 2, 5])
plt.show()

# Scatter plot
plt.scatter(df['age'], df['salary'])
plt.show()
\`\`\`

## Seaborn for Statistical Plots

\`\`\`python
import seaborn as sns

# Distribution plot
sns.histplot(data=df, x='age')

# Box plot
sns.boxplot(data=df, x='category', y='value')

# Heatmap (correlation matrix)
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')

# Pair plot
sns.pairplot(df)
\`\`\`

## Best Practices

1. **Choose the right chart type**
2. **Use clear labels**
3. **Avoid misleading scales**
4. **Use color purposefully**`,
          duration: 25,
          order: 4
        }
      ]
    },
    {
      title: 'English Writing Skills',
      description: 'Improve your writing with lessons on grammar, essay structure, and creative writing. Essential for academic and professional success.',
      thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
      category: 'Language',
      level: 'beginner',
      duration: 100,
      isPublished: true,
      modules: [
        {
          title: 'Grammar Essentials',
          description: 'Master the fundamentals of English grammar',
          content: `# Grammar Essentials

## Parts of Speech

| Part | Definition | Example |
|------|------------|---------|
| Noun | Person, place, thing | book, city, happiness |
| Verb | Action or state | run, is, think |
| Adjective | Describes noun | beautiful, tall |
| Adverb | Describes verb | quickly, very |

## Subject-Verb Agreement

**Rule**: A singular subject needs a singular verb.

- ✓ She **writes** every day.
- ✗ She **write** every day.

## Common Mistakes

### Their / There / They're
- **Their** = possession (their book)
- **There** = place (over there)
- **They're** = they are (they're happy)

### Your / You're
- **Your** = possession (your car)
- **You're** = you are (you're welcome)

### Its / It's
- **Its** = possession (its color)
- **It's** = it is (it's raining)

## Practice

Correct the errors:
1. "Their going to the store."
2. "The team are winning."
3. "Its a beautiful day."`,
          duration: 20,
          order: 1
        },
        {
          title: 'Essay Structure',
          description: 'Learn to write well-structured essays',
          content: `# Essay Structure

## The Five-Paragraph Essay

A classic structure that works for most essays:

### 1. Introduction
- Hook (grab attention)
- Background information
- **Thesis statement** (main argument)

### 2-4. Body Paragraphs
- **Topic sentence** (main point)
- Supporting evidence
- Analysis/explanation
- Transition to next paragraph

### 5. Conclusion
- Restate thesis (differently)
- Summarize main points
- Final thought or call to action

## Thesis Statement

A good thesis is:
- **Specific**: Clear focus
- **Arguable**: Not just a fact
- **Concise**: One or two sentences

**Example**:
- ✗ "Social media is popular."
- ✓ "Social media has transformed how people communicate, creating both opportunities for connection and challenges for mental health."

## Paragraph Structure (PEEL)

- **P**oint: Topic sentence
- **E**vidence: Support your point
- **E**xplanation: Connect evidence to point
- **L**ink: Connect to next paragraph`,
          duration: 25,
          order: 2
        },
        {
          title: 'Creative Writing Basics',
          description: 'Explore creative writing techniques',
          content: `# Creative Writing Basics

## Show, Don't Tell

Instead of telling readers what to feel, show them through details.

**Telling**: She was angry.
**Showing**: She slammed the door and threw her bag across the room.

## Strong Verbs

Replace weak verb + adverb with strong verb:

| Weak | Strong |
|------|--------|
| ran quickly | sprinted |
| said softly | whispered |
| looked angrily | glared |

## Sensory Details

Engage all five senses:

> The coffee shop **smelled** of roasted beans and cinnamon. Steam **rose** from my cup as I **listened** to the **hiss** of the espresso machine. The worn leather chair **felt** cool against my back.

## Dialogue Tips

1. Use dialogue to reveal character
2. Keep it natural (read aloud!)
3. Use action beats, not just tags

**Example**:
\`\`\`
"I can't believe you did that," she laughed, nearly spilling her coffee.
\`\`\`

## Writing Exercise

Write a paragraph about a character waiting for something. Use:
- At least 3 sensory details
- Strong verbs
- One line of dialogue`,
          duration: 20,
          order: 3
        }
      ]
    },
    {
      title: 'Physics: Mechanics',
      description: 'Understand motion, forces, and energy. Build a strong foundation in classical mechanics with practical examples.',
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800',
      category: 'Science',
      level: 'intermediate',
      duration: 150,
      isPublished: true,
      modules: [
        {
          title: 'Motion and Kinematics',
          description: 'Learn about motion, speed, velocity, and acceleration',
          content: `# Motion and Kinematics

## Key Concepts

### Distance vs Displacement
- **Distance**: Total path length (scalar)
- **Displacement**: Change in position (vector)

### Speed vs Velocity
- **Speed**: Distance/time (scalar)
- **Velocity**: Displacement/time (vector)

## Equations of Motion

For constant acceleration:

\`\`\`
v = u + at           (1)
s = ut + ½at²        (2)
v² = u² + 2as        (3)
\`\`\`

Where:
- u = initial velocity
- v = final velocity
- a = acceleration
- s = displacement
- t = time

## Example Problem

A car accelerates from rest at 3 m/s² for 5 seconds. Find:
1. Final velocity
2. Distance traveled

**Solution**:
\`\`\`
v = u + at = 0 + 3(5) = 15 m/s
s = ut + ½at² = 0 + ½(3)(5)² = 37.5 m
\`\`\`

## Practice

A ball is thrown upward at 20 m/s. How high does it go? (g = 10 m/s²)`,
          duration: 25,
          order: 1
        },
        {
          title: "Newton's Laws of Motion",
          description: "Understand forces and Newton's three laws",
          content: `# Newton's Laws of Motion

## First Law: Inertia

An object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force.

**Example**: A book on a table stays still until you push it.

## Second Law: F = ma

The acceleration of an object is proportional to the net force and inversely proportional to its mass.

\`\`\`
F = ma

Force (N) = Mass (kg) × Acceleration (m/s²)
\`\`\`

**Example**: A 5 kg box is pushed with 20 N. What's the acceleration?

\`\`\`
a = F/m = 20/5 = 4 m/s²
\`\`\`

## Third Law: Action-Reaction

For every action, there is an equal and opposite reaction.

**Example**: When you push against a wall, the wall pushes back with equal force.

## Free Body Diagrams

Draw all forces acting on an object:
- Weight (W = mg) - downward
- Normal force (N) - perpendicular to surface
- Friction (f) - opposes motion
- Applied force (F) - external push/pull

## Practice

A 10 kg box rests on a table. What is the normal force?`,
          duration: 30,
          order: 2
        },
        {
          title: 'Work, Energy, and Power',
          description: 'Learn about work, kinetic energy, potential energy, and power',
          content: `# Work, Energy, and Power

## Work

Work is done when a force moves an object.

\`\`\`
W = F × d × cos(θ)

Work (J) = Force (N) × Distance (m) × cos(angle)
\`\`\`

**Note**: Work is a scalar quantity.

## Energy

### Kinetic Energy
\`\`\`
KE = ½mv²
\`\`\`

### Potential Energy
\`\`\`
PE = mgh
\`\`\`

## Conservation of Energy

Total energy in a closed system is constant.

\`\`\`
KE₁ + PE₁ = KE₂ + PE₂
\`\`\`

## Power

Power is the rate of doing work.

\`\`\`
P = W/t

Power (W) = Work (J) / Time (s)
\`\`\`

1 Watt = 1 Joule/second

## Example

A 2 kg ball is dropped from 10 m. Find its speed at impact.

**Solution**:
\`\`\`
PE₁ = KE₂
mgh = ½mv²
v = √(2gh) = √(2 × 10 × 10) = √200 ≈ 14.1 m/s
\`\`\``,
          duration: 30,
          order: 3
        }
      ]
    }
  ];

  // Create courses with modules
  for (const courseData of coursesData) {
    const { modules, ...courseInfo } = courseData;

    // Check if course already exists
    const existingCourse = await prisma.course.findFirst({
      where: { title: courseInfo.title }
    });

    if (existingCourse) {
      console.log(`⏭️ Course "${courseInfo.title}" already exists, skipping...`);
      continue;
    }

    const course = await prisma.course.create({
      data: {
        ...courseInfo,
        createdBy: adminUser.id,
        modules: {
          create: modules
        }
      },
      include: {
        modules: true
      }
    });

    console.log(`✅ Created course: ${course.title} with ${course.modules.length} modules`);
  }

  // Create sample quizzes
  console.log('\n📝 Creating sample quizzes...');

  const quizzesData = [
    {
      title: 'Web Development Basics Quiz',
      description: 'Test your knowledge of HTML, CSS, and JavaScript fundamentals',
      duration: 15,
      passingScore: 60,
      isPublished: true,
      questions: [
        {
          question: 'What does HTML stand for?',
          optionA: 'Hyper Text Markup Language',
          optionB: 'High Tech Modern Language',
          optionC: 'Hyper Transfer Markup Language',
          optionD: 'Home Tool Markup Language',
          correctAnswer: 'A',
          explanation: 'HTML stands for Hyper Text Markup Language, the standard language for creating web pages.',
          points: 1,
          order: 1
        },
        {
          question: 'Which CSS property is used to change text color?',
          optionA: 'text-color',
          optionB: 'font-color',
          optionC: 'color',
          optionD: 'text-style',
          correctAnswer: 'C',
          explanation: 'The "color" property in CSS is used to set the color of text content.',
          points: 1,
          order: 2
        },
        {
          question: 'How do you declare a variable in modern JavaScript?',
          optionA: 'variable x = 5',
          optionB: 'let x = 5',
          optionC: 'v x = 5',
          optionD: 'declare x = 5',
          correctAnswer: 'B',
          explanation: '"let" and "const" are the modern ways to declare variables in JavaScript (ES6+).',
          points: 1,
          order: 3
        },
        {
          question: 'What tag is used for the largest heading in HTML?',
          optionA: '<heading>',
          optionB: '<h6>',
          optionC: '<h1>',
          optionD: '<head>',
          correctAnswer: 'C',
          explanation: 'The <h1> tag defines the largest and most important heading in HTML.',
          points: 1,
          order: 4
        },
        {
          question: 'Which method selects an element by its ID in JavaScript?',
          optionA: 'document.getElement()',
          optionB: 'document.getElementById()',
          optionC: 'document.querySelector()',
          optionD: 'document.selectById()',
          correctAnswer: 'B',
          explanation: 'document.getElementById() is the method used to select an element by its ID attribute.',
          points: 1,
          order: 5
        }
      ]
    },
    {
      title: 'Algebra Fundamentals Quiz',
      description: 'Test your algebra skills with equations and expressions',
      duration: 20,
      passingScore: 70,
      isPublished: true,
      questions: [
        {
          question: 'Solve: 2x + 5 = 13',
          optionA: 'x = 4',
          optionB: 'x = 5',
          optionC: 'x = 3',
          optionD: 'x = 6',
          correctAnswer: 'A',
          explanation: '2x + 5 = 13 → 2x = 8 → x = 4',
          points: 1,
          order: 1
        },
        {
          question: 'What is the value of 3x² when x = 4?',
          optionA: '24',
          optionB: '48',
          optionC: '12',
          optionD: '36',
          correctAnswer: 'B',
          explanation: '3x² = 3(4)² = 3(16) = 48',
          points: 1,
          order: 2
        },
        {
          question: 'Solve: -3x < 15',
          optionA: 'x < -5',
          optionB: 'x > -5',
          optionC: 'x < 5',
          optionD: 'x > 5',
          correctAnswer: 'B',
          explanation: 'When dividing by a negative number, flip the inequality sign: -3x < 15 → x > -5',
          points: 1,
          order: 3
        },
        {
          question: 'If f(x) = 2x - 3, what is f(5)?',
          optionA: '7',
          optionB: '10',
          optionC: '13',
          optionD: '5',
          correctAnswer: 'A',
          explanation: 'f(5) = 2(5) - 3 = 10 - 3 = 7',
          points: 1,
          order: 4
        },
        {
          question: 'Simplify: 4x + 3x - 2x',
          optionA: '9x',
          optionB: '5x',
          optionC: '6x',
          optionD: '4x',
          correctAnswer: 'B',
          explanation: '4x + 3x - 2x = 7x - 2x = 5x',
          points: 1,
          order: 5
        }
      ]
    },
    {
      title: 'Physics Mechanics Quiz',
      description: 'Test your understanding of motion, forces, and energy',
      duration: 20,
      passingScore: 60,
      isPublished: true,
      questions: [
        {
          question: 'What is the SI unit of force?',
          optionA: 'Joule',
          optionB: 'Newton',
          optionC: 'Watt',
          optionD: 'Pascal',
          correctAnswer: 'B',
          explanation: 'The Newton (N) is the SI unit of force, named after Sir Isaac Newton.',
          points: 1,
          order: 1
        },
        {
          question: 'A car accelerates from rest at 4 m/s² for 3 seconds. What is its final velocity?',
          optionA: '7 m/s',
          optionB: '12 m/s',
          optionC: '10 m/s',
          optionD: '8 m/s',
          correctAnswer: 'B',
          explanation: 'v = u + at = 0 + 4(3) = 12 m/s',
          points: 1,
          order: 2
        },
        {
          question: "What does Newton's First Law describe?",
          optionA: 'F = ma',
          optionB: 'Action-reaction pairs',
          optionC: 'Inertia',
          optionD: 'Gravity',
          correctAnswer: 'C',
          explanation: "Newton's First Law describes inertia - objects resist changes in motion.",
          points: 1,
          order: 3
        },
        {
          question: 'Calculate kinetic energy of a 2 kg object moving at 3 m/s.',
          optionA: '6 J',
          optionB: '9 J',
          optionC: '3 J',
          optionD: '18 J',
          correctAnswer: 'B',
          explanation: 'KE = ½mv² = ½(2)(3)² = ½(2)(9) = 9 J',
          points: 1,
          order: 4
        },
        {
          question: 'What is the acceleration due to gravity on Earth (approximate)?',
          optionA: '5 m/s²',
          optionB: '9.8 m/s²',
          optionC: '15 m/s²',
          optionD: '1 m/s²',
          correctAnswer: 'B',
          explanation: 'The acceleration due to gravity on Earth is approximately 9.8 m/s² (often rounded to 10 m/s² for calculations).',
          points: 1,
          order: 5
        }
      ]
    }
  ];

  for (const quizData of quizzesData) {
    const { questions, ...quizInfo } = quizData;

    // Check if quiz already exists
    const existingQuiz = await prisma.quiz.findFirst({
      where: { title: quizInfo.title }
    });

    if (existingQuiz) {
      console.log(`⏭️ Quiz "${quizInfo.title}" already exists, skipping...`);
      continue;
    }

    const quiz = await prisma.quiz.create({
      data: {
        ...quizInfo,
        createdBy: adminUser.id,
        questions: {
          create: questions
        }
      },
      include: {
        questions: true
      }
    });

    console.log(`✅ Created quiz: ${quiz.title} with ${quiz.questions.length} questions`);
  }

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log('- Admin user: admin@smartstudy.com (password: admin123)');
  console.log(`- ${coursesData.length} courses with modules`);
  console.log(`- ${quizzesData.length} quizzes with questions`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
