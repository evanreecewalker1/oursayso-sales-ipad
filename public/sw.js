// Portfolio Service Worker - Comprehensive Offline Support
// Version: 2025-08-14-CRITICAL-OFFLINE
const CACHE_NAME = 'portfolio-cache-v1.0.0';
const DATA_CACHE_NAME = 'portfolio-data-cache-v1.0.0';

// Critical assets that must be cached for offline functionality
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  
  // Project data files
  '/data/projects.json',
  '/data/page2-projects.json', 
  '/data/cms-projects.json',
  '/data/testimonials.json',
  '/data/maintenance.json',
  
  // Local images
  '/images/oursayso-logo.svg',
  '/images/project2.png',
  '/images/project3.png',
  '/images/project4.png',
  '/images/project5.png',
  '/images/project6.png',
  '/images/project7.png',
  '/images/project8.png',
  '/images/project9.png',
  '/images/project10.png'
];

// Video files that need offline access
const VIDEO_ASSETS = [
  '/videos/general-1755194084142-video-test.mp4',
  '/projects/project-05-riverisland/media/video-01.mp4'
];

// Cloudinary image patterns for dynamic caching
const CLOUDINARY_PATTERN = /^https:\/\/res\.cloudinary\.com\/dnuni9dgl\/image\/upload\//;
const GITHUB_RAW_PATTERN = /^https:\/\/raw\.githubusercontent\.com\/evanreecewalker1\/oursayso-sales-ipad\/main\//;

console.log('🚀 Service Worker: Loading version 2025-08-14-CRITICAL-OFFLINE');

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('💾 Service Worker: Installing and caching critical assets...');
  
  event.waitUntil(
    Promise.all([
      // Cache critical app assets
      caches.open(CACHE_NAME).then((cache) => {
        console.log('📦 Service Worker: Caching critical assets');
        return cache.addAll(CRITICAL_ASSETS).catch(error => {
          console.error('❌ Service Worker: Failed to cache some critical assets:', error);
          // Continue anyway, cache what we can
        });
      }),
      
      // Cache video assets separately to avoid blocking
      caches.open(CACHE_NAME).then((cache) => {
        console.log('🎬 Service Worker: Caching video assets');
        return Promise.allSettled(
          VIDEO_ASSETS.map(url => 
            cache.add(url).catch(error => {
              console.error(`❌ Service Worker: Failed to cache video ${url}:`, error);
            })
          )
        );
      })
    ])
  );
  
  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activated');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event - implement cache-first strategy for media assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle different types of requests with appropriate strategies
  if (isCloudinaryImage(request.url)) {
    // Cloudinary images - cache first with network fallback
    event.respondWith(handleCloudinaryImage(request));
  } else if (isGitHubRawFile(request.url)) {
    // GitHub raw files - cache first
    event.respondWith(handleGitHubRawFile(request));
  } else if (isDataFile(request.url)) {
    // Project data - network first with cache fallback
    event.respondWith(handleDataFile(request));
  } else if (isStaticAsset(request.url)) {
    // Static assets - cache first
    event.respondWith(handleStaticAsset(request));
  } else {
    // Default strategy - network first with cache fallback
    event.respondWith(handleDefault(request));
  }
});

// Helper functions for different request types
function isCloudinaryImage(url) {
  return CLOUDINARY_PATTERN.test(url);
}

function isGitHubRawFile(url) {
  return GITHUB_RAW_PATTERN.test(url);
}

function isDataFile(url) {
  return url.includes('/data/') && url.endsWith('.json');
}

function isStaticAsset(url) {
  return url.includes('/static/') || 
         url.includes('/images/') || 
         url.includes('/videos/') ||
         url.endsWith('.css') || 
         url.endsWith('.js') ||
         url.endsWith('.png') ||
         url.endsWith('.jpg') ||
         url.endsWith('.svg');
}

// Cloudinary image handler - cache first with aggressive caching
async function handleCloudinaryImage(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📷 Service Worker: Serving Cloudinary image from cache:', request.url);
      return cachedResponse;
    }
    
    // Network fetch with caching
    console.log('🌐 Service Worker: Fetching Cloudinary image:', request.url);
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache the image
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone()).catch(error => {
        console.error('❌ Service Worker: Failed to cache Cloudinary image:', error);
      });
      
      console.log('✅ Service Worker: Cached Cloudinary image:', request.url);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Service Worker: Cloudinary image fetch failed:', request.url, error);
    
    // Try to return a cached placeholder or generic image
    const placeholder = await caches.match('/images/oursayso-logo.svg');
    return placeholder || new Response('Image not available offline', { status: 404 });
  }
}

// GitHub raw file handler - cache first
async function handleGitHubRawFile(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📁 Service Worker: Serving GitHub file from cache:', request.url);
      return cachedResponse;
    }
    
    console.log('🌐 Service Worker: Fetching GitHub file:', request.url);
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone()).catch(error => {
        console.error('❌ Service Worker: Failed to cache GitHub file:', error);
      });
      
      console.log('✅ Service Worker: Cached GitHub file:', request.url);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Service Worker: GitHub file fetch failed:', request.url, error);
    return new Response('File not available offline', { status: 404 });
  }
}

// Data file handler - network first with cache fallback
async function handleDataFile(request) {
  try {
    // Try network first for fresh data
    console.log('🌐 Service Worker: Fetching data file:', request.url);
    const response = await fetch(request);
    
    if (response.ok) {
      // Update cache with fresh data
      const cache = await caches.open(DATA_CACHE_NAME);
      cache.put(request, response.clone());
      console.log('✅ Service Worker: Updated data cache:', request.url);
    }
    
    return response;
  } catch (error) {
    // Network failed, try cache
    console.log('📱 Service Worker: Network failed, trying cache for:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log('📦 Service Worker: Serving data from cache (offline):', request.url);
      return cachedResponse;
    }
    
    console.error('❌ Service Worker: No cached data available for:', request.url);
    return new Response(JSON.stringify({ 
      error: 'Data not available offline',
      projects: [],
      metadata: { offline: true }
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  }
}

// Static asset handler - cache first
async function handleStaticAsset(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('❌ Service Worker: Static asset fetch failed:', request.url, error);
    return new Response('Asset not available offline', { status: 404 });
  }
}

// Default handler - network first with cache fallback
async function handleDefault(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📦 Service Worker: Serving from cache (offline):', request.url);
      return cachedResponse;
    }
    
    // For HTML requests, return the main app
    if (request.headers.get('Accept')?.includes('text/html')) {
      const appCache = await caches.match('/');
      if (appCache) {
        return appCache;
      }
    }
    
    throw error;
  }
}

// Message handler for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    // Cache specific URLs on demand
    const urls = event.data.urls;
    console.log('📦 Service Worker: Caching URLs on demand:', urls);
    
    caches.open(CACHE_NAME).then(cache => {
      urls.forEach(url => {
        cache.add(url).catch(error => {
          console.error(`❌ Service Worker: Failed to cache ${url}:`, error);
        });
      });
    });
  }
});

console.log('🎯 Service Worker: Setup complete - ready for offline functionality');