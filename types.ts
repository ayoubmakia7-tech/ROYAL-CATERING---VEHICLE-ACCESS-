export interface Vehicle {
  id: string;
  vehicleNo: string;
  type: 'VISITOR' | 'RESIDENT' | 'UNAUTHORIZED' | 'STAFF' | 'BLACK LIST' | string;
  name: string;
  company: string;
  room: string;
  purpose: string;
  contact: string;
  gatePass: boolean;
  reaction: 'ALLOWED' | 'NOT ALLOWED' | 'NEED PERMISSION' | string;
  reactionStatus: 'success' | 'danger' | 'warning'; // Derived helper for UI colors
}

export type FilterStatus = 'ALL' | 'ALLOWED' | 'NOT ALLOWED' | 'NEED PERMISSION';
