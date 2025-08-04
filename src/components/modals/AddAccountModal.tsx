import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AccountRequest } from '@/types/admin';
import { useCreateAccountMutation } from '@/redux/api/adminApi';
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
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { activityService } from '@/services/activityService';

interface AddAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const validationSchema = Yup.object({
  account_name: Yup.string()
    .required('Account name is required')
    .min(2, 'Account name must be at least 2 characters')
    .max(100, 'Account name must be less than 100 characters'),
  account_type: Yup.string()
    .required('Account type is required')
    .oneOf(['Personal', 'Business', 'Temporary'], 'Invalid account type'),
  right_code: Yup.string()
    .required('Rights code is required')
    .min(3, 'Rights code must be at least 3 characters')
    .max(100, 'Rights code must be less than 100 characters')
    .matches(/^[a-z0-9-]+$/, 'Rights code must contain only lowercase letters, numbers, and hyphens'),
  owner_id: Yup.number()
    .required('Owner ID is required')
    .positive('Owner ID must be positive'),
  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive', 'suspended'], 'Invalid status'),
});

export function AddAccountModal({ open, onOpenChange }: AddAccountModalProps) {
  const [createAccount, { isLoading }] = useCreateAccountMutation();
  const { copyToClipboard } = useCopyToClipboard();

  const formik = useFormik<AccountRequest>({
    initialValues: {
      account_name: '',
      account_type: 'Personal',
      right_code: '',
      owner_id: 1, // Default owner ID - should be current user
      status: 'active',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const result = await createAccount(values).unwrap();
        
        // Track activity
        activityService.addActivityLog({
          type: 'create',
          entity: 'account',
          entityId: result.id || 'new-account',
          entityName: values.account_name,
          action: 'Created account',
          description: `New ${values.account_type.toLowerCase()} account created for ${values.account_name}`,
          userId: '1', // TODO: Get from current user
          userName: 'Current User', // TODO: Get from current user
        });

        // Add notification
        activityService.addNotification({
          type: 'user_action',
          title: 'New Account Created',
          message: `${values.account_type} account "${values.account_name}" has been created`,
          isRead: false,
          priority: 'medium',
        });

        toast.success('Account created successfully');
        onOpenChange(false);
        resetForm();
      } catch (error) {
        toast.error('Failed to create account');
        console.error('Error creating account:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const generateRightCode = () => {
    const name = formik.values.account_name.toLowerCase().replace(/\s+/g, '-');
    const type = formik.values.account_type.toLowerCase();
    const generatedCode = `${type}-${name}-rights`;
    formik.setFieldValue('right_code', generatedCode);
  };

  const getAccountTypeDescription = (type: string) => {
    switch (type) {
      case 'Personal':
        return 'Individual user account with basic permissions';
      case 'Business':
        return 'Business account that can share rights with Personal accounts';
      case 'Temporary':
        return 'Temporary account with limited access duration';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Account</DialogTitle>
          <DialogDescription>
            Create a new account that can be assigned rights across applications.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="account_name">Account Name *</Label>
            <Input
              id="account_name"
              name="account_name"
              placeholder="e.g., John Doe, Business Account"
              value={formik.values.account_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.account_name && formik.errors.account_name ? 'border-red-500' : ''}
            />
            {formik.touched.account_name && formik.errors.account_name && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.account_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="right_code">Rights Code *</Label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  id="right_code"
                  name="right_code"
                  placeholder="e.g., personal-john-doe-rights"
                  value={formik.values.right_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.right_code && formik.errors.right_code ? 'border-red-500' : ''}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={generateRightCode}
                disabled={!formik.values.account_name}
              >
                Generate
              </Button>
            </div>
            {formik.touched.right_code && formik.errors.right_code && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.right_code}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Unique rights identifier for this account
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account_type">Account Type *</Label>
            <Select
              value={formik.values.account_type}
              onValueChange={(value: 'Temporary' | 'Personal' | 'Business') => 
                formik.setFieldValue('account_type', value)
              }
            >
              <SelectTrigger className={formik.touched.account_type && formik.errors.account_type ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Personal">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                      Personal
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="Business">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                      Business
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="Temporary">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">
                      Temporary
                    </Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.account_type && formik.errors.account_type && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.account_type}</p>
            )}
            {formik.values.account_type && (
              <p className="text-xs text-muted-foreground">
                {getAccountTypeDescription(formik.values.account_type)}
              </p>
            )}
          </div>

          {formik.values.account_type === 'Business' && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Business Account Benefits:</strong>
                <br />
                • Can share rights with Personal accounts
                • Enhanced permission management
                • Suitable for organizational use
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
              disabled={isLoading || formik.isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || formik.isSubmitting || !formik.isValid}
            >
              {isLoading || formik.isSubmitting ? 'Creating...' : 'Create Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}