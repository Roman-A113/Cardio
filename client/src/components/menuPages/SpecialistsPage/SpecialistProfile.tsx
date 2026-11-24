import type { Specialist } from "../../types/Specialist";
import SpecialistPhoto from "./SpecialistPhoto";
import { getDetailValue, getFullName } from "./specialistUtils";

interface SpecialistProfileProps {
  specialist: Specialist;
}

const SpecialistProfile: React.FC<SpecialistProfileProps> = ({
  specialist,
}) => (
  <>
    <div className="specialist-profile">
      <SpecialistPhoto specialist={specialist} size="portrait" />
      <div className="specialist-profile__content">
        <header className="specialist-profile-header">
          <h2 id="specialists-modal-title">{getFullName(specialist)}</h2>
          <p>{specialist.position}</p>
        </header>
        <div className="specialist-details">
          <section className="specialist-details__section">
            <h3>Основная информация</h3>
            <dl>
              <div>
                <dt>Вид работы</dt>
                <dd>{getDetailValue(specialist.workType)}</dd>
              </div>
              <div>
                <dt>Штатная должность</dt>
                <dd>{getDetailValue(specialist.position)}</dd>
              </div>
              <div>
                <dt>Специальность</dt>
                <dd>{getDetailValue(specialist.specialty)}</dd>
              </div>
              <div>
                <dt>Подразделение</dt>
                <dd>{getDetailValue(specialist.department)}</dd>
              </div>
              <div>
                <dt>Стаж по специальности</dt>
                <dd>{getDetailValue(specialist.experience)}</dd>
              </div>
            </dl>
          </section>

          <section className="specialist-details__section">
            <h3>Образование и квалификация</h3>
            <dl>
              <div>
                <dt>Образование, специальность и организация</dt>
                <dd>{getDetailValue(specialist.education)}</dd>
              </div>
              <div>
                <dt>Сертификат</dt>
                <dd>{getDetailValue(specialist.certificate)}</dd>
              </div>
              <div>
                <dt>Категория</dt>
                <dd>{getDetailValue(specialist.category)}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  </>
);

export default SpecialistProfile;
