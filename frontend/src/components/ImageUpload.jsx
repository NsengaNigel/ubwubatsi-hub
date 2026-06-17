import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024;

export default function ImageUpload({
  label,
  multiple = false,
  maxFiles = 1,
  uploadUrl,
  fieldName,
  onUpload,
  existingImages = [],
  onDelete,
  deleteUrl,
}) {
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const validate = (files) => {
    for (const f of files) {
      if (!ALLOWED_TYPES.includes(f.type)) return 'Only JPG, PNG, and WebP images are allowed';
      if (f.size > MAX_BYTES) return 'Each image must be under 5MB';
    }
    return null;
  };

  const handleChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setError('');

    const validationError = validate(files);
    if (validationError) { setError(validationError); return; }

    if (multiple && existingImages.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed`);
      return;
    }

    setPreviews(files.map(f => URL.createObjectURL(f)));
    setUploading(true);

    const form = new FormData();
    if (multiple) {
      files.forEach(f => form.append(fieldName, f));
    } else {
      form.append(fieldName, files[0]);
    }

    try {
      const { data } = await api.post(uploadUrl, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPreviews([]);
      if (onUpload) onUpload(data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed';
      setError(msg);
      setPreviews([]);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDelete = async (url) => {
    const confirmed = window.confirm('Delete this image? This cannot be undone.');
    if (!confirmed) return;

    if (onDelete) {
      await onDelete(url);
    } else if (deleteUrl) {
      try {
        await api.delete(deleteUrl, { data: { imageUrl: url } });
        toast.success('Image deleted');
      } catch {
        toast.error('Failed to delete image');
      }
    }
  };

  const canAddMore = multiple
    ? existingImages.length < maxFiles
    : existingImages.length === 0 && previews.length === 0;

  return (
    <div className="flex flex-col gap-3">
      {label && <label className="text-sm font-medium text-[#1e1b18]">{label}</label>}

      {existingImages.length > 0 && (
        <div className={`grid gap-3 ${multiple ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
          {existingImages.map((src, i) => (
            <div key={i} className={`relative group ${!multiple ? 'w-24 h-24' : ''}`}>
              <img
                src={src}
                alt={`Image ${i + 1}`}
                className={`object-cover rounded-xl ${multiple ? 'w-full h-36' : 'w-24 h-24 rounded-full'}`}
              />
              {(onDelete || deleteUrl) && (
                <button
                  type="button"
                  onClick={() => handleDelete(src)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-[#ba1a1a] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {previews.length > 0 && (
        <div className={`grid gap-3 ${multiple ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
          {previews.map((src, i) => (
            <div key={i} className="relative">
              <img
                src={src}
                alt={`Preview ${i + 1}`}
                className={`object-cover rounded-xl opacity-60 ${multiple ? 'w-full h-36' : 'w-24 h-24 rounded-full'}`}
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {canAddMore && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full py-6 border-2 border-dashed border-[#dcc1b5] rounded-xl flex flex-col items-center gap-2 hover:border-[#99420d] hover:text-[#99420d] transition-colors disabled:opacity-50 text-[#56433a]"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
            {multiple ? 'add_photo_alternate' : 'photo_camera'}
          </span>
          <span className="text-sm font-medium">
            {uploading
              ? 'Uploading...'
              : multiple
                ? `Add Photos (${maxFiles - existingImages.length} remaining)`
                : 'Upload Photo'}
          </span>
          <span className="text-xs text-[#56433a]">JPG, PNG or WebP · max 5MB</span>
        </button>
      )}

      {error && <p className="text-xs text-[#ba1a1a]">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
