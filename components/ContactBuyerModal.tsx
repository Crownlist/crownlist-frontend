"use client"
import { X, Phone, Mail, MessageCircle, User } from "lucide-react"
import Image from "next/image"

interface ContactBuyerModalProps {
  request: {
    user: {
      fullName: string
      email: string
      profilePicture?: string
    }
    phone: string
  }
  onClose: () => void
}

export default function ContactBuyerModal({
  request,
  onClose,
}: ContactBuyerModalProps) {
  const { user, phone } = request

  const contactMethods = [
    {
      id: "call",
      name: "Call",
      icon: Phone,
      href: `tel:${phone}`,
      color: "text-green-600 hover:bg-green-50",
      bgColor: "bg-green-100"
    },
    {
      id: "email",
      name: "Send Mail",
      icon: Mail,
      href: `mailto:${user.email}`,
      color: "text-blue-600 hover:bg-blue-50",
      bgColor: "bg-blue-100"
    },
    {
      id: "sms",
      name: "Send SMS",
      icon: MessageCircle,
      href: `sms:${phone}`,
      color: "text-orange-600 hover:bg-orange-50",
      bgColor: "bg-orange-100"
    }
  ]

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
              {user.profilePicture ? (
                <Image
                  src={user.profilePicture}
                  alt={user.fullName}
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="w-5 h-5 absolute inset-0 m-auto text-gray-400" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold">Contact Buyer</h2>
              <p className="text-sm text-gray-600">{user.fullName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Buyer Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-700">Phone:</span>
              <span className="text-gray-900">{phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-700">Email:</span>
              <span className="text-gray-900">{user.email}</span>
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="space-y-3">
            {contactMethods.map((method) => {
              const Icon = method.icon
              return (
                <a
                  key={method.id}
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all ${method.color}`}
                >
                  <div className={`p-2 rounded-full ${method.bgColor}`}>
                    <Icon size={18} className={method.color.split(' ')[0]} />
                  </div>
                  <div>
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-gray-600">
                      {method.id === 'call' && `Call ${phone}`}
                      {method.id === 'email' && `Email ${user.email}`}
                      {method.id === 'sms' && `Message ${phone}`}
                    </p>
                  </div>
                </a>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
