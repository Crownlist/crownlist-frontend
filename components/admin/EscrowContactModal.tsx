/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { X, Mail, Phone, MessageCircle, User } from "lucide-react";
import Image from "next/image";
import { EscrowPerson } from "@/types/escrow";

interface EscrowContactModalProps {
  open: boolean;
  seller: EscrowPerson | null;
  buyer: EscrowPerson | null;
  onClose: () => void;
}

export default function EscrowContactModal({
  open,
  seller,
  buyer,
  onClose,
}: EscrowContactModalProps) {
  if (!open || !seller || !buyer) return null;

  const contactMethods = (person: EscrowPerson) => {
    const methods: any[] = [
      {
        id: "email",
        name: "Send Email",
        icon: Mail,
        href: `mailto:${person.email}`,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        value: person.email,
      },
    ];

    if (person.phone) {
      methods.push(
        {
          id: "call",
          name: "Call",
          icon: Phone,
          href: `tel:${person.phone}`,
          color: "text-green-600",
          bgColor: "bg-green-100",
          value: person.phone,
        },
        {
          id: "sms",
          name: "Send SMS",
          icon: MessageCircle,
          href: `sms:${person.phone}`,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
          value: person.phone,
        }
      );
    }

    return methods;
  };

  const renderContactPerson = (person: EscrowPerson, title: string) => (
    <div className="space-y-4">
      {/* Header with profile */}
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-linear-to-br from-[#1F058F] to-purple-600 shrink-0 ring-2 ring-purple-100">
          {person.profilePicture ? (
            <Image
              src={person.profilePicture}
              alt={person.fullName}
              fill
              className="object-cover"
            />
          ) : (
            <User className="w-7 h-7 absolute inset-0 m-auto text-white" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-base">{title}</h3>
          <p className="text-sm text-gray-600">{person.fullName}</p>
        </div>
      </div>

      {/* Contact info */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600 font-medium">Email</p>
            <p className="text-sm text-gray-900 break-all">{person.email}</p>
          </div>
        </div>
        {person.phone && (
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600 font-medium">Phone</p>
              <p className="text-sm text-gray-900">{person.phone}</p>
            </div>
          </div>
        )}
      </div>

      {/* Contact buttons */}
      <div className="space-y-2">
        {contactMethods(person).map((method) => {
          const Icon = method.icon;
          return (
            <a
              key={method.id}
              href={method.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-md ${method.color}`}
            >
              <div className={`p-2 rounded-lg ${method.bgColor}`}>
                <Icon size={18} className={method.color} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{method.name}</p>
              </div>
              <span className="text-gray-400 text-lg">→</span>
            </a>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-9999 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-100 sticky top-0 bg-linear-to-r from-[#1F058F] to-purple-600">
          <h2 className="text-lg font-bold text-white">Contact Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {renderContactPerson(seller, "Seller")}
          <div className="border-t-2 border-gray-100"></div>
          {renderContactPerson(buyer, "Buyer")}
        </div>

        {/* Footer */}
        <div className="flex justify-center p-4 border-t-2 border-gray-100 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
