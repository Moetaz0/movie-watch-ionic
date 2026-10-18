import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
export const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
  path: 'profile',
  canActivate: [authGuard],
  loadComponent: () => import('./pages/profile/profile.page').then((m) => m.ProfilePage),
},
{
  path: 'about',
  loadComponent: () => import('./pages/about/about.page').then((m) => m.AboutPage),
},
{
  path: 'license',
  loadComponent: () => import('./pages/license/license.page').then((m) => m.LicensePage),
},
{
  path: 'privacy',
  loadComponent: () => import('./pages/privacy/privacy.page').then((m) => m.PrivacyPage),
},
{
  path: 'favorites',
  canActivate: [authGuard],
  loadComponent: () => import('./pages/favorites/favorites.page').then((m) => m.FavoritesPage),
},
{
  path: 'match',
  canActivate: [authGuard],
  loadComponent: () => import('./pages/match/match.page').then((m) => m.MatchPage),
},
{
  path: 'forgot-password',
  loadComponent: () =>
    import('./pages/forgot-password/forgot-password.page').then((m) => m.ForgotPasswordPage),
},
{
  path: 'edit-profile',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./pages/edit-profile/edit-profile.page').then((m) => m.EditProfilePage),
},
{
  path: 'movie/:id',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./pages/movie-detail/movie-detail.page').then((m) => m.MovieDetailPage),
},
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
