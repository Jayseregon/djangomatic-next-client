import { ListItem } from "../components/reports/checklist/DynamicForm";

export const fetchListForm = async (
  id: string,
  setListForm: React.Dispatch<React.SetStateAction<ListItem[]>>,
): Promise<ListItem[]> => {
  try {
    const response = await fetch(`/api/reports?id=${id}`);

    if (!response.ok) {
      throw new Error(
        `Error fetching listForm${id}.json: ${response.statusText}`,
      );
    }
    const data = await response.json();

    setListForm(data);

    return data;
  } catch (error) {
    console.error(`Error fetching listForm${id}:`, error);

    return [];
  }
};

export const fetchGenericJson = async (
  fileName: string,
  setData: React.Dispatch<React.SetStateAction<any>>,
): Promise<any> => {
  try {
    const response = await fetch(`/api/get-json?file=${fileName}`);

    if (!response.ok) {
      throw new Error(`Error fetching ${fileName}: ${response.statusText}`);
    }
    const data = await response.json();

    setData(data);

    return data;
  } catch (error) {
    console.error(`Error fetching ${fileName}:`, error);

    return [];
  }
};

export const serverFetchJsonData = async (fileName: string): Promise<any> => {
  const isDev = process.env.NODE_ENV !== "production";
  const baseUrl = isDev
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error("Base URL is not defined");
  }

  const url = `${baseUrl}/api/get-json?file=${fileName}`;

  console.log(`Fetching JSON data from: ${url}`);

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      `Error fetching ${fileName}: ${response.statusText}`,
      errorText,
    );
    throw new Error(`Error fetching ${fileName}: ${response.statusText}`);
  }

  try {
    return await response.json();
  } catch (error) {
    const errorText = await response.text();

    console.error(`Error parsing JSON from ${fileName}:`, errorText);
    throw new Error(`Error parsing JSON from ${fileName}`);
  }
};
