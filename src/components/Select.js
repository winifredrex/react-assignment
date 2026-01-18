import React from 'react';

export default function SelectField({ label, placeholder, id, options, value, onSelect, disabled = false }) {
  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-semibold text-zinc-300 mb-3">{label}</label>}
      <select
        id={id}
        value={value}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
        className="w-full px-5 py-4 bg-zinc-900 border-2 border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-zinc-900">
            {option}
          </option>
        ))}
      </select>
      {disabled && !value && (
        <p className="mt-3 text-sm text-amber-500">Select a genre first to choose a mood.</p>
      )}
    </div>
  );
}