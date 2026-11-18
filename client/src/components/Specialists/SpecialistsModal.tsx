import { useEffect } from "react";
import type { Specialist } from "../../types/Specialist";
import SpecialistProfile from "./SpecialistProfile";

interface SpecialistsModalProps {
  specialist: Specialist;
  onClose: () => void;
}

const SpecialistsModal: React.FC<SpecialistsModalProps> = ({
  specialist,
  onClose,
}) => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="specialists-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="specialists-modal specialists-modal--profile"
        role="dialog"
        aria-modal="true"
        aria-labelledby="specialists-modal-title"
      >
        <button
          className="specialists-modal__close"
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
        >
          &times;
        </button>
        <div className="specialists-modal__content">
          <SpecialistProfile specialist={specialist} />
        </div>
      </section>
    </div>
  );
};

export default SpecialistsModal;
