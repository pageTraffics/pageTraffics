import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const PlansSection = ({ plans, onPlanSelect }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [servicePlans, setServicePlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleServiceClick = async (serviceId) => {
    setLoading(true);
    try {
      const plansRef = collection(db, 'plans');
      const q = query(plansRef, where('serviceId', '==', serviceId), where('isActive', '==', true));
      const snapshot = await getDocs(q);
      const plansData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServicePlans(plansData);
      setSelectedService(serviceId);
    } catch (error) {
      console.error('Error fetching service plans:', error);
    }
    setLoading(false);
  };

  const handlePlanClick = (plan) => {
    onPlanSelect(plan);
  };

  // Group plans by service
  const servicesMap = {};
  plans.forEach(plan => {
    if (!servicesMap[plan.serviceId]) {
      servicesMap[plan.serviceId] = {
        serviceId: plan.serviceId,
        serviceName: plan.serviceName,
        plans: []
      };
    }
    servicesMap[plan.serviceId].plans.push(plan);
  });

  const services = Object.values(servicesMap);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Prebuilt Plans</h2>
        <p className="text-gray-600">Select a service to view available plans</p>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No plans available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.serviceId}
              onClick={() => handleServiceClick(service.serviceId)}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-indigo-500"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.serviceName}</h3>
              <p className="text-gray-600 mb-4">{service.plans.length} plan(s) available</p>
              <button className="text-indigo-600 font-medium hover:text-indigo-700">
                View Plans →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Plans Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {servicesMap[selectedService]?.serviceName} - Plans
              </h3>
              <button
                onClick={() => setSelectedService(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading plans...</div>
            ) : servicePlans.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No plans available for this service.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {servicePlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="border-2 border-gray-200 rounded-lg p-6 hover:border-indigo-500 transition-colors cursor-pointer"
                    onClick={() => {
                      handlePlanClick(plan);
                      setSelectedService(null);
                    }}
                  >
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h4>
                    <p className="text-2xl font-bold text-indigo-600 mb-2">₹{plan.price}</p>
                    <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                    <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                      Select Plan
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansSection;

