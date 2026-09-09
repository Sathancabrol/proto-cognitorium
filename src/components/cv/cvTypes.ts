export interface CvHeaderState {
  personName: string;
  headline: string;
  targetTitle: string;
  targetCode: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

export interface CvExperienceItem {
  id: string;
  name: string;
  role: string;
  institutionOrContext: string;
  period: string;
  description: string;
  missions: string[];
  visible: boolean;
  isRomePriority: boolean;
  matchScore?: number;
  matchReason?: string;
}

export interface CvSkillItem {
  id: string;
  name: string;
  categoryLabel: string;
  level: number; // 0-100
  visible: boolean;
  isRomeAligned: boolean;
  verified: boolean;
  evidenceCount?: number;
  matchReason?: string;
}

export interface CvCapacityItem {
  id: string;
  name: string;
  visible: boolean;
}

export interface CvFormationItem {
  id: string;
  name: string;
  institution: string;
  period: string;
  description?: string;
  visible: boolean;
  isRomePriority: boolean;
  matchReason?: string;
}

export interface CvState {
  header: CvHeaderState;
  experiences: CvExperienceItem[];
  skills: CvSkillItem[];
  capacities: CvCapacityItem[];
  formations: CvFormationItem[];
}
