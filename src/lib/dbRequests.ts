import axios from "axios";
import { getCookie, setCookie, hasCookie } from "cookies-next";
import { LRUCache } from "lru-cache";
import DOMPurify from "isomorphic-dompurify";
import { jwtDecode } from "jwt-decode";

import { TaskDataProps } from "@/components/serverDropdowns";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// cache settings
const tablesCache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 10,
});
const schemasCache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 10,
});

// axios instance with base url
export const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

// types
interface fetchDbSchemasProps {
  target_db: string;
}

interface fetchSchemaTablesProps {
  target_db: string;
  schema_choice: string;
  user_pattern: string;
}

interface startTaskProps {
  db_choice: string;
  schema_choice: string;
}

interface checkTaskStatusProps {
  task_id: string;
  waitTime: number;
  setTaskData: React.Dispatch<React.SetStateAction<TaskDataProps>>;
  accessDownload?: boolean;
}

export const getServerCsrfToken = async () => {
  try {
    // get CSRF token from server
    if (!hasCookie("csrftoken")) {
      const csrfResponse = await axiosInstance.get(
        "/saas/tds/ajax/get-csrf-token/",
      );
    }
    // retrieve token from cookies
    const csrfToken = getCookie("csrftoken");

    setCookie("csrftoken", csrfToken, { path: "/", maxAge: 60 * 60 * 1 });

    // check errors/if token exists
    if (!csrfToken) {
      throw new Error("CSRF token not found in cookies");
    }

    // return token
    return csrfToken;
  } catch (error) {
    console.error("Error getting CSRF token.");

    return null;
  }
};

export const getMiddlewareCsrfToken = async (): Promise<string> => {
  const response = await fetch("/api/csrf-token");
  const data = await response.json();

  return data.csrfToken || "missing";
};

export const makeServerLoginRequest = async () => {
  const email = process.env.NEXT_PUBLIC_USER_EMAIL as string;
  const password = process.env.NEXT_PUBLIC_USER_PASSWORD as string;

  try {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error during login request:", error);
    throw error;
  }
};

const fetchTokens = async () => {
  const response = await fetch("/api/session");

  if (!response.ok) {
    throw new Error("Failed to fetch session tokens");
  }

  return response.json();
};

const validateTokens = (token: string) => {
  // check if the token is expired
  const isTokenValid = token && !isTokenExpired(token);

  return isTokenValid;
};

const isTokenExpired = (token: string) => {
  // decode jwt token
  try {
    const decodedToken = jwtDecode(token);

    if (!decodedToken || !decodedToken.exp) {
      return true;
    }
    const expiryDate = new Date(decodedToken.exp * 1000);

    return expiryDate < new Date();
  } catch (error) {
    console.error("Error decoding token:", error);

    return true;
  }
};

export const getServerTokens = async () => {
  try {
    let tokens = await fetchTokens();

    if (!validateTokens(tokens.authToken)) {
      await makeServerLoginRequest();
      tokens = await fetchTokens();
    }

    return tokens;
  } catch (error: any) {
    console.error("Error getting session tokens:", error);

    return null;
  }
};

export const fetchDbSchemas = async ({ target_db }: fetchDbSchemasProps) => {
  const cacheKey = `${target_db}`;
  const cachedData = schemasCache.get(cacheKey);
  const { authToken } = await getServerTokens();

  if (cachedData) {
    return cachedData;
  }
  try {
    // get the csrf token from server
    const csrfToken = await getMiddlewareCsrfToken();

    if (!csrfToken) {
      throw new Error("Failed to retrieve CSRF token");
    }

    // define request params
    const endpoint = "/saas/tds/ajax/query-schema-list/";
    const payload = {
      target_db: target_db,
    };
    const headers = {
      "X-CSRFToken": csrfToken,
      Authorization: `Bearer ${authToken}`,
    };
    // make request
    const response = await axiosInstance.post(endpoint, payload, { headers });

    // check request status
    if (response.status !== 200) {
      throw new Error("Failed to fetch DB schemas");
    }
    // check request error
    const responseData = response.data;

    if (responseData.error !== "no error") {
      throw new Error(responseData.error);
    }
    // cache the response data
    schemasCache.set(cacheKey, responseData.schema_dropdown_data);

    // return request data
    return responseData.schema_dropdown_data;
  } catch (error: any) {
    console.error("Error sending POST request:", error);

    return [{ value: "no_data", label: "No Data Found" }];
  }
};

