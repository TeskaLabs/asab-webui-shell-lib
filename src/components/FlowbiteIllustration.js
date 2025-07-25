import React from 'react';

export const FlowbiteIllustration = ({ 
  name, 
  className = '', 
  style = {},
  width = '300px',
  height = 'auto',
  alt = ''
}) => {
  // Base path to your illustrations
  const basePath = '/media/illustrations';
  
  const illustrationSrc = `${basePath}/${name}.svg`;

  return (
    <div className={`flowbite-illustration ${className}`} style={style}>
      <img 
        src={illustrationSrc}
        alt={alt || `${name} illustration`}
        style={{ 
          width, 
          height,
          maxWidth: '100%',
          display: 'block'
        }}
        onError={(e) => {
          console.warn(`Illustration '${name}' failed to load from ${illustrationSrc}`);
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
};
