import { supabase } from './supabaseClient';
export type Report ={
  id: string;
  project_id: string;
  created_at: string;
  user_request: string;
  claim?: string;
  evaluation?: string;
  category?: string;
  cover_image?: string 
  parsed?: 
  {
    project_id: string
    evaluation: string;
    article: string;
    bibliography: any;
    works_cited: any;
    related_questions: any;
    image_urls: any
    catchy_title: any
    adjudication: any
    category: any
    tags: any
    publication_info: any
    };
}

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
  cover_image?: string;

  catgory?: string
  tags?: string
  adjudication?: string 
  catchy_title?: string 
  
  image_urls?: string[];
    
  [key: string]: any; // Allow for additional properties
}

export async function getReport(projectId: string, autoParseMetadata = true)  {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('project_id', projectId);

  if (error) throw error;

  const reviver = (key: string, value: any) => {
    if (key === 'PROJECT_ID') {
      return { project_id: value };
    } else {
      return {key: value}
    }
    //return value;
  };

  const report = {
    ...data[0],
    parsed: JSON.parse(data[0].metadata)
  };
  return report;
}

export async function getAllReports(autoParseMetadata = true) {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
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

export async function getGroupedReports(autoParseMetadata = true) {
  const allReports = await getAllReports(autoParseMetadata);
  //const parsedReports = allReports.map((x) => x.parsed)
  const groupedReports = allReports.reduce((acc, curr) => {
    if (curr?.parsed?.publication_info?.category === undefined) {
      if (acc['Other']) {
        acc['Other'].push(curr);
      } else {
        acc['Other'] = [curr];
      }
    } else {
      if (acc[curr.parsed.publication_info.category]) {
        acc[curr.parsed.publication_info.category].push(curr);
      } else {
        acc[curr.parsed.publication_info.category] = [curr];
      }
    }
    return acc;
  }, {});

  return groupedReports
}
export async function getReports(userId: string, autoParseMetadata = true) {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
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

export async function updateReport(payload: ReportPayload) {

  console.log(JSON.stringify(payload, null, 2))

  if (!payload.PROJECT_ID) {
    throw new Error('Missing required field project_id');
  }

  const { data: existingData, error: existingError } = await supabase
    .from('reports')
    .select('*')
    .eq('project_id', payload.PROJECT_ID);

  if (existingError) throw existingError;


  if (existingData.length === 0) {
    return await insertReport(payload);
  } else {
    const existingRecord = existingData[0];
    const updateData: any = {};
    // Check each column's value against the payload
    if (payload.userRequest !== undefined && existingRecord.user_request === null) {
      updateData.user_request = payload.userRequest;
    }
    if (payload.prompt !== undefined && existingRecord.prompt === null) {
      updateData.prompt = payload.prompt;
    }
    if (payload.claim !== undefined && existingRecord.claim === null) {
      updateData.claim = payload.claim;
    }
    if (payload.evaluation !== undefined && existingRecord.evaluation === null) {
      updateData.evaluation = payload.evaluation;
    }
    if (payload.article !== undefined &&  existingRecord.article === null) {
      updateData.article = payload.article;
    }
    if (payload.related_questions !== undefined && existingRecord.related_questions === null) {
      updateData.related_questions = payload.related_questions;
    }
    if (payload.image_urls !== undefined && existingRecord.cover_image === null) {
      updateData.cover_image = payload.image_urls[0];
    }
    if (payload.catgory !== undefined && existingRecord.category === null) {
      updateData.category = payload.category;
    }
    if (payload.tags !== undefined && existingRecord.tags === null) {
      updateData.tags = payload.tags;
    }
    if (payload.adjudication !== undefined && existingRecord.adjudication === null) {
      updateData.adjudication = payload.adjudication;
    }
    if (payload.catchy_title !== undefined && existingRecord.catchy_title === null) {
      updateData.catchy_title = payload.catchy_title;
    }
    if (payload.image_urls !== undefined && existingRecord.image_urls === null) {
      updateData.image_urls = payload.image_urls;
    }
    //Merge the metadata!
    const existingMetadata = existingRecord.metadata !== null ? JSON.parse(existingRecord.metadata) : {};
    const newMetadata = payload;
    updateData.metadata = JSON.stringify({...existingMetadata, ...newMetadata});

    // Add timestamp for the update
    updateData.updated_at = new Date().toISOString();
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      updateData.user_id = user.id;
    } else {
      console.warn('No authenticated user found when updating report');
    }
    const { data: updateResult, error: updateError } = await supabase
      .from('reports')
      .update(updateData)
      .eq('project_id', payload.PROJECT_ID);
    if (updateError) throw updateError;
    console.log('Report updated successfully:', updateResult);
    return updateResult;
  }
}
//call this at the end of the pipeline... the image URLs should be already present, naturally
export async function insertReport(payload: ReportPayload) {
  

  if (!payload.PROJECT_ID || !payload.userRequest || !payload.claim || !payload.evaluation) {
    throw new Error("Missing required fields in payload");
  }
  // Add timestamp for the update
  payload.updated_at = new Date().toISOString();
  payload.created_at = new Date().toISOString();
  payload.cover_image= payload.image_urls ? payload.image_urls[0] : undefined



  // Get the current user's ID
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user && !payload.user_id) 
        payload.user_id = user.id;
        
  
return await supabase
    .from('reports')
    .insert({
      updated_at: payload.updated_at,
      created_at: payload.created_at, 
      cover_image: payload.cover_image || null,
      user_id: payload.user_id || null,
      project_id: payload.PROJECT_ID || null,
      user_request: payload.userRequest || null,
      prompt: payload.prompt || null,
      claim: payload.claim || null,
      evaluation: payload.evaluation || null,
      article: payload.article || null,
      related_questions: payload.related_questions || null,
      done: payload.done || null,
      metadata: JSON.stringify(payload),
    })

}

