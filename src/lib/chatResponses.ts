interface ChatResponse {
  keywords: string[];
  response: string;
}

const responses: ChatResponse[] = [
  {
    keywords: ['schedule', 'class', 'time', 'classes'],
    response: 'We offer classes throughout the week for all skill levels. You can find our full schedule on our Schedule page. We have morning and evening classes available to accommodate different schedules.'
  },
  {
    keywords: ['price', 'cost', 'pricing', 'membership', 'fee'],
    response: 'We offer flexible membership options to suit your needs. Visit our Pricing page to see our current rates. We also offer family discounts for multiple members training together.'
  },
  {
    keywords: ['beginner', 'new', 'start', 'starting'],
    response: 'We welcome beginners! Our Fundamentals classes are perfect for those just starting their BJJ journey. We provide a supportive environment where you can learn at your own pace.'
  },
  {
    keywords: ['kids', 'children', 'youth', 'junior'],
    response: 'Our Kids program is designed to help children develop confidence, discipline, and self-defense skills. Classes are divided by age groups to ensure appropriate instruction.'
  },
  {
    keywords: ['location', 'address', 'where'],
    response: 'We are conveniently located in the heart of the community. Contact us for specific directions or visit our website for our address and a map.'
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
    keywords: ['gi', 'uniform', 'equipment', 'need'],
    response: 'For your first class, comfortable workout clothes are fine. If you decide to continue, you\'ll need a BJJ gi. We can provide recommendations for quality gis at different price points.'
  }
];

export function findResponse(query: string): string {
  const defaultResponse = "I apologize, but I'm not sure about that. Please contact us directly or visit our website for more information.";
  
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
