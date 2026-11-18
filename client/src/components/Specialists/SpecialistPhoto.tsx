import { useState } from "react";
import type { Specialist } from "../../types/Specialist";
import { getFullName } from "./specialistUtils";

interface SpecialistPhotoProps {
  specialist: Specialist;
  size: "small" | "portrait";
}

const SpecialistPhoto: React.FC<SpecialistPhotoProps> = ({
  specialist,
  size,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const photoUrl = specialist.photoUrl?.trim();

  return (
    <span
      className={`specialist-photo specialist-photo--${size}`}
      role="img"
      aria-label={`Фото: ${getFullName(specialist)}`}
    >
      {photoUrl && !imageFailed ? (
        <img src={photoUrl} alt="" onError={() => setImageFailed(true)} />
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="24" cy="17" r="9" />
          <path d="M7 43c1.8-9 8-14 17-14s15.2 5 17 14" />
        </svg>
      )}
    </span>
  );
};

export default SpecialistPhoto;
