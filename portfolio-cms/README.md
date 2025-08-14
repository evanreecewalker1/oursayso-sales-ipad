# Portfolio CMS

A Content Management System for managing portfolio projects, media items, and custom preview images.

## Features

- 🎨 **Project Management**: Edit project titles, descriptions, and categories
- 🎬 **Media Management**: Manage videos, PDFs, galleries, and case studies
- 📤 **Custom Preview Upload**: Upload custom preview images for PDFs and video thumbnails
- ☁️ **Cloudinary Integration**: Automatic upload and storage of preview images
- 💾 **Offline Support**: Integrates with portfolio service worker for offline functionality

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Cloudinary**
   - Create a Cloudinary account at https://cloudinary.com
   - Set up an upload preset named `portfolio_preset`
   - Configure the preset for unsigned uploads
   - Update `CLOUDINARY_CONFIG` in `src/App.js` if needed

3. **Environment Variables**
   ```bash
   # Optional - for enhanced Cloudinary features
   REACT_APP_CLOUDINARY_API_KEY=your_api_key
   ```

4. **Start Development Server**
   ```bash
   npm start
   ```

## Usage

### Managing Projects

1. **Select Project**: Click on a project in the sidebar to edit it
2. **Edit Details**: Update title, category, and description
3. **Save Changes**: Click "Save Project" to persist changes

### Custom Preview Images

#### PDF Preview Images
- Navigate to a project with PDF media items
- Find the PDF media item in the list
- Use the "PDF Preview Image" upload area
- Drag and drop or click to select an image
- Preview will automatically upload to Cloudinary
- Portfolio will use this custom preview instead of placeholder

#### Video Thumbnails
- Navigate to a project with video media items
- Find the video media item in the list
- Use the "Video Thumbnail" upload area
- Drag and drop or click to select an image
- Thumbnail will automatically upload to Cloudinary
- Portfolio will use this custom thumbnail instead of auto-generated preview

### Supported Formats
- **Images**: PNG, JPG, JPEG, GIF, WEBP
- **Max Size**: 10MB per image
- **Recommended**: 16:9 aspect ratio for video thumbnails, portrait for PDF previews

## Data Structure

The CMS updates the project data structure with custom preview fields:

```json
{
  "type": "pdf",
  "title": "Project Document",
  "files": [...],
  "customPreview": {
    "url": "https://res.cloudinary.com/dnuni9dgl/image/upload/v123/preview.jpg",
    "cloudinaryId": "preview_123",
    "uploadedAt": "2025-08-14T...",
    "size": 245760,
    "dimensions": {
      "width": 800,
      "height": 600
    },
    "originalName": "preview.jpg"
  }
}
```

## Portfolio Integration

The main portfolio automatically detects and uses custom preview images:

1. **Priority Order**: `customPreview` → `previewImage` → fallback
2. **Caching**: All custom previews are cached by service worker
3. **Offline Support**: Custom previews work offline after first load

## Development

### File Structure
```
portfolio-cms/
├── src/
│   ├── App.js          # Main CMS application
│   ├── App.css         # CMS styling
│   └── index.js        # React entry point
├── public/
│   └── index.html      # HTML template
└── package.json        # Dependencies
```

### Key Components
- **App**: Main CMS interface with project list
- **ProjectEditor**: Project details and media management
- **MediaItemEditor**: Individual media item with upload functionality

### API Integration
Currently uses static JSON files. For production:
1. Implement backend API for project CRUD operations
2. Replace `saveProjects()` with actual API calls
3. Add authentication and user management
4. Implement real-time updates

## Deployment

1. **Build Production**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify/Vercel**
   - Connect repository
   - Set build command: `npm run build`
   - Set publish directory: `build`

3. **Environment Variables**
   - Add `REACT_APP_CLOUDINARY_API_KEY` if using advanced features

## Troubleshooting

### Upload Issues
- Verify Cloudinary upload preset is configured for unsigned uploads
- Check network connectivity
- Ensure file size is under 10MB limit
- Verify supported file formats

### Preview Not Showing
- Check browser console for image load errors
- Verify Cloudinary URL is accessible
- Ensure portfolio app is using latest data structure
- Clear browser cache and reload

## License

Part of the OurSayso Portfolio system.