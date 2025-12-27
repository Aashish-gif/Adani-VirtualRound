import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  User,
  LoginCredentials,
  Equipment,
  Team,
  MaintenanceRequest,
  CalendarEvent,
  CreateRequestForm,
  CreateEquipmentForm,
  CreateTeamForm,
  RequestFilters,
  EquipmentFilters,
  RequestStatus,
  RequestType,
} from '@/types';

// API Base URL - Change this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Only force logout on 401 for non-auth endpoints (avoid loops during init)
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/login', credentials);
    const { data, token } = response.data;
    return {
      user: data,
      token,
    };
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  register: async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/register', data);
    const { data: userData, token } = response.data;
    return {
      user: userData,
      token,
    };
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Users API
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    const items = response.data.data || [];
    return items.map((u: any) => ({
      id: u._id || u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      avatar: u.avatar,
      teamId: u.teamId?._id || u.teamId,
      createdAt: u.createdAt,
    }));
  },

  create: async (data: { name: string; email: string; password: string; role: string; teamId?: string }): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data.data;
  },
};

// Equipment API
export const equipmentApi = {
  getAll: async (filters?: EquipmentFilters): Promise<Equipment[]> => {
    const response = await api.get('/equipment', { params: filters });
    const items = response.data.data || [];
    return items.map((e: any) => ({
      id: e._id || e.id,
      name: e.name,
      description: e.description,
      location: e.location,
      status: e.isScrapped ? 'scrapped' : 'operational',
      teamId: e.maintenanceTeamId?._id || e.maintenanceTeamId,
      team: e.maintenanceTeamId
        ? {
            id: e.maintenanceTeamId._id || e.maintenanceTeamId.id,
            name: e.maintenanceTeamId.name,
            description: e.maintenanceTeamId.description,
            leaderId: e.maintenanceTeamId.leaderId?._id || e.maintenanceTeamId.leaderId,
            createdAt: e.maintenanceTeamId.createdAt,
          }
        : undefined,
      serialNumber: e.serialNumber,
      manufacturer: e.manufacturer,
      model: e.model,
      purchaseDate: e.purchaseDate,
      lastMaintenanceDate: e.lastMaintenanceDate,
      openRequestsCount: e.openRequestsCount,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    }));
  },

  getById: async (id: string): Promise<Equipment> => {
    const response = await api.get(`/equipment/${id}`);
    const e = response.data.data;
    return {
      id: e._id || e.id,
      name: e.name,
      description: e.description,
      location: e.location,
      status: e.isScrapped ? 'scrapped' : 'operational',
      teamId: e.maintenanceTeamId?._id || e.maintenanceTeamId,
      team: e.maintenanceTeamId
        ? {
            id: e.maintenanceTeamId._id || e.maintenanceTeamId.id,
            name: e.maintenanceTeamId.name,
            description: e.maintenanceTeamId.description,
            leaderId: e.maintenanceTeamId.leaderId?._id || e.maintenanceTeamId.leaderId,
            createdAt: e.maintenanceTeamId.createdAt,
          }
        : undefined,
      serialNumber: e.serialNumber,
      manufacturer: e.manufacturer,
      model: e.model,
      purchaseDate: e.purchaseDate,
      lastMaintenanceDate: e.lastMaintenanceDate,
      openRequestsCount: e.openRequestsCount,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    };
  },

  create: async (data: CreateEquipmentForm): Promise<Equipment> => {
    // Map frontend fields to backend schema
    const payload: any = {
      name: data.name,
      serialNumber: data.serialNumber,
      department: data.department,
      location: data.location,
      purchaseDate: data.purchaseDate,
      maintenanceTeamId: data.teamId,
    };
    const response = await api.post('/equipment', payload);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Equipment>): Promise<Equipment> => {
    const response = await api.patch(`/equipment/${id}`, data);
    return response.data.data;
  },
};

