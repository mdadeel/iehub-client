import { useEffect } from 'react';

export default function SEOHead({
  title = 'IEHUB | Global B2B Commodity Trade & Logistics Infrastructure',
  description = 'Source verified international commodity suppliers, issue commercial purchase orders, and track ocean shipments to port arrival.',
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://iehub-client.vercel.app/logo.png',
  schemaData = null,
}) {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // 3. Update Canonical Link
    const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href.split('?')[0] : '');
    if (currentUrl) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.rel = 'canonical';
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.href = currentUrl;
    }

    // 4. Helper for OpenGraph / Twitter Meta Tags
    const setMeta = (attr, attrValue, content) => {
      let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', currentUrl);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:image', ogImage);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    // 5. Inject JSON-LD Schema
    let scriptSchema = document.querySelector('#jsonld-schema');
    if (schemaData) {
      if (!scriptSchema) {
        scriptSchema = document.createElement('script');
        scriptSchema.id = 'jsonld-schema';
        scriptSchema.type = 'application/ld+json';
        document.head.appendChild(scriptSchema);
      }
      scriptSchema.textContent = JSON.stringify(schemaData);
    } else if (scriptSchema) {
      scriptSchema.remove();
    }
  }, [title, description, canonicalUrl, ogType, ogImage, schemaData]);

  return null;
}
