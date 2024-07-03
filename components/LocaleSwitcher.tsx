// // import {useLocale, useTranslations} from 'next-intl';
// // import LocaleSwitcherSelect from './LocaleSwitcherSelect';
// // import {locales} from '@/config';

// // export default function LocaleSwitcher() {
// //   const t = useTranslations('LocaleSwitcher');
// //   const locale = useLocale();

// //   return (
// //     <LocaleSwitcherSelect defaultValue={locale} label={t('label')}>
// //       {locales.map((cur) => (
// //         <option key={cur} value={cur}>
// //           {t('locale', {locale: cur})}
// //         </option>
// //       ))}
// //     </LocaleSwitcherSelect>
// //   );
// // }

// 'use client';

// import { useRouter } from 'next/router';
// import React, { useEffect, useState } from 'react';

// const locales = ['en', 'fr']; // Define your available locales here

// export default function LocaleSwitcher() {
//   const router = useRouter();
//   const [currentLocale, setCurrentLocale] = useState(router.locale);

//   useEffect(() => {
//     // This code runs only on the client side
//     setCurrentLocale(router.locale);
//   }, [router.locale]);

//   const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const newLocale = event.target.value;
//     const { pathname, query, asPath } = router;
//     const newPath = asPath.replace(/^\/[a-z]{2}/, `/${newLocale}`); // Assuming locale prefix is always two characters

//     router.push({ pathname, query }, newPath);
//   };

//   // Render method remains the same
//   return (
//     <select defaultValue={currentLocale} onChange={handleLocaleChange}>
//       {locales.map((locale) => (
//         <option key={locale} value={locale}>
//           {locale.toUpperCase()}
//         </option>
//       ))}
//     </select>
//   );
// };
