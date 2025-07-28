import React from 'react';

export const FlowbiteIllustration = ({ 
    name, 
    className = '', 
    width = '300px',
    height = 'auto',
    title = ''
}) => {
    // Base path to your illustrations
    const basePath = '/media/illustrations';

    const illustrationSrc = `${basePath}/${name}.svg`;

    return (
        <div className={className}>
            <img 
                src={illustrationSrc}
                alt={title || `${name} illustration`}
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
