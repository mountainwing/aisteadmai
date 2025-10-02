// Health check endpoint for Vercel
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Love Landing API',
    environment: process.env.NODE_ENV || 'production',
    azure: {
      configured: !!process.env.AZURE_STORAGE_CONNECTION_STRING,
      container: process.env.AZURE_STORAGE_CONTAINER_NAME || 'love-ly-media'
    },
    mongodb: {
      configured: !!process.env.MONGODB_URI,
      database: process.env.MONGODB_DB_NAME || '_ethan_boyfriend_proposal'
    }
  });
}