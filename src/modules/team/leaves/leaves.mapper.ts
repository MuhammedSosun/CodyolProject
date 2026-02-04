export const mapLeaveToPendingUI = (leave: any) => {
  const format = (d: Date) =>
    new Date(d).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const sameDay =
    new Date(leave.start).toDateString() ===
    new Date(leave.end).toDateString();

  return {
    id: leave.id,
    employee: leave.employee,
    role: 'Frontend Developer', // şimdilik sabit
    avatar: '/images/avatar/default.png',
    type: leave.type ?? 'İzin',
    date: sameDay
      ? format(leave.start)
      : `${format(leave.start)} – ${format(leave.end)}`,
  };
};
export const mapLeaveToCalendar = (leave: any) => {
  return {
    id: leave.id,
    employee: leave.employee,
    start: leave.start,
    end: leave.end,
    status: leave.status,
  };
};
