import {getAzureUrl} from "../lib/services/http/http.helpers";

// Config object to be passed to Msal on creation
export const initialMsalConfig = {
    auth: {
        clientId: "",
        authority: "",
        redirectUri: "/",
        postLogoutRedirectUri: "/"
    }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
    scopes: ["User.Read"]
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
    graphMeEndpoint: getAzureUrl('/me'),
    graphMemberOfEndpoint: getAzureUrl('/me/memberOf')
};
