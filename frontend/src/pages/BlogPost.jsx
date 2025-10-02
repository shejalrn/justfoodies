import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Calendar, User, Tag, ArrowLeft, Share2 } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import api from '../utils/api'
import { Helmet } from 'react-helmet-async'

const BlogPost = () => {
  const { slug } = useParams()

  const { data: blog, isLoading } = useQuery(
    ['blog', slug],
    () => api.get(`/api/blog/${slug}`).then(res => res.data),
    {
      enabled: !!slug
    }
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryLabel = (category) => {
    const labels = {
      'recipes': 'Recipes',
      'food-tips': 'Food Tips',
      'health-nutrition': 'Health & Nutrition',
      'company-news': 'Company News'
    }
    return labels[category] || category
  }

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const components = {
    types: {
      image: ({value}) => (
        <div className="my-8">
          <img 
            src={value.asset.url} 
            alt={value.alt || ''} 
            className="w-full rounded-lg shadow-md"
          />
          {value.caption && (
            <p className="text-sm text-gray-600 text-center mt-2 italic">
              {value.caption}
            </p>
          )}
        </div>
      )
    },
    block: {
      h1: ({children}) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
      h2: ({children}) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
      h3: ({children}) => <h3 className="text-xl font-semibold mt-4 mb-2">{children}</h3>,
      normal: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
      blockquote: ({children}) => (
        <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-gray-700">
          {children}
        </blockquote>
      )
    },
    list: {
      bullet: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
      number: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
    },
    listItem: {
      bullet: ({children}) => <li className="mb-1">{children}</li>,
      number: ({children}) => <li className="mb-1">{children}</li>
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading blog post...</div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Link to="/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{blog.seo?.metaTitle || blog.title} | JustFoodies Blog</title>
        <meta name="description" content={blog.seo?.metaDescription || blog.excerpt} />
        <meta name="keywords" content={blog.seo?.keywords?.join(', ') || blog.tags?.join(', ')} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:image" content={blog.featuredImage} />
        <meta property="og:type" content="article" />
        <meta property="article:author" content={blog.author} />
        <meta property="article:published_time" content={blog.publishedAt} />
        <meta property="article:section" content={getCategoryLabel(blog.category)} />
        {blog.tags?.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <link rel="canonical" href={`${window.location.origin}/blog/${blog.slug.current}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.excerpt,
            "image": blog.featuredImage,
            "author": {
              "@type": "Organization",
              "name": blog.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "JustFoodies",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/logo.png`
              }
            },
            "datePublished": blog.publishedAt,
            "dateModified": blog.publishedAt,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": window.location.href
            }
          })}
        </script>
      </Helmet>

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              blog.category === 'recipes' ? 'bg-green-100 text-green-800' :
              blog.category === 'food-tips' ? 'bg-blue-100 text-blue-800' :
              blog.category === 'health-nutrition' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {getCategoryLabel(blog.category)}
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-4 leading-tight">{blog.title}</h1>
          
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">{blog.excerpt}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <User size={16} />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{formatDate(blog.publishedAt)}</span>
            </div>
            <button 
              onClick={sharePost}
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>

          {blog.featuredImage && (
            <div className="mb-8">
              <img 
                src={blog.featuredImage} 
                alt={blog.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {blog.content && (
            <PortableText 
              value={blog.content} 
              components={components}
            />
          )}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map(tag => (
                <span 
                  key={tag} 
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 p-6 bg-primary/10 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Hungry for More?</h3>
          <p className="text-gray-600 mb-4">
            Explore our delicious menu and order your favorite dishes today!
          </p>
          <Link to="/menu" className="btn-primary">
            View Menu
          </Link>
        </div>
      </article>
    </>
  )
}

export default BlogPost