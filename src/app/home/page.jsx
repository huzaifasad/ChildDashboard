// Dashboard.jsx

'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, CheckSquare, Gift, ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const upcomingEvents = [
  { title: 'Math Class', date: 'Monday', time: '10 AM', category: 'School' },
  { title: 'Soccer Practice', date: 'Tuesday', time: '4 PM', category: 'Sports' },
  { title: 'Dentist Appointment', date: 'Wednesday', time: '2 PM', category: 'Health' },
];

const taskData = [
  { name: 'Mon', completed: 4, total: 6 },
  { name: 'Tue', completed: 3, total: 5 },
  { name: 'Wed', completed: 5, total: 5 },
  { name: 'Thu', completed: 2, total: 4 },
  { name: 'Fri', completed: 4, total: 7 },
  { name: 'Sat', completed: 3, total: 3 },
  { name: 'Sun', completed: 1, total: 2 },
];

const CARD_TYPE = 'CARD';

// DraggableCard Component
const DraggableCard = ({ id, index, moveCard, children, colSpan }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: CARD_TYPE,
    hover(item) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveCard(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [, drag] = useDrag({
    type: CARD_TYPE,
    item: { id, index },
  });

  drag(drop(ref));

  return (
    <div ref={ref} className={`${colSpan} mb-8`}>
      {children}
    </div>
  );
};

export default function Dashboard() {
  const { t } = useLanguage();

  const [cards, setCards] = useState([
    { id: 1, content: 'WeeklyTaskOverview', colSpan: 'col-span-full lg:col-span-2' },
    { id: 2, content: 'TodaysProgress', colSpan: 'col-span-full md:col-span-1' },
    { id: 3, content: 'UpcomingEvents', colSpan: 'col-span-full lg:col-span-2' },
    { id: 4, content: 'QuickActions', colSpan: 'col-span-full md:col-span-1' },
  ]);

  const [chartType, setChartType] = useState('bar');

  const moveCard = (fromIndex, toIndex) => {
    const updatedCards = [...cards];
    const [removed] = updatedCards.splice(fromIndex, 1);
    updatedCards.splice(toIndex, 0, removed);
    setCards(updatedCards);
  };

  return (
    <div className="min-h-screen bg-background">
      <DndProvider backend={HTML5Backend}>
        <main className="container px-4 py-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, index) => (
              <DraggableCard
                key={card.id}
                id={card.id}
                index={index}
                moveCard={moveCard}
                colSpan={card.colSpan}
              >
                {card.content === 'WeeklyTaskOverview' && (
                  <Card className="h-full">
                    <CardHeader className="cursor-move">
                      <div className="flex justify-between items-center">
                        <CardTitle>{t.weeklyTaskOverview}</CardTitle>
                        <div className="space-x-2">
                          <Button
                            variant={chartType === 'bar' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setChartType('bar')}
                          >
                            Bar Chart
                          </Button>
                          <Button
                            variant={chartType === 'line' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setChartType('line')}
                          >
                            Line Chart
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          {chartType === 'bar' ? (
                            <BarChart data={taskData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <RechartsTooltip />
                              <Bar dataKey="completed" fill="#8884d8" />
                              <Bar dataKey="total" fill="#82ca9d" />
                            </BarChart>
                          ) : (
                            <LineChart data={taskData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <RechartsTooltip />
                              <Line type="monotone" dataKey="completed" stroke="#8884d8" />
                              <Line type="monotone" dataKey="total" stroke="#82ca9d" />
                            </LineChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {card.content === 'TodaysProgress' && (
                  <Card className="h-full">
                    <CardHeader className="cursor-move">
                      <CardTitle>{t.todaysProgress}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm font-medium">
                            <span>{t.tasksCompleted}</span>
                            <span>5/8</span>
                          </div>
                          <Progress value={62.5} className="mt-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm font-medium">
                            <span>{t.studyTime}</span>
                            <span>2h 15m / 3h</span>
                          </div>
                          <Progress value={75} className="mt-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm font-medium">
                            <span>{t.exercise}</span>
                            <span>30m / 45m</span>
                          </div>
                          <Progress value={66.7} className="mt-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {card.content === 'UpcomingEvents' && (
                  <Card className="h-full">
                    <CardHeader className="cursor-move">
                      <CardTitle>{t.upcomingEvents}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className="space-y-4">
                        {upcomingEvents.map((event, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between items-center bg-muted/50 p-4 rounded-lg"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <Calendar className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{event.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {event.date}, {event.time}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              {event.category}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {card.content === 'QuickActions' && (
                  <Card className="h-full">
                    <CardHeader className="cursor-move">
                      <CardTitle>{t.quickActions}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="grid grid-cols-2 gap-4">
                        <Button className="h-20 flex flex-col items-center justify-center">
                          <CheckSquare className="h-6 w-6 mb-2" />
                          {t.addTask}
                        </Button>
                        <Button className="h-20 flex flex-col items-center justify-center">
                          <Calendar className="h-6 w-6 mb-2" />
                          {t.scheduleEvent}
                        </Button>
                        <Button className="h-20 flex flex-col items-center justify-center">
                          <ShoppingCart className="h-6 w-6 mb-2" />
                          {t.shoppingList}
                        </Button>
                        <Button className="h-20 flex flex-col items-center justify-center">
                          <Gift className="h-6 w-6 mb-2" />
                          {t.rewards}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </DraggableCard>
            ))}
          </div>
        </main>
      </DndProvider>
    </div>
  );
}
