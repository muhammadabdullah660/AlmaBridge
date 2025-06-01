'use client';

import { Event, EventListProps } from '@/types';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Edit, ExternalLinkIcon, Trash2, X } from "lucide-react"


export default function EventList({ events, onEdit, onDelete, isAdmin, showApplyButton }: EventListProps) {
  return (
    <div className="grid gap-6">
      {events.map((event) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-white/10 rounded-lg border border-white/20"
        >
          <h3 className="text-xl font-semibold text-white">{event.title}</h3>
          <p className="mt-2 text-gray-300">{event.description}</p>
          <p className="mt-2 text-sm text-gray-400">
            Date: {new Date(event.date).toLocaleString()}
          </p>
          {/* <p className="mt-1 text-sm text-gray-400">Event Link: {event.eventLink}</p> */}
          <p className="mt-1 text-sm text-gray-400">
            Target Audience: {event.targetAudience}
          </p>
          <div className="mt-4 flex gap-4">
            {isAdmin && (
              <>
                <Button
                  onClick={() => onEdit?.(event)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  onClick={async () => await onDelete?.(event.id)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            {showApplyButton && event.eventLink && (
              <a
                href={event.eventLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  <ExternalLinkIcon className="h-4 w-4 mr-2" /> Apply
                </Button>
              </a>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}