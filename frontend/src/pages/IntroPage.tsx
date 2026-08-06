import React from 'react';

export const IntroPage: React.FC = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#050811]">
      <iframe
        src="/intro/index.html"
        title="ChainIQ 3D Intro Showcase"
        className="w-full h-full border-0"
      />
    </div>
  );
};
