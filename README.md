# T3.Chat Clone

A full-stack clone of T3.chat built with modern web technologies. This monorepo contains both the frontend UI and backend API, creating a complete chat application with AI integration.

## 🏗️ Project Architecture

This project uses a monorepo structure with npm workspaces:

```
t3chat-clone/
├── t3chat-clone-ui/      # Next.js frontend application
├── t3chat-clone-api/     # NestJS backend API
├── package.json          # Root package.json with workspace configuration
└── tsconfig.base.json    # Shared TypeScript configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd t3chat-clone

# Install all dependencies (both UI and API)
npm install

# Run both frontend and backend in development mode
npm run dev
```

This will start:
- Frontend UI at http://localhost:3000
- Backend API at http://localhost:3001 (assuming default NestJS port)

### Individual Commands

```bash
# Run only the frontend
npm run dev:ui

# Run only the backend
npm run dev:api

# Build everything
npm run build

# Run linting
npm run lint

# Run tests
npm run test
```

## 📁 Project Structure

### Frontend (`t3chat-clone-ui/`)

A Next.js 15 application with:
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Custom React components
- **Icons**: Lucide React
- **Language**: TypeScript

Key features:
- Wine-tinted sidebar with chat history
- Slate purple main content area
- Message limit banner
- Quick action buttons
- AI model selector
- Responsive design

[See detailed frontend documentation](./t3chat-clone-ui/README.md)

### Backend (`t3chat-clone-api/`)

A NestJS application with:
- **Framework**: NestJS
- **Language**: TypeScript
- **Testing**: Jest

Currently provides basic API structure ready for:
- Chat endpoints
- Authentication
- WebSocket support
- AI model integration

## 🎨 Design System

The application features a sophisticated color scheme:

| Element | Color | Hex |
|---------|-------|-----|
| Sidebar | Wine-tinted dark | `#1f1320` |
| Main Background | Slate purple | `#1a1625` |
| Primary Accent | Pink/mauve | `#a8537d` |
| Warning Banner | Tan/brown | `#8b6f47` |
| Text Primary | White | `#ffffff` |
| Text Secondary | Muted gray | `#9ca3af` |
| Text Muted | Dimmer gray | `#6b7280` |

## 🔧 Development Workflow

### Running in Development

The root `package.json` uses `concurrently` to run both services simultaneously:

```bash
npm run dev  # Starts both UI and API
```

### Building for Production

```bash
npm run build  # Builds both applications
```

### Code Quality

```bash
npm run lint  # Runs ESLint on both projects
npm run test  # Runs test suites
```

## 📊 Current Status

### ✅ Completed

**Frontend (95% visual completion)**:
- Complete UI implementation matching T3.chat design
- All visual components built and styled
- Responsive layout for mobile and desktop
- Basic interactions and hover states
- Mock data for development

**Backend (Basic structure)**:
- NestJS application scaffolding
- Basic controller and service structure
- Development environment setup

### 🚧 TODO for Production

**High Priority**:
1. Connect frontend to backend API
2. Implement authentication system
3. Add real-time messaging with WebSocket
4. Integrate AI model APIs
5. Database setup and migrations

**Features**:
- User registration and login
- Chat persistence
- File uploads
- Message search
- Theme switching
- Export functionality

**Technical Debt**:
- Add comprehensive test coverage
- Implement proper error handling
- Add logging and monitoring
- Security hardening
- Performance optimization

[See detailed requirements in the frontend README](./t3chat-clone-ui/README.md#-what-still-needs-to-be-done-for-production)

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 3.4** - Utility-first styling
- **Lucide React** - Icon library

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type safety
- **Jest** - Testing framework

### Development Tools
- **Concurrently** - Run multiple commands
- **ESLint** - Code linting
- **npm workspaces** - Monorepo management

## 🚀 Deployment

### Environment Variables

Create `.env` files in both `t3chat-clone-ui` and `t3chat-clone-api`:

**Frontend** (`t3chat-clone-ui/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

**Backend** (`t3chat-clone-api/.env`):
```env
PORT=3001
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
AI_API_KEY=your-ai-api-key
```

### Production Deployment

Both applications can be deployed independently:

**Frontend**: 
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Self-hosted with Node.js

**Backend**:
- Railway
- Heroku
- AWS ECS/EKS
- Google Cloud Run
- Self-hosted VPS

### Docker Support (TODO)

Docker configuration is planned for easier deployment:
```bash
# Future commands
docker-compose up -d  # Run entire stack
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This is a clone project created for educational purposes. The original T3.chat design and concept belong to their respective owners.

## 🙏 Acknowledgments

- Original design inspiration from [T3.chat](https://t3.chat)
- Built with amazing open-source tools and libraries
- Community feedback and contributions

---

**Note**: This is a work-in-progress clone project. Many features are still under development. See individual README files in each workspace for detailed information.