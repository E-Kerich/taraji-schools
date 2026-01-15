import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { Calendar, User, ArrowRight, Eye, Tag, Clock, Search, Filter } from 'lucide-react';

const BlogPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm, selectedCampus, selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blogs?status=published&sort=-createdAt');
      setBlogs(res.data.data);
      setFilteredBlogs(res.data.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = [...blogs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Campus filter
    if (selectedCampus !== 'all') {
      filtered = filtered.filter(blog => 
        blog.campus === selectedCampus || blog.campus === 'all'
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    setFilteredBlogs(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getReadTime = (content) => {
    const words = content?.split(' ').length || 0;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  // Clean HTML tags from text
  const stripHtmlTags = (html) => {
    if (!html) return '';
    
    // Create a temporary div element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Get text content and remove extra whitespace
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.replace(/\s+/g, ' ').trim();
  };

  // Truncate text and strip HTML
  const truncateText = (text, length = 100) => {
    if (!text) return '';
    
    // Strip HTML tags first
    const cleanText = stripHtmlTags(text);
    
    if (cleanText.length <= length) return cleanText;
    return cleanText.substring(0, length) + '...';
  };

  const categories = ['all', 'Education', 'Student Life', 'Events', 'Academic', 'Community'];
  const campuses = ['all', 'Westlands', 'Redhill'];

  // Split blogs into featured and regular
  const featuredBlog = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const otherBlogs = filteredBlogs.length > 1 ? filteredBlogs.slice(1) : [];

  return (
    <section className="py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-2 h-8 rounded-full bg-red-600" />
            <span className="text-sm font-semibold uppercase tracking-wider text-red-600">
              Insights & Updates
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Latest from <span className="text-red-600">Brookside</span>
          </h1>
          <p className="text-lg text-gray-600">
            Discover stories, news, and insights from our school community
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl 
                         focus:outline-none focus:border-gray-400 focus:shadow-sm transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-white border border-gray-300 rounded-xl 
                           focus:outline-none focus:border-gray-400 appearance-none"
                >
                  {campuses.map(campus => (
                    <option key={campus} value={campus.toLowerCase()}>
                      {campus === 'all' ? 'All Campuses' : campus}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl 
                           focus:outline-none focus:border-gray-400"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredBlogs.length}</span> of{' '}
              <span className="font-semibold">{blogs.length}</span> articles
            </p>
            {(searchTerm || selectedCampus !== 'all' || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCampus('all');
                  setSelectedCategory('all');
                }}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600">Loading articles...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCampus('all');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              View all articles
            </button>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredBlog && (
              <div className="mb-16">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="grid md:grid-cols-2">
                    {/* Image */}
                    <div className="relative h-64 md:h-auto">
                      {featuredBlog.coverImage ? (
                        <img
                          src={featuredBlog.coverImage}
                          alt={featuredBlog.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center">
                          <Tag className="w-16 h-16 text-red-200" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full">
                          Featured
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-10">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-full">
                          {featuredBlog.campus === 'all' ? 'Both Campuses' : featuredBlog.campus}
                        </span>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{formatDate(featuredBlog.createdAt)}</span>
                        </div>
                      </div>

                      <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">
                        {featuredBlog.title}
                      </h2>

                      <p className="text-gray-600 mb-6">
                        {truncateText(featuredBlog.excerpt || featuredBlog.content, 200)}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {featuredBlog.author && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{featuredBlog.author}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{getReadTime(featuredBlog.content)}</span>
                          </div>
                          {featuredBlog.views > 0 && (
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{featuredBlog.views} views</span>
                            </div>
                          )}
                        </div>

                        <Link
                          to={`/blog/${featuredBlog.slug}`}
                          className="group flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors"
                        >
                          Read full story
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grid Articles - Responsive Grid */}
            {otherBlogs.length > 0 && (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Recent Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherBlogs.map((blog) => (
                    <article
                      key={blog._id}
                      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg 
                               transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        {blog.coverImage ? (
                          <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                            <Tag className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium rounded">
                            {blog.campus === 'all' ? 'All' : blog.campus}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs">{formatDate(blog.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs">{getReadTime(blog.content)}</span>
                          </div>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 flex-shrink-0">
                          {blog.title}
                        </h2>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                          {truncateText(blog.excerpt || blog.content, 120)}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                          {blog.author && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-600">{blog.author}</span>
                            </div>
                          )}
                          
                          <Link
                            to={`/blog/${blog.slug}`}
                            className="group/link flex items-center gap-1 text-red-600 text-sm font-medium hover:text-red-700"
                          >
                            Read more
                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}

            {/* Load More (if you have pagination) */}
            {filteredBlogs.length > 9 && (
              <div className="text-center mt-12">
                <button className="px-8 py-3 bg-white border-2 border-red-600 text-red-600 
                                 rounded-lg font-semibold hover:bg-red-50 transition-colors">
                  Load More Articles
                </button>
              </div>
            )}
          </>
        )}
    </div>
    
        
        
      
    </section>
  );
};

export default BlogPage;