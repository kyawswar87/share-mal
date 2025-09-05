# Share Mal Frontend

React-based frontend for the Share Mal bill splitting application.

## Features

- **Bill Management**: Create, view, edit, and delete bills
- **Person Management**: Add participants to bills and track payment status
- **Search & Filter**: Search bills by title and filter by status
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live payment status updates

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on http://localhost:8080

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update the API URL in `.env` if needed:
   ```
   REACT_APP_API_URL=http://localhost:8080/api/v1
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm start
   ```

2. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## Project Structure

```
src/
├── components/          # React components
│   ├── BillCard.tsx    # Individual bill display card
│   ├── BillForm.tsx    # Create/edit bill form
│   ├── BillList.tsx    # Bills list with search and filter
│   ├── PersonList.tsx  # Participants list with payment status
│   └── SearchBar.tsx   # Search input with debouncing
├── services/           # API service layer
│   └── billApi.ts     # Bill API service
├── types/             # TypeScript type definitions
│   └── index.ts       # All type definitions
├── utils/             # Utility functions and constants
│   └── constants.ts   # App constants and configuration
├── App.tsx            # Main application component
├── App.css            # Application styles
└── index.tsx          # Application entry point
```

## API Integration

The frontend integrates with the following backend endpoints:

- `GET /api/v1/bills` - Get all bills
- `GET /api/v1/bills/{id}` - Get bill by ID
- `POST /api/v1/bills` - Create new bill
- `PUT /api/v1/bills/{id}` - Update bill
- `DELETE /api/v1/bills/{id}` - Delete bill
- `GET /api/v1/bills/status/{status}` - Get bills by status
- `GET /api/v1/bills/search?title={title}` - Search bills by title
- `PUT /api/v1/bills/{id}/status` - Update bill status

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Bootstrap** - UI components
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **date-fns** - Date formatting
- **React Router** - Navigation

## Features Overview

### Bill Management
- Create bills with title, amount, date, and split type
- Support for equal and custom amount splitting
- Edit existing bills
- Delete bills with confirmation

### Person Management
- Add multiple participants to bills
- Track individual payment status
- Toggle payment status (paid/unpaid)
- Automatic bill status updates based on payments

### Search & Filter
- Real-time search by bill title
- Filter bills by status (Incomplete, Complete, Paid)
- Debounced search to optimize API calls

### Responsive Design
- Mobile-first approach
- Bootstrap grid system
- Touch-friendly interface
- Print-friendly styles

## Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Bootstrap for styling
- Consistent naming conventions

## Deployment

The frontend can be deployed to any static hosting service:

1. Build the application: `npm run build`
2. Deploy the `build` folder contents
3. Ensure the API URL is correctly configured for production

## Troubleshooting

### Common Issues

1. **API Connection Issues**: Verify the backend is running and the API URL is correct
2. **CORS Errors**: Ensure the backend has CORS configured for the frontend domain
3. **Build Errors**: Check for TypeScript errors and missing dependencies

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
