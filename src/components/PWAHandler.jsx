import { useEffect } from 'react';

export default function PWAHandler() {
  useEffect(() => {
    // Create and inject PWA manifest
    const createManifest = () => {
      const manifest = {
        "name": "Linkverse - Organize the Web",
        "short_name": "Linkverse",
        "description": "Your personal web library. Save, organize and discover links with smart categorization and powerful search.",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#4f8ff7",
        "orientation": "portrait-primary",
        "scope": "/",
        "lang": "en",
        "categories": ["productivity", "utilities", "lifestyle"],
        "icons": [
          {
            "src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiByeD0iMjQiIGZpbGw9IiM0ZjhmZjciLz4KPHN2ZyB4PSI0OCIgeT0iNDgiIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+CjxwYXRoIGQ9Im0xMCA5IDMgM0wyMiA0Ii8+CjxwYXRoIGQ9Im0yMSAyOC0zLTNtMC0zIDMgM0wyOSA4Ii8+CjxwYXRoIGQ9Im0xMSAxOSAzLTMiLz4KPC9zdmc+Cjwvc3ZnPgo=",
            "sizes": "192x192",
            "type": "image/svg+xml",
            "purpose": "any maskable"
          }
        ]
      };

      const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
      const manifestURL = URL.createObjectURL(manifestBlob);
      
      let manifestLink = document.querySelector('link[rel="manifest"]');
      if (!manifestLink) {
        manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        document.head.appendChild(manifestLink);
      }
      manifestLink.href = manifestURL;
    };

    // Create service worker
    const createServiceWorker = () => {
      const swCode = `
        const CACHE_NAME = 'linkverse-v1.0.0';
        const STATIC_CACHE_URLS = [
          '/',
          '/Dashboard',
          '/AddLink',
          '/Search',
          '/Collections',
          '/Favorites'
        ];

        self.addEventListener('install', (event) => {
          console.log('Service Worker: Installing...');
          event.waitUntil(
            caches.open(CACHE_NAME)
              .then((cache) => {
                console.log('Service Worker: Caching Files');
                return cache.addAll(STATIC_CACHE_URLS);
              })
              .then(() => {
                console.log('Service Worker: Installed');
                return self.skipWaiting();
              })
              .catch((error) => {
                console.error('Service Worker: Installation failed', error);
              })
          );
        });

        self.addEventListener('activate', (event) => {
          console.log('Service Worker: Activating...');
          event.waitUntil(
            caches.keys().then((cacheNames) => {
              return Promise.all(
                cacheNames.map((cacheName) => {
                  if (cacheName !== CACHE_NAME) {
                    console.log('Service Worker: Clearing Old Cache');
                    return caches.delete(cacheName);
                  }
                })
              );
            }).then(() => {
              console.log('Service Worker: Activated');
              return self.clients.claim();
            })
          );
        });

        self.addEventListener('fetch', (event) => {
          if (event.request.method !== 'GET') return;
          
          event.respondWith(
            caches.match(event.request)
              .then((cachedResponse) => {
                return cachedResponse || fetch(event.request)
                  .then((response) => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                      return response;
                    }

                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                      .then((cache) => {
                        cache.put(event.request, responseToCache);
                      });

                    return response;
                  });
              })
              .catch(() => {
                if (event.request.destination === 'document') {
                  return caches.match('/');
                }
              })
          );
        });
      `;

      const swBlob = new Blob([swCode], { type: 'application/javascript' });
      const swURL = URL.createObjectURL(swBlob);
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(swURL)
          .then((registration) => {
            console.log('SW registered: ', registration);
            
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  if (confirm('New version available! Reload to update?')) {
                    window.location.reload();
                  }
                }
              });
            });
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      }
    };

    // Add PWA meta tags
    const addPWAMetaTags = () => {
      // Theme color
      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta');
        themeColorMeta.name = 'theme-color';
        themeColorMeta.content = '#4f8ff7';
        document.head.appendChild(themeColorMeta);
      }

      // Viewport
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
        document.head.appendChild(viewportMeta);
      }

      // Apple touch icon
      let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
      if (!appleTouchIcon) {
        appleTouchIcon = document.createElement('link');
        appleTouchIcon.rel = 'apple-touch-icon';
        appleTouchIcon.href = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiByeD0iMjQiIGZpbGw9IiM0ZjhmZjciLz4KPHN2ZyB4PSI0OCIgeT0iNDgiIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+CjxwYXRoIGQ9Im0xMCA5IDMgM0wyMiA0Ii8+CjxwYXRoIGQ9Im0yMSAyOC0zLTNtMC0zIDMgM0wyOSA4Ii8+CjxwYXRoIGQ9Im0xMSAxOSAzLTMiLz4KPC9zdmc+Cjwvc3ZnPgo=';
        document.head.appendChild(appleTouchIcon);
      }

      // iOS meta tags
      const iosMetas = [
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Linkverse' }
      ];

      iosMetas.forEach(meta => {
        let metaTag = document.querySelector(`meta[name="${meta.name}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.name = meta.name;
          metaTag.content = meta.content;
          document.head.appendChild(metaTag);
        }
      });
    };

    // Initialize PWA
    const initPWA = () => {
      addPWAMetaTags();
      createManifest();
      createServiceWorker();
    };

    // Handle app install prompt
    let deferredPrompt;
    
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPrompt = e;
    };

    // Handle successful app install
    const handleAppInstalled = (evt) => {
      console.log('Linkverse was installed successfully');
    };

    // Handle network status changes
    const handleOnline = () => {
      console.log('App is online');
    };

    const handleOffline = () => {
      console.log('App is offline');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initPWA);
    } else {
      initPWA();
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
}