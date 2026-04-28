export const ROLES = {
  VOLUNTEER: 'volunteer',
  COORDINATOR: 'coordinator',
  ADMIN: 'admin'
};

export const OPPORTUNITY_STATUS = {
  OPEN: 'open',
  FULL: 'full',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn'
};

export const ATTENDANCE_STATUS = {
  REGISTERED: 'registered',
  CHECKED_IN: 'checked_in',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show'
};

export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  COMPLETED: 'completed'
};

export const CATEGORIES = [
  'education',
  'health',
  'environment',
  'community',
  'tech',
  'other'
];

export const ROUTES = {
  LANDING: '/',
  ROLE_SELECT: '/role-select',
  ONBOARDING: '/onboarding',
  VOLUNTEER_DASHBOARD: '/volunteer',
  OPPORTUNITY_DETAIL: '/opportunity/:id',
  COORDINATOR_DASHBOARD: '/coordinator',
  IMPACT_REPORT: '/report/:id',
  PROFILE: '/profile'
};

export const DAYS_OF_WEEK = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const SKILL_SUGGESTIONS = [
  'Teaching', 'First Aid', 'Python', 'Data Entry', 'Communication',
  'Leadership', 'Event Planning', 'Photography', 'Social Media',
  'Counseling', 'Translation', 'Driving', 'Cooking', 'Gardening',
  'Web Development', 'Graphic Design', 'Public Speaking', 'Fundraising',
  'Healthcare', 'Legal Aid', 'Child Care', 'Elderly Care',
  'Environmental Science', 'Agriculture', 'Music', 'Sports Coaching',
  'Mentoring', 'Data Analysis', 'Writing', 'Attention to Detail'
];
