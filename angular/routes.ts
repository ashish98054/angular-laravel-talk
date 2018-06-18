export const Routes = [
    {
        "uri": "api\/auth\/auth\/login",
        "name": "auth.email"
    },
    {
        "uri": "api\/auth\/auth\/{provider}",
        "name": "auth.social"
    },
    {
        "uri": "\/",
        "name": "root"
    },
    {
        "uri": "redirect\/{provider}",
        "name": "redirectToProvider"
    },
    {
        "uri": "auth\/{provider}\/{code}",
        "name": "handleProviderCallback"
    }
];