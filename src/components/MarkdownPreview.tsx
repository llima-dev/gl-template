import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github-dark.css";
import { substituirShortcodesPorEmojis } from "../helpers";

type MarkdownPreviewProps = {
  markdown: string;
  style?: React.CSSProperties;
  className?: string;
};

export default function MarkdownPreview({
  markdown,
  style,
  className = "",
}: MarkdownPreviewProps) {
  const markdownComEmojis = substituirShortcodesPorEmojis(markdown);

    if (!markdown) {
      return (
        <div
          className={`markdown-preview ${className}`}
          style={{ ...style, padding: 24, fontSize: "1rem" }}
        >
          <em>Nenhum template selecionado.</em>
        </div>
      );
    }

  return (
    <div
      className={`markdown-preview ${className}`}
      style={{
        borderRadius: 8,
        padding: 24,
        fontSize: "1rem",
        ...style,
      }}
    >
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        children={markdownComEmojis}
      />
    </div>
  );
}
