import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Upload,
  Image,
  MapPin,
  Send,
  AlertCircle,
  FileText,
  Brain,
  HelpCircle,
  CheckCircle
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import { Button } from '../../components/common/Button';
import { VoiceRecorder } from '../../components/complaints/VoiceRecorder';
import { LocationPicker } from '../../components/maps/LocationPicker';

export const SubmitComplaint = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [location, setLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    address: 'Bengaluru Civic Region',
    ward: 'Ward 12'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert('You can upload a maximum of 5 images per complaint.');
      return;
    }
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleVoiceTranscription = (transcript) => {
    setVoiceTranscript(transcript);
    setDescription(prev => (prev ? `${prev} ${transcript}` : transcript));
    if (!title && transcript.length > 5) {
      setTitle(transcript.slice(0, 50));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || description.trim().length < 5) {
      setError('Please provide a detailed description of the problem (at least 5 characters).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title || description.slice(0, 45));
      formData.append('description', description);
      formData.append('voiceTranscript', voiceTranscript);
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      formData.append('address', location.address);
      formData.append('ward', location.ward);

      images.forEach((file) => {
        formData.append('images', file);
      });

      const res = await complaintService.submitComplaint(formData);
      if (res.success && res.complaint) {
        navigate(`/citizen/complaints/${res.complaint._id || res.complaint.complaintId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Please check your network.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-civic-600 dark:text-civic-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Citizen Reporting</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Report a Civic Problem
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Describe the problem via voice or text. The AI Orchestrator will automatically classify the category, compute explainable priority, check duplicate complaints, and route to the correct municipal team.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Voice Dictation Component */}
      <VoiceRecorder onTranscriptionComplete={handleVoiceTranscription} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Card: Details & Photos */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Complaint Title (Optional &ndash; AI will generate if blank)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep pothole hazard near university gate"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-civic-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Description of the Issue *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what is wrong, how long it has been there, safety risks, or landmarks (e.g. 'Large pothole on main road causing bikes to swerve into oncoming traffic...')"
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-civic-500 focus:outline-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Attach Photos (Optional &ndash; Helps AI vision verification)
            </label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <Upload className="w-7 h-7 text-slate-400 mx-auto mb-1.5" />
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Click or drag photos of the problem
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">JPEG, PNG, WEBP up to 10MB (max 5 photos)</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="mt-3 text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-civic-100 file:text-civic-700 dark:file:bg-civic-900 dark:file:text-civic-300 cursor-pointer"
              />
            </div>

            {/* Previews */}
            {imagePreviews.length > 0 && (
              <div className="flex items-center gap-3 mt-3 overflow-x-auto pb-1">
                {imagePreviews.map((url, idx) => (
                  <div key={idx} className="relative group shrink-0">
                    <img
                      src={url}
                      alt={`Upload ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-90 group-hover:opacity-100 shadow-sm"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Location Picker */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <LocationPicker
            latitude={location.latitude}
            longitude={location.longitude}
            address={location.address}
            ward={location.ward}
            onChange={(loc) => setLocation(loc)}
          />
        </div>

        {/* AI Agent Guarantee Notice */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-civic-50 via-indigo-50 to-purple-50 dark:from-civic-950/60 dark:via-indigo-950/60 dark:to-purple-950/60 border border-civic-200 dark:border-civic-800/80 flex items-start gap-3">
          <Brain className="w-5 h-5 text-civic-600 dark:text-civic-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 dark:text-slate-300">
            <span className="font-bold text-civic-700 dark:text-civic-300">Explainable AI Promise:</span> No manual category guesswork required. The platform immediately calculates urgency, assigns SLA deadlines, and establishes a cryptographic timeline for municipal accountability.
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/citizen/dashboard')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            icon={Send}
            className="px-8 shadow-lg shadow-civic-600/30"
          >
            {isSubmitting ? 'AI Agents Analyzing & Submitting...' : 'Submit Grievance'}
          </Button>
        </div>
      </form>
    </div>
  );
};
