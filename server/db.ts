// In-memory relational database with pre-seeded data for AarogyaSpeech AI
// Simulates a full relational database with User, ChildProfile, DigitalTwin, Courses, Lessons, Sessions, and Community

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'child' | 'parent' | 'therapist' | 'admin';
  avatar: string;
  createdAt: string;
}

export interface ChildProfile {
  id: string;
  userId: string;
  parentUserId: string;
  name: string;
  age: number;
  gender: string;
  nativeDialect: string;
  currentLevel: string; // 'Beginner' | 'Intermediate' | 'Advanced'
  totalXp: number;
  streakDays: number;
  dailyGoalMinutes: number;
  consentGranted: boolean;
  consentDate: string;
  assignedTherapistId: string;
  avatarUrl: string;
  soundGardenPlants: number;
}

export interface TherapistProfile {
  id: string;
  userId: string;
  name: string;
  title: string;
  rciNumber: string; // Rehabilitation Council of India registration
  clinic: string;
  email: string;
  phone: string;
  bio: string;
  specializations: string[];
  verified: boolean;
}

export interface PhonemeMastery {
  phoneme: string;
  symbolHindi: string;
  ipa: string;
  category: string; // 'Velar' | 'Bilabial' | 'Dental' | 'Sibilant' | 'Retroflex'
  overallMastery: number; // 0.0 to 1.0
  initialMastery: number;
  medialMastery: number;
  finalMastery: number;
  totalAttempts: number;
  correctCount: number;
  lastPracticed: string;
  status: 'Mastered' | 'In Progress' | 'Needs Focus';
}

export interface DigitalTwinProfile {
  id: string;
  childId: string;
  overallMasteryScore: number; // 0.0 to 1.0
  phonemes: Record<string, PhonemeMastery>;
  difficultSounds: string[];
  commonErrorPatterns: string[];
  currentDifficultyLadder: 'Isolation' | 'Word' | 'Phrase' | 'Sentence' | 'Conversation';
  frustrationScore: number; // 0.0 to 1.0 (circuit breaker triggers if > 0.6)
  recommendedDailyActivity: {
    targetPhoneme: string;
    wordHindi: string;
    exerciseType: string;
    reason: string;
  };
  lastUpdated: string;
}

export interface AudioRecordingRecord {
  id: string;
  childId: string;
  targetWord: string;
  durationSeconds: number;
  audioMime: string;
  uploadedAt: string;
  expiresAt: string; // 24h TTL
  deletedAt: string | null;
  storageUri: string;
  status: 'active' | 'hard_deleted' | 'expired';
}

export interface SpeechAnalysisResult {
  id: string;
  recordingId: string;
  childId: string;
  targetWord: string;
  targetPhoneme: string;
  position: 'initial' | 'medial' | 'final';
  expectedPhonemes: string[];
  producedPhonemes: string[];
  isMatch: boolean;
  confidence: number;
  gopScore: number;
  errorType: 'substitution' | 'omission' | 'addition' | 'distortion' | null;
  errorDescription: string | null;
  childFeedback: string;
  parentFeedback: string;
  therapistNotes: string;
  starsAwarded: number;
  xpEarned: number;
  timestamp: string;
  overriddenByTherapist?: boolean;
  therapistOverrideLabel?: string;
}

export interface Course {
  id: string;
  titleHindi: string;
  titleEnglish: string;
  description: string;
  category: string;
  targetPhonemes: string[];
  level: string;
  icon: string;
  modulesCount: number;
  totalLessons: number;
  xpReward: number;
  progressPercent?: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  titleHindi: string;
  titleEnglish: string;
  targetPhoneme: string;
  soundPosition: 'initial' | 'medial' | 'final' | 'all';
  description: string;
  exercisesCount: number;
  xpReward: number;
  completed?: boolean;
}

export interface ExerciseItem {
  id: string;
  lessonId: string;
  type: 'listen_repeat' | 'word_flashcard' | 'sentence' | 'picture_desc' | 'quiz';
  promptHindi: string;
  targetWord: string;
  targetPhoneme: string;
  meaningEnglish: string;
  audioExemplarText: string;
  options?: string[];
  correctAnswer?: string;
  imageUrl?: string;
  sentenceContext?: string;
}

