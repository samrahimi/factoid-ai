import { supabase } from './supabaseClient';

export interface ReportPayload {
  project_id: string;
  userRequest?: string;
  prompt?: string;
  claim?: string;
  evaluation?: string;
  article?: string;
  related_questions?: string;
  done?: boolean;
  parsed? : object
  [key: string]: any; // Allow for additional properties
}
export async function getReports(userId, autoParseMetadata = true) {
  const { data, error } = await supabase
    .from('reports')
    .select('id, created_at, user_request, claim, evaluation, category, article, metadata')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (autoParseMetadata) {
    const enhancedData = data.map((x) => {
      try {
        return {
          ...x,
          parsed: JSON.parse(x.metadata)
        }
      } catch (ex) {
        return {...x, parsed: null}
      }
    })
    return enhancedData

  } else 
    return {...data, parsed: null};
}

export async function upsertReportToSupabase(payload: ReportPayload) {
  try {
    // Start with the required field
    const upsertData: any = {
      project_id: payload.PROJECT_ID,
    };
    //const existing = await supabase.from('reports').select("*").contains("project_id", payload.project_id)
    //console.log(JSON.stringify(existing))


    // Add other fields only if they are present in the payload
    if (payload.userRequest !== undefined) upsertData.user_request = payload.userRequest;
    if (payload.prompt !== undefined) upsertData.prompt = payload.prompt;
    if (payload.claim !== undefined) upsertData.claim = payload.claim;
    if (payload.evaluation !== undefined) upsertData.evaluation = payload.evaluation;
    if (payload.article !== undefined) upsertData.article = payload.article;
    if (payload.related_questions !== undefined) upsertData.related_questions = payload.related_questions;
    if (payload.done !== undefined) upsertData.done = payload.done;

    // Always update the metadata with the full payload
    upsertData.metadata = JSON.stringify(payload);

    // Add timestamp for the update
    upsertData.updated_at = new Date().toISOString();
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      upsertData.user_id = user.id;
    } else {
      console.warn('No authenticated user found when upserting report');
    }

    const { data, error } = await supabase
      .from('reports')
      .upsert(upsertData, {
        onConflict: 'project_id',
      });

    if (error) throw error;
    console.log('Report upserted successfully:', data);
    return data;
  } catch (error) {
    console.error('Error upserting report:', error);
    throw error;
  }
}