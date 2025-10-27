/* eslint-disable */
'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { apiClientUser } from '@/lib/interceptor'
import { toast } from 'sonner'

interface AddOnService {
  _id: string
  name: string
  category: string
  description: string
  amount: number
  billing_cycle: string
  billing_type: string
}

interface PromoteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  onPromoteSuccess?: (data: any) => void;
}

export function PromoteProductModal({ isOpen, onClose, productId, onPromoteSuccess }: PromoteProductModalProps) {
  const [services, setServices] = useState<AddOnService[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedService, setSelectedService] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchAddOnServices()
    }
  }, [isOpen])

  const fetchAddOnServices = async () => {
    try {
      setLoading(true)
      const res = await apiClientUser.get('/addonservices')
      // console.log("res", res)
      const data = res?.data?.addOnService|| []
      setServices(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching add-on services:', error)
      toast.error('Failed to load promotion options')
    } finally {
      setLoading(false)
    }
  }

  const handlePromote = async (serviceId: string) => {
    try {
      setLoading(true);
      setSelectedService(serviceId);
      
      // Call the API to apply the promotion
      const response = await apiClientUser.post(`/products/${productId}/promote`, {
        addOnServiceId: serviceId
      });
      
      toast.success('Product promoted successfully!');
      onClose();
      
      // Optional: Refresh the product data or trigger a callback if needed
      if (onPromoteSuccess) {
        onPromoteSuccess(response.data);
      }
    } catch (error: any) {
      console.error('Error promoting product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to promote product';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setSelectedService(null);
    }
  }

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedServiceData, setSelectedServiceData] = useState<AddOnService | null>(null);

  const handleServiceSelect = (service: AddOnService) => {
    setSelectedServiceData(service);
    setShowConfirmation(true);
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmPayment = async () => {
    if (!selectedServiceData || isProcessing) return;
    
    setIsProcessing(true);
    const toastId = toast.loading('Processing your payment...');
    
    try {
      const response = await apiClientUser.post(`/subscriptions/add-on/${selectedServiceData._id}`);
      console.log("response", response)
      if (response.data?.paymentPage) {
        toast.success('Redirecting to payment page...', { id: toastId });
        window.location.href = response.data.paymentPage;
      } else {
        toast.error('Payment URL not found', { id: toastId });
      }
    } catch (error: any) {
      console.error('Error initiating payment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to initiate payment';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsProcessing(false);
      if (!isProcessing) {
        setShowConfirmation(false);
        setSelectedServiceData(null);
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Promote Your Product</DialogTitle>
          <DialogDescription className="text-base">
            Select a promotion option to increase your product's visibility and reach more customers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1F058F]"></div>
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {services.map((service) => (
                <div
                  key={service._id}
                  className={`p-5 border rounded-xl transition-all hover:shadow-md ${selectedService === service._id ? 'border-[#1F058F] bg-[#1F058F]/5 ring-2 ring-[#1F058F]/20' : 'border-gray-200'}`}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{service.name}</h3>
                      <p className="text-gray-600 mt-2 text-sm">{service.description}</p>
                      <div className="mt-4">
                        <span className="text-2xl font-bold text-[#1F058F]">
                        ₦{service.amount.toFixed(2).toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">
                          / {service.billing_cycle}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleServiceSelect(service)}
                      className="mt-4 w-full bg-[#1F058F] hover:bg-[#2e0a94] text-white py-2 rounded-lg font-medium"
                    >
                      Select Plan
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-700">No Promotion Options Available</p>
              <p className="mt-1 text-gray-500">Please check back later for available promotions</p>
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Promotion</DialogTitle>
              <DialogDescription>
                You're about to purchase the <span className="font-semibold">{selectedServiceData?.name}</span> promotion.
                This will be charged to your account.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">{selectedServiceData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-[#1F058F]">
                ₦{selectedServiceData?.amount.toFixed(2).toLocaleString()} / {selectedServiceData?.billing_cycle}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#1F058F] hover:bg-[#2e0a94]"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Continue to Payment'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}
