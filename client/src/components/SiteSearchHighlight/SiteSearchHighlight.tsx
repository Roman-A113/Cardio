import React from "react";
import { normalizeSearchText } from "../../lib/siteSearch";
import "./SiteSearchHighlight.css";

interface SiteSearchHighlightProps {
  text: string;
  query: string;
}

const SiteSearchHighlight: React.FC<SiteSearchHighlightProps> = ({
  text,
  query,
}) => {
  const terms = normalizeSearchText(query)
    .split(/\s+/)
    .filter(Boolean)
    .sort((left, right) => right.length - left.length);

  if (terms.length === 0) {
    return <>{text}</>;
  }

  const pattern = terms
    .map((term) => term.replace(/е/g, "[её]"))
    .join("|");
  const splitPattern = new RegExp(`(${pattern})`, "giu");
  const exactTermPattern = new RegExp(`^(?:${pattern})$`, "iu");

  return (
    <>
      {text.split(splitPattern).map((part, index) =>
        exactTermPattern.test(part) ? (
          <mark className="site-search-highlight" key={index}>
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
};

export default SiteSearchHighlight;
