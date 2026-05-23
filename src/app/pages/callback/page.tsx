'use client'
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, ArrowLeft, ShoppingBag, Receipt, Clock, AlertCircle } from "lucide-react";
import CoreService from "@/app/hooks/core-service";

interface PaymentVerificationResponse {
  success: boolean;
  message?: string;
  data?: {
    transactionId: string;
    amount: number;
    currency: string;
    status: string;
    customerName?: string;
    customerEmail?: string;
    items?: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    paymentMethod?: string;
    createdAt?: string;
  };
}
const coreService = new CoreService();


const PaymentCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "failed" | "error">("verifying");
  const [paymentData, setPaymentData] = useState<PaymentVerificationResponse["data"] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    const tx_ref = searchParams.get("tx_ref");
    const transaction_id = searchParams.get("transaction_id");
    const paymentStatus = searchParams.get("status");

    // Check if payment was cancelled or failed from the payment gateway
    if (paymentStatus === "cancelled") {
      setStatus("failed");
      setErrorMessage("Payment was cancelled. Please try again.");
      return;
    }

    if (paymentStatus === "error") {
      setStatus("error");
      setErrorMessage("An error occurred during payment processing.");
      return;
    }

    if (tx_ref && transaction_id) {
      verifyPayment(tx_ref as string, transaction_id as string);
    } else if (tx_ref && !transaction_id) {
      // Some gateways only send tx_ref
      verifyPayment(tx_ref as string, undefined);
    } else {
      setStatus("error");
      setErrorMessage("Missing payment verification details.");
    }
  }, [searchParams]);

  // Auto-redirect countdown
  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === "success" && countdown === 0) {
      router.push("/pages/student-portal");
    }
  }, [status, countdown, router]);

  const verifyPayment = async (tx_ref: string, transaction_id?: string) => {
    try {
      // Construct URL with optional transaction_id
      const url = `marketplace/verify-payment/${tx_ref}`;

      const res = await coreService.get(url);

      if (res.success && res.data?.status === "successful") {
        setStatus("success");
        // Map the Flutterwave-style response to our internal paymentData interface
        setPaymentData({
          transactionId: res.data.id?.toString() || res.data.tx_ref,
          amount: res.data.amount,
          currency: res.data.currency,
          status: res.data.status,
          customerName: res.data.customer?.name,
          customerEmail: res.data.customer?.email,
          paymentMethod: res.data.payment_type,
          createdAt: res.data.created_at
        });
        
        // Store payment confirmation in localStorage for order reference
        localStorage.setItem("last_payment_ref", tx_ref);
        localStorage.setItem("payment_verified_at", new Date().toISOString());
      } else if (res.data?.status === "pending") {
        // Payment is still processing
        setStatus("verifying");
        // Retry after 3 seconds if pending
        setTimeout(() => {
          verifyPayment(tx_ref, transaction_id);
        }, 3000);
      } else {
        setStatus("failed");
        setErrorMessage(res.message || "Payment verification failed. Please contact support.");
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      setStatus("error");
      setErrorMessage(error?.response?.data?.message || "Network error. Please check your connection and try again.");
    }
  };


  const handleRetry = () => {
    setStatus("verifying");
    const tx_ref = searchParams.get("tx_ref");
    const transaction_id = searchParams.get("transaction_id");
    if (tx_ref) {
      verifyPayment(tx_ref as string, transaction_id as string);
    }
  };

  const handleGoToOrders = () => {
    router.push("/pages/student-portal");
  };

  const handleGoToMarketplace = () => {
    router.push("/pages/student-portal");
  };

  // Format currency
  const formatCurrency = (amount?: number, currency?: string) => {
    if (!amount) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with status color */}
          <div
            className={`px-6 py-8 text-center ${
              status === "success"
                ? "bg-linear-to-r from-green-500 to-emerald-600"
                : status === "verifying"
                ? "bg-linear-to-r from-blue-500 to-indigo-600"
                : "bg-linear-to-r from-red-500 to-rose-600"
            }`}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
              {status === "verifying" && (
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              )}
              {status === "success" && (
                <CheckCircle className="w-10 h-10 text-white" />
              )}
              {(status === "failed" || status === "error") && (
                <XCircle className="w-10 h-10 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {status === "verifying" && "Verifying Payment"}
              {status === "success" && "Payment Successful!"}
              {status === "failed" && "Payment Failed"}
              {status === "error" && "Verification Error"}
            </h2>
            <p className="text-white/80 text-sm">
              {status === "verifying" && "Please wait while we confirm your transaction..."}
              {status === "success" && "Your payment has been processed successfully"}
              {status === "failed" && "We couldn't complete your payment"}
              {status === "error" && "Something went wrong"}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Success Content */}
            {status === "success" && paymentData && (
              <div className="space-y-4">
                {/* Order Summary */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-2 text-green-700 mb-3">
                    <Receipt size="18" />
                    <span className="font-semibold">Order Summary</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono text-gray-800">{paymentData.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-green-600">{formatCurrency(paymentData.amount, paymentData.currency)}</span>
                    </div>
                    {paymentData.customerName && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer:</span>
                        <span className="text-gray-800">{paymentData.customerName}</span>
                      </div>
                    )}
                    {paymentData.paymentMethod && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="text-gray-800 capitalize">{paymentData.paymentMethod}</span>
                      </div>
                    )}
                    {paymentData.createdAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="text-gray-800">{formatDate(paymentData.createdAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Purchased */}
                {paymentData.items && paymentData.items.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                      <ShoppingBag size="18" />
                      <span className="font-semibold">Items Purchased</span>
                    </div>
                    <div className="space-y-2">
                      {paymentData.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.name} x{item.quantity}
                          </span>
                          <span className="text-gray-800">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Countdown and Actions */}
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-500">
                    Redirecting to your portal in {countdown} second{countdown !== 1 ? "s" : ""}...
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleGoToOrders}
                      className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                    >
                      View cart
                    </button>
                    <button
                      onClick={handleGoToMarketplace}
                      className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Verifying Content */}
            {status === "verifying" && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
                    <p className="text-sm text-blue-700">
                      Your payment is being processed. This may take a few moments.
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Please do not close this window</p>
                </div>
              </div>
            )}

            {/* Failed/Error Content */}
            {(status === "failed" || status === "error") && (
              <div className="space-y-4">
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-700 font-medium">What went wrong?</p>
                      <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleRetry}
                    className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Loader2 size="16" />
                    Retry Verification
                  </button>
                  <button
                    onClick={() => router.push("/pages/student-portal")}
                    className="w-full py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Return to Checkout
                  </button>
                  <button
                    onClick={handleGoToMarketplace}
                    className="w-full py-2.5 text-gray-500 text-sm hover:text-gray-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <ArrowLeft size="14" />
                    Back to Marketplace
                  </button>
                </div>

                {/* Support Contact */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Need help?{" "}
                    <button
                      onClick={() => window.location.href = "mailto:support@nacos.com"}
                      className="text-emerald-600 hover:underline"
                    >
                      Contact Support
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          <span className="inline-flex items-center gap-1">
            🔒 Secure payment verification
          </span>
        </p>
      </div>
    </div>
  );
};

export default PaymentCallback;