if ('serviceWorker' in navigator) {
    window.addEventListener('load', async() => {
        try {
            const existing = await navigator.serviceWorker.getRegistration('/');
            const hasToken = sessionStorage.getItem('token');

            if (existing) {
                if (!hasToken) {
                    if (existing.active) {
                        existing.active.postMessage({ type: 'CLEAR_ALL' });
                        await existing.update();
                    }
                    await existing.unregister();
                    console.log('Service worker unregistered');
                } else {
                    console.log('Service worker already registered');
                    return;
                };
            }

            if (!existing || !hasToken) {
                const registration = await navigator.serviceWorker.register('./sw.js', {
                    scope: '/'
                });
                console.log('Service worker registered');
                return;
            }
        } catch (error) {
            console.error('Service worker registration failed:', error);
        }

        console.warn('swInstall.js did not execute anything');
    });
}