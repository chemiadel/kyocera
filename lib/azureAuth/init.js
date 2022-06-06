import * as msal from "@azure/msal-browser";

// const attendentList=[
//     {
//         "country_code": "ZA",
//         "country_name": "KDZA",
//         "cid": "88ee92c5-3903-4053-beb4-8c19f0d00034",
//         "auth": "73ae21ec-2edf-4730-8016-6242d0158d7f",
//         "__typename": "AdTenant"
//     },
//     {
//         "country_code": "EU",
//         "country_name": "KDEU",
//         "cid": "b2cb56ca-3cf2-4f31-b57f-cde1a620051a",
//         "auth": "c230d940-a67b-4a7e-aec9-1f2bd2a0415f",
//         "__typename": "AdTenant"
//     },
//     {
//         "country_code": "NL",
//         "country_name": "Freshapps",
//         "cid": "5ac24e04-eb38-4a09-bd20-ea498a04e4e1",
//         "auth": "4532a4f3-5291-48f0-899e-46b6a7a89d65",
//         "__typename": "AdTenant"
//     }
// ]

// const selectedAdTenant=attendentList[1]
// console.log('asd',selectedAdTenant.cid)

export default function msalInstance(tenant){
    console.log('-----------tenant.cid',tenant.cid)
    const msalConfig = {
        auth: {
            clientId: tenant.cid,
            authority: `https://login.microsoftonline.com/${tenant.auth}`,
            redirectUri: "/",
            postLogoutRedirectUri: "/"
        }
    };
    
    return new msal.PublicClientApplication(msalConfig);
}
