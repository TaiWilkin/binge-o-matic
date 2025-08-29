# Binge-O-Matic 🎬

A full-stack web application for organizing and managing your movie and TV show viewing experience. Create personalized lists, search for content, track what you've watched, and intelligently organize episodes and movies from multiverse series in proper viewing order.

## Features

- **User Authentication**: Secure sign-up and login system
- **Intelligent Content Organization**: Automatically organize episodes and movies from multiverse series in proper viewing order
- **Personalized Lists**: Create and manage multiple custom lists with smart sorting
- **Content Search**: Search for movies and TV shows using The Movie Database (TMDB) API
- **Detailed Tracking**:
  - Mark content as watched/unwatched
  - Add TV show seasons and episodes
  - Track individual episodes within seasons
  - Maintain chronological order across interconnected series
- **Smart Sorting**: Content is automatically sorted by release date, media type, and title for optimal viewing experience

## Tech Stack

### Frontend

- **React 19** with Vite for fast development
- **Apollo Client** for GraphQL state management
- **React Router** for navigation
- **CSS** for styling

### Backend

- **Node.js** with Express
- **GraphQL** with Apollo Server
- **MongoDB** with Mongoose ODM
- **Passport.js** for authentication
- **Express Sessions** for session management

### External APIs

- **The Movie Database (TMDB)** for movie and TV show data

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- TMDB API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/YourUsername/binge-o-matic.git
   cd binge-o-matic
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   MONGO_URI=your_mongodb_connection_string
   SECRET=your_session_secret
   TMDB_API_KEY=your_tmdb_api_key
   NODE_ENV=development
   PORT=3001
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

   This will start both the backend server (port 3001) and frontend development server concurrently.

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## Scripts

- `npm start` - Starts both server and client in development mode
- `npm run server` - Starts only the backend server
- `npm run client` - Starts only the frontend development server
- `npm test` - Runs the test suite
- `npm run test:watch` - Runs tests in watch mode
- `npm run test:coverage` - Runs tests with coverage report
- `npm run lint` - Lints the codebase
- `npm run lint:fix` - Fixes linting issues automatically

## Project Structure

```
binge-o-matic/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── queries/        # GraphQL queries
│   │   ├── mutations/      # GraphQL mutations
│   │   └── assets/         # Static assets
│   └── public/             # Public assets
├── server/                 # Node.js backend
│   ├── models/             # Mongoose models
│   ├── schema/             # GraphQL schema
│   ├── services/           # Business logic
│   └── helpers/            # Utility functions
├── coverage/               # Test coverage reports
└── package.json           # Root package configuration
```

## Key Features Explained

### Intelligent Series Organization

- **Multiverse Series Support**: Automatically organizes movies and episodes from interconnected series (like Marvel, DC, Star Wars, etc.) in proper chronological viewing order
- **Smart Sorting Algorithm**: Content is sorted by release date first, then by media type priority (movies → TV shows → seasons → episodes), and finally alphabetically by title
- **Cross-Series Continuity**: Maintain proper viewing order even when content spans multiple franchises or series

### List Management

- Create custom lists with unique names for different genres, franchises, or viewing goals
- Add movies and TV shows from TMDB search results
- Mark items as watched or unwatched
- Delete items from lists
- Content automatically maintains optimal viewing order

### TV Show Organization

- Add entire TV shows to your list
- Expand shows to view individual seasons
- Further expand seasons to see individual episodes
- Track progress at the episode level

### Search & Discovery

- Real-time search through TMDB's extensive database
- Filter results by movies, TV shows, or all content
- View detailed information including release dates and posters

## Testing

The project includes comprehensive testing with Jest and React Testing Library:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Deployment

The application is configured for deployment on platforms like Heroku:

1. **Heroku Setup**: The `Procfile` and `heroku-postbuild` script are included
2. **Docker**: A `Dockerfile` is provided for containerized deployment
3. **Fly.io**: Configuration file `fly.toml` is included

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

- `MONGO_URI`
- `SECRET`
- `TMDB_API_KEY`
- `NODE_ENV=production`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## API Documentation

The application uses GraphQL for API communication. The GraphQL Playground is available at `/graphql` in development mode for exploring the schema and testing queries.

### Key GraphQL Operations

- **Queries**: Fetch user data, lists, and media information
- **Mutations**: Create/update/delete lists, add/remove media, toggle watched status
- **Authentication**: Login, logout, and user registration

## License

This project is licensed under the ISC License.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie and TV show data
- [React](https://reactjs.org/) and [Apollo GraphQL](https://www.apollographql.com/) communities for excellent documentation and tools

---

**Happy binge-watching!** 🍿
