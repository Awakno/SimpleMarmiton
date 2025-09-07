"use client";

import React, { useState } from "react";

interface NewRecipeFormProps {
  onSubmit?: (data: RecipeFormData) => void;
  onChange?: (data: RecipeFormData) => void;
}

export interface RecipeFormData {
  title: string;
  description: string; // markdown, can include images
  files?: File[];
}

const NewRecipe: React.FC<NewRecipeFormProps> = ({ onSubmit, onChange }) => {
  const [form, setForm] = useState<RecipeFormData>({
    title: "",
    description: "",
    files: [],
  });
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      onChange?.(updated);
      return updated;
    });
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setForm((prev) => {
      const updated = {
        ...prev,
        files: [...(prev.files || []), ...Array.from(files)],
      };
      onChange?.(updated);
      return updated;
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white/80 dark:bg-[#232526]/80 p-0 md:p-6 rounded-2xl shadow-xl flex flex-col gap-6"
    >
      <h2 className="text-3xl font-extrabold mb-2 text-[#e07a5f] tracking-tight px-6 pt-6">
        Ajouter une recette
      </h2>
      <div className="flex flex-col gap-8 px-6 pb-6">
        {/* Titre */}
        <div className="relative group mb-6">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full text-4xl font-bold bg-transparent border-0 border-b-2 border-[#e07a5f] focus:ring-0 focus:border-[#81b29a] transition placeholder-transparent py-2 px-0 outline-none"
            placeholder="Titre de la recette"
            required
            autoFocus
          />
          <label
            className={`absolute left-0 top-2 text-[#e07a5f] text-lg font-semibold pointer-events-none transition-all duration-200 ${
              form.title ? "-translate-y-7 scale-90 opacity-70" : "opacity-50"
            }`}
          >
            Titre
          </label>
        </div>

        {/* Description longue, markdown, drag&drop, images */}
        <div className="relative group mb-6">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`w-full min-h-[220px] text-lg bg-transparent border-0 border-b-2 border-gray-300 focus:border-[#81b29a] focus:ring-0 transition placeholder-gray-400 resize-vertical py-3 px-0 outline-none ${
              dragActive ? "ring-2 ring-[#e07a5f]/60" : ""
            }`}
            placeholder="Écrivez votre recette en markdown, ajoutez des images par glisser-déposer ou via le bouton ci-dessous..."
            required
          />
          <label
            className={`absolute left-0 top-2 text-gray-500 text-base font-medium pointer-events-none transition-all duration-200 ${
              form.description
                ? "-translate-y-7 scale-90 opacity-70"
                : "opacity-50"
            }`}
          >
            Description détaillée (markdown, images, etc)
          </label>
          <div className="flex gap-2 mt-2">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
              className="file:rounded file:border-0 file:bg-[#e07a5f] file:text-white file:px-4 file:py-2 file:font-semibold file:cursor-pointer file:hover:bg-[#81b29a] transition"
            />
            {form.files && form.files.length > 0 && (
              <span className="text-xs text-gray-500">
                {form.files.length} fichier(s) ajouté(s)
              </span>
            )}
          </div>
          {dragActive && (
            <div className="absolute inset-0 bg-[#e07a5f]/10 border-2 border-dashed border-[#e07a5f] rounded-xl pointer-events-none animate-pulse" />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-6 bg-gradient-to-r from-[#e07a5f] to-[#81b29a] text-white rounded-xl px-6 py-3 font-bold text-lg shadow-lg hover:scale-105 hover:from-[#81b29a] hover:to-[#e07a5f] transition-all duration-200"
        >
          Ajouter la recette
        </button>
      </div>
    </form>
  );
};

export default NewRecipe;
