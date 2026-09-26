import React, { useState } from 'react';
import api from '../../services/api';
import { UploadCloud, Loader2, X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ value, onChange, label = 'Project Thumbnail' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onChange(response.data.data.url);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setError('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted">
        {label}
      </label>

      {value ? (
        <div className="relative rounded-xl border border-light-border dark:border-dark-border overflow-hidden group max-w-sm">
          <img
            src={value}
            alt="Uploaded preview"
            className="w-full h-44 object-cover rounded-xl"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-white hover:bg-red-600 transition-colors cursor-pointer"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-light-border dark:border-dark-border hover:border-primary/50 rounded-xl cursor-pointer bg-light-bg/50 dark:bg-dark-bg/40 transition-all">
          <div className="flex flex-col items-center justify-center text-center">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
            ) : (
              <UploadCloud className="w-8 h-8 text-light-muted dark:text-dark-muted mb-2 group-hover:text-primary" />
            )}
            <p className="text-xs font-medium text-light-text dark:text-dark-text">
              {uploading ? 'Uploading to storage...' : 'Click or drag image to upload'}
            </p>
            <p className="text-[10px] text-light-muted dark:text-dark-muted mt-1">
              Supports JPEG, PNG, WEBP (Max 5MB)
            </p>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default ImageUpload;