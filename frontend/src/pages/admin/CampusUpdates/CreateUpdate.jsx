import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { 
  ArrowLeft, 
  Save, 
  Calendar, 
  Building, 
  Tag, 
  Upload, 
  X, 
  Image as ImageIcon,
  Pin,
  Eye,
  EyeOff,
  AlertCircle,
  FileText,
  Clock,
  Link as LinkIcon,
  Megaphone,
  Award,
  Bell
} from 'lucide-react';

const CreateUpdate = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      campus: 'westlands',
      type: 'news',
      isPinned: false,
      published: true,
      featured: false,
      summary: ''
    }
  });
  
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [eventDate, setEventDate] = useState('');

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
      setPreviewImage(e.target.result);
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
      setValue('image', res.data.data.url || res.data.url);
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
    setPreviewImage(null);
    setValue('image', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data) => {
    try {
      // Add event date to data if it's an event
      if (data.type === 'event' && eventDate) {
        data.eventDate = eventDate;
      }

      await api.post('/campus-updates', data);
      navigate('/admin/campus-updates');
    } catch (error) {
      console.error('Error creating update:', error);
      alert(error.response?.data?.message || 'Failed to create update');
    }
  };

  const typeIcons = {
    news: <FileText className="w-4 h-4" />,
    event: <Calendar className="w-4 h-4" />,
    announcement: <Megaphone className="w-4 h-4" />,
    achievement: <Award className="w-4 h-4" />
  };

  const typeColors = {
    news: 'text-purple-700 bg-purple-50 border-purple-200',
    event: 'text-blue-700 bg-blue-50 border-blue-200',
    announcement: 'text-green-700 bg-green-50 border-green-200',
    achievement: 'text-orange-700 bg-orange-50 border-orange-200'
  };

  const typeDescriptions = {
    news: 'General news and information',
    event: 'Upcoming events and activities',
    announcement: 'Important announcements',
    achievement: 'Student or staff achievements'
  };

  const watchType = watch('type');
  const watchPublished = watch('published');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/campus-updates')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Updates</span>
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light text-gray-900">Create Campus Update</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Add news, events, or announcements</p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="px-2 py-1 bg-gray-100 rounded">Draft</span>
            {watchPublished && <span className="text-green-600">Will publish immediately</span>}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Title *
                </label>
                <input
                  {...register('title', { 
                    required: 'Title is required',
                    minLength: { value: 5, message: 'Title must be at least 5 characters' }
                  })}
                  placeholder="Enter update title"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                {errors.title && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title.message}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Content *
                </label>
                <textarea
                  {...register('content', { 
                    required: 'Content is required',
                    minLength: { value: 20, message: 'Content must be at least 20 characters' }
                  })}
                  placeholder="Write the update content here..."
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                />
                {errors.content && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errors.content.message}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  Provide detailed information about the update. Use clear and concise language.
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Summary
              </label>
              <p className="text-sm text-gray-600 mb-4">
                A brief summary that will appear in update listings.
              </p>
              <textarea
                {...register('summary', { maxLength: { value: 200, message: 'Summary must be less than 200 characters' } })}
                placeholder="Brief summary for listing pages..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                maxLength={200}
              />
              <div className="flex items-center justify-between mt-2">
                {errors.summary && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errors.summary.message}
                  </div>
                )}
                <div className="text-xs text-gray-500 ml-auto">
                  {watch('summary')?.length || 0}/200 characters
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Publish Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Publish</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {watchPublished ? (
                      <Eye className="w-5 h-5 text-green-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">Publish</p>
                      <p className="text-xs text-gray-500">
                        {watchPublished ? 'Will be visible immediately' : 'Save as draft'}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('published')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSubmitting || uploadingImage}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg 
                             hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {watchPublished ? 'Publish Update' : 'Save as Draft'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Type & Campus Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Type *
                </label>
                <select
                  {...register('type', { required: 'Please select a type' })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="news">News</option>
                  <option value="event">Event</option>
                  <option value="announcement">Announcement</option>
                  <option value="achievement">Achievement</option>
                </select>
                {errors.type && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errors.type.message}
                  </div>
                )}
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`p-1 rounded ${typeColors[watchType]}`}>
                      {typeIcons[watchType]}
                    </span>
                    <span className="text-sm font-medium capitalize">{watchType}</span>
                  </div>
                  <p className="text-xs text-gray-600">{typeDescriptions[watchType]}</p>
                </div>
              </div>

              {/* Event Date (only for event type) */}
              {watchType === 'event' && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Event Date
                  </label>
                  <input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Campus *
                </label>
                <select
                  {...register('campus', { required: 'Please select a campus' })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="westlands">Westlands Campus</option>
                  <option value="redhill">Redhill Campus</option>
                  <option value="all">All Campuses</option>
                </select>
                {errors.campus && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errors.campus.message}
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload Card */}
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
              
              {previewImage ? (
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src={previewImage} 
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
                  {...register('image')}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Options Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Options</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Pin className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Pin Update</p>
                      <p className="text-xs text-gray-500">Keep at top of listings</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('isPinned')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Featured</p>
                      <p className="text-xs text-gray-500">Highlight in featured section</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('featured')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            All required fields are marked with *
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/campus-updates')}
              className="px-6 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || uploadingImage}
              className="px-6 py-3 bg-red-600 text-white rounded-lg 
                       hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {watchPublished ? 'Publish Update' : 'Save as Draft'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateUpdate;