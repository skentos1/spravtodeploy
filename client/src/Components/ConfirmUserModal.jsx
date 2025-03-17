import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import toast from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";
import StyledDatePicker from "./StyledComponents/ModernDatepicker"; // iba styled verziu DatePickeru
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const ConfirmUserModal = ({
  isOpen,
  onRequestClose,
  user,
  job,
  onConfirm, // Callback, ktorý aktualizuje job v nadradenom komponente
  token,     // Autentifikačný token
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cardHolderName, setCardHolderName] = useState("");

  // Stav pre inline edit termínu
  const [editingTime, setEditingTime] = useState(false);
  const [tempProposedDate, setTempProposedDate] = useState(
    job && job.proposedDate ? new Date(job.proposedDate) : new Date()
  );

  // Aktualizácia stavu, keď sa job zmení
  useEffect(() => {
    if (job && job.proposedDate) {
      setTempProposedDate(new Date(job.proposedDate));
    }
  }, [job]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!job.id) {
      setError("Chýba ID práce");
      setProcessing(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/payments/create-payment-intent`,
        {
          amount: job.price,
          jobId: job.id,
        }
      );

      const payload = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: { name: cardHolderName },
        },
      });

      if (payload.error) {
        setError(`Platba zlyhala: ${payload.error.message}`);
        setProcessing(false);
        toast.error(`Platba zlyhala: ${payload.error.message}`);
      } else {
        setError(null);
        setProcessing(false);
        setSuccess(true);
        toast.success("Platba bola úspešná!");

        // Potvrdenie používateľa pre prácu
        try {
          await axios.post(
            `${import.meta.env.VITE_APP_API_URL}/jobs/${job.id}/confirm-user/${user._id}`
          );
          toast.success("Používateľ bol potvrdený pre prácu.");
          // Po potvrdení zavoláme onConfirm s aktuálnym jobom (aktualizovaným backendom)
          onConfirm();
          resetForm();
        } catch (confirmError) {
          console.error("Chyba pri potvrdzovaní používateľa pre prácu:", confirmError);
          setError(`Potvrdenie zlyhalo: ${confirmError.message}`);
          setSuccess(false);
          toast.error(`Potvrdenie zlyhalo: ${confirmError.message}`);
        }
      }
    } catch (error) {
      console.error("Chyba počas platobného procesu:", error);
      setError(`Platba zlyhala: ${error.message}`);
      setProcessing(false);
      toast.error(`Platba zlyhala: ${error.message}`);
    }
  };

  const resetForm = () => {
    setCardHolderName("");
    setError(null);
    setSuccess(false);
  };

  // Táto funkcia zavolá PUT API route, ktorá aktualizuje navrhnutý termín a odstráni používateľa z assignedUsers
  const handleTimeConfirm = async () => {


    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxAllowedDate = new Date(today);
    maxAllowedDate.setDate(today.getDate() + 6);

    if(tempProposedDate > maxAllowedDate){
      toast.error("Nový navrhnutý deň môže byť maximálne 6 dní od dneška.", { duration: 8000 });
      return;
    }
    // Extrahujeme lokálne časti z tempProposedDate
    const year = tempProposedDate.getFullYear();
    const month = String(tempProposedDate.getMonth() + 1).padStart(2, "0");
    const day = String(tempProposedDate.getDate()).padStart(2, "0");
    const hours = String(tempProposedDate.getHours()).padStart(2, "0");
    const minutes = String(tempProposedDate.getMinutes()).padStart(2, "0");
    // Nový dátum a čas v požadovanom formáte:
    const newProposedDate = `${year}-${month}-${day}`; // napr. "2025-02-26"
    const newProposedTime = `${hours}:${minutes}`;       // napr. "18:00"

    

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/jobs/${job.id}/update-proposed-time`,
        { newProposedDate, newProposedTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message, { duration: 8000 });
      navigate("/moje-prace");
      
      // Predpokladáme, že backend vráti aktualizovaný objekt job,
      // ktorý potom môžeš použiť na aktualizáciu lokálneho stavu (napr. cez onConfirm)
      onConfirm(response.data.job);
      setEditingTime(false);
    } catch (error) {
      console.error("Error updating proposed time:", error);
      toast.error(
        error.response?.data?.message || "Chyba pri aktualizácii termínu"
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      className="fixed inset-0 flex items-center justify-center z-50 outline-none focus:outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
    >
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
        <h2 className="text-2xl mb-4 text-center font-bold">
          Potvrdiť používateľa
        </h2>
        <p className="mb-4 text-center">
          Prosím, potvrďte a zaplaťte za{" "}
          <strong>
            {user.firstName} {user.lastName}
          </strong>{" "}
          aby začal pracovať na <strong>{job.title}</strong>
        </p>
        {/* Zobrazenie navrhnutého termínu s možnosťou editácie */}
        {editingTime ? (
          <div className="mb-4">
            <p className="mb-2 font-semibold text-gray-700">
              Upraviť navrhnutý termín
            </p>
            <StyledDatePicker
              selected={tempProposedDate}
              onChange={(date) => {
                //console.log("User selected new date:", date);
                setTempProposedDate(date);
              }}
              dateFormat="dd.MM.yyyy HH:mm"
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              placeholderText="Vyberte dátum a čas"
              maxDate={(() => {
                const today = new Date();
                today.setHours(0,0,0,0);
                const max = new Date(today);
                max.setDate(today.getDate() + 6);
                return max;
              })}
              className="border border-gray-300 p-2 rounded w-full mb-2"
            />
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setEditingTime(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Zrušiť
              </button>
              <button
                onClick={handleTimeConfirm}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Potvrdiť
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm mb-4">
            <p className="text-lg font-bold">
              {user.firstName} {user.lastName} navrhol termín:{" "}
              {job.proposedDate
                ? new Date(job.proposedDate).toLocaleDateString("sk-SK")
                : "N/A"}{" "}
              {job.proposedTime || "N/A"}
            </p>
            <button
              onClick={() => {
                setTempProposedDate(job.proposedDate ? new Date(job.proposedDate) : new Date());
                setEditingTime(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Navrhnúť iný čas
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="cardHolderName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Meno držiteľa karty
            </label>
            <input
              id="cardHolderName"
              type="text"
              placeholder="Meno držiteľa karty"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="cardNumber"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Číslo karty
            </label>
            <CardNumberElement
              id="cardNumber"
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="cardExpiry"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Dátum vypršania platnosti
            </label>
            <CardExpiryElement
              id="cardExpiry"
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="cardCvc"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              CVC
            </label>
            <CardCvcElement
              id="cardCvc"
              className="p-2 border rounded w-full"
            />
          </div>
          <button
            type="submit"
            disabled={processing || !stripe || !elements}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 flex justify-center items-center"
          >
            {processing ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              "Zaplaťte a potvrďte"
            )}
          </button>
          {error && (
            <div className="mt-4 text-red-500 text-center">{error}</div>
          )}
          {success && (
            <div className="mt-4 text-green-500 text-center">
              Platba bola úspešná!
            </div>
          )}
        </form>
      </div>
    </Modal>
  );
};

const WrappedConfirmUserModal = (props) => (
  <Elements stripe={stripePromise}>
    <ConfirmUserModal {...props} />
  </Elements>
);

export default WrappedConfirmUserModal;
