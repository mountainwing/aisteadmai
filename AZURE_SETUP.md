# Azure Blob Storage Setup Guide

This application uses Azure Blob Storage for media file management (photos and videos). Follow these steps to set up Azure Blob Storage:

## Prerequisites

1. An Azure account (create one at [https://azure.microsoft.com](https://azure.microsoft.com))
2. Azure CLI installed (optional, but recommended)

## Step 1: Create a Storage Account

1. Log in to the [Azure Portal](https://portal.azure.com)
2. Click "Create a resource" → "Storage" → "Storage account"
3. Fill in the details:
   - **Subscription**: Your Azure subscription
   - **Resource group**: Create new or use existing
   - **Storage account name**: Choose a unique name (e.g., `lovelylandingmedia`)
   - **Region**: Choose a region close to your users
   - **Performance**: Standard
   - **Redundancy**: LRS (Locally redundant storage) for cost savings
4. Click "Review + create" → "Create"

## Step 2: Create a Blob Container

1. Navigate to your storage account in the Azure Portal
2. Go to "Data storage" → "Containers"
3. Click "+ Container"
4. Set:
   - **Name**: `love-ly-media` (or match your `AZURE_STORAGE_CONTAINER_NAME`)
   - **Public access level**: "Blob (anonymous read access for blobs only)"
5. Click "Create"

## Step 3: Get Connection String

1. In your storage account, go to "Security + networking" → "Access keys"
2. Copy the "Connection string" from Key1 or Key2

## Step 4: Set Environment Variables

Create a `.env` file in your project root with:

```env
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=your_storage_account_name;AccountKey=your_storage_account_key;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER_NAME=love-ly-media
```

Replace the connection string with the one you copied from Azure Portal.

## Step 5: Deploy to Vercel

When deploying to Vercel, add the environment variables:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add:
   - `AZURE_STORAGE_CONNECTION_STRING` (paste your connection string)
   - `AZURE_STORAGE_CONTAINER_NAME` (e.g., `love-ly-media`)

## Features

- **Automatic Container Creation**: The API will create the container if it doesn't exist
- **Public Blob Access**: Images and videos are publicly accessible via direct URLs
- **Metadata Storage**: File metadata (captions, upload info) is stored as blob metadata
- **File Type Detection**: Automatic detection of image vs video types
- **Unique Filenames**: UUIDs prevent filename conflicts

## Cost Considerations

- Azure Blob Storage pricing is based on storage used and data transfer
- Hot tier is recommended for frequently accessed media
- Consider Cool or Archive tiers for older media to reduce costs
- Monitor your usage through Azure Cost Management

## Security Notes

- The container is set to public blob access for direct image/video serving
- Only the blob contents are public, not the container listing
- Access keys should be kept secure and rotated periodically
- Consider using Azure Active Directory authentication for enhanced security