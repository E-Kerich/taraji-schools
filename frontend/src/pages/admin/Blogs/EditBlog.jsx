import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import RichTextEditor from '../../../components/admin/RichText';
import { 
  ArrowLeft, 
  Save, 
  Calendar, 
  Eye, 
  Hash, 
  Building, 
  Loader, 
  Trash2, 
  Image as ImageIcon,
  Upload,
  X,
  AlertCircle,
  EyeOff,
  CheckCircle,
  Clock,
  BarChart3,
  Tag,
  Users,
  FileText
} from 'lucide-react';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  
  const [form, setForm] = useState({
    title: '',
    slug: '',
    campus: 'all',
    status: 'draft',
    content: '',
    excerpt: '',
    featuredImage: '',
    author: '',
    category: '',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [blogStats, setBlogStats] = useState({
    views: 0,
    createdAt: '',
    updatedAt: ''
  });

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/blogs/${id}`);
      const blog = res.data.data;
      
      setForm({
        title: blog.title || '',
        slug: blog.slug || '',
        campus: blog.campus || 'all',
        status: blog.status || 'draft',
        content: blog.content || '',
        excerpt: blog.excerpt || '',
        featuredImage: blog.featuredImage || '',
        author: blog.author || '',
        category: blog.category || '',
        tags: blog.tags || []
      });
      
      setBlogStats({
        views: blog.views || 0,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt
      });
    } catch (error) {
      console.error('Error fetching blog:', error);
      alert('Failed to load blog post');
      navigate('/admin/blogs');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset error
    setImageError('');
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setImageError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm(prev => ({
        ...prev,
        featuredImage: e.target.result // Temporary base64 preview
      }));
    };
    reader.readAsDataURL(file);

    // Upload image
    await uploadImage(file);
  };

  const uploadImage = async (file) => {
    setUploadingImage(true);
    setImageError('');
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/uploads/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update form with uploaded image URL
      setForm(prev => ({
        ...prev,
        featuredImage: res.data.data.url || res.data.url
      }));
      
      return res.data.data.url || res.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      setImageError(error.response?.data?.message || 'Failed to upload image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setForm(prev => ({ ...prev, featuredImage: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!form.content.trim()) {
      alert('Please add content to the blog post');
      return;
    }

    try {
      setSaving(true);
      
      // Clean up data before sending
      const blogData = {
        ...form,
        slug: form.slug || generateSlug(form.title),
        excerpt: form.excerpt?.trim() || '',
        author: form.author?.trim() || 'Admin',
        category: form.category || 'General'
      };
      
      await api.put(`/blogs/${id}`, blogData);
      navigate('/admin/blogs');
    } catch (error) {
      console.error('Error updating blog:', error);
      alert(error.response?.data?.message || 'Failed to update blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/blogs/${id}`);
      navigate('/admin/blogs');
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog post');
    }
  };

  const handlePreview = () => {
    if (form.status === 'published' && form.slug) {
      window.open(`/blog/${form.slug}`, '_blank');
    } else {
      alert('Blog must be published to preview');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setSaving(true);
      await api.put(`/blogs/${id}`, { status: newStatus });
      setForm(prev => ({ ...prev, status: newStatus }));
      alert(`Blog ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  const categories = ['General', 'Education', 'Student Life', 'Events', 'Academic', 'Community', 'Sports', 'Technology'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/blogs')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Blogs</span>
        </button>
        
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light text-gray-900">Edit Blog Post</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Update and manage the blog article</p>
            
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Created: {formatDate(blogStats.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Updated: {formatDate(blogStats.updatedAt)}</span>
              </div>
              {blogStats.views > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <BarChart3 className="w-4 h-4" />
                  <span>{blogStats.views.toLocaleString()} views</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePreview}
              disabled={form.status !== 'published'}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Slug Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Title *
                </label>
                <input
                  value={form.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  URL Slug
                </label>
                <div className="flex items-center">
                  <div className="text-sm text-gray-500 px-3 py-2 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">
                    /blog/
                  </div>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
                    className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Content Editor Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-900">
                  Content *
                </label>
                <span className="text-xs text-gray-500">
                  {form.content.replace(/<[^>]*>/g, '').length} characters
                </span>
              </div>
              <RichTextEditor
                value={form.content}
                onChange={(html) => setForm(prev => ({ ...prev, content: html }))}
              />
            </div>

            {/* Excerpt Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Excerpt
              </label>
              <p className="text-sm text-gray-600 mb-4">
                A short summary of your post that will appear in blog listings.
              </p>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Write a brief summary..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                maxLength={300}
              />
              <div className="text-xs text-gray-500 mt-2 text-right">
                {form.excerpt.length}/300 characters
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Publish Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Publish</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Status
                  </label>
                  <div className="flex flex-col gap-2">
                    <select
                      value={form.status}
                      onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                    
                    <div className="flex gap-2">
                      {form.status === 'draft' && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange('published')}
                          className="flex-1 px-3 py-2 text-sm bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Publish Now
                        </button>
                      )}
                      {form.status === 'published' && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange('draft')}
                          className="flex-1 px-3 py-2 text-sm bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <EyeOff className="w-4 h-4" />
                          Unpublish
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {form.status === 'scheduled' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Schedule for
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-4">
                    Update your blog post
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={saving || uploadingImage}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg 
                               hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      {saving ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Update
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Image</h3>
              
              {/* File Input (Hidden) */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
              
              {form.featuredImage ? (
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src={form.featuredImage} 
                      alt="Featured" 
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors"
                    >
                      Replace
                    </button>
                    {uploadingImage && (
                      <div className="text-sm text-gray-600 flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent mr-2"></div>
                        Uploading...
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div 
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <div className="flex flex-col items-center gap-3">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-700">Upload featured image</p>
                      <p className="text-xs text-gray-500 mt-1">JPEG, PNG, GIF, WebP (max 5MB)</p>
                    </div>
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="mt-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors"
                    >
                      Select Image
                    </button>
                  </div>
                </div>
              )}
              
              {imageError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {imageError}
                  </div>
                </div>
              )}
              
              {/* Image URL Input */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Or use image URL:</p>
                <input
                  value={form.featuredImage}
                  onChange={(e) => setForm(prev => ({ ...prev, featuredImage: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categories & Tags Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Campus
                </label>
                <select
                  value={form.campus}
                  onChange={(e) => setForm(prev => ({ ...prev, campus: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Campuses</option>
                  <option value="westlands">Westlands Campus</option>
                  <option value="redhill">Redhill Campus</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a tag"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Author
                </label>
                <input
                  value={form.author}
                  onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Author name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Last saved: {formatDate(blogStats.updatedAt)}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/blogs')}
              className="px-6 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="px-6 py-3 bg-red-600 text-white rounded-lg 
                       hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Blog Post
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;