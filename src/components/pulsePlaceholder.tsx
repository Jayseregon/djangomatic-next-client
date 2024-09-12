interface TxtPlaceholderProps {
  nonce?: string;
}

/**
 * LgPlaceholder component renders a large placeholder with animated pulse effect.
 * It displays a grid of div elements with different column spans to simulate loading content.
 *
 * @returns {JSX.Element} The rendered LgPlaceholder component.
 */
export const LgPlaceholder = (): JSX.Element => {
  return (
    <div>
      <div className="animate-pulse flex-auto">
        <div className="grid grid-cols-4 gap-1">
          <div className="h-2 bg-slate-700 rounded col-span-2" />
          <div className="h-2 bg-slate-700 rounded col-span-3" />
          <div className="h-2 bg-slate-700 rounded col-span-1" />
          <div className="h-2 bg-slate-700 rounded col-span-4" />
        </div>
      </div>
    </div>
  );
};

/**
 * TxtPlaceholder component renders a text placeholder with animated pulse effect.
 * It displays a grid of div elements with different column spans to simulate loading text content.
 *
 * @param {Object} props - The props for the TxtPlaceholder component.
 * @param {string} [props.nonce] - Optional nonce for the component.
 * @returns {JSX.Element} The rendered TxtPlaceholder component.
 */
export const TxtPlaceholder = ({ nonce }: TxtPlaceholderProps): JSX.Element => {
  return (
    <div
      className="animate-pulse"
      nonce={nonce}>
      <div className="grid grid-cols-4 gap-1">
        <div className="h-2 bg-slate-700 rounded col-span-3" />
        <div className="h-2 bg-slate-700 rounded col-span-1" />
        <div className="h-2 bg-slate-700 rounded col-span-4" />
      </div>
    </div>
  );
};

/**
 * LinePlaceholder component renders a single line placeholder with animated pulse effect.
 * It adjusts itself to its parent container/component.
 *
 * @returns {JSX.Element} The rendered LinePlaceholder component.
 */
export const LinePlaceholder = (): JSX.Element => {
  return (
    <div className="animate-pulse w-full">
      <div className="h-2 bg-slate-700 rounded w-full" />
    </div>
  );
};