export interface PracticeAttempt {
  id: string;
  childId: string;
  exerciseId: string;
  targetWord: string;
  targetPhoneme: string;
  score: number;
  gopScore: number;
  isSuccess: boolean;
  xpEarned: number;
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'parent' | 'therapist';
  authorAvatar: string;
  title: string;
  content: string;
  category: 'tips' | 'success_story' | 'games' | 'slp_qa';
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isPinned?: boolean;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorRole: 'parent' | 'therapist';
  content: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'practice_reminder' | 'weekly_report' | 'therapist_note' | 'achievement' | 'consent';
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetResource: string;
  details: string;
  timestamp: string;
}

// ------------------- IN-MEMORY DATABASE STATE -------------------

class Database {
  users: User[] = [];
  children: ChildProfile[] = [];
  therapists: TherapistProfile[] = [];
  digitalTwins: Record<string, DigitalTwinProfile> = {};
  recordings: AudioRecordingRecord[] = [];
  analysisResults: SpeechAnalysisResult[] = [];
  courses: Course[] = [];
  lessons: Record<string, Lesson[]> = {};
  exercises: Record<string, ExerciseItem[]> = {};
  practiceAttempts: PracticeAttempt[] = [];
  communityPosts: CommunityPost[] = [];
  communityComments: Record<string, CommunityComment[]> = {};
  notifications: NotificationItem[] = [];
  auditLogs: AuditLog[] = [];
  therapistNotes: { id: string; therapistId: string; childId: string; note: string; date: string }[] = [];
  therapistHomework: { id: string; therapistId: string; childId: string; targetPhoneme: string; instructions: string; prescribedDate: string }[] = [];

  constructor() {
    this.seedInitialData();
  }

