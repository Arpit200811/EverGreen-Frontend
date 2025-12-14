import API from "./axios";

export const getEngineers = () =>
  API.get("/users/all?role=EMPLOYEE");
