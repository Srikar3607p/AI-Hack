import { Complaint } from '../models/Complaint.js';
import { ComplaintCluster } from '../models/ComplaintCluster.js';

// Haversine distance in meters
const calculateDistanceMeters = (lon1, lat1, lon2, lat2) => {
  const R = 6371000;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const detectAndSyncClusters = async () => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    if (complaints.length === 0) return [];

    const clusters = [];
    const visited = new Set();

    for (let i = 0; i < complaints.length; i++) {
      const c1 = complaints[i];
      if (visited.has(c1._id.toString())) continue;

      const c1Coords = c1.location?.coordinates || [77.5946, 12.9716];
      const matchedGroup = [c1];
      visited.add(c1._id.toString());

      for (let j = i + 1; j < complaints.length; j++) {
        const c2 = complaints[j];
        if (visited.has(c2._id.toString())) continue;

        if (c1.category === c2.category) {
          const c2Coords = c2.location?.coordinates || [77.5946, 12.9716];
          const dist = calculateDistanceMeters(c1Coords[0], c1Coords[1], c2Coords[0], c2Coords[1]);
          if (dist <= 350) { // within 350 meters
            matchedGroup.push(c2);
            visited.add(c2._id.toString());
          }
        }
      }

      // If 2 or more complaints exist in the same category & location
      if (matchedGroup.length >= 2) {
        const clusterId = `CLUST-${c1.category.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}${i}`;
        const name = `${c1.category} Hotspot - ${c1.location?.ward || 'Ward 12'}`;
        const severity = matchedGroup.length >= 4 ? 'Critical Chronic' : (matchedGroup.length >= 3 ? 'High' : 'Moderate');

        const dates = matchedGroup.map(c => new Date(c.createdAt)).sort((a, b) => a - b);

        clusters.push({
          clusterId,
          name,
          category: c1.category,
          coordinates: c1Coords,
          radiusMeters: 300,
          complaints: matchedGroup.map(c => c._id),
          complaintCount: matchedGroup.length,
          severity,
          ward: c1.location?.ward || 'Ward 12',
          dateRange: { start: dates[0], end: dates[dates.length - 1] },
          affectedCitizensEstimate: matchedGroup.length * 120,
          status: 'Active Recurring',
          mitigationNotes: `AI spatial clustering detected ${matchedGroup.length} related complaints in ${c1.location?.ward || 'Ward 12'}. Recommend comprehensive structural overhaul.`
        });
      }
    }

    // Upsert detected clusters into collection
    for (const cl of clusters) {
      await ComplaintCluster.findOneAndUpdate(
        { category: cl.category, ward: cl.ward },
        cl,
        { upsert: true, new: true }
      );
    }

    return await ComplaintCluster.find().populate('complaints', 'complaintId title status priority createdAt');
  } catch (error) {
    console.error('[Cluster Engine Error]', error);
    return [];
  }
};
