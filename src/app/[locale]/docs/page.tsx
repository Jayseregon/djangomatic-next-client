// import { useTranslations } from "next-intl";

import { title } from "@/components/primitives";

export default function DocsPage() {
  // const t = useTranslations("Docs");

  return (
    <div className="text-center max-w-screen-md mx-auto">
      <h1 className={title()}>Usage Guidelines</h1>

      <div className="py-3" />

      <div className="text-justify">
        <p>
          Welcome to our platform! This guide will help you navigate and utilize
          the documentation effectively to make the most out of our automated
          tools.
        </p>

        <section className="mt-8">
          <h2 className="text-2xl font-bold">
            Understanding the Documentation
          </h2>
          <p>
            Our documentation is designed to be user-friendly, providing you
            with all the information needed to use our tools efficiently.
            Here&apos;s how to get started:
          </p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Search Functionality:</strong> Use the search bar at the
              top of the documentation page to quickly find specific topics or
              tools.
            </li>
            <li>
              <strong>Navigation:</strong> Use the sidebar to navigate between
              different sections of the documentation. Each section is organized
              by tool and feature for easy access.
            </li>
            <li>
              <strong>Examples and Tutorials:</strong> Look for examples and
              tutorials within each tool&apos;s documentation to see the tool in
              action.
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold">
            Getting the Most Out of Our Tools
          </h2>
          <p>
            To maximize the benefits of our automated tools, consider the
            following tips:
          </p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Start with the Basics:</strong> If you are new to
              automation, begin with our introductory guides to understand the
              fundamentals.
            </li>
            <li>
              <strong>Explore Advanced Features:</strong> Once comfortable,
              explore more advanced features to enhance your workflows.
            </li>
            <li>
              <strong>Use Support Resources:</strong> If you encounter any
              issues or have questions, consult our FAQ section or reach out to
              our support team.
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold">Feedback and Contributions</h2>
          <p>
            Your feedback is invaluable to us. If you have suggestions on how we
            can improve our documentation or tools, please let us know.
            Additionally, if you&apos;ve created workflows or solutions that
            could benefit others, consider sharing them with our community.
          </p>
        </section>
      </div>
    </div>
  );
}
