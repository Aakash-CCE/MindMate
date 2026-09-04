import React from 'react';
import { X, Phone, MessageSquare, HeartHandshake, ExternalLink, ShieldAlert } from 'lucide-react';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="crisis-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="crisis-modal-container"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-rose-50/80 px-6 py-4 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-700">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <h3 className="font-semibold text-lg text-slate-800">Support & Crisis Resources</h3>
          </div>
          <button
            id="close-crisis-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-rose-100/50 transition-colors"
            aria-label="Close crisis resources modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="bg-rose-50/60 border border-rose-200/70 rounded-xl p-4 text-sm text-rose-900 leading-relaxed">
            <p className="font-medium mb-1">You are not alone.</p>
            <p className="text-rose-800/90">
              MindMate is an AI companion for emotional reflection and cannot provide medical care or handle emergencies. If you are experiencing intense distress, thoughts of self-harm, or an emergency, free and confidential help is available 24/7.
            </p>
          </div>

          <div className="space-y-3">
            {/* 988 */}
            <div className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl flex items-start gap-3 transition-colors">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-lg shrink-0 mt-0.5">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800">988 Suicide & Crisis Lifeline</h4>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full">US & Canada</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">Free, confidential 24/7 call or text support.</p>
                <div className="mt-2 flex gap-3 text-sm font-semibold">
                  <a
                    href="tel:988"
                    className="inline-flex items-center text-rose-700 hover:text-rose-800 underline underline-offset-2"
                  >
                    Call 988
                  </a>
                  <span className="text-slate-300">|</span>
                  <a
                    href="sms:988"
                    className="inline-flex items-center text-rose-700 hover:text-rose-800 underline underline-offset-2"
                  >
                    Text 988
                  </a>
                </div>
              </div>
            </div>

            {/* Crisis Text Line */}
            <div className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl flex items-start gap-3 transition-colors">
              <div className="p-2 bg-teal-100 text-teal-700 rounded-lg shrink-0 mt-0.5">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800">Crisis Text Line</h4>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full">US & UK</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">Connect with a volunteer crisis counselor via SMS.</p>
                <div className="mt-2 text-sm font-semibold text-teal-800">
                  Text <span className="font-bold underline">HOME to 741741</span>
                </div>
              </div>
            </div>

            {/* The Trevor Project */}
            <div className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl flex items-start gap-3 transition-colors">
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg shrink-0 mt-0.5">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800">The Trevor Project</h4>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">LGBTQ+ Youth</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">24/7 crisis intervention and suicide prevention.</p>
                <div className="mt-2 text-sm font-semibold">
                  <a
                    href="tel:18664887386"
                    className="text-indigo-700 hover:text-indigo-800 underline underline-offset-2"
                  >
                    1-866-488-7386
                  </a>
                </div>
              </div>
            </div>

            {/* Global Directory */}
            <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl flex items-center justify-between text-xs text-amber-900">
              <div>
                <p className="font-semibold text-slate-800">Outside the US or Canada?</p>
                <p className="text-slate-600">Find free helplines across 130+ countries worldwide.</p>
              </div>
              <a
                href="https://findahelpline.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-800 bg-white border border-teal-200 px-3 py-1.5 rounded-lg shrink-0"
              >
                findahelpline.com
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              id="crisis-modal-understood-btn"
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold rounded-xl transition-colors"
            >
              Return to MindMate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
