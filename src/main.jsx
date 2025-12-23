import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init({
  duration: 1000,     
  once: true,           
  easing: "ease-out-cubic",
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
        <App />
  </React.StrictMode>
);


// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import { AuthProvider } from "./context/AuthContext";
// import "./index.css";
// import AOS from "aos";
// import "aos/dist/aos.css";
// AOS.init({
//   duration: 1000,     
//   once: true,           
//   easing: "ease-out-cubic",
// });
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <AuthProvider>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </AuthProvider>
//   </React.StrictMode>
// );
