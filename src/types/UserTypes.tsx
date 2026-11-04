

export interface UndergraduateAccountVerificationType {
  curent_college : string;
  current_faculty : string;
  current_department : string;
  current_year : number
}





export interface AspirantAccountVerificationType {
  subject_combination : string[],
  desired_college : string,
  desired_faculty : string,
  desired_department : string,
}
  //writtenJamb ?: boolean
export type UserInfo = {
    data : {
        user : {
        id: string,
        aud: string,
        role: string,
        email: string,
        email_confirmed_at: string,
        phone: string,
        confirmation_sent_at: string,
        confirmed_at: string,
        last_sign_in_at: string,
        app_metadata: {
            provider: "email",
            "providers": [
                "email"
            ]
        },
        user_metadata: {
            account_verification: Record<string, never> |{
  curent_college : string;
  current_faculty : string;
  current_department : string;
  current_year : number
}| {
  subject_combination : string[],
  desired_college : string,
  desired_faculty : string,
  desired_department : string,
},
            age: number,
            created_at: string,
            email: string,
            email_verified: boolean,
            full_name: string,
            phone: string,
            phone_verified: boolean,
            sub: string,
            user_type: string,
            username: string
        },
        "identities": [
            {
                identity_id: string,
                id: string,
                user_id: string,
                identity_data: {
                    account_verification: AspirantAccountVerificationType | UndergraduateAccountVerificationType,
                    age: number,
                    created_at: string,
                    email: string,
                    email_verified: boolean,
                    full_name: string,
                    phone: string,
                    phone_verified: boolean,
                    sub: string,
                    user_type: string,
                    username: string
                },
                provider: "email",
                last_sign_in_at: string,
                created_at: string,
                updated_at: string,
                    phone: string,
                    phone_verified: boolean,
                    sub: string,
                    user_type: string,
                    username: string
                },
                provider: "email",
                last_sign_in_at: string,
                created_at: string,
                updated_at: string,
                email: string
            
        ],
        created_at: string,
        updated_at: string,
        is_anonymous: boolean
    
    "weak_password": null
    }
}
}


export type usermetadata= {
  
            account_verification:   {
  subject_combination : string[],
  desired_college : string,
  desired_faculty : string,
  desired_department : string,
} | {
  curent_college : string;
  current_faculty : string;
  current_department : string;
  current_year : number
},
            age: number,
            created_at: string,
            email: string,
            email_verified: boolean,
            full_name: string,
            phone: string,
            phone_verified: boolean,
            sub: string,
            user_type: string,
            username: string
    
}