function base64UrlEncode(data: any): string {
  let base64;
  if (data instanceof Uint8Array) {
    base64 = btoa(String.fromCharCode(...data));
  } else {
    base64 = btoa(data);
  }
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function getAccessToken(env: Env) {
  // Use service account credentials stored in environment variables
  const credentials = {
    type: 'service_account',
    project_id: env.GOOGLE_PROJECT_ID,
    private_key_id: env.GOOGLE_PRIVATE_KEY_ID,
    private_key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: env.GOOGLE_CLIENT_EMAIL,
    client_id: env.GOOGLE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
  };

  // Create JWT
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: credentials.token_uri,
    exp: now + 3600,
    iat: now,
  };

  // Properly format and parse the private key
  const privateKeyPem = credentials.private_key;

  // Ensure proper PEM format
  if (!privateKeyPem.startsWith('-----BEGIN PRIVATE KEY-----')) {
    throw new Error('Invalid private key format');
  }

  // Extract the base64 content between the PEM headers
  const pemContent = privateKeyPem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');

  // Convert base64 to binary
  const binaryKey = Uint8Array.from(atob(pemContent), (c) => c.charCodeAt(0));

  // Import private key
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  // Create JWT token - fix base64url encoding
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    new TextEncoder().encode(unsignedToken),
  );

  const encodedSignature = base64UrlEncode(new Uint8Array(signature));
  const jwt = `${unsignedToken}.${encodedSignature}`;

  // Exchange JWT for access token
  const tokenResponse = await fetch(credentials.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenResponse.json<{ access_token: string }>();
  if (!tokenResponse.ok) {
    throw new Error(`Token exchange failed: ${JSON.stringify(tokenData)}`);
  }

  return tokenData.access_token;
}

export async function appendToSheet(
  sheetName: string,
  values: Array<string[]>,
  env: Env,
): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  const accessToken = await getAccessToken(env);

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEETS_ID}/values/${encodeURIComponent(sheetName)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Sheets API error: ${error}`);
  }

  const result = await response.json();

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
