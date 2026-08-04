import React from 'react';
import { format } from 'date-fns';

const MeetingsList = ({ meetings }) => {
  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (meetings.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">No meetings scheduled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <div key={meeting.id} className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Meeting Request</h3>
              {getStatusBadge(meeting.status)}
            </div>
            {meeting.createdAt && (
              <span className="text-sm text-gray-500">
                {format(meeting.createdAt.toDate(), 'MMM dd, yyyy')}
              </span>
            )}
          </div>

          {meeting.preferredDate && (
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Preferred Date:</span>{' '}
              {format(meeting.preferredDate.toDate(), 'MMM dd, yyyy')}
            </p>
          )}

          {meeting.preferredTime && (
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Preferred Time:</span> {meeting.preferredTime}
            </p>
          )}

          {meeting.message && (
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Message:</span> {meeting.message}
            </p>
          )}

          {meeting.status === 'accepted' && meeting.meetingUrl && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="font-medium text-green-900 mb-2">Meeting Accepted!</p>
              <p className="text-sm text-green-700 mb-2">
                <span className="font-medium">Meeting URL:</span>{' '}
                <a href={meeting.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  {meeting.meetingUrl}
                </a>
              </p>
              {meeting.adminMessage && (
                <p className="text-sm text-green-700">
                  <span className="font-medium">Admin Message:</span> {meeting.adminMessage}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MeetingsList;

