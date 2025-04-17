// tailwind.config.js
module.exports = {
    theme: {
      extend: {
        keyframes: {
          slideDown: {
            from: { height: '0' },
            to: { height: 'var(--radix-accordion-content-height)' },
          },
          slideUp: {
            from: { height: 'var(--radix-accordion-content-height)' },
            to: { height: '0' },
          },
        },
        animation: {
          slideDown: 'slideDown 300ms ease-out',
          slideUp: 'slideUp 300ms ease-out',
        },
      },
    },
  }
  