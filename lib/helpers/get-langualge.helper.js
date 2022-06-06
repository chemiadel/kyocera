import {language} from "../enums/language.enum";

export const getLanguage = (email) => {
    const arr = email.split(".");
    return language[arr[(arr.length - 1)]]
}
