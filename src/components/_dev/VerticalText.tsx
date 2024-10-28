/**
 * VerticalText component renders a given text vertically.
 * Each character of the text is displayed in a separate line.
 *
 * @param {Object} props - The props for the VerticalText component.
 * @param {string} props.text - The text to be displayed vertically.
 * @returns {JSX.Element} The rendered VerticalText component.
 */
export const VerticalText = ({ text }: { text: string }): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-2">
      {/* Split the text into individual characters and render each character in a separate line */}
      {text.split("").map((char, index) => (
        <div key={index}>{char}</div>
      ))}
    </div>
  );
};
