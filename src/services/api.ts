// Frontend API Client connecting to Express Backend (/api/*)
import { 
  User, 
  ChildProfile, 
  TherapistProfile, 
  DigitalTwinProfile, 
  Course, 
  Lesson, 
  ExerciseItem, 
  SpeechAnalysisResult, 
  CommunityPost, 
  AuditLog 
} from '../../server/db';

export const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function loginUser(email?: string, role?: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, role }),
  });
  return res.json();
}

export async function signupUser(data: { name: string; email: string; role: string; childAge?: number }) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchChildProfile(childId: string): Promise<ChildProfile> {
  const res = await fetch(`${API_BASE}/children/${childId}/profile`);
  return res.json();
}

export async function fetchDigitalTwin(childId: string): Promise<DigitalTwinProfile> {
  const res = await fetch(`${API_BASE}/children/${childId}/digital-twin`);
  return res.json();
}

export async function analyzeSpeechAudio(payload: {
  childId: string;
  targetWord: string;
  targetPhoneme: string;
  position?: 'initial' | 'medial' | 'final';
  audioBase64?: string;
  audioDurationSeconds?: number;
  simulatedScenario?: 'correct' | 'substitution' | 'omission' | 'distortion';
}): Promise<{ success: boolean; result: SpeechAnalysisResult; digitalTwin: DigitalTwinProfile }> {
  const res = await fetch(`${API_BASE}/speech/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteAudioRecording(recordingId: string, actorId: string = 'usr_parent_1') {
  const res = await fetch(`${API_BASE}/speech/delete-recording/${recordingId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actorId }),
  });
  return res.json();
}

export async function deleteAllChildAudio(childId: string, actorId: string = 'usr_parent_1') {
  const res = await fetch(`${API_BASE}/speech/delete-all/${childId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actorId }),
  });
  return res.json();
}

export async function fetchAssessmentBattery() {
  const res = await fetch(`${API_BASE}/assessment/battery`);
  return res.json();
}

export async function fetchCourses(): Promise<Course[]> {
  const res = await fetch(`${API_BASE}/courses`);
  return res.json();
}

export async function fetchCourseDetail(courseId: string): Promise<{ course: Course; lessons: Lesson[] }> {
  const res = await fetch(`${API_BASE}/courses/${courseId}`);
  return res.json();
}

export async function fetchLessonExercises(lessonId: string): Promise<ExerciseItem[]> {
  const res = await fetch(`${API_BASE}/lessons/${lessonId}/exercises`);
  return res.json();
}

export async function submitPracticeAttempt(data: {
  childId: string;
  exerciseId: string;
  targetWord: string;
  targetPhoneme: string;
  isSuccess: boolean;
  gopScore?: number;
}) {
  const res = await fetch(`${API_BASE}/practice/submit-attempt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function sendMitriChatMessage(history: any[], userSpeechText: string, childName?: string): Promise<{ reply: string }> {
  const res = await fetch(`${API_BASE}/conversation/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history, userSpeechText, childName }),
  });
  return res.json();
}

export async function fetchParentOverview(parentId: string) {
  const res = await fetch(`${API_BASE}/parent/${parentId}/overview`);
  return res.json();
}

export async function updateParentConsent(childId: string, consentGranted: boolean) {
  const res = await fetch(`${API_BASE}/parent/consent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ childId, consentGranted }),
  });
  return res.json();
}

export async function fetchTherapistDashboard(therapistId: string) {
  const res = await fetch(`${API_BASE}/therapist/${therapistId}/dashboard`);
  return res.json();
}

export async function submitTherapistOverride(resultId: string, overrideLabel: string, slpNote?: string) {
  const res = await fetch(`${API_BASE}/therapist/override-label`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resultId, overrideLabel, slpNote }),
  });
  return res.json();
}

export async function addTherapistNote(therapistId: string, childId: string, note: string) {
  const res = await fetch(`${API_BASE}/therapist/add-note`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ therapistId, childId, note }),
  });
  return res.json();
}

export async function prescribeHomework(therapistId: string, childId: string, targetPhoneme: string, instructions: string) {
  const res = await fetch(`${API_BASE}/therapist/prescribe-homework`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ therapistId, childId, targetPhoneme, instructions }),
  });
  return res.json();
}

export async function fetchCommunityPosts(): Promise<CommunityPost[]> {
  const res = await fetch(`${API_BASE}/community/posts`);
  return res.json();
}

export async function createCommunityPost(data: {
  authorId: string;
  authorName: string;
  authorRole: string;
  title: string;
  content: string;
  category: string;
}) {
  const res = await fetch(`${API_BASE}/community/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function likeCommunityPost(postId: string) {
  const res = await fetch(`${API_BASE}/community/posts/${postId}/like`, {
    method: 'POST',
  });
  return res.json();
}

export async function fetchAdminMetrics() {
  const res = await fetch(`${API_BASE}/admin/metrics`);
  return res.json();
}

export async function fetchAdminAuditLogs(): Promise<AuditLog[]> {
  const res = await fetch(`${API_BASE}/admin/audit-logs`);
  return res.json();
}
