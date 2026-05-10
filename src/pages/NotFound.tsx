import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <span className="text-6xl">🌸</span>
      <h1 className="text-3xl font-bold bloom-gradient-text">Page Not Found</h1>
      <p className="text-muted-foreground text-center">
        This page doesn't exist. Let's go back to the studio.
      </p>
      <Link
        to="/"
        className="bloom-btn bloom-btn-primary px-6 py-2.5 text-sm font-semibold"
      >
        Back to Bloom Studio
      </Link>
    </div>
  );
};

export default NotFound;
