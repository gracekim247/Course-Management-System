# Course Management System

This project is a Course Management System built using React, Redux Toolkit, and various other libraries. The application allows users to manage courses, including updating course details, managing liaisons, and more. The system integrates multiple APIs to fetch and update data related to courses and liaisons.

## Project Overview

This project was developed during my internship in the summer of 2024. Due to privacy and confidentiality agreements, I am unable to include all the files and details from the original application. The code provided here is a partial implementation meant to demonstrate the core functionality I contributed to during my internship.

## Key Features

- **Course Management**: Create and update courses with various attributes like course code, start date, end date, associated school, liaisons, schedule, and status.
- **Liaison Management**: Retrieve liaisons associated with schools and manage their assignments to courses.
- **Dynamic Form Handling**: The form dynamically updates available options for liaisons based on the selected school and other criteria.
- **Validation**: Input validation is handled using yup with custom schemas for different fields.
- **Responsive Design**: The UI is responsive, adjusting layout and elements for both desktop and mobile views.

## Technologies Used

- **React**: For building the user interface.
- **Redux Toolkit and RTK Query**: For managing the global state and handling API calls. 
- **React Hook Form**: For form handling and validation.
- **Yup**: For schema validation.
- **MUI (Material-UI)**: For styling and layout.
- **Moment.js**: For date manipulation and validation.

## Key File Descriptions

### Frontend Components: 

1. **form-modal.tsx**: Modal for creating courses.

2. **updateCourseFormModal.tsx**: Modal form for updating courses.

3. **discoverled.tsx, empowerled.tsx, inspireled.tsx**: Display the course details for 3 different course-types.

4. **leadershipDataGrid.tsx**: Creates the grid/table with appropriate columns where the courses are displayed. 


### Backend API Integration:

1. **CourseApi.ts**:
   - Provides endpoints for managing course data, including creation and updates.
   - Endpoints include:
     - `getCourse`: Fetches all leadership courses.
     - `getOneCourse`: Fetches a specific course by ID.
     - `createCourse`: Sends a request to create a new course.
     - `updateCourse`: Sends a request to update an existing course.
     
2. **liaisonApi.ts**:
   - Provides endpoints for fetching and managing liaison data related to schools. 
   - Endpoints include:
     - `getLiaisons`: Fetches all liaisons.
     - `getSpecificLiaison`: Fetches a specific liaison by ID.
     - `getSchoolLiaison`: Fetches liaisons for a specific school with certain permissions.

## Here's a desktop preview of my application: 

### Courses View:
![Screenshot 2024-08-26 at 12 48 03 AM](https://github.com/user-attachments/assets/51b9c03b-3df7-406f-944f-c21a24384fac)

### Create Course Form:
<img width="1440" alt="createCourse form dektop" src="https://github.com/user-attachments/assets/4dba28d3-ba6c-42f6-b390-06ac793d30d6">

### Update Course Form:
<img width="1440" alt="updateCourse form desktop" src="https://github.com/user-attachments/assets/2a617b09-4384-4df5-9a62-fde7bb5aa7c5">

### Extra functionality of input fields:
- Start Date and End Date
   - <img width="740" src="https://github.com/user-attachments/assets/4b9c06e9-5fb3-44bb-935f-305bbcb165dc">
- Associated School Drop-Down Selection
   - <img width="740" src="https://github.com/user-attachments/assets/1376ed56-f987-4055-9b5f-3a8aaed1a54d">
- Liaison Drop-Down Selections with Filtering
   - <img width="740" src="https://github.com/user-attachments/assets/9675ba28-05bd-4b57-92a4-af2d6f40f332">

   - <img width="740" src="https://github.com/user-attachments/assets/52a35225-7598-4c97-948c-3347146014ef">

   - <img width="740" src="https://github.com/user-attachments/assets/ab3e0f5b-c35d-4934-b299-a191fcda6abd">


## Here's a mobile preview of my application:
### Create Course Form:
<img width="450" src="https://github.com/user-attachments/assets/49845602-d7c0-415b-abb0-01512df793b6">

### Update Course Form:
<img width="440" src="https://github.com/user-attachments/assets/d3e09e3e-1e29-4d07-8d92-72b10d8574b2">

