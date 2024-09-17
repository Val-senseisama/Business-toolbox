//import React from "react";

import ReactDOM from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Session from "./Helpers/Session";

const httpLink = new HttpLink({ uri: "http://localhost:4022"});

// Setup the header for the request
const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const headers: Record<string, string> = {
    "x-access-token": Session.getCookie("x-access-token"),
    "x-refresh-token": Session.getCookie("x-refresh-token"),
  };
  

  const refresh = Session.getCookie("x-force-refresh") || "";
  if (refresh) {
    headers["x-force-refresh"] = refresh;
    Session.clearAllCookies();
  }
     operation.setContext({
       headers,
     });
  
  return forward(operation);
});

// After the backend responds, we take the x-refresh-token and x-refresh-token from headers if it exists, and save it in the session.
const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext();
   
    
    const {
      response: { headers },
    } = context;

    if (headers) {
      const refreshToken = headers.get("x-refresh-token");
      const accessToken = headers.get("x-access-token");
      if (accessToken) {
        try {
          const decoded: any = jwtDecode(accessToken);
          const isExpired = decoded.exp <= Math.floor(Date.now() / 1000);
          if (!isExpired && decoded.id) {
            Session.setCookie("x-access-token", accessToken);
            Session.setCookie("x-refresh-token", refreshToken);
          } else {
            Session.clearAllCookies();
          }
        } catch (err) {
          // err
          Session.clearAllCookies();
        }
      }
    }

    return response;
  });
});



const client = new ApolloClient({
  link: ApolloLink.from([middlewareAuthLink, afterwareLink, httpLink]),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <ApolloProvider client={client}>
    <App />
    <ToastContainer />
  </ApolloProvider>,
);
