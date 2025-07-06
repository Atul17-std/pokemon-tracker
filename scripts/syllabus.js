import { TOTAL_SEMESTERS } from './config.js';

// B.Tech CSE Syllabus Data
export const cseSyllabus = {
    1: [ // Semester I
                { code: "21BSB101J", name: "Communicative English", credits: 3, type: "General" },
                { code: "21MAB101T", name: "Calculus and Linear Algebra", credits: 4, type: "Math" },
                { code: "21CHB101J", name: "Engineering Chemistry", credits: 3, type: "Science" },
                { code: "21EEB101J", name: "Basic Electrical and Electronics Engineering", credits: 3, type: "Engineering" },
                { code: "21CSB101J", name: "Programming for Problem Solving", credits: 3, type: "Coding", subTopics: ["Variables & Data Types", "Operators & Expressions", "Control Flow", "Functions", "Arrays", "Strings", "Pointers", "Structures"] },
                { code: "21GEB101T", name: "Digital Literacy", credits: 1, type: "General" },
                { code: "21CSB102P", name: "Programming for Problem Solving Lab", credits: 2, type: "Coding", subTopics: ["Lab Exercises - Basics", "Lab Exercises - Data Structures", "Lab Exercises - Algorithms"] },
                { code: "21EEP101L", name: "Electrical and Electronics Engineering Lab", credits: 2, type: "Engineering" }
            ],
        2: [ // Semester II
                { code: "21HSB201J", name: "French", credits: 3, type: "General" },
                { code: "21MAB201T", name: "Statistical Methods", credits: 4, type: "Math" },
                { code: "21PHY201J", name: "Engineering Physics", credits: 3, type: "Science" },
                { code: "21MEB201T", name: "Engineering Graphics", credits: 3, type: "Engineering" },
                { code: "21CSB202J", name: "Object Oriented Programming", credits: 3, type: "Coding", subTopics: ["Classes & Objects", "Inheritance", "Polymorphism", "Abstraction", "Encapsulation", "Exception Handling"] },
                { code: "21GEB202J", name: "Environmental Science and Engineering", credits: 3, type: "General" },
                { code: "21CSB203P", name: "Object Oriented Programming Lab", credits: 2, type: "Coding", subTopics: ["Lab - OOP Concepts", "Lab - Data Structures with OOP"] },
                { code: "21MEP201L", name: "Engineering Graphics Lab", credits: 2, type: "Engineering" }
            ],
        3: [ // Semester III
                { code: "21MAB301T", name: "Discrete Mathematics", credits: 4, type: "Math" },
                { code: "21CSB301T", name: "Data Structures and Algorithms", credits: 4, type: "Coding", subTopics: ["Arrays & Lists", "Stacks & Queues", "Trees", "Graphs", "Sorting Algorithms", "Searching Algorithms", "Dynamic Programming"] },
                { code: "21CSB302T", name: "Computer Organization and Architecture", credits: 3, type: "Computer Science" },
                { code: "21CSB303T", name: "Database Management Systems", credits: 3, type: "Coding", subTopics: ["ER Model", "Relational Model", "SQL Queries", "Normalization", "Transactions", "Indexing"] },
                { code: "21CSB304T", name: "Operating Systems", credits: 3, type: "Computer Science" },
                { code: "21CSB305P", name: "Data Structures and Algorithms Lab", credits: 2, type: "Coding", subTopics: ["Lab - DSA Implementation", "Lab - Algorithmic Problems"] },
                { code: "21CSB306P", name: "Database Management Systems Lab", credits: 2, type: "Coding", subTopics: ["Lab - SQL Practice", "Lab - Database Design"] },
                { code: "21GEB303J", name: "Professional Ethics", credits: 1, type: "General" }
            ],
        4: [ // Semester IV
                { code: "21MAB401T", name: "Probability and Queuing Theory", credits: 4, type: "Math" },
                { code: "21CSB401T", name: "Design and Analysis of Algorithms", credits: 4, type: "Coding", subTopics: ["Algorithm Analysis", "Divide & Conquer", "Greedy Algorithms", "Dynamic Programming", "Graph Algorithms", "NP-Completeness"] },
                { code: "21CSB402T", name: "Theory of Computation", credits: 3, type: "Computer Science" },
                { code: "21CSB403T", name: "Software Engineering", credits: 3, type: "Software Engineering" },
                { code: "21CSB404T", name: "Computer Networks", credits: 3, type: "Computer Science" },
                { code: "21CSB405P", name: "Design and Analysis of Algorithms Lab", credits: 2, type: "Coding", subTopics: ["Lab - Advanced Algorithms", "Lab - Problem Solving"] },
                { code: "21CSB406P", name: "Computer Networks Lab", credits: 2, type: "Computer Science" },
                { code: "21GEB404J", name: "Aptitude Skills", credits: 1, type: "General" }
            ],
        5: [ // Semester V
                { code: "21CSB501T", name: "Artificial Intelligence", credits: 3, type: "Coding", subTopics: ["AI Introduction", "Search Algorithms", "Knowledge Representation", "Machine Learning Basics", "Neural Networks Intro"] },
                { code: "21CSB502T", name: "Web Technology", credits: 3, type: "Coding", subTopics: ["HTML/CSS", "JavaScript Basics", "DOM Manipulation", "Front-end Frameworks Intro", "Backend Concepts"] },
                { code: "21CSB503T", name: "Compiler Design", credits: 3, type: "Computer Science" },
                { code: "21CSP504T", name: "Professional Elective-I", credits: 3, type: "Elective" },
                { code: "21CSP505T", name: "Professional Elective-II", credits: 3, type: "Elective" },
                { code: "21CSP506P", name: "Artificial Intelligence Lab", credits: 2, type: "Coding", subTopics: ["Lab - AI Algorithms", "Lab - ML Libraries"] },
                { code: "21CSP507P", name: "Web Technology Lab", credits: 2, type: "Coding", subTopics: ["Lab - Web Development", "Lab - Dynamic Pages"] },
                { code: "21CSP508J", name: "Open Elective-I", credits: 3, type: "Elective" }
            ],
        6: [ // Semester VI
                { code: "21CSB601T", name: "Machine Learning", credits: 3, type: "Coding", subTopics: ["Supervised Learning", "Unsupervised Learning", "Deep Learning Intro", "Model Evaluation", "Feature Engineering"] },
                { code: "21CSB602T", name: "Cloud Computing", credits: 3, type: "Computer Science" },
                { code: "21CSB603T", name: "Internet of Things", credits: 3, type: "Computer Science" },
                { code: "21CSP604T", name: "Professional Elective-III", credits: 3, type: "Elective" },
                { code: "21CSP605T", name: "Professional Elective-IV", credits: 3, type: "Elective" },
                { code: "21CSP606P", name: "Machine Learning Lab", credits: 2, type: "Coding", subTopics: ["Lab - ML Model Building", "Lab - Data Preprocessing"] },
                { code: "21CSP607P", name: "Cloud Computing Lab", credits: 2, type: "Computer Science" },
                { code: "21CSP608J", name: "Open Elective-II", credits: 3, type: "Elective" }
            ],
        7: [ // Semester VII
                { code: "21CSB701T", name: "Big Data Analytics", credits: 3, type: "Coding", subTopics: ["Big Data Concepts", "Hadoop Ecosystem", "Spark", "NoSQL Databases", "Data Streaming"] },
                { code: "21CSB702T", name: "Cyber Security", credits: 3, type: "Computer Science" },
                { code: "21CSP703T", name: "Professional Elective-V", credits: 3, type: "Elective" },
                { code: "21CSP704T", name: "Professional Elective-VI", credits: 3, type: "Elective" },
                { code: "21CSP705P", name: "Big Data Analytics Lab", credits: 2, type: "Coding", subTopics: ["Lab - Big Data Tools", "Lab - Data Processing"] },
                { code: "21CSB706P", name: "Project Work", credits: 6, type: "Project" },
                { code: "21CSP707J", name: "Professional Practice", credits: 1, type: "General" }
            ],
         8: [ // Semester VIII
                { code: "21CSB801T", name: "Ethics in AI and Data Science", credits: 3, type: "General" },
                { code: "21CSB802P", name: "Major Project", credits: 10, type: "Project" },
                { code: "21CSB803J", name: "Internship", credits: 6, type: "General" }
            ]
    };

// Grade to points mapping
export const gradePoints = {
    'S': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'E': 5, 'F': 0
};

// Default student data structure
export const defaultStudentData = {
    name: "New Trainer",
    enrollmentNo: "BIT-CS-000",
    specialization: "data_science",
    semesters: {},
    totalCreditsEarned: 0,
    totalGradePoints: 0,
    totalCreditsAttempted: 0
};