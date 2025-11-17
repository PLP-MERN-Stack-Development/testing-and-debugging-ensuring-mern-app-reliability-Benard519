import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Card Component
 * 
 * @param {string} title - Card title
 * @param {React.ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} footer - Optional footer content
 * @param {function} onClick - Optional click handler
 */
const Card = ({
  title,
  children,
  className = '',
  footer,
  onClick,
  ...props
}) => {
  // Debug: Log card render
  if (process.env.NODE_ENV === 'development') {
    console.log('🔵 Card rendered:', { title, hasFooter: !!footer });
  }

  const baseClasses = 'bg-white rounded-lg shadow-md overflow-hidden';
  const clickableClasses = onClick ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200' : '';
  
  const cardClasses = `
    ${baseClasses}
    ${clickableClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const handleClick = (e) => {
    if (onClick) {
      // Debug: Log card click
      if (process.env.NODE_ENV === 'development') {
        console.log('🟢 Card clicked:', { title });
      }
      onClick(e);
    }
  };

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      data-testid="card"
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  footer: PropTypes.node,
  onClick: PropTypes.func,
};

export default Card;

