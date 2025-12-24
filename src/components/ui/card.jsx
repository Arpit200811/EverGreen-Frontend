import * as React from "react";

export function Card({ className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl bg-white shadow-sm overflow-hidden ${className}`}
      {...props}
    />
  );
}

// 🔹 Add CardHeader
export function CardHeader({ className = "", ...props }) {
  return (
    <div className={`p-6 pb-0 flex flex-col space-y-1.5 ${className}`} {...props} />
  );
}

// 🔹 Add CardTitle
export function CardTitle({ className = "", ...props }) {
  return (
    <h3
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  );
}

export function CardContent({ className = "", ...props }) {
  return (
    <div className={`p-6 pt-4 ${className}`} {...props} />
  );
}