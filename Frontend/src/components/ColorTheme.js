// ColorTheme.js
// This file contains the new creative color theme to be used across components

export const colorTheme = {
    primary: {
      gradient: 'from-[#78C6A3] to-[#78C6A3]', // solid look (no gradient shift)
      light: 'from-[#B2E0CE] to-[#DFF4EA]',   // optional light shades (you can adjust as needed)
      text: 'text-[#78C6A3]',
      border: 'border-[#78C6A3]',
      hover: 'hover:text-[#78C6A3]',
      background: 'bg-[#78C6A3]',
      fill: 'fill-[#78C6A3]',
      stroke: 'stroke-[#78C6A3]'
    },
    
    
    // Secondary gradient pairs
    secondary: {
      gradient: 'from-emerald-500 to-teal-400',
      light: 'from-emerald-100 to-teal-50',
      text: 'text-emerald-600',
      border: 'border-emerald-300',
      hover: 'hover:text-emerald-600',
      background: 'bg-emerald-500',
      fill: 'fill-emerald-500',
      stroke: 'stroke-emerald-500'
    },
    
    // Accent color options
    accent: [
      {
        gradient: 'from-rose-500 to-pink-500',
        light: 'from-rose-100 to-pink-50',
        text: 'text-rose-600',
        border: 'border-rose-300'
      },
      {
        gradient: 'from-violet-600 to-purple-500',
        light: 'from-violet-100 to-purple-50',
        text: 'text-violet-600',
        border: 'border-violet-300'
      },
      {
        gradient: 'from-cyan-500 to-teal-400',
        light: 'from-cyan-100 to-teal-50',
        text: 'text-cyan-600',
        border: 'border-cyan-300'
      },
      {
        gradient: 'from-fuchsia-500 to-pink-500',
        light: 'from-fuchsia-100 to-pink-50',
        text: 'text-fuchsia-600',
        border: 'border-fuchsia-300'
      },
      {
        gradient: 'from-lime-500 to-green-400',
        light: 'from-lime-100 to-green-50',
        text: 'text-lime-600',
        border: 'border-lime-300'
      }
    ]
  };

