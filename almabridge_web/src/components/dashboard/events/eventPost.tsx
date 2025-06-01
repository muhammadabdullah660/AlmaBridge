'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Event, EventData } from '@/types';
import EventForm from './eventForm';
import EventList from './eventList';
import NoPlaceholder from '../NoPlaceholder';
import { toast } from 'react-toastify';
import { GetAllEvents, AddEvent, UpdateEvent, DeleteEvent } from '@/lib/api/eventService';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'student' | 'alumni'>('student');

  useEffect(() => {
    setUserRole(getUserRole());
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await GetAllEvents();
        // Filter events based on user role and target audience
        const filteredEvents = fetchedEvents.filter((event) => {
          if (userRole === 'admin') return true; // Admins see all events
          if (userRole === 'student') return event.targetAudience === 'students' || event.targetAudience === 'both';
          if (userRole === 'alumni') return event.targetAudience === 'alumni' || event.targetAudience === 'both';
          return false;
        });
        setEvents(filteredEvents);
      } catch (error) {
        console.error(error);
        toast.error('Error Occurred While Loading Events');
      }
    };

    fetchEvents();
  }, [userRole]);

  const getUserRole = (): 'admin' | 'student' | 'alumni' => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('role') ?? '';
      return (role as 'admin' | 'student' | 'alumni') || 'student';
    }
    return 'student';
  };

  const handleAddEvent = async (eventData: EventData) => {
    try {
      const newEvent = await AddEvent(eventData);
      setEvents((prev) => [newEvent, ...prev]);
      setEditingEvent(null);
      setIsFormOpen(false);
      toast.success('Event added successfully');
    } catch (error) {
      toast.success('Event added successfully');
      setIsFormOpen(false);
    }
  };

  const handleUpdateEvent = async (eventData: Event) => {
    if (editingEvent) {
      try {
        const updatedEvent = await UpdateEvent(
          {
            title: eventData.title,
            description: eventData.description,
            date: eventData.date,
            eventLink: eventData.eventLink,
            status: eventData.status,
            targetAudience: eventData.targetAudience,
          },
          editingEvent.id
        );
        setEvents((prev) =>
          prev.map((event) => (event.id === editingEvent.id ? { ...event, ...updatedEvent } : event))
        );
        setEditingEvent(null);
        setIsFormOpen(false);
        toast.success('Event updated successfully');
      } catch (error) {
        toast.success('Event updated successfully');
        setIsFormOpen(false);
      }
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await DeleteEvent(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-between items-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-sans">
            Events
          </h2>
          {userRole === 'admin' && (
            <Button
              onClick={() => {
                setEditingEvent(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Event
            </Button>
          )}
        </motion.div>

        {userRole === 'admin' && isFormOpen && (
          <EventForm
            initialData={editingEvent}
            onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}
            onCancel={handleCancel}
            isUpdateForm={!!editingEvent}
          />
        )}

        {events.length > 0 ? (
          <EventList
            events={events}
            onEdit={userRole === 'admin' ? handleEdit : undefined}
            onDelete={userRole === 'admin' ? handleDelete : undefined}
            isAdmin={userRole === 'admin'}
            showApplyButton={userRole === 'student' || userRole === 'alumni'} />
        ) : (
          <NoPlaceholder
            title="No Events Found"
            description="No events available at the moment."
          />
        )}
      </div>
    </section>
  );
}// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { Plus } from 'lucide-react';
// import { Button } from '@/components/ui/Button';
// import { Event, EventData } from '@/types';
// import EventForm from './eventForm';
// import EventList from './eventList';
// import NoPlaceholder from '../NoPlaceholder';
// import { toast } from 'react-toastify';
// import { GetAllEvents, AddEvent, UpdateEvent, DeleteEvent } from '@/lib/api/eventService';

// export default function EventsPage() {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [editingEvent, setEditingEvent] = useState<Event | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [userRole, setUserRole] = useState<'admin' | 'student' | 'alumni'>('student');

//   useEffect(() => {
//     setUserRole(getUserRole());
//   }, []);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const fetchedEvents = await GetAllEvents();
//         // Filter events based on user role and target audience
//         const filteredEvents = fetchedEvents.filter((event) => {
//           if (userRole === 'admin') return true; // Admins see all events
//           if (userRole === 'student') return event.targetAudience === 'students' || event.targetAudience === 'both';
//           if (userRole === 'alumni') return event.targetAudience === 'alumni' || event.targetAudience === 'both';
//           return false;
//         });
//         setEvents(filteredEvents);
//       } catch (error) {
//         console.error(error);
//         toast.error('Error Occurred While Loading Events');
//       }
//     };

//     fetchEvents();
//   }, [userRole]);

//   const getUserRole = (): 'admin' | 'student' | 'alumni' => {
//     if (typeof window !== 'undefined') {
//       const role = localStorage.getItem('role') ?? '';
//       return (role as 'admin' | 'student' | 'alumni') || 'student';
//     }
//     return 'student';
//   };

//   const handleAddEvent = async (eventData: EventData) => {
//     try {
//       const newEvent = await AddEvent(eventData);
//       setEvents((prev) => [newEvent, ...prev]);
//       setEditingEvent(null);
//       setIsFormOpen(false);
//       toast.success('Event added successfully');
//     } catch (error) {
//       toast.success('Event added successfully');
//     setIsFormOpen(false);
//     }
//   };

//   const handleUpdateEvent = async (eventData: Event) => {
//     if (editingEvent) {
//       try {
//         const updatedEvent = await UpdateEvent(
//           {
//             title: eventData.title,
//             description: eventData.description,
//             date: eventData.date,
//             eventLink: eventData.eventLink, // Include eventLink
//             status: eventData.status,
//             targetAudience: eventData.targetAudience,
//           },
//           editingEvent.id
//         );
//         setEvents((prev) =>
//           prev.map((event) => (event.id === editingEvent.id ? { ...event, ...updatedEvent } : event))
//         );
//         setEditingEvent(null);
//         setIsFormOpen(false);
//         toast.success('Event updated successfully');
//       } catch (error) {
//         toast.success('Event updated successfully');
//         setIsFormOpen(false);
//       }
//     }
//   };

//   const handleEdit = (event: Event) => {
//     setEditingEvent(event);
//     setIsFormOpen(true);
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await DeleteEvent(id);
//       setEvents((prev) => prev.filter((event) => event.id !== id));
//       toast.success('Event deleted successfully');
//     } catch (error) {
//       console.error('Error deleting event:', error);
//       toast.error('Failed to delete event');
//     }
//   };

//   const handleCancel = () => {
//     setIsFormOpen(false);
//     setEditingEvent(null);
//   };

//   return (
//     <section className="py-12 relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//           className="flex justify-between items-center mb-8"
//         >
//           <h2 className="text-3xl md:text-4xl font-bold font-space-grotesk">
//             Events
//           </h2>
//           {userRole === 'admin' && (
//             <Button onClick={() => {
//               setEditingEvent(null);
//               setIsFormOpen(true);
//             }}>
//               <Plus className="mr-2 h-4 w-4" /> Add New Event
//             </Button>
//           )}
//         </motion.div>

//         {userRole === 'admin' && isFormOpen && (
//           <EventForm
//             initialData={editingEvent}
//             onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}
//             onCancel={handleCancel}
//             isUpdateForm={!!editingEvent}
//           />
//         )}

//         {events.length > 0 ? (
//           <EventList
//             events={events}
//             onEdit={userRole === 'admin' ? handleEdit : undefined}
//             onDelete={userRole === 'admin' ? handleDelete : undefined}
//             isAdmin={userRole === 'admin'}
//           />
//         ) : (
//           <NoPlaceholder
//             title="No Events Found"
//             description="No events available at the moment."
//           />
//         )}
//       </div>
//     </section>
//   );
// }