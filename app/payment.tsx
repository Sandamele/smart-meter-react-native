import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef } from "react";
import { Alert } from "react-native";
import { WebView } from "react-native-webview";
import useAuthStore from "@/store/store";
import axios from "axios";

const Payment = () => {
  const webViewRef = useRef(null);
  const localParams = useLocalSearchParams();
  const { email, amount, beneficiaryId } = localParams;
  const router = useRouter();
  const { authToken } = useAuthStore();
  const paystackHTML = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <script src="https://js.paystack.co/v1/inline.js"></script>
        </head>
        <body onload="payWithPaystack()">
          <script>
            function payWithPaystack() {
              var handler = PaystackPop.setup({
                key: 'pk_test_c0faa6d72d8a99767337aee8bf985eb79b448e1e', 
                email: '${email}',
                amount: ${
                  parseFloat(Array.isArray(amount) ? amount[0] : amount) * 100
                }, // Amount in kobo
                currency: 'ZAR',
                callback: function(response) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'success', reference: response.reference }));
                },
                onClose: function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'cancelled' }));
                }
              });
              handler.openIframe();
            }
          </script>
        </body>
      </html>
    `;

  const handleMessage = async (event: { nativeEvent: { data: string } }) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.status === "success") {
      await axios
        .post(
          `https://smart-meter-backend-y19r.onrender.com/api/v1/transaction-histories`,
          {
            cost: parseFloat(Array.isArray(amount) ? amount[0] : amount),
            paymentStatus: data.status.toString(),
            beneficiaryId,
          },
          { headers: { Authorization: `Bearer ${authToken}` } }
        )
        .then(() => {
          Alert.alert("Payment Successful", `Ref: ${data.reference}`);
          setTimeout(() => {
            router.push(`/dashboard`);
          }, 3000);
        })
        .catch((error) => {
            console.log(error.response)
          Alert.alert("Error", "Internal client error");
        });
    } else {
        Alert.alert("Error", `Payment ${data.status}`);
    }
  };

  return (
    <WebView
      ref={webViewRef}
      originWhitelist={["*"]}
      source={{ html: paystackHTML }}
      onMessage={handleMessage}
      javaScriptEnabled
      domStorageEnabled
    />
  );
};

export default Payment;
