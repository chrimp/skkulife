async function fetchWithToken(input, init={}) {
    const token = sessionStorage.getItem('token');

    let authRequest;
    if (input instanceof Request) {
        authRequest = input.clone();
        authRequest.headers.set('Authorization', 'Bearer ' + token);
    } else {
        init.headers = new Headers(init.headers || {});
        init.headers.set('Authorization', 'Bearer ' + token);
        authRequest = new Request(input, init);
    }

    const response = await fetch(authRequest);
    if (!response.ok) {
        throw new Error("Error while fetching api: " + response.status + " " + response.statusText);
    }

    return response;
}