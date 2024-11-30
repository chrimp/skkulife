// sw.js
const CACHE_NAME = 'skkulife';
const ASSETS = [
    '/', // Cache root
    '/static/css/style.css',
    '/static/css/signin.css',
    '/static/css/group-info.css',
    '/static/css/group-intro.css',
    '/static/css/info.css',
    '/static/css/join_group.css',
    '/static/css/signup.css',
    '/static/css/user-banner.css',
    '/static/scripts/api.js',
    '/static/scripts/imageCropper.js',
    '/static/scripts/signup.js',
    '/static/scripts/userBanner.js',
    '/static/images/default-profile-image.svg',
    '/static/images/default-group-image.svg',
    '/templates/create-group.html',
    '/templates/email-verification.html',
    '/templates/group-info.html',
    '/templates/group-intro.html',
    '/templates/info.html',
    '/templates/join_group.html',
    '/templates/signup.html',
    //'/assets/index-DOY99I29.js',
    //'/assets/index-DzFN2MWC.css',
    //'/index.html'
];

// Message handler - clear cache
self.addEventListener('message', event => {
    if (event.data.type === 'CLEAR_USER_DATA') {
        caches.open(CACHE_NAME).then(cache => {
            cache.delete(new Request('https://nsptbxlxoj.execute-api.ap-northeast-2.amazonaws.com/dev/user/info'));
        });
    }

    if (event.data.type === 'CLEAR_ALL_INFO') {
        caches.open(CACHE_NAME).then(cache => {
            cache.keys().then(requests => {
                const apiRequests = requests.filter(request =>
                    request.url.startsWith('https://nsptbxlxoj.execute-api.ap-northeast-2.amazonaws.com/dev')
                );
                Promise.all(apiRequests.map(request => {
                    cache.delete(request)
                    console.log('Deleted:', request.url);
            }));
            });
        });
    }

    if (event.data.type === 'CLEAR_ALL') {
        caches.keys().then(keys => {
            keys.forEach(key => caches.delete(key));
        });
    }
});

// Install handler - cache core assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate handler - claim clients
self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// Fetch handler - cache first with network fallback
self.addEventListener('fetch', event => {
    const { request } = event;

    if (request.method !== 'GET') {
        return;
    }

    const useNetwork = request.headers.get('X-Use-Network') === 'true'; // Force network request

    if (useNetwork) {
        console.info("Removing cached data:", request.url);
        event.respondWith(
            caches.open(CACHE_NAME)
            .then(cache => cache.delete(request.url))
            .then(fetch(request))
                .then(response => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(request, responseClone));
                    return response;
                })
                .catch(() => {
                    console.error('Network request failed');
                    return new Response('Network error occurred');
                })
        );
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(cached => {
                if (cached) {
                    // Cache hit - return cached response
                    console.debug('Cache hit:', request.url + '. Put X-Use-Network: true in headers to force network request');
                    return cached;
                }
                
                // Cache miss - fetch from network
                console.log('Cache miss, fetching from network:', request.url);
                return fetch(request)
                    .then(response => {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(request, responseClone));
                        return response;
                    })
                    .catch(() => {
                        console.error('Network request failed, no cache available');
                        return new Response('Network error occurred');
                    });
            })
    );
});