import React, { useState } from 'react';
import api from '../../services/api';
import { UploadCloud, Loader2, X, FileText, ExternalLink } from 'lucide-react';

const MediaUpload = ({ value, onChange, label = 'Upload Certificate Document / Image' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const isPdf = value && (value.toLowerCase().endsWith('.pdf') || value.includes('application/pdf'));

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
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
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
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
        {label} <span className="font-normal opacity-70">(Optional)</span>
      </label>

      {value ? (
        <div className="relative rounded-2xl border border-light-border dark:border-dark-border overflow-hidden bg-light-bg/50 dark:bg-dark-bg/60 p-3 max-w-sm">
          {isPdf ? (
            <div className="flex items-center gap-3 py-4 px-2">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate">PDF Credential Document</p>
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-primary hover:underline inline-flex items-center gap-1 mt-0.5"
                >
                  <span>Preview PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : (
            <div className="relative h-44 rounded-xl overflow-hidden group">
              <img
                src={value}
                alt="Certificate attachment preview"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-white hover:bg-red-600 transition-colors cursor-pointer"
            title="Remove media"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-light-border dark:border-dark-border hover:border-primary/50 rounded-2xl cursor-pointer bg-light-bg/30 dark:bg-dark-bg/40 transition-all">
          <div className="flex flex-col items-center justify-center text-center">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
            ) : (
              <UploadCloud className="w-8 h-8 text-light-muted dark:text-dark-muted mb-2 group-hover:text-primary transition-colors" />
            )}
            <p className="text-xs font-semibold text-light-text dark:text-dark-text">
              {uploading ? 'Processing file upload...' : 'Upload Certificate Image or PDF'}
            </p>
            <p className="text-[10px] text-light-muted dark:text-dark-muted mt-1">
              Supports JPEG, PNG, WEBP, and PDF documents (Max 5MB)
            </p>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg,application/pdf"
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

export default MediaUpload;