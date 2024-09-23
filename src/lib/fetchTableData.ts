import { useEffect, useState } from "react";
import pgPromise from "pg-promise";

const pgp = pgPromise();

const useFetchTableData = (
  dbName: string | null,
  schemaName: string | null,
  tableName: string | null,
) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  let dbUrl: string | null;

  switch (dbName) {
    case "postgres_spkv_main":
      dbUrl = process.env.DATABASE_POSTGIS_MAIN_URL || null;
      break;
    case "postgres_spkv_prod":
      dbUrl = process.env.DATABASE_POSTGIS_PROD_URL || null;
      break;
    case "postgres_oshkosh_main":
      dbUrl = process.env.DATABASE_OSHKOSH_URL || null;
      break;
    default:
      dbUrl = null;
      break;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (!dbUrl) {
          throw new Error(
            `Database URL for ${dbName} not found in environment variables`,
          );
        }
        // Create a database connection
        const db = pgp(dbUrl);

        // Query to fetch data from the specified schema and table
        const query = `SELECT * FROM "${schemaName}"."${tableName}"`;
        const result = await db.any(query);

        setData(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    };

    if (dbName && schemaName && tableName) {
      fetchData();
    }
  }, [dbName, schemaName, tableName]);

  return { data, loading, error };
};

export default useFetchTableData;
