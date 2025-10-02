import { Helmet } from 'react-helmet-async'

const SEO = ({ 
  title = 'JustFoodies - Cloud Kitchen', 
  description = 'Order fresh, delicious food from JustFoodies Cloud Kitchen. Fast delivery in Pune with authentic flavors and quality ingredients.',
  keywords = 'cloud kitchen, food delivery, pune, online food order, fresh food, home delivery',
  image = '/logo.png',
  url = window.location.href,
  type = 'website'
}) => {
  const fullTitle = title.includes('JustFoodies') ? title : `${title} | JustFoodies`
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="JustFoodies" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          "name": "JustFoodies",
          "description": description,
          "url": "https://justfoodies.in",
          "telephone": "+91 97678 56258",
          "email": "infoatjustfood@gmail.com",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Pune",
            "addressCountry": "IN"
          },
          "servesCuisine": "Indian",
          "priceRange": "₹₹",
          "foundingDate": "2008"
        })}
      </script>
    </Helmet>
  )
}

export default SEO