import axios from "axios";
import { BASE_URL } from "./constants";

// Cookie-based session auth: the backend sets an httpOnly cookie on /auth/login,
// so every request must carry credentials.
const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const defaultOption = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

class APIClient<R = unknown, S = unknown, F = unknown> {
  route: string;
  subRoute = "";

  constructor(route: string) {
    this.route = route;
  }

  setSubroute = (subRoute: string) => {
    this.subRoute = subRoute;
    return this;
  };

  endpoint = () => {
    const url = this.route + this.subRoute;
    this.subRoute = "";
    return url;
  };

  get = (routerParam?: string | number, queryParam?: F) => {
    return client
      .get<R>(`${this.endpoint()}${routerParam ? "/" + routerParam : ""}`, {
        params: queryParam,
      })
      .then((res) => res.data);
  };

  post = (body?: S, option = defaultOption) => {
    return client
      .post<R>(this.endpoint(), body, option)
      .then((res) => res.data);
  };

  postUrl = (routerParam: string | number, body?: S, option = defaultOption) => {
    return client
      .post<R>(`${this.endpoint()}/${routerParam}`, body, option)
      .then((res) => res.data);
  };

  put = (routerParam: string | number, body?: S, option = defaultOption) => {
    return client
      .put<R>(`${this.endpoint()}/${routerParam}`, body, option)
      .then((res) => res.data);
  };

  delete = (routerParam?: string | number, body?: S) => {
    const url = routerParam
      ? `${this.endpoint()}/${routerParam}`
      : this.endpoint();
    return client.delete<R>(url, { data: body }).then((res) => res.data);
  };
}

export default APIClient;
