# Football Team Search Application

## MY Approach
   ## Technology Stack

   ### Backend
   - **ASP.NET Core 9.0** - Web API framework
   - **Entity Framework Core** - ORM for database operations
   - **SQLite** - In-memory database for data storage
   - **CsvHelper** - CSV file processing
   - **Swagger** - API documentation

   ### Frontend
   - **React 19.1** - Frontend framework
   - **TypeScript** - Type-safe JavaScript
   - **CSS3** - Styling and responsive design
   
   ### IA
   - **Claude Code** - IA assistance for code generation and problem-solving
   ## Architecture

   The application follows a clean architecture pattern with clear separation of concerns:

   ```
   FootballTeamSearch/
   ├── Controllers/          # API Controllers
   ├── Data/                # Database Context
   ├── Models/              # Data Models
   ├── Services/            # Business Logic Services
   ├── client/              # React Frontend
   │   └── src/
   │       ├── components/  # React Components
   │       └── ...
   └── CollegeFootballTeamWinsWithMascots.csv
   ```

   #### Data Seeding
   - Automatic CSV import on application startup
   - Maps CSV headers to model properties

   #### Search Service
   - Supports searching across all columns or specific columns
   - Uses LINQ for efficient database queries

   #### User Experience
   - Mobile-responsive design

   ## API Endpoints

   - `GET /api/footballteams` - Get all teams (limited to 20)
   - `GET /api/footballteams/search?searchTerm={term}&column={column}` - Search teams
   - `GET /api/footballteams/columns` - Get available search columns


## Time Investment

**Total Development Time: Approximately 2.5-3 hours**

Breakdown:
- Initial setup and project structure: 30 minutes
- Backend development (models, services, controllers): 60 minutes
- Frontend development (React components, styling): 60 minutes
- Testing and debugging: 30-45 minutes



## Observations and Learning

### Learning Opportunities
1. **Entity Framework**: I have limited experience with EF Core, so this project helped me understand data modeling, migrations, and LINQ queries better.
2. **TypeScript**: I have basic knowledge of JavaScript but wanted to improve my TypeScript skills, especially in a React context.

## Deployment Instructions

### Prerequisites
- .NET 9.0 SDK
- Node.js 18+ with npm

### Running the Application
1. **Start the Backend**:
   ```bash
   cd FootballTeamSearch
   dotnet run
   ```
   API will be available at `https://localhost:7001`

2. **Start the Frontend**:
   ```bash
   cd FootballTeamSearch/client
   npm install
   npm start
   ```
   Frontend will be available at `http://localhost:3000`
