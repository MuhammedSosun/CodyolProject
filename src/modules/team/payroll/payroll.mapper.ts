export const mapPayrollToPendingUI = (p) => ({
  id: p.id,
  employee: `${p.user.profile?.firstName ?? ''} ${p.user.profile?.lastName ?? ''}`,
  month: `${p.month}/${p.year}`,
  netSalary: p.netSalary,
  status: p.status,
});

export const mapPayrollToUserUI = (p) => ({
  id: p.id,
  month: `${p.month}/${p.year}`,
  netSalary: p.netSalary,
  status: p.status,
});
