
/**
 * Environment variables from .env file
 * NOTE: make sure you use the `process.env.NEXT_PUBLIC_` prefix so NextJS can detect them
 */
export const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
export const NEXT_PUBLIC_WHEREBY_SUBDOMAIN = process.env.NEXT_PUBLIC_WHEREBY_SUBDOMAIN ?? 'deliberation-at-scale.whereby.com';

/**
 * Default theming
 */
export const DEFAULT_ROOM_BASE_COLOR = 'orange';
export const AUTHENTICATE_ROOM_BASE_COLOR = 'blue';
export const DELIBERATION_ROOM_BASE_COLOR = 'green';
export const ANIMATION_DURATION_S = '0.3s';

/**
 * Chat flows
 */
export const DEFAULT_BOT_MESSAGE_SPEED_MS = 1500;

export const LOBBY_ALLOW_ASK_PERMISSION_STATE_KEY = 'allowAskPermission';
export const LOBBY_WAITING_FOR_ROOM_STATE_KEY = 'waitingForRoom';
