async function fetchWithToken(input, init={}) {
    const token = sessionStorage.getItem('token');

    const BASEURL = 'https://nsptbxlxoj.execute-api.ap-northeast-2.amazonaws.com/dev';

    let authRequest;
    if (input instanceof Request) {
        if (input.url === 'undefined') { throw new Error('Request url is not defined'); }
        authRequest = new Request(url, {
            ...input,
            headers: new Headers({
                ...Object.fromEntries(input.headers),
                'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaGxla2RsZjEyMzRAZ21haWwuY29tIiwiaWF0IjoxNzMyNjA1OTU5LCJleHAiOjE3NjQxNDE5NTl9.86LBbz7DGZGGlLrJVwNwZmroV6XB_m-BqkPtcbm_z8k'
            })
        });

        //authRequest = input.clone();
        //authRequest.headers.set('Authorization', 'Bearer ' + token);
    } else {
        if (input === 'undefined') { throw new Error('Request url is not defined'); }
        const url = BASEURL + input;
        init.headers = new Headers(init.headers || {});
        init.headers.set('Authorization', 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaGxla2RsZjEyMzRAZ21haWwuY29tIiwiaWF0IjoxNzMyNjA1OTU5LCJleHAiOjE3NjQxNDE5NTl9.86LBbz7DGZGGlLrJVwNwZmroV6XB_m-BqkPtcbm_z8k');
        authRequest = new Request(url, init);
    }

    const response = await fetch(authRequest);
    if (!response.ok) {
        if (response.statusText == "Unauthorized") {
            window.location.href = '/signin';
        }

        console.error("Error while fetching api: " + response.status + " " + response.statusText);
        console.error("Request url: " + authRequest.url);
        throw new Error("Error while fetching api: " + response.status + " " + response.statusText);
    }

    return response;
}