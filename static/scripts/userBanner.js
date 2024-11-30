document.getElementsByClassName('logout')[0].addEventListener('click', function() {
    sessionStorage.removeItem('token');
    try {
        navigator.serviceWorker.controller.postMessage({
            type: 'CLEAR_USER_DATA'
        });
    } catch (error) {
        if (error.name === 'TypeError') {
            console.error("Service worker not found: ", error); // Allow web to continue; SW error is not critical
        } else {
            console.error("Error logging out: ", error);
        } 
    }
    window.location.href = '/';
});

async function updateUserBanner() {
    try {
        const response = await fetchWithToken('/user/info');
        const data = await response.json();
        if (data) {
            document.getElementById('small-user-icon').src = data.userImage;
            document.getElementById('card-user-icon').src = data.userImage;
            document.querySelector('.user-info div').innerText = data.userName;
        } else return;
    } catch (error) {
        console.error("Error updating user banner: ", error);
    }
}
updateUserBanner();
function toggleUserCard() {
    const userCard = document.querySelector('.user-card');
    
    if (userCard.style.display === 'none' || userCard.style.display === '') {
        userCard.style.display = 'flex';
    } else {
        userCard.style.display = 'none';
    }
}

document.addEventListener('click', function(event) {
    const userCard = document.querySelector('.user-card');
    const smallUserIcon = document.getElementById('small-user-icon');

    if (!userCard.contains(event.target) && !smallUserIcon.contains(event.target)) {
        userCard.style.display = 'none';
    }
});