/* eslint-disable react-hooks/exhaustive-deps */
"use client"

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { IoCloseSharp } from "react-icons/io5"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

const RequestLeaveModal = ({ onClose, children }) => {
  const modalRef = useRef(null)
  const contentRef = useRef(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = "hidden"

    window.addEventListener("keydown", handleEscKey)

    return () => {
      document.body.style.overflow = originalStyle
      window.removeEventListener("keydown", handleEscKey)
    }
  }, [onClose])
  const handleBackdropClick = (e) => {
    if (modalRef.current === e.target) {
      onClose()
    }
  }
  useEffect(() => {
    const focusableElements = contentRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    if (focusableElements?.length) {
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      const handleTabKey = (e) => {
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }

      // Focus first element when modal opens
      firstElement.focus()

      contentRef.current.addEventListener("keydown", handleTabKey)
      return () => {
        contentRef.current?.removeEventListener("keydown", handleTabKey)
      }
    }
  }, [])

  // Only render on client-side
  if (typeof window === "undefined") return null

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
      ref={modalRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`relative max-w-full md:w-[470px] lg:max-w-[984px] h-[800px] overflow-auto transition-all duration-300 ${
          mounted ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"
        }`}
        ref={contentRef}
      >
        <div className="bg-white shadow-xl dark:bg-[#12141D] rounded-xl overflow-hidden p-10">
          <div className="flex justify-end -mt-5 -mr-5">
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-white rounded-full cursor-pointer bg-[#A0A0A0] hover:bg-[#888888] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <IoCloseSharp size={25} width={24} height={24} className="p-1" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default RequestLeaveModal

