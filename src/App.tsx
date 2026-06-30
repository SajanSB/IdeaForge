import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { BrandGradientDefs } from '@/components/marketing/BrandGradientDefs'
import { AppShell } from '@/components/shell/AppShell'
import { AdminShell } from '@/components/shell/AdminShell'
import { ProjectShell, ProjectShellNew } from '@/components/shell/ProjectShell'
import { AdminGuard } from '@/components/layout/AdminGuard'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { LandingPage } from '@/pages/public/LandingPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupPage } from '@/pages/auth/SignupPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { IdeaSubmission } from '@/pages/idea/IdeaSubmission'
import { ElicitationQA } from '@/pages/idea/ElicitationQA'
import { IdeaReview } from '@/pages/idea/IdeaReview'
import { TokenEstimate } from '@/pages/idea/TokenEstimate'
import { GenerationProgress } from '@/pages/idea/GenerationProgress'
import { DocumentViewer } from '@/pages/idea/DocumentViewer'
import { ReviewGatePage } from '@/pages/idea/ReviewGatePage'
import { UserDashboard } from '@/pages/dashboard/UserDashboard'
import { UserSettings } from '@/pages/settings/UserSettings'
import { AdminAnalytics } from '@/pages/admin/AdminAnalytics'
import { AdminSkillManager } from '@/pages/admin/AdminSkillManager'
import { AdminPricingManager } from '@/pages/admin/AdminPricingManager'
import { AdminUsers } from '@/pages/admin/AdminUsers'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route element={<AuthGuard />}>
          <Route element={<ProjectShellNew />}>
            <Route path="/idea/new" element={<IdeaSubmission />} />
          </Route>
          <Route element={<ProjectShell />}>
            <Route path="/idea/:id/elicitation" element={<ElicitationQA />} />
            <Route path="/idea/:id/review" element={<IdeaReview />} />
            <Route path="/idea/:id/estimate" element={<TokenEstimate />} />
            <Route path="/idea/:id/generating" element={<GenerationProgress />} />
            <Route path="/idea/:id/review-docs" element={<ReviewGatePage />} />
            <Route path="/idea/:id/documents" element={<DocumentViewer />} />
          </Route>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/settings" element={<UserSettings />} />
          </Route>
        </Route>

        <Route element={<AdminGuard />}>
          <Route element={<AdminShell />}>
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/skills" element={<AdminSkillManager />} />
            <Route path="/admin/pricing" element={<AdminPricingManager />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Routes>
      <BrandGradientDefs />
      <Toaster />
    </Router>
  )
}

export default App
