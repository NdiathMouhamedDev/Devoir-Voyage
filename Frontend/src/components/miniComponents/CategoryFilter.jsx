import React from 'react';
import CategoryBadge from './CategoryBadge';

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-lg font-medium">Filtrer par catégorie</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-3 py-2 rounded-md text-sm font-medium 
            ${!selectedCategory 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          Tous
        </button>
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            onClick={() => onCategoryChange(key)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${selectedCategory === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            <CategoryBadge category={key} />
          </button>
        ))}
      </div>
    </div>
  );
}