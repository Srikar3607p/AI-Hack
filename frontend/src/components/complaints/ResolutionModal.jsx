import React, { useState } from 'react';
import { Upload, Sparkles, CheckCircle, Image, FileText, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { complaintService } from '../../services/complaintService';

export const ResolutionModal = ({ isOpen, onClose, complaint, onResolvedSuccess }) => {
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [afterImages, setAfterImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!complaint) return null;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setAfterImages(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resolutionNotes || resolutionNotes.trim().length < 10) {
      setError('Please provide detailed field resolution notes (minimum 10 characters).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resolutionNotes', resolutionNotes);
      afterImages.forEach(file => {
        formData.append('afterImages', file);
      });

      const res = await complaintService.submitResolution(complaint._id || complaint.complaintId, formData);
      if (res.success) {
        onResolvedSuccess(res.complaint);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit resolution. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Submit Resolution for ${complaint.complaintId}`}
      subtitle="Provide field work documentation. The AI Resolution Agent will verify evidence and craft a citizen explanation."
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Complaint Context Banner */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
          <p className="font-semibold text-slate-800 dark:text-slate-200">{complaint.title}</p>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 line-clamp-2">
            "{complaint.description}"
          </p>
        </div>

        {/* Resolution Notes Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Work Resolution Notes & Technical Actions Taken *
          </label>
          <textarea
            rows={4}
            required
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            placeholder="Describe actions taken (e.g. Replaced 90W LED driver unit on pole #JAY-402, tested voltage and verified illumination across residential corridor)..."
            className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-civic-500 focus:outline-none"
          />
        </div>

        {/* After Images Upload */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Resolution Proof Images (After Photos)
          </label>
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Upload completed work photos to assist AI visual verification
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-civic-50 file:text-civic-700 dark:file:bg-civic-900 dark:file:text-civic-300"
            />
          </div>

          {/* Previews */}
          {imagePreviews.length > 0 && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
              {imagePreviews.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  className="w-16 h-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                />
              ))}
            </div>
          )}
        </div>

        {/* AI Agent Notice */}
        <div className="p-3 bg-gradient-to-r from-civic-50 to-indigo-50 dark:from-civic-950/60 dark:to-indigo-950/60 rounded-xl border border-civic-100 dark:border-civic-900 flex items-center gap-2 text-xs text-civic-800 dark:text-civic-300">
          <Sparkles className="w-4 h-4 text-civic-600 shrink-0" />
          <span>
            Upon submission, the AI Resolution Agent will automatically verify completion logs and formulate a transparent, human-readable update for the citizen.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="success"
            size="sm"
            isLoading={loading}
            icon={CheckCircle}
          >
            Submit & Verify Resolution
          </Button>
        </div>
      </form>
    </Modal>
  );
};