// export async function upsertReportToSupabase(payload: ReportPayload) {
//   const { data: existingData, error: existingError } = await supabase
//     .from('reports')
//     .select('*')
//     .eq('project_id', payload.PROJECT_ID);

//   if (existingError) throw existingError;

//   if (existingData.length === 0) {
//     // No existing record found, perform insert
//     const insertData: any = {
//       project_id: payload.PROJECT_ID,
//       metadata: JSON.stringify(payload),
//     };

//     // Add other fields only if they are present in the payload
//     if (payload.userRequest !== undefined) insertData.user_request = payload.userRequest;
//     if (payload.prompt !== undefined) insertData.prompt = payload.prompt;
//     if (payload.claim !== undefined) insertData.claim = payload.claim;
//     if (payload.evaluation !== undefined) insertData.evaluation = payload.evaluation;
//     if (payload.article !== undefined) insertData.article = payload.article;
//     if (payload.related_questions !== undefined) insertData.related_questions = payload.related_questions;
//     if (payload.done !== undefined) insertData.done = payload.done;
//     if (payload.image_urls !== undefined) insertData.cover_image = payload.image_urls[0];
//     const { data: insertResult, error: insertError } = await supabase
//       .from('reports')
//       .insert(insertData);

//     if (insertError) throw insertError;
//     console.log('Report inserted successfully:', insertResult);
//     return insertResult;
//   } else {
//     // Existing record found, perform update
//     const existingRecord = existingData[0];
//     const updateData: any = {};
//     if (payload.image_urls !== undefined && existingRecord.cover_image === null) 
//       updateData.cover_image = payload.image_urls[0];
//     // Check each column's value against the payload
//     if (payload.userRequest !== undefined && existingRecord.user_request === null) {
//       updateData.user_request = payload.userRequest;
//     }
//     if (payload.prompt !== undefined && existingRecord.prompt === null) {
//       updateData.prompt = payload.prompt;
//     }
//     if (payload.claim !== undefined && existingRecord.claim === null) {
//       updateData.claim = payload.claim;
//     }
//     if (payload.evaluation !== undefined && existingRecord.evaluation === null) {
//       updateData.evaluation = payload.evaluation;
//     }
//     if (payload.article !== undefined && existingRecord.article === null) {
//       updateData.article = payload.article;
//     }
//     if (payload.related_questions !== undefined && existingRecord.related_questions === null) {
//       updateData.related_questions = payload.related_questions;
//     }
//     if (payload.done !== undefined && existingRecord.done === null) {
//       updateData.done = payload.done;
//     }

//     // Always update the metadata with the full payload
//     updateData.metadata = JSON.stringify(payload);

//     // Add timestamp for the update
//     updateData.updated_at = new Date().toISOString();
//     // Get the current user's ID
//     const { data: { user } } = await supabase.auth.getUser();
//     if (user) {
//       updateData.user_id = user.id;
//     } else {
//       console.warn('No authenticated user found when upserting report');
//     }

//     const { data: updateResult, error: updateError } = await supabase
//       .from('reports')
//       .update(updateData)
//       .eq('project_id', payload.project_id);

//     if (updateError) throw updateError;
//     console.log('Report updated successfully:', updateResult);
//     return updateResult;
//   }
//   try {
//     // Start with the required field
//     const upsertData: any = {
//       project_id: payload.PROJECT_ID,
//     };
//     //const existing = await supabase.from('reports').select("*").contains("project_id", payload.project_id)
//     //console.log(JSON.stringify(existing))


//     // Add other fields only if they are present in the payload
//     if (payload.userRequest !== undefined) upsertData.user_request = payload.userRequest;
//     if (payload.prompt !== undefined) upsertData.prompt = payload.prompt;
//     if (payload.claim !== undefined) upsertData.claim = payload.claim;
//     if (payload.evaluation !== undefined) upsertData.evaluation = payload.evaluation;
//     if (payload.article !== undefined) upsertData.article = payload.article;
//     if (payload.related_questions !== undefined) upsertData.related_questions = payload.related_questions;
//     if (payload.done !== undefined) upsertData.done = payload.done;

//     // Always update the metadata with the full payload
//     upsertData.metadata = JSON.stringify(payload);

//     // Add timestamp for the update
//     upsertData.updated_at = new Date().toISOString();
//     // Get the current user's ID
//     const { data: { user } } = await supabase.auth.getUser();
//     if (user) {
//       upsertData.user_id = user.id;
//     } else {
//       console.warn('No authenticated user found when upserting report');
//     }

//     const { data, error } = await supabase
//       .from('reports')
//       .upsert(upsertData, {
//         onConflict: 'project_id',
//       });

//     if (error) throw error;
//     console.log('Report upserted successfully:', data);
//     return data;
//   } catch (error) {
//     console.error('Error upserting report:', error);
//     throw error;
//   }
// }