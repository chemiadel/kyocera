import {graphConfig, loginRequest} from '../services/msal';
import {AzureUserTypeGroup, AzureUserTypeGroupControl} from "../lib/enums/azure-user-type-group.enum";
import {getLanguage} from "../lib/helpers/get-langualge.helper";
// import {msalInstance} from '../lib/azureAuth/init'
import {useMsal} from "@azure/msal-react";

export async function getUserAccessToken(instance) {

    const account = instance.getActiveAccount();
    const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: account
    });

    return response.accessToken;
}

export async function callMsGraph(instance) {

    const account = instance.getActiveAccount();
    if (!account) {
        throw Error("No active account! Verify a user has been signed in and setActiveAccount has been called.");
    }

    const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: account
    });

    const headers = new Headers();
    const bearer = `Bearer ${response.accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers
    };

    const [me, group] = await Promise.all([getMe(options), getMemberOf(options)]);
    const canLogin = hasRoleType(group);

    console.log('MS User Group', group);

    var kyoceraRoleArray = group.value.filter(function (gr) {
        if(!!!gr || !!!gr.displayName){
            return false;
        }
        return gr.displayName.includes('Role_Salestoolkit')
    });

    console.log('=====================');
    console.log('MS User Group', group);
    console.log('Kyocera Groups', kyoceraRoleArray);

    const {id, name, title} = getLanguage(me.userPrincipalName)

    const user = {
        id: me.id,
        fullname: me.displayName,
        role: kyoceraRoleArray.map(group => AzureUserTypeGroup[group.displayName])[0],
        language: {
            id,
            name,
            title,
            statement: me.userPrincipalName,
            __typename: 'Lang'
        },
        __typename: kyoceraRoleArray.map(group => AzureUserTypeGroup[group.displayName])[0],
        fromAzure: true,
        canLogin
    }

    return user;

}

const getMe = async (options) => {
    return getData(graphConfig.graphMeEndpoint, options)
}

const getMemberOf = async (options) => {
    return getData(graphConfig.graphMemberOfEndpoint, options)
}

const getData = async (endpoint, options) => {
    return fetch(endpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

const hasRoleType = (group) => {
    const hasGroup = AzureUserTypeGroupControl
        .some( controlGroup => group.value
            .some( val => val.displayName === controlGroup ) );

    return hasGroup
}


