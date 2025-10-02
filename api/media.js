// Vercel serverless function for media API with Azure Blob Storage
import { BlobServiceClient } from '@azure/storage-blob';
import cors from 'cors';
import { randomUUID } from 'crypto';

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

function runCors(req, res) {
  return new Promise((resolve, reject) => {
    cors(corsOptions)(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Azure Blob Storage connection
function getBlobServiceClient() {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  
  if (!connectionString) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING is not defined in environment variables');
  }

  return BlobServiceClient.fromConnectionString(connectionString);
}

// Helper function to get container client
async function getContainerClient() {
  const blobServiceClient = getBlobServiceClient();
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'love-ly-media';
  const containerClient = blobServiceClient.getContainerClient(containerName);
  
  // Ensure container exists
  await containerClient.createIfNotExists({
    access: 'blob' // Allow public read access to blobs
  });
  
  return containerClient;
}

// Mock media handler for development/testing
async function handleMockMedia(req, res) {
  console.log('Using mock media handler - Azure not configured');
  
  if (req.method === 'GET') {
    // Return some mock media data
    const mockMedia = [
      {
        _id: 'mock-image-1',
        filename: 'mock-image.jpg',
        originalName: 'Beautiful Memory',
        mimetype: 'image/jpeg',
        size: 150000,
        type: 'image',
        url: '/placeholder.svg',
        uploadedBy: 'user',
        caption: 'A beautiful memory (mock data)',
        uploadedAt: new Date('2024-01-15T10:30:00Z')
      },
      {
        _id: 'mock-video-1',
        filename: 'mock-video.mp4',
        originalName: 'Special Moment',
        mimetype: 'video/mp4',
        size: 5000000,
        type: 'video',
        url: '/placeholder.svg',
        uploadedBy: 'user',
        caption: 'A special moment (mock data)',
        uploadedAt: new Date('2024-01-20T14:20:00Z')
      }
    ];
    
    return res.json(mockMedia);
    
  } else if (req.method === 'POST') {
    // Mock upload response
    const { fileName, fileType, caption } = req.body || {};
    
    const mockUpload = {
      _id: `mock-${Date.now()}`,
      filename: fileName || 'uploaded-file.jpg',
      originalName: fileName || 'uploaded-file.jpg',
      mimetype: fileType || 'image/jpeg',
      size: 100000,
      type: fileType?.startsWith('video/') ? 'video' : 'image',
      url: '/placeholder.svg',
      uploadedBy: 'user',
      caption: caption || 'Mock uploaded file',
      uploadedAt: new Date()
    };
    
    return res.json(mockUpload);
    
  } else if (req.method === 'DELETE') {
    return res.json({ message: 'Mock delete successful' });
    
  } else if (req.method === 'PATCH') {
    const { caption } = req.body || {};
    
    const mockUpdate = {
      _id: 'mock-updated',
      caption: caption || 'Updated caption',
      message: 'Mock update successful'
    };
    
    return res.json(mockUpdate);
    
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

export default async function handler(req, res) {
  await runCors(req, res);
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Check if Azure is configured
    const isAzureConfigured = process.env.AZURE_STORAGE_CONNECTION_STRING;
    
    if (!isAzureConfigured) {
      // Fallback to mock data for development/testing
      return handleMockMedia(req, res);
    }

    const containerClient = await getContainerClient();
    
    if (req.method === 'GET') {
      try {
        // List all blobs in the container
        const media = [];
        
        for await (const blob of containerClient.listBlobsFlat({ includeMetadata: true })) {
          try {
            const blobClient = containerClient.getBlobClient(blob.name);
            const blobUrl = blobClient.url;
            
            // Parse metadata or use defaults
            const metadata = blob.metadata || {};
            
            media.push({
              _id: blob.name.split('.')[0], // Use filename without extension as ID
              filename: blob.name,
              originalName: metadata.originalname || blob.name,
              mimetype: blob.properties.contentType || 'application/octet-stream',
              size: blob.properties.contentLength || 0,
              type: blob.properties.contentType?.startsWith('video/') ? 'video' : 'image',
              url: blobUrl,
              uploadedBy: metadata.uploadedby || 'user',
              caption: metadata.caption || '',
              uploadedAt: blob.properties.lastModified || new Date()
            });
          } catch (blobError) {
            console.warn('Error processing blob:', blob.name, blobError.message);
            // Continue with other blobs
          }
        }
        
        // Sort by upload date (newest first)
        media.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        
        res.json(media);
      } catch (listError) {
        console.error('Error listing blobs:', listError);
        throw new Error(`Failed to list media files: ${listError.message}`);
      }
      
    } else if (req.method === 'POST') {
      // Handle file upload to Azure Blob Storage
      // Note: In Vercel serverless functions, we need to handle multipart data differently
      
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: 'Invalid request body' });
      }

      const { fileData, fileName, fileType, caption, uploadedBy } = req.body;
      
      if (!fileData || !fileName) {
        return res.status(400).json({ error: 'File data and name are required' });
      }

      // Generate unique filename
      const extension = fileName.split('.').pop() || 'jpg';
      const uniqueFileName = `${randomUUID()}-${Date.now()}.${extension}`;
      
      // Convert base64 to buffer
      const buffer = Buffer.from(fileData, 'base64');
      
      // Upload to Azure Blob Storage
      const blobClient = containerClient.getBlockBlobClient(uniqueFileName);
      
      const metadata = {
        originalname: fileName,
        uploadedby: uploadedBy || 'user',
        caption: caption || '',
        uploadedat: new Date().toISOString()
      };
      
      await blobClient.upload(buffer, buffer.length, {
        blobHTTPHeaders: {
          blobContentType: fileType || 'application/octet-stream'
        },
        metadata
      });
      
      // Return the created media item
      const createdMedia = {
        _id: uniqueFileName.split('.')[0],
        filename: uniqueFileName,
        originalName: fileName,
        mimetype: fileType || 'application/octet-stream',
        size: buffer.length,
        type: fileType?.startsWith('video/') ? 'video' : 'image',
        url: blobClient.url,
        uploadedBy: uploadedBy || 'user',
        caption: caption || '',
        uploadedAt: new Date()
      };
      
      res.json(createdMedia);
      
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }
      
      // Find blob by ID (filename prefix)
      let blobToDelete = null;
      for await (const blob of containerClient.listBlobsFlat()) {
        if (blob.name.startsWith(id)) {
          blobToDelete = blob.name;
          break;
        }
      }
      
      if (!blobToDelete) {
        return res.status(404).json({ error: 'Media not found' });
      }
      
      // Delete the blob
      const blobClient = containerClient.getBlobClient(blobToDelete);
      await blobClient.delete();
      
      res.json({ message: 'Media deleted successfully' });
      
    } else if (req.method === 'PATCH') {
      const { id, caption } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }
      
      // Find blob by ID (filename prefix)
      let blobToUpdate = null;
      for await (const blob of containerClient.listBlobsFlat({ includeMetadata: true })) {
        if (blob.name.startsWith(id)) {
          blobToUpdate = blob;
          break;
        }
      }
      
      if (!blobToUpdate) {
        return res.status(404).json({ error: 'Media not found' });
      }
      
      // Update blob metadata
      const blobClient = containerClient.getBlobClient(blobToUpdate.name);
      const metadata = blobToUpdate.metadata || {};
      metadata.caption = caption || '';
      metadata.updatedat = new Date().toISOString();
      
      await blobClient.setMetadata(metadata);
      
      // Return updated media item
      const properties = await blobClient.getProperties();
      const updatedMedia = {
        _id: blobToUpdate.name.split('.')[0],
        filename: blobToUpdate.name,
        originalName: metadata.originalname || blobToUpdate.name,
        mimetype: properties.contentType || 'application/octet-stream',
        size: properties.contentLength || 0,
        type: properties.contentType?.startsWith('video/') ? 'video' : 'image',
        url: blobClient.url,
        uploadedBy: metadata.uploadedby || 'user',
        caption: metadata.caption || '',
        uploadedAt: properties.lastModified || new Date()
      };
      
      res.json(updatedMedia);
      
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS']);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
    
  } catch (error) {
    console.error('Media API Error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Internal server error';
    let statusCode = 500;
    
    if (error.message?.includes('AZURE_STORAGE_CONNECTION_STRING')) {
      errorMessage = 'Azure Storage not configured. Please set AZURE_STORAGE_CONNECTION_STRING environment variable.';
      statusCode = 503; // Service Unavailable
    } else if (error.message?.includes('BlobServiceClient')) {
      errorMessage = 'Failed to connect to Azure Storage. Check your connection string.';
      statusCode = 503;
    } else if (error.message?.includes('ContainerClient')) {
      errorMessage = 'Failed to access Azure Storage container. Check container permissions.';
      statusCode = 503;
    }
    
    res.status(statusCode).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}