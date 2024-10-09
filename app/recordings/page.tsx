import { createClient } from "@/utils/supabase/component";

export default async function Recordings() {
  const supabase = createClient();
  const { data: recordings } = await supabase.from("Recording").select();

  return <pre>{JSON.stringify(recordings, null, 2)}</pre>;
  // TODO: Render the list of recordings as buttons
}
