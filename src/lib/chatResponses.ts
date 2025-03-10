interface ChatResponse {
  keywords: string[];
  response: string;
}

const responses: ChatResponse[] = [
  {
    keywords: ['schedule', 'class', 'time', 'classes', 'when'],
    response: 'We offer classes throughout the week for all skill levels. Our schedule includes morning and evening classes for BJJ, and Muay Thai classes on Monday at 7:30pm and Saturday at 8:30am. Visit our Schedule page for the complete timetable.'
  },
  {
    keywords: ['price', 'cost', 'pricing', 'membership', 'fee', 'how much', 'rates', 'payment', 'pay', 'afford'],
    response: 'We offer flexible membership options for both adults and kids. Adult plans include Monthly Unlimited ($200/month), Annual Unlimited ($125/month - best value), and Drop-In Classes ($30). Kids programs start at $100/month for annual plans. Visit our Pricing page for complete details and family discounts.'
  },
  {
    keywords: ['beginner', 'new', 'start', 'starting'],
    response: 'We welcome beginners! Our Fundamentals classes are perfect for those just starting their BJJ journey. We provide a supportive environment where you can learn at your own pace. No experience is necessary to begin.'
  },
  {
    keywords: ['kids', 'children', 'youth', 'junior', 'tiny'],
    response: 'We have programs for children of all ages. Our Tiny Kids BJJ (Ages 4-5) helps develop essential life skills and physical coordination, while our Kids BJJ (Ages 6-12) builds physical skills and character through structured training. Visit our website for class schedules.'
  },
  {
    keywords: ['location', 'address', 'where', 'find', 'visit'],
    response: 'We are located at 2190 Solano Way, Concord, CA 94520. You can find directions and a map on our website\'s contact section.'
  },
  {
    keywords: ['belt', 'promotion', 'rank', 'grading'],
    response: 'Belt promotions are based on skill, dedication, and time training. We follow IBJJF standards for promotions and regularly evaluate student progress.'
  },
  {
    keywords: ['competition', 'compete', 'tournament'],
    response: 'We support both recreational and competitive training. Our competition team trains regularly, and we help prepare students who wish to compete in tournaments.'
  },
  {
    keywords: ['gi', 'uniform', 'equipment', 'need', 'wear'],
    response: 'For BJJ classes, you\'ll need a gi (uniform). For your first class, comfortable workout clothes are fine. For Muay Thai classes, wear comfortable athletic clothing, hand wraps, and a mouthguard. We can provide recommendations for quality equipment at different price points.'
  },
  {
    keywords: ['muay', 'thai', 'striking', 'kickboxing'],
    response: 'Our Muay Thai program teaches the "Art of Eight Limbs" with a focus on striking techniques, clinch work, and conditioning. Classes are held Monday evenings at 7:30pm and Saturday mornings at 8:30am. No uniform is required, but participants should wear comfortable athletic clothing, hand wraps, and a mouthguard.'
  },
  {
    keywords: ['instructor', 'coach', 'teacher', 'sensei'],
    response: 'Our instructors are experienced practitioners dedicated to helping you achieve your martial arts goals. They provide personalized attention and create a supportive learning environment for students of all levels.'
  },
  {
    keywords: ['adult', 'adults'],
    response: 'Our Adult BJJ program is suitable for all skill levels. You\'ll learn effective self-defense while improving technique, strength, and mental resilience. Our structured classes and supportive community ensure consistent progress in your martial arts journey.'
  },
  {
    keywords: ['contact', 'email', 'phone', 'call', 'message'],
    response: 'You can contact us by phone at (415) 559-1404 or by email at Markangelolovitt@lovittsjiujitsu.com. You can also visit us at 2190 Solano Way, Concord, CA 94520.'
  }
];

export function findResponse(query: string): string {
  const defaultResponse = "I apologize, but I'm not sure about that. Please contact Markangelo Lovitt directly at Markangelolovitt@lovittsjiujitsu.com or call (415) 559-1404 for more information.";
  
  // Convert query to lowercase for case-insensitive matching
  const lowercaseQuery = query.toLowerCase();
  
  // Find the first response where any keyword matches the query
  const matchedResponse = responses.find(response => 
    response.keywords.some(keyword => 
      lowercaseQuery.includes(keyword.toLowerCase())
    )
  );
  
  return matchedResponse ? matchedResponse.response : defaultResponse;
}
