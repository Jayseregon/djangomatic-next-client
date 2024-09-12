import { useTranslations } from "next-intl";

import { ExclamationTriangleIcon } from "@/src/components/icons";
import { title, subtitle } from "@/components/primitives";

/**
 * SaasPage component renders a guide to help users navigate and utilize web apps effectively.
 * It includes sections on getting started, permissions and access, maximizing benefits, and feedback contributions.
 *
 * Route Page Content and Purpose:
 * This route page provides a comprehensive guide to help users navigate and utilize the web apps effectively,
 * covering topics such as getting started, permissions and access, maximizing benefits, and providing feedback.
 *
 * @returns {JSX.Element} The rendered SaasPage component.
 */
export default function SaasPage(): JSX.Element {
  const t = useTranslations("Saas");

  return (
    <div className="text-center max-w-screen-md sm:px-5 mx-auto">
      <div className="max-w-sm mx-auto">
        <h1 className={title()}>
          {t("title")} {t("subtitle")}
        </h1>
      </div>

      <div className="py-5" />

      <div className="text-justify">
        <p className={subtitle({ className: "text-foreground" })}>
          This guide will help you navigate and utilize our web apps effectively
          to maximize their potential.
        </p>

        <section className="mt-8">
          <h2 className="text-2xl font-bold">Getting Started with the Apps</h2>
          <p>
            Our web apps are designed to be user-friendly, providing you with
            all the tools needed to manage your tasks efficiently. Here&apos;s
            how to get started:
          </p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Navigation:</strong> Use the sidebar to navigate between
              different apps. Each section represents a specific client or
              project and is further organized by platform type and tool for
              easy access.
            </li>
            <li>
              <strong>Examples and Tutorials:</strong> Look for examples and
              tutorials within each app. When available, examples and video
              tutorials will present the tool in action.
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold">Permissions and Access</h2>
          <p className="flex inline-block gap-2">
            <ExclamationTriangleIcon />
            Access to specific apps is controlled by permissions.
          </p>
          <p>
            Without the proper permissions, the app will still be accessible but
            deactivated. This approach serves multiple purposes:
          </p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Hint of Functionality:</strong> Users can see what the app
              does, which can spark curiosity and interest.
            </li>
            <li>
              <strong>Idea Generation:</strong> Users can explore existing apps
              to see if their ideas are already implemented or if there is room
              for new suggestions.
            </li>
            <li>
              <strong>Feedback and Suggestions:</strong> Users are encouraged to
              provide feedback or propose new ideas based on their exploration
              of the app.
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold">
            Maximizing the Benefits of Our Apps
          </h2>
          <p>
            To get the most out of our web apps, consider the following tips:
          </p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Start with the Basics:</strong> Familiarize yourself with
              the basic features before exploring advanced functionalities.
            </li>
            <li>
              <strong>Utilize Integrations:</strong> Take advantage of
              integrations with other tools and services to streamline your
              workflows.
            </li>
            <li>
              <strong>Stay Updated:</strong> Keep an eye on updates and new
              features to continuously improve your experience.
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold">Feedback and Contributions</h2>
          <p>
            Your feedback is invaluable to us. If you have suggestions on how we
            can improve our web apps, please let us know.
          </p>
          <p>
            Additionally, if you&apos;ve created workflows or solutions that
            could benefit others, consider sharing them with us. We could add
            them to the platform, making them available to all users.
          </p>
        </section>
      </div>
    </div>
  );
}
