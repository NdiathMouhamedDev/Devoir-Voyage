import React from 'react';

const categoryColors = {
  religious: 'bg-purple-100 text-purple-800',
  transport: 'bg-green-100 text-green-800',
  health: 'bg-red-100 text-red-800',
  security: 'bg-yellow-100 text-yellow-800',
  accommodation: 'bg-indigo-100 text-indigo-800',
};

const categoryIcons = {
  religious:'🕌',
  transport: '🚌',
  health: '🏥',
  security: '🛡️',
  accommodation: '🏠',
};

export default function CategoryBadge({ category }) {
  const colorClass = categoryColors[category] || categoryColors.religious;
  const icon = categoryIcons[category] || categoryIcons.religious;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      <span className="mr-1">{icon}</span>
      {category}
    </span>
  );
}