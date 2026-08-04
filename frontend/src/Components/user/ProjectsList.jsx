import React, { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

const ProjectsList = ({ projects, onRefresh }) => {
  const { currentUser } = useAuth();
  const [selectedProject, setSelectedProject] = useState(null);
  const [review, setReview] = useState({ written: '', video: null });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        setError('Video file size must be less than 100MB');
        return;
      }
      setReview({ ...review, video: file });
    }
  };

  const handleCompleteProject = async () => {
    if (!review.written.trim()) {
      setError('Please provide a written review');
      return;
    }

    if (!review.video) {
      setError('Please upload a video review');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Upload video to Firebase Storage
      const videoRef = ref(storage, `reviews/${selectedProject.id}/${Date.now()}_${review.video.name}`);
      await uploadBytes(videoRef, review.video);
      const videoUrl = await getDownloadURL(videoRef);

      // Save review
      const reviewData = {
        projectId: selectedProject.id,
        userId: currentUser.uid,
        writtenReview: review.written,
        videoReviewUrl: videoUrl,
        createdAt: serverTimestamp()
      };

      await import('firebase/firestore').then(({ collection, addDoc }) =>
        addDoc(collection(db, 'reviews'), reviewData)
      );

      // Update project status
      await updateDoc(doc(db, 'projects', selectedProject.id), {
        status: 'completed',
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setSelectedProject(null);
      setReview({ written: '', video: null });
      onRefresh();
    } catch (error) {
      setError('Error completing project: ' + error.message);
    }

    setUploading(false);
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">No projects yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{project.planName}</h3>
              {getStatusBadge(project.status)}
            </div>
            {project.createdAt && (
              <span className="text-sm text-gray-500">
                {format(project.createdAt.toDate(), 'MMM dd, yyyy')}
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-2">
            <span className="font-medium">Amount:</span> ₹{project.planPrice}
          </p>

          {project.status === 'processing' && project.deliverables && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-900 mb-2">Project Deliverables:</p>
              <div className="space-y-2">
                {project.deliverables.map((deliverable, index) => (
                  <a
                    key={index}
                    href={deliverable.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-700 hover:underline"
                  >
                    {deliverable.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {project.status === 'processing' && (
            <button
              onClick={() => setSelectedProject(project)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Complete Project
            </button>
          )}
        </div>
      ))}

      {/* Complete Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Complete Project</h3>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Written Review *
                </label>
                <textarea
                  value={review.written}
                  onChange={(e) => setReview({ ...review, written: e.target.value })}
                  rows={5}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Please provide your review..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Review *
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                {review.video && (
                  <p className="mt-2 text-sm text-gray-600">Selected: {review.video.name}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCompleteProject}
                disabled={uploading}
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Submit & Complete'}
              </button>
              <button
                onClick={() => {
                  setSelectedProject(null);
                  setReview({ written: '', video: null });
                  setError('');
                }}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;

