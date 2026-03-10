"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useNews } from "../hooks/useNews";
import { StarIcon as DefaultStar } from "@/components/icons-placeholder";

export default function News() {
  const { newsItems, toggleFavorite } = useNews();
  const [expandedState, setExpandedState] = useState({});
  const StarIcon = DefaultStar;

  const toggleNewsExpanded = (id) =>
    setExpandedState((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
        Noticias y Novedades
      </h2>
      <Link
        href="/"
        className="mb-4 bg-slate-200 text-slate-800 py-2 px-4 rounded-full text-sm hover:bg-slate-300 transition-colors duration-200 shadow-sm inline-block border border-slate-300"
      >
        ← Volver al Inicio
      </Link>
      <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {newsItems.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-xl shadow-md border border-slate-200 transition-all duration-200 hover:shadow-lg hover:border-indigo-200"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-slate-800 text-lg pr-4">
                {item.title}
              </h3>
              <button
                onClick={() => toggleFavorite(item)}
                className="p-1 rounded-full text-slate-400 hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-200"
                aria-label={
                  item.saved ? "Eliminar de Favoritos" : "Guardar en Favoritos"
                }
              >
                <StarIcon
                  className={`w-6 h-6 ${
                    item.saved ? "text-amber-400" : "text-slate-400"
                  }`}
                />
              </button>
            </div>
            {item.imageUrl && (
              <div className="mb-4 flex justify-center">
                <img
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={`Imagen de ${item.title}`}
                  className="rounded-lg max-h-40 w-full object-cover"
                />
              </div>
            )}
            <p className="text-slate-700 mt-2 text-sm leading-relaxed">
              {expandedState[item.id] ? item.fullContent : item.summary}
            </p>
            <button
              onClick={() => toggleNewsExpanded(item.id)}
              className="mt-4 w-full bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600 transition-colors duration-200 text-sm shadow-sm hover:shadow-md"
            >
              {expandedState[item.id] ? "Ver menos" : "Ver más"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
