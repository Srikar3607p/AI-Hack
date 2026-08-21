export const demoDepartments = [
  {
    name: 'Roads & Infrastructure',
    code: 'ROADS',
    description: 'Responsible for road construction, asphalt repair, potholes, sidewalks, and traffic safety structures.',
    categories: ['Roads & Potholes'],
    slaHours: { Critical: 24, High: 48, Medium: 72, Low: 168 }
  },
  {
    name: 'Sanitation',
    code: 'SAN',
    description: 'Solid waste management, garbage collection, street sweeping, and public cleanliness.',
    categories: ['Waste Management'],
    slaHours: { Critical: 18, High: 36, Medium: 48, Low: 120 }
  },
  {
    name: 'Drainage',
    code: 'DRAIN',
    description: 'Stormwater drains, sewer pipelines, manhole desilting, and flood/waterlogging prevention.',
    categories: ['Drainage'],
    slaHours: { Critical: 24, High: 48, Medium: 72, Low: 168 }
  },
  {
    name: 'Water Supply',
    code: 'WATER',
    description: 'Municipal water distribution, pipeline leak repairs, pressure monitoring, and potability.',
    categories: ['Water Supply'],
    slaHours: { Critical: 12, High: 24, Medium: 48, Low: 96 }
  },
  {
    name: 'Electrical',
    code: 'ELEC',
    description: 'Streetlights, power poles, junction boxes, and public illumination grids.',
    categories: ['Streetlights'],
    slaHours: { Critical: 24, High: 48, Medium: 72, Low: 168 }
  },
  {
    name: 'Public Facilities',
    code: 'PUB_FAC',
    description: 'Public parks, community toilets, bus shelters, playgrounds, and municipal monuments.',
    categories: ['Public Facilities', 'Other'],
    slaHours: { Critical: 48, High: 72, Medium: 120, Low: 240 }
  }
];

export const demoEscalationRules = [
  {
    priority: 'Critical',
    slaHours: 24,
    warningThresholdPercent: 50,
    autoEscalate: true,
    escalationTier1Hours: 0,
    escalationTier2Hours: 12,
    escalationTier3Hours: 24,
    notificationRole: 'SUPER_ADMIN'
  },
  {
    priority: 'High',
    slaHours: 48,
    warningThresholdPercent: 75,
    autoEscalate: true,
    escalationTier1Hours: 0,
    escalationTier2Hours: 24,
    escalationTier3Hours: 48,
    notificationRole: 'ADMIN'
  },
  {
    priority: 'Medium',
    slaHours: 72,
    warningThresholdPercent: 75,
    autoEscalate: true,
    escalationTier1Hours: 0,
    escalationTier2Hours: 48,
    escalationTier3Hours: 72,
    notificationRole: 'ADMIN'
  },
  {
    priority: 'Low',
    slaHours: 168,
    warningThresholdPercent: 80,
    autoEscalate: true,
    escalationTier1Hours: 0,
    escalationTier2Hours: 72,
    escalationTier3Hours: 120,
    notificationRole: 'OFFICER'
  }
];
