interface ChatResponse {
  keywords: string[];
  response: string;
}

const responses: ChatResponse[] = [
  {
    keywords: ['muay', 'thai', 'striking', 'kickboxing'],
    response: 'Our Muay Thai program is $120/month for unlimited classes, or $30 for a drop-in. Classes are held Monday at 7:30pm and Saturday at 8:30am (1 hour each). Wear comfortable athletic clothing, hand wraps, and a mouthguard - no gi required.'
  },
  {
    keywords: ['personal training', 'private', 'one on one', '1 on 1'],
    response: 'Personal training is $300/month for a package or $75 for a single session. Work one-on-one with an experienced instructor for personalized skill development.'
  },
  {
    keywords: ['women', 'woman', 'female', 'self defense', 'self-defense'],
    response: "Our Women's Self Defense program is $120/month for unlimited classes, or $30 for a drop-in. It's a dedicated program focusing on practical self-defense skills in a supportive environment."
  },
  {
    keywords: ['kids', 'children', 'youth', 'junior', 'tiny', 'child'],
    response: 'All Kids programs are $190/month (month-to-month) or $150/month with a 12-month commitment. Drop-in classes are $30. Tiny Kids (ages 4-5) focuses on coordination and life skills, Kids BJJ (ages 7-12) builds discipline and self-defense skills, and Kids BJJ 13+ emphasizes advanced fundamentals and controlled live training.'
  },
  {
    keywords: ['price', 'cost', 'pricing', 'membership', 'fee', 'how much', 'rates', 'payment', 'pay', 'afford', 'money'],
    response: "Here's our pricing:\n- Adult BJJ: $215/mo (or $175/mo with 12-month commitment), $30 drop-in\n- All Kids: $190/mo (or $150/mo with 12-month commitment), $30 drop-in\n- Muay Thai: $120/mo, $30 drop-in\n- Women's Self Defense: $120/mo, $30 drop-in\n- Personal Training: $300/mo or $75/session\n\nVisit our Pricing page for full details."
  },
  {
    keywords: ['schedule', 'class', 'time', 'classes', 'when', 'hour', 'hours'],
    response: 'We offer classes throughout the week for all skill levels. Muay Thai is Monday at 7:30pm and Saturday at 8:30am. Our hours are Mon-Fri 9:00 AM - 9:30 PM, Sat 8:30 AM - 12:00 PM, closed Sunday. Visit our Schedule page for the complete timetable.'
  },
  {
    keywords: ['beginner', 'new', 'start', 'starting', 'first', 'never'],
    response: 'We welcome beginners! Our classes are designed for all skill levels, including complete beginners. No experience is necessary - just show up ready to learn. For your first BJJ class, comfortable workout clothes are fine.'
  },
  {
    keywords: ['adult', 'adults'],
    response: 'Adult BJJ is $215/month (month-to-month) or $175/month with a 12-month commitment. Drop-in classes are $30. Classes cover both gi and no-gi training for all skill levels, focusing on technique, sparring, and competition preparation.'
  },
  {
    keywords: ['location', 'address', 'where', 'find', 'visit', 'directions'],
    response: 'We are located at 2190 Solano Way, Concord, CA 94520. Hours: Mon-Fri 9:00 AM - 9:30 PM, Sat 8:30 AM - 12:00 PM, closed Sunday.'
  },
  {
    keywords: ['gi', 'uniform', 'equipment', 'need', 'wear', 'bring'],
    response: "For BJJ classes, you'll need a gi (uniform). For your first class, comfortable workout clothes are fine. For Muay Thai, wear comfortable athletic clothing, hand wraps, and a mouthguard. We can help with equipment recommendations."
  },
  {
    keywords: ['instructor', 'coach', 'teacher', 'markangelo', 'owner'],
    response: 'Lovitts BJJ is owned and coached by Markangelo Lovitt, a brown belt with 10+ years of training experience. He trained under David Freeman (black belt under Caio Terra) and opened the gym in Concord in 2018.'
  },
  {
    keywords: ['belt', 'promotion', 'rank', 'grading'],
    response: 'Belt promotions are based on skill, dedication, and time training. We follow IBJJF standards and regularly evaluate student progress.'
  },
  {
    keywords: ['competition', 'compete', 'tournament'],
    response: 'We support both recreational and competitive training. Our competition team trains regularly, and we help prepare students who want to compete in tournaments.'
  },
  {
    keywords: ['contact', 'email', 'phone', 'call', 'message', 'reach'],
    response: 'You can reach us at (415) 559-1404 or Markangelolovitt@lovittsjiujitsu.com. Visit us at 2190 Solano Way, Concord, CA 94520.'
  }
];

export function findResponse(query: string): string {
  const defaultResponse = "I'm not sure about that. You can contact us at Markangelolovitt@lovittsjiujitsu.com or call (415) 559-1404 for more info.";
  
  const lowercaseQuery = query.toLowerCase();
  
  // Score each response by counting keyword matches for best-match logic
  let bestMatch: ChatResponse | null = null;
  let bestScore = 0;
  
  for (const response of responses) {
    const score = response.keywords.reduce((count, keyword) => {
      return count + (lowercaseQuery.includes(keyword.toLowerCase()) ? 1 : 0);
    }, 0);
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = response;
    }
  }
  
  return bestMatch ? bestMatch.response : defaultResponse;
}