// Teams API
export const teamsApi = {
  getAll: async (): Promise<Team[]> => {
    const response = await api.get('/teams');
    const items = response.data.data || [];
    // Normalize id fields from _id to id
    return items.map((t: any) => ({
      id: t._id || t.id,
      name: t.name,
      description: t.description,
      leaderId: t.leaderId?._id || t.leaderId,
      leader: t.leaderId ? {
        id: t.leaderId._id || t.leaderId.id,
        email: t.leaderId.email,
        name: t.leaderId.name,
        role: t.leaderId.role,
        avatar: t.leaderId.avatar,
        teamId: t.leaderId.teamId?._id || t.leaderId.teamId,
        createdAt: t.leaderId.createdAt,
      } : undefined,
      members: Array.isArray(t.members) ? t.members.map((m: any) => ({
        id: m._id || m.id,
        email: m.email,
        name: m.name,
        role: m.role,
        avatar: m.avatar,
        teamId: m.teamId?._id || m.teamId,
        createdAt: m.createdAt,
      })) : [],
      createdAt: t.createdAt,
    }));
  },

  getById: async (id: string): Promise<Team> => {
    const response = await api.get(`/teams/${id}`);
    const t = response.data.data;
    return {
      id: t._id || t.id,
      name: t.name,
      description: t.description,
      leaderId: t.leaderId?._id || t.leaderId,
      leader: t.leaderId ? {
        id: t.leaderId._id || t.leaderId.id,
        email: t.leaderId.email,
        name: t.leaderId.name,
        role: t.leaderId.role,
        avatar: t.leaderId.avatar,
        teamId: t.leaderId.teamId?._id || t.leaderId.teamId,
        createdAt: t.leaderId.createdAt,
      } : undefined,
      members: Array.isArray(t.members) ? t.members.map((m: any) => ({
        id: m._id || m.id,
        email: m.email,
        name: m.name,
        role: m.role,
        avatar: m.avatar,
        teamId: m.teamId?._id || m.teamId,
        createdAt: m.createdAt,
      })) : [],
      createdAt: t.createdAt,
    };
  },

  create: async (data: CreateTeamForm): Promise<Team> => {
    const response = await api.post('/teams', data);
    const t = response.data.data;
    return {
      id: t._id || t.id,
      name: t.name,
      description: t.description,
      leaderId: t.leaderId?._id || t.leaderId,
      leader: t.leaderId ? {
        id: t.leaderId._id || t.leaderId.id,
        email: t.leaderId.email,
        name: t.leaderId.name,
        role: t.leaderId.role,
        avatar: t.leaderId.avatar,
        teamId: t.leaderId.teamId?._id || t.leaderId.teamId,
        createdAt: t.leaderId.createdAt,
      } : undefined,
      members: Array.isArray(t.members) ? t.members.map((m: any) => ({
        id: m._id || m.id,
        email: m.email,
        name: m.name,
        role: m.role,
        avatar: m.avatar,
        teamId: m.teamId?._id || m.teamId,
        createdAt: m.createdAt,
      })) : [],
      createdAt: t.createdAt,
    };
  },
};

