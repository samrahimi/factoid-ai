import { supabase } from "./supabaseClient";
export type Profile = {
    id: string; // foreign key -> auth.users.id
    updated_at?: string; // timestamp with time zone
    username?: string; // text
    full_name?: string; // text
    avatar_url?: string; // text
    website?: string; // text
};
export type User = {
    instanceId?: string; // UUID
    id: string; // UUID
    aud?: string; // character varying(255)
    role?: string; // character varying(255)
    email?: string; // character varying(255)
    encryptedPassword?: string; // character varying(255)
    emailConfirmedAt?: string; // timestamp with time zone
    invitedAt?: string; // timestamp with time zone
    confirmationToken?: string; // character varying(255)
    confirmationSentAt?: string; // timestamp with time zone
    recoveryToken?: string; // character varying(255)
    recoverySentAt?: string; // timestamp with time zone
    emailChangeTokenNew?: string; // character varying(255)
    emailChange?: string; // character varying(255)
    emailChangeSentAt?: string; // timestamp with time zone
    lastSignInAt?: string; // timestamp with time zone
    rawAppMetaData?: object; // jsonb
    rawUserMetaData?: object; // jsonb
    isSuperAdmin?: boolean; // boolean
    createdAt?: string; // timestamp with time zone
    updatedAt?: string; // timestamp with time zone
    phone?: string; // text
    phoneConfirmedAt?: string; // timestamp with time zone
    phoneChange?: string; // character varying(255)
    phoneChangeToken?: string; // character varying(255)
    phoneChangeSentAt?: string; // timestamp with time zone
    confirmedAt?: string; // timestamp with time zone
    emailChangeTokenCurrent?: string; // character varying(255)
    emailChangeConfirmStatus?: number; // smallint
    bannedUntil?: string; // timestamp with time zone
    reauthenticationToken?: string; // character varying(255)
    reauthenticationSentAt?: string; // timestamp with time zone
    isSsoUser: boolean; // boolean
    deletedAt?: string; // timestamp with time zone
    isAnonymous: boolean; // boolean
    profile?: Profile; // Associated Profile
};



    // Check for the current user when the component mounts
    
const getCurrentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user
    };
async function getUserProfile(uid) {

    // Fetch the profile for the current user
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid) // Assuming the profile id matches the user id
        .single(); // Use .single() if you expect only one profile

    if (profileError) {
        console.error('Error fetching profile:', profileError);
    }
    if (!profile.username) {
        profile.username = "User-"+Math.random().toString(36).substring(7);
        profile.full_name = "Anonymous"
        await updateUserProfile(profile)
        return profile;
    }
    return profile;

    console.log('User Profile:', profile);
}

const updateUserProfile= async (profile: Profile) => {
    const { data, error } = await supabase
        .from('profiles')
        .upsert(profile);

    if (error) {
        console.error('Error updating profile:', error);
        return;
    }

    console.log('Profile updated successfully:', data);
}

const uploadAvatar = async (file: File) => {
    const user = await getCurrentUser()
    const profile= await getUserProfile(user.id)
    if (!profile) {
        console.error('No profile found');
        return;
    }

    // Upload to the storage bucket with the profile id as the file name
    const newFileName = `${profile.id}_${file.name}`;
    const { data, error } = await supabase
        .storage
        .from('avatars')
        .upload(newFileName, file);

    if (data) {
             const { data } = supabase.storage.from('avatars').getPublicUrl(newFileName)

            console.log(data.publicUrl)


        const avatarUrl = `${data.publicUrl}`;
        profile.avatar_url = avatarUrl;
        await updateUserProfile(profile);
        return profile

    } else {
        console.error('Error uploading avatar:', error);
        return null
        
    }
}
export { getCurrentUser, getUserProfile, updateUserProfile, uploadAvatar };