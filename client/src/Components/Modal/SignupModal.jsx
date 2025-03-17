// SignupModal.jsx
import React, { useState } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import toast from "react-hot-toast";
import StyledDatePicker, { GlobalStyleDatepicker } from "../StyledComponents/ModernDatepicker";

Modal.setAppElement("#root");

const SignupModal = ({ isOpen, onRequestClose, jobId, token, onSignupSuccess }) => {
    const [proposedDate, setProposedDate] = useState(new Date());
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const handleConfirmDate = async () => {
        // Validácia dátumu (maximálne 7 dní od dnes)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + 6);
      
        const proposedDateOnly = new Date(proposedDate);
        proposedDateOnly.setHours(0, 0, 0, 0);
      
        if (proposedDateOnly > maxDate) {
          toast.error("Dátum môže byť maximálne 6 dní od dneška.");
          return;
        }
      
        // Ručne formátujeme dátum do reťazca, ktorý zodpovedá lokálnemu času
        const year = proposedDate.getFullYear();
        const month = String(proposedDate.getMonth() + 1).padStart(2, "0");
        const day = String(proposedDate.getDate()).padStart(2, "0");
        const hours = String(proposedDate.getHours()).padStart(2, "0");
        const minutes = String(proposedDate.getMinutes()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:00`;
        
        console.log("Formatted date to send:", formattedDate);
        setIsSubmitting(true);
      
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_APP_API_URL}/jobs/${jobId}/signup`,
            { proposedDate: formattedDate },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response.status === 200) {
            const { job, userConfirmed, userAssigned } = response.data;
            onSignupSuccess({ job, userConfirmed, userAssigned });
            toast.success("Úspešne ste sa prihlásili na prácu!");
            onRequestClose();
          } else {
            toast.error(response.data.message || "Prihlásenie zlyhalo.");
          }
        } catch (error) {
          console.error("Error signing up for the job:", error);
          toast.error( "Musíte sa prihlásiť, aby ste sa mohli zapísať na prácu.");
        } finally {
          setIsSubmitting(false);
        }
      };
      
  
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Navrhnite dátum vykonania práce"
        className="bg-white p-6 rounded shadow-md max-w-md mx-auto mt-20 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        {/* Aplikujeme aj globálne štýly pre react-datepicker */}
        <GlobalStyleDatepicker />
        <h2 className="text-xl font-bold mb-4 text-center">
          Navrhnite dátum a čas vykonania práce
        </h2>
        <StyledDatePicker
          selected={proposedDate}
          onChange={(date) => {
            console.log("User selected date:", date);
            setProposedDate(date);
          }}
          dateFormat="dd.MM.yyyy HH:mm"
          showTimeSelect
          timeIntervals={15}
          timeCaption="Čas"
          placeholderText="Vyberte dátum a čas"
        />
        <div className="flex justify-center space-x-2">
          <button
            onClick={onRequestClose}
            className="bg-gray-500 text-white mt-2 py-2 px-4 rounded hover:bg-gray-600 focus:outline-none"
            disabled={isSubmitting}
          >
            Zrušiť
          </button>
          <button
            onClick={handleConfirmDate}
            className="bg-green-600 text-white mt-2 py-2 px-4 rounded hover:bg-green-700 focus:outline-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Spracovávam..." : "Potvrdiť"}
          </button>
        </div>
      </Modal>
    );
  };
  
export default SignupModal;
