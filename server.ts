import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/db';
import { speechService, HINDI_LEXICON } from './server/speechService';
import { generateMitriChatResponse } from './server/geminiService';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing with 20MB limit to safely support base64 audio uploads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// -------------------------------------------------------------
// REST API ENDPOINTS (/api/*)
// -------------------------------------------------------------

// 1. Health & Engine Status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    engine: {
      provider: process.env.AI_PROVIDER || 'demo',
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      storageRetentionHours: 24,
      model: 'wav2vec-2.0-hindi-child-ctc + gemini-3.8-flash',
    },
  });
});

// 2. Authentication & User Switching
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, role } = req.body;
  let user = email ? db.getUserByEmail(email) : undefined;
  if (!user && role) {
    user = db.users.find(u => u.role === role);
  }
  if (!user) {
    user = db.users[0]; // fallback to demo child
  }

  const child = user.role === 'child' ? db.getChildByUserId(user.id) : undefined;
  res.json({
    token: 'jwt_token_' + user.id + '_' + Date.now(),
    user,
    childProfile: child,
  });
});

app.post('/api/auth/signup', (req: Request, res: Response) => {
  const { name, email, role, childAge } = req.body;
  const newUserId = 'usr_' + Date.now();
  const newUser = {
    id: newUserId,
    name: name || 'नया उपयोगकर्ता (New User)',
    email: email || `user_${Date.now()}@aarogyaspeech.ai`,
    passwordHash: 'hashed_pw_default',
    role: (role || 'parent') as any,
    avatar: role === 'child' ? '👦' : role === 'therapist' ? '👩‍⚕️' : '👩',
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);

  let newChild = undefined;
  if (role === 'child' || role === 'parent') {
    const childId = 'ch_' + Date.now();
    newChild = {
      id: childId,
      userId: role === 'child' ? newUserId : 'usr_child_' + Date.now(),
      parentUserId: role === 'parent' ? newUserId : 'usr_parent_1',
      name: role === 'child' ? newUser.name : 'बच्चा (Child)',
      age: childAge || 6,
      gender: 'Child',
      nativeDialect: 'Hindi (Khariboli)',
      currentLevel: 'Beginner',
      totalXp: 100,
      streakDays: 1,
      dailyGoalMinutes: 15,
      consentGranted: true,
      consentDate: new Date().toISOString(),
      assignedTherapistId: 'th_1',
      avatarUrl: '👦',
      soundGardenPlants: 1,
    };
    db.children.push(newChild);

    // Initialize digital twin
    db.digitalTwins[childId] = {
      id: 'dt_' + childId,
      childId,
      overallMasteryScore: 0.60,
      phonemes: JSON.parse(JSON.stringify(db.digitalTwins['ch_1'].phonemes)),
      difficultSounds: ['क (/k/)'],
      commonErrorPatterns: ['Velar Fronting (/k/ → [t])'],
      currentDifficultyLadder: 'Word',
      frustrationScore: 0.1,
      recommendedDailyActivity: {
        targetPhoneme: 'k',
        wordHindi: 'कमल',
        exerciseType: 'word_flashcard',
        reason: 'ध्वनि /k/ की पहचान और एकाकी उच्चारण से अभ्यास शुरू करें।',
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  res.json({
    token: 'jwt_token_' + newUser.id,
    user: newUser,
    childProfile: newChild,
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'usr_child_1';
  const user = db.getUserById(userId) || db.users[0];
  const child = user.role === 'child' ? db.getChildByUserId(user.id) : db.children[0];
  res.json({ user, childProfile: child });
});

// 3. Child Profile & Digital Twin
app.get('/api/children/:id/profile', (req: Request, res: Response) => {
  const childId = req.params.id;
  const child = db.getChildById(childId) || db.children[0];
  res.json(child);
});

app.get('/api/children/:id/digital-twin', (req: Request, res: Response) => {
  const childId = req.params.id;
  const twin = db.getDigitalTwin(childId) || db.digitalTwins['ch_1'];
  res.json(twin);
});

// 4. Audio Processing & Speech Analysis Pipeline
app.post('/api/speech/analyze', async (req: Request, res: Response) => {
  try {
    const { childId, targetWord, targetPhoneme, position, audioBase64, audioDurationSeconds, simulatedScenario } = req.body;

    const validation = speechService.validateAudio(audioBase64, audioDurationSeconds);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const result = await speechService.analyzeSpeech({
      childId: childId || 'ch_1',
      targetWord: targetWord || 'कमल',
      targetPhoneme: targetPhoneme || 'k',
      position: position || 'initial',
      audioBase64,
      audioDurationSeconds: audioDurationSeconds || 2.4,
      simulatedScenario: simulatedScenario || 'correct',
    });

    res.json({
      success: true,
      result,
      digitalTwin: db.getDigitalTwin(childId || 'ch_1'),
    });
  } catch (err: any) {
    console.error('Speech analysis error:', err);
    res.status(500).json({ error: 'ध्वनि विश्लेषण में त्रुटि (Internal speech analysis failure)', details: err.message });
  }
});

// 5. Audio Hard-Deletion (Privacy & DPDP Compliance)
app.post('/api/speech/delete-recording/:id', (req: Request, res: Response) => {
  const recordingId = req.params.id;
  const actorId = (req.body.actorId as string) || 'usr_parent_1';
  const success = db.deleteRecording(recordingId, actorId);
  res.json({ success, message: success ? 'ध्वनि रिकॉर्डिंग स्थायी रूप से हटा दी गई (Recording hard-deleted)' : 'रिकॉर्डिंग नहीं मिली' });
});

app.post('/api/speech/delete-all/:childId', (req: Request, res: Response) => {
  const childId = req.params.childId;
  const actorId = (req.body.actorId as string) || 'usr_parent_1';
  const deletedCount = db.deleteAllChildRecordings(childId, actorId);
  res.json({
    success: true,
    deletedCount,
    message: `बच्चे की सभी ${deletedCount} ऑडियो रिकॉर्डिंग्स पूरी तरह नष्ट कर दी गई हैं।`,
  });
});

app.get('/api/speech/active-recordings/:childId', (req: Request, res: Response) => {
  const childId = req.params.childId;
  const list = db.recordings.filter(r => r.childId === childId && r.status === 'active');
  res.json(list);
});

// 6. Speech Assessment Battery
app.get('/api/assessment/battery', (req: Request, res: Response) => {
  const assessmentItems = [
    { id: 'asm_1', wordHindi: 'कमल', targetPhoneme: 'k', position: 'initial', meaning: 'Lotus', audioExemplarText: 'कमल (ka-ma-la)' },
    { id: 'asm_2', wordHindi: 'पानी', targetPhoneme: 'p', position: 'initial', meaning: 'Water', audioExemplarText: 'पानी (paa-nee)' },
    { id: 'asm_3', wordHindi: 'तितली', targetPhoneme: 't', position: 'initial', meaning: 'Butterfly', audioExemplarText: 'तितली (tit-lee)' },
    { id: 'asm_4', wordHindi: 'सेब', targetPhoneme: 's', position: 'initial', meaning: 'Apple', audioExemplarText: 'सेब (se-ba)' },
    { id: 'asm_5', wordHindi: 'मकान', targetPhoneme: 'k', position: 'medial', meaning: 'House', audioExemplarText: 'मकान (ma-kaan)' },
    { id: 'asm_6', wordHindi: 'सड़क', targetPhoneme: 's', position: 'initial', meaning: 'Road', audioExemplarText: 'सड़क (sa-dak)' },
  ];
  res.json(assessmentItems);
});

// 7. Courses, Lessons, and Practice Exercises
app.get('/api/courses', (req: Request, res: Response) => {
  res.json(db.courses);
});

app.get('/api/courses/:id', (req: Request, res: Response) => {
  const course = db.courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  const lessons = db.lessons[course.id] || [];
  res.json({ course, lessons });
});

app.get('/api/lessons/:id/exercises', (req: Request, res: Response) => {
  const exercises = db.exercises[req.params.id] || [];
  res.json(exercises);
});

app.post('/api/practice/submit-attempt', (req: Request, res: Response) => {
  const { childId, exerciseId, targetWord, targetPhoneme, isSuccess, gopScore } = req.body;
  const xp = isSuccess ? 25 : 10;
  const attempt: any = {
    id: 'att_' + Date.now(),
    childId: childId || 'ch_1',
    exerciseId: exerciseId || 'ex_default',
    targetWord: targetWord || 'कमल',
    targetPhoneme: targetPhoneme || 'k',
    score: isSuccess ? 1.0 : 0.5,
    gopScore: gopScore || (isSuccess ? 0.88 : 0.45),
    isSuccess: !!isSuccess,
    xpEarned: xp,
    timestamp: new Date().toISOString(),
  };
  db.practiceAttempts.push(attempt);

  const child = db.getChildById(childId || 'ch_1');
  if (child) {
    child.totalXp += xp;
    if (isSuccess) child.soundGardenPlants = Math.min(50, child.soundGardenPlants + 1);
  }

  res.json({ success: true, attempt, currentXp: child?.totalXp || 0 });
});

// 8. AI Conversation Speech Buddy (Mitri)
app.post('/api/conversation/chat', async (req: Request, res: Response) => {
  try {
    const { history, userSpeechText, childName } = req.body;
    const reply = await generateMitriChatResponse(history || [], userSpeechText || '', childName || 'Aarav');
    res.json({ reply });
  } catch (err: any) {
    res.json({ reply: 'Hello! I am so happy to hear your voice! Let us practice saying beautiful words together! 🌟' });
  }
});

// 9. Parent Dashboard & Consent
app.get('/api/parent/:parentId/overview', (req: Request, res: Response) => {
  const parentId = req.params.parentId;
  const child = db.children.find(c => c.parentUserId === parentId) || db.children[0];
  const twin = db.getDigitalTwin(child.id) || db.digitalTwins['ch_1'];
  const recordings = db.recordings.filter(r => r.childId === child.id && r.status === 'active');
  const therapist = db.therapists[0];

  res.json({
    child,
    digitalTwin: twin,
    activeRecordingsCount: recordings.length,
    therapist,
    screenTimeUsedMinutes: 11,
    screenTimeLimitMinutes: child.dailyGoalMinutes || 15,
    consentStatus: child.consentGranted,
  });
});

app.post('/api/parent/consent', (req: Request, res: Response) => {
  const { childId, consentGranted } = req.body;
  const child = db.getChildById(childId || 'ch_1');
  if (child) {
    child.consentGranted = !!consentGranted;
    child.consentDate = new Date().toISOString();
  }
  res.json({ success: true, consentGranted: child?.consentGranted });
});

// 10. Therapist / SLP Portal
app.get('/api/therapist/:therapistId/dashboard', (req: Request, res: Response) => {
  const therapistId = req.params.therapistId;
  const therapist = db.therapists.find(t => t.id === therapistId) || db.therapists[0];
  const assignedChildren = db.children.filter(c => c.assignedTherapistId === therapist.id);
  const selectedChild = assignedChildren[0] || db.children[0];
  const twin = db.getDigitalTwin(selectedChild.id) || db.digitalTwins['ch_1'];
  const recentAnalyses = db.analysisResults.slice(-10);

  res.json({
    therapist,
    assignedChildren,
    selectedChildTwin: twin,
    recentAnalyses,
    notes: db.therapistNotes.filter(n => n.childId === selectedChild.id),
    homework: db.therapistHomework.filter(h => h.childId === selectedChild.id),
  });
});

app.post('/api/therapist/override-label', (req: Request, res: Response) => {
  const { resultId, overrideLabel, slpNote } = req.body;
  const analysis = db.analysisResults.find(a => a.id === resultId);
  if (analysis) {
    analysis.overriddenByTherapist = true;
    analysis.therapistOverrideLabel = overrideLabel;
    if (slpNote) analysis.therapistNotes = slpNote;
  }
  db.auditLogs.push({
    id: 'aud_' + Date.now(),
    actorId: 'usr_therapist_1',
    actorName: 'Dr. Neha Verma (SLP)',
    actorRole: 'therapist',
    action: 'SLP_LABEL_OVERRIDE',
    targetResource: `SpeechAnalysisResult:${resultId}`,
    details: `Manual clinical override to [${overrideLabel}]. Note: ${slpNote || 'None'}`,
    timestamp: new Date().toISOString(),
  });
  res.json({ success: true, analysis });
});

app.post('/api/therapist/add-note', (req: Request, res: Response) => {
  const { therapistId, childId, note } = req.body;
  const newNote = {
    id: 'note_' + Date.now(),
    therapistId: therapistId || 'th_1',
    childId: childId || 'ch_1',
    note,
    date: new Date().toISOString(),
  };
  db.therapistNotes.push(newNote);
  res.json({ success: true, note: newNote });
});

app.post('/api/therapist/prescribe-homework', (req: Request, res: Response) => {
  const { therapistId, childId, targetPhoneme, instructions } = req.body;
  const hw = {
    id: 'hw_' + Date.now(),
    therapistId: therapistId || 'th_1',
    childId: childId || 'ch_1',
    targetPhoneme: targetPhoneme || 'k',
    instructions: instructions || 'Daily 5 repetitions of minimal pair card.',
    prescribedDate: new Date().toISOString(),
  };
  db.therapistHomework.push(hw);
  res.json({ success: true, homework: hw });
});

// 11. Community Forum
app.get('/api/community/posts', (req: Request, res: Response) => {
  res.json(db.communityPosts);
});

app.post('/api/community/posts', (req: Request, res: Response) => {
  const { authorId, authorName, authorRole, title, content, category } = req.body;
  const newPost: any = {
    id: 'post_' + Date.now(),
    authorId: authorId || 'usr_parent_1',
    authorName: authorName || 'अभिभावक (Parent)',
    authorRole: authorRole || 'parent',
    authorAvatar: authorRole === 'therapist' ? '👩‍⚕️' : '👩',
    title: title || 'अभ्यास सुझाव',
    content: content || '',
    category: category || 'tips',
    likesCount: 1,
    commentsCount: 0,
    createdAt: new Date().toISOString(),
  };
  db.communityPosts.unshift(newPost);
  res.json({ success: true, post: newPost });
});

app.post('/api/community/posts/:id/like', (req: Request, res: Response) => {
  const post = db.communityPosts.find(p => p.id === req.params.id);
  if (post) post.likesCount += 1;
  res.json({ success: true, likesCount: post?.likesCount || 0 });
});

// 12. Admin & System Audit
app.get('/api/admin/metrics', (req: Request, res: Response) => {
  res.json({
    totalUsers: db.users.length,
    activeChildren: db.children.length,
    verifiedTherapists: db.therapists.length,
    totalAudioProcessed: db.analysisResults.length + 18,
    activeAudioInVault: db.recordings.filter(r => r.status === 'active').length,
    averageGopScore: 0.78,
    complianceStatus: 'DPDP 2023 Principles Enforced (24h Ephemeral TTL)',
  });
});

app.get('/api/admin/audit-logs', (req: Request, res: Response) => {
  res.json(db.auditLogs);
});

app.get('/api/admin/users', (req: Request, res: Response) => {
  res.json(db.users);
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & STATIC ASSET SERVING
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AarogyaSpeech AI] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
