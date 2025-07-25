# Kanban Todo Dashboard

A modern, fully-featured Kanban-style task management application built with Next.js, Material UI, React Query, and Zustand.

## 🚀 Features

- **Kanban Board**: Four columns (Backlog, In Progress, Review, Done)
- **Drag & Drop**: Move tasks between columns and reorder within columns
- **CRUD Operations**: Create, read, update, and delete tasks
- **Search Functionality**: Filter tasks by title or description
- **Pagination**: Navigate through tasks with 3 items per page per column
- **React Query Caching**: Efficient data fetching and caching
- **Material UI Design**: Modern, responsive interface
- **jQuery Bonus**: Separate dynamic list with animations

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **UI Library**: Material UI
- **Drag & Drop**: react-beautiful-dnd
- **API**: json-server (mocked locally)
- **TypeScript**: Full type safety

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd kanban-todo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install json-server globally (if not already installed)**
   ```bash
   npm install -g json-server
   ```

## 🏃‍♂️ Running the Application

1. **Start the JSON Server** (in one terminal)
   ```bash
   npm run server
   ```
   This will start the API server at `http://localhost:4000`

2. **Start the Next.js development server** (in another terminal)
   ```bash
   npm run dev
   ```
   This will start the application at `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

## 📋 API Endpoints

The json-server provides the following endpoints:

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

## 🎯 Task Schema

Each task contains the following fields:

```typescript
interface Task {
  id: number;
  title: string;
  description: string;
  column: 'backlog' | 'in-progress' | 'review' | 'done';
  order: number;
}
```

## 📱 Usage

### Kanban Dashboard (`/kanban`)
- **Add Task**: Click the "Add Task" button to create new tasks
- **Edit Task**: Hover over a task and click the edit icon
- **Delete Task**: Hover over a task and click the delete icon
- **Move Tasks**: Drag and drop tasks between columns or reorder within columns
- **Search**: Use the search bar to filter tasks by title or description
- **Pagination**: Navigate through tasks using the pagination controls

### jQuery Dynamic List (`/jquery`)
- **Add Items**: Enter text and click "Add Item" or press Enter
- **Error Handling**: Empty submissions show error messages that fade out after 2 seconds
- **Delete Items**: Click the delete button on any item to remove it with animation

## 🎨 Key Features Explained

### Drag & Drop with Reordering
- Uses `react-beautiful-dnd` for smooth drag and drop
- Supports both inter-column and intra-column movement
- Automatically handles order updates and reordering logic

### React Query Integration
- Caches task data for 5 minutes
- Automatic background refetching
- Optimistic updates for better UX
- Built-in loading and error states

### Material UI Theming
- Custom theme with branded colors
- Responsive design for all screen sizes
- Consistent spacing and typography
- Hover effects and smooth transitions

### State Management
- Zustand for client-side state (search, pagination)
- React Query for server state management
- Clean separation of concerns

## 📁 Project Structure

```
├── app/
│   ├── kanban/page.tsx        # Kanban dashboard page
│   ├── jquery/page.tsx        # jQuery bonus task
│   ├── layout.tsx             # Root layout with providers
│   ├── page.tsx               # Home page with navigation
│   └── providers/
│       └──ThemeProvider.tsx        # Material UI theme
│       └──ReactQueryProvider.tsx   # ReactQuery
├── components/
│   └── kanban/
│       ├── KanbanDashboard.tsx    # Main dashboard component
│       ├── KanbanColumn.tsx       # Column component
│       ├── TaskCard.tsx           # Individual task card
│       └── AddTaskModal.tsx       # Add task modal
├── hooks/
│   └── useTasks.ts            # React Query hooks
├── lib/
│   └── api.ts                 # API service layer
├── store/
│   └── useTaskStore.ts        # Zustand store
├── types/
│   └── kanbanTypes.ts         # TypeScript interfaces
├── db.json                    # JSON server database
└── package.json
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables if needed
4. Deploy!

### Deploy to Netlify
1. Run `npm run build`
2. Upload the `.next` folder to Netlify
3. Configure build settings

## 🧪 Testing

The application includes:
- TypeScript for compile-time type checking
- Error boundaries for runtime error handling
- Loading states for all async operations
- Form validation and error messages

## 🔧 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run server` - Start JSON server

## 📝 Notes

- Make sure to start the JSON server before running the application
- The application uses port 3000 for Next.js and port 4000 for the API
- All data is persisted in the `db.json` file
- The application is fully responsive and works on mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.#   K a b a n  
 #   K a b a n  
 