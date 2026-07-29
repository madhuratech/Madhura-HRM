import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarCheck,
  CalendarOff,
  DollarSign,
  UserPlus,
  ClipboardList,
  BarChart3,
  GraduationCap,
  FolderKanban,
  FileBarChart,
  Package,
  Receipt,
  FileText,
  LifeBuoy,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Network,
  GitBranch,
  Layers,
  Briefcase,
  MapPin,
  Clock,
  CalendarDays,
  TreePine,
  Bird
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar({ currentView, onNavigate, userRole, onLogout }) {
  const [expandedGroups, setExpandedGroups] = useState(['organization']);

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ALL'] },
    {
      id: 'organization',
      label: 'Organization',
      icon: Building2,
      roles: ['ALL'],
      children: [
        { id: 'company-profile', label: 'Company Profile' },
        { id: 'departments', label: 'Departments' },
        { id: 'designations', label: 'Designations' },
        { id: 'teams', label: 'Teams' },
        { id: 'shift-management', label: 'Shift Management' },
        { id: 'holiday-calendar', label: 'Holiday Calendar' },
        { id: 'organization-chart', label: 'Organization Chart' }
      ]
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: Users,
      roles: ['ALL'],
      children: [
        { id: 'employee-directory', label: 'Employee Directory' },
        { id: 'employee-list', label: 'Employee List' },
        { id: 'add-employee', label: 'Add Employee' },
        { id: 'employee-profile', label: 'Employee Profile' },
        { id: 'employment-history', label: 'Employment History' },
        { id: 'promotions', label: 'Promotions' },
        { id: 'transfers', label: 'Transfers' },
        { id: 'exit-management', label: 'Exit Management' },
        { id: 'employee-documents', label: 'Employee Documents' }
      ]
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: CalendarCheck,
      roles: ['ALL'],
      children: [
        { id: 'daily-attendance', label: 'Daily Attendance' },
        { id: 'biometric-attendance', label: 'Biometric Attendance' },
        { id: 'regularization', label: 'Regularization' },
        { id: 'shift-roster', label: 'Shift Roster' },
        { id: 'overtime', label: 'Overtime' },
        { id: 'late-arrival', label: 'Late Arrival' },
        { id: 'attendance-reports', label: 'Attendance Reports' }
      ]
    },
    {
      id: 'leave-management',
      label: 'Leave Management',
      icon: CalendarOff,
      roles: ['ALL'],
      children: [
        { id: 'leave-dashboard', label: 'Leave Dashboard' },
        { id: 'leave-applications', label: 'Leave Applications' },
        { id: 'leave-approval', label: 'Leave Approval' },
        { id: 'leave-balance', label: 'Leave Balance' },
        { id: 'leave-types', label: 'Leave Types' },
        { id: 'holiday-list', label: 'Holiday List' },
        { id: 'comp-off', label: 'Comp Off' }
      ]
    },
    {
      id: 'payroll',
      label: 'Payroll',
      icon: DollarSign,
      roles: ['ALL'],
      children: [
        { id: 'salary-structure', label: 'Salary Structure' },
        { id: 'salary-components', label: 'Salary Components' },
        { id: 'payroll-processing', label: 'Payroll Processing' },
        { id: 'generate-payslips', label: 'Generate Payslips' },
        { id: 'bonus-incentives', label: 'Bonus & Incentives' },
        { id: 'reimbursements', label: 'Reimbursements' },
        { id: 'loans-advances', label: 'Loans & Advances' },
        { id: 'tax-management', label: 'Tax Management' },
        { id: 'payroll-reports', label: 'Payroll Reports' }
      ]
    },
    {
      id: 'recruitment',
      label: 'Recruitment',
      icon: UserPlus,
      roles: ['ALL'],
      children: [
        { id: 'recruitment-dashboard', label: 'Dashboard' },
        { id: 'job-openings', label: 'Job Openings' },
        { id: 'candidates', label: 'Candidates' },
        { id: 'interview-schedule', label: 'Interview Schedule' },
        { id: 'offer-letters', label: 'Offer Letters' },
        { id: 'hiring-pipeline', label: 'Hiring Pipeline' }
      ]
    },
    {
      id: 'onboarding',
      label: 'Onboarding',
      icon: ClipboardList,
      roles: ['ALL'],
      children: [
        { id: 'new-joiners', label: 'New Joiners' },
        { id: 'document-verification', label: 'Document Verification' },
        { id: 'asset-allocation', label: 'Asset Allocation' },
        { id: 'welcome-kit', label: 'Welcome Kit' },
        { id: 'orientation', label: 'Orientation' },
        { id: 'probation', label: 'Probation' }
      ]
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: BarChart3,
      roles: ['ALL'],
      children: [
        { id: 'goals', label: 'Goals' },
        { id: 'kpi', label: 'KPI' },
        { id: 'kras', label: 'KRAs' },
        { id: 'appraisals', label: 'Appraisals' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'feedback', label: 'Feedback' },
        { id: 'promotions-performance', label: 'Promotions' }
      ]
    },
    {
      id: 'training',
      label: 'Training',
      icon: GraduationCap,
      roles: ['ALL'],
      children: [
        { id: 'training-programs', label: 'Training Programs' },
        { id: 'learning-portal', label: 'Learning Portal' },
        { id: 'trainers', label: 'Trainers' },
        { id: 'assessments', label: 'Assessments' },
        { id: 'certificates', label: 'Certificates' }
      ]
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderKanban,
      roles: ['ALL'],
      children: [
        { id: 'project-dashboard', label: 'Project Dashboard' },
        { id: 'projects-list', label: 'Projects' },
        { id: 'tasks', label: 'Tasks' },
        { id: 'sprint-board', label: 'Sprint Board' },
        { id: 'timesheets', label: 'Timesheets' },
        { id: 'milestones', label: 'Milestones' },
        { id: 'team-members', label: 'Team Members' }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileBarChart,
      roles: ['ALL'],
      children: [
        { id: 'employee-reports', label: 'Employee Reports' },
        { id: 'attendance-reports-module', label: 'Attendance Reports' },
        { id: 'leave-reports', label: 'Leave Reports' },
        { id: 'payroll-reports-module', label: 'Payroll Reports' },
        { id: 'recruitment-reports', label: 'Recruitment Reports' },
        { id: 'performance-reports', label: 'Performance Reports' },
        { id: 'project-reports', label: 'Project Reports' }
      ]
    },
    {
      id: 'assets',
      label: 'Assets',
      icon: Package,
      roles: ['ALL'],
      children: [
        { id: 'asset-categories', label: 'Asset Categories' },
        { id: 'asset-inventory', label: 'Asset Inventory' },
        { id: 'asset-allocation-module', label: 'Asset Allocation' },
        { id: 'asset-return', label: 'Asset Return' },
        { id: 'maintenance', label: 'Maintenance' },
        { id: 'asset-reports', label: 'Asset Reports' }
      ]
    },
    {
      id: 'expenses',
      label: 'Expenses',
      icon: Receipt,
      roles: ['ALL'],
      children: [
        { id: 'expense-claims', label: 'Expense Claims' },
        { id: 'expense-categories', label: 'Expense Categories' },
        { id: 'expense-approval', label: 'Expense Approval' },
        { id: 'expense-reimbursements', label: 'Reimbursements' },
        { id: 'expense-reports', label: 'Expense Reports' }
      ]
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      roles: ['ALL'],
      children: [
        { id: 'employee-documents-module', label: 'Employee Documents' },
        { id: 'company-documents', label: 'Company Documents' },
        { id: 'hr-policies', label: 'HR Policies' },
        { id: 'templates', label: 'Templates' },
        { id: 'digital-signatures', label: 'Digital Signatures' }
      ]
    },
    {
      id: 'help-desk',
      label: 'Help Desk',
      icon: LifeBuoy,
      roles: ['ALL'],
      children: [
        { id: 'help-desk-dashboard', label: 'Dashboard' },
        { id: 'tickets', label: 'Tickets' },
        { id: 'categories', label: 'Categories' },
        { id: 'priorities', label: 'Priorities' },
        { id: 'knowledge-base', label: 'Knowledge Base' },
        { id: 'help-desk-reports', label: 'Reports' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      roles: ['ALL'],
      children: [
        { id: 'company-info', label: 'Company Information' },
        { id: 'branding', label: 'Branding' },
        { id: 'branch-management', label: 'Branch Management' },
        { id: 'settings-business-units', label: 'Business Units' },
        { id: 'financial-year', label: 'Financial Year' },
        { id: 'currency', label: 'Currency' },
        { id: 'time-zone', label: 'Time Zone' },
        { id: 'users', label: 'Users' },
        { id: 'roles', label: 'Roles' },
        { id: 'permissions', label: 'Permissions' },
        { id: 'approval-workflow', label: 'Approval Workflow' },
        { id: 'email-templates', label: 'Email Templates' },
        { id: 'sms-templates', label: 'SMS Templates' },
        { id: 'biometric-devices', label: 'Biometric Devices' },
        { id: 'email-config', label: 'Email Configuration' },
        { id: 'sms-gateway', label: 'SMS Gateway' },
        { id: 'calendar-integration', label: 'Calendar Integration' },
        { id: 'api-settings', label: 'API Settings' },
        { id: 'password-policy', label: 'Password Policy' },
        { id: 'two-factor-auth', label: 'Two-Factor Authentication' },
        { id: 'login-history', label: 'Login History' },
        { id: 'session-management', label: 'Session Management' },
        { id: 'backup-restore', label: 'Backup & Restore' },
        { id: 'audit-logs', label: 'Audit Logs' },
        { id: 'activity-logs', label: 'Activity Logs' },
        { id: 'database-settings', label: 'Database Settings' }
      ]
    }
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles?.includes('ALL') || item.roles?.includes(userRole)
  );

  const renderMenuItem = (item) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedGroups.includes(item.id);
    const isActive = currentView === item.id || item.children?.some(child => currentView === child.id);

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleGroup(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium",
              isActive ? "text-white" : "custom-sidebar-btn"
            )}
          >
            <item.icon size={18} />
            <span className="flex-1 text-left">{item.label}</span>
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-0.5">
              {item.children.map(child => (
                <button
                  key={child.id}
                  onClick={() => onNavigate(child.id)}
                  className={cn(
                    "w-full flex items-center gap-3 pl-10 pr-4 py-2 rounded-lg transition-colors text-sm",
                    currentView === child.id
                      ? "custom-sidebar-btn-active"
                      : "custom-sidebar-btn"
                  )}
                >
                  {child.label}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium",
          currentView === item.id
            ? "custom-sidebar-btn-active"
            : "custom-sidebar-btn"
        )}
      >
        <item.icon size={18} />
        {item.label}
      </button>
    );
  };

  return (
    <div className="w-64 custom-sidebar h-screen flex flex-col fixed left-0 top-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-5 custom-sidebar-border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 custom-sidebar-logo-bg rounded-lg flex items-center justify-center">
            <Bird size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide">HAWKEYE NEST</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">HRMS</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredMenu.map(item => renderMenuItem(item))}
      </nav>

      {/* User Profile */}
      <div className="p-3 custom-sidebar-border-t">
        <div className="custom-sidebar-profile-bg rounded-lg p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full custom-sidebar-profile-avatar-bg flex items-center justify-center text-xs font-bold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">John Doe</p>
            <p className="text-xs text-slate-400 truncate">Super Admin</p>
          </div>
          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-red-400 transition-colors p-1"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
