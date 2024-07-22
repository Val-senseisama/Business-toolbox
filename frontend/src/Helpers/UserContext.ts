import React from 'react';

const UserContext = React.createContext<Record<string, any>>({
    user: {},
    setUser: () => { },
    config: {},
    setConfig: () => { }
});

export default UserContext;