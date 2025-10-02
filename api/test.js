// Test endpoint to debug media API issues
export default async function handler(req, res) {
  try {
    res.setHeader('Content-Type', 'application/json');
    
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Test environment variables
    const config = {
      azure: {
        hasConnectionString: !!process.env.AZURE_STORAGE_CONNECTION_STRING,
        connectionStringLength: process.env.AZURE_STORAGE_CONNECTION_STRING?.length || 0,
        containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || 'love-ly-media',
        hasContainer: !!process.env.AZURE_STORAGE_CONTAINER_NAME
      },
      mongodb: {
        hasUri: !!process.env.MONGODB_URI,
        uriLength: process.env.MONGODB_URI?.length || 0,
        database: process.env.MONGODB_DB_NAME || '_ethan_boyfriend_proposal'
      },
      node: {
        version: process.version,
        env: process.env.NODE_ENV || 'production'
      }
    };

    // Test Azure SDK import
    let azureTest = 'not-tested';
    try {
      const { BlobServiceClient } = await import('@azure/storage-blob');
      azureTest = 'import-success';
      
      if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
        try {
          const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
          azureTest = 'connection-created';
          
          const containerClient = blobServiceClient.getContainerClient(config.azure.containerName);
          azureTest = 'container-client-created';
          
          // Test if container exists (this might fail and that's ok)
          try {
            const exists = await containerClient.exists();
            azureTest = exists ? 'container-exists' : 'container-missing';
          } catch (existsError) {
            azureTest = `exists-check-failed: ${existsError.message}`;
          }
        } catch (connectionError) {
          azureTest = `connection-failed: ${connectionError.message}`;
        }
      } else {
        azureTest = 'no-connection-string';
      }
    } catch (importError) {
      azureTest = `import-failed: ${importError.message}`;
    }

    res.status(200).json({
      status: 'test-complete',
      timestamp: new Date().toISOString(),
      config,
      azureTest,
      message: 'This endpoint helps debug media API configuration issues'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Test endpoint failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}