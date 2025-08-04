import { useFormik } from 'formik';
import * as Yup from 'yup';
import { RightsRequest, Permission } from '@/types/admin';
import { 
  useCreateRightsMutation,
  useGetApplicationsQuery,
  useGetAccountsQuery 
} from '@/redux/api/adminApi';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { activityService } from '@/services/activityService';

interface AddRightsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PERMISSION_LEVELS = ['read', 'write', 'admin', 'owner'] as const;

const validationSchema = Yup.object({
  application_id: Yup.number()
    .required('Application is required')
    .positive('Please select a valid application'),
  account_id: Yup.number()
    .required('Account is required')
    .positive('Please select a valid account'),
  permissions: Yup.array()
    .of(
      Yup.object({
        level: Yup.string().required(),
        scope: Yup.string().required(),
        features: Yup.array().of(Yup.string()),
      })
    )
    .min(1, 'At least one permission level is required'),
  expires_at: Yup.date()
    .required('Expiration date is required')
    .min(new Date(), 'Expiration date must be in the future'),
  scope: Yup.string()
    .max(100, 'Scope must be less than 100 characters'),
  features: Yup.array().of(Yup.string()),
  user_id: Yup.number().required().positive(),
  granted_by: Yup.number().required().positive(),
});

export function AddRightsModal({ open, onOpenChange }: AddRightsModalProps) {
  const [createRights, { isLoading }] = useCreateRightsMutation();
  const { data: applications = [] } = useGetApplicationsQuery();
  const { data: accounts = [] } = useGetAccountsQuery();

  const formik = useFormik({
    initialValues: {
      application_id: 0,
      account_id: 0,
      user_id: 1, // TODO: Get from current user
      permissions: [] as Permission[],
      expires_at: null as Date | null,
      scope: '',
      features: [] as string[],
      newFeature: '',
      granted_by: 1, // TODO: Get from current user
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const rightsRequest: RightsRequest = {
          application_id: values.application_id,
          account_id: values.account_id,
          user_id: values.user_id,
          permissions: values.permissions,
          expires_at: values.expires_at!.toISOString(),
          granted_by: values.granted_by,
        };

        const result = await createRights(rightsRequest).unwrap();
        
        // Get application and account names for better activity description
        const selectedApplication = applications.find(app => app.application_id === values.application_id);
        const selectedAccount = accounts.find(acc => acc.account_id === values.account_id);
        
        // Track activity
        activityService.addActivityLog({
          type: 'create',
          entity: 'rights',
          entityId: result.rights_id.toString(),
          entityName: `Rights for ${selectedAccount?.account_name || 'Account'} - ${selectedApplication?.application_name || 'Application'}`,
          action: 'Granted rights',
          description: `Rights granted to ${selectedAccount?.account_name || 'Account'} for ${selectedApplication?.application_name || 'Application'} with permissions: ${values.permissions.map(p => p.level).join(', ')}`,
          userId: '1', // TODO: Get from current user
          userName: 'Current User', // TODO: Get from current user
        });

        // Add notification
        activityService.addNotification({
          type: 'permission_request',
          title: 'Rights Granted',
          message: `New rights have been granted to ${selectedAccount?.account_name || 'Account'} for ${selectedApplication?.application_name || 'Application'}`,
          isRead: false,
          priority: 'high',
        });

        toast.success('Rights created successfully');
        onOpenChange(false);
        resetForm();
      } catch (error) {
        toast.error('Failed to create rights');
        console.error('Error creating rights:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handlePermissionChange = (level: string, checked: boolean) => {
    const currentPermissions = formik.values.permissions;
    if (checked) {
      const newPermission: Permission = {
        level: level as any,
        scope: formik.values.scope || 'default',
        features: formik.values.features,
      };
      const updatedPermissions = [...currentPermissions.filter(p => p.level !== level), newPermission];
      formik.setFieldValue('permissions', updatedPermissions);
    } else {
      const updatedPermissions = currentPermissions.filter(p => p.level !== level);
      formik.setFieldValue('permissions', updatedPermissions);
    }
  };

  const addFeature = () => {
    if (formik.values.newFeature && !formik.values.features.includes(formik.values.newFeature)) {
      const updatedFeatures = [...formik.values.features, formik.values.newFeature];
      formik.setFieldValue('features', updatedFeatures);
      formik.setFieldValue('newFeature', '');
      
      // Update permissions with new features
      const updatedPermissions = formik.values.permissions.map(permission => ({
        ...permission,
        features: updatedFeatures,
      }));
      formik.setFieldValue('permissions', updatedPermissions);
    }
  };

  const removeFeature = (feature: string) => {
    const updatedFeatures = formik.values.features.filter(f => f !== feature);
    formik.setFieldValue('features', updatedFeatures);
    
    // Update permissions with new features
    const updatedPermissions = formik.values.permissions.map(permission => ({
      ...permission,
      features: updatedFeatures,
    }));
    formik.setFieldValue('permissions', updatedPermissions);
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Rights</DialogTitle>
          <DialogDescription>
            Create JWT-based rights codes for user access across applications.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="application_id">Application *</Label>
              <Select
                value={formik.values.application_id.toString()}
                onValueChange={(value) => formik.setFieldValue('application_id', parseInt(value))}
              >
                <SelectTrigger className={formik.touched.application_id && formik.errors.application_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select application" />
                </SelectTrigger>
                <SelectContent>
                  {applications.map((app) => (
                    <SelectItem key={app.application_id} value={app.application_id.toString()}>
                      {app.application_name} ({app.application_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.application_id && formik.errors.application_id && (
                <p className="text-sm text-red-500 mt-1">{formik.errors.application_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_id">Account *</Label>
              <Select
                value={formik.values.account_id.toString()}
                onValueChange={(value) => formik.setFieldValue('account_id', parseInt(value))}
              >
                <SelectTrigger className={formik.touched.account_id && formik.errors.account_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.account_id} value={account.account_id.toString()}>
                      {account.account_name} ({account.right_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.account_id && formik.errors.account_id && (
                <p className="text-sm text-red-500 mt-1">{formik.errors.account_id}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Permission Levels *</Label>
            <div className="grid grid-cols-2 gap-2">
              {PERMISSION_LEVELS.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={level}
                    checked={formik.values.permissions.some(p => p.level === level)}
                    onCheckedChange={(checked) => handlePermissionChange(level, checked as boolean)}
                  />
                  <Label htmlFor={level} className="capitalize">
                    {level}
                  </Label>
                </div>
              ))}
            </div>
            {formik.touched.permissions && formik.errors.permissions && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.permissions}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="scope">Scope</Label>
            <Input
              id="scope"
              name="scope"
              placeholder="e.g., default, admin, user"
              value={formik.values.scope}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.scope && formik.errors.scope ? 'border-red-500' : ''}
            />
            {formik.touched.scope && formik.errors.scope && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.scope}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add feature..."
                value={formik.values.newFeature}
                onChange={(e) => formik.setFieldValue('newFeature', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" variant="outline" onClick={addFeature}>
                Add
              </Button>
            </div>
            {formik.values.features.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formik.values.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeFeature(feature)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Expiration Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    formik.touched.expires_at && formik.errors.expires_at ? 'border-red-500' : ''
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formik.values.expires_at ? format(formik.values.expires_at, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formik.values.expires_at}
                  onSelect={(date) => formik.setFieldValue('expires_at', date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {formik.touched.expires_at && formik.errors.expires_at && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.expires_at}</p>
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
              {isLoading || formik.isSubmitting ? 'Creating...' : 'Create Rights'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}