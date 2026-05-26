Balino Gym Management System
A web-based Gym Management System with full CRUD functionality for managing gym members, staff, equipment, attendance, payments, schedules, fitness programs, and membership plans.

MEMBERS:
Balino, Louis Gian R.
Balleta, John Earl
Loveña, Andreicel

Tech Stack

Frontend: HTML, CSS, JavaScript
Backend: PHP
Database: MySQL
Local Server: XAMPP (Apache + MySQL)

Requirements
Before running the project, make sure you have the following installed:

XAMPP (includes Apache and MySQL)
A web browser (Chrome, Firefox, etc.)

Installation and Setup
Step 1 — Clone or Download the Repository
Option A: Clone via Git
bashgit clone https://github.com/johnearlandesballeta24-svg/web-sys-final-project
Option B: Download ZIP
Click the green Code button on GitHub, then click Download ZIP. Extract the folder.

Step 2 — Move Files to XAMPP
Copy the project folder into your XAMPP htdocs directory(you can rename the file):

Windows: C:\xampp\htdocs\balino-gym

Step 3 — Start XAMPP

Open the XAMPP Control Panel
Start Apache
Start MySQL

Step 4 — Import the Database

Open your browser and go to: http://localhost/phpmyadmin
Click New on the left sidebar
Create a database named: gym_db
Click the gym_db database, then go to the Import tab
Click Choose File and select database/gym_db.sql
Click Go

Step 5 — Open the Project
Go to your browser and visit:
http://localhost/balino-gym

DEFAULT LOGIN CREDENTIALS
STAFF
Staff ID: S001
password: gianbalino
MEMBER
Email: ballet@aru.com
password: johnearl

DATABASE TABLE

| Table               | Description                                      |
| ------------------- | ------------------------------------------------ |
| `gym_member`        | Stores member personal information               |
| `gym_staff`         | Stores staff details and roles                   |
| `users`             | Login credentials linked to members or staff     |
| `member_enrollment` | Links members to their membership plans          |
| `membership_plan`   | Available plans (Basic, Standard, Premium, etc.) |
| `payment`           | Payment records per member                       |
| `attendance`        | Member check-in and check-out logs               |
| `equipment`         | Gym equipment inventory managed by staff         |
| `schedule`          | Staff training schedules and sessions            |
| `schedule_day`      | Days assigned to each schedule                   |
| `fitness_program`   | Fitness programs linked to schedules             |
| `user_progress`     | Member height and weight tracking over time      |

FEATURES

- Member registration, profile management, and deletion
- Staff management with role assignment
- Membership plan enrollment and status tracking
- Payment recording and history
- Attendance logging with time-in and time-out
- Equipment inventory management
- Schedule and fitness program management
- User progress tracking (height and weight)
- Role-based access (Admin, Staff, Member)
- Search and filter on data tables
- Confirmation dialogs before deleting records
