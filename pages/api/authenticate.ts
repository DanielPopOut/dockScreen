const AuthOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'insomnia/2023.5.8',
  },
  body: new URLSearchParams({
    client_id: process.env.client_id as string,
    client_secret: process.env.client_secret as string,
    grant_type: 'client_credentials',
    scope: 'officernd.api.read',
  }),
};

export const GetWithToken = (token: string) => {
  return {
    method: 'GET',
    headers: {
      'User-Agent': 'insomnia/2023.5.8',
      Authorization: 'Bearer ' + token,
    },
  };
};

export async function Authenticate() {
  let fetchedData = await fetch(
    'https://identity.officernd.com/oauth/token',
    AuthOptions,
  );
  return await fetchedData.json();
}
