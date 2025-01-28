import { client } from '../sanity/lib/client'

async function seedPricingData() {
  try {
    // Create adult pricing category
    await client.create({
      _type: 'pricing',
      category: 'adult',
      plans: [
        {
          name: 'Monthly Unlimited',
          price: '150',
          perMonth: true,
          features: [
            'Unlimited BJJ Classes',
            'Access to All Adult Programs',
            'Open Mat Sessions',
            'Competition Training'
          ],
          highlighted: true
        },
        {
          name: 'Annual Membership',
          price: '1500',
          perMonth: false,
          features: [
            'Best Value - Save $300/year',
            'Unlimited BJJ Classes',
            'Access to All Adult Programs',
            'Open Mat Sessions',
            'Competition Training',
            'Free Gi'
          ],
          highlighted: false
        },
        {
          name: 'Drop-In Class',
          price: '25',
          perMonth: false,
          features: [
            'Single Class Access',
            'No Commitment Required',
            'Great for Visitors',
            'Available for Any Class Time'
          ],
          highlighted: false
        }
      ]
    })

    // Create kids pricing category
    await client.create({
      _type: 'pricing',
      category: 'kids',
      plans: [
        {
          name: 'Kids Monthly',
          price: '120',
          perMonth: true,
          features: [
            'Structured Learning Environment',
            'Age-Appropriate Training',
            'Character Development',
            'Physical Fitness'
          ],
          highlighted: true
        },
        {
          name: 'Kids Annual',
          price: '1200',
          perMonth: false,
          features: [
            'Save $240/year',
            'Structured Learning Environment',
            'Age-Appropriate Training',
            'Character Development',
            'Physical Fitness',
            'Free Kids Gi'
          ],
          highlighted: false
        },
        {
          name: 'Family Plan',
          price: '250',
          perMonth: true,
          features: [
            'Up to 3 Family Members',
            'Access to All Programs',
            'Flexible Schedule',
            'Build Family Bonds'
          ],
          highlighted: false
        }
      ]
    })

    console.log('Successfully seeded pricing data')
  } catch (error) {
    console.error('Error seeding pricing data:', error)
  }
}

seedPricingData()
