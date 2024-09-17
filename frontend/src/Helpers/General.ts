import Session from "./Session";
import { jwtDecode } from "jwt-decode";

export const getConfig = () => {
    const config = Session.getCookie('config');
    try {
        return JSON.parse(config);
    } catch (e) {
        return {};
    }
}
export const getUser = () => {
    const user = Session.getCookie('user');
    try {
        return JSON.parse(user);
    } catch (e) {
        return {};
    }
}

export const getImage = (filename: string) => {
    const config: Record<string, any> = getConfig();
    return config.cdn + filename;
};

export const openInBrowser = (url: string) => {

    try {
        if (typeof window !== 'undefined' && typeof (window as any).lekeOjikutu !== 'undefined') {
            (window as any).lekeOjikutu.openInBrowser(url);
        } else if (typeof window !== 'undefined' && typeof (window as any).Website2APK !== 'undefined') {
            // eslint-disable-next-line no-undef
            (window as any).Website2APK.openExternal(url);
        } else {
            window.open(url, '_blank');
        }
    } catch (e) {
        window.open(url, '_blank');
    }
};

export const Redirect = (path: string) => {
    (window as any).location.href = path;
};

export const APIResponse = (error: Record<string, any>) => {
    if (error.message?.startsWith('Failed to fetch')) {
        Session.saveAlert('Check your internet connection.', 'error');
    } else if (!error.graphQLErrors || error.graphQLErrors[0]?.extensions?.code !== 'INTERNAL_SERVER_ERROR') {
        if (error.message === '#RELOGIN') {
            Session.clearAllCookies();
            Redirect('/logout');
        } else if (error.message == '#NOACCESS') {
            Redirect('/dashboard')
        } else {
            Session.saveAlert(error.message);
        }
    }
};


export const authorize = (role: string, company_id: number, redirect = false): boolean => {

    const cookie = Session.getCookie('x-access-token');
    const accessToken = JSON.parse(cookie);
    const myRoles: Record<string, any> = jwtDecode(accessToken);
    const companyRoles = myRoles.staff[company_id]

    if (companyRoles === 'OWNER') return true;
    if (redirect && !companyRoles?.includes(role)) {
        Session.saveAlert('You do not have sufficient priviledge to access the requested page.', 'error');
        Redirect('/dashboard');
        return false;
    }
    return companyRoles?.includes(role);
};
