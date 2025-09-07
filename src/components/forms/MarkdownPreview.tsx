"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps {
  value: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ value }) => {
  if (!value?.trim()) {
    return <div className="text-gray-400 italic">Aucune prévisualisation disponible.</div>;
  }
  return (
    <div className="prose max-w-none custom-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold text-[#e07a5f] mt-6 mb-2 border-b-2 border-[#e07a5f] pb-1" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-semibold text-[#81b29a] mt-4 mb-2 border-b border-[#81b29a] pb-1" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold text-[#3d405b] mt-3 mb-1" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 my-2 text-[#3d405b]" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 my-2 text-[#3d405b]" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="mb-1" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="my-2 text-gray-800" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="text-[#e07a5f] font-semibold" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="text-[#81b29a]" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code className="bg-gray-100 px-1 rounded text-[#3d405b]" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-[#e07a5f] underline hover:text-[#81b29a]" target="_blank" rel="noopener noreferrer" {...props} />
          ),
          img: ({ node, ...props }) => (
            <img className="rounded shadow max-h-64 my-4" alt="" {...props} />
          ),
          br: () => <br />,
        }}
      >
        {value}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
