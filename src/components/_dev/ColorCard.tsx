import type { JSX } from "react";
interface ColorCardScaleProps {
  target_color: string;
}

/**
 * ColorCard component renders a card with various base semantic color labels.
 *
 * @returns {JSX.Element} The rendered ColorCard component.
 */
export const ColorCard = (): JSX.Element => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
      <div className="px-6 py-4">
        <h1 className="font-bold text-md text-center">Base Semantic Colors</h1>
      </div>
      <div className="px-6 pt-4 pb-2">
        <div className="mb-2">
          <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold bg-primary">
            Primary
          </span>
        </div>
        <div className="mb-2">
          <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold bg-secondary">
            Secondary
          </span>
        </div>
        <div className="mb-2">
          <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold bg-success">
            Success
          </span>
        </div>
        <div className="mb-2">
          <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold bg-warning">
            Warning
          </span>
        </div>
        <div className="mb-2">
          <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold bg-danger">
            Danger
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * ColorCardScale component renders a card with various shades of a target color.
 *
 * @param {Object} props - The props for the ColorCardScale component.
 * @param {string} props.target_color - The target color to display shades for.
 * @returns {JSX.Element} The rendered ColorCardScale component.
 */
export const ColorCardScale = ({
  target_color,
}: ColorCardScaleProps): JSX.Element => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-xl m-4">
      <div className="px-6 py-4">
        <h1 className="font-bold text-md text-center">
          Semantic Color for {target_color}
        </h1>
      </div>
      <div className="px-6 pt-4 pb-2">
        <div className="mb-2">
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold bg-${target_color}-50`}
          >
            50
          </span>
        </div>
        <div className="mb-2">
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold bg-${target_color}-100`}
          >
            100
          </span>
        </div>
        <div className="mb-2">
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold bg-${target_color}-200`}
          >
            200
          </span>
        </div>
        <div className="mb-2">
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold bg-${target_color}-300`}
          >
            300
          </span>
        </div>
        <div className="mb-2">
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold bg-${target_color}-400`}
          >
            400
          </span>
        </div>
        <div className="mb-2">
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold bg-${target_color}-500`}
          >
            500
          </span>
        </div>
        <div className="mb-2">
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold bg-${target_color}-600`}
          >
            600
          </span>
        </div>
        <div className="mb-2">
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold bg-${target_color}-700`}
          >
            700
          </span>
        </div>
        <div className="mb-2">
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold bg-${target_color}-800`}
          >
            800
          </span>
        </div>
        <div className="mb-2">
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold bg-${target_color}-900`}
          >
            900
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * DisplaySemanticColors component renders a grid of ColorCard and ColorCardScale components.
 * It displays various base semantic colors and their shades.
 *
 * @returns {JSX.Element} The rendered DisplaySemanticColors component.
 */
export const DisplaySemanticColors = (): JSX.Element => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
      <ColorCard />
      <ColorCardScale target_color="primary" />
      <ColorCardScale target_color="secondary" />
      <ColorCardScale target_color="success" />
      <ColorCardScale target_color="warning" />
      <ColorCardScale target_color="danger" />
    </div>
  );
};
