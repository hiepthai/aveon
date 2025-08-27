import { data, MetaFunction } from '@remix-run/cloudflare';
import { useFetcher } from '@remix-run/react';
import { ActionFunction } from '@remix-run/server-runtime';
import { google } from 'googleapis';
import { StatusCodes } from 'http-status-codes';
import { ReactElement } from 'react';
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
});

function validateActionData(
  email: string,
  challenge: string,
): ErrorObject | null {
  const res = ValidActionData.safeParse({
    email,
    challenge,
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

  const validationError = validateActionData(email, challenge);

  if (validationError) {
    return data<JsonResponse>(
      { ok: false, error: validationError },
      { status: StatusCodes.BAD_REQUEST },
    );
  }

  const result = await addToGoogleSheets(
    email,
    challenge,
    context.cloudflare.env,
  );

  return data<JsonResponse>(result);
};

const WaitlistForm = () => {
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== 'idle';

  console.log(fetcher.data);

  return (
    <fetcher.Form method="post">
      <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
        <p className="text-sm text-gray-600 mb-4">
          What's your biggest learning challenge?
        </p>
        <select
          className="w-full p-3 border border-gray-200 rounded-lg mb-4 text-gray-700"
          name="challenge"
        >
          <option value="">Select your main struggle...</option>
          <option value="forgetting">
            I forget everything after a few days
          </option>
          <option value="time">I don't have time to review properly</option>
          <option value="motivation">I lose motivation to keep studying</option>
          <option value="application">I can't apply what I learn</option>
          <option value="passive-notes">
            My notes just sit there collecting dust
          </option>
          <option value="pkm-overload">
            Too much info in my PKM, can't retain it
          </option>
        </select>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="Enter your email address"
            className="flex-1"
            name="email"
            required
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
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          <strong>Join 847 professionals</strong> already on the waitlist
        </p>
        <p className="text-xs text-gray-500">
          ✓ Free forever plan available • ✓ Early bird pricing for first 1,000
          users
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