  seedInitialData() {
    // 1. Users
    this.users = [
      {
        id: 'usr_child_1',
        name: 'आरव शर्मा (Aarav Sharma)',
        email: 'aarav@aarogyaspeech.ai',
        passwordHash: 'hashed_pw_child_123',
        role: 'child',
        avatar: '👦',
        createdAt: '2026-08-01T10:00:00Z',
      },
      {
        id: 'usr_parent_1',
        name: 'प्रिया शर्मा (Priya Sharma)',
        email: 'priya@aarogyaspeech.ai',
        passwordHash: 'hashed_pw_parent_123',
        role: 'parent',
        avatar: '👩',
        createdAt: '2026-08-01T09:30:00Z',
      },
      {
        id: 'usr_therapist_1',
        name: 'डॉ. नेहा वर्मा (Dr. Neha Verma)',
        email: 'dr.neha@aarogyaspeech.ai',
        passwordHash: 'hashed_pw_therapist_123',
        role: 'therapist',
        avatar: '👩‍⚕️',
        createdAt: '2026-07-15T08:00:00Z',
      },
      {
        id: 'usr_admin_1',
        name: 'विक्रम मेहरा (Vikram Mehra)',
        email: 'admin@aarogyaspeech.ai',
        passwordHash: 'hashed_pw_admin_123',
        role: 'admin',
        avatar: '👨‍💼',
        createdAt: '2026-07-01T00:00:00Z',
      },
    ];

    // 2. Child Profile
    this.children = [
      {
        id: 'ch_1',
        userId: 'usr_child_1',
        parentUserId: 'usr_parent_1',
        name: 'आरव शर्मा (Aarav)',
        age: 7,
        gender: 'Male',
        nativeDialect: 'Standard Hindi (Khariboli / Delhi-NCR)',
        currentLevel: 'Intermediate',
        totalXp: 860,
        streakDays: 5,
        dailyGoalMinutes: 15,
        consentGranted: true,
        consentDate: '2026-08-01T09:45:00Z',
        assignedTherapistId: 'th_1',
        avatarUrl: '👦',
        soundGardenPlants: 14,
      },
    ];

    // 3. Therapist Profile
    this.therapists = [
      {
        id: 'th_1',
        userId: 'usr_therapist_1',
        name: 'डॉ. नेहा वर्मा (Dr. Neha Verma)',
        title: 'Senior Speech-Language Pathologist (MASLP, RCI)',
        rciNumber: 'RCI-SLP-78249',
        clinic: 'Apex Child Speech & Hearing Centre, New Delhi',
        email: 'dr.neha@aarogyaspeech.ai',
        phone: '+91 98110 54321',
        bio: 'Over 11 years of clinical experience specializing in pediatric speech sound disorders, functional misarticulation, and bilingual language development.',
        specializations: ['Functional Misarticulation', 'Phonological Processes', 'Pediatric Speech Clarity', 'Devanagari Articulation'],
        verified: true,
      },
    ];

    // 4. Digital Twin Speech Profile
    this.digitalTwins['ch_1'] = {
      id: 'dt_1',
      childId: 'ch_1',
      overallMasteryScore: 0.72,
      phonemes: {
        'k': {
          phoneme: 'k',
          symbolHindi: 'क',
          ipa: '/k/',
          category: 'Velar',
          overallMastery: 0.58,
          initialMastery: 0.52,
          medialMastery: 0.65,
          finalMastery: 0.57,
          totalAttempts: 34,
          correctCount: 20,
          lastPracticed: '2026-09-18T16:20:00Z',
          status: 'Needs Focus',
        },
        'kh': {
          phoneme: 'kh',
          symbolHindi: 'ख',
          ipa: '/kʰ/',
          category: 'Velar',
          overallMastery: 0.62,
          initialMastery: 0.60,
          medialMastery: 0.64,
          finalMastery: 0.62,
          totalAttempts: 18,
          correctCount: 11,
          lastPracticed: '2026-09-17T15:10:00Z',
          status: 'In Progress',
        },
        'g': {
          phoneme: 'g',
          symbolHindi: 'ग',
          ipa: '/ɡ/',
          category: 'Velar',
          overallMastery: 0.78,
          initialMastery: 0.80,
          medialMastery: 0.76,
          finalMastery: 0.78,
          totalAttempts: 25,
          correctCount: 20,
          lastPracticed: '2026-09-19T11:00:00Z',
          status: 'Mastered',
        },
        'p': {
          phoneme: 'p',
          symbolHindi: 'प',
          ipa: '/p/',
          category: 'Bilabial',
          overallMastery: 0.89,
          initialMastery: 0.92,
          medialMastery: 0.86,
          finalMastery: 0.89,
          totalAttempts: 28,
          correctCount: 25,
          lastPracticed: '2026-09-18T10:15:00Z',
          status: 'Mastered',
        },
        'b': {
          phoneme: 'b',
          symbolHindi: 'ब',
          ipa: '/b/',
          category: 'Bilabial',
          overallMastery: 0.85,
          initialMastery: 0.88,
          medialMastery: 0.82,
          finalMastery: 0.85,
          totalAttempts: 20,
          correctCount: 17,
          lastPracticed: '2026-09-16T14:30:00Z',
          status: 'Mastered',
        },
        't': {
          phoneme: 't',
          symbolHindi: 'त',
          ipa: '/t̪/',
          category: 'Dental',
          overallMastery: 0.82,
          initialMastery: 0.85,
          medialMastery: 0.80,
          finalMastery: 0.81,
          totalAttempts: 30,
          correctCount: 25,
          lastPracticed: '2026-09-19T09:12:00Z',
          status: 'Mastered',
        },
        's': {
          phoneme: 's',
          symbolHindi: 'स',
          ipa: '/s/',
          category: 'Sibilant',
          overallMastery: 0.49,
          initialMastery: 0.45,
          medialMastery: 0.52,
          finalMastery: 0.50,
          totalAttempts: 40,
          correctCount: 20,
          lastPracticed: '2026-09-19T14:40:00Z',
          status: 'Needs Focus',
        },
        'sh': {
          phoneme: 'sh',
          symbolHindi: 'श',
          ipa: '/ʃ/',
          category: 'Sibilant',
          overallMastery: 0.64,
          initialMastery: 0.61,
          medialMastery: 0.67,
          finalMastery: 0.64,
          totalAttempts: 22,
          correctCount: 14,
          lastPracticed: '2026-09-17T12:00:00Z',
          status: 'In Progress',
        },
      },
      difficultSounds: ['क (/k/)', 'स (/s/)'],
      commonErrorPatterns: [
        'Velar Fronting (/k/ → [t]): e.g., "कमल" spoken as "तमल"',
        'Interdental Lisping (/s/ → [θ]): slight tongue protrusion on sibilants',
      ],
      currentDifficultyLadder: 'Word',
      frustrationScore: 0.15,
      recommendedDailyActivity: {
        targetPhoneme: 'k',
        wordHindi: 'कमल',
        exerciseType: 'word_flashcard',
        reason: 'ध्वनि /k/ की प्रारंभिक स्थिति में 52% निपुणता है। न्यूनतम युग्म अभ्यास की अनुशंसा है।',
      },
      lastUpdated: '2026-09-19T14:45:00Z',
    };

    // 5. Courses
    this.courses = [
      {
        id: 'crs_velars',
        titleHindi: 'कंठ्य ध्वनियाँ (Velar Sounds)',
        titleEnglish: 'Back of the Tongue Sounds: क, ख, ग, घ',
        description: 'गले और जीभ के पिछले हिस्से से बोली जाने वाली ध्वनियों का सटीक अभ्यास। विशेष रूप से /k/ और /kh/ के फ्रंटिंग सुधार के लिए।',
        category: 'Articulatory Placement',
        targetPhonemes: ['k', 'kh', 'g', 'gh'],
        level: 'Foundation',
        icon: '🗣️',
        modulesCount: 3,
        totalLessons: 8,
        xpReward: 350,
        progressPercent: 65,
      },
      {
        id: 'crs_sibilants',
        titleHindi: 'ऊष्म एवं सीटी ध्वनियाँ (Sibilants & Fricatives)',
        titleEnglish: 'Hissing & Whispering Sounds: स, श, ष',
        description: 'दांतों और जीभ की नोक के बीच वायु प्रवाह का अभ्यास। लिसपिंग (तोतलेपन) और अस्पष्ट "स" के सुधार हेतु।',
        category: 'Acoustic Control',
        targetPhonemes: ['s', 'sh'],
        level: 'Intermediate',
        icon: '🌬️',
        modulesCount: 2,
        totalLessons: 6,
        xpReward: 300,
        progressPercent: 40,
      },
      {
        id: 'crs_bilabials',
        titleHindi: 'ओष्ठ्य ध्वनियाँ (Bilabials)',
        titleEnglish: 'Lip-Popping Sounds: प, फ, ब, भ, म',
        description: 'दोनों होंठों के मिलन से उत्पन्न होने वाली ध्वनियों का अभ्यास। स्पष्टता और वायु-दाब नियंत्रण।',
        category: 'Motor Speech',
        targetPhonemes: ['p', 'ph', 'b', 'bh', 'm'],
        level: 'Beginner',
        icon: '👄',
        modulesCount: 2,
        totalLessons: 5,
        xpReward: 250,
        progressPercent: 90,
      },
      {
        id: 'crs_minimal_pairs',
        titleHindi: 'न्यूनतम युग्म अभ्यास (Minimal Pairs)',
        titleEnglish: 'Acoustic Discrimination: क vs त & प vs ब',
        description: 'मिलते-जुलते शब्दों के अंतर को पहचानना और बोलना (उदा: कमल vs तमल, पाल vs बाल)।',
        category: 'Phonological Contrast',
        targetPhonemes: ['k', 't', 'p', 'b'],
        level: 'Intermediate',
        icon: '⚖️',
        modulesCount: 3,
        totalLessons: 6,
        xpReward: 400,
        progressPercent: 50,
      },
    ];

    // 6. Lessons for Course 1 (Velars)
    this.lessons['crs_velars'] = [
      {
        id: 'lsn_k_isolation',
        courseId: 'crs_velars',
        titleHindi: 'ध्वनि पहचान: क (कौआ, केला)',
        titleEnglish: 'Phoneme Isolation: /k/ Sound',
        targetPhoneme: 'k',
        soundPosition: 'initial',
        description: 'जीभ को पीछे खींचकर तालू से स्पर्श करें और /क/ ध्वनि का एकाकी अभ्यास करें।',
        exercisesCount: 4,
        xpReward: 40,
        completed: true,
      },
      {
        id: 'lsn_k_initial_words',
        courseId: 'crs_velars',
        titleHindi: 'शुरुआती क वाले शब्द (कमल, कान, किताब)',
        titleEnglish: 'Initial /k/ Words Flashcards',
        targetPhoneme: 'k',
        soundPosition: 'initial',
        description: 'शब्दों की शुरुआत में /क/ ध्वनि को स्पष्टता से बोलने का अभ्यास।',
        exercisesCount: 5,
        xpReward: 50,
        completed: true,
      },
      {
        id: 'lsn_k_medial_words',
        courseId: 'crs_velars',
        titleHindi: 'मध्यवर्ती क वाले शब्द (मकान, दुकान, चकरी)',
        titleEnglish: 'Medial /k/ Words Practice',
        targetPhoneme: 'k',
        soundPosition: 'medial',
        description: 'शब्द के बीच में /क/ ध्वनि की निरंतरता बनाए रखें।',
        exercisesCount: 4,
        xpReward: 50,
        completed: false,
      },
      {
        id: 'lsn_k_sentences',
        courseId: 'crs_velars',
        titleHindi: 'क के छोटे वाक्य (कमल तालाब में है)',
        titleEnglish: 'Short Sentences with /k/',
        targetPhoneme: 'k',
        soundPosition: 'all',
        description: 'वाक्य के प्रवाह में /क/ ध्वनि का स्वाभाविक उच्चारण।',
        exercisesCount: 3,
        xpReward: 60,
        completed: false,
      },
    ];

    // 7. Exercises for Initial /k/ Lesson
    this.exercises['lsn_k_initial_words'] = [
      {
        id: 'ex_k_1',
        lessonId: 'lsn_k_initial_words',
        type: 'word_flashcard',
        promptHindi: 'चित्र देखकर बोलें: कमल',
        targetWord: 'कमल',
        targetPhoneme: 'k',
        meaningEnglish: 'Lotus (Flower)',
        audioExemplarText: 'कमल (ka-ma-la)',
        imageUrl: '🪷',
        sentenceContext: 'कमल भारत का राष्ट्रीय पुष्प है।',
      },
      {
        id: 'ex_k_2',
        lessonId: 'lsn_k_initial_words',
        type: 'word_flashcard',
        promptHindi: 'चित्र देखकर बोलें: किताब',
        targetWord: 'किताब',
        targetPhoneme: 'k',
        meaningEnglish: 'Book',
        audioExemplarText: 'किताब (ki-taa-ba)',
        imageUrl: '📚',
        sentenceContext: 'मुझे नई किताब पढ़ना पसंद है।',
      },
      {
        id: 'ex_k_3',
        lessonId: 'lsn_k_initial_words',
        type: 'word_flashcard',
        promptHindi: 'चित्र देखकर बोलें: केला',
        targetWord: 'केला',
        targetPhoneme: 'k',
        meaningEnglish: 'Banana',
        audioExemplarText: 'केला (ke-laa)',
        imageUrl: '🍌',
        sentenceContext: 'केला मीठा और पौष्टिक फल है।',
      },
      {
        id: 'ex_k_4',
        lessonId: 'lsn_k_initial_words',
        type: 'quiz',
        promptHindi: 'इनमें से किस शब्द की शुरुआत "क" ध्वनि से होती है?',
        targetWord: 'कान',
        targetPhoneme: 'k',
        meaningEnglish: 'Ear',
        audioExemplarText: 'कान (kaa-na)',
        options: ['कान', 'पान', 'तान', 'दान'],
        correctAnswer: 'कान',
      },
    ];

    // 8. Community Posts
    this.communityPosts = [
      {
        id: 'post_1',
        authorId: 'usr_therapist_1',
        authorName: 'डॉ. नेहा वर्मा (SLP)',
        authorRole: 'therapist',
        authorAvatar: '👩‍⚕️',
        title: 'घर पर /क/ ध्वनि के अभ्यास के 3 सरल खेल (Fronting Mitigation)',
        content: 'यदि आपका बच्चा /क/ के स्थान पर /त/ बोलता है (जैसे कमल को तमल), तो जीभ की नोक को नीचे रखने के लिए "गार्गल गेम" या "का-का कौआ" खेल खेलें। बच्चे को दर्पण में देखकर गले के पीछे की आवाज़ का अनुभव कराएं।',
        category: 'tips',
        likesCount: 24,
        commentsCount: 6,
        createdAt: '2026-09-17T11:30:00Z',
        isPinned: true,
      },
      {
        id: 'post_2',
        authorId: 'usr_parent_1',
        authorName: 'प्रिया शर्मा (आरव की माता)',
        authorRole: 'parent',
        authorAvatar: '👩',
        title: 'सफलता की कहानी: आरव ने पहली बार "किताब" बिल्कुल स्पष्ट बोला! 🎉',
        content: 'ध्वनि बगीचा खेल और दैनिक 10 मिनट के अभ्यास से आरव का आत्मविश्वास बहुत बढ़ा है। पहले वह "तिताब" कहता था, लेकिन कल उसने पूरे वाक्य में स्पष्ट "किताब" बोला। सभी अभिभावकों को धैर्य रखने की सलाह देती हूँ!',
        category: 'success_story',
        likesCount: 38,
        commentsCount: 9,
        createdAt: '2026-09-18T18:40:00Z',
      },
    ];

    // 9. Notifications
    this.notifications = [
      {
        id: 'notif_1',
        userId: 'usr_child_1',
        title: 'दैनिक ध्वनि बगीचा तैयार है! 🌱',
        message: 'आज का 10 मिनट का अभ्यास पूरा करें और 50 जादुई अंक (XP) प्राप्त करें।',
        type: 'practice_reminder',
        isRead: false,
        createdAt: '2026-09-19T09:00:00Z',
      },
      {
        id: 'notif_2',
        userId: 'usr_parent_1',
        title: 'साप्ताहिक प्रगति रिपोर्ट उपलब्ध है 📊',
        message: 'आरव ने इस सप्ताह 5 दिन अभ्यास किया। /k/ ध्वनि में 12% सुधार दर्ज किया गया।',
        type: 'weekly_report',
        isRead: false,
        createdAt: '2026-09-18T19:00:00Z',
      },
      {
        id: 'notif_3',
        userId: 'usr_parent_1',
        title: 'डॉ. नेहा वर्मा द्वारा नया गृहकार्य निर्धारित 📝',
        message: 'सप्ताह 3: न्यूनतम युग्म "कमल vs तमल" का 5 बार अभ्यास।',
        type: 'therapist_note',
        isRead: true,
        createdAt: '2026-09-17T16:00:00Z',
      },
    ];

    // 10. Audit Logs
    this.auditLogs = [
      {
        id: 'aud_1',
        actorId: 'usr_parent_1',
        actorName: 'Priya Sharma',
        actorRole: 'parent',
        action: 'CONSENT_GRANTED',
        targetResource: 'ChildProfile:ch_1',
        details: 'DPDP-compliant verifiable parental consent granted for voice capture & analysis.',
        timestamp: '2026-08-01T09:45:00Z',
      },
      {
        id: 'aud_2',
        actorId: 'sys_cron',
        actorName: 'Automated Lifecycle Worker',
        actorRole: 'system',
        action: 'TTL_PURGE_SUCCESS',
        targetResource: 'AudioStorage:24h_vault',
        details: 'Hard-deleted 18 raw PCM files older than 24 hours. Zero biometrics retained.',
        timestamp: '2026-09-19T00:00:00Z',
      },
    ];
  }

