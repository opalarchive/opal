import React from "react";

const AuthUserContext = React.createContext<firebase.User | null>(null);
export default AuthUserContext;
