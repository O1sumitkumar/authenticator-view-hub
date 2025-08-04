import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import { UserRequest } from '@/types/admin';
import { useCreateUserMutation } from '@/redux/api/adminApi';
import { activityService } from '@/services/activityService';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  user_role: Yup.string()
    .required('Role is required')
    .oneOf(['admin', 'member', 'viewer'], 'Invalid role'),
  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive', 'pending'], 'Invalid status'),
});

export function AddUserModal({ open, onOpenChange }: AddUserModalProps) {
  const [createUser, { isLoading }] = useCreateUserMutation();

  const formik = useFormik<UserRequest>({
    initialValues: {
      name: '',
      email: '',
      user_role: 'member',
      status: 'pending',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const result = await createUser(values).unwrap();
        
        // Track activity
        activityService.addActivityLog({
          type: 'create',
          entity: 'user',
          entityId: result.user_id.toString(),
          entityName: values.name,
          action: 'Created user',
          description: `New user "${values.name}" was created with role ${values.user_role}`,
          userId: '1', // TODO: Get from current user
          userName: 'Current User', // TODO: Get from current user
        });

        // Add notification
        activityService.addNotification({
          type: 'user_action',
          title: 'New User Created',
          message: `User "${values.name}" has been created and is ${values.status}`,
          isRead: false,
          priority: 'medium',
        });

        toast.success('User created successfully');
        onOpenChange(false);
        resetForm();
      } catch (error) {
        toast.error('Failed to create user');
        console.error('Error creating user:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Full system access with administrative privileges';
      case 'member':
        return 'Standard user access with basic permissions';
      case 'viewer':
        return 'Read-only access to system resources';
      default:
        return '';
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'border-red-200 bg-red-50 text-red-700';
      case 'member':
        return 'border-blue-200 bg-blue-50 text-blue-600';
      case 'viewer':
        return 'border-gray-200 bg-gray-50 text-gray-700';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account with appropriate role and permissions.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., John Doe"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.name && formik.errors.name ? 'border-red-500' : ''}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="e.g., john.doe@company.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.email && formik.errors.email ? 'border-red-500' : ''}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="user_role">Role *</Label>
            <Select
              value={formik.values.user_role}
              onValueChange={(value: 'admin' | 'member' | 'viewer') => 
                formik.setFieldValue('user_role', value)
              }
            >
              <SelectTrigger className={formik.touched.user_role && formik.errors.user_role ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getRoleBadgeClass('admin')}>
                      Admin
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="member">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getRoleBadgeClass('member')}>
                      Member
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="viewer">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getRoleBadgeClass('viewer')}>
                      Viewer
                    </Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.user_role && formik.errors.user_role && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.user_role}</p>
            )}
            {formik.values.user_role && (
              <p className="text-xs text-muted-foreground">
                {getRoleDescription(formik.values.user_role)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Initial Status</Label>
            <Select
              value={formik.values.status}
              onValueChange={(value: 'active' | 'inactive' | 'pending') => 
                formik.setFieldValue('status', value)
              }
            >
              <SelectTrigger className={formik.touched.status && formik.errors.status ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending (Send Invitation)</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.status && formik.errors.status && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.status}</p>
            )}
          </div>

          {formik.values.status === 'pending' && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Invitation will be sent:</strong>
                <br />
                • User will receive an email invitation
                <br />
                • Account will be activated upon acceptance
                <br />
                • Temporary password will be generated
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                formik.resetForm();
                onOpenChange(false);
              }}
              disabled={formik.isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || formik.isSubmitting || !formik.isValid}
            >
              {isLoading || formik.isSubmitting ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}