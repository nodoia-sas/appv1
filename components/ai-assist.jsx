"use client"
import React from "react"

const MicIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"
    />
  </svg>
)

export default function AiAssist({ setActiveScreen, chatHistory, userMessage, setUserMessage, handleSendMessage }) {
  return (
    <div className="p-6 flex flex-col h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Asesoría IA</h2>
      <button
        onClick={() => setActiveScreen("home")}
        className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
      >
        ← Volver al Inicio
      </button>
      <p className="text-gray-600 text-center mb-6">Pregunta a nuestro asistente inteligente sobre cualquier duda vial.</p>
      <div className="flex-grow bg-white p-4 rounded-xl shadow-md border border-gray-200 overflow-y-auto mb-4 space-y-4">
        {chatHistory.length === 0 ? (
          <p className="text-gray-500 text-center italic">¡Hola! ¿En qué puedo ayudarte hoy?</p>
        ) : (
          chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                  msg.role === "user" ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex items-center space-x-3">
        <textarea
          className="flex-grow p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows="1"
          placeholder="Escribe tu mensaje..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          aria-label="Escribir mensaje al asistente IA"
        ></textarea>
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700 transition-colors duration-200"
          aria-label="Enviar mensaje"
        >
          <MicIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
