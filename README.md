```mermaid
classDiagram
  direction LR
  class User {
  }

  class Teacher {
  }

  class Student {
  }
  
  class Course {
  }

  User <|-- Teacher
  User <|-- Student
  Teacher "1" -- "*" Course
  Student "*"--"*" Course
```