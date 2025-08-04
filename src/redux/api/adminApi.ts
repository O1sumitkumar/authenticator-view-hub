import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  Application, 
  Account, 
  User, 
  Rights, 
  Invitation,
  ApplicationRequest,
  AccountRequest,
  UserRequest,
  RightsRequest,
  InvitationRequest
} from '@/types/admin';
import { 
  ApplicationStorage, 
  AccountStorage, 
  UserStorage, 
  RightsStorage, 
  InvitationStorage,
  initializeSampleData
} from '@/services/localStorageApi';
import { JWTService } from '@/services/jwtService';

// Initialize sample data on first load
initializeSampleData();

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Application', 'Account', 'User', 'Rights', 'Invitation'],
  endpoints: (builder) => ({
    // Applications
    getApplications: builder.query<Application[], void>({
      queryFn: () => {
        try {
          const applications = ApplicationStorage.getAll();
          return { data: applications };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: ['Application'],
    }),

    createApplication: builder.mutation<Application, ApplicationRequest>({
      queryFn: (applicationData) => {
        try {
          const newApplication = ApplicationStorage.create(applicationData);
          return { data: newApplication };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Application'],
      // Optimistic update
      async onQueryStarted(applicationData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          adminApi.util.updateQueryData('getApplications', undefined, (draft) => {
            const optimisticApplication: Application = {
              ...applicationData,
              application_id: Date.now(), // Temporary ID
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            draft.push(optimisticApplication);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    updateApplication: builder.mutation<Application, { id: number; updates: Partial<Application> }>({
      queryFn: ({ id, updates }) => {
        try {
          const updatedApplication = ApplicationStorage.update(id, updates);
          if (!updatedApplication) {
            return { error: { status: 'NOT_FOUND', error: 'Application not found' } };
          }
          return { data: updatedApplication };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Application'],
      // Optimistic update
      async onQueryStarted({ id, updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          adminApi.util.updateQueryData('getApplications', undefined, (draft) => {
            const application = draft.find(app => app.application_id === id);
            if (application) {
              Object.assign(application, updates, { updated_at: new Date().toISOString() });
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    deleteApplication: builder.mutation<boolean, number>({
      queryFn: (id) => {
        try {
          const success = ApplicationStorage.delete(id);
          return { data: success };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Application'],
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          adminApi.util.updateQueryData('getApplications', undefined, (draft) => {
            const index = draft.findIndex(app => app.application_id === id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Accounts
    getAccounts: builder.query<Account[], void>({
      queryFn: () => {
        try {
          const accounts = AccountStorage.getAll();
          return { data: accounts };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: ['Account'],
    }),

    createAccount: builder.mutation<Account, AccountRequest>({
      queryFn: (accountData) => {
        try {
          const newAccount = AccountStorage.create(accountData);
          return { data: newAccount };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Account'],
      // Optimistic update
      async onQueryStarted(accountData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          adminApi.util.updateQueryData('getAccounts', undefined, (draft) => {
            const optimisticAccount: Account = {
              ...accountData,
              account_id: Date.now(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            draft.push(optimisticAccount);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    updateAccount: builder.mutation<Account, { id: number; updates: Partial<Account> }>({
      queryFn: ({ id, updates }) => {
        try {
          const updatedAccount = AccountStorage.update(id, updates);
          if (!updatedAccount) {
            return { error: { status: 'NOT_FOUND', error: 'Account not found' } };
          }
          return { data: updatedAccount };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Account'],
      // Optimistic update
      async onQueryStarted({ id, updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          adminApi.util.updateQueryData('getAccounts', undefined, (draft) => {
            const account = draft.find(acc => acc.account_id === id);
            if (account) {
              Object.assign(account, updates, { updated_at: new Date().toISOString() });
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    deleteAccount: builder.mutation<boolean, number>({
      queryFn: (id) => {
        try {
          const success = AccountStorage.delete(id);
          return { data: success };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Account'],
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          adminApi.util.updateQueryData('getAccounts', undefined, (draft) => {
            const index = draft.findIndex(acc => acc.account_id === id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Users
    getUsers: builder.query<User[], void>({
      queryFn: () => {
        try {
          const users = UserStorage.getAll();
          return { data: users };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: ['User'],
    }),

    createUser: builder.mutation<User, UserRequest>({
      queryFn: (userData) => {
        try {
          const newUser = UserStorage.create(userData);
          return { data: newUser };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['User'],
      // Optimistic update
      async onQueryStarted(userData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          adminApi.util.updateQueryData('getUsers', undefined, (draft) => {
            const optimisticUser: User = {
              ...userData,
              user_id: Date.now(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            draft.push(optimisticUser);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Rights
    getRights: builder.query<Rights[], void>({
      queryFn: () => {
        try {
          const rights = RightsStorage.getAll();
          return { data: rights };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: ['Rights'],
    }),

    createRights: builder.mutation<Rights, RightsRequest>({
      queryFn: (rightsData) => {
        try {
          // Generate JWT token
          const jwtToken = JWTService.generateRightsCode({
            accountId: rightsData.account_id.toString(),
            applicationId: rightsData.application_id.toString(),
            permissions: rightsData.permissions,
            accountType: 'Personal', // This should be fetched from account data
            expiresAt: new Date(rightsData.expires_at),
            rightsId: Date.now().toString(),
          });

          const newRights = RightsStorage.create({
            ...rightsData,
            rights_code_jwt: jwtToken,
            is_active: true,
          });
          return { data: newRights };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Rights'],
      // Optimistic update
      async onQueryStarted(rightsData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          adminApi.util.updateQueryData('getRights', undefined, (draft) => {
            const optimisticRights: Rights = {
              ...rightsData,
              rights_id: Date.now(),
              rights_code_jwt: 'generating...',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            draft.push(optimisticRights);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    revokeRights: builder.mutation<Rights, { id: number; revokedBy: number }>({
      queryFn: ({ id, revokedBy }) => {
        try {
          const revokedRights = RightsStorage.revoke(id, revokedBy);
          if (!revokedRights) {
            return { error: { status: 'NOT_FOUND', error: 'Rights not found' } };
          }
          return { data: revokedRights };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Rights'],
      // Optimistic update
      async onQueryStarted({ id, revokedBy }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          adminApi.util.updateQueryData('getRights', undefined, (draft) => {
            const rights = draft.find(right => right.rights_id === id);
            if (rights) {
              rights.is_active = false;
              rights.revoked_by = revokedBy;
              rights.revoked_at = new Date().toISOString();
              rights.updated_at = new Date().toISOString();
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Invitations
    getInvitations: builder.query<Invitation[], void>({
      queryFn: () => {
        try {
          const invitations = InvitationStorage.getAll();
          return { data: invitations };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: ['Invitation'],
    }),

    createInvitation: builder.mutation<Invitation, InvitationRequest>({
      queryFn: (invitationData) => {
        try {
          const newInvitation = InvitationStorage.create({
            ...invitationData,
            status: 'pending',
          });
          return { data: newInvitation };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Invitation'],
      // Optimistic update
      async onQueryStarted(invitationData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          adminApi.util.updateQueryData('getInvitations', undefined, (draft) => {
            const optimisticInvitation: Invitation = {
              ...invitationData,
              invitation_id: Date.now(),
              token: 'generating...',
              status: 'pending',
              created_at: new Date().toISOString(),
            };
            draft.push(optimisticInvitation);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetApplicationsQuery,
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
  useGetAccountsQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useGetRightsQuery,
  useCreateRightsMutation,
  useRevokeRightsMutation,
  useGetInvitationsQuery,
  useCreateInvitationMutation,
} = adminApi;