'use client'

import { useEffect } from 'react'
import Reveal from './Reveal'

export default function Contact() {
  // Load the form embed script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://app.waylott.com/js/form_embed.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup: remove script on unmount
      const existingScript = document.querySelector('script[src="https://app.waylott.com/js/form_embed.js"]')
      if (existingScript) {
        document.body.removeChild(existingScript)
      }
    }
  }, [])

  return (
    <section id="contact" className="py-14 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Ready to Uncover Hidden Revenue?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Share your details and our team will reach out to help you
            </p>
          </div>
        </Reveal>

        <Reveal animation="fade-up" delay={90}>
          <div className="max-w-2xl mx-auto">
            <div 
              className="bg-white rounded-2xl border border-gray-200 w-full overflow-hidden"
              style={{
                boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              <iframe
                src="https://app.waylott.com/widget/form/G5kvCSdKAs0SEyY3AiFb"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '24px'
                }}
                id="inline-G5kvCSdKAs0SEyY3AiFb"
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="Waylott Contact Form"
                data-height="738"
                data-layout-iframe-id="inline-G5kvCSdKAs0SEyY3AiFb"
                data-form-id="G5kvCSdKAs0SEyY3AiFb"
                title="Waylott Contact Form"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
