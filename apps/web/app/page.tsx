export default function HomePage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Marketing Websites Platform</h1>
      <p>Welcome to our multi-tenant SaaS platform for marketing websites.</p>
      
      <section style={{ marginTop: '2rem' }}>
        <h2>Lead Capture</h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
          <input 
            type="text" 
            placeholder="Your Name" 
            required
            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <input 
            type="email" 
            placeholder="Your Email" 
            required
            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <textarea 
            placeholder="Your Message" 
            rows={4}
            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <button 
            type="submit"
            style={{ 
              padding: '0.75rem', 
              backgroundColor: '#0070f3', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Submit
          </button>
        </form>
      </section>
      
      <section style={{ marginTop: '2rem' }}>
        <h2>Features</h2>
        <ul>
          <li>Multi-tenant architecture</li>
          <li>Lead capture and management</li>
          <li>SEO optimization</li>
          <li>Performance monitoring</li>
        </ul>
      </section>
    </div>
  )
}
