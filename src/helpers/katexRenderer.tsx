"use client";

import katex from "katex";
import "katex/dist/katex.min.css";
import parse, { HTMLReactParserOptions, Element } from "html-react-parser";
import Image from "next/image";
import { useEffect, useRef } from "react";

// KaTeX Renderer Component
export const KatexRenderer: React.FC<{ latex: string }> = ({ latex }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      katex.render(latex, containerRef.current, {
        throwOnError: false,
        displayMode: false,
      });
    }
  }, [latex]);

  return <span ref={containerRef}></span>;
};

export const renderWithLatex = (text: string) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        if (
          domNode.name === "ki" &&
          domNode.attribs["data-katex"] === "true" &&
          domNode.attribs.src
        ) {
          return <KatexRenderer latex={domNode.attribs.src} />;
        }

        if (domNode.name === "img") {
          const src = domNode.attribs.src;
          if (src.trim() == "") {
            console.warn(
              "Empty or missing src attribute for <img> tag:",
              domNode
            );
            return <></>; // Skip rendering the image
          }
          return (
            <Image
              src={src}
              className={domNode.attribs.class || ""}
              alt="Question image"
              height={200}
              width={200}
              style={{
                maxWidth: "100%",
                ...(domNode.attribs["data-size"] === "small" && {
                  width: "200px",
                }),
                ...(domNode.attribs["data-float"] === "none" && {
                  float: "none",
                }),
              }}
            />
          );
        }
        if (domNode.attribs.src == "") {
          return <></>;
        }
      }

      return null; // Let other nodes be handled by default
    },
  };

  return parse(text, options);
};