export const fetchSchemaTables = async ({
  target_db,
  schema_choice,
  user_pattern,
}: fetchSchemaTablesProps) => {
  const cacheKey = `${target_db}-${schema_choice}-${user_pattern}`;
  const cachedData = tablesCache.get(cacheKey);
  const { authToken } = await getServerTokens();

  if (cachedData) {
    return cachedData;
  }

  try {
    // get the csrf token from server
    const csrfToken = await getMiddlewareCsrfToken();

    if (!csrfToken) {
      throw new Error("Failed to retrieve CSRF token");
    }

    // define request params
    const endpoint = "/saas/tds/ajax/query-poles-tables-from-schema/";
    const payload = {
      target_db: target_db,
      schema_choice: schema_choice,
      user_pattern: user_pattern,
    };
    const headers = {
      "X-CSRFToken": csrfToken,
      Authorization: `Bearer ${authToken}`,
    };
    // make request
    const response = await axiosInstance.post(endpoint, payload, { headers });

    // check request status
    if (response.status !== 200) {
      throw new Error("Failed to fetch DB schemas");
    }
    // check request error
    const responseData = response.data;

    if (responseData.error !== "no error") {
      throw new Error(responseData.error);
    }

    // cache the response data
    tablesCache.set(cacheKey, responseData.table_dropdown_data);

    // return request data
    return responseData.table_dropdown_data;
  } catch (error: any) {
    console.error("Error sending POST request:", error);

    return [{ value: "no_data", label: "No Data Found" }];
  }
};

export const startTask = async ({
  db_choice,
  schema_choice,
}: startTaskProps) => {
  const { authToken } = await getServerTokens();

  try {
    // get the csrf token from server
    const csrfToken = await getMiddlewareCsrfToken();

    if (!csrfToken) {
      throw new Error("Failed to retrieve CSRF token");
    }

    // define request params
    const endpoint = "/saas/tds/ajax/query-compile-hp-by-splits1/";
    const payload = {
      db_choice: db_choice,
      schema_choice: schema_choice,
    };
    const headers = {
      "X-CSRFToken": csrfToken,
      Authorization: `Bearer ${authToken}`,
    };
    // make request
    const response = await axiosInstance.post(endpoint, payload, { headers });

    // check request status
    if (response.status !== 200) {
      throw new Error("Failed to start task");
    }

    const task_id = response.data.task_id;

    return task_id;
  } catch (error: any) {
    console.error("Error starting task:", error);
    // return [{ error: "no data found" }];
  }
};

export const checkTaskStatus = async ({
  task_id,
  waitTime,
  setTaskData,
  accessDownload = false,
}: checkTaskStatusProps) => {
  const { authToken } = await getServerTokens();

  try {
    // get the csrf token from server
    const csrfToken = await getMiddlewareCsrfToken();

    if (!csrfToken) {
      throw new Error("Failed to retrieve CSRF token");
    }

    // define request params
    const endpoint = "/saas/tds/ajax/check-task-status/";
    const payload = {
      task_id: task_id,
    };
    const headers = {
      "X-CSRFToken": csrfToken,
      Authorization: `Bearer ${authToken}`,
    };
    // make request
    const response = await axiosInstance.post(endpoint, payload, { headers });

    const data = response.data;

    console.log("DATA RESPONSE: ", data);

    setTaskData((prevTaskData: TaskDataProps) => ({
      ...prevTaskData,
      taskStatus: data.status,
    }));

    if (data.status === "PENDING" || data.status === "STARTED") {
      setTimeout(
        () =>
          checkTaskStatus({
            task_id,
            waitTime,
            setTaskData,
            accessDownload,
          }),
        waitTime,
      );
    } else {
      // process the result once finished
      setTaskData((prevTaskData: TaskDataProps) => ({
        ...prevTaskData,
        taskStatus: data.status,
      }));
      // sanitize the result due to html formatting from legacy server (django)
      const sanitizedResult = DOMPurify.sanitize(data.result.result);

      setTaskData((prevTaskData: TaskDataProps) => ({
        ...prevTaskData,
        taskResult: sanitizedResult,
      }));

      if (accessDownload) {
        // check for http base url depending dev/prog server
        const zipFile = data.result.zip_url.startsWith("http")
          ? data.result.zip_url
          : `${baseUrl}${data.result.zip_url}`;

        setTaskData((prevTaskData: TaskDataProps) => ({
          ...prevTaskData,
          downloadUrl: zipFile,
        }));
      }
    }
  } catch (error: any) {
    console.error("Error checking task status:", error);
  }
};