  // Helper Methods
  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getChildByUserId(userId: string): ChildProfile | undefined {
    return this.children.find(c => c.userId === userId);
  }

  getChildById(id: string): ChildProfile | undefined {
    return this.children.find(c => c.id === id);
  }

  getDigitalTwin(childId: string): DigitalTwinProfile | undefined {
    return this.digitalTwins[childId];
  }

  updateDigitalTwin(childId: string, updated: DigitalTwinProfile) {
    this.digitalTwins[childId] = updated;
  }

  createRecording(record: AudioRecordingRecord) {
    this.recordings.push(record);
  }

  deleteRecording(recordingId: string, actorId: string) {
    const rec = this.recordings.find(r => r.id === recordingId);
    if (rec) {
      rec.deletedAt = new Date().toISOString();
      rec.status = 'hard_deleted';
      this.auditLogs.push({
        id: 'aud_' + Date.now(),
        actorId,
        actorName: 'User/Parent',
        actorRole: 'parent',
        action: 'AUDIO_HARD_DELETE',
        targetResource: `AudioRecording:${recordingId}`,
        details: 'Voice recording deleted immediately upon parent request.',
        timestamp: new Date().toISOString(),
      });
      return true;
    }
    return false;
  }

  deleteAllChildRecordings(childId: string, actorId: string): number {
    let count = 0;
    this.recordings.forEach(r => {
      if (r.childId === childId && r.status === 'active') {
        r.deletedAt = new Date().toISOString();
        r.status = 'hard_deleted';
        count++;
      }
    });
    this.auditLogs.push({
      id: 'aud_' + Date.now(),
      actorId,
      actorName: 'User/Parent',
      actorRole: 'parent',
      action: 'ALL_AUDIO_CASCADE_DELETE',
      targetResource: `Child:${childId}`,
      details: `Purged all ${count} active voice recordings for child under DPDP right to erasure.`,
      timestamp: new Date().toISOString(),
    });
    return count;
  }
}

export const db = new Database();
