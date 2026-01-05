

## Project Description
This project is a React-based web application designed to help users find and connect with various profiles. 

## Features & Requirements Met
- **Component Architecture**: 
  - `App`: The main container managing the layout and state.
  - `NavBar`: A dedicated component for site navigation.
  - `ProfileCard`: A reusable component that dynamically renders profile data (name, bio, interests, and images).
  
- **State Management (useState)**:
  - **Search Filtering**: Implemented a real-time search bar that filters the profile list as the user types.
  - **Favorites Toggle**: Each profile card includes a "Favorite" button (♥/+) that tracks individual state.

- **Side Effects (useEffect)**:
  - Implemented a `useEffect` hook to monitor and log search terms to the console, ensuring data synchronization and satisfying the lifecycle requirement.

- **Responsive Design**: The app maintains the original CSS styling while utilizing JSX for dynamic rendering.

## Technical Choices
I chose to use a **mapping function** to render the `ProfileCard` components from an array of objects. This approach makes the code cleaner, more scalable, and demonstrates a deep understanding of React's "Dry" (Don't Repeat Yourself) principles compared to static HTML.