// Maintenance Requests API
export const requestsApi = {
  getAll: async (filters?: RequestFilters): Promise<MaintenanceRequest[]> => {
    const response = await api.get('/requests', { params: filters });
    const items = response.data.data || [];
    return items.map((r: any) => ({
      id: r._id || r.id,
      subject: r.subject,
      description: r.description,
      type: r.type,
      status: r.status === 'in-progress' ? 'in_progress' : r.status,
      priority: r.priority || 'medium',
      equipmentId: r.equipmentId?._id || r.equipmentId,
      equipment: r.equipmentId && typeof r.equipmentId === 'object' ? {
        id: r.equipmentId._id || r.equipmentId.id,
        name: r.equipmentId.name,
        location: r.equipmentId.location,
        status: r.equipmentId.isScrapped ? 'scrapped' : 'operational',
        teamId: r.equipmentId.maintenanceTeamId?._id || r.equipmentId.maintenanceTeamId,
        createdAt: r.equipmentId.createdAt,
        updatedAt: r.equipmentId.updatedAt,
      } : undefined,
      teamId: r.maintenanceTeamId?._id || r.maintenanceTeamId,
      team: r.maintenanceTeamId && typeof r.maintenanceTeamId === 'object' ? {
        id: r.maintenanceTeamId._id || r.maintenanceTeamId.id,
        name: r.maintenanceTeamId.name,
      } : undefined,
      assignedToId: r.technicianId?._id || r.technicianId,
      assignedTo: r.technicianId && typeof r.technicianId === 'object' ? {
        id: r.technicianId._id || r.technicianId.id,
        name: r.technicianId.name,
        email: r.technicianId.email,
        role: r.technicianId.role,
        createdAt: r.technicianId.createdAt,
      } : undefined,
      requestedById: r.createdBy?._id || r.createdBy,
      requestedBy: r.createdBy && typeof r.createdBy === 'object' ? {
        id: r.createdBy._id || r.createdBy.id,
        name: r.createdBy.name,
        email: r.createdBy.email,
        role: r.createdBy.role,
        createdAt: r.createdBy.createdAt,
      } : undefined,
      scheduledDate: r.scheduledDate,
      completedDate: r.completedDate,
      duration: r.durationHours ? r.durationHours * 60 : undefined,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  },

  getById: async (id: string): Promise<MaintenanceRequest> => {
    const response = await api.get(`/requests/${id}`);
    const r = response.data.data;
    return {
      id: r._id || r.id,
      subject: r.subject,
      description: r.description,
      type: r.type,
      status: r.status === 'in-progress' ? 'in_progress' : r.status,
      priority: r.priority || 'medium',
      equipmentId: r.equipmentId?._id || r.equipmentId,
      equipment: r.equipmentId && typeof r.equipmentId === 'object' ? {
        id: r.equipmentId._id || r.equipmentId.id,
        name: r.equipmentId.name,
        location: r.equipmentId.location,
        status: r.equipmentId.isScrapped ? 'scrapped' : 'operational',
      } : undefined,
      teamId: r.maintenanceTeamId?._id || r.maintenanceTeamId,
      team: r.maintenanceTeamId && typeof r.maintenanceTeamId === 'object' ? {
        id: r.maintenanceTeamId._id || r.maintenanceTeamId.id,
        name: r.maintenanceTeamId.name,
      } : undefined,
      assignedToId: r.technicianId?._id || r.technicianId,
      assignedTo: r.technicianId && typeof r.technicianId === 'object' ? {
        id: r.technicianId._id || r.technicianId.id,
        name: r.technicianId.name,
        email: r.technicianId.email,
        role: r.technicianId.role,
      } : undefined,
      requestedById: r.createdBy?._id || r.createdBy,
      requestedBy: r.createdBy && typeof r.createdBy === 'object' ? {
        id: r.createdBy._id || r.createdBy.id,
        name: r.createdBy.name,
        email: r.createdBy.email,
        role: r.createdBy.role,
      } : undefined,
      scheduledDate: r.scheduledDate,
      completedDate: r.completedDate,
      duration: r.durationHours ? r.durationHours * 60 : undefined,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  },

  create: async (data: CreateRequestForm): Promise<MaintenanceRequest> => {
    const response = await api.post('/requests', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<MaintenanceRequest>): Promise<MaintenanceRequest> => {
    const response = await api.patch(`/requests/${id}`, data);
    return response.data.data;
  },

  updateStatus: async (id: string, status: RequestStatus): Promise<MaintenanceRequest> => {
    // Convert frontend underscore to backend hyphen
    const backendStatus = status === 'in_progress' ? 'in-progress' : status;
    const response = await api.patch(`/requests/${id}`, { status: backendStatus });
    const r = response.data.data;
    return {
      id: r._id || r.id,
      subject: r.subject,
      description: r.description,
      type: r.type,
      status: r.status === 'in-progress' ? 'in_progress' : r.status,
      priority: r.priority || 'medium',
      equipmentId: r.equipmentId?._id || r.equipmentId,
      equipment: r.equipmentId && typeof r.equipmentId === 'object' ? {
        id: r.equipmentId._id || r.equipmentId.id,
        name: r.equipmentId.name,
        location: r.equipmentId.location,
        status: r.equipmentId.isScrapped ? 'scrapped' : 'operational',
      } : undefined,
      teamId: r.maintenanceTeamId?._id || r.maintenanceTeamId,
      assignedToId: r.technicianId?._id || r.technicianId,
      assignedTo: r.technicianId && typeof r.technicianId === 'object' ? {
        id: r.technicianId._id || r.technicianId.id,
        name: r.technicianId.name,
        email: r.technicianId.email,
        role: r.technicianId.role,
        createdAt: r.technicianId.createdAt,
      } : undefined,
      requestedById: r.createdBy?._id || r.createdBy,
      scheduledDate: r.scheduledDate,
      completedDate: r.completedDate,
      duration: r.durationHours ? r.durationHours * 60 : undefined,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  },

  getCalendarEvents: async (): Promise<CalendarEvent[]> => {
    const response = await api.get('/requests/calendar');
    const raw = response.data.data;

    // Backend returns an object grouped by date: { 'YYYY-MM-DD': [requests...] }
    // Normalize into CalendarEvent[] expected by the calendar component
    if (Array.isArray(raw)) {
      // In case backend changes to return a flat array of requests
      return raw
        .filter((r: any) => r && r.scheduledDate)
        .map((r: any) => ({
          id: r._id || r.id,
          title: r.subject || 'Maintenance',
          start: r.scheduledDate,
          type: (r.type as RequestType) || 'preventive',
          status: r.status === 'in-progress' ? 'in_progress' : r.status,
          equipmentId: r.equipmentId?._id || r.equipmentId,
          equipmentName: r.equipmentId?.name,
          assignedToId: r.technicianId?._id || r.technicianId,
          assignedToName: r.technicianId?.name,
        }));
    }

    if (raw && typeof raw === 'object') {
      const events: CalendarEvent[] = [];
      for (const [dateKey, list] of Object.entries(raw)) {
        if (dateKey === 'unscheduled') continue; // skip unscheduled
        const items = Array.isArray(list) ? list : [];
        for (const r of items) {
          events.push({
            id: (r as any)._id || (r as any).id,
            title: (r as any).subject || 'Maintenance',
            start: (r as any).scheduledDate || `${dateKey}T09:00:00`,
            type: 'preventive',
            status: (r as any).status === 'in-progress' ? 'in_progress' : (r as any).status,
            equipmentId:
              (r as any).equipmentId?._id || (r as any).equipmentId,
            equipmentName: (r as any).equipmentId?.name,
          });
        }
      }
      return events;
    }

    // Fallback: empty array
    return [];
  },

  getByEquipment: async (equipmentId: string): Promise<MaintenanceRequest[]> => {
    const response = await api.get(`/requests/by-equipment/${equipmentId}`);
    const items = response.data.data || [];
    return items.map((r: any) => ({
      id: r._id || r.id,
      subject: r.subject,
      description: r.description,
      type: r.type,
      status: r.status === 'in-progress' ? 'in_progress' : r.status,
      priority: r.priority || 'medium',
      equipmentId: r.equipmentId?._id || r.equipmentId,
      equipment: r.equipmentId && typeof r.equipmentId === 'object' ? {
        id: r.equipmentId._id || r.equipmentId.id,
        name: r.equipmentId.name,
        location: r.equipmentId.location,
        status: r.equipmentId.isScrapped ? 'scrapped' : 'operational',
      } : undefined,
      teamId: r.maintenanceTeamId?._id || r.maintenanceTeamId,
      assignedToId: r.technicianId?._id || r.technicianId,
      assignedTo: r.technicianId && typeof r.technicianId === 'object' ? {
        id: r.technicianId._id || r.technicianId.id,
        name: r.technicianId.name,
        email: r.technicianId.email,
        role: r.technicianId.role,
        createdAt: r.technicianId.createdAt,
      } : undefined,
      requestedById: r.createdBy?._id || r.createdBy,
      scheduledDate: r.scheduledDate,
      completedDate: r.completedDate,
      duration: r.durationHours ? r.durationHours * 60 : undefined,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<any> => {
    const response = await api.get('/dashboard/stats');
    return response.data.data;
  },
};

export default api;
