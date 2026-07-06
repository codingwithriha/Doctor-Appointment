import React, { useState, useContext } from 'react'
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js'
import { AppContext } from '../context/AppContext'
import axios from 'axios'

const CheckoutForm = ({ onPaymentSuccess, onPaymentError, appointmentId }) => {
  const stripe = useStripe()
  const elements = useElements()
  const { backendUrl, token } = useContext(AppContext)

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setMessage('')

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message)
      } else {
        setMessage('An unexpected error occurred.')
      }
      onPaymentError(error.message)
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Confirm payment on backend
      try {
        const { data } = await axios.post(
          backendUrl + '/api/user/confirm-payment',
          {
            paymentIntentId: paymentIntent.id,
            appointmentId: appointmentId,
          },
          { headers: { token } }
        )

        if (data.success) {
          setMessage('Payment succeeded!')
          onPaymentSuccess()
        } else {
          setMessage('Payment confirmation failed.')
          onPaymentError('Payment confirmation failed.')
        }
      } catch (confirmError) {
        console.log('Confirmation error:', confirmError)
        setMessage('Payment succeeded but confirmation failed.')
        onPaymentError('Payment succeeded but confirmation failed.')
      }
    }

    setIsLoading(false)
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement 
        id="payment-element"
        options={{
          layout: "tabs"
        }}
      />
      
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span id="button-text">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            'Pay now'
          )}
        </span>
      </button>
      
      {message && (
        <div 
          id="payment-message" 
          className={`mt-4 text-sm ${
            message.includes('succeeded') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </div>
      )}
    </form>
  )
}

export default CheckoutForm