"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function NewPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Submit recipe to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error("Erreur lors de la création de la recette");
      setSubmitSuccess(true);
      setTitle("");
      setContent("");
      setFiles([]);
    } catch (e) {
      setSubmitError((e as Error).message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Image upload logic
  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    setFiles((prev) => [...prev, ...dropped]);
    for (const file of dropped) {
      await uploadImage(file);
    }
  };
  const uploadImage = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!data.url) throw new Error("Erreur upload image");
      setContent((prev) => prev + `\n![Image](${data.url})\n`);
    } catch (e) {
      setUploadError("Erreur lors de l'upload de l'image.");
    } finally {
      setUploading(false);
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgs = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    setFiles((prev) => [...prev, ...imgs]);
    for (const file of imgs) {
      await uploadImage(file);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col items-center py-0 md:py-8 animate-fade-in">
      <main className="w-full max-w-3xl mx-auto flex flex-col gap-8 animate-fade-in">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white shadow-2xl p-6 md:p-10 border border-[#e07a5f]/10 animate-pop-in"
        >
          {/* Titre */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl font-extrabold bg-transparent border-0 border-b-2 border-[#e07a5f] focus:ring-0 focus:border-[#81b29a] transition placeholder-[#e07a5f]/60 text-gray-900 py-2 px-0 outline-none mb-6"
            placeholder="Titre de la recette..."
            autoFocus
            required
          />
          {/* Editeur markdown */}
          <div className="relative group mb-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`w-full min-h-[300px] text-lg bg-transparent border-0 border-b-2 border-gray-300 focus:border-[#81b29a] focus:ring-0 transition placeholder-[#81b29a]/60 text-gray-900 resize-vertical py-3 px-0 outline-none ${
                dragActive ? "ring-2 ring-[#e07a5f]/60" : ""
              }`}
              placeholder="Écrivez votre recette en markdown, ajoutez des images par glisser-déposer ou via le bouton ci-dessous..."
              required
            />
            <div className="flex gap-2 mt-2 items-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInput}
                className="file:rounded file:border-0 file:bg-[#e07a5f] file:text-white file:px-4 file:py-2 file:font-semibold file:cursor-pointer file:hover:bg-[#81b29a] transition"
              />
              {uploading && (
                <span className="text-xs text-[#e07a5f] animate-pulse">
                  Upload en cours...
                </span>
              )}
              {uploadError && (
                <span className="text-xs text-red-500">{uploadError}</span>
              )}
              {files.length > 0 && !uploading && (
                <span className="text-xs text-gray-500">
                  {files.length} image(s) ajoutée(s)
                </span>
              )}
            </div>
            {dragActive && (
              <div className="absolute inset-0 bg-[#e07a5f]/10 border-2 border-dashed border-[#e07a5f] rounded-xl pointer-events-none animate-pulse" />
            )}
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2 rounded bg-[#81b29a] text-white font-bold text-lg shadow hover:bg-[#e07a5f] transition disabled:opacity-60"
            disabled={submitLoading || uploading || !title || !content}
          >
            {submitLoading ? "Envoi..." : "Publier la recette"}
          </button>
          {submitSuccess && (
            <div className="mt-2 text-green-600 font-semibold">
              Recette publiée !
            </div>
          )}
          {submitError && (
            <div className="mt-2 text-red-600 font-semibold">{submitError}</div>
          )}
        </form>
        {/* Preview immersive */}
        <div className="rounded-2xl bg-white shadow-2xl p-6 md:p-10 border border-[#81b29a]/10 animate-pop-in mt-2">
          <h2 className="text-2xl font-bold mb-4 text-[#e07a5f] tracking-wide uppercase">
            Aperçu final
          </h2>
          <div className="prose max-w-none custom-markdown text-lg text-gray-900">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1
                    className="text-4xl font-extrabold text-[#e07a5f] mt-6 mb-2 border-b-2 border-[#e07a5f] pb-1"
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-2xl font-semibold text-[#81b29a] mt-4 mb-2 border-b border-[#81b29a] pb-1"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className="text-xl font-semibold text-[#81b29a] mt-3 mb-1"
                    {...props}
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul
                    className="list-disc pl-6 my-2 text-[#81b29a]"
                    {...props}
                  />
                ),
                ol: ({ node, ...props }) => (
                  <ol
                    className="list-decimal pl-6 my-2 text-[#81b29a]"
                    {...props}
                  />
                ),
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                p: ({ node, ...props }) => (
                  <p className="my-2 text-gray-900/90" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="text-[#e07a5f] font-semibold" {...props} />
                ),
                em: ({ node, ...props }) => (
                  <em className="text-[#81b29a]" {...props} />
                ),
                code: ({ node, ...props }) => (
                  <code
                    className="bg-gray-100 px-1 rounded text-[#e07a5f]"
                    {...props}
                  />
                ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-[#e07a5f] underline hover:text-[#81b29a]"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
                img: ({ node, ...props }) => (
                  <img
                    className="rounded shadow max-h-64 my-4"
                    alt=""
                    {...props}
                  />
                ),
                br: () => <br />,
              }}
            >
              {`# ${title}\n\n${content}`}
            </ReactMarkdown>
          </div>
        </div>
      </main>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-slide-down {
          animation: slideDown 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-pop-in {
          animation: popIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(-40px);
            opacity: 0;
          }
          to {
            transform: none;
            opacity: 1;
          }
        }
        @keyframes popIn {
          from {
            transform: scale(0.96);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          background: #ededed;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e07a5f;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
