import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import heroRoutes from './routes/hero.js';
import mediaRoutes from './routes/media.js';
import reasonsRoutes from './routes/reasons.js';
import reasonHeaderRoutes from './routes/reasonheader.js';
import proposalRoutes from './routes/proposal.js';

// Load environment variables from root directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/hero', heroRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/reasons', reasonsRoutes);
app.use('/api/reasonheader', reasonHeaderRoutes);
app.use('/api/proposal', proposalRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Love Landing API'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Love Landing API server running on port ${PORT}`);
  console.log(`📝 Hero API: http://localhost:${PORT}/api/hero`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
});