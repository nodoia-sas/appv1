// UI-specific types and interfaces

export type ThemeMode = "light" | "dark" | "system";

export type ToastType = "info" | "success" | "warning" | "error";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export interface ButtonVariant {
  variant:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size: "default" | "sm" | "lg" | "icon";
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

// Layout types
export interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

// Navigation types
export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  badge?: string | number;
  disabled?: boolean;
}
