import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabase = createBrowserClient(
    process.env.REACT_APP_NEXT_PUBLIC_SUPABASE_URL!,
    process.env.REACT_APP_NEXT_PUBLIC_SUPABASE_KEY!
  );

  return supabase;
}
