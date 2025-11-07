import { MentorQuestionModel } from "../models/timeline.models";

export function getMentorQuestions(): MentorQuestionModel[] {
  const mentorQuestions: MentorQuestionModel[] = [

    {
      question: 'How many *hours per week* are you willing to work on this goal?',
      key: 'time_commitment',
      label: 'Weekly time and energy commitment',
      meaning: 'Represents how much time and energy the user is ready to consistently invest each week toward achieving their goal.',
      options: [
        {
          icon: '1-3',
          title: 'Hours',
          value: '1-3_hours_per_week_low_commitment',
          description:
            'You’ll have limited time each week, but you’ll still make space for what matters. Even short, focused sessions will move you forward if you stay consistent. It’ll be a gentle rhythm — enough to keep your dream alive week by week.',
        },
        {
          icon: '4-6',
          title: 'Hours',
          value: '4-6_hours_per_week_light_commitment',
          description:
            'You’ll set aside a steady amount of time to stay connected to your goal. Each session will help you reflect, refocus, and see small steps add up. With intention guiding your effort, every hour will count.',
        },
        {
          icon: '7-9',
          title: 'Hours',
          value: '7-9_hours_per_week_moderate_commitment',
          description:
            'You’ll build a balanced pace of progress — enough time to see meaningful results without losing stability. These hours will strengthen your habits and sense of direction. Your journey will feel productive yet sustainable.',
        },
        {
          icon: '10-14',
          title: 'Hours',
          value: '10-14_hours_per_week_strong_commitment',
          description:
            'You’ll be treating your goal as a serious weekly pursuit. Regular focus will turn small wins into solid momentum. The consistency you build will define your path toward long-term success.',
        },
        {
          icon: '15-19',
          title: 'Hours',
          value: '15-19_hours_per_week_high_commitment',
          description:
            'You’ll be dedicating a significant part of your week to real growth. This level of focus will push you past hesitation and into visible transformation. Your steady commitment will start shaping tangible change in your life.',
        },
        {
          icon: '20-29',
          title: 'Hours',
          value: '20-29_hours_per_week_major_commitment',
          description:
            'You’ll be prioritizing your goal as a major part of your routine. Passion and discipline will merge into powerful momentum. At this level, progress will start feeling like a natural part of who you are.',
        },
        {
          icon: '30-39',
          title: 'Hours',
          value: '30-39_hours_per_week_near_full_time',
          description:
            'You’ll be approaching your goal with near full-time energy. Each week will bring challenges, breakthroughs, and real movement toward mastery. You’ll feel your dedication turning into visible progress.',
        },
        {
          icon: '40+',
          title: 'Hours',
          value: '40+_hours_per_week_full_commitment',
          description:
            'You’ll be fully committed — living and breathing your ambition each week. This path will demand focus, courage, and persistence, but the rewards will match your drive. You’ll be shaping your future with every hour you invest.',
        },
      ],
      answer: null,
    },

    {
      "question": "What is your current *experience* level with this goal?",
      "key": "experience_level",
      "label": "Experience level for this goal",
      "meaning": "Represents how familiar the user already is with the goal. Helps shape the difficulty, pacing, and depth of the path steps so they match the user’s real starting point.",
      "options": [
        {
          "icon": '<i class="fa-solid fa-book"></i>',
          "title": "Complete Beginner",
          "value": "experience_complete_beginner",
          "description": "You’re starting from scratch, with little to no prior exposure. This path will begin with simple, approachable steps that build confidence and clarity before introducing anything complex. It’s the perfect place to grow steadily and safely."
        },
        {
          "icon": '<i class="fa-solid fa-chess-pawn"></i>',
          "title": "Basic Familiarity",
          "value": "experience_basic_familiarity",
          "description": "You have a light understanding of the area and some awareness of its core ideas. Maybe you’ve explored a bit, tried small actions, or gained a general sense of what the journey involves. This path will reinforce your foundation while helping you build steady confidence and direction."
        },
        {
          "icon": '<i class="fa-solid fa-chess-knight"></i>',
          "title": "Intermediate",
          "value": "experience_intermediate",
          "description": "You have practical experience and know your way around the basics. You’re ready for more structured progress, more challenging tasks, and deeper refinement to push past plateaus and expand your capabilities."
        },
        {
          "icon": '<i class="fa-solid fa-chess-rook"></i>',
          "title": "Advanced",
          "value": "experience_advanced",
          "description": "You’re already skilled, with meaningful experience. This path will focus on mastery, efficiency, and sharpening your strengths through higher-level strategies and specialized techniques that match your expertise."
        },
        {
          "icon": '<i class="fa-solid fa-chess-queen"></i>',
          "title": "Professional",
          "value": "experience_expert_professional",
          "description": "You operate at a high level with deep knowledge and proven experience. This path will challenge you with visionary goals, optimization strategies, and ways to scale your impact. It’s about breakthroughs, innovation, and pushing the limits of what’s possible."
        }
      ],
      "answer": null
    },

    {
      question: '*Solo* focus or *team* energy - what drives you?',
      key: 'collaboration_style',
      label: 'Preferred collaboration approach',
      meaning:
        'Represents whether the user is more energized and effective working independently or collaboratively with others.',
      options: [
        {
          icon: '<i class="fa-solid fa-street-view"></i>',
          title: 'Solo',
          value: 'solo_work_independent_focus',
          description:
            'You’ll work independently, relying on your own focus and discipline. This path gives you full control over your pace, priorities, and creative flow. It may feel isolating at times, but it strengthens your self-direction and clarity of purpose.',
        },
        {
          icon: '<i class="fa-solid fa-handshake-angle"></i>',
          title: 'Hybrid',
          value: 'hybrid_work_mix_independent_and_collab',
          description:
            'You’ll mix independent effort with moments of collaboration. This balance will let you stay self-reliant while gaining perspective and motivation from others. It’s a flexible approach that blends personal freedom with shared energy.',
        },
        {
          icon: '<i class="fa-solid fa-people-group"></i>',
          title: 'Social',
          value: 'social_work_team_driven_growth',
          description:
            'You’ll thrive through connection, teamwork, and shared inspiration. Working with others will keep ideas flowing and motivation high. While it may require compromise and coordination, this path brings energy from community and collective growth.',
        },
      ],
      answer: null,
    },

    {
      question: 'Do you prefer a *steady* path or one that takes *bold* leaps forward?',
      key: 'risk_style',
      label: 'Approach to risk and pace',
      meaning:
        'Represents the user’s attitude toward risk and how they want their progress to unfold — steady and predictable or bold and high-impact.',
      options: [
        {
          icon: '<i class="fa-solid fa-shield"></i>',
          title: 'Conservative',
          value: 'conservative_path_low_risk',
          description:
            'You’ll take a steady path where each step is secure and well-planned. Progress will build through reliability, patience, and proven methods. It’s the safest way forward — less excitement, but a strong chance of reaching your goal.',
        },
        {
          icon: '<i class="fa-solid fa-scale-balanced"></i>',
          title: 'Balanced',
          value: 'balanced_path_moderate_risk',
          description:
            'You’ll move forward with a mix of caution and confidence. Some moments will call for careful judgment, others for bold action — and you’ll know how to find that middle ground. This path offers stable progress with just enough flexibility to grow.',
        },
        {
          icon: '<i class="fa-solid fa-compass"></i>',
          title: 'Adaptive',
          value: 'adaptive_path_flexible_strategy',
          description:
            'You’ll stay flexible, learning to adjust your course as conditions change. Not every move will be perfect, but each one will teach you something useful. This mindset will help you turn uncertainty into opportunity while staying grounded.',
        },
        {
          icon: '<i class="fa-solid fa-fire"></i>',
          title: 'Bold',
          value: 'bold_path_high_risk_high_reward',
          description:
            'You’ll take daring steps and trust your instincts when opportunity appears. Some risks may not pay off, but the lessons will sharpen your strategy and courage. It’s a path for those who seek growth through challenge and action.',
        },
        {
          icon: '<i class="fa-solid fa-mountain-sun"></i>',
          title: 'Adventurous',
          value: 'adventurous_path_risk_taker',
          description:
            'You’ll chase your goal with passion and fearless creativity, venturing beyond what’s familiar. The rewards can be extraordinary, but the path won’t always be predictable or guaranteed. It’s a journey for dreamers who accept risk as the price of discovery.',
        },
      ],
      answer: null,
    },

    {
      "question": "What *pace* of transformation feels right for you?",
      "key": "pace_speed",
      "label": "Preferred transformation pace",
      "meaning": "Defines how fast or gradual the user wants their journey to feel. This influences the size of each step, the level of intensity, and the approximate total number of steps the final path may contain.",
      "options": [
        {
          "icon": '<i class="fa-solid fa-otter"></i>',
          "title": "Gradual Pace",
          "value": "pace_gradual",
          "description": "You prefer a slower progression with fewer, larger steps. Each step is broad and long-lasting, giving you plenty of time to focus deeply before moving to the next phase."
        },
        {
          "icon": '<i class="fa-solid fa-person-hiking"></i>',
          "title": "Steady Pace",
          "value": "pace_steady",
          "description": "You want a relaxed but consistent rhythm. Steps are moderately sized and spaced out, giving you a comfortable amount of time to complete each one without rush."
        },
        {
          "icon": '<i class="fa-solid fa-sailboat"></i>',
          "title": "Balanced Pace",
          "value": "pace_balanced",
          "description": "You prefer an even distribution of progress — a reasonable number of steps with a healthy balance between duration and momentum. Neither too slow nor too fast."
        },
        {
          "icon": '<i class="fa-solid fa-helicopter"></i>',
          "title": "Elevated Pace",
          "value": "pace_elevated",
          "description": "You want faster forward movement with more frequent steps. Each step is smaller and transitions come sooner, keeping momentum active and engaging."
        },
        {
          "icon": '<i class="fa-solid fa-rocket"></i>',
          "title": "Intensive Pace",
          "value": "pace_intensive",
          "description": "You prefer rapid progression with many short steps. The journey moves quickly, with frequent milestones and continuous change, ideal for fast transformation."
        }
      ],
      "answer": null
    },
    
    {
        question: 'What *path* suits you best?',
        key: '',
        label: '',
        meaning: '',
        options: [],
        answer: null
    }
  ];

  return mentorQuestions;
}
