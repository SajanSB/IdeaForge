import { Routes, Route } from 'react-router-dom'
import { PublicFunnelLayout } from '@/layouts/PublicFunnelLayout'
import { UserPortalLayout } from '@/layouts/UserPortalLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { LandingPage } from '@/pages/public/LandingPage'
import { IdeaSubmissionPage } from '@/pages/public/IdeaSubmissionPage'
import { ElicitationPage } from '@/pages/public/ElicitationPage'
import { IdeaReviewPage } from '@/pages/public/IdeaReviewPage'
import { TokenEstimatePage } from '@/pages/public/TokenEstimatePage'

// Auth Pages
import { SignUpPage } from '@/pages/auth/SignUpPage'
import { SignInPage } from '@/pages/auth/SignInPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { VerifyEmailPage } from '@/pages/auth/VerifyEmailPage'
import { OAuthCallbackPage } from '@/pages/auth/OAuthCallbackPage'
import { PaymentPage } from '@/pages/user/PaymentPage'
import { GenerationProgressPage } from '@/pages/user/GenerationProgressPage'
import { DocumentViewerPage } from '@/pages/user/DocumentViewerPage'
import { DashboardPage } from '@/pages/user/DashboardPage'
import { ProjectDetailPage } from '@/pages/user/ProjectDetailPage'
import { ProfileSettingsPage } from '@/pages/user/settings/ProfileSettingsPage'
import { PaymentHistoryPage } from '@/pages/user/settings/PaymentHistoryPage'
import { NotificationsPage } from '@/pages/user/settings/NotificationsPage'

// Admin Pages
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage'
import { AdminSkillManagerPage } from '@/pages/admin/AdminSkillManagerPage'
import { AdminPricingPage } from '@/pages/admin/AdminPricingPage'
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage'
import { AdminDisputePage } from '@/pages/admin/AdminDisputePage'

export function AppRoutes() {
  return (
    <Routes>
      {/* Standalone Landing Page (renders its own sticky TopBar) */}
      <Route path="/" element={<LandingPage />} />

      {/* Public funnel */}
      <Route element={<PublicFunnelLayout />}>
        <Route path="/idea/new" element={<IdeaSubmissionPage />} />
        <Route path="/idea/:projectId/elicitation" element={<ElicitationPage />} />
        <Route path="/idea/:projectId/review" element={<IdeaReviewPage />} />
        <Route path="/idea/:projectId/estimate" element={<TokenEstimatePage />} />
        
        {/* Auth routes */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/callback" element={<OAuthCallbackPage />} />
      </Route>

      {/* User portal */}
      <Route element={<UserPortalLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/project/:projectId" element={<ProjectDetailPage />} />
        <Route path="/settings/profile" element={<ProfileSettingsPage />} />
        <Route path="/settings/payments" element={<PaymentHistoryPage />} />
        <Route path="/settings/notifications" element={<NotificationsPage />} />
        <Route path="/idea/:projectId/payment" element={<PaymentPage />} />
        <Route path="/idea/:projectId/generating" element={<GenerationProgressPage />} />
      </Route>

      {/* Admin Standalone Login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Console */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="skills" element={<AdminSkillManagerPage />} />
        <Route path="pricing" element={<AdminPricingPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="users/:userId/dispute" element={<AdminDisputePage />} />
      </Route>

      {/* Standalone Document Viewer */}
      <Route path="/idea/:projectId/documents" element={<DocumentViewerPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
