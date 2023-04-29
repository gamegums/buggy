const CLIENT_ID = '1087415975466516580';
const REDIRECT_URI = 'https://gamegums.github.io/fireBot';
const SCOPE = 'identify email';
const DISCORD_API_BASE = 'https://discord.com/api';

// Function to generate a random state string for CSRF protection
function generateState() {
  const state = [...Array(32)].map(() => Math.random().toString(36)[2]).join('');
  return state;
}

// Function to redirect the user to Discord's login page
function redirectToDiscord() {
  const state = generateState();
  const url = `${DISCORD_API_BASE}/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPE)}&state=${state}`;
  localStorage.setItem('discord-oauth2-state', state);
  window.location.href = url;
}

// Function to exchange the authorization code for an access token
async function exchangeCodeForToken(code) {
  const data = {
    client_id: CLIENT_ID,
    client_secret: '6bKdqQ64suid-4aPjCwdfCOlzSMCYhKf',
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI,
    scope: SCOPE
  };
  
  const response = await fetch(`${DISCORD_API_BASE}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(data)
  });

  console.log(response)
  console.log(JSON.parse(response))
  console.log(response.json())

  const json = response.json();
  return json;
}

// Function to get user data using the access token
async function getUserData(token) {
  const response = fetch(`${DISCORD_API_BASE}/users/@me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const json = await response.json();
  return json;
}

// Callback function that handles the OAuth2 flow after the user logs in on Discord's website
async function handleDiscordCallback() {
  const code = new URLSearchParams(window.location.search).get('code');
  const state = new URLSearchParams(window.location.search).get('state');
  const storedState = localStorage.getItem('discord-oauth2-state');

  if (state !== storedState) {
    console.error('State mismatch!');
    return;
  }

  localStorage.removeItem('discord-oauth2-state');

  const tokenData = exchangeCodeForToken(code);
  const userData = getUserData(tokenData.access_token);

  console.log(`Logged in as ${userData.username}#${userData.discriminator}`);
  console.log(`Email: ${userData.email}`);
}

// Example usage: add an event listener to a button to trigger the login flow
document.getElementById('logInButt').addEventListener('click', redirectToDiscord);

// Example usage: check if the user is already logged in on page load
if (localStorage.getItem('discord-oauth2-token')) {
  const token = localStorage.getItem('discord-oauth2-token');
  const userData = getUserData(token);

  console.log(`Logged in as ${userData.username}#${userData.discriminator}`);
  console.log(`Email: ${userData.email}`);
} else if (new URLSearchParams(window.location.search).has('code')) {
  handleDiscordCallback();
}
