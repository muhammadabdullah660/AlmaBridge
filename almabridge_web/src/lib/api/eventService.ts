import axios from 'axios';
import { Event, ApiEvent, EventData } from '@/types';

axios.defaults.withCredentials = true;

// Fetch all events
export const GetAllEvents = async (): Promise<Event[]> => {
  try {
    const response = await axios.get<ApiEvent[]>(`http://localhost:3001/api/event`, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.map(transformApiEventToEvent);
  } catch (error) {
    throw error;
  }
};

// Fetch a single event by ID
export const GetEventById = async (id: string): Promise<Event> => {
  try {
    const response = await axios.get<ApiEvent>(`http://localhost:3001/api/event/${id}`, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    return transformApiEventToEvent(response.data);
  } catch (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    throw error;
  }
};

// Create a new event
export const AddEvent = async (formData: EventData): Promise<Event> => {
  try {
    console.log(formData);
    const response = await axios.post<ApiEvent>(
      `http://localhost:3001/api/event`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return transformApiEventToEvent(response.data);
  } catch (error) {
    throw error;
  }
};

// Update an existing event
export const UpdateEvent = async (formData: EventData, id?: string): Promise<Event> => {
  console.log(id);
  try {
    const response = await axios.put<ApiEvent>(
      `http://localhost:3001/api/event/${id}`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return transformApiEventToEvent(response.data);
  } catch (error) {
    throw error;
  }
};

// Delete an event
export const DeleteEvent = async (id: string): Promise<string> => {
  try {
    const response = await axios.delete(`http://localhost:3001/api/event/${id}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json', // Changed to JSON for consistency
      },
    });
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

// Helper function to transform API response to match our frontend Event interface
function transformApiEventToEvent(apiEvent: ApiEvent): Event {
  return {
    id: apiEvent.id.toString(), // Convert numeric ID to string
    title: apiEvent.title,
    description: apiEvent.description,
    date: apiEvent.date,
   eventLink: apiEvent.eventLink,
    status: apiEvent.status,
    targetAudience: apiEvent.targetAudience,
  };
}