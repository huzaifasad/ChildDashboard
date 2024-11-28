'use client';

import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths } from 'date-fns';
import { enUS, es, de, fr, ja } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext'; // Import language context

const locales = { enUS, es, de, fr, ja };

const eventCategories = [
  { value: "school", label: "School", color: "bg-blue-500" },
  { value: "sports", label: "Sports", color: "bg-green-500" },
  { value: "family", label: "Family", color: "bg-purple-500" },
  { value: "other", label: "Other", color: "bg-yellow-500" },
];

const sampleEvents = [
  { id: 1, title: "Math Test", description: "Algebra exam", date: "2024-11-15", startTime: "09:00", endTime: "10:30", category: "school" },
  { id: 2, title: "Soccer Practice", description: "Weekly training", date: "2024-11-16", startTime: "16:00", endTime: "17:30", category: "sports" },
  { id: 3, title: "Family Picnic", description: "At the park", date: "2024-11-18", startTime: "12:00", endTime: "15:00", category: "family" },
  { id: 4, title: "Piano Lesson", description: "Weekly lesson", date: "2024-11-20", startTime: "15:00", endTime: "16:00", category: "other" },
  { id: 5, title: "Science Fair", description: "School event", date: "2024-11-22", startTime: "10:00", endTime: "14:00", category: "school" },
  { id: 6, title: "Basketball Game", description: "Home game", date: "2024-11-25", startTime: "18:00", endTime: "20:00", category: "sports" },
];

export default function PerfectCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [animationDirection, setAnimationDirection] = useState(0);
  const { t, language, setLanguage } = useLanguage(); // Use the language context

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => {
    setAnimationDirection(-1);
    setCurrentMonth((prevMonth) => addMonths(prevMonth, -1));
  };

  const handleNextMonth = () => {
    setAnimationDirection(1);
    setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));
  };

  const handleDateClick = (day) => setSelectedDate(day);
  const handleEventClick = (event) => setSelectedEvent(event);
  const closeEventDetails = () => setSelectedEvent(null);
  const openAddEventDialog = () => setIsAddEventOpen(true);
  const closeAddEventDialog = () => setIsAddEventOpen(false);
  const handleAddEvent = (e) => {
    e.preventDefault();
    // Add event logic here
    closeAddEventDialog();
  };

  const getEventColor = (category) => {
    const eventCategory = eventCategories.find((cat) => cat.value === category);
    return eventCategory ? eventCategory.color : "bg-gray-500";
  };

  const eventsOnSelectedDate = sampleEvents.filter(
    (event) => event.date === format(selectedDate, 'yyyy-MM-dd')
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-primary">{t.title}</h1>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button onClick={handlePrevMonth} variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-semibold">
              {format(currentMonth, 'MMMM yyyy', { locale: locales[language === 'en' ? 'enUS' : language] })}
            </h2>
            <Button onClick={handleNextMonth} variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={openAddEventDialog} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> {t.addEvent}
          </Button>
        </div>
      </header>

      <div className="grid gap-8 md:grid-cols-[3fr,1fr]">
        <Card className="bg-card shadow-lg rounded-lg overflow-hidden">
          <CardContent className="p-0">
            <AnimatePresence initial={false} custom={animationDirection}>
              <motion.div
                key={currentMonth.toISOString()}
                custom={animationDirection}
                initial={{ x: 300 * animationDirection, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300 * animationDirection, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="grid grid-cols-7 gap-px bg-muted">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="bg-muted/50 p-2 text-center font-semibold">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-px bg-muted">
                  {monthDays.map((day) => {
                    const dayEvents = sampleEvents.filter(
                      (event) => event.date === format(day, 'yyyy-MM-dd')
                    );
                    return (
                      <button
                        key={day.toString()}
                        onClick={() => handleDateClick(day)}
                        className={`min-h-[100px] p-2 ${
                          isSameMonth(day, currentMonth) ? 'bg-card' : 'bg-muted/50 text-muted-foreground'
                        } ${isSameDay(day, selectedDate) ? 'ring-2 ring-primary' : ''}`}
                      >
                        <time dateTime={format(day, 'yyyy-MM-dd')} className="font-semibold">
                          {format(day, 'd')}
                        </time>
                        <div className="mt-2 space-y-1">
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded-full text-white ${getEventColor(event.category)}`}
                            >
                              {event.title}
                            </div>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{format(selectedDate, 'MMMM d, yyyy', { locale: locales[language === 'en' ? 'enUS' : language] })}</CardTitle>
          </CardHeader>
          <CardContent>
            {eventsOnSelectedDate.length === 0 ? (
              <p>{t.noEvents}</p>
            ) : (
              <ul className="space-y-4">
                {eventsOnSelectedDate.map((event) => (
                  <li key={event.id}>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className={`w-4 h-4 rounded-full mr-2 ${getEventColor(event.category)}`} />
                      <span>{event.title}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {event.startTime} - {event.endTime}
                      </span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={selectedEvent !== null} onOpenChange={closeEventDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.eventDetails}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-title" className="text-right">
                Title
              </Label>
              <Input id="event-title" value={selectedEvent?.title} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-description" className="text-right">
                Description
              </Label>
              <Textarea id="event-description" value={selectedEvent?.description} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-date" className="text-right">
                Date
              </Label>
              <Input id="event-date" value={selectedEvent?.date} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-time" className="text-right">
                Time
              </Label>
              <Input id="event-time" value={`${selectedEvent?.startTime} - ${selectedEvent?.endTime}`} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-category" className="text-right">
                Category
              </Label>
              <div className="col-span-3 flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${selectedEvent ? getEventColor(selectedEvent.category) : ''}`} />
                <Input id="event-category" value={selectedEvent?.category} readOnly />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={closeEventDetails}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddEventOpen} onOpenChange={closeAddEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.newEvent}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEvent}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input id="title" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea id="description" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input id="date" type="date" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start-time" className="text-right">
                  Start Time
                </Label>
                <Input id="start-time" type="time" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end-time" className="text-right">
                  End Time
                </Label>
                <Input id="end-time" type="time" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select id="category" required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-2 ${category.color}`} />
                          {t[category.label.toLowerCase()] || category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
