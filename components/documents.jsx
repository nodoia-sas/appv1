"use client";

import React, { useState, useRef } from "react";
import { PersonalDocuments } from "./documents-manager/PersonalDocuments";
import { Vehicles } from "./documents-manager/Vehicles";

export default function Documents() {
  const [activeTab, setActiveTab] = useState("personal"); // 'personal' or 'vehicles'
  const [message, setMessage] = useState(null);
  const messageTimeoutRef = useRef(null);

  const showMessage = (msgObj, duration = 5000) => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = null;
    }
    setMessage(msgObj);
    messageTimeoutRef.current = setTimeout(() => {
      setMessage(null);
      messageTimeoutRef.current = null;
    }, duration);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
        Gestión de Documentos
      </h2>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-100 p-1 rounded-full inline-flex border border-slate-200">
          <button
            onClick={() => setActiveTab("personal")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === "personal"
                ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Mis Documentos
          </button>
          <button
            onClick={() => setActiveTab("vehicles")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === "vehicles"
                ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Mis Vehículos
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === "personal" && (
          <PersonalDocuments showMessage={showMessage} />
        )}
        {activeTab === "vehicles" && <Vehicles showMessage={showMessage} />}
      </div>

      {message && (
        <div
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-xl text-white z-50 flex items-center space-x-2 ${
            message.type === "success"
              ? "bg-emerald-600"
              : message.type === "info"
              ? "bg-indigo-600"
              : "bg-red-500"
          }`}
        >
          <span>
            {message.type === "success"
              ? "✅"
              : message.type === "info"
              ? "ℹ️"
              : "⚠️"}
          </span>
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
}
