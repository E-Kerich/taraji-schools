import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { ArrowLeft, Save, Loader } from 'lucide-react';

const EditUpdate = () => {
  const { id } = useParams();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpdate();
  }, [id]);

  const fetchUpdate = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/campus-updates/${id}`);
      reset(res.data.data);
    } catch (error) {
      console.error('Error fetching update:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await api.put(`/campus-updates/${id}`, data);
      navigate('/admin/campus-updates');
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Loading update...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/campus-updates')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Updates
        </button>
        <h1 className="text-2xl font-light text-gray-900">Edit Update</h1>
        <p className="text-gray-600 mt-2">Modify the campus update details</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-100 p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Title
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Content
            </label>
            <textarea
              {...register('content', { required: 'Content is required' })}
              rows={8}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
            />
            {errors.content && (
              <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
            )}
          </div>

          {/* Campus & Type */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Campus
              </label>
              <select
                {...register('campus', { required: 'Please select a campus' })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
              >
                <option value="westlands">Westlands Campus</option>
                <option value="redhill">Redhill Campus</option>
              </select>
              {errors.campus && (
                <p className="text-sm text-red-600 mt-1">{errors.campus.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Type
              </label>
              <select
                {...register('type', { required: 'Please select a type' })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
              >
                <option value="news">News</option>
                <option value="event">Event</option>
                <option value="announcement">Announcement</option>
                <option value="achievement">Achievement</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Summary
            </label>
            <textarea
              {...register('summary')}
              placeholder="Brief summary for listing pages..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Options */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register('isPinned')}
                id="isPinned"
                className="w-4 h-4 text-red-600 border-gray-300 rounded"
              />
              <label htmlFor="isPinned" className="text-gray-700">
                Pin this update
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register('published')}
                id="published"
                className="w-4 h-4 text-red-600 border-gray-300 rounded"
              />
              <label htmlFor="published" className="text-gray-700">
                Published
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/campus-updates')}
            className="px-6 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg 
                     hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUpdate;