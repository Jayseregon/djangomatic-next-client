import axios from "axios";
import { LRUCache } from "lru-cache";
import DOMPurify from "isomorphic-dompurify";

import { getServerTokens } from "@/actions/django/action";
import { getServerCsrfToken } from "@/actions/generic/action";
import {
  checkTaskStatusProps,
  fetchDbSchemasProps,
  fetchSchemaTablesProps,
  startTaskProps,
  TaskDataProps,
} from "@/interfaces/lib";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

// Helper function to ensure token exists
const ensureToken = async (backendUser: string): Promise<string> => {
  const tokens = await getServerTokens(backendUser);

  if (!tokens?.djAuthToken) {
    throw new Error("Failed to obtain valid authentication token");
  }

  return tokens.djAuthToken;
};

async function getCredentials(backendUser: string) {
  const djAuthToken = await ensureToken(backendUser);
  const csrfToken = await getServerCsrfToken();

  if (!csrfToken) {
    throw new Error("Failed to retrieve CSRF token");
  }

  return { djAuthToken, csrfToken };
}

function buildFormData(taskOptions: startTaskProps): FormData {
  const payload = new FormData();

  // Append base fields
  payload.append("db_choice", taskOptions.db_choice);
  payload.append("schema_choice", taskOptions.schema_choice);
  payload.append("db_class", taskOptions.dbClass);

  /**
   * Mapping of taskOptions keys to payload keys, with conditions and transformations.
   */
  const optionsToPayloadMapping = [
    {
      optionKey: "file",
      payloadKey: "file",
      condition: (options: startTaskProps) => options.file instanceof File,
    },
    {
      optionKey: "tdsUsername",
      payloadKey: "db621_user",
      condition: (options: startTaskProps) =>
        !!options.tdsUsername && !!options.tdsPassword,
    },
    {
      optionKey: "tdsPassword",
      payloadKey: "db621_pwd",
      condition: (options: startTaskProps) =>
        !!options.tdsUsername && !!options.tdsPassword,
    },
    {
      optionKey: "arcgisErase",
      payloadKey: "erase_previous",
      condition: (options: startTaskProps) =>
        !!options.tdsUsername && !!options.tdsPassword,
      transform: (value: boolean) => (value ? "yes" : "no"),
    },
    {
      optionKey: "arcgisSnapshot",
      payloadKey: "snapshot",
      condition: (options: startTaskProps) =>
        !!options.tdsUsername && !!options.tdsPassword,
      transform: (value: boolean) => (value ? "yes" : "no"),
    },
    {
      optionKey: "project_id",
      payloadKey: "project_id",
      condition: (options: startTaskProps) =>
        !!options.project_id && !!options.project_num && !!options.file_path,
    },
    {
      optionKey: "project_num",
      payloadKey: "project_num",
      condition: (options: startTaskProps) =>
        !!options.project_id && !!options.project_num && !!options.file_path,
    },
    {
      optionKey: "file_path",
      payloadKey: "file_path",
      condition: (options: startTaskProps) =>
        !!options.project_id && !!options.project_num && !!options.file_path,
    },
    {
      optionKey: "operationChoice",
      payloadKey: "operation_choice",
      condition: (options: startTaskProps) => !!options.operationChoice,
    },
  ];

  // Append fields based on the mapping
  optionsToPayloadMapping.forEach(
    ({ optionKey, payloadKey, condition, transform }) => {
      if (condition(taskOptions)) {
        const value = taskOptions[optionKey as keyof startTaskProps];

        if (value !== undefined) {
          let finalValue: string | Blob;

          if (transform && typeof value === "boolean") {
            finalValue = transform(value);
          } else if (value instanceof File) {
            finalValue = value;
          } else {
            finalValue = String(value);
          }
          payload.append(payloadKey, finalValue);
        }
      }
    },
  );

  // Handle special case for 'table_choice' which needs to be appended to multiple keys
  if (taskOptions.table_choice) {
    [
      "pole_table_choice",
      "table_choice",
      "dfn_choice",
      "pattern_choice",
    ].forEach((key) => {
      payload.append(key, taskOptions.table_choice as string);
    });
  }

  // Handle specific flags based on the endpoint
  if (
    taskOptions.endpoint === "/saas/tds/ajax/query-import-hld-to-postgres/" ||
    taskOptions.endpoint === "/saas/tds/ajax/query-import-gps-to-postgres/"
  ) {
    if (taskOptions.is_override) {
      payload.append("is_override", "yes");
    }
  }

  if (
    taskOptions.endpoint === "/saas/tds/ajax/super/query-change-ownership-uniq/"
  ) {
    if (taskOptions.is_override) {
      payload.append("assign_uniq", "yes");
    }
  }

  if (taskOptions.endpoint === "/saas/tds/ajax/super/query-postgres-version/") {
    if (taskOptions.is_override) {
      payload.append("run_full_db", "yes");
    }
  }

  // Set 'projectType' for poles calculations based on 'is_override'
  if (taskOptions.endpoint === "/saas/tds/ajax/query-poles-dfn-calc/") {
    payload.append("projectType", taskOptions.is_override ? "HLD" : "LLD");
    payload.append("uuidPole", taskOptions.uuidPole || "");
  }

  return payload;
}

