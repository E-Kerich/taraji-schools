import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../services/api';
import { Calendar, User, ArrowLeft, Clock, Eye, Share2, Bookmark, Tag, Facebook, Twitter, Linkedin, Mail, ExternalLink } from 'lucide-react';

const BlogDetails = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [toc, setToc] = useState([]);
  const [activeId, setActiveId] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/blogs/${slug}`)
      .then(res => {
        setBlog(res.data.data);
        setTimeout(() => {
          generateTableOfContents();
        }, 100);
        // Fetch related blogs after loading the current blog
        fetchRelatedBlogs(res.data.data);
      })
      .catch(() => setBlog(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const fetchRelatedBlogs = async (currentBlog) => {
    try {
      setLoadingRelated(true);
      const res = await api.get(`/blogs?status=published&limit=3&campus=${currentBlog.campus}&exclude=${currentBlog._id}`);
      setRelatedBlogs(res.data.data);
    } catch (error) {
      console.error('Error fetching related blogs:', error);
      setRelatedBlogs([]);
    } finally {
      setLoadingRelated(false);
    }
  };

  // Generate table of contents from headings
  const generateTableOfContents = () => {
    if (!contentRef.current) return;
    
    const headings = contentRef.current.querySelectorAll('h2, h3');
    const tocItems = [];
    
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }
      
      tocItems.push({
        id: heading.id,
        text: heading.textContent,
        level: heading.tagName.toLowerCase()
      });
    });
    
    setToc(tocItems);
  };

  // Intersection Observer for active TOC items
  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -70% 0%', threshold: 0.1 }
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadTime = (content) => {
    if (!content) return '0 min read';
    // Strip HTML and count words
    const text = content.replace(/<[^>]*>?/gm, '');
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const shareOnSocial = (platform) => {
    const url = window.location.href;
    const title = blog?.title || '';
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
    };

    if (platform === 'email') {
      window.location.href = shareUrls.email;
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const truncateText = (text, length = 100) => {
    if (!text) return '';
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    if (cleanText.length <= length) return cleanText;
    return cleanText.substring(0, length) + '...';
  };

  if (loading) {
    return (
      <section className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="py-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Article not found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been moved.</p>
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to all articles
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-red-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-red-600 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-gray-900 truncate max-w-xs">{blog.title}</span>
          </div>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Article Header */}
            <header className="mb-8 md:mb-12">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-full">
                  <Tag className="w-3 h-3" />
                  {blog.campus === 'all' ? 'Both Campuses' : blog.campus}
                </span>
                {blog.category && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                    {blog.category}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm md:text-base">{formatDate(blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm md:text-base">{getReadTime(blog.content)}</span>
                </div>
                {blog.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span className="text-sm md:text-base">By {blog.author}</span>
                  </div>
                )}
                {blog.views > 0 && (
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span className="text-sm md:text-base">{blog.views} views</span>
                  </div>
                )}
              </div>
            </header>

            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="mb-8 md:mb-12">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-lg"
                />
                {blog.imageCaption && (
                  <p className="text-center text-sm text-gray-500 italic mt-2">{blog.imageCaption}</p>
                )}
              </div>
            )}

            {/* Social Share - Mobile */}
            <div className="flex items-center justify-between py-4 border-y border-gray-200 mb-8 md:hidden">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => shareOnSocial('facebook')}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => shareOnSocial('twitter')}
                  className="text-gray-600 hover:text-blue-400 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => shareOnSocial('linkedin')}
                  className="text-gray-600 hover:text-blue-700 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => shareOnSocial('email')}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </button>
              </div>
              <button className="text-gray-600 hover:text-red-600 transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>

            {/* Article Content */}
            <div className="relative">
              {/* Social Share - Desktop */}
              <div className="hidden md:flex flex-col items-center gap-4 absolute -left-16 top-0">
                <span className="text-xs text-gray-500 uppercase tracking-wider -rotate-90 whitespace-nowrap mb-8">
                  Share
                </span>
                <button 
                  onClick={() => shareOnSocial('facebook')}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => shareOnSocial('twitter')}
                  className="text-gray-600 hover:text-blue-400 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => shareOnSocial('linkedin')}
                  className="text-gray-600 hover:text-blue-700 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => shareOnSocial('email')}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </button>
                <div className="h-8 w-px bg-gray-200"></div>
                <button className="text-gray-600 hover:text-red-600 transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>

              {/* Article Body */}
              <article
                ref={contentRef}
                className="prose prose-lg max-w-none
                  prose-headings:text-gray-900 prose-headings:font-bold
                  prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-6
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-4
                  prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900 prose-strong:font-bold
                  prose-ul:my-4 prose-li:my-1
                  prose-ol:my-4 prose-li:my-1
                  prose-blockquote:border-l-4 prose-blockquote:border-red-300 
                  prose-blockquote:bg-red-50 prose-blockquote:px-6 prose-blockquote:py-3
                  prose-blockquote:text-gray-700
                  prose-img:rounded-lg prose-img:shadow-md prose-img:my-8
                  prose-img:w-full prose-img:h-auto
                  prose-img:mx-auto
                  prose-table:w-full prose-table:my-8
                  prose-tr:border-b prose-tr:border-gray-200
                  prose-th:py-3 prose-th:px-4 prose-th:text-left prose-th:bg-gray-50
                  prose-td:py-3 prose-td:px-4
                  prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg
                  prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Blogs - Mobile & Desktop */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
              
              {loadingRelated ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent mb-2"></div>
                  <p className="text-gray-600">Loading related articles...</p>
                </div>
              ) : relatedBlogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedBlogs.map((relatedBlog) => (
                    <Link
                      key={relatedBlog._id}
                      to={`/blog/${relatedBlog.slug}`}
                      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      {relatedBlog.featuredImage && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={relatedBlog.featuredImage}
                            alt={relatedBlog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded">
                            {relatedBlog.campus === 'all' ? 'All' : relatedBlog.campus}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(relatedBlog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                          {relatedBlog.title}
                        </h4>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {truncateText(relatedBlog.excerpt || relatedBlog.content, 100)}
                        </p>
                        <div className="flex items-center gap-2 mt-4 text-red-600 text-sm font-medium">
                          Read more
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No related articles found.</p>
              )}
            </div>

            {/* Back to Blog */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link 
                to="/blog" 
                className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to all articles
              </Link>
            </div>
          </div>

          {/* Table of Contents - Desktop Only */}
          {toc.length > 0 && (
            <div className="hidden lg:block lg:w-1/4">
              <div className="sticky top-24">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {toc.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToHeading(item.id)}
                        className={`block w-full text-left py-2 px-3 rounded-lg transition-colors ${
                          activeId === item.id
                            ? 'bg-red-50 text-red-700 font-medium'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        } ${
                          item.level === 'h2' ? 'pl-3' :
                          item.level === 'h3' ? 'pl-6' : ''
                        }`}
                      >
                        {item.text}
                      </button>
                    ))}
                  </nav>
                  
                  {/* Estimated Reading Time */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{getReadTime(blog.content)}</span>
                    </div>
                  </div>
                </div>

                {/* Newsletter Signup */}
                <div className="mt-6 bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
                  <p className="text-red-100 text-sm mb-4">
                    Subscribe to get the latest articles and news directly in your inbox.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button className="w-full px-4 py-2 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;