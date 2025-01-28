interface ResponseData {
  keywords: string[];
  response: string;
}

export const responses: ResponseData[] = [
  {
    keywords: ['schedule', 'class', 'time', 'when'],
    response: `Our classes run throughout the week:
• Adult BJJ classes are held daily
• Kids programs (ages 4-15) run in the afternoon
• Women's Fitness classes: 9:00 AM (Tue-Fri)
• Women's Self Defense: First Saturdays at 5:30 PM
• Open Mat: Sundays at 12:00 PM

Check our schedule page for detailed timings!`
  },
  {
    keywords: ['kids', 'children', 'youth', 'tiny'],
    response: `We offer two youth programs:
• Tiny Kids (ages 4-5): Focus on basic movements and fun exercises
• Kids Program (ages 6+): Build confidence and discipline

Classes are scheduled in the afternoon to accommodate school schedules.`
  },
  {
    keywords: ['women', 'womens'],
    response: `We offer dedicated women's programs:
• Women's Fitness: Weekday mornings at 9:00 AM
• Women's Self Defense: First Saturday monthly at 5:30 PM

Join our supportive community focused on fitness and self-defense!`
  },
  {
    keywords: ['price', 'cost', 'membership', 'fee'],
    response: `We offer flexible membership options:
• Monthly and annual plans available
• Family discounts
• Military/First Responder discounts
• Student rates

Visit our pricing page for current rates!`
  },
  {
    keywords: ['gi', 'uniform', 'wear', 'bring', 'need'],
    response: `For training gear:
• Gi Classes: BJJ gi required (can be borrowed for first class)
• No-Gi Classes: Rash guard and shorts/spats
• All Classes: Water bottle and flip-flops recommended

We also have gis available for purchase at the academy.`
  },
  {
    keywords: ['beginner', 'new', 'start', 'experience'],
    response: `Welcome to BJJ! We love beginners:
• All skill levels welcome
• Fundamentals taught in every class
• Friendly, supportive environment
• Free trial class available

Come try a class and start your journey!`
  },
  {
    keywords: ['competition', 'compete', 'tournament', 'team'],
    response: `Our Competition Team program includes:
• Advanced training
• Competition-specific drilling
• Tournament preparation
• Team support system

Speak with an instructor about joining the team!`
  },
  {
    keywords: ['private', 'personal', '1on1', 'one on one'],
    response: `Private training available:
• One-on-one instruction
• Personalized curriculum
• Flexible scheduling
• Accelerated learning

Contact us to schedule your private session!`
  },
  {
    keywords: ['instructor', 'coach', 'markangelo', 'lovitt'],
    response: `Markangelo Lovitt is our head instructor:
• Brown Belt in BJJ
• 12+ years of experience
• Focus on technical excellence
• Emphasis on personal growth

Come meet him at the academy!`
  },
  {
    keywords: ['contact', 'location', 'phone', 'email', 'address'],
    response: `Get in touch:
• Phone: (555) 123-4567
• Email: info@lovittsbjj.com
• Social: @lovittsbjj

We'd love to hear from you!`
  }
];

export function findResponse(message: string): string {
  const lowercaseMessage = message.toLowerCase();
  
  // Find the response with the most keyword matches
  let bestMatch = {
    response: `I can help you with information about:
• Class Schedule
• Programs (Adults, Kids, Women's)
• Membership Options
• Training Requirements
• Competition Team
• Private Training

What would you like to know more about?`,
    matchCount: 0
  };

  responses.forEach(item => {
    const matchCount = item.keywords.filter(keyword => 
      lowercaseMessage.includes(keyword.toLowerCase())
    ).length;

    if (matchCount > bestMatch.matchCount) {
      bestMatch = {
        response: item.response,
        matchCount
      };
    }
  });

  return bestMatch.response;
}
