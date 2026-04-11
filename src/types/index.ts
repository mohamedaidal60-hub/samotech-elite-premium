export type Role = 
  | 'super_admin' 
  | 'admin' 
  | 'production_director' 
  | 'trainer' 
  | 'supervisor' 
  | 'teleoperator' 
  | 'quality_agent' 
  | 'project_manager' 
  | 'floor_manager' 
  | 'driver' 
  | 'sector_manager';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  photoUrl?: string;
}

export interface Employee extends User {
  department: 'administration' | 'production' | 'logistics' | 'quality';
  position: string;
  startDate: string;
  joinDate: string;
  status: 'active' | 'on_leave' | 'absent';
  performanceScore: number;
}

export interface Vehicle {
  id: string;
  type: 'small' | 'large';
  model: string;
  licensePlate: string;
  driverId: string;
  status: 'available' | 'on_route' | 'maintenance';
}

export interface CallLog {
  id: string;
  teleoperatorId: string;
  clientId: string;
  timestamp: string;
  duration: number;
  transcription: string;
  status: 'pending_review' | 'validated' | 'rejected' | 'sale_approved';
  isSale: boolean;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'late' | 'absent';
}
