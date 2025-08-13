import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import './App.css';

// This will be populated from the CMS JSON files
let projects = [
  {
    id: 1,
    title: "Lovell Leadership Conferences",
    tags: ["Events"],
    backgroundVideo: "/videos/project1.mp4",
    description: "Leadership development conferences designed to inspire and educate senior executives.",
    media: [
      { type: 'video', title: 'Event Highlights', duration: '3:24', src: '/videos/project1.mp4' },
      { type: 'image', title: 'Gallery', count: '12 images' },
      { type: 'pdf', title: 'Event Program', count: '16 pages', src: '/pdfs/lovell-event-program.pdf' },
      { 
        type: 'case-study', 
        title: 'Impact Report', 
        count: '8 pages',
        caseStudyData: {
          title: 'Lovell Leadership Conference Transformation',
          challenge: 'Traditional leadership conferences were failing to engage senior executives, with attendance dropping 35% over three years. Participants found content generic and networking opportunities limited.',
          solution: 'We redesigned the entire conference experience with personalized content tracks, interactive leadership simulations, and AI-powered networking. Created immersive workshops and introduced peer mentoring sessions.',
          results: 'Transformed leadership development for Fortune 500 executives',
          statistics: [
            { number: '92%', label: 'Satisfaction Rate' },
            { number: '+156%', label: 'Attendance Increase' },
            { number: '47', label: 'Companies Represented' },
            { number: '8.9/10', label: 'Net Promoter Score' }
          ],
          beforeAfter: {
            before: {
              image: '/images/case-studies/lovell-before.jpg',
              title: 'Traditional Conference Setup',
              description: 'Standard auditorium with passive learning'
            },
            after: {
              image: '/images/case-studies/lovell-after.jpg', 
              title: 'Interactive Leadership Hub',
              description: 'Dynamic spaces designed for collaboration'
            }
          },
          clientQuote: {
            text: 'The conference transformation exceeded all expectations. Our executives are already asking about next year.',
            author: 'Sarah Mitchell',
            title: 'Chief Learning Officer, Lovell Corporation'
          }
        }
      }
    ]
  },
  {
    id: 2,
    title: "Rarely Heard Voices Videos",
    tags: ["Video"],
    backgroundImage: "/images/project2.png",
    description: "Documentary video series highlighting underrepresented voices in business.",
    media: [
      { type: 'video', title: 'Full Documentary', duration: '12:45', src: '/videos/rarely-heard-voices-full.mp4' },
      { type: 'video', title: 'Behind the Scenes', duration: '2:15', src: '/videos/rarely-heard-voices-bts.mp4' },
      { type: 'image', title: 'Photography', count: '8 images' },
      { type: 'case-study', title: 'Project Overview', count: '4 pages', src: '/pdfs/rarely-heard-voices-overview.pdf' }
    ]
  },
  {
    id: 3,
    title: "DRYZZE® & Cook Pronto® Branding",
    tags: ["Design & Digital"],
    backgroundImage: "/images/project3.png",
    description: "Complete branding and product design for innovative kitchen appliance brands.",
    media: [
      { type: 'video', title: 'Brand Reveal', duration: '1:45', src: '/videos/dryzze-brand-reveal.mp4' },
      { type: 'image', title: 'Brand Book', count: '24 images' },
      { type: 'image', title: 'Product Photography', count: '16 images' },
      { type: 'pdf', title: 'Brand Guidelines', count: '32 pages', src: '/pdfs/dryzze-brand-guidelines.pdf' },
      { type: 'case-study', title: 'Design Process', count: '12 pages', src: '/pdfs/dryzze-design-process.pdf' },
      { type: 'video', title: 'Behind the Brand', duration: '4:20', src: '/videos/dryzze-behind-brand.mp4' }
    ]
  },
  {
    id: 4,
    title: "Warner Bros & Discovery Training",
    tags: ["Design & Digital"],
    backgroundImage: "/images/project4.png",
    description: "Training materials and digital resources for media industry professionals.",
    media: [
      { type: 'image', title: 'Training Materials', count: '16 images' },
      { type: 'video', title: 'Training Modules', duration: '4:12', src: '/videos/wb-discovery-training.mp4' },
      { type: 'pdf', title: 'Training Guide', count: '24 pages', src: '/pdfs/wb-discovery-guide.pdf' }
    ]
  },
  {
    id: 5,
    title: "River Island 'Wrapped' Video",
    tags: ["Video"],
    backgroundVideo: "/videos/project5.mp4",
    backgroundImage: "/images/project5.png",
    description: "Fashion retail campaign video showcasing seasonal collections.",
    media: [
      { type: 'image', title: 'Behind Scenes', count: '20 images' },
      { type: 'video', title: 'Campaign Video', duration: '2:30', src: '/videos/river-island-wrapped.mp4' },
      { type: 'case-study', title: 'Campaign Analysis', count: '6 pages', src: '/pdfs/river-island-analysis.pdf' }
    ]
  },
  {
    id: 6,
    title: "Accor Owner Services Catalogue",
    tags: ["Design & Digital"],
    backgroundImage: "/images/project6.png",
    description: "Comprehensive service catalogue for hotel owners and operators.",
    media: [
      { type: 'image', title: 'Catalogue Design', count: '14 images' },
      { type: 'video', title: 'Digital Flipbook', duration: '3:55' }
    ]
  },
  {
    id: 7,
    title: "Noah's Promotional Film",
    tags: ["Video"],
    backgroundVideo: "/videos/project7.mp4",
    backgroundImage: "/images/project7.png",
    description: "Promotional film showcasing Noah's charity work and impact.",
    media: [
      { type: 'image', title: 'Film Stills', count: '18 images' },
      { type: 'video', title: 'Promotional Film', duration: '8:20' }
    ]
  },
  {
    id: 8,
    title: "Wealmoor Website Design",
    tags: ["Design & Digital"],
    backgroundImage: "/images/project8.png",
    description: "Modern website design and development for financial services.",
    media: [
      { type: 'image', title: 'Website Screens', count: '22 images' },
      { type: 'video', title: 'Website Demo', duration: '5:10' }
    ]
  },
  {
    id: 9,
    title: "Insight Research Website",
    tags: ["Design & Digital"],
    backgroundImage: "/images/project9.png",
    description: "Research-focused website with data visualization and reporting tools.",
    media: [
      { type: 'image', title: 'Website Designs', count: '28 images' },
      { type: 'video', title: 'Feature Demo', duration: '1:20' }
    ]
  },
  {
    id: 10,
    title: "ARDA Impact Video Shoot & Website",
    tags: ["Design & Digital"],
    backgroundImage: "/images/project10.png",
    description: "Video production and website development for association impact reporting.",
    media: [
      { type: 'image', title: 'Shoot Gallery', count: '32 images' },
      { type: 'video', title: 'Impact Video', duration: '3:45' }
    ]
  }
];

