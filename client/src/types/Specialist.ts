export interface Specialist {
  id: string;
  group: "Врачи" | "Средний медицинский персонал";
  lastName: string;
  firstName: string;
  middleName: string;
  workType: string;
  position: string;
  specialty: string;
  department: string;
  education: string;
  certificate: string;
  category: string;
  experience: string;
}
