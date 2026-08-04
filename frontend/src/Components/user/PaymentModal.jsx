import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, limit } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';

const PaymentModal = ({ plan, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const [paymentInfo, setPaymentInfo] = useState({
    qrCode: '',
    upiId: '',
    bankDetails: ''
  });
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPaymentInfo();
  }, []);

  const fetchPaymentInfo = async () => {
    try {
      const paymentInfoRef = collection(db, 'paymentInfo');
      const q = query(paymentInfoRef, limit(1));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        
        // Get QR code URL from storage
        if (data.qrCodePath) {
          const qrCodeRef = ref(storage, data.qrCodePath);
          const qrCodeUrl = await getDownloadURL(qrCodeRef);
          setPaymentInfo({
            qrCode: qrCodeUrl,
            upiId: data.upiId || '',
            bankDetails: data.bankDetails || ''
          });
        } else {
          setPaymentInfo({
            qrCode: '',
            upiId: data.upiId || '',
            bankDetails: data.bankDetails || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching payment info:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!transactionId.trim()) {
      setError('Please enter transaction ID');
      return;
    }

    setLoading(true);

    try {
      // Create payment record
      await addDoc(collection(db, 'payments'), {
        userId: currentUser.uid,
        planId: plan.id,
        planName: plan.name,
        planPrice: plan.price,
        transactionId: transactionId.trim(),
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // Create project record
      await addDoc(collection(db, 'projects'), {
        userId: currentUser.uid,
        planId: plan.id,
        planName: plan.name,
        planPrice: plan.price,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      onSuccess();
    } catch (error) {
      setError('Error submitting payment: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Payment Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Plan: {plan.name}</h4>
          <p className="text-xl font-bold text-indigo-600">Amount: ₹{plan.price}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {paymentInfo.qrCode && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">QR Code</h4>
              <img src={paymentInfo.qrCode} alt="QR Code" className="w-full max-w-xs border rounded" />
            </div>
          )}
          
          <div className="space-y-4">
            {paymentInfo.upiId && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">UPI ID</h4>
                <p className="text-lg text-gray-700 bg-white p-3 rounded border">{paymentInfo.upiId}</p>
              </div>
            )}
            
            {paymentInfo.bankDetails && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Bank Details</h4>
                <div className="text-sm text-gray-700 bg-white p-3 rounded border whitespace-pre-line">
                  {paymentInfo.bankDetails}
                </div>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-2">
              Transaction ID *
            </label>
            <input
              type="text"
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your transaction ID"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Payment'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;

