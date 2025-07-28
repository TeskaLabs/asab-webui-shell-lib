import React from 'react';

export const FlowbiteIllustration = ({ 
  name, 
  className = '', 
  width = '300px',
  height = 'auto',
  alt = '',
  title = ''
}) => {
  // Base path to your illustrations
  const basePath = '/media/illustrations';
  
  const illustrationSrc = `${basePath}/${name}.svg`;

  return (
    <div className={`flowbite-illustration ${className}`}>
      <img 
        src={illustrationSrc}
        alt={alt || `${name} illustration`}
		title={title}
        style={{ 
          width, 
          height,
          maxWidth: '100%',
        }}
        onError={(e) => {
          console.warn(`Illustration '${name}' failed to load from ${illustrationSrc}`);
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
};