export const fetchDbSchemas = async ({
  target_db,
  backendUser,
}: fetchDbSchemasProps) => {
  const cacheKey = `${target_db}`;
  const cachedData = schemasCache.get(cacheKey);
  const { djAuthToken, csrfToken } = await getCredentials(backendUser);

  if (cachedData) {
    return cachedData;
  }
  try {
    // define request params
    const endpoint = "/saas/tds/ajax/query-schema-list/";
    const payload = {
      target_db: target_db,
    };
    const headers = {
      "X-CSRFToken": csrfToken,
      Authorization: `Bearer ${djAuthToken}`,
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
  backendUser,
  endpoint = "/saas/tds/ajax/query-poles-tables-from-schema/",
}: fetchSchemaTablesProps) => {
  const cacheKey = `${target_db}-${schema_choice}-${user_pattern}`;
  const cachedData = tablesCache.get(cacheKey);
  const { djAuthToken, csrfToken } = await getCredentials(backendUser);

  if (cachedData) {
    return cachedData;
  }

  try {
    // define request params
    const payload = {
      target_db: target_db,
      schema_choice: schema_choice,
      user_pattern: user_pattern,
    };
    const headers = {
      "X-CSRFToken": csrfToken,
      Authorization: `Bearer ${djAuthToken}`,
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

export const startTask = async (taskOptions: startTaskProps) => {
  const { djAuthToken, csrfToken } = await getCredentials(
    taskOptions.backendUser!,
  );

  try {
    const payload = buildFormData(taskOptions);

    const headers = {
      "X-CSRFToken": csrfToken,
      Authorization: `Bearer ${djAuthToken}`,
      // "Content-Type": "multipart/form-data", // Axios sets this automatically when using FormData
    };
    // make request
    const response = await axiosInstance.post(taskOptions.endpoint, payload, {
      headers,
    });

    // check request status
    if (response.status !== 200) {
      throw new Error("Failed to start task");
    }

    const task_id = response.data.task_id;

    return task_id;
  } catch (error: any) {
    console.error("Error starting task:", error);

    // Handle specific Axios errors
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      // Request was made but no response was received
      console.error("Request data:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Error message:", error.message);
    }
    throw error; // re-throw the error
  }
};

export const checkTaskStatus = async ({
  task_id,
  waitTime,
  setTaskData,
  taskOptions,
  accessDownload = false,
  backendUser,
}: checkTaskStatusProps) => {
  if (!backendUser) {
    throw new Error("backendUser is required");
  }
  const { djAuthToken, csrfToken } = await getCredentials(backendUser);

  try {
    // define request params
    const endpoint = "/saas/tds/ajax/check-task-status/";
    const payload = {
      task_id: task_id,
    };
    const headers = {
      "X-CSRFToken": csrfToken,
      Authorization: `Bearer ${djAuthToken}`,
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
            backendUser,
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

      // auto start snapshot after db621 imports, if flag is true
      if (data.status === "SUCCESS" && taskOptions?.arcgisSnapshot) {
        try {
          // update endpoint for snapshot
          const updatedTaskOptions: startTaskProps = {
            ...taskOptions,
            endpoint: "/saas/tds/ajax/arcgis/auto-snapshots-db621/", // pass snapshot endpoint
            arcgisSnapshot: false, // reset the flag
          };

          // start the task
          const task_id = await startTask(updatedTaskOptions);

          // check the task status
          checkTaskStatus({
            task_id: task_id,
            waitTime: 1000,
            setTaskData: setTaskData,
            taskOptions: updatedTaskOptions,
            accessDownload: false,
            backendUser,
          });
        } catch (error) {
          console.error("Error during snapshot task restart:", error);
        }
      }

      setTaskData((prevTaskData: TaskDataProps) => ({
        ...prevTaskData,
        isLoading: false,
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

    // Handle specific Axios errors
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      // Request was made but no response was received
      console.error("Request data:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Error message:", error.message);
    }
    throw error; // re-throw the error
  }
};
