export default function TemplateShell({ theme = 'dark', children, className = '' }) {
  return (
    <div className={`template template--${theme} ${className}`.trim()}>
      {children}
    </div>
  )
}
