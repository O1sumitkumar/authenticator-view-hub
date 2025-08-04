import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ApplicationRequest } from '@/types/admin';
import { useCreateApplicationMutation } from '@/redux/api/adminApi';
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
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { activityService } from '@/services/activityService';

interface AddApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const validationSchema = Yup.object({
  application_name: Yup.string()
    .required('Application name is required')
    .min(2, 'Application name must be at least 2 characters')
    .max(100, 'Application name must be less than 100 characters'),
  application_code: Yup.string()
    .required('Application code is required')
    .matches(/^[A-Z0-9-]+$/, 'Application code must contain only uppercase letters, numbers, and hyphens')
    .min(3, 'Application code must be at least 3 characters')
    .max(50, 'Application code must be less than 50 characters'),
  rights_code: Yup.string()
    .required('Rights code is required')
    .min(3, 'Rights code must be at least 3 characters')
    .max(100, 'Rights code must be less than 100 characters'),
  version: Yup.string()
    .required('Version is required')
    .matches(/^\d+\.\d+\.\d+$/, 'Version must be in format x.y.z (e.g., 1.0.0)'),
  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'maintenance', 'deprecated'], 'Invalid status'),
});

export function AddApplicationModal({ open, onOpenChange }: AddApplicationModalProps) {
  const [createApplication, { isLoading }] = useCreateApplicationMutation();
  const { copyToClipboard } = useCopyToClipboard();

  const formik = useFormik<ApplicationRequest>({
    initialValues: {
      application_name: '',
      application_code: '',
      rights_code: '',
      status: 'active',
      version: '1.0.0',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const result = await createApplication(values).unwrap();
        
        // Track activity
        activityService.addActivityLog({
          type: 'create',
          entity: 'application',
          entityId: result.id || 'new-app',
          entityName: values.application_name,
          action: 'Created application',
          description: `New application "${values.application_name}" was created with code ${values.application_code}`,
          userId: '1', // TODO: Get from current user
          userName: 'Current User', // TODO: Get from current user
        });

        // Add notification for other admins
        activityService.addNotification({
          type: 'user_action',
          title: 'New Application Created',
          message: `Application "${values.application_name}" has been created and is now available`,
          isRead: false,
          priority: 'medium',
        });

        toast.success('Application created successfully');
        onOpenChange(false);
        resetForm();
      } catch (error) {
        toast.error('Failed to create application');
        console.error('Error creating application:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const generateApplicationCode = () => {
    const name = formik.values.application_name.toUpperCase().replace(/\s+/g, '-');
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    const generatedCode = `APP-${name}-${randomSuffix}`;
    formik.setFieldValue('application_code', generatedCode);
    
    // Also generate rights code
    const rightsCode = `${generatedCode.toLowerCase()}-rights`;
    formik.setFieldValue('rights_code', rightsCode);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
          <DialogDescription>
            Register a new application that can request permissions from this admin system.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="application_name">Application Name *</Label>
            <Input
              id="application_name"
              name="application_name"
              placeholder="e.g., Customer Portal"
              value={formik.values.application_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.application_name && formik.errors.application_name ? 'border-red-500' : ''}
            />
            {formik.touched.application_name && formik.errors.application_name && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.application_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="application_code">Application Code *</Label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  id="application_code"
                  name="application_code"
                  placeholder="e.g., APP-X, APP-CUSTOMER-PORTAL"
                  value={formik.values.application_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.application_code && formik.errors.application_code ? 'border-red-500' : ''}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={generateApplicationCode}
                disabled={!formik.values.application_name}
              >
                Generate
              </Button>
              {formik.values.application_code && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(formik.values.application_code, 'Application code copied!')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            {formik.touched.application_code && formik.errors.application_code && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.application_code}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Unique identifier used by the application to request permissions
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rights_code">Rights Code *</Label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  id="rights_code"
                  name="rights_code"
                  placeholder="e.g., customer-portal-rights"
                  value={formik.values.rights_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.rights_code && formik.errors.rights_code ? 'border-red-500' : ''}
                />
              </div>
              {formik.values.rights_code && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(formik.values.rights_code, 'Rights code copied!')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            {formik.touched.rights_code && formik.errors.rights_code && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.rights_code}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Internal rights identifier for this application
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="version">Version *</Label>
            <Input
              id="version"
              name="version"
              placeholder="e.g., 1.0.0"
              value={formik.values.version}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.version && formik.errors.version ? 'border-red-500' : ''}
            />
            {formik.touched.version && formik.errors.version && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.version}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formik.values.status}
              onValueChange={(value: 'active' | 'maintenance' | 'deprecated') => 
                formik.setFieldValue('status', value)
              }
            >
              <SelectTrigger className={formik.touched.status && formik.errors.status ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="deprecated">Deprecated</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.status && formik.errors.status && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.status}</p>
            )}
          </div>

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
              {isLoading || formik.isSubmitting ? 'Creating...' : 'Create Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}