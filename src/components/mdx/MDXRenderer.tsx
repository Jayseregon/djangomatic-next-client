import Image from "next/image";
import * as runtime from "react/jsx-runtime";

import Callout from "./callout";
import Snippet from "./snippet";
import { LoadDynamicImage } from "./loadImages";
import Quote from "./quote";

/**
 * useMDXComponent function creates a new function from the provided MDX code string.
 * It returns the default export of the generated function, which is the MDX component.
 *
 * @param {string} code - The MDX code string to be converted into a component.
 */
const useMDXComponent = (code: string) => {
  const fn = new Function(code);

  return fn({ ...runtime }).default;
};

const sharedComponents = {
  Image,
  Callout,
  Snippet,
  LoadDynamicImage,
  Quote,
};

interface MdxProps {
  code: string;
  components?: Record<string, React.ComponentType>;
  [key: string]: any;
}

/**
 * MDXContent component renders MDX content using the provided code and components.
 * It combines shared components with any additional components passed in the props.
 *
 * @param {Object} props - The props for the MDXContent component.
 * @param {string} props.code - The MDX code string to be rendered.
 * @param {Record<string, React.ComponentType>} [props.components] - Additional components to be used in the MDX content.
 * @returns {JSX.Element} The rendered MDXContent component.
 */
export default function MDXContent({
  code,
  components,
  ...props
}: MdxProps): JSX.Element {
  const Component = useMDXComponent(code);

  return (
    <Component components={{ ...sharedComponents, ...components }} {...props} />
  );
}