const quotes = [
  {
    text: "Their work is memorable, relevant, entertaining, thought provoking, and above all highly effective.",
    author: "Faye Frater, InterContinental Hotels Group"
  },
  {
    text: "Oursayso are great to work with both from the quality of their work and the enthusiasm and commitment that they put into it.",
    author: "Alan Long, Executive Director, Mears Group"
  },
  {
    text: "Oursayso work hard with the leadership of the business to deliver appropriate, simple and direct messages that will see an immediate response.",
    author: "Paul Mildenstein, CEO, Atkore"
  }
];

// Function to convert CMS project data to portfolio format
const convertCMSProjectToPortfolioFormat = (cmsProject) => {
  return {
    id: parseInt(cmsProject.id) || cmsProject.id,
    title: cmsProject.title,
    tags: cmsProject.tags.slice(0, 1), // Take first tag for display
    backgroundVideo: cmsProject.tileBackground?.type === 'video' ? cmsProject.tileBackground.url : null,
    backgroundImage: cmsProject.tileBackground?.type === 'image' ? cmsProject.tileBackground.url : null,
    description: cmsProject.description,
    media: cmsProject.mediaItems?.map(item => ({
      type: item.type,
      title: item.title,
      duration: item.files?.[0]?.duration || '2:30',
      src: item.files?.[0]?.url,
      count: item.type === 'image' ? '12 images' : undefined
    })) || []
  };
};

