import React from 'react';

const PlanSelectionModal = ({ plan, onClose, onDiscussWithAdmin, onProceedPayment }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900">Select Plan: {plan.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <p className="text-xl font-semibold text-indigo-600 mb-2">₹{plan.price}</p>
          <p className="text-gray-600">{plan.description}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onDiscussWithAdmin}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
          >
            Discuss with Admin
          </button>
          <button
            onClick={onProceedPayment}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
          >
            Proceed with Payment
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionModal;

