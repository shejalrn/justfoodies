import { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Calendar, User, Tag, Search } from 'lucide-react'
import api from '../utils/api'
import { Helmet } from 'react-helmet-async'

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: blogs, isLoading } = useQuery(
    ['blogs', selectedCategory],
    () => {
      const params = new URLSearchParams()
      if (selectedCategory) params.append('category', selectedCategory)
      return api.get(`/api/blog?${params}`).then(res => res.data)
    }
  )

  const { data: categories } = useQuery('blog-categories', () =>
    api.get('/api/blog/categories').then(res => res.data)
  )

  const filteredBlogs = blogs?.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <>
      <Helmet>
        <title>Food Blog - Recipes, Tips & Nutrition | JustFoodies</title>
        <meta name="description" content="Discover delicious recipes, food tips, and nutrition advice from JustFoodies. Learn about Indian cuisine, healthy eating, and cooking techniques." />
        <meta name="keywords" content="food blog, recipes, Indian cuisine, cooking tips, nutrition, healthy eating, JustFoodies" />
        <meta property="og:title" content="Food Blog - Recipes, Tips & Nutrition | JustFoodies" />
        <meta property="og:description" content="Discover delicious recipes, food tips, and nutrition advice from JustFoodies." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${window.location.origin}/blog`} />
      </Helmet>

      <div>
        {/* Hero Section */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-6">JustFoodies Blog</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Discover delicious recipes, cooking tips, and nutrition advice from our culinary experts.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  className="input pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === '' 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Posts
                </button>
                {categories?.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category 
                        ? 'bg-primary text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {getCategoryLabel(category)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="text-center">Loading blog posts...</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs?.map(blog => (
                  <article key={blog._id} className="card hover:shadow-lg transition-shadow">
                    <Link to={`/blog/${blog.slug.current}`}>
                      <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                        {blog.featuredImage ? (
                          <img 
                            src={blog.featuredImage} 
                            alt={blog.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <div className="text-center text-gray-500">
                              <div className="text-4xl mb-2">📝</div>
                              <div className="text-sm">Blog Post</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded text-xs ${
                          blog.category === 'recipes' ? 'bg-green-100 text-green-800' :
                          blog.category === 'food-tips' ? 'bg-blue-100 text-blue-800' :
                          blog.category === 'health-nutrition' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getCategoryLabel(blog.category)}
                        </span>
                        <Calendar size={14} />
                        <span>{formatDate(blog.publishedAt)}</span>
                      </div>
                      
                      <Link to={`/blog/${blog.slug.current}`}>
                        <h2 className="text-xl font-semibold hover:text-primary transition-colors">
                          {blog.title}
                        </h2>
                      </Link>
                      
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {blog.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <User size={14} />
                          <span>{blog.author}</span>
                        </div>
                        
                        <Link 
                          to={`/blog/${blog.slug.current}`}
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          Read More
                        </Link>
                      </div>
                      
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          {blog.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="inline-flex items-center gap-1 text-xs text-gray-500">
                              <Tag size={10} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {filteredBlogs?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No blog posts found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default Blog