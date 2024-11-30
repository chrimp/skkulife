if ('serviceWorker' in navigator) {
    window.addEventListener('load', async() => {
        try {
            const existing = await navigator.serviceWorker.getRegistration('/');
            const hasToken = sessionStorage.getItem('token');
            const isControlling = navigator.serviceWorker.controller;
            const publicPaths = ['/', '/signin', '/signup'];

            // Handle host change
            if (existing?.active) {
                const swUrl = new URL(existing.active.scriptURL);
                if (swUrl.host !== window.location.host) {
                    await existing.unregister();
                    console.log('Service worker unregistered due to host change');
                    window.location.reload();
                    return;
                }
            }

            if (!existing) {
                const registration = await navigator.serviceWorker.register('./sw.js', {
                    scope: '/'
                });
                await navigator.serviceWorker.ready;
                console.log('New Service worker registered');
                return;
            }

            if (!hasToken) {
                const isPublicPath = publicPaths.includes(window.location.pathname);
                if (isPublicPath) { await existing.update(); return; }

                if (existing.active) {
                    existing.active.postMessage({ type: 'CLEAR_ALL' });
                    await existing.update();
                }
                await existing.unregister();
                console.log('Service worker unregistered due to invalid session');
                return;
            }

            if (!isControlling) {
                const registration = await navigator.serviceWorker.register('./sw.js', {
                    scope: '/'
                });
                await registration.update();
                await navigator.serviceWorker.ready;
                console.log('Service worker re-registered');
                return;
            }

            await existing.update();
            console.debug('Service worker updated');
            return;            
        } catch (error) {
            console.error('Service worker registration failed:', error);
            return;
        }
    });
}