export type Phase = 'MVP' | 'MVP-lite' | 'P2' | 'FUT';

export type Category = 
  | 'Core Architecture'
  | 'Audio & AI'
  | 'Assessment & Practice'
  | 'User & Roles'
  | 'Gamification & Engagement'
  | 'Security, Privacy & Admin';

export interface ModuleItem {
  id: string; // M-01 .. M-30
  name: string;
  phase: Phase;
  category: Category;
  section: string;
  description: string;
  keyOutputs: string;
  dependencies: string[];
  isCriticalPath: boolean;
}

export interface FunctionalRequirement {
  id: string; // FR-001 .. FR-091
  title?: string;
  requirement: string;
  phase: Phase;
  module: string;
  category: string;
}

export interface Principle {
  id: string; // PR-01 .. PR-10
  title: string;
  statement: string;
  implications: string;
}

export interface Goal {
  id: string; // G-01 .. G-09
  goal: string;
  metricConnection: string;
}

export interface NonGoal {
  id: string; // NG-01 .. NG-10
  statement: string;
  rationale: string;
}

export interface Persona {
  role: 'Child' | 'Parent' | 'Therapist' | 'Admin';
  ageRange?: string;
  goals: string[];
  needs: string[];
  keyActions: string[];
  restrictedActions: string[];
  tone: string;
}

export interface RbacRule {
  resource: string;
  child: string;
  parent: string;
  therapist: string;
  admin: string;
}

export interface PipelineStep {
  stepNumber: number;
  name: string;
  component: string;
  type: 'DSP' | 'Rules / Lexicon' | 'Deep Learning (wav2vec 2.0)' | 'Algorithmic (GOP)' | 'Classification' | 'State / Profile';
  description: string;
  limitations: string;
  phase: Phase;
}

export interface SecurityRequirement {
  id: string; // SEC-01 .. SEC-14
  area: string;
  requirement: string;
}

export interface SafetyRequirement {
  id: string; // SAF-01 .. SAF-11
  title: string;
  requirement: string;
}

export interface RiskItem {
  id: string;
  risk: string;
  severity: 'High' | 'Medium' | 'Low';
  mitigation: string;
  category: 'ML/Data' | 'Clinical' | 'Privacy & Safety' | 'Project Execution';
}

export interface OpenQuestion {
  id: string; // Q-01 .. Q-17
  question: string;
  affects: string;
  priority: 'Critical Block' | 'High' | 'Medium';
}

export interface Assumption {
  id: string; // A-01 .. A-10
  statement: string;
  implication: string;
}

export interface SuccessMetric {
  id: string;
  name: string;
  definition: string;
  type: 'Product' | 'ML/Ops' | 'Technical' | 'Compliance';
  targetNotes: string;
}
