export const mapPayrollToPendingUI = (p) => ({
  id: p.id,

  // 👇 frontend bunu bekliyor
  user: {
    id: p.user.id,
    fullName:
      p.user.profile?.firstName && p.user.profile?.lastName
        ? `${p.user.profile.firstName} ${p.user.profile.lastName}`
        : p.user.username,
  },

  // 👇 ayrı ayrı number
  month: p.month,
  year: p.year,

  // 👇 SalarySummaryTable bunu okuyor
  netPayable: p.netSalary,

  status: p.status,
  note: p.note,
});

export const mapPayrollToUserUI = (p) => ({
  id: p.id,
  month: p.month,
  year: p.year,
  netPayable: p.netSalary,
  status: p.status,

   note: p.note,
});

