import { data, MetaFunction } from '@remix-run/cloudflare';
import { useFetcher } from '@remix-run/react';
import { ActionFunction } from '@remix-run/server-runtime';
import { google } from 'googleapis';
import { StatusCodes } from 'http-status-codes';
import { ReactElement, useCallback, useEffect, useRef } from 'react';
import { z } from 'zod';

import { Header } from '~/components/header';
import { Hero } from '~/components/hero';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

export const meta: MetaFunction = () => {
  return [
    {
      title:
        'Aveon - Never Forget What You Learn Again | AI Learning Companion',
    },
    {
      name: 'description',
      content:
        'Transform your PKM notes (Notion, Obsidian, Roam) into smart flashcards, quizzes, and projects. Remember 90% of what you study with AI-powered active learning. Join 847+ professionals on the waitlist.',
    },
    {
      name: 'keywords',
      content:
        'PKM, personal knowledge management, learning, memory, flashcards, AI, spaced repetition, Notion, Obsidian, Roam, knowledge retention',
    },
    {
      property: 'og:title',
      content: 'Aveon - Never Forget What You Learn Again',
    },
    {
      property: 'og:description',
      content:
        'AI transforms your notes into smart flashcards and quizzes. Remember 90% of what you study instead of 10%.',
    },
    { property: 'og:type', content: 'website' },
  ];
};

const ValidActionData = z.object({
  email: z.email('Invalid email format'),
  challenge: z.string().optional(),
  'cf-turnstile-response': z.string().min(1, 'Please complete the captcha'),
});

function validateActionData(
  email: string,
  challenge: string,
  turnstileResponse: string,
): ErrorObject | null {
  const res = ValidActionData.safeParse({
    email,
    challenge,
    'cf-turnstile-response': turnstileResponse,
  });

  if (res.success) return null;

  const error: ErrorObject = {
    code: 400,
    message: 'Invalid data',
    details: {},
  };

  for (const e of res.error.issues) {
    const key = e.path.at(0);
    if (!key) continue;
    error.details[key.toString()] = e.message;
  }

  return error;
}

async function verifyTurnstile(
  token: string,
  secretKey: string,
): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);

    const result = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      },
    );

    const data = (await result.json()) as { success: boolean };
    return data.success;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

async function addToGoogleSheets(
  email: string,
  challenge: string,
  env: Env,
): Promise<JsonResponse<unknown>> {
  const SPREADSHEET_ID = env.GOOGLE_SHEETS_ID;
  const SHEET_NAME = 'Aveon Waitlist';
  const client_email = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const private_key = env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    '\n',
  );

  try {
    // Initialize Google Sheets API with service account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email,
        private_key,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const timestamp = new Date().toISOString();

    const values = [[timestamp, email, challenge || '']];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:C`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return { ok: true };
  } catch (error) {
    console.error('Error adding to Google Sheets:', error);
    return {
      ok: false,
      error: {
        code: 500,
        message: 'Unable to process your request',
        details: {
          response: (error as Error).message,
        },
      },
    };
  }
}

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const challenge = formData.get('challenge') as string;
  const email = formData.get('email') as string;
  const turnstileResponse = formData.get('cf-turnstile-response') as string;

  const validationError = validateActionData(
    email,
    challenge,
    turnstileResponse,
  );

  if (validationError) {
    return data<JsonResponse>(
      { ok: false, error: validationError },
      { status: StatusCodes.BAD_REQUEST },
    );
  }

  const isValidCaptcha = await verifyTurnstile(
    turnstileResponse,
    context.cloudflare.env.TURNSTILE_SECRET_KEY,
  );

  if (!isValidCaptcha) {
    return data<JsonResponse>(
      {
        ok: false,
        error: {
          code: 400,
          message: 'Captcha verification failed',
          details: { captcha: 'Please complete the captcha verification' },
        },
      },
      { status: StatusCodes.BAD_REQUEST },
    );
  }

  const challengeText = challengeOptions[challenge];

  const result = await addToGoogleSheets(
    email,
    challengeText,
    context.cloudflare.env,
  );

  return data<JsonResponse>(result);
};

const challengeOptions: Record<string, string> = {
  forgetting: 'I forget everything after a few days',
  time: "I don't have time to review properly",
  motivation: 'I lose motivation to keep studying',
  application: "I can't apply what I learn",
  passiveNotes: 'My notes just sit there collecting dust',
  pkmOverload: "Too much info in my PKM, can't retain it",
};

const WaitlistForm = () => {
  const fetcher = useFetcher<JsonResponse>();
  const emailRef = useRef<HTMLInputElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const isLoading = fetcher.state !== 'idle';

  console.log(fetcher.data);

  useEffect(() => {
    if (fetcher.data?.error?.details?.email) {
      emailRef?.current?.focus();
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.turnstile &&
      turnstileRef.current
    ) {
      window.turnstile.render(turnstileRef.current, {
        sitekey: '0x4AAAAAABvBJU5T91Dtequn',
        theme: 'light',
        size: 'normal',
      });
    }
  }, []);

  return (
    <fetcher.Form method="post" className="mb-8">
      <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
        <p className="text-sm text-gray-600 mb-4">
          What&#39;s your biggest learning challenge?
        </p>
        <select
          className="w-full p-3 border border-gray-200 rounded-lg mb-4 text-gray-700"
          name="challenge"
        >
          <option value="">Select your main struggle...</option>
          {Object.entries(challengeOptions).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="Enter your email address"
            className="flex-1"
            name="email"
            required
            ref={emailRef}
            onFocus={() => {
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'email_signup_focus', {
                  event_category: 'engagement',
                  event_label: 'email_input_focus',
                  custom_parameter: 'email_signup_focus',
                });
              }
            }}
          />
          <Button
            className="px-8 py-3 bg-[#4B59BC] hover:bg-[#3d4a9f] text-white font-semibold"
            type={'submit'}
            disabled={isLoading}
            onClick={() => {
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'email_signup_attempt', {
                  event_category: 'conversion',
                  event_label: 'early_access_button',
                  custom_parameter: 'email_signup_click',
                });
              }
            }}
          >
            Get Early Access
          </Button>
        </div>
        <div ref={turnstileRef} className="mt-4"></div>
        {fetcher.data?.error?.details?.email && (
          <div className="text-sm text-destructive mt-2">
            {fetcher.data?.error?.details?.email}
          </div>
        )}
        {fetcher.data?.error?.details?.captcha && (
          <div className="text-sm text-destructive mt-2">
            {fetcher.data?.error?.details?.captcha}
          </div>
        )}
        {fetcher.data?.error?.details?.['cf-turnstile-response'] && (
          <div className="text-sm text-destructive mt-2">
            {fetcher.data?.error?.details?.['cf-turnstile-response']}
          </div>
        )}
        {fetcher.data?.ok && (
          <div className="text-sm text-green-600 mt-2">
            Your email address has been registered.
          </div>
        )}
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          <strong>Join 847 professionals</strong> already on the waitlist
        </p>
        <p className="inline-flex flex-col md:flex-row md:space-x-2 text-xs text-gray-500">
          <span>✓ Free forever plan available</span>
          <span>✓ Early bird pricing for first 1,000 users</span>
        </p>
      </div>
    </fetcher.Form>
  );
};

export default function Index(): ReactElement {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <WaitlistForm />
    </div>
  );
}
