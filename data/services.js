const services = [

  // =============================
  // Admin & Operations
  // =============================
  {
    category: 'Admin & Operations',
    title: 'Administrative Support',
    description: 'Day-to-day administrative assistance to keep your business organized and efficient.',
    duration_mins: 480,
    starting_price: 15.00,
    includes_json: JSON.stringify([
      'Email handling',
      'Calendar management',
      'Data entry',
      'Document preparation',
      'Task coordination'
    ]),
    is_active: 1,
    sort_order: 1
  },
  {
    category: 'Admin & Operations',
    title: 'Calendar & Email Management',
    description: 'Professional inbox and calendar management to save your time.',
    duration_mins: 240,
    starting_price: 12.00,
    includes_json: JSON.stringify([
      'Inbox organization',
      'Email responses',
      'Meeting scheduling',
      'Reminders',
      'Follow-ups'
    ]),
    is_active: 1,
    sort_order: 2
  },
  {
    category: 'Admin & Operations',
    title: 'Data Entry & CRM Management',
    description: 'Accurate data entry and CRM updates for better business tracking.',
    duration_mins: 480,
    starting_price: 14.00,
    includes_json: JSON.stringify([
      'CRM updates',
      'Spreadsheet management',
      'Lead tagging',
      'Data cleanup',
      'Reporting support'
    ]),
    is_active: 1,
    sort_order: 3
  },

  // =============================
  // Customer & Sales
  // =============================
  {
    category: 'Customer & Sales',
    title: 'Customer Support',
    description: 'Reliable customer support via email, chat, and CRM tools.',
    duration_mins: 480,
    starting_price: 18.00,
    includes_json: JSON.stringify([
      'Email support',
      'Live chat support',
      'CRM handling',
      'Customer follow-ups',
      'Issue resolution'
    ]),
    is_active: 1,
    sort_order: 4
  },
  {
    category: 'Customer & Sales',
    title: 'Sales & Lead Generation',
    description: 'Lead generation and sales pipeline support to grow your revenue.',
    duration_mins: 480,
    starting_price: 22.00,
    includes_json: JSON.stringify([
      'Lead sourcing',
      'Cold outreach',
      'CRM updates',
      'Pipeline tracking',
      'Sales reporting'
    ]),
    is_active: 1,
    sort_order: 5
  },
  {
    category: 'Customer & Sales',
    title: 'Appointment Booking & Follow-ups',
    description: 'Scheduling, confirmations, and follow-ups with your clients.',
    duration_mins: 240,
    starting_price: 16.00,
    includes_json: JSON.stringify([
      'Appointment booking',
      'Client reminders',
      'Rescheduling',
      'Confirmation calls',
      'Status updates'
    ]),
    is_active: 1,
    sort_order: 6
  },

  // =============================
  // Marketing & Growth
  // =============================
  {
    category: 'Marketing & Growth',
    title: 'Digital Marketing Support',
    description: 'Marketing assistance to improve online presence and brand visibility.',
    duration_mins: 480,
    starting_price: 20.00,
    includes_json: JSON.stringify([
      'Campaign assistance',
      'Social media support',
      'Analytics tracking',
      'Content scheduling',
      'Performance reports'
    ]),
    is_active: 1,
    sort_order: 7
  },
  {
    category: 'Marketing & Growth',
    title: 'Social Media Management',
    description: 'Social media posting, engagement, and inbox management.',
    duration_mins: 480,
    starting_price: 18.00,
    includes_json: JSON.stringify([
      'Post scheduling',
      'Comment moderation',
      'DM responses',
      'Content calendar',
      'Basic analytics'
    ]),
    is_active: 1,
    sort_order: 8
  },
  {
    category: 'Marketing & Growth',
    title: 'Research & Data Analysis',
    description: 'Market research, competitor analysis, and data reporting.',
    duration_mins: 720,
    starting_price: 20.00,
    includes_json: JSON.stringify([
      'Market research',
      'Competitor analysis',
      'Data collection',
      'Reports & insights',
      'Summary presentations'
    ]),
    is_active: 1,
    sort_order: 9
  },

  // =============================
  // Finance & HR
  // =============================
  {
    category: 'Finance & HR',
    title: 'Bookkeeping & Accounting',
    description: 'Accurate bookkeeping and financial record management.',
    duration_mins: 480,
    starting_price: 25.00,
    includes_json: JSON.stringify([
      'Expense tracking',
      'Invoice management',
      'Bank reconciliation',
      'QuickBooks/Xero support',
      'Monthly reports'
    ]),
    is_active: 1,
    sort_order: 10
  },
  {
    category: 'Finance & HR',
    title: 'HR & Recruitment Support',
    description: 'Hiring and HR operational assistance.',
    duration_mins: 480,
    starting_price: 24.00,
    includes_json: JSON.stringify([
      'Resume screening',
      'Interview scheduling',
      'Candidate coordination',
      'HR documentation',
      'Onboarding support'
    ]),
    is_active: 1,
    sort_order: 11
  },
  {
    category: 'Finance & HR',
    title: 'Payroll & Invoice Management',
    description: 'Payroll preparation and billing support.',
    duration_mins: 240,
    starting_price: 22.00,
    includes_json: JSON.stringify([
      'Payroll preparation',
      'Payslip generation',
      'Invoice creation',
      'Payment tracking',
      'Compliance support'
    ]),
    is_active: 1,
    sort_order: 12
  },

  // =============================
  // Tech & Automation
  // =============================
  {
    category: 'Tech & Automation',
    title: 'IT & Tech Support',
    description: 'Technical support for tools, systems, and websites.',
    duration_mins: 480,
    starting_price: 30.00,
    includes_json: JSON.stringify([
      'Tool setup',
      'Troubleshooting',
      'Website updates',
      'CMS support',
      'Basic automation'
    ]),
    is_active: 1,
    sort_order: 13
  },
  {
    category: 'Tech & Automation',
    title: 'Website Management',
    description: 'Website updates and maintenance using no-code platforms.',
    duration_mins: 240,
    starting_price: 26.00,
    includes_json: JSON.stringify([
      'Content updates',
      'Page edits',
      'Plugin updates',
      'Performance checks',
      'Backup support'
    ]),
    is_active: 1,
    sort_order: 14
  },
  {
    category: 'Tech & Automation',
    title: 'Automation Setup Support',
    description: 'Workflow automation using Zapier, Make, and Google tools.',
    duration_mins: 720,
    starting_price: 35.00,
    includes_json: JSON.stringify([
      'Workflow automation',
      'Zapier setup',
      'Google Sheets automation',
      'Process optimization',
      'Testing & documentation'
    ]),
    is_active: 1,
    sort_order: 15
  },

  // =============================
  // Personal Assistance
  // =============================
  {
    category: 'Personal Assistance',
    title: 'Personal Task Management',
    description: 'Daily task management and productivity assistance.',
    duration_mins: 240,
    starting_price: 14.00,
    includes_json: JSON.stringify([
      'Task planning',
      'To-do list management',
      'Reminders',
      'Daily scheduling',
      'Progress tracking'
    ]),
    is_active: 1,
    sort_order: 16
  },
  {
    category: 'Personal Assistance',
    title: 'Travel Planning Assistance',
    description: 'End-to-end travel planning and booking support.',
    duration_mins: 240,
    starting_price: 18.00,
    includes_json: JSON.stringify([
      'Flight research',
      'Hotel booking',
      'Itinerary planning',
      'Travel reminders',
      'Document assistance'
    ]),
    is_active: 1,
    sort_order: 17
  },
  {
    category: 'Personal Assistance',
    title: 'Online Research Assistant',
    description: 'Accurate online research and summary preparation.',
    duration_mins: 480,
    starting_price: 16.00,
    includes_json: JSON.stringify([
      'Online research',
      'Data comparison',
      'Summary reports',
      'Source validation',
      'Insights delivery'
    ]),
    is_active: 1,
    sort_order: 18
  }

];

const categories = ['All', 'Admin & Operations', 'Customer & Sales', 'Marketing & Growth', 'Finance & HR', 'Tech & Automation', 'Personal Assistance'];

module.exports = { services, categories };

