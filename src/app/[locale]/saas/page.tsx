import { title } from "@/components/primitives";
import { useTranslations } from "next-intl";
import { cookies } from 'next/headers';


export default function SaasPage() {
  const t = useTranslations("Index");
  const cookieStore = cookies(); // Initialize the cookie store

  return (
    <div>
      <h1 className={title()}>Saas</h1>
      <h2>{t("title")}</h2>
      {/* Map through all cookies and display them */}
      {cookieStore.getAll().map((cookie) => (
        <div key={cookie.name}>
          <p>Name: {cookie.name}</p>
          <p>Value: {cookie.value}</p>
        </div>
      ))}
    </div>
  );
}