// Function to load projects from CMS JSON files
const loadProjectsFromCMS = async () => {
  try {
    console.log('🔍 Loading projects from CMS JSON files...');
    
    // Fetch page 1 projects from GitHub repository
    const page1Response = await fetch('https://raw.githubusercontent.com/evanreecewalker1/oursayso-sales-ipad/main/public/data/projects.json');
    const page1Data = await page1Response.json();
    
    console.log('📄 Page 1 data loaded:', page1Data);
    console.log('📝 First project title in CMS data:', page1Data.projects?.[0]?.title);
    
    if (page1Data.projects && Array.isArray(page1Data.projects)) {
      const convertedProjects = page1Data.projects.map(convertCMSProjectToPortfolioFormat);
      console.log('✅ Converted projects:', convertedProjects);
      console.log('🎯 First converted project title:', convertedProjects[0]?.title);
      
      // Update the global projects array
      projects.length = 0; // Clear existing
      projects.push(...convertedProjects);
      
      console.log('🚀 Projects updated from CMS!');
      console.log('🔍 Final projects array first title:', projects[0]?.title);
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to load projects from CMS:', error);
    console.log('📝 Using hardcoded fallback data');
    return false;
  }
};

const App = () => {
  console.log('🎬 Portfolio App component rendered');
  
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard', 'project', 'page2', 'gallery', 'video', 'pdf', 'case-study'
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [projectsLoaded, setProjectsLoaded] = useState(false);

  // Load projects from CMS on app start
  useEffect(() => {
    console.log('🚀 Portfolio App useEffect triggered - attempting to load CMS data');
    
    const loadProjects = async () => {
      console.log('📍 loadProjects function called');
      const loaded = await loadProjectsFromCMS();
      console.log('📍 loadProjectsFromCMS returned:', loaded);
      setProjectsLoaded(loaded);
    };
    
    loadProjects();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Show loading state while fetching CMS data
  if (!projectsLoaded && projects.length === 0) {
    return (
      <div className="app">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div style={{ color: '#1652FB', fontSize: '18px' }}>Loading portfolio data...</div>
        </div>
      </div>
    );
  }

  // Helper function to render tile background (video or image)
  const renderTileBackground = (project) => {
    if (project.backgroundVideo) {
      return (
        <video 
          className="tile-video-background"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={project.backgroundVideo} type="video/mp4" />
        </video>
      );
    }
    return null;
  };

  // Helper function to get tile style for background image
  const getTileStyle = (project) => {
    if (project.backgroundImage && !project.backgroundVideo) {
      return {
        backgroundImage: `url(${project.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
    return {};
  };

  // Handle media preview clicks
  const handleMediaClick = (mediaItem, projectTitle) => {
    setSelectedMedia({ ...mediaItem, projectTitle });
    
    if (mediaItem.type === 'video') {
      setCurrentPage('video');
    } else if (mediaItem.type === 'image') {
      // Generate placeholder gallery images
      const imageCount = parseInt(mediaItem.count?.split(' ')[0]) || 12;
      const placeholderImages = Array.from({ length: imageCount }, (_, i) => ({
        src: `/images/gallery/${projectTitle.toLowerCase().replace(/\s+/g, '-')}/image-${i + 1}.jpg`,
        alt: `${mediaItem.title} ${i + 1}`
      }));
      setGalleryImages(placeholderImages);
      setCurrentImageIndex(0);
      setCurrentPage('gallery');
    } else if (mediaItem.type === 'pdf') {
      setCurrentPage('pdf');
    } else if (mediaItem.type === 'case-study') {
      setCurrentPage('case-study'); // Case studies use dedicated case study viewer
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setCurrentPage('project');
  };

  // Gallery navigation functions
  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  // Gallery Viewer
  if (currentPage === 'gallery' && selectedMedia && galleryImages.length > 0) {
    return (
      <div className="app">
        <div className="gallery-viewer">
          {/* Back Button */}
          <button 
            className="back-button"
            onClick={() => setCurrentPage('project')}
          >
            <ArrowLeft size={32} />
          </button>
          
          {/* Image Counter */}
          <div className="gallery-counter">
            {currentImageIndex + 1} of {galleryImages.length}
          </div>
          
          {/* Main Image Display */}
          <div className="gallery-main">
            <div className="gallery-image-container">
              <img 
                src={galleryImages[currentImageIndex].src}
                alt={galleryImages[currentImageIndex].alt}
                className="gallery-image"
                onError={(e) => {
                  // Fallback to placeholder
                  e.target.src = 'https://via.placeholder.com/800x600/333/fff?text=' + encodeURIComponent(galleryImages[currentImageIndex].alt);
                }}
              />
            </div>
            
            {/* Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button className="gallery-nav gallery-nav-left" onClick={goToPreviousImage}>
                  <ArrowLeft size={40} />
                </button>
                <button className="gallery-nav gallery-nav-right" onClick={goToNextImage}>
                  <ArrowRight size={40} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Video Player
  if (currentPage === 'video' && selectedMedia) {
    return (
      <div className="app">
        <div className="video-viewer">
          {/* Back Button */}
          <button 
            className="back-button video-back-button"
            onClick={() => setCurrentPage('project')}
          >
            <ArrowLeft size={32} />
          </button>
          
          {/* Full-Screen Video Player */}
          <video 
            className="video-player-fullscreen"
            controls
            autoPlay
            playsInline
            onError={(e) => {
              console.log('Video failed to load, using placeholder');
            }}
          >
            <source src={selectedMedia.src || `/videos/${selectedMedia.projectTitle.toLowerCase().replace(/\s+/g, '-')}-${selectedMedia.title.toLowerCase().replace(/\s+/g, '-')}.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Video Title Overlay */}
          <div className="video-title-overlay">
            {selectedMedia.title} - {selectedMedia.projectTitle}
          </div>
        </div>
      </div>
    );
  }

  // PDF Viewer
  if (currentPage === 'pdf' && selectedMedia) {
    return (
      <div className="app">
        <div className="pdf-viewer">
          {/* Back Button */}
          <button 
            className="back-button"
            onClick={() => setCurrentPage('project')}
          >
            <ArrowLeft size={32} />
          </button>
          
          {/* PDF Container with 16:9 Aspect Ratio */}
          <div className="pdf-container-16x9">
            <div className="pdf-aspect-wrapper">
              <iframe 
                className="pdf-frame-16x9"
                src={selectedMedia.src || `/pdfs/${selectedMedia.projectTitle.toLowerCase().replace(/\s+/g, '-')}-${selectedMedia.title.toLowerCase().replace(/\s+/g, '-')}.pdf`}
                title={`${selectedMedia.title} - ${selectedMedia.projectTitle}`}
                onError={(e) => {
                  console.log('PDF failed to load');
                }}
              >
                <p>Your browser does not support PDF viewing. 
                  <a href={selectedMedia.src || `/pdfs/${selectedMedia.projectTitle.toLowerCase().replace(/\s+/g, '-')}-${selectedMedia.title.toLowerCase().replace(/\s+/g, '-')}.pdf`} 
                     target="_blank" 
                     rel="noopener noreferrer">
                    Click here to download the PDF
                  </a>
                </p>
              </iframe>
            </div>
          </div>
          
          {/* PDF Title */}
          <div className="pdf-title-overlay">
            {selectedMedia.title} - {selectedMedia.projectTitle}
          </div>
        </div>
      </div>
    );
  }

  // Case Study Viewer
  if (currentPage === 'case-study' && selectedMedia && selectedMedia.caseStudyData) {
    const caseData = selectedMedia.caseStudyData;
    
    return (
      <div className="app">
        <div className="case-study-viewer">
          {/* Back Button */}
          <button 
            className="back-button"
            onClick={() => setCurrentPage('project')}
          >
            <ArrowLeft size={32} />
          </button>
          
          {/* Case Study Content */}
          <div className="case-study-content">
            {/* Header */}
            <div className="case-study-header">
              <h1 className="case-study-title">{caseData.title}</h1>
              <p className="case-study-subtitle">{selectedMedia.projectTitle}</p>
            </div>
            
            {/* Main Content Sections */}
            <div className="case-study-sections">
              <div className="case-study-section">
                <h2 className="section-title">Challenge</h2>
                <p className="section-content">{caseData.challenge}</p>
              </div>
              
              <div className="case-study-section">
                <h2 className="section-title">Solution</h2>
                <p className="section-content">{caseData.solution}</p>
              </div>
              
              <div className="case-study-section">
                <h2 className="section-title">Results</h2>
                <p className="section-content">{caseData.results}</p>
              </div>
            </div>
            
            {/* Statistics Section */}
            <div className="case-study-stats">
              <h2 className="stats-title">Key Metrics</h2>
              <div className="stats-grid">
                {caseData.statistics.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Before/After Section */}
            {caseData.beforeAfter && (
              <div className="case-study-before-after">
                <h2 className="section-title">Transformation</h2>
                <div className="before-after-grid">
                  <div className="before-after-item">
                    <div className="before-after-image-container">
                      <img 
                        src={caseData.beforeAfter.before.image}
                        alt={caseData.beforeAfter.before.title}
                        className="before-after-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/600x400/666/fff?text=Before';
                        }}
                      />
                    </div>
                    <h3 className="before-after-title">{caseData.beforeAfter.before.title}</h3>
                    <p className="before-after-desc">{caseData.beforeAfter.before.description}</p>
                  </div>
                  
                  <div className="before-after-item">
                    <div className="before-after-image-container">
                      <img 
                        src={caseData.beforeAfter.after.image}
                        alt={caseData.beforeAfter.after.title}
                        className="before-after-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/600x400/010cff/fff?text=After';
                        }}
                      />
                    </div>
                    <h3 className="before-after-title">{caseData.beforeAfter.after.title}</h3>
                    <p className="before-after-desc">{caseData.beforeAfter.after.description}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Client Quote */}
            {caseData.clientQuote && (
              <div className="case-study-quote">
                <blockquote className="quote-text-large">
                  "{caseData.clientQuote.text}"
                </blockquote>
                <div className="quote-attribution">
                  <div className="quote-author-name">{caseData.clientQuote.author}</div>
                  <div className="quote-author-title">{caseData.clientQuote.title}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Project Detail Page Template
  if (currentPage === 'project' && selectedProject) {
    return (
      <div className="app">
        <div className="project-page" style={getTileStyle(selectedProject)}>
          {/* Background Video if available */}
          {selectedProject.backgroundVideo && (
            <video 
              className="project-video-background"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={selectedProject.backgroundVideo} type="video/mp4" />
            </video>
          )}
          
          {/* Back Button */}
          <button 
            className="back-button"
            onClick={() => setCurrentPage('dashboard')}
          >
            <ArrowLeft size={32} />
          </button>
          
          {/* Project Content */}
          <div className="project-content">
            <div className="project-text">
              <h1 className="project-title">{selectedProject.title}</h1>
              <div className="project-tags">
                {selectedProject.tags.map((tag, index) => (
                  <span key={index} className="project-tag">{tag}</span>
                ))}
              </div>
              <p className="project-description">
                {selectedProject.description}
              </p>
            </div>
          </div>
          
          {/* Horizontal Scrolling Media Previews */}
          <div className="media-previews-container">
            <div className="media-previews-scroll">
              {selectedProject.media.map((mediaItem, index) => (
                <div 
                  key={index} 
                  className="media-preview-item"
                  onClick={() => handleMediaClick(mediaItem, selectedProject.title)}
                >
                  <div className="media-preview-thumbnail">
                    {/* Preview Image/Video Placeholder */}
                    <div className="media-preview-content">
                      <div className="media-preview-icon">
                        {mediaItem.type === 'video' && '▶'}
                        {mediaItem.type === 'image' && <span className="icon-gallery">⊞</span>}
                        {mediaItem.type === 'pdf' && 'PDF'}
                        {mediaItem.type === 'case-study' && <span className="icon-case-study">≡</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Second Page Template (for pagination)
  if (currentPage === 'page2') {
    return (
      <div className="app">
        <div className="grid-container">
          {/* Page 2 tiles - all empty for now */}
          
          {/* Empty tiles for future projects */}
          <div className="tile tile-empty">
            <div className="empty-state">Coming Soon</div>
          </div>
          
          <div className="tile tile-empty">
            <div className="empty-state">Coming Soon</div>
          </div>
          
          <div className="tile tile-empty">
            <div className="empty-state">Coming Soon</div>
          </div>
          
          <div className="tile tile-empty">
            <div className="empty-state">Coming Soon</div>
          </div>
          
          <div className="tile tile-empty">
            <div className="empty-state">Coming Soon</div>
          </div>
          
          <div className="tile tile-empty">
            <div className="empty-state">Coming Soon</div>
          </div>
          
          <div className="tile tile-empty">
            <div className="empty-state">Coming Soon</div>
          </div>
          
          <div className="tile tile-empty">
            <div className="empty-state">Coming Soon</div>
          </div>
          
          <div className="tile tile-empty">
            <div className="empty-state">Coming Soon</div>
          </div>
          
          <div className="tile tile-empty">
            <div className="empty-state">Coming Soon</div>
          </div>
          
          <div className="tile tile-empty">
            <div className="empty-state">Coming Soon</div>
          </div>
          
          <div className="tile tile-empty">
            <div className="empty-state">Coming Soon</div>
          </div>
        </div>
        
        {/* Sidebar with back arrow */}
        <div className="sidebar">
          <ArrowLeft 
            className="sidebar-arrow" 
            size={32}
            onClick={() => setCurrentPage('dashboard')}
          />
        </div>
      </div>
    );
  }

  // Main Dashboard (your current working layout)
  return (
    <div className="app">
      <div className="grid-container">
        {/* Row 1 - 4 tiles */}
        <div 
          className="tile tile-1"
          onClick={() => handleProjectClick(projects[0])}
          style={getTileStyle(projects[0])}
        >
          {renderTileBackground(projects[0])}
          <div className={`tag ${projects[0].tags[0].toLowerCase().replace(' & ', '-').replace(' ', '-')}`}>{projects[0].tags[0]}</div>
          <div className="title">{projects[0].title}</div>
          <ArrowRight className="arrow" size={32} />
        </div>
        
        <div 
          className="tile tile-2"
          onClick={() => handleProjectClick(projects[1])}
          style={getTileStyle(projects[1])}
        >
          {renderTileBackground(projects[1])}
          <div className={`tag ${projects[1].tags[0].toLowerCase().replace(' & ', '-').replace(' ', '-')}`}>{projects[1].tags[0]}</div>
          <div className="title">{projects[1].title}</div>
          <ArrowRight className="arrow" size={32} />
        </div>
        
        <div 
          className="tile tile-3"
          onClick={() => handleProjectClick(projects[2])}
          style={getTileStyle(projects[2])}
        >
          {renderTileBackground(projects[2])}
          <div className={`tag ${projects[2].tags[0].toLowerCase().replace(' & ', '-').replace(' ', '-')}`}>{projects[2].tags[0]}</div>
          <div className="title">{projects[2].title}</div>
          <ArrowRight className="arrow" size={32} />
        </div>
        
        <div 
          className="tile tile-4"
          onClick={() => handleProjectClick(projects[3])}
          style={getTileStyle(projects[3])}
        >
          {renderTileBackground(projects[3])}
          <div className={`tag ${projects[3].tags[0].toLowerCase().replace(' & ', '-').replace(' ', '-')}`}>{projects[3].tags[0]}</div>
          <div className="title">{projects[3].title}</div>
          <ArrowRight className="arrow" size={32} />
        </div>
        
        {/* Row 2 - 4 tiles */}
        <div 
          className="tile tile-5"
          onClick={() => handleProjectClick(projects[4])}
          style={getTileStyle(projects[4])}
        >
          {renderTileBackground(projects[4])}
          <div className={`tag ${projects[4].tags[0].toLowerCase().replace(' & ', '-').replace(' ', '-')}`}>{projects[4].tags[0]}</div>
          <div className="title">{projects[4].title}</div>
          <ArrowRight className="arrow" size={32} />
        </div>
        
        <div 
          className="tile tile-6"
          onClick={() => handleProjectClick(projects[5])}
          style={getTileStyle(projects[5])}
        >
          {renderTileBackground(projects[5])}
          <div className={`tag ${projects[5].tags[0].toLowerCase().replace(' & ', '-').replace(' ', '-')}`}>{projects[5].tags[0]}</div>
          <div className="title">{projects[5].title}</div>
          <ArrowRight className="arrow" size={32} />
        </div>
        
        <div 
          className="tile tile-7"
          onClick={() => handleProjectClick(projects[6])}
          style={getTileStyle(projects[6])}
        >
          {renderTileBackground(projects[6])}
          <div className={`tag ${projects[6].tags[0].toLowerCase().replace(' & ', '-').replace(' ', '-')}`}>{projects[6].tags[0]}</div>
          <div className="title">{projects[6].title}</div>
          <ArrowRight className="arrow" size={32} />
        </div>
        
        <div 
          className="tile tile-8"
          onClick={() => handleProjectClick(projects[7])}
          style={getTileStyle(projects[7])}
        >
          {renderTileBackground(projects[7])}
          <div className={`tag ${projects[7].tags[0].toLowerCase().replace(' & ', '-').replace(' ', '-')}`}>{projects[7].tags[0]}</div>
          <div className="title">{projects[7].title}</div>
          <ArrowRight className="arrow" size={32} />
        </div>
        
        {/* Row 3 - Quote panel + 2 tiles */}
        <div className="quote-panel">
          <div className="quote-content">
            <p className="quote-text">
              "{quotes[currentQuoteIndex].text}"
            </p>
            <p className="quote-author">{quotes[currentQuoteIndex].author}</p>
          </div>
        </div>
        
        <div 
          className="tile tile-9"
          onClick={() => handleProjectClick(projects[8])}
          style={getTileStyle(projects[8])}
        >
          {renderTileBackground(projects[8])}
          <div className={`tag ${projects[8].tags[0].toLowerCase().replace(' & ', '-').replace(' ', '-')}`}>{projects[8].tags[0]}</div>
          <div className="title">{projects[8].title}</div>
          <ArrowRight className="arrow" size={32} />
        </div>
        
        <div 
          className="tile tile-10"
          onClick={() => handleProjectClick(projects[9])}
          style={getTileStyle(projects[9])}
        >
          {renderTileBackground(projects[9])}
          <div className={`tag ${projects[9].tags[0].toLowerCase().replace(' & ', '-').replace(' ', '-')}`}>{projects[9].tags[0]}</div>
          <div className="title">{projects[9].title}</div>
          <ArrowRight className="arrow" size={32} />
        </div>
        
      </div>
      
      {/* Sidebar */}
      <div className="sidebar">
        <ArrowRight 
          className="sidebar-arrow" 
          size={32}
          onClick={() => setCurrentPage('page2')}
        />
      </div>
    </div>
  );
};

export default App;